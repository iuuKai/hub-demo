import { chatCompletion } from '../llmClient'
import type { LlmMessage, ToolCall } from '../types'
import { execTool } from './tools'

const AGENT_PROMPT = `你是试卷生成Agent。根据用户提供的文档材料生成选择题、判断题。

你拥有工具：validate_questions
参数：{ questions: Array }
作用：校验题目是否脱离原文

工具调用格式（严格）：
\`\`\`tool
{"name":"validate_questions","params":{"questions":[...]}}
\`\`\`

流程：生成题目 → 调用validate_questions校验 → 校验通过后输出最终JSON试卷+<task_finish>标记

⚠️ 校验通过后绝对不要再调用工具！直接输出JSON+<task_finish>
`

const DIRECT_PROMPT = `你是试卷生成器。根据用户提供的文档材料生成选择题+判断题试卷。

输出要求：
1. 只输出JSON，不要任何解释
2. 格式：
{
  "questions": [
    { "type": "choice", "stem": "题干", "options": ["A","B","C","D"], "answer": "A", "analysis": "解析" },
    { "type": "judge", "stem": "题干", "answer": "对", "analysis": "解析" }
  ]
}
3. 全部中文，基于文档内容生成5道题`

async function tryAgentMode(documentText: string): Promise<unknown | null> {
	const messages: LlmMessage[] = [
		{ role: 'system', content: AGENT_PROMPT },
		{ role: 'user', content: `原始文档:\n${documentText}\n请生成5道题的试卷` }
	]

	let maxLoop = 6
	let lastToolName = ''
	let sameToolCount = 0

	while (maxLoop-- > 0) {
		const { content, toolCall } = await chatCompletion(messages)

		if (toolCall) {
			if (toolCall.name === lastToolName) {
				sameToolCount++
				if (sameToolCount >= 2) {
					messages.push({
						role: 'user',
						content: '不要再调用工具！直接输出最终JSON试卷，结尾加<task_finish>。'
					})
					lastToolName = ''
					sameToolCount = 0
					continue
				}
			} else {
				lastToolName = toolCall.name
				sameToolCount = 1
			}

			const toolResult = await execTool(toolCall, documentText)

			if ('error' in toolResult) {
				messages.push({ role: 'user', content: `【工具错误】${toolResult.error}` })
			} else if (toolResult.ok) {
				messages.push({
					role: 'user',
					content: `【校验通过】${toolResult.msg}\n\n不要再调用工具！直接输出最终JSON试卷+<task_finish>。`
				})
			} else {
				messages.push({
					role: 'user',
					content: `【校验错误】${toolResult.errors.join('；')}\n请修正后再次调用validate_questions。`
				})
			}
			continue
		} else if (content) {
			if (content.includes('<task_finish>')) {
				return content.replace('<task_finish>', '').trim()
			}
			messages.push({ role: 'assistant', content })
		}
	}
	return null
}

async function tryDirectMode(documentText: string): Promise<unknown> {
	const messages: LlmMessage[] = [
		{ role: 'system', content: DIRECT_PROMPT },
		{ role: 'user', content: `文档：\n${documentText}\n\n请生成5道题。` }
	]

	const { content } = await chatCompletion(messages)
	if (!content) throw new Error('模型未返回内容')

	const jsonMatch = content.match(/\{[\s\S]*\}/)
	if (!jsonMatch) throw new Error('模型返回格式错误，未找到JSON')

	try {
		return JSON.parse(jsonMatch[0])
	} catch {
		return { rawContent: content, parseError: true }
	}
}

export async function runExamAgent(documentText: string) {
	// 先尝试 Agent 模式
	try {
		const result = await tryAgentMode(documentText)
		if (result !== null) return result
	} catch (e) {
		console.warn('[agent] Agent模式失败，降级为单次生成:', e)
	}

	// Agent 失败或超时 → 降级为单次生成
	return tryDirectMode(documentText)
}

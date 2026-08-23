import { chatCompletion } from '../llmClient'
import type { LlmMessage, ToolCall } from '../types'
import { execTool } from './tools'
import { parseMarkdownQuestions, type Question } from './parseMarkdownQuestions'

type ParsedQuestions = Question[]

function pickParsedQuestions(markdown: string): {
	questions: ParsedQuestions
	warnings: string[]
	rawMarkdown: string
} {
	const parsed = parseMarkdownQuestions(markdown)
	return {
		questions: parsed.questions,
		warnings: parsed.parseWarnings,
		rawMarkdown: parsed.rawMarkdown
	}
}

const AGENT_PROMPT = `你是试卷生成Agent。根据用户提供的文档材料生成选择题、判断题。

你拥有工具：validate_questions
参数：{ questions: Array }
作用：校验题目是否脱离原文

工具调用格式（严格）：
\`\`\`tool
{"name":"validate_questions","params":{"questions":[...]}}
\`\`\`

流程（严格）：
1. 先用 Markdown 格式生成题目草稿（见下方格式要求）
2. 把草稿里的题目转换成 questions 数组，调用 validate_questions 校验
3. 如果校验失败，根据错误信息修改题目草稿，再调用一次 validate_questions
4. 如果校验通过（或连续 2 次调用工具），不要再调用任何工具！
   输出最终 Markdown 试卷，并在结尾加一行：<task_finish>

⚠️ 最终输出只包含 Markdown 格式的试卷，不要再写任何解释说明。
⚠️ 校验通过后立即输出最终 Markdown + <task_finish>，绝对不要再调用工具。

Markdown 格式（严格遵守）：
## 第1题（选择题）
题干：以下哪个是 Vue 的响应式 API？
选项：A. ref	B. React	C. render	D. component
答案：A
解析：ref 是 Vue 3 中用于创建响应式引用的 API。

## 第2题（判断题）
题干：Vue 3 中 Composition API 比 Options API 更好。
答案：对
解析：Composition API 提供更好的逻辑复用能力，但“更好”取决于具体场景。
`

const DIRECT_PROMPT = `你是试卷生成器。根据用户提供的文档材料生成选择题 + 判断题试卷。

输出要求（严格遵守）：
1. 只输出 Markdown 格式的试卷，不要任何解释文字
2. 结尾必须加一行：<task_finish>
3. 全部中文，基于文档内容生成 5-10 道题（选择题和判断题混合）
4. 题干/选项/答案/解析都写得完整清晰

Markdown 格式（严格遵守）：
## 第1题（选择题）
题干：以下哪个是 Vue 的响应式 API？
选项：A. ref	B. React	C. render	D. component
答案：A
解析：ref 是 Vue 3 中用于创建响应式引用的 API。

## 第2题（判断题）
题干：Vue 3 中 Composition API 比 Options API 更好。
答案：对
解析：Composition API 提供更好的逻辑复用能力，但“更好”取决于具体场景。
`

async function tryAgentMode(documentText: string): Promise<unknown | null> {
	const messages: LlmMessage[] = [
		{ role: 'system', content: AGENT_PROMPT },
		{ role: 'user', content: `原始文档:\n${documentText}\n请生成5道题的试卷。` }
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
						content:
							'你已经连续 2 次调用了同一个工具。不要再调用工具！请直接输出最终的 Markdown 试卷，并在结尾加 <task_finish> 标记。'
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
				messages.push({
					role: 'user',
					content: `【工具错误】${toolResult.error}\n请直接输出最终 Markdown 试卷，结尾加 <task_finish>。`
				})
			} else if (toolResult.ok) {
				messages.push({
					role: 'user',
					content: `【校验通过】${toolResult.msg}\n\n⚠️ 不要再调用任何工具！直接输出最终 Markdown 试卷，最后加上 <task_finish> 标记。`
				})
			} else {
				messages.push({
					role: 'user',
					content: `【校验结果】存在错误：${toolResult.errors.join('；')}\n\n请修改题目后再次调用 validate_questions 校验，或者直接输出修正后的最终 Markdown 试卷 + <task_finish>。`
				})
			}
			continue
		} else if (content) {
			if (content.includes('<task_finish>')) {
				return pickParsedQuestions(content)
			}
			messages.push({ role: 'assistant', content })
		}
	}
	return null
}

async function tryDirectMode(documentText: string): Promise<unknown> {
	const messages: LlmMessage[] = [
		{ role: 'system', content: DIRECT_PROMPT },
		{ role: 'user', content: `文档：\n${documentText}\n\n请生成 5-10 道题。` }
	]

	const { content } = await chatCompletion(messages)
	if (!content) throw new Error('模型未返回内容')
	return pickParsedQuestions(content)
}

export async function runExamAgent(documentText: string) {
	try {
		const result = await tryAgentMode(documentText)
		if (result !== null) return result
	} catch (e) {
		console.warn('[agent] Agent 模式失败，降级为单次 Markdown 生成：', e)
	}
	return tryDirectMode(documentText)
}

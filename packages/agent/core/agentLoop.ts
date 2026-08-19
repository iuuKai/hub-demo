import { chatCompletion } from '../llmClient'
import type { LlmMessage, ToolCall } from '../types'
import { AGENT_SYSTEM_PROMPT } from './prompt'
import { execTool } from './tools'

export async function runExamAgent(documentText: string) {
	const messages: LlmMessage[] = [
		{ role: 'system', content: AGENT_SYSTEM_PROMPT },
		{ role: 'user', content: `原始文档:\n${documentText}\n请生成试卷` }
	]

	let maxLoop = 8 // 防止死循环，最多迭代8次
	while (maxLoop-- > 0) {
		const { content, toolCall } = await chatCompletion(messages)

		if (toolCall) {
			// 执行工具
			const toolResult = await execTool(toolCall, documentText)
			// 将工具返回压入上下文
			messages.push({
				role: 'user',
				content: `【工具返回结果】\n${JSON.stringify(toolResult, null, 2)}\n请基于工具校验结果继续输出最终JSON`
			})
			continue
		} else if (content) {
			// 任务结束标记
			if (content.includes('<task_finish>')) {
				return content.replace('<task_finish>', '').trim()
			}
			messages.push({ role: 'assistant', content })
		}
	}
	throw new Error('Agent达到最大循环次数，任务未完成')
}

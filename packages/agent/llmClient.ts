import type { LlmMessage, ToolCall } from './types'

// 只读取环境变量，不在本文件加载 .env 文件
const API_KEY = process.env.SILICONFLOW_API_KEY
const BASE_URL = process.env.SILICONFLOW_BASE_URL
const MODEL = process.env.MODEL_NAME

/** 请求LLM，返回内容或者工具调用 */
export async function chatCompletion(
	messages: LlmMessage[]
): Promise<{ content?: string; toolCall?: ToolCall }> {
	// 运行时校验，缺少变量直接抛出明确错误
	if (!API_KEY || !BASE_URL || !MODEL) {
		throw new Error('缺少环境变量：SILICONFLOW_API_KEY / SILICONFLOW_BASE_URL / MODEL_NAME')
	}

	const controller = new AbortController()
	const timeoutId = setTimeout(() => controller.abort(), 55000)

	let res: Response
	try {
		res = await fetch(`${BASE_URL}/chat/completions`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${API_KEY}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: MODEL,
				messages,
				temperature: 0.4,
				max_tokens: 2048
			}),
			signal: controller.signal
		})
	} catch (err) {
		if (err instanceof Error && err.name === 'AbortError') {
			throw new Error('LLM请求超时(55s)')
		}
		throw err
	} finally {
		clearTimeout(timeoutId)
	}

	const data = await res.json()
	console.log('llm原始返回：', JSON.stringify(data, null, 2))

	if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
		throw new Error(`LLM接口异常: ${JSON.stringify(data)}`)
	}
	const choice = data.choices[0]
	const msg = choice.message

	// 判断是否输出工具调用（约定：assistant输出json包裹```tool ```）
	if (msg.content?.includes('```tool')) {
		const jsonStr = msg.content.match(/```tool\s*([\s\S]*?)```/)?.[1]
		if (jsonStr) {
			const toolCall: ToolCall = JSON.parse(jsonStr.trim())
			return { toolCall }
		}
	}

	return { content: msg.content }
}

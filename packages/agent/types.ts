export type ToolCall = {
	name: string
	params: Record<string, any>
}

export type LlmMessage = {
	role: 'system' | 'user' | 'assistant' | 'tool'
	content: string
}

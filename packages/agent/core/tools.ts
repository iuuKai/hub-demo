import type { ToolCall } from '../types'

type ToolResult = { ok: true; msg: string } | { ok: false; errors: string[] } | { error: string }

export async function execTool(toolCall: ToolCall, sourceDoc: string): Promise<ToolResult> {
	switch (toolCall.name) {
		case 'validate_questions':
			return validateQuestions(toolCall.params.questions, sourceDoc)
		default:
			return { error: 'unknown tool' }
	}
}

async function validateQuestions(questions: any[], doc: string): Promise<ToolResult> {
	const errors: string[] = []
	for (let idx = 0; idx < questions.length; idx++) {
		const q = questions[idx]
		const stem = q.stem || ''
		if (!doc.includes(stem.slice(0, 15))) {
			errors.push(`第${idx + 1}题题干内容不在原始文档，疑似幻觉`)
		}
	}
	if (errors.length > 0) {
		return { ok: false, errors }
	}
	return { ok: true, msg: '全部题目校验通过' }
}

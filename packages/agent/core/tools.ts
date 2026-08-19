import type { ToolCall } from '../types'

/** 执行Agent工具调度入口 */
export async function execTool(toolCall: ToolCall, sourceDoc: string) {
	switch (toolCall.name) {
		case 'validate_questions':
			return await validateQuestions(toolCall.params.questions, sourceDoc)
		default:
			return { error: 'unknown tool' }
	}
}

/** 工具：校验试题简单幻觉检测Demo（简易版） */
async function validateQuestions(questions: any[], doc: string) {
	const errors: string[] = []
	for (let idx = 0; idx < questions.length; idx++) {
		const q = questions[idx]
		// Demo简易逻辑：检查题干关键片段是否大致在原文
		const stem = q.stem || ''
		if (!doc.includes(stem.slice(0, 15))) {
			errors.push(`第${idx + 1}题题干内容不在原始文档，疑似幻觉`)
		}
	}
	if (errors.length > 0) {
		return { ok: false, errors }
	} else {
		return { ok: true, msg: '全部题目校验通过' }
	}
}

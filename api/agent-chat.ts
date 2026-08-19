import type { VercelRequest, VercelResponse } from '@vercel/node'

export const config = {
	maxDuration: 60,
	memory: 512
}

const json = (res: VercelResponse, status: number, body: Record<string, unknown>) => {
	res.setHeader('content-type', 'application/json; charset=utf-8')
	res.status(status).json(body)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (req.method !== 'POST') {
		return json(res, 405, { success: false, message: '仅支持POST请求' })
	}

	// 临时调试模式：不调用 @hub/agent，直接返回环境变量状态 + 模拟数据
	// 验证：1) Vercel 函数部署链路通；2) 三个环境变量是否正确注入
	const SILICONFLOW_API_KEY = process.env.SILICONFLOW_API_KEY
	const SILICONFLOW_BASE_URL = process.env.SILICONFLOW_BASE_URL
	const MODEL_NAME = process.env.MODEL_NAME

	const envStatus = {
		SILICONFLOW_API_KEY: SILICONFLOW_API_KEY
			? `已配置（前6位: ${SILICONFLOW_API_KEY.slice(0, 6)}...，长度${SILICONFLOW_API_KEY.length}）`
			: '❌ 未配置',
		SILICONFLOW_BASE_URL: SILICONFLOW_BASE_URL || '❌ 未配置',
		MODEL_NAME: MODEL_NAME || '❌ 未配置'
	}

	const documentText: string = (req.body?.documentText ?? '') as string

	return json(res, 200, {
		success: true,
		message: '调试模式：未调用 LLM，仅验证部署链路',
		env: envStatus,
		receivedInput: {
			documentTextLength: documentText.length,
			documentTextPreview: documentText.slice(0, 100)
		},
		mockData: {
			summary: '这是一段模拟的文档摘要（用于验证前端能正确解析响应）',
			keyPoints: ['要点1', '要点2', '要点3'],
			timestamp: new Date().toISOString()
		}
	})
}

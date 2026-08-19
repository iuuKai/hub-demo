import type { VercelRequest, VercelResponse } from '@vercel/node'
import { runExamAgent } from '@hub/agent'

export const config = {
	maxDuration: 300,
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

	try {
		const documentText: string = (req.body?.documentText ?? '') as string

		if (!documentText.trim()) {
			return json(res, 400, { success: false, message: 'documentText不能为空' })
		}

		const result = await runExamAgent(documentText)
		return json(res, 200, { success: true, data: result })
	} catch (err) {
		const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
		console.error('[agent-chat] invocation error:', err)
		return json(res, 500, { success: false, error: message })
	}
}

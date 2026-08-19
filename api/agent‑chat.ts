// api/agent-chat.ts
import { runExamAgent } from '@hub/agent'

export const config = {
	maxDuration: 300,
	memory: 512
}

export default async function handler(req: Request) {
	if (req.method !== 'POST') {
		return new Response(JSON.stringify({ success: false, message: '仅支持POST请求' }), {
			status: 405,
			headers: { 'content-type': 'application/json' }
		})
	}

	try {
		const payload = await req.json()
		const documentText: string = payload.documentText ?? ''

		if (!documentText.trim()) {
			return new Response(JSON.stringify({ success: false, message: 'documentText不能为空' }), {
				status: 400,
				headers: { 'content-type': 'application/json' }
			})
		}

		const result = await runExamAgent(documentText)
		return new Response(JSON.stringify({ success: true, data: result }), {
			status: 200,
			headers: { 'content-type': 'application/json' }
		})
	} catch (err) {
		return new Response(JSON.stringify({ success: false, error: String(err) }), {
			status: 500,
			headers: { 'content-type': 'application/json' }
		})
	}
}

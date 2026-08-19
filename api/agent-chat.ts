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

	const totalStart = Date.now()

	let runExamAgent: (text: string) => Promise<unknown>
	try {
		const mod = await import('@hub/agent')
		if (typeof mod?.runExamAgent !== 'function') {
			throw new TypeError(
				'runExamAgent is not a function; packages/agent/dist likely missing or stale'
			)
		}
		runExamAgent = mod.runExamAgent
	} catch (err) {
		console.error('[agent-chat] import error:', err)
		const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
		return json(res, 500, {
			success: false,
			error: message,
			_hint: '如果提示 module not found，请确认 Vercel Build 阶段 @hub/agent:build 成功产出 dist',
			totalDurationMs: Date.now() - totalStart
		})
	}

	try {
		const documentText: string = (req.body?.documentText ?? '') as string

		if (!documentText.trim()) {
			return json(res, 400, {
				success: false,
				message: 'documentText不能为空',
				totalDurationMs: Date.now() - totalStart
			})
		}

		const agentStart = Date.now()
		const result = await runExamAgent(documentText)
		const agentDuration = Date.now() - agentStart
		const totalDuration = Date.now() - totalStart

		console.log(`[agent-chat] agent耗时: ${agentDuration}ms, 总耗时: ${totalDuration}ms`)

		return json(res, 200, {
			success: true,
			data: result,
			timing: {
				agentMs: agentDuration,
				totalMs: totalDuration
			}
		})
	} catch (err) {
		console.error('[agent-chat] invocation error:', err)
		const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
		return json(res, 500, {
			success: false,
			error: message,
			totalDurationMs: Date.now() - totalStart
		})
	}
}

import type { VercelRequest, VercelResponse } from '@vercel/node'

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

	let runExamAgent: (text: string) => Promise<unknown>
	try {
		// 在 handler 内部动态 import：
		// - 即使 workspace 包/别名没加载成功，也不会在模块顶层直接抛错导致 Vercel 返回 HTML 500
		// - 根 package.json 已显式声明 @hub/agent = workspace:*，Vercel NFT 能稳定追踪到物理路径
		const mod = await import('@hub/agent')
		if (typeof mod?.runExamAgent !== 'function') {
			throw new TypeError(
				'runExamAgent is not a function; packages/agent/dist likely missing or stale'
			)
		}
		runExamAgent = mod.runExamAgent
	} catch (err) {
		const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
		console.error(
			'[agent-chat] import error (see build logs for packages/agent build result):',
			err
		)
		return json(res, 500, {
			success: false,
			error: message,
			_hint:
				'如果提示 module not found，请：1) 本地执行 corepack pnpm install 更新 lockfile 并提交；2) 确认 Vercel Build 阶段 @hub/agent:build 成功产出 dist；3) 确认 Vercel 项目已配置三个环境变量 SILICONFLOW_API_KEY / SILICONFLOW_BASE_URL / MODEL_NAME'
		})
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

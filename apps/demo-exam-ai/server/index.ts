// 必须在 @hub/agent 之前加载，llmClient 在模块顶层就读取 process.env
import './load-env'
import express from 'express'
import { runExamAgent } from '@hub/agent'

const app = express()
app.use(express.json())

const json = (
  res: express.Response,
  status: number,
  body: Record<string, unknown>
) => {
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.status(status).json(body)
}

// 与 api/agent-chat.ts 保持一致的接口契约
app.post('/api/agent-chat', async (req, res) => {
  const totalStart = Date.now()

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

    console.log(
      `[local-agent-chat] agent耗时: ${agentDuration}ms, 总耗时: ${totalDuration}ms`
    )

    return json(res, 200, {
      success: true,
      data: result,
      timing: {
        agentMs: agentDuration,
        totalMs: totalDuration
      }
    })
  } catch (err) {
    console.error('[local-agent-chat] error:', err)
    const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
    return json(res, 500, {
      success: false,
      error: message,
      totalDurationMs: Date.now() - totalStart
    })
  }
})

// 健康检查，方便验证本地服务是否启动
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    service: 'local-agent-chat',
    time: new Date().toISOString()
  })
})

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001

// 启动时检查环境变量，避免运行时才发现没加载
const ENV_KEYS = ['SILICONFLOW_API_KEY', 'SILICONFLOW_BASE_URL', 'MODEL_NAME']
const missing = ENV_KEYS.filter((k) => !process.env[k])
if (missing.length) {
  console.warn('[local-agent-chat] 警告：缺少环境变量', missing.join(', '))
} else {
  console.log('[local-agent-chat] 环境变量加载成功')
}

app.listen(PORT, () => {
  console.log(`[local-agent-chat] listening on http://localhost:${PORT}`)
})

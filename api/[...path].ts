import express from 'express'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import apiRoutes from './_routes'

const app = express()
app.use(express.json())

app.use((req, res, next) => {
	const rawUrl = req.url ?? ''
	if (rawUrl.includes('...path=')) {
		const u = new URL(rawUrl, 'http://localhost')
		const matchedPath = u.searchParams.get('...path')
		if (matchedPath) {
			req.url = '/' + matchedPath + (u.search.replace(/\?...path=.*/, '') || '')
		}
	} else if (rawUrl.startsWith('/api/')) {
		req.url = rawUrl.slice(4) || '/'
	} else if (rawUrl === '/api') {
		req.url = '/'
	}
	next()
})

app.use(apiRoutes)

export default function handler(req: VercelRequest, res: VercelResponse) {
	return app(req, res)
}

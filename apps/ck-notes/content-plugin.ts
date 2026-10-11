import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fse from 'fs-extra'
import type { Plugin } from 'vite'

/** 与 vite.config.ts 中的 base 保持一致 */
export const BASE = '/ck-notes/'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)))
const CONTENT_DIR = path.join(ROOT, '.temp-content')
const DIST_DIR = path.join(ROOT, 'dist')

const MIME: Record<string, string> = {
	'.html': 'text/html; charset=utf-8',
	'.htm': 'text/html; charset=utf-8',
	'.md': 'text/markdown; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.gif': 'image/gif',
	'.webp': 'image/webp',
	'.svg': 'image/svg+xml',
	'.css': 'text/css; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8'
}

/**
 * 学习资料内容插件：
 * 1. dev —— 在 vite 内部中间件之前插入一层，把 `${BASE}*` 请求映射到 `.temp-content/`
 *    下的真实文件（含中文文件名，先做 URL 解码，并做路径穿越防护）。
 * 2. build —— closeBundle 时把 `.temp-content` 内容拷贝进 `dist/` 根目录，
 *    使构建产物内可以直接访问 `classes/...`、`mistakes/...` 等静态资源。
 */
export function ckNotesContent(): Plugin {
	return {
		name: 'ck-notes-content',
		configureServer(server) {
			server.middlewares.use((req, res, next) => {
				if (req.method !== 'GET' && req.method !== 'HEAD') return next()
				let rel: string
				try {
					rel = decodeURIComponent((req.url ?? '').split('?')[0])
				} catch {
					return next()
				}
				if (rel.startsWith(BASE)) rel = rel.slice(BASE.length)
				else if (rel.startsWith('/')) rel = rel.slice(1)
				rel = rel.replace(/\\/g, '/')
				if (!rel) return next()

				const target = path.resolve(CONTENT_DIR, rel)
				// 防路径穿越：目标必须位于 .temp-content 内
				if (target !== CONTENT_DIR && !target.startsWith(CONTENT_DIR + path.sep)) return next()
				let stat: fs.Stats
				try {
					stat = fs.statSync(target)
				} catch {
					return next()
				}
				if (!stat.isFile()) return next()

				const ext = path.extname(target).toLowerCase()
				res.setHeader('Content-Type', MIME[ext] ?? 'application/octet-stream')
				res.setHeader('Cache-Control', 'no-cache')
				fs.createReadStream(target).pipe(res)
			})
		},
		closeBundle() {
			if (!fs.existsSync(CONTENT_DIR)) return
			fse.ensureDirSync(DIST_DIR)
			fse.copySync(CONTENT_DIR, DIST_DIR, { overwrite: true })
			console.log(`[ck-notes] content copied to dist: ${CONTENT_DIR} -> ${DIST_DIR}`)
		}
	}
}

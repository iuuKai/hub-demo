import { defineConfig } from 'vitepress'
import { execSync } from 'node:child_process'
import path from 'node:path'
import { nav } from './config/nav'
import { sidebar } from './config/sidebar'

const SOURCE_CONTENT_ROOT = path.resolve(__dirname, '../../../content/blog')

export default defineConfig({
	lang: 'zh-CN',
	title: 'IUUKAI BLOG',
	description: 'iuukai的个人博客',
	srcDir: './.temp-content',
	base: '/blog/',
	lastUpdated: true,
	themeConfig: {
		docFooter: {
			prev: '上一篇',
			next: '下一篇'
		},
		outline: {
			label: '目录'
		},
		returnToTopLabel: '回到顶部',
		search: {
			provider: 'local'
		},
		nav,
		sidebar,
		socialLinks: [{ icon: 'github', link: 'https://github.com/iuukai' }],

		lastUpdated: {
			text: '最后更新于'
		},
		transformPageData(pageData) {
			if (process.env.NODE_ENV !== 'production') return pageData

			const tempFilePath = pageData.filePath
			if (!tempFilePath) return pageData

			const relPath = path.relative(path.resolve(__dirname, '../.temp-content'), tempFilePath)
			const realSourcePath = path.resolve(SOURCE_CONTENT_ROOT, relPath)

			try {
				const gitOutput = execSync(`git log -1 --pretty="%ai" ${realSourcePath}`, {
					encoding: 'utf8',
					stdio: ['ignore', 'pipe', 'ignore']
				}).trim()
				if (gitOutput) {
					pageData.frontmatter.lastUpdated = gitOutput
				}
			} catch (err) {}

			return pageData
		}
	}
})

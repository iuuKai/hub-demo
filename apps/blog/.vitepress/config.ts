import { defineConfig } from 'vitepress'
import { nav } from './config/nav'
import { sidebar } from './config/sidebar'

export default defineConfig({
	lang: 'zh-CN',
	title: 'IUUKAI BLOG',
	description: 'iuukai的个人博客',
	srcDir: './.temp-content/blog',
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
		lastUpdated: {
			text: '最后更新于'
		},
		search: {
			provider: 'local'
		},
		nav,
		sidebar,
		socialLinks: [{ icon: 'github', link: 'https://github.com/iuukai' }]
	}
})

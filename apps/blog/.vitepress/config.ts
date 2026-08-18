import { defineConfig } from 'vitepress'
import { frontendNav } from './config/frontend.nav'
import { vercelNav } from './config/vercel.nav'
import { monorepoSidebar } from './config/monorepo.sidebar'
import { exampleSidebar } from './config/example.sidebar'

export default defineConfig({
	title: 'IUUKAI BLOG',
	description: 'iuukai的个人博客',
	srcDir: './.temp-content/blog',
	base: '/blog/',
	themeConfig: {
		search: {
			provider: 'local'
		},
		nav: [
			{ text: '🏠 首页', link: '/' },
			{
				text: '💻 技术',
				items: [frontendNav, { text: '后端', items: [] }, { text: '工程化', items: [] }]
			},
			{
				text: '🚀 云平台部署',
				items: [vercelNav, { text: 'Render', items: [] }, { text: 'Netlify', items: [] }]
			},
			{
				text: '⚙ 第三方库 & API 范例',
				items: []
			},
			{
				text: '⚔ Examples',
				items: [
					{ text: 'Markdown Examples', link: '/example/markdown-examples' },
					{ text: 'Runtime API Examples', link: '/example/api-examples' }
				]
			}
		],
		sidebar: {
			...monorepoSidebar,
			...exampleSidebar
		},
		socialLinks: [{ icon: 'github', link: 'https://github.com/iuukai' }]
	}
})

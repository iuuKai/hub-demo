import type { DefaultTheme } from 'vitepress'
import { navFrontend } from './nav.frontend'
import { navVercel } from './nav.vercel'

export const nav: DefaultTheme.NavItem[] = [
	{ text: '🏠 首页', link: '/' },
	{
		text: '💻 技术',
		items: [navFrontend, { text: '后端', items: [] }, { text: '工程化', items: [] }]
	},
	{
		text: '🚀 云平台部署',
		items: [navVercel, { text: 'Render', items: [] }, { text: 'Netlify', items: [] }]
	},
	{ text: '⚙️ 第三方库 & API 范例', items: [] },
	{
		text: '⚔ Examples',
		items: [
			{ text: 'Markdown Examples', link: '/example/markdown-examples' },
			{ text: 'Runtime API Examples', link: '/example/api-examples' }
		]
	}
]

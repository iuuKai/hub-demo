import type { DefaultTheme } from 'vitepress'
import { navFrontend } from './nav.frontend'
import { navFreeDomain } from './nav.freedomian'
import { navVercel } from './nav.vercel'
import { navOther } from './nav.other'
import { navPitfalls } from './nav.pitfalls'

export const nav: DefaultTheme.NavItem[] = [
	{ text: '🏠 首页', link: '/' },
	{
		text: '💻 技术',
		items: [navFrontend, { text: '后端', items: [] }, { text: '工程化', items: [] }]
	},
	{
		text: '🚀 云平台部署',
		items: [
			navFreeDomain,
			navVercel,
			{ text: 'Render', items: [] },
			{ text: 'Netlify', items: [] },
			navPitfalls
		]
	},
	{ text: '📦 收纳盒', items: [] },
	{ text: '⚙️ 其他', items: navOther },
	{
		text: '⚔ Examples',
		items: [
			{ text: 'Markdown Examples', link: '/example/markdown-examples' },
			{ text: 'Runtime API Examples', link: '/example/api-examples' }
		]
	}
]

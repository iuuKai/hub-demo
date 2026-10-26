import type { DefaultTheme } from 'vitepress'

export const sidebarExample: DefaultTheme.SidebarMulti = {
	'/example/': [
		{
			text: 'Examples',
			items: [
				{ text: 'Markdown Examples', link: '/example/markdown-examples' },
				{ text: 'Runtime API Examples', link: '/example/api-examples' }
			]
		}
	]
}

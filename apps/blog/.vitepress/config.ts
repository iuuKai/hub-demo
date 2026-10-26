import { defineConfig } from 'vitepress'
import { nav } from './config/nav'
import { sidebar } from './config/sidebar'

export default defineConfig({
	title: 'IUUKAI BLOG',
	description: 'iuukai的个人博客',
	srcDir: './.temp-content/blog',
	base: '/blog/',
	themeConfig: {
		search: {
			provider: 'local'
		},
		nav,
		sidebar,
		socialLinks: [{ icon: 'github', link: 'https://github.com/iuukai' }]
	}
})

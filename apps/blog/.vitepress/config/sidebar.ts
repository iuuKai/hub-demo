import type { DefaultTheme } from 'vitepress'
import { sidebarExample } from './sidebar.example'
import { sidebarMonorepo } from './sidebar.monorepo'

export const sidebar: DefaultTheme.Sidebar = {
	...sidebarMonorepo,
	...sidebarExample
}

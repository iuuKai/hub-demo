import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { ckNotesContent, BASE } from './content-plugin'

export default defineConfig({
	base: BASE,
	plugins: [vue(), ckNotesContent()],
	// 学习资料不走 vite publicDir，统一由 content-plugin 处理：
	// - dev：中间件把 `.temp-content` 下的文件按 `${BASE}*` 路径伺服
	// - build：closeBundle 时把 `.temp-content` 完整拷贝进 `dist/`
	publicDir: false,
	server: {
		port: 5175,
		host: true
	},
	build: {
		outDir: 'dist',
		emptyOutDir: true
	}
})

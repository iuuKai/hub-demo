import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
	base: '/demo-exam-ai/',
	plugins: [vue()],
	server: {
		port: 5174,
		host: true,
		proxy: {
			'/api': {
				target: 'http://localhost:3001',
				changeOrigin: true
			}
		}
	}
})

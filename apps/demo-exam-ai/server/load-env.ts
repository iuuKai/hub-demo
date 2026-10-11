import { config } from 'dotenv'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

// 基于当前文件位置定位 .env，不依赖 process.cwd()，避免从不同目录启动时找不到
const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '../.env') })

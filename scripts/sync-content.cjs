const fsExtra = require('fs-extra')
const chokidar = require('chokidar')
const path = require('path')

async function syncBatch(mappings) {
	for (const map of mappings) {
		const src = path.resolve(map.source)
		const dst = path.resolve(map.target)
		await fsExtra.emptyDir(dst)
		await fsExtra.copy(src, dst)
		console.log(`✅ ${src} → ${dst}`)
	}
}

function startWatch(mappings) {
	const watchPaths = mappings.map(m => path.resolve(m.source))
	console.log(`👀 监听：`, watchPaths)
	const watcher = chokidar.watch(watchPaths, { ignoreInitial: true })
	watcher.on('all', async () => {
		console.log('\n🔄 文件变更，重新同步...')
		await syncBatch(mappings)
	})
}

async function main() {
	const args = process.argv.slice(2)
	const watchMode = args.includes('--watch')

	let configName = null
	const configArg = args.find(arg => arg.startsWith('--config='))
	if (configArg) {
		configName = configArg.replace('--config=', '')
	} else {
		const configIdx = args.indexOf('--config')
		if (configIdx !== -1 && configIdx + 1 < args.length) {
			configName = args[configIdx + 1]
		}
	}

	if (!configName) {
		console.error('❌ 使用方式: node sync-content.js --config blog')
		process.exit(1)
	}
	const configPath = path.resolve(__dirname, `./mappings/${configName}.json`)
	const mappings = require(configPath)

	await syncBatch(mappings)
	if (watchMode) startWatch(mappings)
}

main()

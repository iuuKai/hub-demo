import { Router } from 'express'
import { agentRouter } from '@hub/agent'

const routeModules: Record<string, Router> = {
	_agent: agentRouter
}

const apiRoutes = Router()
for (const [fileName, routerInstance] of Object.entries(routeModules)) {
	const routeName = fileName.replace(/^_/, '')
	apiRoutes.use(`/${routeName}`, routerInstance)
}

export default apiRoutes

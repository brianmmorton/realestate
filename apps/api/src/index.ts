import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { createGraphQLServer } from './graphql/server.js'
import { config } from './config/index.js'

async function startServer() {
  const app = express()

  // Middleware
  app.use(helmet())
  app.use(morgan('combined'))
  app.use(cors({
    origin: config.corsOrigin,
    credentials: true,
  }))

  // GraphQL endpoint
  const yoga = await createGraphQLServer({
    endpoint: '/graphql',
    landingPage: true
  })

  app.all('/graphql', yoga.requestListener)

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() })
  })

  // Start server
  const port = config.port || 4000
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`)
    console.log(`📊 GraphQL endpoint: http://localhost:${port}/graphql`)
  })
}

startServer().catch(console.error) 
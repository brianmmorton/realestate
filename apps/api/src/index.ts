import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { createYoga } from 'graphql-yoga'
import { createSchema } from './graphql/schema.js'
import { createContext } from './graphql/context.js'
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
  const schema = await createSchema()
  const yoga = createYoga({
    schema,
    context: createContext,
    graphqlEndpoint: '/graphql',
    cors: false, // Handled by express cors middleware
  })

  app.all('/graphql', yoga)

  // Health check endpoint
  app.get('/health', (req, res) => {
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
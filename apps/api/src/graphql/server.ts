import 'reflect-metadata'
import { createYoga } from 'graphql-yoga'
import { createSchema } from './schema.js'
import { createContext } from './context.js'
import { config } from '../config/index.js'

// Singleton instance for serverless environments
let yogaInstance: any = null

export async function createGraphQLServer(options: {
  endpoint?: string
  landingPage?: boolean
} = {}) {
  const schema = await createSchema()
  
  return createYoga({
    schema,
    context: createContext,
    graphqlEndpoint: options.endpoint || '/graphql',
    cors: {
      origin: config.corsOrigin,
      credentials: true,
    },
    graphiql: config.nodeEnv !== 'production',
    landingPage: options.landingPage ?? true,
  })
}

// For serverless environments - use singleton pattern
export async function getGraphQLServerInstance(options?: Parameters<typeof createGraphQLServer>[0]) {
  if (!yogaInstance) {
    try {
      yogaInstance = await createGraphQLServer(options)
      console.log('✅ GraphQL server instance created')
    } catch (error) {
      console.error('❌ Failed to create GraphQL server:', error)
      throw error
    }
  }
  return yogaInstance
} 
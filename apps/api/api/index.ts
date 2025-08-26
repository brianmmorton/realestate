import { VercelRequest, VercelResponse } from '@vercel/node'
import { getGraphQLServerInstance } from '../src/graphql/server.js'
import { config } from '../src/config/index.js'

// Vercel serverless function handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log(`📨 ${req.method} ${req.url} - API request received`)
    
    const yoga = await getGraphQLServerInstance({
      endpoint: '/api',
      landingPage: false
    })
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', config.corsOrigin)
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      res.setHeader('Access-Control-Allow-Credentials', 'true')
      res.status(200).end()
      return
    }

    // Handle GraphQL requests
    return yoga(req, res)
  } catch (error) {
    console.error('❌ Serverless function error:', error)
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: config.nodeEnv === 'production' ? 'Something went wrong' : (error instanceof Error ? error.message : String(error))
    })
  }
} 
import { Request } from 'express'
import { supabaseAdmin } from '../lib/supabase.js'

export interface GraphQLContext {
  req: Request
  user?: any
  supabase: typeof supabaseAdmin
}

export const createContext = async ({ req }: { req: Request }): Promise<GraphQLContext> => {
  let user = null
  
  // Extract JWT token from Authorization header
  const authHeader = req.headers.authorization
  
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    
    try {
      // Verify the JWT token with Supabase
      const { data, error } = await supabaseAdmin.auth.getUser(token)
      
      if (error) {
        console.error('Failed to verify JWT token:', error)
      }
      
      if (!error && data.user) {
        user = data.user
      }
    } catch (error) {
      console.error('Failed to verify JWT token:', error)
    }
  }

  return {
    req,
    user,
    supabase: supabaseAdmin,
  }
} 
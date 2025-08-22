import { createClient } from '@supabase/supabase-js'
import { config } from '../config/index.js'

// Service role client for admin operations
export const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

// Anonymous client for public operations
export const supabaseAnon = createClient(
  config.supabase.url,
  config.supabase.anonKey
) 
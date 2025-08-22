import {
  Environment,
  Network,
  RecordSource,
  Store,
  RequestParameters,
  Variables,
} from 'relay-runtime'
import { supabase } from './supabase'

// Define the function that fetches the results of an operation (query/mutation/etc)
// and returns its results as a Promise
async function fetchRelay(
  params: RequestParameters,
  variables: Variables
): Promise<any> {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
  
  console.log(
    `fetching query ${params.name} with ${JSON.stringify(variables)}`
  )

  // Get the current session to include auth token
  const { data: { session } } = await supabase.auth.getSession()
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  // Add authorization header if user is authenticated
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
  }

  return fetch(`${API_URL}/graphql`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: params.text,
      variables,
    }),
  }).then((response) => response.json())
}

// Export a singleton instance of Relay Environment configured with our network function
export const relayEnvironment = new Environment({
  network: Network.create(fetchRelay),
  store: new Store(new RecordSource()),
}) 
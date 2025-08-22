import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { RelayEnvironmentProvider } from 'react-relay'
import App from './App.tsx'
import { AuthProvider } from './providers/auth-provider.tsx'
import { relayEnvironment } from './lib/relay'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RelayEnvironmentProvider environment={relayEnvironment}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </RelayEnvironmentProvider>
  </React.StrictMode>
) 
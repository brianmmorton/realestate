import React, { useState, Suspense } from 'react'
import { graphql, commitMutation } from 'relay-runtime'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { useAuth } from '../../providers/auth-provider'
import { relayEnvironment } from '../../lib/relay'
import { PropertiesList } from './PropertiesList'

// GraphQL mutation for deleting property configuration
const DeletePropertyConfigurationMutation = graphql`
  mutation PropertiesDeleteMutation($id: ID!) {
    deletePropertyConfiguration(id: $id)
  }
`

export const PropertiesPage: React.FC = () => {
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleLoadConfiguration = (configurationId: string) => {
    // Navigate to calculator page with the property ID
    navigate(`/calculator/${configurationId}`)
  }

  const handleDeleteConfiguration = async (configurationId: string) => {
    if (!confirm('Are you sure you want to delete this configuration?')) {
      return
    }

    try {
      await new Promise<void>((resolve, reject) => {
        commitMutation(relayEnvironment, {
          mutation: DeletePropertyConfigurationMutation,
          variables: { id: configurationId },
          onCompleted: () => {
            resolve()
          },
          onError: (err) => {
            reject(err)
          }
        })
      })

      // Force a refresh by reloading the page (in a real app, you'd want to refetch the query)
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete configuration')
    }
  }

  const handleNewConfiguration = () => {
    // Navigate to calculator page with "new" parameter to reset configuration
    navigate('/calculator/new')
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your saved configurations</h1>
          <Button onClick={() => window.location.href = '/login'}>
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Saved Property Configurations</h1>
          <p className="text-muted-foreground">
            Manage your saved property investment analyses
          </p>
        </div>
        <Button onClick={handleNewConfiguration} className="bg-green-600 hover:bg-green-700">
          Add Property
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <Suspense fallback={
        <div className="text-center py-8">
          <p>Loading configurations...</p>
        </div>
      }>
        <PropertiesList
          onLoad={handleLoadConfiguration}
          onDelete={handleDeleteConfiguration}
          onNewConfiguration={handleNewConfiguration}
        />
      </Suspense>
    </div>
  )
} 
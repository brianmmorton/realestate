import React from 'react'
import { graphql, useLazyLoadQuery } from 'react-relay'
import { Button } from '../../components/ui/button'
import { PropertyConfigurationCard } from './PropertyConfigurationCard'
import type { PropertiesListQuery } from './__generated__/PropertiesListQuery.graphql'

const PropertiesListQueryGraphQL = graphql`
  query PropertiesListQuery {
    propertyConfigurations {
      id
      ...PropertyConfigurationCard_configuration
    }
  }
`

interface PropertiesListProps {
  onLoad: (id: string) => void
  onDelete: (id: string) => void
  onNewConfiguration: () => void
}

export const PropertiesList: React.FC<PropertiesListProps> = ({
  onLoad,
  onDelete,
  onNewConfiguration,
}) => {
  const data = useLazyLoadQuery<PropertiesListQuery>(
    PropertiesListQueryGraphQL,
    {}
  )

  if (data.propertyConfigurations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No saved configurations found</p>
        <Button onClick={onNewConfiguration}>
          Create Your First Configuration
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {data.propertyConfigurations.map((config) => (
        <PropertyConfigurationCard
          key={config.id}
          configuration={config}
          onLoad={onLoad}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
} 
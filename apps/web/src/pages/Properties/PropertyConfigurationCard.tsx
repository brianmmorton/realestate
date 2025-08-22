import React from 'react'
import { graphql, useFragment } from 'react-relay'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import type { PropertyConfigurationCard_configuration$key } from './__generated__/PropertyConfigurationCard_configuration.graphql'

const PropertyConfigurationCardFragment = graphql`
  fragment PropertyConfigurationCard_configuration on PropertyConfiguration {
    id
    name
    propertyAddress
    propertyPrice
    createdAt
  }
`

interface PropertyConfigurationCardProps {
  configuration: PropertyConfigurationCard_configuration$key
  onLoad: (id: string) => void
  onDelete: (id: string) => void
}

export const PropertyConfigurationCard: React.FC<PropertyConfigurationCardProps> = ({
  configuration,
  onLoad,
  onDelete,
}) => {
  const data = useFragment(PropertyConfigurationCardFragment, configuration)

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{data.name}</h3>
          <p className="text-muted-foreground mb-1">{data.propertyAddress}</p>
          <p className="text-sm text-muted-foreground mb-2">
            Property Value: ${data.propertyPrice.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">
            Saved: {new Date(data.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => onLoad(data.id)}
            variant="outline"
          >
            Load
          </Button>
          <Button
            onClick={() => onDelete(data.id)}
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  )
} 
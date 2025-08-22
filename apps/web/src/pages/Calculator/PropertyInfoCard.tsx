import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CurrencyInput } from '@/components/ui/currency-input'
import { Label } from '@/components/ui/label'
import { useOperatingExpensesActions, usePropertyInfo, usePropertyInfoActions } from '@/stores/investment-calculator-store'

export const PropertyInfoCard: React.FC = () => {
  const propertyInfo = usePropertyInfo()
  const setPropertyInfo = usePropertyInfoActions()
  const setOperatingExpenses = useOperatingExpensesActions()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Information</CardTitle>
        <CardDescription>Basic property details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={propertyInfo.address}
              onChange={(e) => {
                setPropertyInfo({ address: e.target.value })
                if (!propertyInfo.name) {
                  setPropertyInfo({ name: e.target.value })
                }
              }}
              placeholder="Enter property address"
            />
          </div>
          <div>
            <Label htmlFor="propertyName">Property Name</Label>
            <Input
              id="propertyName"
              value={propertyInfo.name}
              onChange={(e) => setPropertyInfo({ name: e.target.value })}
              placeholder="Enter property name"
            />
          </div>
          <div>
            <Label htmlFor="price">Purchase Price</Label>
            <CurrencyInput
              id="price"
              value={propertyInfo.price || 0}
              onChange={(value) => {
                setPropertyInfo({ price: value });

                if (value > 0) {
                  setOperatingExpenses({ propertyTaxes: value * 0.012 })
                }
              }}
              placeholder="0"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
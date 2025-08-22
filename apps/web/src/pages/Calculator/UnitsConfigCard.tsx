import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CurrencyInput } from '@/components/ui/currency-input'
import { NumberInput } from '@/components/ui/number-input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { useUnits, useAddUnit, useRemoveUnit, useUpdateUnit, useTotalMonthlyRent, useCapRate, usePropertyInfo } from '@/stores/investment-calculator-store'

export const UnitsConfigCard: React.FC = () => {
  const units = useUnits()
  const addUnit = useAddUnit()
  const removeUnit = useRemoveUnit()
  const updateUnit = useUpdateUnit()
  const totalMonthlyRent = useTotalMonthlyRent()
  const capRate = useCapRate()
  const propertyInfo = usePropertyInfo()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rental Units</CardTitle>
        <CardDescription>Configure the different unit types and their rents</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {units.map((unit) => (
          <div key={unit.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
            <div>
              <Label htmlFor={`unitType-${unit.id}`}>Unit Type</Label>
              <Input
                id={`unitType-${unit.id}`}
                value={unit.type}
                onChange={(e) => updateUnit(unit.id, 'type', e.target.value)}
                placeholder="e.g., 1 Bedroom, Studio"
              />
            </div>
            <div>
              <Label htmlFor={`quantity-${unit.id}`}>Quantity</Label>
              <NumberInput
                id={`quantity-${unit.id}`}
                value={unit.quantity}
                onChange={(value) => updateUnit(unit.id, 'quantity', value)}
                min={1}
              />
            </div>
            <div>
              <Label htmlFor={`rent-${unit.id}`}>Monthly Rent</Label>
              <CurrencyInput
                id={`rent-${unit.id}`}
                value={unit.monthlyRent || 0}
                onChange={(value) => updateUnit(unit.id, 'monthlyRent', value)}
                placeholder="0"
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeUnit(unit.id)}
                disabled={units.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <Button onClick={addUnit} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Unit Type
        </Button>
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium">
            Total Monthly Rent: ${totalMonthlyRent.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            Annual Gross Rent: ${(totalMonthlyRent * 12).toLocaleString()}
          </p>
          {propertyInfo.price > 0 && (
            <p className="text-sm text-muted-foreground">
              Cap Rate: {capRate.toFixed(2)}%
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 
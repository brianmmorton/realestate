import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CurrencyInput } from '@/components/ui/currency-input'
import { PercentageInput } from '@/components/ui/percentage-input'
import { Label } from '@/components/ui/label'
import { useOperatingExpenses, useOperatingExpensesActions } from '@/stores/investment-calculator-store'

export const OperatingExpensesCard: React.FC = () => {
  const operatingExpenses = useOperatingExpenses()
  const setOperatingExpenses = useOperatingExpensesActions()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Operating Expenses</CardTitle>
        <CardDescription>Annual costs and expenses</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="vacancyRate">Vacancy Rate</Label>
            <PercentageInput
              id="vacancyRate"
              value={operatingExpenses.vacancyRate}
              onChange={(value) => setOperatingExpenses({ vacancyRate: value })}
              maxValue={50}
              step={0.1}
            />
          </div>
          <div>
            <Label htmlFor="propertyTaxes">Property Taxes</Label>
            <CurrencyInput
              id="propertyTaxes"
              value={operatingExpenses.propertyTaxes || 0}
              onChange={(value) => setOperatingExpenses({ propertyTaxes: value })}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="insurance">Insurance</Label>
            <CurrencyInput
              id="insurance"
              value={operatingExpenses.insurance || 0}
              onChange={(value) => setOperatingExpenses({ insurance: value })}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="propertyManagement">Property Management</Label>
            <CurrencyInput
              id="propertyManagement"
              value={operatingExpenses.propertyManagement || 0}
              onChange={(value) => setOperatingExpenses({ propertyManagement: value })}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="maintenance">Maintenance & Repairs</Label>
            <CurrencyInput
              id="maintenance"
              value={operatingExpenses.maintenance || 0}
              onChange={(value) => setOperatingExpenses({ maintenance: value })}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="utilities">Utilities</Label>
            <CurrencyInput
              id="utilities"
              value={operatingExpenses.utilities || 0}
              onChange={(value) => setOperatingExpenses({ utilities: value })}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="other">Other Expenses</Label>
            <CurrencyInput
              id="other"
              value={operatingExpenses.other || 0}
              onChange={(value) => setOperatingExpenses({ other: value })}
              placeholder="0"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
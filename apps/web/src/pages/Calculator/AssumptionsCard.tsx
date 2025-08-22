import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PercentageInput } from '@/components/ui/percentage-input'
import { NumberInput } from '@/components/ui/number-input'
import { Label } from '@/components/ui/label'
import { useAssumptions, useAssumptionsActions } from '@/stores/investment-calculator-store'

export const AssumptionsCard: React.FC = () => {
  const assumptions = useAssumptions()
  const setAssumptions = useAssumptionsActions()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Assumptions</CardTitle>
        <CardDescription>Long-term growth and appreciation assumptions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="annualAppreciation">Annual Property Appreciation</Label>
            <PercentageInput
              id="annualAppreciation"
              value={assumptions.annualAppreciation}
              onChange={(value) => setAssumptions({ annualAppreciation: value })}
              maxValue={20}
              step={0.1}
            />
          </div>
          <div>
            <Label htmlFor="annualRentIncrease">Annual Rent Increase</Label>
            <PercentageInput
              id="annualRentIncrease"
              value={assumptions.annualRentIncrease}
              onChange={(value) => setAssumptions({ annualRentIncrease: value })}
              maxValue={15}
              step={0.1}
            />
          </div>
          <div>
            <Label htmlFor="projectionYears">Projection Period (Years)</Label>
            <NumberInput
              id="projectionYears"
              value={assumptions.projectionYears}
              onChange={(value) => setAssumptions({ projectionYears: value })}
              min={1}
              max={50}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
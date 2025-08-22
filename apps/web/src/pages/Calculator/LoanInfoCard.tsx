import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CurrencyInput } from '@/components/ui/currency-input'
import { PercentageInput } from '@/components/ui/percentage-input'
import { NumberInput } from '@/components/ui/number-input'
import { Label } from '@/components/ui/label'
import { useLoanInfo, useLoanInfoActions, useLoanAmount, useMonthlyMortgagePayment } from '@/stores/investment-calculator-store'

export const LoanInfoCard: React.FC = () => {
  const loanInfo = useLoanInfo()
  const setLoanInfo = useLoanInfoActions()
  const loanAmount = useLoanAmount()
  const monthlyMortgagePayment = useMonthlyMortgagePayment()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Information</CardTitle>
        <CardDescription>Financing details for the property</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="downPayment">Down Payment</Label>
            <CurrencyInput
              id="downPayment"
              value={loanInfo.downPayment || 0}
              onChange={(value) => setLoanInfo({ downPayment: value })}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="interestRate">Interest Rate</Label>
            <PercentageInput
              id="interestRate"
              value={loanInfo.interestRate || 0}
              onChange={(value) => setLoanInfo({ interestRate: value })}
              placeholder="0.00"
              maxValue={30}
              step={0.01}
            />
          </div>
          <div>
            <Label htmlFor="loanTerm">Loan Term (Years)</Label>
            <NumberInput
              id="loanTerm"
              value={loanInfo.loanTermYears}
              onChange={(value) => setLoanInfo({ loanTermYears: value })}
              min={1}
              max={50}
            />
          </div>
        </div>
        <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
          <p className="text-sm font-medium">
            Loan Amount: ${loanAmount.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            Monthly Mortgage Payment: ${monthlyMortgagePayment.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 
import React from 'react'
import { Card } from '../../components/ui/card'
import { FieldTooltip } from '../../components/ui/tooltip'
import { TrendingUp, TrendingDown, DollarSign, Calculator, AlertTriangle } from 'lucide-react'

interface TaxBenefits {
  annualDepreciationDeduction: number
  annualOperatingExpenseDeductions: number
  annualInterestDeduction: number
  totalAnnualDeductions: number
  federalTaxSavings: number
  stateTaxSavings: number
  totalTaxSavings: number
  afterTaxCashFlow: number
  currentYearPassiveLoss: number
  passiveLossCarryforward: number
  beforeTaxROI: number
  afterTaxROI: number
  taxEquivalentYield: number
}

// Mock calculation function - will be replaced with actual tax calculation logic
const calculateTaxBenefits = (): TaxBenefits => {
  // These would be calculated based on the actual property and user tax data
  return {
    annualDepreciationDeduction: 7273, // Assuming $200k depreciable basis / 27.5 years
    annualOperatingExpenseDeductions: 15000,
    annualInterestDeduction: 12000,
    totalAnnualDeductions: 34273,
    federalTaxSavings: 7540, // 22% of total deductions
    stateTaxSavings: 1714, // 5% state tax rate
    totalTaxSavings: 9254,
    afterTaxCashFlow: 14254, // Assuming $5000 before-tax cash flow + tax savings
    currentYearPassiveLoss: 0,
    passiveLossCarryforward: 0,
    beforeTaxROI: 8.5,
    afterTaxROI: 12.3,
    taxEquivalentYield: 15.4,
  }
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatPercentage = (rate: number): string => {
  return `${rate.toFixed(1)}%`
}

export const TaxBenefitsCard: React.FC = () => {
  const taxBenefits = calculateTaxBenefits()
  const hasPassiveLoss = taxBenefits.currentYearPassiveLoss > 0

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center">
            <h3 className="text-lg font-semibold flex items-center">
              <Calculator className="w-5 h-5 mr-2 text-blue-600" />
              Tax Benefits Analysis
            </h3>
            <FieldTooltip content="This analysis shows how rental property tax deductions can reduce your tax liability and improve your investment returns. Tax benefits include depreciation, operating expenses, and mortgage interest deductions." />
          </div>
          <p className="text-sm text-muted-foreground">
            Annual tax savings and after-tax returns
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Tax Deductions Breakdown */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center mb-3">
            <h4 className="font-medium text-blue-900">Annual Tax Deductions</h4>
            <FieldTooltip content="These deductions reduce your taxable income dollar-for-dollar. The tax savings equal your deductions multiplied by your marginal tax rate." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <div className="flex items-center">
                <span className="text-blue-700">Depreciation:</span>
                <FieldTooltip content="Annual depreciation for residential rental property. Depreciable basis ÷ 27.5 years. This is a 'paper loss' that doesn't affect cash flow but reduces taxes." />
              </div>
              <span className="font-medium">{formatCurrency(taxBenefits.annualDepreciationDeduction)}</span>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center">
                <span className="text-blue-700">Operating Expenses:</span>
                <FieldTooltip content="All ordinary and necessary expenses to maintain the rental property including property taxes, insurance, management fees, maintenance, utilities, and other costs." />
              </div>
              <span className="font-medium">{formatCurrency(taxBenefits.annualOperatingExpenseDeductions)}</span>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center">
                <span className="text-blue-700">Interest Expense:</span>
                <FieldTooltip content="Mortgage interest paid on loans used to acquire or improve the rental property. This is typically the largest deduction in early years of ownership." />
              </div>
              <span className="font-medium">{formatCurrency(taxBenefits.annualInterestDeduction)}</span>
            </div>
            <div className="flex justify-between border-t border-blue-200 pt-2">
              <span className="text-blue-900 font-medium">Total Deductions:</span>
              <span className="font-bold">{formatCurrency(taxBenefits.totalAnnualDeductions)}</span>
            </div>
          </div>
        </div>

        {/* Tax Savings */}
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center mb-3">
            <h4 className="font-medium text-green-900">Annual Tax Savings</h4>
            <FieldTooltip content="Actual reduction in your tax bill. Calculated as total deductions × your marginal tax rate. This is real money back in your pocket that improves your investment returns." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <div className="flex items-center">
                <span className="text-green-700">Federal Tax Savings:</span>
                <FieldTooltip content="Federal income tax savings based on your marginal tax bracket. Higher income earners see greater tax benefits from rental property deductions." />
              </div>
              <span className="font-medium">{formatCurrency(taxBenefits.federalTaxSavings)}</span>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center">
                <span className="text-green-700">State Tax Savings:</span>
                <FieldTooltip content="State income tax savings if your state has income tax. States like Florida, Texas, and Nevada have no state income tax, so this would be $0." />
              </div>
              <span className="font-medium">{formatCurrency(taxBenefits.stateTaxSavings)}</span>
            </div>
            <div className="flex justify-between border-t border-green-200 pt-2 md:col-span-2">
              <span className="text-green-900 font-medium">Total Tax Savings:</span>
              <span className="font-bold text-lg">{formatCurrency(taxBenefits.totalTaxSavings)}</span>
            </div>
          </div>
        </div>

        {/* Cash Flow Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <DollarSign className="w-4 h-4 mr-2 text-gray-600" />
              <span className="font-medium text-gray-900">Before-Tax Cash Flow</span>
              <FieldTooltip content="Net operating income minus debt service. This is the cash flow from operations before considering tax benefits." />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(taxBenefits.afterTaxCashFlow - taxBenefits.totalTaxSavings)}
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
              <span className="font-medium text-green-900">After-Tax Cash Flow</span>
              <FieldTooltip content="Your actual cash flow including tax savings. This is what really matters for your investment returns - the cash you get to keep after all taxes." />
            </div>
            <div className="text-2xl font-bold text-green-900">
              {formatCurrency(taxBenefits.afterTaxCashFlow)}
            </div>
            <div className="text-sm text-green-700 mt-1">
              +{formatCurrency(taxBenefits.totalTaxSavings)} from tax benefits
            </div>
          </div>
        </div>

        {/* ROI Comparison */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center mb-3">
            <h4 className="font-medium text-yellow-900">Return on Investment Comparison</h4>
            <FieldTooltip content="Shows how tax benefits dramatically improve your real returns. After-tax ROI is what you actually earn on your investment dollars." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center">
                <div className="text-sm text-yellow-700 mb-1">Before-Tax ROI</div>
                <FieldTooltip content="Return based only on operational cash flow, ignoring tax benefits. This is misleading for real estate investments." />
              </div>
              <div className="text-xl font-bold text-yellow-900">
                {formatPercentage(taxBenefits.beforeTaxROI)}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center">
                <div className="text-sm text-yellow-700 mb-1">After-Tax ROI</div>
                <FieldTooltip content="Your true return including tax savings. This is the real return on your invested capital and why real estate is so attractive to high earners." />
              </div>
              <div className="text-xl font-bold text-yellow-900">
                {formatPercentage(taxBenefits.afterTaxROI)}
              </div>
              <div className="text-xs text-yellow-600 mt-1">
                +{formatPercentage(taxBenefits.afterTaxROI - taxBenefits.beforeTaxROI)} boost
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center">
                <div className="text-sm text-yellow-700 mb-1">Tax-Equivalent Yield</div>
                <FieldTooltip content="The return you'd need from a taxable investment (like stocks or bonds) to match your after-tax real estate return. Shows the power of real estate tax benefits." />
              </div>
              <div className="text-xl font-bold text-yellow-900">
                {formatPercentage(taxBenefits.taxEquivalentYield)}
              </div>
              <div className="text-xs text-yellow-600 mt-1">
                vs. taxable investments
              </div>
            </div>
          </div>
        </div>

        {/* Passive Loss Warning */}
        {hasPassiveLoss && (
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-600 mt-0.5" />
              <div>
                <div className="flex items-center mb-2">
                  <h4 className="font-medium text-orange-900">Passive Loss Limitation</h4>
                  <FieldTooltip content="IRS passive loss rules limit how much rental losses you can deduct against other income. Generally limited to $25,000/year for active participants with AGI under $100k, phasing out completely at $150k AGI." />
                </div>
                <p className="text-sm text-orange-800 mb-2">
                  Current year passive loss: {formatCurrency(taxBenefits.currentYearPassiveLoss)}
                </p>
                <p className="text-xs text-orange-700">
                  Passive losses from rental activities may be limited by IRS rules. 
                  Unused losses can typically be carried forward to future years or 
                  used when the property is sold.
                </p>
                {taxBenefits.passiveLossCarryforward > 0 && (
                  <p className="text-xs text-orange-700 mt-1">
                    Carryforward losses: {formatCurrency(taxBenefits.passiveLossCarryforward)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Disclaimer:</strong> This tax analysis is for informational purposes only and 
            should not be considered professional tax advice. Tax laws are complex and change frequently. 
            Please consult with a qualified tax professional for advice specific to your situation.
          </p>
        </div>
      </div>
    </Card>
  )
} 
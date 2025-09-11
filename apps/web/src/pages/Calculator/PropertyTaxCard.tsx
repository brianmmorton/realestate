import React from 'react'
import { Card } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Button } from '../../components/ui/button'
import { FieldTooltip } from '../../components/ui/tooltip'
import { usePropertyTaxInfo, usePropertyTaxInfoActions } from '../../stores/investment-calculator-store'
import { Calendar } from 'lucide-react'

const downPaymentSourceOptions = [
  { value: 'cash', label: 'Cash' },
  { value: 'borrowed', label: 'Borrowed Funds' },
  { value: '1031_exchange', label: '1031 Exchange' },
]

export const PropertyTaxCard: React.FC = () => {
  const propertyTaxInfo = usePropertyTaxInfo()
  const setPropertyTaxInfo = usePropertyTaxInfoActions()
  const [isExpanded, setIsExpanded] = React.useState(false)

  const handleInputChange = (field: keyof typeof propertyTaxInfo, value: string | number | boolean) => {
    setPropertyTaxInfo({
      [field]: value === '' ? undefined : value
    })
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">Property Tax Information</h3>
          <p className="text-sm text-muted-foreground">
            Configure property-specific tax details for depreciation and deduction calculations
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          {/* Depreciation Information */}
          <div className="space-y-4">
            <h4 className="font-medium">Depreciation & Basis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="landValue">Land Value</Label>
                  <FieldTooltip content="The value of the land portion of your property. Land cannot be depreciated for tax purposes. Typically 20-25% of total property value. Check local tax assessments or get an appraisal to determine this value." />
                </div>
                <Input
                  id="landValue"
                  type="number"
                  placeholder="50000"
                  value={propertyTaxInfo.landValue || ''}
                  onChange={(e) => handleInputChange('landValue', Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="depreciableBasis">Depreciable Basis</Label>
                  <FieldTooltip content="The amount you can depreciate each year. Formula: Purchase price + improvements + closing costs - land value. For residential rental property, this is depreciated over 27.5 years using straight-line method." />
                </div>
                <Input
                  id="depreciableBasis"
                  type="number"
                  placeholder="200000"
                  value={propertyTaxInfo.depreciableBasis || ''}
                  onChange={(e) => handleInputChange('depreciableBasis', Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="placedInServiceDate">Placed in Service Date</Label>
                  <FieldTooltip content="The date when the property was ready and available for rental use. This is when depreciation begins, not necessarily when you purchased it. Could be purchase date, completion of renovations, or when first tenant moved in." />
                </div>
                <div className="relative">
                  <Input
                    id="placedInServiceDate"
                    type="date"
                    value={propertyTaxInfo.placedInServiceDate || ''}
                    onChange={(e) => handleInputChange('placedInServiceDate', e.target.value)}
                  />
                  <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="priorDepreciation">Prior Depreciation</Label>
                  <FieldTooltip content="Total depreciation already claimed on this property in previous years. Important for calculating remaining depreciable basis and potential depreciation recapture when sold. Leave at 0 for new investments." />
                </div>
                <Input
                  id="priorDepreciation"
                  type="number"
                  placeholder="10000"
                  value={propertyTaxInfo.priorDepreciation || ''}
                  onChange={(e) => handleInputChange('priorDepreciation', Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Additional Deductible Expenses */}
          <div className="space-y-4">
            <h4 className="font-medium">Additional Deductible Expenses (Annual)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="professionalFees">Professional Fees</Label>
                  <FieldTooltip content="Annual fees for legal services, accounting, tax preparation, property management setup, and other professional services related to your rental property. These are fully deductible as ordinary business expenses." />
                </div>
                <Input
                  id="professionalFees"
                  type="number"
                  placeholder="2000"
                  value={propertyTaxInfo.professionalFees}
                  onChange={(e) => handleInputChange('professionalFees', Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="advertisingCosts">Advertising & Marketing</Label>
                  <FieldTooltip content="Costs to find and attract tenants including online listing fees, newspaper ads, signs, photography, and marketing materials. These are deductible when you're actively seeking tenants." />
                </div>
                <Input
                  id="advertisingCosts"
                  type="number"
                  placeholder="500"
                  value={propertyTaxInfo.advertisingCosts}
                  onChange={(e) => handleInputChange('advertisingCosts', Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="travelExpenses">Travel Expenses</Label>
                  <FieldTooltip content="Mileage and travel costs for trips to your rental property for management, maintenance, tenant meetings, etc. IRS standard mileage rate for 2024 is $0.67/mile. Keep detailed records of business purpose and mileage." />
                </div>
                <Input
                  id="travelExpenses"
                  type="number"
                  placeholder="300"
                  value={propertyTaxInfo.travelExpenses}
                  onChange={(e) => handleInputChange('travelExpenses', Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="homeOfficeExpenses">Home Office Expenses</Label>
                  <FieldTooltip content="If you use part of your home exclusively for managing rental properties, you can deduct a portion of home expenses. Calculate as: (office square feet / total home square feet) × total home expenses (utilities, insurance, etc.)." />
                </div>
                <Input
                  id="homeOfficeExpenses"
                  type="number"
                  placeholder="1200"
                  value={propertyTaxInfo.homeOfficeExpenses}
                  onChange={(e) => handleInputChange('homeOfficeExpenses', Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Special Tax Situations */}
          <div className="space-y-4">
            <h4 className="font-medium">Special Tax Situations</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={propertyTaxInfo.isOpportunityZone}
                    onChange={(e) => handleInputChange('isOpportunityZone', e.target.checked)}
                    className="rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm">Property is in an Opportunity Zone</span>
                </label>
                <FieldTooltip content="Opportunity Zones offer significant tax benefits including deferral of capital gains, step-up in basis after 5+ years, and potential elimination of taxes on OZ investment gains after 10 years. Check IRS maps to verify OZ status." />
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={propertyTaxInfo.isHistoricProperty}
                    onChange={(e) => handleInputChange('isHistoricProperty', e.target.checked)}
                    className="rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm">Historic Property (eligible for tax credits)</span>
                </label>
                <FieldTooltip content="Properties listed on the National Register of Historic Places or certified historic districts may qualify for historic preservation tax credits of up to 20% of qualified rehabilitation costs. Requires specific approval process." />
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={propertyTaxInfo.qualifiesForEnergyCredits}
                    onChange={(e) => handleInputChange('qualifiesForEnergyCredits', e.target.checked)}
                    className="rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm">Qualifies for Energy Tax Credits</span>
                </label>
                <FieldTooltip content="Energy-efficient improvements like solar panels, geothermal systems, or energy-efficient HVAC may qualify for federal tax credits. Some improvements provide 30% credit, others provide specific dollar amounts." />
              </div>
            </div>
          </div>

          {/* Financing Tax Implications */}
          <div className="space-y-4">
            <h4 className="font-medium">Financing Tax Implications</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="downPaymentSource">Down Payment Source</Label>
                  <FieldTooltip content="Source of your down payment affects deductibility of related interest. Cash is straightforward. Borrowed funds may limit interest deductions. 1031 exchange has special basis rules. Consult tax professional for complex situations." />
                </div>
                <select
                  id="downPaymentSource"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={propertyTaxInfo.downPaymentSource || ''}
                  onChange={(e) => handleInputChange('downPaymentSource', e.target.value)}
                >
                  <option value="">Select source</option>
                  {downPaymentSourceOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2 mt-7">
                <input
                  type="checkbox"
                  checked={propertyTaxInfo.hasSellerFinancing}
                  onChange={(e) => handleInputChange('hasSellerFinancing', e.target.checked)}
                  className="rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm">Has Seller Financing</span>
                <FieldTooltip content="When the seller provides financing, interest payments to them are still deductible, but there may be imputed interest rules if rates are below market. Also affects the seller's tax treatment of the transaction." />
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg">
            <strong>Note:</strong> Property tax information is automatically saved with your property configuration. 
            Changes made here will be included when you save the overall property configuration.
          </div>
        </div>
      )}
    </Card>
  )
} 
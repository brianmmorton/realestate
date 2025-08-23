import React from 'react'
import { PropertyInfoCard } from './PropertyInfoCard'
import { UnitsConfigCard } from './UnitsConfigCard'
import { RehabCard } from './RehabCard'
import { LoanInfoCard } from './LoanInfoCard'
import { OperatingExpensesCard } from './OperatingExpensesCard'
import { AssumptionsCard } from './AssumptionsCard'
import { InvestmentResultsCard } from './InvestmentResultsCard'
import { Button } from '../../components/ui/button'
import { useAuth } from '../../providers/auth-provider'
import { 
  usePropertyInfo, 
  useSaveConfiguration, 
  useSaveStatus, 
  useSaveError, 
  useSavedConfigurationId,
  useUnits,
  useLoanInfo,
  useOperatingExpenses,
  useRehabInfo,
  useAssumptions,
  useProjections,
  useTotalMonthlyRent,
  useAdjustedMonthlyRent,
  useTotalRehabCost,
  useMonthlyMortgagePayment,
  useDownPayment,
  useLoanAmount,
  useCapRate
} from '@/stores/investment-calculator-store'
import { Save, CheckCircle, AlertCircle, Loader2, FileDown } from 'lucide-react'
import jsPDF from 'jspdf'

const SaveConfigurationButton: React.FC = () => {
  const { user } = useAuth()
  const saveConfiguration = useSaveConfiguration()
  const propertyInfo = usePropertyInfo()
  const saveStatus = useSaveStatus()
  const saveError = useSaveError()
  const savedConfigurationId = useSavedConfigurationId()

  if (!user) {
    return null
  }

  const handleSave = async () => {
    try {
      await saveConfiguration(propertyInfo.name)
    } catch (error) {
      // Error is already handled in the store
    }
  }

  const isLoading = saveStatus === 'saving'
  const isSuccess = saveStatus === 'success' && savedConfigurationId
  const isError = saveStatus === 'error'
  const isSaved = savedConfigurationId && saveStatus !== 'error'

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Saving...
        </>
      )
    }
    
    if (isSuccess) {
      return (
        <>
          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
          Saved Successfully
        </>
      )
    }
    
    if (isError) {
      return (
        <>
          <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
          Save Failed
        </>
      )
    }
    
    if (isSaved) {
      return (
        <>
          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
          Configuration Saved
        </>
      )
    }
    
    return (
      <>
        <Save className="w-4 h-4 mr-2" />
        Save Configuration
      </>
    )
  }

  const getButtonClass = () => {
    if (isSuccess) {
      return "bg-green-600 hover:bg-green-700"
    }
    if (isError) {
      return "bg-red-600 hover:bg-red-700"
    }
    if (isSaved) {
      return "bg-green-600 hover:bg-green-700"
    }
    return "bg-blue-600 hover:bg-blue-700"
  }

  return (
    <div className="flex flex-col items-end space-y-2">
      <Button 
        onClick={handleSave}
        className={getButtonClass()}
        disabled={!propertyInfo.name || isLoading}
      >
        {getButtonContent()}
      </Button>
      {isError && saveError && (
        <p className="text-sm text-red-600 max-w-xs text-right">
          {saveError}
        </p>
      )}
    </div>
  )
}

const ExportToPDFButton: React.FC = () => {
  const [isExporting, setIsExporting] = React.useState(false)
  const propertyInfo = usePropertyInfo()
  const units = useUnits()
  const loanInfo = useLoanInfo()
  const operatingExpenses = useOperatingExpenses()
  const rehabInfo = useRehabInfo()
  const assumptions = useAssumptions()
  const projections = useProjections()
  const totalMonthlyRent = useTotalMonthlyRent()
  const adjustedMonthlyRent = useAdjustedMonthlyRent()
  const totalRehabCost = useTotalRehabCost()
  const monthlyMortgagePayment = useMonthlyMortgagePayment()
  const downPayment = useDownPayment()
  const loanAmount = useLoanAmount()
  const capRate = useCapRate()

  const handleExportToPDF = async () => {
    if (!propertyInfo.name && !propertyInfo.address) {
      alert('Please enter property information before exporting')
      return
    }

    setIsExporting(true)
    try {
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      let currentY = 20

      // Header
      pdf.setFontSize(20)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Investment Property Analysis Report', pageWidth / 2, currentY, { align: 'center' })
      currentY += 15

      // Property Information
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Property Information', 20, currentY)
      currentY += 10

      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Property Name: ${propertyInfo.name || 'N/A'}`, 20, currentY)
      currentY += 6
      pdf.text(`Address: ${propertyInfo.address || 'N/A'}`, 20, currentY)
      currentY += 6
      pdf.text(`Purchase Price: $${propertyInfo.price.toLocaleString()}`, 20, currentY)
      currentY += 15

      // Units Configuration
      if (units.length > 0) {
        pdf.setFontSize(16)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Units Configuration', 20, currentY)
        currentY += 10

        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'normal')
        units.forEach((unit, index) => {
          pdf.text(`Unit ${index + 1}: ${unit.quantity}x ${unit.type} - $${unit.monthlyRent.toLocaleString()}/month`, 20, currentY)
          currentY += 6
        })
        pdf.text(`Base Monthly Rent: $${totalMonthlyRent.toLocaleString()}`, 20, currentY)
        currentY += 6
        if (rehabInfo.enabled && adjustedMonthlyRent !== totalMonthlyRent) {
          pdf.text(`Adjusted Monthly Rent (after rehab): $${adjustedMonthlyRent.toLocaleString()}`, 20, currentY)
          currentY += 6
        }
        currentY += 9
      }

      // Rehab Information
      if (rehabInfo.enabled && totalRehabCost > 0) {
        pdf.setFontSize(16)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Rehab & Renovation', 20, currentY)
        currentY += 10

        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'normal')
        rehabInfo.items.forEach((item) => {
          if (item.category && item.cost > 0) {
            pdf.text(`${item.category}: $${item.cost.toLocaleString()}`, 20, currentY)
            currentY += 6
          }
        })
        pdf.text(`Total Rehab Cost: $${totalRehabCost.toLocaleString()}`, 20, currentY)
        currentY += 6
        pdf.text(`Expected Rent Increase: ${rehabInfo.rentIncreasePercentage}%`, 20, currentY)
        currentY += 15
      }

      // Loan Information
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Financing Details', 20, currentY)
      currentY += 10

      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Down Payment: $${downPayment.toLocaleString()}`, 20, currentY)
      currentY += 6
      pdf.text(`Loan Amount: $${loanAmount.toLocaleString()}`, 20, currentY)
      currentY += 6
      pdf.text(`Interest Rate: ${loanInfo.interestRate}%`, 20, currentY)
      currentY += 6
      pdf.text(`Loan Term: ${loanInfo.loanTermYears} years`, 20, currentY)
      currentY += 6
      pdf.text(`Monthly Mortgage Payment: $${monthlyMortgagePayment.toLocaleString()}`, 20, currentY)
      currentY += 15

      // Operating Expenses
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Operating Expenses', 20, currentY)
      currentY += 10

      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Annual Operating Costs: $${operatingExpenses.annualOperatingCosts.toLocaleString()}`, 20, currentY)
      currentY += 6
      pdf.text(`Property Taxes: $${operatingExpenses.propertyTaxes.toLocaleString()}`, 20, currentY)
      currentY += 6
      pdf.text(`Insurance: $${operatingExpenses.insurance.toLocaleString()}`, 20, currentY)
      currentY += 6
      pdf.text(`Property Management: $${operatingExpenses.propertyManagement.toLocaleString()}`, 20, currentY)
      currentY += 6
      pdf.text(`Maintenance: $${operatingExpenses.maintenance.toLocaleString()}`, 20, currentY)
      currentY += 6
      pdf.text(`Utilities: $${operatingExpenses.utilities.toLocaleString()}`, 20, currentY)
      currentY += 6
      pdf.text(`Other: $${operatingExpenses.other.toLocaleString()}`, 20, currentY)
      currentY += 6
      pdf.text(`Vacancy Rate: ${operatingExpenses.vacancyRate}%`, 20, currentY)
      currentY += 15

      // Investment Assumptions
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Investment Assumptions', 20, currentY)
      currentY += 10

      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Annual Appreciation: ${assumptions.annualAppreciation}%`, 20, currentY)
      currentY += 6
      pdf.text(`Annual Rent Increase: ${assumptions.annualRentIncrease}%`, 20, currentY)
      currentY += 6
      pdf.text(`Projection Period: ${assumptions.projectionYears} years`, 20, currentY)
      currentY += 15

      // Key Metrics
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Key Metrics', 20, currentY)
      currentY += 10

      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Cap Rate: ${capRate.toFixed(2)}%`, 20, currentY)
      currentY += 6

      if (projections.length > 0) {
        const totalCashFlow = projections.reduce((sum, p) => sum + p.cashFlow, 0)
        const totalPrincipalPaydown = projections.reduce((sum, p) => sum + p.principalPaydown, 0)
        const totalAppreciation = projections.reduce((sum, p) => sum + p.appreciation, 0)
        const totalReturn = totalCashFlow + totalPrincipalPaydown + totalAppreciation

        pdf.text(`Total Cash Flow (${assumptions.projectionYears} years): $${totalCashFlow.toLocaleString()}`, 20, currentY)
        currentY += 6
        pdf.text(`Total Principal Paydown: $${totalPrincipalPaydown.toLocaleString()}`, 20, currentY)
        currentY += 6
        pdf.text(`Total Appreciation: $${totalAppreciation.toLocaleString()}`, 20, currentY)
        currentY += 6
        pdf.text(`Total Return: $${totalReturn.toLocaleString()}`, 20, currentY)
        currentY += 15
      }

      // Add new page for projections table if we have data
      if (projections.length > 0) {
        pdf.addPage()
        currentY = 20

        pdf.setFontSize(16)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Year-by-Year Projections', 20, currentY)
        currentY += 15

        // Create table headers
        const headers = ['Year', 'Gross Rent', 'Operating Exp.', 'NOI', 'Cash Flow', 'Principal', 'Appreciation', 'Total Return']
        const colWidth = (pageWidth - 40) / headers.length
        
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'bold')
        headers.forEach((header, index) => {
          pdf.text(header, 20 + (index * colWidth), currentY)
        })
        currentY += 8

        // Add table data
        pdf.setFont('helvetica', 'normal')
        projections.forEach((projection) => {
          const row = [
            projection.year.toString(),
            `$${(projection.grossRentalIncome / 1000).toFixed(0)}K`,
            `$${(projection.operatingExpenses / 1000).toFixed(0)}K`,
            `$${(projection.netOperatingIncome / 1000).toFixed(0)}K`,
            `$${(projection.cashFlow / 1000).toFixed(0)}K`,
            `$${(projection.principalPaydown / 1000).toFixed(0)}K`,
            `$${(projection.appreciation / 1000).toFixed(0)}K`,
            `$${(projection.totalReturn / 1000).toFixed(0)}K`
          ]
          
          row.forEach((cell, index) => {
            pdf.text(cell, 20 + (index * colWidth), currentY)
          })
          currentY += 6
        })
      }

      // Footer
      const now = new Date()
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Generated on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`, 20, pageHeight - 10)

      // Save the PDF
      const fileName = `${propertyInfo.name || 'Property'}_Investment_Analysis_${now.toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)

    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button 
      onClick={handleExportToPDF}
      disabled={isExporting}
      variant="outline"
      className="border-blue-600 text-blue-600 hover:bg-blue-50"
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <FileDown className="w-4 h-4 mr-2" />
          Export to PDF
        </>
      )}
    </Button>
  )
}

export const InvestmentCalculator: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Property Investment Calculator</h1>
          <p className="text-muted-foreground">
            Analyze your property investment potential with detailed projections
          </p>
        </div>
        
        <div className="flex gap-3">
          <ExportToPDFButton />
          <SaveConfigurationButton />
        </div>
      </div>

      <PropertyInfoCard />
      <UnitsConfigCard />
      <RehabCard />
      <LoanInfoCard />
      <OperatingExpensesCard />
      <AssumptionsCard />
      <InvestmentResultsCard />
    </div>
  )
}
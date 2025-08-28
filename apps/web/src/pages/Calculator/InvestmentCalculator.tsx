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

  // Helper function to add page header
  const addPageHeader = (pdf: jsPDF, pageNum: number, totalPages: number) => {
    const pageWidth = pdf.internal.pageSize.getWidth()
    
    // Add a subtle header line
    pdf.setDrawColor(59, 130, 246) // blue-500
    pdf.setLineWidth(0.5)
    pdf.line(20, 15, pageWidth - 20, 15)
    
    // Add property name and page number
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(107, 114, 128) // gray-500
    pdf.text(propertyInfo.name || 'Investment Property Analysis', 20, 10)
    pdf.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 20, 10, { align: 'right' })
  }

  // Helper function to add page footer
  const addPageFooter = (pdf: jsPDF) => {
    const pageHeight = pdf.internal.pageSize.getHeight()
    const pageWidth = pdf.internal.pageSize.getWidth()
    
    pdf.setDrawColor(229, 231, 235) // gray-200
    pdf.setLineWidth(0.3)
    pdf.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20)
    
    const now = new Date()
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(107, 114, 128)
    pdf.text(`Generated on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`, 20, pageHeight - 10)
    pdf.text('Created with Real Estate Investment Calculator', pageWidth - 20, pageHeight - 10, { align: 'right' })
  }

  // Helper function to check if we need a new page
  const checkPageBreak = (pdf: jsPDF, currentY: number, spaceNeeded: number = 30): number => {
    const pageHeight = pdf.internal.pageSize.getHeight()
    if (currentY + spaceNeeded > pageHeight - 30) {
      pdf.addPage()
      addPageHeader(pdf, pdf.internal.pages.length - 1, 0) // We'll update total pages later
      return 35 // Start position after header
    }
    return currentY
  }

  // Helper function to add section with styling
  const addSection = (pdf: jsPDF, title: string, currentY: number): number => {
    currentY = checkPageBreak(pdf, currentY, 25)
    
    // Section title with background
    pdf.setFillColor(248, 250, 252) // gray-50
    pdf.rect(20, currentY - 5, pdf.internal.pageSize.getWidth() - 40, 20, 'F')
    
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(30, 41, 59) // slate-800
    pdf.text(title, 25, currentY + 8)
    
    return currentY + 25
  }

  // Helper function to add key-value pair with styling
  const addKeyValue = (pdf: jsPDF, key: string, value: string, currentY: number, isHighlight: boolean = false): number => {
    currentY = checkPageBreak(pdf, currentY)
    
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(75, 85, 99) // gray-600
    pdf.text(`${key}:`, 25, currentY)
    
    pdf.setFont('helvetica', isHighlight ? 'bold' : 'normal')
    if (isHighlight) {
      pdf.setTextColor(30, 41, 59) // slate-800
    } else {
      pdf.setTextColor(17, 24, 39) // gray-900
    }
    pdf.text(value, 120, currentY)
    
    return currentY + 8
  }

  // Helper function to create a custom bar chart for the PDF
  const createROIBarChart = (): string | null => {
    if (projections.length === 0) return null
    
    try {
      const canvas = document.createElement('canvas')
      canvas.width = 800
      canvas.height = 500
      const ctx = canvas.getContext('2d')
      if (!ctx) return null

      // Chart configuration
      const margin = { top: 40, right: 40, bottom: 80, left: 80 }
      const chartWidth = canvas.width - margin.left - margin.right
      const chartHeight = canvas.height - margin.top - margin.bottom

      // Clear canvas with white background
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Get data for key years (1, 5, 10, 20, or max available)
      const keyYears = [1, 5, 10, 20].filter(year => year <= projections.length)
      const initialInvestment = downPayment + totalRehabCost

      const chartData = keyYears.map(year => {
        const yearlyProjections = projections.slice(0, year)
        const totalCashFlow = yearlyProjections.reduce((sum, p) => sum + p.cashFlow, 0)
        const totalPrincipalPaydown = yearlyProjections.reduce((sum, p) => sum + p.principalPaydown, 0)
        const totalAppreciation = yearlyProjections.reduce((sum, p) => sum + p.appreciation, 0)

        // Calculate current investment value for this year
        const yearlyReturns = yearlyProjections.map(p => p.cashFlow + p.principalPaydown + p.appreciation)
        const currentValue = initialInvestment + yearlyReturns.reduce((sum, r) => sum + r, 0)

        // Get the actual year's data for annual ROI
        const thisYearProjection = projections[year - 1]
        const thisYearReturn = thisYearProjection.cashFlow + thisYearProjection.principalPaydown + thisYearProjection.appreciation
        const previousValue = year === 1 ? initialInvestment : (initialInvestment + yearlyReturns.slice(0, -1).reduce((sum, r) => sum + r, 0))

        return {
          year,
          // Cumulative ROI (from initial investment)
          cumulativeCashOnCashROI: initialInvestment > 0 ? (totalCashFlow / initialInvestment) * 100 : 0,
          cumulativeEquityBuildupROI: initialInvestment > 0 ? (totalPrincipalPaydown / initialInvestment) * 100 : 0,
          cumulativeAppreciationROI: initialInvestment > 0 ? (totalAppreciation / initialInvestment) * 100 : 0,
          // Annual ROI (year-over-year)
          annualCashOnCashROI: previousValue > 0 ? (thisYearProjection.cashFlow / previousValue) * 100 : 0,
          annualEquityBuildupROI: previousValue > 0 ? (thisYearProjection.principalPaydown / previousValue) * 100 : 0,
          annualAppreciationROI: previousValue > 0 ? (thisYearProjection.appreciation / previousValue) * 100 : 0,
          annualTotalROI: previousValue > 0 ? (thisYearReturn / previousValue) * 100 : 0,
          currentValue
        }
      })

      // Find max value for scaling
      const maxValue = Math.max(
        ...chartData.map(d => d.cumulativeCashOnCashROI + d.cumulativeEquityBuildupROI + d.cumulativeAppreciationROI)
      )
      const minValue = Math.min(0, ...chartData.map(d => d.cumulativeCashOnCashROI))
      const valueRange = maxValue - minValue
      const scale = chartHeight / (valueRange * 1.1) // 10% padding

      // Draw title
      ctx.fillStyle = '#1f2937'
      ctx.font = 'bold 24px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('ROI Analysis by Time Period', canvas.width / 2, 30)

      // Draw axes
      ctx.strokeStyle = '#d1d5db'
      ctx.lineWidth = 1
      
      // Y-axis
      ctx.beginPath()
      ctx.moveTo(margin.left, margin.top)
      ctx.lineTo(margin.left, margin.top + chartHeight)
      ctx.stroke()
      
      // X-axis (at zero line)
      const zeroY = margin.top + chartHeight - (0 - minValue) * scale
      ctx.beginPath()
      ctx.moveTo(margin.left, zeroY)
      ctx.lineTo(margin.left + chartWidth, zeroY)
      ctx.stroke()

      // Draw bars
      const barWidth = chartWidth / (chartData.length * 1.5)
      const barSpacing = barWidth * 0.5

      chartData.forEach((data, index) => {
        const x = margin.left + (index * (barWidth + barSpacing)) + barSpacing

        // Calculate bar heights and positions
        const cashFlowHeight = Math.abs(data.cumulativeCashOnCashROI) * scale
        const equityHeight = data.cumulativeEquityBuildupROI * scale
        const appreciationHeight = data.cumulativeAppreciationROI * scale

        let currentY = zeroY

        // Draw cash flow bar (can be negative)
        if (data.cumulativeCashOnCashROI < 0) {
          ctx.fillStyle = '#ef4444' // red for negative
          ctx.fillRect(x, currentY, barWidth, cashFlowHeight)
          currentY += cashFlowHeight
        } else {
          currentY -= cashFlowHeight
          ctx.fillStyle = '#10b981' // green for positive
          ctx.fillRect(x, currentY, barWidth, cashFlowHeight)
        }

        // Draw equity buildup bar (always positive, stacked)
        if (data.cumulativeCashOnCashROI >= 0) {
          currentY -= equityHeight
        } else {
          currentY = zeroY - equityHeight
        }
        ctx.fillStyle = '#3b82f6' // blue
        ctx.fillRect(x, currentY, barWidth, equityHeight)

        // Draw appreciation bar (always positive, stacked)
        currentY -= appreciationHeight
        ctx.fillStyle = '#f59e0b' // yellow
        ctx.fillRect(x, currentY, barWidth, appreciationHeight)

        // Draw year label
        ctx.fillStyle = '#374151'
        ctx.font = '14px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(`${data.year} Year${data.year > 1 ? 's' : ''}`, x + barWidth / 2, canvas.height - 40)

        // Draw total ROI label
        const totalROI = data.cumulativeCashOnCashROI + data.cumulativeEquityBuildupROI + data.cumulativeAppreciationROI
        ctx.fillStyle = '#1f2937'
        ctx.font = 'bold 12px Arial'
        ctx.fillText(`${totalROI.toFixed(1)}%`, x + barWidth / 2, currentY - 10)
      })

      // Draw Y-axis labels
      ctx.fillStyle = '#6b7280'
      ctx.font = '12px Arial'
      ctx.textAlign = 'right'
      
      for (let i = 0; i <= 10; i++) {
        const value = minValue + (valueRange * i / 10)
        const y = margin.top + chartHeight - (value - minValue) * scale
        ctx.fillText(`${value.toFixed(0)}%`, margin.left - 10, y + 4)
        
        // Draw grid lines
        ctx.strokeStyle = '#f3f4f6'
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(margin.left, y)
        ctx.lineTo(margin.left + chartWidth, y)
        ctx.stroke()
      }

      // Draw legend
      const legendY = canvas.height - 25
      const legendItems = [
        { color: '#ef4444', label: 'Cash-on-Cash' },
        { color: '#3b82f6', label: 'Equity Build-up' },
        { color: '#f59e0b', label: 'Appreciation' }
      ]

      let legendX = margin.left
      legendItems.forEach(item => {
        ctx.fillStyle = item.color
        ctx.fillRect(legendX, legendY - 8, 12, 12)
        
        ctx.fillStyle = '#374151'
        ctx.font = '12px Arial'
        ctx.textAlign = 'left'
        ctx.fillText(item.label, legendX + 16, legendY)
        
        legendX += ctx.measureText(item.label).width + 40
      })

      return canvas.toDataURL('image/png', 0.9)
    } catch (error) {
      console.warn('Could not create ROI bar chart:', error)
      return null
    }
  }

  const handleExportToPDF = async () => {
    if (!propertyInfo.name && !propertyInfo.address) {
      alert('Please enter property information before exporting')
      return
    }

    setIsExporting(true)
    try {
      // Create the ROI bar chart
      const roiChartImage = createROIBarChart()
      
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      let currentY = 30

      // Title Page
      pdf.setFillColor(59, 130, 246) // blue-500
      pdf.rect(0, 0, pageWidth, 60, 'F')
      
      pdf.setFontSize(28)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(255, 255, 255)
      pdf.text('Investment Property', pageWidth / 2, 25, { align: 'center' })
      pdf.text('Analysis Report', pageWidth / 2, 45, { align: 'center' })
      
      // Property name and address prominently displayed
      currentY = 80
      pdf.setFontSize(20)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(30, 41, 59)
      pdf.text(propertyInfo.name || 'Property Investment', pageWidth / 2, currentY, { align: 'center' })
      
      if (propertyInfo.address) {
        currentY += 10
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(107, 114, 128)
        pdf.text(propertyInfo.address, pageWidth / 2, currentY, { align: 'center' })
      }

      // Key Metrics Summary Box
      currentY += 30
      pdf.setFillColor(254, 249, 195) // yellow-100
      pdf.setDrawColor(251, 191, 36) // yellow-400
      pdf.setLineWidth(1)
      pdf.rect(30, currentY, pageWidth - 60, 50, 'FD')
      
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(146, 64, 14) // yellow-800
      pdf.text('Key Investment Metrics', pageWidth / 2, currentY + 12, { align: 'center' })
      
      // Key metrics in two columns
      const leftCol = 40
      const rightCol = pageWidth / 2 + 10
      currentY += 25
      
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(120, 53, 15) // yellow-700
      
      pdf.text(`Purchase Price: $${propertyInfo.price.toLocaleString()}`, leftCol, currentY)
      pdf.text(`Cap Rate: ${capRate.toFixed(2)}%`, rightCol, currentY)
      
      currentY += 8
      pdf.text(`Monthly Rent: $${adjustedMonthlyRent.toLocaleString()}`, leftCol, currentY)
      pdf.text(`Down Payment: $${downPayment.toLocaleString()}`, rightCol, currentY)
      
      // Add ROI metrics if projections are available
      if (projections.length > 0) {
        const initialInvestment = downPayment + totalRehabCost
        const totalCashFlowSummary = projections.reduce((sum, p) => sum + p.cashFlow, 0)
        currentY += 8
        
        // Calculate 1-year ROI for title page
        if (projections.length >= 1) {
          const year1Projection = projections[0]
          const year1Return = year1Projection.cashFlow + year1Projection.principalPaydown + year1Projection.appreciation
          const year1ROI = initialInvestment > 0 ? ((year1Return / initialInvestment) * 100) : 0
          const year1CashOnCash = initialInvestment > 0 ? ((year1Projection.cashFlow / initialInvestment) * 100) : 0
          
          if (year1Projection.cashFlow >= 0) {
            pdf.text(`1-Year ROI: ${year1ROI.toFixed(1)}%`, leftCol, currentY)
          } else {
            pdf.setTextColor(185, 28, 28) // red-700
            pdf.text(`1-Year Cash Flow: ${year1CashOnCash.toFixed(1)}%`, leftCol, currentY)
            pdf.setTextColor(120, 53, 15) // reset to yellow-700
          }
        }
        
        // Calculate 5-year ROI for title page
        if (projections.length >= 5) {
          const period5Projections = projections.slice(0, 5)
          const period5Return = period5Projections.reduce((sum, p) => sum + p.cashFlow + p.principalPaydown + p.appreciation, 0)
          const period5ROI = initialInvestment > 0 ? ((period5Return / initialInvestment) * 100) : 0
          const period5CashFlow = period5Projections.reduce((sum, p) => sum + p.cashFlow, 0)
          const period5CashOnCash = initialInvestment > 0 ? ((period5CashFlow / initialInvestment) * 100) : 0
          
          if (period5CashFlow >= 0) {
            pdf.text(`5-Year ROI: ${period5ROI.toFixed(1)}%`, rightCol, currentY)
          } else {
            pdf.setTextColor(185, 28, 28) // red-700
            pdf.text(`5-Year Cash Flow: ${period5CashOnCash.toFixed(1)}%`, rightCol, currentY)
            pdf.setTextColor(120, 53, 15) // reset to yellow-700
          }
        }
        
        // Add warning banner for negative cash flow properties
        if (totalCashFlowSummary < 0) {
          currentY += 15
          pdf.setFillColor(254, 242, 242) // red-50
          pdf.setDrawColor(248, 113, 113) // red-400
          pdf.setLineWidth(2)
          pdf.rect(30, currentY, pageWidth - 60, 15, 'FD')
          
          pdf.setFontSize(12)
          pdf.setFont('helvetica', 'bold')
          pdf.setTextColor(185, 28, 28) // red-700
          pdf.text('⚠ NEGATIVE CASH FLOW PROPERTY', pageWidth / 2, currentY + 10, { align: 'center' })
          pdf.setTextColor(120, 53, 15) // reset color
        }
      }

      // Start new page for detailed sections
      pdf.addPage()
      currentY = 25
      addPageHeader(pdf, 2, 0)

      // Property Information Section
      currentY = addSection(pdf, 'Property Information', currentY)
      currentY = addKeyValue(pdf, 'Property Name', propertyInfo.name || 'N/A', currentY, true)
      currentY = addKeyValue(pdf, 'Address', propertyInfo.address || 'N/A', currentY)
      currentY = addKeyValue(pdf, 'Purchase Price', `$${propertyInfo.price.toLocaleString()}`, currentY, true)
      currentY += 10

      // Units Configuration Section
      if (units.length > 0) {
        currentY = addSection(pdf, 'Units Configuration', currentY)
        units.forEach((unit, index) => {
          currentY = addKeyValue(pdf, `Unit ${index + 1}`, `${unit.quantity}x ${unit.type} - $${unit.monthlyRent.toLocaleString()}/month`, currentY)
        })
        currentY = addKeyValue(pdf, 'Base Monthly Rent', `$${totalMonthlyRent.toLocaleString()}`, currentY, true)
        if (rehabInfo.enabled && adjustedMonthlyRent !== totalMonthlyRent) {
          currentY = addKeyValue(pdf, 'Adjusted Monthly Rent (after rehab)', `$${adjustedMonthlyRent.toLocaleString()}`, currentY, true)
        }
        currentY += 10
      }

      // Rehab Information Section
      if (rehabInfo.enabled && totalRehabCost > 0) {
        currentY = addSection(pdf, 'Rehab & Renovation', currentY)
        rehabInfo.items.forEach((item) => {
          if (item.category && item.cost > 0) {
            currentY = addKeyValue(pdf, item.category, `$${item.cost.toLocaleString()}`, currentY)
          }
        })
        currentY = addKeyValue(pdf, 'Total Rehab Cost', `$${totalRehabCost.toLocaleString()}`, currentY, true)
        currentY = addKeyValue(pdf, 'Expected Rent Increase', `${rehabInfo.rentIncreasePercentage}%`, currentY, true)
        currentY += 10
      }

      // Financing Details Section
      currentY = addSection(pdf, 'Financing Details', currentY)
      currentY = addKeyValue(pdf, 'Down Payment', `$${downPayment.toLocaleString()}`, currentY, true)
      currentY = addKeyValue(pdf, 'Loan Amount', `$${loanAmount.toLocaleString()}`, currentY, true)
      currentY = addKeyValue(pdf, 'Interest Rate', `${loanInfo.interestRate}%`, currentY)
      currentY = addKeyValue(pdf, 'Loan Term', `${loanInfo.loanTermYears} years`, currentY)
      currentY = addKeyValue(pdf, 'Monthly Mortgage Payment', `$${monthlyMortgagePayment.toLocaleString()}`, currentY, true)
      currentY += 10

      // Operating Expenses Section
      currentY = addSection(pdf, 'Operating Expenses', currentY)
      currentY = addKeyValue(pdf, 'Annual Operating Costs', `$${operatingExpenses.annualOperatingCosts.toLocaleString()}`, currentY, true)
      currentY = addKeyValue(pdf, 'Property Taxes', `$${operatingExpenses.propertyTaxes.toLocaleString()}`, currentY)
      currentY = addKeyValue(pdf, 'Insurance', `$${operatingExpenses.insurance.toLocaleString()}`, currentY)
      currentY = addKeyValue(pdf, 'Property Management', `$${operatingExpenses.propertyManagement.toLocaleString()}`, currentY)
      currentY = addKeyValue(pdf, 'Maintenance', `$${operatingExpenses.maintenance.toLocaleString()}`, currentY)
      currentY = addKeyValue(pdf, 'Utilities', `$${operatingExpenses.utilities.toLocaleString()}`, currentY)
      currentY = addKeyValue(pdf, 'Other', `$${operatingExpenses.other.toLocaleString()}`, currentY)
      currentY = addKeyValue(pdf, 'Vacancy Rate', `${operatingExpenses.vacancyRate}%`, currentY)
      currentY += 10

      // Investment Assumptions Section
      currentY = addSection(pdf, 'Investment Assumptions', currentY)
      currentY = addKeyValue(pdf, 'Annual Appreciation', `${assumptions.annualAppreciation}%`, currentY)
      currentY = addKeyValue(pdf, 'Annual Rent Increase', `${assumptions.annualRentIncrease}%`, currentY)
      currentY = addKeyValue(pdf, 'Projection Period', `${assumptions.projectionYears} years`, currentY)
      currentY += 10

              // Investment Performance Summary
        if (projections.length > 0) {
          const totalCashFlow = projections.reduce((sum, p) => sum + p.cashFlow, 0)
          const totalPrincipalPaydown = projections.reduce((sum, p) => sum + p.principalPaydown, 0)
          const totalAppreciation = projections.reduce((sum, p) => sum + p.appreciation, 0)
          const totalReturn = totalCashFlow + totalPrincipalPaydown + totalAppreciation
          const initialInvestment = downPayment + totalRehabCost

          currentY = addSection(pdf, 'Investment Performance Summary', currentY)
          currentY = addKeyValue(pdf, 'Initial Investment', `$${initialInvestment.toLocaleString()}`, currentY, true)
          
          // Cash Flow Analysis with Warning for Negative Cash Flow
          currentY = addKeyValue(pdf, `Total Cash Flow (${assumptions.projectionYears} years)`, `$${totalCashFlow.toLocaleString()}`, currentY, true)
          
          if (totalCashFlow < 0) {
            currentY = checkPageBreak(pdf, currentY, 15)
            pdf.setFillColor(254, 242, 242) // red-50
            pdf.setDrawColor(248, 113, 113) // red-400
            pdf.setLineWidth(1)
            pdf.rect(25, currentY - 3, pdf.internal.pageSize.getWidth() - 50, 12, 'FD')
            
            pdf.setFontSize(10)
            pdf.setFont('helvetica', 'bold')
            pdf.setTextColor(185, 28, 28) // red-700
            pdf.text('⚠ WARNING: Negative Cash Flow - You will pay money monthly to hold this property', 30, currentY + 4)
            currentY += 15
          }
          
          currentY = addKeyValue(pdf, 'Total Principal Paydown', `$${totalPrincipalPaydown.toLocaleString()}`, currentY, true)
          currentY = addKeyValue(pdf, 'Total Appreciation', `$${totalAppreciation.toLocaleString()}`, currentY, true)
          currentY = addKeyValue(pdf, 'Total Return', `$${totalReturn.toLocaleString()}`, currentY, true)
          
          const roi = initialInvestment > 0 ? ((totalReturn / initialInvestment) * 100) : 0
          currentY = addKeyValue(pdf, `Total ROI (${assumptions.projectionYears} years)`, `${roi.toFixed(1)}%`, currentY, true)
        
                 // Add separate Cash-on-Cash Return analysis
         currentY += 5
         pdf.setFontSize(12)
         pdf.setFont('helvetica', 'bold')
         pdf.setTextColor(75, 85, 99) // gray-600
         pdf.text('Return Analysis Breakdown:', 25, currentY)
         currentY += 8
         
         // Cash-on-Cash Return (actual cash flow only)
         const cashOnCashROI = initialInvestment > 0 ? ((totalCashFlow / initialInvestment) * 100) : 0
         currentY = addKeyValue(pdf, 'Cash-on-Cash Return', `${cashOnCashROI.toFixed(1)}% (actual cash flow only)`, currentY, totalCashFlow >= 0)
         
         // Equity-based returns (forced savings)
         const equityROI = initialInvestment > 0 ? ((totalPrincipalPaydown / initialInvestment) * 100) : 0
         currentY = addKeyValue(pdf, 'Equity Build-up Return', `${equityROI.toFixed(1)}% (forced savings via mortgage)`, currentY)
         
         // Appreciation-based returns (unrealized gains)
         const appreciationROI = initialInvestment > 0 ? ((totalAppreciation / initialInvestment) * 100) : 0
         currentY = addKeyValue(pdf, 'Appreciation Return', `${appreciationROI.toFixed(1)}% (unrealized gains)`, currentY)
         
         currentY += 5
         
         // Calculate ROI for specific time periods
         const roiPeriods = [1, 5, 10, 20]
         
         // Add ROI breakdown section
         pdf.setFontSize(12)
         pdf.setFont('helvetica', 'bold')
         pdf.setTextColor(75, 85, 99) // gray-600
         pdf.text('Total ROI by Time Period:', 25, currentY)
         currentY += 8
         
         roiPeriods.forEach(years => {
           if (years <= projections.length) {
             const periodProjections = projections.slice(0, years)
             const periodCashFlow = periodProjections.reduce((sum, p) => sum + p.cashFlow, 0)
             const periodPrincipalPaydown = periodProjections.reduce((sum, p) => sum + p.principalPaydown, 0)
             const periodAppreciation = periodProjections.reduce((sum, p) => sum + p.appreciation, 0)
             const periodTotalReturn = periodCashFlow + periodPrincipalPaydown + periodAppreciation
             const periodROI = initialInvestment > 0 ? ((periodTotalReturn / initialInvestment) * 100) : 0
             const periodCashOnCash = initialInvestment > 0 ? ((periodCashFlow / initialInvestment) * 100) : 0
             
             currentY = addKeyValue(pdf, `${years} Year${years > 1 ? 's' : ''} Total`, `${periodROI.toFixed(1)}%`, currentY)
             currentY = addKeyValue(pdf, `${years} Year${years > 1 ? 's' : ''} Cash-on-Cash`, `${periodCashOnCash.toFixed(1)}%`, currentY, periodCashFlow >= 0)
             currentY += 3
           }
         })
        
        currentY += 10
      }

            // Add ROI chart if available
      if (roiChartImage) {
        pdf.addPage()
        currentY = 25
        addPageHeader(pdf, pdf.internal.pages.length - 1, 0)
        
        currentY = addSection(pdf, 'ROI Analysis by Time Period', currentY)
        currentY += 10

        currentY = checkPageBreak(pdf, currentY, 120)
        
        // Add chart description
        pdf.setFontSize(11)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(75, 85, 99)
        pdf.text('Stacked bar chart showing ROI components for key investment periods', 25, currentY)
        currentY += 15

        try {
          const imgWidth = pageWidth - 40
          const imgHeight = 100
          pdf.addImage(roiChartImage, 'PNG', 20, currentY, imgWidth, imgHeight)
          currentY += imgHeight + 15
          
          // Add ROI component legend
          pdf.setFontSize(10)
          pdf.setFont('helvetica', 'bold')
          pdf.setTextColor(75, 85, 99)
          pdf.text('ROI Components:', 25, currentY)
          currentY += 8
          
          pdf.setFontSize(9)
          pdf.setFont('helvetica', 'normal')
          pdf.setTextColor(239, 68, 68) // red-500
          pdf.text('● Cash-on-Cash Return: Actual cash in your pocket', 25, currentY)
          currentY += 6
          
          pdf.setTextColor(59, 130, 246) // blue-500
          pdf.text('● Equity Build-up Return: Forced savings via mortgage', 25, currentY)
          currentY += 6
          
          pdf.setTextColor(245, 158, 11) // yellow-500
          pdf.text('● Appreciation Return: Unrealized gains', 25, currentY)
          currentY += 6
          
          pdf.setTextColor(16, 185, 129) // green-500
          pdf.text('● Total ROI: Combined return', 25, currentY)
          
        } catch (error) {
          console.warn('Could not add ROI chart to PDF:', error)
        }
      }

      // Add projections table on new page
      if (projections.length > 0) {
        pdf.addPage()
        currentY = 25
        addPageHeader(pdf, pdf.internal.pages.length - 1, 0)

        currentY = addSection(pdf, 'Year-by-Year Projections', currentY)
        currentY += 10

        // Enhanced table with better formatting
        const headers = ['Year', 'Gross Rent', 'Operating Exp.', 'NOI', 'Cash Flow', 'Principal', 'Appreciation', 'Total Return']
        const colWidth = (pageWidth - 40) / headers.length
        
        // Table header with background
        pdf.setFillColor(239, 246, 255) // blue-50
        pdf.rect(20, currentY - 5, pageWidth - 40, 12, 'F')
        
        pdf.setFontSize(9)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(30, 58, 138) // blue-800
        headers.forEach((header, index) => {
          pdf.text(header, 25 + (index * colWidth), currentY + 3)
        })
        currentY += 15

        // Table rows with alternating colors
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(17, 24, 39) // gray-900
        
        projections.forEach((projection, rowIndex) => {
          currentY = checkPageBreak(pdf, currentY, 8)
          
          // Alternating row colors
          if (rowIndex % 2 === 0) {
            pdf.setFillColor(249, 250, 251) // gray-50
            pdf.rect(20, currentY - 3, pageWidth - 40, 8, 'F')
          }

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
            // Color negative cash flow values in red
            if (index === 4 && projection.cashFlow < 0) {
              pdf.setTextColor(220, 38, 38) // red-600
            } else {
              pdf.setTextColor(17, 24, 39) // gray-900
            }
            pdf.text(cell, 25 + (index * colWidth), currentY)
          })
          currentY += 8
        })
      }

      // Add footers to all pages
      const totalPages = pdf.internal.pages.length - 1
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i)
        addPageFooter(pdf)
        if (i > 1) {
          // Update page headers with correct total pages
          pdf.setFontSize(10)
          pdf.setFont('helvetica', 'normal')
          pdf.setTextColor(107, 114, 128)
          pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 20, 10, { align: 'right' })
        }
      }

      // Save the PDF with a professional filename
      const now = new Date()
      const dateStr = now.toISOString().split('T')[0]
      const propertyName = propertyInfo.name ? propertyInfo.name.replace(/[^a-zA-Z0-9]/g, '_') : 'Property'
      const fileName = `${propertyName}_Investment_Analysis_${dateStr}.pdf`
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
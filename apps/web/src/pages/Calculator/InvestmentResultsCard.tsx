import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  ReferenceLine,
  Area,
  AreaChart,
  Cell
} from 'recharts'
import { useProjections, useAssumptions, useDownPayment, useTotalRehabCost } from '@/stores/investment-calculator-store'

// Custom tooltip component with enhanced formatting
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900">{`Year ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            <span className="font-medium">{entry.name}:</span>{' '}
            <span className={entry.value >= 0 ? 'text-green-600' : 'text-red-600'}>
              {entry.value >= 0 ? '+' : ''}${entry.value.toLocaleString()}
            </span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

// Custom Y-axis tick formatter
const formatYAxisTick = (value: number) => {
  if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  } else if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`
  }
  return `$${value.toLocaleString()}`
}

// Custom cell color function for cash flow bars
const getCashFlowColor = (value: number) => {
  if (value > 0) return '#22c55e' // green-500
  if (value < 0) return '#ef4444' // red-500
  return '#6b7280' // gray-500
}

export const InvestmentResultsCard: React.FC = () => {
  const projections = useProjections()
  const assumptions = useAssumptions()
  const downPayment = useDownPayment()
  const totalRehabCost = useTotalRehabCost()

  if (projections.length === 0) {
    return null
  }

  const initialInvestment = downPayment + totalRehabCost

  // Prepare data with additional formatting and both cumulative and annual ROI calculations
  let cumulativeCashFlow = 0
  let cumulativePrincipalPaydown = 0
  let cumulativeAppreciation = 0
  let currentInvestmentValue = initialInvestment

  const chartData = projections.map((projection) => {
    // Calculate cumulative values
    cumulativeCashFlow += projection.cashFlow
    cumulativePrincipalPaydown += projection.principalPaydown
    cumulativeAppreciation += projection.appreciation

    // Calculate cumulative ROI percentages (from initial investment)
    const cumulativeCashOnCashROI = initialInvestment > 0 ? (cumulativeCashFlow / initialInvestment) * 100 : 0
    const cumulativeEquityBuildupROI = initialInvestment > 0 ? (cumulativePrincipalPaydown / initialInvestment) * 100 : 0
    const cumulativeAppreciationROI = initialInvestment > 0 ? (cumulativeAppreciation / initialInvestment) * 100 : 0
    const cumulativeTotalROI = cumulativeCashOnCashROI + cumulativeEquityBuildupROI + cumulativeAppreciationROI

    // Calculate annual ROI percentages (year-over-year based on current investment value)
    const yearlyReturn = projection.cashFlow + projection.principalPaydown + projection.appreciation
    const annualROI = currentInvestmentValue > 0 ? (yearlyReturn / currentInvestmentValue) * 100 : 0
    const annualCashOnCashROI = currentInvestmentValue > 0 ? (projection.cashFlow / currentInvestmentValue) * 100 : 0
    const annualEquityBuildupROI = currentInvestmentValue > 0 ? (projection.principalPaydown / currentInvestmentValue) * 100 : 0
    const annualAppreciationROI = currentInvestmentValue > 0 ? (projection.appreciation / currentInvestmentValue) * 100 : 0

    // Update investment value for next year (current value + this year's return)
    currentInvestmentValue += yearlyReturn

    return {
      ...projection,
      formattedCashFlow: projection.cashFlow >= 0 ? projection.cashFlow : projection.cashFlow,
      isCashFlowPositive: projection.cashFlow >= 0,
      // Cumulative values
      cumulativeCashFlow,
      cumulativePrincipalPaydown,
      cumulativeAppreciation,
      cumulativeTotalReturn: cumulativeCashFlow + cumulativePrincipalPaydown + cumulativeAppreciation,
      // Cumulative ROI percentages (from initial investment)
      cashOnCashROI: Number(cumulativeCashOnCashROI.toFixed(1)),
      equityBuildupROI: Number(cumulativeEquityBuildupROI.toFixed(1)),
      appreciationROI: Number(cumulativeAppreciationROI.toFixed(1)),
      totalROI: Number(cumulativeTotalROI.toFixed(1)),
      // Annual ROI percentages (year-over-year)
      annualROI: Number(annualROI.toFixed(1)),
      annualCashOnCashROI: Number(annualCashOnCashROI.toFixed(1)),
      annualEquityBuildupROI: Number(annualEquityBuildupROI.toFixed(1)),
      annualAppreciationROI: Number(annualAppreciationROI.toFixed(1)),
      // Investment value tracking
      currentInvestmentValue: Number(currentInvestmentValue.toFixed(0)),
      yearlyReturn: Number(yearlyReturn.toFixed(0))
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Projections</CardTitle>
        <CardDescription>
          {assumptions.projectionYears}-year analysis of your investment performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chart">Chart View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="space-y-8">
            <div className="space-y-8">
              {/* Cash Flow Chart with Reference Line */}
              <div>
                <h4 className="text-lg font-semibold mb-2">Cash Flow Analysis</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Annual cash flow and net operating income with breakeven reference
                </p>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#d1d5db' }}
                    />
                    <YAxis 
                      tickFormatter={formatYAxisTick}
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#d1d5db' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    
                    {/* Zero reference line for cash flow */}
                    <ReferenceLine 
                      y={0} 
                      stroke="#6b7280" 
                      strokeDasharray="5 5" 
                      label={{ value: "Breakeven", position: "insideTopRight" }}
                    />
                    
                    <Line 
                      type="monotone" 
                      dataKey="cashFlow" 
                      stroke="#3b82f6" 
                      name="Annual Cash Flow"
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="netOperatingIncome" 
                      stroke="#10b981" 
                      name="Net Operating Income"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Enhanced Cash Flow Bar Chart */}
              <div>
                <h4 className="text-lg font-semibold mb-2">Annual Cash Flow Breakdown</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Color-coded cash flow by year (green: positive, red: negative)
                </p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#d1d5db' }}
                    />
                    <YAxis 
                      tickFormatter={formatYAxisTick}
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#d1d5db' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    
                    {/* Zero reference line */}
                    <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="2 2" />
                    
                    <Bar dataKey="cashFlow" name="Annual Cash Flow" radius={[2, 2, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getCashFlowColor(entry.cashFlow)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Cumulative Returns Area Chart */}
              <div>
                <h4 className="text-lg font-semibold mb-2">Cumulative Returns Breakdown</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Stacked area chart showing how your total returns accumulate over time
                </p>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#d1d5db' }}
                    />
                    <YAxis 
                      tickFormatter={formatYAxisTick}
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#d1d5db' }}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                              <p className="font-semibold text-gray-900">{`Year ${label}`}</p>
                              {payload.map((entry: any, index: number) => (
                                <p key={index} style={{ color: entry.color }} className="text-sm">
                                  <span className="font-medium">{entry.name}:</span>{' '}
                                  <span className={entry.value >= 0 ? 'text-green-600' : 'text-red-600'}>
                                    {entry.value >= 0 ? '+' : ''}${entry.value.toLocaleString()}
                                  </span>
                                </p>
                              ))}
                              <div className="border-t pt-2 mt-2">
                                <p className="text-xs text-gray-500">
                                  Cumulative values from start of investment
                                </p>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Legend />
                    
                    {/* Zero reference line */}
                    <ReferenceLine 
                      y={0} 
                      stroke="#6b7280" 
                      strokeDasharray="5 5" 
                      label={{ value: "Breakeven", position: "insideTopRight" }}
                    />
                    
                    <Area 
                      type="monotone" 
                      dataKey="cumulativeCashFlow" 
                      stackId="1" 
                      stroke="#ef4444" 
                      fill="#ef4444" 
                      fillOpacity={0.7}
                      name="Cumulative Cash Flow"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="cumulativePrincipalPaydown" 
                      stackId="1" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.7}
                      name="Cumulative Principal Paydown"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="cumulativeAppreciation" 
                      stackId="1" 
                      stroke="#f59e0b" 
                      fill="#f59e0b" 
                      fillOpacity={0.7}
                      name="Cumulative Appreciation"
                    />
                  </AreaChart>
                </ResponsiveContainer>
                
                {/* Enhanced legend with running totals */}
                <div className="mt-4 text-sm">
                  <p className="font-medium text-gray-700 mb-2">Understanding Cumulative Returns:</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 bg-opacity-70"></div>
                      <span><strong>Cash Flow:</strong> Money in/out of pocket</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 bg-opacity-70"></div>
                      <span><strong>Principal Paydown:</strong> Loan balance reduction</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 bg-opacity-70"></div>
                      <span><strong>Appreciation:</strong> Property value increase</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Annual ROI Analysis Chart */}
              <div>
                <h4 className="text-lg font-semibold mb-2">Annual ROI Analysis</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Year-over-year returns based on current investment value (like stock returns)
                </p>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#d1d5db' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#d1d5db' }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                              <p className="font-semibold text-gray-900">{`Year ${label}`}</p>
                              <p className="text-sm text-gray-600 mb-2">
                                Investment Value: ${data.currentInvestmentValue.toLocaleString()}
                              </p>
                              {payload.map((entry: any, index: number) => (
                                <p key={index} style={{ color: entry.color }} className="text-sm">
                                  <span className="font-medium">{entry.name}:</span>{' '}
                                  <span className={entry.value >= 0 ? 'text-green-600' : 'text-red-600'}>
                                    {entry.value >= 0 ? '+' : ''}{entry.value}%
                                  </span>
                                </p>
                              ))}
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Legend />
                    
                    {/* Zero reference line */}
                    <ReferenceLine 
                      y={0} 
                      stroke="#6b7280" 
                      strokeDasharray="5 5" 
                      label={{ value: "Breakeven", position: "insideTopRight" }}
                    />
                    
                    {/* Annual Cash-on-Cash Return */}
                    <Line 
                      type="monotone" 
                      dataKey="annualCashOnCashROI" 
                      stroke="#ef4444" 
                      name="Annual Cash-on-Cash"
                      strokeWidth={3}
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
                    />
                    
                    {/* Annual Equity Build-up Return */}
                    <Line 
                      type="monotone" 
                      dataKey="annualEquityBuildupROI" 
                      stroke="#3b82f6" 
                      name="Annual Equity Build-up"
                      strokeWidth={2}
                      strokeDasharray="8 4"
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                    />
                    
                    {/* Annual Appreciation Return */}
                    <Line 
                      type="monotone" 
                      dataKey="annualAppreciationROI" 
                      stroke="#f59e0b" 
                      name="Annual Appreciation"
                      strokeWidth={2}
                      strokeDasharray="12 4"
                      dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
                    />
                    
                    {/* Total Annual ROI */}
                    <Line 
                      type="monotone" 
                      dataKey="annualROI" 
                      stroke="#10b981" 
                      name="Total Annual ROI"
                      strokeWidth={4}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                
                {/* Annual ROI Component Legend with Explanations */}
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <h5 className="font-medium text-yellow-900 mb-2">Understanding Annual ROI:</h5>
                  <p className="text-sm text-yellow-800 mb-3">
                    Annual ROI calculates each year's return based on your current investment value, similar to stock returns. 
                    This accounts for compounding and reinvestment scenarios.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-0.5 bg-red-500"></div>
                      <div>
                        <p className="font-medium text-red-600">Annual Cash-on-Cash</p>
                        <p className="text-xs text-gray-500">This year's cash flow vs. current value</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-0.5 bg-blue-500 border-dashed border-b-2"></div>
                      <div>
                        <p className="font-medium text-blue-600">Annual Equity Build-up</p>
                        <p className="text-xs text-gray-500">This year's principal vs. current value</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-0.5 bg-yellow-500 border-dashed border-b-2"></div>
                      <div>
                        <p className="font-medium text-yellow-600">Annual Appreciation</p>
                        <p className="text-xs text-gray-500">This year's appreciation vs. current value</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-1 bg-green-500 rounded"></div>
                      <div>
                        <p className="font-medium text-green-600">Total Annual ROI</p>
                        <p className="text-xs text-gray-500">Combined annual return</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cumulative ROI Analysis Chart */}
              <div>
                <h4 className="text-lg font-semibold mb-2">Cumulative ROI Analysis</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Total returns from initial investment (traditional real estate analysis)
                </p>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#d1d5db' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#d1d5db' }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                              <p className="font-semibold text-gray-900">{`Year ${label}`}</p>
                              {payload.map((entry: any, index: number) => (
                                <p key={index} style={{ color: entry.color }} className="text-sm">
                                  <span className="font-medium">{entry.name}:</span>{' '}
                                  <span className={entry.value >= 0 ? 'text-green-600' : 'text-red-600'}>
                                    {entry.value >= 0 ? '+' : ''}{entry.value}%
                                  </span>
                                </p>
                              ))}
                              <div className="border-t pt-2 mt-2">
                                <p className="text-xs text-gray-500">
                                  Initial Investment: ${initialInvestment.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Legend />
                    
                    {/* Zero reference line */}
                    <ReferenceLine 
                      y={0} 
                      stroke="#6b7280" 
                      strokeDasharray="5 5" 
                      label={{ value: "Breakeven", position: "insideTopRight" }}
                    />
                    
                    {/* Cash-on-Cash Return (actual cash flow) */}
                    <Line 
                      type="monotone" 
                      dataKey="cashOnCashROI" 
                      stroke="#ef4444" 
                      name="Cash-on-Cash Return"
                      strokeWidth={3}
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
                    />
                    
                    {/* Equity Build-up Return (forced savings) */}
                    <Line 
                      type="monotone" 
                      dataKey="equityBuildupROI" 
                      stroke="#3b82f6" 
                      name="Equity Build-up Return"
                      strokeWidth={2}
                      strokeDasharray="8 4"
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                    />
                    
                    {/* Appreciation Return (unrealized gains) */}
                    <Line 
                      type="monotone" 
                      dataKey="appreciationROI" 
                      stroke="#f59e0b" 
                      name="Appreciation Return"
                      strokeWidth={2}
                      strokeDasharray="12 4"
                      dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
                    />
                    
                    {/* Total ROI */}
                    <Line 
                      type="monotone" 
                      dataKey="totalROI" 
                      stroke="#10b981" 
                      name="Total ROI"
                      strokeWidth={4}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                
                {/* ROI Component Legend with Explanations */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-0.5 bg-red-500"></div>
                    <div>
                      <p className="font-medium text-red-600">Cash-on-Cash Return</p>
                      <p className="text-xs text-gray-500">Actual cash in your pocket</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-0.5 bg-blue-500 border-dashed border-b-2"></div>
                    <div>
                      <p className="font-medium text-blue-600">Equity Build-up</p>
                      <p className="text-xs text-gray-500">Forced savings via mortgage</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-0.5 bg-yellow-500 border-dashed border-b-2"></div>
                    <div>
                      <p className="font-medium text-yellow-600">Appreciation</p>
                      <p className="text-xs text-gray-500">Unrealized gains</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-1 bg-green-500 rounded"></div>
                    <div>
                      <p className="font-medium text-green-600">Total ROI</p>
                      <p className="text-xs text-gray-500">Combined return</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Equity Growth Chart */}
              <div>
                <h4 className="text-lg font-semibold mb-2">Equity & Property Value Growth</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Track your equity growth and total property value over time
                </p>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#d1d5db' }}
                    />
                    <YAxis 
                      tickFormatter={formatYAxisTick}
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#d1d5db' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    
                    <Line 
                      type="monotone" 
                      dataKey="equity" 
                      stroke="#dc2626" 
                      name="Total Equity"
                      strokeWidth={3}
                      dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#dc2626', strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="propertyValue" 
                      stroke="#059669" 
                      name="Property Value"
                      strokeWidth={2}
                      strokeDasharray="8 8"
                      dot={{ fill: '#059669', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="table">
            {/* Financial Data Table */}
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Year</th>
                    <th className="text-right p-2">Gross Rent</th>
                    <th className="text-right p-2">Operating Exp.</th>
                    <th className="text-right p-2">NOI</th>
                    <th className="text-right p-2">Mortgage</th>
                    <th className="text-right p-2">Cash Flow</th>
                    <th className="text-right p-2">Principal</th>
                    <th className="text-right p-2">Appreciation</th>
                    <th className="text-right p-2">Total Return</th>
                    <th className="text-right p-2">Equity</th>
                    <th className="text-right p-2">Property Value</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((data) => (
                    <tr key={data.year} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium">{data.year}</td>
                      <td className="p-2 text-right">${data.grossRentalIncome.toLocaleString()}</td>
                      <td className="p-2 text-right text-red-600">-${data.operatingExpenses.toLocaleString()}</td>
                      <td className="p-2 text-right text-green-600">${data.netOperatingIncome.toLocaleString()}</td>
                      <td className="p-2 text-right text-red-600">-${data.mortgagePayments.toLocaleString()}</td>
                      <td className={`p-2 text-right font-medium ${data.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {data.cashFlow >= 0 ? '+' : ''}${data.cashFlow.toLocaleString()}
                      </td>
                      <td className="p-2 text-right text-blue-600">+${data.principalPaydown.toLocaleString()}</td>
                      <td className="p-2 text-right text-orange-600">+${data.appreciation.toLocaleString()}</td>
                      <td className="p-2 text-right font-bold text-green-700">+${data.totalReturn.toLocaleString()}</td>
                      <td className="p-2 text-right font-medium">${data.equity.toLocaleString()}</td>
                      <td className="p-2 text-right">${data.propertyValue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ROI Analysis Table */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4">ROI Analysis by Year</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                                         <tr className="border-b bg-blue-50">
                       <th className="text-left p-3 font-bold text-blue-900" colSpan={7}>Cumulative ROI (from Initial Investment)</th>
                     </tr>
                     <tr className="border-b bg-muted/30">
                       <th className="text-left p-3">Year</th>
                       <th className="text-right p-3">Cash-on-Cash ROI</th>
                       <th className="text-right p-3">Equity Build-up ROI</th>
                       <th className="text-right p-3">Appreciation ROI</th>
                       <th className="text-right p-3 font-bold">Total ROI</th>
                       <th className="text-right p-3">Cumulative Cash Flow</th>
                       <th className="text-right p-3">Investment Value</th>
                     </tr>
                  </thead>
                  <tbody>
                    {chartData.map((data) => (
                      <tr key={`roi-${data.year}`} className="border-b hover:bg-muted/20">
                        <td className="p-3 font-medium">{data.year}</td>
                        <td className={`p-3 text-right font-medium ${data.cashOnCashROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {data.cashOnCashROI >= 0 ? '+' : ''}{data.cashOnCashROI}%
                        </td>
                        <td className="p-3 text-right text-blue-600 font-medium">
                          +{data.equityBuildupROI}%
                        </td>
                        <td className="p-3 text-right text-orange-600 font-medium">
                          +{data.appreciationROI}%
                        </td>
                        <td className="p-3 text-right font-bold text-green-700">
                          {data.totalROI >= 0 ? '+' : ''}{data.totalROI}%
                        </td>
                        <td className={`p-3 text-right ${data.cumulativeCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {data.cumulativeCashFlow >= 0 ? '+' : ''}${data.cumulativeCashFlow.toLocaleString()}
                        </td>
                        <td className="p-3 text-right text-green-700 font-medium">
                          ${data.currentInvestmentValue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                  
                  {/* Annual ROI Table */}
                  <table className="w-full text-sm mt-8">
                    <thead>
                      <tr className="border-b bg-yellow-50">
                        <th className="text-left p-3 font-bold text-yellow-900" colSpan={6}>Annual ROI (Year-over-Year Returns)</th>
                      </tr>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left p-3">Year</th>
                        <th className="text-right p-3">Annual Cash-on-Cash</th>
                        <th className="text-right p-3">Annual Equity Build-up</th>
                        <th className="text-right p-3">Annual Appreciation</th>
                        <th className="text-right p-3 font-bold">Total Annual ROI</th>
                        <th className="text-right p-3">Yearly Return</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chartData.map((data) => (
                        <tr key={`annual-roi-${data.year}`} className="border-b hover:bg-muted/20">
                          <td className="p-3 font-medium">{data.year}</td>
                          <td className={`p-3 text-right font-medium ${data.annualCashOnCashROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {data.annualCashOnCashROI >= 0 ? '+' : ''}{data.annualCashOnCashROI}%
                          </td>
                          <td className="p-3 text-right text-blue-600 font-medium">
                            +{data.annualEquityBuildupROI}%
                          </td>
                          <td className="p-3 text-right text-orange-600 font-medium">
                            +{data.annualAppreciationROI}%
                          </td>
                          <td className="p-3 text-right font-bold text-green-700">
                            {data.annualROI >= 0 ? '+' : ''}{data.annualROI}%
                          </td>
                          <td className={`p-3 text-right ${data.yearlyReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {data.yearlyReturn >= 0 ? '+' : ''}${data.yearlyReturn.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* ROI Explanation */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">Understanding ROI Types:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                    <div>
                      <h6 className="font-semibold text-blue-900 mb-2">Cumulative ROI:</h6>
                      <p className="mb-2">Returns calculated from your original investment amount. Shows total performance since purchase.</p>
                      <ul className="text-xs space-y-1">
                        <li>• <span className="font-medium text-red-600">Cash-on-Cash:</span> Total cash flow vs. initial investment</li>
                        <li>• <span className="font-medium text-blue-600">Equity Build-up:</span> Total principal paydown vs. initial investment</li>
                        <li>• <span className="font-medium text-orange-600">Appreciation:</span> Total property appreciation vs. initial investment</li>
                      </ul>
                    </div>
                    <div>
                      <h6 className="font-semibold text-yellow-900 mb-2">Annual ROI:</h6>
                      <p className="mb-2">Returns calculated based on current investment value. Similar to stock returns, accounts for compounding.</p>
                      <ul className="text-xs space-y-1">
                        <li>• <span className="font-medium text-red-600">Annual Cash-on-Cash:</span> This year's cash flow vs. current value</li>
                        <li>• <span className="font-medium text-blue-600">Annual Equity Build-up:</span> This year's principal vs. current value</li>
                        <li>• <span className="font-medium text-orange-600">Annual Appreciation:</span> This year's appreciation vs. current value</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-xs text-blue-700 mt-3">
                    <strong>Initial Investment:</strong> ${initialInvestment.toLocaleString()} | 
                    <strong> Current Investment Value:</strong> ${chartData[chartData.length - 1]?.currentInvestmentValue.toLocaleString() || 'N/A'}
                  </p>
                </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold">Total Cash Flow ({assumptions.projectionYears} years)</h4>
                <p className={`text-2xl font-bold ${projections.reduce((sum, p) => sum + p.cashFlow, 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {projections.reduce((sum, p) => sum + p.cashFlow, 0) >= 0 ? '+' : ''}${projections.reduce((sum, p) => sum + p.cashFlow, 0).toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold">Total Principal Paydown</h4>
                <p className="text-2xl font-bold text-blue-600">
                  +${projections.reduce((sum, p) => sum + p.principalPaydown, 0).toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold">Total Appreciation</h4>
                <p className="text-2xl font-bold text-orange-600">
                  +${projections.reduce((sum, p) => sum + p.appreciation, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 
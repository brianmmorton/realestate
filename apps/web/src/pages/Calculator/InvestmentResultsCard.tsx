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
import { useProjections, useAssumptions } from '@/stores/investment-calculator-store'

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

  if (projections.length === 0) {
    return null
  }

  // Prepare data with additional formatting
  const chartData = projections.map(projection => ({
    ...projection,
    formattedCashFlow: projection.cashFlow >= 0 ? projection.cashFlow : projection.cashFlow,
    isCashFlowPositive: projection.cashFlow >= 0
  }))

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
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    
                    <Area 
                      type="monotone" 
                      dataKey="cashFlow" 
                      stackId="1" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.6}
                      name="Cash Flow"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="principalPaydown" 
                      stackId="1" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.6}
                      name="Principal Paydown"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="appreciation" 
                      stackId="1" 
                      stroke="#f59e0b" 
                      fill="#f59e0b" 
                      fillOpacity={0.6}
                      name="Appreciation"
                    />
                  </AreaChart>
                </ResponsiveContainer>
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
            <div className="overflow-x-auto">
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
                  {projections.map((projection) => (
                    <tr key={projection.year} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium">{projection.year}</td>
                      <td className="p-2 text-right">${projection.grossRentalIncome.toLocaleString()}</td>
                      <td className="p-2 text-right text-red-600">-${projection.operatingExpenses.toLocaleString()}</td>
                      <td className="p-2 text-right text-green-600">${projection.netOperatingIncome.toLocaleString()}</td>
                      <td className="p-2 text-right text-red-600">-${projection.mortgagePayments.toLocaleString()}</td>
                      <td className={`p-2 text-right font-medium ${projection.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {projection.cashFlow >= 0 ? '+' : ''}${projection.cashFlow.toLocaleString()}
                      </td>
                      <td className="p-2 text-right text-blue-600">+${projection.principalPaydown.toLocaleString()}</td>
                      <td className="p-2 text-right text-orange-600">+${projection.appreciation.toLocaleString()}</td>
                      <td className="p-2 text-right font-bold text-green-700">+${projection.totalReturn.toLocaleString()}</td>
                      <td className="p-2 text-right font-medium">${projection.equity.toLocaleString()}</td>
                      <td className="p-2 text-right">${projection.propertyValue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
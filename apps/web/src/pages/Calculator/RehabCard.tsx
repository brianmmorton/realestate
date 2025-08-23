import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CurrencyInput } from '@/components/ui/currency-input'
import { PercentageInput } from '@/components/ui/percentage-input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { 
  useRehabInfo, 
  useRehabInfoActions, 
  useAddRehabItem, 
  useRemoveRehabItem, 
  useUpdateRehabItem, 
  useTotalRehabCost,
  useTotalMonthlyRent,
  useAdjustedMonthlyRent
} from '@/stores/investment-calculator-store'

export const RehabCard: React.FC = () => {
  const rehabInfo = useRehabInfo()
  const setRehabInfo = useRehabInfoActions()
  const addRehabItem = useAddRehabItem()
  const removeRehabItem = useRemoveRehabItem()
  const updateRehabItem = useUpdateRehabItem()
  const totalRehabCost = useTotalRehabCost()
  const totalMonthlyRent = useTotalMonthlyRent()
  const adjustedMonthlyRent = useAdjustedMonthlyRent()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rehab & Renovation</CardTitle>
        <CardDescription>
          Add renovation costs and estimate rent increases from improvements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="enableRehab"
            checked={rehabInfo.enabled}
            onChange={(e) => {
              setRehabInfo({ enabled: e.target.checked })
              // Add a default item if enabling and no items exist
              if (e.target.checked && rehabInfo.items.length === 0) {
                addRehabItem()
              }
            }}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="enableRehab" className="text-sm font-medium">
            Include rehab/renovation costs
          </Label>
        </div>

        {rehabInfo.enabled && (
          <>
            <div className="space-y-4">
              <div>
                <Label htmlFor="rentIncrease">Expected Rent Increase %</Label>
                <PercentageInput
                  id="rentIncrease"
                  value={rehabInfo.rentIncreasePercentage}
                  onChange={(value) => setRehabInfo({ rentIncreasePercentage: value })}
                  maxValue={100}
                  step={0.1}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Percentage increase in rent due to renovations
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Renovation Items</h4>
                {rehabInfo.items.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                    <div className="md:col-span-2">
                      <Label htmlFor={`category-${item.id}`}>Category</Label>
                      <Input
                        id={`category-${item.id}`}
                        value={item.category}
                        onChange={(e) => updateRehabItem(item.id, 'category', e.target.value)}
                        placeholder="e.g., Flooring, Kitchen, Bathroom"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`cost-${item.id}`}>Cost</Label>
                      <div className="flex gap-2">
                        <CurrencyInput
                          id={`cost-${item.id}`}
                          value={item.cost || 0}
                          onChange={(value) => updateRehabItem(item.id, 'cost', value)}
                          placeholder="0"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeRehabItem(item.id)}
                          disabled={rehabInfo.items.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button onClick={addRehabItem} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Renovation Item
                </Button>
              </div>
            </div>

            <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">
                    Total Rehab Cost: ${totalRehabCost.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Added to purchase price for financing
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Adjusted Monthly Rent: ${adjustedMonthlyRent.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Base: ${totalMonthlyRent.toLocaleString()} + {rehabInfo.rentIncreasePercentage}% increase
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
} 
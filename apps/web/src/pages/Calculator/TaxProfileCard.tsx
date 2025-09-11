import React from 'react'
import { graphql, useFragment, useLazyLoadQuery, commitMutation } from 'react-relay'
import { Card } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Button } from '../../components/ui/button'
import { FieldTooltip } from '../../components/ui/tooltip'
import { useAuth } from '../../providers/auth-provider'
import { relayEnvironment } from '../../lib/relay'
import { Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import type { TaxProfileCardQuery } from './__generated__/TaxProfileCardQuery.graphql'
import type { TaxProfileCard_user$key } from './__generated__/TaxProfileCard_user.graphql'

const TaxProfileCardQueryGraphQL = graphql`
  query TaxProfileCardQuery {
    me {
      id
      ...TaxProfileCard_user
    }
  }
`

const TaxProfileCardFragment = graphql`
  fragment TaxProfileCard_user on User {
    id
    annualGrossIncome
    filingStatus
    stateOfResidence
    marginalTaxBracket
    stateTaxRate
    useStandardDeduction
    existingItemizedDeductions
    isRealEstateProfessional
    otherPassiveIncome
    plannedHoldPeriod
    intends1031Exchange
    taxProfileUpdatedAt
  }
`

const TaxProfileCardUpdateMutationGraphQL = graphql`
  mutation TaxProfileCardUpdateMutation($input: UpdateUserTaxProfileInput!) {
    updateUserTaxProfile(input: $input) {
      id
      ...TaxProfileCard_user
    }
  }
`

const filingStatusOptions = [
  { value: 'single', label: 'Single' },
  { value: 'married_joint', label: 'Married Filing Jointly' },
  { value: 'married_separate', label: 'Married Filing Separately' },
  { value: 'head_of_household', label: 'Head of Household' },
]

const stateOptions = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
]

interface TaxProfile {
  annualGrossIncome?: number | null
  filingStatus?: string | null
  stateOfResidence?: string | null
  marginalTaxBracket?: number | null
  stateTaxRate?: number | null
  useStandardDeduction: boolean
  existingItemizedDeductions?: number | null
  isRealEstateProfessional: boolean
  otherPassiveIncome?: number | null
  plannedHoldPeriod?: number | null
  intends1031Exchange: boolean
}

const TaxProfileCardContent: React.FC = () => {
  const data = useLazyLoadQuery<TaxProfileCardQuery>(TaxProfileCardQueryGraphQL, {}) as any
  
  if (!data.me) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <p>Please log in to set up your tax profile</p>
        </div>
      </Card>
    )
  }

  return <TaxProfileCardForm user={data.me} />
}

interface TaxProfileCardFormProps {
  user: TaxProfileCard_user$key
}

const TaxProfileCardForm: React.FC<TaxProfileCardFormProps> = ({ user: userRef }) => {
  const user = useFragment(TaxProfileCardFragment, userRef)
  
  const [taxProfile, setTaxProfile] = React.useState<TaxProfile>({
    annualGrossIncome: user.annualGrossIncome,
    filingStatus: user.filingStatus,
    stateOfResidence: user.stateOfResidence,
    marginalTaxBracket: user.marginalTaxBracket,
    stateTaxRate: user.stateTaxRate,
    useStandardDeduction: user.useStandardDeduction ?? true,
    existingItemizedDeductions: user.existingItemizedDeductions,
    isRealEstateProfessional: user.isRealEstateProfessional ?? false,
    otherPassiveIncome: user.otherPassiveIncome,
    plannedHoldPeriod: user.plannedHoldPeriod,
    intends1031Exchange: user.intends1031Exchange ?? false,
  })
  
  const [isSaving, setIsSaving] = React.useState(false)
  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'success' | 'error'>('idle')
  const [isExpanded, setIsExpanded] = React.useState(false)

  const handleInputChange = (field: keyof TaxProfile, value: string | number | boolean) => {
    setTaxProfile(prev => ({
      ...prev,
      [field]: value === '' ? null : value
    }))
    setSaveStatus('idle')
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await new Promise<void>((resolve, reject) => {
        commitMutation(relayEnvironment, {
          mutation: TaxProfileCardUpdateMutationGraphQL,
          variables: {
            input: {
              ...taxProfile,
              // Convert empty strings to null for proper GraphQL handling
              annualGrossIncome: taxProfile.annualGrossIncome || null,
              marginalTaxBracket: taxProfile.marginalTaxBracket || null,
              stateTaxRate: taxProfile.stateTaxRate || null,
              existingItemizedDeductions: taxProfile.existingItemizedDeductions || null,
              otherPassiveIncome: taxProfile.otherPassiveIncome || null,
              plannedHoldPeriod: taxProfile.plannedHoldPeriod || null,
            }
          },
          onCompleted: () => {
            setSaveStatus('success')
            setTimeout(() => setSaveStatus('idle'), 3000)
            resolve()
          },
          onError: (error) => {
            console.error('Failed to save tax profile:', error)
            setSaveStatus('error')
            reject(error)
          }
        })
      })
    } catch (error) {
      // Error already handled in onError
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">Tax Profile</h3>
          <p className="text-sm text-muted-foreground">
            Configure your tax information to calculate investment tax benefits
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
          {/* Basic Tax Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="annualGrossIncome">Annual Gross Income</Label>
                <FieldTooltip content="Your total income from all sources before deductions. This includes salary, business income, investment income, etc. Used to determine your tax bracket and eligibility for various deductions." />
              </div>
              <Input
                id="annualGrossIncome"
                type="number"
                placeholder="100000"
                value={taxProfile.annualGrossIncome || ''}
                onChange={(e) => handleInputChange('annualGrossIncome', Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="filingStatus">Filing Status</Label>
                <FieldTooltip content="Your tax filing status affects your tax brackets, standard deduction amount, and eligibility for various tax benefits. Choose the status you use when filing your federal tax return." />
              </div>
              <select
                id="filingStatus"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={taxProfile.filingStatus || ''}
                onChange={(e) => handleInputChange('filingStatus', e.target.value)}
              >
                <option value="">Select filing status</option>
                {filingStatusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="stateOfResidence">State of Residence</Label>
                <FieldTooltip content="The state where you file your tax return. This affects your state income tax calculations. Some states have no income tax, while others have rates ranging from 1% to over 13%." />
              </div>
              <select
                id="stateOfResidence"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={taxProfile.stateOfResidence || ''}
                onChange={(e) => handleInputChange('stateOfResidence', e.target.value)}
              >
                <option value="">Select state</option>
                {stateOptions.map(state => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="marginalTaxBracket">Federal Marginal Tax Rate (%)</Label>
                <FieldTooltip content="Your highest federal tax bracket rate. For 2024: 10%, 12%, 22%, 24%, 32%, 35%, or 37%. This is the rate applied to your last dollar of income and the rate of tax savings from deductions." />
              </div>
              <Input
                id="marginalTaxBracket"
                type="number"
                step="0.1"
                placeholder="22.0"
                value={taxProfile.marginalTaxBracket || ''}
                onChange={(e) => handleInputChange('marginalTaxBracket', Number(e.target.value))}
              />
            </div>
          </div>

          {/* Deduction Strategy */}
          <div className="space-y-4">
            <h4 className="font-medium">Deduction Strategy</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={taxProfile.useStandardDeduction}
                    onChange={(e) => handleInputChange('useStandardDeduction', e.target.checked)}
                    className="rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm">Use Standard Deduction</span>
                </label>
                <FieldTooltip content="The standard deduction is a fixed amount you can deduct. For 2024: $14,600 (single), $29,200 (married filing jointly). Check this if you don't itemize deductions like mortgage interest, state taxes, charitable donations." />
              </div>

              {!taxProfile.useStandardDeduction && (
                <div className="space-y-2 ml-6">
                  <div className="flex items-center">
                    <Label htmlFor="existingItemizedDeductions">Existing Itemized Deductions</Label>
                    <FieldTooltip content="Total amount of your current itemized deductions (mortgage interest on primary residence, state/local taxes up to $10k, charitable donations, etc.). Real estate investment deductions will be added to this amount." />
                  </div>
                  <Input
                    id="existingItemizedDeductions"
                    type="number"
                    placeholder="15000"
                    value={taxProfile.existingItemizedDeductions || ''}
                    onChange={(e) => handleInputChange('existingItemizedDeductions', Number(e.target.value))}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Real Estate Professional Status */}
          <div className="space-y-4">
            <h4 className="font-medium">Real Estate Professional Status</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={taxProfile.isRealEstateProfessional}
                    onChange={(e) => handleInputChange('isRealEstateProfessional', e.target.checked)}
                    className="rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm">I qualify as a Real Estate Professional</span>
                </label>
                <FieldTooltip content="To qualify: (1) More than 50% of your work time must be in real estate activities, AND (2) You must work more than 750 hours per year in real estate. This status allows you to deduct rental losses against other income without passive loss limitations." />
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="otherPassiveIncome">Other Passive Income</Label>
                  <FieldTooltip content="Income from other passive investments like rental properties, limited partnerships, or businesses where you don't materially participate. Passive losses can offset passive income dollar-for-dollar." />
                </div>
                <Input
                  id="otherPassiveIncome"
                  type="number"
                  placeholder="5000"
                  value={taxProfile.otherPassiveIncome || ''}
                  onChange={(e) => handleInputChange('otherPassiveIncome', Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Investment Strategy */}
          <div className="space-y-4">
            <h4 className="font-medium">Investment Strategy</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="plannedHoldPeriod">Planned Hold Period (Years)</Label>
                  <FieldTooltip content="How long you plan to hold the property. This affects depreciation recapture calculations and whether gains qualify for long-term capital gains treatment (over 1 year). Longer holds generally provide better tax benefits." />
                </div>
                <Input
                  id="plannedHoldPeriod"
                  type="number"
                  placeholder="10"
                  value={taxProfile.plannedHoldPeriod || ''}
                  onChange={(e) => handleInputChange('plannedHoldPeriod', Number(e.target.value))}
                />
              </div>

              <div className="flex items-center space-x-2 mt-7">
                <input
                  type="checkbox"
                  checked={taxProfile.intends1031Exchange}
                  onChange={(e) => handleInputChange('intends1031Exchange', e.target.checked)}
                  className="rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm">Plan to use 1031 Exchange</span>
                <FieldTooltip content="A 1031 like-kind exchange allows you to defer capital gains taxes by reinvesting proceeds into another investment property. You must identify replacement property within 45 days and close within 180 days." />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className={`${
                saveStatus === 'success' ? 'bg-green-600 hover:bg-green-700' :
                saveStatus === 'error' ? 'bg-red-600 hover:bg-red-700' :
                'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : saveStatus === 'success' ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Saved
                </>
              ) : saveStatus === 'error' ? (
                <>
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Error
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Tax Profile
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

export const TaxProfileCard: React.FC = () => {
  const { user } = useAuth()

  if (!user) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <p>Please log in to set up your tax profile</p>
        </div>
      </Card>
    )
  }

  return (
    <React.Suspense fallback={
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Loading tax profile...</span>
        </div>
      </Card>
    }>
      <TaxProfileCardContent />
    </React.Suspense>
  )
} 
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { supabase } from '../lib/supabase'

export interface Unit {
  id: string
  type: string
  quantity: number
  monthlyRent: number
}

export interface LoanInfo {
  downPayment: number
  interestRate: number
  loanTermYears: number
}

export interface PropertyInfo {
  price: number
  address: string
  name: string
}

export interface OperatingExpenses {
  annualOperatingCosts: number
  vacancyRate: number
  propertyTaxes: number
  insurance: number
  propertyManagement: number
  maintenance: number
  utilities: number
  other: number
}

export interface Assumptions {
  annualAppreciation: number
  annualRentIncrease: number
  projectionYears: number
}

export interface RehabItem {
  id: string
  category: string
  cost: number
}

export interface RehabInfo {
  enabled: boolean
  items: RehabItem[]
  rentIncreasePercentage: number
}

export interface YearlyProjection {
  year: number
  grossRentalIncome: number
  operatingExpenses: number
  netOperatingIncome: number
  mortgagePayments: number
  cashFlow: number
  principalPaydown: number
  appreciation: number
  totalReturn: number
  equity: number
  remainingLoanBalance: number
  propertyValue: number
}

interface InvestmentCalculatorState {
  // State
  propertyInfo: PropertyInfo
  units: Unit[]
  loanInfo: LoanInfo
  operatingExpenses: OperatingExpenses
  assumptions: Assumptions
  rehabInfo: RehabInfo
  savedConfigurationId?: string
  saveStatus: 'idle' | 'saving' | 'success' | 'error'
  saveError?: string

  // Actions
  setPropertyInfo: (info: Partial<PropertyInfo>) => void
  addUnit: () => void
  removeUnit: (id: string) => void
  updateUnit: (id: string, field: keyof Unit, value: string | number) => void
  setLoanInfo: (info: Partial<LoanInfo>) => void
  setOperatingExpenses: (expenses: Partial<OperatingExpenses>) => void
  setAssumptions: (assumptions: Partial<Assumptions>) => void
  setRehabInfo: (info: Partial<RehabInfo>) => void
  addRehabItem: () => void
  removeRehabItem: (id: string) => void
  updateRehabItem: (id: string, field: keyof RehabItem, value: string | number) => void
  saveConfiguration: (name: string) => Promise<void>
  loadConfiguration: (configurationId: string) => Promise<void>
  resetConfiguration: () => void

  // Computed values
  totalMonthlyRent: number
  monthlyMortgagePayment: number
  projections: YearlyProjection[]
  downPayment: number
  loanAmount: number
  capRate: number
  totalRehabCost: number
  adjustedMonthlyRent: number
}

const calculateMonthlyMortgagePayment = (loanInfo: LoanInfo, propertyPrice: number): number => {
  const loanAmount = propertyPrice - loanInfo.downPayment
  if (loanAmount <= 0 || loanInfo.interestRate === 0) return 0
  
  const principal = loanAmount
  const monthlyRate = loanInfo.interestRate / 100 / 12
  const numPayments = loanInfo.loanTermYears * 12
  
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
         (Math.pow(1 + monthlyRate, numPayments) - 1)
}

const calculateTotalMonthlyRent = (units: Unit[]): number => {
  return units.reduce((total, unit) => total + (unit.quantity * unit.monthlyRent), 0)
}

const calculateProjections = (
  propertyInfo: PropertyInfo,
  _units: Unit[],
  loanInfo: LoanInfo,
  operatingExpenses: OperatingExpenses,
  assumptions: Assumptions,
  monthlyMortgagePayment: number,
  totalMonthlyRent: number,
  totalRehabCost: number
): YearlyProjection[] => {
  const results: YearlyProjection[] = []
  let currentPropertyValue = propertyInfo.price + totalRehabCost
  let currentMonthlyRent = totalMonthlyRent
  const effectivePurchasePrice = propertyInfo.price + totalRehabCost
  const loanAmount = effectivePurchasePrice - loanInfo.downPayment
  let remainingBalance = loanAmount
  
  for (let year = 1; year <= assumptions.projectionYears; year++) {
    // Update rent for the year
    if (year > 1) {
      currentMonthlyRent *= (1 + assumptions.annualRentIncrease / 100)
    }
    
    const grossRentalIncome = currentMonthlyRent * 12
    const vacancyLoss = grossRentalIncome * (operatingExpenses.vacancyRate / 100)
    const effectiveGrossIncome = grossRentalIncome - vacancyLoss
    
    const totalOperatingExpenses = 
      operatingExpenses.annualOperatingCosts +
      operatingExpenses.propertyTaxes +
      operatingExpenses.insurance +
      operatingExpenses.propertyManagement +
      operatingExpenses.maintenance +
      operatingExpenses.utilities +
      operatingExpenses.other
    
    const netOperatingIncome = effectiveGrossIncome - totalOperatingExpenses
    const annualMortgagePayments = monthlyMortgagePayment * 12
    const cashFlow = netOperatingIncome - annualMortgagePayments
    
    // Calculate principal paydown
    const monthlyRate = loanInfo.interestRate / 100 / 12
    let yearlyPrincipalPaydown = 0
    let currentBalance = year === 1 ? loanAmount : remainingBalance
    
    for (let month = 1; month <= 12; month++) {
      const interestPayment = currentBalance * monthlyRate
      const principalPayment = monthlyMortgagePayment - interestPayment
      yearlyPrincipalPaydown += principalPayment
      currentBalance -= principalPayment
    }
    
    remainingBalance = currentBalance
    
    // Property appreciation
    if (year > 1) {
      currentPropertyValue *= (1 + assumptions.annualAppreciation / 100)
    }
    const appreciation = year === 1 ? 0 : currentPropertyValue - (results[year - 2]?.propertyValue || effectivePurchasePrice)
    
    const totalReturn = cashFlow + yearlyPrincipalPaydown + appreciation
    const equity = currentPropertyValue - remainingBalance
    
    results.push({
      year,
      grossRentalIncome: Math.round(grossRentalIncome),
      operatingExpenses: Math.round(totalOperatingExpenses + vacancyLoss),
      netOperatingIncome: Math.round(netOperatingIncome),
      mortgagePayments: Math.round(annualMortgagePayments),
      cashFlow: Math.round(cashFlow),
      principalPaydown: Math.round(yearlyPrincipalPaydown),
      appreciation: Math.round(appreciation),
      totalReturn: Math.round(totalReturn),
      equity: Math.round(equity),
      remainingLoanBalance: Math.round(remainingBalance),
      propertyValue: Math.round(currentPropertyValue)
    })
  }
  
  return results
}

const calculateTotalRehabCost = (rehabInfo: RehabInfo): number => {
  if (!rehabInfo.enabled) return 0
  return rehabInfo.items.reduce((total, item) => total + item.cost, 0)
}

const calculateAdjustedMonthlyRent = (units: Unit[], rehabInfo: RehabInfo): number => {
  const baseRent = calculateTotalMonthlyRent(units)
  if (!rehabInfo.enabled || rehabInfo.rentIncreasePercentage === 0) return baseRent
  return baseRent * (1 + rehabInfo.rentIncreasePercentage / 100)
}

// Helper function to calculate all computed values
const calculateComputedValues = (state: Pick<InvestmentCalculatorState, 'propertyInfo' | 'units' | 'loanInfo' | 'operatingExpenses' | 'assumptions' | 'rehabInfo'>): Pick<InvestmentCalculatorState, 'totalMonthlyRent' | 'monthlyMortgagePayment' | 'projections' | 'downPayment' | 'loanAmount' | 'capRate' | 'totalRehabCost' | 'adjustedMonthlyRent'> => {
  const totalMonthlyRent = calculateTotalMonthlyRent(state.units)
  const totalRehabCost = calculateTotalRehabCost(state.rehabInfo)
  const adjustedMonthlyRent = calculateAdjustedMonthlyRent(state.units, state.rehabInfo)
  const effectivePurchasePrice = state.propertyInfo.price + totalRehabCost
  const monthlyMortgagePayment = calculateMonthlyMortgagePayment(state.loanInfo, effectivePurchasePrice)
  const projections = calculateProjections(
    state.propertyInfo,
    state.units,
    state.loanInfo,
    state.operatingExpenses,
    state.assumptions,
    monthlyMortgagePayment,
    adjustedMonthlyRent,
    totalRehabCost
  )
  const downPayment = state.loanInfo.downPayment
  const loanAmount = effectivePurchasePrice - state.loanInfo.downPayment
  const capRate = effectivePurchasePrice > 0 ? (adjustedMonthlyRent * 12 / effectivePurchasePrice * 100) : 0

  return {
    totalMonthlyRent,
    adjustedMonthlyRent,
    totalRehabCost,
    monthlyMortgagePayment,
    projections,
    downPayment,
    loanAmount,
    capRate: isNaN(capRate) ? 0 : capRate
  }
}

export const useInvestmentCalculatorStore = create<InvestmentCalculatorState>()(
  persist(
    (set, get) => ({
      // Initial state
      propertyInfo: {
        price: 0,
        address: '',
        name: ''
      },
      units: [
        { id: '1', type: '1 Bedroom', quantity: 1, monthlyRent: 0 }
      ],
      loanInfo: {
        downPayment: 0,
        interestRate: 0,
        loanTermYears: 30
      },
      operatingExpenses: {
        annualOperatingCosts: 0,
        vacancyRate: 5,
        propertyTaxes: 0,
        insurance: 0,
        propertyManagement: 0,
        maintenance: 0,
        utilities: 0,
        other: 0
      },
      assumptions: {
        annualAppreciation: 3,
        annualRentIncrease: 2,
        projectionYears: 30
      },
      rehabInfo: {
        enabled: false,
        items: [],
        rentIncreasePercentage: 0
      },

      // Initial computed values
      totalMonthlyRent: 0,
      monthlyMortgagePayment: 0,
      projections: [],
      downPayment: 0,
      loanAmount: 0,
      capRate: 0,
      totalRehabCost: 0,
      adjustedMonthlyRent: 0,
      savedConfigurationId: undefined,
      saveStatus: 'idle',
      saveError: undefined,

      // Actions
      setPropertyInfo: (info) => {
        const currentState = get()
        const updatedPropertyInfo = { ...currentState.propertyInfo, ...info }
        const newState = {
          ...currentState,
          propertyInfo: updatedPropertyInfo
        }
        const computedValues = calculateComputedValues(newState)
        
        set({
          ...newState,
          ...computedValues,
          saveStatus: 'idle',
          saveError: undefined
        })
      },

      addUnit: () => {
        const currentState = get()
        const newUnit: Unit = {
          id: Date.now().toString(),
          type: '',
          quantity: 1,
          monthlyRent: 0
        }
        const newState = {
          ...currentState,
          units: [...currentState.units, newUnit]
        }
        const computedValues = calculateComputedValues(newState)
        
        set({
          ...newState,
          ...computedValues
        })
      },

      removeUnit: (id) => {
        const currentState = get()
        const newState = {
          ...currentState,
          units: currentState.units.filter(unit => unit.id !== id)
        }
        const computedValues = calculateComputedValues(newState)
        
        set({
          ...newState,
          ...computedValues
        })
      },

      updateUnit: (id, field, value) => {
        const currentState = get()
        const newState = {
          ...currentState,
          units: currentState.units.map(unit => 
            unit.id === id ? { ...unit, [field]: value } : unit
          )
        }
        const computedValues = calculateComputedValues(newState)
        
        set({
          ...newState,
          ...computedValues
        })
      },

      setLoanInfo: (info) => {
        const currentState = get()
        const updatedLoanInfo = { ...currentState.loanInfo, ...info }
        const newState = {
          ...currentState,
          loanInfo: updatedLoanInfo
        }
        const computedValues = calculateComputedValues(newState)
        
        set({
          ...newState,
          ...computedValues
        })
      },

      setOperatingExpenses: (expenses) => {
        const currentState = get()
        const updatedExpenses = { ...currentState.operatingExpenses, ...expenses }
        const newState = {
          ...currentState,
          operatingExpenses: updatedExpenses
        }
        const computedValues = calculateComputedValues(newState)
        
        set({
          ...newState,
          ...computedValues
        })
      },

      setAssumptions: (assumptions) => {
        const currentState = get()
        const updatedAssumptions = { ...currentState.assumptions, ...assumptions }
        const newState = {
          ...currentState,
          assumptions: updatedAssumptions
        }
        const computedValues = calculateComputedValues(newState)
        
        set({
          ...newState,
          ...computedValues
        })
      },

      setRehabInfo: (info) => {
        const currentState = get()
        const updatedRehabInfo = { ...currentState.rehabInfo, ...info }
        const newState = {
          ...currentState,
          rehabInfo: updatedRehabInfo
        }
        const computedValues = calculateComputedValues(newState)
        
        set({
          ...newState,
          ...computedValues
        })
      },

      addRehabItem: () => {
        const currentState = get()
        const newItem: RehabItem = {
          id: Date.now().toString(),
          category: '',
          cost: 0
        }
        const newState = {
          ...currentState,
          rehabInfo: {
            ...currentState.rehabInfo,
            items: [...currentState.rehabInfo.items, newItem]
          }
        }
        const computedValues = calculateComputedValues(newState)
        
        set({
          ...newState,
          ...computedValues
        })
      },

      removeRehabItem: (id) => {
        const currentState = get()
        const newState = {
          ...currentState,
          rehabInfo: {
            ...currentState.rehabInfo,
            items: currentState.rehabInfo.items.filter(item => item.id !== id)
          }
        }
        const computedValues = calculateComputedValues(newState)
        
        set({
          ...newState,
          ...computedValues
        })
      },

      updateRehabItem: (id, field, value) => {
        const currentState = get()
        const newState = {
          ...currentState,
          rehabInfo: {
            ...currentState.rehabInfo,
            items: currentState.rehabInfo.items.map(item => 
              item.id === id ? { ...item, [field]: value } : item
            )
          }
        }
        const computedValues = calculateComputedValues(newState)
        
        set({
          ...newState,
          ...computedValues
        })
      },

      saveConfiguration: async (name: string) => {
        const currentState = get()
        
        // Set loading state
        set({ saveStatus: 'saving', saveError: undefined })
        
        const mutation = `
          mutation CreatePropertyConfiguration($input: CreatePropertyConfigurationInput!) {
            createPropertyConfiguration(input: $input) {
              id
              name
            }
          }
        `
        
        const variables = {
          input: {
            name,
            propertyPrice: currentState.propertyInfo.price,
            propertyAddress: currentState.propertyInfo.address,
            downPayment: currentState.loanInfo.downPayment,
            interestRate: currentState.loanInfo.interestRate,
            loanTermYears: currentState.loanInfo.loanTermYears,
            annualOperatingCosts: currentState.operatingExpenses.annualOperatingCosts,
            vacancyRate: currentState.operatingExpenses.vacancyRate,
            propertyTaxes: currentState.operatingExpenses.propertyTaxes,
            insurance: currentState.operatingExpenses.insurance,
            propertyManagement: currentState.operatingExpenses.propertyManagement,
            maintenance: currentState.operatingExpenses.maintenance,
            utilities: currentState.operatingExpenses.utilities,
            otherExpenses: currentState.operatingExpenses.other,
            annualAppreciation: currentState.assumptions.annualAppreciation,
            annualRentIncrease: currentState.assumptions.annualRentIncrease,
            projectionYears: currentState.assumptions.projectionYears,
            rehabEnabled: currentState.rehabInfo.enabled,
            rehabRentIncreasePercentage: currentState.rehabInfo.rentIncreasePercentage,
            rehabItems: currentState.rehabInfo.items.map(item => ({
              category: item.category,
              cost: item.cost,
            })),
            units: currentState.units.map(unit => ({
              type: unit.type,
              quantity: unit.quantity,
              monthlyRent: unit.monthlyRent,
            })),
          }
        }

        try {
          // Get the current session for authentication
          const { data: { session } } = await supabase.auth.getSession()
          
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
          }
          
          if (session?.access_token) {
            headers['Authorization'] = `Bearer ${session.access_token}`
          }
          
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
          const response = await fetch(`${API_URL}/graphql`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              query: mutation,
              variables,
            }),
          })

          const result = await response.json()
          
          if (result.errors) {
            throw new Error(result.errors[0].message)
          }

          set({
            savedConfigurationId: result.data.createPropertyConfiguration.id,
            saveStatus: 'success',
            saveError: undefined
          })
        } catch (error) {
          console.error('Failed to save configuration:', error)
          set({ 
            saveStatus: 'error', 
            saveError: error instanceof Error ? error.message : 'Failed to save configuration'
          })
          throw error
        }
      },

      loadConfiguration: async (configurationId: string) => {
        const query = `
          query GetPropertyConfiguration($id: ID!) {
            propertyConfiguration(id: $id) {
              id
              name
              propertyPrice
              propertyAddress
              downPayment
              interestRate
              loanTermYears
              annualOperatingCosts
              vacancyRate
              propertyTaxes
              insurance
              propertyManagement
              maintenance
              utilities
              otherExpenses
              annualAppreciation
              annualRentIncrease
              projectionYears
              rehabEnabled
              rehabRentIncreasePercentage
              rehabItems {
                category
                cost
              }
              units {
                id
                type
                quantity
                monthlyRent
              }
            }
          }
        `

        try {
          // Get the current session for authentication
          const { data: { session } } = await supabase.auth.getSession()
          
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
          }
          
          if (session?.access_token) {
            headers['Authorization'] = `Bearer ${session.access_token}`
          }
          
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
          const response = await fetch(`${API_URL}/graphql`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              query,
              variables: { id: configurationId },
            }),
          })

          const result = await response.json()
          
          if (result.errors) {
            throw new Error(result.errors[0].message)
          }

          const config = result.data.propertyConfiguration
          if (!config) {
            throw new Error('Configuration not found')
          }

          const newState = {
            propertyInfo: {
              price: config.propertyPrice,
              address: config.propertyAddress,
              name: config.name
            },
            units: config.units.map((unit: any, index: number) => ({
              id: unit.id || index.toString(),
              type: unit.type,
              quantity: unit.quantity,
              monthlyRent: unit.monthlyRent,
            })),
            loanInfo: {
              downPayment: config.downPayment,
              interestRate: config.interestRate,
              loanTermYears: config.loanTermYears,
            },
            operatingExpenses: {
              annualOperatingCosts: config.annualOperatingCosts,
              vacancyRate: config.vacancyRate,
              propertyTaxes: config.propertyTaxes,
              insurance: config.insurance,
              propertyManagement: config.propertyManagement,
              maintenance: config.maintenance,
              utilities: config.utilities,
              other: config.otherExpenses,
            },
            assumptions: {
              annualAppreciation: config.annualAppreciation,
              annualRentIncrease: config.annualRentIncrease,
              projectionYears: config.projectionYears,
            },
            rehabInfo: {
              enabled: config.rehabEnabled,
              rentIncreasePercentage: config.rehabRentIncreasePercentage,
              items: config.rehabItems.map((item: any) => ({
                id: item.id,
                category: item.category,
                cost: item.cost,
              })),
            },
            savedConfigurationId: config.id,
          }

          const computedValues = calculateComputedValues(newState)
          
          set({
            ...newState,
            ...computedValues
          })
        } catch (error) {
          console.error('Failed to load configuration:', error)
          throw error
        }
      },

      resetConfiguration: () => {
        const initialState = {
          propertyInfo: {
            price: 0,
            address: '',
            name: ''
          },
          units: [
            { id: '1', type: '1 Bedroom', quantity: 1, monthlyRent: 0 }
          ],
          loanInfo: {
            downPayment: 0,
            interestRate: 0,
            loanTermYears: 30
          },
          operatingExpenses: {
            annualOperatingCosts: 0,
            vacancyRate: 5,
            propertyTaxes: 0,
            insurance: 0,
            propertyManagement: 0,
            maintenance: 0,
            utilities: 0,
            other: 0
          },
          assumptions: {
            annualAppreciation: 3,
            annualRentIncrease: 2,
            projectionYears: 30
          },
          rehabInfo: {
            enabled: false,
            items: [],
            rentIncreasePercentage: 0
          },
          savedConfigurationId: undefined,
          saveStatus: 'idle' as const,
          saveError: undefined,
        }

        const computedValues = calculateComputedValues(initialState)
        
        set({
          ...initialState,
          ...computedValues
        })
      },
    }),
    {
      name: 'investment-calculator-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Recalculate computed values after rehydration
          const computedValues = calculateComputedValues(state)
          Object.assign(state, computedValues)
        }
      },
    }
  )
)

// Selectors for efficient re-renders
export const usePropertyInfo = () => useInvestmentCalculatorStore((state) => state.propertyInfo)
export const useUnits = () => useInvestmentCalculatorStore((state) => state.units)
export const useLoanInfo = () => useInvestmentCalculatorStore((state) => state.loanInfo)
export const useOperatingExpenses = () => useInvestmentCalculatorStore((state) => state.operatingExpenses)
export const useAssumptions = () => useInvestmentCalculatorStore((state) => state.assumptions)
export const useRehabInfo = () => useInvestmentCalculatorStore((state) => state.rehabInfo)
export const useProjections = () => useInvestmentCalculatorStore((state) => state.projections)
export const useTotalMonthlyRent = () => useInvestmentCalculatorStore((state) => state.totalMonthlyRent)
export const useMonthlyMortgagePayment = () => useInvestmentCalculatorStore((state) => state.monthlyMortgagePayment)
export const useDownPayment = () => useInvestmentCalculatorStore((state) => state.downPayment)
export const useLoanAmount = () => useInvestmentCalculatorStore((state) => state.loanAmount)
export const useCapRate = () => useInvestmentCalculatorStore((state) => state.capRate)
export const useTotalRehabCost = () => useInvestmentCalculatorStore((state) => state.totalRehabCost)
export const useAdjustedMonthlyRent = () => useInvestmentCalculatorStore((state) => state.adjustedMonthlyRent)

// Fixed action selectors - these now return stable references
export const usePropertyInfoActions = () => useInvestmentCalculatorStore((state) => state.setPropertyInfo)

// Individual unit action selectors for stable references
export const useAddUnit = () => useInvestmentCalculatorStore((state) => state.addUnit)
export const useRemoveUnit = () => useInvestmentCalculatorStore((state) => state.removeUnit)
export const useUpdateUnit = () => useInvestmentCalculatorStore((state) => state.updateUnit)

export const useLoanInfoActions = () => useInvestmentCalculatorStore((state) => state.setLoanInfo)
export const useOperatingExpensesActions = () => useInvestmentCalculatorStore((state) => state.setOperatingExpenses)
export const useAssumptionsActions = () => useInvestmentCalculatorStore((state) => state.setAssumptions)
export const useRehabInfoActions = () => useInvestmentCalculatorStore((state) => state.setRehabInfo)
export const useAddRehabItem = () => useInvestmentCalculatorStore((state) => state.addRehabItem)
export const useRemoveRehabItem = () => useInvestmentCalculatorStore((state) => state.removeRehabItem)
export const useUpdateRehabItem = () => useInvestmentCalculatorStore((state) => state.updateRehabItem)

// Configuration management selectors
export const useSaveConfiguration = () => useInvestmentCalculatorStore((state) => state.saveConfiguration)
export const useLoadConfiguration = () => useInvestmentCalculatorStore((state) => state.loadConfiguration)
export const useResetConfiguration = () => useInvestmentCalculatorStore((state) => state.resetConfiguration)
export const useSavedConfigurationId = () => useInvestmentCalculatorStore((state) => state.savedConfigurationId)
export const useSaveStatus = () => useInvestmentCalculatorStore((state) => state.saveStatus)
export const useSaveError = () => useInvestmentCalculatorStore((state) => state.saveError) 
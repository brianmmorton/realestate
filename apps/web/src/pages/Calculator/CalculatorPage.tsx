import { useEffect, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { useInvestmentCalculatorStore } from '@/stores/investment-calculator-store'
import { InvestmentCalculator } from '@/pages/Calculator/InvestmentCalculator'
import { PropertyConfigurationLoader } from '@/pages/Calculator/PropertyConfigurationLoader'

export function CalculatorPage() {
  const { id } = useParams<{ id?: string }>()
  const { resetConfiguration } = useInvestmentCalculatorStore()

  useEffect(() => {
    // If the URL parameter is "new" or no parameter, reset the configuration for a new property
    if (!id || id === 'new') {
      resetConfiguration()
    }
  }, [id, resetConfiguration])

  // If we have an ID that's not "new", load the property configuration
  if (id && id !== 'new') {
    return (
      <Suspense fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading property configuration...</p>
          </div>
        </div>
      }>
        <PropertyConfigurationLoader propertyId={id}>
          <InvestmentCalculator />
        </PropertyConfigurationLoader>
      </Suspense>
    )
  }

  // For new properties or no parameter
  return <InvestmentCalculator />
} 
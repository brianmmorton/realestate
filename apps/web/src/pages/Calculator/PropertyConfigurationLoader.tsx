import React, { useEffect } from 'react'
import { graphql, useLazyLoadQuery } from 'react-relay'
import { useInvestmentCalculatorStore } from '@/stores/investment-calculator-store'
import type { PropertyConfigurationLoaderQuery } from './__generated__/PropertyConfigurationLoaderQuery.graphql'

const PropertyConfigurationQuery = graphql`
  query PropertyConfigurationLoaderQuery($id: ID!) {
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
      landValue
      depreciableBasis
      placedInServiceDate
      priorDepreciation
      professionalFees
      advertisingCosts
      travelExpenses
      homeOfficeExpenses
      isOpportunityZone
      isHistoricProperty
      qualifiesForEnergyCredits
      downPaymentSource
      hasSellerFinancing
      units {
        id
        type
        quantity
        monthlyRent
      }
      rehabItems {
        id
        category
        cost
      }
    }
  }
`

interface PropertyConfigurationLoaderProps {
  propertyId: string
  children: React.ReactNode
}

export const PropertyConfigurationLoader: React.FC<PropertyConfigurationLoaderProps> = ({
  propertyId,
  children
}) => {
  const data = useLazyLoadQuery<PropertyConfigurationLoaderQuery>(
    PropertyConfigurationQuery,
    { id: propertyId }
  )

  const {
    setPropertyInfo,
    setLoanInfo,
    setOperatingExpenses,
    setAssumptions,
    setRehabInfo,
    setPropertyTaxInfo
  } = useInvestmentCalculatorStore()

  useEffect(() => {
    if (data.propertyConfiguration) {
      const config = data.propertyConfiguration

      // Load property info
      setPropertyInfo({
        price: config.propertyPrice,
        address: config.propertyAddress,
        name: config.name
      })

      // Load loan info
      setLoanInfo({
        downPayment: config.downPayment,
        interestRate: config.interestRate,
        loanTermYears: config.loanTermYears
      })

      // Load operating expenses
      setOperatingExpenses({
        annualOperatingCosts: config.annualOperatingCosts,
        vacancyRate: config.vacancyRate,
        propertyTaxes: config.propertyTaxes,
        insurance: config.insurance,
        propertyManagement: config.propertyManagement,
        maintenance: config.maintenance,
        utilities: config.utilities,
        other: config.otherExpenses
      })

      // Load assumptions
      setAssumptions({
        annualAppreciation: config.annualAppreciation,
        annualRentIncrease: config.annualRentIncrease,
        projectionYears: config.projectionYears
      })

      // Load rehab info
      setRehabInfo({
        enabled: config.rehabEnabled,
        items: config.rehabItems.map((item: any) => ({
          id: item.id,
          category: item.category,
          cost: item.cost
        })),
        rentIncreasePercentage: config.rehabRentIncreasePercentage
      })

      // Load property tax info
      setPropertyTaxInfo({
        landValue: config.landValue || undefined,
        depreciableBasis: config.depreciableBasis || undefined,
        placedInServiceDate: config.placedInServiceDate || undefined,
        priorDepreciation: config.priorDepreciation || undefined,
        professionalFees: config.professionalFees,
        advertisingCosts: config.advertisingCosts,
        travelExpenses: config.travelExpenses,
        homeOfficeExpenses: config.homeOfficeExpenses,
        isOpportunityZone: config.isOpportunityZone,
        isHistoricProperty: config.isHistoricProperty,
        qualifiesForEnergyCredits: config.qualifiesForEnergyCredits,
        downPaymentSource: config.downPaymentSource || undefined,
        hasSellerFinancing: config.hasSellerFinancing
      })

            // Set units and saved configuration ID by directly updating the store state
      useInvestmentCalculatorStore.setState({
        units: config.units.map((unit: any) => ({
          id: unit.id,
          type: unit.type,
          quantity: unit.quantity,
          monthlyRent: unit.monthlyRent
        })),
        savedConfigurationId: config.id
      })
    }
     }, [data.propertyConfiguration, setPropertyInfo, setLoanInfo, setOperatingExpenses, setAssumptions, setRehabInfo, setPropertyTaxInfo])

  if (!data.propertyConfiguration) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property Configuration Not Found</h1>
          <p className="text-muted-foreground">
            The property configuration you're looking for doesn't exist or you don't have permission to view it.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 
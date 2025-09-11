import { Resolver, Query, Mutation, Arg, Ctx, ID } from 'type-graphql'
import { PropertyConfiguration } from '../entities/PropertyConfiguration.js'
import { CreatePropertyConfigurationInput } from '../inputs/PropertyConfigurationInputs.js'
import { UpdatePropertyTaxInfoInput } from '../inputs/TaxInputs.js'
import type { GraphQLContext } from '../context.js'
import { prisma, resetPrismaConnection } from '../../lib/prisma.js'

// Helper function to map database configuration to GraphQL type
const mapConfigurationToGraphQL = (config: any): PropertyConfiguration => ({
  ...config,
  propertyPrice: Number(config.propertyPrice),
  downPayment: Number(config.downPayment),
  interestRate: Number(config.interestRate),
  annualOperatingCosts: Number(config.annualOperatingCosts),
  vacancyRate: Number(config.vacancyRate),
  propertyTaxes: Number(config.propertyTaxes),
  insurance: Number(config.insurance),
  propertyManagement: Number(config.propertyManagement),
  maintenance: Number(config.maintenance),
  utilities: Number(config.utilities),
  otherExpenses: Number(config.otherExpenses),
  annualAppreciation: Number(config.annualAppreciation),
  annualRentIncrease: Number(config.annualRentIncrease),
  rehabRentIncreasePercentage: Number(config.rehabRentIncreasePercentage),
  // Tax-related fields
  landValue: config.landValue ? Number(config.landValue) : undefined,
  depreciableBasis: config.depreciableBasis ? Number(config.depreciableBasis) : undefined,
  placedInServiceDate: config.placedInServiceDate ?? undefined,
  priorDepreciation: config.priorDepreciation ? Number(config.priorDepreciation) : undefined,
  professionalFees: Number(config.professionalFees),
  advertisingCosts: Number(config.advertisingCosts),
  travelExpenses: Number(config.travelExpenses),
  homeOfficeExpenses: Number(config.homeOfficeExpenses),
  isOpportunityZone: config.isOpportunityZone,
  isHistoricProperty: config.isHistoricProperty,
  qualifiesForEnergyCredits: config.qualifiesForEnergyCredits,
  downPaymentSource: config.downPaymentSource ?? undefined,
  hasSellerFinancing: config.hasSellerFinancing,
  units: config.units.map((unit: any) => ({
    ...unit,
    monthlyRent: Number(unit.monthlyRent),
  })),
  rehabItems: config.rehabItems.map((item: any) => ({
    ...item,
    cost: Number(item.cost),
  })),
})

@Resolver(() => PropertyConfiguration)
export class PropertyConfigurationResolver {
  @Query(() => [PropertyConfiguration])
  async propertyConfigurations(@Ctx() context: GraphQLContext): Promise<PropertyConfiguration[]> {
    if (!context.user) {
      throw new Error('You must be logged in to view property configurations')
    }

    const configurations = await prisma.propertyConfiguration.findMany({
      where: {
        userId: context.user.id,
      },
      include: {
        user: true,
        units: true,
        rehabItems: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return configurations.map(mapConfigurationToGraphQL)
  }

  @Query(() => PropertyConfiguration, { nullable: true })
  async propertyConfiguration(
    @Arg('id', () => ID) id: string,
    @Ctx() context: GraphQLContext
  ): Promise<PropertyConfiguration | null> {
    if (!context.user) {
      throw new Error('You must be logged in to view property configurations')
    }

    const configuration = await prisma.propertyConfiguration.findFirst({
      where: {
        id,
        userId: context.user.id,
      },
      include: {
        user: true,
        units: true,
        rehabItems: true,
      },
    })

    if (!configuration) {
      return null
    }

    return mapConfigurationToGraphQL(configuration)
  }

  @Mutation(() => PropertyConfiguration)
  async createPropertyConfiguration(
    @Arg('input', () => CreatePropertyConfigurationInput) input: CreatePropertyConfigurationInput,
    @Ctx() context: GraphQLContext
  ): Promise<PropertyConfiguration> {
    if (!context.user) {
      throw new Error('You must be logged in to create a property configuration')
    }

    const executeWithRetry = async (operation: () => Promise<any>, maxRetries = 1) => {
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          return await operation()
        } catch (error: any) {
          // Check if it's a prepared statement conflict
          if (error.message?.includes('prepared statement') && error.message?.includes('already exists') && attempt < maxRetries) {
            console.log(`Prepared statement conflict detected, resetting connection (attempt ${attempt + 1})`)
            await resetPrismaConnection()
            continue
          }
          throw error
        }
      }
    }

    // Ensure user exists in our database (sync from Supabase)
    const existingUser = await executeWithRetry(() => 
      prisma.user.findUnique({
        where: { id: context.user.id }
      })
    )

    if (!existingUser) {
      console.log('Creating user in database:', context.user.id, context.user.email)
      await executeWithRetry(() =>
        prisma.user.create({
          data: {
            id: context.user.id,
            email: context.user.email || '',
          }
        })
      )
    }

    const configuration = await executeWithRetry(() =>
      prisma.propertyConfiguration.create({
      data: {
        name: input.name,
        propertyPrice: input.propertyPrice,
        propertyAddress: input.propertyAddress,
        userId: context.user.id,
        downPayment: input.downPayment,
        interestRate: input.interestRate,
        loanTermYears: input.loanTermYears,
        annualOperatingCosts: input.annualOperatingCosts,
        vacancyRate: input.vacancyRate,
        propertyTaxes: input.propertyTaxes,
        insurance: input.insurance,
        propertyManagement: input.propertyManagement,
        maintenance: input.maintenance,
        utilities: input.utilities,
        otherExpenses: input.otherExpenses,
        annualAppreciation: input.annualAppreciation,
        annualRentIncrease: input.annualRentIncrease,
        projectionYears: input.projectionYears,
        rehabEnabled: input.rehabEnabled,
        rehabRentIncreasePercentage: input.rehabRentIncreasePercentage,
        units: {
          create: input.units.map((unit: any) => ({
            type: unit.type,
            quantity: unit.quantity,
            monthlyRent: unit.monthlyRent,
          })),
        },
        rehabItems: {
          create: input.rehabItems.map((item: any) => ({
            category: item.category,
            cost: item.cost,
          })),
        },
        // Tax-related fields
        landValue: input.landValue,
        depreciableBasis: input.depreciableBasis,
        placedInServiceDate: input.placedInServiceDate,
        priorDepreciation: input.priorDepreciation,
        professionalFees: input.professionalFees,
        advertisingCosts: input.advertisingCosts,
        travelExpenses: input.travelExpenses,
        homeOfficeExpenses: input.homeOfficeExpenses,
        isOpportunityZone: input.isOpportunityZone,
        isHistoricProperty: input.isHistoricProperty,
        qualifiesForEnergyCredits: input.qualifiesForEnergyCredits,
        downPaymentSource: input.downPaymentSource,
        hasSellerFinancing: input.hasSellerFinancing,
      },
      include: {
        user: true,
        units: true,
        rehabItems: true,
      },
    })
  )

    return mapConfigurationToGraphQL(configuration)
  }

  @Mutation(() => PropertyConfiguration)
  async updatePropertyTaxInfo(
    @Arg('id', () => ID) id: string,
    @Arg('input', () => UpdatePropertyTaxInfoInput) input: UpdatePropertyTaxInfoInput,
    @Ctx() context: GraphQLContext
  ): Promise<PropertyConfiguration> {
    if (!context.user) {
      throw new Error('You must be logged in to update property tax information')
    }

    // Check if user owns the configuration
    const configuration = await prisma.propertyConfiguration.findFirst({
      where: {
        id,
        userId: context.user.id,
      },
    })

    if (!configuration) {
      throw new Error('Property configuration not found or you do not have permission to update it')
    }

    const updatedConfiguration = await prisma.propertyConfiguration.update({
      where: { id },
      data: input,
      include: {
        user: true,
        units: true,
        rehabItems: true,
      },
    })

    return mapConfigurationToGraphQL(updatedConfiguration)
  }

  @Mutation(() => Boolean)
  async deletePropertyConfiguration(
    @Arg('id', () => ID) id: string,
    @Ctx() context: GraphQLContext
  ): Promise<boolean> {
    if (!context.user) {
      throw new Error('You must be logged in to delete a property configuration')
    }

    // Check if user owns the configuration
    const configuration = await prisma.propertyConfiguration.findFirst({
      where: {
        id,
        userId: context.user.id,
      },
    })

    if (!configuration) {
      throw new Error('Property configuration not found or you do not have permission to delete it')
    }

    await prisma.propertyConfiguration.delete({
      where: { id },
    })

    return true
  }
} 
import { Resolver, Query, Mutation, Arg, Ctx, ID } from 'type-graphql'
import { PropertyConfiguration } from '../entities/PropertyConfiguration.js'
import { CreatePropertyConfigurationInput } from '../inputs/PropertyConfigurationInputs.js'
import type { GraphQLContext } from '../context.js'
import { prisma, resetPrismaConnection } from '../../lib/prisma.js'

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
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return configurations.map(config => ({
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
      units: config.units.map((unit: any) => ({
        ...unit,
        monthlyRent: Number(unit.monthlyRent),
      })),
    }))
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
      },
    })

    if (!configuration) {
      return null
    }

    return {
      ...configuration,
      propertyPrice: Number(configuration.propertyPrice),
      downPayment: Number(configuration.downPayment),
      interestRate: Number(configuration.interestRate),
      annualOperatingCosts: Number(configuration.annualOperatingCosts),
      vacancyRate: Number(configuration.vacancyRate),
      propertyTaxes: Number(configuration.propertyTaxes),
      insurance: Number(configuration.insurance),
      propertyManagement: Number(configuration.propertyManagement),
      maintenance: Number(configuration.maintenance),
      utilities: Number(configuration.utilities),
      otherExpenses: Number(configuration.otherExpenses),
      annualAppreciation: Number(configuration.annualAppreciation),
      annualRentIncrease: Number(configuration.annualRentIncrease),
      units: configuration.units.map(unit => ({
        ...unit,
        monthlyRent: Number(unit.monthlyRent),
      })),
    }
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
        units: {
          create: input.units.map((unit: any) => ({
            type: unit.type,
            quantity: unit.quantity,
            monthlyRent: unit.monthlyRent,
          })),
        },
      },
      include: {
        user: true,
        units: true,
      },
    })
  )

    return {
      ...configuration,
      propertyPrice: Number(configuration.propertyPrice),
      downPayment: Number(configuration.downPayment),
      interestRate: Number(configuration.interestRate),
      annualOperatingCosts: Number(configuration.annualOperatingCosts),
      vacancyRate: Number(configuration.vacancyRate),
      propertyTaxes: Number(configuration.propertyTaxes),
      insurance: Number(configuration.insurance),
      propertyManagement: Number(configuration.propertyManagement),
      maintenance: Number(configuration.maintenance),
      utilities: Number(configuration.utilities),
      otherExpenses: Number(configuration.otherExpenses),
      annualAppreciation: Number(configuration.annualAppreciation),
      annualRentIncrease: Number(configuration.annualRentIncrease),
      units: configuration.units.map((unit: any) => ({
        ...unit,
        monthlyRent: Number(unit.monthlyRent),
      })),
    }
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
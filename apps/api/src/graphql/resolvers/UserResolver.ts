import { Resolver, Query, Mutation, Ctx, Arg } from 'type-graphql'
import { User } from '../entities/User.js'
import { UpdateUserTaxProfileInput } from '../inputs/TaxInputs.js'
import type { GraphQLContext } from '../context.js'
import { prisma } from '../../lib/prisma.js'

@Resolver(() => User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() context: GraphQLContext): Promise<User | null> {
    if (!context.user) {
      return null
    }

    // Fetch complete user data including tax profile
    const user = await prisma.user.findUnique({
      where: { id: context.user.id }
    })

    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      annualGrossIncome: user.annualGrossIncome ? Number(user.annualGrossIncome) : undefined,
      filingStatus: user.filingStatus ?? undefined,
      stateOfResidence: user.stateOfResidence ?? undefined,
      marginalTaxBracket: user.marginalTaxBracket ? Number(user.marginalTaxBracket) : undefined,
      stateTaxRate: user.stateTaxRate ? Number(user.stateTaxRate) : undefined,
      useStandardDeduction: user.useStandardDeduction,
      existingItemizedDeductions: user.existingItemizedDeductions ? Number(user.existingItemizedDeductions) : undefined,
      isRealEstateProfessional: user.isRealEstateProfessional,
      otherPassiveIncome: user.otherPassiveIncome ? Number(user.otherPassiveIncome) : undefined,
      plannedHoldPeriod: user.plannedHoldPeriod ?? undefined,
      intends1031Exchange: user.intends1031Exchange,
      taxProfileUpdatedAt: user.taxProfileUpdatedAt ?? undefined,
    }
  }

  @Mutation(() => User)
  async updateUserTaxProfile(
    @Ctx() context: GraphQLContext,
    @Arg('input', () => UpdateUserTaxProfileInput) input: UpdateUserTaxProfileInput
  ): Promise<User> {
    if (!context.user) {
      throw new Error('Not authenticated')
    }

    const updatedUser = await prisma.user.update({
      where: { id: context.user.id },
      data: {
        ...input,
        taxProfileUpdatedAt: new Date(),
      }
    })

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      annualGrossIncome: updatedUser.annualGrossIncome ? Number(updatedUser.annualGrossIncome) : undefined,
      filingStatus: updatedUser.filingStatus ?? undefined,
      stateOfResidence: updatedUser.stateOfResidence ?? undefined,
      marginalTaxBracket: updatedUser.marginalTaxBracket ? Number(updatedUser.marginalTaxBracket) : undefined,
      stateTaxRate: updatedUser.stateTaxRate ? Number(updatedUser.stateTaxRate) : undefined,
      useStandardDeduction: updatedUser.useStandardDeduction,
      existingItemizedDeductions: updatedUser.existingItemizedDeductions ? Number(updatedUser.existingItemizedDeductions) : undefined,
      isRealEstateProfessional: updatedUser.isRealEstateProfessional,
      otherPassiveIncome: updatedUser.otherPassiveIncome ? Number(updatedUser.otherPassiveIncome) : undefined,
      plannedHoldPeriod: updatedUser.plannedHoldPeriod ?? undefined,
      intends1031Exchange: updatedUser.intends1031Exchange,
      taxProfileUpdatedAt: updatedUser.taxProfileUpdatedAt ?? undefined,
    }
  }
} 
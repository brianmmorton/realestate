import { InputType, Field, Float, Int } from 'type-graphql'

@InputType()
export class UpdateUserTaxProfileInput {
  @Field(() => Float, { nullable: true })
  annualGrossIncome?: number

  @Field(() => String, { nullable: true })
  filingStatus?: string

  @Field(() => String, { nullable: true })
  stateOfResidence?: string

  @Field(() => Float, { nullable: true })
  marginalTaxBracket?: number

  @Field(() => Float, { nullable: true })
  stateTaxRate?: number

  @Field(() => Boolean, { nullable: true })
  useStandardDeduction?: boolean

  @Field(() => Float, { nullable: true })
  existingItemizedDeductions?: number

  @Field(() => Boolean, { nullable: true })
  isRealEstateProfessional?: boolean

  @Field(() => Float, { nullable: true })
  otherPassiveIncome?: number

  @Field(() => Int, { nullable: true })
  plannedHoldPeriod?: number

  @Field(() => Boolean, { nullable: true })
  intends1031Exchange?: boolean
}

@InputType()
export class UpdatePropertyTaxInfoInput {
  @Field(() => Float, { nullable: true })
  landValue?: number

  @Field(() => Float, { nullable: true })
  depreciableBasis?: number

  @Field(() => Date, { nullable: true })
  placedInServiceDate?: Date

  @Field(() => Float, { nullable: true })
  priorDepreciation?: number

  @Field(() => Float, { nullable: true })
  professionalFees?: number

  @Field(() => Float, { nullable: true })
  advertisingCosts?: number

  @Field(() => Float, { nullable: true })
  travelExpenses?: number

  @Field(() => Float, { nullable: true })
  homeOfficeExpenses?: number

  @Field(() => Boolean, { nullable: true })
  isOpportunityZone?: boolean

  @Field(() => Boolean, { nullable: true })
  isHistoricProperty?: boolean

  @Field(() => Boolean, { nullable: true })
  qualifiesForEnergyCredits?: boolean

  @Field(() => String, { nullable: true })
  downPaymentSource?: string

  @Field(() => Boolean, { nullable: true })
  hasSellerFinancing?: boolean
} 
import { ObjectType, Field, ID, Float, Int } from 'type-graphql'
import { User } from './User.js'
import { UnitEntity } from './Unit.js'
import { RehabItemEntity } from './RehabItem.js'

@ObjectType()
export class PropertyConfiguration {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  name!: string

  @Field(() => Float)
  propertyPrice!: number

  @Field(() => String)
  propertyAddress!: string

  @Field(() => String)
  userId!: string

  @Field(() => Date)
  createdAt!: Date

  @Field(() => Date)
  updatedAt!: Date

  // Investment calculation data
  @Field(() => Float)
  downPayment!: number

  @Field(() => Float)
  interestRate!: number

  @Field(() => Int)
  loanTermYears!: number

  // Operating expenses
  @Field(() => Float)
  annualOperatingCosts!: number

  @Field(() => Float)
  vacancyRate!: number

  @Field(() => Float)
  propertyTaxes!: number

  @Field(() => Float)
  insurance!: number

  @Field(() => Float)
  propertyManagement!: number

  @Field(() => Float)
  maintenance!: number

  @Field(() => Float)
  utilities!: number

  @Field(() => Float)
  otherExpenses!: number

  // Assumptions
  @Field(() => Float)
  annualAppreciation!: number

  @Field(() => Float)
  annualRentIncrease!: number

  @Field(() => Int)
  projectionYears!: number

  // Rehab information
  @Field(() => Boolean)
  rehabEnabled!: boolean

  @Field(() => Float)
  rehabRentIncreasePercentage!: number

  // Property-Specific Tax Information
  @Field(() => Float, { nullable: true })
  landValue?: number

  @Field(() => Float, { nullable: true })
  depreciableBasis?: number

  @Field(() => Date, { nullable: true })
  placedInServiceDate?: Date

  @Field(() => Float, { nullable: true })
  priorDepreciation?: number

  // Property-Specific Deductions
  @Field(() => Float)
  professionalFees!: number

  @Field(() => Float)
  advertisingCosts!: number

  @Field(() => Float)
  travelExpenses!: number

  @Field(() => Float)
  homeOfficeExpenses!: number

  // Special Tax Situations
  @Field(() => Boolean)
  isOpportunityZone!: boolean

  @Field(() => Boolean)
  isHistoricProperty!: boolean

  @Field(() => Boolean)
  qualifiesForEnergyCredits!: boolean

  // Financing Tax Implications
  @Field(() => String, { nullable: true })
  downPaymentSource?: string

  @Field(() => Boolean)
  hasSellerFinancing!: boolean

  // Relations
  @Field(() => User)
  user!: User

  @Field(() => [UnitEntity])
  units!: UnitEntity[]

  @Field(() => [RehabItemEntity])
  rehabItems!: RehabItemEntity[]
} 
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

  // Relations
  @Field(() => User)
  user!: User

  @Field(() => [UnitEntity])
  units!: UnitEntity[]

  @Field(() => [RehabItemEntity])
  rehabItems!: RehabItemEntity[]
} 
import { ObjectType, Field, ID } from 'type-graphql'
import { Property } from './Property'

@ObjectType()
export class User {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  email!: string

  @Field(() => Date)
  createdAt!: Date

  @Field(() => Date)
  updatedAt!: Date

  // Tax Profile Fields
  @Field(() => Number, { nullable: true })
  annualGrossIncome?: number

  @Field(() => String, { nullable: true })
  filingStatus?: string

  @Field(() => String, { nullable: true })
  stateOfResidence?: string

  @Field(() => Number, { nullable: true })
  marginalTaxBracket?: number

  @Field(() => Number, { nullable: true })
  stateTaxRate?: number

  @Field(() => Boolean)
  useStandardDeduction!: boolean

  @Field(() => Number, { nullable: true })
  existingItemizedDeductions?: number

  @Field(() => Boolean)
  isRealEstateProfessional!: boolean

  @Field(() => Number, { nullable: true })
  otherPassiveIncome?: number

  @Field(() => Number, { nullable: true })
  plannedHoldPeriod?: number

  @Field(() => Boolean)
  intends1031Exchange!: boolean

  @Field(() => Date, { nullable: true })
  taxProfileUpdatedAt?: Date

  @Field(() => [Property])
  properties?: Property[]
} 
import { InputType, Field, Float, Int } from 'type-graphql'
import { IsString, IsNumber, IsPositive, Min, IsArray, ValidateNested, IsBoolean } from 'class-validator'

@InputType()
export class UnitInput {
  @Field(() => String)
  @IsString()
  type!: string

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  quantity!: number

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  monthlyRent!: number
}

@InputType()
export class RehabItemInput {
  @Field(() => String)
  @IsString()
  category!: string

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  cost!: number
}

@InputType()
export class CreatePropertyConfigurationInput {
  @Field(() => String)
  @IsString()
  name!: string

  @Field(() => Float)
  @IsNumber()
  @IsPositive()
  propertyPrice!: number

  @Field(() => String)
  @IsString()
  propertyAddress!: string

  // Investment calculation data
  @Field(() => Float)
  @IsNumber()
  @Min(0)
  downPayment!: number

  @Field(() => Float)
  @IsNumber()
  @IsPositive()
  interestRate!: number

  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  loanTermYears!: number

  // Operating expenses
  @Field(() => Float)
  @IsNumber()
  @Min(0)
  annualOperatingCosts!: number

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  vacancyRate!: number

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  propertyTaxes!: number

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  insurance!: number

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  propertyManagement!: number

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  maintenance!: number

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  utilities!: number

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  otherExpenses!: number

  // Assumptions
  @Field(() => Float)
  @IsNumber()
  @Min(0)
  annualAppreciation!: number

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  annualRentIncrease!: number

  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  projectionYears!: number

  // Rehab information
  @Field(() => Boolean)
  @IsBoolean()
  rehabEnabled!: boolean

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  rehabRentIncreasePercentage!: number

  @Field(() => [RehabItemInput])
  @IsArray()
  @ValidateNested({ each: true })
  rehabItems!: RehabItemInput[]

  // Units
  @Field(() => [UnitInput])
  @IsArray()
  @ValidateNested({ each: true })
  units!: UnitInput[]

  // Tax-related fields
  @Field(() => Float, { nullable: true })
  @IsNumber()
  @Min(0)
  landValue?: number

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @Min(0)
  depreciableBasis?: number

  @Field(() => String, { nullable: true })
  @IsString()
  placedInServiceDate?: string

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @Min(0)
  priorDepreciation?: number

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  professionalFees!: number

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  advertisingCosts!: number

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  travelExpenses!: number

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  homeOfficeExpenses!: number

  @Field(() => Boolean)
  @IsBoolean()
  isOpportunityZone!: boolean

  @Field(() => Boolean)
  @IsBoolean()
  isHistoricProperty!: boolean

  @Field(() => Boolean)
  @IsBoolean()
  qualifiesForEnergyCredits!: boolean

  @Field(() => String, { nullable: true })
  @IsString()
  downPaymentSource?: string

  @Field(() => Boolean)
  @IsBoolean()
  hasSellerFinancing!: boolean
} 
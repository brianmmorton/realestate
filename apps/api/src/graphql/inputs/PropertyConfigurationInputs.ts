import { InputType, Field, Float, Int } from 'type-graphql'
import { IsString, IsNumber, IsPositive, Min, IsArray, ValidateNested } from 'class-validator'

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

  // Units
  @Field(() => [UnitInput])
  @IsArray()
  @ValidateNested({ each: true })
  units!: UnitInput[]
} 
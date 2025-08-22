import { InputType, Field, Float, Int } from 'type-graphql'
import { IsString, IsNumber, IsOptional, IsPositive, Min } from 'class-validator'

@InputType()
export class CreatePropertyInput {
  @Field(() => String)
  @IsString()
  title!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string

  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  price!: number

  @Field(() => String)
  @IsString()
  address!: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bedrooms?: number

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bathrooms?: number

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  squareFeet?: number

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  imageUrl?: string
}

@InputType()
export class UpdatePropertyInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  title?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  address?: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bedrooms?: number

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bathrooms?: number

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  squareFeet?: number

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  imageUrl?: string
} 
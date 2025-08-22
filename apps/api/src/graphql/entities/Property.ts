import { ObjectType, Field, ID, Float, Int } from 'type-graphql'
import { User } from './User'

@ObjectType()
export class Property {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String, { nullable: true })
  description?: string | null

  @Field(() => Int)
  price!: number

  @Field(() => String)
  address!: string

  @Field(() => Int, { nullable: true })
  bedrooms?: number | null

  @Field(() => Int, { nullable: true })
  bathrooms?: number | null

  @Field(() => Int, { nullable: true })
  squareFeet?: number | null

  @Field(() => String, { nullable: true })
  imageUrl?: string | null

  @Field(() => Date)
  createdAt!: Date

  @Field(() => Date)
  updatedAt!: Date

  @Field(() => User)
  owner!: User
} 
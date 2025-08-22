import { ObjectType, Field, ID, Float, Int } from 'type-graphql'

@ObjectType()
export class UnitEntity {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  type!: string

  @Field(() => Int)
  quantity!: number

  @Field(() => Float)
  monthlyRent!: number

  @Field(() => String)
  propertyConfigurationId!: string

  @Field(() => Date)
  createdAt!: Date

  @Field(() => Date)
  updatedAt!: Date
} 
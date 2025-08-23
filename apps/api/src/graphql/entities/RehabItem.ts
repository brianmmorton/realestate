import { ObjectType, Field, ID, Float } from 'type-graphql'

@ObjectType()
export class RehabItemEntity {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  category!: string

  @Field(() => Float)
  cost!: number

  @Field(() => String)
  propertyConfigurationId!: string

  @Field(() => Date)
  createdAt!: Date

  @Field(() => Date)
  updatedAt!: Date
} 
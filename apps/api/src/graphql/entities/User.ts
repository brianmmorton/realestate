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

  @Field(() => [Property])
  properties?: Property[]
} 
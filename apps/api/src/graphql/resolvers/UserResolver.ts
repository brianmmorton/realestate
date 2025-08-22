import { Resolver, Query, Ctx } from 'type-graphql'
import { User } from '../entities/User.js'
import type { GraphQLContext } from '../context.js'

@Resolver(() => User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() context: GraphQLContext): Promise<User | null> {
    if (!context.user) {
      return null
    }

    return {
      id: context.user.id,
      email: context.user.email,
      createdAt: new Date(context.user.created_at),
      updatedAt: new Date(context.user.updated_at),
    }
  }
} 
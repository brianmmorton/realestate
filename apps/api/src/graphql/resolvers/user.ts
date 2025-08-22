import { GraphQLContext } from '../context.js'

export const userResolvers = {
  Query: {
    me: async (_: any, __: any, context: GraphQLContext) => {
      if (!context.user) {
        return null
      }

      return {
        id: context.user.id,
        email: context.user.email,
        createdAt: context.user.created_at,
        updatedAt: context.user.updated_at,
      }
    },
  },
} 
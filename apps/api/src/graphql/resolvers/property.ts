import { GraphQLContext } from '../context.js'
import { prisma } from '../../lib/prisma.js'

export const propertyResolvers = {
  Query: {
    properties: async () => {
      return await prisma.property.findMany({
        include: {
          owner: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    },

    property: async (_: any, { id }: { id: string }) => {
      return await prisma.property.findUnique({
        where: { id },
        include: {
          owner: true,
        },
      })
    },
  },

  Mutation: {
    createProperty: async (
      _: any,
      { input }: { input: any },
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new Error('You must be logged in to create a property')
      }

      return await prisma.property.create({
        data: {
          ...input,
          ownerId: context.user.id,
        },
        include: {
          owner: true,
        },
      })
    },

    updateProperty: async (
      _: any,
      { id, input }: { id: string; input: any },
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new Error('You must be logged in to update a property')
      }

      // Check if user owns the property
      const property = await prisma.property.findUnique({
        where: { id },
      })

      if (!property || property.ownerId !== context.user.id) {
        throw new Error('Property not found or you do not have permission to update it')
      }

      return await prisma.property.update({
        where: { id },
        data: input,
        include: {
          owner: true,
        },
      })
    },

    deleteProperty: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new Error('You must be logged in to delete a property')
      }

      // Check if user owns the property
      const property = await prisma.property.findUnique({
        where: { id },
      })

      if (!property || property.ownerId !== context.user.id) {
        throw new Error('Property not found or you do not have permission to delete it')
      }

      await prisma.property.delete({
        where: { id },
      })

      return true
    },
  },
} 
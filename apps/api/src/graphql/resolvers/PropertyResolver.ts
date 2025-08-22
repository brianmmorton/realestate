import { Resolver, Query, Mutation, Arg, Ctx, ID } from 'type-graphql'
import { Property } from '../entities/Property.js'
import { CreatePropertyInput, UpdatePropertyInput } from '../inputs/PropertyInputs.js'
import type { GraphQLContext } from '../context.js'
import { prisma } from '../../lib/prisma.js'

@Resolver(() => Property)
export class PropertyResolver {
  @Query(() => [Property])
  async properties(): Promise<Property[]> {
    const properties = await prisma.property.findMany({
      include: {
        owner: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return properties.map(property => ({
      ...property,
      price: Number(property.price),
      squareFeet: property.squareFeet ? Number(property.squareFeet) : null,
    }))
  }

  @Query(() => Property, { nullable: true })
  async property(@Arg('id', () => ID) id: string): Promise<Property | null> {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        owner: true,
      },
    })

    if (!property) {
      return null
    }

    return {
      ...property,
      price: Number(property.price),
      squareFeet: property.squareFeet ? Number(property.squareFeet) : null,
    }
  }

  @Mutation(() => Property)
  async createProperty(
    @Arg('input', () => CreatePropertyInput) input: CreatePropertyInput,
    @Ctx() context: GraphQLContext
  ): Promise<Property> {
    if (!context.user) {
      throw new Error('You must be logged in to create a property')
    }

    const property = await prisma.property.create({
      data: {
        title: input.title,
        description: input.description,
        price: input.price,
        address: input.address,
        bedrooms: input.bedrooms,
        bathrooms: input.bathrooms,
        squareFeet: input.squareFeet,
        imageUrl: input.imageUrl,
        ownerId: context.user.id,
      },
      include: {
        owner: true,
      },
    })

    return {
      ...property,
      price: Number(property.price),
      squareFeet: property.squareFeet ? Number(property.squareFeet) : null,
    }
  }

  @Mutation(() => Property)
  async updateProperty(
    @Arg('id', () => ID) id: string,
    @Arg('input', () => UpdatePropertyInput) input: UpdatePropertyInput,
    @Ctx() context: GraphQLContext
  ): Promise<Property> {
    if (!context.user) {
      throw new Error('You must be logged in to update a property')
    }

    // Check if user owns the property
    const existingProperty = await prisma.property.findUnique({
      where: { id },
    })

    if (!existingProperty || existingProperty.ownerId !== context.user.id) {
      throw new Error('Property not found or you do not have permission to update it')
    }

    const property = await prisma.property.update({
      where: { id },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.price !== undefined && { price: input.price }),
        ...(input.address !== undefined && { address: input.address }),
        ...(input.bedrooms !== undefined && { bedrooms: input.bedrooms }),
        ...(input.bathrooms !== undefined && { bathrooms: input.bathrooms }),
        ...(input.squareFeet !== undefined && { squareFeet: input.squareFeet }),
        ...(input.imageUrl !== undefined && { imageUrl: input.imageUrl }),
      },
      include: {
        owner: true,
      },
    })

    return {
      ...property,
      price: Number(property.price),
      squareFeet: property.squareFeet ? Number(property.squareFeet) : null,
    }
  }

  @Mutation(() => Boolean)
  async deleteProperty(
    @Arg('id', () => ID) id: string,
    @Ctx() context: GraphQLContext
  ): Promise<boolean> {
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
  }
} 
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { UserResolver } from './resolvers/UserResolver.js'
import { PropertyResolver } from './resolvers/PropertyResolver.js'
import { PropertyConfigurationResolver } from './resolvers/PropertyConfigurationResolver.js'

export const createSchema = async () => {
  return await buildSchema({
    resolvers: [UserResolver, PropertyResolver, PropertyConfigurationResolver],
    emitSchemaFile: true,
    validate: true,
  })
} 
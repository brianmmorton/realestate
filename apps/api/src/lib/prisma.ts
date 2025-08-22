import { PrismaClient } from '@prisma/client'
import { config } from '../config/index.js'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create a new Prisma client with proper connection management
const createPrismaClient = () => {
  return new PrismaClient({
    log: config.nodeEnv === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })
}

export let prisma = globalForPrisma.prisma ?? createPrismaClient()

if (config.nodeEnv !== 'production') globalForPrisma.prisma = prisma

// Function to reset Prisma connection when prepared statement conflicts occur
export const resetPrismaConnection = async () => {
  console.log('Resetting Prisma connection due to prepared statement conflict...')
  try {
    await prisma.$disconnect()
  } catch (error) {
    console.error('Error disconnecting old Prisma client:', error)
  }
  
  prisma = createPrismaClient()
  if (config.nodeEnv !== 'production') globalForPrisma.prisma = prisma
  
  return prisma
}

// Gracefully disconnect on process termination
const cleanup = async () => {
  console.log('Disconnecting Prisma client...')
  try {
    await prisma.$disconnect()
  } catch (error) {
    console.error('Error disconnecting Prisma:', error)
  }
}

process.on('beforeExit', cleanup)
process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup) 
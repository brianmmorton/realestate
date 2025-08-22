import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create sample properties
  const properties = await Promise.all([
    prisma.property.create({
      data: {
        title: 'Beautiful Family Home',
        description: 'A spacious 3-bedroom house perfect for families with a large backyard and modern amenities.',
        price: 450000.00,
        address: '123 Oak Street, Springfield',
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1800.00,
        imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
        ownerId: '00000000-0000-0000-0000-000000000000', // Placeholder - in real app this would be actual user ID
      },
    }),
    prisma.property.create({
      data: {
        title: 'Modern Downtown Condo',
        description: 'Luxury condo in the heart of the city with stunning skyline views and premium finishes.',
        price: 320000.00,
        address: '456 City Center Ave, Metro City',
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1200.00,
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
        ownerId: '00000000-0000-0000-0000-000000000000',
      },
    }),
    prisma.property.create({
      data: {
        title: 'Cozy Starter Home',
        description: 'Perfect first home with great potential and a charming neighborhood feel.',
        price: 275000.00,
        address: '789 Maple Drive, Suburbia',
        bedrooms: 2,
        bathrooms: 1,
        squareFeet: 950.00,
        imageUrl: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800',
        ownerId: '00000000-0000-0000-0000-000000000000',
      },
    }),
  ])

  console.log(`✅ Created ${properties.length} sample properties`)
  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
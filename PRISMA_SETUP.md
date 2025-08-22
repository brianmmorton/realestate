# Prisma + Supabase Setup Guide

## 🎯 Why Prisma with Supabase?

✅ **Type Safety** - Auto-generated TypeScript types  
✅ **Better DX** - Excellent IDE support and autocompletion  
✅ **Schema Management** - Version-controlled database schema  
✅ **Migrations** - Safe database changes  
✅ **Query Builder** - Intuitive API for complex queries

## 📋 Setup Steps

### 1. Get Your Supabase Database Connection String

1. Go to your Supabase project: https://uhpavrmftwyykutghuju.supabase.co
2. Navigate to **Settings** → **Database**
3. Scroll down to **Connection string** → **URI**
4. Copy the connection string (it looks like this):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.uhpavrmftwyykutghuju.supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your actual database password

### 2. Update Your Environment Variables

Update `apps/api/.env` with your database connection:

```bash
# Add these lines to your existing .env file
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.uhpavrmftwyykutghuju.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.uhpavrmftwyykutghuju.supabase.co:5432/postgres"
```

### 3. Push Schema to Database

Instead of manually running SQL, you can now use Prisma to manage your schema:

```bash
# Generate Prisma client
cd apps/api
npm run db:generate

# Push schema to your Supabase database
npm run db:push
```

This will create the `properties` table with all the right constraints and indexes!

### 4. (Optional) Seed Sample Data

```bash
# Add sample properties to your database
npm run db:seed
```

### 5. Open Prisma Studio (Database GUI)

```bash
# Open a beautiful database browser
npm run db:studio
```

This opens at http://localhost:5555 and lets you browse/edit your data visually.

## 🔄 Development Workflow

### Making Schema Changes

1. **Edit** `apps/api/prisma/schema.prisma`
2. **Push changes**: `npm run db:push` (for development)
3. **Generate client**: `npm run db:generate`

### Production Workflow

For production, use migrations instead of push:

```bash
# Create a migration
npm run db:migrate

# This creates a migration file you can version control
```

## 🎨 Using Prisma in Your Code

The GraphQL resolvers now use Prisma! Check out:

- `apps/api/src/lib/prisma.ts` - Prisma client setup
- `apps/api/src/graphql/resolvers/property.ts` - Property CRUD operations

Example query:

```typescript
import { prisma } from "../lib/prisma.js";

// Get all properties with owner information
const properties = await prisma.property.findMany({
  include: {
    owner: true,
  },
  orderBy: {
    createdAt: "desc",
  },
});
```

## 🆚 Prisma vs Raw SQL

### Before (Raw SQL):

```sql
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  -- ... more fields
);
```

### After (Prisma Schema):

```prisma
model Property {
  id          String   @id @default(dbgenerated("gen_random_uuid()"))
  title       String
  // ... more fields with full TypeScript support
}
```

## 🛠️ Available Commands

```bash
# In apps/api directory:
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema changes to database
npm run db:migrate     # Create and run migrations
npm run db:studio      # Open database browser
npm run db:seed        # Populate with sample data
```

## 🚀 Benefits You Get

1. **Type Safety**: Your database queries are fully typed
2. **IntelliSense**: IDE autocompletion for all your models
3. **Schema Validation**: Catch schema issues early
4. **Easy Relationships**: Simple joins with `include`
5. **Migration Safety**: Track and version database changes

## 🔗 Next Steps

1. Set up your database connection strings
2. Run `npm run db:push` to create tables
3. Run `npm run db:seed` for sample data
4. Open `npm run db:studio` to see your data
5. Start building! Your GraphQL API now has full CRUD operations

The Prisma client is already integrated into your GraphQL resolvers, so you can immediately start creating, reading, updating, and deleting properties through your API!

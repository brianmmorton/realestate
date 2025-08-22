#!/bin/bash

echo "🏠 Setting up Real Estate App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node --version)"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment files if they don't exist
if [ ! -f "apps/web/.env.local" ]; then
    echo "📄 Creating frontend environment file..."
    cp apps/web/env.example apps/web/.env.local
    echo "⚠️  Please update apps/web/.env.local with your Supabase credentials"
fi

if [ ! -f "apps/api/.env" ]; then
    echo "📄 Creating backend environment file..."
    cp apps/api/env.example apps/api/.env
    echo "⚠️  Please update apps/api/.env with your Supabase credentials"
fi

echo ""
echo "🚀 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up a Supabase project at https://supabase.com"
echo "2. Update environment files with your Supabase credentials:"
echo "   - apps/web/.env.local"
echo "   - apps/api/.env"
echo "3. Run the database migrations in your Supabase dashboard"
echo "4. Start the development servers: npm run dev"
echo ""
echo "Happy coding! 🎉" 
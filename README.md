# Real Estate App

A modern full-stack real estate application built with React, Node.js, TypeScript, and Supabase.

## Tech Stack

### Frontend (`apps/web`)

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **React Router DOM** - Client-side routing
- **Relay** - GraphQL client
- **Supabase** - Authentication and database

### Backend (`apps/api`)

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **GraphQL Yoga** - GraphQL server
- **Supabase** - Database and authentication
- **Prettier** - Code formatting

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Supabase account

### 1. Clone and Install Dependencies

```bash
# Install dependencies for all workspaces
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and API keys from the project settings
3. Set up authentication in Supabase dashboard

### 3. Environment Variables

#### Frontend (`apps/web/.env.local`)

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:4000
```

#### Backend (`apps/api/.env`)

```bash
PORT=4000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 4. Database Setup

Create the following tables in your Supabase dashboard:

```sql
-- Properties table
create table properties (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  price decimal not null,
  address text not null,
  bedrooms integer,
  bathrooms integer,
  square_feet decimal,
  image_url text,
  owner_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table properties enable row level security;

-- RLS policies
create policy "Users can view all properties" on properties for select using (true);
create policy "Users can insert their own properties" on properties for insert with check (auth.uid() = owner_id);
create policy "Users can update their own properties" on properties for update using (auth.uid() = owner_id);
create policy "Users can delete their own properties" on properties for delete using (auth.uid() = owner_id);
```

### 5. Run the Application

```bash
# Start both frontend and backend
npm run dev

# Or run individually
npm run dev:web   # Frontend on http://localhost:3000
npm run dev:api   # Backend on http://localhost:4000
```

## Project Structure

```
real-estate/
├── apps/
│   ├── web/                 # React frontend
│   │   ├── src/
│   │   │   ├── components/  # Reusable components
│   │   │   ├── lib/         # Utilities and configurations
│   │   │   ├── pages/       # Page components
│   │   │   └── providers/   # Context providers
│   │   └── ...
│   └── api/                 # Node.js backend
│       ├── src/
│       │   ├── config/      # Configuration
│       │   ├── graphql/     # GraphQL schema and resolvers
│       │   └── lib/         # Utilities
│       └── ...
└── package.json             # Workspace configuration
```

## Features

- 🔐 **Authentication** - Sign up/sign in with Supabase
- 🏠 **Property Listings** - Browse and view properties
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS
- 🔄 **Real-time Updates** - Powered by GraphQL and Relay
- 🚀 **Type Safety** - Full TypeScript support

## Development

### Code Formatting

```bash
# Format all code
npm run format
```

### Type Checking

```bash
# Check types in all workspaces
npm run type-check
```

### Linting

```bash
# Lint all code
npm run lint
```

### Building

```bash
# Build all apps
npm run build

# Build specific app
npm run build:web
npm run build:api
```

## Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set the root directory to `apps/web`
3. Add environment variables in Vercel dashboard

### Backend (Railway/Render)

1. Connect your GitHub repository
2. Set the root directory to `apps/api`
3. Add environment variables
4. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details

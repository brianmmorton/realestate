# Deployment Guide

## Deploying to Vercel

This project is configured to deploy both the web frontend and API backend as serverless functions on Vercel.

### Prerequisites

1. A Vercel account
2. Supabase project with database configured
3. Environment variables configured in Vercel

### Environment Variables

Set the following environment variables in your Vercel project settings:

#### Required API Environment Variables

- `NODE_ENV=production`
- `SUPABASE_URL=your_supabase_project_url`
- `SUPABASE_ANON_KEY=your_supabase_anon_key`
- `SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key`
- `DATABASE_URL=your_supabase_database_url`
- `DIRECT_URL=your_supabase_direct_database_url`
- `JWT_SECRET=your_jwt_secret_key`
- `CORS_ORIGIN=your_frontend_domain` (e.g., `https://yourapp.vercel.app`)

### Database Setup

Before deploying, ensure your Supabase database schema is up to date:

1. Run migrations locally first to test:

   ```bash
   cd apps/api
   npm run db:migrate
   ```

2. For production, you may need to run migrations manually in Supabase SQL editor or set up a separate migration process.

### Deployment

1. Connect your repository to Vercel
2. Configure the environment variables listed above
3. Deploy using the default settings - Vercel will automatically detect the configuration from `vercel.json`

### API Endpoints

After deployment, your API will be available at:

- GraphQL endpoint: `https://yourdomain.vercel.app/api`
- Health check: `https://yourdomain.vercel.app/health`

### Local Development

For local development of the API:

```bash
cd apps/api
npm install
npm run dev
```

For local development of the web app:

```bash
cd apps/web
npm install
npm run dev
```

### Troubleshooting

1. **Prisma Client Issues**: Ensure `DATABASE_URL` is correctly set and accessible from Vercel
2. **CORS Issues**: Make sure `CORS_ORIGIN` is set to your frontend domain
3. **Build Failures**: Check that all environment variables are set in Vercel project settings
4. **Cold Start Issues**: First requests to serverless functions may be slower due to cold starts

### Monitoring

- Check Vercel Functions logs for API issues
- Use the `/health` endpoint to verify API status
- Monitor GraphQL endpoint at `/api` (GraphiQL available in development mode)

# Deploying Real Estate App to Vercel

## Deployment Strategy

This guide covers two deployment approaches:

**Option 1: Frontend Only on Vercel (Recommended)**

- Deploy only the React frontend to Vercel
- Deploy the API separately to Railway, Render, or another Node.js host

**Option 2: Full-stack on Vercel**

- Deploy both frontend and API to Vercel (requires more complex setup)

## Option 1: Frontend Only (Recommended)

### Prerequisites

1. Vercel account (sign up at https://vercel.com)
2. Separate hosting for your API (Railway, Render, Heroku, etc.)
3. Supabase project set up
4. Database migrated and seeded

### 1. Deploy Your API Separately

First, deploy your API to a service like Railway, Render, or Heroku. You'll get a URL like:

- Railway: `https://your-app.railway.app`
- Render: `https://your-app.onrender.com`
- Heroku: `https://your-app.herokuapp.com`

### 2. Environment Variables for Vercel

Set up the following environment variables in your Vercel project settings:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=https://your-api-deployment-url.com
```

### 3. Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel --prod
```

### 4. Deploy via GitHub Integration

1. Push your code to GitHub
2. Go to https://vercel.com/dashboard
3. Click "New Project"
4. Import your GitHub repository
5. Configure the environment variables in the Vercel dashboard
6. Deploy

## Option 2: Full-stack on Vercel

For deploying both frontend and API to Vercel, you'll need to create API routes in the `/api` directory structure that Vercel expects.

### Quick Setup Steps:

1. **Environment Variables**: Set all the environment variables for both API and frontend
2. **Deploy**: Use `vercel --prod` or GitHub integration
3. **Database**: Run migrations on your production database
4. **Test**: Verify all endpoints work correctly

## API Deployment Alternatives

### Railway (Recommended for API)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Render

1. Connect your GitHub repository
2. Create a new Web Service
3. Set build command: `npm run build:api`
4. Set start command: `npm run start`
5. Add environment variables

### Heroku

```bash
# Install Heroku CLI and login
heroku create your-app-name
git push heroku main
```

## Post-Deployment Checklist

- [ ] Database migrations run successfully
- [ ] Environment variables configured correctly
- [ ] CORS settings updated for your domains
- [ ] GraphQL endpoint accessible
- [ ] Authentication working
- [ ] Supabase integration working
- [ ] Frontend can communicate with API

## Troubleshooting

1. **Build Failures**: Check environment variables and build logs
2. **API Connection Issues**: Verify VITE_API_URL points to correct API endpoint
3. **Database Issues**: Ensure DATABASE_URL and migrations are correct
4. **CORS Issues**: Update API CORS settings to include your frontend domain

# Deployment Guide

## Vercel Deployment (Recommended)

1. **Connect GitHub Repository**
   ```bash
   vercel link
   ```

2. **Configure Environment Variables**
   - Go to Vercel Dashboard > Settings > Environment Variables
   - Add all variables from `.env.template`

3. **Deploy**
   ```bash
   vercel --prod
   ```

## Docker Deployment

1. **Build Image**
   ```bash
   docker build -t scout-analytics .
   ```

2. **Run Container**
   ```bash
   docker run -d -p 3000:3000 --env-file .env scout-analytics
   ```

## Manual Server Deployment

1. **Build Application**
   ```bash
   pnpm build
   ```

2. **Serve Static Files**
   ```bash
   npx serve -s dist -p 3000
   ```

## Database Migration

```bash
# Run migrations
pnpm migrate:up

# Rollback
pnpm migrate:down
```

## Health Checks

- Frontend: `https://your-domain.com/health`
- API: `https://your-domain.com/api/health`
- Database: `https://your-domain.com/api/db-health`

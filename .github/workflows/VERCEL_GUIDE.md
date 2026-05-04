# Vercel Configuration Guide for Module Federation Project

## Overview

This project uses Module Federation with multiple applications:

- `host` - Main application (port 3000)
- `remote-radar` - Radar micro-frontend (port 3001)
- `remote-offers` - Offers micro-frontend (port 3002)
- `mock-server` - Backend API server (port 3003, development only)

## Deployment Strategy

### Option 1: Single Vercel Project (Recommended)

Deploy only the `host` application to Vercel. Remote modules will be loaded dynamically from the same deployment.

**Steps:**

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - **Root Directory**: `host`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `cd .. && npm ci`
3. Set environment variables if needed

### Option 2: Multiple Vercel Projects

Deploy each micro-frontend as separate Vercel projects (more complex but allows independent deployments).

### Option 3: Custom Server (Advanced)

Use a custom Node.js server on Vercel to serve all applications.

## Required GitHub Secrets

Add these secrets to your GitHub repository settings:

1. **`VERCEL_TOKEN`** - Vercel API token
   - Generate at: https://vercel.com/account/tokens
2. **`VERCEL_ORG_ID`** - Your Vercel organization ID
   - Find in Vercel dashboard URL or API

3. **`VERCEL_PROJECT_ID`** (optional) - Specific project ID
   - Auto-detected if not provided

## Configuration Files

### `vercel.json` (for host deployment)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "cd .. && npm ci",
  "framework": null,
  "functions": {
    "api/*.js": {
      "maxDuration": 10
    }
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Environment Variables for Production

Set these in Vercel project settings:

- `NODE_ENV`: production
- `PUBLIC_URL`: Your Vercel deployment URL
- Any API endpoints needed

## Module Federation Configuration

The `host` application loads remote modules from:

- `remote-radar`: Loaded from same origin (relative URLs work)
- `remote-offers`: Loaded from same origin

Since all files are served from the same deployment in Option 1, no CORS issues occur.

## Development vs Production URLs

In development: Modules load from different ports
In production: Modules load from same domain with different paths

## Testing Deployment

1. Push changes to `main` branch
2. GitHub Actions will deploy to Vercel
3. Check deployment logs in Vercel dashboard
4. Verify all remote modules load correctly

## Troubleshooting

### Module Loading Issues

- Check browser console for 404 errors
- Verify remote module paths are correct in `webpack.config.js`
- Ensure all built files are in `dist` directories

### CORS Issues

- All modules should be served from same origin
- If using separate deployments, configure CORS headers

### Build Failures

- Check Node.js version (requires >= 18)
- Verify all dependencies are installed
- Check TypeScript compilation errors

# Frontend Deployment Guide

## Overview
This is the Next.js frontend for the Patient Readmission Risk Prediction application.

## Prerequisites
- Node.js 18+
- Backend API deployed and URL available

## Local Testing

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env.local`
   - Update `NEXT_PUBLIC_API_URL` to your backend URL

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open:** http://localhost:3000

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

1. **Create account:** https://vercel.com
2. **Install Vercel CLI (optional):**
   ```bash
   npm install -g vercel
   ```

3. **Deploy via Dashboard:**
   - Click "New Project"
   - Import from Git repository
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./ ` (current directory)
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `.next` (auto-filled)

4. **Environment Variables (in Vercel dashboard):**
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-backend-url.onrender.com`
   - ⚠️ Replace with YOUR actual backend URL

5. **Deploy:** Click "Deploy"

6. **Get your frontend URL:** `https://your-project.vercel.app`

### Option 2: Render Static Site

1. **Create account:** https://render.com
2. **New Static Site**
3. **Connect repository**
4. **Configure:**
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `.next`
   - **Environment Variables:**
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
     ```

### Option 3: Netlify

1. **Create account:** https://netlify.com
2. **New site from Git**
3. **Configure:**
   - **Build Command:** `npm run build`
   - **Publish Directory:** `.next`
   - **Environment Variables:**
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
     ```

## Important: Update Backend CORS

After deploying frontend, you MUST update the backend's `CORS_ORIGIN` environment variable:

1. Go to your backend deployment (Render/Railway/etc.)
2. Update environment variable:
   ```
   CORS_ORIGIN=https://your-actual-frontend-url.vercel.app
   ```
3. Redeploy backend

## Environment Variables Explained

### NEXT_PUBLIC_API_URL
- **Purpose:** Backend API endpoint
- **Local:** `http://localhost:5000`
- **Production:** `https://your-backend.onrender.com`
- **⚠️ CRITICAL:** Must start with `NEXT_PUBLIC_` to be accessible in browser

## Routes

- **/** - Home page with project overview
- **/predict** - Prediction form and results

## Build & Deploy Commands

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build for production
npm run build

# Start production server (if using Node.js hosting)
npm start

# Type checking
npm run lint
```

## Troubleshooting

### Issue: "Failed to fetch" or Network Error
**Cause:** Frontend can't reach backend
**Fix:**
1. Verify backend is deployed and running
2. Check `NEXT_PUBLIC_API_URL` is correct
3. Ensure backend `CORS_ORIGIN` includes frontend URL
4. Check backend URL includes `https://` (not `http://`)

### Issue: Environment variable not working
**Cause:** Variable doesn't start with `NEXT_PUBLIC_`
**Fix:**
- All env vars accessible in browser MUST start with `NEXT_PUBLIC_`
- Rebuild after changing environment variables

### Issue: 404 on deployed site
**Cause:** Routing issue
**Fix:**
- Ensure publish directory is `.next`
- Check build completed successfully
- Verify all routes use Next.js Link component

### Issue: Build fails
**Cause:** Usually TypeScript errors or missing dependencies
**Fix:**
1. Run `npm run build` locally first
2. Fix any errors shown
3. Commit and push fixes
4. Redeploy

## Production Checklist

Before deploying:
- [ ] Backend is deployed and URL is known
- [ ] `NEXT_PUBLIC_API_URL` is set to backend URL
- [ ] Backend `CORS_ORIGIN` is set to frontend URL
- [ ] Local build succeeds: `npm run build`
- [ ] Test locally with production backend
- [ ] All TypeScript errors resolved

After deploying:
- [ ] Visit frontend URL and test home page
- [ ] Navigate to /predict page
- [ ] Submit a test prediction
- [ ] Verify prediction returns successfully
- [ ] Check browser console for errors

## Free Tier Limitations

### Vercel (Recommended)
- **Bandwidth:** 100GB/month
- **Build Time:** 6000 minutes/month
- **Serverless Functions:** 100GB-hours
- **Good for:** Production use, very generous limits

### Netlify
- **Bandwidth:** 100GB/month
- **Build Time:** 300 minutes/month
- **Good for:** Small-medium projects

### Render
- **Static Sites:** Free
- **Bandwidth:** Limited
- **Good for:** Simple deployments

## Performance Tips

1. **Image Optimization:** Use Next.js `Image` component
2. **Code Splitting:** Automatic with Next.js
3. **Caching:** Configure in deployment platform
4. **CDN:** Vercel/Netlify include CDN automatically

## Project Structure

```
readmission-frontend/
├── app/
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── predict/
│   │   └── page.tsx       # Prediction page
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # Shadcn UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── PatientForm.tsx
│   └── PredictionResult.tsx
├── lib/
│   ├── api.ts             # API calls to backend
│   └── utils.ts           # Utility functions
├── public/                # Static assets
├── .env.local             # Local environment variables (DO NOT COMMIT)
├── .env.example           # Template
└── package.json
```

## Example: Complete Deployment Flow

1. **Deploy Backend (Render):**
   - Deploy backend to Render
   - Get URL: `https://readmission-api-xyz.onrender.com`

2. **Deploy Frontend (Vercel):**
   - Set `NEXT_PUBLIC_API_URL=https://readmission-api-xyz.onrender.com`
   - Deploy to Vercel
   - Get URL: `https://readmission-app.vercel.app`

3. **Update Backend CORS:**
   - In Render, set `CORS_ORIGIN=https://readmission-app.vercel.app`
   - Redeploy backend

4. **Test:**
   - Visit `https://readmission-app.vercel.app`
   - Go to /predict
   - Submit a test prediction
   - ✅ Success!

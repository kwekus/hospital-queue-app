# MediFlow - Vercel Deployment Guide

## Quick Setup: Deploy to Vercel with GitHub

### Step 1: Push Your Code to GitHub

1. **Create a GitHub repository** (if you don't have one):
   - Go to https://github.com/new
   - Create a repository named `hospital-queue-app` (or your preferred name)
   - Choose "Public" or "Private" (your choice)
   - Click "Create repository"

2. **Initialize Git in your project folder**:
   ```powershell
   cd c:\Users\ADMIN\OneDrive\Desktop\hospital-queue-app
   git init
   git add .
   git commit -m "Initial commit: MediFlow Hospital Queue Management System"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/hospital-queue-app.git
   git push -u origin main
   ```
   *(Replace YOUR_USERNAME with your actual GitHub username)*

### Step 2: Connect GitHub to Vercel

1. **Go to Vercel**: https://vercel.com/
2. **Sign up or login** with your GitHub account
3. **Click "New Project"**
4. **Import GitHub repository**:
   - Select your `hospital-queue-app` repository
   - Click "Import"

### Step 3: Configure Vercel Settings

When Vercel asks for configuration:

**Framework Preset**: Select "Other" (since it's a custom Node.js + HTML app)

**Build Command**: Leave blank (or use `npm run build` if you add one)

**Output Directory**: `backend/public`

**Environment Variables**: 
- Name: `ADMIN_KEY`
- Value: `123`
- Click "Add"

Then click **"Deploy"**

### Step 4: Get Your Public Link

After deployment completes (usually 2-5 minutes):
- Vercel will show your deployment URL
- It will look like: `https://hospital-queue-app-xxx.vercel.app/`
- Click it to open your live application!

---

## How It Works

**Automatic Deployment**: Every time you push code to GitHub:
1. GitHub sends notification to Vercel
2. Vercel automatically rebuilds and deploys
3. Your live site updates within 2-5 minutes
4. No manual action needed!

---

## Making Updates

After initial deployment, to make changes:

```powershell
# Make your code changes locally
# Then:
git add .
git commit -m "Description of changes"
git push origin main

# Vercel automatically deploys the new version!
```

---

## Your Production URL

Once deployed, your app will be at:

```
https://hospital-queue-app-[RANDOM-ID].vercel.app/
```

You can:
- Share this link with anyone
- Access from mobile/desktop/tablet
- No installation needed - it's live on the internet!

---

## Features on Vercel

✅ **Live 24/7**: Your app runs on Vercel's servers
✅ **Auto-HTTPS**: Secure SSL certificate included
✅ **Global CDN**: Fast access from anywhere
✅ **Auto-Scaling**: Handles traffic spikes automatically
✅ **Custom Domain**: Add your own domain (upgrade to Pro)
✅ **Analytics**: See who's using your app

---

## Troubleshooting

**Deployment failed?**
- Check GitHub repo has all files
- Verify `vercel.json` exists in root folder
- Check environment variables in Vercel dashboard

**App not working after deploy?**
- Check backend/public/index.html exists
- Verify API endpoints use `/api/...` paths
- Check browser console for errors (F12)

**Want to see logs?**
- Go to https://vercel.com/dashboard
- Click your project
- View "Deployments" → "Logs"

---

## Optional: Custom Domain

To use your own domain (e.g., mediflow.com):

1. Go to your Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Point your domain registrar to Vercel's nameservers
5. Wait 24-48 hours for DNS to propagate

---

## Production Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables set (ADMIN_KEY=123)
- [ ] Deployment successful
- [ ] App loads and works on live URL
- [ ] Admin login works (key: 123)
- [ ] Forms submit successfully
- [ ] Queue updates in real-time

---

## GitHub Repository Template

```
hospital-queue-app/
├── backend/
│   ├── api/
│   │   ├── index.js          (Express server)
│   │   ├── queue-store.js    (Queue logic)
│   │   └── package.json
│   ├── public/
│   │   └── index.html        (Complete UI)
│   └── .env                  (ADMIN_KEY=123)
├── .gitignore                (Node modules, env, etc)
├── vercel.json               (Deployment config)
├── FUNCTIONALITY_VERIFICATION.md
├── VERIFICATION_SUMMARY.md
└── DEPLOYMENT_GUIDE.md       (This file)
```

---

**Ready to deploy?** Follow the steps above and you'll have a live app in minutes!

Need help? Check Vercel docs: https://vercel.com/docs


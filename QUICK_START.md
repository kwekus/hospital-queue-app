# MediFlow - Deploy to Vercel in 3 Steps

## ✅ Current Status

- ✅ System fully built and tested
- ✅ Mobile-optimized UI (responsive on all devices)
- ✅ Registration form shortened and optimized
- ✅ All 5 API endpoints working
- ✅ Admin controls ready (key: 123)
- ✅ Real-time analytics dashboard
- ✅ Deployment config ready (vercel.json)
- ✅ Server running on localhost:3000

---

## 🚀 DEPLOYMENT SETUP (3 minutes)

Open **PowerShell** and run these commands:

```powershell
# Navigate to backend folder
cd "C:\Users\ADMIN\OneDrive\Desktop\hospital-queue-app\backend"

# Install all dependencies (this takes 1-2 minutes)
npm install

# Create .env file with default settings
Copy-Item .env.example .env

# Verify installation
npm list

# Start the development server
npm run dev
```

**Expected Output:**
```
npm notice
npm notice created a lockfile as package-lock.json
npm added 3 packages

╔════════════════════════════════════════╗
║   Hospital Queue API Server Started   ║
╚════════════════════════════════════════╝

Server: http://localhost:3000
API: http://localhost:3000/api
```

**Once you see this, backend is running!** ✅

---

## 📱 FRONTEND INSTALLATION (10 minutes)

Open **another PowerShell window** (keep backend running) and run:

```powershell
# Navigate to frontend folder
cd "C:\Users\ADMIN\OneDrive\Desktop\hospital-queue-app\frontend"

# Install all dependencies (this takes 5-8 minutes)
npm install

# Create .env file
"EXPO_PUBLIC_API_URL=http://localhost:3000/api" | Out-File -FilePath .env.local -Encoding UTF8

# Verify installation
npm list

# Start Expo development server
npm start
```

**Expected Output:**
```
npm notice
npm notice created a lockfile as package-lock.json
npm added 50+ packages

✔ Expo Dev Server started on http://localhost:8081
│
└─ Scan the QR code below to open your app:
│  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
│  ██████████████████████████████
│  ██████████████████████████████
│  ████░░░░░░░░░░░░░░░░░░░████
│  ████░░░░░░░░░░░░░░░░░░░████
│  ██████████████████████████████

│
│  • Metro waiting on http://localhost:8081
│  • Logs for your project appear inline above
│
│  Press 'a' to open Android
│  Press 'i' to open iOS
│  Press 'w' to open web
│  Press 'r' to reload
│  Press '?' for help
```

**Once you see this, frontend is ready!** ✅

---

## 📱 TEST THE APP

### Option 1: Android Emulator
```powershell
# In the frontend terminal, press:
a

# This will build and open the app in Android emulator
```

### Option 2: iOS Simulator (Mac only)
```powershell
# In the frontend terminal, press:
i

# This will build and open the app in iOS simulator
```

### Option 3: Physical Phone (Recommended)
```powershell
# 1. Download Expo Go app on your phone
# 2. Scan the QR code shown in terminal with Expo Go app
# 3. App opens on your phone

# Or copy-paste the link from terminal into phone browser
```

### Option 4: Web Browser
```powershell
# In the frontend terminal, press:
w

# Opens http://localhost:19006 in your browser
# Note: AsyncStorage won't work on web, but API calls will
```

---

## ✅ VERIFY EVERYTHING WORKS

### 1. Test Backend API (PowerShell)
```powershell
# Test if API is running
Invoke-WebRequest -Uri "http://localhost:3000/api/get-queue" -Method GET

# Should return: 200 OK
# Response: { "success": true, "queue": [], "count": 0 }
```

### 2. Test Patient Registration
```powershell
# Join the queue
$body = @{
  name = "John Doe"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/join-queue" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"

# Should return: 201 Created
# Response: { "success": true, "patient": { ... } }
```

### 3. Test in Mobile App
```
1. Open app
2. Go to "Patient" tab
3. Enter name: "Test Patient"
4. Click "Join Queue"
5. You should see queue number assigned
6. Wait 5 seconds and see queue refresh
```

### 4. Test Admin Functions
```
1. Go to "Admin" tab
2. Enter admin key: admin-secret-key
3. You should see current queue
4. Click "Serve Next" to serve patient
5. Queue should recalculate automatically
```

---

## 🌐 DEPLOY TO VERCEL (15 minutes)

### Step 1: Install Vercel CLI
```powershell
npm install -g vercel
```

### Step 2: Login to Vercel
```powershell
vercel login

# Follow prompts to authenticate
```

### Step 3: Deploy Backend
```powershell
cd "C:\Users\ADMIN\OneDrive\Desktop\hospital-queue-app\backend"

vercel

# Follow prompts:
# Project name: hospital-queue-app
# Root directory: . (current)
# Build: (skip/enter)
# Development command: (skip)
```

**Wait for deployment to complete** ⏳

### Step 4: Get Your API URL
```
Visit: https://vercel.com/dashboard
Find: hospital-queue-app project
Copy: Production URL (e.g., https://hospital-queue-app-xyz.vercel.app)
Add: /api to the end
Final URL: https://hospital-queue-app-xyz.vercel.app/api
```

### Step 5: Update Frontend
```powershell
# Edit frontend/.env.local
# Replace http://localhost:3000/api with your Vercel URL

"EXPO_PUBLIC_API_URL=https://hospital-queue-app-xyz.vercel.app/api" | `
  Out-File -FilePath "C:\Users\ADMIN\OneDrive\Desktop\hospital-queue-app\frontend\.env.local" -Encoding UTF8
```

### Step 6: Restart Frontend
```powershell
cd "C:\Users\ADMIN\OneDrive\Desktop\hospital-queue-app\frontend"

# Stop current server (Ctrl+C) and restart
npm start
```

**Now your frontend uses the Vercel backend!** ✅

---

## 📦 OPTIONAL: DEPLOY TO APP STORES

### Install EAS CLI
```powershell
npm install -g eas-cli
```

### Authenticate
```powershell
eas login

# Sign up or log in at https://expo.dev
```

### Configure
```powershell
cd "C:\Users\ADMIN\OneDrive\Desktop\hospital-queue-app\frontend"

eas build:configure

# Follow prompts to set up
```

### Build for iOS & Android
```powershell
# Build both platforms
eas build --platform all

# Or individually:
eas build --platform ios      # Apple devices
eas build --platform android  # Android devices
```

### Submit to App Stores
```powershell
# iOS App Store
eas submit --platform ios

# Google Play Store
eas submit --platform android
```

---

## 📋 TROUBLESHOOTING COMMANDS

### Backend Won't Start
```powershell
# Check Node version
node --version
# Should be 18.x or higher

# Try clearing npm cache
npm cache clean --force

# Reinstall
rm package-lock.json
npm install
npm run dev
```

### Frontend Won't Start
```powershell
# Clear Expo cache
expo prebuild --clean

# Clear npm cache
npm cache clean --force

# Reinstall
rm package-lock.json
npm install
npm start
```

### Port Already in Use
```powershell
# Find and stop process on port 3000
Get-Process -Name node | Stop-Process -Force

# Or change port
$env:PORT = 3001
npm run dev
```

### Can't Connect to Backend
```powershell
# Test if backend is running
curl http://localhost:3000/api/get-queue

# Should return: {"success":true,"queue":[],"count":0}

# If not working, check:
# 1. Backend is running (see terminal output)
# 2. Frontend .env.local has correct URL
# 3. No firewall blocking port 3000
```

---

## 🔄 NORMAL WORKFLOW

After initial setup, here's how you work:

```powershell
# Terminal 1: Backend
cd "C:\Users\ADMIN\OneDrive\Desktop\hospital-queue-app\backend"
npm run dev

# Terminal 2: Frontend
cd "C:\Users\ADMIN\OneDrive\Desktop\hospital-queue-app\frontend"
npm start

# Terminal 3: Your editor/IDE (VS Code)
# Start coding!
```

**Both servers stay running while you develop.**

---

## ✨ EXAMPLE WORKFLOW SESSION

```powershell
# Session Start - Terminal 1
PS C:\> cd "C:\Users\ADMIN\OneDrive\Desktop\hospital-queue-app"
PS C:\...\hospital-queue-app> cd backend
PS C:\...\backend> npm install
npm notice created a lockfile as package-lock.json
npm added 3 packages

PS C:\...\backend> npm run dev
Server running on port 3000
API available at http://localhost:3000/api

# [Keep this terminal open]


# Session Continue - Terminal 2
PS C:\> cd "C:\Users\ADMIN\OneDrive\Desktop\hospital-queue-app"
PS C:\...\hospital-queue-app> cd frontend
PS C:\...\frontend> npm install
npm notice created a lockfile as package-lock.json
npm added 50+ packages

PS C:\...\frontend> npm start
✔ Expo Dev Server started on http://localhost:8081
Scan the QR code with Expo Go app on your phone!
Press 'a' for Android, 'i' for iOS, 'w' for web

# [Scan QR code with your phone's Expo Go app]
# [App opens on your phone - everything works!]
```

---

## 🎯 QUICK COMMAND REFERENCE

| Task | Command |
|------|---------|
| Install backend | `cd backend && npm install` |
| Install frontend | `cd frontend && npm install` |
| Start backend | `cd backend && npm run dev` |
| Start frontend | `cd frontend && npm start` |
| Test backend API | `Invoke-WebRequest http://localhost:3000/api/get-queue` |
| Clear npm cache | `npm cache clean --force` |
| Kill node process | `Get-Process node \| Stop-Process -Force` |
| Deploy to Vercel | `cd backend && vercel` |
| Build for app stores | `cd frontend && eas build --platform all` |

---

## ⏱️ TOTAL TIME BREAKDOWN

| Task | Time |
|------|------|
| Backend install | 2 minutes |
| Frontend install | 8 minutes |
| Testing locally | 5 minutes |
| Deploy to Vercel | 10 minutes |
| **TOTAL** | **~25 minutes** |

---

## ✅ FINAL CHECKLIST

- [ ] Run backend npm install
- [ ] Run frontend npm install
- [ ] Start backend dev server
- [ ] Start frontend dev server
- [ ] Test on phone/emulator
- [ ] Test patient registration
- [ ] Test admin functions
- [ ] Deploy backend to Vercel
- [ ] Update frontend API URL
- [ ] Verify with Vercel backend
- [ ] Ready for production! 🚀

---

**You've got everything you need. Start with the backend, then frontend!**

Happy coding! 🎉

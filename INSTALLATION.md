# Quick Installation Guide

## 🚀 Step-by-Step Setup

### **BACKEND INSTALLATION (Windows PowerShell)**

```powershell
# 1. Navigate to backend folder
cd backend

# 2. Install all dependencies
npm install

# 3. Create environment file
Copy-Item .env.example .env

# 4. Open .env and verify ADMIN_KEY is set
# ADMIN_KEY=admin-secret-key

# 5. Test backend locally (optional)
npm run dev
# Backend will run on http://localhost:3000/api
```

**Backend Dependencies Installed:**
- cors@2.8.5 - Cross-origin request handling
- dotenv@16.3.1 - Environment variables
- express@4.18.2 (dev) - Optional local server

---

### **FRONTEND INSTALLATION (Windows PowerShell)**

```powershell
# 1. Navigate to frontend folder
cd frontend

# 2. Install all dependencies
npm install

# 3. Create environment file
"EXPO_PUBLIC_API_URL=http://localhost:3000/api" | Out-File -FilePath .env.local -Encoding UTF8

# 4. Start Expo development server
npm start

# 5. Run on simulator/device
# Press 'a' for Android
# Press 'i' for iOS
# Press 'w' for Web
```

**Frontend Dependencies Installed:**
- react@18.2.0 - Core framework
- react-native@0.73.6 - Mobile framework
- expo@50.0.13 - Development platform
- expo-router@3.5.0 - Navigation
- @react-navigation/native@6.1.15 - Navigation library
- @react-navigation/bottom-tabs@6.1.5 - Tab navigation
- react-native-screens@3.26.0 - Optimization
- react-native-gesture-handler@2.14.1 - Gesture support
- react-native-reanimated@3.6.1 - Animations
- @react-native-async-storage/async-storage@1.21.0 - Local storage
- zustand@4.4.7 - State management
- axios@1.6.2 - HTTP client
- @expo/vector-icons@13.0.0 - Icon library

---

## 📱 Testing Locally

### **Terminal 1: Start Backend**
```powershell
cd backend
npm run dev
# Should see: Server running on port 3000
```

### **Terminal 2: Start Frontend**
```powershell
cd frontend
npm start
```

### **Use the App:**
1. Open Expo app on your phone and scan QR code
2. Or press 'a' for Android emulator / 'i' for iOS simulator
3. Go to Patient tab and enter name to join queue
4. Go to Admin tab and enter key: `admin-secret-key` to manage

---

## 🌐 Deploy to Vercel (Backend Only)

```powershell
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy backend
cd backend
vercel

# 3. Follow prompts and set:
# - Project name: hospital-queue-app
# - Root directory: backend
# - Environment variable: ADMIN_KEY=admin-secret-key

# 4. Get your API URL from Vercel dashboard
# Example: https://hospital-queue-app-red.vercel.app/api
```

---

## 🔗 Update Frontend API URL (After Vercel Deployment)

```powershell
# 1. Update .env.local with Vercel URL
"EXPO_PUBLIC_API_URL=https://hospital-queue-app-red.vercel.app/api" | Out-File -FilePath frontend/.env.local -Encoding UTF8

# 2. Restart frontend
npm start
```

---

## ✅ Verify Installation

### **Check Backend**
```powershell
# In PowerShell, test API
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/get-queue" -Method GET
$response.StatusCode  # Should be 200
```

### **Check Frontend**
```powershell
# Just open the app and try to:
# 1. Enter name and join queue
# 2. See queue update every 5 seconds
# 3. Login to admin and manage queue
```

---

## 🆘 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| `npm install` fails | Update Node.js to 18+: `node --version` |
| Port 3000 already in use | Kill process: `Get-Process -Name node \| Stop-Process -Force` |
| API not found | Check EXPO_PUBLIC_API_URL in .env.local |
| Admin login fails | Check ADMIN_KEY in backend/.env |
| App crashes on iOS | Clear cache: `expo prebuild --clean` |
| Vercel deploy fails | Check vercel.json configuration |

---

## 📋 All Commands Reference

### Backend Commands
```powershell
npm install          # Install dependencies
npm run dev          # Start development server
npm start            # Start production server
```

### Frontend Commands
```powershell
npm install          # Install dependencies
npm start            # Start Expo dev server
npm run android      # Run on Android emulator
npm run ios          # Run on iOS simulator
npm run web          # Run in web browser
npm run build        # Build for production
```

---

**You're all set! Start with the Backend, then Frontend, then test the app.** 🎉

# Complete Folder Structure Map

```
hospital-queue-app/
│
│── README.md                          📘 Main documentation (13 KB)
│── INSTALLATION.md                    📘 Quick setup guide (4 KB)
│── PROJECT_SUMMARY.md                 📘 This project overview (5 KB)
│── .env.example                       🔐 Environment template
│── .gitignore                         🚫 Git ignore rules
│
│
├─ backend/                            🖥️  BACKEND SERVER
│  │
│  ├─ api/                             🔌 API Handlers (Vercel-ready)
│  │  ├─ join-queue.js                 ✅ POST: Patient registration
│  │  ├─ get-queue.js                  ✅ GET: Queue status
│  │  ├─ serve-next.js                 ✅ POST: Serve next (admin)
│  │  ├─ reset-queue.js                ✅ POST: Reset queue (admin)
│  │  └─ queue-store.js                📦 In-memory queue storage
│  │
│  ├─ package.json                     📦 Dependencies & scripts
│  ├─ vercel.json                      ☁️  Vercel deployment config
│  ├─ server.js                        🏃 Optional local dev server
│  └─ .env.example                     🔐 Environment template
│
│
└─ frontend/                           📱 MOBILE APP
   │
   ├─ src/                             📂 Source code
   │  │
   │  ├─ screens/                      📺 Full screen components
   │  │  ├─ HomeScreen.js              👤 Patient: Register & view queue
   │  │  └─ AdminScreen.js             👨‍💼 Admin: Dashboard & management
   │  │
   │  ├─ components/                   🧩 Reusable UI components
   │  │  └─ QueueCard.js               📋 Single queue item display
   │  │
   │  ├─ store/                        📦 State management
   │  │  └─ queueStore.js              🎯 Zustand global store
   │  │
   │  ├─ navigation/                   🧭 Navigation setup
   │  │  └─ RootNavigator.js           📑 Tab navigation (Patient/Admin)
   │  │
   │  ├─ utils/                        🛠️  Helper functions
   │  │  └─ api.js                     🔗 API endpoint configuration
   │  │
   │  └─ styles/                       🎨 Styling & theme
   │     └─ theme.js                   🎨 Colors, typography, spacing
   │
   ├─ App.js                           🚀 Main entry point
   ├─ package.json                     📦 Dependencies & scripts
   ├─ app.json                         ⚙️  Expo configuration
   ├─ tsconfig.json                    📘 TypeScript config
   └─ .env.example                     🔐 Environment template

---

## 📂 File Descriptions

### BACKEND FILES

#### api/queue-store.js
- In-memory queue data structure
- Functions: getQueue, addToQueue, serveNext, resetQueue, getLastNumber
- Easy to migrate to Firestore (see commented code)

#### api/join-queue.js
- Endpoint: POST /api/join-queue
- Body: { name: string }
- Returns: Patient object with assigned queue number
- Auto-increments lastNumber

#### api/get-queue.js
- Endpoint: GET /api/get-queue
- Returns: Full queue array with patient details
- Used for real-time updates every 5 seconds

#### api/serve-next.js
- Endpoint: POST /api/serve-next
- Admin-only (requires adminKey)
- Removes first patient from queue
- Recalculates all remaining queue numbers

#### api/reset-queue.js
- Endpoint: POST /api/reset-queue
- Admin-only (requires adminKey)
- Clears entire queue and resets lastNumber to 0

#### server.js
- Optional Express server for local development
- Useful for testing before Vercel deployment
- Includes health check endpoint

---

### FRONTEND FILES

#### screens/HomeScreen.js
Features:
- Patient registration form
- Real-time queue display (5 sec refresh)
- Queue statistics (total count, wait time)
- User status card (when registered)
- Pull-to-refresh functionality
- Error handling

#### screens/AdminScreen.js
Features:
- Admin authentication modal
- Serve Next button (with confirmation)
- Reset Queue button (with warning)
- Queue statistics dashboard
- Real-time queue monitoring
- Logout functionality

#### components/QueueCard.js
- Displays single patient in queue
- Shows position badge, name, queue number
- Status indicator
- Horizontally scrollable cards

#### store/queueStore.js
Zustand Store Features:
- Global state management
- Queue data + user data
- API integration with axios
- AsyncStorage integration
- Auto-refresh logic
- Error handling
- Admin mode flag

Actions:
- fetchQueue() - Get queue from API
- joinQueue(name) - Register patient
- serveNext(adminKey) - Serve next (admin)
- resetQueue(adminKey) - Reset (admin)
- loadUserData() - Load from storage
- clearUserData() - Logout
- getUserPosition() - Get position in queue

#### navigation/RootNavigator.js
- Bottom tab navigation
- Two main tabs: Patient, Admin
- Tab icons and labels
- Navigation configuration

#### utils/api.js
- Centralized API endpoint configuration
- Easy to update for different environments
- Supports environment variables

#### styles/theme.js
Color Palette:
- Primary: #0066CC (Hospital Blue)
- Secondary: #00A8E8 (Light Blue)
- Success: #06A77D (Green)
- Warning: #F77F00 (Orange)
- Error: #D62828 (Red)
- Background: #F5F7FA (Light Gray)

Typography:
- Display: 32px, bold
- Title: 28px, bold
- Subheading: 18px, 600 weight
- Body: 16px, regular
- Caption: 14px, regular
- Button: 16px, 600 weight

Spacing:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

#### App.js
- Main entry point
- Initializes navigation
- Loads user data on startup
- Sets up app-level listeners

---

## 📊 Code Statistics

### Backend
- Total files: 5 API handlers + config
- Total lines: ~380
- Languages: JavaScript (Node.js)
- Dependencies: 3 (cors, dotenv, express)

### Frontend
- Total files: 8 main files + config
- Total lines: ~850
- Languages: JavaScript/React Native
- Dependencies: 15+ packages

### Documentation
- README: Comprehensive guide + API specs
- INSTALLATION: Quick setup in 10 minutes
- PROJECT_SUMMARY: Overview and checklist
- This file: Folder structure map

---

## 🔐 Environment Variables

### Backend (.env)
```
ADMIN_KEY=admin-secret-key
```

### Frontend (.env.local)
```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

For production (Vercel):
```
EXPO_PUBLIC_API_URL=https://your-vercel-app.vercel.app/api
```

---

## 📦 Dependencies At A Glance

### Backend
- **cors** (2.8.5) - Handle cross-origin requests
- **dotenv** (16.3.1) - Load environment variables
- **express** (4.18.2) - Optional local dev server

### Frontend
- **react** (18.2.0) - React library
- **react-native** (0.73.6) - Mobile framework
- **expo** (50.0.13) - Development platform
- **@react-navigation/** - Navigation libraries
- **zustand** (4.4.7) - State management
- **axios** (1.6.2) - HTTP client
- **@react-native-async-storage/async-storage** - Local storage
- Plus animation and gesture packages

---

## 🚀 Quick Start Commands

### Backend
```bash
cd backend
npm install
npm run dev  # or: node server.js
```

### Frontend
```bash
cd frontend
npm install
npm start
```

---

## 🌐 Deployment Paths

### Backend to Vercel
1. cd backend
2. vercel deploy

### Frontend to Expo
1. npm install -g eas-cli
2. eas build --platform all
3. eas submit

---

## ✨ Key Features

✅ Real-time queue updates (5 sec refresh)
✅ Patient registration + queue tracking
✅ Admin authentication + management
✅ Queue number recalculation
✅ AsyncStorage persistence
✅ Hospital blue/white theme
✅ Zustand state management
✅ Vercel-ready APIs
✅ CORS enabled
✅ Error handling
✅ Responsive UI
✅ Production ready

---

## 📱 User Flows

### Patient Flow
1. Open app → Patient tab
2. Enter name → Join Queue
3. See queue number + position
4. Auto-refresh every 5 seconds
5. Close app, reopen → data persists

### Admin Flow
1. Open app → Admin tab
2. Enter admin key → Authenticate
3. View current queue
4. Click Serve Next → Patient removed, queue recalculates
5. Click Reset Queue → All patients removed

---

Happy developing! 🎉
```

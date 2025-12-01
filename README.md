# Hospital Queue Management System

A complete mobile-first hospital queue management system with real-time queue tracking, patient registration, and admin dashboard. Built with React Native (Expo) for the frontend and serverless APIs for the backend.

---

## 📋 Features

### Patient Side
- ✅ Patient registration with name entry
- ✅ Real-time queue position tracking
- ✅ Auto-refresh queue status every 5 seconds
- ✅ Local storage persistence
- ✅ Beautiful hospital-themed UI (blue/white)
- ✅ Wait time estimation

### Admin Side
- ✅ Admin authentication with secure key
- ✅ Serve next patient functionality
- ✅ Automatic queue number recalculation
- ✅ Queue reset capability
- ✅ Real-time queue monitoring
- ✅ Queue statistics dashboard

### Technical
- ✅ In-memory queue with easy Firestore migration
- ✅ Vercel-ready serverless backend
- ✅ Zustand state management
- ✅ AsyncStorage for offline data
- ✅ CORS-enabled APIs
- ✅ TypeScript support

---

## 📁 Project Structure

```
hospital-queue-app/
├── backend/
│   ├── api/
│   │   ├── queue-store.js         # In-memory queue storage
│   │   ├── join-queue.js          # POST endpoint
│   │   ├── get-queue.js           # GET endpoint
│   │   ├── serve-next.js          # POST admin endpoint
│   │   └── reset-queue.js         # POST admin endpoint
│   ├── package.json               # Backend dependencies
│   ├── vercel.json                # Vercel configuration
│   └── .env.example               # Environment variables template
│
├── frontend/
│   ├── src/
│   │   ├── screens/
│   │   │   ├── HomeScreen.js      # Patient registration & queue view
│   │   │   └── AdminScreen.js     # Admin dashboard
│   │   ├── components/
│   │   │   └── QueueCard.js       # Queue item component
│   │   ├── store/
│   │   │   └── queueStore.js      # Zustand global state
│   │   ├── navigation/
│   │   │   └── RootNavigator.js   # Tab navigation setup
│   │   ├── utils/
│   │   │   └── api.js             # API endpoints configuration
│   │   └── styles/
│   │       └── theme.js           # Colors, typography, spacing
│   ├── App.js                     # Main entry point
│   ├── package.json               # Frontend dependencies
│   ├── app.json                   # Expo configuration
│   ├── tsconfig.json              # TypeScript configuration
│   └── .env.example               # Environment variables template
│
├── .env.example                   # Root environment variables
├── .gitignore                     # Git ignore rules
└── README.md                      # This file
```

---

## 🔑 API Endpoints

### 1. **POST /api/join-queue**
Register a patient in the queue.

**Request:**
```json
{
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "patient": {
    "id": 1234567890,
    "name": "John Doe",
    "queueNumber": 1,
    "timestamp": "2025-11-22T10:30:00Z",
    "status": "waiting"
  },
  "message": "John Doe, you are number 1 in the queue"
}
```

---

### 2. **GET /api/get-queue**
Get the entire queue status.

**Response:**
```json
{
  "success": true,
  "queue": [
    {
      "id": 1234567890,
      "name": "John Doe",
      "queueNumber": 1,
      "timestamp": "2025-11-22T10:30:00Z",
      "status": "waiting"
    }
  ],
  "count": 1,
  "message": "Current queue has 1 patients waiting"
}
```

---

### 3. **POST /api/serve-next**
Serve the next patient (admin only).

**Request:**
```json
{
  "adminKey": "admin-secret-key"
}
```

**Response:**
```json
{
  "success": true,
  "servedPatient": {
    "id": 1234567890,
    "name": "John Doe",
    "queueNumber": 1,
    "timestamp": "2025-11-22T10:30:00Z",
    "status": "served"
  },
  "queue": [],
  "message": "John Doe is being served. Queue recalculated."
}
```

---

### 4. **POST /api/reset-queue**
Reset the entire queue (admin only).

**Request:**
```json
{
  "adminKey": "admin-secret-key"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Queue has been reset successfully"
}
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Expo CLI (for mobile development)
- Android Studio or Xcode (for mobile testing)

---

### **Backend Setup**

1. **Navigate to backend directory:**
   ```powershell
   cd backend
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Create `.env` file:**
   ```powershell
   Copy-Item .env.example .env
   ```

   Edit `.env` and set:
   ```
   ADMIN_KEY=admin-secret-key
   ```

4. **Test locally (optional):**
   ```powershell
   npm run dev
   ```
   This starts a local dev server on `http://localhost:3000/api`

---

### **Frontend Setup**

1. **Navigate to frontend directory:**
   ```powershell
   cd frontend
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Create `.env.local` file:**
   ```powershell
   echo "EXPO_PUBLIC_API_URL=http://localhost:3000/api" > .env.local
   ```

4. **Start Expo development server:**
   ```powershell
   npm start
   ```

5. **Run on Android:**
   ```powershell
   npm run android
   ```

6. **Run on iOS:**
   ```powershell
   npm run ios
   ```

---

## 📱 Testing the Application

### Patient Flow
1. Open the app and go to **Patient** tab
2. Enter your name and click **Join Queue**
3. See your queue number and position
4. Queue refreshes automatically every 5 seconds

### Admin Flow
1. Go to **Admin** tab
2. Enter admin key: `admin-secret-key` (default)
3. View current queue
4. Click **Serve Next** to serve patients
5. Queue numbers recalculate automatically
6. Use **Reset Queue** to clear all patients

---

## 🔐 Security Features

- **Admin Authentication**: Secure key-based access to admin endpoints
- **Environment Variables**: Sensitive keys in `.env` files (never committed)
- **CORS Enabled**: Cross-origin requests handled securely
- **Input Validation**: Name validation on patient registration
- **Async Storage**: Local data encrypted by OS

---

## 📊 Queue Algorithm

The queue follows these rules:

1. **New users get `lastNumber + 1`**: Each new patient gets the next sequential number
2. **Remove first person**: When serving next, the first patient in queue is removed
3. **Recalculate numbers**: All remaining patients' queue numbers are recalculated (1, 2, 3, ...)
4. **Broadcast updates**: Updated queue is sent to all clients via API response

**Example:**
```
Initial: [Patient 1 (QN: 1), Patient 2 (QN: 2), Patient 3 (QN: 3)]
Serve Patient 1: [Patient 2 (QN: 1), Patient 3 (QN: 2)]
New Patient 4: [Patient 2 (QN: 1), Patient 3 (QN: 2), Patient 4 (QN: 3)]
```

---

## 🔄 Auto-Refresh Implementation

The frontend automatically refreshes the queue every 5 seconds using:

```javascript
useEffect(() => {
  fetchQueue();
  const interval = setInterval(fetchQueue, 5000);
  return () => clearInterval(interval);
}, []);
```

This ensures real-time updates without manual refreshes.

---

## 💾 AsyncStorage Usage

Patient data is persisted locally:

```javascript
// Save user data
await AsyncStorage.setItem('userQueueData', JSON.stringify({
  queueNumber: 5,
  name: "John Doe",
  timestamp: "2025-11-22T10:30:00Z"
}));

// Load on app startup
const data = await AsyncStorage.getItem('userQueueData');
```

This allows patients to:
- Continue where they left off after closing the app
- See their queue position without re-registering
- Work offline (data syncs when online)

---

## 🌐 Deployment to Vercel

### Backend Deployment

1. **Create Vercel Account:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up and connect your GitHub

2. **Deploy Backend:**
   ```bash
   # Push to GitHub first
   git add .
   git commit -m "Initial commit"
   git push origin main
   
   # Then in Vercel Dashboard:
   # New Project > Import Git Repository > hospital-queue-app
   # Root Directory: backend
   # Click Deploy
   ```

3. **Set Environment Variables in Vercel:**
   - Go to Project Settings > Environment Variables
   - Add: `ADMIN_KEY` = `admin-secret-key`
   - Redeploy

4. **Get API URL:**
   - Your backend will be at: `https://your-vercel-app.vercel.app/api`

---

### Frontend Deployment (Expo / EAS)

1. **Install EAS CLI:**
   ```powershell
   npm install -g eas-cli
   ```

2. **Authenticate:**
   ```powershell
   eas login
   ```

3. **Initialize Project:**
   ```powershell
   cd frontend
   eas build:configure
   ```

4. **Update API URL in app.json:**
   ```json
   {
     "expo": {
       "extra": {
         "apiUrl": "https://your-vercel-app.vercel.app/api"
       }
     }
   }
   ```

5. **Build for iOS/Android:**
   ```powershell
   # iOS
   eas build --platform ios
   
   # Android
   eas build --platform android
   
   # Both
   eas build --platform all
   ```

6. **Submit to App Stores:**
   ```powershell
   eas submit
   ```

---

## 🔄 Firestore Migration

To migrate from in-memory storage to Firestore:

1. **Install Firebase Admin SDK:**
   ```bash
   npm install firebase-admin
   ```

2. **Update `queue-store.js`:**
   - Replace the in-memory functions with commented Firestore code
   - Initialize Firebase Admin in the API handlers
   - Use the Firestore functions instead of in-memory ones

3. **Example Firestore Integration:**
   ```javascript
   // See commented code in each API file for Firestore examples
   // Uncomment and use instead of in-memory functions
   ```

---

## 🛠️ Troubleshooting

### **Queue Not Updating**
- Check API URL in `.env.local`
- Verify backend is running/deployed
- Check browser console for errors

### **Admin Login Fails**
- Default key: `admin-secret-key`
- Check `.env` file has correct `ADMIN_KEY`

### **Expo Build Fails**
- Clear cache: `expo prebuild --clean`
- Update Expo: `npm install -g expo@latest`
- Check Node version: `node --version` (should be 18+)

### **Vercel Deployment Issues**
- Check `vercel.json` configuration
- Verify environment variables are set
- Check API logs in Vercel dashboard

---

## 📚 Technology Stack

### Backend
- **Node.js** - Runtime
- **Vercel** - Serverless hosting
- **CORS** - Cross-origin support
- **Express** (optional) - Local testing

### Frontend
- **React Native** - Mobile framework
- **Expo** - Development platform
- **React Navigation** - Tab navigation
- **Zustand** - State management
- **Axios** - HTTP client
- **AsyncStorage** - Local data persistence

### Styling
- **Native StyleSheet** - React Native styling
- **Hospital Theme** - Blue/white color scheme
- **Responsive Design** - Mobile-first approach

---

## 📝 Environment Variables

### Backend (`.env`)
```
ADMIN_KEY=admin-secret-key
```

### Frontend (`.env.local`)
```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

Or in Vercel:
```
EXPO_PUBLIC_API_URL=https://your-vercel-app.vercel.app/api
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review API endpoint documentation
3. Check logs in Vercel/Expo dashboard
4. Open an issue on GitHub

---

## 🎯 Future Enhancements

- [ ] SMS/Email notifications for patients
- [ ] Real-time WebSocket updates instead of polling
- [ ] Patient analytics dashboard
- [ ] Multiple queue support (different departments)
- [ ] Doctor assignment functionality
- [ ] Patient history and feedback
- [ ] Twilio/SendGrid integration
- [ ] Payment processing
- [ ] Multi-language support

---

## ✅ Checklist for Production

- [ ] Update admin key to a secure value
- [ ] Configure Vercel environment variables
- [ ] Update frontend API URL for production
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set up error logging (e.g., Sentry)
- [ ] Test on real devices
- [ ] Set up monitoring/alerts
- [ ] Create backup/recovery plan
- [ ] Document any custom modifications

---

**Happy Queuing! 🏥**

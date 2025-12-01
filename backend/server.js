/**
 * LOCAL DEVELOPMENT SERVER (Optional)
 * Use this file to test backend APIs locally before deploying to Vercel
 * 
 * Usage:
 * 1. Install express: npm install express
 * 2. Run: node server.js
 * 3. Server will run on http://localhost:3000
 * 
 * Note: This is optional. The /api files are Vercel-ready and don't need Express.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import handlers
import joinQueueHandler from './api/join-queue.js';
import getQueueHandler from './api/get-queue.js';
import serveNextHandler from './api/serve-next.js';
import resetQueueHandler from './api/reset-queue.js';

// Routes
app.post('/api/join-queue', (req, res) => joinQueueHandler(req, res));
app.get('/api/get-queue', (req, res) => getQueueHandler(req, res));
app.post('/api/serve-next', (req, res) => serveNextHandler(req, res));
app.post('/api/reset-queue', (req, res) => resetQueueHandler(req, res));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hospital Queue API',
    version: '1.0.0',
    endpoints: {
      'POST /api/join-queue': 'Register patient',
      'GET /api/get-queue': 'Get queue status',
      'POST /api/serve-next': 'Serve next patient (admin)',
      'POST /api/reset-queue': 'Reset queue (admin)',
      'GET /health': 'Health check',
    },
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Hospital Queue API Server Started   ║
╚════════════════════════════════════════╝

Server: http://localhost:${PORT}
API: http://localhost:${PORT}/api

Endpoints:
  POST   /api/join-queue      - Register patient
  GET    /api/get-queue       - Get queue status
  POST   /api/serve-next      - Serve next patient (admin)
  POST   /api/reset-queue     - Reset queue (admin)
  GET    /health              - Health check

Admin Key: ${process.env.ADMIN_KEY || 'admin-secret-key'}

Press Ctrl+C to stop server
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  process.exit(0);
});

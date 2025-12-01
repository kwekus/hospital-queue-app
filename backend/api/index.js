/**
 * Backend Server Entry Point
 * This file exports handlers for Vercel serverless deployment
 * For local development, use: npm run dev
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getQueue, addToQueue, serveNext, resetQueue, getAnalytics } from './queue-store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const ADMIN_KEY = process.env.ADMIN_KEY || 'admin-secret-key';

// For local development with Express (optional)
const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
  // Local development server
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Serve static files
  app.use(express.static(path.join(__dirname, '../public')));

  // API Routes - All in one place for clarity
  
  // Get queue
  app.get('/api/get-queue', (req, res) => {
    try {
      const queue = getQueue();
      return res.status(200).json({
        success: true,
        queue,
        count: queue.length,
        message: `Current queue has ${queue.length} patients waiting`,
      });
    } catch (error) {
      console.error('Error in /api/get-queue:', error.message);
      return res.status(500).json({ error: error.message });
    }
  });

  // Join queue
  app.post('/api/join-queue', (req, res) => {
    try {
      const { name } = req.body;
      if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: 'Name is required and must be a string' });
      }
      const patient = addToQueue(name);
      return res.status(201).json({
        success: true,
        patient,
        message: `${name}, you are number ${patient.queueNumber} in the queue`,
      });
    } catch (error) {
      console.error('Error in /api/join-queue:', error.message);
      return res.status(500).json({ error: error.message });
    }
  });

  // Serve next
  app.post('/api/serve-next', (req, res) => {
    try {
      const { adminKey } = req.body;
      if (adminKey !== ADMIN_KEY) {
        return res.status(403).json({ error: 'Unauthorized: Invalid admin key' });
      }
      const servedPatient = serveNext();
      if (!servedPatient) {
        return res.status(200).json({
          success: true,
          servedPatient: null,
          queue: [],
          message: 'Queue is empty',
        });
      }
      const updatedQueue = getQueue();
      return res.status(200).json({
        success: true,
        servedPatient,
        queue: updatedQueue,
        message: `${servedPatient.name} is being served. Queue recalculated.`,
      });
    } catch (error) {
      console.error('Error in /api/serve-next:', error.message);
      return res.status(500).json({ error: error.message });
    }
  });

  // Reset queue
  app.post('/api/reset-queue', (req, res) => {
    try {
      const { adminKey } = req.body;
      if (adminKey !== ADMIN_KEY) {
        return res.status(403).json({ error: 'Unauthorized: Invalid admin key' });
      }
      resetQueue();
      return res.status(200).json({
        success: true,
        message: 'Queue has been reset successfully',
      });
    } catch (error) {
      console.error('Error in /api/reset-queue:', error.message);
      return res.status(500).json({ error: error.message });
    }
  });

  // Get analytics
  app.get('/api/analytics', (req, res) => {
    try {
      const analytics = getAnalytics();
      return res.status(200).json({ analytics });
    } catch (error) {
      console.error('Error in /api/analytics:', error.message);
      return res.status(500).json({ error: error.message });
    }
  });

  // Health check
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Serve index.html for root and SPA routes
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  });

  // 404 handling
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
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
  GET    /api/analytics       - Get analytics data
  GET    /health              - Health check

Admin Key: ${ADMIN_KEY}

Press Ctrl+C to stop server
    `);
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nShutting down gracefully...');
    process.exit(0);
  });

  // Uncaught exception handler
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
  });
} else {
  console.log('Production mode - use Vercel for deployment');
}

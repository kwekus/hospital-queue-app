/**
 * GET /api/analytics
 * Get queue analytics and statistics
 * Response: { analytics data with wait times, peak hours, etc. }
 */

import { getAnalytics } from './queue-store.js';

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const analytics = getAnalytics();
    return res.status(200).json({ analytics });
  } catch (error) {
    console.error('Error in analytics:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

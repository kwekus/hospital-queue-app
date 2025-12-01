/**
 * In-memory queue store with analytics
 * Tracks patients, queue status, and detailed analytics data
 */

let queueData = [];
let lastNumber = 0;
let analytics = {
  totalServed: 0,
  totalRegistered: 0,
  servedPatients: [],
  peakHours: {},
  dailyStats: {},
};

/**
 * Get entire queue
 * @returns {Array} Current queue array
 */
const getQueue = () => {
  return [...queueData];
};

/**
 * Add patient to queue
 * @param {string} name - Patient name
 * @returns {Object} Patient object with assigned number
 */
const addToQueue = (name) => {
  const now = new Date();
  const queueNumber = ++lastNumber;
  const patient = {
    id: Date.now() + Math.random(),
    name,
    queueNumber,
    timestamp: now.toISOString(),
    status: 'waiting',
    estimatedWaitTime: calculateEstimatedWaitTime(),
  };
  queueData.push(patient);

  // Update analytics
  analytics.totalRegistered++;
  const hour = now.getHours();
  analytics.peakHours[hour] = (analytics.peakHours[hour] || 0) + 1;

  const dateKey = now.toISOString().split('T')[0];
  if (!analytics.dailyStats[dateKey]) {
    analytics.dailyStats[dateKey] = { registered: 0, served: 0 };
  }
  analytics.dailyStats[dateKey].registered++;

  return patient;
};

/**
 * Serve next patient and recalculate queue numbers
 * @returns {Object} Served patient or null
 */
const serveNext = () => {
  if (queueData.length === 0) {
    return null;
  }

  const servedPatient = queueData.shift();
  servedPatient.status = 'served';
  servedPatient.servedAt = new Date().toISOString();

  // Calculate wait time
  const waitTimeMs = new Date(servedPatient.servedAt) - new Date(servedPatient.timestamp);
  servedPatient.waitTime = Math.round(waitTimeMs / 60000); // Convert to minutes

  // Update analytics
  analytics.totalServed++;
  analytics.servedPatients.push(servedPatient);

  const dateKey = new Date(servedPatient.servedAt).toISOString().split('T')[0];
  if (!analytics.dailyStats[dateKey]) {
    analytics.dailyStats[dateKey] = { registered: 0, served: 0 };
  }
  analytics.dailyStats[dateKey].served++;

  // Recalculate queue numbers for remaining patients
  queueData.forEach((patient, index) => {
    patient.queueNumber = index + 1;
    patient.estimatedWaitTime = calculateEstimatedWaitTime();
  });

  return servedPatient;
};

/**
 * Reset entire queue
 */
const resetQueue = () => {
  queueData = [];
  lastNumber = 0;
  analytics.servedPatients = [];
};

/**
 * Get last assigned number
 * @returns {number} Last queue number
 */
const getLastNumber = () => {
  return lastNumber;
};

/**
 * Get analytics data
 * @returns {Object} Analytics including wait times, peak hours, daily stats
 */
const getAnalytics = () => {
  const averageWaitTime = analytics.servedPatients.length > 0
    ? Math.round(
        analytics.servedPatients.reduce((sum, p) => sum + (p.waitTime || 0), 0) /
          analytics.servedPatients.length
      )
    : 0;

  const peakHour = Object.entries(analytics.peakHours).sort((a, b) => b[1] - a[1])[0];

  return {
    totalRegistered: analytics.totalRegistered,
    totalServed: analytics.totalServed,
    currentQueueSize: queueData.length,
    averageWaitTime: averageWaitTime,
    peakHour: peakHour ? parseInt(peakHour[0]) : null,
    peakHourCount: peakHour ? peakHour[1] : 0,
    dailyStats: analytics.dailyStats,
    recentlyServed: analytics.servedPatients.slice(-10),
    queueHealthScore: calculateHealthScore(),
  };
};

/**
 * Calculate estimated wait time in minutes
 */
function calculateEstimatedWaitTime() {
  // Assuming average service time of 10 minutes per patient
  const avgServiceTime = 10;
  return queueData.length * avgServiceTime;
}

/**
 * Calculate queue health score (0-100)
 */
function calculateHealthScore() {
  if (analytics.totalServed === 0) return 100;

  const avgWait = analytics.servedPatients.length > 0
    ? analytics.servedPatients.reduce((sum, p) => sum + (p.waitTime || 0), 0) /
      analytics.servedPatients.length
    : 0;

  // Ideal wait time is 15 minutes
  const idealWaitTime = 15;
  let score = 100 - (avgWait / idealWaitTime) * 50;
  score = Math.max(0, Math.min(100, score));
  return Math.round(score);
}

export { getQueue, addToQueue, serveNext, resetQueue, getLastNumber, getAnalytics };

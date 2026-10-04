const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
try {
  require('dotenv').config({ path: path.join(__dirname, '.env') });
} catch (e) {
  // dotenv optional fallback
}

// Helper to sanitize & encode MongoDB Atlas URIs (e.g. handle '@' in passwords and query formatting)
function formatMongoUri(rawUri) {
  if (!rawUri) return '';
  let uri = rawUri.trim();
  // Normalize if appName query was placed before db name
  uri = uri.replace(/\/\?appName=([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)/, '/$2?retryWrites=true&w=majority&appName=$1');
  
  const prefixMatch = uri.match(/^(mongodb(?:\+srv)?:\/\/)([^:]+):(.+)(@[^@]+)$/);
  if (prefixMatch) {
    const protocol = prefixMatch[1];
    const user = prefixMatch[2];
    const pass = prefixMatch[3];
    const hostAndQuery = prefixMatch[4];
    const encodedPass = encodeURIComponent(decodeURIComponent(pass));
    uri = `${protocol}${user}:${encodedPass}${hostAndQuery}`;
  }
  return uri;
}

const { router: authRouter, ensureDemoMerchant } = require('./routes/authRoutes');
const merchantRouter = require('./routes/merchantRoutes');
const customerRouter = require('./routes/customerRoutes');
const adminRouter = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = formatMongoUri(process.env.MONGO_URI);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/merchant', merchantRouter);
app.use('/api/customer', customerRouter);
app.use('/api/admin', adminRouter);
app.use('/api/team', adminRouter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    platform: 'BeAurex Platform',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

const systemStore = require('./services/systemStore');

// Public endpoint for Landing Page live plans (synchronized across Super Admin and MongoDB)
app.get('/api/public/plans', async (req, res) => {
  try {
    const plans = await systemStore.getPublicPlans();
    res.json({ success: true, plans });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Serve frontend build if exists
const fs = require('fs');
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    }
  });
}

// Database connection caching for serverless environments (Vercel) & traditional servers
let cachedDb = null;
async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (cachedDb) {
    return cachedDb;
  }
  if (!MONGO_URI) {
    console.warn('⚠️ MONGO_URI is not configured in .env');
    return null;
  }
  cachedDb = mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000
  }).then((m) => {
    const safeUri = MONGO_URI.replace(/:([^@]+)@/, ':****@');
    console.log('✅ Connected to MongoDB Atlas at', safeUri);
    try { ensureDemoMerchant(); } catch (_) {}
    return m;
  }).catch((err) => {
    console.warn('⚠️ MongoDB Atlas connection notice:', err.message);
    cachedDb = null;
  });
  return cachedDb;
}

// Auto-connect middleware for serverless invocations
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
  next();
});

// Start server if run directly (local development / container)
if (process.env.VERCEL !== '1' && require.main === module) {
  connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 BeAurex API Server listening on port ${PORT}`);
    console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Plan = require('../models/Plan');
const SystemConfig = require('../models/SystemConfig');

const DATA_DIR = path.join(__dirname, '../data');
const PLANS_FILE = path.join(DATA_DIR, 'plans.json');
const CONFIG_FILE = path.join(DATA_DIR, 'system_config.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 1. Initial / Default Platform Plans (Matches media_1791114538819.png)
const initialPlans = [
  {
    id: 'plan_standard',
    name: 'Standard Plan',
    price: 24000,
    originalPrice: 36000,
    period: '/ Year',
    subtext: 'Perfect for local retail shops getting started',
    tagText: 'Equivalent to ₹2,000/month',
    highlightBadge: '',
    isPopular: false,
    trialDays: 2,
    scansLimit: 'Unlimited customer QR scans',
    features: [
      'Customer retention system',
      'Free account setup & acrylic config',
      'Custom QR code standee generator',
      'Unlimited customer QR scans',
      'Standard Business Hours Support'
    ],
    ctaText: 'Start 2-Day Trial',
    showOnLandingPage: true,
    isActive: true,
    displayOrder: 1
  },
  {
    id: 'plan_professional',
    name: 'Professional Plan',
    price: 49000,
    originalPrice: 72000,
    period: '/ 3 Years',
    subtext: 'Accelerated conversion tools for multi-counter growth',
    tagText: 'Only ₹1,361/month',
    highlightBadge: 'Most Popular',
    isPopular: true,
    trialDays: 2,
    scansLimit: 'Unlimited customer QR scans',
    features: [
      'Customer retention system',
      'Free account setup & acrylic config',
      'Custom QR code standee generator',
      'Unlimited customer QR scans',
      'Priority VIP Support',
      'Free Continuous Feature Updates'
    ],
    ctaText: 'Start 2-Day Trial',
    showOnLandingPage: true,
    isActive: true,
    displayOrder: 2
  },
  {
    id: 'plan_legacy',
    name: 'Legacy Plan',
    price: 75000,
    originalPrice: 120000,
    period: 'Lifetime',
    subtext: 'Ultimate lifetime system configuration',
    tagText: 'One-Time Payment • No Renewals',
    highlightBadge: 'Best Value',
    isPopular: false,
    trialDays: 2,
    scansLimit: 'Unlimited customer QR scans',
    features: [
      'Customer retention system',
      'Free account setup & acrylic config',
      'Unlimited customer QR scans',
      'Priority VIP Support',
      'Dedicated Relationship Manager',
      'All Future Enterprise Upgrades'
    ],
    ctaText: 'Start 2-Day Trial',
    showOnLandingPage: true,
    isActive: true,
    displayOrder: 3
  },
  {
    id: 'plan_trial',
    name: '2-Day Free Trial',
    price: 0,
    originalPrice: 0,
    period: '2 Days',
    subtext: 'Test all features risk-free with zero credit card required',
    tagText: '100% Free',
    highlightBadge: 'Risk-Free',
    isPopular: false,
    trialDays: 2,
    scansLimit: '500 customer QR scans',
    features: [
      'Customer retention system',
      'Digital Standee PDF generator',
      'Basic customer scan telemetry',
      '2-Day Evaluation Window'
    ],
    ctaText: 'Claim Free Trial',
    showOnLandingPage: false,
    isActive: true,
    displayOrder: 4
  }
];

// 2. Initial / Default System Config & Integrations
const initialConfig = {
  razorpayKeyId: 'rzp_live_9a8B7c6D5e4F3g',
  razorpayKeySecret: 'sec_live_k8J7h6G5f4D3s2A1',
  razorpayMode: 'LIVE',
  mongoUri: process.env.MONGO_URI || '',
  mongoStatus: 'CONNECTED (MongoDB Atlas Cluster)',
  smsProvider: 'SMSCOUNTRY',
  smsApiKey: 'sms_live_key_9182736450',
  smsSenderId: 'BEAURE',
  cooldownHours: 12,
  enableGeofencing: true,
  maxOtpAttempts: 5,
  // WhatsApp Cloud API
  whatsappToken: 'EAAQ...whatsapp_live_token',
  whatsappPhoneId: '109283746501928',
  whatsappBusinessId: 'waba_9918273645',
  // Payment Gateways
  cashfreeAppId: 'CF_app_live_883921',
  cashfreeSecret: 'CF_sec_live_99482104',
  stripeKey: 'pk_live_51PBeAurexPlatform',
  // Email Service
  emailProvider: 'RESEND',
  emailApiKey: 're_live_9a8B7c6D5e4F3g2H1',
  emailSenderAddress: 'notifications@beaurex.com',
  // Maps & Location
  googleMapsApiKey: 'AIzaSyA_LiveGoogleMapsKey2026',
  // Cloud Asset Storage
  cloudinaryCloudName: 'beaurex-assets',
  cloudinaryApiKey: '817263549102837',
  cloudinaryApiSecret: 'cld_sec_9918273645',
  // AI Automation
  geminiApiKey: 'AIzaSyGeminiApiKeyLive2026',
  openaiApiKey: 'sk-proj-liveOpenAiKeyBeAurex',
  // Custom API keys array for future website expansions
  customApiKeys: [
    {
      id: 'cak_1',
      name: 'Shiprocket Logistics API',
      keyName: 'SHIPROCKET_AUTH_TOKEN',
      keyValue: 'sr_tok_live_7718294021',
      env: 'Production',
      description: 'Used for QR standee acrylic frame courier delivery tracking'
    },
    {
      id: 'cak_2',
      name: 'Zoho CRM Lead Sync',
      keyName: 'ZOHO_CRM_CLIENT_SECRET',
      keyValue: 'zh_sec_live_8829410382',
      env: 'Production',
      description: 'Auto-sync field agent merchant onboarding leads'
    }
  ]
};

// In-Memory Caches
let memoryPlans = [...initialPlans];
let memoryConfig = { ...initialConfig };

// Helper: Read JSON from file
function readJsonFile(filePath, fallback) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn(`[SystemStore] Error reading ${filePath}:`, err.message);
  }
  return fallback;
}

// Helper: Write JSON to file
function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`[SystemStore] Error writing to ${filePath}:`, err.message);
  }
}

// Load initial state from file or defaults
memoryPlans = readJsonFile(PLANS_FILE, initialPlans);
memoryConfig = readJsonFile(CONFIG_FILE, initialConfig);

// Save to disk to ensure files exist
if (!fs.existsSync(PLANS_FILE)) writeJsonFile(PLANS_FILE, memoryPlans);
if (!fs.existsSync(CONFIG_FILE)) writeJsonFile(CONFIG_FILE, memoryConfig);

// Helper to check if Mongo is ready
function isMongoConnected() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

// Synchronize with MongoDB safely
async function syncWithMongo() {
  if (!isMongoConnected()) return;

  try {
    // 1. Sync Plans with MongoDB
    const count = await Plan.countDocuments().catch(() => 0);
    if (count === 0) {
      await Plan.insertMany(memoryPlans).catch(() => {});
    } else {
      const dbPlans = await Plan.find().sort({ displayOrder: 1 }).lean().catch(() => []);
      if (dbPlans && dbPlans.length > 0) {
        memoryPlans = dbPlans.map(p => ({
          ...p,
          id: p.id || p._id?.toString()
        }));
        writeJsonFile(PLANS_FILE, memoryPlans);
      }
    }

    // 2. Sync Config with MongoDB
    const dbConfig = await SystemConfig.findOne().lean().catch(() => null);
    if (!dbConfig) {
      await SystemConfig.create({
        ...memoryConfig,
        plansConfig: memoryPlans
      }).catch(() => {});
    } else {
      memoryConfig = {
        ...memoryConfig,
        ...dbConfig
      };
      writeJsonFile(CONFIG_FILE, memoryConfig);
    }
  } catch (err) {
    console.warn('[SystemStore] Mongo sync notice:', err.message);
  }
}

// Listen to MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('[SystemStore] MongoDB connected, syncing system store...');
  syncWithMongo();
});

// Periodic background check if connected
setInterval(() => {
  if (isMongoConnected()) {
    syncWithMongo().catch(() => {});
  }
}, 30000);

// API Methods
const systemStore = {
  // Get all active plans visible on Landing Page
  async getPublicPlans() {
    if (isMongoConnected()) {
      try {
        const dbPlans = await Plan.find({ isActive: true, showOnLandingPage: true }).sort({ displayOrder: 1 }).lean();
        if (dbPlans && dbPlans.length > 0) {
          return dbPlans;
        }
      } catch (e) {}
    }
    const publicList = memoryPlans.filter(p => p.isActive !== false && p.showOnLandingPage !== false);
    return publicList.length > 0 ? publicList : memoryPlans.slice(0, 3);
  },

  // Get all plans (for Super Admin dashboard management)
  async getAllPlans() {
    if (isMongoConnected()) {
      try {
        const dbPlans = await Plan.find().sort({ displayOrder: 1 }).lean();
        if (dbPlans && dbPlans.length > 0) {
          memoryPlans = dbPlans;
          writeJsonFile(PLANS_FILE, memoryPlans);
          return memoryPlans;
        }
      } catch (e) {}
    }
    return memoryPlans;
  },

  // Save/Replace entire plans array
  async savePlans(newPlans) {
    if (!Array.isArray(newPlans)) return memoryPlans;

    // Normalize IDs and display orders
    memoryPlans = newPlans.map((p, idx) => ({
      ...p,
      id: p.id || ('plan_' + Date.now() + Math.random().toString(36).substr(2, 4)),
      displayOrder: p.displayOrder !== undefined ? p.displayOrder : (idx + 1)
    }));

    // Save to disk immediately
    writeJsonFile(PLANS_FILE, memoryPlans);

    // Save to MongoDB asynchronously if connected
    if (isMongoConnected()) {
      try {
        for (const p of memoryPlans) {
          await Plan.findOneAndUpdate(
            { id: p.id },
            { $set: p },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          ).catch(() => {});
        }
        await SystemConfig.findOneAndUpdate({}, { plansConfig: memoryPlans }, { upsert: true }).catch(() => {});
      } catch (err) {
        console.warn('[SystemStore] DB write error for plans:', err.message);
      }
    }

    return memoryPlans;
  },

  // Upsert a single plan
  async savePlanItem(planData) {
    if (!planData) return null;
    const p = { ...planData };
    if (!p.id) p.id = 'plan_' + Date.now() + Math.random().toString(36).substr(2, 4);

    const idx = memoryPlans.findIndex(item => item.id === p.id);
    if (idx !== -1) {
      memoryPlans[idx] = { ...memoryPlans[idx], ...p };
    } else {
      p.displayOrder = p.displayOrder || (memoryPlans.length + 1);
      memoryPlans.push(p);
    }

    writeJsonFile(PLANS_FILE, memoryPlans);

    if (isMongoConnected()) {
      try {
        await Plan.findOneAndUpdate(
          { id: p.id },
          { $set: p },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        ).catch(() => {});
        await SystemConfig.findOneAndUpdate({}, { plansConfig: memoryPlans }, { upsert: true }).catch(() => {});
      } catch (err) {
        console.warn('[SystemStore] DB upsert plan error:', err.message);
      }
    }

    return p;
  },

  // Delete a plan
  async deletePlan(planId) {
    memoryPlans = memoryPlans.filter(p => p.id !== planId);
    writeJsonFile(PLANS_FILE, memoryPlans);

    if (isMongoConnected()) {
      try {
        await Plan.findOneAndDelete({ id: planId }).catch(() => {});
        await SystemConfig.findOneAndUpdate({}, { plansConfig: memoryPlans }, { upsert: true }).catch(() => {});
      } catch (err) {
        console.warn('[SystemStore] DB delete plan error:', err.message);
      }
    }

    return memoryPlans;
  },

  // Get System Configuration & API Keys
  async getConfig() {
    if (isMongoConnected()) {
      try {
        const dbConfig = await SystemConfig.findOne().lean();
        if (dbConfig) {
          memoryConfig = { ...memoryConfig, ...dbConfig };
          writeJsonFile(CONFIG_FILE, memoryConfig);
          return memoryConfig;
        }
      } catch (e) {}
    }
    return memoryConfig;
  },

  // Save System Configuration & API Keys
  async saveConfig(updates) {
    memoryConfig = {
      ...memoryConfig,
      ...updates
    };

    writeJsonFile(CONFIG_FILE, memoryConfig);

    if (isMongoConnected()) {
      try {
        await SystemConfig.findOneAndUpdate({}, { $set: memoryConfig }, { upsert: true }).catch(() => {});
      } catch (err) {
        console.warn('[SystemStore] DB update config error:', err.message);
      }
    }

    return memoryConfig;
  },

  // Add Custom API Key
  async addCustomKey(keyData) {
    const keyEntry = {
      id: 'cak_' + Date.now(),
      name: keyData.name,
      keyName: keyData.keyName,
      keyValue: keyData.keyValue,
      env: keyData.env || 'Production',
      description: keyData.description || 'Custom external API integration key',
      createdAt: new Date().toISOString()
    };

    memoryConfig.customApiKeys = [keyEntry, ...(memoryConfig.customApiKeys || [])];
    writeJsonFile(CONFIG_FILE, memoryConfig);

    if (isMongoConnected()) {
      try {
        await SystemConfig.findOneAndUpdate({}, { customApiKeys: memoryConfig.customApiKeys }, { upsert: true }).catch(() => {});
      } catch (err) {}
    }

    return keyEntry;
  },

  // Delete Custom API Key
  async deleteCustomKey(keyId) {
    memoryConfig.customApiKeys = (memoryConfig.customApiKeys || []).filter(k => k.id !== keyId);
    writeJsonFile(CONFIG_FILE, memoryConfig);

    if (isMongoConnected()) {
      try {
        await SystemConfig.findOneAndUpdate({}, { customApiKeys: memoryConfig.customApiKeys }).catch(() => {});
      } catch (err) {}
    }

    return memoryConfig.customApiKeys;
  }
};

module.exports = systemStore;

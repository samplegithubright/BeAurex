const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Plan = require('../models/Plan');
const SystemConfig = require('../models/SystemConfig');

const Contact = require('../models/Contact');

const DATA_DIR = path.join(__dirname, '../data');
const PLANS_FILE = path.join(DATA_DIR, 'plans.json');
const CONFIG_FILE = path.join(DATA_DIR, 'system_config.json');
const LEGAL_FILE = path.join(DATA_DIR, 'legal_policies.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');
const FAQS_FILE = path.join(DATA_DIR, 'faqs.json');

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

// 3. Initial / Default Legal Policies (Privacy Policy & Terms of Service)
const initialPolicies = {
  privacy: {
    type: 'Privacy Policy',
    title: 'Privacy Policy',
    status: 'Published',
    lastUpdated: 'May 24, 2026 08:20 AM',
    version: '1.0',
    publishedBy: 'Super Admin',
    publishedOn: 'May 24, 2026 08:20 AM',
    content: `BeAurex Platform Privacy Policy (v1.0)

At BeAurex, we value your privacy and are committed to protecting your personal information and commercial integrity.

1. Information We Collect
We collect necessary information to provide and operate digital loyalty programs:
• Merchant Business Information (Store name, business category, counter address, contact details)
• Customer Profile Data (Name, email address, customer ID, phone number if provided)
• QR & Stamp Activity (Counter scan timestamps, stamps earned, rewards unlocked and redeemed)
• Analytics & Device Telemetry (Browser details, IP address for security & fraud protection)

2. How We Use Your Information
We use information strictly for:
• Operating customer rewards and digital stamp issuance
• Validating customer reward claims at merchant physical counters
• Preventing fraudulent or duplicate scans
• Facilitating peer-to-peer customer referral rewards
• Account security and service announcements

3. Zero Third-Party Selling Guarantee
BeAurex NEVER sells, rents, or shares customer or merchant personal contact information with third-party advertisers, data brokers, or marketing networks.

4. Data Security & Storage
All communication between apps and BeAurex servers is protected using 256-bit TLS/SSL encryption. Data is stored in secure, SOC2-compliant cloud database infrastructure with automated backups and firewall filtering.

5. Your Rights & Data Deletion
Customers and merchants have full control over their account data. You may request account review, data export, or complete account deletion at any time by contacting our privacy compliance desk at support@beaurex.com. Requests are processed within 48 business hours.`
  },
  terms: {
    type: 'Terms & Conditions',
    title: 'Terms & Conditions',
    status: 'Published',
    lastUpdated: 'May 24, 2026 08:20 AM',
    version: '1.0',
    publishedBy: 'Super Admin',
    publishedOn: 'May 24, 2026 08:20 AM',
    content: `BeAurex Platform Terms & Conditions (v1.0)

Welcome to BeAurex. These Terms and Conditions govern your access to and usage of the BeAurex loyalty platform, merchant dashboard, counter standee QR codes, and customer web experience.

1. Acceptance of Terms
By accessing or using BeAurex, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to all terms, you may not access or use our services.

2. Merchant Obligations & Counter Conduct
• Participating merchants agree to honor validly earned digital stamps and approved reward claims presented by registered customers.
• Merchants must not manipulate scan telemetry or create counterfeit QR displays.
• Counter staff must verify the 6-character Customer ID before confirming reward redemptions.

3. Customer Rewards & Points Policy
• Loyalty stamps and reward vouchers are issued at participating merchant businesses and hold promotional value solely for in-store redemption as described.
• Stamps and points carry no direct legal tender cash value outside designated partner stores.
• Referrals: Customers earning referral bonuses must ensure referred friends are authentic first-time visitors.

4. Platform Availability & Fair Use
• BeAurex strives for 99.9% platform availability. Periodic system maintenance will be communicated in advance.
• Automated bots, GPS spoofing, automated QR scan spamming, and rate-limit circumvention are strictly prohibited and will result in immediate account termination.

5. Subscription & Billing Terms
• Merchants choosing paid subscription plans are billed according to their chosen billing period (Annual / 3-Year / Lifetime).
• Standee acrylic kits are dispatched within 2-3 business days upon account activation.
• Any disputes regarding subscription billing must be raised within 14 calendar days to support@beaurex.com.`
  }
};

// 4. Initial / Default Platform FAQs (Matches Landing Page exactly)
const initialFaqs = [
  {
    id: 'f1',
    question: "Will my account be automatically charged when the trial ends?",
    answer: "Absolutely not. We do not require payment details to start your trial. There are zero auto-debit loops. You manually choose whether to upgrade from your merchant hub when you see real repeat visit revenue.",
    category: 'General',
    status: 'Published',
    order: 1,
    lastUpdated: 'May 24, 2026 11:20 AM'
  },
  {
    id: 'f2',
    question: "How is user phone number security managed?",
    answer: "We focus strictly on isolated cloud privacy. Mobile numbers are verified via instantaneous SMS OTP and used solely for in-store voucher redemption. Shoppers face zero unsolicited promotional marketing.",
    category: 'General',
    status: 'Published',
    order: 2,
    lastUpdated: 'May 24, 2026 10:45 AM'
  },
  {
    id: 'f3',
    question: "Do customers need to download an application from the App Store?",
    answer: "No app download is required! Shoppers open their standard smartphone camera, scan the standee QR, and the reward experience immediately appears in their default browser.",
    category: 'General',
    status: 'Published',
    order: 3,
    lastUpdated: 'May 24, 2026 09:30 AM'
  },
  {
    id: 'f4',
    question: "Can I customize the discounts and reward percentages?",
    answer: "Yes, you have full control over reward campaign rules in your Merchant Hub. You can set percentage discounts, flat rupee off amounts, or free signature items with specific probability chances.",
    category: 'Rewards',
    status: 'Published',
    order: 4,
    lastUpdated: 'May 24, 2026 09:15 AM'
  },
  {
    id: 'f5',
    question: "How does the acrylic counter standee get configured?",
    answer: "Once registered, your dashboard instantly generates a customized, high-resolution vector print file sized for standard 5x7 inch acrylic tabletop frames. You can download and place it immediately on your checkout desk.",
    category: 'Merchant',
    status: 'Published',
    order: 5,
    lastUpdated: 'May 24, 2026 08:50 AM'
  }
];

// In-Memory Caches
let memoryPlans = [...initialPlans];
let memoryConfig = { ...initialConfig };
let memoryPolicies = { ...initialPolicies };
let memoryFaqs = [...initialFaqs];

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

// Helper: Write JSON to file only if content actually changed
function writeJsonFile(filePath, data) {
  try {
    const newContent = JSON.stringify(data, null, 2);
    if (fs.existsSync(filePath)) {
      try {
        const oldContent = fs.readFileSync(filePath, 'utf-8');
        if (oldContent === newContent) {
          return; // Identical: preserve mtime and avoid triggering file watchers
        }
      } catch (_) {}
    }
    fs.writeFileSync(filePath, newContent, 'utf-8');
  } catch (err) {
    console.error(`[SystemStore] Error writing to ${filePath}:`, err.message);
  }
}

// Load initial state from file or defaults
memoryPlans = readJsonFile(PLANS_FILE, initialPlans);
memoryConfig = readJsonFile(CONFIG_FILE, initialConfig);
memoryPolicies = readJsonFile(LEGAL_FILE, initialPolicies);
memoryFaqs = readJsonFile(FAQS_FILE, initialFaqs);

// Save to disk to ensure files exist
if (!fs.existsSync(PLANS_FILE)) writeJsonFile(PLANS_FILE, memoryPlans);
if (!fs.existsSync(CONFIG_FILE)) writeJsonFile(CONFIG_FILE, memoryConfig);
if (!fs.existsSync(LEGAL_FILE)) writeJsonFile(LEGAL_FILE, memoryPolicies);
if (!fs.existsSync(FAQS_FILE)) writeJsonFile(FAQS_FILE, memoryFaqs);

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
        plansConfig: memoryPlans,
        legalPolicies: memoryPolicies,
        faqs: memoryFaqs
      }).catch(() => {});
    } else {
      memoryConfig = {
        ...memoryConfig,
        ...dbConfig
      };
      writeJsonFile(CONFIG_FILE, memoryConfig);

      // 3. Sync Legal Policies with MongoDB
      if (dbConfig.legalPolicies && (dbConfig.legalPolicies.privacy || dbConfig.legalPolicies.terms)) {
        memoryPolicies = {
          ...memoryPolicies,
          ...dbConfig.legalPolicies
        };
        writeJsonFile(LEGAL_FILE, memoryPolicies);
      } else {
        await SystemConfig.findOneAndUpdate({}, { legalPolicies: memoryPolicies }).catch(() => {});
      }

      // 4. Sync FAQs with MongoDB
      if (dbConfig.faqs && Array.isArray(dbConfig.faqs) && dbConfig.faqs.length > 0) {
        memoryFaqs = dbConfig.faqs;
        writeJsonFile(FAQS_FILE, memoryFaqs);
      } else {
        await SystemConfig.findOneAndUpdate({}, { faqs: memoryFaqs }).catch(() => {});
      }
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
  },

  // Helper to determine if Razorpay has real user credentials configured
  isRazorpayConfigured(cfg) {
    const keyId = (cfg && cfg.razorpayKeyId) || process.env.RAZORPAY_KEY_ID || '';
    const keySecret = (cfg && cfg.razorpayKeySecret) || process.env.RAZORPAY_KEY_SECRET || '';
    const isDummy = keyId === 'rzp_live_9a8B7c6D5e4F3g' || keyId.startsWith('rzp_live_9a8B7c');
    return Boolean(keyId && keySecret && !isDummy && keyId.length >= 10);
  },

  // Helper to determine if SMS gateway has real credentials configured
  isSmsConfigured(cfg) {
    const apiKey = (cfg && cfg.smsApiKey) || process.env.FAST2SMS_API_KEY || process.env.MSG91_AUTH_KEY || '';
    const isDummy = apiKey === 'sms_live_key_9182736450';
    const hasTwilio = Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN);
    return Boolean((apiKey && !isDummy && apiKey.length >= 8) || hasTwilio);
  },

  // Helper to determine if SMTP has real credentials configured
  isSmtpConfigured(cfg) {
    const host = (cfg && cfg.smtpHost) || process.env.SMTP_HOST || '';
    const user = (cfg && cfg.smtpUser) || process.env.SMTP_USER || '';
    const emailKey = (cfg && cfg.emailApiKey) || process.env.RESEND_API_KEY || '';
    const isDummyKey = emailKey === 're_live_9a8B7c6D5e4F3g2H1';
    return Boolean((host && user) || (emailKey && !isDummyKey && emailKey.length >= 10));
  },

  // Gateway status summary for frontend checks
  async getGatewayStatus() {
    const cfg = await this.getConfig();
    return {
      razorpay: {
        isConfigured: this.isRazorpayConfigured(cfg),
        mode: cfg.razorpayMode || 'LIVE',
        keyId: this.isRazorpayConfigured(cfg) ? cfg.razorpayKeyId : null
      },
      sms: {
        isConfigured: this.isSmsConfigured(cfg),
        provider: cfg.smsProvider || 'FAST2SMS'
      },
      smtp: {
        isConfigured: this.isSmtpConfigured(cfg),
        host: cfg.smtpHost || null,
        provider: cfg.emailProvider || 'SMTP'
      }
    };
  },

  // Get all Legal Policies (Privacy Policy & Terms of Service)
  async getLegalPolicies() {
    if (isMongoConnected()) {
      try {
        const dbConfig = await SystemConfig.findOne().lean();
        if (dbConfig && dbConfig.legalPolicies && (dbConfig.legalPolicies.privacy || dbConfig.legalPolicies.terms)) {
          memoryPolicies = {
            ...memoryPolicies,
            ...dbConfig.legalPolicies
          };
          return memoryPolicies;
        }
      } catch (e) {}
    }
    return memoryPolicies;
  },

  // Get single policy ('privacy' | 'terms')
  async getLegalPolicy(type) {
    const policies = await this.getLegalPolicies();
    const key = type === 'terms' ? 'terms' : 'privacy';
    return policies[key] || initialPolicies[key];
  },

  // Save Legal Policies (used by Super Admin to update across all portals)
  async saveLegalPolicies(updates) {
    if (!updates) return memoryPolicies;
    const now = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

    if (updates.privacy) {
      memoryPolicies.privacy = {
        ...memoryPolicies.privacy,
        ...updates.privacy,
        lastUpdated: updates.privacy.lastUpdated || now
      };
    }
    if (updates.terms) {
      memoryPolicies.terms = {
        ...memoryPolicies.terms,
        ...updates.terms,
        lastUpdated: updates.terms.lastUpdated || now
      };
    }
    if (updates.type && (updates.type === 'privacy' || updates.type === 'terms')) {
      const k = updates.type;
      memoryPolicies[k] = {
        ...memoryPolicies[k],
        ...updates,
        lastUpdated: updates.lastUpdated || now
      };
    }

    writeJsonFile(LEGAL_FILE, memoryPolicies);

    if (isMongoConnected()) {
      try {
        await SystemConfig.findOneAndUpdate({}, { legalPolicies: memoryPolicies }, { upsert: true }).catch(() => {});
      } catch (err) {
        console.warn('[SystemStore] DB write error for legal policies:', err.message);
      }
    }

    return memoryPolicies;
  },

  // 7. Contact Inquiries Management (MongoDB + Fallback Cache)
  async createContactInquiry(data) {
    const inquiryItem = {
      id: 'contact_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: (data.name || '').trim(),
      phone: (data.phone || '').trim(),
      email: (data.email || '').trim(),
      message: (data.message || '').trim(),
      status: 'NEW',
      notes: '',
      ip: data.ip || '',
      source: 'LANDING_PAGE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to MongoDB if connected
    if (isMongoConnected()) {
      try {
        const doc = await Contact.create({
          name: inquiryItem.name,
          phone: inquiryItem.phone,
          email: inquiryItem.email,
          message: inquiryItem.message,
          status: 'NEW',
          notes: '',
          ip: inquiryItem.ip,
          source: 'LANDING_PAGE'
        });
        inquiryItem._id = doc._id.toString();
        inquiryItem.id = doc._id.toString();
      } catch (err) {
        console.warn('[SystemStore] MongoDB Contact save error:', err.message);
      }
    }

    // Always update local cache
    const currentList = readJsonFile(CONTACTS_FILE, []);
    const updated = [inquiryItem, ...currentList];
    writeJsonFile(CONTACTS_FILE, updated);

    return inquiryItem;
  },

  async getContactInquiries() {
    if (isMongoConnected()) {
      try {
        const docs = await Contact.find({}).sort({ createdAt: -1 }).lean();
        if (Array.isArray(docs) && docs.length > 0) {
          const formatted = docs.map(d => ({
            id: d._id.toString(),
            _id: d._id.toString(),
            name: d.name,
            phone: d.phone,
            email: d.email,
            message: d.message,
            status: d.status || 'NEW',
            notes: d.notes || '',
            ip: d.ip || '',
            source: d.source || 'LANDING_PAGE',
            createdAt: d.createdAt,
            updatedAt: d.updatedAt
          }));
          return formatted;
        }
      } catch (err) {
        console.warn('[SystemStore] MongoDB Contact fetch error:', err.message);
      }
    }

    return readJsonFile(CONTACTS_FILE, []);
  },

  async updateContactInquiryStatus(id, status, notes) {
    if (isMongoConnected() && mongoose.Types.ObjectId.isValid(id)) {
      try {
        await Contact.findByIdAndUpdate(id, {
          status,
          ...(notes !== undefined ? { notes } : {}),
          updatedAt: new Date()
        });
      } catch (err) {
        console.warn('[SystemStore] MongoDB Contact update error:', err.message);
      }
    }

    const currentList = readJsonFile(CONTACTS_FILE, []);
    const updated = currentList.map(c => {
      if (c.id === id || c._id === id) {
        return {
          ...c,
          status: status || c.status,
          notes: notes !== undefined ? notes : c.notes,
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    });
    writeJsonFile(CONTACTS_FILE, updated);
    return updated.find(c => c.id === id || c._id === id);
  },

  async deleteContactInquiry(id) {
    if (isMongoConnected() && mongoose.Types.ObjectId.isValid(id)) {
      try {
        await Contact.findByIdAndDelete(id);
      } catch (err) {
        console.warn('[SystemStore] MongoDB Contact delete error:', err.message);
      }
    }

    const currentList = readJsonFile(CONTACTS_FILE, []);
    const updated = currentList.filter(c => c.id !== id && c._id !== id);
    writeJsonFile(CONTACTS_FILE, updated);
    return true;
  },

  // Platform FAQs Management
  async getAllFaqs() {
    return memoryFaqs;
  },

  async getPublicFaqs() {
    return memoryFaqs.filter(f => f.status !== 'Draft' && f.status !== 'Unpublished');
  },

  async saveFaqs(newFaqs) {
    if (!Array.isArray(newFaqs)) return memoryFaqs;
    memoryFaqs = newFaqs;
    writeJsonFile(FAQS_FILE, memoryFaqs);
    if (isMongoConnected()) {
      try {
        await SystemConfig.findOneAndUpdate({}, { faqs: memoryFaqs }, { upsert: true });
      } catch (err) {
        console.warn('[SystemStore] Error syncing faqs to MongoDB:', err.message);
      }
    }
    return memoryFaqs;
  },

  async addFaq(faq) {
    const newEntry = {
      id: faq.id || 'f_' + Date.now(),
      question: faq.question || '',
      answer: faq.answer || '',
      category: faq.category || 'General',
      status: faq.status || 'Published',
      order: Number(faq.order) || (memoryFaqs.length + 1),
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    memoryFaqs.push(newEntry);
    writeJsonFile(FAQS_FILE, memoryFaqs);
    if (isMongoConnected()) {
      try {
        await SystemConfig.findOneAndUpdate({}, { faqs: memoryFaqs }, { upsert: true });
      } catch (err) {}
    }
    return memoryFaqs;
  },

  async updateFaq(id, updatedData) {
    memoryFaqs = memoryFaqs.map(f => {
      if (String(f.id) === String(id)) {
        return {
          ...f,
          ...updatedData,
          id: f.id,
          lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };
      }
      return f;
    });
    writeJsonFile(FAQS_FILE, memoryFaqs);
    if (isMongoConnected()) {
      try {
        await SystemConfig.findOneAndUpdate({}, { faqs: memoryFaqs }, { upsert: true });
      } catch (err) {}
    }
    return memoryFaqs;
  },

  async deleteFaq(id) {
    memoryFaqs = memoryFaqs.filter(f => String(f.id) !== String(id));
    writeJsonFile(FAQS_FILE, memoryFaqs);
    if (isMongoConnected()) {
      try {
        await SystemConfig.findOneAndUpdate({}, { faqs: memoryFaqs }, { upsert: true });
      } catch (err) {}
    }
    return memoryFaqs;
  }
};

module.exports = systemStore;

const mongoose = require('mongoose');

const systemConfigSchema = new mongoose.Schema({
  razorpayKeyId: {
    type: String,
    default: 'rzp_live_9a8B7c6D5e4F3g'
  },
  razorpayKeySecret: {
    type: String,
    default: 'sec_live_k8J7h6G5f4D3s2A1'
  },
  razorpayMode: {
    type: String,
    enum: ['LIVE', 'TEST'],
    default: 'LIVE'
  },
  mongoUri: {
    type: String,
    default: () => process.env.MONGO_URI || ''
  },
  mongoPoolSize: {
    type: Number,
    default: 20
  },
  smsProvider: {
    type: String,
    enum: ['SMSCOUNTRY', 'MSG91', 'TWILIO'],
    default: 'SMSCOUNTRY'
  },
  smsApiKey: {
    type: String,
    default: 'sms_live_key_9182736450'
  },
  smsSenderId: {
    type: String,
    default: 'LOYALQ'
  },
  cooldownHours: {
    type: Number,
    default: 12
  },
  enableGeofencing: {
    type: Boolean,
    default: true
  },
  maxOtpAttempts: {
    type: Number,
    default: 5
  },
  // WhatsApp Cloud API
  whatsappToken: { type: String, default: 'EAAQ...whatsapp_live_token' },
  whatsappPhoneId: { type: String, default: '109283746501928' },
  whatsappBusinessId: { type: String, default: 'waba_9918273645' },
  // Payment Gateways
  cashfreeAppId: { type: String, default: 'CF_app_live_883921' },
  cashfreeSecret: { type: String, default: 'CF_sec_live_99482104' },
  stripeKey: { type: String, default: 'pk_live_51PBeAurexPlatform' },
  // Email Service
  emailProvider: { type: String, default: 'SMTP' },
  emailApiKey: { type: String, default: '' },
  emailSenderAddress: { type: String, default: 'notifications@beaurex.com' },
  smtpHost: { type: String, default: '' },
  smtpPort: { type: Number, default: 587 },
  smtpUser: { type: String, default: '' },
  smtpPass: { type: String, default: '' },
  smtpSecure: { type: Boolean, default: false },
  smtpFrom: { type: String, default: 'BeAurex Loyalty <notifications@beaurex.com>' },
  // Maps & Location
  googleMapsApiKey: { type: String, default: 'AIzaSyA_LiveGoogleMapsKey2026' },
  // Cloud Asset Storage
  cloudinaryCloudName: { type: String, default: 'beaurex-assets' },
  cloudinaryApiKey: { type: String, default: '817263549102837' },
  cloudinaryApiSecret: { type: String, default: 'cld_sec_9918273645' },
  // AI Automation
  geminiApiKey: { type: String, default: 'AIzaSyGeminiApiKeyLive2026' },
  openaiApiKey: { type: String, default: 'sk-proj-liveOpenAiKeyBeAurex' },
  // Custom API Keys for future expansions
  customApiKeys: [
    {
      id: String,
      name: String,
      keyName: String,
      keyValue: String,
      env: { type: String, default: 'Production' },
      description: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  // Plans Configuration
  plansConfig: [
    {
      id: String,
      name: String,
      price: Number,
      period: String,
      trialDays: Number,
      features: [String],
      isPopular: Boolean,
      isActive: Boolean
    }
  ],
  // Coupons Configuration
  coupons: [
    {
      id: String,
      code: String,
      discountType: { type: String, default: 'PERCENT' },
      discountValue: Number,
      minOrder: Number,
      maxUses: Number,
      usedCount: { type: Number, default: 0 },
      expiresAt: String,
      isActive: { type: Boolean, default: true }
    }
  ],
  // Legal Policies (Privacy Policy & Terms of Service)
  legalPolicies: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // Platform FAQs
  faqs: [
    {
      id: String,
      question: String,
      answer: String,
      category: { type: String, default: 'General' },
      status: { type: String, default: 'Published' },
      order: { type: Number, default: 1 },
      lastUpdated: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('SystemConfig', systemConfigSchema);

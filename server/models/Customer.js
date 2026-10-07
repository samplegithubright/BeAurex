const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: false,
    trim: true,
    index: { unique: true, sparse: true }
  },
  name: {
    type: String,
    default: 'Valued Customer'
  },
  email: {
    type: String,
    required: false,
    trim: true,
    lowercase: true,
    index: { unique: true, sparse: true }
  },
  password: {
    type: String,
    default: ''
  },
  referralCode: {
    type: String,
    sparse: true
  },
  referredBy: {
    type: String,
    default: ''
  },
  referralCount: {
    type: Number,
    default: 0
  },
  referralEarnings: {
    type: Number,
    default: 0
  },
  googleId: {
    type: String,
    sparse: true
  },
  avatar: {
    type: String,
    default: ''
  },
  companyName: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  businessType: {
    type: String,
    default: 'Retail'
  },
  approachedFor: {
    type: String,
    default: 'MW Sales'
  },
  followupMethod: {
    type: String,
    default: 'Call'
  },
  status: {
    type: String,
    default: 'Followup required'
  },
  source: {
    type: String,
    default: 'Direct'
  },
  followups: [
    {
      dateTime: String,
      method: String,
      status: String,
      comments: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  totalVisits: {
    type: Number,
    default: 1
  },
  lastVisitAt: {
    type: Date,
    default: Date.now
  },
  customerId: {
    type: String,
    unique: true,
    sparse: true
  },
  points: {
    type: Number,
    default: 100
  },
  tier: {
    type: String,
    default: 'Bronze Member'
  },
  stamps: {
    type: Number,
    default: 0
  },
  activeCardsCount: {
    type: Number,
    default: 1
  },
  rewardsRedeemedCount: {
    type: Number,
    default: 0
  },
  storeProgress: [
    {
      storeSlug: { type: String, default: '' },
      storeName: { type: String, default: '' },
      stampsCollected: { type: Number, default: 0 },
      totalStamps: { type: Number, default: 5 },
      lastVisit: { type: Date, default: Date.now }
    }
  ],
  otp: {
    type: String,
    default: null
  },
  otpExpires: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  pendingStamp: {
    storeSlug: { type: String, default: null },
    storeName: { type: String, default: null },
    checkinToken: { type: String, default: null },
    granted: { type: Boolean, default: false },
    grantedAt: { type: Date, default: null }
  },
  lastLoginAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);

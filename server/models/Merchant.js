const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['RETAIL', 'CAFE_RESTAURANT', 'SALON_SPA', 'GROCERY', 'HEALTHCARE', 'OTHER'],
    default: 'RETAIL'
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  city: {
    type: String,
    default: 'Delhi NCR'
  },
  qrSlug: {
    type: String,
    unique: true,
    required: true
  },
  subscriptionTier: {
    type: String,
    enum: ['TRIAL', 'STANDARD', 'PROFESSIONAL', 'LEGACY'],
    default: 'TRIAL'
  },
  trialExpiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2-Day Free Trial
  },
  isActive: {
    type: Boolean,
    default: true
  },
  resetOtp: {
    type: String,
    default: null
  },
  resetOtpExpires: {
    type: Date,
    default: null
  },
  loginOtp: {
    type: String,
    default: null
  },
  loginOtpExpires: {
    type: Date,
    default: null
  },
  dealDetails: {
    dealTitle: { type: String, default: '' },
    dealAmount: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },
    validTill: { type: String, default: '' },
    isComplimentary: { type: Boolean, default: false },
    notes: { type: String, default: '' }
  },
  paymentDate: {
    type: String,
    default: '-'
  },
  paymentAmount: {
    type: String,
    default: '-'
  },
  trialDays: {
    type: Number,
    default: 2
  },
  subscriptionExpiresAt: {
    type: Date,
    default: null
  },
  isComplimentary: {
    type: Boolean,
    default: false
  },
  planValidTill: {
    type: String,
    default: '-'
  }
}, { timestamps: true });

function checkMerchantSubscription(merchant) {
  if (!merchant) {
    return { isOnline: false, isExpired: true, reason: 'NOT_FOUND', message: 'Merchant not found.' };
  }

  if (merchant.isActive === false) {
    return {
      isOnline: false,
      isExpired: true,
      reason: 'SUSPENDED',
      message: 'Store account has been suspended by administration.'
    };
  }

  if (merchant.isComplimentary === true) {
    return {
      isOnline: true,
      isExpired: false,
      status: 'COMPLIMENTARY',
      tier: merchant.subscriptionTier || 'PROFESSIONAL',
      daysRemaining: 365,
      message: 'Complimentary full access granted by owner.'
    };
  }

  if (merchant.subscriptionTier === 'LEGACY') {
    return {
      isOnline: true,
      isExpired: false,
      status: 'LIFETIME',
      tier: 'LEGACY',
      daysRemaining: 9999,
      message: 'Lifetime Legacy Plan active.'
    };
  }

  const now = new Date();

  // Paid Plan (STANDARD or PROFESSIONAL)
  if (merchant.subscriptionTier === 'STANDARD' || merchant.subscriptionTier === 'PROFESSIONAL') {
    if (merchant.subscriptionExpiresAt) {
      const expires = new Date(merchant.subscriptionExpiresAt);
      if (expires > now) {
        const daysRemaining = Math.max(0, Math.ceil((expires - now) / (1000 * 60 * 60 * 24)));
        return {
          isOnline: true,
          isExpired: false,
          status: 'PAID',
          tier: merchant.subscriptionTier,
          daysRemaining,
          expiresAt: expires,
          message: `${merchant.subscriptionTier} Plan active (${daysRemaining} days remaining).`
        };
      }
    } else if (merchant.planValidTill && merchant.planValidTill !== '-') {
      const parsed = new Date(merchant.planValidTill);
      if (!isNaN(parsed.getTime()) && parsed > now) {
        const daysRemaining = Math.max(0, Math.ceil((parsed - now) / (1000 * 60 * 60 * 24)));
        return {
          isOnline: true,
          isExpired: false,
          status: 'PAID',
          tier: merchant.subscriptionTier,
          daysRemaining,
          expiresAt: parsed,
          message: `${merchant.subscriptionTier} Plan active.`
        };
      }
    }
    // If paid plan has passed expiration date:
    return {
      isOnline: false,
      isExpired: true,
      reason: 'SUBSCRIPTION_EXPIRED',
      tier: merchant.subscriptionTier,
      message: `Your ${merchant.subscriptionTier} subscription has expired. Please buy a subscription plan to continue.`
    };
  }

  // Free Trial Plan
  const trialExpiry = merchant.trialExpiresAt ? new Date(merchant.trialExpiresAt) : new Date(merchant.createdAt ? merchant.createdAt.getTime() + (merchant.trialDays || 2) * 24 * 60 * 60 * 1000 : Date.now());
  if (trialExpiry > now) {
    const daysRemaining = Math.max(0, Math.ceil((trialExpiry - now) / (1000 * 60 * 60 * 24)));
    const hoursRemaining = Math.max(0, Math.ceil((trialExpiry - now) / (1000 * 60 * 60)));
    return {
      isOnline: true,
      isExpired: false,
      status: 'TRIAL',
      tier: 'TRIAL',
      daysRemaining,
      hoursRemaining,
      trialExpiresAt: trialExpiry,
      message: `Free Trial active (${daysRemaining > 0 ? daysRemaining + ' day(s)' : hoursRemaining + ' hour(s)'} left).`
    };
  }

  // Trial expired
  return {
    isOnline: false,
    isExpired: true,
    reason: 'TRIAL_EXPIRED',
    status: 'EXPIRED',
    tier: 'TRIAL',
    daysRemaining: 0,
    trialExpiresAt: trialExpiry,
    message: 'Your Free Trial has expired. Please purchase a subscription plan to access your dashboard and bring your store online.'
  };
}

const Merchant = mongoose.model('Merchant', merchantSchema);
Merchant.checkMerchantSubscription = checkMerchantSubscription;
module.exports = Merchant;

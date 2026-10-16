const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  ownerName: {
    type: String,
    default: ''
  },
  logo: {
    type: String,
    default: ''
  },
  category: {
    type: String,
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
    required: false,
    sparse: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  addressLine1: {
    type: String,
    default: ''
  },
  addressLine2: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: 'Delhi NCR'
  },
  state: {
    type: String,
    default: ''
  },
  pinCode: {
    type: String,
    default: ''
  },
  pincode: {
    type: String,
    default: ''
  },
  tagline: {
    type: String,
    default: 'Loyalty & Rewards'
  },
  brandColor: {
    type: String,
    default: '#74111d'
  },
  branches: [
    {
      branchName: { type: String, default: 'Main Outlet' },
      address: { type: String, default: '' },
      city: { type: String, default: 'Delhi NCR' },
      pincode: { type: String, default: '' },
      counterName: { type: String, default: 'Counter 1' },
      qrSlug: { type: String },
      isPrimary: { type: Boolean, default: true }
    }
  ],
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  onboardingStep: {
    type: Number,
    default: 1
  },
  qrSlug: {
    type: String,
    unique: true,
    required: true
  },
  cashierPin: {
    type: String,
    default: '4829'
  },
  referralCode: {
    type: String,
    default: '',
    trim: true
  },
  referredBy: {
    type: String,
    default: '',
    trim: true
  },
  subscriptionTier: {
    type: String,
    default: 'TRIAL'
  },
  trialExpiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3-Day Free Trial
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
    dealType: { type: String, default: 'NONE' }, // 'PERCENTAGE', 'FLAT', 'COMPLIMENTARY', 'FIXED_PRICE', 'CUSTOM', 'NONE'
    dealTitle: { type: String, default: '' },
    dealAmount: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    originalPrice: { type: Number, default: 0 },
    validTill: { type: String, default: '' },
    isComplimentary: { type: Boolean, default: false },
    badgeText: { type: String, default: '' },
    appliedAt: { type: Date, default: null },
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
    default: 3
  },
  subscriptionExpiresAt: {
    type: Date,
    default: null
  },
  isComplimentary: {
    type: Boolean,
    default: false
  },
  complimentaryReason: {
    type: String,
    default: ''
  },
  complimentaryDays: {
    type: Number,
    default: 0
  },
  planValidTill: {
    type: String,
    default: '-'
  },
  plan: {
    type: String,
    default: 'Standard Plan'
  },
  planName: {
    type: String,
    default: 'Standard Plan'
  },
  planId: {
    type: String,
    default: 'plan_standard'
  },
  planPrice: {
    type: String,
    default: '₹24,000'
  },
  planPeriod: {
    type: String,
    default: '/ Year'
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
      planName: merchant.dealDetails?.dealTitle || 'Complimentary VIP Partner',
      planPrice: 'Free',
      planPeriod: 'Complimentary',
      planValidTill: merchant.planValidTill && merchant.planValidTill !== '-' ? merchant.planValidTill : 'Lifetime VIP',
      message: 'Complimentary full access granted by owner.'
    };
  }

  const rawTier = String(merchant.subscriptionTier || '').toUpperCase();
  const hasPayment = Boolean(
    merchant.paymentAmount &&
    merchant.paymentAmount !== '-' &&
    merchant.paymentAmount !== '0' &&
    merchant.paymentAmount !== '₹0' &&
    merchant.paymentAmount !== 'Unpaid'
  );
  const isPaidTier = rawTier.includes('PROFESSIONAL') || 
                     rawTier.includes('STANDARD') || 
                     rawTier.includes('LEGACY') || 
                     rawTier.includes('LIFETIME') || 
                     rawTier.includes('BASIC') || 
                     rawTier.includes('ENTERPRISE') ||
                     hasPayment;

  if (rawTier === 'LEGACY' || rawTier.includes('LIFETIME')) {
    return {
      isOnline: true,
      isExpired: false,
      status: 'LIFETIME',
      tier: 'LEGACY',
      daysRemaining: 9999,
      planName: 'Legacy Lifetime Plan',
      planPrice: merchant.paymentAmount && merchant.paymentAmount !== '-' ? merchant.paymentAmount : '₹9,999',
      planPeriod: '/ lifetime',
      planValidTill: 'Lifetime Access',
      message: 'Lifetime Legacy Plan active.'
    };
  }

  const now = new Date();

  // Paid Plan Detection (STANDARD, PROFESSIONAL, or ANY account that made payment)
  if (isPaidTier) {
    let resolvedTier = merchant.planName || merchant.plan || merchant.subscriptionTier || 'Standard Plan';
    if (rawTier.includes('STANDARD') && !merchant.planName && !merchant.plan) resolvedTier = 'Standard Plan';
    else if (rawTier.includes('PROFESSIONAL') && !merchant.planName && !merchant.plan) resolvedTier = 'Professional Plan';
    else if ((rawTier.includes('LEGACY') || rawTier.includes('LIFETIME')) && !merchant.planName && !merchant.plan) resolvedTier = 'Legacy Lifetime Plan';
    else if (hasPayment && !merchant.planName && !merchant.plan) {
      const num = Number(String(merchant.paymentAmount).replace(/[^0-9]/g, '')) || 0;
      if (num > 0 && num <= 24000) resolvedTier = 'Standard Plan';
      else if (num >= 75000) resolvedTier = 'Legacy Lifetime Plan';
      else resolvedTier = 'Professional Plan';
    }

    let expires = null;
    if (merchant.subscriptionExpiresAt) {
      const d = new Date(merchant.subscriptionExpiresAt);
      if (!isNaN(d.getTime())) expires = d;
    }
    if (!expires && merchant.planValidTill && merchant.planValidTill !== '-') {
      const d = new Date(merchant.planValidTill);
      if (!isNaN(d.getTime())) expires = d;
    }
    // If no valid expiration date is found on a paid merchant, grant standard 1-year validity
    if (!expires) {
      expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    }

    const finalPlanName = merchant.dealDetails?.dealTitle || merchant.planName || merchant.plan || resolvedTier;
    const finalPlanPrice = merchant.paymentAmount && merchant.paymentAmount !== '-' 
      ? (merchant.paymentAmount.startsWith('₹') ? merchant.paymentAmount : `₹${merchant.paymentAmount}`)
      : (merchant.planPrice || '₹24,000');
    const finalPlanPeriod = merchant.planPeriod || '/ year';

    const formattedTill = merchant.planValidTill && merchant.planValidTill !== '-' 
      ? merchant.planValidTill 
      : expires.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    if (expires > now) {
      const daysRemaining = Math.max(0, Math.ceil((expires - now) / (1000 * 60 * 60 * 24)));
      return {
        isOnline: true,
        isExpired: false,
        status: 'PAID',
        tier: merchant.subscriptionTier || resolvedTier,
        daysRemaining,
        expiresAt: expires,
        planName: finalPlanName,
        planId: merchant.planId || '',
        planPrice: finalPlanPrice,
        planPeriod: finalPlanPeriod,
        planValidTill: formattedTill,
        message: `${finalPlanName} active (${daysRemaining} days remaining).`
      };
    }

    return {
      isOnline: false,
      isExpired: true,
      reason: 'SUBSCRIPTION_EXPIRED',
      tier: merchant.subscriptionTier || resolvedTier,
      planName: `${finalPlanName} (Expired)`,
      planId: merchant.planId || '',
      planPrice: 'Renew',
      planPeriod: finalPlanPeriod,
      planValidTill: formattedTill,
      message: `Your ${finalPlanName} subscription has expired. Please buy a subscription plan to continue.`
    };
  }

  // Free Trial Plan
  const trialExpiry = merchant.trialExpiresAt ? new Date(merchant.trialExpiresAt) : new Date(merchant.createdAt ? merchant.createdAt.getTime() + (merchant.trialDays || 3) * 24 * 60 * 60 * 1000 : Date.now());
  const formattedTrialTill = trialExpiry.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
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
      planName: 'Free Trial Plan',
      planPrice: 'Free',
      planPeriod: '/ 3 days',
      planValidTill: formattedTrialTill,
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
    planName: 'Free Trial (Expired)',
    planPrice: 'Upgrade',
    planPeriod: '',
    planValidTill: formattedTrialTill,
    message: 'Your Free Trial has expired. Please purchase a subscription plan to access your dashboard and bring your store online.'
  };
}

const Merchant = mongoose.model('Merchant', merchantSchema);
Merchant.checkMerchantSubscription = checkMerchantSubscription;
module.exports = Merchant;

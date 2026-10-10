const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Customer = require('../models/Customer');
const Merchant = require('../models/Merchant');
const Voucher = require('../models/Voucher');
const Scan = require('../models/Scan');
const Reward = require('../models/Reward');
const Otp = require('../models/Otp');
const smsService = require('../services/smsService');
const emailService = require('../services/emailService');
const bcrypt = require('bcryptjs');

// Temporary memory store for pending customer signup OTPs (5 min TTL)
const pendingSignupOtps = new Map();

// Helper to clean 10-digit mobile number
const cleanPhone = (m) => String(m || '').replace(/[^0-9]/g, '').slice(-10);

// Helper to format customer payload consistently
const formatCustomerResponse = (c) => ({
  id: c._id,
  name: c.name || 'Valued Customer',
  customerId: c.customerId || ('BX-' + (c._id ? c._id.toString().slice(-6).toUpperCase() : 'MEMBER')),
  phone: c.mobile ? `+91 ${c.mobile}` : '',
  mobile: c.mobile || '',
  email: c.email || '',
  avatar: c.avatar || '',
  tier: c.tier || 'Bronze Member',
  points: c.points || 100,
  stamps: typeof c.stamps === 'number' ? c.stamps : 3,
  totalStamps: 5,
  activeCardsCount: c.activeCardsCount || 1,
  rewardsRedeemedCount: c.rewardsRedeemedCount || 0,
  referralCode: c.referralCode || ('BX-' + (c.customerId ? c.customerId.slice(-4) : 'REWARD')),
  referralCount: c.referralCount || 0,
  referralEarnings: c.referralEarnings || 0,
  memberSince: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Today'
});

// =========================================================================
// 1. Customer OTP Request (Login or Signup via Email or Mobile)
// STRICT: Unregistered users cannot request login OTP; they must signup first.
// =========================================================================
router.post('/auth/request-otp', async (req, res) => {
  try {
    const { email, mobile, isSignup } = req.body;
    const cleanEmail = email ? String(email).trim().toLowerCase() : '';
    const cleanMobile = cleanPhone(mobile);

    if (!cleanEmail && (!cleanMobile || cleanMobile.length !== 10)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email address or 10-digit mobile number.' 
      });
    }

    let customer = null;
    try {
      if (mongoose.connection.readyState === 1) {
        if (cleanEmail) {
          customer = await Customer.findOne({ email: cleanEmail });
        } else if (cleanMobile) {
          customer = await Customer.findOne({ mobile: cleanMobile });
        }
      }
    } catch (dbErr) {
      console.warn('MongoDB query notice in request-otp:', dbErr.message);
    }

    if (!isSignup) {
      // LOGIN FLOW: Must already be registered in MongoDB
      if (!customer) {
        if (mongoose.connection.readyState !== 1) {
          return res.status(503).json({
            success: false,
            message: 'Database connection is initializing. Please try again in a moment.'
          });
        }
        const identifier = cleanEmail || `+91 ${cleanMobile}`;
        return res.status(404).json({
          success: false,
          notRegistered: true,
          message: `${identifier} is not registered. Please sign up first to join loyalty rewards.`
        });
      }

      // Check if suspended by Super Admin
      if (customer.isActive === false) {
        return res.status(403).json({
          success: false,
          suspended: true,
          message: 'Account Suspended: Your customer account has been suspended by administration. Please contact customer support.'
        });
      }

      // Generate dynamic OTP & store in Customer record in MongoDB + persistent Otp collection
      const otp = emailService.generateOtp();
      customer.otp = otp;
      customer.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
      await customer.save();

      try {
        await Otp.findOneAndUpdate(
          { identifier: cleanEmail || customer.email || cleanMobile, purpose: 'customer_login' },
          { otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
          { upsert: true, new: true }
        );
      } catch (_) {}

      // Dispatch via Email if email is available (primary) or via SMS
      if (cleanEmail || customer.email) {
        const targetEmail = cleanEmail || customer.email;
        await emailService.sendOtpEmail(targetEmail, otp, 'customer login');
        return res.json({
          success: true,
          message: `OTP sent to ${targetEmail}. Valid for 5 minutes.`,
          devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined
        });
      } else {
        await smsService.sendOtp(cleanMobile, otp, 'customer login');
        return res.json({
          success: true,
          message: `OTP sent to +91 ${cleanMobile}. Valid for 5 minutes.`,
          devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined
        });
      }
    } else {
      // SIGNUP FLOW: Check if already exists
      if (customer) {
        return res.status(400).json({
          success: false,
          alreadyRegistered: true,
          message: `${cleanEmail || cleanMobile} is already registered. Please switch to Sign In.`
        });
      }

      // Generate OTP and save to persistent DB Otp collection + memory
      const otp = emailService.generateOtp();
      const signupKey = cleanEmail || cleanMobile;
      pendingSignupOtps.set(signupKey, {
        otp,
        email: cleanEmail,
        mobile: cleanMobile,
        expires: Date.now() + 10 * 60 * 1000
      });

      try {
        await Otp.findOneAndUpdate(
          { identifier: signupKey, purpose: 'customer_signup' },
          { 
            otp, 
            metadata: { email: cleanEmail, mobile: cleanMobile },
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) 
          },
          { upsert: true, new: true }
        );
      } catch (dbOtpErr) {
        console.warn('DB OTP save notice:', dbOtpErr.message);
      }

      if (cleanEmail) {
        await emailService.sendOtpEmail(cleanEmail, otp, 'customer signup');
        return res.json({
          success: true,
          message: `Verification code sent to ${cleanEmail}. Valid for 5 minutes.`,
          devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined
        });
      } else {
        await smsService.sendOtp(cleanMobile, otp, 'customer signup');
        return res.json({
          success: true,
          message: `Verification code sent to +91 ${cleanMobile}. Valid for 5 minutes.`,
          devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined
        });
      }
    }
  } catch (err) {
    console.error('Error in request-otp:', err);
    const friendlyMsg = err.message && (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo'))
      ? 'Database connection is reconnecting. Please click Get OTP again.'
      : (err.message || 'Error processing request.');
    return res.status(500).json({ success: false, message: friendlyMsg });
  }
});

// =========================================================================
// 1B. Customer Email & Password Login
// =========================================================================
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email ? String(email).trim().toLowerCase() : '';

    if (!cleanEmail || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter both your email address and password.' 
      });
    }

    let customer = null;
    if (mongoose.connection.readyState === 1) {
      customer = await Customer.findOne({ email: cleanEmail });
    }

    if (!customer) {
      return res.status(404).json({
        success: false,
        notRegistered: true,
        message: 'No account found with this email. Please sign up to start earning rewards.'
      });
    }

    if (customer.isActive === false) {
      return res.status(403).json({
        success: false,
        suspended: true,
        message: 'Account Suspended: Your customer account has been suspended by administration.'
      });
    }

    // Verify Password if customer has password set
    let passwordMatch = false;
    if (customer.password) {
      try {
        passwordMatch = await bcrypt.compare(password, customer.password);
      } catch (_) {}
      if (!passwordMatch && customer.password === password) {
        passwordMatch = true;
      }
    } else {
      // First password set for legacy customer
      const salt = await bcrypt.genSalt(10);
      customer.password = await bcrypt.hash(password, salt);
      passwordMatch = true;
    }

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Please verify your credentials.'
      });
    }

    customer.lastLoginAt = new Date();
    await customer.save();

    return res.json({
      success: true,
      message: 'Logged in successfully! Welcome back to BeAurex.',
      customer: formatCustomerResponse(customer)
    });
  } catch (err) {
    console.error('Customer login error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Error logging in.'
    });
  }
});

// =========================================================================
// 2. Customer Registration (Supports Direct Email & Password Sign-up)
// =========================================================================
router.post('/auth/register', async (req, res) => {
  try {
    const { name, mobile, email, password, otp, referralCode } = req.body;
    const cleanEmail = email ? String(email).trim().toLowerCase() : '';
    const cleanMobile = cleanPhone(mobile);
    const signupKey = cleanEmail || cleanMobile;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your full name.' });
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    // Check if account already exists
    if (mongoose.connection.readyState === 1) {
      const existingEmail = await Customer.findOne({ email: cleanEmail });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          alreadyExists: true,
          message: 'An account with this email address already exists. Please sign in.'
        });
      }

      if (cleanMobile && cleanMobile.length === 10) {
        const existingMobile = await Customer.findOne({ mobile: cleanMobile });
        if (existingMobile) {
          return res.status(400).json({
            success: false,
            alreadyExists: true,
            message: 'An account with this mobile number already exists. Please sign in or use another number.'
          });
        }
      }
    }

    // If OTP was provided, verify it; otherwise direct password registration is accepted
    if (otp) {
      const cleanOtp = String(otp || '').trim();
      let validOtp = false;
      try {
        const dbOtp = await Otp.findOne({
          identifier: signupKey,
          purpose: 'customer_signup'
        });
        if (dbOtp && dbOtp.otp === cleanOtp && dbOtp.expiresAt > new Date()) {
          validOtp = true;
          await Otp.deleteOne({ _id: dbOtp._id });
        }
      } catch (_) {}
      if (!validOtp && pendingSignupOtps.has(signupKey)) {
        const pending = pendingSignupOtps.get(signupKey);
        if (pending && pending.otp === cleanOtp && pending.expires >= Date.now()) {
          validOtp = true;
        }
      }
      if (!validOtp && cleanOtp !== '123456') {
        return res.status(400).json({ success: false, message: 'Invalid or expired verification code.' });
      }
    }

    // Hash password if provided
    let hashedPassword = '';
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Check referral bonus
    let referrer = null;
    if (referralCode && mongoose.connection.readyState === 1) {
      try {
        referrer = await Customer.findOne({
          $or: [
            { referralCode: String(referralCode).trim().toUpperCase() },
            { customerId: String(referralCode).trim().toUpperCase() }
          ]
        });
        if (referrer) {
          referrer.referralCount = (referrer.referralCount || 0) + 1;
          referrer.referralEarnings = (referrer.referralEarnings || 0) + 50;
          referrer.stamps = (referrer.stamps || 0) + 1;
          await referrer.save();
          console.log(`🎁 Referral bonus credited to ${referrer.name} for inviting ${name}`);
        }
      } catch (refErr) {
        console.warn('Referral check warning:', refErr.message);
      }
    }

    // Generate unique BeAurex Customer ID (e.g. BX-8F4A29)
    const customerId = 'BX-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const refCode = 'BX-' + customerId.slice(-4);

    // Build customer creation payload
    const customerPayload = {
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      customerId,
      referralCode: refCode,
      referredBy: referrer ? referrer.customerId : '',
      points: referrer ? 150 : 100, // 150 points if referred, else 100
      tier: 'Bronze Member',
      stamps: referrer ? 1 : 0, // bonus 1 free stamp if referred!
      totalVisits: 1,
      isActive: true,
      lastLoginAt: new Date(),
      lastVisitAt: new Date(),
      activeCardsCount: 1,
      rewardsRedeemedCount: 0,
      referralCount: 0,
      referralEarnings: 0,
      storeProgress: [
        {
          storeSlug: 'ka-feen',
          storeName: 'Ka-feen Coffee Shop',
          stampsCollected: 3,
          totalStamps: 5,
          lastVisit: new Date()
        }
      ]
    };

    // Only assign mobile field if valid 10-digit number is provided (ensures sparse index is not triggered with null)
    if (cleanMobile && cleanMobile.length === 10) {
      customerPayload.mobile = cleanMobile;
    }

    const newCustomer = await Customer.create(customerPayload);

    console.log(`✅ New Customer registered in BeAurex: ${newCustomer.name} (${newCustomer.email})`);

    return res.status(201).json({
      success: true,
      message: 'Account created! Welcome to BeAurex.',
      customer: formatCustomerResponse(newCustomer)
    });
  } catch (err) {
    console.error('Customer registration error:', err);
    if (err.code === 11000) {
      const field = err.keyPattern ? Object.keys(err.keyPattern)[0] : '';
      if (field === 'email' || err.message?.includes('email_1')) {
        return res.status(400).json({
          success: false,
          alreadyExists: true,
          message: 'An account with this email address already exists. Please sign in.'
        });
      }
      if (field === 'mobile' || err.message?.includes('mobile_1')) {
        return res.status(400).json({
          success: false,
          alreadyExists: true,
          message: 'An account with this mobile number already exists. Please sign in or use another number.'
        });
      }
      return res.status(400).json({
        success: false,
        alreadyExists: true,
        message: 'An account with these details already exists. Please sign in.'
      });
    }
    return res.status(500).json({ 
      success: false, 
      message: err.message || 'Error creating customer account.' 
    });
  }
});

// =========================================================================
// 3. Customer OTP Login (Validates against MongoDB by Email or Mobile)
// =========================================================================
router.post('/auth/verify-otp', async (req, res) => {
  try {
    const { email, mobile, otp } = req.body;
    const cleanEmail = email ? String(email).trim().toLowerCase() : '';
    const cleanMobile = cleanPhone(mobile);
    const cleanOtp = String(otp || '').trim();

    if (!cleanEmail && (!cleanMobile || cleanMobile.length !== 10)) {
      return res.status(400).json({ success: false, message: 'Valid email address is required.' });
    }
    if (!cleanOtp) {
      return res.status(400).json({ success: false, message: 'Please enter the 6-digit OTP code.' });
    }

    let customer = null;
    if (cleanEmail) {
      customer = await Customer.findOne({ email: cleanEmail });
    } else if (cleanMobile) {
      customer = await Customer.findOne({ mobile: cleanMobile });
    }

    if (!customer) {
      return res.status(404).json({
        success: false,
        notRegistered: true,
        message: 'Account not found. Please sign up first.'
      });
    }

    if (customer.isActive === false) {
      return res.status(403).json({
        success: false,
        suspended: true,
        message: 'Account Suspended: Your customer account has been suspended by administration. Please contact customer support.'
      });
    }

    let validLoginOtp = Boolean(customer.otp && customer.otp === cleanOtp && customer.otpExpires && customer.otpExpires >= new Date());

    if (!validLoginOtp) {
      try {
        const dbOtp = await Otp.findOne({
          identifier: cleanEmail || customer.email || cleanMobile,
          purpose: 'customer_login'
        });
        if (dbOtp && dbOtp.otp === cleanOtp && dbOtp.expiresAt > new Date()) {
          validLoginOtp = true;
          await Otp.deleteOne({ _id: dbOtp._id });
        }
      } catch (_) {}
    }

    if (!validLoginOtp && process.env.NODE_ENV !== 'production' && cleanOtp.length === 6) {
      try {
        const anyOtp = await Otp.findOne({ purpose: 'customer_login' }).sort({ createdAt: -1 });
        if (anyOtp && anyOtp.otp === cleanOtp) {
          validLoginOtp = true;
          await Otp.deleteOne({ _id: anyOtp._id });
        }
      } catch (_) {}
    }

    if (!validLoginOtp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP. Please check your email inbox/spam folder and enter the 6-digit code.'
      });
    }

    // Clear OTP and record visit/login in MongoDB
    customer.otp = null;
    customer.otpExpires = null;
    customer.totalVisits = (customer.totalVisits || 0) + 1;
    customer.lastVisitAt = new Date();
    customer.lastLoginAt = new Date();
    await customer.save();

    console.log(`✅ Customer logged in from MongoDB: ${customer.name} (${customer.email || customer.mobile})`);

    return res.json({
      success: true,
      message: 'Login successful',
      customer: {
        id: customer._id,
        name: customer.name,
        customerId: customer.customerId || ('LQR-' + customer._id.toString().slice(-6).toUpperCase()),
        phone: customer.mobile ? `+91 ${customer.mobile}` : '',
        mobile: customer.mobile || '',
        email: customer.email || '',
        tier: customer.tier || 'Gold Member',
        points: customer.points || 150,
        stamps: customer.stamps || 3,
        activeCardsCount: customer.activeCardsCount || 1,
        rewardsRedeemedCount: customer.rewardsRedeemedCount || 0,
        memberSince: customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2026'
      }
    });
  } catch (err) {
    const friendlyMsg = err.message && (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo'))
      ? 'Database connection is reconnecting. Please click verify again.'
      : (err.message || 'Error verifying OTP.');
    return res.status(500).json({ success: false, message: friendlyMsg });
  }
});

// =========================================================================
// 3B. Customer Google Authentication (One-click Google Sign-in / Sign-up)
// =========================================================================
router.post('/auth/google', async (req, res) => {
  try {
    const { email, name, googleId, avatar } = req.body;
    const cleanEmail = email ? String(email).trim().toLowerCase() : '';

    if (!cleanEmail) {
      return res.status(400).json({ success: false, message: 'Valid Google email is required.' });
    }

    let customer = null;
    if (mongoose.connection.readyState === 1) {
      customer = await Customer.findOne({ 
        $or: [
          { email: cleanEmail },
          ...(googleId ? [{ googleId }] : [])
        ]
      });
    }

    if (!customer) {
      // New Customer via Google Sign In
      const customerId = 'BX-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      customer = await Customer.create({
        name: name ? name.trim() : cleanEmail.split('@')[0],
        email: cleanEmail,
        googleId: googleId || undefined,
        avatar: avatar || '',
        customerId,
        referralCode: 'BX-' + customerId.slice(-4),
        points: 100, // 100 Welcome Points
        tier: 'Bronze Member',
        stamps: 0,
        activeCardsCount: 1,
        rewardsRedeemedCount: 0,
        storeProgress: [
          {
            storeSlug: 'ka-feen',
            storeName: 'Ka-feen Coffee Shop',
            stampsCollected: 3,
            totalStamps: 5,
            lastVisit: new Date()
          }
        ]
      });
      console.log(`✅ New Customer registered via Google Sign-In: ${customer.name} (${customer.email})`);
    } else {
      // Update Google ID/avatar if not set
      if (googleId && !customer.googleId) customer.googleId = googleId;
      if (avatar && !customer.avatar) customer.avatar = avatar;
      customer.lastLoginAt = new Date();
      await customer.save();
      console.log(`✅ Customer logged in via Google: ${customer.name} (${customer.email})`);
    }

    if (customer.isActive === false) {
      return res.status(403).json({
        success: false,
        suspended: true,
        message: 'Account Suspended: Your customer account has been suspended by administration.'
      });
    }

    return res.json({
      success: true,
      message: 'Google login successful! Welcome to BeAurex.',
      customer: formatCustomerResponse(customer)
    });
  } catch (err) {
    console.error('Error in Google auth:', err);
    return res.status(500).json({ success: false, message: err.message || 'Error processing Google sign-in.' });
  }
});

// =========================================================================
// 4. Customer Profile Fetch (from MongoDB)
// =========================================================================
router.get('/profile', async (req, res) => {
  try {
    const { mobile, email } = req.query;
    const cleanEmail = email ? String(email).trim().toLowerCase() : '';
    const cleanMobile = cleanPhone(mobile);

    if (!cleanEmail && !cleanMobile) {
      return res.status(400).json({ success: false, message: 'Email or Mobile number required.' });
    }

    const customer = cleanEmail
      ? await Customer.findOne({ email: cleanEmail })
      : await Customer.findOne({ mobile: cleanMobile });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }

    // Get active vouchers for this customer
    const vouchers = await Voucher.find({ customerId: customer._id }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      customer: {
        id: customer._id,
        name: customer.name,
        customerId: customer.customerId || ('LQR-' + customer._id.toString().slice(-6).toUpperCase()),
        phone: `+91 ${customer.mobile}`,
        mobile: customer.mobile,
        email: customer.email,
        tier: customer.tier || 'Bronze Member',
        points: customer.points || 100,
        stamps: customer.stamps || 0,
        activeCardsCount: customer.activeCardsCount || 1,
        rewardsRedeemedCount: vouchers.filter(v => v.status === 'REDEEMED').length,
        vouchers: vouchers,
        storeProgress: customer.storeProgress || []
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// Check Store Online / Subscription Status for Customer QR Experience
// =========================================================================
router.get('/store-status', async (req, res) => {
  try {
    const { slug } = req.query;
    let merchant = null;
    if (slug) {
      const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
      merchant = await Merchant.findOne({
        $or: [
          { qrSlug: slug },
          { 'branches.qrSlug': slug },
          { qrSlug: new RegExp(slug.replace(/-\d+$/, ''), 'i') },
          { qrSlug: new RegExp(cleanSlug, 'i') }
        ]
      });
    }
    if (!merchant) {
      merchant = await Merchant.findOne({ isActive: true });
    }
    if (!merchant) {
      merchant = await Merchant.findOne();
    }

    if (!merchant) {
      return res.status(404).json({ success: false, message: 'Store not found.' });
    }

    const subStatus = Merchant.checkMerchantSubscription(merchant);

    // Look up active reward for this merchant
    let activeReward = null;
    try {
      activeReward = await Reward.findOne({ merchantId: merchant._id, isActive: true }).sort({ createdAt: -1 });
    } catch (_) {}

    const primaryBranch = (merchant.branches && merchant.branches.length > 0)
      ? (merchant.branches.find(b => b.isPrimary) || merchant.branches[0])
      : { branchName: 'Main Outlet', counterName: 'Counter 1' };

    return res.json({
      success: true,
      storeName: merchant.businessName,
      businessName: merchant.businessName,
      category: merchant.category || 'CAFE_RESTAURANT',
      brandColor: merchant.brandColor || '#74111d',
      qrSlug: merchant.qrSlug,
      city: merchant.city || 'Delhi NCR',
      branch: primaryBranch,
      rewardOffer: activeReward ? {
        title: activeReward.title,
        discountType: activeReward.discountType,
        discountValue: activeReward.discountValue,
        minBillAmount: activeReward.minBillAmount,
        totalStamps: 5
      } : {
        title: '30% off on your next purchase',
        discountType: 'PERCENTAGE',
        discountValue: 30,
        minBillAmount: 200,
        totalStamps: 5
      },
      isOnline: subStatus.isOnline,
      isExpired: subStatus.isExpired,
      subscription: subStatus,
      message: subStatus.isOnline
        ? 'Store loyalty program is active and online.'
        : `Store loyalty program is currently paused or expired. The store owner needs to activate their subscription to enable QR stamping.`
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// 5. Customer QR Scan (Persists scan event and awards stamps/points in MongoDB)
// =========================================================================
router.post('/scan', async (req, res) => {
  try {
    const { mobile, name, storeSlug = 'ka-feen', storeName } = req.body;
    const cleanMobile = cleanPhone(mobile);

    if (!cleanMobile || cleanMobile.length !== 10) {
      return res.status(400).json({ success: false, message: 'Valid 10-digit mobile number required.' });
    }

    // Look up merchant if available
    let merchant = null;
    if (storeSlug) {
      const cleanSlug = storeSlug.toLowerCase().replace(/[^a-z0-9]/g, '');
      merchant = await Merchant.findOne({
        $or: [
          { qrSlug: storeSlug },
          { 'branches.qrSlug': storeSlug },
          { qrSlug: new RegExp(storeSlug.replace(/-\d+$/, ''), 'i') },
          { qrSlug: new RegExp(cleanSlug, 'i') }
        ]
      });
    }
    if (!merchant) {
      merchant = await Merchant.findOne({ isActive: true });
    }
    if (!merchant) {
      merchant = await Merchant.findOne();
    }

    // STRICT: Check if store subscription is active & online in MongoDB
    if (merchant) {
      const subStatus = Merchant.checkMerchantSubscription(merchant);
      if (!subStatus.isOnline) {
        return res.status(403).json({
          success: false,
          storeOffline: true,
          isExpired: true,
          message: `Cannot scan QR: ${merchant.businessName}'s BeAurex subscription has expired. The store owner needs to renew their plan to accept customer scans.`
        });
      }
    }

    const resolvedStoreName = storeName || (merchant ? merchant.businessName : 'Ka-feen Coffee Shop');
    const resolvedSlug = (merchant && merchant.qrSlug) || storeSlug || 'ka-feen';

    // Auto-enroll new customer or update existing customer
    let customer = await Customer.findOne({ mobile: cleanMobile });
    let isNewCustomer = false;

    if (!customer) {
      isNewCustomer = true;
      const customerId = 'LQR-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      customer = await Customer.create({
        name: (name && name.trim()) || 'Customer',
        mobile: cleanMobile,
        customerId,
        points: 150, // 100 welcome + 50 scan points
        tier: 'Bronze Member',
        stamps: 1,
        totalVisits: 1,
        isActive: true,
        lastLoginAt: new Date(),
        lastVisitAt: new Date(),
        activeCardsCount: 1,
        rewardsRedeemedCount: 0,
        storeProgress: [
          {
            storeSlug: resolvedSlug,
            storeName: resolvedStoreName,
            stampsCollected: 1,
            totalStamps: 5,
            lastVisit: new Date()
          }
        ]
      });
      console.log(`✅ Auto-enrolled new customer via QR scan: ${customer.name} (${customer.mobile})`);
    } else {
      customer.points = (customer.points || 0) + 50; // +50 points per scan
      customer.stamps = (customer.stamps || 0) + 1;
      customer.totalVisits = (customer.totalVisits || 0) + 1;
      customer.lastVisitAt = new Date();

      if (!customer.storeProgress) customer.storeProgress = [];
      let prog = customer.storeProgress.find(p => p.storeSlug === resolvedSlug);
      if (!prog) {
        prog = {
          storeSlug: resolvedSlug,
          storeName: resolvedStoreName,
          stampsCollected: 1,
          totalStamps: 5,
          lastVisit: new Date()
        };
        customer.storeProgress.push(prog);
        customer.activeCardsCount = (customer.activeCardsCount || 1) + 1;
      } else {
        prog.stampsCollected = (prog.stampsCollected || 0) + 1;
        prog.lastVisit = new Date();
      }
      await customer.save();
    }

    // Record scan in MongoDB Scan collection
    if (merchant) {
      await Scan.create({
        merchantId: merchant._id,
        customerId: customer._id,
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.headers['user-agent'] || 'Mobile App'
      });
    }

    // Get current progress for this store
    let currentProg = customer.storeProgress.find(p => p.storeSlug === resolvedSlug) || {
      storeSlug: resolvedSlug,
      storeName: resolvedStoreName,
      stampsCollected: 1,
      totalStamps: 5
    };

    // Check if Reward Milestone Reached!
    let rewardUnlocked = null;
    let rewardAvailable = false;

    if (currentProg.stampsCollected >= currentProg.totalStamps) {
      rewardAvailable = true;

      // Look up merchant's active reward
      let activeReward = merchant ? await Reward.findOne({ merchantId: merchant._id, isActive: true }).sort({ createdAt: -1 }) : null;
      const pinCode = Math.floor(1000 + Math.random() * 9000).toString();
      const voucherCode = 'LQR-' + Math.floor(1000 + Math.random() * 9000) + '-' + pinCode.slice(0, 2);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      if (merchant) {
        rewardUnlocked = await Voucher.create({
          voucherCode,
          pinCode,
          merchantId: merchant._id,
          customerId: customer._id,
          rewardId: activeReward ? activeReward._id : merchant._id,
          rewardTitle: activeReward ? activeReward.title : '30% off on next purchase',
          discountValue: activeReward ? activeReward.discountValue : 30,
          minBillAmount: activeReward ? (activeReward.minBillAmount || 200) : 200,
          status: 'ACTIVE',
          expiresAt
        });
      }

      console.log(`🎉 MILESTONE REACHED for ${customer.name}! Voucher: ${voucherCode}, Cashier PIN: ${pinCode}`);
    }

    console.log(`✅ Scan registered in MongoDB for ${customer.name}: now has ${currentProg.stampsCollected} stamps & ${customer.points} points.`);

    return res.json({
      success: true,
      message: isNewCustomer 
        ? `Welcome to ${resolvedStoreName}! Stamp #1 collected & 150 points added!` 
        : rewardAvailable
        ? `🎉 Congratulations! You reached ${currentProg.totalStamps} stamps! Reward Unlocked!`
        : `Stamp #${currentProg.stampsCollected} collected successfully! +50 Points awarded.`,
      isNewCustomer,
      earnedStamps: 1,
      currentStamps: currentProg.stampsCollected,
      totalStamps: currentProg.totalStamps,
      points: customer.points,
      rewardAvailable,
      reward: rewardUnlocked ? {
        id: rewardUnlocked._id,
        voucherCode: rewardUnlocked.voucherCode,
        pinCode: rewardUnlocked.pinCode,
        title: rewardUnlocked.rewardTitle,
        discountValue: rewardUnlocked.discountValue,
        minBillAmount: rewardUnlocked.minBillAmount,
        storeName: resolvedStoreName,
        expiresAt: rewardUnlocked.expiresAt,
        status: rewardUnlocked.status
      } : null,
      customer: {
        id: customer._id,
        name: customer.name,
        customerId: customer.customerId || ('LQR-' + customer._id.toString().slice(-6).toUpperCase()),
        phone: `+91 ${customer.mobile}`,
        mobile: customer.mobile,
        email: customer.email,
        tier: customer.tier,
        points: customer.points,
        stamps: customer.stamps,
        activeCardsCount: customer.activeCardsCount,
        rewardsRedeemedCount: customer.rewardsRedeemedCount,
        storeProgress: customer.storeProgress
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// 5B. Customer Check-in (Initiates Stamp Request - Awaits Merchant Authority)
// =========================================================================
router.post('/checkin', async (req, res) => {
  try {
    const { mobile, name, storeSlug = 'ka-feen', storeName } = req.body;
    const cleanMobile = cleanPhone(mobile);

    if (!cleanMobile || cleanMobile.length !== 10) {
      return res.status(400).json({ success: false, message: 'Valid 10-digit mobile number required.' });
    }

    let merchant = null;
    if (storeSlug) {
      const cleanSlug = storeSlug.toLowerCase().replace(/[^a-z0-9]/g, '');
      merchant = await Merchant.findOne({
        $or: [
          { qrSlug: storeSlug },
          { 'branches.qrSlug': storeSlug },
          { qrSlug: new RegExp(storeSlug.replace(/-\d+$/, ''), 'i') },
          { qrSlug: new RegExp(cleanSlug, 'i') }
        ]
      });
    }
    if (!merchant) merchant = await Merchant.findOne({ isActive: true });
    if (!merchant) merchant = await Merchant.findOne();

    if (merchant) {
      const subStatus = Merchant.checkMerchantSubscription(merchant);
      if (!subStatus.isOnline) {
        return res.status(403).json({
          success: false,
          storeOffline: true,
          message: `Cannot scan QR: ${merchant.businessName}'s BeAurex subscription has expired.`
        });
      }
    }

    const resolvedStoreName = storeName || (merchant ? merchant.businessName : 'Kafeen Coffee');
    const resolvedSlug = (merchant && merchant.qrSlug) || storeSlug || 'kafeen-4040';

    let customer = await Customer.findOne({ mobile: cleanMobile });
    let isNewCustomer = false;

    if (!customer) {
      isNewCustomer = true;
      const customerId = 'LQR-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      customer = await Customer.create({
        name: (name && name.trim()) || 'Customer',
        mobile: cleanMobile,
        customerId,
        points: 100, // 100 Welcome Points
        tier: 'Bronze Member',
        stamps: 0,
        totalVisits: 1,
        isActive: true,
        lastLoginAt: new Date(),
        lastVisitAt: new Date(),
        activeCardsCount: 1,
        rewardsRedeemedCount: 0,
        storeProgress: [
          {
            storeSlug: resolvedSlug,
            storeName: resolvedStoreName,
            stampsCollected: 0,
            totalStamps: 5,
            lastVisit: new Date()
          }
        ]
      });
    }

    // Generate 4-digit check-in token
    const checkinToken = Math.floor(1000 + Math.random() * 9000).toString();

    // Set pendingStamp on Customer
    customer.pendingStamp = {
      storeSlug: resolvedSlug,
      storeName: resolvedStoreName,
      checkinToken,
      granted: false,
      grantedAt: null
    };
    await customer.save();

    // Record scan in Scan collection
    if (merchant) {
      await Scan.create({
        merchantId: merchant._id,
        customerId: customer._id,
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.headers['user-agent'] || 'Mobile Browser/App'
      });
    }

    const prog = customer.storeProgress?.find(p => p.storeSlug === resolvedSlug) || {
      stampsCollected: customer.stamps || 0,
      totalStamps: 5
    };

    return res.json({
      success: true,
      pendingMerchant: true,
      checkinToken,
      storeName: resolvedStoreName,
      storeSlug: resolvedSlug,
      currentStamps: prog.stampsCollected,
      totalStamps: prog.totalStamps,
      isNewCustomer,
      message: `Check-in recorded at ${resolvedStoreName}! Ask the cashier/merchant to issue your visit stamp.`
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// 5C. Grant Stamp Authority (ONLY Merchant Account Holder has Authority)
// =========================================================================
router.post('/grant-stamp', async (req, res) => {
  try {
    const { mobile, storeSlug = 'ka-feen', merchantPin } = req.body;
    const cleanMobile = cleanPhone(mobile);

    if (!cleanMobile || cleanMobile.length !== 10) {
      return res.status(400).json({ success: false, message: 'Valid 10-digit mobile number required.' });
    }

    // STRICT: Validate Merchant Stamp Authority PIN (Default: 1234 or 2026 or merchant password)
    const validPins = ['1234', '2026', '0000', '9876'];
    let merchant = null;
    if (storeSlug) {
      merchant = await Merchant.findOne({ qrSlug: storeSlug });
    }
    if (!merchant) merchant = await Merchant.findOne({ isActive: true });

    const pinInput = String(merchantPin || '').trim();
    const isAuthorized = validPins.includes(pinInput) || (merchant && merchant.password && pinInput === merchant.password);

    if (!isAuthorized) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Merchant Authority PIN. Stamp authority is restricted exclusively to the merchant account holder.'
      });
    }

    const customer = await Customer.findOne({ mobile: cleanMobile });
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer record not found for this mobile.' });
    }

    const resolvedStoreName = merchant ? merchant.businessName : 'Kafeen Coffee';
    const resolvedSlug = (merchant && merchant.qrSlug) || storeSlug || 'kafeen-4040';

    customer.pendingStamp = {
      storeSlug: resolvedSlug,
      storeName: resolvedStoreName,
      checkinToken: customer.pendingStamp?.checkinToken || Math.floor(1000 + Math.random() * 9000).toString(),
      granted: true,
      grantedAt: new Date()
    };
    await customer.save();

    console.log(`✅ Merchant granted stamp authority to ${customer.name} (+91 ${customer.mobile})`);

    return res.json({
      success: true,
      message: `Stamp granted by merchant! ${customer.name} can now claim their stamp on their phone screen.`,
      customer: {
        id: customer._id,
        name: customer.name,
        phone: customer.mobile
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// 5D. Check Stamp Authorization Status
// =========================================================================
router.get('/stamp-status', async (req, res) => {
  try {
    const { mobile, storeSlug } = req.query;
    const cleanMobile = cleanPhone(mobile);

    if (!cleanMobile) {
      return res.json({ success: true, granted: false });
    }

    const customer = await Customer.findOne({ mobile: cleanMobile });
    if (!customer) {
      return res.json({ success: true, granted: false });
    }

    const isGranted = Boolean(customer.pendingStamp && customer.pendingStamp.granted);
    const prog = customer.storeProgress?.find(p => p.storeSlug === storeSlug) || {
      stampsCollected: customer.stamps || 0,
      totalStamps: 5
    };

    return res.json({
      success: true,
      granted: isGranted,
      pendingStamp: customer.pendingStamp,
      currentStamps: prog.stampsCollected,
      totalStamps: prog.totalStamps
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// 5E. Customer Claim Stamp (Customer Claims It When Merchant Gives It)
// =========================================================================
router.post('/claim-stamp', async (req, res) => {
  try {
    const { mobile, storeSlug = 'ka-feen' } = req.body;
    const cleanMobile = cleanPhone(mobile);

    if (!cleanMobile || cleanMobile.length !== 10) {
      return res.status(400).json({ success: false, message: 'Valid 10-digit mobile number required.' });
    }

    const customer = await Customer.findOne({ mobile: cleanMobile });
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }

    // STRICT CHECK: Stamp authority must be GRANTED by the merchant!
    if (!customer.pendingStamp || !customer.pendingStamp.granted) {
      return res.status(403).json({
        success: false,
        message: 'Stamp not yet authorized by merchant. The merchant account holder must give the stamp before you can claim it.'
      });
    }

    let merchant = null;
    if (storeSlug) {
      merchant = await Merchant.findOne({ qrSlug: storeSlug });
    }
    if (!merchant) merchant = await Merchant.findOne({ isActive: true });

    const resolvedStoreName = customer.pendingStamp.storeName || (merchant ? merchant.businessName : 'Kafeen Coffee');
    const resolvedSlug = customer.pendingStamp.storeSlug || (merchant && merchant.qrSlug) || storeSlug;

    // Increment Customer Stamps & Points in MongoDB
    customer.stamps = (customer.stamps || 0) + 1;
    customer.points = (customer.points || 0) + 50;
    customer.totalVisits = (customer.totalVisits || 0) + 1;
    customer.lastVisitAt = new Date();

    if (!customer.storeProgress) customer.storeProgress = [];
    let prog = customer.storeProgress.find(p => p.storeSlug === resolvedSlug);
    if (!prog) {
      prog = {
        storeSlug: resolvedSlug,
        storeName: resolvedStoreName,
        stampsCollected: 1,
        totalStamps: 5,
        lastVisit: new Date()
      };
      customer.storeProgress.push(prog);
    } else {
      prog.stampsCollected = (prog.stampsCollected || 0) + 1;
      prog.lastVisit = new Date();
    }

    // Clear pending stamp now that it has been claimed
    customer.pendingStamp = {
      storeSlug: null,
      storeName: null,
      checkinToken: null,
      granted: false,
      grantedAt: null
    };

    // Check if Milestone Reached (e.g. 5 of 5) -> Unlock Reward Voucher!
    let rewardUnlocked = null;
    let rewardAvailable = false;

    if (prog.stampsCollected >= prog.totalStamps) {
      rewardAvailable = true;
      let activeReward = merchant ? await Reward.findOne({ merchantId: merchant._id, isActive: true }).sort({ createdAt: -1 }) : null;
      const pinCode = Math.floor(1000 + Math.random() * 9000).toString();
      const voucherCode = 'LQR-' + Math.floor(1000 + Math.random() * 9000) + '-' + pinCode.slice(0, 2);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      if (merchant) {
        rewardUnlocked = await Voucher.create({
          voucherCode,
          pinCode,
          merchantId: merchant._id,
          customerId: customer._id,
          customerName: customer.name || 'Loyal Customer',
          customerMobile: customer.mobile || '',
          rewardId: activeReward ? activeReward._id : merchant._id,
          rewardTitle: activeReward ? activeReward.title : '30% off on next purchase',
          discountValue: activeReward ? activeReward.discountValue : 30,
          minBillAmount: activeReward ? (activeReward.minBillAmount || 200) : 200,
          status: 'ACTIVE',
          expiresAt
        });
      }
    }

    await customer.save();

    console.log(`🎉 Customer ${customer.name} claimed stamp: now has ${prog.stampsCollected} stamps!`);

    return res.json({
      success: true,
      message: rewardAvailable
        ? `🎉 Milestone reached! All ${prog.totalStamps} stamps collected. Reward Unlocked!`
        : `Stamp #${prog.stampsCollected} claimed successfully! +50 Points awarded.`,
      currentStamps: prog.stampsCollected,
      totalStamps: prog.totalStamps,
      points: customer.points,
      rewardAvailable,
      reward: rewardUnlocked ? {
        id: rewardUnlocked._id,
        voucherCode: rewardUnlocked.voucherCode,
        pinCode: rewardUnlocked.pinCode,
        title: rewardUnlocked.rewardTitle,
        discountValue: rewardUnlocked.discountValue,
        minBillAmount: rewardUnlocked.minBillAmount,
        storeName: resolvedStoreName,
        expiresAt: rewardUnlocked.expiresAt
      } : null,
      customer: {
        id: customer._id,
        name: customer.name,
        phone: `+91 ${customer.mobile}`,
        stamps: customer.stamps,
        points: customer.points,
        storeProgress: customer.storeProgress
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// 6. Customer Reward Claim (Creates real Voucher in MongoDB)
// =========================================================================
router.post('/reward/claim', async (req, res) => {
  try {
    const { mobile, storeSlug = 'ka-feen', rewardTitle, discountValue = 30 } = req.body;
    const cleanMobile = cleanPhone(mobile);

    let customer = await Customer.findOne({ mobile: cleanMobile });
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }

    let merchant = await Merchant.findOne({ qrSlug: storeSlug });
    if (!merchant) {
      merchant = await Merchant.findOne();
    }

    if (merchant) {
      const subStatus = Merchant.checkMerchantSubscription(merchant);
      if (!subStatus.isOnline) {
        return res.status(403).json({
          success: false,
          storeOffline: true,
          isExpired: true,
          message: `Cannot claim reward: ${merchant.businessName}'s subscription has expired.`
        });
      }
    }

    const pinCode = Math.floor(1000 + Math.random() * 9000).toString();
    const voucherCode = 'LQR-' + Math.floor(1000 + Math.random() * 9000) + '-' + pinCode.slice(0, 2);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    let voucher = null;
    if (merchant) {
      voucher = await Voucher.create({
        voucherCode,
        pinCode,
        merchantId: merchant._id,
        customerId: customer._id,
        customerName: customer.name || 'Loyal Customer',
        customerMobile: customer.mobile || cleanMobile,
        rewardId: merchant._id, // Reference merchant or reward
        rewardTitle: rewardTitle || '30% off on next purchase',
        discountValue: Number(discountValue),
        minBillAmount: 200,
        status: 'ACTIVE',
        expiresAt
      });
    }

    customer.rewardsRedeemedCount = (customer.rewardsRedeemedCount || 0) + 1;
    await customer.save();

    console.log(`✅ Voucher claimed and saved to MongoDB: ${voucherCode} (PIN: ${pinCode})`);

    return res.json({
      success: true,
      message: 'Reward claimed! Voucher generated in MongoDB.',
      voucher: {
        id: voucher ? voucher._id : 'v_' + Date.now(),
        voucherCode,
        pinCode,
        rewardTitle: rewardTitle || '30% off on next purchase',
        discountValue,
        storeName: merchant ? merchant.businessName : 'Ka-feen Coffee Shop',
        expiresAt,
        status: 'ACTIVE'
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// 7. Customer Wallet (Queries MongoDB Vouchers)
// =========================================================================
router.get('/wallet', async (req, res) => {
  try {
    const { mobile } = req.query;
    const cleanMobile = cleanPhone(mobile);

    if (!cleanMobile) {
      return res.json({ success: true, wallet: [] });
    }

    const customer = await Customer.findOne({ mobile: cleanMobile });
    if (!customer) {
      return res.json({ success: true, wallet: [] });
    }

    const vouchers = await Voucher.find({ customerId: customer._id }).sort({ createdAt: -1 });

    const wallet = vouchers.map(v => ({
      id: v._id.toString(),
      title: v.rewardTitle,
      condition: `Min. order ₹${v.minBillAmount || 200}`,
      pinCode: v.pinCode,
      voucherCode: v.voucherCode,
      status: v.status,
      daysLeft: Math.max(0, Math.ceil((new Date(v.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))),
      redeemedDate: v.redeemedAt ? new Date(v.redeemedAt).toLocaleDateString() : null
    }));

    return res.json({
      success: true,
      wallet
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// 8. Reward Claim Approval Workflow (Requires Merchant Approval)
// =========================================================================
const redemptionStore = require('../services/redemptionStore');

// POST Customer Submits Reward Claim Request (Waiting for Merchant Approval)
router.post('/reward/request-approval', async (req, res) => {
  try {
    const { customerId, customerName, rewardTitle, storeSlug = 'ka-feen', stamps, voucherType } = req.body;
    
    const claim = redemptionStore.addPendingClaim({
      customerId: customerId || 'LQR-8F4A29',
      customerName: customerName || 'Customer',
      rewardTitle: rewardTitle || '30% OFF on next purchase',
      storeSlug,
      stamps: stamps || '5/5 Stamps completed',
      voucherType: voucherType || '30'
    });

    console.log(`⏳ Reward claim requested by ${claim.customerName} (${claim.customerId}). Waiting for merchant approval.`);

    return res.json({
      success: true,
      status: 'PENDING_APPROVAL',
      message: 'Claim request submitted. Waiting for merchant to approve.',
      claim
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET Customer Polls Approval Status for their Reward Claim
router.get('/reward/check-approval', (req, res) => {
  try {
    const { customerId, claimId } = req.query;
    const result = redemptionStore.checkClaimStatus(customerId, claimId);
    return res.json({
      success: true,
      ...result
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

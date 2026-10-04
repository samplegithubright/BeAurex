const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Merchant = require('../models/Merchant');
const Voucher = require('../models/Voucher');
const Scan = require('../models/Scan');
const smsService = require('../services/smsService');

// Temporary memory store for pending customer signup OTPs (5 min TTL)
const pendingSignupOtps = new Map();

// Helper to clean 10-digit mobile number
const cleanPhone = (m) => String(m || '').replace(/[^0-9]/g, '').slice(-10);

// =========================================================================
// 1. Customer OTP Request (Login or Signup)
// STRICT: Unregistered users cannot request login OTP; they must signup first.
// =========================================================================
router.post('/auth/request-otp', async (req, res) => {
  try {
    const { mobile, isSignup } = req.body;
    const cleanMobile = cleanPhone(mobile);

    if (!cleanMobile || cleanMobile.length !== 10) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid 10-digit mobile number.' 
      });
    }

    const customer = await Customer.findOne({ mobile: cleanMobile });

    if (!isSignup) {
      // LOGIN FLOW: Must already be registered in MongoDB
      if (!customer) {
        return res.status(404).json({
          success: false,
          notRegistered: true,
          message: `Mobile number +91 ${cleanMobile} is not registered. Please sign up first to join loyalty rewards.`
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

      // Generate dynamic OTP & store in Customer record in MongoDB
      const otp = smsService.generateOtp();
      customer.otp = otp;
      customer.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min
      await customer.save();

      await smsService.sendOtp(cleanMobile, otp, 'customer login');

      return res.json({
        success: true,
        message: `OTP sent to +91 ${cleanMobile}. Valid for 5 minutes.`,
        devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined
      });
    } else {
      // SIGNUP FLOW: Check if already exists
      if (customer) {
        return res.status(400).json({
          success: false,
          alreadyRegistered: true,
          message: `Mobile number +91 ${cleanMobile} is already registered. Please switch to Sign In.`
        });
      }

      // Generate OTP and save to pending signups map with 5-min TTL
      const otp = smsService.generateOtp();
      pendingSignupOtps.set(cleanMobile, {
        otp,
        expires: Date.now() + 5 * 60 * 1000
      });

      await smsService.sendOtp(cleanMobile, otp, 'customer signup');

      return res.json({
        success: true,
        message: `Verification code sent to +91 ${cleanMobile}. Valid for 5 minutes.`,
        devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// 2. Customer Registration (Creates record in MongoDB Customer collection)
// =========================================================================
router.post('/auth/register', async (req, res) => {
  try {
    const { name, mobile, email, otp } = req.body;
    const cleanMobile = cleanPhone(mobile);
    const cleanOtp = String(otp || '').trim();

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your full name.' });
    }
    if (!cleanMobile || cleanMobile.length !== 10) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number.' });
    }
    if (!cleanOtp) {
      return res.status(400).json({ success: false, message: 'Please enter the 6-digit OTP code.' });
    }

    // Verify OTP from pending signups
    const pending = pendingSignupOtps.get(cleanMobile);
    if (!pending || pending.otp !== cleanOtp || pending.expires < Date.now()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired OTP. Please re-check the code or request a new one.' 
      });
    }

    // Check if already created in DB in the meantime
    let existing = await Customer.findOne({ mobile: cleanMobile });
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: 'Account already exists for this mobile number. Please log in.' 
      });
    }

    // Clear pending OTP
    pendingSignupOtps.delete(cleanMobile);

    // Generate unique Customer ID (e.g. LQR-8F4A29)
    const customerId = 'LQR-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    // Create & save customer in MongoDB
    const newCustomer = await Customer.create({
      name: name.trim(),
      mobile: cleanMobile,
      email: email ? email.trim() : '',
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
          storeSlug: 'ka-feen',
          storeName: 'Ka-feen Coffee Shop',
          stampsCollected: 1,
          totalStamps: 5,
          lastVisit: new Date()
        }
      ]
    });

    console.log(`✅ New Customer registered and saved to MongoDB: ${newCustomer.name} (${newCustomer.mobile})`);

    return res.status(201).json({
      success: true,
      message: 'Account created! Welcome to BeAurex (+100 Welcome Points awarded).',
      customer: {
        id: newCustomer._id,
        name: newCustomer.name,
        customerId: newCustomer.customerId,
        phone: `+91 ${newCustomer.mobile}`,
        mobile: newCustomer.mobile,
        email: newCustomer.email,
        tier: newCustomer.tier,
        points: newCustomer.points,
        stamps: newCustomer.stamps,
        activeCardsCount: newCustomer.activeCardsCount,
        rewardsRedeemedCount: newCustomer.rewardsRedeemedCount,
        memberSince: 'Just now'
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// 3. Customer OTP Login (Validates against MongoDB)
// =========================================================================
router.post('/auth/verify-otp', async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    const cleanMobile = cleanPhone(mobile);
    const cleanOtp = String(otp || '').trim();

    if (!cleanMobile || cleanMobile.length !== 10) {
      return res.status(400).json({ success: false, message: 'Valid 10-digit mobile number required.' });
    }
    if (!cleanOtp) {
      return res.status(400).json({ success: false, message: 'Please enter the 6-digit OTP code.' });
    }

    const customer = await Customer.findOne({ mobile: cleanMobile });

    if (!customer) {
      return res.status(404).json({
        success: false,
        notRegistered: true,
        message: 'Account not found for this mobile number. Please sign up first.'
      });
    }

    if (customer.isActive === false) {
      return res.status(403).json({
        success: false,
        suspended: true,
        message: 'Account Suspended: Your customer account has been suspended by administration. Please contact customer support.'
      });
    }

    if (!customer.otp || customer.otp !== cleanOtp || !customer.otpExpires || customer.otpExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP. Please enter the OTP sent to your phone.'
      });
    }

    // Clear OTP and record visit/login in MongoDB
    customer.otp = null;
    customer.otpExpires = null;
    customer.totalVisits = (customer.totalVisits || 0) + 1;
    customer.lastVisitAt = new Date();
    customer.lastLoginAt = new Date();
    await customer.save();

    console.log(`✅ Customer logged in from MongoDB: ${customer.name} (${customer.mobile})`);

    return res.json({
      success: true,
      message: 'Login successful',
      customer: {
        id: customer._id,
        name: customer.name,
        customerId: customer.customerId || ('LQR-' + customer._id.toString().slice(-6).toUpperCase()),
        phone: `+91 ${customer.mobile}`,
        mobile: customer.mobile,
        email: customer.email,
        tier: customer.tier || 'Gold Member',
        points: customer.points || 150,
        stamps: customer.stamps || 3,
        activeCardsCount: customer.activeCardsCount || 1,
        rewardsRedeemedCount: customer.rewardsRedeemedCount || 0,
        memberSince: customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2026'
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// 4. Customer Profile Fetch (from MongoDB)
// =========================================================================
router.get('/profile', async (req, res) => {
  try {
    const { mobile } = req.query;
    const cleanMobile = cleanPhone(mobile);

    if (!cleanMobile) {
      return res.status(400).json({ success: false, message: 'Mobile number required.' });
    }

    const customer = await Customer.findOne({ mobile: cleanMobile });
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
      merchant = await Merchant.findOne({ qrSlug: slug });
    }
    if (!merchant) {
      merchant = await Merchant.findOne();
    }

    if (!merchant) {
      return res.status(404).json({ success: false, message: 'Store not found.' });
    }

    const subStatus = Merchant.checkMerchantSubscription(merchant);

    return res.json({
      success: true,
      storeName: merchant.businessName,
      qrSlug: merchant.qrSlug,
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
    const { mobile, storeSlug = 'ka-feen', storeName = 'Ka-feen Coffee Shop' } = req.body;
    const cleanMobile = cleanPhone(mobile);

    let customer = await Customer.findOne({ mobile: cleanMobile });
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found. Please log in.' });
    }

    // Look up merchant if available
    let merchant = await Merchant.findOne({ qrSlug: storeSlug });
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

    // Record scan in MongoDB Scan collection
    if (merchant) {
      await Scan.create({
        merchantId: merchant._id,
        customerId: customer._id,
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.headers['user-agent'] || 'Mobile App'
      });
    }

    // Update customer stats
    customer.points = (customer.points || 0) + 50; // +50 points per scan
    customer.stamps = (customer.stamps || 0) + 1;
    customer.totalVisits = (customer.totalVisits || 0) + 1;
    customer.lastVisitAt = new Date();

    // Update store progress array
    if (!customer.storeProgress) customer.storeProgress = [];
    let prog = customer.storeProgress.find(p => p.storeSlug === storeSlug);
    if (!prog) {
      prog = {
        storeSlug,
        storeName,
        stampsCollected: 1,
        totalStamps: 5,
        lastVisit: new Date()
      };
      customer.storeProgress.push(prog);
    } else {
      prog.stampsCollected = (prog.stampsCollected || 0) + 1;
      prog.lastVisit = new Date();
    }

    await customer.save();

    console.log(`✅ Scan registered in MongoDB for ${customer.name}: now has ${prog.stampsCollected} stamps & ${customer.points} points.`);

    return res.json({
      success: true,
      message: 'Scan recorded successfully! +50 Points awarded.',
      earnedStamps: 1,
      currentStamps: prog.stampsCollected,
      totalStamps: prog.totalStamps,
      points: customer.points
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

module.exports = router;

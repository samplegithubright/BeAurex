const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Merchant = require('../models/Merchant');
const smsService = require('../services/smsService');
const emailService = require('../services/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'loyalqr_super_secret_jwt_key_2026';

// Seed demo merchant if DB is connected and not yet created
async function ensureDemoMerchant() {
  if (mongoose.connection.readyState !== 1) return;
  try {
    const existing = await Merchant.findOne({ email: 'owner@royalsweets.com' });
    if (!existing) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('LoyalQR@2026', salt);
      await Merchant.create({
        businessName: 'Royal Sweets & Cafe',
        category: 'CAFE_RESTAURANT',
        email: 'owner@royalsweets.com',
        mobile: '9876543210',
        password: hashedPassword,
        city: 'Delhi NCR',
        qrSlug: 'royal-sweets-delhi',
        subscriptionTier: 'TRIAL',
        trialDays: 3,
        trialExpiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        onboardingCompleted: true,
        branches: [{
          branchName: 'Main Outlet',
          address: 'Connaught Place',
          city: 'Delhi NCR',
          pincode: '110001',
          counterName: 'Counter 1',
          qrSlug: 'royal-sweets-delhi',
          isPrimary: true
        }]
      });
      console.log('✅ Demo merchant seeded: owner@royalsweets.com / LoyalQR@2026');
    }
  } catch (err) {
    console.error('Error seeding demo merchant:', err.message);
  }
}

// =========================================================================
// SCREEN 1: ADM-AUTH-001 (Merchant Email/Mobile + Password Login)
// Requires prior signup in MongoDB. If not registered, rejects login.
// =========================================================================
router.post('/login', async (req, res) => {
  try {
    const { email, mobile, password } = req.body;

    if (!password || (!email && !mobile)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email/Mobile and Password are required.' 
      });
    }

    const cleanEmail = email ? email.toLowerCase().trim() : '';
    const cleanMobile = mobile ? mobile.replace(/[^0-9]/g, '').slice(-10) : '';

    let merchant = null;

    if (mongoose.connection.readyState === 1) {
      if (cleanEmail) {
        merchant = await Merchant.findOne({ email: cleanEmail });
      }
      if (!merchant && cleanMobile) {
        merchant = await Merchant.findOne({ mobile: cleanMobile });
      }
    }

    // STRICT: Must exist in database!
    if (!merchant) {
      return res.status(404).json({
        success: false,
        notRegistered: true,
        message: 'Store account not found. Please sign up first to create your store account.'
      });
    }

    // Check if suspended by Super Admin
    if (merchant.isActive === false) {
      return res.status(403).json({
        success: false,
        suspended: true,
        message: 'Account Suspended: Your store account has been suspended by administration due to unpaid status. Please contact support or purchase a subscription to reactivate.'
      });
    }

    // Verify Password with bcrypt
    const isMatch = await bcrypt.compare(password, merchant.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Incorrect password entered. Please try again.' 
      });
    }

    const merchantId = merchant._id.toString();
    const token = jwt.sign({ id: merchantId, role: 'MERCHANT' }, JWT_SECRET, { expiresIn: '24h' });
    const subStatus = Merchant.checkMerchantSubscription(merchant);

    return res.json({
      success: true,
      message: subStatus.isExpired ? subStatus.message : 'Login successful',
      isExpired: subStatus.isExpired,
      redirectTo: subStatus.isExpired ? 'subscribe' : 'dashboard',
      token,
      merchant: {
        id: merchantId,
        businessName: merchant.businessName,
        email: merchant.email,
        mobile: merchant.mobile,
        subscriptionTier: merchant.subscriptionTier || 'TRIAL',
        qrSlug: merchant.qrSlug || 'royal-sweets-delhi',
        city: merchant.city || 'Delhi NCR',
        category: merchant.category || 'CAFE_RESTAURANT',
        onboardingCompleted: merchant.onboardingCompleted !== undefined ? merchant.onboardingCompleted : true,
        onboardingStep: merchant.onboardingStep || 1,
        branches: merchant.branches || [],
        trialDays: merchant.trialDays || 3,
        trialExpiresAt: merchant.trialExpiresAt,
        isOnline: subStatus.isOnline,
        isExpired: subStatus.isExpired,
        subscriptionStatus: subStatus
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// Merchant Phone Login - Send Dynamic OTP
// =========================================================================
// Merchant Email / Phone Login - Send Dynamic OTP
// Checks MongoDB if store is registered. Sends real dynamic 6-digit OTP via Email.
// =========================================================================
router.post('/send-login-otp', async (req, res) => {
  try {
    const { email, mobile } = req.body;
    if (!email && !mobile) {
      return res.status(400).json({ success: false, message: 'Registered Email address is required.' });
    }

    const cleanEmail = email ? String(email).trim().toLowerCase() : '';
    const cleanMobile = mobile ? String(mobile).replace(/[^0-9]/g, '').slice(-10) : '';

    let merchant = null;
    if (mongoose.connection.readyState === 1) {
      if (cleanEmail) {
        merchant = await Merchant.findOne({ email: cleanEmail });
      } else if (cleanMobile) {
        merchant = await Merchant.findOne({ mobile: cleanMobile });
      }
    }

    // STRICT: Store must be signed up first!
    if (!merchant) {
      const identifier = cleanEmail || `+91 ${cleanMobile}`;
      return res.status(404).json({
        success: false,
        notRegistered: true,
        message: `${identifier} is not registered. Please sign up first to register your store.`
      });
    }

    // Check if suspended by Super Admin
    if (merchant.isActive === false) {
      return res.status(403).json({
        success: false,
        suspended: true,
        message: 'Account Suspended: Your store account has been suspended by administration. You cannot log in.'
      });
    }

    // Generate real dynamic 6-digit OTP & save expiry in MongoDB
    const otp = emailService.generateOtp();
    merchant.loginOtp = otp;
    merchant.loginOtpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await merchant.save();

    // Dispatch via Email if email is available (or mobile SMS as fallback)
    if (merchant.email) {
      await emailService.sendOtpEmail(merchant.email, otp, 'store sign in');
      return res.json({
        success: true,
        message: `OTP sent successfully to ${merchant.email}. Valid for 5 minutes.`,
        devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined
      });
    } else if (cleanMobile) {
      await smsService.sendOtp(cleanMobile, otp, 'login');
      return res.json({
        success: true,
        message: `OTP sent successfully to +91 ${cleanMobile}. Valid for 5 minutes.`,
        devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined
      });
    }

    return res.status(400).json({ success: false, message: 'No registered email found for this store.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// Merchant Login - Verify Dynamic OTP
// Validates against MongoDB loginOtp.
// =========================================================================
router.post('/login-otp', async (req, res) => {
  try {
    const { email, mobile, otp } = req.body;
    if ((!email && !mobile) || !otp) {
      return res.status(400).json({ success: false, message: 'Email address and 6-digit OTP are required.' });
    }

    const cleanEmail = email ? String(email).trim().toLowerCase() : '';
    const cleanMobile = mobile ? String(mobile).replace(/[^0-9]/g, '').slice(-10) : '';
    const cleanOtp = String(otp).trim();

    let merchant = null;
    if (mongoose.connection.readyState === 1) {
      if (cleanEmail) {
        merchant = await Merchant.findOne({ email: cleanEmail });
      } else if (cleanMobile) {
        merchant = await Merchant.findOne({ mobile: cleanMobile });
      }
    }

    if (!merchant) {
      return res.status(404).json({
        success: false,
        notRegistered: true,
        message: 'Store account not found. Please sign up first.'
      });
    }

    if (merchant.isActive === false) {
      return res.status(403).json({
        success: false,
        suspended: true,
        message: 'Account Suspended: Your store account has been suspended by administration. You cannot log in.'
      });
    }

    // Check OTP validity in MongoDB
    if (
      !merchant.loginOtp ||
      merchant.loginOtp !== cleanOtp ||
      !merchant.loginOtpExpires ||
      merchant.loginOtpExpires < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP entered. Please check your email inbox/spam folder and enter the 6-digit code.'
      });
    }

    // Clear OTP after successful use
    merchant.loginOtp = null;
    merchant.loginOtpExpires = null;
    await merchant.save();

    const merchantId = merchant._id.toString();
    const token = jwt.sign({ id: merchantId, role: 'MERCHANT' }, JWT_SECRET, { expiresIn: '24h' });
    const subStatus = Merchant.checkMerchantSubscription(merchant);

    return res.json({
      success: true,
      message: subStatus.isExpired ? subStatus.message : 'OTP Login successful',
      isExpired: subStatus.isExpired,
      redirectTo: subStatus.isExpired ? 'subscribe' : 'dashboard',
      token,
      merchant: {
        id: merchantId,
        businessName: merchant.businessName,
        email: merchant.email,
        mobile: merchant.mobile,
        subscriptionTier: merchant.subscriptionTier || 'TRIAL',
        qrSlug: merchant.qrSlug || ('store-' + cleanMobile.slice(-4)),
        city: merchant.city || 'Delhi NCR',
        category: merchant.category || 'CAFE_RESTAURANT',
        onboardingCompleted: merchant.onboardingCompleted !== undefined ? merchant.onboardingCompleted : true,
        onboardingStep: merchant.onboardingStep || 1,
        branches: merchant.branches || [],
        trialDays: merchant.trialDays || 3,
        trialExpiresAt: merchant.trialExpiresAt,
        isOnline: subStatus.isOnline,
        isExpired: subStatus.isExpired,
        subscriptionStatus: subStatus
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// SCREEN 2: ADM-AUTH-002 (Forgot Password - Send OTP)
// =========================================================================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email, mobile } = req.body;

    if (!email && !mobile) {
      return res.status(400).json({ success: false, message: 'Email Address or Mobile Number is required.' });
    }

    const cleanEmail = email ? email.toLowerCase().trim() : '';
    const cleanMobile = mobile ? mobile.replace(/[^0-9]/g, '').slice(-10) : '';

    let merchant = null;
    if (cleanEmail) {
      merchant = await Merchant.findOne({ email: cleanEmail });
    }
    if (!merchant && cleanMobile) {
      merchant = await Merchant.findOne({ mobile: cleanMobile });
    }

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: 'No store account found matching these details. Please check and try again.'
      });
    }

    const targetEmail = cleanEmail || merchant.email;
    const targetMobile = merchant.mobile || cleanMobile;
    const otp = emailService.generateOtp();
    merchant.resetOtp = otp;
    merchant.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await merchant.save();

    if (targetEmail) {
      await emailService.sendOtpEmail(targetEmail, otp, 'password reset');
      return res.json({
        success: true,
        message: `Password reset OTP sent to ${targetEmail}. Valid for 10 minutes.`,
        email: targetEmail,
        mobile: targetMobile,
        devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined
      });
    } else {
      await smsService.sendOtp(targetMobile, otp, 'password reset');
      return res.json({
        success: true,
        message: `Password reset OTP sent to +91 ${targetMobile}. Valid for 10 minutes.`,
        email: targetEmail,
        mobile: targetMobile,
        devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// SCREEN 3: ADM-AUTH-003 (Verify Password Reset OTP)
// =========================================================================
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, mobile, otp } = req.body;

    if ((!email && !mobile) || !otp) {
      return res.status(400).json({ success: false, message: 'Email address and 6-digit OTP are required.' });
    }

    const cleanEmail = email ? email.toLowerCase().trim() : '';
    const cleanMobile = mobile ? mobile.replace(/[^0-9]/g, '').slice(-10) : '';
    const cleanOtp = String(otp).trim();

    let merchant = null;
    if (cleanEmail) {
      merchant = await Merchant.findOne({ email: cleanEmail });
    }
    if (!merchant && cleanMobile) {
      merchant = await Merchant.findOne({ mobile: cleanMobile });
    }

    if (!merchant) {
      return res.status(404).json({ success: false, message: 'Store account not found.' });
    }

    if (
      !merchant.resetOtp ||
      merchant.resetOtp !== cleanOtp ||
      !merchant.resetOtpExpires ||
      merchant.resetOtpExpires < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP. Please re-check the code or request a new one.'
      });
    }

    // Issue reset token
    const resetToken = jwt.sign({ id: merchant._id.toString(), purpose: 'RESET' }, JWT_SECRET, { expiresIn: '15m' });

    return res.json({
      success: true,
      message: 'OTP verified successfully.',
      resetToken
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// SCREEN 4: ADM-AUTH-004 (Set New Password)
// =========================================================================
router.post('/set-password', async (req, res) => {
  try {
    const { email, mobile, newPassword } = req.body;

    if ((!email && !mobile) || !newPassword || newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }

    const cleanEmail = email ? email.toLowerCase().trim() : '';
    const cleanMobile = mobile ? mobile.replace(/[^0-9]/g, '').slice(-10) : '';

    let merchant = null;
    if (cleanEmail) {
      merchant = await Merchant.findOne({ email: cleanEmail });
    }
    if (!merchant && cleanMobile) {
      merchant = await Merchant.findOne({ mobile: cleanMobile });
    }

    if (!merchant) {
      return res.status(404).json({ success: false, message: 'Store not found.' });
    }

    const salt = await bcrypt.genSalt(10);
    merchant.password = await bcrypt.hash(newPassword, salt);
    merchant.resetOtp = null;
    merchant.resetOtpExpires = null;
    await merchant.save();

    return res.json({
      success: true,
      message: 'New password saved successfully! You can now log in.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// SETTINGS: Update Password
// =========================================================================
router.post('/update-password', async (req, res) => {
  try {
    const { mobile, email, currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    let merchant = null;
    if (mobile) {
      const cleanMobile = mobile.replace(/[^0-9]/g, '').slice(-10);
      merchant = await Merchant.findOne({ mobile: cleanMobile });
    } else if (email) {
      merchant = await Merchant.findOne({ email: email.toLowerCase().trim() });
    }

    if (!merchant) {
      return res.status(404).json({ success: false, message: 'Store not found.' });
    }

    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, merchant.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password does not match.' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    merchant.password = await bcrypt.hash(newPassword, salt);
    await merchant.save();

    return res.json({
      success: true,
      message: 'Password updated successfully in database!'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// MERCHANT REGISTRATION (Creates store account & saves in MongoDB)
// =========================================================================
router.post('/register', async (req, res) => {
  try {
    const { businessName, email, mobile, password, category, city } = req.body;

    const cleanEmail = email ? email.toLowerCase().trim() : '';
    const cleanMobile = mobile ? mobile.replace(/[^0-9]/g, '').slice(-10) : '';

    if (!businessName || !cleanEmail || !password) {
      return res.status(400).json({ success: false, message: 'Business Name, Email Address and Password are required.' });
    }

    if (!cleanEmail.includes('@')) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    if (cleanMobile && cleanMobile.length !== 10) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number or leave blank.' });
    }

    // Check if store already exists in MongoDB
    const query = [{ email: cleanEmail }];
    if (cleanMobile) query.push({ mobile: cleanMobile });

    const existing = await Merchant.findOne({ $or: query });
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: 'A store with this email or mobile number is already registered. Please go to Sign In.' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate unique slug
    const cleanSlugBase = businessName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 30);
    const qrSlug = cleanSlugBase + '-' + Math.floor(1000 + Math.random() * 9000);

    // Save directly to MongoDB Merchant collection
    const newMerchant = await Merchant.create({
      businessName: businessName.trim(),
      category: category || 'CAFE_RESTAURANT',
      city: city || 'Delhi NCR',
      email: cleanEmail,
      mobile: cleanMobile || undefined,
      password: hashedPassword,
      qrSlug,
      subscriptionTier: 'TRIAL',
      trialDays: 3,
      trialExpiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      onboardingCompleted: false,
      onboardingStep: 1,
      branches: [
        {
          branchName: `${businessName.trim()} - Main Outlet`,
          address: city || 'Main Market',
          city: city || 'Delhi NCR',
          pincode: '110001',
          counterName: 'Billing Counter',
          qrSlug,
          isPrimary: true
        }
      ]
    });

    const merchantId = newMerchant._id.toString();
    const token = jwt.sign({ id: merchantId, role: 'MERCHANT' }, JWT_SECRET, { expiresIn: '24h' });

    console.log(`✅ New Merchant registered and saved to MongoDB: ${newMerchant.businessName} (${cleanMobile})`);

    return res.status(201).json({
      success: true,
      message: 'Business account created successfully! 3-Day Free Trial activated.',
      token,
      merchant: {
        id: merchantId,
        businessName: newMerchant.businessName,
        email: newMerchant.email,
        mobile: newMerchant.mobile,
        subscriptionTier: 'TRIAL',
        qrSlug: newMerchant.qrSlug,
        city: newMerchant.city,
        category: newMerchant.category,
        trialDays: 3,
        trialExpiresAt: newMerchant.trialExpiresAt,
        onboardingCompleted: false,
        onboardingStep: 1,
        branches: newMerchant.branches
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = { router, ensureDemoMerchant };

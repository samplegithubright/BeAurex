const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const Merchant = require('../models/Merchant');
const Plan = require('../models/Plan');
const systemStore = require('../services/systemStore');
const emailService = require('../services/emailService');

// =========================================================================
// 1. GET PAYMENT GATEWAY STATUS
// Tells frontend if real Razorpay keys are configured or in Demo Mode
// =========================================================================
router.get('/status', async (req, res) => {
  try {
    const status = await systemStore.getGatewayStatus();
    res.json({ success: true, ...status });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// 2. CREATE RAZORPAY ORDER
// Dynamic: Uses keys from Super Admin DB if configured, otherwise falls back to Demo
// =========================================================================
router.post('/razorpay/create-order', async (req, res) => {
  try {
    const { merchantId, planId = 'plan_professional', amount } = req.body;
    const config = await systemStore.getConfig();
    const isConfigured = systemStore.isRazorpayConfigured(config);

    // Resolve plan pricing
    let finalAmount = Number(amount || 0);
    let planName = 'Professional Plan';
    let durationDays = 3 * 365;
    let tier = 'PROFESSIONAL';

    const allPlans = await systemStore.getAllPlans();
    const targetPlan = allPlans.find(p => p.id === planId);

    if (targetPlan) {
      finalAmount = targetPlan.price;
      planName = targetPlan.name;
      durationDays = targetPlan.trialDays > 0 && targetPlan.price === 0 ? targetPlan.trialDays : (targetPlan.id === 'plan_standard' ? 365 : targetPlan.id === 'plan_legacy' ? 100 * 365 : 3 * 365);
      tier = targetPlan.id === 'plan_standard' ? 'STANDARD' : targetPlan.id === 'plan_legacy' ? 'LEGACY' : 'PROFESSIONAL';
    } else {
      if (planId === 'plan_standard') { finalAmount = 24000; tier = 'STANDARD'; durationDays = 365; }
      else if (planId === 'plan_legacy') { finalAmount = 75000; tier = 'LEGACY'; durationDays = 100 * 365; }
      else { finalAmount = 49000; tier = 'PROFESSIONAL'; durationDays = 3 * 365; }
    }

    // FALLBACK: When NO Razorpay keys are configured, return Demo Mode flag
    if (!isConfigured) {
      console.log(`ℹ️ Razorpay not configured. Allowing Demo Payment for plan "${planName}" (₹${finalAmount}).`);
      return res.json({
        success: true,
        isDemo: true,
        message: 'Razorpay keys not configured in Super Admin. Proceeding with instant Demo Activation.',
        plan: { id: planId, name: planName, price: finalAmount, tier, durationDays }
      });
    }

    // LIVE / TEST RAZORPAY MODE: Real Razorpay Order Creation
    const keyId = config.razorpayKeyId || process.env.RAZORPAY_KEY_ID;
    const keySecret = config.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET;

    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });

    const receipt = `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const orderOptions = {
      amount: Math.round(finalAmount * 100), // Razorpay expects amount in paise (1 INR = 100 paise)
      currency: 'INR',
      receipt: receipt,
      notes: {
        merchantId: String(merchantId || ''),
        planId: planId,
        tier: tier
      }
    };

    const razorpayOrder = await instance.orders.create(orderOptions);

    console.log(`✅ Real Razorpay Order Created: ${razorpayOrder.id} for ₹${finalAmount}`);

    return res.json({
      success: true,
      isDemo: false,
      keyId: keyId,
      order: razorpayOrder,
      amount: finalAmount,
      currency: 'INR',
      plan: { id: planId, name: planName, price: finalAmount, tier, durationDays }
    });
  } catch (err) {
    console.error('Error creating Razorpay order:', err);
    res.status(500).json({ success: false, message: 'Razorpay order error: ' + err.message });
  }
});

// =========================================================================
// 3. VERIFY RAZORPAY SIGNATURE & ACTIVATE SUBSCRIPTION
// =========================================================================
router.post('/razorpay/verify-payment', async (req, res) => {
  try {
    const { 
      merchantId, 
      planId = 'plan_professional',
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      isDemo = false
    } = req.body;

    const config = await systemStore.getConfig();
    const isConfigured = systemStore.isRazorpayConfigured(config);

    // If Real Razorpay Mode, verify HMAC-SHA256 signature
    if (isConfigured && !isDemo) {
      const keySecret = config.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET;
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        console.warn('❌ Invalid Razorpay signature verification attempt!');
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed: Invalid transaction signature.'
        });
      }
      console.log(`✅ Razorpay payment signature verified successfully: Payment ID ${razorpay_payment_id}`);
    }

    // Resolve Merchant
    let merchant = null;
    if (merchantId) {
      try { merchant = await Merchant.findById(merchantId); } catch (_) {}
    }
    if (!merchant) {
      merchant = await Merchant.findOne();
    }

    if (!merchant) {
      return res.status(404).json({ success: false, message: 'Merchant account not found.' });
    }

    // Resolve Plan & Expiry
    let tier = 'PROFESSIONAL';
    let durationDays = 3 * 365;
    let price = 49000;

    if (planId === 'plan_standard') {
      tier = 'STANDARD';
      durationDays = 365;
      price = 24000;
    } else if (planId === 'plan_legacy') {
      tier = 'LEGACY';
      durationDays = 100 * 365;
      price = 75000;
    }

    const expiryDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

    merchant.subscriptionTier = tier;
    merchant.subscriptionExpiresAt = expiryDate;
    merchant.planValidTill = expiryDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    merchant.paymentDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    merchant.paymentAmount = '₹' + price.toLocaleString('en-IN');
    merchant.isActive = true;
    merchant.isComplimentary = false;
    merchant.trialExpiresAt = null;

    await merchant.save();

    console.log(`🎉 Merchant ${merchant.businessName} successfully upgraded to ${tier} plan!`);

    // Send confirmation email asynchronously
    if (merchant.email) {
      emailService.sendEmail({
        to: merchant.email,
        subject: `🎉 Subscription Activated: ${tier} Plan (${merchant.businessName})`,
        html: `
          <div style="font-family: sans-serif; padding: 24px; color: #1e293b;">
            <h2 style="color: #74111d;">Subscription Confirmed!</h2>
            <p>Dear ${merchant.businessName},</p>
            <p>Your <strong>${tier} Plan</strong> subscription has been successfully activated.</p>
            <ul>
              <li><strong>Amount:</strong> ₹${price.toLocaleString('en-IN')}</li>
              <li><strong>Valid Until:</strong> ${merchant.planValidTill}</li>
              <li><strong>Payment Ref:</strong> ${razorpay_payment_id || 'DEMO-TXN-' + Date.now()}</li>
            </ul>
            <p>Your store QR code standee and loyalty scan services are now 100% ONLINE.</p>
          </div>
        `
      }).catch(() => {});
    }

    const updatedStatus = Merchant.checkMerchantSubscription(merchant);

    return res.json({
      success: true,
      message: isDemo 
        ? `Demo Mode: ${tier} Subscription activated successfully!` 
        : `Payment verified! ${tier} Subscription activated via Razorpay. Store is LIVE!`,
      paymentId: razorpay_payment_id || ('demo_' + Date.now()),
      merchant: {
        id: merchant._id,
        businessName: merchant.businessName,
        subscriptionTier: merchant.subscriptionTier,
        isOnline: updatedStatus.isOnline,
        isExpired: updatedStatus.isExpired,
        planValidTill: merchant.planValidTill
      },
      subscription: updatedStatus
    });
  } catch (err) {
    console.error('Error in payment verification:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

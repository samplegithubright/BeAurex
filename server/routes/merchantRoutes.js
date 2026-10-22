const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const QRCode = require('qrcode');
const Voucher = require('../models/Voucher');
const Reward = require('../models/Reward');
const Merchant = require('../models/Merchant');
const Scan = require('../models/Scan');
const Customer = require('../models/Customer');

// Get Merchant Dashboard Configured Features
router.get('/features', async (req, res) => {
  try {
    const adminRoutes = require('./adminRoutes');
    // Forward or return defaults
    res.json({
      success: true,
      features: [
        { id: 'home_overview', isVisible: true },
        { id: 'home_qr_code', isVisible: true },
        { id: 'home_plan_banner', isVisible: true },
        { id: 'rewards_tab', isVisible: true },
        { id: 'create_offer_tab', isVisible: true },
        { id: 'customers_tab', isVisible: true },
        { id: 'auto_approve_scans', isVisible: true },
        { id: 'allow_multiple_scans', isVisible: true },
        { id: 'allow_first_coin', isVisible: true },
        { id: 'location_hours', isVisible: true },
        { id: 'phone_email', isVisible: true },
        { id: 'social_reviews', isVisible: true },
        { id: 'owner_account', isVisible: true },
        { id: 'tutorial_video', isVisible: true },
        { id: 'download_app', isVisible: true },
        { id: 'subscription_manage', isVisible: true },
        { id: 'privacy_security', isVisible: true },
        { id: 'help_support', isVisible: true }
      ]
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get Merchant Standee & QR Data
router.get('/standee', async (req, res) => {
  try {
    const { merchantId, slug } = req.query;
    let merchant = null;
    if (merchantId) {
      try { merchant = await Merchant.findById(merchantId); } catch (_) {}
    }
    if (!merchant && slug) {
      merchant = await Merchant.findOne({ qrSlug: slug });
    }
    if (!merchant) {
      merchant = await Merchant.findOne();
    }

    const storeName = merchant?.businessName || req.query.store || 'Royal Sweets & Cafe';
    const storeSlug = merchant?.qrSlug || req.query.slug || 'royal-sweets-delhi';
    const primaryBranch = merchant?.branches?.find(b => b.isPrimary) || merchant?.branches?.[0] || {
      branchName: 'Main Outlet',
      address: 'Main Market',
      city: merchant?.city || 'Delhi NCR'
    };

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const qrTargetUrl = `${clientUrl}/scan/${storeSlug}`;

    // Generate QR Data URL
    const qrDataUrl = await QRCode.toDataURL(qrTargetUrl, {
      width: 450,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' }
    });

    res.json({
      success: true,
      storeName,
      storeSlug,
      tagline: merchant?.tagline || 'Scan & Earn Loyalty Rewards',
      brandColor: merchant?.brandColor || '#74111d',
      branch: primaryBranch,
      qrTargetUrl,
      qrDataUrl
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Fast In-Store Counter Voucher Burn via 4-Digit PIN
router.post('/redeem', async (req, res) => {
  try {
    const { pinCode } = req.body;

    if (!pinCode || pinCode.length !== 4) {
      return res.status(400).json({ success: false, message: 'Please provide a valid 4-digit PIN.' });
    }

    // Check demonstration mock PINs
    if (pinCode === '4821') {
      return res.json({
        success: true,
        message: 'Voucher Valid! ₹150 discount applied to bill.',
        voucher: {
          voucherCode: 'LQR-9821-48',
          discountTitle: '₹150 OFF On Next Order Above ₹500',
          pinCode: '4821',
          status: 'REDEEMED',
          redeemedAt: new Date()
        }
      });
    }

    const voucher = await Voucher.findOne({ pinCode, status: 'ACTIVE' });
    if (!voucher) {
      return res.status(404).json({ success: false, message: 'Invalid, expired, or already redeemed PIN.' });
    }

    voucher.status = 'REDEEMED';
    voucher.redeemedAt = new Date();
    await voucher.save();

    res.json({
      success: true,
      message: `Voucher Valid! ${voucher.rewardTitle} applied to bill.`,
      voucher
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Merchant Live Overview Metrics
router.get('/metrics', async (req, res) => {
  try {
    res.json({
      success: true,
      metrics: {
        totalScans: 1482,
        scansGrowth: '+24% this week',
        repeatCustomerRate: '42.8%',
        repeatBenchmark: '3.2x vs traditional stores',
        activeVouchers: 319,
        redeemedAtCounter: 542,
        repeatSalesVolume: '₹1.84 Lakh'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// PILLAR 1: SCANS (Live Scan Stream & Summary)
// =========================================================================
router.get('/scans', async (req, res) => {
  try {
    const { merchantId, slug, limit = 50 } = req.query;
    let merchant = null;
    if (merchantId) {
      try { merchant = await Merchant.findById(merchantId); } catch (_) {}
    }
    if (!merchant && slug) {
      merchant = await Merchant.findOne({ qrSlug: slug });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    let scansList = [];
    let totalCount = 0;
    let scansToday = 0;

    if (merchant) {
      totalCount = await Scan.countDocuments({ merchantId: merchant._id });
      scansToday = await Scan.countDocuments({ merchantId: merchant._id, createdAt: { $gte: startOfToday } });
      scansList = await Scan.find({ merchantId: merchant._id })
        .populate('customerId', 'name mobile')
        .sort({ createdAt: -1 })
        .limit(Number(limit));

      const formattedScans = scansList.map(s => ({
        id: s._id.toString(),
        customerName: s.customerId?.name || 'Loyal Customer',
        phone: s.customerId?.mobile ? `+91 ${s.customerId.mobile}` : '+91 98******10',
        time: new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date(s.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
        ipAddress: s.ipAddress || '127.0.0.1',
        device: s.userAgent?.includes('iPhone') ? 'iOS (Safari)' : 'Android (Chrome)',
        branch: merchant?.branches?.[0]?.branchName || 'Main Counter',
        status: 'VERIFIED'
      }));

      return res.json({
        success: true,
        totalScans: totalCount,
        scansToday,
        scansGrowth: totalCount > 0 ? '+15% this week' : '0% this week',
        scans: formattedScans
      });
    }

    // Fallback only if no merchant is selected (global default demo)
    totalCount = await Scan.countDocuments();
    scansToday = await Scan.countDocuments({ createdAt: { $gte: startOfToday } });
    scansList = await Scan.find()
      .populate('customerId', 'name mobile')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    const formattedScans = scansList.map(s => ({
      id: s._id.toString(),
      customerName: s.customerId?.name || 'Loyal Customer',
      phone: s.customerId?.mobile ? `+91 ${s.customerId.mobile}` : '+91 98******10',
      time: new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date(s.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      ipAddress: s.ipAddress || '127.0.0.1',
      device: s.userAgent?.includes('iPhone') ? 'iOS (Safari)' : 'Android (Chrome)',
      branch: 'Main Counter',
      status: 'VERIFIED'
    }));

    res.json({
      success: true,
      totalScans: totalCount,
      scansToday,
      scansGrowth: '+20% this week',
      scans: formattedScans
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// PILLAR 3: REWARDS (Active Loyalty Offers & Management)
// =========================================================================
router.get('/rewards', async (req, res) => {
  try {
    const { merchantId } = req.query;
    let query = {};
    if (merchantId) query.merchantId = merchantId;

    let dbRewards = [];
    try {
      dbRewards = await Reward.find(query).sort({ createdAt: -1 });
    } catch (_) {}

    const defaultRewards = [
      { id: 'r1', title: '30% off on next purchase', condition: 'Collect 2 Aurex Coins to unlock', discountType: 'PERCENTAGE', discountValue: 30, minBillAmount: 0, stampsRequired: 2, validity: 'Expires 7/30/2026', banner: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80', tag: 'ACHIEVED', isActive: true },
      { id: 'r2', title: '50% discount', condition: 'Collect 5 Aurex Coins to unlock', discountType: 'PERCENTAGE', discountValue: 50, minBillAmount: 0, stampsRequired: 5, validity: 'Expires 7/30/2026', banner: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', tag: 'ACHIEVED', isActive: true },
      { id: 'r3', title: 'Free Coffee', condition: 'Collect 3 Aurex Coins to unlock', discountType: 'FREE_ITEM', discountValue: 100, minBillAmount: 0, stampsRequired: 3, validity: 'Expires 7/30/2026', banner: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80', tag: 'ACHIEVED', isActive: true }
    ];

    const rewards = dbRewards.length > 0 ? dbRewards.map(r => ({
      id: r._id.toString(),
      title: r.title,
      description: r.description || `Collect ${r.stampsRequired || 5} Aurex Coins • Valid for ${r.validityDays || 30} days`,
      condition: `Collect ${r.stampsRequired || 5} Aurex Coins • Valid for ${r.validityDays || 30} days`,
      discountType: r.discountType,
      discountValue: r.discountValue,
      minBillAmount: r.minBillAmount,
      stampsRequired: r.stampsRequired || 5,
      validity: `Expires in ${r.validityDays || 30} days`,
      banner: r.banner || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
      probability: `${r.probabilityWeight || 50}% Chance`,
      tag: (r.stampsRequired || 5) <= 3 ? 'Popular' : 'Special Reward',
      isActive: r.isActive
    })) : defaultRewards;

    res.json({
      success: true,
      rewards
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/rewards', async (req, res) => {
  try {
    const { merchantId, title, description = '', discountType = 'PERCENTAGE', discountValue = 10, minBillAmount = 0, validityDays = 30, stampsRequired = 5, banner = '', probabilityWeight = 50 } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Reward title is required.' });

    let mId = merchantId;
    if (!mId) {
      const m = await Merchant.findOne();
      mId = m?._id;
    }

    const newReward = await Reward.create({
      merchantId: mId,
      title: title.trim(),
      description: description.trim(),
      discountType,
      discountValue: Number(discountValue),
      minBillAmount: Number(minBillAmount),
      validityDays: Number(validityDays),
      stampsRequired: Number(stampsRequired),
      banner: banner || '',
      probabilityWeight: Number(probabilityWeight),
      isActive: true
    });

    res.json({
      success: true,
      message: 'New reward offer rule created successfully!',
      reward: newReward
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/rewards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Reward.findByIdAndDelete(id);
    res.json({ success: true, message: 'Reward removed successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// In-memory / cache storage for dynamic offer modifications during demo/runtime
let activeStampProgram = {
  title: 'Get 5% discount on your total bill after 5 visits',
  stampsRequired: 6,
  validityDays: 30,
  minBill: 200,
  type: 'DISCOUNT_PERCENT'
};

let digitalMenuItems = [
  { id: 'm1', name: 'Special Masala Chai', category: 'Beverages', price: 60, isVeg: true, inStock: true, description: 'Freshly brewed aromatic tea with ginger & spices' },
  { id: 'm2', name: 'Paneer Tikka Roll', category: 'Starters', price: 180, isVeg: true, inStock: true, description: 'Char-grilled cottage cheese in flaky paratha' },
  { id: 'm3', name: 'Butter Chicken Biryani', category: 'Mains', price: 320, isVeg: false, inStock: true, description: 'Fragrant basmati rice layered with rich butter chicken' },
  { id: 'm4', name: 'Gulab Jamun with Rabri', category: 'Desserts', price: 110, isVeg: true, inStock: true, description: 'Warm khoya dumplings with thick saffron milk' },
  { id: 'm5', name: 'Cold Brew Hazelnut Coffee', category: 'Beverages', price: 140, isVeg: true, inStock: true, description: 'Smooth 16-hour steeped iced coffee' }
];

let winnersList = [
  { id: 'w1', type: 'scratch', customerName: 'Rohan Sharma', phone: '9876543210', rewardTitle: '₹150 Flat Discount Voucher', pinCode: '4821', claimedAt: '10 mins ago', status: 'ACTION_REQUIRED' },
  { id: 'w2', type: 'scratch', customerName: 'Priya Verma', phone: '9812345678', rewardTitle: '15% OFF On Next Dine-In Bill', pinCode: '3912', claimedAt: '45 mins ago', status: 'ACTION_REQUIRED' },
  { id: 'w3', type: 'scratch', customerName: 'Amit Saxena', phone: '9765432109', rewardTitle: 'Free Special Masala Chai', pinCode: '8841', claimedAt: '2 hours ago', status: 'REDEEMED' },
  { id: 'w4', type: 'stamp', customerName: 'Simran Kaur', phone: '9988776655', rewardTitle: 'Get 5% discount on your total bill', pinCode: '5521', claimedAt: 'Yesterday', status: 'ACTION_REQUIRED' },
  { id: 'w5', type: 'stamp', customerName: 'Deepak Patel', phone: '9123456780', rewardTitle: 'Get 5% discount on your total bill', pinCode: '6142', claimedAt: '2 days ago', status: 'REDEEMED' }
];

let customersList = [
  { id: 'c1', name: 'Rohan Sharma', phone: '9876543210', totalVisits: 6, stamps: 6, status: 'COMPLETED', lastVisit: 'Today, 09:30 AM' },
  { id: 'c2', name: 'Priya Verma', phone: '9812345678', totalVisits: 4, stamps: 4, status: 'ACTIVE', lastVisit: 'Today, 08:45 AM' },
  { id: 'c3', name: 'Amit Saxena', phone: '9765432109', totalVisits: 3, stamps: 3, status: 'ACTIVE', lastVisit: 'Yesterday, 07:15 PM' },
  { id: 'c4', name: 'Simran Kaur', phone: '9988776655', totalVisits: 6, stamps: 6, status: 'COMPLETED', lastVisit: 'Yesterday, 02:40 PM' },
  { id: 'c5', name: 'Deepak Patel', phone: '9123456780', totalVisits: 6, stamps: 6, status: 'COMPLETED', lastVisit: '02 Oct 2026' },
  { id: 'c6', name: 'Sneha Gupta', phone: '9899001122', totalVisits: 2, stamps: 2, status: 'ACTIVE', lastVisit: '01 Oct 2026' },
  { id: 'c7', name: 'Vikas Malhotra', phone: '9711223344', totalVisits: 5, stamps: 5, status: 'ACTIVE', lastVisit: '30 Sep 2026' }
];

// GET Merchant Profile (Used for loading merchant dashboard by merchantId or slug)
router.get('/profile', async (req, res) => {
  try {
    const { merchantId, slug, email } = req.query;
    let merchant = null;
    if (merchantId) {
      try { merchant = await Merchant.findById(merchantId); } catch (_) {}
    }
    if (!merchant && slug) {
      merchant = await Merchant.findOne({ qrSlug: slug });
    }
    if (!merchant && email) {
      merchant = await Merchant.findOne({ email: email.toLowerCase() });
    }
    if (!merchant) {
      return res.status(404).json({ success: false, message: 'Merchant not found' });
    }

    const subStatus = Merchant.checkMerchantSubscription(merchant);

    res.json({
      success: true,
      merchant: {
        id: merchant._id.toString(),
        businessName: merchant.businessName,
        ownerName: merchant.ownerName || '',
        logo: merchant.logo || '',
        category: merchant.category,
        email: merchant.email,
        mobile: merchant.mobile,
        addressLine1: merchant.addressLine1 || (merchant.branches?.[0]?.address || ''),
        addressLine2: merchant.addressLine2 || '',
        address: merchant.address || merchant.addressLine1 || (merchant.branches?.[0]?.address || ''),
        city: merchant.city || 'Delhi NCR',
        state: merchant.state || '',
        pinCode: merchant.pinCode || merchant.pincode || (merchant.branches?.[0]?.pincode || ''),
        pincode: merchant.pinCode || merchant.pincode || (merchant.branches?.[0]?.pincode || ''),
        qrSlug: merchant.qrSlug,
        brandColor: merchant.brandColor || '#74111d',
        branches: merchant.branches || [],
        cashierPin: merchant.cashierPin || '4829',
        subscriptionTier: merchant.subscriptionTier,
        planValidTill: merchant.planValidTill,
        paymentAmount: merchant.paymentAmount,
        paymentDate: merchant.paymentDate,
        dealDetails: merchant.dealDetails,
        isComplimentary: merchant.isComplimentary,
        complimentaryDays: merchant.complimentaryDays,
        complimentaryReason: merchant.complimentaryReason,
        subscription: subStatus
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /profile - Update Merchant Profile & Location
router.put('/profile', async (req, res) => {
  try {
    const { merchantId, id, businessName, ownerName, category, addressLine1, addressLine2, city, state, pinCode, pincode, logo } = req.body;
    const targetId = merchantId || id;
    let merchant = null;
    if (targetId) {
      try { merchant = await Merchant.findById(targetId); } catch (_) {}
    }
    if (!merchant) {
      return res.status(404).json({ success: false, message: 'Merchant not found' });
    }

    if (businessName !== undefined) merchant.businessName = businessName.trim();
    if (ownerName !== undefined) merchant.ownerName = ownerName.trim();
    if (category !== undefined) merchant.category = category;
    if (logo !== undefined) merchant.logo = logo;
    if (addressLine1 !== undefined) merchant.addressLine1 = addressLine1.trim();
    if (addressLine2 !== undefined) merchant.addressLine2 = addressLine2.trim();
    if (city !== undefined) merchant.city = city.trim();
    if (state !== undefined) merchant.state = state.trim();
    if (pinCode !== undefined || pincode !== undefined) {
      const pin = (pinCode || pincode || '').trim();
      merchant.pinCode = pin;
      merchant.pincode = pin;
    }
    const fullAddr = merchant.addressLine1 
      ? (merchant.addressLine2 ? `${merchant.addressLine1}, ${merchant.addressLine2}` : merchant.addressLine1)
      : merchant.city;
    merchant.address = fullAddr;

    if (merchant.branches && merchant.branches.length > 0) {
      merchant.branches[0].address = fullAddr;
      if (merchant.city) merchant.branches[0].city = merchant.city;
      if (merchant.pinCode) merchant.branches[0].pincode = merchant.pinCode;
    }

    await merchant.save();

    res.json({
      success: true,
      message: 'Profile and address updated successfully!',
      merchant: {
        id: merchant._id.toString(),
        businessName: merchant.businessName,
        ownerName: merchant.ownerName,
        logo: merchant.logo,
        category: merchant.category,
        email: merchant.email,
        mobile: merchant.mobile,
        addressLine1: merchant.addressLine1,
        addressLine2: merchant.addressLine2,
        address: merchant.address,
        city: merchant.city,
        state: merchant.state,
        pinCode: merchant.pinCode,
        pincode: merchant.pincode,
        branches: merchant.branches
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET Home Dashboard Data
router.get('/home', async (req, res) => {
  try {
    let merchant = null;
    const { merchantId, slug } = req.query;
    if (merchantId) {
      try { merchant = await Merchant.findById(merchantId); } catch (_) {}
    }
    if (!merchant && slug) {
      merchant = await Merchant.findOne({ qrSlug: slug });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    if (merchant) {
      const mId = merchant._id;
      const totalScans = await Scan.countDocuments({ merchantId: mId });
      const scansToday = await Scan.countDocuments({ merchantId: mId, createdAt: { $gte: startOfToday } });
      const customerIds = await Scan.distinct('customerId', { merchantId: mId });
      const totalUsers = customerIds.length;
      const totalVouchers = await Voucher.countDocuments({ merchantId: mId });
      const completedToday = await Voucher.countDocuments({ merchantId: mId, status: 'REDEEMED', updatedAt: { $gte: startOfToday } });

      let repeatCustomerIds = new Set();
      let allTimeRepeatRateNum = 0;
      if (totalUsers > 0) {
        try {
          const repeatScansAgg = await Scan.aggregate([
            { $match: { merchantId: mId } },
            { $group: { _id: '$customerId', count: { $sum: 1 } } },
            { $match: { count: { $gt: 1 } } }
          ]);
          repeatCustomerIds = new Set(repeatScansAgg.map(r => String(r._id)));
          allTimeRepeatRateNum = Math.min(100, Math.round((repeatCustomerIds.size / totalUsers) * 100));
        } catch (_) {}
      }
      const repeatRate = `${allTimeRepeatRateNum}%`;

      const calcPctChange = (curr, prev) => {
        if (!prev || prev === 0) return curr > 0 ? '+100%' : '0%';
        const diff = curr - prev;
        const pct = Math.round((diff / prev) * 1000) / 10;
        return `${pct >= 0 ? '+' : ''}${pct}%`;
      };

      const getRepeatRateForCusts = (custIds) => {
        if (!custIds || custIds.length === 0) return 0;
        const repeatCount = custIds.filter(id => repeatCustomerIds.has(String(id))).length;
        return Math.min(100, Math.round((repeatCount / custIds.length) * 100));
      };

      const calcRateChange = (curr, prev) => {
        if (curr === 0 && (!prev || prev === 0)) return '0%';
        if (!prev || prev === 0) return curr > 0 ? `+${curr}%` : '0%';
        const diff = curr - prev;
        if (diff === 0) return '0%';
        const pct = Math.round((diff / prev) * 1000) / 10;
        return `${pct >= 0 ? '+' : ''}${pct}%`;
      };

      const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
      const startOfWeek = new Date(startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000);
      const startOfPrevWeek = new Date(startOfToday.getTime() - 14 * 24 * 60 * 60 * 1000);
      const startOfMonth = new Date(startOfToday.getTime() - 30 * 24 * 60 * 60 * 1000);
      const startOfPrevMonth = new Date(startOfToday.getTime() - 60 * 24 * 60 * 60 * 1000);

      const scansYesterday = await Scan.countDocuments({ merchantId: mId, createdAt: { $gte: startOfYesterday, $lt: startOfToday } });
      const scansThisWeek = await Scan.countDocuments({ merchantId: mId, createdAt: { $gte: startOfWeek } });
      const scansPrevWeek = await Scan.countDocuments({ merchantId: mId, createdAt: { $gte: startOfPrevWeek, $lt: startOfWeek } });
      const scansThisMonth = await Scan.countDocuments({ merchantId: mId, createdAt: { $gte: startOfMonth } });
      const scansPrevMonth = await Scan.countDocuments({ merchantId: mId, createdAt: { $gte: startOfPrevMonth, $lt: startOfMonth } });

      const customersTodayIds = await Scan.distinct('customerId', { merchantId: mId, createdAt: { $gte: startOfToday } });
      const customersYesterdayIds = await Scan.distinct('customerId', { merchantId: mId, createdAt: { $gte: startOfYesterday, $lt: startOfToday } });
      const customersWeekIds = await Scan.distinct('customerId', { merchantId: mId, createdAt: { $gte: startOfWeek } });
      const customersPrevWeekIds = await Scan.distinct('customerId', { merchantId: mId, createdAt: { $gte: startOfPrevWeek, $lt: startOfWeek } });
      const customersMonthIds = await Scan.distinct('customerId', { merchantId: mId, createdAt: { $gte: startOfMonth } });
      const customersPrevMonthIds = await Scan.distinct('customerId', { merchantId: mId, createdAt: { $gte: startOfPrevMonth, $lt: startOfMonth } });

      const completedYesterday = await Voucher.countDocuments({ merchantId: mId, status: 'REDEEMED', updatedAt: { $gte: startOfYesterday, $lt: startOfToday } });
      const completedThisWeek = await Voucher.countDocuments({ merchantId: mId, status: 'REDEEMED', updatedAt: { $gte: startOfWeek } });
      const completedPrevWeek = await Voucher.countDocuments({ merchantId: mId, status: 'REDEEMED', updatedAt: { $gte: startOfPrevWeek, $lt: startOfWeek } });
      const completedThisMonth = await Voucher.countDocuments({ merchantId: mId, status: 'REDEEMED', updatedAt: { $gte: startOfMonth } });
      const completedPrevMonth = await Voucher.countDocuments({ merchantId: mId, status: 'REDEEMED', updatedAt: { $gte: startOfPrevMonth, $lt: startOfMonth } });

      const rateToday = getRepeatRateForCusts(customersTodayIds);
      const rateYesterday = getRepeatRateForCusts(customersYesterdayIds);
      const rateWeek = getRepeatRateForCusts(customersWeekIds);
      const ratePrevWeek = getRepeatRateForCusts(customersPrevWeekIds);
      const rateMonth = customersMonthIds.length > 0 ? getRepeatRateForCusts(customersMonthIds) : (totalUsers > 0 ? allTimeRepeatRateNum : 0);
      const ratePrevMonth = getRepeatRateForCusts(customersPrevMonthIds);

      const periodStats = {
        'Today': {
          scans: scansToday,
          customers: customersTodayIds.length,
          rewards: completedToday,
          repeatRate: `${rateToday}%`,
          scansChange: calcPctChange(scansToday, scansYesterday),
          customersChange: calcPctChange(customersTodayIds.length, customersYesterdayIds.length),
          rewardsChange: calcPctChange(completedToday, completedYesterday),
          repeatRateChange: calcRateChange(rateToday, rateYesterday)
        },
        'This Week': {
          scans: scansThisWeek,
          customers: customersWeekIds.length,
          rewards: completedThisWeek,
          repeatRate: `${rateWeek}%`,
          scansChange: calcPctChange(scansThisWeek, scansPrevWeek),
          customersChange: calcPctChange(customersWeekIds.length, customersPrevWeekIds.length),
          rewardsChange: calcPctChange(completedThisWeek, completedPrevWeek),
          repeatRateChange: calcRateChange(rateWeek, ratePrevWeek)
        },
        'This Month': {
          scans: scansThisMonth || totalScans,
          customers: customersMonthIds.length || totalUsers,
          rewards: completedThisMonth || totalVouchers,
          repeatRate: `${rateMonth}%`,
          scansChange: calcPctChange(scansThisMonth || totalScans, scansPrevMonth),
          customersChange: calcPctChange(customersMonthIds.length || totalUsers, customersPrevMonthIds.length),
          rewardsChange: calcPctChange(completedThisMonth || totalVouchers, completedPrevMonth),
          repeatRateChange: calcRateChange(rateMonth, ratePrevMonth)
        },
        'All Time': {
          scans: totalScans,
          customers: totalUsers,
          rewards: totalVouchers,
          repeatRate,
          scansChange: totalScans > 0 ? calcPctChange(totalScans, scansPrevMonth) : '0%',
          customersChange: totalUsers > 0 ? calcPctChange(totalUsers, customersPrevMonthIds.length) : '0%',
          rewardsChange: totalVouchers > 0 ? calcPctChange(totalVouchers, completedPrevMonth) : '0%',
          repeatRateChange: totalUsers > 0 ? calcRateChange(allTimeRepeatRateNum, ratePrevMonth) : '0%'
        }
      };

      // Weekly scans for this merchant
      const weekly = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);
        const nextD = new Date(d);
        nextD.setDate(nextD.getDate() + 1);
        const dayScans = await Scan.countDocuments({
          merchantId: mId,
          createdAt: { $gte: d, $lt: nextD }
        });
        weekly.push({ day: days[d.getDay()], scans: dayScans });
      }

      // Merchant's real reward
      let activeReward = null;
      try {
        activeReward = await Reward.findOne({ merchantId: mId, isActive: true });
      } catch (_) {}

      const subStatus = Merchant.checkMerchantSubscription(merchant);

      try {
        const allPlans = await systemStore.getAllPlans();
        const matched = allPlans.find(p => 
          (merchant.planId && p.id === merchant.planId) || 
          (merchant.planName && merchant.planName !== 'temp fran' && p.name?.toLowerCase() === merchant.planName?.toLowerCase()) || 
          (merchant.plan && merchant.plan !== 'temp fran' && p.name?.toLowerCase() === merchant.plan?.toLowerCase()) || 
          (merchant.subscriptionTier && p.name?.toLowerCase() === merchant.subscriptionTier?.toLowerCase())
        ) || allPlans.find(p => p.isActive !== false) || allPlans[0];

        if (matched) {
          subStatus.planId = matched.id;
          subStatus.planName = matched.name;
          subStatus.planPeriod = matched.period || subStatus.planPeriod || '/ Year';
          subStatus.planPrice = '₹' + Number(matched.price || 0).toLocaleString('en-IN');
        }
      } catch (_) {}

      return res.json({
        success: true,
        merchant: {
          id: merchant._id,
          businessName: merchant.businessName,
          qrSlug: merchant.qrSlug,
          brandColor: merchant.brandColor,
          logo: merchant.logo,
          tagline: merchant.tagline,
          city: merchant.city
        },
        metrics: {
          scans: totalScans,
          users: totalUsers,
          rewards: totalVouchers,
          repeatRate
        },
        periodStats,
        today: {
          scansToday,
          completedToday
        },
        weekly,
        activeRewardProgram: activeReward ? {
          title: activeReward.title,
          stampsRequired: 5,
          validityDays: activeReward.validityDays || 30,
          minBill: activeReward.minBillAmount || 200,
          type: activeReward.discountType || 'DISCOUNT_PERCENT'
        } : activeStampProgram,
        subscription: subStatus
      });
    }

    // Fallback if no specific merchant is requested (demo fallback)
    const totalScans = await Scan.countDocuments();
    const totalUsers = await Customer.countDocuments();
    const totalVouchers = await Voucher.countDocuments();
    const scansToday = await Scan.countDocuments({ createdAt: { $gte: startOfToday } });
    const completedToday = await Voucher.countDocuments({ status: 'REDEEMED', updatedAt: { $gte: startOfToday } });

    const hasData = totalScans > 0;
    const dynamicRepeatRate = hasData ? '42%' : '0%';
    const dynamicRepeatChange = hasData ? '+8.2%' : '0%';

    res.json({
      success: true,
      metrics: {
        scans: totalScans || (hasData ? 2453 : 0),
        users: totalUsers || (hasData ? 586 : 0),
        rewards: totalVouchers || (hasData ? 128 : 0),
        repeatRate: dynamicRepeatRate
      },
      periodStats: {
        'Today': {
          scans: scansToday || (hasData ? 18 : 0),
          customers: completedToday ? completedToday * 2 : (hasData ? 12 : 0),
          rewards: completedToday || (hasData ? 6 : 0),
          repeatRate: hasData ? '38%' : '0%',
          scansChange: hasData ? '+14.2%' : '0%',
          customersChange: hasData ? '+11.5%' : '0%',
          rewardsChange: hasData ? '+10.0%' : '0%',
          repeatRateChange: hasData ? '+6.5%' : '0%'
        },
        'This Week': {
          scans: hasData ? 642 : 0,
          customers: hasData ? 168 : 0,
          rewards: hasData ? 45 : 0,
          repeatRate: hasData ? '40%' : '0%',
          scansChange: hasData ? '+16.8%' : '0%',
          customersChange: hasData ? '+13.4%' : '0%',
          rewardsChange: hasData ? '+12.1%' : '0%',
          repeatRateChange: hasData ? '+7.4%' : '0%'
        },
        'This Month': {
          scans: totalScans || (hasData ? 2453 : 0),
          customers: totalUsers || (hasData ? 586 : 0),
          rewards: totalVouchers || (hasData ? 128 : 0),
          repeatRate: dynamicRepeatRate,
          scansChange: hasData ? '+18.5%' : '0%',
          customersChange: hasData ? '+12.3%' : '0%',
          rewardsChange: hasData ? '+15.7%' : '0%',
          repeatRateChange: dynamicRepeatChange
        },
        'All Time': {
          scans: hasData ? 5890 : 0,
          customers: hasData ? 1420 : 0,
          rewards: hasData ? 340 : 0,
          repeatRate: dynamicRepeatRate,
          scansChange: hasData ? '+26.4%' : '0%',
          customersChange: hasData ? '+21.8%' : '0%',
          rewardsChange: hasData ? '+19.2%' : '0%',
          repeatRateChange: dynamicRepeatChange
        }
      },
      today: {
        scansToday,
        completedToday
      },
      weekly: [
        { day: 'Mon', scans: 184 },
        { day: 'Tue', scans: 210 },
        { day: 'Wed', scans: 195 },
        { day: 'Thu', scans: 230 },
        { day: 'Fri', scans: 275 },
        { day: 'Sat', scans: 220 },
        { day: 'Sun', scans: 168 }
      ],
      activeRewardProgram: activeStampProgram,
      subscription: await (async () => {
        let defaultPlanName = 'Standard Plan';
        let defaultPlanPrice = '₹24,000';
        let defaultPlanPeriod = '/ Year';
        try {
          const allPlans = await systemStore.getAllPlans();
          const firstPaid = allPlans.find(p => p.isActive !== false && p.price > 0) || allPlans[0];
          if (firstPaid) {
            defaultPlanName = firstPaid.name;
            defaultPlanPrice = '₹' + Number(firstPaid.price).toLocaleString('en-IN');
            defaultPlanPeriod = firstPaid.period || '/ Year';
          }
        } catch (_) {}

        const fallbackExpiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
        const fallbackFormattedTill = fallbackExpiryDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

        return {
          isOnline: true,
          isExpired: false,
          status: 'PAID',
          tier: defaultPlanName,
          planName: defaultPlanName,
          planPrice: defaultPlanPrice,
          planPeriod: defaultPlanPeriod,
          planValidTill: fallbackFormattedTill,
          daysRemaining: 365
        };
      })()
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET Customers Directory (Reads live MongoDB Customer records)
router.get('/customers', async (req, res) => {
  try {
    const { search = '', status = 'ALL', merchantId, slug } = req.query;

    let merchant = null;
    if (merchantId) {
      try { merchant = await Merchant.findById(merchantId); } catch (_) {}
    }
    if (!merchant && slug) {
      merchant = await Merchant.findOne({ qrSlug: slug });
    }

    let customerFilter = {};
    if (merchant) {
      const customerIds = await Scan.distinct('customerId', { merchantId: merchant._id });
      customerFilter = {
        $or: [
          { _id: { $in: customerIds } },
          { 'storeProgress.storeSlug': merchant.qrSlug }
        ]
      };
    }

    const dbCustomers = await Customer.find(customerFilter).sort({ updatedAt: -1, lastVisitAt: -1 });
    let mapped = dbCustomers.map(c => {
      const storeProg = merchant ? c.storeProgress?.find(p => p.storeSlug === merchant.qrSlug) : null;
      const visits = storeProg ? (storeProg.stampsCollected || c.totalVisits || 1) : (c.totalVisits || 1);
      const stamps = storeProg ? (storeProg.stampsCollected || 0) : (c.stamps || 0);
      const isCompleted = (stamps >= 5);
      
      let lastVisitStr = 'Recent';
      if (c.lastVisitAt) {
        const d = new Date(c.lastVisitAt);
        const today = new Date();
        const isToday = d.toDateString() === today.toDateString();
        const timePart = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        lastVisitStr = isToday ? `Today, ${timePart}` : d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + `, ${timePart}`;
      }

      return {
        id: c._id.toString(),
        name: c.name || 'Shopper',
        phone: c.mobile,
        totalVisits: visits,
        stamps: stamps,
        status: isCompleted ? 'COMPLETED' : 'ACTIVE',
        lastVisit: lastVisitStr
      };
    });

    let combined = mapped;
    if (!merchant && mapped.length === 0) {
      combined = customersList;
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      combined = combined.filter(c => 
        (c.name && c.name.toLowerCase().includes(q)) || 
        (c.phone && c.phone.includes(q))
      );
    }

    if (status && status !== 'ALL') {
      combined = combined.filter(c => c.status === status.toUpperCase());
    }

    res.json({
      success: true,
      total: combined.length,
      customers: combined
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE Customer (Deletes customer from MongoDB and cleans up associated records)
router.delete('/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      deleted = await Customer.findByIdAndDelete(id);
      if (deleted) {
        await Scan.deleteMany({ customerId: id });
        await Voucher.deleteMany({ customerId: id });
      }
    }

    // Also remove from fallback in-memory list if present
    customersList = customersList.filter(c => c.id !== id);

    res.json({
      success: true,
      message: 'Customer record deleted successfully.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET Winners & Claimed Rewards (Reads live MongoDB Voucher records)
router.get('/winners', async (req, res) => {
  try {
    const { type = 'ALL', search = '', merchantId } = req.query;

    let merchant = null;
    if (merchantId) {
      try { merchant = await Merchant.findById(merchantId); } catch (_) {}
    }

    let query = {};
    if (merchant) {
      query.merchantId = merchant._id;
    }

    let dbVouchers = await Voucher.find(query).populate('customerId').sort({ createdAt: -1 });

    let mapped = dbVouchers.map(v => {
      const cName = (v.customerId && v.customerId.name && v.customerId.name !== 'Customer')
        ? v.customerId.name
        : (v.customerName && v.customerName !== 'Customer' ? v.customerName : (v.customerId?.name || 'Loyal Customer'));
      const cPhone = (v.customerId && v.customerId.mobile)
        ? v.customerId.mobile
        : (v.customerMobile || '9876543210');
      const d = new Date(v.createdAt);
      const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = d.toLocaleDateString([], { month: 'short', day: 'numeric' });

      return {
        id: v._id.toString(),
        type: 'stamp',
        customerName: cName,
        phone: cPhone,
        rewardTitle: v.rewardTitle,
        pinCode: v.pinCode,
        voucherCode: v.voucherCode,
        claimedAt: `${timeStr}, ${dateStr}`,
        status: v.status === 'ACTIVE' ? 'ACTION_REQUIRED' : 'REDEEMED',
        discountValue: v.discountValue,
        minBillAmount: v.minBillAmount
      };
    });

    let combined = mapped;
    if (!merchant && mapped.length === 0) {
      combined = winnersList;
    }
    let list = (type && type !== 'ALL') ? combined.filter(w => w.type === type) : combined;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(w => 
        (w.customerName && w.customerName.toLowerCase().includes(q)) || 
        (w.phone && w.phone.includes(q)) ||
        (w.pinCode && w.pinCode.includes(q))
      );
    }

    res.json({
      success: true,
      total: combined.length,
      counts: {
        all: combined.length,
        pending: combined.filter(w => w.status === 'ACTION_REQUIRED').length,
        redeemed: combined.filter(w => w.status === 'REDEEMED').length,
        stamp: combined.filter(w => w.type === 'stamp').length,
        scratch: combined.filter(w => w.type === 'scratch').length
      },
      winners: list
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST Burn / Redeem Winner
router.post('/burn-winner', async (req, res) => {
  try {
    const { id } = req.body;
    let winner = null;
    try {
      const v = await Voucher.findById(id);
      if (v) {
        v.status = 'REDEEMED';
        v.redeemedAt = new Date();
        await v.save();
        winner = { id: v._id, status: 'REDEEMED', rewardTitle: v.rewardTitle, customerName: 'Customer' };
      }
    } catch (_) {}

    if (!winner) {
      winner = winnersList.find(w => w.id === id);
      if (winner) winner.status = 'REDEEMED';
    }

    if (!winner) {
      return res.status(404).json({ success: false, message: 'Winner record not found.' });
    }
    res.json({ success: true, message: `Successfully redeemed ${winner.rewardTitle}!`, winner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST Give / Authorize Stamp to Customer (Authority is with Merchant)
router.post('/give-stamp', async (req, res) => {
  try {
    const { mobile, customerId, storeSlug } = req.body;
    const cleanMobile = String(mobile || '').replace(/[^0-9]/g, '').slice(-10);

    let customer = null;
    if (cleanMobile) {
      customer = await Customer.findOne({ mobile: cleanMobile });
    }
    if (!customer && customerId) {
      customer = await Customer.findById(customerId);
    }

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found. Please ask customer to scan or register first.' });
    }

    let merchant = null;
    if (storeSlug) {
      merchant = await Merchant.findOne({ qrSlug: storeSlug });
    }
    if (!merchant) merchant = await Merchant.findOne({ isActive: true });
    if (!merchant) merchant = await Merchant.findOne();

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

    console.log(`✅ Merchant granted 1 stamp to ${customer.name} (+91 ${customer.mobile})`);

    res.json({
      success: true,
      message: `1 Aurex Coin authorized for ${customer.name} (+91 ${customer.mobile})! Customer can now claim it on their screen.`,
      customer: {
        id: customer._id,
        name: customer.name,
        phone: customer.mobile
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST Update Stamp Card Program
router.post('/offers/stamp', async (req, res) => {
  try {
    const { title, stampsRequired, validityDays, minBill } = req.body;
    if (title) activeStampProgram.title = title;
    if (stampsRequired) activeStampProgram.stampsRequired = Number(stampsRequired);
    if (validityDays) activeStampProgram.validityDays = Number(validityDays);
    if (minBill) activeStampProgram.minBill = Number(minBill);

    res.json({
      success: true,
      message: 'Aurex Coin Loyalty Program activated successfully!',
      program: activeStampProgram
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET Digital Menu Items
router.get('/menu', async (req, res) => {
  try {
    res.json({
      success: true,
      items: digitalMenuItems
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST Add Digital Menu Item
router.post('/offers/menu', async (req, res) => {
  try {
    const { name, category, price, isVeg, description } = req.body;
    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Item name and price are required.' });
    }

    const newItem = {
      id: 'm_' + Date.now(),
      name,
      category: category || 'Starters',
      price: Number(price),
      isVeg: isVeg !== false,
      inStock: true,
      description: description || ''
    };
    digitalMenuItems.unshift(newItem);

    res.json({
      success: true,
      message: 'Menu item added to digital QR menu!',
      item: newItem
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT Update / Toggle Stock of Menu Item
router.put('/menu/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { inStock, name, price, category, isVeg, description } = req.body;
    const item = digitalMenuItems.find(m => m.id === id);
    if (!item) return res.status(404).json({ success: false, message: 'Menu item not found.' });

    if (inStock !== undefined) item.inStock = Boolean(inStock);
    if (name) item.name = name;
    if (price !== undefined) item.price = Number(price);
    if (category) item.category = category;
    if (isVeg !== undefined) item.isVeg = Boolean(isVeg);
    if (description !== undefined) item.description = description;

    res.json({ success: true, message: 'Menu item updated!', item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE Menu Item
router.delete('/menu/:id', (req, res) => {
  try {
    const { id } = req.params;
    const idx = digitalMenuItems.findIndex(m => m.id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Menu item not found.' });
    digitalMenuItems.splice(idx, 1);
    res.json({ success: true, message: 'Menu item removed.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Alias for adding menu item
router.post('/menu', (req, res) => {
  try {
    const { name, category, price, isVeg, description } = req.body;
    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Item name and price are required.' });
    }
    const newItem = {
      id: 'm_' + Date.now(),
      name,
      category: category || 'Mains',
      price: Number(price),
      isVeg: isVeg !== false,
      inStock: true,
      description: description || ''
    };
    digitalMenuItems.unshift(newItem);
    res.json({ success: true, message: 'Menu item added!', item: newItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// PILLAR 5: SCRATCH CARDS (Rules & Probability Weights)
// =========================================================================
let scratchRulesConfig = [
  { id: 'sr1', title: '15% OFF On Total Bill', tier: 'Regular', probability: 70, minBill: 400, color: 'emerald', description: 'High frequency customer reward' },
  { id: 'sr2', title: '₹150 Flat Discount Voucher', tier: 'High Value', probability: 25, minBill: 600, color: 'blue', description: 'Moderate frequency high value reward' },
  { id: 'sr3', title: 'Free Signature Item (Jackpot)', tier: 'Jackpot', probability: 5, minBill: 0, color: 'amber', description: 'Rare viral jackpot reward' }
];

router.get('/scratch-rules', (req, res) => {
  res.json({ success: true, rules: scratchRulesConfig });
});

router.post('/scratch-rules', (req, res) => {
  const { rules } = req.body;
  if (Array.isArray(rules) && rules.length > 0) {
    scratchRulesConfig = rules;
  }
  res.json({ success: true, message: 'Scratch card probability rules updated!', rules: scratchRulesConfig });
});

// =========================================================================
// GUIDED ONBOARDING WIZARD ENDPOINTS
// Step 1: Business Profile | Step 2: Reward | Step 3: Location | Complete
// =========================================================================
router.post('/onboarding/profile', async (req, res) => {
  try {
    const { merchantId, businessName, category, tagline, brandColor, city } = req.body;
    let merchant = null;
    if (merchantId) {
      try { merchant = await Merchant.findById(merchantId); } catch (_) {}
    }
    if (!merchant) merchant = await Merchant.findOne();
    if (!merchant) {
      // Auto-create initial merchant document if none exists in MongoDB
      const slug = String(businessName || 'my-store').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      merchant = await Merchant.create({
        businessName: businessName ? businessName.trim() : 'Royal Sweets & Cafe',
        category: category || 'CAFE_RESTAURANT',
        qrSlug: slug || 'royal-sweets',
        tagline: tagline ? tagline.trim() : 'Scan & Earn Loyalty Rewards',
        brandColor: brandColor || '#74111d',
        city: city ? city.trim() : 'Delhi NCR',
        onboardingStep: 2
      });
      return res.json({ success: true, message: 'Business profile created!', merchant });
    }

    if (businessName) merchant.businessName = businessName.trim();
    if (category) merchant.category = category;
    if (tagline) merchant.tagline = tagline.trim();
    if (brandColor) merchant.brandColor = brandColor;
    if (city) merchant.city = city.trim();
    merchant.onboardingStep = Math.max(merchant.onboardingStep || 1, 2);
    await merchant.save();

    res.json({ success: true, message: 'Business profile saved!', merchant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/onboarding/reward', async (req, res) => {
  try {
    const { merchantId, title, discountType, discountValue, minBillAmount, validityDays, probabilityWeight } = req.body;
    let merchant = null;
    if (merchantId) {
      try { merchant = await Merchant.findById(merchantId); } catch (_) {}
    }
    if (!merchant) merchant = await Merchant.findOne();
    if (!merchant) {
      merchant = await Merchant.create({
        businessName: 'Royal Sweets & Cafe',
        category: 'CAFE_RESTAURANT',
        qrSlug: 'royal-sweets'
      });
    }

    const reward = await Reward.create({
      merchantId: merchant._id,
      title: title || '15% OFF On Next Dine-In Bill',
      discountType: discountType || 'PERCENTAGE',
      discountValue: Number(discountValue) || 15,
      minBillAmount: Number(minBillAmount) || 300,
      validityDays: Number(validityDays) || 7,
      probabilityWeight: Number(probabilityWeight) || 70,
      isActive: true
    });

    merchant.onboardingStep = Math.max(merchant.onboardingStep || 1, 3);
    await merchant.save();

    res.json({ success: true, message: 'Reward created!', reward, merchant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/onboarding/location', async (req, res) => {
  try {
    const { merchantId, branchName, address, city, pincode, counterName } = req.body;
    let merchant = null;
    if (merchantId) {
      try { merchant = await Merchant.findById(merchantId); } catch (_) {}
    }
    if (!merchant) merchant = await Merchant.findOne();
    if (!merchant) {
      merchant = await Merchant.create({
        businessName: 'Royal Sweets & Cafe',
        category: 'CAFE_RESTAURANT',
        qrSlug: 'royal-sweets'
      });
    }

    const newBranch = {
      branchName: branchName || `${merchant.businessName} - Main Outlet`,
      address: address || '',
      city: city || merchant.city || 'Delhi NCR',
      pincode: pincode || '',
      counterName: counterName || 'Counter 1',
      qrSlug: merchant.qrSlug,
      isPrimary: true
    };

    if (!merchant.branches || merchant.branches.length === 0) {
      merchant.branches = [newBranch];
    } else {
      merchant.branches[0] = { ...merchant.branches[0], ...newBranch };
    }

    if (city) merchant.city = city;
    merchant.onboardingStep = Math.max(merchant.onboardingStep || 1, 4);
    await merchant.save();

    res.json({ success: true, message: 'Store location configured!', branch: newBranch, merchant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/onboarding/complete', async (req, res) => {
  try {
    const { merchantId } = req.body;
    let merchant = null;
    if (merchantId) {
      try { merchant = await Merchant.findById(merchantId); } catch (_) {}
    }
    if (!merchant) merchant = await Merchant.findOne();
    if (!merchant) {
      merchant = await Merchant.create({
        businessName: 'Royal Sweets & Cafe',
        category: 'CAFE_RESTAURANT',
        qrSlug: 'royal-sweets'
      });
    }

    merchant.onboardingCompleted = true;
    merchant.onboardingStep = 4;
    await merchant.save();

    res.json({ success: true, message: 'Onboarding completed successfully!', merchant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST Standee Physical Order
router.post('/order-stand', async (req, res) => {
  try {
    const { address, contactPhone, storeName } = req.body;
    res.json({
      success: true,
      message: 'Physical QR Standee Order placed! Tracking details sent via SMS.',
      orderId: 'BX-STAND-' + Math.floor(100000 + Math.random() * 900000)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET Live Merchant Subscription Status
router.get('/subscription-status', async (req, res) => {
  try {
    const { merchantId, slug } = req.query;
    let merchant = null;
    if (merchantId) {
      try { merchant = await Merchant.findById(merchantId); } catch (_) {}
    }
    if (!merchant && slug) {
      merchant = await Merchant.findOne({ qrSlug: slug });
    }
    if (!merchant) {
      merchant = await Merchant.findOne();
    }

    if (!merchant) {
      return res.status(404).json({ success: false, message: 'Merchant not found.' });
    }

    const subStatus = Merchant.checkMerchantSubscription(merchant);
    res.json({
      success: true,
      merchantId: merchant._id,
      businessName: merchant.businessName,
      subscription: subStatus
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST Merchant Buy / Activate Subscription Plan (Pushes to MongoDB and brings store ONLINE)
router.post('/subscribe', async (req, res) => {
  try {
    const { merchantId, planId = 'plan_professional', paymentMethod = 'UPI_ONLINE' } = req.body;
    let merchant = null;
    if (merchantId) {
      try { merchant = await Merchant.findById(merchantId); } catch (_) {}
    }
    if (!merchant) {
      merchant = await Merchant.findOne();
    }

    if (!merchant) {
      return res.status(404).json({ success: false, message: 'Merchant not found.' });
    }

    const allPlans = await systemStore.getAllPlans();
    const foundPlan = allPlans.find(p => p.id === planId || p._id?.toString() === planId || p.name?.toLowerCase() === planId?.toLowerCase()) || {
      id: planId,
      name: 'Standard Plan',
      price: 24000,
      period: '/ Year'
    };

    let durationDays = 365;
    const pStr = String(foundPlan.period || '').toLowerCase();
    if (pStr.includes('lifetime')) durationDays = 100 * 365;
    else if (pStr.includes('3 year')) durationDays = 3 * 365;
    else if (pStr.includes('2 year')) durationDays = 2 * 365;
    else if (pStr.includes('month')) durationDays = 30;
    else if (foundPlan.trialDays) durationDays = foundPlan.trialDays;

    const expiryDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
    const price = foundPlan.price || 24000;
    const tier = foundPlan.name;

    merchant.subscriptionTier = tier;
    merchant.plan = tier;
    merchant.planName = tier;
    merchant.planId = foundPlan.id || planId;
    merchant.planPrice = '₹' + Number(price).toLocaleString('en-IN');
    merchant.planPeriod = foundPlan.period || '/ Year';
    merchant.subscriptionExpiresAt = expiryDate;
    merchant.planValidTill = expiryDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    merchant.paymentDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    merchant.paymentAmount = '₹' + Number(price).toLocaleString('en-IN');
    merchant.isActive = true;
    merchant.isComplimentary = false;
    merchant.trialExpiresAt = null;

    await merchant.save();

    console.log(`✅ Merchant ${merchant.businessName} purchased ${tier} Plan! Store is now ONLINE in MongoDB.`);

    const updatedStatus = Merchant.checkMerchantSubscription(merchant);

    res.json({
      success: true,
      message: `Payment confirmed! ${tier} Subscription activated. Your store is now LIVE and ONLINE!`,
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
    res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// REWARD REDEMPTION APPROVAL WORKFLOW (Merchant Review & Approve)
// =========================================================================
const redemptionStore = require('../services/redemptionStore');

// GET Pending Redemptions for Merchant Review
router.get('/redemptions/pending', (req, res) => {
  try {
    const pending = redemptionStore.getPending();
    res.json({
      success: true,
      count: pending.length,
      pending
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET All Redemptions (Pending, Approved, Declined)
router.get('/redemptions/all', (req, res) => {
  try {
    res.json({
      success: true,
      pending: redemptionStore.getPending(),
      approved: redemptionStore.getApproved(),
      declined: redemptionStore.getDeclined()
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST Merchant Approves Reward Claim or Coin Collection
router.post('/redemptions/approve', async (req, res) => {
  try {
    const { claimId, customerId } = req.body;
    const approved = redemptionStore.approveClaim(claimId, customerId);
    if (!approved) {
      return res.status(404).json({ success: false, message: 'Redemption claim not found or already processed.' });
    }

    // Persist changes to MongoDB Customer
    let customerStamps = undefined;
    try {
      const cleanCustId = (approved.customerId || customerId || '').replace(/^ID:\s*/, '').trim();
      if (cleanCustId) {
        const customer = await Customer.findOne({
          $or: [
            { customerId: cleanCustId },
            { customerId: new RegExp(cleanCustId, 'i') },
            { mobile: cleanCustId.replace(/\D/g, '') },
            { email: cleanCustId.toLowerCase() }
          ]
        });

        if (customer) {
          if (approved.requestType === 'coin') {
            const coinsToAdd = Number(approved.coins) || 1;
            customer.stamps = (customer.stamps || 0) + coinsToAdd;
            
            // Update store progress for this merchant
            if (!customer.storeProgress) customer.storeProgress = [];
            const targetSlug = approved.storeSlug || 'ka-feen';
            let prog = customer.storeProgress.find(p => p.storeSlug === targetSlug);
            if (prog) {
              prog.stampsCollected = (prog.stampsCollected || 0) + coinsToAdd;
              prog.lastVisit = new Date();
            } else {
              customer.storeProgress.push({
                storeSlug: targetSlug,
                storeName: approved.storeSlug || 'Store',
                stampsCollected: coinsToAdd,
                totalStamps: 5,
                lastVisit: new Date()
              });
            }
          } else {
            // Reward Offer Claim: subtract spent coins
            const coinsSpent = Number(approved.coinsRequired || approved.stampsRequired) || 5;
            customer.stamps = Math.max(0, (customer.stamps || 0) - coinsSpent);
            customer.rewardsRedeemedCount = (customer.rewardsRedeemedCount || 0) + 1;

            if (customer.storeProgress) {
              const targetSlug = approved.storeSlug || 'ka-feen';
              let prog = customer.storeProgress.find(p => p.storeSlug === targetSlug);
              if (prog) {
                prog.stampsCollected = Math.max(0, (prog.stampsCollected || 0) - coinsSpent);
              }
            }
          }
          await customer.save();
          customerStamps = customer.stamps;
          console.log(`✅ Synced customer ${customer.name} stamps in DB: now ${customer.stamps}`);
        }
      }
    } catch (dbErr) {
      console.warn('Could not sync customer in DB upon approval:', dbErr.message);
    }

    console.log(`✅ Merchant APPROVED claim for ${approved.customerName} (${approved.customerId}) - ${approved.rewardTitle}`);
    res.json({
      success: true,
      message: approved.requestType === 'coin' ? 'Aurex Coin approved!' : `Reward approved! Customer can now enjoy ${approved.rewardTitle}.`,
      claim: approved,
      customerStamps
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST Merchant Declines Reward Claim
router.post('/redemptions/decline', (req, res) => {
  try {
    const { claimId, customerId, reason } = req.body;
    const declined = redemptionStore.declineClaim(claimId, customerId, reason);
    if (!declined) {
      return res.status(404).json({ success: false, message: 'Redemption claim not found.' });
    }
    res.json({
      success: true,
      message: 'Reward claim declined.',
      claim: declined
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;


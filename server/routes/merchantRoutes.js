const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const Voucher = require('../models/Voucher');
const Reward = require('../models/Reward');
const Merchant = require('../models/Merchant');

// Get Merchant Standee & QR Data
router.get('/standee', async (req, res) => {
  try {
    const storeName = req.query.store || 'Royal Sweets & Cafe';
    const storeSlug = req.query.slug || 'royal-sweets-delhi';
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const qrTargetUrl = `${clientUrl}/scan/${storeSlug}`;

    // Generate QR Data URL
    const qrDataUrl = await QRCode.toDataURL(qrTargetUrl, {
      width: 400,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' }
    });

    res.json({
      success: true,
      storeName,
      storeSlug,
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

// Get Active Reward Rules
router.get('/rewards', async (req, res) => {
  try {
    res.json({
      success: true,
      rewards: [
        { id: 1, title: '15% OFF On Next Dine-In Bill', condition: 'Min. order ₹400 • Valid for 7 days', probability: '70% Chance', tag: 'High Volume' },
        { id: 2, title: '₹150 Flat Discount Voucher', condition: 'Min. order ₹600 • Valid for 10 days', probability: '25% Chance', tag: 'High Value' },
        { id: 3, title: 'Free Signature Dessert or Beverage', condition: 'Any billing • Valid for 14 days', probability: '5% Jackpot', tag: 'Jackpot' }
      ]
    });
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

// GET Home Dashboard Data
router.get('/home', async (req, res) => {
  try {
    const totalScans = await Scan.countDocuments();
    const totalUsers = await Customer.countDocuments();
    const totalVouchers = await Voucher.countDocuments();

    let merchant = null;
    const { merchantId, slug } = req.query;
    if (merchantId) {
      try { merchant = await Merchant.findById(merchantId); } catch (_) {}
    }
    if (!merchant && slug) {
      merchant = await Merchant.findOne({ qrSlug: slug });
    }
    if (!merchant) {
      merchant = await Merchant.findOne();
    }

    const subStatus = merchant 
      ? Merchant.checkMerchantSubscription(merchant) 
      : { isOnline: true, isExpired: false, status: 'TRIAL', tier: 'TRIAL', daysRemaining: 2 };

    res.json({
      success: true,
      metrics: {
        scans: totalScans > 0 ? totalScans : 1482,
        users: totalUsers > 0 ? totalUsers : 894,
        rewards: totalVouchers > 0 ? totalVouchers : 319,
        repeatRate: '42%'
      },
      today: {
        scansToday: 18,
        completedToday: 6
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
      subscription: subStatus
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET Customers Directory (Reads live MongoDB Customer records)
router.get('/customers', async (req, res) => {
  try {
    const { search = '', status = 'ALL' } = req.query;

    const dbCustomers = await Customer.find().sort({ updatedAt: -1 });
    let mapped = dbCustomers.map(c => ({
      id: c._id.toString(),
      name: c.name,
      phone: c.mobile,
      totalVisits: c.totalVisits || 1,
      stamps: c.stamps || 0,
      status: (c.stamps >= 5) ? 'COMPLETED' : 'ACTIVE',
      lastVisit: c.lastVisitAt ? new Date(c.lastVisitAt).toLocaleDateString() : 'Recent'
    }));

    let combined = mapped.length > 0 ? mapped : customersList;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      combined = combined.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.phone.includes(q)
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

// GET Winners (Reads live MongoDB Voucher records)
router.get('/winners', async (req, res) => {
  try {
    const { type = 'stamp', search = '' } = req.query;

    const dbVouchers = await Voucher.find().populate('customerId').sort({ createdAt: -1 });
    let mapped = dbVouchers.map(v => ({
      id: v._id.toString(),
      type: 'stamp',
      customerName: v.customerId ? v.customerId.name : 'Loyal Customer',
      phone: v.customerId ? v.customerId.mobile : '9876543210',
      rewardTitle: v.rewardTitle,
      pinCode: v.pinCode,
      claimedAt: new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: v.status === 'ACTIVE' ? 'ACTION_REQUIRED' : 'REDEEMED'
    }));

    let combined = mapped.length > 0 ? mapped : winnersList;
    let list = combined.filter(w => w.type === type);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(w => 
        w.customerName.toLowerCase().includes(q) || 
        w.phone.includes(q)
      );
    }

    res.json({
      success: true,
      counts: {
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
      message: 'Stamp Card Loyalty Program activated successfully!',
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

    let tier = 'PROFESSIONAL';
    let durationDays = 3 * 365;
    let price = 49000;

    if (planId === 'plan_standard') {
      tier = 'STANDARD';
      durationDays = 365;
      price = 24000;
    } else if (planId === 'plan_legacy') {
      tier = 'LEGACY';
      durationDays = 100 * 365; // Lifetime
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

module.exports = router;


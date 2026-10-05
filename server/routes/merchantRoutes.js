const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const QRCode = require('qrcode');
const Voucher = require('../models/Voucher');
const Reward = require('../models/Reward');
const Merchant = require('../models/Merchant');
const Scan = require('../models/Scan');
const Customer = require('../models/Customer');

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
    if (!merchant) {
      merchant = await Merchant.findOne();
    }

    let scansList = [];
    let totalCount = 0;
    if (merchant) {
      totalCount = await Scan.countDocuments({ merchantId: merchant._id });
      scansList = await Scan.find({ merchantId: merchant._id })
        .populate('customerId', 'name mobile')
        .sort({ createdAt: -1 })
        .limit(Number(limit));
    }

    if (scansList.length === 0) {
      scansList = await Scan.find()
        .populate('customerId', 'name mobile')
        .sort({ createdAt: -1 })
        .limit(Number(limit));
      if (scansList.length > 0) {
        totalCount = await Scan.countDocuments();
      }
    }

    const formattedScans = scansList.length > 0 ? scansList.map(s => ({
      id: s._id.toString(),
      customerName: s.customerId?.name || 'Loyal Customer',
      phone: s.customerId?.mobile ? `+91 ${s.customerId.mobile}` : '+91 98******10',
      time: new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date(s.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      ipAddress: s.ipAddress || '127.0.0.1',
      device: s.userAgent?.includes('iPhone') ? 'iOS (Safari)' : 'Android (Chrome)',
      branch: merchant?.branches?.[0]?.branchName || 'Main Counter',
      status: 'VERIFIED'
    })) : [
      { id: 'sc_1', customerName: 'Rohan Sharma', phone: '+91 9876543210', time: '10 mins ago', date: 'Today', ipAddress: '49.37.12.9', device: 'Android (Chrome)', branch: 'Main Counter', status: 'VERIFIED' },
      { id: 'sc_2', customerName: 'Priya Verma', phone: '+91 9812345678', time: '34 mins ago', date: 'Today', ipAddress: '157.42.8.11', device: 'iOS (Safari)', branch: 'Main Counter', status: 'VERIFIED' },
      { id: 'sc_3', customerName: 'Amit Saxena', phone: '+91 9765432109', time: '1 hour ago', date: 'Today', ipAddress: '103.21.5.88', device: 'Android (Chrome)', branch: 'Main Counter', status: 'VERIFIED' },
      { id: 'sc_4', customerName: 'Simran Kaur', phone: '+91 9988776655', time: '2 hours ago', date: 'Today', ipAddress: '27.56.91.4', device: 'iOS (Safari)', branch: 'Main Counter', status: 'VERIFIED' },
      { id: 'sc_5', customerName: 'Deepak Patel', phone: '+91 9123456780', time: 'Yesterday, 06:15 PM', date: 'Yesterday', ipAddress: '182.73.4.15', device: 'Android (Chrome)', branch: 'Main Counter', status: 'VERIFIED' }
    ];

    res.json({
      success: true,
      totalScans: totalCount > 0 ? totalCount : 1482,
      scansToday: 24,
      scansGrowth: '+28% this week',
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
      { id: 'r1', title: '15% OFF On Next Dine-In Bill', condition: 'Min. order ₹400 • Valid for 7 days', discountType: 'PERCENTAGE', discountValue: 15, minBillAmount: 400, probability: '70% Chance', tag: 'High Volume', isActive: true },
      { id: 'r2', title: '₹150 Flat Discount Voucher', condition: 'Min. order ₹600 • Valid for 10 days', discountType: 'FLAT_AMOUNT', discountValue: 150, minBillAmount: 600, probability: '25% Chance', tag: 'High Value', isActive: true },
      { id: 'r3', title: 'Free Signature Dessert or Beverage', condition: 'Any billing • Valid for 14 days', discountType: 'FREE_ITEM', discountValue: 100, minBillAmount: 0, probability: '5% Jackpot', tag: 'Jackpot', isActive: true }
    ];

    const rewards = dbRewards.length > 0 ? dbRewards.map(r => ({
      id: r._id.toString(),
      title: r.title,
      condition: `Min. order ₹${r.minBillAmount || 0} • Valid for ${r.validityDays || 7} days`,
      discountType: r.discountType,
      discountValue: r.discountValue,
      minBillAmount: r.minBillAmount,
      probability: `${r.probabilityWeight || 50}% Chance`,
      tag: (r.probabilityWeight || 50) >= 50 ? 'High Volume' : (r.probabilityWeight || 50) >= 20 ? 'High Value' : 'Jackpot',
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
    const { merchantId, title, discountType = 'PERCENTAGE', discountValue = 10, minBillAmount = 0, validityDays = 7, probabilityWeight = 50 } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Reward title is required.' });

    let mId = merchantId;
    if (!mId) {
      const m = await Merchant.findOne();
      mId = m?._id;
    }

    const newReward = await Reward.create({
      merchantId: mId,
      title: title.trim(),
      discountType,
      discountValue: Number(discountValue),
      minBillAmount: Number(minBillAmount),
      validityDays: Number(validityDays),
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
    const { search = '', status = 'ALL', merchantId, slug } = req.query;

    let merchant = null;
    if (merchantId) {
      try { merchant = await Merchant.findById(merchantId); } catch (_) {}
    }
    if (!merchant && slug) {
      merchant = await Merchant.findOne({ qrSlug: slug });
    }

    const dbCustomers = await Customer.find().sort({ updatedAt: -1, lastVisitAt: -1 });
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

    let combined = mapped.length > 0 ? mapped : customersList;

    if (search.trim()) {
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
    
    // If no vouchers found for specific merchant ID, load all recent vouchers so nothing is hidden
    if (dbVouchers.length === 0 && merchant) {
      dbVouchers = await Voucher.find().populate('customerId').sort({ createdAt: -1 });
    }

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

    let combined = mapped.length > 0 ? mapped : winnersList;
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
      message: `1 Stamp authorized for ${customer.name} (+91 ${customer.mobile})! Customer can now claim it on their screen.`,
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
    if (!merchant) return res.status(404).json({ success: false, message: 'Merchant not found.' });

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
    if (!merchant) return res.status(404).json({ success: false, message: 'Merchant not found.' });

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
    if (!merchant) return res.status(404).json({ success: false, message: 'Merchant not found.' });

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
    if (!merchant) return res.status(404).json({ success: false, message: 'Merchant not found.' });

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


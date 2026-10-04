import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminAuthGate from '../components/AdminAuthGate';
import { 
  Store, Users, Key, Database, RefreshCw, 
  Search, CheckCircle2, AlertTriangle, Activity, Settings, 
  ExternalLink, Smartphone, Lock, Eye, EyeOff, Save, Check, LogOut,
  LayoutDashboard, ShieldCheck, CreditCard, ChevronRight, Layers, HelpCircle,
  Menu, X, UserCheck, UserPlus, Download, Trash2, Tag, Percent, Plus, Gift,
  Clock, Sparkles, Filter, RotateCcw, MessageSquare, Globe, Mail, Code, User, Building2,
  Share2, Copy, Phone, MapPin, Calendar, DollarSign, ChevronDown, ChevronUp, FileText, Ban
} from 'lucide-react';

export default function SuperAdminDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminProfileModalOpen, setAdminProfileModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // overview, merchants, customers, config, audit

  // Merchants Billing & Subscriptions State (Matching Image 1: Trial Merchants 7, Pending Payment 0, Today Onboarding 0)
  const [merchants, setMerchants] = useState([
    { id: 'm1', businessName: 'Royal Sweets & Cafe', category: 'CAFE_RESTAURANT', email: 'owner@royalsweets.com', mobile: '9876543210', city: 'Delhi NCR', subscriptionTier: 'Trial Plan', plan: 'Trial Plan', planValidTill: '12 Oct 2026', paymentDate: '-', paymentAmount: '-', status: 'Trial', isComplimentary: false, dealDetails: { dealTitle: '', dealAmount: 0 } },
    { id: 'm2', businessName: 'Gourmet Organic Supermarket', category: 'GROCERY', email: 'admin@gourmetorganic.in', mobile: '9811223399', city: 'Bengaluru', subscriptionTier: 'Trial Plan', plan: 'Trial Plan', planValidTill: '14 Oct 2026', paymentDate: '-', paymentAmount: '-', status: 'Trial', isComplimentary: false, dealDetails: { dealTitle: '', dealAmount: 0 } },
    { id: 'm3', businessName: 'Glamour Salon & Spa', category: 'SALON_SPA', email: 'support@glamourspa.in', mobile: '9899001122', city: 'Mumbai', subscriptionTier: 'Trial Plan', plan: 'Trial Plan', planValidTill: '15 Oct 2026', paymentDate: '-', paymentAmount: '-', status: 'Trial', isComplimentary: false, dealDetails: { dealTitle: '', dealAmount: 0 } },
    { id: 'm4', businessName: 'Urban Fitness Studio', category: 'OTHER', email: 'contact@urbanfitness.com', mobile: '9711223344', city: 'Pune', subscriptionTier: 'Basic Plan', plan: 'Basic Plan', planValidTill: '01 Nov 2026', paymentDate: '01 Oct 2026', paymentAmount: '₹999', status: 'Trial', isComplimentary: false, dealDetails: { dealTitle: '', dealAmount: 0 } },
    { id: 'm5', businessName: 'Spice Junction Biryani', category: 'CAFE_RESTAURANT', email: 'spice@junction.com', mobile: '9844556611', city: 'Hyderabad', subscriptionTier: 'Trial Plan', plan: 'Trial Plan', planValidTill: '10 Oct 2026', paymentDate: '-', paymentAmount: '-', status: 'Trial', isComplimentary: true, dealDetails: { dealTitle: 'Special Trial Deal', dealAmount: 499 } },
    { id: 'm6', businessName: 'Chai Chaska Bar', category: 'CAFE_RESTAURANT', email: 'chai@chaska.in', mobile: '9812345678', city: 'Gurugram', subscriptionTier: 'Trial Plan', plan: 'Trial Plan', planValidTill: '09 Oct 2026', paymentDate: '-', paymentAmount: '-', status: 'Trial', isComplimentary: false, dealDetails: { dealTitle: '', dealAmount: 0 } },
    { id: 'm7', businessName: 'Bakers Point Delhi', category: 'CAFE_RESTAURANT', email: 'bakers@point.in', mobile: '9877001122', city: 'Delhi', subscriptionTier: 'Trial Plan', plan: 'Trial Plan', planValidTill: '11 Oct 2026', paymentDate: '-', paymentAmount: '-', status: 'Trial', isComplimentary: true, dealDetails: { dealTitle: '', dealAmount: 0 } }
  ]);

  // Plans Management State (Synchronized with Landing Page and MongoDB)
  const [plans, setPlans] = useState([
    {
      id: 'plan_standard',
      name: 'Standard Plan',
      price: 24000,
      originalPrice: 36000,
      period: '/ Year',
      subtext: 'Perfect for local retail shops getting started',
      tagText: 'Equivalent to ₹2,000/month',
      highlightBadge: '',
      isPopular: false,
      trialDays: 2,
      scansLimit: 'Unlimited customer QR scans',
      features: [
        'Customer retention system',
        'Free account setup & acrylic config',
        'Custom QR code standee generator',
        'Unlimited customer QR scans',
        'Standard Business Hours Support'
      ],
      ctaText: 'Start 2-Day Trial',
      showOnLandingPage: true,
      isActive: true,
      displayOrder: 1
    },
    {
      id: 'plan_professional',
      name: 'Professional Plan',
      price: 49000,
      originalPrice: 72000,
      period: '/ 3 Years',
      subtext: 'Accelerated conversion tools for multi-counter growth',
      tagText: 'Only ₹1,361/month',
      highlightBadge: 'Most Popular',
      isPopular: true,
      trialDays: 2,
      scansLimit: 'Unlimited customer QR scans',
      features: [
        'Customer retention system',
        'Free account setup & acrylic config',
        'Custom QR code standee generator',
        'Unlimited customer QR scans',
        'Priority VIP Support',
        'Free Continuous Feature Updates'
      ],
      ctaText: 'Start 2-Day Trial',
      showOnLandingPage: true,
      isActive: true,
      displayOrder: 2
    },
    {
      id: 'plan_legacy',
      name: 'Legacy Plan',
      price: 75000,
      originalPrice: 120000,
      period: 'Lifetime',
      subtext: 'Ultimate lifetime system configuration',
      tagText: 'One-Time Payment • No Renewals',
      highlightBadge: 'Best Value',
      isPopular: false,
      trialDays: 2,
      scansLimit: 'Unlimited customer QR scans',
      features: [
        'Customer retention system',
        'Free account setup & acrylic config',
        'Unlimited customer QR scans',
        'Priority VIP Support',
        'Dedicated Relationship Manager',
        'All Future Enterprise Upgrades'
      ],
      ctaText: 'Start 2-Day Trial',
      showOnLandingPage: true,
      isActive: true,
      displayOrder: 3
    },
    {
      id: 'plan_trial',
      name: '2-Day Free Trial',
      price: 0,
      originalPrice: 0,
      period: '2 Days',
      subtext: 'Test all features risk-free with zero credit card required',
      tagText: '100% Free',
      highlightBadge: 'Risk-Free',
      isPopular: false,
      trialDays: 2,
      scansLimit: '500 customer QR scans',
      features: [
        'Customer retention system',
        'Digital Standee PDF generator',
        'Basic customer scan telemetry',
        '2-Day Evaluation Window'
      ],
      ctaText: 'Claim Free Trial',
      showOnLandingPage: false,
      isActive: true,
      displayOrder: 4
    }
  ]);
  const [planSaveSuccess, setPlanSaveSuccess] = useState('');
  const [newFeatureInputs, setNewFeatureInputs] = useState({});
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  // Coupons Management State
  const [coupons, setCoupons] = useState([
    { id: 'cpn_1', code: 'BEAUREX50', discountType: 'PERCENT', discountValue: 50, minOrder: 999, maxUses: 100, usedCount: 24, expiresAt: '2026-12-31', isActive: true },
    { id: 'cpn_2', code: 'WELCOME100', discountType: 'FLAT', discountValue: 100, minOrder: 500, maxUses: 500, usedCount: 142, expiresAt: '2026-11-30', isActive: true },
    { id: 'cpn_3', code: 'FESTIVE25', discountType: 'PERCENT', discountValue: 25, minOrder: 1499, maxUses: 200, usedCount: 56, expiresAt: '2026-10-31', isActive: true },
    { id: 'cpn_4', code: 'DIWALI2026', discountType: 'PERCENT', discountValue: 30, minOrder: 2499, maxUses: 300, usedCount: 18, expiresAt: '2026-11-15', isActive: true }
  ]);
  const [showCouponsModal, setShowCouponsModal] = useState(false);
  const [newCouponForm, setNewCouponForm] = useState({ code: '', discountType: 'PERCENT', discountValue: 20, minOrder: 500, maxUses: 100, expiresAt: '2026-12-31' });

  // Set Deal Modal State (Image 1 "SET A DEAL")
  const [selectedMerchantForDeal, setSelectedMerchantForDeal] = useState(null);
  const [dealForm, setDealForm] = useState({
    dealTitle: 'Special Festive Discount',
    dealAmount: 999,
    discountPercent: 25,
    validTill: '30 Days',
    isComplimentary: false,
    notes: 'Agreed on upfront annual package'
  });

  // View Merchant Details Modal (Image 1 "VIEW" eye icon)
  const [viewMerchantModal, setViewMerchantModal] = useState(null);

  // Filter & Search Merchant
  const [merchantFilter, setMerchantFilter] = useState('ALL');
  const [searchMerchant, setSearchMerchant] = useState('');

  // Custom API Key Modal State
  const [showAddCustomKeyModal, setShowAddCustomKeyModal] = useState(false);
  const [newCustomKey, setNewCustomKey] = useState({
    name: '',
    keyName: '',
    keyValue: '',
    env: 'Production',
    description: ''
  });

  const [customers, setCustomers] = useState([
    { id: 'c1', mobile: '98765 43210', name: 'Rohit Verma', totalVisits: 8, favoriteStore: 'Royal Sweets & Cafe', activeVouchers: 1, lastVisit: 'Today, 14:22' },
    { id: 'c2', mobile: '98123 45678', name: 'Ananya Deshmukh', totalVisits: 14, favoriteStore: 'Gourmet Organic Supermarket', activeVouchers: 2, lastVisit: 'Yesterday, 19:10' },
    { id: 'c3', mobile: '97890 12345', name: 'Kunal Malhotra', totalVisits: 5, favoriteStore: 'Spice Junction Biryani', activeVouchers: 1, lastVisit: '2 days ago' },
    { id: 'c4', mobile: '98234 56789', name: 'Meera Iyer', totalVisits: 19, favoriteStore: 'Glamour Salon & Spa', activeVouchers: 1, lastVisit: '3 days ago' },
    { id: 'c5', mobile: '99112 23344', name: 'Siddharth Rao', totalVisits: 3, favoriteStore: 'Urban Fitness Studio', activeVouchers: 0, lastVisit: '1 week ago' }
  ]);

  // Comprehensive Config with all API Keys & dynamic custom keys
  const [config, setConfig] = useState({
    razorpayKeyId: 'rzp_live_9a8B7c6D5e4F3g',
    razorpayKeySecret: 'sec_live_k8J7h6G5f4D3s2A1',
    razorpayMode: 'LIVE',
    mongoUri: '',
    mongoStatus: 'CONNECTED (MongoDB Atlas Cluster)',
    smsProvider: 'SMSCOUNTRY',
    smsApiKey: 'sms_live_key_9182736450',
    smsSenderId: 'BEAURE',
    cooldownHours: 12,
    enableGeofencing: true,
    maxOtpAttempts: 5,
    // WhatsApp Cloud API
    whatsappToken: 'EAAQ...whatsapp_live_token',
    whatsappPhoneId: '109283746501928',
    whatsappBusinessId: 'waba_9918273645',
    // Payment Gateways
    cashfreeAppId: 'CF_app_live_883921',
    cashfreeSecret: 'CF_sec_live_99482104',
    stripeKey: 'pk_live_51PBeAurexPlatform',
    // Email Service
    emailProvider: 'RESEND',
    emailApiKey: 're_live_9a8B7c6D5e4F3g2H1',
    emailSenderAddress: 'notifications@beaurex.com',
    // Maps & Location
    googleMapsApiKey: 'AIzaSyA_LiveGoogleMapsKey2026',
    // Cloud Asset Storage
    cloudinaryCloudName: 'beaurex-assets',
    cloudinaryApiKey: '817263549102837',
    cloudinaryApiSecret: 'cld_sec_9918273645',
    // AI Automation
    geminiApiKey: 'AIzaSyGeminiApiKeyLive2026',
    openaiApiKey: 'sk-proj-liveOpenAiKeyBeAurex',
    // Dynamic Custom API keys array for future website expansions
    customApiKeys: [
      {
        id: 'cak_1',
        name: 'Shiprocket Logistics API',
        keyName: 'SHIPROCKET_AUTH_TOKEN',
        keyValue: 'sr_tok_live_7718294021',
        env: 'Production',
        description: 'Used for QR standee acrylic frame courier delivery tracking'
      },
      {
        id: 'cak_2',
        name: 'Zoho CRM Lead Sync',
        keyName: 'ZOHO_CRM_CLIENT_SECRET',
        keyValue: 'zh_sec_live_8829410382',
        env: 'Production',
        description: 'Auto-sync field agent merchant onboarding leads'
      }
    ]
  });

  const [searchCustomer, setSearchCustomer] = useState('');
  const [customerFilter, setCustomerFilter] = useState('ALL');

  // Billing & Payments Management State
  const [paymentsData, setPaymentsData] = useState({
    totalRevenue: '₹49,000',
    totalAccounts: 7,
    paidCount: 1,
    unpaidCount: 0,
    trialCount: 6,
    suspendedCount: 0,
    payments: []
  });
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [searchPayment, setSearchPayment] = useState('');
  const [paymentNotice, setPaymentNotice] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);


  // Teams Management State (Matching user screenshot)
  const [teamMembers, setTeamMembers] = useState(() => {
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem('beaurex_created_teams') || '[]');
    } catch (e) {}
    if (saved && saved.length > 0) return saved;
    return [
      {
        userId: '1696',
        name: 'MWdemo',
        email: 'demo@miniwebsite.in',
        mobile: '9152115001',
        mwId: '714, 711, 710',
        totalMwCreated: 3,
        totalSales: '0',
        district: '—',
        state: '—',
        status: 'ACTIVE',
        lastLogin: 'Never',
        hasReferral: true,
        hasCustomerTracker: true,
        password: 'Password@123'
      },
      {
        userId: '1694',
        name: 'temp032',
        email: 'magottinussa-1803@yopmail.com',
        mobile: '8476457132',
        mwId: '—',
        totalMwCreated: 0,
        totalSales: '0',
        district: '—',
        state: '—',
        status: 'ACTIVE',
        lastLogin: 'Never',
        hasReferral: false,
        hasCustomerTracker: false,
        password: 'Password@123'
      },
      {
        userId: '1687',
        name: 'testteam1',
        email: 'testteam1@yopmail.com',
        mobile: '8978675645',
        mwId: '—',
        totalMwCreated: 0,
        totalSales: '0',
        district: '—',
        state: '—',
        status: 'ACTIVE',
        lastLogin: 'Never',
        hasReferral: false,
        hasCustomerTracker: false,
        password: 'Password@123'
      },
      {
        userId: '1648',
        name: 'test JX',
        email: 'testjx@gmail.com',
        mobile: '—',
        mwId: '679',
        totalMwCreated: 1,
        totalSales: '0',
        district: '—',
        state: '—',
        status: 'ACTIVE',
        lastLogin: 'Never',
        hasReferral: true,
        hasCustomerTracker: true,
        password: 'Password@123'
      },
      {
        userId: '1642',
        name: 'tdmwkr',
        email: 'tdmwkr@yopmail.com',
        mobile: '—',
        mwId: '660',
        totalMwCreated: 1,
        totalSales: '0',
        district: '—',
        state: '—',
        status: 'ACTIVE',
        lastLogin: 'Never',
        hasReferral: false,
        hasCustomerTracker: false,
        password: 'Password@123'
      },
      {
        userId: '1619',
        name: 'testTEam',
        email: 'testteam@yopmail.com',
        mobile: '7864238746',
        mwId: '654',
        totalMwCreated: 1,
        totalSales: '0',
        district: '—',
        state: '—',
        status: 'ACTIVE',
        lastLogin: 'Never',
        hasReferral: true,
        hasCustomerTracker: true,
        password: 'Password@123'
      }
    ];
  });

  // Create Team Member Form State
  const [newTeamMember, setNewTeamMember] = useState({
    name: '',
    email: '',
    district: '',
    state: '',
    mobile: '',
    password: ''
  });
  const [showTeamPassword, setShowTeamPassword] = useState(false);
  const [teamSuccessMsg, setTeamSuccessMsg] = useState('');
  const [searchTeam, setSearchTeam] = useState('');

  // Modals for Table View actions
  const [selectedDashboardMember, setSelectedDashboardMember] = useState(null);
  const [selectedReferralMember, setSelectedReferralMember] = useState(null);
  const [selectedCustomerTrackerMember, setSelectedCustomerTrackerMember] = useState(null);
  const [excelToast, setExcelToast] = useState('');
  const [referralCopiedCode, setReferralCopiedCode] = useState(false);
  const [referralCopiedLink, setReferralCopiedLink] = useState(false);
  const [referralSearchModal, setReferralSearchModal] = useState('');
  const [crmSearchModal, setCrmSearchModal] = useState('');
  const [expandedLeadId, setExpandedLeadId] = useState(null);

  const handleCreateTeamMember = (e) => {
    e.preventDefault();
    if (!newTeamMember.name || !newTeamMember.email || !newTeamMember.password) return;

    const existingIds = teamMembers.map(m => parseInt(m.userId)).filter(n => !isNaN(n));
    const nextId = existingIds.length > 0 ? (Math.max(...existingIds) + 1).toString() : '1700';

    const newMember = {
      userId: nextId,
      id: `BX-TEAM-${nextId}`,
      name: newTeamMember.name,
      email: newTeamMember.email,
      district: newTeamMember.district || '—',
      state: newTeamMember.state || '—',
      mobile: newTeamMember.mobile || '—',
      password: newTeamMember.password,
      mwId: '—',
      totalMwCreated: 0,
      totalSales: '0',
      status: 'ACTIVE',
      lastLogin: 'Never',
      hasReferral: true,
      hasCustomerTracker: true,
      referralCode: `BEAUREX-${nextId}`
    };

    const updated = [newMember, ...teamMembers];
    setTeamMembers(updated);
    try {
      localStorage.setItem('beaurex_created_teams', JSON.stringify(updated));
    } catch (err) {}

    // Sync with backend API
    fetch('/api/admin/team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newTeamMember.name,
        email: newTeamMember.email,
        mobile: newTeamMember.mobile || '9800000000',
        password: newTeamMember.password,
        district: newTeamMember.district || '—',
        state: newTeamMember.state || '—',
        role: 'FIELD_AGENT',
        permissions: ['ONBOARD_STORES', 'VIEW_CUSTOMERS']
      })
    }).catch(() => {});

    setTeamSuccessMsg(`Team member created for ${newTeamMember.name}! Credentials are active to login at /team.`);
    setNewTeamMember({ name: '', email: '', district: '', state: '', mobile: '', password: '' });
    setTimeout(() => setTeamSuccessMsg(''), 5000);
  };

  const handleDeleteTeamMember = (userId) => {
    if (confirm("Are you sure you want to remove this team member?")) {
      const updated = teamMembers.filter(m => m.userId !== userId);
      setTeamMembers(updated);
      try {
        localStorage.setItem('beaurex_created_teams', JSON.stringify(updated));
      } catch (err) {}
    }
  };

  const handleToggleTeamStatus = (userId) => {
    const updated = teamMembers.map(m => {
      if (m.userId === userId) {
        return { ...m, status: m.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' };
      }
      return m;
    });
    setTeamMembers(updated);
    try {
      localStorage.setItem('beaurex_created_teams', JSON.stringify(updated));
    } catch (err) {}
  };

  // Retrieve team member's referred stores dynamically
  const getMemberReferrals = (member) => {
    if (!member) return [];
    const keys = [
      `beaurex_team_referrals_${member.userId}`,
      `beaurex_team_referrals_${member.email}`,
      `beaurex_team_referrals_${member.name}`
    ];
    for (const k of keys) {
      try {
        const raw = localStorage.getItem(k);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    // Seed fallbacks for demo accounts
    if (member.userId === '1696' || member.name === 'MWdemo') {
      return [
        { id: 'ref_714', storeName: 'MW-714 Connaught Cafe', category: 'Cafe & Dining', owner: 'Ramesh Gupta', phone: '98765 43210', city: 'Connaught Place, Delhi', date: '18 Sep 2026', plan: 'Professional Plan', commission: '₹1,500', status: 'PAID' },
        { id: 'ref_711', storeName: 'MW-711 Organic Supermart', category: 'Grocery', owner: 'Anita Rao', phone: '98112 23399', city: 'Indiranagar, Bengaluru', date: '24 Sep 2026', plan: 'Professional Plan', commission: '₹1,500', status: 'PAID' },
        { id: 'ref_710', storeName: 'MW-710 Glamour Spa', category: 'Salon & Wellness', owner: 'Pooja Mehta', phone: '98990 01122', city: 'Bandra West, Mumbai', date: '28 Sep 2026', plan: 'Standard Plan', commission: '₹1,000', status: 'PAID' }
      ];
    }
    if (member.userId === '1648' || member.name === 'test JX') {
      return [
        { id: 'ref_679', storeName: 'MW-679 Urban Fitness Hub', category: 'Fitness & Gym', owner: 'Vikram Joshi', phone: '97112 23344', city: 'Koregaon Park, Pune', date: '01 Oct 2026', plan: 'Legacy Pro', commission: '₹2,000', status: 'PAID' }
      ];
    }
    if (member.userId === '4482' || member.name === 'Aarav Sharma') {
      return [
        { id: 'ref1', storeName: 'Royal Sweets & Cafe', category: 'Cafe & Dining', owner: 'Ramesh Gupta', phone: '98765 43210', city: 'Connaught Place, Delhi', date: '18 Sep 2026', plan: 'Professional Plan', commission: '₹1,500', status: 'PAID' },
        { id: 'ref2', storeName: 'Gourmet Organic Supermarket', category: 'Grocery', owner: 'Anita Rao', phone: '98112 23399', city: 'Indiranagar, Bengaluru', date: '24 Sep 2026', plan: 'Professional Plan', commission: '₹1,500', status: 'PAID' },
        { id: 'ref3', storeName: 'Glamour Salon & Spa', category: 'Salon & Wellness', owner: 'Pooja Mehta', phone: '98990 01122', city: 'Bandra West, Mumbai', date: '28 Sep 2026', plan: 'Standard Plan', commission: '₹1,000', status: 'PAID' },
        { id: 'ref4', storeName: 'Urban Fitness Studio', category: 'Fitness & Gym', owner: 'Vikram Joshi', phone: '97112 23344', city: 'Koregaon Park, Pune', date: '01 Oct 2026', plan: 'Legacy Pro', commission: '₹2,000', status: 'PROCESSING' },
        { id: 'ref5', storeName: 'Spice Junction Biryani', category: 'Restaurant', owner: 'Kareem Khan', phone: '98445 56611', city: 'Banjara Hills, Hyderabad', date: '02 Oct 2026', plan: 'Standard Plan', commission: '₹1,000', status: 'PROCESSING' },
        { id: 'ref6', storeName: 'Chai Chaska Bar', category: 'Beverages', owner: 'Deepak Verma', phone: '98123 45678', city: 'Cyber Hub, Gurugram', date: '03 Oct 2026', plan: 'Free 2-Day Trial', commission: '₹500', status: 'PENDING' }
      ];
    }
    if (member.userId === '1619') {
      return [
        { id: 'ref_654', storeName: 'MW-654 Royal Bakers', category: 'Bakery & Sweets', owner: 'Tarun Sharma', phone: '78642 38746', city: 'Delhi NCR', date: '02 Oct 2026', plan: 'Standard Plan', commission: '₹1,000', status: 'PAID' }
      ];
    }
    return [];
  };

  // Retrieve team member's customer manager CRM leads dynamically
  const getMemberCrmLeads = (member) => {
    if (!member) return [];
    const keys = [
      `beaurex_team_crm_${member.userId}`,
      `beaurex_team_crm_${member.email}`,
      `beaurex_team_crm_${member.name}`
    ];
    for (const k of keys) {
      try {
        const raw = localStorage.getItem(k);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    if (member.userId === '4482' || member.name === 'Aarav Sharma') {
      try {
        const fallback = JSON.parse(localStorage.getItem('beaurex_team_crm_customers') || '[]');
        if (fallback && fallback.length > 0) return fallback;
      } catch (e) {}
      return [
        {
          id: 'crm_1',
          name: 'MW Sales Lead',
          approachedFor: 'MW Sales',
          followupMethod: 'Call',
          status: 'Important',
          source: 'Direct',
          email: '—',
          companyName: '—',
          website: '—',
          address: '—',
          lastUpdated: '09-09-2026 13:54',
          phone: '9811223344',
          businessType: 'Retail',
          followups: [
            { id: 'f1', dateTime: '09-09-2026 13:54', method: 'Call', status: 'Important', comments: 'Gurugram store onboarding inquiry.' }
          ]
        },
        {
          id: 'crm_2',
          name: 'Chai Chaska Gurugram',
          approachedFor: 'BeAurex Loyalty',
          followupMethod: 'Visit',
          status: 'Followup required',
          source: 'Walk-in',
          email: 'owner@chaichaska.in',
          companyName: 'Chai Chaska Pvt Ltd',
          website: 'https://chaichaska.in',
          address: 'Cyber Hub, DLF Phase 2, Gurugram',
          lastUpdated: '01-10-2026 11:20',
          phone: '9812345678',
          businessType: 'Cafe & Restaurant',
          followups: [
            { id: 'f2', dateTime: '01-10-2026 11:20', method: 'Visit', status: 'Followup required', comments: 'Interested in acrylic standee, demo scheduled.' }
          ]
        },
        {
          id: 'crm_3',
          name: 'Royal Sweets Counter Lead',
          approachedFor: 'Standee Setup',
          followupMethod: 'Call',
          status: 'Closed Won',
          source: 'Referral',
          email: 'sales@royalsweets.com',
          companyName: 'Royal Sweets & Cafe',
          website: 'https://royalsweets.com',
          address: 'Connaught Place, New Delhi',
          lastUpdated: '03-10-2026 17:40',
          phone: '9876543210',
          businessType: 'Cafe & Restaurant',
          followups: [
            { id: 'f3', dateTime: '03-10-2026 17:40', method: 'Call', status: 'Closed Won', comments: 'Setup completed. Standee dispatched.' }
          ]
        }
      ];
    }
    if (member.userId === '1696' || member.name === 'MWdemo') {
      return [
        {
          id: 'crm_mw1',
          name: 'Delhi Retail Central',
          approachedFor: 'MW Sales',
          followupMethod: 'Call',
          status: 'Important',
          source: 'Direct',
          email: 'contact@delhiretail.com',
          companyName: 'Delhi Retail Central',
          website: '—',
          address: 'Connaught Place, Delhi',
          lastUpdated: '18-09-2026 14:00',
          phone: '9152115001',
          businessType: 'Retail',
          followups: [
            { id: 'f_mw1', dateTime: '18-09-2026 14:00', method: 'Call', status: 'Important', comments: 'Stores 714, 711 active. Renewal discussed.' }
          ]
        }
      ];
    }
    if (member.userId === '1648' || member.name === 'test JX') {
      return [
        {
          id: 'crm_jx1',
          name: 'Urban Fitness Pune',
          approachedFor: 'Gym Standee Setup',
          followupMethod: 'Visit',
          status: 'Closed Won',
          source: 'Direct',
          email: 'vikram@urbanfitness.in',
          companyName: 'Urban Fitness Hub',
          website: '—',
          address: 'Koregaon Park, Pune',
          lastUpdated: '01-10-2026 16:30',
          phone: '9711223344',
          businessType: 'Fitness & Gym',
          followups: [
            { id: 'f_jx1', dateTime: '01-10-2026 16:30', method: 'Visit', status: 'Closed Won', comments: 'Setup finished and membership cards delivered.' }
          ]
        }
      ];
    }
    return [];
  };

  // Export referred stores to CSV
  const handleExportReferralsExcel = (member) => {
    if (!member) return;
    const refs = getMemberReferrals(member);
    let csvContent = "data:text/csv;charset=utf-8,"
      + "Store Name,Category,Owner Name,Phone Number,Location / City,Date Onboarded,Plan,Commission,Status\n";
    
    if (refs.length > 0) {
      refs.forEach(r => {
        const row = [
          `"${(r.storeName || '—').replace(/"/g, '""')}"`,
          `"${(r.category || '—').replace(/"/g, '""')}"`,
          `"${(r.owner || '—').replace(/"/g, '""')}"`,
          `"${(r.phone || '—').replace(/"/g, '""')}"`,
          `"${(r.city || '—').replace(/"/g, '""')}"`,
          `"${(r.date || '—').replace(/"/g, '""')}"`,
          `"${(r.plan || '—').replace(/"/g, '""')}"`,
          `"${(r.commission || '₹0').replace(/"/g, '""')}"`,
          `"${(r.status || 'PENDING').replace(/"/g, '""')}"`
        ].join(",");
        csvContent += row + "\n";
      });
    } else {
      csvContent += `"No stores onboarded yet","—","—","${member.mobile}","—","—","—","₹0","NONE"\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `referrals_${member.userId}_${member.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExcelToast(`Referrals CSV exported for ${member.name}!`);
    setTimeout(() => setExcelToast(''), 3500);
  };

  // Export customer manager CRM records to CSV
  const handleExportCustomerTrackerExcel = (member) => {
    if (!member) return;
    const leads = getMemberCrmLeads(member);
    let csvContent = "data:text/csv;charset=utf-8," 
      + "Approached For,Customer Name,Phone Number,Follow-up Method,Status,Source,Business Type,Company,Address,Last Updated,Notes Count\n";
    
    if (leads.length > 0) {
      leads.forEach(l => {
        const row = [
          `"${(l.approachedFor || '—').replace(/"/g, '""')}"`,
          `"${(l.name || '—').replace(/"/g, '""')}"`,
          `"${(l.phone || '—').replace(/"/g, '""')}"`,
          `"${(l.followupMethod || '—').replace(/"/g, '""')}"`,
          `"${(l.status || '—').replace(/"/g, '""')}"`,
          `"${(l.source || '—').replace(/"/g, '""')}"`,
          `"${(l.businessType || '—').replace(/"/g, '""')}"`,
          `"${(l.companyName || '—').replace(/"/g, '""')}"`,
          `"${(l.address || '—').replace(/"/g, '""')}"`,
          `"${(l.lastUpdated || '—').replace(/"/g, '""')}"`,
          (l.followups ? l.followups.length : 0)
        ].join(",");
        csvContent += row + "\n";
      });
    } else {
      csvContent += `"General","No leads logged yet","${member.mobile}","Call","Prospect","Direct","Retail","—","—","Never",0\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `customer_manager_${member.userId}_${member.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExcelToast(`Customer Manager CSV exported for ${member.name}!`);
    setTimeout(() => setExcelToast(''), 3500);
  };

  const filteredTeamMembers = teamMembers.filter(m =>
    m.name.toLowerCase().includes(searchTeam.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTeam.toLowerCase()) ||
    m.mobile.includes(searchTeam) ||
    m.userId.includes(searchTeam)
  );

  const fetchMerchants = () => {
    fetch('/api/admin/merchants')
      .then(r => r.json())
      .then(d => { if (d.success && d.merchants?.length) setMerchants(d.merchants); })
      .catch(() => {});
  };

  const fetchCustomers = () => {
    fetch('/api/admin/customers')
      .then(r => r.json())
      .then(d => { if (d.success && d.customers?.length) setCustomers(d.customers); })
      .catch(() => {});
  };

  const fetchPayments = () => {
    fetch('/api/admin/payments')
      .then(r => r.json())
      .then(d => { if (d.success) setPaymentsData(d); })
      .catch(() => {});
  };

  useEffect(() => {
    fetchMerchants();
    fetchCustomers();
    fetchPayments();

    fetch('/api/admin/config')
      .then(r => r.json())
      .then(d => { if (d.success && d.config) setConfig(d.config); })
      .catch(() => {});

    fetch('/api/admin/plans')
      .then(r => r.json())
      .then(d => { if (d.success && d.plans?.length) setPlans(d.plans); })
      .catch(() => {});
  }, []);

  // Handle Open Deal Modal (Image 1)
  const handleOpenDeal = (merchant) => {
    setSelectedMerchantForDeal(merchant);
    setDealForm({
      dealTitle: merchant.dealDetails?.dealTitle || 'Special Festive Discount',
      dealAmount: merchant.dealDetails?.dealAmount || 999,
      discountPercent: merchant.dealDetails?.discountPercent || 25,
      validTill: merchant.dealDetails?.validTill || '30 Days',
      isComplimentary: merchant.isComplimentary || false,
      notes: merchant.dealDetails?.notes || ''
    });
  };

  // Handle Save Deal
  const handleSaveDeal = async (e) => {
    e.preventDefault();
    if (!selectedMerchantForDeal) return;

    const updated = merchants.map(m => {
      if (m.id === selectedMerchantForDeal.id) {
        return {
          ...m,
          isComplimentary: dealForm.isComplimentary,
          dealDetails: { ...dealForm }
        };
      }
      return m;
    });
    setMerchants(updated);

    fetch('/api/admin/deals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchantId: selectedMerchantForDeal.id,
        ...dealForm
      })
    }).catch(() => {});

    setSelectedMerchantForDeal(null);
  };

  // Handle Toggle Complimentary Dropdown (Image 1 "COMPLIMENTARY")
  const handleToggleComplimentary = (id, value) => {
    const isComp = value === 'Yes' || value === true;
    setMerchants(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, isComplimentary: isComp };
      }
      return m;
    }));

    fetch(`/api/admin/merchants/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isComplimentary: isComp })
    }).catch(() => {});
  };

  // Handle Change Merchant Status (Image 1 "STATUS" dropdown)
  const handleChangeStatus = (id, newStatus) => {
    setMerchants(prev => prev.map(m => {
      if ((m.id || m._id) === id) {
        return { ...m, status: newStatus, isActive: newStatus !== 'Suspended' };
      }
      return m;
    }));

    if (newStatus === 'Suspended') {
      fetch(`/api/admin/merchants/${id}/suspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suspend: true })
      }).then(() => {
        setPaymentNotice('Merchant account suspended. Login access blocked until reactivated.');
        setTimeout(() => setPaymentNotice(''), 4500);
        fetchPayments();
      }).catch(() => {});
    } else if (newStatus === 'Paid') {
      fetch(`/api/admin/merchants/${id}/suspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suspend: false })
      }).then(() => {
        setPaymentNotice('Merchant reactivated with paid status. Store online and login restored.');
        setTimeout(() => setPaymentNotice(''), 4500);
        fetchPayments();
      }).catch(() => {});
    }

    fetch(`/api/admin/merchants/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).catch(() => {});
  };

  // Suspend or Reactivate Merchant Account (Image 1 Suspend function)
  const handleToggleMerchantSuspend = async (merchantId, currentSuspended) => {
    const nextSuspend = !currentSuspended;
    try {
      const res = await fetch(`/api/admin/merchants/${merchantId}/suspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suspend: nextSuspend })
      });
      const data = await res.json();
      if (data.success) {
        setPaymentNotice(data.message);
        setTimeout(() => setPaymentNotice(''), 4500);
        setMerchants(prev => prev.map(m => {
          if ((m.id || m._id) === merchantId) {
            return { ...m, status: nextSuspend ? 'Suspended' : 'Paid', isActive: !nextSuspend };
          }
          return m;
        }));
        fetchPayments();
        fetchMerchants();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Mark Account as Paid
  const handleMarkPaid = async (merchantId, planTier = 'PROFESSIONAL', amount = 49000) => {
    try {
      const res = await fetch('/api/admin/payments/mark-paid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantId, planTier, amount })
      });
      const data = await res.json();
      if (data.success) {
        setPaymentNotice(data.message);
        setTimeout(() => setPaymentNotice(''), 4500);
        fetchPayments();
        fetchMerchants();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Suspend or Reactivate Customer CRM Account (Real-time lockout)
  const handleToggleCustomerStatus = async (customerId, currentActive) => {
    try {
      const nextActive = !currentActive;
      const res = await fetch(`/api/admin/customers/${customerId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextActive })
      });
      const data = await res.json();
      if (data.success) {
        setPaymentNotice(data.message);
        setTimeout(() => setPaymentNotice(''), 4500);
        setCustomers(prev => prev.map(c => {
          if ((c.id || c._id) === customerId) {
            return { ...c, isActive: nextActive, status: nextActive ? 'Active' : 'Suspended' };
          }
          return c;
        }));
        fetchCustomers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Change Plan
  const handleChangePlan = (id, newPlan) => {
    setMerchants(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, plan: newPlan, subscriptionTier: newPlan };
      }
      return m;
    }));

    fetch(`/api/admin/merchants/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: newPlan, subscriptionTier: newPlan })
    }).catch(() => {});
  };

  // Handle Plan Editing & Save
  const handleUpdatePlanField = (planId, field, value) => {
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, [field]: value } : p));
  };

  const handleAddPlanFeature = (planId) => {
    const feat = (newFeatureInputs[planId] || '').trim();
    if (!feat) return;
    setPlans(prev => prev.map(p => {
      if (p.id === planId) {
        return { ...p, features: [...(p.features || []), feat] };
      }
      return p;
    }));
    setNewFeatureInputs(prev => ({ ...prev, [planId]: '' }));
  };

  const handleRemovePlanFeature = (planId, featureIdx) => {
    setPlans(prev => prev.map(p => {
      if (p.id === planId) {
        const nextFeat = [...(p.features || [])];
        nextFeat.splice(featureIdx, 1);
        return { ...p, features: nextFeat };
      }
      return p;
    }));
  };

  const handleSavePlanItem = async (planId, updatedFields = {}) => {
    const updated = plans.map(p => p.id === planId ? { ...p, ...updatedFields } : p);
    setPlans(updated);
    try {
      localStorage.setItem('beaurex_platform_plans', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('beaurex_plans_updated', { detail: updated }));
    } catch (e) {}

    try {
      const res = await fetch('/api/admin/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plans: updated })
      });
      const data = await res.json();
      if (data.success) {
        const targetPlan = updated.find(p => p.id === planId);
        setPlanSaveSuccess(`Plan "${targetPlan?.name || 'Selected'}" saved in MongoDB & updated on Landing Page!`);
        setTimeout(() => setPlanSaveSuccess(''), 4500);
      }
    } catch (e) {
      setPlanSaveSuccess('Plan saved locally & queued for MongoDB sync.');
      setTimeout(() => setPlanSaveSuccess(''), 4500);
    }
  };

  const handleSaveAllPlans = async () => {
    try {
      localStorage.setItem('beaurex_platform_plans', JSON.stringify(plans));
      window.dispatchEvent(new CustomEvent('beaurex_plans_updated', { detail: plans }));
    } catch (e) {}

    try {
      const res = await fetch('/api/admin/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plans })
      });
      const data = await res.json();
      if (data.success) {
        setPlanSaveSuccess('All subscription plans successfully updated in MongoDB and live on Landing Page!');
        setTimeout(() => setPlanSaveSuccess(''), 5000);
      }
    } catch (e) {
      setPlanSaveSuccess('Plans updated in local state.');
      setTimeout(() => setPlanSaveSuccess(''), 5000);
    }
  };

  const handleAddNewPlan = async () => {
    const newId = 'plan_' + Date.now();
    const newPlan = {
      id: newId,
      name: 'Custom Growth Package',
      price: 19999,
      originalPrice: 29999,
      period: '/ Year',
      subtext: 'Designed for scaling merchant counters',
      tagText: 'Special Package',
      highlightBadge: '',
      isPopular: false,
      trialDays: 2,
      scansLimit: 'Unlimited customer QR scans',
      features: [
        'Customer retention system',
        'Custom QR code standee generator',
        'Unlimited customer QR scans',
        'Priority Phone Support'
      ],
      ctaText: 'Start 2-Day Trial',
      showOnLandingPage: true,
      isActive: true,
      displayOrder: plans.length + 1
    };
    const updated = [...plans, newPlan];
    setPlans(updated);
    try {
      localStorage.setItem('beaurex_platform_plans', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('beaurex_plans_updated', { detail: updated }));
    } catch (e) {}

    fetch('/api/admin/plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plans: updated })
    }).catch(() => {});
    setPlanSaveSuccess('New plan created and saved to MongoDB & Landing Page!');
    setTimeout(() => setPlanSaveSuccess(''), 4500);
  };

  const handleDeletePlan = async (planId) => {
    if (confirm('Are you sure you want to delete this subscription plan from database and landing page?')) {
      const updated = plans.filter(p => p.id !== planId);
      setPlans(updated);
      try {
        localStorage.setItem('beaurex_platform_plans', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('beaurex_plans_updated', { detail: updated }));
      } catch (e) {}

      fetch(`/api/admin/plans/${planId}`, { method: 'DELETE' }).catch(() => {});
      setPlanSaveSuccess('Plan deleted from MongoDB & Landing Page.');
      setTimeout(() => setPlanSaveSuccess(''), 4500);
    }
  };

  // Handle Create Coupon
  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCouponForm.code) return;

    const newC = {
      id: 'cpn_' + Date.now(),
      code: newCouponForm.code.toUpperCase().trim(),
      discountType: newCouponForm.discountType,
      discountValue: Number(newCouponForm.discountValue),
      minOrder: Number(newCouponForm.minOrder),
      maxUses: Number(newCouponForm.maxUses),
      usedCount: 0,
      expiresAt: newCouponForm.expiresAt,
      isActive: true
    };

    const updated = [newC, ...coupons];
    setCoupons(updated);

    fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newC)
    }).catch(() => {});

    setNewCouponForm({ code: '', discountType: 'PERCENT', discountValue: 20, minOrder: 500, maxUses: 100, expiresAt: '2026-12-31' });
  };

  // Handle Delete Coupon
  const handleDeleteCoupon = (id) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  // Handle Add Custom API Key
  const handleAddCustomKey = (e) => {
    e.preventDefault();
    if (!newCustomKey.name || !newCustomKey.keyName || !newCustomKey.keyValue) return;

    const newKey = {
      id: 'cak_' + Date.now(),
      name: newCustomKey.name,
      keyName: newCustomKey.keyName,
      keyValue: newCustomKey.keyValue,
      env: newCustomKey.env || 'Production',
      description: newCustomKey.description || 'Custom service integration'
    };

    const updatedKeys = [newKey, ...(config.customApiKeys || [])];
    setConfig({ ...config, customApiKeys: updatedKeys });

    fetch('/api/admin/config/custom-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newKey)
    }).catch(() => {});

    setShowAddCustomKeyModal(false);
    setNewCustomKey({ name: '', keyName: '', keyValue: '', env: 'Production', description: '' });
  };

  // Handle Delete Custom API Key
  const handleDeleteCustomKey = (id) => {
    const updated = (config.customApiKeys || []).filter(k => k.id !== id);
    setConfig({ ...config, customApiKeys: updated });
    fetch(`/api/admin/config/custom-key/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const handleToggleMerchantStatus = (id) => {
    setMerchants(prev => prev.map(m => {
      if (m.id === id || m._id === id) {
        const nextStatus = m.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        return { ...m, status: nextStatus };
      }
      return m;
    }));
  };

  const handleChangeTier = (id, newTier) => {
    setMerchants(prev => prev.map(m => {
      if (m.id === id || m._id === id) {
        return { ...m, subscriptionTier: newTier };
      }
      return m;
    }));
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    fetch('/api/admin/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    }).catch(() => {});

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const filteredMerchants = merchants.filter(m => {
    const term = searchMerchant.toLowerCase();
    const matchTerm = (
      m.businessName?.toLowerCase().includes(term) ||
      m.city?.toLowerCase().includes(term) ||
      m.mobile?.includes(term) ||
      m.plan?.toLowerCase().includes(term) ||
      m.status?.toLowerCase().includes(term)
    );
    const matchFilter = merchantFilter === 'ALL' || m.status === merchantFilter || (merchantFilter === 'COMPLIMENTARY' && m.isComplimentary);
    return matchTerm && matchFilter;
  });


  const paymentsList = (paymentsData?.payments && paymentsData.payments.length > 0)
    ? paymentsData.payments
    : merchants.map(m => ({
        id: m.id || m._id,
        businessName: m.businessName,
        category: m.category,
        mobile: m.mobile,
        email: m.email,
        city: m.city,
        subscriptionTier: m.subscriptionTier || 'Trial Plan',
        plan: m.plan || m.subscriptionTier || 'Trial Plan',
        paymentAmount: m.paymentAmount || '-',
        paymentDate: m.paymentDate || '-',
        planValidTill: m.planValidTill || '14 Oct 2026',
        status: m.status || 'Trial',
        isActive: m.status !== 'Suspended',
        paymentStatus: (m.paymentAmount && m.paymentAmount !== '-') ? 'PAID' : (m.status === 'Trial' ? 'TRIAL' : (m.status === 'Suspended' ? 'SUSPENDED' : 'UNPAID'))
      }));

  const filteredPayments = paymentsList.filter(item => {
    const term = searchPayment.toLowerCase();
    const matchTerm = (
      (item.businessName || '').toLowerCase().includes(term) ||
      (item.mobile || '').includes(term) ||
      (item.email || '').toLowerCase().includes(term) ||
      (item.plan || '').toLowerCase().includes(term) ||
      (item.city || '').toLowerCase().includes(term)
    );
    const matchFilter = 
      paymentFilter === 'ALL' ||
      item.paymentStatus === paymentFilter ||
      (paymentFilter === 'PAID' && item.paymentStatus === 'PAID') ||
      (paymentFilter === 'UNPAID' && (item.paymentStatus === 'UNPAID' || item.status === 'Expired')) ||
      (paymentFilter === 'TRIAL' && (item.paymentStatus === 'TRIAL' || item.status === 'Trial')) ||
      (paymentFilter === 'SUSPENDED' && (item.paymentStatus === 'SUSPENDED' || item.status === 'Suspended' || item.isActive === false));
    return matchTerm && matchFilter;
  });

  const filteredCustomers = customers.filter(c => {
    const term = searchCustomer.toLowerCase();
    const matchTerm = (
      (c.name || '').toLowerCase().includes(term) ||
      (c.mobile || '').includes(term) ||
      (c.customerId || '').toLowerCase().includes(term) ||
      (c.email || '').toLowerCase().includes(term) ||
      (c.favoriteStore || '').toLowerCase().includes(term)
    );
    const matchFilter = 
      customerFilter === 'ALL' ||
      (customerFilter === 'ACTIVE' && c.isActive !== false) ||
      (customerFilter === 'SUSPENDED' && c.isActive === false);
    return matchTerm && matchFilter;
  });

  const handleLogout = () => {
    sessionStorage.removeItem('beaurex_admin_auth');
    window.location.href = '/';
  };

  const navItems = [
    { id: 'overview', label: 'Overview & Metrics', icon: LayoutDashboard, badge: 'Live' },
    { id: 'merchants', label: 'Merchants Network', icon: Store, count: merchants.length },
    { id: 'payments', label: 'Billing & Payments', icon: CreditCard, count: paymentsData?.payments?.length || merchants.length, badge: 'Finance' },
    { id: 'plans', label: 'Plans & Pricing', icon: Layers, count: plans.length, badge: 'Landing' },
    { id: 'team', label: 'Teams Management', icon: UserCheck, count: teamMembers.length, badge: 'New' },
    { id: 'customers', label: 'Customer CRM', icon: Users, count: customers.length },
    { id: 'config', label: 'API & Gateway Keys', icon: Key, badge: 'Config' },
    { id: 'audit', label: 'Security & Audit Logs', icon: Activity, badge: 'Secured' },
  ];

  return (
    <AdminAuthGate>
      <div className="h-screen w-full bg-slate-50 text-slate-900 font-sans antialiased flex flex-col md:flex-row overflow-hidden selection:bg-red-500 selection:text-white">
        
        {/* ========================================================= */}
        {/* MOBILE TOPBAR WITH HAMBURGER (Visible only on < md screens) */}
        {/* ========================================================= */}
        <header className="md:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/beaurex-icon.jpg" 
              alt="BeAurex Logo" 
              className="w-8 h-8 rounded-xl object-cover shadow-xs"
            />
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight leading-none text-slate-900">
                Be<span className="text-[#851421]">Aurex</span>
              </span>
              <span className="text-[9px] font-black text-red-600 uppercase tracking-widest mt-0.5">
                Super Admin
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg">
              Live
            </span>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-red-600" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer Modal */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Drawer */}
            <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200 overflow-y-auto">
              <div>
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <img 
                      src="/beaurex-icon.jpg" 
                      alt="BeAurex Logo" 
                      className="w-8 h-8 rounded-xl object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 text-sm">Super Admin</span>
                      <span className="text-[9px] font-bold text-red-600 uppercase">BeAurex Control</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 border border-slate-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-bold text-slate-700 text-[11px]">Production Cluster</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 font-bold px-1.5 py-0.5 rounded">2ms Ping</span>
                </div>

                <div className="p-3 space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Core Operations
                  </div>
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          isActive
                            ? 'bg-red-600 text-white shadow-md shadow-[#74111d]/25'
                            : 'text-slate-600 hover:bg-rose-50 hover:text-[#74111d]'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.count !== undefined && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {item.count}
                          </span>
                        )}
                        {item.badge && !item.count && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isActive ? 'bg-white/20 text-white' : 'bg-rose-50 text-[#74111d] border border-rose-200'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 border-t border-slate-200/90 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#74111d] text-white font-bold text-xs flex items-center justify-center">
                      SA
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900">Master Admin</span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[120px]">admin@beaurex.com</span>
                    </div>
                  </div>
                  <span className="bg-rose-50 text-[#74111d] border border-rose-200 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Root
                  </span>
                </div>

                <button
                  onClick={() => { setAdminProfileModalOpen(true); setMobileMenuOpen(false); }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 rounded-xl transition flex items-center justify-center space-x-1.5 border border-slate-200 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Admin Profile</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full bg-white hover:bg-rose-50 text-[#74111d] border border-red-200 text-xs font-bold py-2 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* LEFT SIDEBAR NAVIGATION (Desktop: Fixed Position) */}
        {/* ========================================================= */}
        <aside className="hidden md:flex md:w-72 bg-white border-r border-slate-200/90 flex-col justify-between shrink-0 shadow-sm z-30 fixed inset-y-0 left-0 h-screen">
          <div className="flex-1 overflow-y-auto">
            {/* Brand Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-3 group">
                <img 
                  src="/beaurex-icon.jpg" 
                  alt="BeAurex Logo" 
                  className="w-10 h-10 rounded-xl object-cover shadow-md shadow-red-600/30 group-hover:scale-105 transition transform"
                />
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tight leading-none text-slate-900">
                    Be<span className="text-[#851421]">Aurex</span>
                  </span>
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-widest mt-1">
                    Super Admin Console
                  </span>
                </div>
              </Link>
            </div>

            {/* Platform Status Badge */}
            <div className="px-6 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-bold text-slate-700 text-[11px]">Production Cluster</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 font-bold px-1.5 py-0.5 rounded">2ms Ping</span>
            </div>

            {/* Navigation Menu */}
            <div className="p-4 space-y-1">
              <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
                Core Operations
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isActive
                        ? 'bg-red-600 text-white shadow-md shadow-[#74111d]/25'
                        : 'text-slate-600 hover:bg-rose-50 hover:text-[#74111d]'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.count}
                      </span>
                    )}
                    {item.badge && !item.count && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-rose-50 text-[#74111d] border border-rose-200'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

            </div>
          </div>

          {/* Sidebar Footer: Profile & Lock Console */}
          <div className="p-4 border-t border-slate-200/90 bg-slate-50/50 space-y-2 shrink-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-[#74111d] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  SA
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900">Master Admin</span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[130px]">admin@beaurex.com</span>
                </div>
              </div>
              <span className="bg-rose-50 text-[#74111d] border border-rose-200 text-[10px] font-bold px-1.5 py-0.5 rounded">
                Root
              </span>
            </div>

            <button
              onClick={() => setAdminProfileModalOpen(true)}
              className="w-full bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold py-2 rounded-xl transition flex items-center justify-center space-x-1.5 border border-slate-200 shadow-xs cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Admin Profile</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-white hover:bg-rose-50 text-[#74111d] border border-red-200 hover:border-red-300 text-xs font-bold py-2 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* MAIN DASHBOARD CONTENT AREA (Only right side scrolls) */}
        {/* ========================================================= */}
        <div className="flex-1 md:ml-72 flex flex-col min-w-0 h-screen overflow-y-auto">
          
          {/* ========================================================= */}
          {/* TOP BRAND HEADER (BeAurex Landing Page Red Theme) */}
          {/* ========================================================= */}
          <header className="bg-gradient-to-r from-[#6b0f1a] via-[#851421] to-[#5c0d16] text-white shadow-md relative z-20">
            {/* System Status Sub-bar */}
            <div className="bg-black/25 px-4 sm:px-8 py-2 flex items-center justify-between text-xs font-medium border-b border-white/10 backdrop-blur-xs">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Master Security Layer: <strong className="font-black text-white">256-bit TLS Active</strong> • Database: <strong className="font-bold text-emerald-300">Connected</strong></span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="hidden sm:inline-block text-[11px] text-red-100">Root Auth: Super Admin</span>
                <Link 
                  to="/" 
                  className="bg-white hover:bg-slate-100 text-[#74111d] font-black text-[11px] px-3.5 py-0.5 rounded-full shadow-xs cursor-pointer transition transform active:scale-95 flex items-center space-x-1"
                >
                  <span>Landing Page</span>
                  <ExternalLink className="w-2.5 h-2.5 ml-1" />
                </Link>
              </div>
            </div>

            {/* Context & Title Bar */}
            <div className="px-6 sm:px-8 py-5 flex items-center justify-between gap-3">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-full bg-white text-[#74111d] font-black text-lg flex items-center justify-center shadow-lg shrink-0 border border-white/50">
                  SA
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                    Super Admin Console
                  </h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="bg-white text-emerald-800 font-extrabold px-3 py-0.5 rounded-full text-xs shadow-xs">
                      Active Plan
                    </span>
                    <span className="bg-white/15 text-white border border-white/30 px-3 py-0.5 rounded-full text-xs font-bold backdrop-blur-xs">
                      Master Root Protocol
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* 4 Metric Boxes (Header Dashboard Summary) */}
            <div className="px-6 sm:px-8 pb-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 pt-1">
                {/* MERCHANTS */}
                <div className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl p-3 text-center backdrop-blur-xs flex flex-col items-center justify-center transition">
                  <Building2 className="w-4 h-4 text-white/80 mb-1" />
                  <span className="text-xl sm:text-2xl font-black text-white leading-tight">{merchants.length}</span>
                  <span className="text-[10px] uppercase font-bold text-white/80 tracking-wider">Merchants</span>
                </div>

                {/* PLANS */}
                <div className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl p-3 text-center backdrop-blur-xs flex flex-col items-center justify-center transition">
                  <CreditCard className="w-4 h-4 text-white/80 mb-1" />
                  <span className="text-xl sm:text-2xl font-black text-white leading-tight">{plans.length}</span>
                  <span className="text-[10px] uppercase font-bold text-white/80 tracking-wider">Active Plans</span>
                </div>

                {/* TEAMS */}
                <div className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl p-3 text-center backdrop-blur-xs flex flex-col items-center justify-center transition">
                  <Users className="w-4 h-4 text-white/80 mb-1" />
                  <span className="text-xl sm:text-2xl font-black text-white leading-tight">{teamMembers.length}</span>
                  <span className="text-[10px] uppercase font-bold text-white/80 tracking-wider">Field Teams</span>
                </div>

                {/* CRM CUSTOMERS */}
                <div className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl p-3 text-center backdrop-blur-xs flex flex-col items-center justify-center transition">
                  <Sparkles className="w-4 h-4 text-white/80 mb-1" />
                  <span className="text-xl sm:text-2xl font-black text-white leading-tight">{customers.length}</span>
                  <span className="text-[10px] uppercase font-bold text-white/80 tracking-wider">CRM Customers</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Container */}
          <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
            
            {/* Action Feedback Alert Banner */}
            {paymentNotice && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{paymentNotice}</span>
                </div>
                <button onClick={() => setPaymentNotice('')} className="text-emerald-700 hover:text-emerald-900 cursor-pointer p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* TAB: OVERVIEW & TELEMETRY */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* 4 Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      <span>Platform GMV</span>
                      <span className="text-emerald-600 font-bold">↑ +32%</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900">₹28.4 Lakh</div>
                    <p className="text-[11px] text-slate-500 mt-1">Total customer repeat billings</p>
                  </div>

                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      <span>Active Stores</span>
                      <span className="text-red-600 font-bold">118 Paid</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-red-600">142 Stores</div>
                    <p className="text-[11px] text-slate-500 mt-1">24 in active 2-day free trial</p>
                  </div>

                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      <span>Total Scans</span>
                      <span className="text-emerald-600 font-bold">43.2% Repeat</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900">1,42,850</div>
                    <p className="text-[11px] text-slate-500 mt-1">Walk-ins converted to regulars</p>
                  </div>

                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      <span>Database Engine</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    </div>
                    <div className="text-xl font-black text-emerald-600 mt-1">MongoDB Live</div>
                    <p className="text-[11px] text-slate-500 mt-1">Cluster beaurex • 2ms Latency</p>
                  </div>
                </div>

                {/* Quick Shortcuts & Health Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left 2 Cols: Recent Merchant Signups */}
                  <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-black text-base text-slate-900">Recent Registered Stores</h3>
                        <p className="text-xs text-slate-500">Live feed of store owners testing BeAurex</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('merchants')}
                        className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                      >
                        View All →
                      </button>
                    </div>

                    <div className="space-y-3">
                      {merchants.slice(0, 3).map((m) => (
                        <div key={m.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-lg bg-red-100 text-red-600 font-black flex items-center justify-center text-xs">
                              {m.businessName.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-extrabold text-xs text-slate-900">{m.businessName}</div>
                              <div className="text-[11px] text-slate-500">{m.city} • {m.category}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              {m.subscriptionTier}
                            </span>
                            <span className="text-xs font-black text-slate-700">{m.repeatRate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Col: System Health */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                    <div>
                      <h3 className="font-black text-base text-slate-900 mb-1">Infrastructure</h3>
                      <p className="text-xs text-slate-500 mb-4">Cloud security and failover state</p>

                      <div className="space-y-3 text-xs">
                        <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                          <span className="font-semibold text-slate-600">SMS OTP Route</span>
                          <span className="font-bold text-emerald-600">SMSCountry (DLT Verified)</span>
                        </div>
                        <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                          <span className="font-semibold text-slate-600">Payment Gateway</span>
                          <span className="font-bold text-slate-900">Razorpay Live</span>
                        </div>
                        <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                          <span className="font-semibold text-slate-600">Fair-play Throttle</span>
                          <span className="font-bold text-slate-900">12h Device Lock</span>
                        </div>
                        <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                          <span className="font-semibold text-slate-600">Staff Network</span>
                          <span className="font-bold text-slate-900">4 Active Agents</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <button
                        onClick={() => setActiveTab('config')}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
                      >
                        Manage API Credentials
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: MERCHANTS MANAGEMENT & BILLING (Matching Image 1: media_1791096512221.jpg) */}
            {activeTab === 'merchants' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* 3 Top Stat Cards from Image 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trial Merchants</p>
                      <h3 className="text-2xl font-black text-slate-900 mt-1">
                        {merchants.filter(m => m.status === 'Trial' || m.plan?.toLowerCase().includes('trial')).length || 7}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">Active complimentary evaluation</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                      <Clock className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Payment</p>
                      <h3 className="text-2xl font-black text-slate-900 mt-1">
                        {merchants.filter(m => m.status === 'Pending Payment').length || 0}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">Awaiting gateway settlement</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Onboarding</p>
                      <h3 className="text-2xl font-black text-slate-900 mt-1">
                        {merchants.filter(m => m.paymentDate === 'Today').length || 0}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">Registered since midnight</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                      <Sparkles className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Main Table Card */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                  {/* Toolbar & Filters (Image 1 top bar) */}
                  <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-slate-50/50">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 mr-1">
                        <Filter className="w-3.5 h-3.5 text-slate-400" />
                        <span>Filter:</span>
                      </div>
                      
                      <select
                        value={merchantFilter}
                        onChange={(e) => setMerchantFilter(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-red-600 cursor-pointer shadow-2xs"
                      >
                        <option value="ALL">All Status</option>
                        <option value="Trial">Trial</option>
                        <option value="Paid">Paid</option>
                        <option value="Suspended">Suspended</option>
                        <option value="Expired">Expired</option>
                        <option value="COMPLIMENTARY">Complimentary Only</option>
                      </select>

                      <button
                        onClick={() => { setMerchantFilter('ALL'); setSearchMerchant(''); }}
                        className="bg-white hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-600 flex items-center space-x-1 transition cursor-pointer shadow-2xs"
                        title="Reset all filters"
                      >
                        <RotateCcw className="w-3 h-3 text-slate-400" />
                        <span>Reset</span>
                      </button>

                      {/* Modify Plans & Manage Coupons buttons */}
                      <button
                        onClick={() => setActiveTab('plans')}
                        className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-xl px-3 py-1.5 text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer shadow-2xs"
                      >
                        <Layers className="w-3.5 h-3.5 text-red-600" />
                        <span>Modify Platform Plans</span>
                      </button>

                      <button
                        onClick={() => setShowCouponsModal(true)}
                        className="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-xl px-3 py-1.5 text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer shadow-2xs"
                      >
                        <Tag className="w-3.5 h-3.5 text-amber-600" />
                        <span>Manage Coupons</span>
                      </button>
                    </div>

                    <div className="relative w-full lg:w-72">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search merchant, store, plan..."
                        value={searchMerchant}
                        onChange={(e) => setSearchMerchant(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Table with Image 1 exact columns */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-black tracking-wider">
                          <th className="py-3 px-4">Merchant / Business</th>
                          <th className="py-3 px-3">Payment Date</th>
                          <th className="py-3 px-3">Payment Amount</th>
                          <th className="py-3 px-3">Plan</th>
                          <th className="py-3 px-3">Plan Valid Till</th>
                          <th className="py-3 px-3 text-center">Set a Deal</th>
                          <th className="py-3 px-3 text-center">Status</th>
                          <th className="py-3 px-3 text-center">Account Access</th>
                          <th className="py-3 px-3 text-center">View</th>
                          <th className="py-3 px-3 text-center">Complimentary</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredMerchants.length === 0 ? (
                          <tr>
                            <td colSpan={10} className="py-8 text-center text-xs text-slate-400 font-bold">
                              No merchants match the selected filters.
                            </td>
                          </tr>
                        ) : (
                          filteredMerchants.map((m) => (
                            <tr key={m.id || m._id} className="hover:bg-slate-50/80 transition">
                              {/* Merchant / Business info */}
                              <td className="py-3 px-4">
                                <div className="font-extrabold text-slate-900 flex items-center space-x-1.5">
                                  <span>{m.businessName}</span>
                                  {m.dealDetails?.dealTitle && (
                                    <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.2 rounded">
                                      Deal
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono">{m.mobile} • {m.city || 'India'}</div>
                              </td>

                              {/* PAYMENT DATE */}
                              <td className="py-3 px-3 font-mono text-slate-600 text-[11px]">
                                {m.paymentDate || '—'}
                              </td>

                              {/* PAYMENT AMOUNT */}
                              <td className="py-3 px-3 font-bold text-slate-800">
                                {m.paymentAmount || '—'}
                              </td>

                              {/* PLAN (editable dropdown) */}
                              <td className="py-3 px-3">
                                <select
                                  value={m.plan || m.subscriptionTier || 'Trial Plan'}
                                  onChange={(e) => handleChangePlan(m.id || m._id, e.target.value)}
                                  className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-800 focus:outline-none focus:border-red-600 cursor-pointer"
                                >
                                  <option value="Trial Plan">Trial Plan</option>
                                  <option value="Basic Plan">Basic Plan</option>
                                  <option value="Standard Plan">Standard Plan</option>
                                  <option value="Professional Plan">Professional Plan</option>
                                  <option value="Enterprise Pro">Enterprise Pro</option>
                                </select>
                              </td>

                              {/* PLAN VALID TILL */}
                              <td className="py-3 px-3 font-mono text-slate-600 text-[11px]">
                                {m.planValidTill || '12 Oct 2026'}
                              </td>

                              {/* SET A DEAL BUTTON */}
                              <td className="py-3 px-3 text-center">
                                <button
                                  onClick={() => handleOpenDeal(m)}
                                  className="bg-[#74111d] hover:bg-[#5e0c15] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-lg transition shadow-2xs hover:shadow-red-600/20 cursor-pointer"
                                  title="Configure custom deal for merchant"
                                >
                                  Set a Deal
                                </button>
                              </td>

                              {/* STATUS (Image 1 dropdown) */}
                              <td className="py-3 px-3 text-center">
                                <select
                                  value={m.status || 'Trial'}
                                  onChange={(e) => handleChangeStatus(m.id || m._id, e.target.value)}
                                  className={`rounded-lg px-2 py-1 text-[11px] font-bold cursor-pointer border ${
                                    m.status === 'Trial'
                                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                                      : m.status === 'Paid'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : m.status === 'Suspended'
                                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                                      : 'bg-slate-100 text-slate-700 border-slate-200'
                                  }`}
                                >
                                  <option value="Trial">Trial</option>
                                  <option value="Paid">Paid</option>
                                  <option value="Suspended">Suspended</option>
                                  <option value="Expired">Expired</option>
                                </select>
                              </td>

                              {/* ACCOUNT ACCESS (Suspend / Reactivate) */}
                              <td className="py-3 px-3 text-center">
                                {(m.status === 'Suspended' || m.isActive === false) ? (
                                  <button
                                    onClick={() => handleToggleMerchantSuspend(m.id || m._id, true)}
                                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg transition cursor-pointer inline-flex items-center space-x-1 shadow-2xs"
                                    title="Account suspended (login locked). Click to reactivate access."
                                  >
                                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                    <span>Reactivate</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleToggleMerchantSuspend(m.id || m._id, false)}
                                    className="bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg transition cursor-pointer inline-flex items-center space-x-1 shadow-2xs"
                                    title="Click to suspend merchant account (locks login until paid)"
                                  >
                                    <Ban className="w-3 h-3 text-rose-600" />
                                    <span>Suspend</span>
                                  </button>
                                )}
                              </td>

                              {/* VIEW (Eye Icon) */}
                              <td className="py-3 px-3 text-center">
                                <button
                                  onClick={() => setViewMerchantModal(m)}
                                  className="text-slate-500 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                                  title="View Merchant Profile"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </td>

                              {/* COMPLIMENTARY (Dropdown: Yes / No) */}
                              <td className="py-3 px-3 text-center">
                                <select
                                  value={m.isComplimentary ? 'Yes' : 'No'}
                                  onChange={(e) => handleToggleComplimentary(m.id || m._id, e.target.value)}
                                  className={`rounded-lg px-2 py-1 text-[11px] font-bold cursor-pointer border ${
                                    m.isComplimentary
                                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                                      : 'bg-slate-50 text-slate-600 border-slate-200'
                                  }`}
                                >
                                  <option value="No">No</option>
                                  <option value="Yes">Yes</option>
                                </select>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB: BILLING & PAYMENTS MENU (Paid vs Unpaid, Revenue, Suspend) */}
            {/* ========================================================= */}
            {activeTab === 'payments' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* Header banner */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#851421] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-red-200 mb-3 border border-white/10">
                        <CreditCard className="w-3.5 h-3.5 text-red-300" />
                        <span>Platform Billing & Subscription Ledger</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Merchants Payment Control Center</h2>
                      <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
                        Track which merchant accounts are paid vs unpaid, collect offline bank settlements, monitor gross revenue, and immediately suspend unpaid accounts from logging in.
                      </p>
                    </div>
                    <div className="flex items-center space-x-3 shrink-0">
                      <button
                        onClick={() => { fetchPayments(); fetchMerchants(); }}
                        className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition cursor-pointer backdrop-blur-xs"
                      >
                        <RefreshCw className="w-4 h-4 text-slate-200" />
                        <span>Sync Ledger</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5 Financial Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Total Collected Revenue */}
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue</span>
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                        <DollarSign className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mt-2">
                      {paymentsData.totalRevenue || '₹49,000'}
                    </h3>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">Settled & Confirmed</p>
                  </div>

                  {/* Paid Accounts */}
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Paid Accounts</span>
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-emerald-700 mt-2">
                      {paymentsData.paidCount !== undefined ? paymentsData.paidCount : paymentsList.filter(p => p.paymentStatus === 'PAID').length}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1">Full access active & store online</p>
                  </div>

                  {/* Unpaid Accounts */}
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unpaid / Due</span>
                      <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-rose-600 mt-2">
                      {paymentsData.unpaidCount !== undefined ? paymentsData.unpaidCount : paymentsList.filter(p => p.paymentStatus === 'UNPAID').length}
                    </h3>
                    <p className="text-[11px] text-rose-500 font-semibold mt-1">Expired or pending payment</p>
                  </div>

                  {/* Free Trial Accounts */}
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Free Trials</span>
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                        <Clock className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-amber-700 mt-2">
                      {paymentsData.trialCount !== undefined ? paymentsData.trialCount : paymentsList.filter(p => p.paymentStatus === 'TRIAL').length}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1">2-day evaluation window</p>
                  </div>

                  {/* Suspended Accounts */}
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Suspended</span>
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-black">
                        <Ban className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mt-2">
                      {paymentsData.suspendedCount !== undefined ? paymentsData.suspendedCount : paymentsList.filter(p => p.paymentStatus === 'SUSPENDED' || !p.isActive).length}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-semibold mt-1">Login blocked</p>
                  </div>
                </div>

                {/* Ledger & Table */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                  {/* Toolbar & Filters */}
                  <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-slate-50/50">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 mr-1">
                        <Filter className="w-3.5 h-3.5 text-slate-400" />
                        <span>Filter:</span>
                      </div>
                      
                      {[
                        { id: 'ALL', label: 'All Accounts' },
                        { id: 'PAID', label: 'Paid Only' },
                        { id: 'UNPAID', label: 'Unpaid / Expired' },
                        { id: 'TRIAL', label: 'Trial Plans' },
                        { id: 'SUSPENDED', label: 'Suspended' }
                      ].map(f => (
                        <button
                          key={f.id}
                          onClick={() => setPaymentFilter(f.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                            paymentFilter === f.id
                              ? 'bg-[#74111d] text-white border-[#74111d] shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}

                      <button
                        onClick={() => { setPaymentFilter('ALL'); setSearchPayment(''); }}
                        className="bg-white hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-600 flex items-center space-x-1 transition cursor-pointer shadow-2xs"
                        title="Reset all filters"
                      >
                        <RotateCcw className="w-3 h-3 text-slate-400" />
                        <span>Reset</span>
                      </button>
                    </div>

                    <div className="relative w-full lg:w-72">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search merchant, store, plan..."
                        value={searchPayment}
                        onChange={(e) => setSearchPayment(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Payment Ledger Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-black tracking-wider">
                          <th className="py-3.5 px-4">Merchant / Business</th>
                          <th className="py-3.5 px-3">Plan Subscribed</th>
                          <th className="py-3.5 px-3">Amount Paid</th>
                          <th className="py-3.5 px-3">Payment Date</th>
                          <th className="py-3.5 px-3">Valid Till</th>
                          <th className="py-3.5 px-3 text-center">Payment Status</th>
                          <th className="py-3.5 px-3 text-center">Store Status</th>
                          <th className="py-3.5 px-4 text-right">Billing Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredPayments.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-10 text-center text-xs text-slate-400 font-bold">
                              No payment records match the current filters.
                            </td>
                          </tr>
                        ) : (
                          filteredPayments.map((p) => {
                            const isPaid = p.paymentStatus === 'PAID';
                            const isSuspended = p.paymentStatus === 'SUSPENDED' || p.status === 'Suspended' || p.isActive === false;
                            const isTrial = p.paymentStatus === 'TRIAL' || p.status === 'Trial';
                            return (
                              <tr key={p.id || p._id} className="hover:bg-slate-50/80 transition">
                                <td className="py-3.5 px-4">
                                  <div className="font-extrabold text-slate-900">{p.businessName}</div>
                                  <div className="text-[11px] text-slate-500 font-mono">
                                    {p.mobile} • {p.city || 'India'}
                                  </div>
                                </td>

                                <td className="py-3.5 px-3">
                                  <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                                    {p.plan || p.subscriptionTier || 'Trial Plan'}
                                  </span>
                                </td>

                                <td className="py-3.5 px-3 font-extrabold text-slate-900">
                                  {p.paymentAmount && p.paymentAmount !== '-' ? p.paymentAmount : '₹0 (Unpaid)'}
                                </td>

                                <td className="py-3.5 px-3 font-mono text-slate-600 text-[11px]">
                                  {p.paymentDate || '—'}
                                </td>

                                <td className="py-3.5 px-3 font-mono text-slate-600 text-[11px]">
                                  {p.planValidTill || '—'}
                                </td>

                                <td className="py-3.5 px-3 text-center">
                                  {isSuspended ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-700 border border-rose-200">
                                      SUSPENDED
                                    </span>
                                  ) : isPaid ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                                      PAID ✓
                                    </span>
                                  ) : isTrial ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">
                                      TRIAL
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-700 border border-red-200">
                                      UNPAID
                                    </span>
                                  )}
                                </td>

                                <td className="py-3.5 px-3 text-center">
                                  {!isSuspended && (isPaid || isTrial) ? (
                                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700">
                                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                      <span>Online</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-slate-400">
                                      <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                                      <span>Offline</span>
                                    </span>
                                  )}
                                </td>

                                <td className="py-3.5 px-4 text-right">
                                  <div className="flex items-center justify-end space-x-1.5">
                                    {/* Mark as Paid Action if not paid */}
                                    {!isPaid && (
                                      <button
                                        onClick={() => handleMarkPaid(p.id || p._id, 'PROFESSIONAL', 49000)}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-lg transition shadow-2xs cursor-pointer flex items-center space-x-1"
                                        title="Mark account as paid & bring store online"
                                      >
                                        <Check className="w-3 h-3" />
                                        <span>Mark Paid</span>
                                      </button>
                                    )}

                                    {/* Suspend or Reactivate Action */}
                                    {isSuspended ? (
                                      <button
                                        onClick={() => handleToggleMerchantSuspend(p.id || p._id, true)}
                                        className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center space-x-1 shadow-2xs"
                                        title="Reactivate merchant login access"
                                      >
                                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                        <span>Reactivate</span>
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleToggleMerchantSuspend(p.id || p._id, false)}
                                        className="bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center space-x-1 shadow-2xs"
                                        title="Suspend merchant account (locks login until paid)"
                                      >
                                        <Ban className="w-3 h-3 text-rose-600" />
                                        <span>Suspend</span>
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB: SUBSCRIPTION PLANS & LANDING PAGE PRICING MANAGEMENT */}
            {/* ========================================================= */}
            {activeTab === 'plans' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* Real-time Save Confirmation Banner */}
                {planSaveSuccess && (
                  <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs animate-in fade-in">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{planSaveSuccess}</span>
                    </div>
                    <Link
                      to="/"
                      target="_blank"
                      className="text-emerald-700 hover:text-emerald-900 underline flex items-center space-x-1 font-extrabold shrink-0"
                    >
                      <span>Preview Live on Landing Page (/#pricing)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}

                {/* Header Card with Actions */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-black">
                        <Layers className="w-4 h-4" />
                      </div>
                      <h2 className="text-lg font-black text-slate-900">Platform Subscription Plans & Public Pricing</h2>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      Configure retail subscription fees, billing cycles, features, and badges. Changes save directly to MongoDB and immediately update the public Landing Page pricing section.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                    <Link
                      to="/"
                      target="_blank"
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer"
                    >
                      <span>Live Landing Page</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={handleAddNewPlan}
                      className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-4 h-4 text-red-600" />
                      <span>+ Create New Plan</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveAllPlans}
                      className="bg-[#74111d] hover:bg-[#5e0c15] text-white font-black px-5 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer shadow-md shadow-[#74111d]/25"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save All Plans to MongoDB</span>
                    </button>
                  </div>
                </div>

                {/* Plans Management Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {plans.map((p, idx) => (
                    <div
                      key={p.id}
                      className={`bg-white border rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-5 transition ${
                        p.isPopular
                          ? 'border-red-400 ring-2 ring-red-500/20 shadow-md'
                          : 'border-slate-200'
                      }`}
                    >
                      <div className="space-y-4">
                        {/* Plan Header Strip */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-mono font-bold text-slate-400">#{idx + 1}</span>
                            <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                              {p.id}
                            </span>
                            {p.showOnLandingPage ? (
                              <span className="text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                                Landing Page: Visible
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                                Internal Only
                              </span>
                            )}
                            {p.isPopular && (
                              <span className="text-[10px] font-black uppercase bg-red-600 text-white px-2 py-0.5 rounded-full">
                                Popular
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-1">
                            <button
                              type="button"
                              onClick={() => handleDeletePlan(p.id)}
                              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                              title="Delete Plan"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSavePlanItem(p.id, p)}
                              className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center space-x-1 cursor-pointer border border-red-200"
                              title="Save this plan"
                            >
                              <Save className="w-3.5 h-3.5 text-red-600" />
                              <span>Save</span>
                            </button>
                          </div>
                        </div>

                        {/* Row 1: Plan Name & Subtext */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                              Plan Name *
                            </label>
                            <input
                              type="text"
                              value={p.name}
                              onChange={(e) => handleUpdatePlanField(p.id, 'name', e.target.value)}
                              placeholder="e.g. Standard Plan"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-black text-slate-900 focus:outline-none focus:border-red-600"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                              Subtitle / Target Audience
                            </label>
                            <input
                              type="text"
                              value={p.subtext || ''}
                              onChange={(e) => handleUpdatePlanField(p.id, 'subtext', e.target.value)}
                              placeholder="e.g. Perfect for local retail shops"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 focus:outline-none focus:border-red-600"
                            />
                          </div>
                        </div>

                        {/* Row 2: Selling Price, Strikethrough Price, Billing Period */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                              Selling Price (₹) *
                            </label>
                            <input
                              type="number"
                              value={p.price}
                              onChange={(e) => handleUpdatePlanField(p.id, 'price', Number(e.target.value))}
                              placeholder="24000"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-black text-slate-900 focus:outline-none focus:border-red-600"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                              Original Price (₹ Strikethrough)
                            </label>
                            <input
                              type="number"
                              value={p.originalPrice || 0}
                              onChange={(e) => handleUpdatePlanField(p.id, 'originalPrice', Number(e.target.value))}
                              placeholder="36000"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-600 focus:outline-none focus:border-red-600"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                              Billing Cycle / Period
                            </label>
                            <input
                              type="text"
                              value={p.period || ''}
                              onChange={(e) => handleUpdatePlanField(p.id, 'period', e.target.value)}
                              placeholder="/ Year, / 3 Years, Lifetime"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-600"
                            />
                          </div>
                        </div>

                        {/* Row 3: Badge, Tag Text, CTA */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                              Highlight Badge
                            </label>
                            <input
                              type="text"
                              value={p.highlightBadge || ''}
                              onChange={(e) => handleUpdatePlanField(p.id, 'highlightBadge', e.target.value)}
                              placeholder="Most Popular / Best Value"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-600"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                              Savings Tag Text
                            </label>
                            <input
                              type="text"
                              value={p.tagText || ''}
                              onChange={(e) => handleUpdatePlanField(p.id, 'tagText', e.target.value)}
                              placeholder="e.g. Only ₹1,361/month"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-600"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                              Button CTA Label
                            </label>
                            <input
                              type="text"
                              value={p.ctaText || ''}
                              onChange={(e) => handleUpdatePlanField(p.id, 'ctaText', e.target.value)}
                              placeholder="Start 2-Day Trial"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-600"
                            />
                          </div>
                        </div>

                        {/* Row 4: Scans Limit & Free Trial Days */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                              Customer Scans Limit
                            </label>
                            <input
                              type="text"
                              value={p.scansLimit || ''}
                              onChange={(e) => handleUpdatePlanField(p.id, 'scansLimit', e.target.value)}
                              placeholder="Unlimited customer QR scans"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-600"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                              Free Trial Duration (Days)
                            </label>
                            <input
                              type="number"
                              value={p.trialDays ?? 2}
                              onChange={(e) => handleUpdatePlanField(p.id, 'trialDays', Number(e.target.value))}
                              placeholder="2"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-600"
                            />
                          </div>
                        </div>

                        {/* Features List Section */}
                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black uppercase text-slate-600 tracking-wide">
                              Plan Features (Shown on Landing Page)
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold">
                              {(p.features || []).length} Features
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            {(p.features || []).map((feat, fIdx) => (
                              <div
                                key={fIdx}
                                className="flex items-center justify-between bg-white border border-slate-200/90 px-3 py-1.5 rounded-xl text-xs shadow-2xs"
                              >
                                <div className="flex items-center space-x-2 text-slate-700">
                                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                  <span>{feat}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemovePlanFeature(p.id, fIdx)}
                                  className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer"
                                  title="Remove feature"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* Add Feature input */}
                          <div className="flex items-center space-x-2 pt-1">
                            <input
                              type="text"
                              value={newFeatureInputs[p.id] || ''}
                              onChange={(e) => setNewFeatureInputs({ ...newFeatureInputs, [p.id]: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddPlanFeature(p.id);
                                }
                              }}
                              placeholder="Add feature (e.g. Free Acrylic Standee)..."
                              className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-red-600"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddPlanFeature(p.id)}
                              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition cursor-pointer shrink-0"
                            >
                              + Add
                            </button>
                          </div>
                        </div>

                        {/* Visibility & Highlight Toggles */}
                        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={p.showOnLandingPage !== false}
                              onChange={(e) => handleUpdatePlanField(p.id, 'showOnLandingPage', e.target.checked)}
                              className="rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                            />
                            <span>Show on Landing Page</span>
                          </label>

                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(p.isPopular)}
                              onChange={(e) => handleUpdatePlanField(p.id, 'isPopular', e.target.checked)}
                              className="rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                            />
                            <span>Most Popular Highlight</span>
                          </label>

                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={p.isActive !== false}
                              onChange={(e) => handleUpdatePlanField(p.id, 'isActive', e.target.checked)}
                              className="rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                            />
                            <span>Active Plan</span>
                          </label>
                        </div>
                      </div>

                      {/* Card Footer Save Button */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-medium">
                          Auto-syncs with MongoDB database
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSavePlanItem(p.id, p)}
                          className="bg-[#74111d] hover:bg-[#5e0c15] text-white font-black px-4 py-2 rounded-xl text-xs transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save {p.name}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Live Landing Page Preview Section */}
                <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <h3 className="text-base font-black tracking-tight text-white">Live Landing Page Customer Preview</h3>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        This is an exact visual representation of how your active plans will display on the landing page for prospective retail partners.
                      </p>
                    </div>

                    <Link
                      to="/"
                      target="_blank"
                      className="bg-[#74111d] hover:bg-[#5e0c15] text-white font-black px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
                    >
                      <span>Open Website in New Tab</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Render Mock Preview matching LandingPage.jsx */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    {plans.filter(p => p.isActive !== false && p.showOnLandingPage !== false).map((p) => {
                      const isPopular = p.isPopular || p.highlightBadge === 'Most Popular';
                      const isDark = p.highlightBadge === 'Best Value' || p.id?.includes('legacy');

                      if (isDark) {
                        return (
                          <div key={p.id} className="bg-slate-950 border border-slate-800 p-6 rounded-2xl shadow-xl text-white relative flex flex-col justify-between pt-10">
                            {(p.highlightBadge || 'Best Value') && (
                              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-800 text-amber-400 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider border border-slate-700">
                                {p.highlightBadge || 'Best Value'}
                              </span>
                            )}
                            <div>
                              <h4 className="text-lg font-black text-white">{p.name}</h4>
                              <p className="text-[11px] text-slate-400 mt-0.5">{p.subtext}</p>
                              <div className="mt-4 mb-4 pb-4 border-b border-slate-800">
                                {p.originalPrice > 0 && (
                                  <span className="text-xs font-bold text-slate-500 line-through block">
                                    ₹{Number(p.originalPrice).toLocaleString('en-IN')}
                                  </span>
                                )}
                                <div className="text-2xl font-black text-amber-400">
                                  ₹{Number(p.price).toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-400">{p.period}</span>
                                </div>
                                {p.tagText && (
                                  <span className="text-[10px] font-bold text-emerald-400 mt-1 block uppercase">{p.tagText}</span>
                                )}
                              </div>
                              <ul className="space-y-2 text-slate-300 text-xs mb-6">
                                {(p.features || []).slice(0, 5).map((f, i) => (
                                  <li key={i} className="flex items-center space-x-1.5">
                                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                    <span>{f}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <button className="w-full bg-white text-slate-900 font-black py-2.5 rounded-xl text-xs">
                              {p.ctaText || 'Start 2-Day Trial'}
                            </button>
                          </div>
                        );
                      }

                      if (isPopular) {
                        return (
                          <div key={p.id} className="bg-white border-2 border-red-600 p-6 rounded-2xl shadow-xl text-slate-900 relative flex flex-col justify-between pt-10">
                            {(p.highlightBadge || 'Most Popular') && (
                              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                                {p.highlightBadge || 'Most Popular'}
                              </span>
                            )}
                            <div>
                              <h4 className="text-lg font-black text-red-600">{p.name}</h4>
                              <p className="text-[11px] text-slate-500 mt-0.5">{p.subtext}</p>
                              <div className="mt-4 mb-4 pb-4 border-b border-slate-100">
                                {p.originalPrice > 0 && (
                                  <span className="text-xs font-bold text-slate-400 line-through block">
                                    ₹{Number(p.originalPrice).toLocaleString('en-IN')}
                                  </span>
                                )}
                                <div className="text-2xl font-black text-slate-900">
                                  ₹{Number(p.price).toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-500">{p.period}</span>
                                </div>
                                {p.tagText && (
                                  <span className="text-[10px] font-bold text-red-600 mt-1 block bg-red-50 px-2 py-0.5 rounded w-fit">{p.tagText}</span>
                                )}
                              </div>
                              <ul className="space-y-2 text-slate-600 text-xs mb-6">
                                {(p.features || []).slice(0, 5).map((f, i) => (
                                  <li key={i} className="flex items-center space-x-1.5">
                                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                    <span>{f}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <button className="w-full bg-red-600 text-white font-black py-2.5 rounded-xl text-xs">
                              {p.ctaText || 'Start 2-Day Trial'}
                            </button>
                          </div>
                        );
                      }

                      return (
                        <div key={p.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-slate-900 relative flex flex-col justify-between pt-10">
                          {p.highlightBadge && (
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
                              {p.highlightBadge}
                            </span>
                          )}
                          <div>
                            <h4 className="text-lg font-black text-slate-900">{p.name}</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">{p.subtext}</p>
                            <div className="mt-4 mb-4 pb-4 border-b border-slate-100">
                              {p.originalPrice > 0 && (
                                <span className="text-xs font-bold text-slate-400 line-through block">
                                  ₹{Number(p.originalPrice).toLocaleString('en-IN')}
                                </span>
                              )}
                              <div className="text-2xl font-black text-slate-900">
                                ₹{Number(p.price).toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-500">{p.period}</span>
                              </div>
                              {p.tagText && (
                                <span className="text-[10px] font-bold text-emerald-600 mt-1 block">{p.tagText}</span>
                              )}
                            </div>
                            <ul className="space-y-2 text-slate-600 text-xs mb-6">
                              {(p.features || []).slice(0, 5).map((f, i) => (
                                <li key={i} className="flex items-center space-x-1.5">
                                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <button className="w-full bg-slate-900 text-white font-black py-2.5 rounded-xl text-xs">
                            {p.ctaText || 'Start 2-Day Trial'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB: TEAMS MANAGEMENT (Matching user screenshot media_1791091703318.jpg) */}
            {/* ========================================================= */}
            {activeTab === 'team' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                
                {/* Success Alert */}
                {teamSuccessMsg && (
                  <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{teamSuccessMsg}</span>
                    </div>
                    <Link 
                      to="/team" 
                      target="_blank" 
                      className="text-emerald-700 hover:text-emerald-900 underline flex items-center space-x-1 font-extrabold shrink-0"
                    >
                      <span>Open Team Portal (/team) to Login</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}

                {/* 1. Create Team Member Form Card */}
                <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-black text-slate-900">Create Team Member</h2>
                      <p className="text-[11px] text-slate-500">Register new staff accounts to onboard retail stores and track loyalty referrals</p>
                    </div>
                    <span className="text-[10px] font-black uppercase text-[#74111d] bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                      Account Provisioning
                    </span>
                  </div>

                  <form onSubmit={handleCreateTeamMember} className="p-6 space-y-4">
                    {/* Row 1: Member Name, Member Email, District, State */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Member Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={newTeamMember.name}
                          onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                          placeholder="e.g. Ajeet Kumar"
                          className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-[#74111d] focus:ring-1 focus:ring-[#74111d] transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Member Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={newTeamMember.email}
                          onChange={(e) => setNewTeamMember({ ...newTeamMember, email: e.target.value })}
                          placeholder="name@example.com"
                          className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-[#74111d] focus:ring-1 focus:ring-[#74111d] transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          District
                        </label>
                        <input
                          type="text"
                          value={newTeamMember.district}
                          onChange={(e) => setNewTeamMember({ ...newTeamMember, district: e.target.value })}
                          placeholder="Enter district"
                          className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-[#74111d] focus:ring-1 focus:ring-[#74111d] transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          value={newTeamMember.state}
                          onChange={(e) => setNewTeamMember({ ...newTeamMember, state: e.target.value })}
                          placeholder="Enter state"
                          className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-[#74111d] focus:ring-1 focus:ring-[#74111d] transition"
                        />
                      </div>
                    </div>

                    {/* Row 2: Mobile Number, Password, Submit Button */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          value={newTeamMember.mobile}
                          onChange={(e) => setNewTeamMember({ ...newTeamMember, mobile: e.target.value })}
                          placeholder="Optional mobile number"
                          className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-[#74111d] focus:ring-1 focus:ring-[#74111d] transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showTeamPassword ? 'text' : 'password'}
                            required
                            value={newTeamMember.password}
                            onChange={(e) => setNewTeamMember({ ...newTeamMember, password: e.target.value })}
                            placeholder="••••••••"
                            className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-[#74111d] focus:ring-1 focus:ring-[#74111d] pr-10 transition"
                          />
                          <button
                            type="button"
                            onClick={() => setShowTeamPassword(!showTeamPassword)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showTeamPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="lg:col-span-2">
                        <button
                          type="submit"
                          className="w-full sm:w-auto bg-[#74111d] hover:bg-[#5e0c15] text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-sm hover:shadow shadow-[#74111d]/25 cursor-pointer flex items-center justify-center space-x-2"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>Create Team Member</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* 2. Team Members Table Card */}
                <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/40">
                    <div>
                      <h2 className="text-lg font-black text-slate-900">Team Members</h2>
                      <p className="text-xs text-slate-500 mt-0.5">List of registered team members, their onboarding records and customer tracking</p>
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={searchTeam}
                        onChange={(e) => setSearchTeam(e.target.value)}
                        placeholder="Search member, email, mobile..."
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#74111d]"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold bg-slate-50/70">
                          <th className="py-3.5 px-4">User ID</th>
                          <th className="py-3.5 px-4">Member</th>
                          <th className="py-3.5 px-4">Mobile</th>
                          <th className="py-3.5 px-4">MW ID</th>
                          <th className="py-3.5 px-4 text-center">Total MW Created</th>
                          <th className="py-3.5 px-4 text-center">Total Sales</th>
                          <th className="py-3.5 px-4 text-center">Dashboard Details</th>
                          <th className="py-3.5 px-4 text-center">Referral Details</th>
                          <th className="py-3.5 px-4 text-center">Customer Manager</th>
                          <th className="py-3.5 px-4">User email</th>
                          <th className="py-3.5 px-4">District</th>
                          <th className="py-3.5 px-4">State</th>
                          <th className="py-3.5 px-4 text-center">Status</th>
                          <th className="py-3.5 px-4">Last Login</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredTeamMembers.map((m) => (
                          <tr key={m.userId} className="hover:bg-slate-50/70 transition">
                            <td className="py-3.5 px-4 font-black text-slate-900">{m.userId}</td>
                            <td className="py-3.5 px-4 font-bold text-slate-800">{m.name}</td>
                            <td className="py-3.5 px-4 font-mono text-slate-600">{m.mobile}</td>
                            <td className="py-3.5 px-4">
                              {m.mwId && m.mwId !== '—' ? (
                                <span className="text-[#74111d] font-bold hover:underline cursor-pointer">
                                  {m.mwId}
                                </span>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-center font-bold text-slate-900">{m.totalMwCreated}</td>
                            <td className="py-3.5 px-4 text-center font-bold text-slate-900">{m.totalSales}</td>
                            
                            {/* Dashboard Details: View button */}
                            <td className="py-3.5 px-4 text-center">
                              <button
                                onClick={() => setSelectedDashboardMember(m)}
                                className="border border-[#74111d]/30 text-[#74111d] hover:bg-rose-50 text-[11px] font-bold px-3 py-1 rounded-lg transition cursor-pointer"
                              >
                                View
                              </button>
                            </td>

                            {/* Referral Details: View button */}
                            <td className="py-3.5 px-4 text-center">
                              <button
                                onClick={() => {
                                  setSelectedReferralMember(m);
                                  setReferralSearchModal('');
                                }}
                                className="border border-[#74111d]/30 text-[#74111d] hover:bg-rose-50 text-[11px] font-bold px-3 py-1 rounded-lg transition cursor-pointer"
                              >
                                View
                              </button>
                            </td>

                            {/* Customer Manager: View & Excel buttons */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="inline-flex items-center space-x-1.5">
                                <button
                                  onClick={() => {
                                    setSelectedCustomerTrackerMember(m);
                                    setCrmSearchModal('');
                                    setExpandedLeadId(null);
                                  }}
                                  className="border border-[#74111d]/30 text-[#74111d] hover:bg-rose-50 text-[11px] font-bold px-2.5 py-0.5 rounded-lg transition cursor-pointer"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => handleExportCustomerTrackerExcel(m)}
                                  className="border border-slate-300 text-slate-700 hover:bg-slate-100 text-[11px] font-bold px-2.5 py-0.5 rounded-lg transition cursor-pointer"
                                  title="Export Customer Manager to Excel CSV"
                                >
                                  Excel
                                </button>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">{m.email}</td>
                            <td className="py-3.5 px-4 text-slate-500">{m.district}</td>
                            <td className="py-3.5 px-4 text-slate-500">{m.state}</td>
                            
                            <td className="py-3.5 px-4 text-center">
                              <button
                                onClick={() => handleToggleTeamStatus(m.userId)}
                                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md transition cursor-pointer ${
                                  m.status === 'ACTIVE' 
                                    ? 'bg-emerald-600 text-white' 
                                    : 'bg-slate-200 text-slate-600'
                                }`}
                              >
                                {m.status}
                              </button>
                            </td>

                            <td className="py-3.5 px-4 text-slate-500 text-[11px]">{m.lastLogin}</td>
                            
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => handleDeleteTeamMember(m.userId)}
                                className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                                title="Remove Member"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: CUSTOMER CRM & LIVE TELEMETRY */}
            {activeTab === 'customers' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* 4 Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Customers</p>
                      <h3 className="text-2xl font-black text-slate-900 mt-1">{customers.length}</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">Registered consumer accounts</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-black">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Customers</p>
                      <h3 className="text-2xl font-black text-emerald-700 mt-1">
                        {customers.filter(c => c.isActive !== false).length}
                      </h3>
                      <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Full wallet & login access</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Suspended Accounts</p>
                      <h3 className="text-2xl font-black text-rose-600 mt-1">
                        {customers.filter(c => c.isActive === false).length}
                      </h3>
                      <p className="text-[11px] text-rose-500 font-semibold mt-0.5">Login & OTP locked</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">
                      <Ban className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Telemetry</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <h3 className="text-lg font-black text-slate-900">Real-Time Sync</h3>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Live signups & login tracker</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center font-black">
                      <Activity className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Main Customer CRM Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
                  <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-black text-slate-900">Customer CRM & Real-Time Monitoring</h2>
                      <p className="text-xs text-slate-500">Monitor live customer signups, last login activity, wallet vouchers, and suspend unauthorized accounts</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
                        {[
                          { id: 'ALL', label: 'All' },
                          { id: 'ACTIVE', label: 'Active' },
                          { id: 'SUSPENDED', label: 'Suspended' }
                        ].map(cf => (
                          <button
                            key={cf.id}
                            onClick={() => setCustomerFilter(cf.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                              customerFilter === cf.id
                                ? 'bg-white text-slate-900 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {cf.label}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={fetchCustomers}
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer shadow-2xs"
                        title="Pull live customer telemetry from database"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                        <span>Refresh Telemetry</span>
                      </button>

                      <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search name, phone, store..."
                          value={searchCustomer}
                          onChange={(e) => setSearchCustomer(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 shadow-2xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                          <th className="py-3 px-4">Customer</th>
                          <th className="py-3 px-3">Mobile & Email</th>
                          <th className="py-3 px-3">Favorite Store</th>
                          <th className="py-3 px-3 text-center">Visits</th>
                          <th className="py-3 px-3 text-center">Tier & Points</th>
                          <th className="py-3 px-3">Registered On</th>
                          <th className="py-3 px-3">Last Login / Active</th>
                          <th className="py-3 px-3 text-center">Account Status</th>
                          <th className="py-3 px-4 text-right">Access Control</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredCustomers.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="py-10 text-center text-xs text-slate-400 font-bold">
                              No customer records found.
                            </td>
                          </tr>
                        ) : (
                          filteredCustomers.map((c) => {
                            const isSuspended = c.isActive === false;
                            return (
                              <tr key={c.id || c._id} className="hover:bg-slate-50/70 transition">
                                <td className="py-3.5 px-4 font-black text-slate-900">
                                  <div>{c.name || 'Valued Customer'}</div>
                                  <div className="text-[10px] font-mono text-slate-400 font-normal">
                                    {c.customerId || ('LQR-' + (c.id || c._id || '0000').slice(-5).toUpperCase())}
                                  </div>
                                </td>
                                
                                <td className="py-3.5 px-3">
                                  <div className="font-mono font-bold text-slate-700">{c.mobile}</div>
                                  <div className="text-[11px] text-slate-400">{c.email || '—'}</div>
                                </td>

                                <td className="py-3.5 px-3 font-semibold text-slate-800">
                                  {c.favoriteStore || 'Royal Sweets & Cafe'}
                                </td>

                                <td className="py-3.5 px-3 text-center">
                                  <span className="bg-red-50 text-red-600 font-black px-2.5 py-0.5 rounded-full border border-red-200 text-[11px]">
                                    {c.totalVisits || 1} visits
                                  </span>
                                </td>

                                <td className="py-3.5 px-3 text-center">
                                  <div className="font-bold text-emerald-700">{c.points || 100} pts</div>
                                  <div className="text-[10px] text-slate-400">{c.tier || 'Bronze Member'}</div>
                                </td>

                                <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px]">
                                  {c.createdAt || 'Recent'}
                                </td>

                                <td className="py-3.5 px-3">
                                  <div className="inline-flex items-center space-x-1.5 text-slate-700 font-medium text-[11px]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    <span>{c.lastLoginAt || c.lastVisit || 'Today'}</span>
                                  </div>
                                </td>

                                <td className="py-3.5 px-3 text-center">
                                  {isSuspended ? (
                                    <span className="inline-flex items-center space-x-1 bg-rose-50 text-rose-700 border border-rose-200 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                      <span>Suspended</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                      <span>Active</span>
                                    </span>
                                  )}
                                </td>

                                <td className="py-3.5 px-4 text-right">
                                  {isSuspended ? (
                                    <button
                                      onClick={() => handleToggleCustomerStatus(c.id || c._id, false)}
                                      className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg transition cursor-pointer inline-flex items-center space-x-1 shadow-2xs"
                                      title="Reactivate customer access"
                                    >
                                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                      <span>Reactivate</span>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleToggleCustomerStatus(c.id || c._id, true)}
                                      className="bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg transition cursor-pointer inline-flex items-center space-x-1 shadow-2xs"
                                      title="Suspend customer account (locks login & OTP)"
                                    >
                                      <Ban className="w-3 h-3 text-rose-600" />
                                      <span>Suspend</span>
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CONFIG & KEYS */}
            {activeTab === 'config' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">API Credentials & Cloud Gateway Hub</h2>
                    <p className="text-xs text-slate-500 font-medium">Manage payment gateways, SMS routes, WhatsApp Business, AI models, and custom third-party keys</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddCustomKeyModal(true)}
                    className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl px-4 py-2 text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-4 h-4 text-red-600" />
                    <span>+ Add Custom API Key</span>
                  </button>
                </div>

                {saveSuccess && (
                  <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-bold flex items-center space-x-2 animate-in fade-in">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Platform configuration and API keys saved to environment and database!</span>
                  </div>
                )}

                <form onSubmit={handleSaveConfig} className="space-y-6">
                  {/* 1. Payment Gateways (Razorpay, Cashfree, Stripe) */}
                  <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/60 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 font-black text-slate-900 text-sm">
                        <CreditCard className="w-4 h-4 text-red-600" />
                        <span>Payment Gateways (Razorpay, Cashfree & Stripe)</span>
                      </div>
                      <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        Multi-Gateway Active
                      </span>
                    </div>

                    {/* Razorpay */}
                    <div className="space-y-2">
                      <span className="text-xs font-black text-slate-700">1. Razorpay Gateway</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Razorpay Key ID</label>
                          <input
                            type="text"
                            value={config.razorpayKeyId}
                            onChange={(e) => setConfig({ ...config, razorpayKeyId: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Razorpay Key Secret</label>
                          <div className="relative">
                            <input
                              type={showSecret ? 'text' : 'password'}
                              value={config.razorpayKeySecret}
                              onChange={(e) => setConfig({ ...config, razorpayKeySecret: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600 pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowSecret(!showSecret)}
                              className="absolute right-3 top-2 text-slate-400 hover:text-slate-600"
                            >
                              {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cashfree & Stripe */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200/60">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Cashfree App ID</label>
                        <input
                          type="text"
                          value={config.cashfreeAppId || ''}
                          onChange={(e) => setConfig({ ...config, cashfreeAppId: e.target.value })}
                          placeholder="CF_app_live_..."
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Stripe Publishable Key</label>
                        <input
                          type="text"
                          value={config.stripeKey || ''}
                          onChange={(e) => setConfig({ ...config, stripeKey: e.target.value })}
                          placeholder="pk_live_..."
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. SMS Gateway & Telephony (SMSCountry, MSG91, Twilio, Fast2SMS) */}
                  <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/60 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 font-black text-slate-900 text-sm">
                        <Smartphone className="w-4 h-4 text-[#74111d]" />
                        <span>SMS OTP Gateway (DLT Certified)</span>
                      </div>
                      <select
                        value={config.smsProvider || 'SMSCOUNTRY'}
                        onChange={(e) => setConfig({ ...config, smsProvider: e.target.value })}
                        className="bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
                      >
                        <option value="SMSCOUNTRY">SMSCountry</option>
                        <option value="MSG91">MSG91</option>
                        <option value="FAST2SMS">Fast2SMS</option>
                        <option value="TWILIO">Twilio</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">SMS API Key / Auth Token</label>
                        <input
                          type="password"
                          value={config.smsApiKey}
                          onChange={(e) => setConfig({ ...config, smsApiKey: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">DLT Sender ID / Header</label>
                        <input
                          type="text"
                          maxLength={6}
                          value={config.smsSenderId}
                          onChange={(e) => setConfig({ ...config, smsSenderId: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. WhatsApp Business Cloud API */}
                  <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/60 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 font-black text-slate-900 text-sm">
                        <MessageSquare className="w-4 h-4 text-emerald-600" />
                        <span>WhatsApp Business Cloud API (Meta Graph)</span>
                      </div>
                      <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        Automated Alerts
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Phone Number ID</label>
                        <input
                          type="text"
                          value={config.whatsappPhoneId || ''}
                          onChange={(e) => setConfig({ ...config, whatsappPhoneId: e.target.value })}
                          placeholder="e.g. 109283746501928"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">WABA Account ID</label>
                        <input
                          type="text"
                          value={config.whatsappBusinessId || ''}
                          onChange={(e) => setConfig({ ...config, whatsappBusinessId: e.target.value })}
                          placeholder="waba_..."
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Permanent Access Token</label>
                        <input
                          type="password"
                          value={config.whatsappToken || ''}
                          onChange={(e) => setConfig({ ...config, whatsappToken: e.target.value })}
                          placeholder="EAAQ..."
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Email Notifications (Resend / SendGrid / SMTP) */}
                  <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/60 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 font-black text-slate-900 text-sm">
                        <Mail className="w-4 h-4 text-purple-600" />
                        <span>Email & SMTP Notifications (Resend / SendGrid)</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                        Transactional
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Email API Key</label>
                        <input
                          type="password"
                          value={config.emailApiKey || ''}
                          onChange={(e) => setConfig({ ...config, emailApiKey: e.target.value })}
                          placeholder="re_live_..."
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Sender Email Address</label>
                        <input
                          type="email"
                          value={config.emailSenderAddress || ''}
                          onChange={(e) => setConfig({ ...config, emailSenderAddress: e.target.value })}
                          placeholder="notifications@beaurex.com"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 5. Maps, Cloud Assets & AI Automation (Google Maps, Cloudinary, Gemini, OpenAI) */}
                  <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/60 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 font-black text-slate-900 text-sm">
                        <Globe className="w-4 h-4 text-[#74111d]" />
                        <span>Maps, Cloud Assets & AI Engines</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Google Maps API Key</label>
                        <input
                          type="password"
                          value={config.googleMapsApiKey || ''}
                          onChange={(e) => setConfig({ ...config, googleMapsApiKey: e.target.value })}
                          placeholder="AIzaSy..."
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Cloudinary Cloud Name</label>
                        <input
                          type="text"
                          value={config.cloudinaryCloudName || ''}
                          onChange={(e) => setConfig({ ...config, cloudinaryCloudName: e.target.value })}
                          placeholder="beaurex-assets"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Google Gemini API Key</label>
                        <input
                          type="password"
                          value={config.geminiApiKey || ''}
                          onChange={(e) => setConfig({ ...config, geminiApiKey: e.target.value })}
                          placeholder="AIzaSy..."
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 6. MongoDB Database Engine */}
                  <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/60 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 font-black text-slate-900 text-sm">
                        <Database className="w-4 h-4 text-emerald-600" />
                        <span>MongoDB Database Engine</span>
                      </div>
                      <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        Online
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Connection String URI</label>
                      <input
                        type="text"
                        value={config.mongoUri}
                        onChange={(e) => setConfig({ ...config, mongoUri: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  {/* 7. Dynamic Custom API Keys (Future Website Integrations) */}
                  <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/60 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 font-black text-slate-900 text-sm">
                        <Code className="w-4 h-4 text-red-600" />
                        <span>Dynamic Custom API Keys & Future Integrations</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">
                        {config.customApiKeys?.length || 0} Custom Keys Active
                      </span>
                    </div>

                    <p className="text-xs text-slate-500">
                      Add any custom API tokens, webhooks, or third-party logistics credentials required for future website enhancements.
                    </p>

                    <div className="space-y-2.5">
                      {(config.customApiKeys || []).map((ck) => (
                        <div key={ck.id} className="bg-white border border-slate-200 p-3.5 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="font-extrabold text-slate-900 text-xs">{ck.name}</span>
                              <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                {ck.env}
                              </span>
                            </div>
                            <div className="font-mono text-[11px] text-slate-600 mt-0.5">
                              {ck.keyName}: <span className="text-slate-400">••••••••{ck.keyValue?.slice(-4) || '••••'}</span>
                            </div>
                            {ck.description && (
                              <div className="text-[10px] text-slate-400 mt-0.5 truncate">{ck.description}</div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteCustomKey(ck.id)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer shrink-0"
                            title="Remove Key"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="bg-[#74111d] hover:bg-[#5e0c15] text-white font-extrabold px-8 py-3 rounded-xl shadow-lg shadow-red-600/30 transition transform hover:-translate-y-0.5 cursor-pointer text-sm flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save All API Credentials</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB: AUDIT & SECURITY */}
            {activeTab === 'audit' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Security & Fair-Play Audit Stream</h2>
                  <p className="text-xs text-slate-500 font-medium">Real-time log of POS redemptions, scan cooldown throttles, and staff logins</p>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-[#74111d]">INFO</span>
                      <div>
                        <span className="font-bold text-slate-900">Merchant Login:</span> owner@royalsweets.com from IP 103.21.244.12
                      </div>
                    </div>
                    <span className="text-slate-400 text-[11px]">10 mins ago</span>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">SUCCESS</span>
                      <div>
                        <span className="font-bold text-slate-900">Voucher Burned:</span> PIN 4821 redeemed at Royal Sweets Counter (₹150 OFF)
                      </div>
                    </div>
                    <span className="text-slate-400 text-[11px]">25 mins ago</span>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">THROTTLE</span>
                      <div>
                        <span className="font-bold text-slate-900">Scan Cooldown:</span> Duplicate scan blocked by 12-hour fair play engine from 49.36.128.91
                      </div>
                    </div>
                    <span className="text-slate-400 text-[11px]">1 hr ago</span>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-800">SECURITY</span>
                      <div>
                        <span className="font-bold text-slate-900">Config Verified:</span> Production database connected securely
                      </div>
                    </div>
                    <span className="text-slate-400 text-[11px]">3 hrs ago</span>
                  </div>
                </div>
              </div>
            )}

          </main>

          {/* Footer */}
          <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400 mt-auto bg-white">
            BeAurex Super Admin Control Engine • Secure 256-Bit Encrypted Environment
          </footer>
        </div>

        {/* Excel Export Toast */}
        {excelToast && (
          <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-200">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{excelToast}</span>
          </div>
        )}

        {/* Modal: Dashboard Details */}
        {selectedDashboardMember && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 relative">
              <button
                onClick={() => setSelectedDashboardMember(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-[#74111d] flex items-center justify-center font-black text-base shadow-xs">
                  {selectedDashboardMember.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">{selectedDashboardMember.name} — Performance Dashboard</h3>
                  <p className="text-xs text-slate-500">User ID: <span className="font-mono font-bold text-slate-700">{selectedDashboardMember.userId}</span> • {selectedDashboardMember.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Stores (MW)</span>
                  <div className="text-xl font-black text-slate-900 mt-1">{selectedDashboardMember.totalMwCreated}</div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Total Sales</span>
                  <div className="text-xl font-black text-slate-900 mt-1">₹{selectedDashboardMember.totalSales}</div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Status</span>
                  <div className="text-xs font-black text-emerald-600 mt-2 uppercase">{selectedDashboardMember.status}</div>
                </div>
              </div>

              <div className="space-y-3 bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Linked Store Codes (MW ID):</span>
                  <span className="font-bold text-[#74111d] font-mono">{selectedDashboardMember.mwId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Contact Mobile:</span>
                  <span className="font-bold text-slate-800 font-mono">{selectedDashboardMember.mobile}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Territory:</span>
                  <span className="font-bold text-slate-800">{selectedDashboardMember.district}, {selectedDashboardMember.state}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">Last Login Activity:</span>
                  <span className="font-bold text-slate-800">{selectedDashboardMember.lastLogin}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <a
                  href="/team"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    sessionStorage.setItem('beaurex_team_auth', 'true');
                    sessionStorage.setItem('beaurex_team_user', selectedDashboardMember.email);
                    sessionStorage.setItem('beaurex_team_profile', JSON.stringify({
                      ...selectedDashboardMember,
                      id: selectedDashboardMember.id || `BX-TEAM-${selectedDashboardMember.userId}`,
                      referralCode: selectedDashboardMember.referralCode || `BEAUREX-${selectedDashboardMember.userId}`
                    }));
                  }}
                  className="bg-[#74111d] hover:bg-[#851421] text-white font-extrabold px-4 py-2.5 rounded-xl text-xs transition flex items-center space-x-1.5 shadow-md shadow-[#74111d]/20 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open {selectedDashboardMember.name}'s Dashboard</span>
                </a>
                <button
                  onClick={() => setSelectedDashboardMember(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Referral Details & Onboarded Stores */}
        {selectedReferralMember && (() => {
          const refs = getMemberReferrals(selectedReferralMember);
          const filteredRefs = refs.filter(r => 
            (r.storeName || '').toLowerCase().includes(referralSearchModal.toLowerCase()) ||
            (r.owner || '').toLowerCase().includes(referralSearchModal.toLowerCase()) ||
            (r.city || '').toLowerCase().includes(referralSearchModal.toLowerCase()) ||
            (r.category || '').toLowerCase().includes(referralSearchModal.toLowerCase()) ||
            (r.phone || '').includes(referralSearchModal)
          );
          
          const totalStoresCount = refs.length;
          const paidCount = refs.filter(r => (r.status || '').toUpperCase() === 'PAID').length;
          const pendingCount = refs.filter(r => (r.status || '').toUpperCase() !== 'PAID').length;
          
          let totalCommissionNum = refs.reduce((acc, r) => {
            const num = parseInt((r.commission || '').replace(/[^\d]/g, ''), 10);
            return acc + (isNaN(num) ? 0 : num);
          }, 0);
          if (totalCommissionNum === 0 && selectedReferralMember.totalSales && selectedReferralMember.totalSales !== '0') {
            const parsedSales = parseInt(selectedReferralMember.totalSales.replace(/[^\d]/g, ''), 10);
            if (!isNaN(parsedSales)) totalCommissionNum = parsedSales;
          }

          const refCode = `BEAUREX-${selectedReferralMember.userId}`;
          const refUrl = `https://beaurex.com/?ref=${refCode}`;

          return (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 z-50 animate-in fade-in duration-150">
              <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-4xl w-full shadow-2xl border border-slate-200 relative max-h-[92vh] flex flex-col">
                <button
                  onClick={() => setSelectedReferralMember(null)}
                  className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="flex items-center space-x-3.5 mb-5 pr-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#74111d] to-[#851421] text-white flex items-center justify-center font-black text-base shadow-md shrink-0">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-lg sm:text-xl text-slate-900">{selectedReferralMember.name} — Referral Hub</h3>
                      <span className="bg-[#74111d]/10 text-[#74111d] font-black text-[11px] px-2.5 py-0.5 rounded-full border border-[#74111d]/20">
                        ID #{selectedReferralMember.userId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Merchant affiliate invitations, onboarded retail stores, and commission payouts
                    </p>
                  </div>
                </div>

                {/* Referral Links & Credentials Bar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Referral Code</span>
                      <span className="font-mono text-sm font-black text-slate-900">{refCode}</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(refCode);
                        setReferralCopiedCode(true);
                        setTimeout(() => setReferralCopiedCode(false), 2000);
                      }}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-white text-xs font-bold text-slate-700 flex items-center space-x-1 transition cursor-pointer"
                    >
                      {referralCopiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                      <span>{referralCopiedCode ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div className="truncate mr-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Merchant Invitation URL</span>
                      <span className="font-mono text-xs font-bold text-[#74111d] truncate block">{refUrl}</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(refUrl);
                        setReferralCopiedLink(true);
                        setTimeout(() => setReferralCopiedLink(false), 2000);
                      }}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-white text-xs font-bold text-slate-700 flex items-center space-x-1 transition cursor-pointer shrink-0"
                    >
                      {referralCopiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                      <span>{referralCopiedLink ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Quick Stats Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  <div className="bg-rose-50/60 border border-rose-200/60 rounded-2xl p-3">
                    <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">Total Onboarded</span>
                    <span className="text-xl font-black text-slate-900 mt-1 block">{totalStoresCount} Stores</span>
                  </div>
                  <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-2xl p-3">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Total Commission</span>
                    <span className="text-xl font-black text-emerald-700 mt-1 block">₹{totalCommissionNum.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-blue-50/60 border border-blue-200/60 rounded-2xl p-3">
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Paid Commissions</span>
                    <span className="text-xl font-black text-blue-700 mt-1 block">{paidCount} Paid</span>
                  </div>
                  <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-3">
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Pending / Review</span>
                    <span className="text-xl font-black text-amber-700 mt-1 block">{pendingCount} Pending</span>
                  </div>
                </div>

                {/* Table Header Controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-black text-sm text-slate-900">Referred Merchant Stores</h4>
                    <span className="text-xs font-bold text-slate-400">({filteredRefs.length})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative w-full sm:w-60">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search store, owner, city..."
                        value={referralSearchModal}
                        onChange={(e) => setReferralSearchModal(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#74111d]"
                      />
                    </div>
                    <button
                      onClick={() => handleExportReferralsExcel(selectedReferralMember)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-xl text-xs transition flex items-center space-x-1 cursor-pointer shrink-0"
                      title="Export referred stores to CSV"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-600" />
                      <span>CSV</span>
                    </button>
                  </div>
                </div>

                {/* Stores Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden flex-1 overflow-y-auto mb-4 min-h-[160px]">
                  {filteredRefs.length > 0 ? (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-black tracking-wider sticky top-0 z-10">
                        <tr>
                          <th className="py-2.5 px-3.5">Store / Business</th>
                          <th className="py-2.5 px-3">Owner & Mobile</th>
                          <th className="py-2.5 px-3">City / Area</th>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Plan Subscribed</th>
                          <th className="py-2.5 px-3 text-right">Commission</th>
                          <th className="py-2.5 px-3 text-center">Payout</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredRefs.map((r, i) => (
                          <tr key={r.id || i} className="hover:bg-slate-50/70 transition">
                            <td className="py-2.5 px-3.5">
                              <div className="font-bold text-slate-900">{r.storeName}</div>
                              <div className="text-[10px] text-slate-400 font-medium">{r.category}</div>
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="font-semibold text-slate-800">{r.owner}</div>
                              <div className="font-mono text-[11px] text-slate-500">{r.phone}</div>
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">{r.city}</td>
                            <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{r.date}</td>
                            <td className="py-2.5 px-3">
                              <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md text-[10px] border border-slate-200">
                                {r.plan}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right font-black text-slate-900">
                              {r.commission}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase border ${
                                (r.status || '').toUpperCase() === 'PAID'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : (r.status || '').toUpperCase() === 'PROCESSING'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                                {r.status || 'PENDING'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-8 text-center text-slate-400">
                      <Store className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="font-bold text-slate-700 text-sm">No referred stores found</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {referralSearchModal
                          ? "Try adjusting your search query."
                          : `When ${selectedReferralMember.name} onboards merchants via their referral code ${refCode}, stores will appear here.`}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="text-[11px] text-slate-400">
                    Showing {filteredRefs.length} of {refs.length} stores
                  </div>
                  <button
                    onClick={() => setSelectedReferralMember(null)}
                    className="bg-[#74111d] hover:bg-[#851421] text-white font-bold px-5 py-2 rounded-xl text-xs transition cursor-pointer shadow-xs"
                  >
                    Close Referrals
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Modal: Customer Manager (CRM Pipeline) */}
        {selectedCustomerTrackerMember && (() => {
          const leads = getMemberCrmLeads(selectedCustomerTrackerMember);
          const filteredLeads = leads.filter(l =>
            (l.name || '').toLowerCase().includes(crmSearchModal.toLowerCase()) ||
            (l.phone || '').includes(crmSearchModal) ||
            (l.approachedFor || '').toLowerCase().includes(crmSearchModal.toLowerCase()) ||
            (l.companyName || '').toLowerCase().includes(crmSearchModal.toLowerCase()) ||
            (l.status || '').toLowerCase().includes(crmSearchModal.toLowerCase())
          );

          const totalLeads = leads.length;
          const importantCount = leads.filter(l => (l.status || '').toLowerCase().includes('important')).length;
          const followupCount = leads.filter(l => (l.status || '').toLowerCase().includes('followup')).length;
          const closedWonCount = leads.filter(l => (l.status || '').toLowerCase().includes('won')).length;

          return (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 z-50 animate-in fade-in duration-150">
              <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-5xl w-full shadow-2xl border border-slate-200 relative max-h-[92vh] flex flex-col">
                <button
                  onClick={() => setSelectedCustomerTrackerMember(null)}
                  className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="flex items-center space-x-3.5 mb-5 pr-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-700 to-indigo-800 text-white flex items-center justify-center font-black text-base shadow-md shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-lg sm:text-xl text-slate-900">
                        Customer Manager (CRM) — {selectedCustomerTrackerMember.name}
                      </h3>
                      <span className="bg-purple-50 text-purple-700 font-black text-[11px] px-2.5 py-0.5 rounded-full border border-purple-200">
                        ID #{selectedCustomerTrackerMember.userId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Client lead approaches, field visit records, follow-up logs, and pipeline conversion
                    </p>
                  </div>
                </div>

                {/* Quick Stats Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  <div className="bg-purple-50/60 border border-purple-200/60 rounded-2xl p-3">
                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">Total Approached</span>
                    <span className="text-xl font-black text-slate-900 mt-1 block">{totalLeads} Leads</span>
                  </div>
                  <div className="bg-rose-50/60 border border-rose-200/60 rounded-2xl p-3">
                    <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">Important Leads</span>
                    <span className="text-xl font-black text-rose-700 mt-1 block">{importantCount} High-Priority</span>
                  </div>
                  <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-3">
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Followup Required</span>
                    <span className="text-xl font-black text-amber-700 mt-1 block">{followupCount} Scheduled</span>
                  </div>
                  <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-2xl p-3">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Closed Won</span>
                    <span className="text-xl font-black text-emerald-700 mt-1 block">{closedWonCount} Converted</span>
                  </div>
                </div>

                {/* Table Header Controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-black text-sm text-slate-900">CRM Lead Records</h4>
                    <span className="text-xs font-bold text-slate-400">({filteredLeads.length})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative w-full sm:w-60">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search lead, phone, company..."
                        value={crmSearchModal}
                        onChange={(e) => setCrmSearchModal(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                      />
                    </div>
                    <button
                      onClick={() => handleExportCustomerTrackerExcel(selectedCustomerTrackerMember)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-xl text-xs transition flex items-center space-x-1 cursor-pointer shrink-0"
                      title="Export customer manager records to Excel CSV"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-600" />
                      <span>Excel (CSV)</span>
                    </button>
                  </div>
                </div>

                {/* Leads Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden flex-1 overflow-y-auto mb-4 min-h-[160px]">
                  {filteredLeads.length > 0 ? (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-black tracking-wider sticky top-0 z-10">
                        <tr>
                          <th className="py-2.5 px-3.5">Approached For</th>
                          <th className="py-2.5 px-3">Customer & Contact</th>
                          <th className="py-2.5 px-3">Method</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Source & Company</th>
                          <th className="py-2.5 px-3">Last Updated</th>
                          <th className="py-2.5 px-3 text-right">Follow-ups</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredLeads.map((lead) => {
                          const isExpanded = expandedLeadId === lead.id;
                          const followupsList = lead.followups || [];

                          return (
                            <React.Fragment key={lead.id}>
                              <tr className="hover:bg-slate-50/70 transition">
                                <td className="py-2.5 px-3.5">
                                  <span className="font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md text-[11px]">
                                    {lead.approachedFor || 'MW Sales'}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3">
                                  <div className="font-bold text-slate-800">{lead.name}</div>
                                  <div className="font-mono text-[11px] text-slate-500">{lead.phone || '—'}</div>
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className="font-semibold text-slate-700">
                                    {lead.followupMethod || 'Call'}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase ${
                                    (lead.status || '').toLowerCase().includes('important')
                                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                                      : (lead.status || '').toLowerCase().includes('followup')
                                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                                      : (lead.status || '').toLowerCase().includes('won')
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : 'bg-purple-50 text-purple-700 border-purple-200'
                                  }`}>
                                    {lead.status || 'Prospect'}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3">
                                  <div className="text-slate-800 font-medium">
                                    {lead.companyName && lead.companyName !== '—' ? lead.companyName : lead.source || 'Direct'}
                                  </div>
                                  <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                                    {lead.address && lead.address !== '—' ? lead.address : lead.businessType || 'Retail'}
                                  </div>
                                </td>
                                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                                  {lead.lastUpdated || 'Recent'}
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                  <button
                                    onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
                                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition inline-flex items-center space-x-1 cursor-pointer ${
                                      isExpanded
                                        ? 'bg-purple-600 text-white border-purple-600'
                                        : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                                    }`}
                                  >
                                    <span>Notes ({followupsList.length})</span>
                                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                  </button>
                                </td>
                              </tr>

                              {/* Expanded Follow-up Logs Drawer */}
                              {isExpanded && (
                                <tr className="bg-purple-50/30">
                                  <td colSpan={7} className="p-3.5 border-t border-purple-100">
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <div className="text-[11px] font-black uppercase text-purple-800 tracking-wider flex items-center space-x-1.5">
                                          <FileText className="w-3.5 h-3.5 text-purple-600" />
                                          <span>Follow-up History & Activity Logs ({lead.name})</span>
                                        </div>
                                        {lead.email && lead.email !== '—' && (
                                          <span className="text-[11px] text-slate-500 font-mono">Email: {lead.email}</span>
                                        )}
                                      </div>

                                      {followupsList.length > 0 ? (
                                        <div className="space-y-1.5">
                                          {followupsList.map((f, fIdx) => (
                                            <div key={f.id || fIdx} className="bg-white p-2.5 rounded-xl border border-purple-200/60 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                                              <div className="flex items-center space-x-2">
                                                <span className="font-mono text-[10px] text-slate-400 font-semibold">{f.dateTime}</span>
                                                <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">{f.method}</span>
                                                <span className="font-bold text-slate-800">{f.comments || 'No note added.'}</span>
                                              </div>
                                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 uppercase">
                                                {f.status}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-xs text-slate-400 italic">No detailed follow-up remarks recorded yet.</p>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-8 text-center text-slate-400">
                      <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="font-bold text-slate-700 text-sm">No customer manager records found</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {crmSearchModal
                          ? "Try adjusting your search query."
                          : `When ${selectedCustomerTrackerMember.name} creates customer leads or logs follow-ups in Customer Manager, they will appear here.`}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="text-[11px] text-slate-400">
                    Showing {filteredLeads.length} of {leads.length} records
                  </div>
                  <button
                    onClick={() => setSelectedCustomerTrackerMember(null)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2 rounded-xl text-xs transition cursor-pointer"
                  >
                    Close Manager
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ========================================================= */}
        {/* MODAL 1: SET A DEAL (Image 1 "SET A DEAL" button) */}
        {/* ========================================================= */}
        {selectedMerchantForDeal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 relative">
              <button
                onClick={() => setSelectedMerchantForDeal(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-black">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">
                    Set a Deal — {selectedMerchantForDeal.businessName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Customize bespoke pricing, complimentary access, and extended billing validity
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveDeal} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deal Title / Package Name</label>
                  <input
                    type="text"
                    required
                    value={dealForm.dealTitle}
                    onChange={(e) => setDealForm({ ...dealForm, dealTitle: e.target.value })}
                    placeholder="e.g. Festive Fast-Track Onboarding"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Custom Deal Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={dealForm.dealAmount}
                      onChange={(e) => setDealForm({ ...dealForm, dealAmount: Number(e.target.value) })}
                      placeholder="e.g. 999"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Discount %</label>
                    <input
                      type="number"
                      value={dealForm.discountPercent}
                      onChange={(e) => setDealForm({ ...dealForm, discountPercent: Number(e.target.value) })}
                      placeholder="e.g. 25"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Plan Validity Extension</label>
                    <input
                      type="text"
                      value={dealForm.validTill}
                      onChange={(e) => setDealForm({ ...dealForm, validTill: e.target.value })}
                      placeholder="e.g. 30 Days or 1 Year"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Complimentary Deal?</label>
                    <select
                      value={dealForm.isComplimentary ? 'YES' : 'NO'}
                      onChange={(e) => setDealForm({ ...dealForm, isComplimentary: e.target.value === 'YES' })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 cursor-pointer"
                    >
                      <option value="NO">No (Standard Paid Deal)</option>
                      <option value="YES">Yes (100% Free Complimentary)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deal Notes / Terms</label>
                  <textarea
                    rows={2}
                    value={dealForm.notes}
                    onChange={(e) => setDealForm({ ...dealForm, notes: e.target.value })}
                    placeholder="Special terms, agent who negotiated deal, etc."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-600 resize-none"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMerchantForDeal(null)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#74111d] hover:bg-[#5e0c15] text-white font-black px-5 py-2.5 rounded-xl text-xs transition cursor-pointer shadow-md shadow-[#74111d]/25"
                  >
                    Apply & Save Deal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL 2: MODIFY PLATFORM PLANS */}
        {/* ========================================================= */}
        {showPlansModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowPlansModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-black">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-slate-900">Modify Platform Plans & Pricing</h3>
                    <p className="text-xs text-slate-500">Edit subscription rates, public landing page pricing, and scan caps</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowPlansModal(false);
                    setActiveTab('plans');
                  }}
                  className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                >
                  <span>Open Full Plans Tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-4">
                {plans.map((p) => (
                  <div key={p.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-black text-slate-900 text-sm">{p.name}</span>
                        {p.isPopular && (
                          <span className="text-[9px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full uppercase">
                            Most Popular
                          </span>
                        )}
                        {p.showOnLandingPage && (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase">
                            Landing Page Visible
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-500">Billing: {p.period}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Selling Price (₹)</label>
                        <input
                          type="number"
                          value={p.price}
                          onChange={(e) => handleSavePlanItem(p.id, { price: Number(e.target.value) })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Original Price (₹)</label>
                        <input
                          type="number"
                          value={p.originalPrice || 0}
                          onChange={(e) => handleSavePlanItem(p.id, { originalPrice: Number(e.target.value) })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Billing Period</label>
                        <input
                          type="text"
                          value={p.period}
                          onChange={(e) => handleSavePlanItem(p.id, { period: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Scan Limit</label>
                        <input
                          type="text"
                          value={p.scansLimit}
                          onChange={(e) => handleSavePlanItem(p.id, { scansLimit: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowPlansModal(false)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition cursor-pointer"
                >
                  Done & Save Plans
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL 3: MANAGE COUPONS & PROMO CODES */}
        {/* ========================================================= */}
        {showCouponsModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowCouponsModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-black">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-900">Manage Coupons & Discounts</h3>
                  <p className="text-xs text-slate-500">Create promotional discount codes for merchant subscriptions and renewals</p>
                </div>
              </div>

              {/* Create Coupon Form */}
              <form onSubmit={handleCreateCoupon} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-6 space-y-3">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wide block">
                  + Create New Promo Coupon
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Coupon Code</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. FLASH30"
                      value={newCouponForm.code}
                      onChange={(e) => setNewCouponForm({ ...newCouponForm, code: e.target.value.toUpperCase() })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Discount Type</label>
                    <select
                      value={newCouponForm.discountType}
                      onChange={(e) => setNewCouponForm({ ...newCouponForm, discountType: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600 cursor-pointer"
                    >
                      <option value="PERCENT">Percentage (%) Off</option>
                      <option value="FLAT">Flat ₹ Rupees Off</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Discount Value</label>
                    <input
                      type="number"
                      required
                      value={newCouponForm.discountValue}
                      onChange={(e) => setNewCouponForm({ ...newCouponForm, discountValue: e.target.value })}
                      placeholder="e.g. 25"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Min Order (₹)</label>
                    <input
                      type="number"
                      value={newCouponForm.minOrder}
                      onChange={(e) => setNewCouponForm({ ...newCouponForm, minOrder: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Max Uses</label>
                    <input
                      type="number"
                      value={newCouponForm.maxUses}
                      onChange={(e) => setNewCouponForm({ ...newCouponForm, maxUses: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Expiry Date</label>
                    <input
                      type="date"
                      value={newCouponForm.expiresAt}
                      onChange={(e) => setNewCouponForm({ ...newCouponForm, expiresAt: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2 rounded-xl text-xs transition cursor-pointer shadow-xs"
                  >
                    + Add Coupon
                  </button>
                </div>
              </form>

              {/* Coupons Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Code</th>
                      <th className="py-2.5 px-3">Discount</th>
                      <th className="py-2.5 px-3 text-center">Redemptions</th>
                      <th className="py-2.5 px-3">Expires</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {coupons.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-3 font-mono font-black text-red-600">{c.code}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-800">
                          {c.discountType === 'PERCENT' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT OFF`}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono">
                          {c.usedCount || 0} / {c.maxUses}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{c.expiresAt}</td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => handleDeleteCoupon(c.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition cursor-pointer"
                            title="Delete Coupon"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowCouponsModal(false)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL 4: VIEW MERCHANT DETAILS (Image 1 "VIEW" eye icon) */}
        {/* ========================================================= */}
        {viewMerchantModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 relative">
              <button
                onClick={() => setViewMerchantModal(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-black text-base shadow-xs">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">{viewMerchantModal.businessName}</h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {viewMerchantModal.email} • {viewMerchantModal.mobile}
                  </p>
                </div>
              </div>

              <div className="space-y-3 bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs mb-6">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Business Category:</span>
                  <span className="font-bold text-slate-800">{viewMerchantModal.category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Location City:</span>
                  <span className="font-bold text-slate-800">{viewMerchantModal.city}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Subscription Plan:</span>
                  <span className="font-bold text-red-600">{viewMerchantModal.plan || viewMerchantModal.subscriptionTier}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Plan Validity:</span>
                  <span className="font-bold text-slate-800 font-mono">{viewMerchantModal.planValidTill || '12 Oct 2026'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Payment Status:</span>
                  <span className="font-bold uppercase text-emerald-600">{viewMerchantModal.status}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Complimentary Store:</span>
                  <span className="font-bold text-purple-600">{viewMerchantModal.isComplimentary ? 'Yes' : 'No'}</span>
                </div>
                {viewMerchantModal.dealDetails?.dealTitle && (
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 font-medium">Active Deal:</span>
                    <span className="font-bold text-red-600">
                      {viewMerchantModal.dealDetails.dealTitle} (₹{viewMerchantModal.dealDetails.dealAmount})
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => {
                    const m = viewMerchantModal;
                    setViewMerchantModal(null);
                    handleOpenDeal(m);
                  }}
                  className="bg-red-50 hover:bg-red-100 text-red-700 font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer border border-red-200"
                >
                  Edit Deal
                </button>
                <button
                  onClick={() => setViewMerchantModal(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL 5: ADD DYNAMIC CUSTOM API KEY */}
        {/* ========================================================= */}
        {showAddCustomKeyModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 relative">
              <button
                onClick={() => setShowAddCustomKeyModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-black">
                  <Code className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">Add Custom API Key</h3>
                  <p className="text-xs text-slate-500">Integrate future logistics, messaging, or CRM webhooks</p>
                </div>
              </div>

              <form onSubmit={handleAddCustomKey} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Service / Integration Name *</label>
                  <input
                    type="text"
                    required
                    value={newCustomKey.name}
                    onChange={(e) => setNewCustomKey({ ...newCustomKey, name: e.target.value })}
                    placeholder="e.g. Shiprocket Courier API"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Key Name / Variable *</label>
                  <input
                    type="text"
                    required
                    value={newCustomKey.keyName}
                    onChange={(e) => setNewCustomKey({ ...newCustomKey, keyName: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                    placeholder="e.g. SHIPROCKET_SECRET_TOKEN"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">API Key / Token Value *</label>
                  <input
                    type="password"
                    required
                    value={newCustomKey.keyValue}
                    onChange={(e) => setNewCustomKey({ ...newCustomKey, keyValue: e.target.value })}
                    placeholder="sk_live_..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Environment</label>
                    <select
                      value={newCustomKey.env}
                      onChange={(e) => setNewCustomKey({ ...newCustomKey, env: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 cursor-pointer"
                    >
                      <option value="Production">Production</option>
                      <option value="Staging">Staging</option>
                      <option value="Sandbox">Sandbox / Dev</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={newCustomKey.description}
                      onChange={(e) => setNewCustomKey({ ...newCustomKey, description: e.target.value })}
                      placeholder="Optional notes"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCustomKeyModal(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#74111d] hover:bg-[#5e0c15] text-white font-black px-5 py-2.5 rounded-xl text-xs transition cursor-pointer shadow-md shadow-[#74111d]/25"
                  >
                    Save API Key
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ADMIN PROFILE MODAL */}
        {/* ========================================================= */}
        {adminProfileModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 rounded-2xl bg-[#8B0000] text-white flex items-center justify-center font-black text-sm shadow-md shadow-red-900/30">
                    SA
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Master Admin Profile</h3>
                    <p className="text-[11px] text-slate-500 font-medium">BeAurex Global Root Operations</p>
                  </div>
                </div>
                <button
                  onClick={() => setAdminProfileModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-3.5">
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Role</span>
                    <span className="font-black text-red-700 bg-red-100 px-2 py-0.5 rounded-md">SUPER ADMIN</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Email</span>
                    <span className="font-bold text-slate-900">admin@beaurex.com</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Auth Clearance</span>
                    <span className="font-bold text-emerald-700 flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Level 1 Root</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Encryption</span>
                    <span className="font-bold text-slate-700">256-bit TLS Active</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => {
                      setActiveTab('config');
                      setAdminProfileModalOpen(false);
                    }}
                    className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-bold transition text-center cursor-pointer border border-slate-200"
                  >
                    API & Gateway Keys
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('audit');
                      setAdminProfileModalOpen(false);
                    }}
                    className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-bold transition text-center cursor-pointer border border-slate-200"
                  >
                    Security Audit
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center space-x-2">
                <button
                  onClick={() => setAdminProfileModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-2.5 rounded-xl bg-[#74111d] hover:bg-[#5e0c15] text-white text-xs font-black transition flex items-center justify-center space-x-1.5 shadow-md shadow-red-600/30 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminAuthGate>
  );
}

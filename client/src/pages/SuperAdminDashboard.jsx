import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminAuthGate from '../components/AdminAuthGate';
import ActionConfirmModal from '../components/ActionConfirmModal';
import { 
  Store, Users, Key, Database, RefreshCw, 
  Search, CheckCircle2, AlertTriangle, Activity, Settings, 
  ExternalLink, Smartphone, Lock, Eye, EyeOff, Save, Check, LogOut,
  LayoutDashboard, ShieldCheck, CreditCard, ChevronRight, Layers, HelpCircle,
  Menu, X, UserCheck, UserPlus, Download, Trash2, Tag, Percent, Plus, Gift,
  Clock, Sparkles, Filter, RotateCcw, MessageSquare, Globe, Mail, Code, User, Building2,
  Share2, Copy, Phone, MapPin, Calendar, DollarSign, ChevronDown, ChevronUp, FileText, Ban, Zap,
  Bell, Palette, QrCode, History, Sliders, ToggleLeft, ToggleRight, CheckSquare, Square, Award, Edit3,
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Indent, Outdent, Link2, Image as ImageIcon, Table as TableIcon, MoreHorizontal,
  Send, TrendingUp, Info, ArrowLeft, Folder, Upload, Play
} from 'lucide-react';

export default function SuperAdminDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminProfileModalOpen, setAdminProfileModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // overview, merchants, customers, config, audit

  // Global Action Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: 'Permission Required',
    message: '',
    confirmText: 'Yes, Proceed',
    cancelText: 'Cancel',
    type: 'warning',
    onConfirm: () => {}
  });

  const requestConfirm = ({ title, message, confirmText = 'Yes, Proceed', cancelText = 'Cancel', type = 'warning', onConfirm }) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      type,
      onConfirm
    });
  };

  // Merchants Billing & Subscriptions State (Matching Image 1: Trial Merchants 7, Pending Payment 0, Today Onboarding 0)
  const [merchants, setMerchants] = useState([
    { 
      id: 'm1', 
      businessName: 'Royal Sweets & Cafe', 
      category: 'CAFE_RESTAURANT', 
      email: 'owner@royalsweets.com', 
      mobile: '9876543210', 
      city: 'Delhi NCR', 
      subscriptionTier: 'Standard Plan', 
      plan: 'Standard Plan', 
      planValidTill: '24 May 2026', 
      paymentDate: '24 May 2025', 
      paymentAmount: '₹ 18,000', 
      totalPayment: '₹ 18,000', 
      dateTime: 'May 24, 2025 11:20 AM', 
      status: 'Paid', 
      isComplimentary: false, 
      dealDetails: { 
        dealType: 'PERCENTAGE', 
        dealTitle: 'Festive Fast-Track Onboarding', 
        dealAmount: 18000, 
        discountPercent: 25, 
        discountAmount: 6000, 
        originalPrice: 24000, 
        validTill: '30 Days', 
        isComplimentary: false, 
        badgeText: '25% OFF', 
        notes: 'Agreed on 25% annual package discount' 
      } 
    },
    { 
      id: 'm2', 
      businessName: 'Gourmet Organic Supermarket', 
      category: 'GROCERY', 
      email: 'admin@gourmetorganic.in', 
      mobile: '9811223399', 
      city: 'Bengaluru', 
      subscriptionTier: 'Professional Plan', 
      plan: 'Professional Plan', 
      planValidTill: '24 May 2028', 
      paymentDate: '24 May 2025', 
      paymentAmount: '₹ 44,000', 
      totalPayment: '₹ 44,000', 
      dateTime: 'May 24, 2025 10:45 AM', 
      status: 'Paid', 
      isComplimentary: false, 
      dealDetails: { 
        dealType: 'FLAT', 
        dealTitle: 'Corporate Direct Onboarding', 
        dealAmount: 44000, 
        discountPercent: 10, 
        discountAmount: 5000, 
        originalPrice: 49000, 
        validTill: '60 Days', 
        isComplimentary: false, 
        badgeText: '₹5,000 OFF', 
        notes: 'Flat cash deduction for multi-outlet retail' 
      } 
    },
    { 
      id: 'm3', 
      businessName: 'Glamour Salon & Spa', 
      category: 'SALON_SPA', 
      email: 'support@glamourspa.in', 
      mobile: '9899001122', 
      city: 'Mumbai', 
      subscriptionTier: 'Legacy Plan', 
      plan: 'Legacy Plan', 
      planValidTill: 'Lifetime', 
      paymentDate: '24 May 2025', 
      paymentAmount: '₹ 75,000', 
      totalPayment: '₹ 75,000', 
      dateTime: 'May 24, 2025 09:30 AM', 
      status: 'Paid', 
      isComplimentary: false, 
      dealDetails: { 
        dealType: 'CUSTOM', 
        dealTitle: 'Founder Partner Agreement', 
        dealAmount: 75000, 
        discountPercent: 0, 
        discountAmount: 0, 
        originalPrice: 120000, 
        validTill: 'Lifetime Access', 
        isComplimentary: false, 
        badgeText: 'CUSTOM DEAL', 
        notes: 'Lifetime partner terms with dedicated RM' 
      } 
    },
    { 
      id: 'm4', 
      businessName: 'Urban Fitness Studio', 
      category: 'OTHER', 
      email: 'contact@urbanfitness.com', 
      mobile: '9711223344', 
      city: 'Pune', 
      subscriptionTier: 'Standard Plan', 
      plan: 'Standard Plan', 
      planValidTill: '01 Nov 2026', 
      paymentDate: '24 May 2025', 
      paymentAmount: '₹ 24,000', 
      totalPayment: '₹ 24,000', 
      dateTime: 'May 24, 2025 09:15 AM', 
      status: 'Paid', 
      isComplimentary: false, 
      dealDetails: { dealType: 'NONE', dealTitle: '', dealAmount: 0 } 
    },
    { 
      id: 'm5', 
      businessName: 'Spice Junction Biryani', 
      category: 'CAFE_RESTAURANT', 
      email: 'spice@junction.com', 
      mobile: '9844556611', 
      city: 'Hyderabad', 
      subscriptionTier: 'Trial Plan', 
      plan: 'Trial Plan', 
      planValidTill: '10 Oct 2026', 
      paymentDate: '23 May 2025', 
      paymentAmount: '₹ 0', 
      totalPayment: '₹ 0', 
      dateTime: 'May 23, 2025 08:50 PM', 
      status: 'Trial', 
      isComplimentary: true, 
      dealDetails: { 
        dealType: 'COMPLIMENTARY', 
        dealTitle: 'VIP Complimentary Trial Extension', 
        dealAmount: 0, 
        discountPercent: 100, 
        discountAmount: 24000, 
        originalPrice: 24000, 
        validTill: '90 Days', 
        isComplimentary: true, 
        badgeText: '100% FREE', 
        notes: 'Complimentary trial approved by management' 
      } 
    },
    { 
      id: 'm6', 
      businessName: 'Chai Chaska Bar', 
      category: 'CAFE_RESTAURANT', 
      email: 'chai@chaska.in', 
      mobile: '9812345678', 
      city: 'Gurugram', 
      subscriptionTier: 'Trial Plan', 
      plan: 'Trial Plan', 
      planValidTill: '09 Oct 2026', 
      paymentDate: '23 May 2025', 
      paymentAmount: '₹ 0', 
      totalPayment: '₹ 0', 
      dateTime: 'May 23, 2025 07:15 PM', 
      status: 'Trial', 
      isComplimentary: false, 
      dealDetails: { dealType: 'NONE', dealTitle: '', dealAmount: 0 } 
    },
    { 
      id: 'm7', 
      businessName: 'Bakers Point Delhi', 
      category: 'CAFE_RESTAURANT', 
      email: 'bakers@point.in', 
      mobile: '9877001122', 
      city: 'Delhi', 
      subscriptionTier: 'Standard Plan', 
      plan: 'Standard Plan', 
      planValidTill: '11 Oct 2026', 
      paymentDate: '23 May 2025', 
      paymentAmount: '₹ 999', 
      totalPayment: '₹ 999', 
      dateTime: 'May 23, 2025 05:40 PM', 
      status: 'Trial', 
      isComplimentary: false, 
      dealDetails: { 
        dealType: 'FIXED_PRICE', 
        dealTitle: 'Early Bird Starter Special', 
        dealAmount: 999, 
        discountPercent: 80, 
        discountAmount: 4000, 
        originalPrice: 4999, 
        validTill: '30 Days', 
        isComplimentary: false, 
        badgeText: '₹999 SPECIAL', 
        notes: 'Introductory starter deal rate' 
      } 
    }
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
      tags: ['Starter Choice', 'Counter Standee', 'Instant Setup'],
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
      tags: ['Most Popular', 'Best Value', 'Save 32%', 'VIP Partner'],
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
      tags: ['Lifetime Access', 'VIP Enterprise', 'Zero Renewals'],
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
      tags: ['100% Free', 'Instant Test'],
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
  const [newPlanTagInputs, setNewPlanTagInputs] = useState({});
  const [showPlansModal, setShowPlansModal] = useState(false);
  // Platform Plans Sub-Tab State (Active Plans, Create Plan, Plan History)
  const [planSubTab, setPlanSubTab] = useState('active'); // 'active', 'create', 'history'
  const [planHistory, setPlanHistory] = useState([
    {
      id: 'ph_1',
      timestamp: '05 Oct 2026, 04:30 PM',
      planName: 'Professional Plan',
      action: 'Plan Price Verified',
      details: 'Verified pricing at ₹49,000 for 3 Years (₹1,361/mo equivalent). 3-Year validity active for Indian cafe partners.',
      user: 'Super Admin (Owner)'
    },
    {
      id: 'ph_2',
      timestamp: '04 Oct 2026, 02:15 PM',
      planName: 'Standard Plan',
      action: 'Feature Tag Updated',
      details: 'Added custom acrylic counter standee generator and fair-play device locking to Standard Tier.',
      user: 'Super Admin (Owner)'
    },
    {
      id: 'ph_3',
      timestamp: '03 Oct 2026, 11:00 AM',
      planName: 'Legacy Lifetime Plan',
      action: 'Lifetime Quota Configured',
      details: 'Lifetime unlimited customer QR scans activated with dedicated relationship manager.',
      user: 'Super Admin (Owner)'
    },
    {
      id: 'ph_4',
      timestamp: '01 Oct 2026, 10:00 AM',
      planName: '2-Day Free Trial',
      action: 'Trial Duration Set',
      details: 'Standard trial set to 2 calendar days for instant onboarding standee test.',
      user: 'Super Admin (Owner)'
    }
  ]);
  const [newPlanForm, setNewPlanForm] = useState({
    id: '',
    name: '',
    price: '',
    originalPrice: '',
    period: '/ Year',
    subtext: '',
    tagText: '',
    tags: ['Recommended', 'Instant Setup'],
    highlightBadge: '',
    isPopular: false,
    trialDays: 2,
    scansLimit: 'Unlimited customer QR scans',
    ctaText: 'Start 2-Day Trial',
    showOnLandingPage: true,
    features: [
      'Customer retention system',
      'Free account setup & acrylic config',
      'Custom QR code standee generator',
      'Unlimited customer QR scans'
    ]
  });
  const [newPlanFeatureInput, setNewPlanFeatureInput] = useState('');
  const [newPlanTagInput, setNewPlanTagInput] = useState('');

  // Feature Permissions State (By Plan Tier & Business Category)
  const [permissionPlan, setPermissionPlan] = useState('PROFESSIONAL'); // 'TRIAL', 'STANDARD', 'PROFESSIONAL', 'LEGACY'
  const [permissionCategory, setPermissionCategory] = useState('ALL'); // 'ALL', 'CAFE_RESTAURANT', 'GROCERY', 'SALON_SPA', 'RETAIL', 'OTHER'
  const [permissionSelectedMerchant, setPermissionSelectedMerchant] = useState('ALL');
  const [permissionNotice, setPermissionNotice] = useState('');
  const [permissionsMatrix, setPermissionsMatrix] = useState({
    TRIAL: {
      liveScansFeed: true,
      mysteryScratch: true,
      stampCards: false,
      cashierPinAuth: true,
      acrylicStandeeDesigner: true,
      customerDatabaseExport: false,
      multiBranchOutlets: false,
      customBranding: false,
      smsWhatsappAlerts: false,
      advancedAnalytics: false,
      customVoucherCampaigns: false,
      speedPassFairPlay: true
    },
    STANDARD: {
      liveScansFeed: true,
      mysteryScratch: true,
      stampCards: true,
      cashierPinAuth: true,
      acrylicStandeeDesigner: true,
      customerDatabaseExport: true,
      multiBranchOutlets: false,
      customBranding: false,
      smsWhatsappAlerts: true,
      advancedAnalytics: true,
      customVoucherCampaigns: true,
      speedPassFairPlay: true
    },
    PROFESSIONAL: {
      liveScansFeed: true,
      mysteryScratch: true,
      stampCards: true,
      cashierPinAuth: true,
      acrylicStandeeDesigner: true,
      customerDatabaseExport: true,
      multiBranchOutlets: true,
      customBranding: true,
      smsWhatsappAlerts: true,
      advancedAnalytics: true,
      customVoucherCampaigns: true,
      speedPassFairPlay: true
    },
    LEGACY: {
      liveScansFeed: true,
      mysteryScratch: true,
      stampCards: true,
      cashierPinAuth: true,
      acrylicStandeeDesigner: true,
      customerDatabaseExport: true,
      multiBranchOutlets: true,
      customBranding: true,
      smsWhatsappAlerts: true,
      advancedAnalytics: true,
      customVoucherCampaigns: true,
      speedPassFairPlay: true
    }
  });

  const platformFeaturesList = [
    { id: 'liveScansFeed', name: 'Live Scans Traffic Feed', category: 'Operations', description: 'Stream customer phone QR scans in real-time at the counter', minPlan: 'Trial' },
    { id: 'mysteryScratch', name: 'Mystery Scratch Cards', category: 'Gamification', description: 'High-dopamine scratch foil reward animations for shoppers', minPlan: 'Trial' },
    { id: 'stampCards', name: 'Loyalty Stamp Cards', category: 'Gamification', description: 'Digital frequency stamp cards (e.g. 5 visits = free gift)', minPlan: 'Standard' },
    { id: 'cashierPinAuth', name: 'Cashier PIN Protection', category: 'Security', description: '4-digit secret cashier PIN prevents fraudulent redemptions', minPlan: 'Trial' },
    { id: 'acrylicStandeeDesigner', name: 'QR Standee Vector PDF', category: 'Hardware', description: 'Generate print-ready 5x7" high-res vector acrylic counter standees', minPlan: 'Trial' },
    { id: 'customerDatabaseExport', name: 'Customer Mobile CRM Export', category: 'CRM', description: 'Download enrolled customer phone numbers and visit logs to Excel', minPlan: 'Standard' },
    { id: 'multiBranchOutlets', name: 'Multi-Branch & Counters', category: 'Operations', description: 'Create unlimited secondary outlets and individual counter standees', minPlan: 'Professional' },
    { id: 'customBranding', name: 'Store Brand Colors & Logo', category: 'Branding', description: 'Personalize customer reward page with custom theme colors & logo', minPlan: 'Professional' },
    { id: 'smsWhatsappAlerts', name: 'SMS & WhatsApp Broadcasts', category: 'Marketing', description: 'Send instant SMS OTPs and victory alerts directly to shopper phones', minPlan: 'Standard' },
    { id: 'advancedAnalytics', name: 'Advanced Cohort Telemetry', category: 'Analytics', description: 'Deep-dive repeat visit benchmark vs competitors and retention metrics', minPlan: 'Standard' },
    { id: 'customVoucherCampaigns', name: 'Custom Rupee & % Vouchers', category: 'Promotions', description: 'Draft merchant vouchers with expiration dates and minimum bill terms', minPlan: 'Standard' },
    { id: 'speedPassFairPlay', name: '12h Device Anti-Fraud Lock', category: 'Security', description: 'Locks device browser for 12 hours between consecutive scans', minPlan: 'Trial' },
  ];

  // =========================================================================
  // MERCHANT DASHBOARD FEATURES MANAGEMENT (Show/Hide, Add, Update, Delete)
  // =========================================================================
  const [permissionsSubTab, setPermissionsSubTab] = useState('merchant_features'); // 'merchant_features' | 'tier_matrix'
  const [merchantFeatures, setMerchantFeatures] = useState(() => {
    try {
      const saved = localStorage.getItem('beaurex_merchant_features');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [
      { id: 'home_overview', name: 'Home Analytics & Overview Stats', category: 'Home Dashboard', description: 'Total scans, active customers, redemptions count, and repeat rate stats cards on the home screen.', isVisible: true, minPlan: 'All Plans', isCustom: false },
      { id: 'home_qr_code', name: 'Store Counter QR Code & Standee Download', category: 'Home Dashboard', description: 'Dynamic QR code display with Download PNG and Print Standee triggers.', isVisible: true, minPlan: 'All Plans', isCustom: false },
      { id: 'home_plan_banner', name: 'Pro Subscription Plan Status Banner', category: 'Home Dashboard', description: 'Active subscription status, validity date, and plan upgrade banner.', isVisible: true, minPlan: 'All Plans', isCustom: false },
      { id: 'rewards_tab', name: 'Rewards & Redemption Approval (Tab)', category: 'Navigation & Tabs', description: 'Dedicated screen for reviewing customer stamp redemptions, pending approvals, and approved rewards.', isVisible: true, minPlan: 'All Plans', isCustom: false },
      { id: 'create_offer_tab', name: 'Create Offer & Stamp Programs (Tab)', category: 'Navigation & Tabs', description: 'Creation screen to launch stamp programs (image, title, stamps required, expiry validity).', isVisible: true, minPlan: 'All Plans', isCustom: false },
      { id: 'customers_tab', name: 'Customers CRM & CSV Export (Tab)', category: 'Navigation & Tabs', description: 'Customer visits directory with search, date filters, and CSV export functionality.', isVisible: true, minPlan: 'All Plans', isCustom: false },
      { id: 'profile_tab', name: 'Profile & Settings (Tab)', category: 'Navigation & Tabs', description: 'Profile and store settings navigation item.', isVisible: true, minPlan: 'All Plans', isCustom: false },
      { id: 'auto_approve_scans', name: 'Auto Approve Scans Setting', category: 'Profile & Settings', description: 'Allows merchant to automatically approve customer visits without manual verification.', isVisible: true, minPlan: 'All Plans', isCustom: false },
      { id: 'allow_multiple_scans', name: 'Allow Multiple Daily Scans Setting', category: 'Profile & Settings', description: 'Permits customers to scan and collect stamps multiple times within the same day.', isVisible: true, minPlan: 'All Plans', isCustom: false },
      { id: 'allow_first_coin', name: 'Allow First Coin Without Approval Setting', category: 'Profile & Settings', description: 'First visit welcome stamp/coin is awarded automatically without merchant approval.', isVisible: true, minPlan: 'All Plans', isCustom: false },
      { id: 'location_hours', name: 'Location & Operating Hours Editor', category: 'Profile & Settings', description: 'Store address, city, pin code, opening/closing timings editor in merchant profile.', isVisible: true, minPlan: 'All Plans', isCustom: false },
      { id: 'phone_email', name: 'Phone & Email Contact Editor', category: 'Profile & Settings', description: 'Store contact number and email settings in merchant profile.', isVisible: true, minPlan: 'All Plans', isCustom: false },
      { id: 'social_reviews', name: 'Social Links & Google Reviews', category: 'Profile & Settings', description: 'Instagram handle, website, and Google Review destination link management.', isVisible: true, minPlan: 'All Plans', isCustom: false },
      { id: 'owner_account', name: 'Owner Account Details', category: 'Profile & Settings', description: 'Store owner identity, mobile, and password settings in profile.', isVisible: true, minPlan: 'All Plans', isCustom: false },
      { id: 'tutorial_video', name: 'How to Use BeAurex (Tutorial)', category: 'Education & Support', description: 'Video onboarding walkthrough modal for merchants.', isVisible: true, minPlan: 'All Plans', isCustom: false },
      { id: 'download_app', name: 'Download & Install PWA App', category: 'Education & Support', description: 'PWA device installation modal and download launcher.', isVisible: true, minPlan: 'All Plans', isCustom: false },
      { id: 'subscription_manage', name: 'Subscription & Billing Portal', category: 'Education & Support', description: 'Tier upgrade and billing modal.', isVisible: true, minPlan: 'All Plans', isCustom: false },
      { id: 'privacy_security', name: 'Privacy & Security Controls', category: 'Education & Support', description: 'Store data privacy policies and security management.', isVisible: true, minPlan: 'All Plans', isCustom: false },
      { id: 'help_support', name: 'Help & Support Assistance', category: 'Education & Support', description: 'Merchant help desk, FAQs, and WhatsApp/Email support contacts.', isVisible: true, minPlan: 'All Plans', isCustom: false }
    ];
  });

  const [featureSearchQuery, setFeatureSearchQuery] = useState('');
  const [featureCategoryFilter, setFeatureCategoryFilter] = useState('ALL');
  const [featureStatusFilter, setFeatureStatusFilter] = useState('ALL'); // 'ALL' | 'VISIBLE' | 'HIDDEN'
  const [featureNotice, setFeatureNotice] = useState('');
  const [editingFeatureModal, setEditingFeatureModal] = useState(null);
  const [addFeatureModalOpen, setAddFeatureModalOpen] = useState(false);
  const [newFeatureForm, setNewFeatureForm] = useState({
    id: '',
    name: '',
    category: 'Home Dashboard',
    description: '',
    isVisible: true,
    minPlan: 'All Plans'
  });

  // Contact Inquiries State (MongoDB /api/admin/contacts)
  const [contactsList, setContactsList] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [contactFilter, setContactFilter] = useState('ALL'); // 'ALL' | 'NEW' | 'CONTACTED' | 'RESOLVED'
  const [searchContact, setSearchContact] = useState('');
  const [selectedInquiryModal, setSelectedInquiryModal] = useState(null);
  const [contactStatusUpdating, setContactStatusUpdating] = useState(null);

  const fetchContacts = async () => {
    setContactsLoading(true);
    try {
      const res = await fetch('/api/admin/contacts');
      const data = await res.json();
      if (data && data.success && Array.isArray(data.contacts)) {
        setContactsList(data.contacts);
      }
    } catch (err) {
      console.error('Failed to load contact inquiries', err);
    } finally {
      setContactsLoading(false);
    }
  };

  const handleUpdateContactStatus = async (id, newStatus) => {
    setContactStatusUpdating(id);
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data && data.success) {
        setContactsList(prev => prev.map(c => ((c.id === id || c._id === id) ? { ...c, status: newStatus } : c)));
        if (selectedInquiryModal && (selectedInquiryModal.id === id || selectedInquiryModal._id === id)) {
          setSelectedInquiryModal(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error('Failed to update contact status', err);
    } finally {
      setContactStatusUpdating(null);
    }
  };

  const handleDeleteContact = (id) => {
    requestConfirm({
      title: 'Delete Inquiry',
      message: 'Are you sure you want to permanently delete this contact inquiry record?',
      confirmText: 'Yes, Delete',
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' });
          const data = await res.json();
          if (data && data.success) {
            setContactsList(prev => prev.filter(c => c.id !== id && c._id !== id));
            if (selectedInquiryModal && (selectedInquiryModal.id === id || selectedInquiryModal._id === id)) {
              setSelectedInquiryModal(null);
            }
          }
        } catch (err) {
          console.error('Failed to delete contact inquiry', err);
        }
      }
    });
  };

  useEffect(() => {
    fetch('/api/admin/merchant-features')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.features)) {
          setMerchantFeatures(data.features);
          localStorage.setItem('beaurex_merchant_features', JSON.stringify(data.features));
        }
      })
      .catch(() => {});

    // Fetch synchronized legal policies across portals
    fetch('/api/admin/policies')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.policies) {
          if (data.policies.privacy) {
            setPolicyData(prev => ({ ...prev, privacy: data.policies.privacy }));
            setPrivacyPolicyData({
              version: data.policies.privacy.version || '1.0',
              lastUpdated: data.policies.privacy.lastUpdated || '',
              content: data.policies.privacy.content || ''
            });
          }
          if (data.policies.terms) {
            setPolicyData(prev => ({ ...prev, terms: data.policies.terms }));
            setTermsData({
              version: data.policies.terms.version || '1.0',
              lastUpdated: data.policies.terms.lastUpdated || '',
              content: data.policies.terms.content || ''
            });
          }
          try {
            localStorage.setItem('beaurex_legal_policies', JSON.stringify(data.policies));
          } catch (_) {}
        }
      })
      .catch(() => {});

    // Fetch initial contact inquiries from MongoDB
    fetchContacts();
  }, []);

  const showFeatureToast = (msg) => {
    setFeatureNotice(msg);
    setTimeout(() => setFeatureNotice(''), 3500);
  };

  const handleToggleFeatureVisibility = (featureId) => {
    const updated = merchantFeatures.map(feat => {
      if (feat.id === featureId) {
        return { ...feat, isVisible: !feat.isVisible };
      }
      return feat;
    });
    setMerchantFeatures(updated);
    localStorage.setItem('beaurex_merchant_features', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('beaurex_merchant_features_updated', { detail: updated }));

    fetch(`/api/admin/merchant-features/${featureId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isVisible: !merchantFeatures.find(f => f.id === featureId)?.isVisible })
    }).catch(() => {});

    const targetFeat = updated.find(f => f.id === featureId);
    showFeatureToast(`Feature "${targetFeat?.name}" is now ${targetFeat?.isVisible ? 'VISIBLE' : 'HIDDEN'} on Merchant Dashboard.`);
  };

  const handleBulkToggleFeatures = (visibleState) => {
    const updated = merchantFeatures.map(f => ({ ...f, isVisible: visibleState }));
    setMerchantFeatures(updated);
    localStorage.setItem('beaurex_merchant_features', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('beaurex_merchant_features_updated', { detail: updated }));

    fetch('/api/admin/merchant-features', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ features: updated })
    }).catch(() => {});

    showFeatureToast(`All merchant dashboard features have been set to ${visibleState ? 'VISIBLE' : 'HIDDEN'}.`);
  };

  const handleSaveEditedFeature = (e) => {
    if (e) e.preventDefault();
    if (!editingFeatureModal) return;

    const updated = merchantFeatures.map(f => f.id === editingFeatureModal.id ? editingFeatureModal : f);
    setMerchantFeatures(updated);
    localStorage.setItem('beaurex_merchant_features', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('beaurex_merchant_features_updated', { detail: updated }));

    fetch(`/api/admin/merchant-features/${editingFeatureModal.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingFeatureModal)
    }).catch(() => {});

    showFeatureToast(`Feature "${editingFeatureModal.name}" updated successfully.`);
    setEditingFeatureModal(null);
  };

  const handleCreateNewFeature = (e) => {
    if (e) e.preventDefault();
    if (!newFeatureForm.name) return;

    const featureId = newFeatureForm.id ? newFeatureForm.id.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_') : ('feat_' + Date.now().toString(36));
    const created = {
      ...newFeatureForm,
      id: featureId,
      isCustom: true
    };
    const updated = [...merchantFeatures, created];
    setMerchantFeatures(updated);
    localStorage.setItem('beaurex_merchant_features', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('beaurex_merchant_features_updated', { detail: updated }));

    fetch('/api/admin/merchant-features', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newFeature: created })
    }).catch(() => {});

    showFeatureToast(`New feature "${created.name}" created and added to Merchant Dashboard.`);
    setNewFeatureForm({ id: '', name: '', category: 'Home Dashboard', description: '', isVisible: true, minPlan: 'All Plans' });
    setAddFeatureModalOpen(false);
  };

  const handleDeleteFeature = (featureId) => {
    const feat = merchantFeatures.find(f => f.id === featureId);
    requestConfirm({
      title: `Delete Feature: "${feat?.name || featureId}"?`,
      message: `Are you sure you want to delete this feature from the Merchant Dashboard? It will no longer be available to any merchant.`,
      confirmText: 'Yes, Delete Feature',
      type: 'danger',
      onConfirm: () => {
        const updated = merchantFeatures.filter(f => f.id !== featureId);
        setMerchantFeatures(updated);
        localStorage.setItem('beaurex_merchant_features', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('beaurex_merchant_features_updated', { detail: updated }));

        fetch(`/api/admin/merchant-features/${featureId}`, {
          method: 'DELETE'
        }).catch(() => {});

        showFeatureToast(`Feature "${feat?.name}" deleted successfully.`);
      }
    });
  };

  // =========================================================
  // OVERVIEW DASHBOARD GRAPH & CONTROLS STATE (Image 1 + Graphs)
  // =========================================================
  const [overviewDate, setOverviewDate] = useState('May 24, 2025');
  const [overviewChartTimeframe, setOverviewChartTimeframe] = useState('30days'); // '7days', '30days', '90days'
  const [overviewChartMetric, setOverviewChartMetric] = useState('revenue'); // 'revenue', 'onboarding', 'scans'

  // =========================================================
  // POLICY EDITOR STATE (Image 2 - Privacy Policy & Terms)
  // =========================================================
  const [policySubTab, setPolicySubTab] = useState('privacy'); // 'privacy' | 'terms'
  const [policyData, setPolicyData] = useState(() => {
    try {
      const saved = localStorage.getItem('beaurex_legal_policies');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return {
      privacy: {
        type: 'Privacy Policy',
        status: 'Published',
        lastUpdated: 'May 24, 2026 08:20 AM',
        version: '1.0',
        publishedBy: 'Super Admin',
        publishedOn: 'May 24, 2026 08:20 AM',
        content: `BeAurex Platform Privacy Policy (v1.0)

At BeAurex, we value your privacy and are committed to protecting your personal information and commercial integrity.

1. Information We Collect
We collect necessary information to provide and operate digital loyalty programs:
• Merchant Business Information (Store name, business category, counter address, contact details)
• Customer Profile Data (Name, email address, customer ID, phone number if provided)
• QR & Stamp Activity (Counter scan timestamps, stamps earned, rewards unlocked and redeemed)
• Analytics & Device Telemetry (Browser details, IP address for security & fraud protection)

2. How We Use Your Information
We use information strictly for:
• Operating customer rewards and digital stamp issuance
• Validating customer reward claims at merchant physical counters
• Preventing fraudulent or duplicate scans
• Facilitating peer-to-peer customer referral rewards
• Account security and service announcements

3. Zero Third-Party Selling Guarantee
BeAurex NEVER sells, rents, or shares customer or merchant personal contact information with third-party advertisers, data brokers, or marketing networks.

4. Data Security & Storage
All communication between apps and BeAurex servers is protected using 256-bit TLS/SSL encryption. Data is stored in secure, SOC2-compliant cloud database infrastructure with automated backups and firewall filtering.

5. Your Rights & Data Deletion
Customers and merchants have full control over their account data. You may request account review, data export, or complete account deletion at any time by contacting our privacy compliance desk at support@beaurex.com. Requests are processed within 48 business hours.`
      },
      terms: {
        type: 'Terms & Conditions',
        status: 'Published',
        lastUpdated: 'May 24, 2026 08:20 AM',
        version: '1.0',
        publishedBy: 'Super Admin',
        publishedOn: 'May 24, 2026 08:20 AM',
        content: `BeAurex Platform Terms & Conditions (v1.0)

Welcome to BeAurex. These Terms and Conditions govern your access to and usage of the BeAurex loyalty platform, merchant dashboard, counter standee QR codes, and customer web experience.

1. Acceptance of Terms
By accessing or using BeAurex, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to all terms, you may not access or use our services.

2. Merchant Obligations & Counter Conduct
• Participating merchants agree to honor validly earned digital stamps and approved reward claims presented by registered customers.
• Merchants must not manipulate scan telemetry or create counterfeit QR displays.
• Counter staff must verify the 6-character Customer ID before confirming reward redemptions.

3. Customer Rewards & Points Policy
• Loyalty stamps and reward vouchers are issued at participating merchant businesses and hold promotional value solely for in-store redemption as described.
• Stamps and points carry no direct legal tender cash value outside designated partner stores.
• Referrals: Customers earning referral bonuses must ensure referred friends are authentic first-time visitors.

4. Platform Availability & Fair Use
• BeAurex strives for 99.9% platform availability. Periodic system maintenance will be communicated in advance.
• Automated bots, GPS spoofing, automated QR scan spamming, and rate-limit circumvention are strictly prohibited and will result in immediate account termination.

5. Subscription & Billing Terms
• Merchants choosing paid subscription plans are billed according to their chosen billing period (Annual / 3-Year / Lifetime).
• Standee acrylic kits are dispatched within 2-3 business days upon account activation.
• Any disputes regarding subscription billing must be raised within 14 calendar days to support@beaurex.com.`
      }
    };
  });
  const [policyPreviewModalOpen, setPolicyPreviewModalOpen] = useState(false);
  const [policyToast, setPolicyToast] = useState('');

  const showPolicyToast = (msg) => {
    setPolicyToast(msg);
    setTimeout(() => setPolicyToast(''), 3500);
  };

  const handleSavePolicyDraft = async () => {
    const now = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const updatedSub = {
      ...policyData[policySubTab],
      status: 'Draft',
      lastUpdated: now
    };
    const newPolicyData = {
      ...policyData,
      [policySubTab]: updatedSub
    };
    setPolicyData(newPolicyData);

    try {
      localStorage.setItem('beaurex_legal_policies', JSON.stringify(newPolicyData));
      window.dispatchEvent(new Event('beaurex_policy_updated'));
      await fetch('/api/admin/policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPolicyData)
      });
    } catch (_) {}

    showPolicyToast(`Draft saved successfully for ${policySubTab === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}.`);
  };

  const handlePublishPolicy = async () => {
    const now = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const updatedSub = {
      ...policyData[policySubTab],
      status: 'Published',
      lastUpdated: now,
      publishedOn: now
    };
    const newPolicyData = {
      ...policyData,
      [policySubTab]: updatedSub
    };
    setPolicyData(newPolicyData);

    // Keep settings modal states in sync
    if (policySubTab === 'privacy') {
      setPrivacyPolicyData({ version: updatedSub.version, lastUpdated: now, content: updatedSub.content });
    } else {
      setTermsData({ version: updatedSub.version, lastUpdated: now, content: updatedSub.content });
    }

    try {
      localStorage.setItem('beaurex_legal_policies', JSON.stringify(newPolicyData));
      window.dispatchEvent(new Event('beaurex_policy_updated'));
      await fetch('/api/admin/policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPolicyData)
      });
    } catch (err) {
      console.warn('Policy publish sync error:', err);
    }

    showPolicyToast(`Published ${policySubTab === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'} successfully! Now live across all portals.`);
  };

  // =========================================================
  // FAQ EDITOR STATE (Image 3 - 10 Exact FAQ Rows & Modals)
  // =========================================================
  const [faqsList, setFaqsList] = useState([
    { id: 1, question: 'What is LoyalQR?', category: 'General', status: 'Published', order: 1, lastUpdated: 'May 24, 2025 11:20 AM', answer: 'LoyalQR is an omnichannel customer retention and digital loyalty engine powering seamless counter QR check-ins, automated rewards, and merchant marketing.' },
    { id: 2, question: 'How does LoyalQR work?', category: 'General', status: 'Published', order: 2, lastUpdated: 'May 24, 2025 10:45 AM', answer: 'Customers scan a branded table or counter QR standee using Google Lens or default camera to earn loyalty coins, unlock mystery scratchers, and claim instant tier discounts.' },
    { id: 3, question: 'How can merchants join LoyalQR?', category: 'Merchant', status: 'Published', order: 1, lastUpdated: 'May 24, 2025 09:30 AM', answer: 'Merchants can sign up in 30 seconds, configure their store profile, customize their loyalty coin values, and instantly download print-ready acrylic QR standees.' },
    { id: 4, question: 'How do I create a loyalty program?', category: 'Merchant', status: 'Published', order: 2, lastUpdated: 'May 24, 2025 09:15 AM', answer: 'Navigate to Merchant Rewards Engine, define your coin earn rate (e.g. 1 coin per ₹10 spent), and create redemption vouchers with custom approval thresholds.' },
    { id: 5, question: 'How are points calculated?', category: 'Rewards', status: 'Published', order: 1, lastUpdated: 'May 23, 2025 08:50 PM', answer: 'Points are automatically computed upon verified bill scans or counter check-ins based on the merchant tier rules and multiplier campaigns.' },
    { id: 6, question: 'How can customers redeem rewards?', category: 'Rewards', status: 'Draft', order: 2, lastUpdated: 'May 23, 2025 08:20 PM', answer: 'Customers open their BeAurex Pass on their phone, pick an eligible voucher, and show the one-time 4-digit PIN or redemption QR code to the cashier.' },
    { id: 7, question: 'Is LoyalQR free to use?', category: 'General', status: 'Published', order: 3, lastUpdated: 'May 23, 2025 07:45 PM', answer: 'We offer a risk-free 2-Day Free Trial for all new merchant partners with full feature access and zero upfront credit card requirement.' },
    { id: 8, cancelOrder: false, question: 'Can I integrate LoyalQR with my POS?', category: 'Integration', status: 'Published', order: 1, lastUpdated: 'May 23, 2025 07:10 PM', answer: 'Yes, LoyalQR provides REST Webhooks and lightweight POS integration bridges compatible with Pine Labs, Petpooja, and custom billing software.' },
    { id: 9, question: 'What payment methods are supported?', category: 'General', status: 'Unpublished', order: 4, lastUpdated: 'May 23, 2025 06:30 PM', answer: 'We support all major payment modes including UPI, RuPay, Visa, Mastercard, Net Banking, and corporate invoicing through Razorpay & Cashfree.' },
    { id: 10, question: 'How do I contact support?', category: 'Support', status: 'Published', order: 1, lastUpdated: 'May 23, 2025 05:50 PM', answer: 'Reach out to our 24/7 partner operations desk via WhatsApp support (+91 98112 23344) or email support@beaurex.com.' }
  ]);
  const [faqSearch, setFaqSearch] = useState('');
  const [faqCategoryFilter, setFaqCategoryFilter] = useState('ALL');
  const [faqStatusFilter, setFaqStatusFilter] = useState('ALL');
  const [faqModal, setFaqModal] = useState({ isOpen: false, mode: 'view', data: null });
  const [faqCurrentPage, setFaqCurrentPage] = useState(1);
  const [faqToast, setFaqToast] = useState('');

  const showFaqToast = (msg) => {
    setFaqToast(msg);
    setTimeout(() => setFaqToast(''), 3500);
  };

  const handleSaveFaq = (faqData) => {
    if (!faqData.question) return;
    if (faqModal.mode === 'add') {
      const newFaq = {
        id: Date.now(),
        question: faqData.question,
        category: faqData.category || 'General',
        status: faqData.status || 'Published',
        order: Number(faqData.order) || (faqsList.length + 1),
        lastUpdated: 'May 24, 2025 11:30 AM',
        answer: faqData.answer || ''
      };
      setFaqsList([newFaq, ...faqsList]);
      showFaqToast(`FAQ "${newFaq.question}" added successfully.`);
    } else {
      setFaqsList(faqsList.map(f => f.id === faqData.id ? { ...faqData, lastUpdated: 'May 24, 2025 11:30 AM' } : f));
      showFaqToast(`FAQ updated successfully.`);
    }
    setFaqModal({ isOpen: false, mode: 'view', data: null });
  };

  const handleDeleteFaq = (faqId) => {
    const target = faqsList.find(f => f.id === faqId);
    requestConfirm({
      title: `Delete FAQ: "${target?.question}"?`,
      message: `Are you sure you want to delete this FAQ entry from the platform?`,
      confirmText: 'Yes, Delete FAQ',
      type: 'danger',
      onConfirm: () => {
        setFaqsList(faqsList.filter(f => f.id !== faqId));
        showFaqToast(`FAQ deleted successfully.`);
      }
    });
  };

  // =========================================================
  // CLAIM LOGS STATE (Image 4 - 10 Exact Rows & Detail Modal)
  // =========================================================
  const [claimLogsList, setClaimLogsList] = useState([
    { id: 1, rewardId: 'RWD10001', customerId: 'CUST-801', merchantId: 'MER-101', claimId: 'CLM10001', customer: 'Rahul Sharma', merchant: 'Coffee House', reward: 'Free Coffee', pointsUsed: 100, status: 'Success', claimedAt: 'May 24, 2025, 11:20 AM', txHash: '0x9fa12b8', cashierPin: '4921', phone: '+91 98112 34567' },
    { id: 2, rewardId: 'RWD10002', customerId: 'CUST-802', merchantId: 'MER-102', claimId: 'CLM10002', customer: 'Priya Singh', merchant: 'Pizza Plaza', reward: '20% Discount', pointsUsed: 150, status: 'Success', claimedAt: 'May 24, 2025, 10:45 AM', txHash: '0x88e43a1', cashierPin: '1102', phone: '+91 98223 45678' },
    { id: 3, rewardId: 'RWD10003', customerId: 'CUST-803', merchantId: 'MER-103', claimId: 'CLM10003', customer: 'Amit Patel', merchant: 'Burger Point', reward: 'Free Burger', pointsUsed: 200, status: 'Success', claimedAt: 'May 24, 2025, 09:30 AM', txHash: '0x17c93d2', cashierPin: '9084', phone: '+91 98334 56789' },
    { id: 4, rewardId: 'RWD10004', customerId: 'CUST-804', merchantId: 'MER-104', claimId: 'CLM10004', customer: 'Neha Verma', merchant: 'Fashion Hub', reward: '₹100 Off', pointsUsed: 250, status: 'Pending', claimedAt: 'May 24, 2025, 09:15 AM', txHash: '0x76b19a0', cashierPin: '3341', phone: '+91 98445 67890' },
    { id: 5, rewardId: 'RWD10005', customerId: 'CUST-805', merchantId: 'MER-101', claimId: 'CLM10005', customer: 'Vikas Mehta', merchant: 'Coffee House', reward: 'Free Sandwich', pointsUsed: 120, status: 'Success', claimedAt: 'May 23, 2025, 08:50 PM', txHash: '0x33b8219', cashierPin: '7729', phone: '+91 98556 78901' },
    { id: 6, rewardId: 'RWD10006', customerId: 'CUST-806', merchantId: 'MER-102', claimId: 'CLM10006', customer: 'Sneha Reddy', merchant: 'Pizza Plaza', reward: 'Free Drink', pointsUsed: 80, status: 'Failed', claimedAt: 'May 23, 2025, 08:20 PM', txHash: '0x12f45ea', cashierPin: '6618', phone: '+91 98667 89012' },
    { id: 7, rewardId: 'RWD10007', customerId: 'CUST-807', merchantId: 'MER-103', claimId: 'CLM10007', customer: 'Karan Singh', merchant: 'Burger Point', reward: '20% Discount', pointsUsed: 150, status: 'Success', claimedAt: 'May 23, 2025, 07:45 PM', txHash: '0x55aa3b1', cashierPin: '8830', phone: '+91 98778 90123' },
    { id: 8, rewardId: 'RWD10008', customerId: 'CUST-808', merchantId: 'MER-104', claimId: 'CLM10008', customer: 'Ishita Malhotra', merchant: 'Fashion Hub', reward: '₹200 Off', pointsUsed: 300, status: 'Pending', claimedAt: 'May 23, 2025, 07:10 PM', txHash: '0x88c2114', cashierPin: '2294', phone: '+91 98889 01234' },
    { id: 9, rewardId: 'RWD10009', customerId: 'CUST-809', merchantId: 'MER-101', claimId: 'CLM10009', customer: 'Rohit Kumar', merchant: 'Coffee House', reward: 'Free Coffee', pointsUsed: 100, status: 'Success', claimedAt: 'May 23, 2025, 06:30 PM', txHash: '0x44d9098', cashierPin: '5501', phone: '+91 98990 12345' },
    { id: 10, rewardId: 'RWD10010', customerId: 'CUST-810', merchantId: 'MER-102', claimId: 'CLM10010', customer: 'Anjali Gupta', merchant: 'Pizza Plaza', reward: 'Free Pizza Slice', pointsUsed: 180, status: 'Failed', claimedAt: 'May 23, 2025, 05:50 PM', txHash: '0x99e8210', cashierPin: '4423', phone: '+91 98001 23456' }
  ]);
  const [claimSearch, setClaimSearch] = useState('');
  const [claimMerchantFilter, setClaimMerchantFilter] = useState('ALL');
  const [claimStatusFilter, setClaimStatusFilter] = useState('ALL');
  const [claimRewardFilter, setClaimRewardFilter] = useState('ALL');
  const [selectedClaimModal, setSelectedClaimModal] = useState(null);
  const [claimExportToast, setClaimExportToast] = useState('');

  const handleExportClaimLogs = () => {
    setClaimExportToast('Exporting 245 Claim Logs to CSV/Excel...');
    setTimeout(() => {
      setClaimExportToast('Claim Logs CSV downloaded successfully!');
      setTimeout(() => setClaimExportToast(''), 3000);
    }, 1200);
  };

  // =========================================================
  // CUSTOMER FEATURES & TEAM FEATURES STATE (Feature Management)
  // =========================================================
  const [customerFeatures, setCustomerFeatures] = useState(() => {
    try {
      const saved = localStorage.getItem('beaurex_customer_features');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [
      { id: 'cust_google_login', name: 'Google One-Tap & OAuth Authentication', category: 'Onboarding & Auth', description: 'Instant 1-tap sign-in for customers without tedious passwords or OTPs.', isVisible: true, isCustom: false },
      { id: 'cust_lens_scan', name: 'Google Lens & Camera QR Claim Flow', category: 'Scans & Claim', description: 'Universal counter QR scan support directly from default Android/iPhone camera or Google Lens.', isVisible: true, isCustom: false },
      { id: 'cust_first_coin_instant', name: 'Instant Auto-Claim First Coin', category: 'Scans & Claim', description: 'Credit first visit coin automatically upon QR scan without cashier manual confirmation.', isVisible: true, isCustom: false },
      { id: 'cust_stamp_cards', name: 'Dynamic Stamp Cards & Progress Bar', category: 'Loyalty Rewards', description: 'Visual interactive stamp cards displaying loyalty progress towards free reward unlock.', isVisible: true, isCustom: false },
      { id: 'cust_wallet_coins', name: 'Loyalty Points Wallet & Coin Balance', category: 'Loyalty Rewards', description: 'Live digital coin balance, earning history, and transaction ledger.', isVisible: true, isCustom: false },
      { id: 'cust_mystery_scratch', name: 'Mystery Scratch Cards & Gamification', category: 'Gamification', description: 'Gamified scratch cards unlocked after every successful counter scan.', isVisible: true, isCustom: false },
      { id: 'cust_spin_wheel', name: 'Spin & Win Daily Luck Wheel', category: 'Gamification', description: 'Daily lucky spin wheel giving bonus reward multipliers and discount coupons.', isVisible: true, isCustom: false },
      { id: 'cust_referral_rewards', name: 'Friend Referral & Invite Code Program', category: 'Referrals', description: 'Personal referral link allowing customers to earn extra coins for inviting friends.', isVisible: true, isCustom: false },
      { id: 'cust_pass_apple_wallet', name: 'Digital Pass & Home Screen Shortcut (PWA)', category: 'User Experience', description: 'Add BeAurex Pass to mobile home screen or Apple/Google Wallet.', isVisible: true, isCustom: false },
      { id: 'cust_profile_edit', name: 'Customer Profile, Name & Preferences', category: 'Account & Security', description: 'Editable profile with avatar, food/retail preferences, and notifications.', isVisible: true, isCustom: false }
    ];
  });

  const [teamFeatures, setTeamFeatures] = useState(() => {
    try {
      const saved = localStorage.getItem('beaurex_team_features');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [
      { id: 'team_dashboard_kpis', name: 'Agent Performance KPIs & Earnings Summary', category: 'Dashboard & Metrics', description: 'Real-time tracking of active merchant conversions, monthly commissions, and goal progress.', isVisible: true, isCustom: false },
      { id: 'team_referral_tracking', name: 'Merchant Referral & Store Attribution', category: 'Merchant Pipeline', description: 'Unique agent referral code generator and attribution tracking for signed merchant stores.', isVisible: true, isCustom: false },
      { id: 'team_crm_leads', name: 'CRM Merchant Lead Pipeline & Follow-ups', category: 'Sales & CRM', description: 'Quick-add lead logging, visit scheduling, phone call follow-up reminders, and deal notes.', isVisible: true, isCustom: false },
      { id: 'team_marketing_kit', name: 'Field Marketing Kit & Acrylic Standee Assets', category: 'Marketing & Sales', description: 'Direct PDF & SVG standee asset downloads, pitch scripts, and product brochures.', isVisible: true, isCustom: false },
      { id: 'team_digital_id', name: 'Verified Field Specialist Digital ID Card', category: 'Identity & Access', description: 'Official verifiable agent badge with security barcode, issue date, and validity badge.', isVisible: true, isCustom: false },
      { id: 'team_commission_ledger', name: 'Commission Settlement & Payout History', category: 'Finance & Payouts', description: 'Detailed breakdown of per-store payout statuses (Paid, Processing, Pending).', isVisible: true, isCustom: false },
      { id: 'team_territory_manager', name: 'Field Territory & City Zone Assignment', category: 'Operations', description: 'Dedicated geographical territory and pincode assignments for field representatives.', isVisible: true, isCustom: false }
    ];
  });

  const [editingCustomerFeatureModal, setEditingCustomerFeatureModal] = useState(null);
  const [addCustomerFeatureModalOpen, setAddCustomerFeatureModalOpen] = useState(false);
  const [newCustomerFeatureForm, setNewCustomerFeatureForm] = useState({ id: '', name: '', category: 'Loyalty Rewards', description: '', isVisible: true });

  const [editingTeamFeatureModal, setEditingTeamFeatureModal] = useState(null);
  const [addTeamFeatureModalOpen, setAddTeamFeatureModalOpen] = useState(false);
  const [newTeamFeatureForm, setNewTeamFeatureForm] = useState({ id: '', name: '', category: 'Sales & CRM', description: '', isVisible: true });

  // Toggle Customer Feature Visibility
  const handleToggleCustomerFeature = (featureId) => {
    const updated = customerFeatures.map(feat => feat.id === featureId ? { ...feat, isVisible: !feat.isVisible } : feat);
    setCustomerFeatures(updated);
    localStorage.setItem('beaurex_customer_features', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('beaurex_customer_features_updated', { detail: updated }));
    const t = updated.find(f => f.id === featureId);
    showFeatureToast(`Customer feature "${t?.name}" is now ${t?.isVisible ? 'VISIBLE' : 'HIDDEN'}.`);
  };

  const handleBulkToggleCustomerFeatures = (visibleState) => {
    const updated = customerFeatures.map(f => ({ ...f, isVisible: visibleState }));
    setCustomerFeatures(updated);
    localStorage.setItem('beaurex_customer_features', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('beaurex_customer_features_updated', { detail: updated }));
    showFeatureToast(`All Customer portal features set to ${visibleState ? 'VISIBLE' : 'HIDDEN'}.`);
  };

  const handleSaveEditedCustomerFeature = (e) => {
    if (e) e.preventDefault();
    if (!editingCustomerFeatureModal) return;
    const updated = customerFeatures.map(f => f.id === editingCustomerFeatureModal.id ? editingCustomerFeatureModal : f);
    setCustomerFeatures(updated);
    localStorage.setItem('beaurex_customer_features', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('beaurex_customer_features_updated', { detail: updated }));
    showFeatureToast(`Customer feature "${editingCustomerFeatureModal.name}" updated successfully.`);
    setEditingCustomerFeatureModal(null);
  };

  const handleCreateNewCustomerFeature = (e) => {
    if (e) e.preventDefault();
    if (!newCustomerFeatureForm.name) return;
    const featureId = newCustomerFeatureForm.id ? newCustomerFeatureForm.id.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_') : ('cust_feat_' + Date.now().toString(36));
    const created = { ...newCustomerFeatureForm, id: featureId, isCustom: true };
    const updated = [...customerFeatures, created];
    setCustomerFeatures(updated);
    localStorage.setItem('beaurex_customer_features', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('beaurex_customer_features_updated', { detail: updated }));
    showFeatureToast(`New customer feature "${created.name}" created.`);
    setNewCustomerFeatureForm({ id: '', name: '', category: 'Loyalty Rewards', description: '', isVisible: true });
    setAddCustomerFeatureModalOpen(false);
  };

  const handleDeleteCustomerFeature = (featureId) => {
    const feat = customerFeatures.find(f => f.id === featureId);
    requestConfirm({
      title: `Delete Customer Feature: "${feat?.name || featureId}"?`,
      message: `Are you sure you want to delete this feature from the Customer Portal?`,
      confirmText: 'Yes, Delete Feature',
      type: 'danger',
      onConfirm: () => {
        const updated = customerFeatures.filter(f => f.id !== featureId);
        setCustomerFeatures(updated);
        localStorage.setItem('beaurex_customer_features', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('beaurex_customer_features_updated', { detail: updated }));
        showFeatureToast(`Customer feature "${feat?.name}" deleted.`);
      }
    });
  };

  // Toggle Team Feature Visibility
  const handleToggleTeamFeature = (featureId) => {
    const updated = teamFeatures.map(feat => feat.id === featureId ? { ...feat, isVisible: !feat.isVisible } : feat);
    setTeamFeatures(updated);
    localStorage.setItem('beaurex_team_features', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('beaurex_team_features_updated', { detail: updated }));
    const t = updated.find(f => f.id === featureId);
    showFeatureToast(`Team feature "${t?.name}" is now ${t?.isVisible ? 'VISIBLE' : 'HIDDEN'}.`);
  };

  const handleBulkToggleTeamFeatures = (visibleState) => {
    const updated = teamFeatures.map(f => ({ ...f, isVisible: visibleState }));
    setTeamFeatures(updated);
    localStorage.setItem('beaurex_team_features', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('beaurex_team_features_updated', { detail: updated }));
    showFeatureToast(`All Team features set to ${visibleState ? 'VISIBLE' : 'HIDDEN'}.`);
  };

  const handleSaveEditedTeamFeature = (e) => {
    if (e) e.preventDefault();
    if (!editingTeamFeatureModal) return;
    const updated = teamFeatures.map(f => f.id === editingTeamFeatureModal.id ? editingTeamFeatureModal : f);
    setTeamFeatures(updated);
    localStorage.setItem('beaurex_team_features', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('beaurex_team_features_updated', { detail: updated }));
    showFeatureToast(`Team feature "${editingTeamFeatureModal.name}" updated successfully.`);
    setEditingTeamFeatureModal(null);
  };

  const handleCreateNewTeamFeature = (e) => {
    if (e) e.preventDefault();
    if (!newTeamFeatureForm.name) return;
    const featureId = newTeamFeatureForm.id ? newTeamFeatureForm.id.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_') : ('team_feat_' + Date.now().toString(36));
    const created = { ...newTeamFeatureForm, id: featureId, isCustom: true };
    const updated = [...teamFeatures, created];
    setTeamFeatures(updated);
    localStorage.setItem('beaurex_team_features', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('beaurex_team_features_updated', { detail: updated }));
    showFeatureToast(`New team feature "${created.name}" created.`);
    setNewTeamFeatureForm({ id: '', name: '', category: 'Sales & CRM', description: '', isVisible: true });
    setAddTeamFeatureModalOpen(false);
  };

  const handleDeleteTeamFeature = (featureId) => {
    const feat = teamFeatures.find(f => f.id === featureId);
    requestConfirm({
      title: `Delete Team Feature: "${feat?.name || featureId}"?`,
      message: `Are you sure you want to delete this feature from the Team Portal?`,
      confirmText: 'Yes, Delete Feature',
      type: 'danger',
      onConfirm: () => {
        const updated = teamFeatures.filter(f => f.id !== featureId);
        setTeamFeatures(updated);
        localStorage.setItem('beaurex_team_features', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('beaurex_team_features_updated', { detail: updated }));
        showFeatureToast(`Team feature "${feat?.name}" deleted.`);
      }
    });
  };

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
    dealId: '',
    couponCode: '',
    dealType: 'PERCENTAGE', // 'PERCENTAGE', 'FLAT', 'COMPLIMENTARY', 'FIXED_PRICE', 'CUSTOM'
    dealTitle: '',
    originalPrice: 24000,
    dealAmount: 0,
    discountPercent: 0,
    discountAmount: 0,
    validTill: '30 Days',
    isComplimentary: false,
    badgeText: '',
    notes: ''
  });

  // View Merchant Details Modal (Image 1 "VIEW" eye icon)
  const [viewMerchantModal, setViewMerchantModal] = useState(null);

  // Complimentary Access Modal State (4 Options: Status, Plan Tier, Reason, Days)
  const [complimentaryModalMerchant, setComplimentaryModalMerchant] = useState(null);
  const [complimentaryForm, setComplimentaryForm] = useState({
    status: 'YES',
    planTier: 'PROFESSIONAL',
    reason: '',
    days: 10,
    customValidTill: ''
  });

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

  // =========================================================================
  // Manage Referrals State (Images 1, 2, 3: Referrals Detail, View Modal, Add Payment Modal)
  // =========================================================================
  const initialReferralsData = [
    {
      id: '01739',
      userEmail: 'rohit.verma@gmail.com',
      userName: 'Rohit Verma',
      userNumber: '9811223344',
      referredTo: 'MW - 737 (Connaught Cafe)',
      referralAmt: 150,
      refund: 'None',
      paymentStatus: 'Paid',
      paymentHistory: [
        {
          id: 'PAY-73901',
          payDate: '20-07-2026, 02:30 PM',
          historyType: 'Referral Payout',
          amount: 150,
          method: 'Bank Transfer (NEFT / RTGS)',
          txnNumber: 'TXN-98217340',
          status: 'Paid',
          notes: 'Payout settlement for referral of Pooja Sharma'
        }
      ],
      details: {
        referredUser: 'Pooja Sharma\npooja.sharma@gmail.com',
        referralDate: '20-07-2026',
        userPaymentStatus: 'Paid',
        totalAmount: 150,
        paidAmount: 150,
        pendingAmount: 0,
        status: 'Completed'
      }
    },
    {
      id: '01738',
      userEmail: 'ananya.deshmukh@outlook.com',
      userName: 'Ananya Deshmukh',
      userNumber: '9822334455',
      referredTo: 'FR - 1734 (Organic Supermart)',
      referralAmt: 1500,
      refund: 'None',
      paymentStatus: 'Eligible',
      paymentHistory: [],
      details: {
        referredUser: 'Kunal Rao\nkunal.rao@gmail.com',
        referralDate: '19-07-2026',
        userPaymentStatus: 'Paid',
        totalAmount: 1500,
        paidAmount: 0,
        pendingAmount: 1500,
        status: 'Pending Approval'
      }
    },
    {
      id: '01737',
      userEmail: 'siddharth.mehta@gmail.com',
      userName: 'Siddharth Mehta',
      userNumber: '9833445566',
      referredTo: 'MW - 732 (Ka-feen Cafe)',
      referralAmt: 150,
      refund: 'None',
      paymentStatus: 'Paid',
      paymentHistory: [
        {
          id: 'PAY-73701',
          payDate: '18-07-2026, 11:15 AM',
          historyType: 'Referral Payout',
          amount: 150,
          method: 'UPI (GPay / PhonePe)',
          txnNumber: 'TXN-98216501',
          status: 'Paid',
          notes: 'Payout settlement for referral of Meera Sen'
        }
      ],
      details: {
        referredUser: 'Meera Sen\nmeera.sen@gmail.com',
        referralDate: '18-07-2026',
        userPaymentStatus: 'Paid',
        totalAmount: 150,
        paidAmount: 150,
        pendingAmount: 0,
        status: 'Completed'
      }
    },
    {
      id: '01736',
      userEmail: 'kavita.reddy@gmail.com',
      userName: 'Kavita Reddy',
      userNumber: '9844556677',
      referredTo: 'FR - 1732 (Urban Fitness)',
      referralAmt: 1500,
      refund: 'None',
      paymentStatus: 'Eligible',
      paymentHistory: [],
      details: {
        referredUser: 'Sunil Nair\nsunil.nair@gmail.com',
        referralDate: '17-07-2026',
        userPaymentStatus: 'Paid',
        totalAmount: 1500,
        paidAmount: 0,
        pendingAmount: 1500,
        status: 'Pending Approval'
      }
    },
    {
      id: '01641',
      userEmail: 'neha.kapoor@gmail.com',
      userName: 'Neha Kapoor',
      userNumber: '9855667788',
      referredTo: 'MW - 710 (Glamour Salon)',
      referralAmt: 150,
      refund: 'None',
      paymentStatus: 'Not Eligible',
      paymentHistory: [],
      details: {
        referredUser: 'Aarav Joshi\naarav.joshi@gmail.com',
        referralDate: '16-07-2026',
        userPaymentStatus: 'Not Paid',
        totalAmount: 150,
        paidAmount: 0,
        pendingAmount: 150,
        status: 'Awaiting Merchant Plan'
      }
    },
    {
      id: '01640',
      userEmail: 'arjun.sharma@gmail.com',
      userName: 'Arjun Sharma',
      userNumber: '9866778899',
      referredTo: 'MW - 679 (Chai Chaska Bar)',
      referralAmt: 150,
      refund: 'None',
      paymentStatus: 'Paid',
      paymentHistory: [
        {
          id: 'PAY-64001',
          payDate: '15-07-2026, 04:20 PM',
          historyType: 'Referral Payout',
          amount: 150,
          method: 'IMPS Immediate Transfer',
          txnNumber: 'TXN-98198234',
          status: 'Paid',
          notes: 'Payout settlement for referral of Tanvi Gupta'
        }
      ],
      details: {
        referredUser: 'Tanvi Gupta\ntanvi.gupta@gmail.com',
        referralDate: '15-07-2026',
        userPaymentStatus: 'Paid',
        totalAmount: 150,
        paidAmount: 150,
        pendingAmount: 0,
        status: 'Completed'
      }
    },
    {
      id: '01639',
      userEmail: 'priya.singh@gmail.com',
      userName: 'Priya Singh',
      userNumber: '9877889900',
      referredTo: 'FR - 1727 (Royal Bakers)',
      referralAmt: 1500,
      refund: 'None',
      paymentStatus: 'Not Eligible',
      paymentHistory: [],
      details: {
        referredUser: 'Rishi Varma\nrishi.varma@gmail.com',
        referralDate: '14-07-2026',
        userPaymentStatus: 'Not Paid',
        totalAmount: 1500,
        paidAmount: 0,
        pendingAmount: 1500,
        status: 'Awaiting Merchant Plan'
      }
    },
    {
      id: '01638',
      userEmail: 'manish.tiwari@gmail.com',
      userName: 'Manish Tiwari',
      userNumber: '9888990011',
      referredTo: 'MW - 654 (Spice Junction)',
      referralAmt: 150,
      refund: 'None',
      paymentStatus: 'Paid',
      paymentHistory: [
        {
          id: 'PAY-63801',
          payDate: '12-07-2026, 01:10 PM',
          historyType: 'Referral Payout',
          amount: 150,
          method: 'Bank Transfer (NEFT / RTGS)',
          txnNumber: 'TXN-98176542',
          status: 'Paid',
          notes: 'Payout settlement for referral of Deepak Roy'
        }
      ],
      details: {
        referredUser: 'Deepak Roy\ndeepak.roy@gmail.com',
        referralDate: '12-07-2026',
        userPaymentStatus: 'Paid',
        totalAmount: 150,
        paidAmount: 150,
        pendingAmount: 0,
        status: 'Completed'
      }
    }
  ];

  const [referralsList, setReferralsList] = useState(() => {
    try {
      const saved = localStorage.getItem('loyalqr_admin_referrals');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clean out legacy test cache (yopmail, akhilesh test, etc.)
        if (Array.isArray(parsed) && parsed.length > 0 && !JSON.stringify(parsed).includes('yopmail') && !JSON.stringify(parsed).includes('akhilesh')) {
          return parsed.map(item => ({
            ...item,
            paymentHistory: Array.isArray(item.paymentHistory) && item.paymentHistory.length > 0
              ? item.paymentHistory
              : (Number(item.details?.paidAmount || 0) > 0 ? [
                  {
                    id: `PAY-${item.id}-01`,
                    payDate: `${item.details?.referralDate || '20-07-2026'}, 02:30 PM`,
                    historyType: 'Referral Payout',
                    amount: Number(item.details?.paidAmount),
                    method: 'Bank Transfer (NEFT / RTGS)',
                    txnNumber: `TXN-${item.id || '9821'}7340`,
                    status: 'Paid',
                    notes: `Payout settlement for referral of ${item.details?.referredUser?.split('\n')[0] || item.userName}`
                  }
                ] : [])
          }));
        }
      }
    } catch (_) {}
    try {
      localStorage.setItem('loyalqr_admin_referrals', JSON.stringify(initialReferralsData));
    } catch (_) {}
    return initialReferralsData;
  });
  const [referralSearch, setReferralSearch] = useState('');
  const [selectedReferralDetailModal, setSelectedReferralDetailModal] = useState(null);
  const [viewHistoryModal, setViewHistoryModal] = useState(null);
  const [processPaymentModal, setProcessPaymentModal] = useState({ isOpen: false, referral: null, amount: '', txnNumber: '', method: 'Bank Transfer (NEFT / RTGS)', notes: '', historyType: 'Referral Payout', payDate: '' });
  const [addReferralModalOpen, setAddReferralModalOpen] = useState(false);
  const [newReferralInput, setNewReferralInput] = useState({ userEmail: '', userName: '', userNumber: '', referredTo: '', referralAmt: 150 });
  const [referralToast, setReferralToast] = useState('');

  // Delete Referral Record Handler
  const handleDeleteReferral = (refId) => {
    const item = referralsList.find(r => r.id === refId);
    const targetLabel = item?.userName && item.userName !== '-' ? item.userName : (item?.userEmail || refId);
    requestConfirm({
      title: 'Permission Required: Delete Referral Record',
      message: `Are you sure you want to permanently delete the referral record for "${targetLabel}" (ID: ${refId})? This action cannot be undone.`,
      confirmText: 'Yes, Delete Record',
      type: 'danger',
      onConfirm: () => {
        setReferralsList(prev => {
          const updated = prev.filter(r => r.id !== refId);
          try {
            localStorage.setItem('loyalqr_admin_referrals', JSON.stringify(updated));
          } catch (_) {}
          return updated;
        });
        setReferralToast('Referral record deleted successfully.');
        setTimeout(() => setReferralToast(''), 4000);
      }
    });
  };

  // =========================================================================
  // Manage Deals & Coupons State (Image 1: All Created Deals Table & Modals)
  // =========================================================================
  const initialPlatformDeals = [
    {
      id: 'deal_img_1',
      planType: 'Franchise',
      state: 'All',
      dealName: 'temp fran',
      couponCode: 'TEMP FRAN',
      createdAt: '03-07-2026',
      bonusAmount: '₹',
      discountAmount: 5999,
      discountPercentage: 0,
      validityDate: '31-07-2026',
      usedCount: 2,
      maxUsage: 15,
      status: 'Active'
    },
    {
      id: 'deal_img_2',
      planType: 'Franchise',
      state: 'All',
      dealName: 'Creator Fr',
      couponCode: 'FRC',
      createdAt: '12-05-2026',
      bonusAmount: 7000,
      discountAmount: 3000,
      discountPercentage: 0,
      validityDate: '13-05-2026',
      usedCount: 1,
      maxUsage: 5,
      status: 'Active'
    },
    {
      id: 'deal_img_3',
      planType: 'Franchise',
      state: 'All',
      dealName: 'Festive Gold Discount',
      couponCode: 'FESTIVE2026',
      createdAt: '11-05-2026',
      bonusAmount: 0,
      discountAmount: 5999,
      discountPercentage: 0,
      validityDate: '12-05-2026',
      usedCount: 2,
      maxUsage: 50,
      status: 'Active'
    },
    {
      id: 'deal_img_4',
      planType: 'Franchise',
      state: 'All',
      dealName: 'Franchise Partner Saver',
      couponCode: 'PARTNER30',
      createdAt: '03-04-2026',
      bonusAmount: 0,
      discountAmount: 29999,
      discountPercentage: 0,
      validityDate: '21-04-2026',
      usedCount: 3,
      maxUsage: 50,
      status: 'Active'
    },
    {
      id: 'deal_img_5',
      planType: 'MiniWebsite',
      state: 'All',
      dealName: 'Sale Special 450',
      couponCode: 'SALE450',
      createdAt: '03-04-2026',
      bonusAmount: 0,
      discountAmount: 499,
      discountPercentage: 0,
      validityDate: '06-04-2026',
      usedCount: 16,
      maxUsage: 1000,
      status: 'Active'
    },
    {
      id: 'deal_img_6',
      planType: 'Franchise',
      state: 'All',
      dealName: 'Retail Launch Special',
      couponCode: 'RETAIL1000',
      createdAt: '09-12-2025',
      bonusAmount: 0,
      discountAmount: 29999,
      discountPercentage: 0,
      validityDate: '10-12-2025',
      usedCount: 1,
      maxUsage: 50,
      status: 'Active'
    },
    {
      id: 'deal_img_7',
      planType: 'MiniWebsite',
      state: 'All',
      dealName: 'trade',
      couponCode: 'TRADEFAIR30%',
      createdAt: '20-11-2025',
      bonusAmount: 0,
      discountAmount: 254,
      discountPercentage: 30,
      validityDate: '28-11-2025',
      usedCount: 2,
      maxUsage: 10000000,
      status: 'Active'
    },
    {
      id: 'deal_img_8',
      planType: 'MiniWebsite',
      state: 'All',
      dealName: 'DEFAULT SALES',
      couponCode: 'DFLT SALES',
      createdAt: '19-10-2025',
      bonusAmount: 400,
      discountAmount: 100,
      discountPercentage: 0,
      validityDate: '31-12-2030',
      usedCount: 0,
      maxUsage: 10000000,
      status: 'Active'
    },
    {
      id: 'deal_img_9',
      planType: 'Franchise',
      state: 'All',
      dealName: 'DEFAULT FRD (Premium Plan)',
      couponCode: 'FRD PP',
      createdAt: '17-10-2025',
      bonusAmount: 3500,
      discountAmount: 0,
      discountPercentage: 0,
      validityDate: '06-09-2030',
      usedCount: 1,
      maxUsage: 10000000,
      status: 'Active'
    },
    {
      id: 'deal_img_10',
      planType: 'Franchise',
      state: 'All',
      dealName: 'DEFAULT FRD (Standard Plan)',
      couponCode: 'FRD SP',
      createdAt: '17-10-2025',
      bonusAmount: 2500,
      discountAmount: 0,
      discountPercentage: 0,
      validityDate: '06-09-2030',
      usedCount: 0,
      maxUsage: 10000000,
      status: 'Active'
    },
    {
      id: 'deal_img_11',
      planType: 'Franchise',
      state: 'All',
      dealName: 'DEFAULT FRD (Creator Plan)',
      couponCode: 'FRD CP',
      createdAt: '17-10-2025',
      bonusAmount: 1500,
      discountAmount: 500,
      discountPercentage: 0,
      validityDate: '06-09-2030',
      usedCount: 0,
      maxUsage: 10000000,
      status: 'Active'
    },
    {
      id: 'deal_img_12',
      planType: 'Franchise',
      state: 'All',
      dealName: 'DEFAULT FRD (Basic Free Plan)',
      couponCode: 'FRD BFP',
      createdAt: '17-10-2025',
      bonusAmount: 1500,
      discountAmount: 0,
      discountPercentage: 0,
      validityDate: '06-09-2030',
      usedCount: 0,
      maxUsage: 10000000,
      status: 'Active'
    },
    {
      id: 'deal_img_13',
      planType: 'Franchise',
      state: 'All',
      dealName: '25 SEPF',
      couponCode: '25 SEPF',
      createdAt: '25-09-2025',
      bonusAmount: 10,
      discountAmount: 5090,
      discountPercentage: 0,
      validityDate: '27-09-2025',
      usedCount: 20,
      maxUsage: 10,
      status: 'Active'
    },
    {
      id: 'deal_img_14',
      planType: 'Franchise',
      state: 'All',
      dealName: '12SEPF',
      couponCode: '12SEPF',
      createdAt: '12-09-2025',
      bonusAmount: 10,
      discountAmount: 5000,
      discountPercentage: 0,
      validityDate: '26-09-2025',
      usedCount: 11,
      maxUsage: 12,
      status: 'Active'
    }
  ];

  const [platformDeals, setPlatformDeals] = useState(() => {
    try {
      const saved = localStorage.getItem('loyalqr_platform_deals');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && !JSON.stringify(parsed).includes('test05') && !JSON.stringify(parsed).includes('TEST FE') && !JSON.stringify(parsed).includes('testprice')) {
          return parsed;
        }
      }
    } catch (_) {}
    try {
      localStorage.setItem('loyalqr_platform_deals', JSON.stringify(initialPlatformDeals));
    } catch (_) {}
    return initialPlatformDeals;
  });

  const [dealCustomerMappingModalOpen, setDealCustomerMappingModalOpen] = useState(false);
  const [editingDealModal, setEditingDealModal] = useState({ isOpen: false, deal: null });
  const [dealToast, setDealToast] = useState('');
  const [dealSearch, setDealSearch] = useState('');

  // Form State for Deal & Coupons
  const [newDealForm, setNewDealForm] = useState({
    planName: 'Standard Plan',
    state: 'All States (No state restriction)',
    dealName: '',
    couponCode: '',
    bonusAmount: '',
    discountAmount: '',
    discountPercentage: '',
    validityDate: '',
    maxUsage: 0
  });

  // =========================================================================
  // Settings Modules State (Image 2 - Platform, Contact, Brand, FAQ, Privacy, Terms)
  // =========================================================================
  const [settingsActiveModal, setSettingsActiveModal] = useState(null); // 'platform' | 'contact' | 'brand' | 'faq' | 'privacy' | 'terms' | null
  const [settingsToast, setSettingsToast] = useState('');

  const [platformSettings, setPlatformSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('loyalqr_platform_settings');
      return saved ? JSON.parse(saved) : {
        platformName: 'BeAurex Platform',
        supportTagline: 'Next-Generation QR Customer Loyalty & Engagement Engine',
        businessRegistration: 'CIN: U72200DL2025PTC123456',
        defaultCurrency: 'INR (₹)',
        timezone: 'Asia/Kolkata (IST)',
        contactEmail: 'admin@beaurex.com',
        status: 'Completed',
        lastUpdated: 'May 24, 2025 11:20 AM'
      };
    } catch {
      return {
        platformName: 'BeAurex Platform',
        supportTagline: 'Next-Generation QR Customer Loyalty & Engagement Engine',
        businessRegistration: 'CIN: U72200DL2025PTC123456',
        defaultCurrency: 'INR (₹)',
        timezone: 'Asia/Kolkata (IST)',
        contactEmail: 'admin@beaurex.com',
        status: 'Completed',
        lastUpdated: 'May 24, 2025 11:20 AM'
      };
    }
  });

  const [contactSettings, setContactSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('loyalqr_contact_settings');
      return saved ? JSON.parse(saved) : {
        supportEmail: 'support@beaurex.com',
        supportPhone: '+91 98765 43210',
        emergencyPhone: '+91 98112 23344',
        address: 'DLF Cyber City, Tower 10B, 8th Floor, Gurugram, HR 122002',
        twitterUrl: 'https://twitter.com/beaurex',
        instagramUrl: 'https://instagram.com/beaurex',
        linkedinUrl: 'https://linkedin.com/company/beaurex',
        youtubeUrl: 'https://youtube.com/@beaurex',
        status: 'Completed',
        lastUpdated: 'May 24, 2025 10:45 AM'
      };
    } catch {
      return {
        supportEmail: 'support@beaurex.com',
        supportPhone: '+91 98765 43210',
        emergencyPhone: '+91 98112 23344',
        address: 'DLF Cyber City, Tower 10B, 8th Floor, Gurugram, HR 122002',
        twitterUrl: 'https://twitter.com/beaurex',
        instagramUrl: 'https://instagram.com/beaurex',
        linkedinUrl: 'https://linkedin.com/company/beaurex',
        youtubeUrl: 'https://youtube.com/@beaurex',
        status: 'Completed',
        lastUpdated: 'May 24, 2025 10:45 AM'
      };
    }
  });

  const [brandSettings, setBrandSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('loyalqr_brand_settings');
      return saved ? JSON.parse(saved) : {
        brandName: 'BeAurex',
        logoUrl: '/beaurex-icon.jpg',
        faviconUrl: '/favicon.ico',
        primaryColor: '#8B0000',
        secondaryColor: '#9E000D',
        accentColor: '#c8102e',
        status: 'Completed',
        lastUpdated: 'May 24, 2025 09:30 AM'
      };
    } catch {
      return {
        brandName: 'BeAurex',
        logoUrl: '/beaurex-icon.jpg',
        faviconUrl: '/favicon.ico',
        primaryColor: '#8B0000',
        secondaryColor: '#9E000D',
        accentColor: '#c8102e',
        status: 'Completed',
        lastUpdated: 'May 24, 2025 09:30 AM'
      };
    }
  });

  const [faqList, setFaqList] = useState(() => {
    try {
      const saved = localStorage.getItem('loyalqr_faqs');
      return saved ? JSON.parse(saved) : [
        { id: 'f1', question: 'How do customers earn points at our store counter?', answer: 'Customers scan the acrylic QR standee on the store counter using any phone camera or QR scanner. No app download is required.' },
        { id: 'f2', question: 'How does merchant payout and billing settlement work?', answer: 'Settlements for customer purchases and paid vouchers are settled within 24 hours directly via verified UPI / Bank IMPS.' },
        { id: 'f3', question: 'Can merchants customize their scratch cards and rewards?', answer: 'Yes, store owners can set points thresholds, voucher values, validity duration, and minimum order criteria anytime.' },
        { id: 'f4', question: 'Is hardware or printer required for counter operations?', answer: 'No special hardware is required. Store staff simply verify the 4-digit customer redemption PIN or counter voucher code.' },
        { id: 'f5', question: 'Can multiple staff members log in at the same billing desk?', answer: 'Yes, role-based staff pin access allows simultaneous counter cashier operations with individualized audit trails.' }
      ];
    } catch {
      return [
        { id: 'f1', question: 'How do customers earn points at our store counter?', answer: 'Customers scan the acrylic QR standee on the store counter using any phone camera or QR scanner. No app download is required.' }
      ];
    }
  });

  const [faqMeta, setFaqMeta] = useState({
    totalFaqs: 48,
    lastUpdated: 'May 24, 2025 08:50 AM'
  });

  const [privacyPolicyData, setPrivacyPolicyData] = useState(() => {
    try {
      const saved = localStorage.getItem('beaurex_legal_policies');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.privacy) return parsed.privacy;
      }
    } catch (_) {}
    return {
      version: '1.0',
      lastUpdated: 'May 24, 2026 08:20 AM',
      content: `BeAurex Platform Privacy Policy (v1.0)\n\nWe prioritize customer and merchant data security above all else.\n\n1. Data Collection: We collect merchant business name, phone number, and transaction telemetry solely for reward issuance and counter fraud prevention.\n2. Security: All traffic is encrypted using 256-bit TLS/SSL certificates and stored in SOC2-compliant MongoDB database clusters.\n3. Third-party Sharing: Customer phone numbers are never shared or sold to third-party advertisers.\n4. Deletion Rights: Merchants and shoppers can request account or phone deletion with 48 business hours turnaround.`
    };
  });

  const [termsData, setTermsData] = useState(() => {
    try {
      const saved = localStorage.getItem('beaurex_legal_policies');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.terms) return parsed.terms;
      }
    } catch (_) {}
    return {
      version: '1.0',
      lastUpdated: 'May 24, 2026 08:20 AM',
      content: `BeAurex Platform Terms & Conditions (v1.0)\n\n1. Merchant Eligibility: Any registered business, café, retail store, salon, or service provider is eligible to use the loyalty engine.\n2. Fair Usage: System accounts must not be used for fraudulent scans or manufactured reward cycles.\n3. Subscription & Renewals: Free trial terms are active for 2-3 calendar days. Subscription plans renew based on merchant selection.`
    };
  });

  // Helper to trigger toast
  const showSettingsToast = (msg) => {
    setSettingsToast(msg);
    setTimeout(() => setSettingsToast(''), 3000);
  };

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
    // Email & SMTP Service
    emailProvider: 'SMTP',
    emailApiKey: '',
    emailSenderAddress: 'notifications@beaurex.com',
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPass: '',
    smtpSecure: false,
    smtpFrom: 'BeAurex Loyalty <notifications@beaurex.com>',
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

  // Overview dynamic telemetry stats
  const [overviewStats, setOverviewStats] = useState({
    totalRevenue: '₹28.4 Lakh',
    revenueGrowth: '↑ +32%',
    totalStores: 142,
    paidStores: 118,
    trialStores: 24,
    totalScans: '1,42,850',
    todayScans: '1,420',
    repeatVisitRate: '43.2%',
    dbEngine: 'MongoDB Live',
    dbLatency: 'Cluster beaurex • 2ms Latency'
  });

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
  const initialTeamMembers = [
    {
      userId: '1696',
      name: 'Rajesh Sharma',
      email: 'rajesh.sharma@beaurex.com',
      mobile: '9810123456',
      mwId: '714, 711, 710',
      totalMwCreated: 3,
      totalSales: '₹4,500',
      district: 'Central Delhi',
      state: 'Delhi',
      status: 'ACTIVE',
      lastLogin: 'Today, 10:15 AM',
      hasReferral: true,
      hasCustomerTracker: true,
      password: 'Password@123'
    },
    {
      userId: '1694',
      name: 'Sneha Verma',
      email: 'sneha.verma@beaurex.com',
      mobile: '9820234567',
      mwId: '725, 719',
      totalMwCreated: 2,
      totalSales: '₹3,000',
      district: 'Mumbai Suburban',
      state: 'Maharashtra',
      status: 'ACTIVE',
      lastLogin: 'Yesterday, 04:30 PM',
      hasReferral: true,
      hasCustomerTracker: true,
      password: 'Password@123'
    },
    {
      userId: '1687',
      name: 'Amit Patel',
      email: 'amit.patel@beaurex.com',
      mobile: '9830345678',
      mwId: '702',
      totalMwCreated: 1,
      totalSales: '₹1,500',
      district: 'Ahmedabad',
      state: 'Gujarat',
      status: 'ACTIVE',
      lastLogin: '05 Oct 2026',
      hasReferral: true,
      hasCustomerTracker: true,
      password: 'Password@123'
    },
    {
      userId: '1648',
      name: 'Pooja Nair',
      email: 'pooja.nair@beaurex.com',
      mobile: '9840456789',
      mwId: '679',
      totalMwCreated: 1,
      totalSales: '₹2,000',
      district: 'Bengaluru Urban',
      state: 'Karnataka',
      status: 'ACTIVE',
      lastLogin: '04 Oct 2026',
      hasReferral: true,
      hasCustomerTracker: true,
      password: 'Password@123'
    },
    {
      userId: '1642',
      name: 'Vikram Malhotra',
      email: 'vikram.m@beaurex.com',
      mobile: '9850567890',
      mwId: '660',
      totalMwCreated: 1,
      totalSales: '₹1,500',
      district: 'Pune',
      state: 'Maharashtra',
      status: 'ACTIVE',
      lastLogin: '03 Oct 2026',
      hasReferral: true,
      hasCustomerTracker: true,
      password: 'Password@123'
    },
    {
      userId: '1619',
      name: 'Kavita Reddy',
      email: 'kavita.reddy@beaurex.com',
      mobile: '9860678901',
      mwId: '654',
      totalMwCreated: 1,
      totalSales: '₹1,000',
      district: 'Hyderabad',
      state: 'Telangana',
      status: 'ACTIVE',
      lastLogin: '02 Oct 2026',
      hasReferral: true,
      hasCustomerTracker: true,
      password: 'Password@123'
    }
  ];

  const [teamMembers, setTeamMembers] = useState(() => {
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem('beaurex_created_teams') || '[]');
      if (Array.isArray(saved) && saved.length > 0 && !JSON.stringify(saved).includes('yopmail') && !JSON.stringify(saved).includes('testteam') && !JSON.stringify(saved).includes('temp032') && !JSON.stringify(saved).includes('MWdemo')) {
        return saved;
      }
    } catch (e) {}
    try {
      localStorage.setItem('beaurex_created_teams', JSON.stringify(initialTeamMembers));
    } catch (_) {}
    return initialTeamMembers;
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

  // Team Management Modals: Reset Password & Edit Team Member
  const [resetPasswordModal, setResetPasswordModal] = useState({ isOpen: false, member: null, newPassword: '' });
  const [editTeamMemberModal, setEditTeamMemberModal] = useState({
    isOpen: false,
    member: null,
    form: { name: '', email: '', mobile: '', district: '', state: '', role: 'FIELD_AGENT', mwId: '' }
  });

  const handleCreateTeamMember = (e) => {
    e.preventDefault();
    if (!newTeamMember.name || !newTeamMember.email || !newTeamMember.password) return;

    requestConfirm({
      title: 'Permission Required: Create Team Member',
      message: `Are you sure you want to create a new team account for "${newTeamMember.name}" (${newTeamMember.email})? Credentials will be activated for field agent login.`,
      confirmText: 'Yes, Create Member',
      type: 'primary',
      onConfirm: () => {
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
      }
    });
  };

  const handleDeleteTeamMember = (userId) => {
    const member = teamMembers.find(m => m.userId === userId);
    requestConfirm({
      title: 'Permission Required: Remove Team Member',
      message: `Are you sure you want to permanently remove team member "${member?.name || userId}"? They will lose dashboard access immediately.`,
      confirmText: 'Yes, Remove Member',
      type: 'danger',
      onConfirm: () => {
        const updated = teamMembers.filter(m => m.userId !== userId);
        setTeamMembers(updated);
        try {
          localStorage.setItem('beaurex_created_teams', JSON.stringify(updated));
        } catch (err) {}
        setTeamSuccessMsg(`Team member removed.`);
        setTimeout(() => setTeamSuccessMsg(''), 4000);
      }
    });
  };

  const handleToggleTeamStatus = (userId) => {
    const member = teamMembers.find(m => m.userId === userId);
    const newStatus = member?.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    requestConfirm({
      title: `Permission Required: ${newStatus === 'ACTIVE' ? 'Activate' : 'Deactivate'} Member`,
      message: `Are you sure you want to set status of "${member?.name || userId}" to ${newStatus}?`,
      confirmText: `Yes, Set ${newStatus}`,
      type: newStatus === 'ACTIVE' ? 'success' : 'warning',
      onConfirm: () => {
        const updated = teamMembers.map(m => {
          if (m.userId === userId) {
            return { ...m, status: newStatus };
          }
          return m;
        });
        setTeamMembers(updated);
        try {
          localStorage.setItem('beaurex_created_teams', JSON.stringify(updated));
        } catch (err) {}
        setTeamSuccessMsg(`Status for ${member?.name || userId} updated to ${newStatus}.`);
        setTimeout(() => setTeamSuccessMsg(''), 4000);
      }
    });
  };

  const handleSaveEditTeamMember = (e) => {
    e.preventDefault();
    if (!editTeamMemberModal.member) return;
    const { name, email, mobile, district, state, role, mwId } = editTeamMemberModal.form;
    const updated = teamMembers.map(m => {
      if (m.userId === editTeamMemberModal.member.userId) {
        return {
          ...m,
          name: name.trim() || m.name,
          email: email.trim() || m.email,
          mobile: mobile.trim() || m.mobile,
          district: district.trim() || m.district,
          state: state.trim() || m.state,
          role: role || m.role,
          mwId: mwId ? mwId.trim() : m.mwId
        };
      }
      return m;
    });
    setTeamMembers(updated);
    try {
      localStorage.setItem('beaurex_created_teams', JSON.stringify(updated));
    } catch (err) {}
    setTeamSuccessMsg(`Team member "${name}" updated successfully.`);
    setEditTeamMemberModal({ isOpen: false, member: null, form: { name: '', email: '', mobile: '', district: '', state: '', role: 'FIELD_AGENT', mwId: '' } });
    setTimeout(() => setTeamSuccessMsg(''), 4000);
  };

  const handleResetTeamPassword = (e) => {
    e.preventDefault();
    if (!resetPasswordModal.member || !resetPasswordModal.newPassword) return;
    const newPass = resetPasswordModal.newPassword.trim();
    const updated = teamMembers.map(m => {
      if (m.userId === resetPasswordModal.member.userId) {
        return { ...m, password: newPass };
      }
      return m;
    });
    setTeamMembers(updated);
    try {
      localStorage.setItem('beaurex_created_teams', JSON.stringify(updated));
    } catch (err) {}
    navigator.clipboard?.writeText(newPass);
    setTeamSuccessMsg(`Password for "${resetPasswordModal.member.name}" reset to "${newPass}" (copied to clipboard)!`);
    setResetPasswordModal({ isOpen: false, member: null, newPassword: '' });
    setTimeout(() => setTeamSuccessMsg(''), 5000);
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
    if (member.userId === '1696' || member.name === 'Rajesh Sharma' || member.name === 'MWdemo') {
      return [
        { id: 'ref_714', storeName: 'MW-714 Connaught Cafe', category: 'Cafe & Dining', owner: 'Ramesh Gupta', phone: '98765 43210', city: 'Connaught Place, Delhi', date: '18 Sep 2026', plan: 'Professional Plan', commission: '₹1,500', status: 'PAID' },
        { id: 'ref_711', storeName: 'MW-711 Organic Supermart', category: 'Grocery', owner: 'Anita Rao', phone: '98112 23399', city: 'Indiranagar, Bengaluru', date: '24 Sep 2026', plan: 'Professional Plan', commission: '₹1,500', status: 'PAID' },
        { id: 'ref_710', storeName: 'MW-710 Glamour Spa', category: 'Salon & Wellness', owner: 'Pooja Mehta', phone: '98990 01122', city: 'Bandra West, Mumbai', date: '28 Sep 2026', plan: 'Standard Plan', commission: '₹1,000', status: 'PAID' }
      ];
    }
    if (member.userId === '1648' || member.name === 'Pooja Nair' || member.name === 'test JX') {
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
          name: 'Sales Lead',
          approachedFor: 'BeAurex Loyalty',
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
    if (member.userId === '1696' || member.name === 'Rajesh Sharma' || member.name === 'MWdemo') {
      return [
        {
          id: 'crm_mw1',
          name: 'Delhi Retail Central',
          approachedFor: 'BeAurex Loyalty',
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
    if (member.userId === '1648' || member.name === 'Pooja Nair' || member.name === 'test JX') {
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

  const [crmRefreshTrigger, setCrmRefreshTrigger] = useState(0);

  // Delete CRM Lead from Member's Customer Manager
  const handleDeleteCrmLead = (member, lead) => {
    if (!member || !lead) return;
    requestConfirm({
      title: 'Permission Required: Delete CRM Lead',
      message: `Are you sure you want to delete lead "${lead.name}"?`,
      confirmText: 'Yes, Delete',
      type: 'danger',
      onConfirm: () => {
        const currentLeads = getMemberCrmLeads(member);
        const updated = currentLeads.filter(l => l.id !== lead.id);
        const keys = [
          `beaurex_team_crm_${member.userId}`,
          `beaurex_team_crm_${member.email}`,
          `beaurex_team_crm_${member.name}`
        ];
        keys.forEach(k => {
          try { localStorage.setItem(k, JSON.stringify(updated)); } catch(e) {}
        });
        if (member.userId === '4482' || member.name === 'Aarav Sharma') {
          try { localStorage.setItem('beaurex_team_crm_customers', JSON.stringify(updated)); } catch(e) {}
        }
        setCrmRefreshTrigger(prev => prev + 1);
        try {
          fetch(`/api/admin/crm/customers/${lead.id}`, { method: 'DELETE' }).catch(() => {});
        } catch(e) {}
      }
    });
  };

  // Delete Store Referral from Member's Referral Tracker
  const handleDeleteMemberReferral = (member, referral) => {
    if (!member || !referral) return;
    requestConfirm({
      title: 'Permission Required: Delete Store Referral',
      message: `Are you sure you want to remove referred store "${referral.storeName || 'Store'}"?`,
      confirmText: 'Yes, Delete',
      type: 'danger',
      onConfirm: () => {
        const currentRefs = getMemberReferrals(member);
        const updated = currentRefs.filter(r => r.id !== referral.id);
        const keys = [
          `beaurex_team_referrals_${member.userId}`,
          `beaurex_team_referrals_${member.email}`,
          `beaurex_team_referrals_${member.name}`
        ];
        keys.forEach(k => {
          try { localStorage.setItem(k, JSON.stringify(updated)); } catch(e) {}
        });
        setCrmRefreshTrigger(prev => prev + 1);
      }
    });
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

  const fetchOverview = () => {
    fetch('/api/admin/overview')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.stats) {
          setOverviewStats(prev => ({ ...prev, ...d.stats }));
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchOverview();
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

    fetch('/api/admin/permissions')
      .then(r => r.json())
      .then(d => { if (d.success && d.permissions) setPermissionsMatrix(d.permissions); })
      .catch(() => {});

    fetch('/api/admin/plans/history')
      .then(r => r.json())
      .then(d => { if (d.success && d.history?.length) setPlanHistory(d.history); })
      .catch(() => {});
  }, []);

  // Handle Open Deal Modal (Image 1)
  const handleOpenDeal = (merchant) => {
    setSelectedMerchantForDeal(merchant);
    const existing = merchant.dealDetails || {};

    // Determine base plan price
    const basePrice = existing.originalPrice || (() => {
      const p = plans.find(item => item.name?.toLowerCase() === String(merchant.plan || merchant.subscriptionTier || '').toLowerCase());
      if (p && p.price) return p.price;
      if (/professional/i.test(merchant.plan || merchant.subscriptionTier)) return 49000;
      if (/legacy/i.test(merchant.plan || merchant.subscriptionTier)) return 75000;
      if (/basic/i.test(merchant.plan || merchant.subscriptionTier)) return 9999;
      return 24000;
    })();

    // Check if merchant has an existing matching platform deal
    const matchedDeal = (platformDeals || []).find(d => 
      (existing.dealId && String(d.id) === String(existing.dealId)) ||
      (existing.dealTitle && d.dealName?.toLowerCase() === existing.dealTitle?.toLowerCase()) ||
      (existing.couponCode && d.couponCode?.toLowerCase() === existing.couponCode?.toLowerCase())
    );

    if (matchedDeal) {
      const hasPct = Boolean(matchedDeal.discountPercentage && Number(matchedDeal.discountPercentage) > 0);
      const pct = Number(matchedDeal.discountPercentage) || 0;
      const flat = Number(matchedDeal.discountAmount) || 0;
      const finalAmt = hasPct
        ? Math.max(0, Math.round(basePrice * (1 - pct / 100)))
        : Math.max(0, basePrice - flat);
      const calculatedType = hasPct ? 'PERCENTAGE' : (flat > 0 ? 'FLAT' : 'FIXED_PRICE');
      const badge = hasPct ? `${pct}% OFF` : (flat > 0 ? `₹${flat.toLocaleString('en-IN')} OFF` : 'SPECIAL DEAL');

      setDealForm({
        dealId: matchedDeal.id,
        dealType: existing.dealType || calculatedType,
        dealTitle: matchedDeal.dealName,
        couponCode: matchedDeal.couponCode || '',
        originalPrice: basePrice,
        dealAmount: existing.dealAmount !== undefined ? existing.dealAmount : finalAmt,
        discountPercent: pct,
        discountAmount: hasPct ? (basePrice - finalAmt) : flat,
        validTill: existing.validTill || matchedDeal.validityDate || '30 Days',
        isComplimentary: Boolean(existing.isComplimentary),
        badgeText: existing.badgeText || badge,
        notes: existing.notes || `Platform Deal: ${matchedDeal.dealName} [${matchedDeal.couponCode || ''}]`
      });
    } else {
      setDealForm({
        dealId: existing.dealId || '',
        dealType: existing.dealType || 'PERCENTAGE',
        dealTitle: existing.dealTitle || '',
        couponCode: existing.couponCode || '',
        originalPrice: basePrice,
        dealAmount: existing.dealAmount || basePrice,
        discountPercent: existing.discountPercent || 0,
        discountAmount: existing.discountAmount || 0,
        validTill: existing.validTill || '30 Days',
        isComplimentary: Boolean(existing.isComplimentary),
        badgeText: existing.badgeText || '',
        notes: existing.notes || ''
      });
    }
  };

  // Handle Save Deal
  const handleSaveDeal = async (e) => {
    if (e) e.preventDefault();
    if (!selectedMerchantForDeal) return;

    // Handle Remove Deal selection
    if (dealForm.dealId === 'REMOVE') {
      const emptyDeal = {
        dealType: 'NONE',
        dealTitle: '',
        dealAmount: 0,
        discountPercent: 0,
        discountAmount: 0,
        originalPrice: 0,
        validTill: '',
        isComplimentary: false,
        badgeText: '',
        notes: '',
        appliedAt: null
      };

      requestConfirm({
        title: 'Revoke Merchant Deal',
        message: `Remove deal from "${selectedMerchantForDeal.businessName}" and revert to standard plan pricing?`,
        confirmText: 'Yes, Remove Deal',
        type: 'danger',
        onConfirm: async () => {
          const updated = merchants.map(m => {
            if ((m.id || m._id) === (selectedMerchantForDeal.id || selectedMerchantForDeal._id)) {
              return {
                ...m,
                isComplimentary: false,
                dealDetails: emptyDeal
              };
            }
            return m;
          });
          setMerchants(updated);

          fetch('/api/admin/deals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              merchantId: selectedMerchantForDeal.id || selectedMerchantForDeal._id,
              action: 'REMOVE'
            })
          }).catch(() => {});

          setSelectedMerchantForDeal(null);
          setPaymentNotice(`Deal removed for ${selectedMerchantForDeal.businessName}. Reverted to default pricing.`);
          setTimeout(() => setPaymentNotice(''), 4500);
        }
      });
      return;
    }

    if (!dealForm.dealTitle && !dealForm.dealId) {
      return;
    }

    // Compute final badgeText and final deal price
    let finalBadge = dealForm.badgeText;
    let finalAmount = Number(dealForm.dealAmount) || 0;
    let isComp = dealForm.isComplimentary || dealForm.dealType === 'COMPLIMENTARY';

    if (dealForm.dealType === 'PERCENTAGE') {
      finalBadge = `${dealForm.discountPercent}% OFF`;
      finalAmount = Math.max(0, Math.round(dealForm.originalPrice * (1 - dealForm.discountPercent / 100)));
    } else if (dealForm.dealType === 'FLAT') {
      finalBadge = `₹${dealForm.discountAmount?.toLocaleString('en-IN')} OFF`;
      finalAmount = Math.max(0, dealForm.originalPrice - dealForm.discountAmount);
    } else if (dealForm.dealType === 'COMPLIMENTARY') {
      finalBadge = '100% FREE';
      finalAmount = 0;
      isComp = true;
    } else if (dealForm.dealType === 'FIXED_PRICE') {
      finalBadge = `₹${Number(dealForm.dealAmount).toLocaleString('en-IN')} SPECIAL`;
    }

    const payload = {
      ...dealForm,
      dealAmount: finalAmount,
      isComplimentary: isComp,
      badgeText: finalBadge,
      appliedAt: new Date().toISOString()
    };

    requestConfirm({
      title: 'Permission Required: Apply Special Deal',
      message: `Apply platform deal "${payload.dealTitle}" (${finalBadge} • Final Payable: ₹${finalAmount.toLocaleString('en-IN')}) to merchant "${selectedMerchantForDeal.businessName}"?`,
      confirmText: 'Yes, Apply Deal',
      type: 'primary',
      onConfirm: async () => {
        const updated = merchants.map(m => {
          if ((m.id || m._id) === (selectedMerchantForDeal.id || selectedMerchantForDeal._id)) {
            return {
              ...m,
              isComplimentary: isComp,
              dealDetails: { ...payload }
            };
          }
          return m;
        });
        setMerchants(updated);

        fetch('/api/admin/deals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            merchantId: selectedMerchantForDeal.id || selectedMerchantForDeal._id,
            ...payload
          })
        }).catch(() => {});

        setSelectedMerchantForDeal(null);
        setPaymentNotice(`Deal (${finalBadge}) successfully applied to ${selectedMerchantForDeal.businessName}.`);
        setTimeout(() => setPaymentNotice(''), 4500);
      }
    });
  };

  // Handle Remove / Clear Deal for Merchant
  const handleRemoveDeal = (merchant) => {
    if (!merchant) return;
    requestConfirm({
      title: 'Revoke Merchant Deal',
      message: `Are you sure you want to remove the special deal from "${merchant.businessName}"? The merchant will revert to standard plan billing.`,
      confirmText: 'Yes, Remove Deal',
      type: 'danger',
      onConfirm: async () => {
        const emptyDeal = {
          dealType: 'NONE',
          dealTitle: '',
          dealAmount: 0,
          discountPercent: 0,
          discountAmount: 0,
          originalPrice: 0,
          validTill: '',
          isComplimentary: false,
          badgeText: '',
          notes: '',
          appliedAt: null
        };
        const updated = merchants.map(m => {
          if ((m.id || m._id) === (merchant.id || merchant._id)) {
            return {
              ...m,
              isComplimentary: false,
              dealDetails: emptyDeal
            };
          }
          return m;
        });
        setMerchants(updated);

        fetch('/api/admin/deals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            merchantId: merchant.id || merchant._id,
            action: 'REMOVE'
          })
        }).catch(() => {});

        if (selectedMerchantForDeal && (selectedMerchantForDeal.id || selectedMerchantForDeal._id) === (merchant.id || merchant._id)) {
          setSelectedMerchantForDeal(null);
        }
        setPaymentNotice(`Special deal removed from ${merchant.businessName}.`);
        setTimeout(() => setPaymentNotice(''), 4000);
      }
    });
  };

  // Handle Open Complimentary Modal (4 Options: Status, Plan Tier, Reason, Days: 7, 15, 30, 90, 180, 1 Year, Lifetime)
  const handleOpenComplimentaryModal = (merchant) => {
    setComplimentaryModalMerchant(merchant);
    const isComp = merchant.isComplimentary === true;
    const isLifetime = merchant.complimentaryDays === 'Lifetime' || Number(merchant.complimentaryDays) >= 36500 || merchant.planValidTill === 'Lifetime Access';
    const initialDays = isLifetime ? 36500 : (merchant.complimentaryDays || 15);
    
    const d = new Date();
    d.setDate(d.getDate() + Number(initialDays));
    const calculatedDate = isLifetime ? 'Lifetime Access' : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    setComplimentaryForm({
      status: isComp ? 'YES' : 'YES',
      planTier: merchant.subscriptionTier || 'PROFESSIONAL',
      reason: merchant.complimentaryReason || '',
      days: isLifetime ? 'Lifetime' : initialDays,
      isLifetime: isLifetime,
      customValidTill: calculatedDate
    });
  };

  // Handle Save Complimentary (Updates Status, Tier, Reason, Days and recalculates Plan Expiry)
  const handleSaveComplimentary = (e) => {
    if (e) e.preventDefault();
    if (!complimentaryModalMerchant) return;

    const id = complimentaryModalMerchant.id || complimentaryModalMerchant._id;
    const isComp = complimentaryForm.status === 'YES';
    const isLifetime = complimentaryForm.isLifetime || complimentaryForm.days === 'Lifetime' || Number(complimentaryForm.days) >= 36500;
    const daysNum = isLifetime ? 36500 : (Number(complimentaryForm.days) || 15);
    
    const d = new Date();
    d.setDate(d.getDate() + daysNum);
    const newValidTill = isComp 
      ? (isLifetime ? 'Lifetime Access' : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }))
      : complimentaryModalMerchant.planValidTill;

    requestConfirm({
      title: 'Permission Required: Complimentary Access',
      message: isComp 
        ? `Grant complimentary ${complimentaryForm.planTier} tier (${isLifetime ? 'Lifetime Access' : `+${daysNum} days`}) to "${complimentaryModalMerchant.businessName}"? Reason: "${complimentaryForm.reason || 'Admin Special Courtesy'}"`
        : `Revoke complimentary access for "${complimentaryModalMerchant.businessName}"?`,
      confirmText: isComp ? 'Yes, Grant Access' : 'Yes, Revoke Access',
      type: isComp ? 'primary' : 'warning',
      onConfirm: () => {
        setMerchants(prev => prev.map(m => {
          if ((m.id || m._id) === id) {
            return {
              ...m,
              isComplimentary: isComp,
              complimentaryReason: isComp ? complimentaryForm.reason : '',
              complimentaryDays: isComp ? (isLifetime ? 'Lifetime' : daysNum) : 0,
              planValidTill: isComp ? newValidTill : m.planValidTill,
              subscriptionTier: isComp ? complimentaryForm.planTier : m.subscriptionTier,
              status: isComp ? 'Paid' : m.status
            };
          }
          return m;
        }));

        fetch(`/api/admin/merchants/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            isComplimentary: isComp,
            complimentaryReason: isComp ? complimentaryForm.reason : '',
            complimentaryDays: isComp ? (isLifetime ? 'Lifetime' : daysNum) : 0,
            planValidTill: isComp ? newValidTill : complimentaryModalMerchant.planValidTill,
            subscriptionTier: isComp ? complimentaryForm.planTier : complimentaryModalMerchant.subscriptionTier
          })
        }).catch(() => {});

        setPaymentNotice(
          isComp 
            ? `Complimentary access granted for ${complimentaryModalMerchant.businessName} (${isLifetime ? 'Lifetime Access' : `+${daysNum} days`})! Reason: "${complimentaryForm.reason || 'None provided'}"`
            : `Complimentary status updated for ${complimentaryModalMerchant.businessName}.`
        );
        setTimeout(() => setPaymentNotice(''), 4500);

        setComplimentaryModalMerchant(null);
      }
    });
  };

  // Handle Change Merchant Status (Image 1 "STATUS" dropdown)
  const handleChangeStatus = (id, newStatus) => {
    const merchant = merchants.find(m => (m.id || m._id) === id);
    requestConfirm({
      title: `Permission Required: Change Status to ${newStatus}`,
      message: `Are you sure you want to change the status of "${merchant?.businessName || 'this merchant'}" from ${merchant?.status} to ${newStatus}?`,
      confirmText: `Yes, Set to ${newStatus}`,
      type: newStatus === 'Suspended' ? 'danger' : 'primary',
      onConfirm: () => {
        const todayStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        const threeYearsDate = new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000)
          .toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

        const isUpgradingToPaid = newStatus === 'Paid';

        setMerchants(prev => prev.map(m => {
          if ((m.id || m._id) === id) {
            const updatedPlan = isUpgradingToPaid && (!m.plan || m.plan === 'Trial Plan') ? 'Professional Plan' : (newStatus === 'Trial' ? 'Trial Plan' : m.plan);
            const updatedTier = isUpgradingToPaid && (!m.subscriptionTier || m.subscriptionTier === 'TRIAL') ? 'PROFESSIONAL' : (newStatus === 'Trial' ? 'TRIAL' : m.subscriptionTier);
            return { 
              ...m, 
              status: newStatus, 
              isActive: newStatus !== 'Suspended',
              plan: updatedPlan,
              subscriptionTier: updatedTier,
              paymentAmount: isUpgradingToPaid ? (m.paymentAmount && m.paymentAmount !== '-' ? m.paymentAmount : '₹49,000') : (newStatus === 'Trial' ? '-' : m.paymentAmount),
              paymentDate: isUpgradingToPaid ? (m.paymentDate && m.paymentDate !== '-' ? m.paymentDate : todayStr) : (newStatus === 'Trial' ? '-' : m.paymentDate),
              planValidTill: isUpgradingToPaid ? (m.planValidTill && m.planValidTill !== '-' ? m.planValidTill : threeYearsDate) : m.planValidTill
            };
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
            setPaymentNotice('Merchant reactivated with Paid status! Store is now 100% online.');
            setTimeout(() => setPaymentNotice(''), 4500);
            fetchPayments();
          }).catch(() => {});
        }

        const payload = { status: newStatus };
        if (newStatus === 'Paid') {
          payload.plan = 'Professional Plan';
          payload.subscriptionTier = 'PROFESSIONAL';
          payload.paymentAmount = '₹49,000';
          payload.paymentDate = todayStr;
          payload.planValidTill = threeYearsDate;
        } else if (newStatus === 'Trial') {
          payload.plan = 'Trial Plan';
          payload.subscriptionTier = 'TRIAL';
          payload.paymentAmount = '-';
          payload.paymentDate = '-';
        }

        fetch(`/api/admin/merchants/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(() => {
          fetchMerchants();
          fetchPayments();
        }).catch(() => {});
      }
    });
  };

  // Suspend or Reactivate Merchant Account (Image 1 Suspend function)
  const handleToggleMerchantSuspend = async (merchantId, currentSuspended) => {
    const nextSuspend = !currentSuspended;
    const target = merchants.find(m => (m.id || m._id) === merchantId);
    requestConfirm({
      title: `Permission Required: ${nextSuspend ? 'Suspend' : 'Reactivate'} Merchant`,
      message: `Are you sure you want to ${nextSuspend ? 'suspend' : 'reactivate'} merchant "${target?.businessName || merchantId}"? ${nextSuspend ? 'Cashiers and counter scans will be locked.' : 'Store counter will resume immediately.'}`,
      confirmText: `Yes, ${nextSuspend ? 'Suspend' : 'Reactivate'}`,
      type: nextSuspend ? 'danger' : 'success',
      onConfirm: async () => {
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
      }
    });
  };

  // Mark Account as Paid
  const handleMarkPaid = async (merchantId, planTier = 'PROFESSIONAL', amount = 49000) => {
    const target = merchants.find(m => (m.id || m._id) === merchantId);
    requestConfirm({
      title: 'Permission Required: Mark Account as Paid',
      message: `Are you sure you want to mark "${target?.businessName || merchantId}" as Paid (${planTier} Tier • ₹${amount.toLocaleString('en-IN')})?`,
      confirmText: 'Yes, Mark as Paid',
      type: 'primary',
      onConfirm: async () => {
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
      }
    });
  };

  // Suspend or Reactivate Customer CRM Account (Real-time lockout)
  const handleToggleCustomerStatus = async (customerId, currentActive) => {
    const nextActive = !currentActive;
    const target = customers.find(c => (c.id || c._id) === customerId);
    requestConfirm({
      title: `Permission Required: ${nextActive ? 'Reactivate' : 'Suspend'} Customer`,
      message: `Are you sure you want to ${nextActive ? 'reactivate' : 'suspend'} customer "${target?.name || customerId}"?`,
      confirmText: `Yes, ${nextActive ? 'Reactivate' : 'Suspend'}`,
      type: nextActive ? 'success' : 'danger',
      onConfirm: async () => {
        try {
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
      }
    });
  };

  // Delete Merchant
  const handleDeleteMerchant = async (merchantId, merchantName) => {
    requestConfirm({
      title: 'Permission Required: Delete Merchant Account',
      message: `Are you sure you want to permanently delete merchant "${merchantName || 'this merchant'}"? All counter QR standees, visit records, vouchers, and rewards will be permanently deleted from the database.`,
      confirmText: 'Yes, Permanently Delete',
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/merchants/${merchantId}`, {
            method: 'DELETE'
          });
          const data = await res.json();
          if (data.success) {
            setPaymentNotice(data.message || 'Merchant successfully deleted');
            setTimeout(() => setPaymentNotice(''), 4500);
            setMerchants(prev => prev.filter(m => (m.id || m._id) !== merchantId));
            if (viewMerchantModal && (viewMerchantModal.id || viewMerchantModal._id) === merchantId) {
              setViewMerchantModal(null);
            }
            fetchMerchants();
            fetchPayments();
          } else {
            alert(data.message || 'Failed to delete merchant');
          }
        } catch (err) {
          console.error(err);
          alert('Error deleting merchant');
        }
      }
    });
  };

  // Delete Payment Record
  const handleDeletePayment = async (paymentId, businessName) => {
    requestConfirm({
      title: 'Permission Required: Reset Payment Record',
      message: `Are you sure you want to reset and delete the billing payment record for "${businessName || 'this merchant'}"?`,
      confirmText: 'Yes, Delete Record',
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/payments/${paymentId}`, {
            method: 'DELETE'
          });
          const data = await res.json();
          if (data.success) {
            setPaymentNotice(data.message || 'Payment record successfully deleted/reset');
            setTimeout(() => setPaymentNotice(''), 4500);
            fetchPayments();
            fetchMerchants();
          } else {
            alert(data.message || 'Failed to delete payment record');
          }
        } catch (err) {
          console.error(err);
          alert('Error deleting payment record');
        }
      }
    });
  };

  // Delete Customer
  const handleDeleteCustomer = async (customerId, customerName) => {
    requestConfirm({
      title: 'Permission Required: Delete Customer Record',
      message: `Are you sure you want to permanently delete customer "${customerName || 'this customer'}"? All stamps, visits, and vouchers belonging to them will be permanently erased.`,
      confirmText: 'Yes, Delete Customer',
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/customers/${customerId}`, {
            method: 'DELETE'
          });
          const data = await res.json();
          if (data.success) {
            setPaymentNotice(data.message || 'Customer deleted successfully');
            setTimeout(() => setPaymentNotice(''), 4500);
            setCustomers(prev => prev.filter(c => (c.id || c._id) !== customerId));
            fetchCustomers();
          } else {
            alert(data.message || 'Failed to delete customer');
          }
        } catch (err) {
          console.error(err);
          alert('Error deleting customer');
        }
      }
    });
  };

  // Handle Change Plan
  const handleChangePlan = (id, newPlan) => {
    const isPaid = newPlan !== 'Trial Plan';
    const tierMap = {
      'Professional Plan': 'PROFESSIONAL',
      'Standard Plan': 'STANDARD',
      'Enterprise Pro': 'LEGACY',
      'Basic Plan': 'STANDARD',
      'Trial Plan': 'TRIAL'
    };
    const priceMap = {
      'Professional Plan': '₹49,000',
      'Standard Plan': '₹24,000',
      'Enterprise Pro': '₹75,000',
      'Basic Plan': '₹999',
      'Trial Plan': '-'
    };
    const durationMap = {
      'Professional Plan': 3 * 365,
      'Standard Plan': 365,
      'Enterprise Pro': 100 * 365,
      'Basic Plan': 30,
      'Trial Plan': 2
    };

    const targetTier = tierMap[newPlan] || (isPaid ? 'PROFESSIONAL' : 'TRIAL');
    const todayStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const validityDate = new Date(Date.now() + (durationMap[newPlan] || 365) * 24 * 60 * 60 * 1000)
      .toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    setMerchants(prev => prev.map(m => {
      if ((m.id || m._id) === id) {
        return {
          ...m,
          plan: newPlan,
          subscriptionTier: targetTier,
          status: isPaid ? 'Paid' : 'Trial',
          isActive: true,
          paymentAmount: isPaid ? (m.paymentAmount && m.paymentAmount !== '-' ? m.paymentAmount : priceMap[newPlan]) : '-',
          paymentDate: isPaid ? (m.paymentDate && m.paymentDate !== '-' ? m.paymentDate : todayStr) : '-',
          planValidTill: isPaid ? (m.planValidTill && m.planValidTill !== '-' ? m.planValidTill : validityDate) : m.planValidTill
        };
      }
      return m;
    }));

    fetch(`/api/admin/merchants/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        plan: newPlan, 
        subscriptionTier: targetTier,
        status: isPaid ? 'Paid' : 'Trial',
        paymentAmount: isPaid ? priceMap[newPlan] : '-',
        paymentDate: isPaid ? todayStr : '-',
        planValidTill: isPaid ? validityDate : undefined
      })
    }).then(() => {
      fetchMerchants();
      fetchPayments();
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

  // Colorful tag palettes for plan cards & landing page (distinct colors & generous spacing)
  const PLAN_TAG_PALETTES = [
    {
      chip: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      icon: 'text-emerald-600',
      previewDark: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
      previewLight: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    },
    {
      chip: 'bg-amber-50 text-amber-800 border-amber-300',
      icon: 'text-amber-600',
      previewDark: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
      previewLight: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    {
      chip: 'bg-rose-50 text-rose-800 border-rose-300',
      icon: 'text-rose-600',
      previewDark: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
      previewLight: 'bg-rose-50 text-rose-800 border-rose-200'
    },
    {
      chip: 'bg-sky-50 text-sky-800 border-sky-300',
      icon: 'text-sky-600',
      previewDark: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40',
      previewLight: 'bg-sky-50 text-sky-800 border-sky-200'
    },
    {
      chip: 'bg-purple-50 text-purple-800 border-purple-300',
      icon: 'text-purple-600',
      previewDark: 'bg-purple-500/15 text-purple-300 border-purple-500/40',
      previewLight: 'bg-purple-50 text-purple-800 border-purple-200'
    },
    {
      chip: 'bg-indigo-50 text-indigo-800 border-indigo-300',
      icon: 'text-indigo-600',
      previewDark: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
      previewLight: 'bg-blue-50 text-blue-800 border-blue-200'
    }
  ];

  const getPlanTagList = (p) => {
    const tags = [];
    if (p.tagText && typeof p.tagText === 'string') {
      p.tagText.split(/[•,]/).map(s => s.trim()).filter(Boolean).forEach(t => {
        if (!tags.includes(t)) tags.push(t);
      });
    }
    if (Array.isArray(p.tags)) {
      p.tags.forEach(t => {
        if (t && typeof t === 'string') {
          const tr = t.trim();
          if (tr && !tags.includes(tr)) tags.push(tr);
        }
      });
    }
    return tags;
  };

  // Handle Add/Remove Tag for Active Plan
  const handleAddTagToPlan = (planId, customTag) => {
    const rawTag = (customTag || newPlanTagInputs[planId] || '').trim();
    if (!rawTag) return;
    const splitTags = rawTag.split(/[•,]/).map(t => t.trim()).filter(Boolean);
    setPlans(prev => prev.map(p => {
      if (p.id === planId) {
        const curTags = p.tags || [];
        const nextTags = [...curTags];
        splitTags.forEach(t => {
          if (!nextTags.includes(t)) nextTags.push(t);
        });
        return { ...p, tags: nextTags };
      }
      return p;
    }));
    setNewPlanTagInputs(prev => ({ ...prev, [planId]: '' }));
  };

  const handleRemoveTagFromPlan = (planId, tagIdx) => {
    setPlans(prev => prev.map(p => {
      if (p.id === planId) {
        const nextTags = [...(p.tags || [])];
        nextTags.splice(tagIdx, 1);
        return { ...p, tags: nextTags };
      }
      return p;
    }));
  };

  // Handle Add/Remove Tag for New Plan Form
  const handleAddTagToNewPlan = (customTag) => {
    const rawTag = (customTag || newPlanTagInput || '').trim();
    if (!rawTag) return;
    const splitTags = rawTag.split(/[•,]/).map(t => t.trim()).filter(Boolean);
    setNewPlanForm(prev => {
      const curTags = prev.tags || [];
      const nextTags = [...curTags];
      splitTags.forEach(t => {
        if (!nextTags.includes(t)) nextTags.push(t);
      });
      return { ...prev, tags: nextTags };
    });
    setNewPlanTagInput('');
  };

  const handleRemoveTagFromNewPlan = (tagIdx) => {
    setNewPlanForm(prev => ({
      ...prev,
      tags: (prev.tags || []).filter((_, idx) => idx !== tagIdx)
    }));
  };

  const handleSavePlanItem = async (planId, updatedFields = {}) => {
    const targetPlan = plans.find(p => p.id === planId);
    requestConfirm({
      title: `Permission Required: Save ${targetPlan?.name || 'Plan'}`,
      message: `Are you sure you want to save changes to "${targetPlan?.name || planId}" to MongoDB? This will update features and pricing immediately.`,
      confirmText: 'Yes, Save Plan',
      type: 'primary',
      onConfirm: async () => {
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
            setPlanSaveSuccess(`Plan "${targetPlan?.name || 'Selected'}" saved in MongoDB & updated on Landing Page!`);
            setTimeout(() => setPlanSaveSuccess(''), 4500);
          }
        } catch (e) {
          setPlanSaveSuccess('Plan saved locally & queued for MongoDB sync.');
          setTimeout(() => setPlanSaveSuccess(''), 4500);
        }
      }
    });
  };

  const handleSaveAllPlans = async () => {
    requestConfirm({
      title: 'Permission Required: Save All Plans to MongoDB',
      message: `Are you sure you want to save all ${plans.length} platform subscription plans to MongoDB? This will immediately sync public pricing to the live landing page.`,
      confirmText: 'Yes, Save to MongoDB',
      type: 'primary',
      onConfirm: async () => {
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
      }
    });
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
    const targetPlan = plans.find(p => p.id === planId);
    requestConfirm({
      title: 'Permission Required: Delete Subscription Plan',
      message: `Are you sure you want to permanently delete plan "${targetPlan?.name || planId}"? This will delete it from MongoDB and remove it from the public Landing Page pricing table.`,
      confirmText: 'Yes, Delete Plan',
      type: 'danger',
      onConfirm: async () => {
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
    });
  };

  // Handle Create Custom Plan
  const handleCreateCustomPlan = async (e) => {
    e.preventDefault();
    if (!newPlanForm.name || !newPlanForm.price) {
      alert('Please enter a Plan Name and Price');
      return;
    }

    requestConfirm({
      title: 'Permission Required: Publish New Plan',
      message: `Are you sure you want to create and publish plan "${newPlanForm.name}" at ₹${Number(newPlanForm.price).toLocaleString('en-IN')} ${newPlanForm.period}? This will save to MongoDB and log an entry into Plan History.`,
      confirmText: 'Yes, Publish Plan',
      type: 'primary',
      onConfirm: async () => {
        const planSlug = newPlanForm.id?.trim()
          ? newPlanForm.id.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_')
          : 'plan_' + Date.now();

        const createdPlan = {
          id: planSlug,
          name: newPlanForm.name.trim(),
          price: Number(newPlanForm.price),
          originalPrice: newPlanForm.originalPrice ? Number(newPlanForm.originalPrice) : 0,
          period: newPlanForm.period || '/ Year',
          subtext: newPlanForm.subtext || 'Retail subscription tier',
          tagText: newPlanForm.tagText || '',
          tags: (newPlanForm.tags && newPlanForm.tags.length > 0) ? newPlanForm.tags : [],
          highlightBadge: newPlanForm.highlightBadge || '',
          isPopular: Boolean(newPlanForm.isPopular),
          trialDays: Number(newPlanForm.trialDays) || 2,
          scansLimit: newPlanForm.scansLimit || 'Unlimited customer QR scans',
          ctaText: newPlanForm.ctaText || 'Start 2-Day Trial',
          showOnLandingPage: Boolean(newPlanForm.showOnLandingPage),
          isActive: true,
          displayOrder: plans.length + 1,
          features: (newPlanForm.features && newPlanForm.features.length > 0) ? newPlanForm.features : [
            'Customer retention system',
            'Free account setup & acrylic config',
            'Custom QR code standee generator',
            'Unlimited customer QR scans'
          ]
        };

        const updatedPlans = [...plans, createdPlan];
        setPlans(updatedPlans);

        const auditEntry = {
          id: 'ph_' + Date.now(),
          timestamp: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
          planName: createdPlan.name,
          action: 'Plan Created',
          details: `Created new plan "${createdPlan.name}" (${createdPlan.id}) at ₹${createdPlan.price.toLocaleString('en-IN')} ${createdPlan.period} with ${createdPlan.features.length} features.`,
          user: 'Super Admin (Owner)'
        };
        const updatedHistory = [auditEntry, ...planHistory];
        setPlanHistory(updatedHistory);

        try {
          localStorage.setItem('beaurex_platform_plans', JSON.stringify(updatedPlans));
          window.dispatchEvent(new CustomEvent('beaurex_plans_updated', { detail: updatedPlans }));
        } catch (err) {}

        fetch('/api/admin/plans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plans: updatedPlans })
        }).catch(() => {});

        fetch('/api/admin/plans/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(auditEntry)
        }).catch(() => {});

        setNewPlanForm({
          id: '',
          name: '',
          price: '',
          originalPrice: '',
          period: '/ Year',
          subtext: '',
          tagText: '',
          tags: ['Recommended', 'Instant Setup'],
          highlightBadge: '',
          isPopular: false,
          trialDays: 2,
          scansLimit: 'Unlimited customer QR scans',
          ctaText: 'Start 2-Day Trial',
          showOnLandingPage: true,
          features: [
            'Customer retention system',
            'Free account setup & acrylic config',
            'Custom QR code standee generator',
            'Unlimited customer QR scans'
          ]
        });
        setPlanSubTab('active');
        setPlanSaveSuccess(`Plan "${createdPlan.name}" created and added to Active Plans!`);
        setTimeout(() => setPlanSaveSuccess(''), 4500);
      }
    });
  };

  const handleAddFeatureToNewPlan = () => {
    if (!newPlanFeatureInput.trim()) return;
    setNewPlanForm(prev => ({
      ...prev,
      features: [...prev.features, newPlanFeatureInput.trim()]
    }));
    setNewPlanFeatureInput('');
  };

  const handleRemoveFeatureFromNewPlan = (idx) => {
    setNewPlanForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx)
    }));
  };

  // Feature Permissions Handlers
  const handleTogglePermission = (featureId) => {
    setPermissionsMatrix(prev => {
      const currentTier = prev[permissionPlan] || {};
      const updatedTier = {
        ...currentTier,
        [featureId]: !currentTier[featureId]
      };
      return {
        ...prev,
        [permissionPlan]: updatedTier
      };
    });
  };

  const handleSavePermissions = async () => {
    requestConfirm({
      title: 'Permission Required: Save Feature Permissions',
      message: 'Are you sure you want to save the entire permissions matrix to MongoDB? This will immediately apply feature access limits across all enrolled merchant accounts.',
      confirmText: 'Yes, Save to MongoDB',
      type: 'primary',
      onConfirm: async () => {
        setPermissionNotice('Saving permissions to MongoDB...');
        try {
          const res = await fetch('/api/admin/permissions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ permissions: permissionsMatrix })
          });
          const data = await res.json();
          if (data.success) {
            setPermissionNotice('Permissions saved to MongoDB & applied to merchant accounts!');
          } else {
            setPermissionNotice('Permissions updated locally.');
          }
        } catch (e) {
          setPermissionNotice('Permissions updated in state.');
        }
        setTimeout(() => setPermissionNotice(''), 4000);
      }
    });
  };

  const handleResetPermissionsTier = (tier) => {
    requestConfirm({
      title: `Permission Required: Reset ${tier} Permissions`,
      message: `Are you sure you want to reset all permissions for the ${tier} tier back to default platform settings? Any customizations made to this tier will be overwritten.`,
      confirmText: 'Yes, Reset Defaults',
      type: 'warning',
      onConfirm: () => {
        const defaults = {
          TRIAL: { liveScansFeed: true, mysteryScratch: true, stampCards: false, cashierPinAuth: true, acrylicStandeeDesigner: true, customerDatabaseExport: false, multiBranchOutlets: false, customBranding: false, smsWhatsappAlerts: false, advancedAnalytics: false, customVoucherCampaigns: false, speedPassFairPlay: true },
          STANDARD: { liveScansFeed: true, mysteryScratch: true, stampCards: true, cashierPinAuth: true, acrylicStandeeDesigner: true, customerDatabaseExport: true, multiBranchOutlets: false, customBranding: false, smsWhatsappAlerts: true, advancedAnalytics: true, customVoucherCampaigns: true, speedPassFairPlay: true },
          PROFESSIONAL: { liveScansFeed: true, mysteryScratch: true, stampCards: true, cashierPinAuth: true, acrylicStandeeDesigner: true, customerDatabaseExport: true, multiBranchOutlets: true, customBranding: true, smsWhatsappAlerts: true, advancedAnalytics: true, customVoucherCampaigns: true, speedPassFairPlay: true },
          LEGACY: { liveScansFeed: true, mysteryScratch: true, stampCards: true, cashierPinAuth: true, acrylicStandeeDesigner: true, customerDatabaseExport: true, multiBranchOutlets: true, customBranding: true, smsWhatsappAlerts: true, advancedAnalytics: true, customVoucherCampaigns: true, speedPassFairPlay: true }
        };
        if (defaults[tier]) {
          setPermissionsMatrix(prev => ({ ...prev, [tier]: defaults[tier] }));
          setPermissionNotice(`Reset ${tier} permissions to default platform matrix.`);
          setTimeout(() => setPermissionNotice(''), 3000);
        }
      }
    });
  };

  // Handle Create Coupon
  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCouponForm.code) return;

    requestConfirm({
      title: 'Permission Required: Create Coupon',
      message: `Are you sure you want to create promo coupon "${newCouponForm.code.toUpperCase()}" with ${newCouponForm.discountType === 'PERCENT' ? newCouponForm.discountValue + '%' : '₹' + newCouponForm.discountValue} discount?`,
      confirmText: 'Yes, Create Coupon',
      type: 'primary',
      onConfirm: () => {
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
      }
    });
  };

  // Handle Delete Coupon
  const handleDeleteCoupon = (id) => {
    const targetCoupon = coupons.find(c => c.id === id);
    requestConfirm({
      title: 'Permission Required: Delete Coupon',
      message: `Are you sure you want to delete promo coupon "${targetCoupon?.code || id}"? It will no longer be redeemable at checkout.`,
      confirmText: 'Yes, Delete Coupon',
      type: 'danger',
      onConfirm: () => {
        setCoupons(prev => prev.filter(c => c.id !== id));
        fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' }).catch(() => {});
      }
    });
  };

  // Handle Add Custom API Key
  const handleAddCustomKey = (e) => {
    e.preventDefault();
    if (!newCustomKey.name || !newCustomKey.keyName || !newCustomKey.keyValue) return;

    requestConfirm({
      title: 'Permission Required: Save Custom API Key',
      message: `Are you sure you want to save API key for "${newCustomKey.name}" (${newCustomKey.keyName})?`,
      confirmText: 'Yes, Save Key',
      type: 'primary',
      onConfirm: () => {
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
      }
    });
  };

  // Handle Delete Custom API Key
  const handleDeleteCustomKey = (id) => {
    const target = (config.customApiKeys || []).find(k => k.id === id);
    requestConfirm({
      title: 'Permission Required: Remove Custom API Key',
      message: `Are you sure you want to delete custom API key "${target?.name || id}"? Any services calling this endpoint will lose access.`,
      confirmText: 'Yes, Delete Key',
      type: 'danger',
      onConfirm: () => {
        const updated = (config.customApiKeys || []).filter(k => k.id !== id);
        setConfig({ ...config, customApiKeys: updated });
        fetch(`/api/admin/config/custom-key/${id}`, { method: 'DELETE' }).catch(() => {});
      }
    });
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
    if (e) e.preventDefault();
    requestConfirm({
      title: 'Permission Required: Save System Configuration',
      message: 'Are you sure you want to update payment gateway keys, SMTP credentials, and API environment settings on the server?',
      confirmText: 'Yes, Save Configuration',
      type: 'primary',
      onConfirm: () => {
        fetch('/api/admin/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config)
        }).catch(() => {});

        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    });
  };

  // Test SMS Dispatch State & Handler
  const [testSmsMobile, setTestSmsMobile] = useState('');
  const [testSmsLoading, setTestSmsLoading] = useState(false);
  const [testSmsResult, setTestSmsResult] = useState('');

  const handleTestSms = async (e) => {
    e.preventDefault();
    if (!testSmsMobile) return;
    setTestSmsLoading(true);
    setTestSmsResult('');
    try {
      const res = await fetch('/api/admin/config/test-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: testSmsMobile })
      });
      const data = await res.json();
      if (data && data.success) {
        setTestSmsResult(`✅ Delivered: Test OTP ${data.testOtp || ''} sent successfully via ${data.provider}!`);
      } else {
        setTestSmsResult(`❌ Failed: ${data?.message || 'Gateway rejected dispatch'}`);
      }
    } catch (err) {
      setTestSmsResult('❌ Connection error: ' + err.message);
    } finally {
      setTestSmsLoading(false);
    }
  };

  // Test Email Dispatch State & Handler
  const [testEmailAddr, setTestEmailAddr] = useState('');
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState('');

  const handleTestEmail = async (e) => {
    e.preventDefault();
    if (!testEmailAddr) return;
    setTestEmailLoading(true);
    setTestEmailResult('');
    try {
      const res = await fetch('/api/admin/config/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmailAddr })
      });
      const data = await res.json();
      if (data && data.success) {
        setTestEmailResult(`✅ Success: ${data.message}`);
      } else {
        setTestEmailResult(`❌ Failed: ${data?.message || 'SMTP connection failed'}`);
      }
    } catch (err) {
      setTestEmailResult('❌ Connection error: ' + err.message);
    } finally {
      setTestEmailLoading(false);
    }
  };

  const formatPlanDisplayName = (plan, tier, amount, status) => {
    const p = String(plan || tier || '').toUpperCase();
    const hasMoney = Boolean(amount && amount !== '-' && amount !== '0' && amount !== '₹0' && amount !== 'Unpaid');
    if (p.includes('PROFESSIONAL') || p.includes('PRO') || (hasMoney && !p.includes('STANDARD') && !p.includes('LEGACY') && !p.includes('BASIC'))) {
      return 'Professional Plan';
    }
    if (p.includes('STANDARD')) return 'Standard Plan';
    if (p.includes('LEGACY') || p.includes('LIFETIME') || p.includes('ENTERPRISE')) return 'Enterprise Pro';
    if (p.includes('BASIC')) return 'Basic Plan';
    if (status === 'Paid') return 'Professional Plan';
    return 'Trial Plan';
  };

  const formatStatusDisplayName = (status, amount, isActive) => {
    if (status === 'Suspended' || isActive === false) return 'Suspended';
    const hasMoney = Boolean(amount && amount !== '-' && amount !== '0' && amount !== '₹0' && amount !== 'Unpaid');
    if (status === 'Paid' || hasMoney) return 'Paid';
    if (status === 'Expired') return 'Expired';
    return 'Trial';
  };

  const filteredMerchants = merchants.map(m => {
    const resolvedPlan = formatPlanDisplayName(m.plan, m.subscriptionTier, m.paymentAmount, m.status);
    const resolvedStatus = formatStatusDisplayName(m.status, m.paymentAmount, m.isActive);
    return {
      ...m,
      plan: resolvedPlan,
      status: resolvedStatus
    };
  }).filter(m => {
    const term = searchMerchant.toLowerCase();
    const matchTerm = (
      m.businessName?.toLowerCase().includes(term) ||
      m.email?.toLowerCase().includes(term) ||
      m.city?.toLowerCase().includes(term) ||
      m.mobile?.includes(term) ||
      m.plan?.toLowerCase().includes(term) ||
      m.status?.toLowerCase().includes(term)
    );
    const matchFilter = merchantFilter === 'ALL' || m.status === merchantFilter || (merchantFilter === 'COMPLIMENTARY' && m.isComplimentary);
    return matchTerm && matchFilter;
  });


  const paymentsList = (paymentsData?.payments && paymentsData.payments.length > 0)
    ? paymentsData.payments.map(p => {
        const resolvedPlan = formatPlanDisplayName(p.plan, p.subscriptionTier, p.paymentAmount, p.status);
        const hasMoney = Boolean(p.paymentAmount && p.paymentAmount !== '-' && p.paymentAmount !== '0' && p.paymentAmount !== '₹0' && p.paymentAmount !== 'Unpaid');
        const resolvedPaymentStatus = (hasMoney || p.paymentStatus === 'PAID') ? 'PAID' : (p.paymentStatus || 'TRIAL');
        return {
          ...p,
          plan: resolvedPlan,
          paymentStatus: resolvedPaymentStatus,
          status: p.status === 'Suspended' ? 'Suspended' : (resolvedPaymentStatus === 'PAID' ? 'Paid' : 'Trial')
        };
      })
    : merchants.map(m => {
        const resolvedPlan = formatPlanDisplayName(m.plan, m.subscriptionTier, m.paymentAmount, m.status);
        const resolvedStatus = formatStatusDisplayName(m.status, m.paymentAmount, m.isActive);
        const hasMoney = Boolean(m.paymentAmount && m.paymentAmount !== '-' && m.paymentAmount !== '0' && m.paymentAmount !== '₹0' && m.paymentAmount !== 'Unpaid');
        return {
          id: m.id || m._id,
          businessName: m.businessName,
          category: m.category,
          mobile: m.mobile,
          email: m.email,
          city: m.city,
          subscriptionTier: m.subscriptionTier || 'Trial Plan',
          plan: resolvedPlan,
          paymentAmount: m.paymentAmount || '-',
          paymentDate: m.paymentDate || '-',
          planValidTill: m.planValidTill || (hasMoney ? '04 Oct 2029' : '14 Oct 2026'),
          status: resolvedStatus,
          isActive: resolvedStatus !== 'Suspended',
          paymentStatus: hasMoney ? 'PAID' : (resolvedStatus === 'Trial' ? 'TRIAL' : (resolvedStatus === 'Suspended' ? 'SUSPENDED' : 'UNPAID'))
        };
      });

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
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, badge: 'Live' },
    { id: 'merchants', label: 'Merchants', icon: Store, count: merchants.length },
    { id: 'claim_logs', label: 'Claim Logs', icon: Award, count: 245, badge: 'Logs' },
    { id: 'referrals', label: 'Manage Referrals', icon: Share2, count: referralsList.length, badge: 'Payouts' },
    { id: 'deals_coupons', label: 'Deal & Coupons', icon: Tag, count: platformDeals.length, badge: 'Deals' },
    { id: 'contacts', label: 'Contact Inquiries', icon: Mail, count: contactsList.filter(c => c.status === 'NEW').length, badge: contactsList.filter(c => c.status === 'NEW').length > 0 ? `${contactsList.filter(c => c.status === 'NEW').length} New` : 'Inbox' },
    { id: 'permissions', label: 'Manage', icon: Sliders, badge: 'Control' },
    { id: 'plans', label: 'Plans', icon: Layers, count: plans.length, badge: 'Landing' },
    { id: 'team', label: 'Teams Management', icon: UserCheck, count: teamMembers.length, badge: 'New' },
    { id: 'customers', label: 'Customer', icon: Users, count: customers.length },
    { id: 'settings', label: 'Settings', icon: Settings, badge: '6' },
    { id: 'config', label: 'Gateway Keys', icon: Key, badge: 'Config' },
    { id: 'audit', label: 'Security Logs', icon: Activity, badge: 'Secured' },
  ];

  return (
    <AdminAuthGate>
      <div className="h-screen w-full bg-slate-50 text-slate-900 font-sans antialiased flex flex-col md:flex-row overflow-hidden selection:bg-red-500 selection:text-white">
        
        {/* ========================================================= */}
        {/* MOBILE TOPBAR WITH HAMBURGER (Visible only on < md screens) */}
        {/* ========================================================= */}
        <header className="md:hidden sticky top-0 z-40 bg-[#8B0000] text-white px-4 py-3 flex items-center justify-between shadow-md">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center p-1 shadow-xs">
              <QrCode className="w-5 h-5 text-[#8B0000]" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight leading-none text-white">
                BeAurex
              </span>
              <span className="text-[9px] font-bold text-red-200 uppercase tracking-widest mt-0.5">
                Admin Panel
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-2">
            <div className="relative p-1">
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white rounded-full text-[9px] font-black flex items-center justify-center">5</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-xl text-white hover:bg-black/20 transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
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
            <div className="relative w-4/5 max-w-xs bg-[#8B0000] text-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200 overflow-y-auto">
              <div>
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center p-1">
                      <QrCode className="w-5 h-5 text-[#8B0000]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-white text-sm">BeAurex</span>
                      <span className="text-[9px] font-bold text-red-200 uppercase">Admin Panel</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-white hover:bg-black/20 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="px-4 py-2.5 bg-black/20 border-b border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="font-bold text-white text-[11px]">Production Cluster</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 font-bold px-1.5 py-0.5 rounded">Live</span>
                </div>

                <div className="p-3 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id || (item.id === 'settings' && (activeTab === 'policy_editor' || activeTab === 'faq_editor'));
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          isActive
                            ? 'bg-black/30 text-white shadow-inner font-black'
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-red-200'}`} />
                          <span className="whitespace-nowrap truncate">{item.label}</span>
                        </div>
                        {item.count !== undefined && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                            isActive ? 'bg-white/20 text-white' : 'bg-black/20 text-red-100'
                          }`}>
                            {item.count}
                          </span>
                        )}
                        {item.badge && !item.count && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                            isActive ? 'bg-white/20 text-white' : 'bg-white/15 text-white'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 border-t border-white/10 bg-black/20 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-white text-[#8B0000] font-bold text-xs flex items-center justify-center">
                      SA
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">Super Admin</span>
                      <span className="text-[10px] text-red-200 truncate max-w-[120px]">admin@beaurex.com</span>
                    </div>
                  </div>
                  <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Owner
                  </span>
                </div>

                <button
                  onClick={() => { setAdminProfileModalOpen(true); setMobileMenuOpen(false); }}
                  className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 rounded-xl transition flex items-center justify-center space-x-1.5 border border-white/10 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Admin Profile</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full bg-black/30 hover:bg-black/40 text-red-100 text-xs font-bold py-2 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>

                <div className="pt-2 text-[10px] text-red-200/70 text-center">
                  © 2026 BeAurex. All rights reserved.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* LEFT SIDEBAR NAVIGATION (Desktop: Exact Match to Image 2)  */}
        {/* ========================================================= */}
        <aside className="hidden md:flex md:w-64 bg-[#8B0000] text-white flex-col justify-between shrink-0 shadow-lg z-30 fixed inset-y-0 left-0 h-screen">
          <div className="flex-1 overflow-y-auto">
            {/* Brand Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md p-1.5 shrink-0 group-hover:scale-105 transition transform">
                  <QrCode className="w-6 h-6 text-[#8B0000]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tight leading-none text-white">
                    BeAurex
                  </span>
                  <span className="text-[10px] font-bold text-red-200 uppercase tracking-widest mt-1">
                    Admin Panel
                  </span>
                </div>
              </Link>
            </div>

            {/* Navigation Menu */}
            <div className="p-3.5 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id || (item.id === 'settings' && (activeTab === 'policy_editor' || activeTab === 'faq_editor'));
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isActive
                        ? 'bg-black/30 text-white shadow-inner font-black'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-red-200'}`} />
                      <span className="whitespace-nowrap truncate">{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                        isActive ? 'bg-white/20 text-white' : 'bg-black/20 text-red-100'
                      }`}>
                        {item.count}
                      </span>
                    )}
                    {item.badge && !item.count && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                        isActive ? 'bg-white/20 text-white' : 'bg-white/15 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar Footer: Match Image 2 Footer */}
          <div className="p-4 border-t border-white/10 bg-black/20 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-white text-[#8B0000] font-black text-xs flex items-center justify-center shadow-xs">
                  SA
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Super Admin</span>
                  <span className="text-[10px] text-red-200 truncate max-w-[110px]">Owner</span>
                </div>
              </div>
              <button
                onClick={() => setAdminProfileModalOpen(true)}
                className="text-red-200 hover:text-white p-1 transition cursor-pointer"
                title="Super Admin Profile"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-2 border-t border-white/10 text-[11px] text-red-200/80 leading-relaxed">
              <p className="font-semibold text-white/90">© 2026 BeAurex.</p>
              <p>All rights reserved.</p>
            </div>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* MAIN DASHBOARD CONTENT AREA (Only right side scrolls) */}
        {/* ========================================================= */}
        <div className="flex-1 md:ml-64 flex flex-col min-w-0 min-h-0 h-full md:h-screen overflow-y-auto">
          
          {/* ========================================================= */}
          {/* TOP WHITE HEADER (Exact Match to Reference Image 2)       */}
          {/* ========================================================= */}
          <header className="bg-white border-b border-slate-200/90 px-6 sm:px-8 py-4 sticky top-0 z-20 flex items-center justify-between shadow-xs">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {activeTab === 'policy_editor' ? 'Policy Editor' : 
                 activeTab === 'faq_editor' ? 'FAQ Editor' : 
                 activeTab === 'claim_logs' ? 'Claim Logs' : 
                 activeTab === 'referrals' ? 'Manage Referrals' : 
                 activeTab === 'deals_coupons' ? 'Deal & Coupons' : 
                 activeTab === 'contacts' ? 'Contact Inquiries' : 
                 activeTab === 'permissions' ? 'Manage' : 
                 activeTab === 'settings' ? 'Settings' : 
                 navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium mt-0.5">
                <Link to="/" className="hover:text-red-700 transition">Home</Link>
                <span>&gt;</span>
                {(activeTab === 'policy_editor' || activeTab === 'faq_editor') && (
                  <>
                    <button onClick={() => setActiveTab('settings')} className="hover:text-red-700 transition cursor-pointer">Settings</button>
                    <span>&gt;</span>
                  </>
                )}
                <span className="text-slate-800 font-bold">
                  {activeTab === 'policy_editor' ? 'Policy Editor' : 
                   activeTab === 'faq_editor' ? 'FAQ Editor' : 
                   activeTab === 'claim_logs' ? 'Claim Logs' : 
                   activeTab === 'referrals' ? 'Manage Referrals' : 
                   activeTab === 'deals_coupons' ? 'Deal & Coupons' : 
                   activeTab === 'contacts' ? 'Contact Inquiries' : 
                   activeTab === 'permissions' ? 'Manage' : 
                   activeTab === 'settings' ? 'Settings' : 
                   navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notification Bell with Badge 5 */}
              <div className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition" title="5 Notifications">
                <Bell className="w-5 h-5 text-slate-700" />
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                  5
                </span>
              </div>

              {/* Super Admin User Profile Dropdown */}
              <div 
                onClick={() => setAdminProfileModalOpen(true)}
                className="flex items-center space-x-2.5 pl-3 border-l border-slate-200 cursor-pointer group hover:opacity-90"
              >
                <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-black text-slate-900 group-hover:text-red-700 transition leading-tight">Super Admin</span>
                  <span className="text-[10px] text-slate-500 font-bold leading-tight">Owner</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition hidden sm:block" />
              </div>
            </div>
          </header>

          {/* Main Container (Full width for seamless right side alignment) */}
          <main className="p-4 sm:p-6 lg:p-8 space-y-6 w-full">
            
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

            {/* ========================================================= */}
            {/* TAB: DASHBOARD OVERVIEW & ANALYTICS (Image 1 + Graphs)     */}
            {/* ========================================================= */}
            {activeTab === 'overview' && (() => {
              return (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Top Header matching Image 1 */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Dashboard
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                        Welcome back! Here's what's happening with your platform today.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <select
                          value={overviewDate}
                          onChange={(e) => setOverviewDate(e.target.value)}
                          className="appearance-none bg-white border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs font-bold text-slate-800 shadow-2xs hover:border-slate-300 focus:outline-none focus:border-red-600 cursor-pointer"
                        >
                          <option value="May 24, 2025">May 24, 2025</option>
                          <option value="May 23, 2025">May 23, 2025</option>
                          <option value="Today">Today (Realtime)</option>
                          <option value="Last 7 Days">Last 7 Days</option>
                          <option value="This Month">This Month (May 2025)</option>
                        </select>
                        <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* 4 Stat Cards in 1 Row (Exact Match to Image 1) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {/* Card 1: Active Merchants */}
                    <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs text-center flex flex-col items-center justify-between hover:shadow-md transition group">
                      <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mb-4 shadow-xs">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center shadow-md shadow-red-500/30 group-hover:scale-105 transition-transform">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <h3 className="text-sm font-bold text-slate-800">Active Merchants</h3>
                      <div className="text-3xl font-black text-slate-900 mt-2">1,248</div>
                      <div className="text-xs font-bold text-emerald-500 mt-2 flex items-center justify-center space-x-1">
                        <span>↑</span>
                        <span>12.5% vs yesterday</span>
                      </div>
                    </div>

                    {/* Card 2: Today's Merchant Onboarding */}
                    <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs text-center flex flex-col items-center justify-between hover:shadow-md transition group">
                      <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4 shadow-xs">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30 group-hover:scale-105 transition-transform">
                          <UserPlus className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <h3 className="text-sm font-bold text-slate-800">Today's Merchant Onboarding</h3>
                      <div className="text-3xl font-black text-slate-900 mt-2">36</div>
                      <div className="text-xs font-bold text-emerald-500 mt-2 flex items-center justify-center space-x-1">
                        <span>↑</span>
                        <span>16.7% vs yesterday</span>
                      </div>
                    </div>

                    {/* Card 3: Today's Revenue */}
                    <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs text-center flex flex-col items-center justify-between hover:shadow-md transition group">
                      <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4 shadow-xs">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform">
                          <CreditCard className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <h3 className="text-sm font-bold text-slate-800">Today's Revenue</h3>
                      <div className="text-3xl font-black text-slate-900 mt-2">₹ 86,540</div>
                      <div className="text-xs font-bold text-emerald-500 mt-2 flex items-center justify-center space-x-1">
                        <span>↑</span>
                        <span>16.3% vs yesterday</span>
                      </div>
                    </div>

                    {/* Card 4: Total Revenue */}
                    <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs text-center flex flex-col items-center justify-between hover:shadow-md transition group">
                      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 shadow-xs">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform">
                          <DollarSign className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <h3 className="text-sm font-bold text-slate-800">Total Revenue</h3>
                      <div className="text-3xl font-black text-slate-900 mt-2">₹ 24,85,430</div>
                      <div className="text-xs font-bold text-emerald-500 mt-2 flex items-center justify-center space-x-1">
                        <span>↑</span>
                        <span>14.8% vs last month</span>
                      </div>
                    </div>
                  </div>

                  {/* Visual Analytics Graphs Section ("and add some graph") */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Graph 1: Platform Revenue & GMV Trajectory */}
                    <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                        <div>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-red-600" />
                            <h3 className="text-base font-black text-slate-900">Revenue & Billing Performance</h3>
                          </div>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Subscription collections, plan upgrades, and daily counter transactions
                          </p>
                        </div>

                        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                          {['7days', '30days', '90days'].map((tf) => (
                            <button
                              key={tf}
                              onClick={() => setOverviewChartTimeframe(tf)}
                              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                                overviewChartTimeframe === tf
                                  ? 'bg-white text-slate-900 shadow-2xs font-black'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              {tf === '7days' ? '7D' : tf === '30days' ? '30D' : '90D'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* SVG Visual Revenue Curve Chart */}
                      <div className="py-6">
                        <div className="h-56 w-full relative">
                          <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
                            <defs>
                              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8B0000" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#8B0000" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                            {/* Grid horizontal guidelines */}
                            <line x1="0" y1="40" x2="600" y2="40" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                            <line x1="0" y1="90" x2="600" y2="90" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                            <line x1="0" y1="140" x2="600" y2="140" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                            <line x1="0" y1="190" x2="600" y2="190" stroke="#f1f5f9" strokeWidth="1" />

                            {/* Area fill */}
                            <path
                              d="M 0 160 Q 75 140, 150 110 T 300 95 T 450 60 T 600 45 L 600 190 L 0 190 Z"
                              fill="url(#revenueGrad)"
                            />

                            {/* Main Stroke line */}
                            <path
                              d="M 0 160 Q 75 140, 150 110 T 300 95 T 450 60 T 600 45"
                              fill="none"
                              stroke="#8B0000"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                            />

                            {/* Data points */}
                            <circle cx="0" cy="160" r="4" fill="#8B0000" className="animate-pulse" />
                            <circle cx="150" cy="110" r="4.5" fill="#8B0000" />
                            <circle cx="300" cy="95" r="4.5" fill="#8B0000" />
                            <circle cx="450" cy="60" r="5" fill="#8B0000" />
                            <circle cx="600" cy="45" r="5.5" fill="#8B0000" className="animate-ping" />
                            <circle cx="600" cy="45" r="4" fill="#ffffff" stroke="#8B0000" strokeWidth="2.5" />
                          </svg>
                        </div>

                        {/* Chart X-axis Labels */}
                        <div className="flex justify-between text-[11px] font-bold text-slate-400 pt-2 px-1 border-t border-slate-100">
                          <span>01 May</span>
                          <span>07 May</span>
                          <span>14 May</span>
                          <span>21 May</span>
                          <span className="text-red-700 font-extrabold">24 May (Today: ₹86,540)</span>
                        </div>
                      </div>

                      {/* Revenue KPI summary cards */}
                      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                        <div className="bg-slate-50 p-3 rounded-xl">
                          <span className="text-[10px] font-bold uppercase text-slate-400">Peak Single Day</span>
                          <div className="text-sm font-black text-slate-900 mt-0.5">₹ 98,420</div>
                          <span className="text-[10px] text-emerald-600 font-semibold">22 May 2025</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl">
                          <span className="text-[10px] font-bold uppercase text-slate-400">Average Daily</span>
                          <div className="text-sm font-black text-slate-900 mt-0.5">₹ 76,850</div>
                          <span className="text-[10px] text-slate-500 font-medium">30-day baseline</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl">
                          <span className="text-[10px] font-bold uppercase text-slate-400">Month Forecast</span>
                          <div className="text-sm font-black text-red-700 mt-0.5">₹ 26.5 Lakh</div>
                          <span className="text-[10px] text-emerald-600 font-semibold">↑ On track</span>
                        </div>
                      </div>
                    </div>

                    {/* Graph 2: Merchant Signups & Category Distribution */}
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                          <div>
                            <h3 className="text-base font-black text-slate-900">Merchant Growth & Mix</h3>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">Category breakdown & conversions</p>
                          </div>
                          <span className="bg-rose-50 text-red-700 font-bold text-xs px-2.5 py-1 rounded-xl border border-red-100">
                            +36 Today
                          </span>
                        </div>

                        {/* Category Progress Bars */}
                        <div className="space-y-4 my-6">
                          <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                              <span className="text-slate-700">Cafe & Restaurants</span>
                              <span className="text-slate-900 font-extrabold">42% (524 stores)</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#8B0000] rounded-full" style={{ width: '42%' }}></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                              <span className="text-slate-700">Retail & Fashion</span>
                              <span className="text-slate-900 font-extrabold">26% (324 stores)</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-rose-500 rounded-full" style={{ width: '26%' }}></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                              <span className="text-slate-700">Grocery & Supermarkets</span>
                              <span className="text-slate-900 font-extrabold">18% (225 stores)</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-500 rounded-full" style={{ width: '18%' }}></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                              <span className="text-slate-700">Salon & Wellness</span>
                              <span className="text-slate-900 font-extrabold">14% (175 stores)</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '14%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Conversion Highlights */}
                      <div className="p-4 bg-rose-50/60 rounded-xl border border-red-100 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700">Trial to Paid Conversion</span>
                          <span className="font-black text-red-700">68.4%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700">Average Store Redemptions</span>
                          <span className="font-black text-slate-900">42 / day</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700">Total Customer Repeat Rate</span>
                          <span className="font-black text-emerald-600">48.6%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

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
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-black shadow-md shadow-amber-500/25">
                      <Clock className="w-6 h-6 text-white" />
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
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center font-black shadow-md shadow-red-500/25">
                      <AlertTriangle className="w-6 h-6 text-white" />
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
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black shadow-md shadow-emerald-500/25">
                      <Sparkles className="w-6 h-6 text-white" />
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

                  {/* Table with Image 1 exact columns & horizontal scrollbar */}
                  <div className="overflow-x-auto custom-scrollbar pb-3">
                    <table className="w-full min-w-[1550px] text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-black tracking-wider whitespace-nowrap select-none">
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[220px]">Merchant / Business</th>
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[130px]">Total Payment</th>
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[170px]">Date with Time</th>
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[140px]">Plan</th>
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[130px]">Plan Valid Till</th>
                          <th className="py-3.5 px-4 whitespace-nowrap text-center min-w-[270px]">Deal / Offer Type</th>
                          <th className="py-3.5 px-4 whitespace-nowrap text-center min-w-[110px]">Status</th>
                          <th className="py-3.5 px-4 whitespace-nowrap text-center min-w-[130px]">Account Access</th>
                          <th className="py-3.5 px-4 whitespace-nowrap text-center min-w-[70px]">View</th>
                          <th className="py-3.5 px-4 whitespace-nowrap text-center min-w-[120px]">Complimentary</th>
                          <th className="py-3.5 px-4 whitespace-nowrap text-center min-w-[70px]">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredMerchants.length === 0 ? (
                          <tr>
                            <td colSpan={11} className="py-8 text-center text-xs text-slate-400 font-black">
                              No merchants match the selected filters.
                            </td>
                          </tr>
                        ) : (
                          filteredMerchants.map((m) => (
                            <tr key={m.id || m._id} className="hover:bg-slate-50/80 transition">
                              {/* Merchant / Business info */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <div className="font-extrabold text-slate-900 flex items-center space-x-1.5 whitespace-nowrap">
                                  <span className="font-black text-sm">{m.businessName}</span>
                                </div>
                                {m.email && (
                                  <div className="text-[11px] text-slate-600 font-bold truncate flex items-center space-x-1 mt-0.5 whitespace-nowrap" title={m.email}>
                                    <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                    <span>{m.email}</span>
                                  </div>
                                )}
                                <div className="text-[11px] text-slate-400 font-mono font-bold mt-0.5 whitespace-nowrap">
                                  {m.mobile ? `${m.mobile} • ` : ''}{m.city || 'Delhi NCR'}
                                </div>
                              </td>

                              {/* TOTAL PAYMENT */}
                              <td className="py-3.5 px-4 font-black text-slate-900 whitespace-nowrap text-sm">
                                {m.totalPayment || m.paymentAmount || '₹ 24,000'}
                              </td>

                              {/* DATE WITH TIME */}
                              <td className="py-3.5 px-4 font-mono font-bold text-slate-700 text-xs whitespace-nowrap">
                                {m.dateTime || (m.paymentDate && m.paymentDate !== '-' ? `${m.paymentDate} 11:20 AM` : 'May 24, 2025 11:20 AM')}
                              </td>

                              {/* PLAN (editable dropdown) */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <select
                                  value={m.plan || m.subscriptionTier || 'Trial Plan'}
                                  onChange={(e) => handleChangePlan(m.id || m._id, e.target.value)}
                                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-black text-slate-800 focus:outline-none focus:border-red-600 cursor-pointer shadow-2xs whitespace-nowrap min-w-[130px]"
                                >
                                  <option value="Trial Plan">Trial Plan</option>
                                  <option value="Basic Plan">Basic Plan</option>
                                  <option value="Standard Plan">Standard Plan</option>
                                  <option value="Professional Plan">Professional Plan</option>
                                  <option value="Enterprise Pro">Enterprise Pro</option>
                                </select>
                              </td>

                              {/* PLAN VALID TILL */}
                              <td className="py-3.5 px-4 font-mono font-black text-slate-900 text-xs whitespace-nowrap">
                                {m.planValidTill || '12 Oct 2026'}
                              </td>

                              {/* SET A DEAL / ACTIVE DEAL TYPE CELL */}
                              <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                {Boolean(m.dealDetails?.dealTitle || (m.dealDetails?.dealType && m.dealDetails?.dealType !== 'NONE')) ? (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenDeal(m)}
                                    className="inline-flex items-center space-x-1.5 bg-red-50/70 hover:bg-red-100 text-[#8B0000] hover:text-[#700000] border border-red-200 hover:border-red-300 rounded-xl px-3.5 py-1.5 transition shadow-2xs hover:shadow-xs cursor-pointer whitespace-nowrap font-extrabold text-xs"
                                    title="Click to view deal details"
                                  >
                                    <Tag className="w-3.5 h-3.5 text-[#8B0000] shrink-0" />
                                    <span className="whitespace-nowrap">
                                      {m.dealDetails.dealTitle || 'Active Deal'}
                                    </span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenDeal(m)}
                                    className="bg-white hover:bg-slate-50 text-slate-800 hover:text-red-700 border border-slate-200 hover:border-red-300 text-[11px] font-black uppercase px-3.5 py-1.5 rounded-xl transition shadow-2xs cursor-pointer inline-flex items-center space-x-1.5 whitespace-nowrap"
                                    title="Configure deal for merchant"
                                  >
                                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Set a Deal</span>
                                  </button>
                                )}
                              </td>

                              {/* STATUS (Image 1 dropdown) */}
                              <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                <select
                                  value={m.status || 'Trial'}
                                  onChange={(e) => handleChangeStatus(m.id || m._id, e.target.value)}
                                  className={`rounded-xl px-3 py-1.5 text-xs font-black cursor-pointer border shadow-2xs whitespace-nowrap min-w-[100px] ${
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
                              <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                {(m.status === 'Suspended' || m.isActive === false) ? (
                                  <button
                                    onClick={() => handleToggleMerchantSuspend(m.id || m._id, true)}
                                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-black uppercase px-3 py-1.5 rounded-xl transition cursor-pointer inline-flex items-center space-x-1.5 shadow-2xs whitespace-nowrap min-w-[110px] justify-center"
                                    title="Account suspended (login locked). Click to reactivate access."
                                  >
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Reactivate</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleToggleMerchantSuspend(m.id || m._id, false)}
                                    className="bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-[11px] font-black uppercase px-3 py-1.5 rounded-xl transition cursor-pointer inline-flex items-center space-x-1.5 shadow-2xs whitespace-nowrap min-w-[110px] justify-center"
                                    title="Click to suspend merchant account (locks login until paid)"
                                  >
                                    <Ban className="w-3.5 h-3.5 text-rose-600" />
                                    <span>Suspend</span>
                                  </button>
                                )}
                              </td>

                              {/* VIEW (Eye Icon) */}
                              <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                <button
                                  onClick={() => setViewMerchantModal(m)}
                                  className="text-slate-500 hover:text-slate-900 p-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-100 transition cursor-pointer inline-flex items-center justify-center shadow-2xs"
                                  title="View Merchant Profile"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </td>

                              {/* COMPLIMENTARY (Interactive Trigger) */}
                              <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => handleOpenComplimentaryModal(m)}
                                  className={`rounded-xl px-3 py-1.5 text-xs font-black cursor-pointer border transition flex items-center justify-center space-x-1.5 mx-auto whitespace-nowrap min-w-[90px] ${
                                    m.isComplimentary
                                      ? 'bg-rose-50 text-[#74111d] border-rose-300 hover:bg-rose-100 shadow-xs'
                                      : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100 hover:border-slate-400 shadow-2xs'
                                  }`}
                                  title={m.isComplimentary ? `Complimentary Active (${m.complimentaryDays === 'Lifetime' || Number(m.complimentaryDays) >= 36500 ? 'Lifetime Access' : (m.complimentaryDays || 10) + ' Days'}) • Reason: ${m.complimentaryReason || 'Special Access'}` : 'Click to configure Complimentary access'}
                                >
                                  <span>{m.isComplimentary ? `Yes (${m.complimentaryDays === 'Lifetime' || Number(m.complimentaryDays) >= 36500 ? 'Lifetime' : m.complimentaryDays ? m.complimentaryDays + 'd' : 'Active'})` : 'No'}</span>
                                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                                </button>
                              </td>

                              {/* ACTION: DELETE */}
                              <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                <button
                                  onClick={() => handleDeleteMerchant(m.id || m._id, m.businessName)}
                                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl transition cursor-pointer inline-flex items-center justify-center shadow-2xs"
                                  title="Delete Merchant Record"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
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
            {/* TAB: CONTACT INQUIRIES (Saved in MongoDB via Landing Page) */}
            {/* ========================================================= */}
            {activeTab === 'contacts' && (() => {
              const filteredContacts = contactsList.filter((c) => {
                if (contactFilter !== 'ALL' && c.status !== contactFilter) return false;
                if (searchContact.trim()) {
                  const q = searchContact.toLowerCase();
                  const name = (c.name || '').toLowerCase();
                  const phone = (c.phone || '').toLowerCase();
                  const email = (c.email || '').toLowerCase();
                  const msg = (c.message || '').toLowerCase();
                  return name.includes(q) || phone.includes(q) || email.includes(q) || msg.includes(q);
                }
                return true;
              });

              return (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* 3 Top Stat Cards (Matching Merchants Tab Layout & Font) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Inquiries</p>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">
                          {contactsList.length}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Landing page contact submissions</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/25">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">New / Unread Leads</p>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">
                          {contactsList.filter(c => c.status === 'NEW').length}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Awaiting activation officer follow-up</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center font-black shadow-md shadow-red-500/25">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contacted / Resolved</p>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">
                          {contactsList.filter(c => c.status === 'CONTACTED' || c.status === 'RESOLVED').length}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Processed store inquiries</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black shadow-md shadow-emerald-500/25">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Main Table Card */}
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                    {/* Toolbar & Filters (Exact Merchants Tab Topbar Alignment) */}
                    <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-slate-50/50">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 mr-1">
                          <Filter className="w-3.5 h-3.5 text-slate-400" />
                          <span>Filter:</span>
                        </div>
                        
                        <select
                          value={contactFilter}
                          onChange={(e) => setContactFilter(e.target.value)}
                          className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-red-600 cursor-pointer shadow-2xs"
                        >
                          <option value="ALL">All Status ({contactsList.length})</option>
                          <option value="NEW">New Leads Only ({contactsList.filter(c => c.status === 'NEW').length})</option>
                          <option value="CONTACTED">Contacted ({contactsList.filter(c => c.status === 'CONTACTED').length})</option>
                          <option value="RESOLVED">Resolved ({contactsList.filter(c => c.status === 'RESOLVED').length})</option>
                        </select>

                        <button
                          onClick={() => { setContactFilter('ALL'); setSearchContact(''); }}
                          className="bg-white hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-600 flex items-center space-x-1 transition cursor-pointer shadow-2xs"
                          title="Reset all filters"
                        >
                          <RotateCcw className="w-3 h-3 text-slate-400" />
                          <span>Reset</span>
                        </button>

                        <button
                          onClick={fetchContacts}
                          disabled={contactsLoading}
                          className="bg-white hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-600 flex items-center space-x-1.5 transition cursor-pointer shadow-2xs disabled:opacity-50"
                          title="Refresh contact inquiries from MongoDB"
                        >
                          <RefreshCw className={`w-3 h-3 text-slate-400 ${contactsLoading ? 'animate-spin' : ''}`} />
                          <span>{contactsLoading ? 'Refreshing...' : 'Refresh'}</span>
                        </button>
                      </div>

                      <div className="relative w-full lg:w-80">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search inquirer, phone, email, query..."
                          value={searchContact}
                          onChange={(e) => setSearchContact(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 shadow-2xs font-bold"
                        />
                      </div>
                    </div>

                    {/* Table with Horizontal Scrollbar & Bold Fonts (Exact SuperAdmin Merchants System) */}
                    <div className="overflow-x-auto custom-scrollbar pb-3">
                      <table className="w-full min-w-[1350px] text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-black tracking-wider whitespace-nowrap select-none">
                            <th className="py-3.5 px-4 whitespace-nowrap min-w-[220px]">Inquirer / Lead Name</th>
                            <th className="py-3.5 px-4 whitespace-nowrap min-w-[160px]">Phone Number</th>
                            <th className="py-3.5 px-4 whitespace-nowrap min-w-[220px]">Email Address</th>
                            <th className="py-3.5 px-4 whitespace-nowrap min-w-[170px]">Date with Time</th>
                            <th className="py-3.5 px-4 whitespace-nowrap min-w-[340px]">Store Inquiry / Message</th>
                            <th className="py-3.5 px-4 whitespace-nowrap text-center min-w-[150px]">Status</th>
                            <th className="py-3.5 px-4 whitespace-nowrap text-center min-w-[90px]">View</th>
                            <th className="py-3.5 px-4 whitespace-nowrap text-center min-w-[80px]">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredContacts.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="py-12 text-center text-xs text-slate-400 font-black">
                                {contactsLoading ? 'Loading inquiries from MongoDB...' : 'No contact form submissions found matching your filter.'}
                              </td>
                            </tr>
                          ) : (
                            filteredContacts.map((c) => {
                              const cid = c.id || c._id;
                              const dt = c.createdAt ? new Date(c.createdAt) : null;
                              const formattedDate = dt && !isNaN(dt.getTime())
                                ? `${dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} ${dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
                                : 'Just now';

                              return (
                                <tr key={cid} className="hover:bg-slate-50/80 transition">
                                  {/* Inquirer / Lead Name */}
                                  <td className="py-3.5 px-4 whitespace-nowrap">
                                    <div className="font-extrabold text-slate-900 flex items-center space-x-1.5 whitespace-nowrap">
                                      <span className="font-black text-sm">{c.name || 'Anonymous User'}</span>
                                      {c.status === 'NEW' && (
                                        <span className="bg-rose-100 text-rose-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-rose-200">
                                          NEW
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[11px] text-slate-400 font-mono font-bold mt-0.5 whitespace-nowrap">
                                      ID: {String(cid).slice(-8).toUpperCase()} • {c.source || 'Website Form'}
                                    </div>
                                  </td>

                                  {/* Phone Number */}
                                  <td className="py-3.5 px-4 font-mono font-black text-slate-900 whitespace-nowrap text-xs">
                                    {c.phone ? (
                                      <a
                                        href={`tel:${c.phone}`}
                                        className="hover:text-red-700 transition flex items-center space-x-1.5"
                                        title="Click to call inquirer"
                                      >
                                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span>{c.phone}</span>
                                      </a>
                                    ) : (
                                      <span className="text-slate-400 font-bold">N/A</span>
                                    )}
                                  </td>

                                  {/* Email Address */}
                                  <td className="py-3.5 px-4 font-bold text-slate-700 whitespace-nowrap text-xs">
                                    {c.email ? (
                                      <a
                                        href={`mailto:${c.email}`}
                                        className="hover:text-red-700 transition flex items-center space-x-1.5 truncate max-w-[210px]"
                                        title={c.email}
                                      >
                                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span className="truncate">{c.email}</span>
                                      </a>
                                    ) : (
                                      <span className="text-slate-400 font-bold">N/A</span>
                                    )}
                                  </td>

                                  {/* Date with Time */}
                                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700 text-xs whitespace-nowrap">
                                    {formattedDate}
                                  </td>

                                  {/* Message / Query */}
                                  <td className="py-3.5 px-4 whitespace-nowrap max-w-[340px]">
                                    <div
                                      onClick={() => setSelectedInquiryModal(c)}
                                      className="font-bold text-slate-800 text-xs truncate max-w-[320px] cursor-pointer hover:text-red-700 transition"
                                      title={c.message}
                                    >
                                      {c.message}
                                    </div>
                                  </td>

                                  {/* Status Selector Dropdown */}
                                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                    <select
                                      value={c.status || 'NEW'}
                                      onChange={(e) => handleUpdateContactStatus(cid, e.target.value)}
                                      disabled={contactStatusUpdating === cid}
                                      className={`border rounded-xl px-3 py-1.5 text-xs font-black cursor-pointer shadow-2xs whitespace-nowrap transition-colors ${
                                        c.status === 'RESOLVED'
                                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                          : c.status === 'CONTACTED'
                                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                                          : 'bg-rose-50 text-rose-800 border-rose-300'
                                      } ${contactStatusUpdating === cid ? 'opacity-50' : ''}`}
                                    >
                                      <option value="NEW">NEW</option>
                                      <option value="CONTACTED">CONTACTED</option>
                                      <option value="RESOLVED">RESOLVED</option>
                                    </select>
                                  </td>

                                  {/* View Button */}
                                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedInquiryModal(c)}
                                      className="inline-flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer shadow-2xs"
                                      title="Open full inquiry details"
                                    >
                                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                                      <span>View</span>
                                    </button>
                                  </td>

                                  {/* Action / Delete Button */}
                                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteContact(cid)}
                                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl transition cursor-pointer inline-flex items-center justify-center shadow-2xs"
                                      title="Delete inquiry permanently"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
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
              );
            })()}

            {/* ========================================================= */}
            {/* TAB: CLAIM LOGS (Exact Match to Image 4)                  */}
            {/* ========================================================= */}
            {(activeTab === 'claim_logs' || activeTab === 'payments') && (() => {
              const filteredClaims = claimLogsList.filter(item => {
                if (claimMerchantFilter !== 'ALL' && item.merchant !== claimMerchantFilter) return false;
                if (claimStatusFilter !== 'ALL' && item.status.toLowerCase() !== claimStatusFilter.toLowerCase()) return false;
                if (claimRewardFilter !== 'ALL' && !item.reward.toLowerCase().includes(claimRewardFilter.toLowerCase())) return false;
                if (claimSearch.trim()) {
                  const q = claimSearch.toLowerCase();
                  return (item.rewardId || item.claimId || '').toLowerCase().includes(q) ||
                    (item.customerId || '').toLowerCase().includes(q) ||
                    (item.merchantId || '').toLowerCase().includes(q) ||
                    item.customer.toLowerCase().includes(q) ||
                    item.merchant.toLowerCase().includes(q) ||
                    item.reward.toLowerCase().includes(q);
                }
                return true;
              });

              return (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Notification Toast */}
                  {claimExportToast && (
                    <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{claimExportToast}</span>
                      </div>
                      <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase">Success</span>
                    </div>
                  )}

                  {/* 3 Top Stat Cards (Matching Dashboard & Merchants Colorful Style) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center justify-between group hover:shadow-md transition">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Claims</p>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">
                          {claimLogsList.length || 245}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">All customer reward redemptions</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center justify-between group hover:shadow-md transition">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Approved Claims</p>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">
                          {claimLogsList.filter(c => c.status === 'Success' || c.status === 'Approved').length || 198}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Successfully disbursed to shoppers</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center justify-between group hover:shadow-md transition">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Verification</p>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">
                          {claimLogsList.filter(c => c.status === 'Pending').length || 47}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Awaiting counter confirmation</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-black shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Filter and Action Bar (Image 4) */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                    <div className="flex flex-1 flex-wrap items-center gap-3">
                      {/* Search Bar */}
                      <div className="relative flex-1 min-w-[240px]">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={claimSearch}
                          onChange={(e) => setClaimSearch(e.target.value)}
                          placeholder="Search by reward ID, customer ID, merchant ID, customer..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>

                      {/* Merchant Filter */}
                      <select
                        value={claimMerchantFilter}
                        onChange={(e) => setClaimMerchantFilter(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-red-600 cursor-pointer shadow-2xs"
                      >
                        <option value="ALL">All Merchants</option>
                        <option value="Coffee House">Coffee House</option>
                        <option value="Pizza Plaza">Pizza Plaza</option>
                        <option value="Burger Point">Burger Point</option>
                        <option value="Fashion Hub">Fashion Hub</option>
                      </select>

                      {/* Status Filter */}
                      <select
                        value={claimStatusFilter}
                        onChange={(e) => setClaimStatusFilter(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-red-600 cursor-pointer shadow-2xs"
                      >
                        <option value="ALL">All Status</option>
                        <option value="Success">Success</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
                      </select>

                      {/* Reward Types Filter */}
                      <select
                        value={claimRewardFilter}
                        onChange={(e) => setClaimRewardFilter(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-red-600 cursor-pointer shadow-2xs"
                      >
                        <option value="ALL">All Reward Types</option>
                        <option value="Coffee">Free Coffee</option>
                        <option value="Discount">Discount</option>
                        <option value="Burger">Burger</option>
                        <option value="Off">Cash Off</option>
                        <option value="Drink">Drink</option>
                        <option value="Pizza">Pizza Slice</option>
                      </select>

                      {/* Date Range Button */}
                      <button
                        type="button"
                        className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 flex items-center space-x-1.5 transition cursor-pointer shadow-2xs"
                      >
                        <span>Date Range</span>
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>

                    {/* Export Button (Image 4 red border styling) */}
                    <div>
                      <button
                        type="button"
                        onClick={handleExportClaimLogs}
                        className="w-full sm:w-auto bg-white hover:bg-rose-50 text-red-600 border border-red-300 font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-2xs"
                      >
                        <Download className="w-4 h-4 text-red-600" />
                        <span>Export</span>
                      </button>
                    </div>
                  </div>

                  {/* Main Claims Table */}
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar pb-2">
                      <table className="w-full min-w-[1300px] text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-700 uppercase text-[11px] font-black tracking-wider whitespace-nowrap">
                            <th className="py-3.5 px-4 min-w-[60px]">#</th>
                            <th className="py-3.5 px-4 min-w-[130px]">Reward ID</th>
                            <th className="py-3.5 px-4 min-w-[130px]">Customer ID</th>
                            <th className="py-3.5 px-4 min-w-[160px]">Customer</th>
                            <th className="py-3.5 px-4 min-w-[130px]">Merchant ID</th>
                            <th className="py-3.5 px-4 min-w-[160px]">Merchant</th>
                            <th className="py-3.5 px-4 min-w-[160px]">Reward</th>
                            <th className="py-3.5 px-4 min-w-[160px] text-center">Aurex Coin</th>
                            <th className="py-3.5 px-4 min-w-[120px] text-center">Status</th>
                            <th className="py-3.5 px-4 min-w-[180px]">Claimed At</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredClaims.length === 0 ? (
                            <tr>
                              <td colSpan={10} className="py-10 text-center text-xs text-slate-400 font-black">
                                No claim logs match the selected search criteria.
                              </td>
                            </tr>
                          ) : (
                            filteredClaims.map((claim, idx) => (
                              <tr
                                key={claim.id}
                                onClick={() => setSelectedClaimModal(claim)}
                                className="hover:bg-slate-50/80 transition cursor-pointer"
                                title="Click to view details"
                              >
                                <td className="py-3.5 px-4 font-black text-slate-400 whitespace-nowrap">
                                  {idx + 1}
                                </td>
                                <td className="py-3.5 px-4 font-black text-slate-900 font-mono whitespace-nowrap">
                                  {claim.rewardId || claim.claimId}
                                </td>
                                <td className="py-3.5 px-4 font-black text-slate-900 font-mono whitespace-nowrap">
                                  {claim.customerId || `CUST-${800 + (claim.id || idx + 1)}`}
                                </td>
                                <td className="py-3.5 px-4 font-black text-slate-900 whitespace-nowrap">
                                  {claim.customer}
                                </td>
                                <td className="py-3.5 px-4 font-black text-slate-900 font-mono whitespace-nowrap">
                                  {claim.merchantId || `MER-${100 + (claim.id || idx + 1)}`}
                                </td>
                                <td className="py-3.5 px-4 font-black text-slate-900 whitespace-nowrap">
                                  {claim.merchant}
                                </td>
                                <td className="py-3.5 px-4 font-black text-slate-900 whitespace-nowrap">
                                  {claim.reward}
                                </td>
                                <td className="py-3.5 px-4 font-black text-slate-900 font-mono whitespace-nowrap text-center">
                                  {claim.pointsUsed}
                                </td>
                                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                  <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                                    claim.status === 'Success'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : claim.status === 'Pending'
                                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                                  }`}>
                                    {claim.status}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 font-mono font-black text-slate-800 text-xs whitespace-nowrap">
                                  {claim.claimedAt}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Claim Detail Modal */}
                  {selectedClaimModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <div className="flex items-center space-x-2">
                            <Award className="w-5 h-5 text-red-600" />
                            <h3 className="text-base font-black text-slate-900">Claim Receipt & Telemetry</h3>
                          </div>
                          <button
                            onClick={() => setSelectedClaimModal(null)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-bold">Reward ID</span>
                            <span className="font-black text-slate-900 font-mono">{selectedClaimModal.rewardId || selectedClaimModal.claimId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-bold">Customer ID</span>
                            <span className="font-black text-slate-900 font-mono">{selectedClaimModal.customerId || 'CUST-801'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-bold">Customer</span>
                            <span className="font-black text-slate-900">{selectedClaimModal.customer} ({selectedClaimModal.phone})</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-bold">Merchant ID</span>
                            <span className="font-black text-slate-900 font-mono">{selectedClaimModal.merchantId || 'MER-101'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-bold">Merchant Partner</span>
                            <span className="font-black text-slate-900">{selectedClaimModal.merchant}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-bold">Reward Redeemed</span>
                            <span className="font-black text-red-700">{selectedClaimModal.reward}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-bold">Aurex Coin</span>
                            <span className="font-mono font-black text-slate-900">{selectedClaimModal.pointsUsed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-bold">Redemption Status</span>
                            <span className="font-black text-emerald-600">{selectedClaimModal.status}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-bold">Claim Timestamp</span>
                            <span className="font-mono font-bold text-slate-700">{selectedClaimModal.claimedAt}</span>
                          </div>
                          <div className="flex justify-between border-t border-slate-200/80 pt-2">
                            <span className="text-slate-500 font-bold">Cashier PIN</span>
                            <span className="font-mono font-black text-slate-800">{selectedClaimModal.cashierPin}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-bold">Blockchain TX Hash</span>
                            <span className="font-mono text-slate-400 text-[10px]">{selectedClaimModal.txHash}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedClaimModal(null)}
                          className="w-full bg-[#74111d] hover:bg-[#5c0d16] text-white font-bold py-2 rounded-xl text-xs transition cursor-pointer"
                        >
                          Close Receipt
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ========================================================= */}
            {/* TAB: POLICY EDITOR (Exact Match to Image 2)               */}
            {/* ========================================================= */}
            {activeTab === 'policy_editor' && (() => {
              const currentDoc = policyData[policySubTab];
              const wordsCount = currentDoc.content.trim().split(/\s+/).filter(Boolean).length;
              const charsCount = currentDoc.content.length;

              return (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Toast Alert */}
                  {policyToast && (
                    <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{policyToast}</span>
                      </div>
                      <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase">Synced</span>
                    </div>
                  )}

                  {/* Sub-Tabs: Privacy Policy & Terms & Conditions (Image 2) */}
                  <div className="bg-white border-b border-slate-200 px-6 pt-2 rounded-t-2xl flex items-center justify-between shadow-xs">
                    <div className="flex items-center space-x-8">
                      <button
                        type="button"
                        onClick={() => setPolicySubTab('privacy')}
                        className={`pb-3.5 text-xs font-black transition cursor-pointer border-b-2 ${
                          policySubTab === 'privacy'
                            ? 'border-red-600 text-red-700'
                            : 'border-transparent text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        Privacy Policy
                      </button>
                      <button
                        type="button"
                        onClick={() => setPolicySubTab('terms')}
                        className={`pb-3.5 text-xs font-black transition cursor-pointer border-b-2 ${
                          policySubTab === 'terms'
                            ? 'border-red-600 text-red-700'
                            : 'border-transparent text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        Terms & Conditions
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('settings')}
                      className="pb-3 text-xs font-bold text-slate-500 hover:text-red-700 flex items-center space-x-1.5 transition cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Settings</span>
                    </button>
                  </div>

                  {/* Main Grid: Editor on Left, Document Info on Right (Image 2) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Editor Panel (8 Cols) */}
                    <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
                      <div>
                        <h2 className="text-sm font-black text-slate-900 mb-3">Editor</h2>

                        {/* Rich Formatting Toolbar (Image 2 exact match) */}
                        <div className="border border-slate-200 rounded-xl p-1.5 flex flex-wrap items-center gap-1 bg-slate-50/50 mb-4 text-slate-600">
                          {/* Paragraph Dropdown */}
                          <div className="relative">
                            <select className="appearance-none bg-white border border-slate-200 rounded-lg pl-2.5 pr-6 py-1 text-xs font-bold text-slate-700 cursor-pointer focus:outline-none">
                              <option>Paragraph</option>
                              <option>Heading 1</option>
                              <option>Heading 2</option>
                              <option>Heading 3</option>
                            </select>
                            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
                          </div>

                          <div className="h-4 w-px bg-slate-200 mx-1" />

                          {/* Bold, Italic, Underline, Strike */}
                          <button type="button" className="p-1.5 rounded-lg hover:bg-slate-200 font-extrabold text-xs" title="Bold">
                            <Bold className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" className="p-1.5 rounded-lg hover:bg-slate-200 italic text-xs" title="Italic">
                            <Italic className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" className="p-1.5 rounded-lg hover:bg-slate-200 underline text-xs" title="Underline">
                            <Underline className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" className="p-1.5 rounded-lg hover:bg-slate-200 line-through text-xs" title="Strikethrough">
                            <Strikethrough className="w-3.5 h-3.5" />
                          </button>

                          <div className="h-4 w-px bg-slate-200 mx-1" />

                          {/* Alignment */}
                          <button type="button" className="p-1.5 rounded-lg hover:bg-slate-200" title="Align Left">
                            <AlignLeft className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" className="p-1.5 rounded-lg hover:bg-slate-200" title="Align Center">
                            <AlignCenter className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" className="p-1.5 rounded-lg hover:bg-slate-200" title="Align Right">
                            <AlignRight className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" className="p-1.5 rounded-lg hover:bg-slate-200" title="Align Justify">
                            <AlignJustify className="w-3.5 h-3.5" />
                          </button>

                          <div className="h-4 w-px bg-slate-200 mx-1" />

                          {/* Lists & Indents */}
                          <button type="button" className="p-1.5 rounded-lg hover:bg-slate-200" title="Bullet List">
                            <List className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" className="p-1.5 rounded-lg hover:bg-slate-200" title="Numbered List">
                            <ListOrdered className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" className="p-1.5 rounded-lg hover:bg-slate-200" title="Decrease Indent">
                            <Outdent className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" className="p-1.5 rounded-lg hover:bg-slate-200" title="Increase Indent">
                            <Indent className="w-3.5 h-3.5" />
                          </button>

                          <div className="h-4 w-px bg-slate-200 mx-1" />

                          {/* Inserts: Link, Image, Table, More */}
                          <button type="button" className="p-1.5 rounded-lg hover:bg-slate-200" title="Insert Link">
                            <Link2 className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" className="p-1.5 rounded-lg hover:bg-slate-200" title="Insert Image">
                            <ImageIcon className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" className="p-1.5 rounded-lg hover:bg-slate-200" title="Insert Table">
                            <TableIcon className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" className="p-1.5 rounded-lg hover:bg-slate-200" title="More Options">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Editable Content Area */}
                        <div className="relative">
                          <textarea
                            value={currentDoc.content}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPolicyData(prev => ({
                                ...prev,
                                [policySubTab]: { ...prev[policySubTab], content: val }
                              }));
                            }}
                            rows={16}
                            className="w-full p-4 border border-slate-200 rounded-xl font-sans text-xs sm:text-sm text-slate-800 leading-relaxed focus:outline-none focus:border-red-600 bg-white"
                          />
                        </div>
                      </div>

                      {/* Words & Characters Count Footer (Image 2) */}
                      <div className="flex items-center space-x-6 text-xs text-slate-400 font-bold pt-3 border-t border-slate-100">
                        <span>Words: {wordsCount}</span>
                        <span>Characters: {charsCount}</span>
                      </div>
                    </div>

                    {/* Right: Document Info Panel (4 Cols) */}
                    <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">
                      <div>
                        <h2 className="text-sm font-black text-slate-900 mb-4 pb-2 border-b border-slate-100">
                          Document Info
                        </h2>

                        <div className="space-y-4 text-xs">
                          <div>
                            <span className="text-slate-400 font-medium block">Document Type</span>
                            <span className="font-extrabold text-slate-900">{currentDoc.type}</span>
                          </div>

                          <div>
                            <span className="text-slate-400 font-medium block mb-1">Status</span>
                            <span className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-bold ${
                              currentDoc.status === 'Published'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {currentDoc.status}
                            </span>
                          </div>

                          <div>
                            <span className="text-slate-400 font-medium block">Last Updated</span>
                            <span className="font-mono text-slate-700">{currentDoc.lastUpdated}</span>
                          </div>

                          <div>
                            <span className="text-slate-400 font-medium block">Version</span>
                            <span className="font-mono font-bold text-slate-900">{currentDoc.version}</span>
                          </div>

                          <div>
                            <span className="text-slate-400 font-medium block">Published By</span>
                            <span className="font-bold text-slate-900">{currentDoc.publishedBy}</span>
                          </div>

                          <div>
                            <span className="text-slate-400 font-medium block">Published On</span>
                            <span className="font-mono text-slate-700">{currentDoc.publishedOn}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions Buttons (Image 2) */}
                      <div className="space-y-2.5 pt-4 border-t border-slate-100">
                        <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
                          Actions
                        </div>

                        {/* Preview */}
                        <button
                          type="button"
                          onClick={() => setPolicyPreviewModalOpen(true)}
                          className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition cursor-pointer shadow-2xs"
                        >
                          <Eye className="w-4 h-4 text-slate-600" />
                          <span>Preview</span>
                        </button>

                        {/* Save Draft */}
                        <button
                          type="button"
                          onClick={handleSavePolicyDraft}
                          className="w-full bg-white hover:bg-rose-50 text-red-600 border border-red-300 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition cursor-pointer shadow-2xs"
                        >
                          <FileText className="w-4 h-4 text-red-600" />
                          <span>Save Draft</span>
                        </button>

                        {/* Publish */}
                        <button
                          type="button"
                          onClick={handlePublishPolicy}
                          className="w-full bg-[#74111d] hover:bg-[#5c0d16] text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition cursor-pointer shadow-md shadow-[#74111d]/25"
                        >
                          <Send className="w-4 h-4 text-white" />
                          <span>Publish</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Warning Notice Banner (Image 2 bottom notice) */}
                  <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center space-x-3 text-xs text-amber-900 font-medium shadow-2xs">
                    <Info className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Please preview the content before publishing. Published content will be visible to all users.</span>
                  </div>

                  {/* Policy Preview Modal */}
                  {policyPreviewModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <ShieldCheck className="w-5 h-5 text-red-600" />
                            <h3 className="text-base font-black text-slate-900">{currentDoc.type} Preview</h3>
                          </div>
                          <button
                            onClick={() => setPolicyPreviewModalOpen(false)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-4 whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/50">
                          {currentDoc.content}
                        </div>
                        <div className="p-4 border-t border-slate-100 flex justify-end">
                          <button
                            type="button"
                            onClick={() => setPolicyPreviewModalOpen(false)}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
                          >
                            Close Preview
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ========================================================= */}
            {/* TAB: FAQ EDITOR (Exact Match to Image 3)                  */}
            {/* ========================================================= */}
            {activeTab === 'faq_editor' && (() => {
              const filteredFaqs = faqsList.filter(f => {
                if (faqCategoryFilter !== 'ALL' && f.category !== faqCategoryFilter) return false;
                if (faqStatusFilter !== 'ALL' && f.status.toLowerCase() !== faqStatusFilter.toLowerCase()) return false;
                if (faqSearch.trim()) {
                  const q = faqSearch.toLowerCase();
                  return f.question.toLowerCase().includes(q) || (f.answer && f.answer.toLowerCase().includes(q));
                }
                return true;
              });

              return (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Toast Alert */}
                  {faqToast && (
                    <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{faqToast}</span>
                      </div>
                      <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase">Synced</span>
                    </div>
                  )}

                  {/* Top Toolbar (Image 3) */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                    <div className="flex flex-1 flex-wrap items-center gap-3">
                      {/* Search FAQ */}
                      <div className="relative flex-1 min-w-[240px]">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={faqSearch}
                          onChange={(e) => setFaqSearch(e.target.value)}
                          placeholder="Search FAQ by question or keyword..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>

                      {/* Category Filter */}
                      <select
                        value={faqCategoryFilter}
                        onChange={(e) => setFaqCategoryFilter(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-red-600 cursor-pointer shadow-2xs"
                      >
                        <option value="ALL">All Categories</option>
                        <option value="General">General</option>
                        <option value="Merchant">Merchant</option>
                        <option value="Rewards">Rewards</option>
                        <option value="Integration">Integration</option>
                        <option value="Support">Support</option>
                      </select>

                      {/* Status Filter */}
                      <select
                        value={faqStatusFilter}
                        onChange={(e) => setFaqStatusFilter(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-red-600 cursor-pointer shadow-2xs"
                      >
                        <option value="ALL">All Status</option>
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                        <option value="Unpublished">Unpublished</option>
                      </select>
                    </div>

                    {/* Actions: Back to Settings & + Add FAQ Button */}
                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveTab('settings')}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
                        <span>Settings</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFaqModal({ isOpen: true, mode: 'add', data: { question: '', answer: '', category: 'General', order: faqsList.length + 1, status: 'Published' } })}
                        className="w-full sm:w-auto bg-[#74111d] hover:bg-[#5c0d16] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-md shadow-[#74111d]/20"
                      >
                        <Plus className="w-4 h-4 text-white" />
                        <span>Add FAQ</span>
                      </button>
                    </div>
                  </div>

                  {/* Main FAQ Table (Image 3 exact match) */}
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[850px] text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-black tracking-wider">
                            <th className="py-3.5 px-4">#</th>
                            <th className="py-3.5 px-3">Question</th>
                            <th className="py-3.5 px-3">Category</th>
                            <th className="py-3.5 px-3">Status</th>
                            <th className="py-3.5 px-3 text-center">Order</th>
                            <th className="py-3.5 px-3">Last Updated</th>
                            <th className="py-3.5 px-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredFaqs.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-10 text-center text-xs text-slate-400 font-bold">
                                No FAQ entries match the search filter.
                              </td>
                            </tr>
                          ) : (
                            filteredFaqs.map((faq, idx) => (
                              <tr key={faq.id} className="hover:bg-slate-50/80 transition">
                                <td className="py-3.5 px-4 font-bold text-slate-400">
                                  {idx + 1}
                                </td>
                                <td className="py-3.5 px-3 font-extrabold text-slate-900">
                                  {faq.question}
                                </td>
                                <td className="py-3.5 px-3 font-semibold text-slate-700">
                                  {faq.category}
                                </td>
                                <td className="py-3.5 px-3">
                                  <span className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-bold ${
                                    faq.status === 'Published'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : faq.status === 'Draft'
                                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                                  }`}>
                                    {faq.status}
                                  </span>
                                </td>
                                <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-700">
                                  {faq.order}
                                </td>
                                <td className="py-3.5 px-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                                  {faq.lastUpdated}
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                  <div className="flex items-center justify-center space-x-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setFaqModal({ isOpen: true, mode: 'view', data: faq })}
                                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                                      title="View FAQ"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setFaqModal({ isOpen: true, mode: 'edit', data: faq })}
                                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-700 hover:bg-rose-50 transition cursor-pointer"
                                      title="Edit FAQ"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteFaq(faq.id)}
                                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                                      title="Delete FAQ"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Footer (Image 3 exact) */}
                    <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/40">
                      <div>
                        Showing 1 to {filteredFaqs.length} of 48 entries
                      </div>
                      <div className="flex items-center space-x-1">
                        <button className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50">
                          &lt;
                        </button>
                        {[1, 2, 3, 4, 5].map(p => (
                          <button
                            key={p}
                            onClick={() => setFaqCurrentPage(p)}
                            className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                              faqCurrentPage === p
                                ? 'bg-red-600 text-white'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                        <span className="px-1 text-slate-400">...</span>
                        <button
                          onClick={() => setFaqCurrentPage(5)}
                          className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold"
                        >
                          5
                        </button>
                        <button className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
                          &gt;
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* FAQ Modal (Add, Edit, View) */}
                  {faqModal.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <h3 className="text-base font-black text-slate-900">
                            {faqModal.mode === 'add' ? 'Add New FAQ' : faqModal.mode === 'edit' ? 'Edit FAQ' : 'FAQ Details'}
                          </h3>
                          <button
                            onClick={() => setFaqModal({ isOpen: false, mode: 'view', data: null })}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {faqModal.mode === 'view' ? (
                          <div className="space-y-4 text-xs">
                            <div>
                              <span className="text-slate-400 font-bold block mb-1">Question</span>
                              <p className="text-sm font-extrabold text-slate-900">{faqModal.data?.question}</p>
                            </div>
                            <div>
                              <span className="text-slate-400 font-bold block mb-1">Answer</span>
                              <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">{faqModal.data?.answer || 'No answer content provided.'}</p>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <span className="text-slate-400 font-medium block">Category</span>
                                <span className="font-bold text-slate-800">{faqModal.data?.category}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-medium block">Order</span>
                                <span className="font-mono font-bold text-slate-800">#{faqModal.data?.order}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-medium block">Status</span>
                                <span className="font-bold text-emerald-600">{faqModal.data?.status}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFaqModal({ isOpen: false, mode: 'view', data: null })}
                              className="w-full bg-slate-900 text-white font-bold py-2 rounded-xl text-xs transition cursor-pointer"
                            >
                              Close
                            </button>
                          </div>
                        ) : (
                          <form onSubmit={(e) => { e.preventDefault(); handleSaveFaq(faqModal.data); }} className="space-y-3 text-xs">
                            <div>
                              <label className="block text-slate-700 font-bold mb-1">Question</label>
                              <input
                                type="text"
                                required
                                value={faqModal.data?.question || ''}
                                onChange={(e) => setFaqModal({ ...faqModal, data: { ...faqModal.data, question: e.target.value } })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-600"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-700 font-bold mb-1">Answer</label>
                              <textarea
                                rows={4}
                                required
                                value={faqModal.data?.answer || ''}
                                onChange={(e) => setFaqModal({ ...faqModal, data: { ...faqModal.data, answer: e.target.value } })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-600"
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <label className="block text-slate-700 font-bold mb-1">Category</label>
                                <select
                                  value={faqModal.data?.category || 'General'}
                                  onChange={(e) => setFaqModal({ ...faqModal, data: { ...faqModal.data, category: e.target.value } })}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-red-600"
                                >
                                  <option value="General">General</option>
                                  <option value="Merchant">Merchant</option>
                                  <option value="Rewards">Rewards</option>
                                  <option value="Integration">Integration</option>
                                  <option value="Support">Support</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-slate-700 font-bold mb-1">Order</label>
                                <input
                                  type="number"
                                  value={faqModal.data?.order || 1}
                                  onChange={(e) => setFaqModal({ ...faqModal, data: { ...faqModal.data, order: Number(e.target.value) } })}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-red-600"
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 font-bold mb-1">Status</label>
                                <select
                                  value={faqModal.data?.status || 'Published'}
                                  onChange={(e) => setFaqModal({ ...faqModal, data: { ...faqModal.data, status: e.target.value } })}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-red-600"
                                >
                                  <option value="Published">Published</option>
                                  <option value="Draft">Draft</option>
                                  <option value="Unpublished">Unpublished</option>
                                </select>
                              </div>
                            </div>
                            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                              <button
                                type="button"
                                onClick={() => setFaqModal({ isOpen: false, mode: 'view', data: null })}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-2 rounded-xl bg-[#74111d] hover:bg-[#5c0d16] text-white font-bold shadow-md shadow-[#74111d]/20"
                              >
                                Save FAQ
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* TAB: BILLING & PAYMENTS MENU (Paid vs Unpaid, Revenue, Suspend) */}
            {activeTab === 'payments_old' && (
              <div className="space-y-6 animate-in fade-in duration-150">


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
                    <table className="w-full min-w-[850px] text-left text-xs border-collapse">
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
                                  {p.email && (
                                    <div className="text-[11px] text-slate-600 font-medium truncate max-w-xs flex items-center space-x-1 mt-0.5" title={p.email}>
                                      <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                      <span className="truncate">{p.email}</span>
                                    </div>
                                  )}
                                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                                    {p.mobile ? `${p.mobile} • ` : ''}{p.city || 'Delhi NCR'}
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

                                    {/* Delete Payment Record Action */}
                                    <button
                                      onClick={() => handleDeletePayment(p.id || p._id, p.businessName)}
                                      className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[10px] font-black uppercase p-1.5 rounded-lg transition cursor-pointer flex items-center justify-center shadow-2xs"
                                      title="Delete / Reset Billing Record"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
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

                  <div className="flex items-center gap-2.5 w-full lg:w-auto">
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

                {/* Sub-Tabs: Active Plans, Create Plan, Plan History */}
                <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setPlanSubTab('active')}
                    className={`px-4 py-2 rounded-xl text-xs font-black flex items-center space-x-2 transition cursor-pointer ${
                      planSubTab === 'active'
                        ? 'bg-[#8B0000] text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Active Plans ({plans.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlanSubTab('create')}
                    className={`px-4 py-2 rounded-xl text-xs font-black flex items-center space-x-2 transition cursor-pointer ${
                      planSubTab === 'create'
                        ? 'bg-[#8B0000] text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Plan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlanSubTab('history')}
                    className={`px-4 py-2 rounded-xl text-xs font-black flex items-center space-x-2 transition cursor-pointer ${
                      planSubTab === 'history'
                        ? 'bg-[#8B0000] text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>Plan History ({planHistory.length})</span>
                  </button>
                </div>

                {/* SUB-TAB 1: ACTIVE PLANS */}
                {planSubTab === 'active' && (
                  <div className="space-y-6 animate-in fade-in duration-150">
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

                        {/* Section 1: Basic Plan Details & Pricing */}
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-black uppercase text-slate-700 mb-1">
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
                              <label className="block text-xs font-bold text-slate-600 mb-1">
                                Short Tagline / Summary
                              </label>
                              <input
                                type="text"
                                value={p.subtext || ''}
                                onChange={(e) => handleUpdatePlanField(p.id, 'subtext', e.target.value)}
                                placeholder="e.g. Perfect for local retail shops getting started"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 focus:outline-none focus:border-red-600 font-medium"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-black text-slate-800 mb-1">
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
                              <label className="block text-xs font-bold text-slate-600 mb-1">
                                MRP / Regular Price (₹)
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
                              <label className="block text-xs font-bold text-slate-600 mb-1">
                                Billing Duration
                              </label>
                              <input
                                type="text"
                                value={p.period || ''}
                                onChange={(e) => handleUpdatePlanField(p.id, 'period', e.target.value)}
                                placeholder="e.g. / Year, / 3 Years, Lifetime"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-600 font-medium"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Section 2: Promotional Badges & Multi-Color Tags (Unique Colors & Gap) */}
                        <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1.5">
                              <Tag className="w-3.5 h-3.5 text-[#8B0000]" />
                              <span className="text-xs font-black uppercase text-slate-800 tracking-wide">
                                Promotional Badges & Tags ({(p.tags || []).length})
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 font-medium">
                              Each tag shows in a distinct color with clean spacing
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                Top Ribbon Badge (Optional)
                              </label>
                              <input
                                type="text"
                                value={p.highlightBadge || ''}
                                onChange={(e) => handleUpdatePlanField(p.id, 'highlightBadge', e.target.value)}
                                placeholder="e.g. Most Popular or Best Value"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-red-600 font-bold"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                Savings / Discount Note (Optional)
                              </label>
                              <input
                                type="text"
                                value={p.tagText || ''}
                                onChange={(e) => handleUpdatePlanField(p.id, 'tagText', e.target.value)}
                                placeholder="e.g. Equivalent to ₹2,000/month"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-red-600 font-bold"
                              />
                            </div>
                          </div>

                          {/* Active tags pills with DIFFERENT DISTINCT COLORS and GAP */}
                          <div>
                            <span className="block text-[11px] font-bold text-slate-600 mb-1.5">
                              Active Tags (Rendered in separate colorful badges):
                            </span>
                            <div className="flex flex-wrap gap-2.5 min-h-[32px] items-center">
                              {(p.tags || []).length === 0 ? (
                                <span className="text-xs text-slate-400 italic">No custom tags added yet. Choose a suggested tag or type your own below.</span>
                              ) : (
                                (p.tags || []).map((tag, tIdx) => {
                                  const theme = PLAN_TAG_PALETTES[tIdx % PLAN_TAG_PALETTES.length];
                                  return (
                                    <span
                                      key={tIdx}
                                      className={`inline-flex items-center space-x-1.5 ${theme.chip} border px-3 py-1.5 rounded-xl text-xs font-black shadow-2xs`}
                                    >
                                      <Sparkles className={`w-3.5 h-3.5 ${theme.icon}`} />
                                      <span>{tag}</span>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveTagFromPlan(p.id, tIdx)}
                                        className="text-slate-400 hover:text-rose-700 ml-1 p-0.5 rounded cursor-pointer"
                                        title="Remove tag"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </span>
                                  );
                                })
                              )}
                            </div>
                          </div>

                          {/* Add custom tag input */}
                          <div className="flex items-center space-x-2 pt-1">
                            <input
                              type="text"
                              value={newPlanTagInputs[p.id] || ''}
                              onChange={(e) => setNewPlanTagInputs({ ...newPlanTagInputs, [p.id]: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddTagToPlan(p.id);
                                }
                              }}
                              placeholder="Type a tag name (e.g. One-Time Payment, No Renewals, Save 40%)..."
                              className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-600 font-bold"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddTagToPlan(p.id)}
                              className="bg-[#8B0000] hover:bg-[#700000] text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer shrink-0 shadow-xs flex items-center space-x-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Tag</span>
                            </button>
                          </div>

                          {/* Quick suggested tags */}
                          <div className="pt-2 border-t border-slate-200">
                            <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                              Suggested Tags (Click to Add):
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                'One-Time Payment',
                                'No Renewals',
                                'Most Popular',
                                'Best Value',
                                'Recommended',
                                'Save 40%',
                                'Limited Offer',
                                'Lifetime Deal',
                                'Instant Setup',
                                'VIP Partner'
                              ].filter(t => !(p.tags || []).includes(t)).map((preset, pIdx) => (
                                <button
                                  key={pIdx}
                                  type="button"
                                  onClick={() => handleAddTagToPlan(p.id, preset)}
                                  className="text-[11px] bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 px-2.5 py-1 rounded-lg transition cursor-pointer font-bold flex items-center space-x-1 shadow-2xs"
                                >
                                  <Plus className="w-3 h-3 text-[#8B0000]" />
                                  <span>{preset}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Section 3: Features & Additional Settings */}
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1">
                                QR Scans Limit
                              </label>
                              <input
                                type="text"
                                value={p.scansLimit || ''}
                                onChange={(e) => handleUpdatePlanField(p.id, 'scansLimit', e.target.value)}
                                placeholder="Unlimited customer QR scans"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-600 font-medium"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1">
                                Free Trial Days
                              </label>
                              <input
                                type="number"
                                value={p.trialDays ?? 2}
                                onChange={(e) => handleUpdatePlanField(p.id, 'trialDays', Number(e.target.value))}
                                placeholder="2"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-600 font-medium"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1">
                                Button Text
                              </label>
                              <input
                                type="text"
                                value={p.ctaText || ''}
                                onChange={(e) => handleUpdatePlanField(p.id, 'ctaText', e.target.value)}
                                placeholder="Start 2-Day Trial"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-600 font-medium"
                              />
                            </div>
                          </div>

                          {/* Features List Section */}
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black uppercase text-slate-700 tracking-wide">
                                Included Features ({(p.features || []).length})
                              </span>
                              <span className="text-[11px] text-slate-400 font-medium">
                                Shown as bullet points on plan card
                              </span>
                            </div>

                            <div className="space-y-1.5">
                              {(p.features || []).map((feat, fIdx) => (
                                <div
                                  key={fIdx}
                                  className="flex items-center justify-between bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs shadow-2xs"
                                >
                                  <div className="flex items-center space-x-2 text-slate-800 font-medium">
                                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
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
                                placeholder="Add new feature (e.g. Free Acrylic Standee)..."
                                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-red-600 font-medium"
                              />
                              <button
                                type="button"
                                onClick={() => handleAddPlanFeature(p.id)}
                                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition cursor-pointer shrink-0"
                              >
                                + Add
                              </button>
                            </div>
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
                                {/* Multi-Color Distinct Badges & Tags */}
                                {(() => {
                                  const planTags = getPlanTagList(p);
                                  if (planTags.length === 0) return null;
                                  return (
                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                      {planTags.map((tag, tIdx) => {
                                        const palette = PLAN_TAG_PALETTES[tIdx % PLAN_TAG_PALETTES.length];
                                        return (
                                          <span
                                            key={tIdx}
                                            className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border shadow-xs ${palette.previewDark}`}
                                          >
                                            <Sparkles className="w-2.5 h-2.5 shrink-0 opacity-80" />
                                            <span>{tag}</span>
                                          </span>
                                        );
                                      })}
                                    </div>
                                  );
                                })()}
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
                                {/* Multi-Color Distinct Badges & Tags */}
                                {(() => {
                                  const planTags = getPlanTagList(p);
                                  if (planTags.length === 0) return null;
                                  return (
                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                      {planTags.map((tag, tIdx) => {
                                        const palette = PLAN_TAG_PALETTES[tIdx % PLAN_TAG_PALETTES.length];
                                        return (
                                          <span
                                            key={tIdx}
                                            className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border shadow-xs ${palette.previewLight}`}
                                          >
                                            <Sparkles className={`w-2.5 h-2.5 shrink-0 ${palette.icon}`} />
                                            <span>{tag}</span>
                                          </span>
                                        );
                                      })}
                                    </div>
                                  );
                                })()}
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
                              {/* Multi-Color Distinct Badges & Tags */}
                              {(() => {
                                const planTags = getPlanTagList(p);
                                if (planTags.length === 0) return null;
                                return (
                                  <div className="flex flex-wrap items-center gap-2 mt-2">
                                    {planTags.map((tag, tIdx) => {
                                      const palette = PLAN_TAG_PALETTES[tIdx % PLAN_TAG_PALETTES.length];
                                      return (
                                        <span
                                          key={tIdx}
                                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border shadow-xs ${palette.previewLight}`}
                                        >
                                          <Sparkles className={`w-2.5 h-2.5 shrink-0 ${palette.icon}`} />
                                          <span>{tag}</span>
                                        </span>
                                      );
                                    })}
                                  </div>
                                );
                              })()}
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

            {/* SUB-TAB 2: CREATE PLAN */}
            {planSubTab === 'create' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left: Form Controls (7 cols) */}
                  <form
                    onSubmit={handleCreateCustomPlan}
                    className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5"
                  >
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                          <Plus className="w-4 h-4 text-red-600" />
                          <span>Create & Publish New Subscription Plan</span>
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Define retail billing terms, features, and badges. On saving, it will automatically sync to MongoDB and display in Active Plans.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPlanSubTab('active')}
                        className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    {/* Plan Name & Slug */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                          Plan Display Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={newPlanForm.name}
                          onChange={(e) => setNewPlanForm({ ...newPlanForm, name: e.target.value })}
                          placeholder="e.g. Growth Enterprise Plan"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-red-600 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                          Plan Key / Identifier
                        </label>
                        <input
                          type="text"
                          value={newPlanForm.id}
                          onChange={(e) => setNewPlanForm({ ...newPlanForm, id: e.target.value })}
                          placeholder="e.g. plan_growth_enterprise (auto-generated if empty)"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:border-red-600 focus:bg-white"
                        />
                      </div>
                    </div>

                    {/* Pricing & Billing Period */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                          Price (₹ INR) *
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={newPlanForm.price}
                          onChange={(e) => setNewPlanForm({ ...newPlanForm, price: e.target.value })}
                          placeholder="24000"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-black focus:outline-none focus:border-red-600 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                          Original Price (₹ Cut-off)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={newPlanForm.originalPrice}
                          onChange={(e) => setNewPlanForm({ ...newPlanForm, originalPrice: e.target.value })}
                          placeholder="36000"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-red-600 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                          Billing Period
                        </label>
                        <select
                          value={newPlanForm.period}
                          onChange={(e) => setNewPlanForm({ ...newPlanForm, period: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-red-600 focus:bg-white"
                        >
                          <option value="/ Year">/ Year</option>
                          <option value="/ 3 Years">/ 3 Years</option>
                          <option value="/ 2 Years">/ 2 Years</option>
                          <option value="/ Month">/ Month</option>
                          <option value="/ Lifetime">/ Lifetime</option>
                        </select>
                      </div>
                    </div>

                    {/* Subtext & Tag text */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                          Subtext / Short Tagline
                        </label>
                        <input
                          type="text"
                          value={newPlanForm.subtext}
                          onChange={(e) => setNewPlanForm({ ...newPlanForm, subtext: e.target.value })}
                          placeholder="Designed for scaling retail counter outlets"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-red-600 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                          Monthly Equivalent Tag (e.g. ₹2,000/mo)
                        </label>
                        <input
                          type="text"
                          value={newPlanForm.tagText}
                          onChange={(e) => setNewPlanForm({ ...newPlanForm, tagText: e.target.value })}
                          placeholder="Equivalent to ₹2,000/month"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-red-600 focus:bg-white"
                        />
                      </div>
                    </div>

                    {/* Trial Days & Scans limit */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                          Free Trial Duration (Days)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={newPlanForm.trialDays}
                          onChange={(e) => setNewPlanForm({ ...newPlanForm, trialDays: e.target.value })}
                          placeholder="2"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-red-600 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                          Customer Scans Quota
                        </label>
                        <input
                          type="text"
                          value={newPlanForm.scansLimit}
                          onChange={(e) => setNewPlanForm({ ...newPlanForm, scansLimit: e.target.value })}
                          placeholder="Unlimited customer QR scans"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-red-600 focus:bg-white"
                        />
                      </div>
                    </div>

                    {/* CTA Text & Ribbon Badge */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                          CTA Button Text
                        </label>
                        <input
                          type="text"
                          value={newPlanForm.ctaText}
                          onChange={(e) => setNewPlanForm({ ...newPlanForm, ctaText: e.target.value })}
                          placeholder="Start 2-Day Trial"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-red-600 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                          Highlight Badge Ribbon (e.g. Most Popular)
                        </label>
                        <input
                          type="text"
                          value={newPlanForm.highlightBadge}
                          onChange={(e) => setNewPlanForm({ ...newPlanForm, highlightBadge: e.target.value })}
                          placeholder="Most Popular / Recommended"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-red-600 focus:bg-white"
                        />
                      </div>
                    </div>

                    {/* Plan Tags & Badges Addition System */}
                    <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Tag className="w-4 h-4 text-[#74111d]" />
                          <span className="text-[11px] font-black uppercase text-slate-800 tracking-wide">
                            Plan Tags & Badges ({(newPlanForm.tags || []).length})
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold">
                          Add multiple promotional tags to this plan
                        </span>
                      </div>

                      {/* Active tags pills */}
                      <div className="flex flex-wrap gap-2.5 min-h-[32px] items-center">
                        {(newPlanForm.tags || []).length === 0 ? (
                          <span className="text-xs text-slate-400 italic">No custom tags added yet. Choose presets below or type your own.</span>
                        ) : (
                          (newPlanForm.tags || []).map((tag, tIdx) => {
                            const palette = PLAN_TAG_PALETTES[tIdx % PLAN_TAG_PALETTES.length];
                            return (
                              <span
                                key={tIdx}
                                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black border shadow-2xs ${palette.chip}`}
                              >
                                <Sparkles className={`w-3.5 h-3.5 ${palette.icon}`} />
                                <span>{tag}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTagFromNewPlan(tIdx)}
                                  className="opacity-70 hover:opacity-100 ml-1 p-0.5 rounded cursor-pointer transition"
                                  title="Remove tag"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            );
                          })
                        )}
                      </div>

                      {/* Input to add custom tag */}
                      <div className="flex items-center space-x-2 pt-1">
                        <input
                          type="text"
                          value={newPlanTagInput}
                          onChange={(e) => setNewPlanTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTagToNewPlan();
                            }
                          }}
                          placeholder="Type custom tag (e.g. Best Value, Save 40%, Limited Offer) and press Enter..."
                          className="flex-1 bg-white border border-rose-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-red-600 font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddTagToNewPlan()}
                          className="bg-[#74111d] hover:bg-[#5e0c15] text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer shrink-0 shadow-xs flex items-center space-x-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Tag</span>
                        </button>
                      </div>

                      {/* Quick Preset Tag Suggestions */}
                      <div className="pt-2 border-t border-rose-200/60">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">
                          Quick Preset Tag Badges:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            'One-Time Payment',
                            'No Renewals',
                            'Most Popular',
                            'Best Value',
                            'Recommended',
                            'Top Choice',
                            'Limited Offer',
                            'Save 40%',
                            'VIP Partner',
                            'Instant Setup',
                            'Lifetime Deal'
                          ].filter(preset => !(newPlanForm.tags || []).includes(preset)).map((preset, pIdx) => (
                            <button
                              key={pIdx}
                              type="button"
                              onClick={() => handleAddTagToNewPlan(preset)}
                              className="text-[11px] bg-white hover:bg-rose-50 text-slate-700 hover:text-[#74111d] border border-rose-200 hover:border-rose-300 px-2.5 py-1 rounded-lg transition cursor-pointer font-medium flex items-center space-x-1"
                            >
                              <Plus className="w-3 h-3 text-[#74111d]" />
                              <span>{preset}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Feature Tags List */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase text-slate-700 tracking-wide">
                          Plan Features Checklist ({newPlanForm.features.length})
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">
                          Displayed with green checkmarks
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {newPlanForm.features.map((feat, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center space-x-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-800 shadow-2xs"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{feat}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFeatureFromNewPlan(idx)}
                              className="text-slate-400 hover:text-rose-600 ml-1 p-0.5 rounded cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Add Custom Feature input */}
                      <div className="flex items-center space-x-2 pt-1">
                        <input
                          type="text"
                          value={newPlanFeatureInput}
                          onChange={(e) => setNewPlanFeatureInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddFeatureToNewPlan();
                            }
                          }}
                          placeholder="Type custom feature and press Enter..."
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-600"
                        />
                        <button
                          type="button"
                          onClick={handleAddFeatureToNewPlan}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition cursor-pointer shrink-0"
                        >
                          + Add Feature
                        </button>
                      </div>

                      {/* Quick feature suggestions */}
                      <div className="pt-2 border-t border-slate-200/60">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                          Quick Suggested Presets:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            'Free 5x7" Acrylic Counter Standee',
                            'Mystery Scratch Card Gamification',
                            'Digital Frequency Stamp Card',
                            'Cashier PIN Fraud Protection',
                            'Customer CRM Mobile Export',
                            'WhatsApp & SMS Victory Alerts',
                            'Multi-Counter Branch Support',
                            '24/7 Dedicated Support'
                          ].filter(s => !newPlanForm.features.includes(s)).map((preset, pIdx) => (
                            <button
                              key={pIdx}
                              type="button"
                              onClick={() => setNewPlanForm(prev => ({ ...prev, features: [...prev.features, preset] }))}
                              className="text-[11px] bg-white hover:bg-red-50 text-slate-600 hover:text-red-700 border border-slate-200 hover:border-red-300 px-2.5 py-1 rounded-lg transition cursor-pointer"
                            >
                              + {preset}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Visibility & Highlight Options */}
                    <div className="flex flex-wrap items-center gap-5 pt-2 text-xs font-bold text-slate-700">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newPlanForm.showOnLandingPage}
                          onChange={(e) => setNewPlanForm({ ...newPlanForm, showOnLandingPage: e.target.checked })}
                          className="rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                        />
                        <span>Show on Public Landing Page (/#pricing)</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newPlanForm.isPopular}
                          onChange={(e) => setNewPlanForm({ ...newPlanForm, isPopular: e.target.checked })}
                          className="rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                        />
                        <span>Highlight as Popular</span>
                      </label>
                    </div>

                    {/* Submit Buttons */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setPlanSubTab('active')}
                        className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        Discard Draft
                      </button>
                      <button
                        type="submit"
                        className="bg-[#74111d] hover:bg-[#5e0c15] text-white font-black px-6 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition cursor-pointer shadow-md shadow-[#74111d]/25"
                      >
                        <Save className="w-4 h-4" />
                        <span>Publish Plan & Save to MongoDB</span>
                      </button>
                    </div>
                  </form>

                  {/* Right: Live Card Preview (5 cols) */}
                  <div className="lg:col-span-5 bg-slate-900 rounded-3xl p-6 text-white space-y-4 sticky top-6">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">Live Card Preview</h4>
                      </div>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                        Landing Page View
                      </span>
                    </div>

                    {/* The Preview Card */}
                    <div className={`bg-white rounded-2xl p-6 text-slate-900 shadow-xl relative flex flex-col justify-between pt-10 border-2 ${
                      newPlanForm.isPopular ? 'border-red-600 ring-2 ring-red-500/20' : 'border-slate-200'
                    }`}>
                      {(newPlanForm.highlightBadge || (newPlanForm.isPopular && 'Most Popular')) && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                          {newPlanForm.highlightBadge || 'Most Popular'}
                        </span>
                      )}

                      <div>
                        <h5 className="text-lg font-black text-slate-900">
                          {newPlanForm.name || 'Plan Name'}
                        </h5>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {newPlanForm.subtext || 'Short plan description'}
                        </p>

                        <div className="mt-4 mb-4 pb-4 border-b border-slate-100">
                          {Number(newPlanForm.originalPrice) > 0 && (
                            <span className="text-xs font-bold text-slate-400 line-through block">
                              ₹{Number(newPlanForm.originalPrice).toLocaleString('en-IN')}
                            </span>
                          )}
                          <div className="text-2xl font-black text-slate-900">
                            ₹{Number(newPlanForm.price || 0).toLocaleString('en-IN')}{' '}
                            <span className="text-xs font-normal text-slate-500">{newPlanForm.period}</span>
                          </div>
                          {/* Multi-Color Distinct Badges & Tags */}
                          {(() => {
                            const planTags = getPlanTagList(newPlanForm);
                            if (planTags.length === 0) return null;
                            return (
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                {planTags.map((tg, idx) => {
                                  const palette = PLAN_TAG_PALETTES[idx % PLAN_TAG_PALETTES.length];
                                  return (
                                    <span
                                      key={idx}
                                      className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border shadow-xs ${palette.previewLight}`}
                                    >
                                      <Sparkles className={`w-2.5 h-2.5 shrink-0 ${palette.icon}`} />
                                      <span>{tg}</span>
                                    </span>
                                  );
                                })}
                              </div>
                            );
                          })()}
                        </div>

                        <ul className="space-y-2 text-slate-600 text-xs mb-6">
                          {(newPlanForm.features || []).map((f, i) => (
                            <li key={i} className="flex items-center space-x-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button className="w-full bg-[#8B0000] text-white font-black py-2.5 rounded-xl text-xs shadow-md">
                        {newPlanForm.ctaText || 'Start 2-Day Trial'}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400 text-center">
                      Updates live as you type in the form on the left.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 3: PLAN HISTORY */}
            {planSubTab === 'history' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                  <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50">
                    <div>
                      <div className="flex items-center space-x-2">
                        <History className="w-5 h-5 text-[#8B0000]" />
                        <h3 className="text-base font-black text-slate-900">Plan Modification & Creation History</h3>
                      </div>
                      <p className="text-xs text-slate-500 font-bold mt-0.5">
                        Complete immutable audit trail of all platform plan additions, price adjustments, and feature changes.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-xs font-mono font-black bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl shadow-2xs">
                        {planHistory.length} Total Logs
                      </span>
                      <span className="text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-xl flex items-center space-x-1.5 shadow-2xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>MongoDB Synced</span>
                      </span>
                    </div>
                  </div>

                  {/* Audit Log Timeline Table with Merchant-Style Horizontal Scrollbar & Bold Typography */}
                  <div className="overflow-x-auto custom-scrollbar pb-3">
                    <table className="w-full min-w-[1350px] text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-black tracking-wider whitespace-nowrap select-none">
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[200px]">Timestamp</th>
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[210px]">Plan Affected</th>
                          <th className="py-3.5 px-4 whitespace-nowrap text-center min-w-[180px]">Action Type</th>
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[450px]">Details & Audit Summary</th>
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[190px]">Modified By</th>
                          <th className="py-3.5 px-4 whitespace-nowrap text-center min-w-[120px]">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {planHistory.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-xs text-slate-400 font-black">
                              No plan audit records found.
                            </td>
                          </tr>
                        ) : (
                          planHistory.map((item, idx) => (
                            <tr key={item.id || idx} className="hover:bg-slate-50/80 transition">
                              {/* Timestamp */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <div className="font-mono font-bold text-slate-800 text-xs whitespace-nowrap flex items-center space-x-1.5">
                                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span>{item.timestamp}</span>
                                </div>
                              </td>

                              {/* Plan Affected */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <div className="font-black text-slate-900 text-sm whitespace-nowrap flex items-center space-x-1.5">
                                  <Tag className="w-3.5 h-3.5 text-[#8B0000] shrink-0" />
                                  <span>{item.planName}</span>
                                </div>
                              </td>

                              {/* Action Type */}
                              <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                <span className="inline-flex items-center space-x-1 bg-red-50 text-red-700 font-black px-3 py-1 rounded-xl text-xs border border-red-200 shadow-2xs whitespace-nowrap">
                                  <span>{item.action}</span>
                                </span>
                              </td>

                              {/* Details & Audit Summary */}
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-slate-700 text-xs leading-relaxed max-w-2xl">
                                  {item.details}
                                </div>
                              </td>

                              {/* Modified By */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <div className="font-black text-slate-900 text-xs whitespace-nowrap flex items-center space-x-1.5">
                                  <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                  <span>{item.user || 'Super Admin (Owner)'}</span>
                                </div>
                              </td>

                              {/* Status */}
                              <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                <span className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 font-black px-3 py-1 rounded-xl text-xs whitespace-nowrap shadow-2xs">
                                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span>Applied</span>
                                </span>
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
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: MANAGE REFERRALS (Images 1, 2, 3)                     */}
        {/* ========================================================= */}
        {activeTab === 'referrals' && (() => {
          const filteredReferrals = referralsList.filter(r => {
            if (!referralSearch.trim()) return true;
            const q = referralSearch.toLowerCase();
            return (
              (r.id && r.id.toLowerCase().includes(q)) ||
              (r.userEmail && r.userEmail.toLowerCase().includes(q)) ||
              (r.userName && r.userName.toLowerCase().includes(q)) ||
              (r.userNumber && r.userNumber.toLowerCase().includes(q)) ||
              (r.referredTo && r.referredTo.toLowerCase().includes(q))
            );
          });

          return (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Notification Toast */}
              {referralToast && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{referralToast}</span>
                  </div>
                  <button onClick={() => setReferralToast('')} className="p-1 hover:text-emerald-950">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Wine Red Header Banner (Matching Landing Page Theme) */}
              <div className="bg-gradient-to-r from-[#690005] via-[#8B0000] to-[#590104] text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                  <div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('overview')}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition mb-3 cursor-pointer backdrop-blur-xs"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Dashboard</span>
                    </button>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                        Manage Referrals
                      </h2>
                    </div>
                    <p className="text-rose-100 text-xs sm:text-sm font-medium mt-1">
                      Referrals with payment and bank details
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setAddReferralModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-white text-[#74111d] hover:bg-rose-50 text-xs font-black transition cursor-pointer shadow-md flex items-center space-x-1.5"
                    >
                      <Plus className="w-4 h-4 text-[#74111d]" />
                      <span>Add Referral</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Search Bar & Action Controls */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative flex-1 w-full sm:max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={referralSearch}
                    onChange={(e) => setReferralSearch(e.target.value)}
                    placeholder="Search by user email, name, phone or referral code..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-red-600"
                  />
                </div>
                <div className="flex items-center space-x-3 text-xs text-slate-500 font-bold">
                  <span>Total Records: <strong className="text-slate-900">{filteredReferrals.length}</strong></span>
                </div>
              </div>

              {/* Referrals Detail Table Card */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                <div className="bg-[#74111d] text-white px-6 py-3.5 flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-bold text-sm">
                    <TableIcon className="w-4 h-4 text-rose-200" />
                    <span>Referrals Detail</span>
                  </div>
                  <span className="text-xs bg-white/20 text-white font-bold px-2.5 py-0.5 rounded-full">
                    {filteredReferrals.length} Entries
                  </span>
                </div>

                <div className="overflow-x-auto custom-scrollbar pb-3">
                  <table className="w-full min-w-[1300px] text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-black tracking-wider whitespace-nowrap select-none">
                        <th className="py-3.5 px-4 whitespace-nowrap min-w-[90px] text-left">USER ID</th>
                        <th className="py-3.5 px-4 whitespace-nowrap min-w-[220px] text-left">USER EMAIL</th>
                        <th className="py-3.5 px-4 whitespace-nowrap min-w-[160px] text-left">USER NAME</th>
                        <th className="py-3.5 px-4 whitespace-nowrap min-w-[140px] text-left">USER NUMBER</th>
                        <th className="py-3.5 px-4 whitespace-nowrap min-w-[220px] text-left">REFERRED TO</th>
                        <th className="py-3.5 px-4 whitespace-nowrap text-center min-w-[140px]">REFERRAL DETAILS</th>
                        <th className="py-3.5 px-4 whitespace-nowrap text-right min-w-[140px]">REFERRAL AMT.</th>
                        <th className="py-3.5 px-4 whitespace-nowrap text-center min-w-[110px]">REFUND</th>
                        <th className="py-3.5 px-4 whitespace-nowrap text-center min-w-[160px]">MW PAYMENT STATUS</th>
                        <th className="py-3.5 px-4 whitespace-nowrap text-center min-w-[90px]">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredReferrals.map((item, idx) => (
                        <tr key={item.id || idx} className="hover:bg-slate-50/80 transition">
                          <td className="py-3.5 px-4 font-mono font-black text-slate-900 text-xs whitespace-nowrap text-left">
                            {item.id}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900 text-xs whitespace-nowrap text-left">
                            {item.userEmail}
                          </td>
                          <td className="py-3.5 px-4 font-black text-slate-900 text-xs whitespace-nowrap text-left">
                            {item.userName}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-700 text-xs whitespace-nowrap text-left">
                            {item.userNumber}
                          </td>
                          <td className="py-3.5 px-4 font-black text-slate-900 text-xs whitespace-nowrap text-left">
                            {item.referredTo}
                          </td>
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setSelectedReferralDetailModal(item)}
                              className="px-3.5 py-1.5 rounded-xl border border-[#74111d] bg-white text-[#74111d] hover:bg-rose-50 font-black text-xs transition cursor-pointer shadow-2xs hover:shadow-xs"
                            >
                              View
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-black text-slate-900 text-sm whitespace-nowrap">
                            ₹{Number(item.referralAmt).toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-4 text-center font-bold text-slate-600 text-xs whitespace-nowrap">
                            {item.refund || 'None'}
                          </td>
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                              item.paymentStatus === 'Paid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : item.paymentStatus === 'Eligible'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                              {item.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleDeleteReferral(item.id)}
                              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                              title="Delete Referral Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MODAL: REFERRAL DETAILS (Image 2 Exact Layout) */}
              {selectedReferralDetailModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 overflow-y-auto">
                  <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden relative my-auto">
                    {/* Modal Header */}
                    <div className="bg-[#74111d] text-white px-6 py-3.5 flex items-center justify-between">
                      <h3 className="font-bold text-base">Referral Details</h3>
                      <button
                        type="button"
                        onClick={() => setSelectedReferralDetailModal(null)}
                        className="text-white hover:text-rose-100 p-1 cursor-pointer transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-6 space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="text-sm font-black text-slate-900">
                          Referrals by: {selectedReferralDetailModal.userName !== '-' ? selectedReferralDetailModal.userName : selectedReferralDetailModal.userEmail} ({selectedReferralDetailModal.userEmail})
                        </div>
                        <button
                          type="button"
                          onClick={() => setViewHistoryModal(selectedReferralDetailModal)}
                          className="px-3.5 py-1.5 rounded-xl border border-[#74111d] bg-white hover:bg-rose-50 text-[#74111d] font-black text-xs transition cursor-pointer shadow-2xs flex items-center space-x-1.5 self-start sm:self-auto"
                          title="View Payment Date and History Type"
                        >
                          <History className="w-3.5 h-3.5" />
                          <span>View Payment History</span>
                        </button>
                      </div>

                      {/* Modal Table (Image 1) */}
                      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
                        <div className="overflow-x-auto custom-scrollbar">
                          <table className="w-full text-left text-xs border-collapse min-w-[880px]">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-black uppercase text-[11px] tracking-wider whitespace-nowrap">
                                <th className="py-3.5 px-3">Referred User</th>
                                <th className="py-3.5 px-3">Referral Date</th>
                                <th className="py-3.5 px-3 text-center">User Payment Status</th>
                                <th className="py-3.5 px-3 text-right">Total Amount</th>
                                <th className="py-3.5 px-3 text-right">Paid Amount</th>
                                <th className="py-3.5 px-3 text-right">Pending Amount</th>
                                <th className="py-3.5 px-3 text-center">Status</th>
                                <th className="py-3.5 px-3 text-center min-w-[170px]">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="hover:bg-slate-50/70 transition">
                                <td className="py-3.5 px-3 font-black whitespace-pre-line text-slate-900">
                                  {selectedReferralDetailModal.details?.referredUser || selectedReferralDetailModal.userEmail}
                                </td>
                                <td className="py-3.5 px-3 text-slate-700 font-mono font-bold whitespace-nowrap">
                                  {selectedReferralDetailModal.details?.referralDate || '20-07-2026'}
                                </td>
                                <td className="py-3.5 px-3 text-center whitespace-nowrap">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                    selectedReferralDetailModal.details?.userPaymentStatus === 'Paid'
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                                  }`}>
                                    {selectedReferralDetailModal.details?.userPaymentStatus || 'Not Paid'}
                                  </span>
                                </td>
                                <td className="py-3.5 px-3 text-right font-black font-mono text-slate-900 whitespace-nowrap">
                                  ₹{Number(selectedReferralDetailModal.details?.totalAmount || selectedReferralDetailModal.referralAmt).toLocaleString('en-IN')}
                                </td>
                                <td className="py-3.5 px-3 text-right font-black font-mono text-emerald-600 whitespace-nowrap">
                                  ₹{Number(selectedReferralDetailModal.details?.paidAmount || 0).toLocaleString('en-IN')}
                                </td>
                                <td className="py-3.5 px-3 text-right font-black font-mono text-rose-600 whitespace-nowrap">
                                  ₹{Number(selectedReferralDetailModal.details?.pendingAmount ?? selectedReferralDetailModal.referralAmt).toLocaleString('en-IN')}
                                </td>
                                <td className="py-3.5 px-3 text-center whitespace-nowrap">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                    selectedReferralDetailModal.details?.status === 'Completed'
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                                  }`}>
                                    {selectedReferralDetailModal.details?.status || 'Pending'}
                                  </span>
                                </td>
                                <td className="py-3.5 px-3 text-center whitespace-nowrap">
                                  <div className="flex items-center justify-center space-x-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setViewHistoryModal(selectedReferralDetailModal)}
                                      className="px-3 py-1.5 bg-white border border-[#74111d] text-[#74111d] hover:bg-rose-50 font-black rounded-lg text-xs transition cursor-pointer shadow-2xs flex items-center space-x-1"
                                      title="View payment date and history type"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                      <span>View</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setProcessPaymentModal({
                                          isOpen: true,
                                          referral: selectedReferralDetailModal,
                                          amount: selectedReferralDetailModal.details?.pendingAmount ?? selectedReferralDetailModal.referralAmt,
                                          txnNumber: '',
                                          method: 'Bank Transfer (NEFT / RTGS)',
                                          historyType: 'Referral Payout',
                                          payDate: new Date().toLocaleDateString('en-GB') + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                                          notes: ''
                                        });
                                      }}
                                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg text-xs transition cursor-pointer shadow-xs flex items-center space-x-1"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                      <span>Add Payment</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Payment History View Ledger (When I pay date and history type) */}
                      {(() => {
                        const liveRecord = referralsList.find(r => r.id === selectedReferralDetailModal.id || r.userEmail === selectedReferralDetailModal.userEmail) || selectedReferralDetailModal;
                        const logs = (Array.isArray(liveRecord.paymentHistory) && liveRecord.paymentHistory.length > 0)
                          ? liveRecord.paymentHistory
                          : (Number(liveRecord.details?.paidAmount || 0) > 0 ? [
                              {
                                id: `PAY-${liveRecord.id}-01`,
                                payDate: `${liveRecord.details?.referralDate || '20-07-2026'}, 02:30 PM`,
                                historyType: 'Referral Payout',
                                amount: Number(liveRecord.details?.paidAmount),
                                method: 'Bank Transfer (NEFT / RTGS)',
                                txnNumber: `TXN-${liveRecord.id || '9821'}7340`,
                                status: 'Paid',
                                notes: `Payout settlement for referral of ${liveRecord.details?.referredUser?.split('\n')[0] || liveRecord.userName}`
                              }
                            ] : []);

                        return (
                          <div className="pt-2 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <History className="w-4 h-4 text-[#74111d]" />
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                                  Payout & Payment History (When Paid Date & History Type)
                                </h4>
                              </div>
                              <span className="text-[11px] font-bold text-slate-500">
                                {logs.length} Transaction Record{logs.length !== 1 ? 's' : ''}
                              </span>
                            </div>

                            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
                              <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                                  <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-black tracking-wider whitespace-nowrap">
                                      <th className="py-2.5 px-3">#</th>
                                      <th className="py-2.5 px-3">Pay Date & Time</th>
                                      <th className="py-2.5 px-3">History Type</th>
                                      <th className="py-2.5 px-3 text-right">Amount Paid</th>
                                      <th className="py-2.5 px-3">Payment Method</th>
                                      <th className="py-2.5 px-3">Transaction No.</th>
                                      <th className="py-2.5 px-3 text-center">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {logs.length === 0 ? (
                                      <tr>
                                        <td colSpan={7} className="py-6 text-center text-xs text-slate-400 font-bold">
                                          No payment history recorded yet. Click "Add Payment" to disburse referral earnings.
                                        </td>
                                      </tr>
                                    ) : (
                                      logs.map((log, lIdx) => (
                                        <tr key={log.id || lIdx} className="hover:bg-slate-50/70 transition">
                                          <td className="py-2.5 px-3 font-mono font-bold text-slate-400 whitespace-nowrap">
                                            {lIdx + 1}
                                          </td>
                                          <td className="py-2.5 px-3 font-mono font-black text-slate-900 whitespace-nowrap">
                                            {log.payDate}
                                          </td>
                                          <td className="py-2.5 px-3 font-black text-slate-800 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-[#74111d] border border-rose-200 uppercase tracking-wider">
                                              {log.historyType || 'Referral Payout'}
                                            </span>
                                          </td>
                                          <td className="py-2.5 px-3 font-mono font-black text-emerald-600 text-right whitespace-nowrap">
                                            ₹{Number(log.amount).toLocaleString('en-IN')}
                                          </td>
                                          <td className="py-2.5 px-3 font-bold text-slate-700 whitespace-nowrap">
                                            {log.method}
                                          </td>
                                          <td className="py-2.5 px-3 font-mono font-bold text-slate-600 whitespace-nowrap">
                                            {log.txnNumber || 'TXN-98217340'}
                                          </td>
                                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
                                              {log.status || 'Paid'}
                                            </span>
                                          </td>
                                        </tr>
                                      ))
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL: VIEW PAYMENT DATE & HISTORY TYPE */}
              {viewHistoryModal && (() => {
                const liveRecord = referralsList.find(r => r.id === viewHistoryModal.id || r.userEmail === viewHistoryModal.userEmail) || viewHistoryModal;
                const logs = (Array.isArray(liveRecord.paymentHistory) && liveRecord.paymentHistory.length > 0)
                  ? liveRecord.paymentHistory
                  : (Number(liveRecord.details?.paidAmount || 0) > 0 ? [
                      {
                        id: `PAY-${liveRecord.id}-01`,
                        payDate: `${liveRecord.details?.referralDate || '20-07-2026'}, 02:30 PM`,
                        historyType: 'Referral Payout',
                        amount: Number(liveRecord.details?.paidAmount),
                        method: 'Bank Transfer (NEFT / RTGS)',
                        txnNumber: `TXN-${liveRecord.id || '9821'}7340`,
                        status: 'Paid',
                        notes: `Payout settlement for referral of ${liveRecord.details?.referredUser?.split('\n')[0] || liveRecord.userName}`
                      }
                    ] : []);

                return (
                  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 overflow-y-auto">
                    <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden relative my-auto animate-in zoom-in-95">
                      {/* Header */}
                      <div className="bg-[#74111d] text-white px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <History className="w-5 h-5 text-rose-200" />
                          <div>
                            <h3 className="font-black text-sm">Payment History & Pay Date Details</h3>
                            <p className="text-[11px] text-rose-200">
                              {liveRecord.userName || liveRecord.userEmail} ({liveRecord.userEmail})
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setViewHistoryModal(null)}
                          className="text-white hover:text-rose-100 p-1 cursor-pointer transition"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="p-6 space-y-4">
                        {/* Summary Badges */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
                            <span className="text-[10px] uppercase font-black text-slate-500">Total Referral</span>
                            <p className="text-base font-black text-slate-900 font-mono mt-0.5">
                              ₹{Number(liveRecord.details?.totalAmount || liveRecord.referralAmt).toLocaleString('en-IN')}
                            </p>
                          </div>
                          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-center">
                            <span className="text-[10px] uppercase font-black text-emerald-700">Total Paid</span>
                            <p className="text-base font-black text-emerald-700 font-mono mt-0.5">
                              ₹{Number(liveRecord.details?.paidAmount || 0).toLocaleString('en-IN')}
                            </p>
                          </div>
                          <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-center">
                            <span className="text-[10px] uppercase font-black text-rose-700">Pending Amount</span>
                            <p className="text-base font-black text-rose-700 font-mono mt-0.5">
                              ₹{Number(liveRecord.details?.pendingAmount ?? liveRecord.referralAmt).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>

                        {/* Payment History List */}
                        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
                          <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left text-xs border-collapse min-w-[620px]">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-black tracking-wider whitespace-nowrap">
                                  <th className="py-3 px-3">#</th>
                                  <th className="py-3 px-3">Pay Date & Time</th>
                                  <th className="py-3 px-3">History Type</th>
                                  <th className="py-3 px-3 text-right">Amount</th>
                                  <th className="py-3 px-3">Payment Method</th>
                                  <th className="py-3 px-3">Txn Reference</th>
                                  <th className="py-3 px-3 text-center">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {logs.length === 0 ? (
                                  <tr>
                                    <td colSpan={7} className="py-8 text-center text-xs text-slate-400 font-black">
                                      No payment transaction recorded yet.
                                    </td>
                                  </tr>
                                ) : (
                                  logs.map((log, idx) => (
                                    <tr key={log.id || idx} className="hover:bg-slate-50/70 transition">
                                      <td className="py-3 px-3 font-mono font-bold text-slate-400 whitespace-nowrap">
                                        {idx + 1}
                                      </td>
                                      <td className="py-3 px-3 font-mono font-black text-slate-900 whitespace-nowrap">
                                        {log.payDate}
                                      </td>
                                      <td className="py-3 px-3 font-black text-slate-800 whitespace-nowrap">
                                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-[#74111d] border border-rose-200">
                                          {log.historyType || 'Referral Payout'}
                                        </span>
                                      </td>
                                      <td className="py-3 px-3 font-mono font-black text-emerald-600 text-right whitespace-nowrap">
                                        ₹{Number(log.amount).toLocaleString('en-IN')}
                                      </td>
                                      <td className="py-3 px-3 font-bold text-slate-700 whitespace-nowrap">
                                        {log.method}
                                      </td>
                                      <td className="py-3 px-3 font-mono font-bold text-slate-600 whitespace-nowrap">
                                        {log.txnNumber || 'TXN-98217340'}
                                      </td>
                                      <td className="py-3 px-3 text-center whitespace-nowrap">
                                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                                          {log.status || 'Paid'}
                                        </span>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Close button */}
                        <div className="flex justify-end pt-2">
                          <button
                            type="button"
                            onClick={() => setViewHistoryModal(null)}
                            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-black text-xs transition cursor-pointer"
                          >
                            Close History
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* MODAL: PROCESS REFERRAL PAYMENT (Image 3 Exact Layout) */}
              {processPaymentModal.isOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 overflow-y-auto">
                  <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative my-auto">
                    {/* Modal Header */}
                    <div className="bg-[#74111d] text-white px-6 py-3.5 flex items-center justify-between">
                      <h3 className="font-bold text-base">Process Referral Payment</h3>
                      <button
                        type="button"
                        onClick={() => setProcessPaymentModal({ ...processPaymentModal, isOpen: false })}
                        className="text-white hover:text-rose-100 p-1 cursor-pointer transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const pAmt = Number(processPaymentModal.amount) || 0;
                        if (pAmt <= 0) return;

                        const newPaymentEntry = {
                          id: 'PAY-' + Date.now(),
                          payDate: processPaymentModal.payDate || (new Date().toLocaleDateString('en-GB') + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })),
                          historyType: processPaymentModal.historyType || 'Referral Payout',
                          amount: pAmt,
                          method: processPaymentModal.method || 'Bank Transfer (NEFT / RTGS)',
                          txnNumber: processPaymentModal.txnNumber || ('TXN-' + Math.floor(10000000 + Math.random() * 90000000)),
                          status: 'Paid',
                          notes: processPaymentModal.notes || 'Referral payout settlement'
                        };

                        const updated = referralsList.map(item => {
                          if (item.userEmail === processPaymentModal.referral.userEmail) {
                            const prevPaid = Number(item.details?.paidAmount || 0);
                            const prevPending = Number(item.details?.pendingAmount ?? item.referralAmt);
                            const newPaid = prevPaid + pAmt;
                            const newPending = Math.max(0, prevPending - pAmt);
                            const isFullyPaid = newPending === 0;
                            const existingHistory = Array.isArray(item.paymentHistory) ? item.paymentHistory : [];

                            return {
                              ...item,
                              paymentStatus: isFullyPaid ? 'Paid' : 'Eligible',
                              paymentHistory: [newPaymentEntry, ...existingHistory],
                              details: {
                                ...item.details,
                                paidAmount: newPaid,
                                pendingAmount: newPending,
                                userPaymentStatus: isFullyPaid ? 'Paid' : item.details.userPaymentStatus,
                                status: isFullyPaid ? 'Completed' : 'Pending'
                              }
                            };
                          }
                          return item;
                        });

                        setReferralsList(updated);
                        try { localStorage.setItem('loyalqr_admin_referrals', JSON.stringify(updated)); } catch {}

                        if (selectedReferralDetailModal && selectedReferralDetailModal.userEmail === processPaymentModal.referral.userEmail) {
                          const updatedSelected = updated.find(x => x.userEmail === selectedReferralDetailModal.userEmail);
                          if (updatedSelected) setSelectedReferralDetailModal(updatedSelected);
                        }

                        setProcessPaymentModal({ isOpen: false, referral: null, amount: '', txnNumber: '', method: '', notes: '', historyType: 'Referral Payout', payDate: '' });
                        setReferralToast(`Payment of ₹${pAmt.toLocaleString('en-IN')} processed successfully! Txn: ${newPaymentEntry.txnNumber}`);
                        setTimeout(() => setReferralToast(''), 4000);
                      }}
                      className="p-6 space-y-4"
                    >
                      {/* Amount */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Amount (₹):
                        </label>
                        <input
                          type="number"
                          required
                          value={processPaymentModal.amount}
                          onChange={(e) => setProcessPaymentModal({ ...processPaymentModal, amount: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>

                      {/* History / Payout Type */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          History / Payout Type:
                        </label>
                        <select
                          value={processPaymentModal.historyType || 'Referral Payout'}
                          onChange={(e) => setProcessPaymentModal({ ...processPaymentModal, historyType: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-red-600 cursor-pointer"
                        >
                          <option value="Referral Payout">Referral Payout</option>
                          <option value="Commission Settlement">Commission Settlement</option>
                          <option value="Bonus Incentive">Bonus Incentive</option>
                          <option value="Manual Settlement">Manual Settlement</option>
                          <option value="Advance Payout">Advance Payout</option>
                        </select>
                      </div>

                      {/* Pay Date & Time */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Pay Date & Time:
                        </label>
                        <input
                          type="text"
                          value={processPaymentModal.payDate || ''}
                          onChange={(e) => setProcessPaymentModal({ ...processPaymentModal, payDate: e.target.value })}
                          placeholder="e.g. 20-07-2026, 02:45 PM (or leave blank for now)"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>

                      {/* Transaction Number */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Transaction Number:
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Enter transaction/reference number"
                          value={processPaymentModal.txnNumber}
                          onChange={(e) => setProcessPaymentModal({ ...processPaymentModal, txnNumber: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>

                      {/* Payment Method */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Payment Method:
                        </label>
                        <select
                          value={processPaymentModal.method}
                          onChange={(e) => setProcessPaymentModal({ ...processPaymentModal, method: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-red-600 cursor-pointer"
                        >
                          <option value="">Select Method</option>
                          <option value="Bank Transfer (NEFT / RTGS)">Bank Transfer (NEFT / RTGS)</option>
                          <option value="UPI (GPay / PhonePe / Paytm)">UPI (GPay / PhonePe / Paytm)</option>
                          <option value="IMPS Immediate Transfer">IMPS Immediate Transfer</option>
                          <option value="Cheque / Demand Draft">Cheque / Demand Draft</option>
                          <option value="Cash / Direct Handover">Cash / Direct Handover</option>
                        </select>
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Notes (Optional):
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Additional notes about payment"
                          value={processPaymentModal.notes}
                          onChange={(e) => setProcessPaymentModal({ ...processPaymentModal, notes: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-600 resize-none"
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end space-x-2.5 pt-3">
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs font-bold transition cursor-pointer shadow-md"
                        >
                          Process Payment
                        </button>
                        <button
                          type="button"
                          onClick={() => setProcessPaymentModal({ ...processPaymentModal, isOpen: false })}
                          className="px-4 py-2 rounded-xl bg-slate-500 hover:bg-slate-600 text-white text-xs font-bold transition cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* MODAL: ADD NEW REFERRAL */}
              {addReferralModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 overflow-y-auto">
                  <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative my-auto">
                    <div className="bg-[#74111d] text-white px-6 py-3.5 flex items-center justify-between">
                      <h3 className="font-bold text-base">Add New Referral Record</h3>
                      <button
                        type="button"
                        onClick={() => setAddReferralModalOpen(false)}
                        className="text-white hover:text-rose-100 p-1 cursor-pointer transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const newRecord = {
                          id: String(Math.floor(1000 + Math.random() * 9000)),
                          userEmail: newReferralInput.userEmail,
                          userName: newReferralInput.userName || '-',
                          userNumber: newReferralInput.userNumber || '-',
                          referredTo: newReferralInput.referredTo || 'MW - 890',
                          referralAmt: Number(newReferralInput.referralAmt) || 150,
                          refund: 'None',
                          paymentStatus: 'Not Eligible',
                          details: {
                            referredUser: `${newReferralInput.userName || 'New User'}\n${newReferralInput.userEmail}`,
                            referralDate: new Date().toISOString().split('T')[0],
                            userPaymentStatus: 'Not Paid',
                            totalAmount: Number(newReferralInput.referralAmt) || 150,
                            paidAmount: 0,
                            pendingAmount: Number(newReferralInput.referralAmt) || 150,
                            status: 'Pending'
                          }
                        };

                        const updated = [newRecord, ...referralsList];
                        setReferralsList(updated);
                        try { localStorage.setItem('loyalqr_admin_referrals', JSON.stringify(updated)); } catch {}

                        setAddReferralModalOpen(false);
                        setNewReferralInput({ userEmail: '', userName: '', userNumber: '', referredTo: '', referralAmt: 150 });
                        setReferralToast(`New referral added for ${newRecord.userEmail}!`);
                        setTimeout(() => setReferralToast(''), 4000);
                      }}
                      className="p-6 space-y-3"
                    >
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">User Email *</label>
                        <input
                          type="email"
                          required
                          value={newReferralInput.userEmail}
                          onChange={(e) => setNewReferralInput({ ...newReferralInput, userEmail: e.target.value })}
                          placeholder="e.g. user@example.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">User Name</label>
                          <input
                            type="text"
                            value={newReferralInput.userName}
                            onChange={(e) => setNewReferralInput({ ...newReferralInput, userName: e.target.value })}
                            placeholder="e.g. Rahul Sharma"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-600"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">User Phone</label>
                          <input
                            type="text"
                            value={newReferralInput.userNumber}
                            onChange={(e) => setNewReferralInput({ ...newReferralInput, userNumber: e.target.value })}
                            placeholder="e.g. 9876543210"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-600"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Referred To</label>
                          <input
                            type="text"
                            value={newReferralInput.referredTo}
                            onChange={(e) => setNewReferralInput({ ...newReferralInput, referredTo: e.target.value })}
                            placeholder="e.g. MW - 890"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-600"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Referral Amt (₹)</label>
                          <input
                            type="number"
                            value={newReferralInput.referralAmt}
                            onChange={(e) => setNewReferralInput({ ...newReferralInput, referralAmt: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end space-x-2 pt-3">
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl bg-[#74111d] hover:bg-[#5e0c15] text-white text-xs font-bold transition cursor-pointer shadow-md shadow-[#74111d]/20"
                        >
                          Save Referral
                        </button>
                        <button
                          type="button"
                          onClick={() => setAddReferralModalOpen(false)}
                          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ========================================================= */}
        {/* TAB: MANAGE DEALS & COUPONS (Image 4 Exact Layout)        */}
        {/* ========================================================= */}
        {activeTab === 'deals_coupons' && (() => {
          const filteredDeals = platformDeals.filter(d => {
            if (!dealSearch.trim()) return true;
            const q = dealSearch.toLowerCase();
            return (
              d.dealName.toLowerCase().includes(q) ||
              d.couponCode.toLowerCase().includes(q) ||
              d.planName.toLowerCase().includes(q) ||
              d.state.toLowerCase().includes(q)
            );
          });

          return (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Toast */}
              {dealToast && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{dealToast}</span>
                  </div>
                  <button onClick={() => setDealToast('')} className="p-1 hover:text-emerald-950">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Header Bar Matching Image 4 */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setDealCustomerMappingModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#74111d] hover:bg-[#5e0c15] text-white font-bold text-xs transition cursor-pointer shadow-md shadow-[#74111d]/20"
                  >
                    Deal Customer Mapping
                  </button>
                </div>
                <div className="text-center md:text-right">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Deal & Coupons
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Create promotions, bonuses, and state-targeted coupon packages
                  </p>
                </div>
              </div>

              {/* Form: New Deal (Image 4 Exact Match) */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
                <h3 className="text-lg font-black text-slate-900 mb-6 pb-3 border-b border-slate-100 flex items-center space-x-2">
                  <Tag className="w-5 h-5 text-red-600" />
                  <span>New Deal</span>
                </h3>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newDealForm.dealName || !newDealForm.couponCode) return;

                    const discountAmt = Number(newDealForm.discountAmount) || 0;
                    const discountPct = Number(newDealForm.discountPercentage) || 0;

                    if (discountAmt > 0 && discountPct > 0) {
                      setDealToast('Validation error: You can only fill either Discount Amount OR Discount Percentage, not both.');
                      setTimeout(() => setDealToast(''), 4000);
                      return;
                    }

                    if (discountAmt <= 0 && discountPct <= 0) {
                      setDealToast('Validation error: Please enter either a Discount Amount (₹) or a Discount Percentage (%).');
                      setTimeout(() => setDealToast(''), 4000);
                      return;
                    }

                    const created = {
                      id: `deal_${Date.now()}`,
                      ...newDealForm,
                      bonusAmount: Number(newDealForm.bonusAmount) || 0,
                      discountAmount: discountAmt,
                      discountPercentage: discountPct,
                      usedCount: 0,
                      status: 'Active',
                      createdAt: new Date().toISOString().split('T')[0]
                    };

                    const updated = [created, ...platformDeals];
                    setPlatformDeals(updated);
                    try { localStorage.setItem('loyalqr_platform_deals', JSON.stringify(updated)); } catch {}

                    setNewDealForm({
                      planName: 'Standard Plan',
                      state: 'All States (No state restriction)',
                      dealName: '',
                      couponCode: '',
                      bonusAmount: '',
                      discountAmount: '',
                      discountPercentage: '',
                      validityDate: '',
                      maxUsage: 0
                    });

                    setDealToast(`Deal "${created.dealName}" (${created.couponCode}) created and published to merchants!`);
                    setTimeout(() => setDealToast(''), 4000);
                  }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Plan Name */}
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                        Plan Name *
                      </label>
                      <select
                        required
                        value={newDealForm.planName}
                        onChange={(e) => setNewDealForm({ ...newDealForm, planName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-red-600 cursor-pointer"
                      >
                        <option value="Select Plan">Select Plan</option>
                        <option value="All Plans">All Plans (Universal)</option>
                        <option value="Trial Plan">Trial Plan</option>
                        <option value="Standard Plan">Standard Plan</option>
                        <option value="Professional Plan">Professional Plan</option>
                        <option value="Legacy Plan">Legacy Plan</option>
                      </select>
                    </div>

                    {/* State (Optional) */}
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                        State (Optional - State Specific Deal)
                      </label>
                      <select
                        value={newDealForm.state}
                        onChange={(e) => setNewDealForm({ ...newDealForm, state: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-red-600 cursor-pointer"
                      >
                        <option value="All States (No state restriction)">All States (No state restriction)</option>
                        <option value="Delhi NCR">Delhi NCR</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Deal Name */}
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                        Deal Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., New Year Offer"
                        value={newDealForm.dealName}
                        onChange={(e) => setNewDealForm({ ...newDealForm, dealName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>

                    {/* Coupon Code */}
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                        Coupon Code *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="E.G., NEWYEAR2024"
                        value={newDealForm.couponCode}
                        onChange={(e) => setNewDealForm({ ...newDealForm, couponCode: e.target.value.toUpperCase() })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono font-black text-slate-900 uppercase focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      {/* Bonus Amount (For Referrer) */}
                      <div>
                        <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                          Bonus Amount (For Referrer) ₹
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={newDealForm.bonusAmount !== '' ? newDealForm.bonusAmount : ''}
                          placeholder="0"
                          onChange={(e) => setNewDealForm({ ...newDealForm, bonusAmount: e.target.value === '' ? '' : Number(e.target.value) })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>

                      {/* Discount Amount (For Referred User) */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-black uppercase text-slate-700">
                            Discount Amount (₹)
                          </label>
                          {Number(newDealForm.discountPercentage) > 0 && (
                            <span className="text-[10px] text-amber-600 font-black uppercase tracking-tight">Locked</span>
                          )}
                        </div>
                        <input
                          type="number"
                          min={0}
                          disabled={Number(newDealForm.discountPercentage) > 0}
                          value={newDealForm.discountAmount !== '' ? newDealForm.discountAmount : ''}
                          placeholder={Number(newDealForm.discountPercentage) > 0 ? "Disabled (% set)" : "e.g. 500"}
                          onChange={(e) => {
                            const val = e.target.value === '' ? '' : Number(e.target.value);
                            setNewDealForm({
                              ...newDealForm,
                              discountAmount: val,
                              discountPercentage: val ? 0 : newDealForm.discountPercentage
                            });
                          }}
                          className={`w-full border rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                            Number(newDealForm.discountPercentage) > 0
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                              : 'bg-slate-50 border-slate-200 text-slate-900 focus:outline-none focus:border-red-600'
                          }`}
                        />
                      </div>

                      {/* Discount Percentage */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-black uppercase text-slate-700">
                            Discount Percentage (%)
                          </label>
                          {Number(newDealForm.discountAmount) > 0 && (
                            <span className="text-[10px] text-amber-600 font-black uppercase tracking-tight">Locked</span>
                          )}
                        </div>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          disabled={Number(newDealForm.discountAmount) > 0}
                          value={newDealForm.discountPercentage !== '' ? newDealForm.discountPercentage : ''}
                          placeholder={Number(newDealForm.discountAmount) > 0 ? "Disabled (₹ set)" : "e.g. 20"}
                          onChange={(e) => {
                            const val = e.target.value === '' ? '' : Number(e.target.value);
                            setNewDealForm({
                              ...newDealForm,
                              discountPercentage: val,
                              discountAmount: val ? 0 : newDealForm.discountAmount
                            });
                          }}
                          className={`w-full border rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                            Number(newDealForm.discountAmount) > 0
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                              : 'bg-slate-50 border-slate-200 text-slate-900 focus:outline-none focus:border-red-600'
                          }`}
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium italic">
                      * Note: Only one discount type can be filled — either Discount Amount (₹) OR Discount Percentage (%).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Validity Date */}
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                        Validity Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={newDealForm.validityDate}
                        onChange={(e) => setNewDealForm({ ...newDealForm, validityDate: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>

                    {/* Maximum Usage */}
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                        Maximum Usage (0 = Unlimited)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={newDealForm.maxUsage}
                        onChange={(e) => setNewDealForm({ ...newDealForm, maxUsage: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-[#8B0000] hover:bg-[#720000] text-white font-black text-xs transition cursor-pointer shadow-md flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Deal & Coupon</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Created Deals & Coupons List (Show Below In Same Menu as Requested) */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      All Created Deals & Coupons ({filteredDeals.length})
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      These deals automatically appear in the Merchant Dashboard deals section
                    </p>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={dealSearch}
                      onChange={(e) => setDealSearch(e.target.value)}
                      placeholder="Filter deals..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto custom-scrollbar pb-3">
                    <table className="w-full min-w-[1350px] text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-black tracking-wider whitespace-nowrap select-none">
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[140px] text-left">State</th>
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[220px] text-left">Deal Name</th>
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[160px] text-center">Coupon Code</th>
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[140px] text-center">Date Created</th>
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[140px] text-right">Bonus (Referrer)</th>
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[150px] text-right">Discount (User)</th>
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[140px] text-center">Validity Date</th>
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[110px] text-center">Usage</th>
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[160px] text-center">Status</th>
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[110px] text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {filteredDeals.length === 0 ? (
                          <tr>
                            <td colSpan={10} className="py-8 text-center text-xs text-slate-400 font-black">
                              No deals found matching your search.
                            </td>
                          </tr>
                        ) : (
                          filteredDeals.map((deal) => {
                            const isActive = deal.status === 'Active';
                            return (
                              <tr key={deal.id} className="hover:bg-slate-50/80 transition">
                                {/* 1. State */}
                                <td className="py-3.5 px-4 font-bold text-slate-700 whitespace-nowrap text-left text-xs">
                                  {deal.state || 'All'}
                                </td>

                                {/* 2. Deal Name */}
                                <td className="py-3.5 px-4 font-black text-slate-900 whitespace-nowrap text-left text-sm">
                                  {deal.dealName}
                                </td>

                                {/* 3. Coupon Code */}
                                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard?.writeText(deal.couponCode);
                                      setDealToast(`Copied coupon code "${deal.couponCode}"!`);
                                      setTimeout(() => setDealToast(''), 3000);
                                    }}
                                    className="inline-flex items-center space-x-1.5 font-mono text-xs font-black bg-rose-50 text-[#74111d] hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl transition cursor-pointer shadow-2xs"
                                    title="Click to copy coupon code"
                                  >
                                    <span>{deal.couponCode}</span>
                                    <Copy className="w-3 h-3 opacity-60 ml-0.5" />
                                  </button>
                                </td>

                                {/* 4. Date Created */}
                                <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700 text-xs whitespace-nowrap">
                                  {deal.createdAt || '03-07-2026'}
                                </td>

                                {/* 5. Bonus (Referrer) */}
                                <td className="py-3.5 px-4 text-right font-black text-slate-900 text-xs whitespace-nowrap">
                                  {deal.bonusAmount !== undefined && deal.bonusAmount !== '' 
                                    ? (typeof deal.bonusAmount === 'number' ? `₹${deal.bonusAmount.toLocaleString('en-IN')}` : deal.bonusAmount) 
                                    : '₹0'}
                                </td>

                                {/* 6. Discount (User) */}
                                <td className="py-3.5 px-4 text-right font-black text-emerald-700 text-xs whitespace-nowrap">
                                  {Number(deal.discountAmount) > 0 
                                    ? `₹${Number(deal.discountAmount).toLocaleString('en-IN')}` 
                                    : Number(deal.discountPercentage) > 0 
                                      ? `${deal.discountPercentage}% OFF` 
                                      : '-'}
                                </td>

                                {/* 7. Validity Date */}
                                <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700 text-xs whitespace-nowrap">
                                  {deal.validityDate || 'Lifetime'}
                                </td>

                                {/* 8. Usage */}
                                <td className="py-3.5 px-4 text-center font-mono font-black text-slate-900 text-xs whitespace-nowrap">
                                  {deal.maxUsage > 0 ? `${deal.usedCount || 0}/${deal.maxUsage}` : `${deal.usedCount || 0}/∞`}
                                </td>

                                {/* 9. Status (Interactive Toggle Switch: Active = ON, Paused = OFF) */}
                                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                  <div className="flex items-center justify-center space-x-2.5">
                                    <button
                                      type="button"
                                      role="switch"
                                      aria-checked={isActive}
                                      onClick={() => {
                                        const nextStatus = isActive ? 'Paused' : 'Active';
                                        const updated = platformDeals.map(d =>
                                          d.id === deal.id ? { ...d, status: nextStatus } : d
                                        );
                                        setPlatformDeals(updated);
                                        try { localStorage.setItem('loyalqr_platform_deals', JSON.stringify(updated)); } catch {}
                                        setDealToast(`Deal "${deal.dealName}" is now ${nextStatus}`);
                                        setTimeout(() => setDealToast(''), 3000);
                                      }}
                                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shadow-xs ${
                                        isActive ? 'bg-emerald-600' : 'bg-slate-300'
                                      }`}
                                      title={`Click to ${isActive ? 'Pause' : 'Activate'} deal`}
                                    >
                                      <span
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                          isActive ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                      />
                                    </button>
                                    <span className={`text-[11px] font-black uppercase tracking-wider min-w-[50px] text-left ${
                                      isActive ? 'text-emerald-700' : 'text-amber-600'
                                    }`}>
                                      {isActive ? 'Active' : 'Paused'}
                                    </span>
                                  </div>
                                </td>

                                {/* 10. Action: Edit & Delete */}
                                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                  <div className="flex items-center justify-center space-x-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setEditingDealModal({ isOpen: true, deal: { ...deal } })}
                                      className="w-8 h-8 rounded-xl bg-[#74111d] hover:bg-[#5e0c15] text-white flex items-center justify-center transition cursor-pointer shadow-2xs"
                                      title="Edit Deal"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        requestConfirm({
                                          title: 'Delete Deal & Coupon',
                                          message: `Are you sure you want to delete deal "${deal.dealName}" (${deal.couponCode})?`,
                                          confirmText: 'Yes, Delete',
                                          type: 'danger',
                                          onConfirm: () => {
                                            const updated = platformDeals.filter(d => d.id !== deal.id);
                                            setPlatformDeals(updated);
                                            try { localStorage.setItem('loyalqr_platform_deals', JSON.stringify(updated)); } catch {}
                                            setDealToast(`Deal "${deal.dealName}" deleted.`);
                                            setTimeout(() => setDealToast(''), 3000);
                                          }
                                        });
                                      }}
                                      className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-rose-700 text-white flex items-center justify-center transition cursor-pointer shadow-2xs"
                                      title="Delete Deal"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
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

              {/* MODAL: EDIT DEAL (Image 1 Pencil Action) */}
              {editingDealModal.isOpen && editingDealModal.deal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 overflow-y-auto">
                  <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative my-auto p-6 sm:p-7 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <h3 className="text-base font-black text-slate-900">Edit Deal & Coupon</h3>
                        <p className="text-xs text-slate-500">Update promotional settings for {editingDealModal.deal.dealName}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingDealModal({ isOpen: false, deal: null })}
                        className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const editDiscountAmt = Number(editingDealModal.deal.discountAmount) || 0;
                        const editDiscountPct = Number(editingDealModal.deal.discountPercentage) || 0;

                        if (editDiscountAmt > 0 && editDiscountPct > 0) {
                          setDealToast('Validation error: Only one discount type can be filled (₹ Amount OR % Percentage).');
                          setTimeout(() => setDealToast(''), 4000);
                          return;
                        }

                        if (editDiscountAmt <= 0 && editDiscountPct <= 0) {
                          setDealToast('Validation error: Please provide either a Discount Amount (₹) or a Discount Percentage (%).');
                          setTimeout(() => setDealToast(''), 4000);
                          return;
                        }

                        const updatedDeal = {
                          ...editingDealModal.deal,
                          discountAmount: editDiscountAmt,
                          discountPercentage: editDiscountPct,
                          bonusAmount: Number(editingDealModal.deal.bonusAmount) || 0
                        };

                        const updated = platformDeals.map(d =>
                          d.id === editingDealModal.deal.id ? updatedDeal : d
                        );
                        setPlatformDeals(updated);
                        try { localStorage.setItem('loyalqr_platform_deals', JSON.stringify(updated)); } catch {}
                        setDealToast(`Deal "${editingDealModal.deal.dealName}" updated successfully!`);
                        setEditingDealModal({ isOpen: false, deal: null });
                        setTimeout(() => setDealToast(''), 3000);
                      }}
                      className="space-y-3.5 text-xs font-bold"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-700 mb-1 font-black uppercase text-[11px]">Deal Name *</label>
                          <input
                            type="text"
                            required
                            value={editingDealModal.deal.dealName}
                            onChange={(e) => setEditingDealModal({
                              ...editingDealModal,
                              deal: { ...editingDealModal.deal, dealName: e.target.value }
                            })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-600 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 mb-1 font-black uppercase text-[11px]">Coupon Code *</label>
                          <input
                            type="text"
                            required
                            value={editingDealModal.deal.couponCode}
                            onChange={(e) => setEditingDealModal({
                              ...editingDealModal,
                              deal: { ...editingDealModal.deal, couponCode: e.target.value.toUpperCase() }
                            })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-black uppercase focus:outline-none focus:border-red-600"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-700 mb-1 font-black uppercase text-[11px]">Target State</label>
                          <input
                            type="text"
                            value={editingDealModal.deal.state || ''}
                            onChange={(e) => setEditingDealModal({
                              ...editingDealModal,
                              deal: { ...editingDealModal.deal, state: e.target.value }
                            })}
                            placeholder="All States (or specify state)"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-600 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 mb-1 font-black uppercase text-[11px]">Bonus (Referrer) ₹</label>
                          <input
                            type="number"
                            min={0}
                            value={editingDealModal.deal.bonusAmount !== undefined ? editingDealModal.deal.bonusAmount : ''}
                            onChange={(e) => setEditingDealModal({
                              ...editingDealModal,
                              deal: { ...editingDealModal.deal, bonusAmount: e.target.value === '' ? '' : Number(e.target.value) }
                            })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-600 font-bold"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-slate-700 font-black uppercase text-[11px]">Discount (₹)</label>
                              {Number(editingDealModal.deal.discountPercentage) > 0 && (
                                <span className="text-[10px] text-amber-600 font-black uppercase">Locked</span>
                              )}
                            </div>
                            <input
                              type="number"
                              min={0}
                              disabled={Number(editingDealModal.deal.discountPercentage) > 0}
                              value={editingDealModal.deal.discountAmount !== undefined ? editingDealModal.deal.discountAmount : ''}
                              placeholder={Number(editingDealModal.deal.discountPercentage) > 0 ? "Disabled (% set)" : "₹ Amount"}
                              onChange={(e) => {
                                const val = e.target.value === '' ? '' : Number(e.target.value);
                                setEditingDealModal({
                                  ...editingDealModal,
                                  deal: {
                                    ...editingDealModal.deal,
                                    discountAmount: val,
                                    discountPercentage: val ? 0 : editingDealModal.deal.discountPercentage
                                  }
                                });
                              }}
                              className={`w-full border rounded-xl px-3 py-2 text-xs font-bold transition ${
                                Number(editingDealModal.deal.discountPercentage) > 0
                                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:outline-none focus:border-red-600'
                              }`}
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-slate-700 font-black uppercase text-[11px]">Discount (%)</label>
                              {Number(editingDealModal.deal.discountAmount) > 0 && (
                                <span className="text-[10px] text-amber-600 font-black uppercase">Locked</span>
                              )}
                            </div>
                            <input
                              type="number"
                              min={0}
                              max={100}
                              disabled={Number(editingDealModal.deal.discountAmount) > 0}
                              value={editingDealModal.deal.discountPercentage !== undefined ? editingDealModal.deal.discountPercentage : ''}
                              placeholder={Number(editingDealModal.deal.discountAmount) > 0 ? "Disabled (₹ set)" : "% Percentage"}
                              onChange={(e) => {
                                const val = e.target.value === '' ? '' : Number(e.target.value);
                                setEditingDealModal({
                                  ...editingDealModal,
                                  deal: {
                                    ...editingDealModal.deal,
                                    discountPercentage: val,
                                    discountAmount: val ? 0 : editingDealModal.deal.discountAmount
                                  }
                                });
                              }}
                              className={`w-full border rounded-xl px-3 py-2 text-xs font-bold transition ${
                                Number(editingDealModal.deal.discountAmount) > 0
                                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:outline-none focus:border-red-600'
                              }`}
                            />
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-500 italic">
                          * Enter either Discount Amount (₹) OR Discount Percentage (%).
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-700 mb-1 font-black uppercase text-[11px]">Validity Date</label>
                          <input
                            type="text"
                            value={editingDealModal.deal.validityDate || ''}
                            onChange={(e) => setEditingDealModal({
                              ...editingDealModal,
                              deal: { ...editingDealModal.deal, validityDate: e.target.value }
                            })}
                            placeholder="DD-MM-YYYY"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-red-600 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 mb-1 font-black uppercase text-[11px]">Max Usage Limit</label>
                          <input
                            type="number"
                            value={editingDealModal.deal.maxUsage || 0}
                            onChange={(e) => setEditingDealModal({
                              ...editingDealModal,
                              deal: { ...editingDealModal.deal, maxUsage: Number(e.target.value) }
                            })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-600 font-bold"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pt-1">
                        <label className="text-slate-700 font-black uppercase text-[11px]">Status:</label>
                        <select
                          value={editingDealModal.deal.status || 'Active'}
                          onChange={(e) => setEditingDealModal({
                            ...editingDealModal,
                            deal: { ...editingDealModal.deal, status: e.target.value }
                          })}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-black"
                        >
                          <option value="Active">Active</option>
                          <option value="Paused">Paused</option>
                        </select>
                      </div>

                      <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setEditingDealModal({ isOpen: false, deal: null })}
                          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl font-bold text-xs shadow-md shadow-red-600/20 cursor-pointer"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* MODAL: DEAL CUSTOMER MAPPING (Image 4 Button) */}
              {dealCustomerMappingModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 overflow-y-auto">
                  <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden relative my-auto">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-black text-slate-900">Deal Customer Mapping</h3>
                        <p className="text-xs text-slate-500">Live view of customers and merchants mapped to active promotions</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDealCustomerMappingModalOpen(false)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                        {platformDeals.map((deal) => (
                          <div key={deal.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                            <div>
                              <div className="font-black text-xs text-slate-900">{deal.dealName}</div>
                              <div className="font-mono text-[10px] text-red-700 font-bold">{deal.couponCode} • {deal.planName}</div>
                              <div className="text-[10px] text-slate-500 mt-1">State: {deal.state}</div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-black text-emerald-600 block">{deal.usedCount || 0} Redemptions</span>
                              <span className="text-[10px] font-bold text-slate-400">Limit: {deal.maxUsage > 0 ? deal.maxUsage : 'Unlimited'}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={() => setDealCustomerMappingModalOpen(false)}
                          className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ========================================================= */}
        {/* TAB: MANAGE (Feature Permissions & Controls)             */}
        {/* ========================================================= */}
        {activeTab === 'permissions' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Top Sub-Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPermissionsSubTab('merchant_features')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center space-x-2 ${
                    permissionsSubTab === 'merchant_features'
                      ? 'bg-[#74111d] text-white shadow-md shadow-[#74111d]/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Merchant Features</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    permissionsSubTab === 'merchant_features' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {merchantFeatures.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPermissionsSubTab('customer_features')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center space-x-2 ${
                    permissionsSubTab === 'customer_features'
                      ? 'bg-[#74111d] text-white shadow-md shadow-[#74111d]/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Customer Features</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    permissionsSubTab === 'customer_features' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {customerFeatures.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPermissionsSubTab('team_features')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center space-x-2 ${
                    permissionsSubTab === 'team_features'
                      ? 'bg-[#74111d] text-white shadow-md shadow-[#74111d]/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Team Features</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    permissionsSubTab === 'team_features' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {teamFeatures.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPermissionsSubTab('tier_matrix')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center space-x-2 ${
                    permissionsSubTab === 'tier_matrix'
                      ? 'bg-[#74111d] text-white shadow-md shadow-[#74111d]/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Tier Access Matrix</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-400 font-medium">
                Live Dynamic Sync • Instant Enforcement
              </div>
            </div>

            {/* Notification Toast for Features */}
            {featureNotice && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{featureNotice}</span>
                </div>
                <span className="text-[10px] uppercase font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Live in Sync
                </span>
              </div>
            )}

            {/* ========================================================= */}
            {/* SUB-VIEW 1: MERCHANT DASHBOARD FEATURES CONTROL */}
            {/* ========================================================= */}
            {permissionsSubTab === 'merchant_features' && (
              <div className="space-y-6">
                {/* Header Card */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-black">
                        <Sliders className="w-4 h-4" />
                      </div>
                      <h2 className="text-lg font-black text-slate-900">
                        Merchant Dashboard Features Manager
                      </h2>
                    </div>
                    <p className="text-xs text-slate-500 font-medium max-w-3xl">
                      Manage every feature, tab, toggle, and widget of the Merchant Dashboard. Toggle show/hide, edit feature details, create custom features, or delete features. All adjustments take effect immediately on merchant counters.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    <button
                      type="button"
                      onClick={() => handleBulkToggleFeatures(true)}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer border border-emerald-200"
                    >
                      Show All
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBulkToggleFeatures(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer"
                    >
                      Hide All
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddFeatureModalOpen(true)}
                      className="bg-[#74111d] hover:bg-[#5e0c15] text-white font-black px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer shadow-md shadow-[#74111d]/25"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Feature</span>
                    </button>
                  </div>
                </div>

                {/* KPI Metrics Summary Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
                      <span>Total Features</span>
                      <Sliders className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="text-2xl font-black text-slate-900">{merchantFeatures.length}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Configured system tools</div>
                  </div>

                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
                      <span>Visible to Merchants</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-2xl font-black text-emerald-600">
                      {merchantFeatures.filter(f => f.isVisible).length}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Live on merchant app</div>
                  </div>

                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
                      <span>Hidden Features</span>
                      <Ban className="w-4 h-4 text-rose-500" />
                    </div>
                    <div className="text-2xl font-black text-rose-600">
                      {merchantFeatures.filter(f => !f.isVisible).length}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Locked & hidden</div>
                  </div>

                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
                      <span>Custom Admin Tools</span>
                      <Sparkles className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-2xl font-black text-amber-600">
                      {merchantFeatures.filter(f => f.isCustom).length}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Custom extensions</div>
                  </div>
                </div>

                {/* Search & Category Filter Bar */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative flex-1 w-full">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={featureSearchQuery}
                        onChange={(e) => setFeatureSearchQuery(e.target.value)}
                        placeholder="Search feature by name, key (e.g. allow_first_coin), or description..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <select
                        value={featureCategoryFilter}
                        onChange={(e) => setFeatureCategoryFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-red-600"
                      >
                        <option value="ALL">All Categories</option>
                        <option value="Home Dashboard">Home Dashboard</option>
                        <option value="Navigation & Tabs">Navigation & Tabs</option>
                        <option value="Profile & Settings">Profile & Settings</option>
                        <option value="Education & Support">Education & Support</option>
                        <option value="Custom Features">Custom Features</option>
                      </select>

                      <select
                        value={featureStatusFilter}
                        onChange={(e) => setFeatureStatusFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-red-600"
                      >
                        <option value="ALL">All Status</option>
                        <option value="VISIBLE">Visible Only</option>
                        <option value="HIDDEN">Hidden Only</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {merchantFeatures
                    .filter(feat => {
                      if (featureCategoryFilter !== 'ALL' && feat.category !== featureCategoryFilter) return false;
                      if (featureStatusFilter === 'VISIBLE' && !feat.isVisible) return false;
                      if (featureStatusFilter === 'HIDDEN' && feat.isVisible) return false;
                      if (featureSearchQuery.trim()) {
                        const q = featureSearchQuery.toLowerCase();
                        return feat.name.toLowerCase().includes(q) ||
                          feat.id.toLowerCase().includes(q) ||
                          (feat.description && feat.description.toLowerCase().includes(q));
                      }
                      return true;
                    })
                    .map((feat) => (
                      <div
                        key={feat.id}
                        className={`bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 transition ${
                          feat.isVisible
                            ? 'border-slate-200 hover:border-red-300'
                            : 'border-slate-200 bg-slate-50/50 opacity-75'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                              {feat.category}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                              feat.isVisible
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-200 text-slate-600'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${feat.isVisible ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                              <span>{feat.isVisible ? 'SHOW' : 'HIDE'}</span>
                            </span>
                          </div>

                          <div>
                            <h4 className="text-sm font-black text-slate-900 leading-snug">
                              {feat.name}
                            </h4>
                            <span className="text-[10px] font-mono font-bold text-slate-400 block mt-0.5">
                              ID: {feat.id}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            {feat.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          {/* Toggle Switch */}
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleToggleFeatureVisibility(feat.id)}
                              className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                                feat.isVisible ? 'bg-[#74111d] justify-end' : 'bg-slate-300 justify-start'
                              }`}
                              title={feat.isVisible ? 'Click to Hide from Merchant' : 'Click to Show on Merchant'}
                            >
                              <span className="w-4 h-4 bg-white rounded-full shadow-md"></span>
                            </button>
                            <span className="text-[11px] font-bold text-slate-600">
                              {feat.isVisible ? 'Visible' : 'Hidden'}
                            </span>
                          </div>

                          {/* Action Buttons: Edit & Delete */}
                          <div className="flex items-center space-x-1">
                            <button
                              type="button"
                              onClick={() => setEditingFeatureModal({ ...feat })}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                              title="Update Feature"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteFeature(feat.id)}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                              title="Delete Feature"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* SUB-VIEW 2: CUSTOMER PORTAL FEATURES CONTROL              */}
            {/* ========================================================= */}
            {permissionsSubTab === 'customer_features' && (
              <div className="space-y-6">
                {/* Header Card */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-black">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <h2 className="text-lg font-black text-slate-900">
                        Customer Portal Features Manager
                      </h2>
                    </div>
                    <p className="text-xs text-slate-500 font-medium max-w-3xl">
                      Manage every feature, gamification module, redemption flow, and account capability of the customer experience. Toggle visibility, edit feature logic, or create custom customer tools. Changes synchronize live to the customer app.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    <button
                      type="button"
                      onClick={() => handleBulkToggleCustomerFeatures(true)}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer border border-emerald-200"
                    >
                      Show All
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBulkToggleCustomerFeatures(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer"
                    >
                      Hide All
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddCustomerFeatureModalOpen(true)}
                      className="bg-[#74111d] hover:bg-[#5e0c15] text-white font-black px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer shadow-md shadow-[#74111d]/25"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Feature</span>
                    </button>
                  </div>
                </div>

                {/* KPI Metrics Summary Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
                      <span>Total Customer Tools</span>
                      <Smartphone className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="text-2xl font-black text-slate-900">{customerFeatures.length}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Configured app tools</div>
                  </div>

                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
                      <span>Visible to Customers</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-2xl font-black text-emerald-600">
                      {customerFeatures.filter(f => f.isVisible).length}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Live on customer app</div>
                  </div>

                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
                      <span>Hidden Features</span>
                      <Ban className="w-4 h-4 text-rose-500" />
                    </div>
                    <div className="text-2xl font-black text-rose-600">
                      {customerFeatures.filter(f => !f.isVisible).length}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Temporarily locked</div>
                  </div>

                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
                      <span>Custom Features</span>
                      <Sparkles className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-2xl font-black text-amber-600">
                      {customerFeatures.filter(f => f.isCustom).length}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Custom extensions</div>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {customerFeatures.map((feat) => (
                    <div
                      key={feat.id}
                      className={`bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 transition ${
                        feat.isVisible
                          ? 'border-slate-200 hover:border-red-300'
                          : 'border-slate-200 bg-slate-50/50 opacity-75'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block mb-1">
                              {feat.category}
                            </span>
                            <h3 className="font-black text-sm text-slate-900 leading-tight">
                              {feat.name}
                            </h3>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold shrink-0 ${
                            feat.isVisible
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {feat.isVisible ? 'Visible' : 'Hidden'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-normal">
                          {feat.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleToggleCustomerFeature(feat.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                            feat.isVisible
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          {feat.isVisible ? <CheckCircle2 className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{feat.isVisible ? 'Enabled' : 'Disabled'}</span>
                        </button>

                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => setEditingCustomerFeatureModal(feat)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                            title="Edit Feature"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {feat.isCustom && (
                            <button
                              type="button"
                              onClick={() => handleDeleteCustomerFeature(feat.id)}
                              className="p-1.5 rounded-lg text-rose-400 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                              title="Delete Custom Feature"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* SUB-VIEW 3: TEAM PORTAL FEATURES CONTROL                  */}
            {/* ========================================================= */}
            {permissionsSubTab === 'team_features' && (
              <div className="space-y-6">
                {/* Header Card */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-black">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <h2 className="text-lg font-black text-slate-900">
                        Team Dashboard Features Manager
                      </h2>
                    </div>
                    <p className="text-xs text-slate-500 font-medium max-w-3xl">
                      Manage every sales module, lead tracking tool, marketing standee download generator, and field verification capability for the Team Hub. Changes update in real-time for all active specialists.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    <button
                      type="button"
                      onClick={() => handleBulkToggleTeamFeatures(true)}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer border border-emerald-200"
                    >
                      Show All
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBulkToggleTeamFeatures(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer"
                    >
                      Hide All
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddTeamFeatureModalOpen(true)}
                      className="bg-[#74111d] hover:bg-[#5e0c15] text-white font-black px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer shadow-md shadow-[#74111d]/25"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Feature</span>
                    </button>
                  </div>
                </div>

                {/* KPI Metrics Summary Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
                      <span>Total Team Tools</span>
                      <UserCheck className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="text-2xl font-black text-slate-900">{teamFeatures.length}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Configured team tools</div>
                  </div>

                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
                      <span>Visible to Agents</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-2xl font-black text-emerald-600">
                      {teamFeatures.filter(f => f.isVisible).length}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Live on team hub</div>
                  </div>

                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
                      <span>Hidden Features</span>
                      <Ban className="w-4 h-4 text-rose-500" />
                    </div>
                    <div className="text-2xl font-black text-rose-600">
                      {teamFeatures.filter(f => !f.isVisible).length}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Temporarily locked</div>
                  </div>

                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
                      <span>Custom Tools</span>
                      <Sparkles className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-2xl font-black text-amber-600">
                      {teamFeatures.filter(f => f.isCustom).length}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Custom extensions</div>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teamFeatures.map((feat) => (
                    <div
                      key={feat.id}
                      className={`bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 transition ${
                        feat.isVisible
                          ? 'border-slate-200 hover:border-red-300'
                          : 'border-slate-200 bg-slate-50/50 opacity-75'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block mb-1">
                              {feat.category}
                            </span>
                            <h3 className="font-black text-sm text-slate-900 leading-tight">
                              {feat.name}
                            </h3>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold shrink-0 ${
                            feat.isVisible
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {feat.isVisible ? 'Visible' : 'Hidden'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-normal">
                          {feat.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleToggleTeamFeature(feat.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                            feat.isVisible
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          {feat.isVisible ? <CheckCircle2 className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{feat.isVisible ? 'Enabled' : 'Disabled'}</span>
                        </button>

                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => setEditingTeamFeatureModal(feat)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                            title="Edit Feature"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {feat.isCustom && (
                            <button
                              type="button"
                              onClick={() => handleDeleteTeamFeature(feat.id)}
                              className="p-1.5 rounded-lg text-rose-400 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                              title="Delete Custom Feature"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Feature Edit Modal */}
            {editingCustomerFeatureModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-base font-black text-slate-900">Edit Customer Feature</h3>
                    <button
                      onClick={() => setEditingCustomerFeatureModal(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <form onSubmit={handleSaveEditedCustomerFeature} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Feature Name</label>
                      <input
                        type="text"
                        required
                        value={editingCustomerFeatureModal.name}
                        onChange={(e) => setEditingCustomerFeatureModal({ ...editingCustomerFeatureModal, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Category</label>
                      <input
                        type="text"
                        required
                        value={editingCustomerFeatureModal.category}
                        onChange={(e) => setEditingCustomerFeatureModal({ ...editingCustomerFeatureModal, category: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Description</label>
                      <textarea
                        rows={3}
                        required
                        value={editingCustomerFeatureModal.description}
                        onChange={(e) => setEditingCustomerFeatureModal({ ...editingCustomerFeatureModal, description: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setEditingCustomerFeatureModal(null)}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#74111d] hover:bg-[#5c0d16] text-white font-bold"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Customer Feature Add Modal */}
            {addCustomerFeatureModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-base font-black text-slate-900">Add Customer Feature</h3>
                    <button
                      onClick={() => setAddCustomerFeatureModalOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <form onSubmit={handleCreateNewCustomerFeature} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Feature Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Daily Bonus Coins"
                        value={newCustomerFeatureForm.name}
                        onChange={(e) => setNewCustomerFeatureForm({ ...newCustomerFeatureForm, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Category</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Loyalty Rewards"
                        value={newCustomerFeatureForm.category}
                        onChange={(e) => setNewCustomerFeatureForm({ ...newCustomerFeatureForm, category: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Description</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Explain feature functionality..."
                        value={newCustomerFeatureForm.description}
                        onChange={(e) => setNewCustomerFeatureForm({ ...newCustomerFeatureForm, description: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setAddCustomerFeatureModalOpen(false)}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#74111d] hover:bg-[#5c0d16] text-white font-bold"
                      >
                        Create Feature
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Team Feature Edit Modal */}
            {editingTeamFeatureModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-base font-black text-slate-900">Edit Team Feature</h3>
                    <button
                      onClick={() => setEditingTeamFeatureModal(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <form onSubmit={handleSaveEditedTeamFeature} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Feature Name</label>
                      <input
                        type="text"
                        required
                        value={editingTeamFeatureModal.name}
                        onChange={(e) => setEditingTeamFeatureModal({ ...editingTeamFeatureModal, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Category</label>
                      <input
                        type="text"
                        required
                        value={editingTeamFeatureModal.category}
                        onChange={(e) => setEditingTeamFeatureModal({ ...editingTeamFeatureModal, category: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Description</label>
                      <textarea
                        rows={3}
                        required
                        value={editingTeamFeatureModal.description}
                        onChange={(e) => setEditingTeamFeatureModal({ ...editingTeamFeatureModal, description: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setEditingTeamFeatureModal(null)}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#74111d] hover:bg-[#5c0d16] text-white font-bold"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Team Feature Add Modal */}
            {addTeamFeatureModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-base font-black text-slate-900">Add Team Feature</h3>
                    <button
                      onClick={() => setAddTeamFeatureModalOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <form onSubmit={handleCreateNewTeamFeature} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Feature Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Field GPS Verification"
                        value={newTeamFeatureForm.name}
                        onChange={(e) => setNewTeamFeatureForm({ ...newTeamFeatureForm, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Category</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Operations"
                        value={newTeamFeatureForm.category}
                        onChange={(e) => setNewTeamFeatureForm({ ...newTeamFeatureForm, category: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Description</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Explain feature functionality..."
                        value={newTeamFeatureForm.description}
                        onChange={(e) => setNewTeamFeatureForm({ ...newTeamFeatureForm, description: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setAddTeamFeatureModalOpen(false)}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#74111d] hover:bg-[#5c0d16] text-white font-bold"
                      >
                        Create Feature
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* SUB-VIEW 4: PLAN TIER PERMISSIONS MATRIX */}
            {/* ========================================================= */}
            {permissionsSubTab === 'tier_matrix' && (
              <div className="space-y-6">
                {/* Save Confirmation Banner */}
                {permissionNotice && (
                  <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{permissionNotice}</span>
                    </div>
                    <span className="text-[10px] uppercase font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Live in Database
                    </span>
                  </div>
                )}

                {/* Header Card with Save & Reset */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-black">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <h2 className="text-lg font-black text-slate-900">
                        Merchant Feature Permissions & Dashboard Access Matrix
                      </h2>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      Configure which merchant dashboard tools and capabilities are unlocked for businesses based on their Plan Tier and Category. Save directly to MongoDB to apply instantly.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                    <button
                      type="button"
                      onClick={() => handleResetPermissionsTier(permissionPlan)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset {permissionPlan} Defaults</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSavePermissions}
                      className="bg-[#74111d] hover:bg-[#5e0c15] text-white font-black px-5 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer shadow-md shadow-[#74111d]/25"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Permissions to MongoDB</span>
                    </button>
                  </div>
                </div>

            {/* Filter & Tier Selector Controls */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
              {/* Row 1: Plan Tier Selector */}
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 mb-2 tracking-wide">
                  1. Select Plan Tier to Configure Permissions:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'TRIAL', name: 'Free 2-Day Trial', desc: 'Onboarding & Demo' },
                    { id: 'STANDARD', name: 'Standard Plan', desc: 'Annual ₹24,000' },
                    { id: 'PROFESSIONAL', name: 'Professional Plan', desc: '3-Year ₹49,000' },
                    { id: 'LEGACY', name: 'Legacy Lifetime', desc: 'Enterprise Unlimited' }
                  ].map((tier) => {
                    const isSelected = permissionPlan === tier.id;
                    const enabledCount = Object.values(permissionsMatrix[tier.id] || {}).filter(Boolean).length;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setPermissionPlan(tier.id)}
                        className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-red-50/80 border-[#8B0000] ring-2 ring-[#8B0000]/20 shadow-xs'
                            : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/70'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-black ${isSelected ? 'text-[#8B0000]' : 'text-slate-800'}`}>
                              {tier.name}
                            </span>
                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              isSelected ? 'bg-red-100 text-[#8B0000]' : 'bg-slate-200 text-slate-600'
                            }`}>
                              {enabledCount}/{platformFeaturesList.length}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                            {tier.desc}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold mt-2 ${isSelected ? 'text-red-700' : 'text-slate-400'}`}>
                          {isSelected ? '● Currently Editing' : 'Click to configure'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 2: Category Filter & Specific Merchant Filter */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5 tracking-wide">
                    2. Filter by Business Category:
                  </label>
                  <select
                    value={permissionCategory}
                    onChange={(e) => setPermissionCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-red-600"
                  >
                    <option value="ALL">All Business Categories (Default)</option>
                    <option value="CAFE_RESTAURANT">Cafes, Restaurants & Dining</option>
                    <option value="GROCERY">Grocery & Supermarkets</option>
                    <option value="SALON_SPA">Salons, Spas & Wellness</option>
                    <option value="RETAIL">Fashion, Apparel & Retail Shops</option>
                    <option value="OTHER">Other Counter Outlets</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5 tracking-wide">
                    3. Merchant Context Check:
                  </label>
                  <select
                    value={permissionSelectedMerchant}
                    onChange={(e) => setPermissionSelectedMerchant(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-red-600"
                  >
                    <option value="ALL">Apply Universally across all merchants</option>
                    {merchants.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.businessName} ({m.category} • {m.plan})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 12 Platform Features Grid */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-slate-500" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-600">
                    Feature Access Toggles for {permissionPlan} Tier ({Object.values(permissionsMatrix[permissionPlan] || {}).filter(Boolean).length} Unlocked)
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  Click any toggle to lock or unlock in real-time
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {platformFeaturesList.map((feature) => {
                  const isEnabled = Boolean(permissionsMatrix[permissionPlan]?.[feature.id]);
                  return (
                    <div
                      key={feature.id}
                      className={`bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 transition ${
                        isEnabled
                          ? 'border-slate-200 hover:border-red-300'
                          : 'border-slate-200 bg-slate-50/50 opacity-80'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                            {feature.category}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isEnabled
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-200 text-slate-500'
                          }`}>
                            {isEnabled ? 'UNLOCKED' : 'LOCKED'}
                          </span>
                        </div>

                        <h4 className="text-sm font-black text-slate-900 mt-2">
                          {feature.name}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400">
                          Min: {feature.minPlan}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleTogglePermission(feature.id)}
                          className={`p-1.5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer font-bold text-xs ${
                            isEnabled
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                              : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                          }`}
                        >
                          {isEnabled ? (
                            <>
                              <CheckSquare className="w-4 h-4" />
                              <span>Enabled</span>
                            </>
                          ) : (
                            <>
                              <Square className="w-4 h-4" />
                              <span>Disabled</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Save Bar */}
            <div className="bg-slate-900 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/30 text-red-400 flex items-center justify-center font-black">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
                    Permissions Synchronizer
                  </h4>
                  <p className="text-xs text-slate-400">
                    Changes will be enforced immediately on merchant counter login and reward redemption.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSavePermissions}
                className="bg-[#8B0000] hover:bg-[#6b0000] text-white font-black px-6 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition cursor-pointer shadow-md shadow-red-950/40"
              >
                <Save className="w-4 h-4" />
                <span>Save All Permissions to MongoDB</span>
              </button>
            </div>
          </div>
          )}

          {/* ========================================================= */}
          {/* MODAL: EDIT MERCHANT FEATURE */}
          {/* ========================================================= */}
          {editingFeatureModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 animate-in zoom-in-95 duration-150">
                <button 
                  type="button"
                  onClick={() => setEditingFeatureModal(null)}
                  className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-[#74111d] flex items-center justify-center font-black">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Update Feature Details</h3>
                    <p className="text-xs text-slate-500 font-mono">ID: {editingFeatureModal.id}</p>
                  </div>
                </div>

                <form onSubmit={handleSaveEditedFeature} className="space-y-4 text-xs font-bold pt-2">
                  <div>
                    <label className="block uppercase text-slate-600 mb-1">Feature Display Name</label>
                    <input
                      type="text"
                      required
                      value={editingFeatureModal.name}
                      onChange={(e) => setEditingFeatureModal({ ...editingFeatureModal, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block uppercase text-slate-600 mb-1">Category</label>
                      <select
                        value={editingFeatureModal.category}
                        onChange={(e) => setEditingFeatureModal({ ...editingFeatureModal, category: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-red-600"
                      >
                        <option value="Home Dashboard">Home Dashboard</option>
                        <option value="Navigation & Tabs">Navigation & Tabs</option>
                        <option value="Profile & Settings">Profile & Settings</option>
                        <option value="Education & Support">Education & Support</option>
                        <option value="Custom Features">Custom Features</option>
                      </select>
                    </div>

                    <div>
                      <label className="block uppercase text-slate-600 mb-1">Min Required Plan</label>
                      <select
                        value={editingFeatureModal.minPlan}
                        onChange={(e) => setEditingFeatureModal({ ...editingFeatureModal, minPlan: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-red-600"
                      >
                        <option value="All Plans">All Plans (Universal)</option>
                        <option value="Standard">Standard Tier</option>
                        <option value="Pro">Pro / Professional Tier</option>
                        <option value="Legacy">Legacy Lifetime</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block uppercase text-slate-600 mb-1">Feature Description</label>
                    <textarea
                      rows={3}
                      required
                      value={editingFeatureModal.description}
                      onChange={(e) => setEditingFeatureModal({ ...editingFeatureModal, description: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 resize-none font-medium"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div>
                      <span className="text-xs font-black text-slate-900 block">Feature Visibility</span>
                      <span className="text-[10px] text-slate-500 font-medium">Show or hide this item on merchant app</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingFeatureModal({ ...editingFeatureModal, isVisible: !editingFeatureModal.isVisible })}
                      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                        editingFeatureModal.isVisible ? 'bg-[#74111d] justify-end' : 'bg-slate-300 justify-start'
                      }`}
                    >
                      <span className="w-4 h-4 bg-white rounded-full shadow-md"></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingFeatureModal(null)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#74111d] hover:bg-[#5e0c15] text-white font-black transition cursor-pointer shadow-md shadow-[#74111d]/25"
                    >
                      Save Feature Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* MODAL: ADD CUSTOM MERCHANT FEATURE */}
          {/* ========================================================= */}
          {addFeatureModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 animate-in zoom-in-95 duration-150">
                <button 
                  type="button"
                  onClick={() => setAddFeatureModalOpen(false)}
                  className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-[#74111d] flex items-center justify-center font-black">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Add New Merchant Feature</h3>
                    <p className="text-xs text-slate-500">Define a new capability toggle for the Merchant Dashboard</p>
                  </div>
                </div>

                <form onSubmit={handleCreateNewFeature} className="space-y-4 text-xs font-bold pt-2">
                  <div>
                    <label className="block uppercase text-slate-600 mb-1">Feature Key / ID</label>
                    <input
                      type="text"
                      placeholder="e.g. flash_sale_banner (auto-generated if empty)"
                      value={newFeatureForm.id}
                      onChange={(e) => setNewFeatureForm({ ...newFeatureForm, id: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block uppercase text-slate-600 mb-1">Feature Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flash Sales Counter Banner"
                      value={newFeatureForm.name}
                      onChange={(e) => setNewFeatureForm({ ...newFeatureForm, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block uppercase text-slate-600 mb-1">Category</label>
                      <select
                        value={newFeatureForm.category}
                        onChange={(e) => setNewFeatureForm({ ...newFeatureForm, category: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-red-600"
                      >
                        <option value="Home Dashboard">Home Dashboard</option>
                        <option value="Navigation & Tabs">Navigation & Tabs</option>
                        <option value="Profile & Settings">Profile & Settings</option>
                        <option value="Education & Support">Education & Support</option>
                        <option value="Custom Features">Custom Features</option>
                      </select>
                    </div>

                    <div>
                      <label className="block uppercase text-slate-600 mb-1">Min Required Plan</label>
                      <select
                        value={newFeatureForm.minPlan}
                        onChange={(e) => setNewFeatureForm({ ...newFeatureForm, minPlan: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-red-600"
                      >
                        <option value="All Plans">All Plans (Universal)</option>
                        <option value="Standard">Standard Tier</option>
                        <option value="Pro">Pro / Professional Tier</option>
                        <option value="Legacy">Legacy Lifetime</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block uppercase text-slate-600 mb-1">Description <span className="text-red-500">*</span></label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Describe what this feature controls on the merchant dashboard..."
                      value={newFeatureForm.description}
                      onChange={(e) => setNewFeatureForm({ ...newFeatureForm, description: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 resize-none font-medium"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div>
                      <span className="text-xs font-black text-slate-900 block">Default Visibility</span>
                      <span className="text-[10px] text-slate-500 font-medium">Show immediately on Merchant Dashboard</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewFeatureForm({ ...newFeatureForm, isVisible: !newFeatureForm.isVisible })}
                      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                        newFeatureForm.isVisible ? 'bg-[#74111d] justify-end' : 'bg-slate-300 justify-start'
                      }`}
                    >
                      <span className="w-4 h-4 bg-white rounded-full shadow-md"></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setAddFeatureModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#74111d] hover:bg-[#5e0c15] text-white font-black transition cursor-pointer shadow-md shadow-[#74111d]/25"
                    >
                      Create Feature
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
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
                    <table className="w-full min-w-[950px] text-left text-xs border-collapse">
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
                            
                            {/* Status: Active / Deactivated */}
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full inline-block ${
                                  m.status === 'ACTIVE' 
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                                }`}
                              >
                                {m.status === 'ACTIVE' ? 'ACTIVE' : 'DEACTIVATED'}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-slate-500 text-[11px]">{m.lastLogin}</td>
                            
                            {/* Action: Edit, Reset Password, Activate/Deactivate, Delete */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end space-x-1.5">
                                {/* 1. Edit Team Member */}
                                <button
                                  type="button"
                                  onClick={() => setEditTeamMemberModal({
                                    isOpen: true,
                                    member: m,
                                    form: {
                                      name: m.name || '',
                                      email: m.email || '',
                                      mobile: m.mobile || '',
                                      district: m.district || '',
                                      state: m.state || '',
                                      role: m.role || 'FIELD_AGENT',
                                      mwId: m.mwId || ''
                                    }
                                  })}
                                  className="p-1.5 rounded-lg text-slate-600 hover:text-[#74111d] hover:bg-rose-50 transition cursor-pointer"
                                  title="Edit Team Member Details"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                {/* 2. Reset Password */}
                                <button
                                  type="button"
                                  onClick={() => setResetPasswordModal({
                                    isOpen: true,
                                    member: m,
                                    newPassword: `BX@${Math.floor(100000 + Math.random() * 900000)}`
                                  })}
                                  className="p-1.5 rounded-lg text-amber-600 hover:text-amber-800 hover:bg-amber-50 transition cursor-pointer"
                                  title="Reset Member Password"
                                >
                                  <Key className="w-3.5 h-3.5" />
                                </button>

                                {/* 3. Activate / Deactivate Toggle */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleTeamStatus(m.userId)}
                                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                                    m.status === 'ACTIVE'
                                      ? 'text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50'
                                      : 'text-rose-600 hover:text-rose-800 hover:bg-rose-50'
                                  }`}
                                  title={m.status === 'ACTIVE' ? 'Deactivate Member' : 'Activate Member'}
                                >
                                  {m.status === 'ACTIVE' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                                </button>

                                {/* 4. Delete Member */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTeamMember(m.userId)}
                                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                                  title="Remove Member"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* MODAL 1: EDIT TEAM MEMBER */}
                {editTeamMemberModal.isOpen && editTeamMemberModal.member && (
                  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 overflow-y-auto">
                    <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative my-auto p-6 sm:p-7 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                          <h3 className="text-base font-black text-slate-900">Edit Team Member</h3>
                          <p className="text-xs text-slate-500">Update account credentials and territory for ID #{editTeamMemberModal.member.userId}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditTeamMemberModal({ isOpen: false, member: null, form: { name: '', email: '', mobile: '', district: '', state: '', role: '', mwId: '' } })}
                          className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveEditTeamMember} className="space-y-3.5 text-xs font-bold">
                        <div>
                          <label className="block text-slate-700 mb-1">Member Name *</label>
                          <input
                            type="text"
                            required
                            value={editTeamMemberModal.form.name}
                            onChange={(e) => setEditTeamMemberModal({
                              ...editTeamMemberModal,
                              form: { ...editTeamMemberModal.form, name: e.target.value }
                            })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-red-600"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-700 mb-1">Email ID *</label>
                            <input
                              type="email"
                              required
                              value={editTeamMemberModal.form.email}
                              onChange={(e) => setEditTeamMemberModal({
                                ...editTeamMemberModal,
                                form: { ...editTeamMemberModal.form, email: e.target.value }
                              })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-red-600"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-700 mb-1">Mobile Number</label>
                            <input
                              type="tel"
                              value={editTeamMemberModal.form.mobile}
                              onChange={(e) => setEditTeamMemberModal({
                                ...editTeamMemberModal,
                                form: { ...editTeamMemberModal.form, mobile: e.target.value }
                              })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-red-600"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-700 mb-1">District</label>
                            <input
                              type="text"
                              value={editTeamMemberModal.form.district}
                              onChange={(e) => setEditTeamMemberModal({
                                ...editTeamMemberModal,
                                form: { ...editTeamMemberModal.form, district: e.target.value }
                              })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-red-600"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-700 mb-1">State</label>
                            <input
                              type="text"
                              value={editTeamMemberModal.form.state}
                              onChange={(e) => setEditTeamMemberModal({
                                ...editTeamMemberModal,
                                form: { ...editTeamMemberModal.form, state: e.target.value }
                              })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-red-600"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => setEditTeamMemberModal({ isOpen: false, member: null, form: { name: '', email: '', mobile: '', district: '', state: '', role: '', mwId: '' } })}
                            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl font-bold text-xs shadow-md shadow-red-600/20 cursor-pointer"
                          >
                            Save Changes
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* MODAL 2: RESET PASSWORD */}
                {resetPasswordModal.isOpen && resetPasswordModal.member && (
                  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 overflow-y-auto">
                    <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative my-auto p-6 sm:p-7 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                            <Key className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-black text-slate-900">Reset Member Password</h3>
                            <p className="text-xs text-slate-500">For {resetPasswordModal.member.name} ({resetPasswordModal.member.email})</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setResetPasswordModal({ isOpen: false, member: null, newPassword: '' })}
                          className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <form onSubmit={handleResetTeamPassword} className="space-y-4 text-xs font-bold">
                        <div>
                          <label className="block text-slate-700 mb-1">New Password *</label>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              required
                              value={resetPasswordModal.newPassword}
                              onChange={(e) => setResetPasswordModal({ ...resetPasswordModal, newPassword: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-amber-500"
                            />
                            <button
                              type="button"
                              onClick={() => setResetPasswordModal({
                                ...resetPasswordModal,
                                newPassword: `BX@${Math.floor(100000 + Math.random() * 900000)}`
                              })}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2.5 rounded-xl text-xs font-bold shrink-0 cursor-pointer"
                              title="Generate random password"
                            >
                              Generate
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-400 font-normal mt-1.5">
                            Saving will update their login credential immediately and copy the new password to your clipboard.
                          </p>
                        </div>

                        <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => setResetPasswordModal({ isOpen: false, member: null, newPassword: '' })}
                            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-xl font-bold text-xs shadow-md shadow-amber-600/20 cursor-pointer"
                          >
                            Reset & Copy Password
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB: CUSTOMER CRM & LIVE TELEMETRY */}
            {activeTab === 'customers' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* 4 Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center justify-between group hover:shadow-md transition">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Customers</p>
                      <h3 className="text-2xl font-black text-slate-900 mt-1">{customers.length}</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">Registered consumer accounts</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center justify-between group hover:shadow-md transition">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Customers</p>
                      <h3 className="text-2xl font-black text-emerald-700 mt-1">
                        {customers.filter(c => c.isActive !== false).length}
                      </h3>
                      <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Full wallet & login access</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center justify-between group hover:shadow-md transition">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Suspended Accounts</p>
                      <h3 className="text-2xl font-black text-rose-600 mt-1">
                        {customers.filter(c => c.isActive === false).length}
                      </h3>
                      <p className="text-[11px] text-rose-500 font-semibold mt-0.5">Login & OTP locked</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center font-black shadow-md shadow-red-500/25 group-hover:scale-105 transition-transform">
                      <Ban className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center justify-between group hover:shadow-md transition">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Telemetry</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <h3 className="text-lg font-black text-slate-900">Real-Time Sync</h3>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Live signups & login tracker</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center font-black shadow-md shadow-violet-500/25 group-hover:scale-105 transition-transform">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Main Customer CRM Card (Exact SuperAdmin Merchants Design System) */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                  {/* Toolbar & Filters (Exact SuperAdmin Merchants System) */}
                  <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-slate-50/50">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 mr-1">
                        <Filter className="w-3.5 h-3.5 text-slate-400" />
                        <span>Filter:</span>
                      </div>

                      <div className="flex items-center space-x-1 bg-white border border-slate-200 p-0.5 rounded-xl shadow-2xs">
                        {[
                          { id: 'ALL', label: 'All Customers' },
                          { id: 'ACTIVE', label: 'Active Only' },
                          { id: 'SUSPENDED', label: 'Suspended' }
                        ].map(cf => (
                          <button
                            key={cf.id}
                            onClick={() => setCustomerFilter(cf.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                              customerFilter === cf.id
                                ? 'bg-slate-900 text-white font-black shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {cf.label}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => { setCustomerFilter('ALL'); setSearchCustomer(''); }}
                        className="bg-white hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-600 flex items-center space-x-1 transition cursor-pointer shadow-2xs"
                        title="Reset all filters"
                      >
                        <RotateCcw className="w-3 h-3 text-slate-400" />
                        <span>Reset</span>
                      </button>

                      <button
                        onClick={fetchCustomers}
                        className="bg-white hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-600 flex items-center space-x-1.5 transition cursor-pointer shadow-2xs"
                        title="Pull live customer telemetry from database"
                      >
                        <RefreshCw className="w-3 h-3 text-slate-400" />
                        <span>Refresh Telemetry</span>
                      </button>
                    </div>

                    <div className="relative w-full lg:w-72">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search customer, phone, store..."
                        value={searchCustomer}
                        onChange={(e) => setSearchCustomer(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 shadow-2xs font-bold"
                      />
                    </div>
                  </div>

                  {/* Table with Exact SuperAdmin Merchants Columns & Horizontal Scrollbar */}
                  <div className="overflow-x-auto custom-scrollbar pb-3">
                    <table className="w-full min-w-[1450px] text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-black tracking-wider whitespace-nowrap select-none">
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[220px]">Customer</th>
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[190px]">Mobile & Email</th>
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[210px]">Favorite Store</th>
                          <th className="py-3.5 px-4 whitespace-nowrap text-center min-w-[120px]">Visits</th>
                          <th className="py-3.5 px-4 whitespace-nowrap text-center min-w-[140px]">Tier & Points</th>
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[150px]">Registered On</th>
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[200px]">Last Login / Active</th>
                          <th className="py-3.5 px-4 whitespace-nowrap text-center min-w-[130px]">Account Status</th>
                          <th className="py-3.5 px-4 whitespace-nowrap text-center min-w-[170px]">Access Control</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredCustomers.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="py-12 text-center text-xs text-slate-400 font-black">
                              No customer records found matching your filters.
                            </td>
                          </tr>
                        ) : (
                          filteredCustomers.map((c) => {
                            const isSuspended = c.isActive === false;
                            const rawDate = c.createdAt;
                            const dt = rawDate ? new Date(rawDate) : null;
                            const formattedRegisteredOn = dt && !isNaN(dt.getTime())
                              ? `${dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`
                              : (c.createdAt || '07 Oct 2026');

                            const formattedLastLogin = c.lastLoginAt || c.lastVisit || '07 Oct 2026, 09:19 PM';

                            return (
                              <tr key={c.id || c._id} className="hover:bg-slate-50/80 transition">
                                {/* Customer Name & ID */}
                                <td className="py-3.5 px-4 whitespace-nowrap">
                                  <div className="font-extrabold text-slate-900 flex items-center space-x-1.5 whitespace-nowrap">
                                    <span className="font-black text-sm">{c.name || 'Valued Customer'}</span>
                                  </div>
                                  <div className="text-[11px] text-slate-400 font-mono font-bold mt-0.5 whitespace-nowrap">
                                    {c.customerId || ('BX-' + String(c.id || c._id || '0000').slice(-6).toUpperCase())}
                                  </div>
                                </td>

                                {/* Mobile & Email */}
                                <td className="py-3.5 px-4 whitespace-nowrap">
                                  <div className="font-mono font-black text-slate-900 text-xs whitespace-nowrap flex items-center space-x-1.5">
                                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span>{c.mobile || '—'}</span>
                                  </div>
                                  {c.email && (
                                    <div className="font-bold text-slate-600 text-[11px] truncate mt-0.5 whitespace-nowrap flex items-center space-x-1.5" title={c.email}>
                                      <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                      <span>{c.email}</span>
                                    </div>
                                  )}
                                </td>

                                {/* Favorite Store */}
                                <td className="py-3.5 px-4 whitespace-nowrap">
                                  <div className="font-black text-slate-900 text-xs whitespace-nowrap flex items-center space-x-1.5">
                                    <Store className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span>{c.favoriteStore || 'Ka-feen Coffee Shop'}</span>
                                  </div>
                                </td>

                                {/* Visits */}
                                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                  <span className="bg-red-50 text-red-700 font-black px-3 py-1 rounded-xl border border-red-200 text-xs whitespace-nowrap inline-flex items-center space-x-1 shadow-2xs">
                                    <span>{c.totalVisits || 1}</span>
                                    <span className="text-[10px] uppercase font-bold">visits</span>
                                  </span>
                                </td>

                                {/* Tier & Points */}
                                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                  <div className="font-black text-emerald-700 text-xs whitespace-nowrap">
                                    {c.points || 100} PTS
                                  </div>
                                  <div className="font-bold text-slate-500 text-[11px] mt-0.5 whitespace-nowrap">
                                    {c.tier || 'Bronze Member'}
                                  </div>
                                </td>

                                {/* Registered On */}
                                <td className="py-3.5 px-4 font-mono font-bold text-slate-700 text-xs whitespace-nowrap">
                                  {formattedRegisteredOn}
                                </td>

                                {/* Last Login / Active */}
                                <td className="py-3.5 px-4 font-mono font-bold text-slate-800 text-xs whitespace-nowrap">
                                  <div className="inline-flex items-center space-x-1.5 whitespace-nowrap">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                                    <span className="whitespace-nowrap">{formattedLastLogin}</span>
                                  </div>
                                </td>

                                {/* Account Status */}
                                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                  {isSuspended ? (
                                    <span className="inline-flex items-center space-x-1.5 bg-rose-50 text-rose-700 border border-rose-300 font-black px-3 py-1 rounded-xl text-xs whitespace-nowrap shadow-2xs">
                                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                                      <span>Suspended</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 font-black px-3 py-1 rounded-xl text-xs whitespace-nowrap shadow-2xs">
                                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                                      <span>Active</span>
                                    </span>
                                  )}
                                </td>

                                {/* Access Control */}
                                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                  <div className="inline-flex items-center space-x-2 whitespace-nowrap">
                                    {isSuspended ? (
                                      <button
                                        onClick={() => handleToggleCustomerStatus(c.id || c._id, false)}
                                        className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-black uppercase px-3 py-1.5 rounded-xl transition cursor-pointer inline-flex items-center space-x-1.5 shadow-2xs whitespace-nowrap"
                                        title="Reactivate customer access"
                                      >
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span>Reactivate</span>
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleToggleCustomerStatus(c.id || c._id, true)}
                                        className="bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 text-xs font-black uppercase px-3 py-1.5 rounded-xl transition cursor-pointer inline-flex items-center space-x-1.5 shadow-2xs whitespace-nowrap"
                                        title="Suspend customer account (locks login & OTP)"
                                      >
                                        <Ban className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                        <span>Suspend</span>
                                      </button>
                                    )}

                                    <button
                                      onClick={() => handleDeleteCustomer(c.id || c._id, c.name)}
                                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl transition cursor-pointer inline-flex items-center justify-center shadow-2xs"
                                      title="Delete Customer Record"
                                    >
                                      <Trash2 className="w-4 h-4 shrink-0" />
                                    </button>
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
                    <span>Add Custom API Key</span>
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
                      {config.razorpayKeyId && config.razorpayKeyId !== 'rzp_live_9a8B7c6D5e4F3g' && !config.razorpayKeyId.startsWith('rzp_live_9a8B7c') ? (
                        <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>🟢 Live Razorpay Online</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                          🟡 Demo Mode Active (Instant Activation)
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500">
                      When keys are entered, real Razorpay checkout opens for UPI (GPay/PhonePe), QR code & Cards. When left blank/demo, system provides instant 1-click subscription simulation so testing never breaks.
                    </p>

                    {/* Razorpay */}
                    <div className="space-y-2">
                      <span className="text-xs font-black text-slate-700">1. Razorpay Gateway</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Razorpay Key ID</label>
                          <input
                            type="text"
                            value={config.razorpayKeyId || ''}
                            onChange={(e) => setConfig({ ...config, razorpayKeyId: e.target.value })}
                            placeholder="rzp_test_... or rzp_live_..."
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Razorpay Key Secret</label>
                          <div className="relative">
                            <input
                              type={showSecret ? 'text' : 'password'}
                              value={config.razorpayKeySecret || ''}
                              onChange={(e) => setConfig({ ...config, razorpayKeySecret: e.target.value })}
                              placeholder="Your secret key"
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

                  {/* 2. SMS Gateway & Telephony (Fast2SMS, MSG91, Twilio) */}
                  <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/60 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 font-black text-slate-900 text-sm">
                        <Smartphone className="w-4 h-4 text-[#74111d]" />
                        <span>SMS OTP Gateway (DLT Certified)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {config.smsApiKey && config.smsApiKey !== 'sms_live_key_9182736450' ? (
                          <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>🟢 Live SMS Active</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                            🟡 Dev Console Fallback
                          </span>
                        )}
                        <select
                          value={config.smsProvider || 'FAST2SMS'}
                          onChange={(e) => setConfig({ ...config, smsProvider: e.target.value })}
                          className="bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
                        >
                          <option value="FAST2SMS">Fast2SMS (India)</option>
                          <option value="MSG91">MSG91 (India DLT)</option>
                          <option value="TWILIO">Twilio (Global)</option>
                        </select>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      When your API key is saved, real SMS OTPs arrive on customer & merchant phones. When blank, OTP is printed to the terminal console so testing always works.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">SMS API Key / Auth Token</label>
                        <input
                          type="password"
                          value={config.smsApiKey || ''}
                          onChange={(e) => setConfig({ ...config, smsApiKey: e.target.value })}
                          placeholder="Paste Fast2SMS or MSG91 API Key"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">DLT Sender ID / Header</label>
                        <input
                          type="text"
                          maxLength={6}
                          value={config.smsSenderId || ''}
                          onChange={(e) => setConfig({ ...config, smsSenderId: e.target.value })}
                          placeholder="BEAURE"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                    </div>

                    {/* Quick Test SMS Tool */}
                    <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                      <span className="text-[11px] font-bold text-slate-700 uppercase flex items-center space-x-1">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>Instant SMS Gateway Delivery Test</span>
                      </span>
                      <div className="flex gap-2">
                        <input
                          type="tel"
                          maxLength={10}
                          value={testSmsMobile}
                          onChange={(e) => setTestSmsMobile(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="Enter 10-digit mobile to test real SMS"
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-red-600"
                        />
                        <button
                          type="button"
                          disabled={testSmsLoading || !testSmsMobile}
                          onClick={handleTestSms}
                          className="bg-[#74111d] hover:bg-[#5a0c16] text-white text-xs font-black px-4 py-1.5 rounded-xl transition cursor-pointer disabled:opacity-50 shrink-0"
                        >
                          {testSmsLoading ? 'Sending...' : 'Send Test SMS'}
                        </button>
                      </div>
                      {testSmsResult && (
                        <p className={`text-[11px] font-bold ${testSmsResult.startsWith('✅') ? 'text-emerald-700' : 'text-red-600'}`}>
                          {testSmsResult}
                        </p>
                      )}
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

                  {/* 4. Email Notifications (SMTP / Gmail / SendGrid) */}
                  <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/60 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 font-black text-slate-900 text-sm">
                        <Mail className="w-4 h-4 text-[#74111d]" />
                        <span>Email & SMTP Notifications (Gmail / SendGrid / Custom SMTP)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {config.smtpHost && config.smtpUser ? (
                          <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>🟢 Live SMTP Active</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                            🟡 Dev Console Fallback
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      When SMTP host & credentials are configured, real welcome & invoice emails are dispatched. When left empty, outgoing emails are safely logged to the server terminal.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">SMTP Host</label>
                        <input
                          type="text"
                          value={config.smtpHost || ''}
                          onChange={(e) => setConfig({ ...config, smtpHost: e.target.value })}
                          placeholder="smtp.gmail.com"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">SMTP Port</label>
                        <input
                          type="number"
                          value={config.smtpPort || 587}
                          onChange={(e) => setConfig({ ...config, smtpPort: Number(e.target.value) })}
                          placeholder="587 or 465"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">SSL/TLS Mode</label>
                        <select
                          value={config.smtpSecure ? 'true' : 'false'}
                          onChange={(e) => setConfig({ ...config, smtpSecure: e.target.value === 'true' })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                        >
                          <option value="false">STARTTLS (Port 587 / Recommended)</option>
                          <option value="true">Direct SSL (Port 465)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">SMTP Username / Email</label>
                        <input
                          type="email"
                          value={config.smtpUser || ''}
                          onChange={(e) => setConfig({ ...config, smtpUser: e.target.value })}
                          placeholder="your-email@gmail.com"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">SMTP Password / App Password</label>
                        <input
                          type="password"
                          value={config.smtpPass || ''}
                          onChange={(e) => setConfig({ ...config, smtpPass: e.target.value })}
                          placeholder="16-character App Password"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Sender Email / From Header</label>
                        <input
                          type="text"
                          value={config.smtpFrom || ''}
                          onChange={(e) => setConfig({ ...config, smtpFrom: e.target.value })}
                          placeholder="BeAurex Loyalty <notifications@beaurex.com>"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Alternative API Key (Resend / SendGrid)</label>
                        <input
                          type="password"
                          value={config.emailApiKey || ''}
                          onChange={(e) => setConfig({ ...config, emailApiKey: e.target.value })}
                          placeholder="re_live_... or SG..."
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                    </div>

                    {/* Quick Test Email Tool */}
                    <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                      <span className="text-[11px] font-bold text-slate-700 uppercase flex items-center space-x-1">
                        <Zap className="w-3.5 h-3.5 text-[#74111d]" />
                        <span>Instant SMTP Mail Server Delivery Test</span>
                      </span>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={testEmailAddr}
                          onChange={(e) => setTestEmailAddr(e.target.value)}
                          placeholder="Enter recipient email to test delivery"
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-red-600"
                        />
                        <button
                          type="button"
                          disabled={testEmailLoading || !testEmailAddr}
                          onClick={handleTestEmail}
                          className="bg-[#74111d] hover:bg-[#5e0c15] text-white text-xs font-black px-4 py-1.5 rounded-xl transition cursor-pointer disabled:opacity-50 shrink-0"
                        >
                          {testEmailLoading ? 'Testing...' : 'Send Test Email'}
                        </button>
                      </div>
                      {testEmailResult && (
                        <p className={`text-[11px] font-bold ${testEmailResult.startsWith('✅') ? 'text-emerald-700' : 'text-red-600'}`}>
                          {testEmailResult}
                        </p>
                      )}
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
                        value={config.mongoUri || ''}
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

            {/* ========================================================= */}
            {/* TAB: SETTINGS (Exact Match to Reference Image 2)          */}
            {/* ========================================================= */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                
                {/* Header Section */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Settings Modules
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                      Manage all platform settings, legal disclosures, terms of service, and frequently asked questions.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => { setActiveTab('policy_editor'); setPolicySubTab('privacy'); }}
                      className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition flex items-center space-x-2 cursor-pointer shadow-xs"
                    >
                      <FileText className="w-4 h-4 text-rose-600" />
                      <span>Policy Editor</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('faq_editor')}
                      className="px-4 py-2.5 rounded-xl bg-rose-50 text-[#74111d] hover:bg-rose-100 border border-rose-200 text-xs font-bold transition flex items-center space-x-2 cursor-pointer shadow-xs"
                    >
                      <HelpCircle className="w-4 h-4 text-[#74111d]" />
                      <span>FAQ Editor</span>
                    </button>
                  </div>
                </div>

                {/* Settings Toast */}
                {settingsToast && (
                  <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{settingsToast}</span>
                    </div>
                    <button onClick={() => setSettingsToast('')} className="text-emerald-700 hover:text-emerald-900 cursor-pointer p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Settings Modules Grid (3 cols on desktop, 2 on tablet, 1 on mobile) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                  {/* 1. Platform Module */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
                    <div>
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                          <Store className="w-6 h-6 text-[#74111d]" />
                        </div>
                        <div>
                          <h3 className="font-black text-base text-slate-900">Platform</h3>
                          <p className="text-xs text-slate-500 font-normal leading-relaxed mt-1">
                            Manage platform name, logo, contact details and business information.
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-medium">Status</span>
                          <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full text-[11px] border border-emerald-200">
                            Completed
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-medium">Last Updated</span>
                          <span className="font-semibold text-slate-700 text-[11px]">{platformSettings.lastUpdated}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSettingsActiveModal('platform')}
                      className="mt-6 w-full py-2.5 px-4 rounded-xl border border-red-500 text-red-600 hover:bg-red-50 font-bold text-xs transition cursor-pointer text-center"
                    >
                      Manage
                    </button>
                  </div>

                  {/* 2. Contact Module */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
                    <div>
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                          <Phone className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="font-black text-base text-slate-900">Contact</h3>
                          <p className="text-xs text-slate-500 font-normal leading-relaxed mt-1">
                            Manage support email, phone number, address and social media links.
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-medium">Status</span>
                          <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full text-[11px] border border-emerald-200">
                            Completed
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-medium">Last Updated</span>
                          <span className="font-semibold text-slate-700 text-[11px]">{contactSettings.lastUpdated}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSettingsActiveModal('contact')}
                      className="mt-6 w-full py-2.5 px-4 rounded-xl border border-red-500 text-red-600 hover:bg-red-50 font-bold text-xs transition cursor-pointer text-center"
                    >
                      Manage
                    </button>
                  </div>

                  {/* 3. Brand Module */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
                    <div>
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                          <Palette className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-black text-base text-slate-900">Brand</h3>
                          <p className="text-xs text-slate-500 font-normal leading-relaxed mt-1">
                            Manage platform logo, favicon and primary & secondary brand colors.
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-medium">Status</span>
                          <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full text-[11px] border border-emerald-200">
                            Completed
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-medium">Last Updated</span>
                          <span className="font-semibold text-slate-700 text-[11px]">{brandSettings.lastUpdated}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSettingsActiveModal('brand')}
                      className="mt-6 w-full py-2.5 px-4 rounded-xl border border-red-500 text-red-600 hover:bg-red-50 font-bold text-xs transition cursor-pointer text-center"
                    >
                      Manage
                    </button>
                  </div>

                  {/* 4. FAQ Module */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
                    <div>
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                          <HelpCircle className="w-6 h-6 text-[#74111d]" />
                        </div>
                        <div>
                          <h3 className="font-black text-base text-slate-900">FAQ</h3>
                          <p className="text-xs text-slate-500 font-normal leading-relaxed mt-1">
                            Manage frequently asked questions displayed to merchants and customers.
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-medium">Total FAQs</span>
                          <span className="font-bold text-slate-900 text-xs">{faqMeta.totalFaqs || faqList.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-medium">Last Updated</span>
                          <span className="font-semibold text-slate-700 text-[11px]">{faqMeta.lastUpdated}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('faq_editor')}
                      className="mt-6 w-full py-2.5 px-4 rounded-xl border border-red-500 text-red-600 hover:bg-red-50 font-bold text-xs transition cursor-pointer text-center"
                    >
                      Manage
                    </button>
                  </div>

                  {/* 5. Privacy Policy Module */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
                    <div>
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-6 h-6 text-rose-600" />
                        </div>
                        <div>
                          <h3 className="font-black text-base text-slate-900">Privacy Policy</h3>
                          <p className="text-xs text-slate-500 font-normal leading-relaxed mt-1">
                            Manage the privacy policy content and keep users informed.
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-medium">Last Updated</span>
                          <span className="font-semibold text-slate-700 text-[11px]">{privacyPolicyData.lastUpdated}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-medium">Version</span>
                          <span className="font-bold text-slate-900 text-xs">{privacyPolicyData.version}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => { setActiveTab('policy_editor'); setPolicySubTab('privacy'); }}
                      className="mt-6 w-full py-2.5 px-4 rounded-xl border border-red-500 text-red-600 hover:bg-red-50 font-bold text-xs transition cursor-pointer text-center"
                    >
                      Manage
                    </button>
                  </div>

                  {/* 6. Terms & Conditions Module */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
                    <div>
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                          <FileText className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-black text-base text-slate-900">Terms & Conditions</h3>
                          <p className="text-xs text-slate-500 font-normal leading-relaxed mt-1">
                            Manage terms & conditions content and platform usage policies.
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-medium">Last Updated</span>
                          <span className="font-semibold text-slate-700 text-[11px]">{termsData.lastUpdated}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-medium">Version</span>
                          <span className="font-bold text-slate-900 text-xs">{termsData.version}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => { setActiveTab('policy_editor'); setPolicySubTab('terms'); }}
                      className="mt-6 w-full py-2.5 px-4 rounded-xl border border-red-500 text-red-600 hover:bg-red-50 font-bold text-xs transition cursor-pointer text-center"
                    >
                      Manage
                    </button>
                  </div>

                </div>

              </div>
            )}

            {/* ========================================================= */}
            {/* SETTINGS MODULES MODALS (Platform, Contact, Brand, FAQ, etc.) */}
            {/* ========================================================= */}

            {/* Modal 1: Platform Settings */}
            {settingsActiveModal === 'platform' && (
              <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 overflow-y-auto">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 relative my-auto">
                  <button
                    onClick={() => setSettingsActiveModal(null)}
                    className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#74111d] flex items-center justify-center font-black">
                      <Store className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-slate-900">Platform Settings</h3>
                      <p className="text-xs text-slate-500">Configure core platform naming, branding and system metadata</p>
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const now = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                      const updated = { ...platformSettings, lastUpdated: now };
                      setPlatformSettings(updated);
                      try { localStorage.setItem('loyalqr_platform_settings', JSON.stringify(updated)); } catch {}
                      setSettingsActiveModal(null);
                      showSettingsToast('Platform settings successfully saved & synchronized!');
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Platform Brand Name</label>
                      <input
                        type="text"
                        value={platformSettings.platformName}
                        onChange={(e) => setPlatformSettings({ ...platformSettings, platformName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Support Tagline</label>
                      <input
                        type="text"
                        value={platformSettings.supportTagline}
                        onChange={(e) => setPlatformSettings({ ...platformSettings, supportTagline: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Business Registration / CIN</label>
                        <input
                          type="text"
                          value={platformSettings.businessRegistration}
                          onChange={(e) => setPlatformSettings({ ...platformSettings, businessRegistration: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Default Currency</label>
                        <input
                          type="text"
                          value={platformSettings.defaultCurrency}
                          onChange={(e) => setPlatformSettings({ ...platformSettings, defaultCurrency: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">System Timezone</label>
                        <input
                          type="text"
                          value={platformSettings.timezone}
                          onChange={(e) => setPlatformSettings({ ...platformSettings, timezone: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Platform Contact Email</label>
                        <input
                          type="email"
                          value={platformSettings.contactEmail}
                          onChange={(e) => setPlatformSettings({ ...platformSettings, contactEmail: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setSettingsActiveModal(null)}
                        className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#8B0000] hover:bg-[#720000] text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                      >
                        Save Platform Settings
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal 2: Contact Settings */}
            {settingsActiveModal === 'contact' && (
              <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 overflow-y-auto">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 relative my-auto">
                  <button
                    onClick={() => setSettingsActiveModal(null)}
                    className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-slate-900">Contact & Support Settings</h3>
                      <p className="text-xs text-slate-500">Configure merchant helpline, emails, corporate address and social channels</p>
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const now = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                      const updated = { ...contactSettings, lastUpdated: now };
                      setContactSettings(updated);
                      try { localStorage.setItem('loyalqr_contact_settings', JSON.stringify(updated)); } catch {}
                      setSettingsActiveModal(null);
                      showSettingsToast('Contact & support channels updated successfully!');
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Support Email</label>
                        <input
                          type="email"
                          value={contactSettings.supportEmail}
                          onChange={(e) => setContactSettings({ ...contactSettings, supportEmail: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Support Phone / WhatsApp</label>
                        <input
                          type="text"
                          value={contactSettings.supportPhone}
                          onChange={(e) => setContactSettings({ ...contactSettings, supportPhone: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Emergency Escalation Helpline</label>
                      <input
                        type="text"
                        value={contactSettings.emergencyPhone}
                        onChange={(e) => setContactSettings({ ...contactSettings, emergencyPhone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Corporate Office Address</label>
                      <textarea
                        rows={2}
                        value={contactSettings.address}
                        onChange={(e) => setContactSettings({ ...contactSettings, address: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-600 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Twitter / X Handle</label>
                        <input
                          type="text"
                          value={contactSettings.twitterUrl}
                          onChange={(e) => setContactSettings({ ...contactSettings, twitterUrl: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Instagram URL</label>
                        <input
                          type="text"
                          value={contactSettings.instagramUrl}
                          onChange={(e) => setContactSettings({ ...contactSettings, instagramUrl: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setSettingsActiveModal(null)}
                        className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#8B0000] hover:bg-[#720000] text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                      >
                        Save Contact Details
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal 3: Brand Settings */}
            {settingsActiveModal === 'brand' && (
              <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 overflow-y-auto">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 relative my-auto">
                  <button
                    onClick={() => setSettingsActiveModal(null)}
                    className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-black">
                      <Palette className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-slate-900">Brand & Visual Identity</h3>
                      <p className="text-xs text-slate-500">Configure logo, favicon, ruby crimson theme and secondary palettes</p>
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const now = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                      const updated = { ...brandSettings, lastUpdated: now };
                      setBrandSettings(updated);
                      try { localStorage.setItem('loyalqr_brand_settings', JSON.stringify(updated)); } catch {}
                      setSettingsActiveModal(null);
                      showSettingsToast('Brand visual identity & color scheme saved!');
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Brand Name</label>
                        <input
                          type="text"
                          value={brandSettings.brandName}
                          onChange={(e) => setBrandSettings({ ...brandSettings, brandName: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Platform Logo URL</label>
                        <input
                          type="text"
                          value={brandSettings.logoUrl}
                          onChange={(e) => setBrandSettings({ ...brandSettings, logoUrl: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Primary Ruby Color</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={brandSettings.primaryColor}
                            onChange={(e) => setBrandSettings({ ...brandSettings, primaryColor: e.target.value })}
                            className="w-9 h-9 rounded-lg border border-slate-200 p-0.5 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={brandSettings.primaryColor}
                            onChange={(e) => setBrandSettings({ ...brandSettings, primaryColor: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-mono text-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Secondary Crimson</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={brandSettings.secondaryColor}
                            onChange={(e) => setBrandSettings({ ...brandSettings, secondaryColor: e.target.value })}
                            className="w-9 h-9 rounded-lg border border-slate-200 p-0.5 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={brandSettings.secondaryColor}
                            onChange={(e) => setBrandSettings({ ...brandSettings, secondaryColor: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-mono text-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Accent Highlight</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={brandSettings.accentColor}
                            onChange={(e) => setBrandSettings({ ...brandSettings, accentColor: e.target.value })}
                            className="w-9 h-9 rounded-lg border border-slate-200 p-0.5 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={brandSettings.accentColor}
                            onChange={(e) => setBrandSettings({ ...brandSettings, accentColor: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-mono text-slate-900"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-lg shadow-xs" 
                          style={{ backgroundColor: brandSettings.primaryColor }}
                        />
                        <div className="text-xs">
                          <p className="font-bold text-slate-900">Live Palette Preview</p>
                          <p className="text-slate-500 text-[11px]">Exact ruby red gradient match across admin portal & client</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded">Active</span>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setSettingsActiveModal(null)}
                        className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#8B0000] hover:bg-[#720000] text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                      >
                        Save Brand Settings
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal 4: FAQ Management */}
            {settingsActiveModal === 'faq' && (
              <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 overflow-y-auto">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 relative my-auto max-h-[90vh] flex flex-col">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#74111d] flex items-center justify-center font-black">
                        <HelpCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-lg text-slate-900">FAQ Management</h3>
                        <p className="text-xs text-slate-500">Manage questions displayed on merchant onboarding and counter portals</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSettingsActiveModal(null)}
                      className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto py-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                        Configured FAQs ({faqList.length})
                      </span>
                      <button
                        onClick={() => {
                          const q = prompt('Enter the new question:');
                          if (q && q.trim()) {
                            const a = prompt('Enter the answer:');
                            if (a && a.trim()) {
                              const newFaq = { id: 'f_' + Date.now(), question: q.trim(), answer: a.trim() };
                              const updated = [...faqList, newFaq];
                              setFaqList(updated);
                              setFaqMeta(prev => ({ ...prev, totalFaqs: updated.length }));
                              try { localStorage.setItem('loyalqr_faqs', JSON.stringify(updated)); } catch {}
                              showSettingsToast('New FAQ added successfully!');
                            }
                          }
                        }}
                        className="bg-[#8B0000] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer hover:bg-[#720000]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Question</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {faqList.map((f, idx) => (
                        <div key={f.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl relative group">
                          <div className="flex items-start justify-between">
                            <span className="font-black text-xs text-slate-900 pr-8">
                              {idx + 1}. {f.question}
                            </span>
                            <button
                              onClick={() => {
                                const filtered = faqList.filter(item => item.id !== f.id);
                                setFaqList(filtered);
                                setFaqMeta(prev => ({ ...prev, totalFaqs: filtered.length }));
                                try { localStorage.setItem('loyalqr_faqs', JSON.stringify(filtered)); } catch {}
                                showSettingsToast('FAQ item deleted.');
                              }}
                              className="text-slate-400 hover:text-red-600 transition p-1"
                              title="Delete FAQ"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-slate-600 mt-2 leading-relaxed">{f.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Total 48 platform FAQs synced</span>
                    <button
                      onClick={() => setSettingsActiveModal(null)}
                      className="px-6 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal 5: Privacy Policy Editor */}
            {settingsActiveModal === 'privacy' && (
              <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 overflow-y-auto">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 relative my-auto">
                  <button
                    onClick={() => setSettingsActiveModal(null)}
                    className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-black">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-slate-900">Privacy Policy Editor</h3>
                      <p className="text-xs text-slate-500">Edit legal clauses, merchant telemetry policies and user privacy guidelines</p>
                    </div>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const now = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                      const updated = { ...privacyPolicyData, lastUpdated: now };
                      setPrivacyPolicyData(updated);

                      const fullUpdate = {
                        privacy: {
                          ...policyData.privacy,
                          version: updated.version,
                          content: updated.content,
                          lastUpdated: now,
                          status: 'Published'
                        }
                      };
                      setPolicyData(prev => ({ ...prev, privacy: fullUpdate.privacy }));

                      try {
                        const allPolicies = { ...policyData, ...fullUpdate };
                        localStorage.setItem('beaurex_legal_policies', JSON.stringify(allPolicies));
                        window.dispatchEvent(new Event('beaurex_policy_updated'));
                        await fetch('/api/admin/policies', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(fullUpdate)
                        });
                      } catch (_) {}

                      setSettingsActiveModal(null);
                      showSettingsToast('Privacy Policy updated & published across all portals!');
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Policy Version</label>
                        <input
                          type="text"
                          value={privacyPolicyData.version}
                          onChange={(e) => setPrivacyPolicyData({ ...privacyPolicyData, version: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-red-600"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Effective Date</label>
                        <input
                          type="text"
                          value={privacyPolicyData.lastUpdated}
                          disabled
                          className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Policy Content (Markdown / Text)</label>
                      <textarea
                        rows={8}
                        value={privacyPolicyData.content}
                        onChange={(e) => setPrivacyPolicyData({ ...privacyPolicyData, content: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600 leading-relaxed"
                        required
                      />
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setSettingsActiveModal(null)}
                        className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#8B0000] hover:bg-[#720000] text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                      >
                        Publish Privacy Policy
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal 6: Terms & Conditions Editor */}
            {settingsActiveModal === 'terms' && (
              <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 overflow-y-auto">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 relative my-auto">
                  <button
                    onClick={() => setSettingsActiveModal(null)}
                    className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-black">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-slate-900">Terms & Conditions Editor</h3>
                      <p className="text-xs text-slate-500">Edit platform terms of service, merchant usage policies and billing clauses</p>
                    </div>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const now = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                      const updated = { ...termsData, lastUpdated: now };
                      setTermsData(updated);

                      const fullUpdate = {
                        terms: {
                          ...policyData.terms,
                          version: updated.version,
                          content: updated.content,
                          lastUpdated: now,
                          status: 'Published'
                        }
                      };
                      setPolicyData(prev => ({ ...prev, terms: fullUpdate.terms }));

                      try {
                        const allPolicies = { ...policyData, ...fullUpdate };
                        localStorage.setItem('beaurex_legal_policies', JSON.stringify(allPolicies));
                        window.dispatchEvent(new Event('beaurex_policy_updated'));
                        await fetch('/api/admin/policies', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(fullUpdate)
                        });
                      } catch (_) {}

                      setSettingsActiveModal(null);
                      showSettingsToast('Terms & Conditions updated & published across all portals!');
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Terms Version</label>
                        <input
                          type="text"
                          value={termsData.version}
                          onChange={(e) => setTermsData({ ...termsData, version: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-red-600"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Effective Date</label>
                        <input
                          type="text"
                          value={termsData.lastUpdated}
                          disabled
                          className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Terms Content (Markdown / Text)</label>
                      <textarea
                        rows={8}
                        value={termsData.content}
                        onChange={(e) => setTermsData({ ...termsData, content: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-600 leading-relaxed"
                        required
                      />
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setSettingsActiveModal(null)}
                        className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#8B0000] hover:bg-[#720000] text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                      >
                        Publish Terms & Conditions
                      </button>
                    </div>
                  </form>
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
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 relative my-auto">
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
                          <th className="py-2.5 px-3 text-center">Action</th>
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
                            <td className="py-2.5 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleDeleteMemberReferral(selectedReferralMember, r)}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                title="Delete Store Referral"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
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
                        Customer Manager — {selectedCustomerTrackerMember.name}
                      </h3>
                      <span className="bg-rose-50 text-[#74111d] font-black text-[11px] px-2.5 py-0.5 rounded-full border border-rose-200">
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
                  <div className="bg-rose-50/60 border border-rose-200/60 rounded-2xl p-3">
                    <span className="text-[10px] font-bold text-[#74111d] uppercase tracking-wider block">Total Approached</span>
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-red-600"
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
                                    {lead.approachedFor || 'BeAurex Loyalty'}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3">
                                  <div className="font-bold text-slate-800">{lead.name}</div>
                                  <div className="text-[11px] font-bold text-rose-700 flex items-center space-x-1">
                                    <Building2 className="w-3 h-3 text-rose-500 inline shrink-0" />
                                    <span>{lead.companyName && lead.companyName !== '—' ? lead.companyName : 'No Company'}</span>
                                  </div>
                                  <div className="font-mono text-[10px] text-slate-400">{lead.phone || '—'}</div>
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
                                      : 'bg-rose-50 text-[#74111d] border-rose-200'
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
                                  <div className="inline-flex items-center space-x-1.5 justify-end">
                                    <button
                                      onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
                                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition inline-flex items-center space-x-1 cursor-pointer ${
                                        isExpanded
                                          ? 'bg-[#74111d] text-white border-[#74111d]'
                                          : 'bg-rose-50 text-[#74111d] border-rose-200 hover:bg-rose-100'
                                      }`}
                                    >
                                      <span>Notes ({followupsList.length})</span>
                                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteCrmLead(selectedCustomerTrackerMember, lead)}
                                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                      title="Delete CRM Lead"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>

                              {/* Expanded Follow-up Logs Drawer */}
                              {isExpanded && (
                                <tr className="bg-rose-50/30">
                                  <td colSpan={7} className="p-3.5 border-t border-rose-100">
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <div className="text-[11px] font-black uppercase text-[#74111d] tracking-wider flex items-center space-x-1.5">
                                          <FileText className="w-3.5 h-3.5 text-[#74111d]" />
                                          <span>Follow-up History & Activity Logs ({lead.name})</span>
                                        </div>
                                        {lead.email && lead.email !== '—' && (
                                          <span className="text-[11px] text-slate-500 font-mono">Email: {lead.email}</span>
                                        )}
                                      </div>

                                      {followupsList.length > 0 ? (
                                        <div className="space-y-1.5">
                                          {followupsList.map((f, fIdx) => (
                                            <div key={f.id || fIdx} className="bg-white p-2.5 rounded-xl border border-rose-200/60 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                                              <div className="flex items-center space-x-2">
                                                <span className="font-mono text-[10px] text-slate-400 font-semibold">{f.dateTime}</span>
                                                <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">{f.method}</span>
                                                <span className="font-bold text-slate-800">{f.comments || 'No note added.'}</span>
                                              </div>
                                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-[#74111d] uppercase">
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
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 relative my-auto">
              <button
                onClick={() => setSelectedMerchantForDeal(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center space-x-3 mb-5 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#8B0000] flex items-center justify-center font-black shrink-0">
                  <Tag className="w-6 h-6" />
                </div>
                <div className="pr-8">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <h3 className="font-extrabold text-lg text-slate-900">
                      Configure Deal — {selectedMerchantForDeal.businessName}
                    </h3>
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md border border-slate-200">
                      {selectedMerchantForDeal.plan || 'Standard Plan'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select a platform deal from the list below to apply to this merchant.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveDeal} className="space-y-4">
                {/* QUICK PICK FROM PLATFORM DEALS (Only this section) */}
                <div className="p-4 bg-red-50/60 border border-red-200/80 rounded-2xl">
                  <label className="block text-[11px] font-black uppercase text-[#8B0000] tracking-wider mb-2">
                    QUICK PICK FROM PLATFORM DEALS ({platformDeals?.length || 0})
                  </label>
                  <select
                    value={dealForm.dealId || ''}
                    onChange={(e) => {
                      const selId = e.target.value;
                      if (!selId) {
                        setDealForm(prev => ({
                          ...prev,
                          dealId: '',
                          dealTitle: '',
                          couponCode: '',
                          dealAmount: prev.originalPrice || 24000,
                          discountPercent: 0,
                          discountAmount: 0,
                          badgeText: '',
                          validTill: '30 Days'
                        }));
                        return;
                      }
                      if (selId === 'REMOVE') {
                        setDealForm(prev => ({
                          ...prev,
                          dealId: 'REMOVE',
                          dealTitle: '',
                          couponCode: '',
                          dealAmount: prev.originalPrice || 24000,
                          discountPercent: 0,
                          discountAmount: 0,
                          badgeText: '',
                          validTill: '30 Days'
                        }));
                        return;
                      }
                      const sel = (platformDeals || []).find(d => String(d.id) === String(selId));
                      if (sel) {
                        const orig = dealForm.originalPrice || 24000;
                        const hasPct = Boolean(sel.discountPercentage && Number(sel.discountPercentage) > 0);
                        const pct = Number(sel.discountPercentage) || 0;
                        const flat = Number(sel.discountAmount) || 0;
                        const finalAmt = hasPct
                          ? Math.max(0, Math.round(orig * (1 - pct / 100)))
                          : Math.max(0, orig - flat);
                        const calculatedType = hasPct ? 'PERCENTAGE' : (flat > 0 ? 'FLAT' : 'FIXED_PRICE');
                        const badge = hasPct ? `${pct}% OFF` : (flat > 0 ? `₹${flat.toLocaleString('en-IN')} OFF` : 'SPECIAL DEAL');

                        setDealForm(prev => ({
                          ...prev,
                          dealId: sel.id,
                          dealType: calculatedType,
                          dealTitle: sel.dealName,
                          couponCode: sel.couponCode || '',
                          originalPrice: orig,
                          dealAmount: finalAmt,
                          discountPercent: pct,
                          discountAmount: hasPct ? (orig - finalAmt) : flat,
                          validTill: sel.validityDate || '30 Days',
                          badgeText: badge,
                          isComplimentary: false,
                          notes: `Platform Deal: ${sel.dealName} [${sel.couponCode || ''}]`
                        }));
                      }
                    }}
                    className="w-full bg-white border border-red-300 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 cursor-pointer shadow-2xs"
                  >
                    <option value="">-- Select Deal & Coupon to Auto-Fill --</option>
                    {Boolean(selectedMerchantForDeal.dealDetails?.dealTitle) && (
                      <option value="REMOVE">-- Remove Deal (Restore Default Plan) --</option>
                    )}
                    {dealForm.dealTitle && dealForm.dealId !== 'REMOVE' && !platformDeals?.some(d => String(d.id) === String(dealForm.dealId)) && (
                      <option value={dealForm.dealId || 'active'}>
                        {dealForm.dealTitle} (Current Active Deal)
                      </option>
                    )}
                    {(platformDeals || []).map(d => (
                      <option key={d.id} value={d.id}>
                        {d.dealName} {d.planName ? `(${d.planName})` : (d.planType ? `(${d.planType})` : '')} [{d.couponCode}] — {d.discountPercentage ? `${d.discountPercentage}% Off` : `₹${(d.discountAmount || 0).toLocaleString('en-IN')} Off`}
                      </option>
                    ))}
                  </select>

                  {/* Active Deal Details ("when i click then i go and see") */}
                  {dealForm.dealTitle && dealForm.dealId !== 'REMOVE' && (
                    <div className="mt-3 p-3.5 bg-white border border-red-200/90 rounded-xl space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-slate-900">{dealForm.dealTitle}</span>
                        {dealForm.badgeText && (
                          <span className="text-[10px] font-black text-[#8B0000] bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                            {dealForm.badgeText}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
                        <span>Payable Deal Price: <span className="font-black text-slate-900 font-mono">₹{Number(dealForm.dealAmount || 0).toLocaleString('en-IN')}</span></span>
                        <span>Validity: <span className="font-bold text-slate-800">{dealForm.validTill || '30 Days'}</span></span>
                      </div>
                      {dealForm.couponCode && (
                        <div className="text-[11px] text-slate-500 font-mono">
                          Coupon Code: <strong className="text-slate-800">{dealForm.couponCode}</strong>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Modal Footer Actions */}
                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMerchantForDeal(null)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!dealForm.dealTitle && dealForm.dealId !== 'REMOVE'}
                    className="bg-[#8B0000] hover:bg-[#700000] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black px-5 py-2 rounded-xl text-xs transition cursor-pointer shadow-md shadow-red-950/20"
                  >
                    Apply Deal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL: COMPLIMENTARY ACCESS CONFIGURATION (4 Options)     */}
        {/* ========================================================= */}
        {complimentaryModalMerchant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in zoom-in-95 relative max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#74111d] flex items-center justify-center font-black shrink-0">
                    <Gift className="w-5 h-5 text-[#74111d]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">Free Access (Complimentary)</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Manage free plan access for <span className="font-bold text-slate-800">{complimentaryModalMerchant.businessName}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setComplimentaryModalMerchant(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveComplimentary} className="space-y-4 pt-3">
                {/* Free Access Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Free Plan Access
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setComplimentaryForm({ ...complimentaryForm, status: 'YES' })}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-black flex items-center justify-center space-x-2 transition cursor-pointer ${
                        complimentaryForm.status === 'YES'
                          ? 'bg-[#74111d] text-white border-[#74111d] shadow-md shadow-[#74111d]/20'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>Yes (Free Access)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setComplimentaryForm({ ...complimentaryForm, status: 'NO' })}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-black flex items-center justify-center space-x-2 transition cursor-pointer ${
                        complimentaryForm.status === 'NO'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <X className="w-4 h-4" />
                      <span>No (Standard Paid)</span>
                    </button>
                  </div>
                </div>

                {complimentaryForm.status === 'YES' && (
                  <>
                    {/* Plan Selection */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Select Plan
                      </label>
                      <select
                        value={complimentaryForm.planTier}
                        onChange={(e) => setComplimentaryForm({ ...complimentaryForm, planTier: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-red-600 cursor-pointer"
                      >
                        <option value="PROFESSIONAL">Professional Plan</option>
                        <option value="STANDARD">Standard Plan</option>
                        <option value="TRIAL">Trial Plan</option>
                      </select>
                    </div>

                    {/* Reason */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Reason
                      </label>
                      <input
                        type="text"
                        required
                        value={complimentaryForm.reason}
                        onChange={(e) => setComplimentaryForm({ ...complimentaryForm, reason: e.target.value })}
                        placeholder="e.g. VIP Client, Festival Offer, Trial Extension..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 font-medium"
                      />
                    </div>

                    {/* Validity Period */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-700">
                          Validity Period
                        </label>
                        <span className="text-[11px] font-bold text-[#74111d] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          {complimentaryForm.isLifetime || complimentaryForm.days === 'Lifetime' || Number(complimentaryForm.days) >= 36500
                            ? 'Lifetime'
                            : `${complimentaryForm.days || 0} Days`}
                        </span>
                      </div>
                      
                      {/* Presets */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        {[
                          { label: '7 Days', days: 7 },
                          { label: '15 Days', days: 15 },
                          { label: '30 Days', days: 30 },
                          { label: '90 Days', days: 90 },
                          { label: '180 Days', days: 180 },
                          { label: '1 Year', days: 365 },
                          { label: 'Lifetime', days: 36500, isLifetime: true }
                        ].map((preset) => {
                          const isSelected = preset.isLifetime
                            ? (complimentaryForm.isLifetime || complimentaryForm.days === 'Lifetime' || Number(complimentaryForm.days) >= 36500)
                            : (!complimentaryForm.isLifetime && complimentaryForm.days !== 'Lifetime' && Number(complimentaryForm.days) === preset.days);
                          return (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() => {
                                if (preset.isLifetime) {
                                  setComplimentaryForm({
                                    ...complimentaryForm,
                                    days: 'Lifetime',
                                    isLifetime: true,
                                    customValidTill: 'Lifetime Access'
                                  });
                                } else {
                                  const target = new Date();
                                  target.setDate(target.getDate() + preset.days);
                                  const formatted = target.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                                  setComplimentaryForm({
                                    ...complimentaryForm,
                                    days: preset.days,
                                    isLifetime: false,
                                    customValidTill: formatted
                                  });
                                }
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                                isSelected
                                  ? 'bg-[#74111d] text-white border-[#74111d] shadow-xs'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {preset.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Number Input / Lifetime Indicator */}
                      <div className="flex items-center space-x-2">
                        <input
                          type={complimentaryForm.isLifetime ? "text" : "number"}
                          min="1"
                          max="36500"
                          required={!complimentaryForm.isLifetime}
                          readOnly={Boolean(complimentaryForm.isLifetime)}
                          value={complimentaryForm.isLifetime ? 'Lifetime Access (Never Expires)' : complimentaryForm.days}
                          onChange={(e) => {
                            if (complimentaryForm.isLifetime) return;
                            const val = Number(e.target.value);
                            const target = new Date();
                            target.setDate(target.getDate() + val);
                            const formatted = target.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                            setComplimentaryForm({ ...complimentaryForm, days: val, isLifetime: false, customValidTill: formatted });
                          }}
                          placeholder="Enter custom days..."
                          className={`w-full border rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                            complimentaryForm.isLifetime
                              ? 'bg-rose-50/70 border-rose-300 text-[#74111d]'
                              : 'bg-slate-50 border-slate-200 text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white'
                          }`}
                        />
                        <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
                          {complimentaryForm.isLifetime ? 'Perpetual' : 'Days'}
                        </span>
                      </div>

                      {/* Expiry preview */}
                      <div className="mt-2.5 p-3 bg-rose-50/70 border border-rose-200/80 rounded-xl flex items-center justify-between text-xs">
                        <span className="text-slate-600 font-medium">Valid Till:</span>
                        <span className="font-black text-[#74111d] font-mono">
                          {complimentaryForm.isLifetime || complimentaryForm.days === 'Lifetime' || Number(complimentaryForm.days) >= 36500
                            ? 'Lifetime (Never Expires)'
                            : (() => {
                                const target = new Date();
                                target.setDate(target.getDate() + (Number(complimentaryForm.days) || 0));
                                return target.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                              })()}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* Footer Action Buttons */}
                <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setComplimentaryModalMerchant(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#74111d] hover:bg-[#5e0c15] text-white text-xs font-black transition shadow-md shadow-[#74111d]/20 cursor-pointer flex items-center space-x-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Access</span>
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
        {/* MODAL 4: FULL MERCHANT DASHBOARD QUICK VIEW (Eye Icon)    */}
        {/* ========================================================= */}
        {viewMerchantModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 z-50 animate-in fade-in duration-150 overflow-y-auto">
            <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-4xl w-full shadow-2xl border border-slate-200 relative my-auto max-h-[92vh] overflow-y-auto">
              
              {/* Modal Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#8B0000] text-white flex items-center justify-center font-black text-lg shadow-md shadow-red-950/20 shrink-0">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-black text-xl text-slate-900 leading-tight">
                        {viewMerchantModal.businessName}
                      </h3>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {viewMerchantModal.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 flex flex-wrap items-center gap-2">
                      {viewMerchantModal.city && <span>{viewMerchantModal.city}</span>}
                      {viewMerchantModal.mobile && (
                        <>
                          <span>•</span>
                          <span>{viewMerchantModal.mobile}</span>
                        </>
                      )}
                      {viewMerchantModal.email && (
                        <>
                          <span>•</span>
                          <span className="text-[#74111d] font-bold flex items-center space-x-1">
                            <Mail className="w-3 h-3" />
                            <span>{viewMerchantModal.email}</span>
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-center">
                  <span className={`text-xs font-black px-3 py-1 rounded-full border ${
                    viewMerchantModal.status === 'Paid'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : viewMerchantModal.status === 'Trial'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {viewMerchantModal.status === 'Paid' ? 'Paid Active' : viewMerchantModal.status === 'Trial' ? 'Trial Store' : 'Suspended'}
                  </span>
                  {viewMerchantModal.isComplimentary && (
                    <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-rose-50 text-[#74111d] border border-rose-200 flex items-center space-x-1">
                      <Gift className="w-3 h-3 text-[#74111d]" />
                      <span>Complimentary ({viewMerchantModal.complimentaryDays === 'Lifetime' || Number(viewMerchantModal.complimentaryDays) >= 36500 ? 'Lifetime' : `${viewMerchantModal.complimentaryDays || 10}d`})</span>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setViewMerchantModal(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 1. Dashboard Metric Cards (Short Manner) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 my-4">
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    <span>Counter Scans</span>
                    <QrCode className="w-4 h-4 text-[#8B0000]" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">
                    {viewMerchantModal.totalScans || 120}
                  </div>
                  <p className="text-[10px] text-emerald-600 font-bold mt-0.5">+18 scans today</p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    <span>Repeat Rate</span>
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-600">
                    {viewMerchantModal.repeatRate || '41.5%'}
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">High repeat conversion</p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    <span>Enrolled Shoppers</span>
                    <Users className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">
                    {Math.round((viewMerchantModal.totalScans || 120) * 0.45) || 54}
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Mobile wallet accounts</p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    <span>Redeemed Vouchers</span>
                    <CheckCircle2 className="w-4 h-4 text-rose-600" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-[#74111d]">
                    {Math.round((viewMerchantModal.totalScans || 120) * 0.32) || 38}
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Verified by cashier PIN</p>
                </div>
              </div>

              {/* 2. Dual Breakdown: In-Store Gamification & Subscription Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                
                {/* Column A: In-Store Gamification & Counter Configuration */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                    <span className="font-black text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#8B0000]" />
                      <span>Counter Gamification Engine</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Active</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Active Scratch Reward:</span>
                    <span className="font-extrabold text-slate-900">🎁 ₹150 OFF (Min Order ₹500)</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Cashier 4-Digit Secret PIN:</span>
                    <span className="font-mono font-black text-slate-900 bg-slate-200/80 px-2 py-0.5 rounded tracking-widest">4829</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Fair-play Throttle:</span>
                    <span className="font-bold text-slate-800">12h Device Lock (Anti-abuse)</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Table Standee URL:</span>
                    <a
                      href={`/scan/${viewMerchantModal.qrSlug || viewMerchantModal.businessName?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'store'}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#8B0000] font-bold hover:underline font-mono text-[11px] flex items-center space-x-1"
                    >
                      <span>/scan/{viewMerchantModal.qrSlug || viewMerchantModal.businessName?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'store'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Column B: Commercial Billing & Plan Status */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                    <span className="font-black text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-slate-700" />
                      <span>Commercial & Settlement</span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">Ledger</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Subscription Tier:</span>
                    <span className="font-extrabold text-[#8B0000]">{viewMerchantModal.plan || viewMerchantModal.subscriptionTier || 'Trial Plan'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Plan Valid Till:</span>
                    <span className="font-mono font-bold text-slate-800">{viewMerchantModal.planValidTill || '14 Oct 2026'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Settled Amount:</span>
                    <span className="font-bold text-slate-900">
                      {viewMerchantModal.paymentAmount && viewMerchantModal.paymentAmount !== '-' 
                        ? viewMerchantModal.paymentAmount 
                        : (viewMerchantModal.status === 'Paid' ? '₹49,000' : 'Unpaid')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Complimentary Access:</span>
                    <span className="font-bold text-[#74111d]">
                      {viewMerchantModal.isComplimentary 
                        ? `Yes (${viewMerchantModal.complimentaryDays === 'Lifetime' || Number(viewMerchantModal.complimentaryDays) >= 36500 ? 'Lifetime Access' : `+${viewMerchantModal.complimentaryDays || 10} Days`}) - ${viewMerchantModal.complimentaryReason || 'Special Access'}` 
                        : 'No (Standard Plan)'}
                    </span>
                  </div>

                  {Boolean(viewMerchantModal.dealDetails?.dealTitle || (viewMerchantModal.dealDetails?.dealType && viewMerchantModal.dealDetails?.dealType !== 'NONE')) && (
                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60">
                      <span className="text-slate-500 font-medium">Special Deal Package:</span>
                      <div className="text-right">
                        <span className="font-extrabold text-red-700 block text-xs">
                          {viewMerchantModal.dealDetails.dealTitle || 'Custom Deal'}
                        </span>
                        <span className="text-[10px] text-slate-600 font-mono font-bold">
                          [{viewMerchantModal.dealDetails.badgeText || viewMerchantModal.dealDetails.dealType || 'DEAL'}] • Payable: {viewMerchantModal.dealDetails.dealType === 'COMPLIMENTARY' ? '₹0 Free' : `₹${(viewMerchantModal.dealDetails.dealAmount || 0).toLocaleString('en-IN')}`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Recent Customer Activity Feed (Short Manner Mini-Table) */}
              <div className="my-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                    Recent Customer Scans & Claims
                  </h4>
                  <span className="text-[10px] text-slate-400 font-semibold">Live in-store counter logs</span>
                </div>
                
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Customer Phone</th>
                        <th className="py-2.5 px-3">Reward Won</th>
                        <th className="py-2.5 px-3">Time</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      <tr>
                        <td className="py-2.5 px-3 font-mono text-slate-900">+91 98112 34567</td>
                        <td className="py-2.5 px-3 font-bold text-slate-800">₹150 OFF (Scratch Card)</td>
                        <td className="py-2.5 px-3 text-slate-500 text-[11px]">Today 18:42</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            REDEEMED
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-mono text-slate-900">+91 98770 12389</td>
                        <td className="py-2.5 px-3 font-bold text-slate-800">10% Instant Discount</td>
                        <td className="py-2.5 px-3 text-slate-500 text-[11px]">Today 15:10</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            REDEEMED
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-mono text-slate-900">+91 99554 43322</td>
                        <td className="py-2.5 px-3 font-bold text-slate-800">50 Reward Points</td>
                        <td className="py-2.5 px-3 text-slate-500 text-[11px]">Yesterday 20:05</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            IN WALLET
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. Super Admin Controls Footer */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const m = viewMerchantModal;
                      setViewMerchantModal(null);
                      handleOpenComplimentaryModal(m);
                    }}
                    className="bg-rose-50 hover:bg-rose-100 text-[#74111d] border border-rose-200 font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer flex items-center space-x-1"
                    title="Configure complimentary access"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>Complimentary Settings</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const m = viewMerchantModal;
                      setViewMerchantModal(null);
                      handleOpenDeal(m);
                    }}
                    className="bg-red-50 hover:bg-red-100 text-[#8B0000] border border-red-200 font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer flex items-center space-x-1"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>Set Custom Deal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const m = viewMerchantModal;
                      handleToggleMerchantSuspend(m.id || m._id, m.status === 'Suspended');
                      setViewMerchantModal(null);
                    }}
                    className={`font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer border flex items-center space-x-1 ${
                      viewMerchantModal.status === 'Suspended'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>{viewMerchantModal.status === 'Suspended' ? 'Reactivate Store' : 'Suspend Account'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setViewMerchantModal(null)}
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-black px-6 py-2.5 rounded-xl text-xs transition cursor-pointer shadow-md"
                >
                  Close Dashboard View
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL 5: ADD DYNAMIC CUSTOM API KEY */}
        {/* ========================================================= */}
        {showAddCustomKeyModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 relative my-auto">
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
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 my-auto">
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
                    Gateway Keys
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('audit');
                      setAdminProfileModalOpen(false);
                    }}
                    className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-bold transition text-center cursor-pointer border border-slate-200"
                  >
                    Security Logs
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

        {/* ========================================================= */}
        {/* INQUIRY DETAIL MODAL                                      */}
        {/* ========================================================= */}
        {selectedInquiryModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-[#8B0000] flex items-center justify-center font-black">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Contact Inquiry Details</h3>
                    <p className="text-[11px] font-mono text-slate-400 font-bold">
                      ID: {String(selectedInquiryModal.id || selectedInquiryModal._id).slice(-8).toUpperCase()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedInquiryModal(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Inquirer Name</span>
                  <span className="font-black text-slate-900 text-sm mt-0.5 block">{selectedInquiryModal.name || 'Anonymous'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Date & Time</span>
                  <span className="font-mono font-bold text-slate-800 mt-0.5 block">
                    {selectedInquiryModal.createdAt
                      ? `${new Date(selectedInquiryModal.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} ${new Date(selectedInquiryModal.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
                      : 'Just now'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Phone</span>
                  {selectedInquiryModal.phone ? (
                    <a href={`tel:${selectedInquiryModal.phone}`} className="font-mono font-black text-red-700 hover:underline mt-0.5 block">
                      {selectedInquiryModal.phone}
                    </a>
                  ) : (
                    <span className="text-slate-400 font-bold">N/A</span>
                  )}
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Email</span>
                  {selectedInquiryModal.email ? (
                    <a href={`mailto:${selectedInquiryModal.email}`} className="font-bold text-red-700 hover:underline truncate mt-0.5 block" title={selectedInquiryModal.email}>
                      {selectedInquiryModal.email}
                    </a>
                  ) : (
                    <span className="text-slate-400 font-bold">N/A</span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase text-slate-500 tracking-wider block mb-1">
                  Full Store Query / Message
                </label>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {selectedInquiryModal.message}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black text-slate-600">Update Status:</span>
                  <select
                    value={selectedInquiryModal.status || 'NEW'}
                    onChange={(e) => handleUpdateContactStatus(selectedInquiryModal.id || selectedInquiryModal._id, e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-black text-slate-800 bg-white cursor-pointer shadow-2xs"
                  >
                    <option value="NEW">NEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDeleteContact(selectedInquiryModal.id || selectedInquiryModal._id)}
                    className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition cursor-pointer"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedInquiryModal(null)}
                    className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* GLOBAL ACTION PERMISSION & CONFIRMATION MODAL */}
        {/* ========================================================= */}
        <ActionConfirmModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmText={confirmModal.confirmText}
          cancelText={confirmModal.cancelText}
          type={confirmModal.type}
          onConfirm={confirmModal.onConfirm}
          onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        />

      </div>
    </AdminAuthGate>
  );
}

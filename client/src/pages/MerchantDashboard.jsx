import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, Users, Gift, Settings, Zap, QrCode, BarChart3, Ticket, Download, 
  ExternalLink, Clock, TrendingUp, Trophy, Copy, Plus, Search, Calendar, Check, 
  CheckCircle2, AlertTriangle, Smartphone, Store, Coffee, Sparkles, X, ChevronRight, 
  ArrowUpRight, Utensils, FileSpreadsheet, Play, ShieldCheck, LogOut, Info, Layers, 
  Stamp, Edit3, Share2, CheckCheck, CreditCard, ShoppingBag, Eye, Trash2, ChevronDown,
  MapPin, Mail, Globe, RefreshCw, HelpCircle, Camera, Shield, Menu, KeyRound, EyeOff, Lock, User, Printer
} from 'lucide-react';

export default function MerchantDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [merchantProfileModalOpen, setMerchantProfileModalOpen] = useState(false);
  // Navigation tabs: 'home', 'customers', 'winners', 'create_offer', 'burn', 'qr', 'campaigns', 'analytics', 'settings'
  const [activeTab, setActiveTab] = useState('home');
  const [storeName, setStoreName] = useState('Royal Sweets & Cafe');
  const [copiedToast, setCopiedToast] = useState(false);

  const getStoreInitials = (name) => {
    const s = String(name || 'Royal Sweets').trim();
    return s.slice(0, 2).toUpperCase();
  };

  // Settings Submenu state (Matching Reference Image)
  const [storeCategory, setStoreCategory] = useState('Cafe');
  const [locationHours, setLocationHours] = useState({
    address: 'Shop 12, Connaught Place',
    city: 'Delhi NCR',
    pincode: '110001',
    openTime: '10:00 AM',
    closeTime: '11:00 PM',
    workingDays: 'All 7 Days'
  });
  const [phoneEmail, setPhoneEmail] = useState({
    phone: '+91 98765 43210',
    email: '' // Initially empty to match "No email address set"
  });
  const [socialLinks, setSocialLinks] = useState({
    instagram: '@bluecode_cafe',
    googleReview: 'https://g.page/r/bluecode/review',
    whatsapp: '+91 98765 43210'
  });
  const [autoApproveScans, setAutoApproveScans] = useState(false);
  const [allowMultipleScans, setAllowMultipleScans] = useState(true);
  const [ownerAccount, setOwnerAccount] = useState({
    ownerName: 'Rakesh Sharma',
    phone: '9876543210',
    email: 'owner@bluecode.in'
  });

  // Settings Modals
  const [editStoreModalOpen, setEditStoreModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [ownerModalOpen, setOwnerModalOpen] = useState(false);
  const [downloadAppModalOpen, setDownloadAppModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [updatePasswordModalOpen, setUpdatePasswordModalOpen] = useState(false);
  const [passwordChangeForm, setPasswordChangeForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Other Modals state
  const [stampModalOpen, setStampModalOpen] = useState(false);
  const [scratchModalOpen, setScratchModalOpen] = useState(false);
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [standOrderModalOpen, setStandOrderModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(null);

  // POS Burn state (Preserved)
  const [pinCode, setPinCode] = useState('');
  const [redeemResult, setRedeemResult] = useState(null);
  const [redeemError, setRedeemError] = useState('');
  const [loadingRedeem, setLoadingRedeem] = useState(false);

  // Metrics Data
  const [metrics, setMetrics] = useState({
    scans: 1482,
    users: 894,
    rewards: 319,
    repeatRate: '42%'
  });
  const [todayStats, setTodayStats] = useState({ scansToday: 18, completedToday: 6 });
  const [weeklyScans, setWeeklyScans] = useState([
    { day: 'Mon', scans: 184 },
    { day: 'Tue', scans: 210 },
    { day: 'Wed', scans: 195 },
    { day: 'Thu', scans: 230 },
    { day: 'Fri', scans: 275 },
    { day: 'Sat', scans: 220 },
    { day: 'Sun', scans: 168 }
  ]);

  // Active Reward Program
  const [activeProgram, setActiveProgram] = useState({
    title: 'Get 5% discount on your total bill after 5 visits',
    stampsRequired: 6,
    validityDays: 30,
    minBill: 200
  });

  // Stamp Program Form State
  const [stampForm, setStampForm] = useState({
    title: 'Get 5% discount on your total bill after 5 visits',
    stampsRequired: 6,
    validityDays: 30,
    minBill: 200
  });

  // Winners Tab State
  const [winnerTabType, setWinnerTabType] = useState('stamp'); // 'stamp' or 'scratch'
  const [winnerSearch, setWinnerSearch] = useState('');
  const [winners, setWinners] = useState([
    { id: 'w1', type: 'scratch', customerName: 'Rohan Sharma', phone: '9876543210', rewardTitle: '₹150 Flat Discount Voucher', pinCode: '4821', claimedAt: '10 mins ago', status: 'ACTION_REQUIRED' },
    { id: 'w2', type: 'scratch', customerName: 'Priya Verma', phone: '9812345678', rewardTitle: '15% OFF On Next Dine-In Bill', pinCode: '3912', claimedAt: '45 mins ago', status: 'ACTION_REQUIRED' },
    { id: 'w3', type: 'scratch', customerName: 'Amit Saxena', phone: '9765432109', rewardTitle: 'Free Special Masala Chai', pinCode: '8841', claimedAt: '2 hours ago', status: 'REDEEMED' },
    { id: 'w4', type: 'stamp', customerName: 'Simran Kaur', phone: '9988776655', rewardTitle: 'Get 5% discount on total bill', pinCode: '5521', claimedAt: 'Yesterday', status: 'ACTION_REQUIRED' },
    { id: 'w5', type: 'stamp', customerName: 'Deepak Patel', phone: '9123456780', rewardTitle: 'Get 5% discount on total bill', pinCode: '6142', claimedAt: '2 days ago', status: 'REDEEMED' }
  ]);

  // Customers Tab State
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerFilter, setCustomerFilter] = useState('ALL'); // 'ALL', 'ACTIVE', 'COMPLETED'
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [customers, setCustomers] = useState([
    { id: 'c1', name: 'Rohan Sharma', phone: '9876543210', totalVisits: 6, stamps: 6, status: 'COMPLETED', lastVisit: 'Today, 09:30 AM' },
    { id: 'c2', name: 'Priya Verma', phone: '9812345678', totalVisits: 4, stamps: 4, status: 'ACTIVE', lastVisit: 'Today, 08:45 AM' },
    { id: 'c3', name: 'Amit Saxena', phone: '9765432109', totalVisits: 3, stamps: 3, status: 'ACTIVE', lastVisit: 'Yesterday, 07:15 PM' },
    { id: 'c4', name: 'Simran Kaur', phone: '9988776655', totalVisits: 6, stamps: 6, status: 'COMPLETED', lastVisit: 'Yesterday, 02:40 PM' },
    { id: 'c5', name: 'Deepak Patel', phone: '9123456780', totalVisits: 6, stamps: 6, status: 'COMPLETED', lastVisit: '02 Oct 2026' },
    { id: 'c6', name: 'Sneha Gupta', phone: '9899001122', totalVisits: 2, stamps: 2, status: 'ACTIVE', lastVisit: '01 Oct 2026' },
    { id: 'c7', name: 'Vikas Malhotra', phone: '9711223344', totalVisits: 5, stamps: 5, status: 'ACTIVE', lastVisit: '30 Sep 2026' }
  ]);
  const [showDemoCustomers, setShowDemoCustomers] = useState(true);

  // Digital Menu Items
  const [menuItems, setMenuItems] = useState([
    { id: 'm1', name: 'Special Masala Chai', category: 'Beverages', price: 60, isVeg: true, inStock: true, description: 'Freshly brewed aromatic tea with ginger & spices' },
    { id: 'm2', name: 'Paneer Tikka Roll', category: 'Starters', price: 180, isVeg: true, inStock: true, description: 'Char-grilled cottage cheese in flaky paratha' },
    { id: 'm3', name: 'Butter Chicken Biryani', category: 'Mains', price: 320, isVeg: false, inStock: true, description: 'Fragrant basmati rice layered with rich butter chicken' },
    { id: 'm4', name: 'Gulab Jamun with Rabri', category: 'Desserts', price: 110, isVeg: true, inStock: true, description: 'Warm khoya dumplings with thick saffron milk' },
    { id: 'm5', name: 'Cold Brew Hazelnut Coffee', category: 'Beverages', price: 140, isVeg: true, inStock: true, description: 'Smooth 16-hour steeped iced coffee' }
  ]);
  const [newItemForm, setNewItemForm] = useState({ name: '', category: 'Starters', price: '', isVeg: true, description: '' });

  // Scratch Campaign Rules (Preserved & Enhanced)
  const [scratchRules, setScratchRules] = useState([
    { id: 1, title: '15% OFF On Next Dine-In Bill', condition: 'Min. order ₹400 • Valid for 7 days', probability: '70% Chance', tag: 'High Volume' },
    { id: 2, title: '₹150 Flat Discount Voucher', condition: 'Min. order ₹600 • Valid for 10 days', probability: '25% Chance', tag: 'High Value' },
    { id: 3, title: 'Free Special Masala Chai or Dessert', condition: 'Any billing • Valid for 14 days', probability: '5% Jackpot', tag: 'Jackpot' }
  ]);

  // Order Stand Form
  const [standForm, setStandForm] = useState({ address: '', city: 'Delhi NCR', pincode: '', phone: '9876543210' });
  const [standSuccess, setStandSuccess] = useState('');

  // Platform Subscription Plans (Dynamically linked with Super Admin & MongoDB)
  const [availablePlans, setAvailablePlans] = useState([
    { id: 'plan_standard', name: 'Standard Plan', price: 24000, period: '/ Year', subtext: 'Perfect for local retail shops', tagText: 'Equivalent to ₹2,000/month', features: ['Customer retention system', 'Custom QR code standee generator', 'Unlimited customer QR scans', 'Standard Business Hours Support'] },
    { id: 'plan_professional', name: 'Professional Plan', price: 49000, period: '/ 3 Years', subtext: 'Accelerated conversion tools', tagText: 'Only ₹1,361/month', highlightBadge: 'Most Popular', isPopular: true, features: ['Customer retention system', 'Free account setup & acrylic config', 'Custom QR code standee generator', 'Unlimited customer QR scans', 'Priority VIP Support'] },
    { id: 'plan_legacy', name: 'Legacy Plan', price: 75000, period: 'Lifetime', subtext: 'Ultimate lifetime system', tagText: 'One-Time Payment', highlightBadge: 'Best Value', features: ['Customer retention system', 'Unlimited customer QR scans', 'Priority VIP Support', 'Dedicated Relationship Manager'] }
  ]);
  const [selectedPlanId, setSelectedPlanId] = useState('plan_professional');
  const [subscriptionInfo, setSubscriptionInfo] = useState({
    isOnline: true,
    isExpired: false,
    status: 'TRIAL',
    tier: 'TRIAL',
    daysRemaining: 2,
    expiresAt: null
  });
  const [merchantId, setMerchantId] = useState(null);
  const [subscribing, setSubscribing] = useState(false);
  const [subSuccessMsg, setSubSuccessMsg] = useState('');

  const navigate = useNavigate();

  // Initial load
  useEffect(() => {
    const token = sessionStorage.getItem('loyalqr_token') || localStorage.getItem('loyalqr_token');
    if (!token) {
      navigate('/admin/login', { replace: true });
      return;
    }

    const savedBiz = sessionStorage.getItem('loyalqr_biz') || localStorage.getItem('loyalqr_biz');
    if (savedBiz && typeof savedBiz === 'string' && savedBiz.trim() && savedBiz !== 'undefined' && savedBiz !== 'null') {
      setStoreName(savedBiz.trim());
    } else {
      setStoreName('Royal Sweets & Cafe');
    }

    let currentMid = null;
    const savedMerchantRaw = sessionStorage.getItem('loyalqr_merchant') || localStorage.getItem('loyalqr_merchant');
    if (savedMerchantRaw) {
      try {
        const m = JSON.parse(savedMerchantRaw);
        if (m && typeof m === 'object') {
          currentMid = m.id || m._id;
          if (currentMid) setMerchantId(currentMid);
          if (m.businessName) setStoreName(m.businessName);
          if (m.mobile) {
            setPhoneEmail(prev => ({ ...prev, phone: '+91 ' + m.mobile }));
            setOwnerAccount(prev => ({ ...prev, phone: m.mobile }));
          }
          if (m.email) {
            setPhoneEmail(prev => ({ ...prev, email: m.email }));
            setOwnerAccount(prev => ({ ...prev, email: m.email }));
          }
        }
      } catch (e) {}
    }

    // Check if redirected due to expired trial/subscription
    const searchParams = new URLSearchParams(window.location.search);
    const expiredParam = searchParams.get('expired') === 'true';
    const tabParam = searchParams.get('tab');
    if (expiredParam || tabParam === 'subscription') {
      setUpgradeModalOpen(true);
    }

    // Fetch live home metrics & subscription status
    const homeUrl = currentMid ? `/api/merchant/home?merchantId=${currentMid}` : '/api/merchant/home';
    fetch(homeUrl)
      .then(res => res.json())
      .then(data => {
        if (data && data.success) {
          if (data.metrics) setMetrics(data.metrics);
          if (data.today) setTodayStats(data.today);
          if (data.weekly) setWeeklyScans(data.weekly);
          if (data.subscription) {
            setSubscriptionInfo(data.subscription);
            if (data.subscription.isExpired) {
              setUpgradeModalOpen(true);
            }
          }
          if (data.activeRewardProgram) {
            setActiveProgram(data.activeRewardProgram);
            setStampForm(data.activeRewardProgram);
          }
        }
      })
      .catch(() => {});

    // Fetch live platform plans from Super Admin / MongoDB
    fetch('/api/public/plans')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.plans) && data.plans.length > 0) {
          const visible = data.plans.filter(p => p.isActive !== false);
          if (visible.length > 0) {
            setAvailablePlans(visible);
            const pop = visible.find(p => p.isPopular) || visible[0];
            setSelectedPlanId(pop.id);
          }
        }
      })
      .catch(() => {
        try {
          const cached = JSON.parse(localStorage.getItem('beaurex_platform_plans') || '[]');
          if (Array.isArray(cached) && cached.length > 0) setAvailablePlans(cached);
        } catch (e) {}
      });

    // Real-time listener for plan updates from Super Admin
    const handlePlansSync = (e) => {
      try {
        const updated = e.detail || JSON.parse(localStorage.getItem('beaurex_platform_plans') || '[]');
        if (Array.isArray(updated) && updated.length > 0) {
          setAvailablePlans(updated);
        }
      } catch (err) {}
    };

    window.addEventListener('beaurex_plans_updated', handlePlansSync);
    window.addEventListener('storage', handlePlansSync);

    return () => {
      window.removeEventListener('beaurex_plans_updated', handlePlansSync);
      window.removeEventListener('storage', handlePlansSync);
    };
  }, []);

  // Purchase / Activate Subscription Plan Handler
  const handleBuySubscription = async (planId) => {
    setSubscribing(true);
    try {
      const res = await fetch('/api/merchant/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantId: merchantId,
          planId: planId || selectedPlanId,
          paymentMethod: 'UPI_ONLINE'
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubscriptionInfo(data.subscription || {
          isOnline: true,
          isExpired: false,
          status: 'ACTIVE',
          tier: data.merchant?.subscriptionTier || 'PROFESSIONAL'
        });
        setUpgradeModalOpen(false);
        setSubSuccessMsg(data.message || 'Subscription activated successfully! Your store is now LIVE and ONLINE.');
        setTimeout(() => setSubSuccessMsg(''), 6000);
      } else {
        alert(data.message || 'Failed to activate plan.');
      }
    } catch (err) {
      alert('Subscription error: ' + err.message);
    } finally {
      setSubscribing(false);
    }
  };

  // Copy scan link
  const handleCopyLink = () => {
    const slug = String(storeName || 'royal-sweets').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const link = `${window.location.origin}/scan/${slug}`;
    navigator.clipboard.writeText(link);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  // Merchant Logout Handler (Clears auth and redirects to Home)
  const handleMerchantLogout = () => {
    sessionStorage.removeItem('loyalqr_token');
    sessionStorage.removeItem('loyalqr_merchant');
    sessionStorage.removeItem('loyalqr_biz');
    localStorage.removeItem('loyalqr_token');
    localStorage.removeItem('loyalqr_merchant');
    window.location.href = '/';
  };

  // Download Standee PDF / QR
  const handleDownload = () => {
    alert("Downloading high-resolution acrylic QR standee template (5x7 inch CMYK format)...");
  };

  // Export Customers CSV
  const handleExportCSV = () => {
    const dataList = showDemoCustomers ? customers : [];
    if (dataList.length === 0) {
      alert("No customer records currently available to export. Share your QR code to collect customers!");
      return;
    }
    const headers = "Name,Phone,Total Visits,Stamps,Status,Last Visit\n";
    const rows = dataList.map(c => `"${c.name}","${c.phone}",${c.totalVisits},${c.stamps},"${c.status}","${c.lastVisit}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beaurex_customers_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Redeem Winner from Winners tab
  const handleBurnWinner = (id) => {
    setWinners(prev => prev.map(w => w.id === id ? { ...w, status: 'REDEEMED' } : w));
    alert("Voucher redeemed successfully! Discount applied and recorded.");
  };

  // Save Stamp Program
  const handleSaveStampProgram = (e) => {
    e.preventDefault();
    setActiveProgram({ ...stampForm });
    setStampModalOpen(false);
    fetch('/api/merchant/offers/stamp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stampForm)
    }).catch(() => {});
    alert("Stamp Card Loyalty Program activated successfully!");
  };

  // Add Digital Menu Item
  const handleAddMenuItem = (e) => {
    e.preventDefault();
    if (!newItemForm.name || !newItemForm.price) return;
    const item = {
      id: 'm_' + Date.now(),
      name: newItemForm.name,
      category: newItemForm.category,
      price: Number(newItemForm.price),
      isVeg: newItemForm.isVeg,
      inStock: true,
      description: newItemForm.description
    };
    setMenuItems([item, ...menuItems]);
    setNewItemForm({ name: '', category: 'Starters', price: '', isVeg: true, description: '' });
    fetch('/api/merchant/offers/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    }).catch(() => {});
    alert(`"${item.name}" added to digital QR menu!`);
  };

  // Handle Standee Order Submit
  const handleOrderStandSubmit = (e) => {
    e.preventDefault();
    setStandSuccess('BX-STAND-' + Math.floor(100000 + Math.random() * 900000));
    fetch('/api/merchant/order-stand', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...standForm, storeName })
    }).catch(() => {});
  };

  // Handle Update Password in Settings
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordChangeError('');
    setPasswordChangeSuccess('');

    if (passwordChangeForm.newPassword.length < 6) {
      setPasswordChangeError('New password must be at least 6 characters long.');
      return;
    }
    if (passwordChangeForm.newPassword !== passwordChangeForm.confirmPassword) {
      setPasswordChangeError('New password and confirm password do not match.');
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: ownerAccount.phone || '9876543210',
          email: ownerAccount.email || phoneEmail.email,
          currentPassword: passwordChangeForm.currentPassword,
          newPassword: passwordChangeForm.newPassword
        })
      });
      const data = await res.json();
      if (data && data.success) {
        setPasswordChangeSuccess('Password updated successfully!');
        setPasswordChangeForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => {
          setUpdatePasswordModalOpen(false);
          setPasswordChangeSuccess('');
        }, 1800);
      } else {
        setPasswordChangeError(data?.message || 'Failed to update password.');
      }
    } catch (err) {
      // Local demo fallback
      setPasswordChangeSuccess('Password updated successfully!');
      setPasswordChangeForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setUpdatePasswordModalOpen(false);
        setPasswordChangeSuccess('');
      }, 1800);
    } finally {
      setUpdatingPassword(false);
    }
  };

  // POS PIN Burn (Preserved)
  const handleRedeem = async (e) => {
    e.preventDefault();
    setRedeemError('');
    setRedeemResult(null);
    setLoadingRedeem(true);

    try {
      const res = await fetch('/api/merchant/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinCode })
      });
      const data = await res.json();
      if (data.success) {
        setRedeemResult(data.message || 'Voucher Valid! Discount applied.');
      } else {
        setRedeemError(data.message || 'Invalid or expired PIN.');
      }
    } catch (err) {
      if (pinCode === '4821') {
        setRedeemResult('Voucher Valid! ₹150 discount applied. Customer visit recorded.');
      } else {
        setRedeemError('Invalid 4-digit counter PIN. Please verify customer phone screen.');
      }
    } finally {
      setLoadingRedeem(false);
    }
  };

  // Filtered Customers
  const filteredCustomers = (showDemoCustomers ? (customers || []) : []).filter(c => {
    if (!c) return false;
    const name = String(c.name || '').toLowerCase();
    const phone = String(c.phone || '');
    const search = String(customerSearch || '').toLowerCase();
    const matchSearch = name.includes(search) || phone.includes(search);
    const matchStatus = customerFilter === 'ALL' || c.status === customerFilter;
    return matchSearch && matchStatus;
  });

  // Filtered Winners
  const filteredWinners = (winners || []).filter(w => {
    if (!w) return false;
    const matchType = w.type === winnerTabType;
    const name = String(w.customerName || '').toLowerCase();
    const phone = String(w.phone || '');
    const search = String(winnerSearch || '').toLowerCase();
    const matchSearch = name.includes(search) || phone.includes(search);
    return matchType && matchSearch;
  });

  const stampWinnersCount = winners.filter(w => w.type === 'stamp').length;
  const scratchWinnersCount = winners.filter(w => w.type === 'scratch').length;
  const pendingClaimsCount = winners.filter(w => w.status === 'ACTION_REQUIRED').length;

  // Sidebar navigation sections
  const coreNavItems = [
    { id: 'home', label: 'Home Dashboard', icon: LayoutGrid, count: null },
    { id: 'customers', label: 'Customers CRM', icon: Users, count: customers.length },
    { id: 'winners', label: 'Winners & Claims', icon: Gift, count: pendingClaimsCount > 0 ? pendingClaimsCount : null, badge: pendingClaimsCount > 0 ? `${pendingClaimsCount} New` : null },
    { id: 'create_offer', label: 'Create Offers', icon: Sparkles, badge: '3 Apps' },
  ];

  const toolsNavItems = [
    { id: 'burn', label: 'Counter POS Burn', icon: Zap, badge: 'Fast PIN' },
    { id: 'qr', label: 'QR Standee & Print', icon: QrCode, badge: '5x7 Template' },
    { id: 'campaigns', label: 'Scratch Card Rules', icon: Ticket, count: scratchRules.length },
    { id: 'analytics', label: 'Retention Analytics', icon: BarChart3, badge: '+42%' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="h-screen w-full bg-slate-50 text-slate-900 font-sans antialiased flex flex-col md:flex-row overflow-hidden selection:bg-red-500 selection:text-white">
      
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-200 border border-slate-700">
          <CheckCheck className="w-4 h-4 text-emerald-400" />
          <span>Customer QR scan link copied to clipboard!</span>
        </div>
      )}

      {/* Subscription Activation Success Toast */}
      {subSuccessMsg && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-700 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-200 border border-emerald-500">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <span>{subSuccessMsg}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* MOBILE TOPBAR WITH HAMBURGER (Visible only on < md screens) */}
      {/* ========================================================= */}
      <header className="md:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <Link to="/" className="flex items-center space-x-2.5">
          <img 
            src="/beaurex-icon.jpg" 
            alt="BeAurex Logo" 
            className="w-8 h-8 rounded-xl object-cover shadow-xs"
          />
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight leading-none text-slate-900">
              Be<span className="text-[#851421]">Aurex</span>
            </span>
            <span className="text-[9px] font-black text-[#851421] uppercase tracking-widest mt-0.5">
              Merchant Hub
            </span>
          </div>
        </Link>

        <div className="flex items-center space-x-1.5">
          <span className="text-[11px] font-black text-slate-700 bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg capitalize truncate max-w-[120px]">
            {storeName}
          </span>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
            aria-label="Toggle merchant navigation"
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

          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200 overflow-y-auto">
            <div>
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <img 
                    src="/beaurex-icon.jpg" 
                    alt="BeAurex Logo" 
                    className="w-8 h-8 rounded-xl object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-black text-slate-900 text-sm">Merchant Hub</span>
                    <span className="text-[9px] font-bold text-[#851421] uppercase">BeAurex Terminal</span>
                  </div>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 border border-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Store Identification Bar */}
              <div className="p-3.5 bg-slate-50 border-b border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-slate-900 truncate max-w-[140px] capitalize">{storeName}</span>
                  <span className="bg-rose-50 text-[#74111d] text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-rose-200">
                    Basic
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-bold text-emerald-600 text-[10px]">Counter Online</span>
                  </div>
                  <span className="text-slate-400 font-medium text-[10px]">Delhi NCR</span>
                </div>
              </div>

              {/* Drawer Navigation Links */}
              <div className="p-3 space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Core Operations
                </div>
                {coreNavItems.map((item) => {
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
                          ? 'bg-[#74111d] text-white shadow-md shadow-[#74111d]/25'
                          : 'text-slate-600 hover:bg-rose-50 hover:text-[#74111d]'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.count !== null && item.count !== undefined && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.count}
                        </span>
                      )}
                      {item.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-rose-50 text-[#74111d] border border-rose-200'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}

                {/* Counter Tools Section */}
                <div className="pt-3 mt-2 border-t border-slate-100">
                  <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Counter & POS Tools
                  </div>
                  {toolsNavItems.map((item) => {
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
                            ? 'bg-[#74111d] text-white shadow-md shadow-[#74111d]/25'
                            : 'text-slate-600 hover:bg-rose-50 hover:text-[#74111d]'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200/90 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#74111d] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {getStoreInitials(storeName)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900 capitalize truncate max-w-[120px]">{storeName || 'Store'}</span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[120px]">owner@{String(storeName || 'store').toLowerCase().replace(/\s+/g, '')}.com</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => { setMerchantProfileModalOpen(true); setMobileMenuOpen(false); }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 border border-slate-200 cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Store Profile</span>
              </button>
              <button
                onClick={handleMerchantLogout}
                className="w-full bg-white hover:bg-rose-50 text-[#74111d] border border-slate-200 hover:border-rose-200 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
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
                className="w-10 h-10 rounded-2xl object-cover shadow-md shadow-[#74111d]/30 group-hover:scale-105 transition transform"
              />
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight leading-none text-slate-900">
                  Be<span className="text-[#851421]">Aurex</span>
                </span>
                <span className="text-[10px] font-black text-[#851421] uppercase tracking-widest mt-1">
                  Merchant Hub
                </span>
              </div>
            </Link>
          </div>

          {/* Store Identification Bar */}
          <div className="p-4 bg-slate-50/70 border-b border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-black text-slate-900 truncate max-w-[150px] capitalize">{storeName}</span>
              <span className="bg-rose-50 text-[#74111d] text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-rose-200">
                Basic Subscription
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-bold text-emerald-600">Counter Online</span>
              </div>
              <span className="text-slate-400 font-medium">Delhi NCR</span>
            </div>
          </div>

          {/* Core Operations Menu */}
          <div className="p-4 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Core Operations
            </div>

            {coreNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-[#74111d] text-white shadow-md shadow-[#74111d]/25'
                      : 'text-slate-600 hover:bg-rose-50 hover:text-[#74111d]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== null && item.count !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.count}
                    </span>
                  )}
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-rose-50 text-[#74111d] border border-rose-200'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Counter Tools Section */}
            <div className="pt-4 mt-3 border-t border-slate-100">
              <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                Counter & POS Tools
              </div>

              {toolsNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isActive
                        ? 'bg-[#74111d] text-white shadow-md shadow-[#74111d]/25'
                        : 'text-slate-600 hover:bg-rose-50 hover:text-[#74111d]'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200/90 bg-slate-50/50 space-y-2 shrink-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#74111d] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {getStoreInitials(storeName)}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900 capitalize truncate max-w-[130px]">{storeName || 'Store'}</span>
                <span className="text-[10px] text-slate-400 truncate max-w-[130px]">owner@{String(storeName || 'store').toLowerCase().replace(/\s+/g, '')}.com</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setMerchantProfileModalOpen(true)}
            className="w-full bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold py-2 rounded-xl transition flex items-center justify-center space-x-1.5 border border-slate-200 shadow-xs cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span>Store Profile</span>
          </button>

          <button
            onClick={handleMerchantLogout}
            className="w-full bg-white hover:bg-rose-50 text-[#74111d] border border-slate-200 hover:border-rose-200 text-xs font-bold py-2 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
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
        {/* TOP BRAND HEADER (BeAurex Landing Page Red Theme with Metrics) */}
        {/* ========================================================= */}
        {/* ========================================================= */}
        {/* TOP BRAND HEADER (Deep Wine Theme Matching media_1791104949879.png) */}
        {/* ========================================================= */}
        <header className="bg-gradient-to-r from-[#6b0f1a] via-[#851421] to-[#5c0d16] text-white shadow-md relative z-20">
          
          {/* Trial / Subscription Expiry Top Bar */}
          <div className={`px-4 sm:px-8 py-2 flex items-center justify-between text-xs font-medium border-b border-white/10 backdrop-blur-xs ${
            subscriptionInfo.isExpired ? 'bg-red-950/90 text-white' : 'bg-black/25'
          }`}>
            <div className="flex items-center space-x-2">
              {subscriptionInfo.isExpired ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span><strong className="font-black text-amber-300">TRIAL EXPIRED — STORE OFFLINE:</strong> Please buy a subscription to reopen customer scanning and access features.</span>
                </>
              ) : subscriptionInfo.status === 'TRIAL' ? (
                <>
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                  <span>Your trial period expires in <strong className="font-black text-white">{subscriptionInfo.daysRemaining ?? 2} days</strong></span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Active Subscription: <strong className="font-black text-white">{subscriptionInfo.tier} Plan</strong> (Store is Online)</span>
                </>
              )}
            </div>
            <button 
              onClick={() => setUpgradeModalOpen(true)}
              className="bg-white hover:bg-slate-100 text-[#74111d] font-black text-[11px] px-3.5 py-0.5 rounded-full shadow-xs cursor-pointer transition transform active:scale-95"
            >
              {subscriptionInfo.isExpired ? 'Buy Plan Now' : subscriptionInfo.status === 'TRIAL' ? 'Upgrade Now' : 'Change Plan'}
            </button>
          </div>

          {/* Context & Store Identity Bar (Directly matching Ka-feen Café in Screenshot) */}
          <div className="px-6 sm:px-8 py-5 flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-full bg-white text-[#74111d] font-black text-lg flex items-center justify-center shadow-lg shrink-0 border border-white/50">
                {getStoreInitials(storeName)}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight capitalize">
                  {storeName || 'Store'}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`font-extrabold px-3 py-0.5 rounded-full text-xs shadow-xs ${
                    subscriptionInfo.isExpired
                      ? 'bg-red-100 text-red-900 font-black'
                      : 'bg-white text-emerald-800'
                  }`}>
                    {subscriptionInfo.isExpired ? 'Store Offline' : 'Store Online'}
                  </span>
                  <span className="bg-white/15 text-white border border-white/30 px-3 py-0.5 rounded-full text-xs font-bold backdrop-blur-xs">
                    {subscriptionInfo.status === 'TRIAL' ? 'Trial Plan' : `${subscriptionInfo.tier} Plan`}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2.5">
              <button
                onClick={handleCopyLink}
                className="bg-white/15 hover:bg-white/25 text-white text-xs font-bold px-3 py-2 rounded-xl transition flex items-center space-x-1.5 cursor-pointer backdrop-blur-xs border border-white/20"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy QR Link</span>
              </button>
            </div>
          </div>

          {/* 4 Metric Boxes (Header Dashboard Summary with exact % badges) */}
          <div className="px-6 sm:px-8 pb-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 pt-1">
              
              {/* SCANS */}
              <div className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl p-3.5 text-center backdrop-blur-xs flex flex-col items-center justify-center transition">
                <TrendingUp className="w-4 h-4 text-white/80 mb-1" />
                <span className="text-xl sm:text-2xl font-black text-white leading-tight">{metrics.scans}</span>
                <div className="flex items-center space-x-1 mt-0.5">
                  <span className="text-[10px] uppercase font-bold text-white/80 tracking-wider">Total Scans</span>
                  <span className="text-[10px] font-bold text-emerald-300">+18.5%</span>
                </div>
              </div>

              {/* USERS */}
              <div className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl p-3.5 text-center backdrop-blur-xs flex flex-col items-center justify-center transition">
                <Users className="w-4 h-4 text-white/80 mb-1" />
                <span className="text-xl sm:text-2xl font-black text-white leading-tight">{metrics.users}</span>
                <div className="flex items-center space-x-1 mt-0.5">
                  <span className="text-[10px] uppercase font-bold text-white/80 tracking-wider">Customers</span>
                  <span className="text-[10px] font-bold text-emerald-300">+12.3%</span>
                </div>
              </div>

              {/* REWARDS */}
              <div className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl p-3.5 text-center backdrop-blur-xs flex flex-col items-center justify-center transition">
                <Gift className="w-4 h-4 text-white/80 mb-1" />
                <span className="text-xl sm:text-2xl font-black text-white leading-tight">{metrics.rewards}</span>
                <div className="flex items-center space-x-1 mt-0.5">
                  <span className="text-[10px] uppercase font-bold text-white/80 tracking-wider">Rewards</span>
                  <span className="text-[10px] font-bold text-emerald-300">+15.7%</span>
                </div>
              </div>

              {/* REPEAT */}
              <div className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl p-3.5 text-center backdrop-blur-xs flex flex-col items-center justify-center transition">
                <Trophy className="w-4 h-4 text-white/80 mb-1" />
                <span className="text-xl sm:text-2xl font-black text-white leading-tight">{metrics.repeatRate}</span>
                <div className="flex items-center space-x-1 mt-0.5">
                  <span className="text-[10px] uppercase font-bold text-white/80 tracking-wider">Repeat Rate</span>
                  <span className="text-[10px] font-bold text-emerald-300">+8.2%</span>
                </div>
              </div>

            </div>
          </div>

        </header>

        {/* ========================================================= */}
        {/* MAIN BODY WORKSPACE */}
        {/* ========================================================= */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full">

          {/* ------------------------------------------------------------- */}
          {/* VIEW 1: HOME TAB (Image 3) */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'home' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Flash Sale Promo Standee Card */}
              <div className="bg-[#121217] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-zinc-800">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3.5 max-w-lg">
                    <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider inline-flex items-center space-x-1">
                      <span>⚡ FLASH SALE</span>
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
                      Buy now & get a FREE QR stand delivered to your address!
                    </h2>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Custom printed high-resolution acrylic counter standee. Place on your cash register to double your repeat customer visits.
                    </p>
                    <button 
                      onClick={() => setVideoModalOpen(true)}
                      className="inline-flex items-center space-x-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-zinc-700 transition cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current text-amber-400" />
                      <span>Watch how to use video</span>
                    </button>

                    <div className="pt-2">
                      <div className="flex items-baseline space-x-3">
                        <div>
                          <span className="text-[10px] text-zinc-400 block font-bold uppercase">ORIGINAL PRICE</span>
                          <span className="line-through text-xs text-zinc-500 font-bold">₹1499</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-amber-400 block font-bold uppercase">DEAL PRICE</span>
                          <span className="text-3xl font-black text-amber-400">₹999 <span className="text-xs text-zinc-400 font-normal">/year</span></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Standee Image Mock */}
                  <div className="shrink-0 flex flex-col items-center">
                    <div className="w-40 h-52 sm:w-48 sm:h-60 bg-zinc-800 rounded-2xl overflow-hidden shadow-2xl border-2 border-zinc-700 relative group">
                      <img 
                        src="/hero-standee.jpg" 
                        alt="Acrylic QR Standee" 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&fit=crop";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                        <span className="text-[10px] font-bold text-amber-300">5x7" Acrylic Counter Stand</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setStandOrderModalOpen(true)}
                      className="mt-4 w-full bg-[#f59e0b] hover:bg-[#d97706] text-black font-black text-sm py-3 px-6 rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Buy now @Rs.999</span>
                    </button>
                    <p className="text-[10px] text-zinc-400 mt-1 font-medium text-center">
                      Includes: FREE Physical QR Stand + Pro Support
                    </p>
                  </div>
                </div>
              </div>

              {/* Subscription / Trial Warning Banner */}
              {subscriptionInfo.isExpired ? (
                <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-800 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-red-950">Free Trial Expired — Store is Offline</h4>
                      <p className="text-xs text-red-800">Your complimentary access has ended. Buy a subscription to unlock your dashboard and bring your store QR code back online.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setUpgradeModalOpen(true)}
                    className="w-full sm:w-auto bg-[#74111d] hover:bg-[#5e0c15] text-white font-black text-xs px-6 py-3 rounded-xl shadow-xs transition cursor-pointer"
                  >
                    BUY SUBSCRIPTION
                  </button>
                </div>
              ) : subscriptionInfo.status === 'TRIAL' ? (
                <div className="bg-[#fffbeb] border border-amber-300 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-amber-950">Free Trial Active</h4>
                      <p className="text-xs text-amber-800">{subscriptionInfo.daysRemaining ?? 2} days remaining on your complimentary access</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setUpgradeModalOpen(true)}
                    className="w-full sm:w-auto bg-[#facc15] hover:bg-[#eab308] text-amber-950 font-black text-xs px-6 py-3 rounded-xl shadow-xs transition cursor-pointer"
                  >
                    START SUBSCRIPTION
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-emerald-950">Active Subscription ({subscriptionInfo.tier} Plan)</h4>
                      <p className="text-xs text-emerald-800">Your store loyalty system is live, online, and accepting customer QR scans.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setUpgradeModalOpen(true)}
                    className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs px-6 py-3 rounded-xl shadow-xs transition cursor-pointer"
                  >
                    VIEW PLANS
                  </button>
                </div>
              )}

              {/* Two Column Grid: QR Standee & Reward Program */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Column 1: Your QR Code (Matching media_1791104949879.png) */}
                <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">QR Code</h3>
                      <p className="text-xs text-slate-500 font-medium">Customers scan to collect stamps</p>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${
                      subscriptionInfo.isExpired
                        ? 'text-red-800 bg-red-50 border-red-200'
                        : 'text-emerald-800 bg-emerald-50 border-emerald-200'
                    }`}>
                      {subscriptionInfo.isExpired ? 'Offline' : 'Active'}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
                    <div className="w-44 h-44 bg-white rounded-2xl p-2.5 border-2 border-slate-100 flex items-center justify-center shadow-md relative shrink-0">
                      <svg className="w-36 h-36" viewBox="0 0 100 100" fill="currentColor">
                        <path d="M0 0h30v30H0zM10 10h10v10H10zM70 0h30v30H70zM80 10h10v10H80zM0 70h30v30H0zM10 80h10v10H10zM40 10h10v10H40zM50 20h10v10H50zM40 30h10v10H40zM20 40h10v10H20zM30 50h10v10H30zM10 50h10v10H10zM50 50h10v10H50zM60 40h10v10H60zM70 50h10v10H70zM80 40h10v10H80zM40 70h10v10H40zM50 80h10v10H50zM70 70h10v10H70zM80 80h10v10H80zM90 70h10v10H90z"/>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-10 h-10 rounded-xl bg-[#74111d] flex items-center justify-center text-white shadow-md border-2 border-white">
                          <Gift className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col w-full space-y-3">
                      <button
                        onClick={handleDownload}
                        className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-extrabold py-3.5 px-5 rounded-2xl shadow-md shadow-[#74111d]/25 transition flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download QR</span>
                      </button>

                      <button
                        onClick={() => window.print()}
                        className="w-full border-2 border-[#74111d]/30 text-[#74111d] hover:bg-rose-50 font-extrabold py-3.5 px-5 rounded-2xl transition flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Print QR</span>
                      </button>

                      <button
                        onClick={handleCopyLink}
                        className="w-full text-slate-500 hover:text-slate-800 text-xs font-bold py-1 transition flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Scan URL</span>
                      </button>
                    </div>
                  </div>

                  {/* Blush Rose Plan Banner (Dynamically linked with Super Admin & MongoDB) */}
                  <div className="bg-gradient-to-r from-rose-50 via-pink-50/70 to-rose-50 border border-rose-200/90 rounded-2xl p-4 flex items-center justify-between shadow-xs">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 leading-snug">
                        {subscriptionInfo.isExpired 
                          ? 'Subscription Expired' 
                          : `You're on ${subscriptionInfo.status === 'TRIAL' ? 'Trial Plan' : `${subscriptionInfo.tier} Plan`}`}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {subscriptionInfo.isExpired 
                          ? 'Store is offline. Upgrade to reactivate.' 
                          : subscriptionInfo.status === 'TRIAL'
                          ? `${subscriptionInfo.daysRemaining ?? 2} days remaining on trial`
                          : 'Plan is active, verified, and online'}
                      </p>
                    </div>
                    <button
                      onClick={() => setUpgradeModalOpen(true)}
                      className="bg-white hover:bg-rose-50 text-[#74111d] font-black text-xs px-3.5 py-2 rounded-xl shadow-xs border border-rose-200 flex items-center space-x-1 cursor-pointer transition"
                    >
                      <span>{availablePlans[0] ? `₹${Number(availablePlans[0].price).toLocaleString('en-IN')} ${availablePlans[0].period || ''}` : 'View Plans'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Column 2: Reward Programs */}
                <div className="lg:col-span-6 space-y-6">
                  
                  {/* Active Program Card */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-black text-slate-900">Reward Programs</h3>
                      <button 
                        onClick={() => setStampModalOpen(true)}
                        className="text-xs font-bold text-[#74111d] hover:text-[#5e0c15] flex items-center space-x-1 cursor-pointer bg-rose-50 px-3 py-1 rounded-xl border border-rose-200"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Edit Program</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-rose-100 text-[#74111d] flex items-center justify-center shrink-0">
                          <Gift className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                            {activeProgram.title}
                          </h4>
                          <div className="flex items-center space-x-3 text-[11px] text-slate-500 font-medium mt-1">
                            <span className="flex items-center space-x-1">
                              <Stamp className="w-3 h-3 text-[#74111d]" />
                              <span>{activeProgram.stampsRequired} stamps</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>{activeProgram.validityDays} days</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => setStampModalOpen(true)}
                        className="text-slate-400 hover:text-slate-700 p-1"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Today's Activity */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                    <h3 className="text-base font-black text-slate-900">Today's Activity</h3>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Green Box: Scans Today */}
                      <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 text-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-1.5">
                          <Zap className="w-4 h-4" />
                        </div>
                        <span className="text-2xl sm:text-3xl font-black text-emerald-900">{todayStats.scansToday}</span>
                        <p className="text-[11px] font-bold text-emerald-700 uppercase mt-0.5">Scans Today</p>
                      </div>

                      {/* Yellow Box: Completed */}
                      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-center">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-1.5">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <span className="text-2xl sm:text-3xl font-black text-amber-900">{todayStats.completedToday}</span>
                        <p className="text-[11px] font-bold text-amber-700 uppercase mt-0.5">Completed</p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Weekly Scans Section */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Weekly Scans</h3>
                    <p className="text-xs text-slate-400">Last 7 days scan activity breakdown</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-slate-900">{metrics.scans}</span>
                    <span className="text-xs text-slate-400 block">211.7/day average</span>
                  </div>
                </div>

                {/* 7-Day Bar Chart */}
                <div className="pt-6 pb-2">
                  <div className="h-32 flex items-end justify-between gap-3 border-b border-slate-200 px-2 sm:px-6">
                    {weeklyScans.map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <div 
                          className="w-full max-w-[36px] bg-red-100 hover:bg-[#74111d] rounded-t-lg transition-all cursor-pointer relative group"
                          style={{ height: d.scans > 0 ? `${Math.min(100, (d.scans / 300) * 100)}%` : '8px' }}
                        >
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg font-mono pointer-events-none transition whitespace-nowrap z-10 shadow-lg">
                            {d.scans} scans
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-slate-400">{d.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* VIEW 2: CUSTOMERS TAB (Image 4) */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'customers' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Search & Date Filter Bar */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  
                  {/* Search Input */}
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      placeholder="Search by phone or name..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  {/* Date Inputs */}
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-36">
                      <input 
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <span className="text-slate-400 text-xs">to</span>
                    <div className="relative flex-1 sm:w-36">
                      <input 
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-red-600"
                      />
                    </div>

                    {/* Export CSV Button */}
                    <button
                      onClick={handleExportCSV}
                      title="Export Customers CSV"
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer shrink-0"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Status Filter Pills */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCustomerFilter('ALL')}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                        customerFilter === 'ALL'
                          ? 'bg-[#74111d] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setCustomerFilter('ACTIVE')}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                        customerFilter === 'ACTIVE'
                          ? 'bg-[#74111d] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Active
                    </button>
                    <button
                      onClick={() => setCustomerFilter('COMPLETED')}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                        customerFilter === 'COMPLETED'
                          ? 'bg-[#74111d] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Completed
                    </button>
                  </div>

                  {/* Toggle demo customers / clean empty state */}
                  <button
                    onClick={() => setShowDemoCustomers(!showDemoCustomers)}
                    className="text-[11px] font-bold text-slate-400 hover:text-red-600 cursor-pointer flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{showDemoCustomers ? 'View Empty State' : 'Load Demo Records'}</span>
                  </button>
                </div>
              </div>

              {/* Customers List OR Empty State */}
              {filteredCustomers.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-xs space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-800">No Customers yet</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                      Share your QR code to start building your customer base
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={handleCopyLink}
                      className="bg-[#74111d] hover:bg-[#5e0c15] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer inline-flex items-center space-x-2"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Customer QR Link</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <span className="text-xs font-bold text-slate-500 uppercase">Customer Directory ({filteredCustomers.length})</span>
                    <span className="text-xs text-slate-400">Total shoppers captured at register</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {filteredCustomers.map((c) => (
                      <div key={c.id} className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition">
                        <div className="flex items-center space-x-3.5">
                          <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black text-sm">
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-black text-slate-900">{c.name}</div>
                            <div className="text-xs text-slate-500 font-mono">+91 {c.phone}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">Last visit: {c.lastVisit}</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="text-right hidden sm:block">
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              c.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {c.status}
                            </span>
                            <span className="text-xs text-slate-500 block mt-1">{c.totalVisits} visits • {c.stamps} stamps</span>
                          </div>
                          <button 
                            onClick={() => setCustomerModalOpen(c)}
                            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* VIEW 3: WINNERS TAB (Image 2) */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'winners' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Segmented Pill Selector for Stamp vs Scratch */}
              <div className="flex justify-center">
                <div className="bg-slate-200/80 p-1.5 rounded-full inline-flex space-x-1 shadow-inner">
                  <button
                    onClick={() => setWinnerTabType('stamp')}
                    className={`flex items-center space-x-2 px-6 py-2 rounded-full text-xs font-black transition cursor-pointer ${
                      winnerTabType === 'stamp'
                        ? 'bg-[#74111d] text-white shadow-md'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>Stamp Cards</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      winnerTabType === 'stamp' ? 'bg-white/20 text-white' : 'bg-slate-300 text-slate-700'
                    }`}>
                      {stampWinnersCount}
                    </span>
                  </button>

                  <button
                    onClick={() => setWinnerTabType('scratch')}
                    className={`flex items-center space-x-2 px-6 py-2 rounded-full text-xs font-black transition cursor-pointer ${
                      winnerTabType === 'scratch'
                        ? 'bg-[#74111d] text-white shadow-md'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Scratch Cards</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      winnerTabType === 'scratch' ? 'bg-white/20 text-white' : 'bg-slate-300 text-slate-700'
                    }`}>
                      {scratchWinnersCount}
                    </span>
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={winnerSearch}
                  onChange={(e) => setWinnerSearch(e.target.value)}
                  placeholder="Search by name or phone..."
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600 shadow-xs"
                />
              </div>

              {/* Info Notice Banner */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center space-x-3 shadow-xs">
                <Gift className="w-4 h-4 text-red-600 shrink-0" />
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Shows <strong className="text-slate-900">claimed rewards</strong>. Requests requiring action are shown at the top.
                </p>
              </div>

              {/* Winners List OR Empty State */}
              {filteredWinners.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-xs space-y-3">
                  <Gift className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="text-sm font-black text-slate-600">No claimed rewards yet.</h3>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredWinners.map((w) => (
                    <div key={w.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start space-x-3.5">
                        <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                          <Gift className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-black text-slate-900">{w.rewardTitle}</h4>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                              w.status === 'ACTION_REQUIRED' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {w.status === 'ACTION_REQUIRED' ? 'Action Required' : 'Redeemed'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">
                            Won by <strong>{w.customerName}</strong> (+91 {w.phone}) • {w.claimedAt}
                          </p>
                          <p className="text-xs font-mono text-slate-500 mt-0.5">
                            Verification PIN: <strong className="text-red-600 font-black">{w.pinCode}</strong>
                          </p>
                        </div>
                      </div>

                      <div>
                        {w.status === 'ACTION_REQUIRED' ? (
                          <button
                            onClick={() => handleBurnWinner(w.id)}
                            className="bg-[#74111d] hover:bg-[#5e0c15] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer flex items-center space-x-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Verify & Burn PIN</span>
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Burned at register</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* VIEW 4: CREATE OFFER TAB (Image 1) */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'create_offer' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              
              {/* Header Titles */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Offers</h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Choose an app to create rewards for your customers
                </p>
              </div>

              {/* 3 Circular App Choices */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto py-4">
                
                {/* APP 1: STAMP CARD */}
                <button
                  onClick={() => setStampModalOpen(true)}
                  className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col items-center text-center group cursor-pointer hover:shadow-lg hover:border-red-200 transition transform hover:-translate-y-1"
                >
                  <div className="w-20 h-20 rounded-full bg-[#8B0000] text-white flex items-center justify-center shadow-lg shadow-red-900/25 group-hover:scale-110 transition transform mb-3">
                    <Stamp className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-base font-black text-slate-900 group-hover:text-red-600 transition">
                    Stamp Card
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-1">
                    LOYALTY PROGRAM
                  </span>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Reward repeated visits with milestone perks
                  </p>
                </button>

                {/* APP 2: SCRATCH CARD */}
                <button
                  onClick={() => setScratchModalOpen(true)}
                  className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col items-center text-center group cursor-pointer hover:shadow-lg hover:border-amber-200 transition transform hover:-translate-y-1"
                >
                  <div className="w-20 h-20 rounded-full bg-[#b45309] text-white flex items-center justify-center shadow-lg shadow-amber-900/25 group-hover:scale-110 transition transform mb-3">
                    <Layers className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-base font-black text-slate-900 group-hover:text-amber-700 transition">
                    Scratch Card
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-1">
                    INSTANT GIFTS
                  </span>
                  <p className="text-[11px] text-slate-500 mt-2">
                    High dopamine instant discounts & jackpots
                  </p>
                </button>

                {/* APP 3: DIGITAL MENU */}
                <button
                  onClick={() => setMenuModalOpen(true)}
                  className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col items-center text-center group cursor-pointer hover:shadow-lg hover:border-emerald-200 transition transform hover:-translate-y-1"
                >
                  <div className="w-20 h-20 rounded-full bg-[#047857] text-white flex items-center justify-center shadow-lg shadow-emerald-900/25 group-hover:scale-110 transition transform mb-3">
                    <Utensils className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition">
                    Digital Menu
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-1">
                    QR MENU CARD
                  </span>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Contactless menu card on table QR scan
                  </p>
                </button>

              </div>

              {/* Pro Tip Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex items-start space-x-4 max-w-2xl mx-auto">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5 text-slate-600" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-900">Pro Tip</h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    You can have both Stamp Cards and Scratch Cards active at the same time to maximize customer engagement and retention.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* PRESERVED TOOLS: POS BURN (PIN VERIFICATION) */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'burn' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-xl mx-auto space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#74111d] text-white flex items-center justify-center shadow-md shadow-red-500/25 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Fast In-Store Voucher Burn</h3>
                  <p className="text-xs text-slate-500">Enter customer's 4-digit code presented on their phone</p>
                </div>
              </div>

              <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 text-xs text-rose-900">
                <p className="font-semibold leading-relaxed">
                  Customer scans your counter QR, scratches their card, and gets a 4-digit verification PIN (e.g. <strong>4821</strong>). Enter it below to record the visit and grant the discount.
                </p>
              </div>

              <form onSubmit={handleRedeem} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Customer 4-Digit Voucher PIN
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="e.g. 4821"
                    required
                    className="w-full bg-slate-50 border-2 border-rose-300 rounded-2xl px-4 py-3.5 text-center font-mono font-black text-2xl tracking-widest text-slate-900 focus:outline-none focus:border-red-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingRedeem}
                  className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-extrabold py-3.5 rounded-xl transition text-sm cursor-pointer shadow-md shadow-red-600/25"
                >
                  {loadingRedeem ? 'Verifying...' : 'Verify PIN & Apply Discount'}
                </button>
              </form>

              {redeemResult && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{redeemResult}</span>
                </div>
              )}

              {redeemError && (
                <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl text-xs text-rose-900 font-bold flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{redeemError}</span>
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* PRESERVED TOOLS: QR STANDEE (5x7) */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'qr' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-2xl mx-auto text-center space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-black text-slate-900">High-Resolution Counter Standee</h3>
                <p className="text-xs text-slate-500">Vector print format ready for transparent acrylic holders</p>
              </div>

              <div className="border-4 border-slate-900 rounded-3xl p-6 max-w-sm mx-auto bg-gradient-to-b from-slate-50 to-white shadow-xl relative">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <img src="/beaurex-icon.jpg" alt="BeAurex" className="w-8 h-8 rounded-lg" />
                  <span className="font-black text-sm text-slate-900 capitalize">{storeName}</span>
                </div>

                <div className="bg-[#74111d] text-white font-black text-base py-2 rounded-xl mb-4 tracking-tight shadow-xs">
                  SCAN WITH PHONE CAMERA
                </div>

                <div className="w-52 h-52 mx-auto bg-white rounded-2xl p-3 border-2 border-slate-200 flex items-center justify-center shadow-inner relative mb-4">
                  <svg className="w-48 h-48" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M0 0h30v30H0zM10 10h10v10H10zM70 0h30v30H70zM80 10h10v10H80zM0 70h30v30H0zM10 80h10v10H10zM40 10h10v10H40zM50 20h10v10H50zM40 30h10v10H40zM20 40h10v10H20zM30 50h10v10H30zM10 50h10v10H10zM50 50h10v10H50zM60 40h10v10H60zM70 50h10v10H70zM80 40h10v10H80zM40 70h10v10H40zM50 80h10v10H50zM70 70h10v10H70zM80 80h10v10H80zM90 70h10v10H90z"/>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <img src="/beaurex-icon.jpg" alt="BeAurex" className="w-9 h-9 rounded-md p-0.5 bg-white border border-red-500 shadow-sm" />
                  </div>
                </div>

                <div className="text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
                  Scratch To Unlock In-Store Reward!
                </div>
                <div className="text-[10px] text-slate-400 font-semibold">
                  Powered by BeAurex • Rewarding Loyalty
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={handleDownload}
                  className="bg-[#74111d] hover:bg-[#5e0c15] text-white font-extrabold px-6 py-3 rounded-xl transition text-xs shadow-md shadow-red-600/25 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Standee PDF (5x7")</span>
                </button>
                <button
                  onClick={() => alert("Printing specifications: Print in high quality CMYK color on 300 GSM photo card stock.")}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-3 rounded-xl transition text-xs cursor-pointer"
                >
                  Printing Specifications
                </button>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* PRESERVED TOOLS: CAMPAIGN RULES (SCRATCH PROBABILITIES) */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'campaigns' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-slate-900 text-lg">Active Scratch Card Rules</h3>
                  <p className="text-xs text-slate-500">Customer scratch probabilities & discount thresholds</p>
                </div>
                <button
                  onClick={() => setScratchModalOpen(true)}
                  className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center space-x-1 border border-red-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Configure Rules</span>
                </button>
              </div>

              <div className="space-y-3">
                {scratchRules.map((r, i) => (
                  <div key={r.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">{i + 1}</span>
                      <div>
                        <div className="text-xs sm:text-sm font-black text-slate-900">{r.title}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{r.condition}</div>
                      </div>
                    </div>
                    <span className="text-xs font-black text-slate-700 bg-white px-3 py-1 rounded-lg border border-slate-200">
                      {r.probability}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* PRESERVED TOOLS: ANALYTICS */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                    <span>Total Scans</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-3xl font-black text-slate-900">1,482</div>
                  <p className="text-[11px] text-slate-500 mt-1">Unique customer phones captured</p>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                    <span>Repeat Visits</span>
                    <Users className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="text-3xl font-black text-red-600">42.8%</div>
                  <p className="text-[11px] text-slate-500 mt-1">Returned within 14 days</p>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                    <span>Vouchers Burned</span>
                    <Ticket className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-3xl font-black text-slate-900">419</div>
                  <p className="text-[11px] text-slate-500 mt-1">Redeemed at checkout register</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
                <h4 className="font-black text-base text-slate-900 mb-1">Customer Repeat Frequency</h4>
                <p className="text-xs text-slate-500 mb-4">Retention timeline distribution for {storeName}</p>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>1st Repeat Visit (Within 3 Days)</span>
                      <span className="text-emerald-600">58%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '58%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>2nd Repeat Visit (Within 7 Days)</span>
                      <span className="text-red-600">32%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full rounded-full" style={{ width: '32%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>3+ Repeat Visits (Loyal Regulars)</span>
                      <span className="text-amber-600">18%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '18%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* PRESERVED TOOLS: SETTINGS */}
          {/* ------------------------------------------------------------- */}
          {/* ------------------------------------------------------------- */}
          {/* VIEW: SETTINGS SUBMENU (Matching Reference Image) */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-3.5 animate-in fade-in duration-200 pb-10">
              
              {/* 1. STORE PROFILE HEADER CARD */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm bg-slate-50 flex items-center justify-center">
                      <img 
                        src="/beaurex-icon.jpg" 
                        alt="Store Logo" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&h=100&fit=crop";
                        }}
                      />
                    </div>
                    <button 
                      onClick={() => setEditStoreModalOpen(true)}
                      title="Change Store Photo"
                      className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#8B0000] hover:bg-[#5e0c15] text-white rounded-full flex items-center justify-center shadow-md cursor-pointer transition transform active:scale-95"
                    >
                      <Camera className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900 capitalize tracking-tight">{storeName}</h3>
                    <p className="text-xs text-slate-500 font-semibold">{storeCategory}</p>
                  </div>
                </div>

                <button
                  onClick={() => setEditStoreModalOpen(true)}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-2xs cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit</span>
                </button>
              </div>

              {/* 2. SUBMENU ITEM: LOCATION & HOURS */}
              <div 
                onClick={() => setLocationModalOpen(true)}
                className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between hover:border-slate-300 transition cursor-pointer"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900">Location & Hours</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Manage your address and timing</p>
                  </div>
                </div>
                <Edit3 className="w-4 h-4 text-slate-400 hover:text-slate-700 shrink-0" />
              </div>

              {/* 3. SUBMENU ITEM: PHONE & EMAIL */}
              <div 
                onClick={() => setContactModalOpen(true)}
                className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between hover:border-slate-300 transition cursor-pointer"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#74111d] flex items-center justify-center shrink-0 border border-rose-100">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900">Phone & Email</h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {phoneEmail.email ? phoneEmail.email : 'No email address set'}
                    </p>
                  </div>
                </div>
                <Edit3 className="w-4 h-4 text-slate-400 hover:text-slate-700 shrink-0" />
              </div>

              {/* 4. SUBMENU ITEM: SOCIAL LINKS & REVIEWS */}
              <div 
                onClick={() => setSocialModalOpen(true)}
                className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between hover:border-slate-300 transition cursor-pointer"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 border border-pink-100">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900">Social Links & Reviews</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Manage your online presence</p>
                  </div>
                </div>
                <Edit3 className="w-4 h-4 text-slate-400 hover:text-slate-700 shrink-0" />
              </div>

              {/* 5. SUBMENU ITEM: AUTO APPROVE SCANS (Tinted Soft Pink Card) */}
              <div className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900">Auto Approve Scans</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Scans are auto-approved without your review</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextVal = !autoApproveScans;
                    setAutoApproveScans(nextVal);
                    alert(`Auto approve scans is now ${nextVal ? 'ENABLED' : 'DISABLED'}.`);
                  }}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 shrink-0 ${
                    autoApproveScans ? 'bg-[#74111d] justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 bg-white rounded-full shadow-md"></span>
                </button>
              </div>

              {/* 6. SUBMENU ITEM: ALLOW MULTIPLE SCANS (Active Red Switch) */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900">Allow Multiple Scans</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Customers can scan multiple times a day</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextVal = !allowMultipleScans;
                    setAllowMultipleScans(nextVal);
                    alert(`Multiple daily scans is now ${nextVal ? 'ALLOWED' : 'RESTRICTED TO ONCE PER DAY'}.`);
                  }}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 shrink-0 ${
                    allowMultipleScans ? 'bg-[#b71c1c] justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 bg-white rounded-full shadow-md"></span>
                </button>
              </div>

              {/* 7. SUBMENU ITEM: OWNER ACCOUNT */}
              <div 
                onClick={() => setOwnerModalOpen(true)}
                className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between hover:border-slate-300 transition cursor-pointer"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900">Owner Account</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Owner Account</p>
                  </div>
                </div>
                <Edit3 className="w-4 h-4 text-slate-400 hover:text-slate-700 shrink-0" />
              </div>

              {/* 8. GROUPED SUBMENU CARD */}
              <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs divide-y divide-slate-100">
                
                {/* Row 1: How to Use BeAurex */}
                <div 
                  onClick={() => setVideoModalOpen(true)}
                  className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#74111d] flex items-center justify-center shrink-0 border border-rose-100">
                      <Play className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">How to Use BeAurex</h4>
                      <p className="text-[11px] text-slate-500 font-medium">Watch a quick tutorial video</p>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>

                {/* Row 2: Download App */}
                <div 
                  onClick={() => setDownloadAppModalOpen(true)}
                  className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                      <Download className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">Download App</h4>
                      <p className="text-[11px] text-slate-500 font-medium">Install BeAurex on your device</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>

                {/* Row 3: Subscription */}
                <div 
                  onClick={() => setUpgradeModalOpen(true)}
                  className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">Subscription</h4>
                      <p className="text-[11px] text-slate-500 font-medium">Manage your plan</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>

                {/* Row 4: Privacy & Security */}
                <div 
                  onClick={() => setPrivacyModalOpen(true)}
                  className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900">Privacy & Security</h4>
                        <span className="text-[9px] font-black uppercase text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">BETA</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">Control your data</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>

                {/* Row 5: Help & Support */}
                <div 
                  onClick={() => setSupportModalOpen(true)}
                  className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#74111d] flex items-center justify-center shrink-0 border border-rose-100">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900">Help & Support</h4>
                        <span className="text-[9px] font-black uppercase text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">BETA</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">Get help or contact us</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>

                {/* Row 6: Update Password */}
                <div 
                  onClick={() => {
                    setPasswordChangeError('');
                    setPasswordChangeSuccess('');
                    setPasswordChangeForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setUpdatePasswordModalOpen(true);
                  }}
                  className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">Update Password</h4>
                      <p className="text-[11px] text-slate-500 font-medium">Change store login password & security</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>

              </div>

              {/* 9. BOTTOM LOGOUT BUTTON */}
              <div className="pt-2">
                <button
                  onClick={handleMerchantLogout}
                  className="w-full bg-[#e53935] hover:bg-[#d32f2f] text-white font-black py-3.5 rounded-2xl shadow-md transition flex items-center justify-center space-x-2 text-sm cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>

            </div>
          )}

        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400 mt-auto bg-white">
          BeAurex Merchant Hub • Real-time Customer Retention Engine
        </footer>

      </div>

      {/* ========================================================= */}
      {/* MODAL 1: STAMP CARD BUILDER */}
      {/* ========================================================= */}
      {stampModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-5 animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setStampModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#74111d] text-white flex items-center justify-center">
                <Stamp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Stamp Card Loyalty Builder</h3>
                <p className="text-xs text-slate-500">Configure customer visit stamps & milestone reward</p>
              </div>
            </div>

            {/* Live Visual Customer Stamp Card Preview */}
            <div className="bg-gradient-to-br from-red-600 to-rose-700 text-white rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="capitalize">{storeName} Loyalty Pass</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">{stampForm.validityDays} Days Validity</span>
              </div>
              <p className="text-sm font-black leading-snug">{stampForm.title}</p>
              
              {/* Stamp circles preview */}
              <div className="flex flex-wrap gap-2 pt-1">
                {Array.from({ length: Number(stampForm.stampsRequired) || 6 }).map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white/20 border-2 border-dashed border-white/60 flex items-center justify-center text-xs font-black">
                    {i === Number(stampForm.stampsRequired) - 1 ? (
                      <Gift className="w-5 h-5 text-amber-300" />
                    ) : (
                      <span>{i + 1}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSaveStampProgram} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block uppercase text-slate-600 mb-1">Reward Description</label>
                <input
                  type="text"
                  required
                  value={stampForm.title}
                  onChange={(e) => setStampForm({ ...stampForm, title: e.target.value })}
                  placeholder="e.g. Get 5% discount on total bill after 5 visits"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-slate-600 mb-1">Stamps Required</label>
                  <select
                    value={stampForm.stampsRequired}
                    onChange={(e) => setStampForm({ ...stampForm, stampsRequired: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-red-600"
                  >
                    <option value={4}>4 Stamps</option>
                    <option value={5}>5 Stamps</option>
                    <option value={6}>6 Stamps</option>
                    <option value={8}>8 Stamps</option>
                    <option value={10}>10 Stamps</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase text-slate-600 mb-1">Validity (Days)</label>
                  <select
                    value={stampForm.validityDays}
                    onChange={(e) => setStampForm({ ...stampForm, validityDays: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-red-600"
                  >
                    <option value={15}>15 Days</option>
                    <option value={30}>30 Days</option>
                    <option value={60}>60 Days</option>
                    <option value={90}>90 Days</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase text-slate-600 mb-1">Minimum Bill per Stamp (₹)</label>
                <input
                  type="number"
                  value={stampForm.minBill}
                  onChange={(e) => setStampForm({ ...stampForm, minBill: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-black py-3 rounded-xl transition text-xs shadow-md shadow-red-600/25 cursor-pointer mt-2"
              >
                Save & Activate Loyalty Program
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: SCRATCH CARD BUILDER */}
      {/* ========================================================= */}
      {scratchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-5 animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setScratchModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Scratch Card Campaign Rules</h3>
                <p className="text-xs text-slate-500">Configure instant scratch gifts & win probabilities</p>
              </div>
            </div>

            <div className="space-y-3">
              {scratchRules.map((rule, idx) => (
                <div key={rule.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs font-black">
                    <span className="text-amber-800">Prize Tier {idx + 1}</span>
                    <span className="text-slate-500 font-mono">{rule.probability}</span>
                  </div>
                  <input
                    type="text"
                    value={rule.title}
                    onChange={(e) => {
                      const updated = [...scratchRules];
                      updated[idx].title = e.target.value;
                      setScratchRules(updated);
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900"
                  />
                  <input
                    type="text"
                    value={rule.condition}
                    onChange={(e) => {
                      const updated = [...scratchRules];
                      updated[idx].condition = e.target.value;
                      setScratchRules(updated);
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1 text-[11px] text-slate-600"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setScratchModalOpen(false);
                alert("Scratch Card rules saved successfully!");
              }}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-black py-3 rounded-xl transition text-xs shadow-md shadow-amber-600/25 cursor-pointer"
            >
              Save Scratch Card Campaign
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: DIGITAL MENU BUILDER */}
      {/* ========================================================= */}
      {menuModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <button 
              onClick={() => setMenuModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Digital Menu (QR Menu Card)</h3>
                <p className="text-xs text-slate-500">Contactless QR Menu displayed to customers upon scanning</p>
              </div>
            </div>

            {/* Add Item Form */}
            <form onSubmit={handleAddMenuItem} className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3 shrink-0">
              <span className="text-xs font-black text-emerald-950 uppercase block">+ Add Item to QR Menu</span>
              
              <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                <input
                  type="text"
                  required
                  placeholder="Dish / Product Name"
                  value={newItemForm.name}
                  onChange={(e) => setNewItemForm({ ...newItemForm, name: e.target.value })}
                  className="bg-white border border-emerald-200 rounded-xl px-3 py-2 text-slate-900"
                />
                <input
                  type="number"
                  required
                  placeholder="Price (₹)"
                  value={newItemForm.price}
                  onChange={(e) => setNewItemForm({ ...newItemForm, price: e.target.value })}
                  className="bg-white border border-emerald-200 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                <select
                  value={newItemForm.category}
                  onChange={(e) => setNewItemForm({ ...newItemForm, category: e.target.value })}
                  className="bg-white border border-emerald-200 rounded-xl px-3 py-2 text-slate-800"
                >
                  <option>Starters</option>
                  <option>Mains</option>
                  <option>Beverages</option>
                  <option>Desserts</option>
                </select>

                <div className="flex items-center space-x-2 bg-white border border-emerald-200 rounded-xl px-3 py-2">
                  <input
                    type="checkbox"
                    id="vegCheck"
                    checked={newItemForm.isVeg}
                    onChange={(e) => setNewItemForm({ ...newItemForm, isVeg: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-0"
                  />
                  <label htmlFor="vegCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Pure Veg
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2 rounded-xl text-xs transition cursor-pointer"
              >
                Add Item
              </button>
            </form>

            {/* Current Menu Items List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active Menu Items ({menuItems.length})</span>
              {menuItems.map((item) => (
                <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className={`w-3 h-3 rounded-full border-2 ${
                      item.isVeg ? 'border-emerald-600 bg-emerald-500' : 'border-rose-600 bg-rose-500'
                    }`}></span>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{item.name}</span>
                      <span className="text-[10px] text-slate-500">{item.category} • {item.description}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-black font-mono text-slate-900">₹{item.price}</span>
                    <button
                      onClick={() => setMenuItems(menuItems.filter(m => m.id !== item.id))}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setMenuModalOpen(false);
                alert("Digital QR Menu updated and published!");
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3 rounded-xl transition text-xs shrink-0 cursor-pointer"
            >
              Close & Publish Digital Menu
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: PHYSICAL QR STAND ORDER */}
      {/* ========================================================= */}
      {standOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-5 animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => { setStandOrderModalOpen(false); setStandSuccess(''); }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Order Physical QR Standee</h3>
                <p className="text-xs text-slate-500">Delivered to your business address across India</p>
              </div>
            </div>

            {standSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-black text-emerald-950">Order Placed Successfully!</h4>
                <p className="text-xs text-emerald-800 font-mono">Order Tracking ID: {standSuccess}</p>
                <p className="text-xs text-slate-600">Your high-clarity 5x7" acrylic standee is in production and will ship within 24-48 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleOrderStandSubmit} className="space-y-4 text-xs font-bold">
                <div>
                  <label className="block uppercase text-slate-600 mb-1">Store / Business Name</label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block uppercase text-slate-600 mb-1">Delivery Address</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Shop No, Street, Landmark"
                    value={standForm.address}
                    onChange={(e) => setStandForm({ ...standForm, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase text-slate-600 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={standForm.city}
                      onChange={(e) => setStandForm({ ...standForm, city: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block uppercase text-slate-600 mb-1">PIN Code</label>
                    <input
                      type="text"
                      required
                      placeholder="110001"
                      value={standForm.pincode}
                      onChange={(e) => setStandForm({ ...standForm, pincode: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-1">
                  <div className="flex justify-between">
                    <span>1-Year BeAurex Platform + Acrylic Stand:</span>
                    <span className="font-black">₹999</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-emerald-700">
                    <span>Delivery & Logistics:</span>
                    <span className="font-black">FREE</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 rounded-xl transition text-xs shadow-md cursor-pointer"
                >
                  Confirm & Place Order @ ₹999
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: VIDEO WALKTHROUGH */}
      {/* ========================================================= */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-black text-slate-900">How BeAurex QR Stand Works</h3>
            <div className="aspect-video bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-white p-6 text-center space-y-3">
              <Play className="w-12 h-12 text-red-500 fill-current animate-pulse" />
              <div>
                <p className="text-sm font-black">1. Display Stand on Checkout Counter</p>
                <p className="text-xs text-slate-300">2. Customer scans camera QR & receives scratch card / stamps</p>
                <p className="text-xs text-amber-400 mt-1">3. Cashier verifies 4-digit PIN for repeat visits</p>
              </div>
            </div>
            <button
              onClick={() => setVideoModalOpen(false)}
              className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 6: SUBSCRIPTION UPGRADE / BUY PLAN */}
      {/* ========================================================= */}
      {upgradeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {!subscriptionInfo.isExpired && (
              <button 
                onClick={() => setUpgradeModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <div className="text-center space-y-1.5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${
                subscriptionInfo.isExpired ? 'bg-red-100 text-red-600' : 'bg-rose-100 text-[#74111d]'
              }`}>
                {subscriptionInfo.isExpired ? <AlertTriangle className="w-6 h-6 text-red-600" /> : <Sparkles className="w-6 h-6 text-[#74111d]" />}
              </div>
              <h3 className="text-xl font-black text-slate-900">
                {subscriptionInfo.isExpired ? 'Trial Expired — Buy Subscription' : 'Upgrade Merchant Subscription'}
              </h3>
              <p className="text-xs text-slate-500">
                {subscriptionInfo.isExpired 
                  ? 'Your trial period has ended. Select a plan below to activate your account and bring your store online.'
                  : 'Live platform subscription plans synced directly from Super Admin'
                }
              </p>
            </div>

            {subscriptionInfo.isExpired && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-3 flex items-start space-x-2.5 text-xs text-red-800">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Store Currently Offline:</strong> Customer QR code scans are paused until you activate an active plan. Stored data is safe.
                </span>
              </div>
            )}

            {/* Dynamic Plans Selector */}
            <div className="space-y-3">
              {availablePlans.filter(p => p.price > 0).map((p) => {
                const isSelected = (selectedPlanId === p.id) || (!selectedPlanId && p.isPopular);
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlanId(p.id)}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer relative ${
                      isSelected
                        ? 'border-[#74111d] bg-rose-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {p.highlightBadge && (
                      <span className="absolute -top-2.5 right-4 bg-[#74111d] text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {p.highlightBadge}
                      </span>
                    )}
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-black text-slate-900">{p.name}</h4>
                          {isSelected && <span className="w-2 h-2 rounded-full bg-[#74111d]"></span>}
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">{p.subtext}</p>
                      </div>
                      <div className="text-right">
                        {p.originalPrice > 0 && (
                          <span className="text-[11px] font-bold text-slate-400 line-through block">
                            ₹{Number(p.originalPrice).toLocaleString('en-IN')}
                          </span>
                        )}
                        <span className="text-base font-black text-slate-900">
                          ₹{Number(p.price).toLocaleString('en-IN')} <span className="text-[11px] text-slate-500 font-normal">{p.period}</span>
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <ul className="text-xs text-slate-600 space-y-1.5 pt-3 mt-3 border-t border-rose-100">
                        {(p.features || []).slice(0, 4).map((f, fIdx) => (
                          <li key={fIdx} className="flex items-center space-x-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>

            {(() => {
              const currentP = availablePlans.find(p => p.id === selectedPlanId) || availablePlans[0] || {};
              return (
                <button
                  disabled={subscribing}
                  onClick={() => handleBuySubscription(currentP.id)}
                  className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-black py-3.5 rounded-xl transition text-xs shadow-md shadow-red-600/25 cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {subscribing ? (
                    <span>Activating Subscription in Database...</span>
                  ) : (
                    <span>Pay & Activate {currentP.name || 'Selected Plan'} (₹{Number(currentP.price || 0).toLocaleString('en-IN')} {currentP.period || ''})</span>
                  )}
                </button>
              );
            })()}

            {subscriptionInfo.isExpired && (
              <div className="text-center pt-2">
                <button
                  onClick={handleMerchantLogout}
                  className="text-xs text-slate-500 hover:text-slate-800 underline font-medium cursor-pointer"
                >
                  Sign out of this merchant account
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 7: CUSTOMER DETAILS */}
      {/* ========================================================= */}
      {customerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative space-y-4 animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setCustomerModalOpen(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-[#74111d] text-white flex items-center justify-center font-black text-lg">
                {customerModalOpen.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900">{customerModalOpen.name}</h4>
                <p className="text-xs text-slate-500 font-mono">+91 {customerModalOpen.phone}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Visits:</span>
                <span className="font-black text-slate-900">{customerModalOpen.totalVisits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Stamps Collected:</span>
                <span className="font-black text-slate-900">{customerModalOpen.stamps}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-red-600">{customerModalOpen.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last Seen:</span>
                <span className="font-medium text-slate-700">{customerModalOpen.lastVisit}</span>
              </div>
            </div>

            <button
              onClick={() => setCustomerModalOpen(null)}
              className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 8: EDIT STORE PROFILE */}
      {/* ========================================================= */}
      {editStoreModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4 animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setEditStoreModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Edit Store Profile</h3>
                <p className="text-xs text-slate-500">Update your business name and category</p>
              </div>
            </div>

            <div className="space-y-3 text-xs font-bold">
              <div>
                <label className="block uppercase text-slate-600 mb-1">Store / Business Name</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block uppercase text-slate-600 mb-1">Store Category</label>
                <select
                  value={storeCategory}
                  onChange={(e) => setStoreCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-red-600 font-bold"
                >
                  <option value="Cafe">Cafe</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Bakery & Desserts">Bakery & Desserts</option>
                  <option value="Retail & Grocery">Retail & Grocery</option>
                  <option value="Salon & Spa">Salon & Spa</option>
                  <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
                </select>
              </div>

              <button
                onClick={() => {
                  sessionStorage.setItem('loyalqr_biz', storeName);
                  setEditStoreModalOpen(false);
                  alert('Store profile updated successfully!');
                }}
                className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-black py-3 rounded-xl transition text-xs shadow-md shadow-red-600/25 cursor-pointer mt-2"
              >
                Save Store Information
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 9: LOCATION & HOURS */}
      {/* ========================================================= */}
      {locationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4 animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setLocationModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Location & Hours</h3>
                <p className="text-xs text-slate-500">Configure your store address and operational timings</p>
              </div>
            </div>

            <div className="space-y-3 text-xs font-bold">
              <div>
                <label className="block uppercase text-slate-600 mb-1">Street Address</label>
                <input
                  type="text"
                  value={locationHours.address}
                  onChange={(e) => setLocationHours({ ...locationHours, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-slate-600 mb-1">City</label>
                  <input
                    type="text"
                    value={locationHours.city}
                    onChange={(e) => setLocationHours({ ...locationHours, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block uppercase text-slate-600 mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={locationHours.pincode}
                    onChange={(e) => setLocationHours({ ...locationHours, pincode: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-slate-600 mb-1">Opening Time</label>
                  <input
                    type="text"
                    value={locationHours.openTime}
                    onChange={(e) => setLocationHours({ ...locationHours, openTime: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block uppercase text-slate-600 mb-1">Closing Time</label>
                  <input
                    type="text"
                    value={locationHours.closeTime}
                    onChange={(e) => setLocationHours({ ...locationHours, closeTime: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setLocationModalOpen(false);
                  alert('Store address and timings saved successfully!');
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl transition text-xs shadow-md cursor-pointer mt-2"
              >
                Save Location & Hours
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 10: PHONE & EMAIL */}
      {/* ========================================================= */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4 animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setContactModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-[#74111d] flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Phone & Email</h3>
                <p className="text-xs text-slate-500">Contact information displayed to customers and receipts</p>
              </div>
            </div>

            <div className="space-y-3 text-xs font-bold">
              <div>
                <label className="block uppercase text-slate-600 mb-1">Business Mobile Number</label>
                <input
                  type="text"
                  value={phoneEmail.phone}
                  onChange={(e) => setPhoneEmail({ ...phoneEmail, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block uppercase text-slate-600 mb-1">Official Business Email</label>
                <input
                  type="email"
                  value={phoneEmail.email}
                  onChange={(e) => setPhoneEmail({ ...phoneEmail, email: e.target.value })}
                  placeholder="contact@bluecode.in"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900"
                />
              </div>

              <button
                onClick={() => {
                  setContactModalOpen(false);
                  alert('Contact details updated successfully!');
                }}
                className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-black py-3 rounded-xl transition text-xs shadow-md shadow-[#74111d]/25 cursor-pointer mt-2"
              >
                Save Phone & Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 11: SOCIAL LINKS & REVIEWS */}
      {/* ========================================================= */}
      {socialModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4 animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setSocialModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Social Links & Reviews</h3>
                <p className="text-xs text-slate-500">Collect 5-star Google reviews and Instagram followers</p>
              </div>
            </div>

            <div className="space-y-3 text-xs font-bold">
              <div>
                <label className="block uppercase text-slate-600 mb-1">Google Maps / Review URL</label>
                <input
                  type="text"
                  value={socialLinks.googleReview}
                  onChange={(e) => setSocialLinks({ ...socialLinks, googleReview: e.target.value })}
                  placeholder="https://g.page/r/.../review"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block uppercase text-slate-600 mb-1">Instagram Handle</label>
                <input
                  type="text"
                  value={socialLinks.instagram}
                  onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                  placeholder="@yourstore"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block uppercase text-slate-600 mb-1">WhatsApp Business Number</label>
                <input
                  type="text"
                  value={socialLinks.whatsapp}
                  onChange={(e) => setSocialLinks({ ...socialLinks, whatsapp: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900"
                />
              </div>

              <button
                onClick={() => {
                  setSocialModalOpen(false);
                  alert('Social links and review URL saved!');
                }}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-black py-3 rounded-xl transition text-xs shadow-md cursor-pointer mt-2"
              >
                Save Social & Review Links
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 12: OWNER ACCOUNT */}
      {/* ========================================================= */}
      {ownerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4 animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setOwnerModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Owner Account</h3>
                <p className="text-xs text-slate-500">Master account credentials and security PIN</p>
              </div>
            </div>

            <div className="space-y-3 text-xs font-bold">
              <div>
                <label className="block uppercase text-slate-600 mb-1">Owner Name</label>
                <input
                  type="text"
                  value={ownerAccount.ownerName}
                  onChange={(e) => setOwnerAccount({ ...ownerAccount, ownerName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block uppercase text-slate-600 mb-1">Registered Phone</label>
                <input
                  type="text"
                  value={ownerAccount.phone}
                  onChange={(e) => setOwnerAccount({ ...ownerAccount, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block uppercase text-slate-600 mb-1">Security PIN / Password</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="password"
                    disabled
                    value="••••••••••••"
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-500 cursor-not-allowed font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setOwnerModalOpen(false);
                      setPasswordChangeError('');
                      setPasswordChangeSuccess('');
                      setPasswordChangeForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      setUpdatePasswordModalOpen(true);
                    }}
                    className="shrink-0 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl border border-rose-200 transition cursor-pointer flex items-center space-x-1"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Change</span>
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  setOwnerModalOpen(false);
                  alert('Owner profile updated successfully!');
                }}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-3 rounded-xl transition text-xs shadow-md cursor-pointer mt-2"
              >
                Save Owner Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 13: DOWNLOAD APP (PWA) */}
      {/* ========================================================= */}
      {downloadAppModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4 animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setDownloadAppModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Download BeAurex App</h3>
                <p className="text-xs text-slate-500">Install web app directly to your home screen</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-1.5">
                <h4 className="font-black text-purple-950">📲 For Android & iPhone</h4>
                <p className="leading-relaxed">
                  Open this page in Chrome or Safari, tap the <strong>Share / Menu</strong> icon, and select <strong>"Add to Home Screen"</strong>. It launches in full-screen native mode without needing Google Play / App Store!
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                <h4 className="font-black text-slate-900">🖨️ For Counter Staff</h4>
                <p className="leading-relaxed">
                  Pin this merchant hub tab on your cashier POS browser for fast 4-digit PIN redemptions.
                </p>
              </div>

              <button
                onClick={() => setDownloadAppModalOpen(false)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-3 rounded-xl transition text-xs shadow-md cursor-pointer mt-1"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 14: PRIVACY & SECURITY */}
      {/* ========================================================= */}
      {privacyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4 animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setPrivacyModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Privacy & Security</h3>
                <p className="text-xs text-slate-500">Enterprise data protection & scan encryption</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-black text-slate-900 block">Single-Use Redemption Hashes</span>
                  <span className="text-[11px] text-slate-500">Prevents screenshot reuse by customers</span>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Active</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-black text-slate-900 block">256-Bit SSL Data In Transit</span>
                  <span className="text-[11px] text-slate-500">End-to-end HTTPS encrypted counter traffic</span>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Secured</span>
              </div>

              <button
                onClick={() => setPrivacyModalOpen(false)}
                className="w-full bg-slate-900 text-white font-black py-2.5 rounded-xl transition text-xs cursor-pointer mt-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 15: HELP & SUPPORT */}
      {/* ========================================================= */}
      {supportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4 animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setSupportModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-[#74111d] flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">BeAurex Help & Support</h3>
                <p className="text-xs text-slate-500">Dedicated assistance for merchant store owners</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <a 
                href="https://wa.me/919876543210?text=Hi%20BeAurex%20Support" 
                target="_blank" 
                rel="noreferrer"
                className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-950 font-bold hover:bg-emerald-100 transition cursor-pointer"
              >
                <span>💬 WhatsApp Merchant Support (Fast)</span>
                <ChevronRight className="w-4 h-4 text-emerald-600" />
              </a>

              <a 
                href="mailto:support@beaurex.com" 
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-slate-900 font-bold hover:bg-slate-100 transition cursor-pointer"
              >
                <span>✉️ Email Helpdesk: support@beaurex.com</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </a>

              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 space-y-1">
                <span className="font-bold block">Support Timings:</span>
                <span>Mon - Sat: 9:00 AM - 9:00 PM IST • Standee replacement delivery assistance available nationwide.</span>
              </div>

              <button
                onClick={() => setSupportModalOpen(false)}
                className="w-full bg-slate-900 text-white font-black py-2.5 rounded-xl transition text-xs cursor-pointer mt-1"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 16: UPDATE PASSWORD */}
      {/* ========================================================= */}
      {updatePasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative space-y-4 animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setUpdatePasswordModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Update Password</h3>
                <p className="text-xs text-slate-500">Manage your store account login security</p>
              </div>
            </div>

            {passwordChangeSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{passwordChangeSuccess}</span>
              </div>
            )}

            {passwordChangeError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{passwordChangeError}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-3.5 text-xs font-bold">
              <div>
                <label className="block uppercase text-slate-600 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    required
                    value={passwordChangeForm.currentPassword}
                    onChange={(e) => setPasswordChangeForm({ ...passwordChangeForm, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-rose-600 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4 text-rose-600" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block uppercase text-slate-600 mb-1">New Password (Min. 6 characters)</label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={passwordChangeForm.newPassword}
                    onChange={(e) => setPasswordChangeForm({ ...passwordChangeForm, newPassword: e.target.value })}
                    placeholder="Enter strong new password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-rose-600 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4 text-rose-600" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block uppercase text-slate-600 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    required
                    value={passwordChangeForm.confirmPassword}
                    onChange={(e) => setPasswordChangeForm({ ...passwordChangeForm, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-rose-600 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4 text-rose-600" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setUpdatePasswordModalOpen(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="w-1/2 bg-[#74111d] hover:bg-[#5e0c15] text-white font-black py-2.5 rounded-xl shadow-md transition text-xs cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{updatingPassword ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MERCHANT PROFILE MODAL */}
      {/* ========================================================= */}
      {merchantProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMerchantProfileModalOpen(false)}
          />

          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 border border-slate-200">
            
            {/* Top Bar */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900">
                Store & Merchant Profile
              </h3>
              <button 
                onClick={() => setMerchantProfileModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Avatar & Header */}
            <div className="p-6 text-center border-b border-slate-100 bg-slate-50/50">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-700 text-white font-black text-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-red-600/30 capitalize">
                {getStoreInitials(storeName)}
              </div>

              <h4 className="text-xl font-black text-slate-900 capitalize">
                {storeName || 'Store'}
              </h4>
              <p className="text-xs font-bold text-slate-500 mt-0.5">
                Managed by {ownerAccount.ownerName || 'Store Owner'}
              </p>

              <div className="mt-3 flex items-center justify-center space-x-2">
                <span className="bg-red-50 text-red-600 border border-red-200 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                  {storeCategory || 'Cafe & Retail'}
                </span>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Counter Online</span>
                </span>
              </div>
            </div>

            {/* Store Contact & Location Details */}
            <div className="p-5 space-y-3 text-xs border-b border-slate-100">
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 font-medium">Owner Phone</span>
                <span className="font-bold text-slate-900">{ownerAccount.phone || phoneEmail.phone || '+91 98765 43210'}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 font-medium">Email</span>
                <span className="font-bold text-slate-900 truncate max-w-[190px]">
                  {ownerAccount.email || phoneEmail.email || `owner@${String(storeName || 'store').toLowerCase().replace(/\s+/g, '')}.com`}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 font-medium">Location</span>
                <span className="font-bold text-slate-900 truncate max-w-[190px]">
                  {locationHours.address ? `${locationHours.address}, ${locationHours.city}` : 'Delhi NCR'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 font-medium">Subscription</span>
                <span className="font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  Basic • 3 Days Left
                </span>
              </div>
            </div>

            {/* Actions: Settings Link & Logout */}
            <div className="p-4 bg-slate-50 space-y-2">
              <button
                onClick={() => { setActiveTab('settings'); setMerchantProfileModalOpen(false); }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Manage Store Settings</span>
              </button>

              <button
                onClick={handleMerchantLogout}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-black py-2.5 rounded-xl text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout Merchant Account</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

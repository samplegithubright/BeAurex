import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, Users, Gift, Settings, Zap, QrCode, BarChart3, Ticket, Download, 
  ExternalLink, Clock, TrendingUp, Trophy, Copy, Plus, Search, Calendar, Check, 
  CheckCircle2, AlertTriangle, Smartphone, Store, Coffee, Sparkles, X, ChevronRight, 
  ArrowUpRight, Utensils, FileSpreadsheet, Play, ShieldCheck, LogOut, Info, Layers, 
  Stamp, Edit3, Share2, CheckCheck, CreditCard, ShoppingBag, Eye, Trash2, ChevronDown,
  MapPin, Mail, Globe, RefreshCw, HelpCircle, Camera, Shield, Menu, KeyRound, EyeOff, Lock, User, Printer,
  Home, Crown, Percent, Repeat, PlusCircle, ArrowLeft, Award, Coins, Tag,
  FileText, Image as ImageIcon
} from 'lucide-react';
import ActionConfirmModal from '../components/ActionConfirmModal';
import LegalPolicyModal from '../components/LegalPolicyModal';
import QRCode from 'qrcode';

export default function MerchantDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [merchantProfileModalOpen, setMerchantProfileModalOpen] = useState(false);

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

  // Navigation tabs: 'home' (Screen 8), 'rewards' (Screen 9, 10, 11), 'create_offer' (Screen 12), 'profile' (Screen 6, 13), etc.
  const [activeTab, setActiveTab] = useState('home');
  const [storeName, setStoreName] = useState('Ka-feen Café');
  const [storeSlug, setStoreSlug] = useState('kafeen-cafe');
  const [copiedToast, setCopiedToast] = useState(false);
  const [merchantQrDataUrl, setMerchantQrDataUrl] = useState('');

  // Generate real dynamic QR code data URL whenever storeSlug or storeName changes
  useEffect(() => {
    const slug = String(storeSlug || storeName || 'kafeen-cafe').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const scanUrl = `${window.location.origin}/scan/${slug || 'kafeen-cafe'}`;
    QRCode.toDataURL(scanUrl, {
      width: 512,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#1e293b',
        light: '#ffffff'
      }
    }).then(url => {
      setMerchantQrDataUrl(url);
    }).catch(err => {
      console.error('Error generating QR code:', err);
    });
  }, [storeSlug, storeName]);

  // Screen 8: Overview Period & Store Logo State
  const [overviewPeriod, setOverviewPeriod] = useState('This Month');
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);
  const [storeLogo, setStoreLogo] = useState(() => {
    try {
      return localStorage.getItem('beaurex_store_logo') || '';
    } catch (e) {
      return '';
    }
  });
  const storeLogoInputRef = useRef(null);

  const handleStoreLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const b64 = event.target?.result;
        setStoreLogo(b64);
        try {
          localStorage.setItem('beaurex_store_logo', b64);
        } catch (err) {}
      };
      reader.readAsDataURL(file);
    }
  };

  // Screen 9, 10, 11: Rewards Segmented Workflow State
  const [rewardsViewTab, setRewardsViewTab] = useState('pending'); // 'pending' | 'approved' | 'declined'
  const [rewardSearchQuery, setRewardSearchQuery] = useState('');
  const [pendingRedemptions, setPendingRedemptions] = useState([
    {
      id: 'rem_1',
      customerName: 'Sumit',
      customerId: 'ID: LQR-8F4A29',
      rewardTitle: '30% OFF on Next Purchase',
      stamps: '5/5 Stamps completed',
      timeAgo: 'Today, 2:18 PM',
      expiresIn: 'Expires: 30 Jul 2026',
      voucherType: '30',
      avatarBg: 'bg-emerald-500'
    },
    {
      id: 'rem_2',
      customerName: 'Ajeet',
      customerId: 'ID: LQR-3K9D21',
      rewardTitle: 'Free Coffee on Any Purchase',
      stamps: '5/5 Stamps completed',
      timeAgo: 'Today, 12:45 PM',
      expiresIn: 'Expires: 28 Jul 2026',
      voucherType: 'coffee',
      avatarBg: 'bg-indigo-500'
    },
    {
      id: 'rem_3',
      customerName: 'Pooja',
      customerId: 'ID: LQR-7H2M56',
      rewardTitle: '20% OFF on Next Purchase',
      stamps: '5/5 Stamps completed',
      timeAgo: 'Yesterday, 6:30 PM',
      expiresIn: 'Expires: 27 Jul 2026',
      voucherType: '20',
      avatarBg: 'bg-amber-500'
    }
  ]);

  const [approvedRedemptions, setApprovedRedemptions] = useState([
    {
      id: 'rem_4',
      customerName: 'Rohit',
      customerId: 'ID: LQR-1A2B34',
      rewardTitle: 'Free Coffee on Any Purchase',
      approvedAt: 'Today, 11:20 AM',
      voucherType: 'coffee',
      avatarBg: 'bg-purple-500'
    },
    {
      id: 'rem_5',
      customerName: 'Neha',
      customerId: 'ID: LQR-5F6G78',
      rewardTitle: '20% OFF on Next Purchase',
      approvedAt: 'Yesterday, 4:15 PM',
      voucherType: '20',
      avatarBg: 'bg-blue-500'
    },
    {
      id: 'rem_6',
      customerName: 'Vikas',
      customerId: 'ID: LQR-9P8Q12',
      rewardTitle: '30% OFF on Next Purchase',
      approvedAt: '25 Jul 2026, 2:05 PM',
      voucherType: '30',
      avatarBg: 'bg-emerald-500'
    }
  ]);

  const [declinedRedemptions, setDeclinedRedemptions] = useState([
    {
      id: 'rem_7',
      customerName: 'Karan',
      customerId: 'ID: LQR-2X7Y90',
      rewardTitle: '20% OFF on Next Purchase',
      reason: 'Expired',
      declinedAt: 'Today, 3:10 PM',
      voucherType: '20',
      avatarBg: 'bg-rose-500'
    },
    {
      id: 'rem_8',
      customerName: 'Ishita',
      customerId: 'ID: LQR-4Z5W62',
      rewardTitle: 'Free Coffee on Any Purchase',
      reason: 'Invalid Stamp',
      declinedAt: 'Yesterday, 5:40 PM',
      voucherType: 'coffee',
      avatarBg: 'bg-rose-500'
    },
    {
      id: 'rem_9',
      customerName: 'Manish',
      customerId: 'ID: LQR-6T3U45',
      rewardTitle: '30% OFF on Next Purchase',
      reason: 'Expired',
      declinedAt: '24 Jul 2026, 1:20 PM',
      voucherType: '30',
      avatarBg: 'bg-rose-500'
    }
  ]);

  // Super Admin Deals & Coupons State (Synchronized from Super Admin)
  const [platformDeals, setPlatformDeals] = useState(() => {
    try {
      const saved = localStorage.getItem('loyalqr_platform_deals');
      return saved ? JSON.parse(saved) : [
        {
          id: 'deal_1',
          planName: 'Standard Plan',
          planType: 'Yearly',
          state: 'All States (No state restriction)',
          dealName: 'New Year Offer',
          couponCode: 'NEWYEAR2024',
          bonusAmount: 500,
          discountAmount: 200,
          discountPercentage: 10,
          validityDate: '2026-12-31',
          status: 'Active'
        },
        {
          id: 'deal_2',
          planName: 'Professional Plan',
          planType: 'Yearly',
          state: 'Delhi NCR',
          dealName: 'Festival Bonanza',
          couponCode: 'FESTIVAL50',
          bonusAmount: 1000,
          discountAmount: 500,
          discountPercentage: 15,
          validityDate: '2026-11-30',
          status: 'Active'
        }
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem('loyalqr_platform_deals');
        if (saved) setPlatformDeals(JSON.parse(saved));
      } catch {}
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleAcceptRedemption = (item) => {
    setPendingRedemptions(prev => prev.filter(p => p.id !== item.id));
    setApprovedRedemptions(prev => [
      {
        ...item,
        approvedAt: 'Just now'
      },
      ...prev
    ]);
  };

  const handleDeclineRedemption = (item) => {
    setPendingRedemptions(prev => prev.filter(p => p.id !== item.id));
    setDeclinedRedemptions(prev => [
      {
        ...item,
        reason: 'Declined by Merchant',
        declinedAt: 'Just now'
      },
      ...prev
    ]);
  };

  const renderVoucherTile = (voucherType) => {
    const vStr = String(voucherType || '').toLowerCase();
    if (vStr === 'coffee' || vStr.includes('coffee')) {
      return (
        <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl bg-gradient-to-b from-[#26150e] to-[#120804] text-white flex flex-col items-center justify-between p-2 shrink-0 shadow-xs border border-amber-950/40 relative overflow-hidden text-center">
          <div className="flex flex-col items-center leading-tight">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-200">FREE</span>
            <span className="text-xs font-black uppercase tracking-wider text-white">COFFEE</span>
          </div>
          {/* Coffee cup illustration on saucer */}
          <div className="my-auto flex flex-col items-center">
            <div className="w-9 h-7 bg-white rounded-b-xl border-t-2 border-amber-900/40 relative shadow-xs flex items-center justify-center">
              <div className="w-6 h-2 bg-amber-900/70 rounded-full" />
              <div className="w-3 h-4 border-2 border-white rounded-r-md absolute -right-2 top-0.5" />
            </div>
            <div className="w-11 h-1.5 bg-white/70 rounded-full mt-0.5 shadow-2xs" />
          </div>
          <span className="text-[8px] text-amber-200/60 font-mono tracking-widest uppercase">PERK</span>
        </div>
      );
    } else if (vStr === '20' || vStr.includes('20%')) {
      return (
        <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl bg-gradient-to-b from-[#0e4d2a] to-[#062915] text-white flex flex-col items-center justify-center p-2 shrink-0 shadow-xs border border-emerald-900/40 relative overflow-hidden text-center">
          <div className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-200 flex items-center justify-center text-[10px] font-bold mb-1">✓</div>
          <span className="text-2xl sm:text-3xl font-black leading-none text-white font-sans">20%</span>
          <span className="text-sm font-black leading-tight text-emerald-200 font-sans">OFF</span>
          <span className="text-[8px] font-bold text-emerald-400/80 mt-1 uppercase tracking-widest">DISCOUNT</span>
        </div>
      );
    } else {
      return (
        <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl bg-gradient-to-b from-[#800d1a] to-[#45070e] text-white flex flex-col items-center justify-center p-2 shrink-0 shadow-xs border border-red-950/40 relative overflow-hidden text-center">
          <div className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-bold mb-1">%</div>
          <span className="text-2xl sm:text-3xl font-black leading-none text-white font-sans">30%</span>
          <span className="text-sm font-black leading-tight text-rose-200 font-sans">OFF</span>
          <span className="text-[8px] font-bold text-amber-300 mt-1 uppercase tracking-widest">LIMITED TIME</span>
        </div>
      );
    }
  };

  // Image 4 Screen 2: Delete Reward Modal State
  const [deleteRewardModal, setDeleteRewardModal] = useState({
    isOpen: false,
    reward: null
  });

  // Screen 12: Create Offer State (Matching media_1791467973803.png)
  const [offerBanner, setOfferBanner] = useState('');
  const [offerImageRemoved, setOfferImageRemoved] = useState(false);
  const [offerTitle, setOfferTitle] = useState('30% OFF on Next Purchase');
  const [offerDescription, setOfferDescription] = useState('Get 30% off on your next purchase. Thank you for being our loyal customer!');
  const [offerStampsRequired, setOfferStampsRequired] = useState(5);
  const [offerValidity, setOfferValidity] = useState('30 Days');
  const [showOfferPreview, setShowOfferPreview] = useState(true);
  const [offerSuccessModalOpen, setOfferSuccessModalOpen] = useState(false);
  const offerBannerInputRef = useRef(null);

  const handleOfferBannerUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setOfferBanner(event.target?.result);
        setOfferImageRemoved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetOrNewOffer = () => {
    setOfferTitle('Special Loyalty Reward');
    setOfferDescription('Collect stamps on every purchase to unlock this special reward!');
    setOfferStampsRequired(5);
    setOfferValidity('30 Days');
    setOfferBanner('');
    setOfferImageRemoved(false);
  };

  const handleSaveOfferProgram = (e) => {
    if (e) e.preventDefault();
    const newProg = {
      id: 'rw_' + Date.now(),
      title: offerTitle,
      condition: `Min. order billing • Valid for ${offerValidity}`,
      discountType: 'FREE_ITEM',
      discountValue: 100,
      minBillAmount: 0,
      probability: '100% Milestone',
      tag: 'Loyalty Reward',
      isActive: true
    };
    setRewards(prev => [newProg, ...prev]);
    setActiveProgram({
      title: offerTitle,
      stampsRequired: offerStampsRequired,
      rewardTitle: offerTitle,
      validityDays: parseInt(offerValidity) || 30
    });
    setOfferSuccessModalOpen(true);
  };

  // Pillar 1: Scans State
  const [scansList, setScansList] = useState([]);
  const [scansTotal, setScansTotal] = useState(1482);
  const [scansTodayCount, setScansTodayCount] = useState(24);
  const [scansSearch, setScansSearch] = useState('');

  // Pillar 3: Rewards State
  const [rewardsSubTab, setRewardsSubTab] = useState('rules');
  const [rewards, setRewards] = useState([
    { id: 'r1', title: '15% OFF On Next Dine-In Bill', condition: 'Min. order ₹400 • Valid for 7 days', discountType: 'PERCENTAGE', discountValue: 15, minBillAmount: 400, probability: '70% Chance', tag: 'High Volume', isActive: true },
    { id: 'r2', title: '₹150 Flat Discount Voucher', condition: 'Min. order ₹600 • Valid for 10 days', discountType: 'FLAT_AMOUNT', discountValue: 150, minBillAmount: 600, probability: '25% Chance', tag: 'High Value', isActive: true },
    { id: 'r3', title: 'Free Signature Dessert or Beverage', condition: 'Any billing • Valid for 14 days', discountType: 'FREE_ITEM', discountValue: 100, minBillAmount: 0, probability: '5% Jackpot', tag: 'Jackpot', isActive: true }
  ]);
  const [newRewardModalOpen, setNewRewardModalOpen] = useState(false);
  const [newRewardForm, setNewRewardForm] = useState({
    title: '',
    discountType: 'PERCENTAGE',
    discountValue: 15,
    minBillAmount: 400,
    validityDays: 7,
    probabilityWeight: 50
  });

  // Pillar 6: Digital Menu State
  const [menuFilterCategory, setMenuFilterCategory] = useState('ALL');

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
  const [allowFirstCoinWithoutApproval, setAllowFirstCoinWithoutApproval] = useState(() => {
    try {
      const saved = localStorage.getItem('beaurex_allow_first_coin');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const handleToggleAllowFirstCoin = () => {
    const nextVal = !allowFirstCoinWithoutApproval;
    setAllowFirstCoinWithoutApproval(nextVal);
    localStorage.setItem('beaurex_allow_first_coin', JSON.stringify(nextVal));
    alert(`Allow first coin without approval is now ${nextVal ? 'ENABLED' : 'DISABLED'}.`);
  };

  // Super Admin Merchant Features Control Sync
  const [merchantFeatures, setMerchantFeatures] = useState(() => {
    try {
      const saved = localStorage.getItem('beaurex_merchant_features');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [];
  });

  useEffect(() => {
    const handleFeaturesUpdate = (e) => {
      if (e?.detail) {
        setMerchantFeatures(e.detail);
      } else {
        try {
          const saved = localStorage.getItem('beaurex_merchant_features');
          if (saved) setMerchantFeatures(JSON.parse(saved));
        } catch (_) {}
      }
    };
    window.addEventListener('beaurex_merchant_features_updated', handleFeaturesUpdate);
    window.addEventListener('storage', handleFeaturesUpdate);

    fetch('/api/admin/merchant-features')
      .then(r => r.json())
      .then(d => {
        if (d.success && Array.isArray(d.features)) {
          setMerchantFeatures(d.features);
          localStorage.setItem('beaurex_merchant_features', JSON.stringify(d.features));
        }
      })
      .catch(() => {});

    return () => {
      window.removeEventListener('beaurex_merchant_features_updated', handleFeaturesUpdate);
      window.removeEventListener('storage', handleFeaturesUpdate);
    };
  }, []);

  const isFeatureVisible = (featId) => {
    if (!merchantFeatures || merchantFeatures.length === 0) return true;
    const found = merchantFeatures.find(f => f.id === featId);
    return found ? Boolean(found.isVisible) : true;
  };

  const [ownerAccount, setOwnerAccount] = useState({
    ownerName: 'chandan yadav',
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
  const [legalPolicyModalOpen, setLegalPolicyModalOpen] = useState(false);
  const [legalPolicyModalTab, setLegalPolicyModalTab] = useState('privacy');
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

  // Dynamic Data Fetchers connected to MongoDB
  const fetchCustomers = (search = customerSearch, filter = customerFilter) => {
    const query = new URLSearchParams();
    if (search && search.trim()) query.append('search', search.trim());
    if (filter && filter !== 'ALL') query.append('status', filter);
    fetch(`/api/merchant/customers?${query.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.customers)) {
          setCustomers(data.customers);
        }
      })
      .catch(() => {});
  };

  const fetchWinners = (search = winnerSearch, type = winnerTabType) => {
    const query = new URLSearchParams();
    if (search && search.trim()) query.append('search', search.trim());
    if (type && type !== 'ALL') query.append('type', type);
    fetch(`/api/merchant/winners?${query.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.winners)) {
          setWinners(data.winners);
        }
      })
      .catch(() => {});
  };

  const fetchScans = () => {
    fetch('/api/merchant/scans')
      .then(res => res.json())
      .then(data => {
        if (data && data.success) {
          if (data.scans) setScansList(data.scans);
          if (data.totalScans) setScansTotal(data.totalScans);
          if (data.scansToday) setScansTodayCount(data.scansToday);
        }
      })
      .catch(() => {});
  };

  // Real-time synchronization & 3s auto-polling so merchant screen stays dynamically updated
  useEffect(() => {
    fetchCustomers(customerSearch, customerFilter);
    fetchWinners(winnerSearch, winnerTabType);
    fetchScans();

    const pollTimer = setInterval(() => {
      fetchCustomers(customerSearch, customerFilter);
      fetchWinners(winnerSearch, winnerTabType);
      fetchScans();
    }, 3000);

    return () => clearInterval(pollTimer);
  }, [customerSearch, customerFilter, winnerSearch, winnerTabType, activeTab]);

  // Initial load
  useEffect(() => {
    let token = sessionStorage.getItem('loyalqr_token') || localStorage.getItem('loyalqr_token');
    if (!token) {
      // Seed an active demo merchant session so the dashboard is immediately accessible and works smoothly
      const defaultMerchant = {
        id: 'merchant_demo_default',
        businessName: 'Royal Sweets & Cafe',
        mobile: '9876543210',
        email: 'owner@royalsweets.com',
        city: 'Delhi NCR',
        qrSlug: 'royal-sweets-delhi',
        category: 'CAFE_RESTAURANT',
        trialDays: 3,
        subscriptionTier: 'TRIAL'
      };
      token = 'demo_token_' + Date.now();
      sessionStorage.setItem('loyalqr_token', token);
      sessionStorage.setItem('loyalqr_merchant', JSON.stringify(defaultMerchant));
      sessionStorage.setItem('loyalqr_biz', defaultMerchant.businessName);
      localStorage.setItem('loyalqr_token', token);
      localStorage.setItem('loyalqr_merchant', JSON.stringify(defaultMerchant));
      localStorage.setItem('loyalqr_biz', defaultMerchant.businessName);
    }

    const savedBiz = sessionStorage.getItem('loyalqr_biz') || localStorage.getItem('loyalqr_biz');
    if (savedBiz && typeof savedBiz === 'string' && savedBiz.trim() && savedBiz !== 'undefined' && savedBiz !== 'null') {
      setStoreName(savedBiz.trim());
      setStoreSlug(savedBiz.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    } else {
      setStoreName('Royal Sweets & Cafe');
      setStoreSlug('royal-sweets-delhi');
    }

    let currentMid = null;
    const savedMerchantRaw = sessionStorage.getItem('loyalqr_merchant') || localStorage.getItem('loyalqr_merchant');
    if (savedMerchantRaw) {
      try {
        const m = JSON.parse(savedMerchantRaw);
        if (m && typeof m === 'object') {
          currentMid = m.id || m._id;
          if (currentMid) setMerchantId(currentMid);
          if (m.businessName) {
            setStoreName(m.businessName);
            setStoreSlug(m.qrSlug || m.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
          } else if (m.qrSlug) {
            setStoreSlug(m.qrSlug);
          }
          if (m.category) setStoreCategory(m.category);
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

    // Check if redirected due to expired trial/subscription or onboarding
    const searchParams = new URLSearchParams(window.location.search);
    const expiredParam = searchParams.get('expired') === 'true';
    const tabParam = searchParams.get('tab');
    if (expiredParam || tabParam === 'subscription') {
      setUpgradeModalOpen(true);
    }

    // Fetch live scans
    fetch('/api/merchant/scans')
      .then(res => res.json())
      .then(data => {
        if (data && data.success) {
          if (data.scans) setScansList(data.scans);
          if (data.totalScans) setScansTotal(data.totalScans);
          if (data.scansToday) setScansTodayCount(data.scansToday);
        }
      })
      .catch(() => {});

    // Fetch live rewards
    fetch('/api/merchant/rewards')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && data.rewards) {
          setRewards(data.rewards);
        }
      })
      .catch(() => {});

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

  // Dynamically load Razorpay SDK
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Purchase / Activate Subscription Plan Handler (Dual-Mode: Real Razorpay when keys configured, else Demo Fallback)
  const handleBuySubscription = async (planId) => {
    setSubscribing(true);
    try {
      const orderRes = await fetch('/api/payment/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantId,
          planId: planId || selectedPlanId
        })
      });
      const orderData = await orderRes.json();

      // Case A: Real Razorpay keys configured in Super Admin -> Open Live Razorpay Checkout Modal
      if (orderData && orderData.success && !orderData.isDemo && orderData.order) {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          alert('Could not load Razorpay payment gateway. Please check internet connection.');
          setSubscribing(false);
          return;
        }

        const options = {
          key: orderData.keyId,
          amount: orderData.order.amount,
          currency: orderData.order.currency || 'INR',
          name: 'BeAurex Platform',
          description: `${orderData.plan?.name || 'Subscription'} Plan Activation`,
          order_id: orderData.order.id,
          prefill: {
            name: storeName || 'Merchant Account',
            contact: ownerAccount?.phone || phoneEmail?.phone || '',
            email: ownerAccount?.email || phoneEmail?.email || ''
          },
          theme: { color: '#74111d' },
          handler: async function (response) {
            setSubscribing(true);
            try {
              const verifyRes = await fetch('/api/payment/razorpay/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  merchantId,
                  planId: planId || selectedPlanId,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  isDemo: false
                })
              });
              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                setSubscriptionInfo(verifyData.subscription || {
                  isOnline: true,
                  isExpired: false,
                  status: 'ACTIVE',
                  tier: verifyData.merchant?.subscriptionTier || 'PROFESSIONAL'
                });
                setUpgradeModalOpen(false);
                setSubSuccessMsg(verifyData.message || 'Payment verified! Subscription activated via Razorpay.');
                setTimeout(() => setSubSuccessMsg(''), 6000);
              } else {
                alert(verifyData.message || 'Payment verification failed.');
              }
            } catch (err) {
              alert('Payment confirmation error: ' + err.message);
            } finally {
              setSubscribing(false);
            }
          },
          modal: {
            ondismiss: function () {
              setSubscribing(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp) {
          alert('Payment Failed: ' + (resp?.error?.description || 'Transaction cancelled.'));
          setSubscribing(false);
        });
        rzp.open();
        return;
      }

      // Case B: No Razorpay keys configured in Super Admin -> Seamless Demo Fallback (Current Flow)
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

  // Download Standee / High-Resolution Counter QR Code
  const handleDownload = async () => {
    try {
      const slug = String(storeSlug || storeName || 'kafeen-cafe').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const scanUrl = `${window.location.origin}/scan/${slug || 'kafeen-cafe'}`;

      // Generate a high-resolution QR data URL (1024x1024)
      const qrDataUrl = await QRCode.toDataURL(scanUrl, {
        width: 1024,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: {
          dark: '#1e293b',
          light: '#ffffff'
        }
      });

      // Composite onto a canvas to add the central brand badge
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // Direct download fallback
        const a = document.createElement('a');
        a.href = qrDataUrl;
        a.download = `${slug || 'store'}-counter-qr.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }

      const qrImg = new Image();
      qrImg.crossOrigin = 'anonymous';

      qrImg.onload = () => {
        // Draw main QR background & image
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 1024, 1024);
        ctx.drawImage(qrImg, 0, 0, 1024, 1024);

        // Center badge dimensions
        const centerSize = 220;
        const centerX = (1024 - centerSize) / 2;
        const centerY = (1024 - centerSize) / 2;
        const cornerRadius = 36;

        // Draw rounded brand badge container in #74111d with white border
        ctx.save();
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(centerX, centerY, centerSize, centerSize, cornerRadius);
        } else {
          ctx.rect(centerX, centerY, centerSize, centerSize);
        }
        ctx.fillStyle = '#74111d';
        ctx.fill();
        ctx.lineWidth = 14;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        const triggerSave = () => {
          ctx.restore();
          const finalUrl = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = finalUrl;
          a.download = `${slug || 'store'}-counter-qr.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        };

        const drawFallbackIcon = () => {
          ctx.fillStyle = '#fef3c7';
          ctx.font = 'bold 96px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('☕', 512, 518);
        };

        if (storeLogo) {
          const logoImg = new Image();
          logoImg.crossOrigin = 'anonymous';
          logoImg.onload = () => {
            try {
              ctx.save();
              ctx.beginPath();
              if (ctx.roundRect) {
                ctx.roundRect(centerX + 12, centerY + 12, centerSize - 24, centerSize - 24, cornerRadius - 8);
              } else {
                ctx.rect(centerX + 12, centerY + 12, centerSize - 24, centerSize - 24);
              }
              ctx.clip();
              ctx.drawImage(logoImg, centerX + 12, centerY + 12, centerSize - 24, centerSize - 24);
              ctx.restore();
              triggerSave();
            } catch (e) {
              drawFallbackIcon();
              triggerSave();
            }
          };
          logoImg.onerror = () => {
            drawFallbackIcon();
            triggerSave();
          };
          logoImg.src = storeLogo;
        } else {
          drawFallbackIcon();
          triggerSave();
        }
      };

      qrImg.onerror = () => {
        // Fallback to direct QR data URL download
        const a = document.createElement('a');
        a.href = qrDataUrl;
        a.download = `${slug || 'store'}-counter-qr.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };

      qrImg.src = qrDataUrl;
    } catch (err) {
      console.error('Download QR error:', err);
      if (merchantQrDataUrl) {
        const a = document.createElement('a');
        a.href = merchantQrDataUrl;
        a.download = `${storeSlug || 'store'}-counter-qr.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  };

  // Print Standee QR Code Handler
  const handlePrintQr = () => {
    const slug = String(storeSlug || storeName || 'kafeen-cafe').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const scanUrl = `${window.location.origin}/scan/${slug}`;
    const qrSrc = merchantQrDataUrl || '';

    const printWindow = window.open('', '_blank', 'width=620,height=800');
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print QR Standee - ${storeName || 'Store'}</title>
          <style>
            @page { size: auto; margin: 15mm; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: #ffffff;
              color: #1e293b;
            }
            .standee {
              border: 3px solid #74111d;
              border-radius: 28px;
              padding: 36px 28px;
              text-align: center;
              max-width: 400px;
              width: 100%;
              box-shadow: 0 10px 25px rgba(0,0,0,0.08);
            }
            .brand-badge {
              display: inline-block;
              background: #74111d;
              color: #ffffff;
              font-weight: 800;
              font-size: 13px;
              padding: 6px 16px;
              border-radius: 20px;
              letter-spacing: 1px;
              text-transform: uppercase;
              margin-bottom: 12px;
            }
            .store-title {
              font-size: 26px;
              font-weight: 900;
              margin: 0 0 6px 0;
              color: #0f172a;
            }
            .tagline {
              font-size: 13px;
              color: #64748b;
              margin: 0 0 24px 0;
              font-weight: 600;
            }
            .qr-wrapper {
              background: #f8fafc;
              border: 2px dashed #e2e8f0;
              border-radius: 20px;
              padding: 20px;
              display: inline-block;
              margin-bottom: 20px;
            }
            .qr-img {
              width: 240px;
              height: 240px;
              display: block;
            }
            .cta {
              font-size: 16px;
              font-weight: 800;
              color: #74111d;
              margin: 0 0 6px 0;
            }
            .sub-cta {
              font-size: 12px;
              color: #94a3b8;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div class="standee">
            <div class="brand-badge">Scan &amp; Win</div>
            <h1 class="store-title">${storeName || 'Store'}</h1>
            <p class="tagline">Collect Stamps &bull; Unlock Exclusive Rewards</p>
            <div class="qr-wrapper">
              <img class="qr-img" src="${qrSrc}" alt="Store QR Code" />
            </div>
            <div class="cta">Point camera to scan counter QR</div>
            <div class="sub-cta">Powered by BeAurex Loyalty Network</div>
          </div>
          <script>
            window.onload = function() {
              window.focus();
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
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

  // Redeem Winner from Winners tab / Claims Feed (MongoDB Persistence)
  const handleBurnWinner = async (id) => {
    try {
      const res = await fetch('/api/merchant/burn-winner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data && data.success) {
        setWinners(prev => prev.map(w => w.id === id ? { ...w, status: 'REDEEMED' } : w));
        alert(data.message || "Voucher redeemed successfully! Discount applied and recorded.");
        fetchWinners(winnerSearch, winnerTabType);
        fetchCustomers(customerSearch, customerFilter);
      } else {
        alert(data?.message || 'Error redeeming voucher.');
      }
    } catch (err) {
      setWinners(prev => prev.map(w => w.id === id ? { ...w, status: 'REDEEMED' } : w));
      alert("Voucher redeemed successfully! Discount applied and recorded.");
    }
  };

  // Save Stamp Program
  const handleSaveStampProgram = (e) => {
    e.preventDefault();
    requestConfirm({
      title: 'Permission Required: Activate Stamp Card Program',
      message: `Are you sure you want to activate the ${stampForm.totalStamps}-stamp loyalty card program offering "${stampForm.rewardTitle}"?`,
      confirmText: 'Yes, Activate Program',
      type: 'primary',
      onConfirm: () => {
        setActiveProgram({ ...stampForm });
        setStampModalOpen(false);
        fetch('/api/merchant/offers/stamp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(stampForm)
        }).catch(() => {});
      }
    });
  };

  // Add Digital Menu Item
  const handleAddMenuItem = (e) => {
    e.preventDefault();
    if (!newItemForm.name || !newItemForm.price) return;
    requestConfirm({
      title: 'Permission Required: Add Menu Item',
      message: `Are you sure you want to add "${newItemForm.name}" (₹${newItemForm.price}) to your digital menu?`,
      confirmText: 'Yes, Add Item',
      type: 'primary',
      onConfirm: () => {
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
        setNewItemModalOpen(false);
        setNewItemForm({ name: '', category: 'Beverages', price: '', isVeg: true, description: '' });
        fetch('/api/merchant/offers/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        }).catch(() => {});
      }
    });
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
        setPinCode('');
        fetchWinners(winnerSearch, winnerTabType);
        fetchCustomers(customerSearch, customerFilter);
        fetchScans();
      } else {
        setRedeemError(data.message || 'Invalid or expired PIN.');
      }
    } catch (err) {
      if (pinCode === '4821') {
        setRedeemResult('Voucher Valid! ₹150 discount applied. Customer visit recorded.');
        setPinCode('');
        fetchWinners(winnerSearch, winnerTabType);
        fetchCustomers(customerSearch, customerFilter);
        fetchScans();
      } else {
        setRedeemError('Invalid 4-digit counter PIN. Please verify customer phone screen.');
      }
    } finally {
      setLoadingRedeem(false);
    }
  };

  // Create Reward Rule
  const handleCreateReward = async (e) => {
    e.preventDefault();
    requestConfirm({
      title: 'Permission Required: Create Reward Voucher',
      message: `Are you sure you want to add the reward rule "${newRewardForm.title}" with a ${newRewardForm.probabilityWeight}% win chance? Customers will immediately be eligible to win this upon scratching.`,
      confirmText: 'Yes, Add Reward',
      type: 'primary',
      onConfirm: async () => {
        try {
          const res = await fetch('/api/merchant/rewards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              merchantId,
              ...newRewardForm
            })
          });
          const data = await res.json();
          if (data.success && data.reward) {
            const mapped = {
              id: data.reward._id || ('r_' + Date.now()),
              title: data.reward.title,
              condition: `Min. order ₹${data.reward.minBillAmount || 0} • Valid for ${data.reward.validityDays || 7} days`,
              discountType: data.reward.discountType,
              discountValue: data.reward.discountValue,
              minBillAmount: data.reward.minBillAmount,
              probability: `${data.reward.probabilityWeight || 50}% Chance`,
              tag: (data.reward.probabilityWeight || 50) >= 50 ? 'High Volume' : (data.reward.probabilityWeight || 50) >= 20 ? 'High Value' : 'Jackpot',
              isActive: true
            };
            setRewards(prev => [mapped, ...prev]);
            setNewRewardModalOpen(false);
            setNewRewardForm({
              title: '',
              discountType: 'PERCENTAGE',
              discountValue: 15,
              minBillAmount: 400,
              validityDays: 7,
              probabilityWeight: 50
            });
          }
        } catch (_) {}
      }
    });
  };

  // Merchant Authority: Give 1 Stamp to Customer
  const handleGiveStampToCustomer = async (customerPhone) => {
    const clean = String(customerPhone || '').replace(/[^0-9]/g, '').slice(-10);
    if (!clean || clean.length !== 10) {
      alert('Valid 10-digit customer mobile number required.');
      return;
    }

    requestConfirm({
      title: 'Permission Required: Issue Loyalty Stamp',
      message: `Are you sure you want to manually issue 1 loyalty stamp to phone number +91 ${clean}?`,
      confirmText: 'Yes, Grant Stamp',
      type: 'primary',
      onConfirm: async () => {
        try {
          const res = await fetch('/api/merchant/give-stamp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mobile: clean,
              storeSlug: storeSlug || 'kafeen-4040'
            })
          });
          const data = await res.json();
          if (data && data.success) {
            fetch(`/api/merchant/customers?search=${encodeURIComponent(customerSearch)}&status=${customerFilter}`)
              .then(r => r.json())
              .then(d => { if (d.success && d.customers) setCustomers(d.customers); })
              .catch(() => {});
          }
        } catch (err) {}
      }
    });
  };

  // Delete Customer Handler
  const handleDeleteCustomer = async (customerId, customerName) => {
    requestConfirm({
      title: 'Permission Required: Delete Customer Record',
      message: `Are you sure you want to permanently delete customer "${customerName || 'Customer'}"? All stamps, visits, and vouchers belonging to them will be permanently erased.`,
      confirmText: 'Yes, Delete Customer',
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/merchant/customers/${customerId}`, {
            method: 'DELETE'
          });
          const data = await res.json();
          if (data && data.success) {
            setCustomers(prev => prev.filter(c => c.id !== customerId && c._id !== customerId));
            if (customerModalOpen && (customerModalOpen.id === customerId || customerModalOpen._id === customerId)) {
              setCustomerModalOpen(null);
            }
            fetchCustomers(customerSearch, customerFilter);
          }
        } catch (err) {}
      }
    });
  };

  const handleDeleteReward = (r) => {
    requestConfirm({
      title: 'Permission Required: Delete Reward Rule',
      message: `Are you sure you want to delete reward rule "${r.title}"? Shoppers will no longer be able to win this prize.`,
      confirmText: 'Yes, Delete Reward',
      type: 'danger',
      onConfirm: () => {
        setRewards(prev => prev.filter(rw => rw.id !== r.id));
        if (r.id) fetch(`/api/merchant/rewards/${r.id}`, { method: 'DELETE' }).catch(() => {});
      }
    });
  };

  const handleDeleteMenuItem = (item) => {
    requestConfirm({
      title: 'Permission Required: Remove Menu Item',
      message: `Are you sure you want to remove "${item.name}" from your store's digital menu?`,
      confirmText: 'Yes, Remove Item',
      type: 'danger',
      onConfirm: () => {
        setMenuItems(prev => prev.filter(m => m.id !== item.id));
        fetch(`/api/merchant/menu/${item.id}`, { method: 'DELETE' }).catch(() => {});
      }
    });
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

  // Primary Workflow Navigation (Matching Screens 8, 9, 12, 13)
  const coreNavItems = [
    { id: 'home', label: 'Home Dashboard', icon: Home, badge: 'Main' },
    { id: 'rewards', label: 'Rewards Workflow', icon: Gift, badge: pendingRedemptions.length > 0 ? `${pendingRedemptions.length} New` : null },
    { id: 'create_offer', label: 'Create Offer', icon: PlusCircle },
    { id: 'profile', label: 'Store Profile', icon: User },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 font-sans antialiased flex flex-col selection:bg-red-500 selection:text-white">
      
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







      {/* Hidden file input for store logo (globally accessible) */}
      <input 
        type="file" 
        ref={storeLogoInputRef} 
        accept="image/*" 
        onChange={handleStoreLogoUpload} 
        className="hidden" 
      />

      {/* ========================================================= */}
      {/* ========================================================= */}
      {/* THEME COLOR HEADER (Crimson #74111d Brand Header) */}
      {/* Normal nav bar links without pill container */}
      {/* ========================================================= */}
      <header className="sticky top-0 inset-x-0 z-40 w-full bg-gradient-to-r from-[#690005] via-[#74111d] to-[#590104] border-b border-[#5e0c15] shadow-md">
        
        {/* MOBILE HEADER */}
        <div className="md:hidden px-4 py-3 relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            {/* Store Icon */}
            <div 
              onClick={() => storeLogoInputRef.current?.click()}
              className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 shadow-xs flex items-center justify-center overflow-hidden shrink-0 cursor-pointer p-0.5"
              title="Change store logo"
            >
              {storeLogo ? (
                <img src={storeLogo} alt={storeName} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <Store className="w-5 h-5 text-white" />
              )}
            </div>

            {/* Store Name & Portal Title */}
            <div className="min-w-0">
              <h1 className="text-base font-black text-white tracking-tight truncate leading-tight">
                {storeName || 'Ka-feen Café'}
              </h1>
              <span className="text-[9px] font-bold text-red-200 uppercase tracking-wider block mt-0.5">
                Store Owner Portal
              </span>
            </div>
          </div>

          {/* Profile Button on the Right */}
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition cursor-pointer shrink-0 ${
              activeTab === 'profile'
                ? 'bg-white text-[#74111d] border-white shadow-xs'
                : 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="Store Profile & Settings"
          >
            <User className="w-4 h-4" />
          </button>
        </div>

        {/* DESKTOP / LAPTOP HEADER */}
        <div className="hidden md:block max-w-[1200px] mx-auto px-6 lg:px-8 py-3 relative z-10">
          <div className="flex items-center justify-between gap-6">
            
            {/* Left: Store Identity */}
            <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => storeLogoInputRef.current?.click()}>
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 border border-white/20 shadow-md flex items-center justify-center overflow-hidden shrink-0 p-0.5 hover:scale-105 transition-all">
                {storeLogo ? (
                  <img src={storeLogo} alt={storeName} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <Store className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xl sm:text-2xl font-black tracking-tight leading-none text-white">
                  {storeName || 'Royal Sweets & Cafe'}
                </span>
                <span className="text-[10px] font-bold text-red-200 uppercase tracking-widest mt-1">
                  Store Owner Portal
                </span>
              </div>
            </div>

            {/* Center: Simple Normal Navigation Links (No Line, No Pill) */}
            <div className="flex items-center space-x-7 sm:space-x-8">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className={`py-2 px-1 text-sm transition flex items-center space-x-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'home'
                    ? 'text-white font-black'
                    : 'text-white/75 hover:text-white font-semibold'
                }`}
              >
                <Home className={`w-4 h-4 ${activeTab === 'home' ? 'text-white stroke-[2.5]' : 'text-white/80'}`} />
                <span>Home</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('rewards')}
                className={`py-2 px-1 text-sm transition flex items-center space-x-2 cursor-pointer whitespace-nowrap relative ${
                  activeTab === 'rewards'
                    ? 'text-white font-black'
                    : 'text-white/75 hover:text-white font-semibold'
                }`}
              >
                <Gift className={`w-4 h-4 ${activeTab === 'rewards' ? 'text-white stroke-[2.5]' : 'text-white/80'}`} />
                <span>Rewards</span>
                {pendingRedemptions.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('create_offer')}
                className={`py-2 px-1 text-sm transition flex items-center space-x-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'create_offer'
                    ? 'text-white font-black'
                    : 'text-white/75 hover:text-white font-semibold'
                }`}
              >
                <PlusCircle className={`w-4 h-4 ${activeTab === 'create_offer' ? 'text-white stroke-[2.5]' : 'text-white/80'}`} />
                <span>Create Offer</span>
              </button>
            </div>

            {/* Right: Profile & High-Contrast Logout */}
            <div className="flex items-center space-x-3 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`h-9 px-3.5 rounded-xl border flex items-center space-x-1.5 text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'bg-white text-[#74111d] border-white shadow-xs font-black'
                    : 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
                }`}
                title="Store Profile & Settings"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>

              <button
                type="button"
                onClick={handleMerchantLogout}
                className="h-9 px-4 rounded-xl bg-white text-[#74111d] hover:bg-rose-50 font-black flex items-center space-x-1.5 text-xs transition-all shadow-md shadow-black/25 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5 text-[#74111d]" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Trial Expired Alert Banner */}
        {subscriptionInfo.isExpired && (
          <div className="bg-rose-50 border-t border-rose-200 px-4 py-2 text-center text-xs font-bold text-rose-800 flex items-center justify-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
            <span>3-DAY TRIAL EXPIRED — STORE OFFLINE: Please buy a subscription plan to bring your store back online.</span>
            <button 
              onClick={() => setBuyPlanModalOpen(true)}
              className="ml-2 bg-gradient-to-r from-[#74111d] to-[#981b2a] hover:from-[#5e0c15] hover:to-[#801321] text-white font-black px-2.5 py-0.5 rounded-lg text-[10px] uppercase tracking-wider cursor-pointer shadow-xs"
            >
              Renew Now
            </button>
          </div>
        )}
      </header>

      {/* ========================================================= */}
      {/* MAIN DASHBOARD CONTENT AREA */}
      {/* ========================================================= */}
      <div className="flex-1 w-full min-w-0 flex flex-col pb-20 md:pb-12">
        <main className="p-3.5 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-[1100px] w-full mx-auto">

          {/* ============================================================= */}
          {/* PILLAR 1: SCANS (LIVE COUNTER TRAFFIC FEED) */}
          {/* ============================================================= */}
          {activeTab === 'scans' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">1. Scans — Live Traffic Feed</h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Real-time log of customer phone scans at your billing counter</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveTab('qr')}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-xs cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Standee</span>
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-300 transition flex items-center space-x-2 shadow-xs cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy QR Link</span>
                  </button>
                </div>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase mb-1">
                    <span>Total Scans</span>
                    <Smartphone className="w-4 h-4 text-[#851421]" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{scansTotal.toLocaleString()}</div>
                  <div className="text-[11px] font-bold text-emerald-600 mt-1">+28% this week</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase mb-1">
                    <span>Scans Today</span>
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{scansTodayCount}</div>
                  <div className="text-[11px] font-bold text-blue-600 mt-1">Real-time counter</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase mb-1">
                    <span>Unique Scanners</span>
                    <Users className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{customers.length || 894}</div>
                  <div className="text-[11px] font-bold text-emerald-600 mt-1">42.8% repeat rate</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase mb-1">
                    <span>Active Display</span>
                    <QrCode className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">1 Standee</div>
                  <div className="text-[11px] font-bold text-slate-500 mt-1">Main Counter Online</div>
                </div>
              </div>

              {/* Live Scans Table */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black uppercase text-slate-700">Recent Customer QR Scans ({scansList.length})</span>
                  </div>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={scansSearch}
                      onChange={(e) => setScansSearch(e.target.value)}
                      placeholder="Search phone or name..."
                      className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-600 w-full sm:w-64"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Timestamp</th>
                        <th className="py-3 px-4">Location / Counter</th>
                        <th className="py-3 px-4">Device</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {scansList
                        .filter(s => !scansSearch || s.customerName?.toLowerCase().includes(scansSearch.toLowerCase()) || s.phone?.includes(scansSearch))
                        .map((scan) => (
                          <tr key={scan.id} className="hover:bg-slate-50/60 transition">
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-900">{scan.customerName}</div>
                              <div className="text-[11px] text-slate-500 font-mono">{scan.phone}</div>
                            </td>
                            <td className="py-3.5 px-4 font-medium text-slate-600">
                              <div>{scan.time}</div>
                              <div className="text-[10px] text-slate-400">{scan.date}</div>
                            </td>
                            <td className="py-3.5 px-4 font-medium text-slate-700">
                              {scan.branch || 'Main Counter'}
                            </td>
                            <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                              {scan.device || 'Android (Chrome)'}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">
                                ✓ Verified Scan
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => setActiveTab('customers')}
                                className="text-xs font-bold text-[#74111d] hover:underline cursor-pointer"
                              >
                                View CRM
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

          {/* ============================================================= */}
          {/* PILLAR 3: REWARDS (ACTIVE OFFERS & FAST POS BURN) */}
          {/* ============================================================= */}
                    {/* ============================================================= */}
          {/* SCREEN 9, 10, 11: REWARDS WORKFLOW (Pending, Approved, Declined) */}
          {/* ============================================================= */}
          {/* ============================================================= */}
          {/* SCREEN 9, 10, 11: REWARDS WORKFLOW (Matching media_1791468660903.png) */}
          {/* ============================================================= */}
          {activeTab === 'rewards' && (
            <div className="space-y-4 sm:space-y-5 pb-24 md:pb-12 max-w-xl mx-auto animate-in fade-in duration-200">
              
              {/* 3-Tab Segmented Control (Screen 9, 10, 11 - Matching media_1791468660903.png) */}
              <div className="bg-slate-100/90 p-1 rounded-2xl flex items-center justify-between border border-slate-200/80 shadow-2xs">
                {/* Pending Tab */}
                <button
                  type="button"
                  onClick={() => setRewardsViewTab('pending')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                    rewardsViewTab === 'pending'
                      ? 'bg-white text-[#74111d] border border-rose-300 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Pending</span>
                  {pendingRedemptions.length > 0 && (
                    <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${
                      rewardsViewTab === 'pending' ? 'bg-[#74111d] text-white' : 'bg-slate-300 text-slate-700'
                    }`}>
                      {pendingRedemptions.length}
                    </span>
                  )}
                </button>

                {/* Approved Tab */}
                <button
                  type="button"
                  onClick={() => setRewardsViewTab('approved')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                    rewardsViewTab === 'approved'
                      ? 'bg-[#74111d] text-white shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Approved</span>
                </button>

                {/* Declined Tab */}
                <button
                  type="button"
                  onClick={() => setRewardsViewTab('declined')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                    rewardsViewTab === 'declined'
                      ? 'bg-[#74111d] text-white shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Declined</span>
                </button>
              </div>

              {/* Subheading matching Screen 9, 10, 11 */}
              <div className="flex items-center justify-between pt-1 px-0.5">
                <h3 className="text-sm sm:text-base font-bold text-slate-800">
                  {rewardsViewTab === 'pending' && 'Pending Requests'}
                  {rewardsViewTab === 'approved' && 'Approved Rewards'}
                  {rewardsViewTab === 'declined' && 'Declined Requests'}
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  {rewardsViewTab === 'pending' && `${pendingRedemptions.length} requests`}
                  {rewardsViewTab === 'approved' && `${approvedRedemptions.length} rewards`}
                  {rewardsViewTab === 'declined' && `${declinedRedemptions.length} declined`}
                </span>
              </div>

              {/* TAB 1: PENDING REDEMPTIONS (Screen 9) */}
              {rewardsViewTab === 'pending' && (
                <div className="space-y-3.5">
                  {pendingRedemptions.length === 0 ? (
                    <div className="bg-white border border-slate-200/90 rounded-3xl p-10 text-center text-slate-400 shadow-xs">
                      <Gift className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                      <p className="text-sm font-bold text-slate-700">No pending redemption claims</p>
                      <p className="text-xs text-slate-400 mt-0.5">When customers complete all stamps on their card, their claim will appear here</p>
                    </div>
                  ) : (
                    pendingRedemptions.map((item) => (
                      <div key={item.id} className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs hover:border-slate-300 transition space-y-3.5">
                        <div className="flex items-start space-x-3.5 sm:space-x-4">
                          {/* Left Voucher Thumbnail */}
                          {renderVoucherTile(item.voucherType || item.rewardTitle)}

                          {/* Middle Claim Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base sm:text-lg font-black text-slate-900 leading-tight">{item.customerName}</h4>
                            <p className="text-xs text-slate-400 font-mono font-medium mt-0.5">{item.customerId}</p>
                            <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1.5 leading-snug">{item.rewardTitle}</p>
                            
                            <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{item.timeAgo}</span>
                            </div>
                            <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-700 mt-0.5">
                              <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span>{item.expiresIn}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons: Side-by-side Decline and Accept */}
                        <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100/80">
                          <button
                            type="button"
                            onClick={() => handleDeclineRedemption(item)}
                            className="bg-white hover:bg-rose-50 text-red-700 border border-red-300 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs"
                          >
                            <span>Decline</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAcceptRedemption(item)}
                            className="bg-[#0e5c36] hover:bg-[#094728] text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                          >
                            <span>Accept</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 2: APPROVED REDEMPTIONS (Screen 10) */}
              {rewardsViewTab === 'approved' && (
                <div className="space-y-3.5">
                  {approvedRedemptions.length === 0 ? (
                    <div className="bg-white border border-slate-200/90 rounded-3xl p-10 text-center text-slate-400 shadow-xs">
                      <p className="text-sm font-bold text-slate-700">No approved redemptions yet</p>
                    </div>
                  ) : (
                    approvedRedemptions.map((item) => (
                      <div key={item.id} className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs hover:border-slate-300 transition space-y-3">
                        <div className="flex items-start space-x-3.5 sm:space-x-4">
                          {/* Left Voucher Thumbnail */}
                          {renderVoucherTile(item.voucherType || item.rewardTitle)}

                          {/* Middle Claim Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base sm:text-lg font-black text-slate-900 leading-tight">{item.customerName}</h4>
                            <p className="text-xs text-slate-400 font-mono font-medium mt-0.5">{item.customerId}</p>
                            <p className="text-xs sm:text-sm font-bold text-blue-900 mt-1.5 leading-snug">{item.rewardTitle}</p>
                            
                            <div className="mt-1.5 text-xs text-slate-500">
                              <span className="block text-slate-400 text-[11px]">Approved on</span>
                              <span className="font-semibold text-slate-700">{item.approvedAt}</span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Right Approved Badge */}
                        <div className="flex justify-end pt-1 border-t border-slate-100/80">
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center space-x-1.5">
                            <span>Approved</span>
                            <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[2.5]" />
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 3: DECLINED REDEMPTIONS (Screen 11) */}
              {rewardsViewTab === 'declined' && (
                <div className="space-y-3.5">
                  {declinedRedemptions.length === 0 ? (
                    <div className="bg-white border border-slate-200/90 rounded-3xl p-10 text-center text-slate-400 shadow-xs">
                      <p className="text-sm font-bold text-slate-700">No declined redemption requests</p>
                    </div>
                  ) : (
                    declinedRedemptions.map((item) => (
                      <div key={item.id} className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs hover:border-slate-300 transition space-y-3">
                        <div className="flex items-start space-x-3.5 sm:space-x-4">
                          {/* Left Voucher Thumbnail */}
                          {renderVoucherTile(item.voucherType || item.rewardTitle)}

                          {/* Middle Claim Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base sm:text-lg font-black text-slate-900 leading-tight">{item.customerName}</h4>
                            <p className="text-xs text-slate-400 font-mono font-medium mt-0.5">{item.customerId}</p>
                            <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1.5 leading-snug">{item.rewardTitle}</p>
                            
                            <div className="mt-1.5 text-xs text-rose-600">
                              <span className="block text-slate-400 text-[11px]">Declined on</span>
                              <span className="font-semibold text-rose-700">{item.declinedAt}</span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Right Declined Badge */}
                        <div className="flex justify-end pt-1 border-t border-slate-100/80">
                          <span className="bg-rose-50 text-rose-800 border border-rose-300 font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center space-x-1.5">
                            <span>Declined</span>
                            <X className="w-3.5 h-3.5 text-rose-700 stroke-[2.5]" />
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Active Reward Program Rules Section & Delete Modal Trigger */}
              <div className="pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-black text-slate-900">Active Reward Programs ({rewards.length})</h3>
                  <button
                    onClick={() => setActiveTab('create_offer')}
                    className="text-xs font-bold text-[#74111d] hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Another Offer</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {rewards.map((r, i) => (
                    <div key={r.id || i} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs relative flex flex-col justify-between hover:border-slate-300 transition">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-50 text-[#74111d] border border-rose-200">
                            {r.tag || 'Stamp Card'}
                          </span>
                          <span className="text-xs font-bold text-slate-400">Live</span>
                        </div>
                        <h4 className="font-black text-slate-900 text-sm mb-1">{r.title}</h4>
                        <p className="text-xs text-slate-500 font-medium">{r.condition}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                        <span className="text-emerald-600 flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>Active Program</span>
                        </span>
                        <button
                          onClick={() => setDeleteRewardModal({ isOpen: true, reward: r })}
                          className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer"
                          title="Delete Reward"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ============================================================= */}
          {/* PILLAR 5: SCRATCH CARDS */}
          {/* ============================================================= */}
          {activeTab === 'scratch_cards' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">5. Scratch Cards & Gamification</h2>
                  <p className="text-xs text-slate-500 mt-1">Configure win probabilities & preview interactive customer scratch card</p>
                </div>
                <button
                  onClick={() => setScratchModalOpen(true)}
                  className="bg-[#74111d] hover:bg-[#5e0c15] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 shadow-md shadow-[#74111d]/25 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Configure Rules</span>
                </button>
              </div>

              {/* Rules Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {scratchRules.map((r, i) => (
                  <div key={r.id || i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-7 h-7 rounded-lg bg-rose-100 text-[#74111d] flex items-center justify-center font-black text-xs">
                        #{i + 1}
                      </span>
                      <span className="text-xs font-black text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {r.probability}
                      </span>
                    </div>
                    <h4 className="font-black text-slate-900 text-sm mb-1">{r.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">{r.condition}</p>
                  </div>
                ))}
              </div>

              {/* Interactive Scratch Card Preview Box */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-700 max-w-xl mx-auto text-center space-y-4">
                <div className="inline-flex items-center space-x-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Live Customer Experience Simulator</span>
                </div>
                <h3 className="text-lg font-black">Interactive Customer Scratch Card</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  When a customer scans your QR standee at the counter, they scratch this virtual card to reveal their surprise discount voucher!
                </p>

                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl max-w-xs mx-auto">
                  <div className="p-4 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 rounded-xl font-black text-sm shadow-md">
                    🎉 YOU WON: 15% OFF On Total Bill!
                  </div>
                  <div className="text-[10px] text-slate-300 mt-2 font-mono">Counter PIN: 4821 • Valid 7 Days</div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* PILLAR 6: DIGITAL MENU */}
          {/* ============================================================= */}
          {activeTab === 'digital_menu' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">6. Digital Menu Catalog</h2>
                  <p className="text-xs text-slate-500 mt-1">Customers view this contactless menu on their phone when scanning your QR standee</p>
                </div>
                <button
                  onClick={() => setMenuModalOpen(true)}
                  className="bg-[#74111d] hover:bg-[#5e0c15] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 shadow-md shadow-[#74111d]/25 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Menu Item</span>
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {['ALL', 'Beverages', 'Starters', 'Mains', 'Desserts'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setMenuFilterCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      menuFilterCategory === cat ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {cat === 'ALL' ? 'All Items' : cat}
                  </button>
                ))}
              </div>

              {/* Menu Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems
                  .filter(m => menuFilterCategory === 'ALL' || m.category === menuFilterCategory)
                  .map((item) => (
                    <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`w-3.5 h-3.5 rounded-full border-2 ${
                            item.isVeg ? 'border-emerald-600 bg-emerald-500' : 'border-rose-600 bg-rose-500'
                          }`} title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}></span>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                            {item.category}
                          </span>
                        </div>
                        <h4 className="font-black text-slate-900 text-sm">{item.name}</h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-base font-black text-slate-900 font-mono">₹{item.price}</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              const newStock = !item.inStock;
                              setMenuItems(menuItems.map(m => m.id === item.id ? { ...m, inStock: newStock } : m));
                              fetch(`/api/merchant/menu/${item.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ inStock: newStock })
                              }).catch(() => {});
                            }}
                            className={`text-[11px] font-black px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                              item.inStock !== false ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                            }`}
                          >
                            {item.inStock !== false ? 'In Stock' : 'Out of Stock'}
                          </button>
                          <button
                            onClick={() => handleDeleteMenuItem(item)}
                            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* VIEW 1: HOME TAB (Image 3) */}
          {/* ------------------------------------------------------------- */}
                    {/* ============================================================= */}
          {/* SCREEN 8: HOME DASHBOARD (Matching Uploaded Mockup) */}
          {/* Responsive for Mobile and Laptop */}
          {/* ============================================================= */}
          {activeTab === 'home' && (
            <div className="space-y-4 sm:space-y-6 pb-24 md:pb-12 animate-in fade-in duration-200">

              {/* OVERVIEW SECTION (Matching Image Header & Period Filter) */}
              {isFeatureVisible('home_overview') && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h2 className="text-base sm:text-xl font-black text-slate-900 tracking-tight">Overview</h2>
                    
                    {/* Period Dropdown Filter ("This Month ∨") */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setPeriodDropdownOpen(!periodDropdownOpen)}
                        className="bg-white border border-slate-200/90 hover:border-slate-300 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xs flex items-center space-x-1.5 transition cursor-pointer"
                      >
                        <span>{overviewPeriod}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      {periodDropdownOpen && (
                        <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-30 text-xs font-bold text-slate-700 animate-in fade-in zoom-in-95 duration-100">
                          {['This Month', 'Today', 'This Week', 'All Time'].map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => { setOverviewPeriod(p); setPeriodDropdownOpen(false); }}
                              className={`w-full text-left px-3.5 py-2 hover:bg-rose-50 hover:text-[#8B0000] transition cursor-pointer ${
                                overviewPeriod === p ? 'text-[#8B0000] font-black bg-rose-50/60' : ''
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 4 Overview Metric Cards (2x2 on Mobile, 4-in-a-row on Laptop - Matching media_1791468006886.png) */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                    {/* Card 1: Total Scans */}
                    <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs hover:border-slate-300 transition flex items-center space-x-3.5 sm:space-x-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6 text-rose-700 stroke-[2]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-semibold text-slate-500 truncate">Total Scans</div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none my-1">
                          {overviewPeriod === 'Today' ? todayStats.scansToday : '2,453'}
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-emerald-500">+18.5%</div>
                      </div>
                    </div>

                    {/* Card 2: Total Customers */}
                    <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs hover:border-slate-300 transition flex items-center space-x-3.5 sm:space-x-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0">
                        <User className="w-6 h-6 text-purple-600 stroke-[2]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-semibold text-slate-500 truncate">Total Customers</div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none my-1">
                          {overviewPeriod === 'Today' ? (todayStats.completedToday * 2) : '586'}
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-emerald-500">+12.3%</div>
                      </div>
                    </div>

                    {/* Card 3: Rewards Redeemed */}
                    <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs hover:border-slate-300 transition flex items-center space-x-3.5 sm:space-x-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                        <Gift className="w-6 h-6 text-emerald-600 stroke-[2]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-semibold text-slate-500 truncate">Rewards Redeemed</div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none my-1">
                          {overviewPeriod === 'Today' ? todayStats.completedToday : '128'}
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-emerald-500">+15.7%</div>
                      </div>
                    </div>

                    {/* Card 4: Repeat Rate */}
                    <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs hover:border-slate-300 transition flex items-center space-x-3.5 sm:space-x-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                        <RefreshCw className="w-6 h-6 text-amber-500 stroke-[2]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-semibold text-slate-500 truncate">Repeat Rate</div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none my-1">
                          42%
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-emerald-500">+8.2%</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* YOUR QR CODE SECTION (Matching Image with Download & Print buttons) */}
              {isFeatureVisible('home_qr_code') && (
                <div className="bg-white border border-slate-100/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">Your QR Code</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      Let customers scan to collect stamps
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-5 sm:gap-8 pt-1">
                    {/* Left: QR Code with centered gift badge */}
                    <div className="w-44 h-44 sm:w-48 sm:h-48 bg-white rounded-2xl p-2.5 border border-slate-100 flex items-center justify-center shadow-xs relative shrink-0">
                      {merchantQrDataUrl ? (
                        <img src={merchantQrDataUrl} alt="Store QR Code" className="w-36 h-36 sm:w-40 sm:h-40 object-contain" />
                      ) : (
                        <svg className="w-36 h-36" viewBox="0 0 100 100" fill="currentColor">
                          <path d="M0 0h30v30H0zM10 10h10v10H10zM70 0h30v30H70zM80 10h10v10H80zM0 70h30v30H0zM10 80h10v10H10zM40 10h10v10H40zM50 20h10v10H50zM40 30h10v10H40zM20 40h10v10H20zM30 50h10v10H30zM10 50h10v10H10zM50 50h10v10H50zM60 40h10v10H60zM70 50h10v10H70zM80 40h10v10H80zM40 70h10v10H40zM50 80h10v10H50zM70 70h10v10H70zM80 80h10v10H80zM90 70h10v10H90z"/>
                        </svg>
                      )}
                      
                      {/* Center Gift Box Badge (Exact match to uploaded image) */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#8B0000] flex items-center justify-center text-white shadow-md border-2 border-white">
                          <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex flex-col justify-center w-full sm:max-w-xs space-y-3">
                      <button
                        type="button"
                        onClick={handleDownload}
                        className="w-full bg-[#8B0000] hover:bg-[#720000] text-white font-extrabold py-3.5 px-6 rounded-xl sm:rounded-2xl shadow-md shadow-red-950/20 transition flex items-center justify-center space-x-2 cursor-pointer text-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download QR</span>
                      </button>

                      <button
                        type="button"
                        onClick={handlePrintQr}
                        className="w-full border border-slate-200 hover:border-[#8B0000] bg-white hover:bg-rose-50/50 text-[#8B0000] font-extrabold py-3.5 px-6 rounded-xl sm:rounded-2xl transition flex items-center justify-center space-x-2 cursor-pointer text-sm shadow-2xs"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Print QR</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="w-full text-slate-400 hover:text-slate-700 text-xs font-bold py-1 transition flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedToast ? 'Copied Scan Link!' : 'Copy Counter Scan Link'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTIVE PLAN BANNER ("You're on Pro Plan" — Exact Match to Image) */}
              {isFeatureVisible('home_plan_banner') && (
                <div className="bg-gradient-to-r from-orange-50/70 via-rose-50/80 to-amber-50/70 border border-orange-200/50 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex items-center justify-between shadow-xs">
                  <div className="flex items-center space-x-3.5">
                    {/* Glowing Gold Crown */}
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
                      <Crown className="w-6 h-6 text-white fill-white" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                        You're on Pro Plan
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Your plan is active until 20 Aug 2026
                      </p>
                    </div>
                  </div>

                  {/* Price Pill Button */}
                  <button
                    type="button"
                    onClick={() => setBuyPlanModalOpen(true)}
                    className="bg-white hover:bg-rose-50/60 border border-rose-200/60 shadow-2xs px-3.5 py-1.5 rounded-xl flex items-center space-x-1 cursor-pointer transition shrink-0 group"
                  >
                    <span className="font-black text-[#8B0000] text-xs sm:text-sm">₹999</span>
                    <span className="text-slate-500 text-[11px] font-bold">/ year</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#8B0000] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              )}

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
                      <div key={c.id} className="p-3 sm:p-4 flex items-center justify-between hover:bg-slate-50/70 transition gap-2">
                        <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black text-sm shrink-0">
                            {c.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-black text-slate-900 truncate">{c.name}</div>
                            <div className="text-xs text-slate-500 font-mono truncate">+91 {c.phone}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5 truncate">Last visit: {c.lastVisit}</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
                          <button
                            onClick={() => handleGiveStampToCustomer(c.phone)}
                            className="bg-red-50 hover:bg-red-100 text-[#74111d] text-xs font-black px-2.5 sm:px-3 py-1.5 rounded-xl border border-red-200 transition flex items-center space-x-1 cursor-pointer shrink-0 shadow-2xs"
                            title="Authorize 1 Stamp for this Customer"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>Give Stamp</span>
                          </button>

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
                            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                            title="View Customer Details"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCustomer(c.id || c._id, c.name)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                            title="Delete Customer Record"
                          >
                            <Trash2 className="w-4 h-4" />
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
                    {/* ============================================================= */}
          {/* SCREEN 12: CREATE OFFER PROGRAM (Directly Matching Screen 12) */}
          {/* ============================================================= */}
          {/* ============================================================= */}
          {/* SCREEN 12: CREATE OFFER PROGRAM (Matching media_1791467973803.png) */}
          {/* Responsive for Mobile and Laptop */}
          {/* ============================================================= */}
          {activeTab === 'create_offer' && (
            <div className="space-y-4 sm:space-y-6 pb-24 md:pb-12 max-w-xl mx-auto animate-in fade-in duration-200">
              
              {/* Main Card Form */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-5">
                
                {/* 1. Offer Image */}
                <div>
                  <label className="block text-sm font-bold text-slate-800">Offer Image</label>
                  <p className="text-xs text-slate-400 mt-0.5">Upload attractive image for your offer</p>

                  <div className="flex items-center space-x-3 mt-3">
                    {/* Active Offer Image / Default Red 30% OFF Badge */}
                    {!offerImageRemoved && (
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl relative overflow-hidden bg-gradient-to-br from-[#800d1a] to-[#45070e] text-white flex flex-col items-center justify-center p-2 text-center shadow-xs border border-red-950/20 shrink-0">
                        {offerBanner ? (
                          <img src={offerBanner} alt="Offer Banner" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <>
                            <span className="text-2xl sm:text-3xl font-black leading-none">30%</span>
                            <span className="text-sm sm:text-base font-black leading-tight">OFF</span>
                            <span className="text-[8px] font-bold text-red-200 mt-1 uppercase tracking-wider">LIMITED TIME</span>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setOfferBanner('');
                            setOfferImageRemoved(true);
                          }}
                          className="w-5 h-5 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center absolute top-1.5 right-1.5 text-xs transition cursor-pointer shadow-xs"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {/* Upload Image Box */}
                    <input 
                      type="file" 
                      ref={offerBannerInputRef} 
                      accept="image/*" 
                      onChange={handleOfferBannerUpload} 
                      className="hidden" 
                    />
                    <div 
                      onClick={() => offerBannerInputRef.current?.click()}
                      className="w-28 h-24 sm:w-32 sm:h-28 rounded-2xl border-2 border-dashed border-slate-300 hover:border-red-400 bg-slate-50/50 flex flex-col items-center justify-center p-2 text-center cursor-pointer transition shrink-0 group"
                    >
                      <ImageIcon className="w-6 h-6 text-red-600 mb-1 group-hover:scale-110 transition" />
                      <span className="text-xs font-bold text-red-700">Upload Image</span>
                      <span className="text-[9px] text-slate-400 mt-0.5">JPG, PNG up to 5MB</span>
                    </div>
                  </div>
                </div>

                {/* 2. Offer Title */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">Offer Title</label>
                  <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:border-red-600 focus-within:ring-1 focus-within:ring-red-600/20 transition">
                    <input
                      type="text"
                      maxLength={100}
                      value={offerTitle}
                      onChange={(e) => setOfferTitle(e.target.value)}
                      placeholder="30% OFF on Next Purchase"
                      className="w-full text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none bg-transparent pr-14"
                    />
                    <span className="absolute right-3 text-xs text-slate-400 font-medium">
                      {offerTitle.length}/100
                    </span>
                  </div>
                </div>

                {/* 3. Offer Description */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">Offer Description</label>
                  <div className="relative bg-white border border-slate-200 rounded-xl p-3 focus-within:border-red-600 focus-within:ring-1 focus-within:ring-red-600/20 transition">
                    <textarea
                      rows={3}
                      maxLength={200}
                      value={offerDescription}
                      onChange={(e) => setOfferDescription(e.target.value)}
                      placeholder="Get 30% off on your next purchase. Thank you for being our loyal customer!"
                      className="w-full text-xs sm:text-sm font-medium text-slate-800 focus:outline-none bg-transparent resize-none pb-4"
                    />
                    <span className="absolute bottom-2 right-3 text-xs text-slate-400 font-medium">
                      {offerDescription.length}/200
                    </span>
                  </div>
                </div>

                {/* 4. Two Columns: Required Stamps & Expiry */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Left: Required Stamps */}
                  <div className="border border-slate-200 rounded-2xl p-3.5 sm:p-4 bg-white flex flex-col justify-between">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 mb-2">
                      <User className="w-4 h-4 text-red-700" />
                      <span>Required Stamps</span>
                    </div>
                    <div className="flex items-center justify-center space-x-4 my-2">
                      <button
                        type="button"
                        onClick={() => setOfferStampsRequired(Math.max(1, offerStampsRequired - 1))}
                        className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold flex items-center justify-center text-lg transition cursor-pointer shadow-2xs"
                      >
                        -
                      </button>
                      <span className="text-xl font-black text-slate-900 w-8 text-center">{offerStampsRequired}</span>
                      <button
                        type="button"
                        onClick={() => setOfferStampsRequired(Math.min(20, offerStampsRequired + 1))}
                        className="w-8 h-8 rounded-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-bold flex items-center justify-center text-lg transition cursor-pointer shadow-xs"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight mt-1">
                      Customer needs to collect {offerStampsRequired} stamps to unlock this offer
                    </p>
                  </div>

                  {/* Right: Expiry */}
                  <div className="border border-slate-200 rounded-2xl p-3.5 sm:p-4 bg-white flex flex-col justify-between">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 mb-2">
                      <Calendar className="w-4 h-4 text-red-700" />
                      <span>Expiry</span>
                    </div>
                    <div className="relative my-2">
                      <select
                        value={offerValidity}
                        onChange={(e) => setOfferValidity(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 appearance-none focus:outline-none focus:border-red-600 cursor-pointer pr-8"
                      >
                        <option value="30 Days">30 Days</option>
                        <option value="60 Days">60 Days</option>
                        <option value="90 Days">90 Days</option>
                        <option value="180 Days">6 Months</option>
                        <option value="365 Days">1 Year</option>
                        <option value="No Expiry">No Expiry</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight mt-1">
                      Offer will expire after {offerValidity} from creation
                    </p>
                  </div>
                </div>

                {/* 5. Highlight Banner */}
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-red-700 flex items-center justify-center shrink-0">
                    <Gift className="w-4 h-4 text-red-700" />
                  </div>
                  <p className="text-xs font-medium text-slate-700 leading-snug">
                    This offer will be available for all customers once they collect the required stamps.
                  </p>
                </div>

                {/* 6. Action Buttons */}
                <div className="space-y-2.5 pt-1">
                  {/* Button 1: Add Another Offer */}
                  <button
                    type="button"
                    onClick={handleResetOrNewOffer}
                    className="w-full bg-white hover:bg-rose-50 text-[#74111d] border border-[#74111d] font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4 text-[#74111d]" />
                    <span>Add Another Offer</span>
                  </button>

                  {/* Button 2: Save Offer Program */}
                  <button
                    type="button"
                    onClick={handleSaveOfferProgram}
                    className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center space-x-2 transition cursor-pointer shadow-md shadow-[#74111d]/20"
                  >
                    <span>Save Offer Program</span>
                  </button>

                  {/* Button 3: View Offer Preview */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowOfferPreview(!showOfferPreview)}
                      className="w-full bg-white hover:bg-rose-50 text-[#74111d] border border-[#74111d]/40 font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center space-x-2 transition cursor-pointer shadow-xs"
                    >
                      <Eye className="w-4 h-4 text-[#74111d]" />
                      <span>{showOfferPreview ? 'Hide Offer Preview' : 'View Offer Preview'}</span>
                    </button>
                    <p className="text-[11px] text-slate-400 text-center mt-1.5">
                      See how this offer will appear to your customers
                    </p>
                  </div>
                </div>

              </div>

              {/* 7. Offer Preview (As seen by customers) - Matching Image 1 */}
              {showOfferPreview && (
                <div className="space-y-2 pt-1 animate-in fade-in duration-200">
                  <div className="flex items-center space-x-1.5 px-1">
                    <span className="text-xs font-bold text-[#74111d]">Offer Preview</span>
                    <span className="text-[11px] text-slate-400 font-medium">(As seen by customers)</span>
                  </div>

                  {/* Customer View Card */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-sm space-y-3">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      {/* Left Thumbnail */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gradient-to-br from-[#800d1a] to-[#45070e] text-white shrink-0 flex flex-col items-center justify-center text-center p-1.5 shadow-2xs">
                        {offerBanner && !offerImageRemoved ? (
                          <img src={offerBanner} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <>
                            <span className="text-xl sm:text-2xl font-black leading-none">30%</span>
                            <span className="text-xs sm:text-sm font-black leading-tight">OFF</span>
                            <span className="text-[7px] font-bold text-red-200 uppercase tracking-wider mt-0.5">LIMITED TIME</span>
                          </>
                        )}
                      </div>

                      {/* Right Content */}
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                          {offerTitle || '30% OFF on Next Purchase'}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-medium">
                          {offerDescription || 'Get 30% off on your next purchase. Thank you for being our loyal customer!'}
                        </p>

                        {/* Meta Badges */}
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-[10px] font-bold text-slate-600">
                          <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md">
                            <User className="w-3 h-3 text-slate-500" />
                            <span>{offerStampsRequired} Stamps Required</span>
                          </div>
                          <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            <span>Valid for {offerValidity}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Customer Bottom Navigation Mockup */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-around text-[10px] font-bold">
                      <div className="flex flex-col items-center space-y-0.5 text-[#74111d]">
                        <Home className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Home</span>
                      </div>
                      <div className="flex flex-col items-center space-y-0.5 text-slate-400">
                        <Award className="w-3.5 h-3.5" />
                        <span>Stamps</span>
                      </div>
                      <div className="flex flex-col items-center space-y-0.5 text-slate-400">
                        <Gift className="w-3.5 h-3.5" />
                        <span>Rewards</span>
                      </div>
                      <div className="flex flex-col items-center space-y-0.5 text-slate-400">
                        <User className="w-3.5 h-3.5" />
                        <span>Profile</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ============================================================= */}


          {/* ============================================================= */}
          {/* SCREEN 6 & 13: MERCHANT PROFILE & SETTINGS (Matching media_1791290845928.png) */}
          {/* ============================================================= */}
          {activeTab === 'profile' && (
            <div className="space-y-3.5 pb-20 animate-in fade-in duration-200 max-w-2xl mx-auto">
              
              {/* Top Curved Crimson Header (Profile & Settings) */}
              <div className="bg-[#74111d] text-white rounded-b-3xl sm:rounded-b-[2.5rem] px-5 sm:px-8 pt-6 pb-8 shadow-md relative overflow-hidden -mx-4 sm:-mx-8 -mt-6 mb-2">
                <div className="flex items-center space-x-3 mb-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('home')}
                    className="p-1 rounded-xl hover:bg-white/10 text-white transition cursor-pointer"
                    title="Back to Dashboard"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">Profile & Settings</h2>
                </div>
                <p className="text-xs text-rose-200/90 font-medium ml-8">
                  Manage your business and account
                </p>
              </div>

              {/* 1. STORE PROFILE HEADER CARD */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="relative">
                    <div 
                      onClick={() => storeLogoInputRef.current?.click()}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-xs bg-slate-50 flex items-center justify-center cursor-pointer group"
                      title="Change Store Photo"
                    >
                      {storeLogo ? (
                        <img src={storeLogo} alt={storeName} className="w-full h-full object-cover" />
                      ) : (
                        <Store className="w-8 h-8 text-[#74111d]" />
                      )}
                    </div>
                    <button 
                      type="button"
                      onClick={() => storeLogoInputRef.current?.click()}
                      title="Change Store Photo"
                      className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#8B0000] hover:bg-[#5e0c15] text-white rounded-full flex items-center justify-center shadow-md cursor-pointer transition transform active:scale-95 border border-white"
                    >
                      <Camera className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 capitalize tracking-tight">{storeName || 'blue code'}</h3>
                    <p className="text-xs text-slate-500 font-semibold">{storeCategory || 'Cafe'}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEditStoreModalOpen(true)}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-2xs cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit</span>
                </button>
              </div>

              {/* 2. LOCATION & HOURS */}
              {isFeatureVisible('location_hours') && (
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
              )}

              {/* 3. PHONE & EMAIL */}
              {isFeatureVisible('phone_email') && (
                <div 
                  onClick={() => setContactModalOpen(true)}
                  className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between hover:border-slate-300 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">Phone & Email</h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {phoneEmail.email || phoneEmail.phone || 'No email address set'}
                      </p>
                    </div>
                  </div>
                  <Edit3 className="w-4 h-4 text-slate-400 hover:text-slate-700 shrink-0" />
                </div>
              )}

              {/* 4. SOCIAL LINKS & REVIEWS */}
              {isFeatureVisible('social_reviews') && (
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
              )}

              {/* 5. AUTO APPROVE SCANS (Toggle Switch) */}
              {isFeatureVisible('auto_approve_scans') && (
                <div className="bg-[#fcf8f8] border border-rose-100 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
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
              )}

              {/* 6. ALLOW MULTIPLE SCANS (Toggle Switch) */}
              {isFeatureVisible('allow_multiple_scans') && (
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
              )}

              {/* 7. ALLOW FIRST COIN WITHOUT APPROVAL (New feature requested by user) */}
              {isFeatureVisible('allow_first_coin') && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                      <Coins className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">Allow First Coin Without Approval</h4>
                      <p className="text-[11px] text-slate-500 font-medium">Customer's first visit stamp/coin is awarded instantly without review</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleAllowFirstCoin}
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 shrink-0 ${
                      allowFirstCoinWithoutApproval ? 'bg-[#b71c1c] justify-end' : 'bg-slate-300 justify-start'
                    }`}
                  >
                    <span className="w-4 h-4 bg-white rounded-full shadow-md"></span>
                  </button>
                </div>
              )}

              {/* 8. OWNER ACCOUNT */}
              {isFeatureVisible('owner_account') && (
                <div 
                  onClick={() => setOwnerModalOpen(true)}
                  className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between hover:border-slate-300 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">{ownerAccount.ownerName || 'chandan yadav'}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">Owner Account</p>
                    </div>
                  </div>
                  <Edit3 className="w-4 h-4 text-slate-400 hover:text-slate-700 shrink-0" />
                </div>
              )}

              {/* 9. GROUPED SUBMENU CARD */}
              <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs divide-y divide-slate-100">
                
                {/* Row 1: How to Use BeAurex */}
                {isFeatureVisible('tutorial_video') && (
                  <div 
                    onClick={() => setVideoModalOpen(true)}
                    className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition cursor-pointer"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                        <Play className="w-5 h-5 fill-current" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900">How to Use BeAurex</h4>
                        <p className="text-[11px] text-slate-500 font-medium">Watch a quick tutorial video</p>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </div>
                )}

                {/* Row 2: Download App */}
                {isFeatureVisible('download_app') && (
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
                )}

                {/* Row 3: Subscription */}
                {isFeatureVisible('subscription_manage') && (
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
                )}

                {/* Row 4: Privacy Policy */}
                <div 
                  onClick={() => {
                    setLegalPolicyModalTab('privacy');
                    setLegalPolicyModalOpen(true);
                  }}
                  className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">Privacy Policy</h4>
                      <p className="text-[11px] text-slate-500 font-medium">Read data & privacy policies</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>

                {/* Row 5: Terms & Conditions */}
                <div 
                  onClick={() => {
                    setLegalPolicyModalTab('terms');
                    setLegalPolicyModalOpen(true);
                  }}
                  className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#74111d] flex items-center justify-center shrink-0 border border-rose-100">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">Terms & Conditions</h4>
                      <p className="text-[11px] text-slate-500 font-medium">Read user terms & conditions</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>

              </div>

              {/* 10. BOTTOM LOGOUT BUTTON */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleMerchantLogout}
                  className="w-full bg-[#e53935] hover:bg-[#d32f2f] text-white font-bold py-3.5 rounded-2xl shadow-md transition flex items-center justify-center space-x-2 text-sm cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
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

                {/* Row 4: Privacy Policy */}
                <div 
                  onClick={() => {
                    setLegalPolicyModalTab('privacy');
                    setLegalPolicyModalOpen(true);
                  }}
                  className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">Privacy Policy</h4>
                      <p className="text-[11px] text-slate-500 font-medium">Read data & privacy policies</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>

                {/* Row 5: Terms & Conditions */}
                <div 
                  onClick={() => {
                    setLegalPolicyModalTab('terms');
                    setLegalPolicyModalOpen(true);
                  }}
                  className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#74111d] flex items-center justify-center shrink-0 border border-rose-100">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">Terms & Conditions</h4>
                      <p className="text-[11px] text-slate-500 font-medium">Read user terms & conditions</p>
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
                      onClick={() => handleDeleteMenuItem(item)}
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
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

            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => handleDeleteCustomer(customerModalOpen.id || customerModalOpen._id, customerModalOpen.name)}
                className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Customer</span>
              </button>
              <button
                onClick={() => setCustomerModalOpen(null)}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 8: EDIT STORE PROFILE */}
      {/* ========================================================= */}
      {editStoreModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
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

              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLegalPolicyModalTab('privacy');
                    setLegalPolicyModalOpen(true);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 rounded-xl text-[11px] transition cursor-pointer flex items-center justify-center space-x-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Privacy Policy</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLegalPolicyModalTab('terms');
                    setLegalPolicyModalOpen(true);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 rounded-xl text-[11px] transition cursor-pointer flex items-center justify-center space-x-1"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  <span>Terms &amp; Conditions</span>
                </button>
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMerchantProfileModalOpen(false)}
          />

          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 border border-slate-200 my-auto">
            
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

      {/* ========================================================= */}
      {/* MODAL: CREATE REWARD */}
      {/* ========================================================= */}
      {newRewardModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4 animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setNewRewardModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Create New Reward</h3>
                <p className="text-xs text-slate-500">Add an offer or discount to your customer pool</p>
              </div>
            </div>

            <form onSubmit={handleCreateReward} className="space-y-3.5 text-xs font-bold">
              <div>
                <label className="block uppercase text-slate-600 mb-1">Reward Title</label>
                <input
                  type="text"
                  required
                  value={newRewardForm.title}
                  onChange={(e) => setNewRewardForm({ ...newRewardForm, title: e.target.value })}
                  placeholder="e.g. 20% Off Weekend Special"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-slate-600 mb-1">Discount Type</label>
                  <select
                    value={newRewardForm.discountType}
                    onChange={(e) => setNewRewardForm({ ...newRewardForm, discountType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-600 font-bold"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat Off (₹)</option>
                    <option value="FREE_ITEM">Free Item</option>
                  </select>
                </div>
                <div>
                  <label className="block uppercase text-slate-600 mb-1">
                    {newRewardForm.discountType === 'PERCENTAGE' ? 'Discount (%)' : 'Discount Value (₹)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newRewardForm.discountValue}
                    onChange={(e) => setNewRewardForm({ ...newRewardForm, discountValue: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-slate-600 mb-1">Min Bill Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={newRewardForm.minBillAmount}
                    onChange={(e) => setNewRewardForm({ ...newRewardForm, minBillAmount: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block uppercase text-slate-600 mb-1">Validity (Days)</label>
                  <input
                    type="number"
                    min="1"
                    value={newRewardForm.validityDays}
                    onChange={(e) => setNewRewardForm({ ...newRewardForm, validityDays: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase text-slate-600 mb-1">
                  Probability / Win Chance ({newRewardForm.probabilityWeight}%)
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={newRewardForm.probabilityWeight}
                  onChange={(e) => setNewRewardForm({ ...newRewardForm, probabilityWeight: Number(e.target.value) })}
                  className="w-full accent-red-600"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-black py-3 rounded-xl transition text-xs shadow-md shadow-red-600/25 cursor-pointer mt-2"
              >
                Save & Add Reward
              </button>
            </form>
          </div>
        </div>
      )}



      {/* Global Permission & Action Confirmation Modal */}
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

      {/* ========================================================= */}
      {/* SCREEN 1: REWARD CREATED SUCCESSFULLY (media_1791294070588.png) */}
      {/* ========================================================= */}
      {offerSuccessModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[2rem] max-w-sm w-full shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-150 border border-slate-100 flex flex-col">
            
            {/* Top Red Header Strip */}
            <div className="bg-[#74111d] text-white py-3.5 px-6 text-center">
              <h3 className="text-sm font-black tracking-wide">Reward Created</h3>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-7 text-center space-y-5">
              
              {/* Confetti & Green Gift Illustration */}
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                {/* Floating Colorful Confetti Particles */}
                <span className="absolute top-1 left-4 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="absolute top-4 right-3 w-2 h-3 rounded-sm bg-amber-400 rotate-12" />
                <span className="absolute bottom-3 left-3 w-2.5 h-1.5 rounded-sm bg-blue-500 -rotate-45" />
                <span className="absolute bottom-5 right-4 w-2 h-2 rounded-full bg-emerald-400" />
                <span className="absolute top-8 left-1 w-1.5 h-3 rounded-sm bg-purple-500 rotate-45" />
                <span className="absolute top-2 right-9 w-2 h-2 rounded-full bg-amber-500" />

                {/* Mint Green Circle with Gift Box and Checkmark Badge */}
                <div className="w-24 h-24 rounded-full bg-emerald-100/70 border-4 border-emerald-50 flex items-center justify-center relative shadow-inner">
                  <Gift className="w-12 h-12 text-emerald-600 stroke-[1.75]" />
                  
                  {/* Green Checkmark Badge at bottom-right */}
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-md">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1.5">
                <h4 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
                  Reward Created<br />Successfully!
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Your reward program is now live<br className="hidden sm:inline" /> and ready to use.
                </p>
              </div>

              {/* Reward Summary Card */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-3 flex items-center space-x-3.5 text-left shadow-xs">
                {/* Voucher Thumbnail */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#74111d] to-[#45080f] text-white flex flex-col items-center justify-center p-1 shrink-0 shadow-xs text-center border border-red-950/30">
                  <span className="text-sm font-black leading-none font-mono">30%</span>
                  <span className="text-[11px] font-black leading-tight font-mono text-rose-200">OFF</span>
                  <span className="text-[7px] font-bold text-amber-300 uppercase tracking-widest mt-0.5">LIMITED TIME</span>
                </div>

                {/* Text Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h5 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                    {offerTitle || '30% OFF on Next Purchase'}
                  </h5>
                  <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Valid for {offerValidity || '30 Days'}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 font-medium">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{offerStampsRequired || 5} Stamps Required</span>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setOfferSuccessModalOpen(false);
                    setActiveTab('home');
                  }}
                  className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-black py-3.5 rounded-xl shadow-md shadow-[#74111d]/20 transition cursor-pointer text-xs"
                >
                  Back to Home
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOfferSuccessModalOpen(false);
                    setActiveTab('create_offer');
                    setOfferTitle('');
                    setOfferDescription('');
                  }}
                  className="w-full bg-white hover:bg-rose-50 text-[#74111d] border border-rose-300 font-black py-3.5 rounded-xl transition cursor-pointer text-xs"
                >
                  Create Another Reward
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SCREEN 2: DELETE REWARD CONFIRMATION MODAL (media_1791294070588.png) */}
      {/* ========================================================= */}
      {deleteRewardModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xs sm:max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-150 border border-slate-100">
            {/* Red Trash Icon in Soft Circle */}
            <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-[#74111d]">
              <Trash2 className="w-6 h-6 text-[#74111d]" strokeWidth={2} />
            </div>

            {/* Title & Description matching Screen 2 */}
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900">Delete Reward?</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                This action cannot be undone.<br />
                Are you sure you want to delete this reward?
              </p>
            </div>

            {/* Side-by-side Cancel and Delete Buttons */}
            <div className="flex items-center space-x-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteRewardModal({ isOpen: false, reward: null })}
                className="flex-1 bg-white hover:bg-rose-50 text-[#74111d] border border-rose-300 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deleteRewardModal.reward) {
                    setRewards(prev => prev.filter(r => r.id !== deleteRewardModal.reward.id));
                  }
                  setDeleteRewardModal({ isOpen: false, reward: null });
                }}
                className="flex-1 bg-[#74111d] hover:bg-[#5e0c15] text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer shadow-md shadow-[#74111d]/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* BOTTOM MOBILE APP NAVIGATION (Screen 8 — Hidden on Desktop) */}
      {/* ========================================================= */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-6 z-40 flex items-center justify-around shadow-lg">
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center space-y-0.5 transition cursor-pointer relative ${
            activeTab === 'home' ? 'text-[#8B0000]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-1 rounded-xl transition ${activeTab === 'home' ? 'text-[#8B0000]' : ''}`}>
            <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : ''}`} />
          </div>
          <span className={`text-[10px] font-bold ${activeTab === 'home' ? 'font-black text-[#8B0000]' : ''}`}>Home</span>
          {activeTab === 'home' && <span className="w-6 h-0.5 bg-[#8B0000] rounded-full mt-0.5" />}
        </button>

        {isFeatureVisible('rewards_tab') && (
        <button
          type="button"
          onClick={() => setActiveTab('rewards')}
          className={`flex flex-col items-center space-y-0.5 transition cursor-pointer relative ${
            activeTab === 'rewards' ? 'text-[#8B0000]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-1 rounded-xl transition ${activeTab === 'rewards' ? 'text-[#8B0000]' : ''}`}>
            <Gift className={`w-5 h-5 ${activeTab === 'rewards' ? 'stroke-[2.5]' : ''}`} />
          </div>
          <span className={`text-[10px] font-bold ${activeTab === 'rewards' ? 'font-black text-[#8B0000]' : ''}`}>Rewards</span>
          {pendingRedemptions.length > 0 && (
            <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white"></span>
          )}
          {activeTab === 'rewards' && <span className="w-6 h-0.5 bg-[#8B0000] rounded-full mt-0.5" />}
        </button>
        )}

        {isFeatureVisible('create_offer_tab') && (
        <button
          type="button"
          onClick={() => setActiveTab('create_offer')}
          className={`flex flex-col items-center space-y-0.5 transition cursor-pointer relative ${
            activeTab === 'create_offer' ? 'text-[#8B0000]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-1 rounded-xl transition ${activeTab === 'create_offer' ? 'text-[#8B0000]' : ''}`}>
            <PlusCircle className={`w-5 h-5 ${activeTab === 'create_offer' ? 'stroke-[2.5]' : ''}`} />
          </div>
          <span className={`text-[10px] font-bold ${activeTab === 'create_offer' ? 'font-black text-[#8B0000]' : ''}`}>Create Offer</span>
          {activeTab === 'create_offer' && <span className="w-6 h-0.5 bg-[#8B0000] rounded-full mt-0.5" />}
        </button>
        )}
      </nav>

      {/* Platform Synchronized Legal Policy Modal */}
      <LegalPolicyModal
        isOpen={legalPolicyModalOpen}
        onClose={() => setLegalPolicyModalOpen(false)}
        initialTab={legalPolicyModalTab}
      />

    </div>
  );
}
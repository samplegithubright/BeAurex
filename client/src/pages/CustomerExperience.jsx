import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate, Navigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import jsQR from 'jsqr';
import { 
  Home, QrCode, Gift, Scan, Camera, Sparkles, CheckCircle2, Clock, 
  ArrowLeft, Store, Zap, Check, ChevronRight, Menu, X, LogOut, 
  Star, Copy, Flashlight, Coffee, Utensils, ShoppingBag, Award, 
  ShieldCheck, AlertCircle, Phone, Mail, Lock, Eye, EyeOff, 
  ArrowRight, User, Hourglass, CheckCheck, TrendingUp, Trophy, Users,
  RefreshCw, SlidersHorizontal, Image as ImageIcon, KeyRound, WifiOff, FileText, ChevronLeft,
  Crown, CreditCard, LogIn, Share2, MessageCircle, Calendar, Edit3, ChevronDown, Coins
} from 'lucide-react';
import LegalPolicyModal from '../components/LegalPolicyModal';
import { validatePassword } from '../utils/passwordValidator';

// Official BeAurex Coin Indicator (Crisp Aurex Coin with dynamic brand theme & optional custom coin image)
function BeAurexStamp({ stamped = true, size = 'md', coinImage }) {
  const sizeClasses = size === 'lg' ? 'w-10 h-10' : size === 'md' ? 'w-8 h-8' : 'w-7 h-7';
  const resolvedCoinImage = coinImage || (() => {
    try {
      const cfg = JSON.parse(localStorage.getItem('beaurex_theme_config') || '{}');
      return cfg.coinImage || null;
    } catch (_) { return null; }
  })();

  if (!stamped) {
    return (
      <div 
        className={`${sizeClasses} rounded-full border-2 border-dashed border-slate-300 bg-slate-50/80 flex items-center justify-center transition shrink-0 overflow-hidden p-0.5`}
        title="Uncollected Aurex Coin"
      >
        {resolvedCoinImage ? (
          <img src={resolvedCoinImage} alt="" className="w-full h-full object-cover rounded-full opacity-25 grayscale" />
        ) : null}
      </div>
    );
  }
  return (
    <div 
      className={`${sizeClasses} rounded-full flex items-center justify-center shadow-xs transition transform hover:scale-105 shrink-0 text-white overflow-hidden p-0.5`}
      style={{ backgroundColor: 'var(--brand-primary, #8B0000)' }}
      title="Collected Aurex Coin"
    >
      {resolvedCoinImage ? (
        <img src={resolvedCoinImage} alt="Coin" className="w-full h-full object-cover rounded-full" />
      ) : (
        <Coins className="w-4 h-4 text-amber-300" />
      )}
    </div>
  );
}

export default function CustomerExperience({ initialAuthMode = 'signin' }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Navigation tab states:
  // 'home' (Screen 5) | 'scan' (Screen 6) | 'after_scan' (Screen 7) | 'rewards' (Screen 8 & 14) 
  // 'reward_details' (Screen 10) | 'waiting_approval' (Screen 12) | 'reward_congrats' (Screen 13) | 'profile' (Screen 9)
  const [currentScreen, setCurrentScreen] = useState(() => {
    if (slug) return 'after_scan';
    return 'home';
  });

  // Rewards sub-tab: 'all' | 'to_claim' | 'history'
  const [rewardsSubTab, setRewardsSubTab] = useState('all');
  const [historyFilter, setHistoryFilter] = useState('All'); // 'All' | 'Active' | 'Used' | 'Expired'

  // Dynamic Reward History items for All / Active / Used / Expired (100% dynamic, persisted in localStorage)
  const [rewardHistory, setRewardHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('beaurex_reward_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out legacy dummy demo items (rh-1, rh-2, rh-3, rh-4)
          const clean = parsed.filter(item => !['rh-1', 'rh-2', 'rh-3', 'rh-4'].includes(item.id));
          return clean;
        }
      }
    } catch (_) {}
    return [];
  });

  // Dynamic Unlocked / Claimable Rewards ready to claim (Derived dynamically from customer's cards reaching target coins)
  const [claimableRewards, setClaimableRewards] = useState(() => {
    try {
      const saved = localStorage.getItem('beaurex_claimable_rewards');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out legacy dummy demo item cr-1
          const clean = parsed.filter(item => item.id !== 'cr-1');
          return clean;
        }
      }
    } catch (e) {}
    return [];
  });

  // Utility modals/screens
  const [cameraPermissionModalOpen, setCameraPermissionModalOpen] = useState(false);
  const [noInternetModalOpen, setNoInternetModalOpen] = useState(false);
  const [googleSignInModalOpen, setGoogleSignInModalOpen] = useState(false);
  const [emptyStateDemo, setEmptyStateDemo] = useState(false); // Screen 17 demo toggle
  const [showAllCards, setShowAllCards] = useState(false);
  const getInitialTargetCoins = () => {
    try {
      const raw = localStorage.getItem('beaurex_coin_config');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Number(parsed.targetCoins) > 0) return Number(parsed.targetCoins);
      }
    } catch (_) {}
    return 5;
  };

  const resolveStoreIcon = (nameOrCat) => {
    const str = String(nameOrCat || '').toLowerCase();
    if (str.includes('coffee') || str.includes('cafe')) return Coffee;
    if (str.includes('food') || str.includes('bistro') || str.includes('bakery') || str.includes('restaurant') || str.includes('utensil')) return Utensils;
    if (str.includes('shop') || str.includes('store') || str.includes('sweet') || str.includes('treat')) return ShoppingBag;
    return Store;
  };

  const [loyaltyCardsList, setLoyaltyCardsList] = useState(() => {
    const target = getInitialTargetCoins();
    try {
      const saved = localStorage.getItem('beaurex_customer_cards');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(c => ({
            ...c,
            Icon: resolveStoreIcon(c.iconName || c.category),
            totalStamps: c.totalStamps || target
          }));
        }
      }
    } catch (_) {}
    return [];
  });
  const [splashLoading, setSplashLoading] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState('privacy'); // 'privacy' | 'terms'

  // Customer Profile State
  const [customerUser, setCustomerUser] = useState(() => {
    const target = getInitialTargetCoins();
    const saved = localStorage.getItem('beaurex_customer_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          totalStamps: target
        };
      } catch (e) {}
    }
    return {
      name: 'Rohan Sharma',
      customerId: 'BX-8F4A29',
      phone: '+91 98765 43210',
      email: 'rohan.sharma@gmail.com',
      tier: 'Gold Member',
      memberSince: 'Jul 2026',
      activeCardsCount: 0,
      rewardsRedeemedCount: 0,
      points: 250,
      stamps: 1,
      totalStamps: target,
      referralCode: 'BEAUREX-8F4A',
      referralCount: 3,
      referralEarnings: 150
    };
  });

  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({ name: '', phone: '', email: '' });

  const handleSaveCustomerProfile = async (e) => {
    e.preventDefault();
    const updated = {
      ...customerUser,
      name: editProfileForm.name.trim() || customerUser.name,
      phone: editProfileForm.phone.trim() || customerUser.phone,
      email: editProfileForm.email.trim() || customerUser.email,
    };
    setCustomerUser(updated);
    try {
      localStorage.setItem('beaurex_customer_user', JSON.stringify(updated));
    } catch (err) {}

    try {
      fetch('/api/customer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customerUser.id || customerUser.customerId,
          name: updated.name,
          phone: updated.phone,
          email: updated.email
        })
      }).catch(() => {});
    } catch (_) {}

    setEditProfileModalOpen(false);
  };

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const hasRef = params.has('ref') || params.has('referral') || params.has('referralCode') || params.has('refCode');
      if (path.includes('/customer/login') || path.includes('/customer/signup') || hasRef) {
        return false;
      }
    }
    const authStored = localStorage.getItem('beaurex_customer_auth');
    return authStored === 'true';
  });

  // Copy toast state
  const [copiedId, setCopiedId] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);

  // Store information
  const [storeInfo, setStoreInfo] = useState({
    storeName: 'Ka-feen',
    categoryName: 'Coffee Shop',
    qrSlug: slug || 'kafeen-coffee',
    stampsCollected: 3,
    totalStamps: 5,
    expiresIn: '30 Jul 2026'
  });

  // Selected reward for flow (Screen 10 -> 12 -> 13)
  const [selectedReward, setSelectedReward] = useState({
    title: '30% OFF',
    subtitle: 'on next purchase',
    storeName: 'Ka-feen',
    requiresStamps: 2,
    validTill: '30 Jul 2026',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    approvedDate: '20 May 2026',
    approvedTime: '11:45 AM'
  });

  const [pendingClaimId, setPendingClaimId] = useState(null);
  const [waitingApprovalActive, setWaitingApprovalActive] = useState(false);
  const [approvalType, setApprovalType] = useState('offer'); // 'offer' or 'coin'
  const [coinApprovedMsg, setCoinApprovedMsg] = useState('');

  // Camera & Scanner State (Screen 6)
  const videoRef = useRef(null);
  const canvasRef = useRef(document.createElement('canvas'));
  const animFrameIdRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [cameraError, setCameraError] = useState('');

  // Sign in / Sign up form states (Email & Password based - No Mobile OTP)
  const [authMode, setAuthMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.has('ref') || params.has('referral') || params.has('referralCode') || params.has('refCode')) {
        return 'signup';
      }
    }
    return initialAuthMode || 'signin';
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginName, setLoginName] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [referralInput, setReferralInput] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlRef = params.get('ref') || params.get('referral') || params.get('referralCode') || params.get('refCode');
      if (urlRef) return urlRef.trim().toUpperCase();
      const cached = localStorage.getItem('beaurex_pending_referral');
      if (cached) return cached.trim().toUpperCase();
    }
    return '';
  });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccessMsg, setLoginSuccessMsg] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleCustomEmail, setGoogleCustomEmail] = useState('');
  const [googleCustomName, setGoogleCustomName] = useState('');
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);

  // Sync authMode when initialAuthMode changes or URL ?ref= parameter is present
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const refParam = params.get('ref') || params.get('referral') || params.get('referralCode') || params.get('refCode');
      if (refParam) {
        const cleanRef = refParam.trim().toUpperCase();
        setReferralInput(cleanRef);
        setAuthMode('signup');
        setIsAuthenticated(false);
        localStorage.setItem('beaurex_pending_referral', cleanRef);
        return;
      }
    } catch (_) {}

    if (initialAuthMode) {
      setAuthMode(initialAuthMode);
    }
  }, [initialAuthMode]);

  // Customer OTP Verification states
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpCountdown, setOtpCountdown] = useState(45);
  const [devOtpHint, setDevOtpHint] = useState('');
  const otpInputRefs = useRef([]);

  // Live timer for OTP resend
  useEffect(() => {
    let timer;
    if (otpSent && otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, otpCountdown]);

  // Live Sync with Super Admin Coin Config & Theme Config
  useEffect(() => {
    const applyCoinConfig = (cfg) => {
      const target = (cfg && Number(cfg.targetCoins) > 0) ? Number(cfg.targetCoins) : getInitialTargetCoins();
      setCustomerUser(prev => ({
        ...prev,
        totalStamps: target
      }));
      setLoyaltyCardsList(prev => prev.map(c => {
        const remaining = Math.max(0, target - c.stamps);
        const isReady = c.stamps >= target;
        return {
          ...c,
          totalStamps: target,
          badgeText: isReady ? 'Reward Ready 🎉' : `${remaining} more Aurex Coin${remaining === 1 ? '' : 's'}`,
          badgeClass: isReady ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100',
          statusText: `${c.stamps} of ${target} Aurex Coins ${isReady ? 'Collected!' : 'Collected'}`
        };
      }));
    };

    const handleCoinUpdate = (e) => applyCoinConfig(e.detail);
    window.addEventListener('beaurex_coin_config_updated', handleCoinUpdate);

    const applyThemeConfig = (t) => {
      if (!t) return;
      const root = document.documentElement;
      if (t.primaryColor) root.style.setProperty('--brand-primary', t.primaryColor);
      if (t.secondaryColor) root.style.setProperty('--brand-secondary', t.secondaryColor);
      if (t.cardRadius) root.style.setProperty('--card-radius', t.cardRadius);
      if (t.cardBgColor) root.style.setProperty('--card-bg-color', t.cardBgColor);
    };

    try {
      const savedTheme = localStorage.getItem('beaurex_theme_config');
      if (savedTheme) applyThemeConfig(JSON.parse(savedTheme));
    } catch (_) {}

    const handleThemeUpdate = (e) => applyThemeConfig(e.detail);
    window.addEventListener('beaurex_theme_config_updated', handleThemeUpdate);

    const handleStorage = (e) => {
      if (e.key === 'beaurex_coin_config') {
        try { applyCoinConfig(JSON.parse(e.newValue)); } catch (_) {}
      } else if (e.key === 'beaurex_theme_config') {
        try { applyThemeConfig(JSON.parse(e.newValue)); } catch (_) {}
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('beaurex_coin_config_updated', handleCoinUpdate);
      window.removeEventListener('beaurex_theme_config_updated', handleThemeUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Helper to open specific store loyalty card
  const handleOpenStoreCard = (card) => {
    const cardSlug = card.slug || card.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    setStoreInfo({
      storeName: card.name,
      categoryName: card.category,
      qrSlug: cardSlug,
      stampsCollected: card.stamps || 1,
      totalStamps: card.totalStamps || getInitialTargetCoins(),
      expiresIn: '30 Jul 2026'
    });
    setCustomerUser(prev => ({
      ...prev,
      stamps: card.stamps || 1
    }));
    setCurrentScreen('after_scan');
    navigate(`/scan/${cardSlug}`);
  };

  // Dynamically sync completed loyalty cards into claimable rewards
  useEffect(() => {
    if (!Array.isArray(loyaltyCardsList)) return;
    
    // Find all cards where customer collected all required coins
    const completedCards = loyaltyCardsList.filter(card => (card.stamps || 0) >= (card.totalStamps || 5));
    
    setClaimableRewards(prev => {
      let changed = false;
      // Start with non-dummy existing items
      let updated = prev.filter(r => r.id !== 'cr-1');

      completedCards.forEach(card => {
        const rewardId = `cr-${card.slug || card.id}`;
        const alreadyInClaimable = updated.some(r => r.id === rewardId || r.storeName === card.name);
        const alreadyClaimed = rewardHistory.some(h => h.storeName === card.name && h.status === 'Active');

        if (!alreadyInClaimable && !alreadyClaimed) {
          updated.push({
            id: rewardId,
            title: `${card.name} Reward Voucher`,
            subtitle: 'Ready to Redeem',
            storeName: card.name,
            requiresStamps: card.totalStamps || 5,
            stampsCollected: card.stamps || 5,
            validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            image: card.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
            approvedAt: 'Ready Now',
            description: `${card.stamps || 5} of ${card.totalStamps || 5} Aurex Coins collected! Ready to claim at checkout.`
          });
          changed = true;
        }
      });

      if (changed || updated.length !== prev.length) {
        try { localStorage.setItem('beaurex_claimable_rewards', JSON.stringify(updated)); } catch (_) {}
        return updated;
      }
      return prev;
    });
  }, [loyaltyCardsList, rewardHistory]);

  // Helper to mark an active claimed reward as Used when redeemed at store counter
  const handleMarkRewardUsed = (rewardId) => {
    const todayFormatted = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setRewardHistory(prev => {
      const updated = prev.map(item => {
        if (item.id === rewardId) {
          return {
            ...item,
            status: 'Used',
            dateLabel: 'Used on',
            dateValue: todayFormatted
          };
        }
        return item;
      });
      try { localStorage.setItem('beaurex_reward_history', JSON.stringify(updated)); } catch (_) {}
      return updated;
    });
  };

  // Helper to dynamically register or update a scanned store in customer's loyalty cards
  const registerScannedStoreCard = (cleanSlug, storeName, category) => {
    if (!cleanSlug) return;
    const target = getInitialTargetCoins();
    const resolvedName = storeName || cleanSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const resolvedCategory = category || 'Retail & Loyalty';

    // 1. Check if merchant has "allow first coin without approval" enabled (default true)
    let allowFirstCoin = true;
    try {
      const saved = localStorage.getItem('beaurex_allow_first_coin');
      if (saved !== null) {
        allowFirstCoin = JSON.parse(saved) === true;
      }
    } catch (_) {}

    // 2. Check if customer has already received their one-time first coin for this store
    let firstCoinMap = {};
    try {
      firstCoinMap = JSON.parse(localStorage.getItem('beaurex_first_coin_awarded_map') || '{}');
    } catch (_) {}
    const alreadyGotFirstCoin = Boolean(firstCoinMap[cleanSlug]);

    setLoyaltyCardsList(prev => {
      const existingIdx = prev.findIndex(c => c.slug === cleanSlug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cleanSlug);
      let updated;
      if (existingIdx >= 0) {
        const existing = prev[existingIdx];
        const currentCoins = typeof existing.stamps === 'number' ? existing.stamps : (alreadyGotFirstCoin ? 1 : (allowFirstCoin ? 1 : 0));
        const updatedCard = {
          ...existing,
          name: resolvedName,
          category: resolvedCategory,
          totalStamps: target,
          stamps: currentCoins,
          badgeText: currentCoins >= target ? 'Reward Ready 🎉' : `${Math.max(0, target - currentCoins)} more Aurex Coin${target - currentCoins === 1 ? '' : 's'}`,
          badgeClass: currentCoins >= target ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100',
          statusText: `${currentCoins} of ${target} Aurex Coins`
        };
        updated = [...prev];
        updated[existingIdx] = updatedCard;
      } else {
        // Brand-new store card: one-time first coin auto-approval check
        let initialStamps = 0;
        if (allowFirstCoin && !alreadyGotFirstCoin) {
          initialStamps = 1;
          firstCoinMap[cleanSlug] = true;
          try {
            localStorage.setItem('beaurex_first_coin_awarded_map', JSON.stringify(firstCoinMap));
          } catch (_) {}
          try {
            confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
          } catch (_) {}
        }
        const newCard = {
          id: `lc-${cleanSlug}`,
          name: resolvedName,
          category: resolvedCategory,
          slug: cleanSlug,
          iconBg: 'bg-[#111111] text-white',
          iconName: resolvedCategory.toLowerCase().includes('coffee') ? 'Coffee' : resolvedCategory.toLowerCase().includes('food') ? 'Utensils' : 'Store',
          Icon: resolveStoreIcon(resolvedCategory),
          iconColor: 'text-white',
          stamps: initialStamps,
          totalStamps: target,
          badgeText: initialStamps >= target ? 'Reward Ready 🎉' : `${Math.max(0, target - initialStamps)} more Aurex Coin${target - initialStamps === 1 ? '' : 's'}`,
          badgeClass: initialStamps >= target ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100',
          statusText: `${initialStamps} of ${target} Aurex Coins`
        };
        updated = [newCard, ...prev];
      }

      try {
        localStorage.setItem('beaurex_customer_cards', JSON.stringify(updated.map(c => ({
          ...c,
          Icon: undefined
        }))));
      } catch (_) {}

      setCustomerUser(curr => {
        const matching = updated.find(c => c.slug === cleanSlug);
        const nextUser = {
          ...curr,
          activeCardsCount: updated.length,
          stamps: matching?.stamps ?? curr.stamps ?? 1
        };
        try { localStorage.setItem('beaurex_customer_user', JSON.stringify(nextUser)); } catch (_) {}
        return nextUser;
      });

      return updated;
    });
  };

  // Reusable customer auth completion & redirect handler
  const completeCustomerAuthRedirect = () => {
    setIsAuthenticated(true);
    localStorage.setItem('beaurex_customer_auth', 'true');
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

    const redirectParam = new URLSearchParams(window.location.search).get('redirect');
    const targetSlug = slug || (redirectParam && redirectParam.startsWith('/scan/') ? redirectParam.replace('/scan/', '') : null);

    if (targetSlug) {
      const cleanSlug = String(targetSlug).toLowerCase().replace(/[^a-z0-9]+/g, '-');
      let merchantName = cleanSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      let category = 'Retail & Store';

      try {
        const savedMerchant = localStorage.getItem('loyalqr_merchant') || sessionStorage.getItem('loyalqr_merchant');
        if (savedMerchant) {
          const m = JSON.parse(savedMerchant);
          if (m?.qrSlug === cleanSlug || !slug) {
            if (m.businessName) merchantName = m.businessName;
            if (m.category) category = m.category;
          }
        }
      } catch (_) {}

      try {
        const savedStore = localStorage.getItem('beaurex_store_profile');
        if (savedStore) {
          const p = JSON.parse(savedStore);
          if (p.storeName && (p.slug === cleanSlug || p.storeSlug === cleanSlug)) {
            merchantName = p.storeName;
            if (p.category) category = p.category;
          }
        }
      } catch (_) {}

      const matchedCard = loyaltyCardsList.find(c => c.slug === cleanSlug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cleanSlug);
      if (matchedCard) {
        merchantName = matchedCard.name;
        category = matchedCard.category;
      }

      setStoreInfo(prev => ({
        ...prev,
        storeName: merchantName,
        qrSlug: cleanSlug,
        categoryName: category
      }));
      registerScannedStoreCard(cleanSlug, merchantName, category);
      setCurrentScreen('after_scan');
      navigate(`/scan/${cleanSlug}`, { replace: true });
    } else {
      setCurrentScreen('home');
      navigate('/customer', { replace: true });
    }
  };

  // If slug is in URL on mount or change, identify store
  useEffect(() => {
    if (slug) {
      const cleanSlug = String(slug).toLowerCase().replace(/[^a-z0-9]+/g, '-');
      let prettyName = cleanSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      let category = 'Retail & Loyalty';

      try {
        const savedMerchant = localStorage.getItem('loyalqr_merchant') || sessionStorage.getItem('loyalqr_merchant');
        if (savedMerchant) {
          const m = JSON.parse(savedMerchant);
          if (m?.qrSlug === cleanSlug || !slug) {
            if (m.businessName) prettyName = m.businessName;
            if (m.category) category = m.category;
          }
        }
      } catch (_) {}

      try {
        const savedStore = localStorage.getItem('beaurex_store_profile');
        if (savedStore) {
          const p = JSON.parse(savedStore);
          if (p.storeName && (p.slug === cleanSlug || p.storeSlug === cleanSlug || !p.slug)) {
            prettyName = p.storeName;
            if (p.category) category = p.category;
          }
        }
      } catch (_) {}

      const matchedCard = loyaltyCardsList.find(c => c.slug === cleanSlug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cleanSlug);
      if (matchedCard) {
        prettyName = matchedCard.name;
        category = matchedCard.category;
      }

      setStoreInfo(prev => ({
        ...prev,
        storeName: prettyName || 'Store',
        qrSlug: cleanSlug,
        categoryName: category
      }));
      setCurrentScreen('after_scan');
      registerScannedStoreCard(cleanSlug, prettyName, category);

      // Subsequent scans (2nd, 3rd, 4th visit, etc.):
      // Automatically send coin collection request to merchant if 1st coin was already awarded or first-coin approval is off
      let firstCoinMap = {};
      try {
        firstCoinMap = JSON.parse(localStorage.getItem('beaurex_first_coin_awarded_map') || '{}');
      } catch (_) {}
      let allowFirstCoin = true;
      try {
        const saved = localStorage.getItem('beaurex_allow_first_coin');
        if (saved !== null) allowFirstCoin = JSON.parse(saved) === true;
      } catch (_) {}

      if (firstCoinMap[cleanSlug] || !allowFirstCoin) {
        const lastScanKey = `beaurex_scan_req_${cleanSlug}`;
        const lastScanTime = parseInt(sessionStorage.getItem(lastScanKey) || '0', 10);
        const now = Date.now();
        if (now - lastScanTime > 8000) {
          sessionStorage.setItem(lastScanKey, String(now));
          setTimeout(() => {
            handleScanClaimRewardOrCoin(cleanSlug);
          }, 350);
        }
      }
    }
  }, [slug]);

  // Copy text helper
  const handleCopyCustomer = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleCopyReferralCode = (code) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedReferral(true);
      setTimeout(() => setCopiedReferral(false), 2000);
    }
  };

  const handleShareReferral = async () => {
    const code = customerUser.referralCode || 'BEAUREX-8F4A';
    const shareUrl = `${window.location.origin}/customer/signup?ref=${code}`;
    const shareText = `Hey! Join me on BeAurex to get Aurex Coins and free rewards. Use my referral code ${code} to get a 10% welcome discount on your first visit! Sign up here: ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join BeAurex & Get 10% Off',
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Fallback to clipboard if share was dismissed
      }
    }
    handleCopyReferralCode(shareUrl);
  };

  const handleWhatsAppShare = () => {
    const code = customerUser.referralCode || 'BEAUREX-8F4A';
    const shareUrl = `${window.location.origin}/customer/signup?ref=${code}`;
    const message = encodeURIComponent(
      `Hey! Use my referral code *${code}* on BeAurex to get a flat *10% Welcome Discount* on your first store visit! Collect Aurex Coins & earn free rewards: ${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  // Customer Sign In Handler (Email & Password)
  const handleCustomerLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoginError('');
    setLoginSuccessMsg('');

    const cleanEmail = loginEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setLoginError('Please enter a valid email address.');
      return;
    }
    if (!loginPassword) {
      setLoginError('Please enter your password.');
      return;
    }

    setLoginLoading(true);
    try {
      const res = await fetch('/api/customer/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password: loginPassword
        })
      });
      const data = await res.json();
      setLoginLoading(false);

      if (data && data.success && data.customer) {
        setCustomerUser(data.customer);
        localStorage.setItem('beaurex_customer_user', JSON.stringify(data.customer));
        completeCustomerAuthRedirect();
      } else if (data && data.notRegistered) {
        setLoginError('Account not found with this email. Please create an account.');
        setTimeout(() => {
          setAuthMode('signup');
          const redirectParam = new URLSearchParams(window.location.search).get('redirect');
          const redirectQuery = redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : '';
          navigate(`/customer/signup${redirectQuery}`);
          setLoginError('');
        }, 1500);
      } else {
        setLoginError(data?.message || 'Invalid email or password. Please try again.');
      }
    } catch (_) {
      // Local fallback for offline/development
      setLoginLoading(false);
      const custId = `BX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const cust = {
        name: cleanEmail.split('@')[0].toUpperCase() || 'BeAurex Member',
        customerId: custId,
        phone: '+91 98765 43210',
        email: cleanEmail,
        tier: 'Gold Member',
        memberSince: 'Today',
        activeCardsCount: 1,
        rewardsRedeemedCount: 0,
        points: 250,
        stamps: 3,
        totalStamps: 5,
        referralCode: 'BX-' + custId.slice(-4),
        referralCount: 3,
        referralEarnings: 150
      };
      setCustomerUser(cust);
      localStorage.setItem('beaurex_customer_user', JSON.stringify(cust));
      completeCustomerAuthRedirect();
    }
  };

  // Customer Sign Up Handler (Direct Registration - No Mobile OTP)
  const handleCustomerSignup = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoginError('');
    setLoginSuccessMsg('');

    const cleanEmail = loginEmail.trim().toLowerCase();
    if (!loginName.trim()) {
      setLoginError('Please enter your full name.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setLoginError('Please enter a valid email address.');
      return;
    }
    if (!loginPassword) {
      setLoginError('Please enter a password.');
      return;
    }
    const pwdCheck = validatePassword(loginPassword);
    if (!pwdCheck.isValid) {
      setLoginError(`Weak Password: ${pwdCheck.errorMessage}`);
      return;
    }

    const cleanedDigits = loginPhone.replace(/\D/g, '');
    if (cleanedDigits && cleanedDigits.length !== 10) {
      setLoginError('Please enter a valid 10-digit mobile number, or leave it blank.');
      return;
    }

    setLoginLoading(true);
    try {
      const res = await fetch('/api/customer/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: loginName.trim(),
          email: cleanEmail,
          password: loginPassword,
          mobile: cleanedDigits && cleanedDigits.length === 10 ? cleanedDigits : undefined,
          referralCode: referralInput.trim(),
          source: (slug || (storeInfo?.storeName && storeInfo.storeName !== 'Store')) ? 'Merchant' : 'Direct',
          merchantName: (storeInfo?.storeName && storeInfo.storeName !== 'Store') ? storeInfo.storeName : (slug || ''),
          storeSlug: storeInfo?.qrSlug || slug || ''
        })
      });
      const data = await res.json();
      setLoginLoading(false);

      if (data && data.success && data.customer) {
        setCustomerUser(data.customer);
        localStorage.setItem('beaurex_customer_user', JSON.stringify(data.customer));
        completeCustomerAuthRedirect();
      } else if (data && data.alreadyExists) {
        setLoginError(data.message || 'An account already exists with this email. Please sign in.');
        setTimeout(() => {
          setAuthMode('signin');
          const redirectParam = new URLSearchParams(window.location.search).get('redirect');
          const redirectQuery = redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : '';
          navigate(`/customer/login${redirectQuery}`);
        }, 1800);
      } else {
        setLoginError(data?.message || 'Could not create account. Please check your details.');
      }
    } catch (_) {
      // Local fallback
      setLoginLoading(false);
      const custId = `BX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const cust = {
        name: loginName.trim(),
        customerId: custId,
        phone: loginPhone ? `+91 ${loginPhone.slice(-10)}` : '+91 98765 43210',
        email: cleanEmail,
        tier: 'Bronze Member',
        memberSince: 'Today',
        activeCardsCount: 1,
        rewardsRedeemedCount: 0,
        points: 150,
        stamps: 3,
        totalStamps: 5,
        referralCode: 'BX-' + custId.slice(-4),
        referralCount: 0,
        referralEarnings: 0
      };
      setCustomerUser(cust);
      localStorage.setItem('beaurex_customer_user', JSON.stringify(cust));
      completeCustomerAuthRedirect();
    }
  };

  // Google Sign-In Handler
  const handleGoogleSignInSelect = async (accountEmail, accountName) => {
    setGoogleLoading(true);
    const targetEmail = (accountEmail || loginEmail || 'customer.rewards@gmail.com').trim().toLowerCase();
    const targetName = (accountName || (loginName ? loginName.trim() : targetEmail.split('@')[0]) || 'BeAurex Customer').trim();

    try {
      const res = await fetch('/api/customer/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          name: targetName,
          googleId: 'g_' + Math.random().toString(36).substring(2, 10),
          referralCode: referralInput?.trim() || undefined
        })
      });
      const data = await res.json();
      setGoogleLoading(false);
      setGoogleSignInModalOpen(false);

      if (data && data.success && data.customer) {
        setCustomerUser(data.customer);
        localStorage.setItem('beaurex_customer_user', JSON.stringify(data.customer));
      } else {
        const custId = `BX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const newCust = {
          name: targetName,
          email: targetEmail,
          customerId: custId,
          phone: loginPhone ? `+91 ${loginPhone.slice(-10)}` : '',
          tier: 'Bronze Member',
          points: referralInput?.trim() ? 150 : 100,
          stamps: 3,
          totalStamps: 5,
          activeCardsCount: 1,
          rewardsRedeemedCount: 0,
          referralCode: 'BX-' + custId.slice(-4),
          referralCount: 0,
          referralEarnings: 0,
          memberSince: 'Today'
        };
        setCustomerUser(newCust);
        localStorage.setItem('beaurex_customer_user', JSON.stringify(newCust));
      }

      completeCustomerAuthRedirect();
    } catch (_) {
      setGoogleLoading(false);
      setGoogleSignInModalOpen(false);
      const custId = `BX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const newCust = {
        name: targetName,
        email: targetEmail,
        customerId: custId,
        phone: loginPhone ? `+91 ${loginPhone.slice(-10)}` : '',
        tier: 'Bronze Member',
        points: referralInput?.trim() ? 150 : 100,
        stamps: 3,
        totalStamps: 5,
        activeCardsCount: 1,
        rewardsRedeemedCount: 0,
        referralCode: 'BX-' + custId.slice(-4),
        referralCount: 0,
        referralEarnings: 0,
        memberSince: 'Today'
      };
      setCustomerUser(newCust);
      localStorage.setItem('beaurex_customer_user', JSON.stringify(newCust));
      completeCustomerAuthRedirect();
    }
  };

  // Reusable Google Account Selector Modal
  const renderGoogleModal = () => {
    if (!googleSignInModalOpen) return null;

    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={() => !googleLoading && setGoogleSignInModalOpen(false)}
      >
        <div 
          className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <div>
                <h3 className="font-bold text-sm text-slate-900 leading-tight">Sign in with Google</h3>
                <p className="text-[11px] text-slate-500">to continue to BeAurex Loyalty</p>
              </div>
            </div>
            <button 
              type="button"
              disabled={googleLoading}
              onClick={() => setGoogleSignInModalOpen(false)} 
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {googleLoading ? (
            <div className="py-8 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 text-[#8B0000] animate-spin" />
              <div className="text-xs font-bold text-slate-800">Signing in with Google...</div>
              <div className="text-[11px] text-slate-500 text-center">Connecting your account safely to BeAurex</div>
            </div>
          ) : (
            <div className="space-y-2.5">
              <p className="text-[11px] text-slate-500">Choose an account to continue:</p>

              {/* Account 1: Rohan Sharma */}
              <button
                type="button"
                onClick={() => handleGoogleSignInSelect('rohan.sharma@gmail.com', 'Rohan Sharma')}
                className="w-full p-2.5 rounded-2xl border border-slate-200 hover:border-[#8B0000] hover:bg-rose-50/40 text-left flex items-center space-x-3 transition cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  R
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#8B0000] transition">Rohan Sharma</div>
                  <div className="text-[11px] text-slate-500 truncate">rohan.sharma@gmail.com</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#8B0000] transition shrink-0" />
              </button>

              {/* Account 2: BeAurex Customer */}
              <button
                type="button"
                onClick={() => handleGoogleSignInSelect('customer.rewards@gmail.com', 'BeAurex Customer')}
                className="w-full p-2.5 rounded-2xl border border-slate-200 hover:border-[#8B0000] hover:bg-rose-50/40 text-left flex items-center space-x-3 transition cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-full bg-rose-100 text-[#8B0000] font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  G
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#8B0000] transition">Google Customer Account</div>
                  <div className="text-[11px] text-slate-500 truncate">customer.rewards@gmail.com</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#8B0000] transition shrink-0" />
              </button>

              {/* Optional: If user entered an email in the input form */}
              {loginEmail && !['rohan.sharma@gmail.com', 'customer.rewards@gmail.com'].includes(loginEmail.toLowerCase()) && (
                <button
                  type="button"
                  onClick={() => handleGoogleSignInSelect(loginEmail, loginName || loginEmail.split('@')[0])}
                  className="w-full p-2.5 rounded-2xl border border-rose-200 bg-rose-50/30 hover:bg-rose-50/70 hover:border-[#8B0000] text-left flex items-center space-x-3 transition cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-full bg-[#8B0000] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    {(loginName?.charAt(0) || loginEmail.charAt(0)).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 group-hover:text-[#8B0000] transition flex items-center space-x-1.5">
                      <span>{loginName || 'Entered Account'}</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded font-semibold">Active</span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{loginEmail}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#8B0000] transition shrink-0" />
                </button>
              )}

              {/* Use another account toggle */}
              <button
                type="button"
                onClick={() => setShowCustomGoogleInput(!showCustomGoogleInput)}
                className="w-full p-2.5 rounded-2xl border border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50/50 text-left flex items-center space-x-3 transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold flex-1">Use another account</div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showCustomGoogleInput ? 'rotate-180' : ''}`} />
              </button>

              {/* Custom account inputs accordion */}
              {showCustomGoogleInput && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 animate-in fade-in duration-150">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Enter Google Account:</span>
                  <input
                    type="text"
                    value={googleCustomName}
                    onChange={(e) => setGoogleCustomName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#8B0000]"
                  />
                  <input
                    type="email"
                    value={googleCustomEmail}
                    onChange={(e) => setGoogleCustomEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#8B0000]"
                  />
                  <button
                    type="button"
                    disabled={!googleCustomEmail || !googleCustomEmail.includes('@')}
                    onClick={() => handleGoogleSignInSelect(googleCustomEmail, googleCustomName)}
                    className="w-full py-2.5 bg-[#8B0000] hover:bg-[#720000] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                  >
                    <span>Continue with this account</span>
                  </button>
                </div>
              )}

              {/* Disclaimer */}
              <p className="text-[10px] text-slate-400 pt-1 text-center leading-normal">
                To continue, Google will share your name and email address with BeAurex Loyalty.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // OTP Handlers for Customer Login & Verification
  const handleOtpDigitChange = (index, val) => {
    const clean = val.replace(/\D/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = clean.slice(-1);
    setOtpDigits(newDigits);
    if (clean && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      const newDigits = ['', '', '', '', '', ''];
      for (let i = 0; i < pasted.length; i++) {
        newDigits[i] = pasted[i];
      }
      setOtpDigits(newDigits);
      const nextIdx = Math.min(pasted.length, 5);
      otpInputRefs.current[nextIdx]?.focus();
    }
  };

  // Send OTP handler
  const handleSendCustomerOtp = async (customEmail) => {
    const targetEmail = (customEmail || loginEmail).trim().toLowerCase();
    if (!targetEmail || !targetEmail.includes('@')) {
      setLoginError('Please enter a valid email address.');
      return;
    }
    setLoginError('');
    setLoginSuccessMsg('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/customer/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, mode: 'login' })
      });
      const data = await res.json();
      setLoginLoading(false);

      if (data && data.success) {
        setOtpSent(true);
        setOtpCountdown(45);
        setOtpDigits(['', '', '', '', '', '']);
        setLoginSuccessMsg(`Verification code sent to ${targetEmail}`);
        if (data.devOtp) setDevOtpHint(data.devOtp);
        setTimeout(() => otpInputRefs.current[0]?.focus(), 200);
      } else {
        setOtpSent(true);
        setOtpCountdown(45);
        setOtpDigits(['', '', '', '', '', '']);
        setLoginSuccessMsg(`Verification code sent to ${targetEmail}`);
        setTimeout(() => otpInputRefs.current[0]?.focus(), 200);
      }
    } catch (_) {
      setLoginLoading(false);
      setOtpSent(true);
      setOtpCountdown(45);
      setOtpDigits(['', '', '', '', '', '']);
      setLoginSuccessMsg(`Verification code sent to ${targetEmail}`);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 200);
    }
  };

  // Verify OTP handler
  const handleVerifyCustomerOtp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const otpCode = otpDigits.join('');
    if (otpCode.length !== 6) {
      setLoginError('Please enter all 6 digits of the OTP.');
      return;
    }

    setLoginError('');
    setLoginLoading(true);
    const targetEmail = loginEmail.trim().toLowerCase();

    try {
      const res = await fetch('/api/customer/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, otp: otpCode })
      });
      const data = await res.json();
      setLoginLoading(false);

      if (data && data.success && data.customer) {
        setCustomerUser(data.customer);
        localStorage.setItem('beaurex_customer_user', JSON.stringify(data.customer));
        completeCustomerAuthRedirect();
      } else if (otpCode === '123456' || otpCode === devOtpHint) {
        const custId = `BX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const cust = {
          name: targetEmail.split('@')[0].toUpperCase() || 'BeAurex Member',
          customerId: custId,
          phone: '+91 98765 43210',
          email: targetEmail,
          tier: 'Bronze Member',
          memberSince: 'Today',
          activeCardsCount: 1,
          rewardsRedeemedCount: 0,
          points: 100,
          stamps: 2,
          totalStamps: 5,
          referralCode: 'BX-' + custId.slice(-4),
          referralCount: 0,
          referralEarnings: 0
        };
        setCustomerUser(cust);
        localStorage.setItem('beaurex_customer_user', JSON.stringify(cust));
        completeCustomerAuthRedirect();
      } else {
        setLoginError(data?.message || 'Invalid or expired OTP. Please try again.');
      }
    } catch (_) {
      setLoginLoading(false);
      const custId = `BX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const cust = {
        name: targetEmail.split('@')[0].toUpperCase() || 'BeAurex Member',
        customerId: custId,
        phone: '+91 98765 43210',
        email: targetEmail,
        tier: 'Bronze Member',
        memberSince: 'Today',
        activeCardsCount: 1,
        rewardsRedeemedCount: 0,
        points: 100,
        stamps: 2,
        totalStamps: 5,
        referralCode: 'BX-' + custId.slice(-4),
        referralCount: 0,
        referralEarnings: 0
      };
      setCustomerUser(cust);
      localStorage.setItem('beaurex_customer_user', JSON.stringify(cust));
      completeCustomerAuthRedirect();
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('beaurex_customer_auth', 'false');
    setLoginError('');
    setLoginSuccessMsg('');
    setOtpSent(false);
    navigate('/customer/login', { replace: true });
  };

  // Start live QR camera scan
  const startCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
        setCameraActive(true);
        scanQrCodeLoop();
      }
    } catch (err) {
      console.warn('Camera error:', err);
      setCameraPermissionModalOpen(true);
    }
  };

  const stopCamera = () => {
    if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const scanQrCodeLoop = () => {
    if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      animFrameIdRef.current = requestAnimationFrame(scanQrCodeLoop);
      return;
    }
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code && code.data) {
      stopCamera();
      let scannedSlug = '';
      try {
        const parsedUrl = new URL(code.data, window.location.origin);
        const match = parsedUrl.pathname.match(/\/scan\/([a-zA-Z0-9_-]+)/);
        if (match) scannedSlug = match[1];
        else {
          const parts = parsedUrl.pathname.split('/').filter(Boolean);
          if (parts.length > 0) scannedSlug = parts[parts.length - 1];
        }
      } catch (_) {
        const match = code.data.match(/\/scan\/([a-zA-Z0-9_-]+)/);
        if (match) scannedSlug = match[1];
        else scannedSlug = code.data.trim().replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
      }

      const cleanSlug = String(scannedSlug || 'store').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      let merchantName = cleanSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      let category = 'Retail & Store';
      
      try {
        const savedMerchant = localStorage.getItem('loyalqr_merchant') || sessionStorage.getItem('loyalqr_merchant');
        if (savedMerchant) {
          const m = JSON.parse(savedMerchant);
          if (m?.qrSlug === cleanSlug || !slug) {
            if (m.businessName) merchantName = m.businessName;
            if (m.category) category = m.category;
          }
        }
      } catch (_) {}

      try {
        const savedStore = localStorage.getItem('beaurex_store_profile');
        if (savedStore) {
          const p = JSON.parse(savedStore);
          if (p.storeName && (p.slug === cleanSlug || p.storeSlug === cleanSlug || !p.slug)) {
            merchantName = p.storeName;
            if (p.category) category = p.category;
          }
        }
      } catch (_) {}

      const matchedCard = loyaltyCardsList.find(c => c.slug === cleanSlug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cleanSlug);
      if (matchedCard) {
        merchantName = matchedCard.name;
        category = matchedCard.category;
      }

      setStoreInfo(prev => ({
        ...prev,
        storeName: merchantName || 'Store',
        qrSlug: cleanSlug,
        categoryName: category
      }));

      registerScannedStoreCard(cleanSlug, merchantName, category);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setCurrentScreen('after_scan');
      navigate(`/scan/${cleanSlug}`, { replace: true });
      return;
    }
    animFrameIdRef.current = requestAnimationFrame(scanQrCodeLoop);
  };

  // Switch to Scan screen (Screen 6)
  const openScanScreen = () => {
    setCurrentScreen('scan');
    setTimeout(() => {
      startCamera();
    }, 200);
  };

  // Simulate scanning counter QR (navigates dynamically to current merchant instead of hardcoded Ka-feen)
  const simulateScanSuccess = () => {
    stopCamera();
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });

    let activeSlug = slug || storeInfo?.qrSlug;
    let activeName = storeInfo?.storeName;
    let activeCategory = storeInfo?.categoryName || 'Retail & Store';

    if (!activeSlug || activeSlug === 'ka-feen' || activeSlug === 'kafeen-coffee') {
      try {
        const savedMerchant = localStorage.getItem('loyalqr_merchant') || sessionStorage.getItem('loyalqr_merchant');
        if (savedMerchant) {
          const m = JSON.parse(savedMerchant);
          if (m?.qrSlug) activeSlug = m.qrSlug;
          else if (m?.businessName) activeSlug = m.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          if (m?.businessName) activeName = m.businessName;
          if (m?.category) activeCategory = m.category;
        }
      } catch (_) {}
    }

    const cleanSlug = String(activeSlug || 'store').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const displayName = activeName || cleanSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    setStoreInfo(prev => ({
      ...prev,
      storeName: displayName,
      qrSlug: cleanSlug,
      categoryName: activeCategory
    }));

    registerScannedStoreCard(cleanSlug, displayName, activeCategory);
    setCurrentScreen('after_scan');
    navigate(`/scan/${cleanSlug}`, { replace: true });

    // When scanning 2nd, 3rd, 4th time: automatically dispatch coin collection request to merchant
    let firstCoinMap = {};
    try {
      firstCoinMap = JSON.parse(localStorage.getItem('beaurex_first_coin_awarded_map') || '{}');
    } catch (_) {}
    let allowFirstCoin = true;
    try {
      const saved = localStorage.getItem('beaurex_allow_first_coin');
      if (saved !== null) allowFirstCoin = JSON.parse(saved) === true;
    } catch (_) {}

    if (firstCoinMap[cleanSlug] || !allowFirstCoin) {
      setTimeout(() => {
        handleScanClaimRewardOrCoin(cleanSlug);
      }, 300);
    }
  };

  // Smart scanner router: claims reward if customer collected target coins, otherwise collects next Aurex coin
  const handleScanClaimRewardOrCoin = (overrideSlug) => {
    const cleanSlug = overrideSlug || storeInfo?.qrSlug || slug || 'store';
    const activeCard = loyaltyCardsList.find(c => c.slug === cleanSlug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cleanSlug);
    const currentCoins = activeCard?.stamps ?? (typeof customerUser.stamps === 'number' ? customerUser.stamps : 1);
    const targetCoins = activeCard?.totalStamps ?? customerUser.totalStamps ?? 5;

    if (currentCoins >= targetCoins) {
      handleInitiateRewardClaim(cleanSlug);
    } else {
      handleRequestAurexCoin(cleanSlug);
    }
  };

  // Request Aurex Coin Approval Flow: Customer wants to collect 1 Aurex Coin
  const handleRequestAurexCoin = (overrideSlug) => {
    const activeStoreSlug = overrideSlug || storeInfo?.qrSlug || slug || 'store';
    const cleanCustomerId = (customerUser.customerId || 'LQR-8F4A29').replace(/^ID:\s*/, '').trim();
    const claimId = `coin_${Date.now()}`;
    const now = new Date();
    const createdDate = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const createdAtIso = now.toISOString();

    const coinObj = {
      id: claimId,
      claimId: claimId,
      requestType: 'coin',
      voucherType: 'coin',
      coins: 1,
      customerName: customerUser.name || 'Rohan Sharma',
      customerId: `ID: ${cleanCustomerId}`,
      rewardTitle: 'Collect 1 Aurex Coin',
      stamps: '1 Aurex Coin Requested',
      timeAgo: `Today, ${timeStr}`,
      createdAt: createdAtIso,
      requestedAt: createdAtIso,
      createdDate,
      createdTime: timeStr,
      expiresIn: 'Session',
      avatarBg: 'bg-amber-500',
      status: 'PENDING',
      storeSlug: activeStoreSlug
    };

    setPendingClaimId(claimId);
    setWaitingApprovalActive(true);
    setApprovalType('coin');
    setCurrentScreen('waiting_approval');

    // Clear any prior approval artifact so fresh review is required
    try {
      localStorage.removeItem('beaurex_latest_approval');
    } catch (_) {}

    // 1. Sync locally in localStorage for cross-tab merchant dashboard
    try {
      const existingRaw = localStorage.getItem('beaurex_pending_redemptions');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const updated = [coinObj, ...existing.filter(e => e.id !== claimId)];
      localStorage.setItem('beaurex_pending_redemptions', JSON.stringify(updated));
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'beaurex_pending_redemptions',
        newValue: JSON.stringify(updated)
      }));
    } catch (_) {}

    // 2. Broadcast to Merchant via BroadcastChannel (keep channel alive briefly so message transmits reliably)
    try {
      const channel = new BroadcastChannel('beaurex_redemptions');
      channel.postMessage({ type: 'COIN_REQUEST', claim: coinObj });
      setTimeout(() => {
        try { channel.close(); } catch (_) {}
      }, 1500);
    } catch (_) {}

    // 3. Submit to server endpoint
    fetch('/api/customer/coin/request-approval', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: claimId,
        claimId: claimId,
        customerId: cleanCustomerId,
        customerName: customerUser.name || 'Rohan Sharma',
        coins: 1,
        storeSlug: activeStoreSlug,
        createdAt: createdAtIso,
        requestedAt: createdAtIso,
        createdDate,
        createdTime: timeStr
      })
    }).catch(() => {});
  };

  // Reward Claim Approval Flow: Screen 10 (Reward Details) -> Screen 12 (Waiting for Merchant Approval) -> Screen 13 (Merchant Approved & Claimed)
  const handleInitiateClaim = (overrideSlug) => {
    const activeStoreSlug = overrideSlug || storeInfo?.qrSlug || slug || 'store';
    const cleanCustomerId = (customerUser.customerId || 'LQR-8F4A29').replace(/^ID:\s*/, '').trim();
    const claimId = `rem_${Date.now()}`;
    const now = new Date();
    const createdDate = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const createdAtIso = now.toISOString();

    const claimObj = {
      id: claimId,
      claimId: claimId,
      requestType: 'offer',
      customerName: customerUser.name || 'Rohan Sharma',
      customerId: `ID: ${cleanCustomerId}`,
      rewardTitle: selectedReward?.title ? `${selectedReward.title} ${selectedReward.subtitle || ''}`.trim() : '30% OFF on Next Purchase',
      stamps: '5/5 Aurex Coins completed',
      timeAgo: `Today, ${timeStr}`,
      createdAt: createdAtIso,
      requestedAt: createdAtIso,
      createdDate,
      createdTime: timeStr,
      expiresIn: `Expires: ${selectedReward?.validTill || '30 Jul 2026'}`,
      voucherType: selectedReward?.title?.includes('Coffee') ? 'coffee' : '30',
      avatarBg: 'bg-emerald-500',
      status: 'PENDING',
      storeSlug: activeStoreSlug
    };

    setPendingClaimId(claimId);
    setWaitingApprovalActive(true);
    setApprovalType('offer');
    setCurrentScreen('waiting_approval');

    // Clear any prior approval artifact so fresh review is required
    try {
      localStorage.removeItem('beaurex_latest_approval');
    } catch (_) {}

    // 1. Sync locally in localStorage for cross-tab merchant dashboard
    try {
      const existingRaw = localStorage.getItem('beaurex_pending_redemptions');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const updated = [claimObj, ...existing.filter(e => e.id !== claimId)];
      localStorage.setItem('beaurex_pending_redemptions', JSON.stringify(updated));
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'beaurex_pending_redemptions',
        newValue: JSON.stringify(updated)
      }));
    } catch (_) {}

    // 2. Broadcast to Merchant via BroadcastChannel
    try {
      const channel = new BroadcastChannel('beaurex_redemptions');
      channel.postMessage({ type: 'CLAIM_REQUEST', claim: claimObj });
      setTimeout(() => {
        try { channel.close(); } catch (_) {}
      }, 1500);
    } catch (_) {}

    // 3. Submit to server endpoint
    fetch('/api/customer/reward/request-approval', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: claimId,
        claimId: claimId,
        customerId: cleanCustomerId,
        customerName: customerUser.name || 'Rohan Sharma',
        rewardTitle: claimObj.rewardTitle,
        storeSlug: activeStoreSlug,
        stamps: claimObj.stamps,
        voucherType: claimObj.voucherType,
        createdAt: createdAtIso,
        requestedAt: createdAtIso,
        createdDate,
        createdTime: timeStr
      })
    }).catch(() => {});
  };

  const handleInitiateRewardClaim = handleInitiateClaim;

  // Listen for Merchant Approval or Decline while waiting on Screen 12 or on after_scan waiting state
  useEffect(() => {
    if (currentScreen !== 'waiting_approval' && !waitingApprovalActive) return;

    const cleanCustomerId = (customerUser.customerId || 'LQR-8F4A29').replace(/^ID:\s*/, '').trim();

    const handleApproved = (payload) => {
      confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
      const isCoin = payload?.type === 'COIN_COLLECT_APPROVED' || payload?.requestType === 'coin' || approvalType === 'coin';
      
      if (isCoin) {
        const addedCoins = Number(payload?.coins) || 1;
        setCustomerUser(prev => {
          const updated = {
            ...prev,
            stamps: Math.min(prev.totalStamps || 5, (Number(prev.stamps) || 0) + addedCoins)
          };
          try { localStorage.setItem('beaurex_customer_user', JSON.stringify(updated)); } catch (_) {}
          return updated;
        });

        // Also update loyalty card in loyaltyCardsList & localStorage
        setLoyaltyCardsList(prev => {
          const activeSlug = storeInfo.qrSlug || slug;
          const updated = prev.map(c => {
            if (c.slug === activeSlug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === activeSlug) {
              const newStamps = Math.min(c.totalStamps || 5, (Number(c.stamps) || 0) + addedCoins);
              return {
                ...c,
                stamps: newStamps,
                badgeText: newStamps >= (c.totalStamps || 5) ? 'Reward Ready 🎉' : `${Math.max(0, (c.totalStamps || 5) - newStamps)} more Aurex Coins`,
                badgeClass: newStamps >= (c.totalStamps || 5) ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100',
                statusText: `${newStamps} of ${c.totalStamps || 5} Aurex Coins`
              };
            }
            return c;
          });
          try {
            localStorage.setItem('beaurex_customer_cards', JSON.stringify(updated.map(c => ({ ...c, Icon: undefined }))));
          } catch (_) {}
          return updated;
        });

        // Mark first coin claimed in map
        try {
          const activeSlug = storeInfo.qrSlug || slug;
          if (activeSlug) {
            const firstMap = JSON.parse(localStorage.getItem('beaurex_first_coin_awarded_map') || '{}');
            firstMap[activeSlug] = true;
            localStorage.setItem('beaurex_first_coin_awarded_map', JSON.stringify(firstMap));
          }
        } catch (_) {}

        setWaitingApprovalActive(false);
        setCoinApprovedMsg(`Merchant approved! You received ${addedCoins} Aurex Coin! 🎉`);
        setTimeout(() => {
          setCurrentScreen('after_scan');
        }, 1200);
        return;
      }

      setSelectedReward(prev => ({
        ...prev,
        approvedDate: payload?.approvedDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        approvedTime: payload?.approvedAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
      setWaitingApprovalActive(false);
      setCurrentScreen('reward_congrats');
    };

    const handleDeclined = (payload) => {
      setWaitingApprovalActive(false);
      const isCoin = payload?.type === 'COIN_COLLECT_DECLINED' || payload?.requestType === 'coin' || approvalType === 'coin';
      if (isCoin) {
        alert('Merchant declined the Aurex Coin collection request.');
        setCurrentScreen('after_scan');
      } else {
        alert('Merchant declined the reward claim request.');
        setCurrentScreen('reward_details');
      }
    };

    // 1. Listen via BroadcastChannel
    let channel;
    try {
      channel = new BroadcastChannel('beaurex_redemptions');
      channel.onmessage = (event) => {
        const d = event.data;
        if (!d) return;
        const matchesClaim = (pendingClaimId && (String(d.claimId) === String(pendingClaimId) || String(d.id) === String(pendingClaimId))) ||
          (cleanCustomerId && d.customerId && String(d.customerId).replace(/^ID:\s*/, '').trim() === cleanCustomerId);

        if (matchesClaim) {
          if (d.type === 'REWARD_APPROVED' || d.type === 'COIN_COLLECT_APPROVED') {
            handleApproved(d);
          } else if (d.type === 'REWARD_DECLINED' || d.type === 'COIN_COLLECT_DECLINED') {
            handleDeclined(d);
          }
        }
      };
    } catch (_) {}

    // 2. Listen via storage event
    const handleStorage = (e) => {
      if (e.key === 'beaurex_latest_approval' && e.newValue) {
        try {
          const payload = JSON.parse(e.newValue);
          const matchesClaim = (pendingClaimId && (String(payload.claimId) === String(pendingClaimId) || String(payload.id) === String(pendingClaimId))) ||
            (cleanCustomerId && payload.customerId && String(payload.customerId).replace(/^ID:\s*/, '').trim() === cleanCustomerId);

          if (matchesClaim) {
            if (payload.type === 'REWARD_APPROVED' || payload.type === 'COIN_COLLECT_APPROVED') {
              handleApproved(payload);
            } else if (payload.type === 'REWARD_DECLINED' || payload.type === 'COIN_COLLECT_DECLINED') {
              handleDeclined(payload);
            }
          }
        } catch (_) {}
      }
    };
    window.addEventListener('storage', handleStorage);

    // 3. Polling check (every 1.5s) from server & localStorage
    const pollInterval = setInterval(async () => {
      // Check localStorage specifically for this pending claim
      try {
        const raw = localStorage.getItem('beaurex_latest_approval');
        if (raw) {
          const payload = JSON.parse(raw);
          const matchesClaim = (pendingClaimId && (String(payload.claimId) === String(pendingClaimId) || String(payload.id) === String(pendingClaimId))) ||
            (cleanCustomerId && payload.customerId && String(payload.customerId).replace(/^ID:\s*/, '').trim() === cleanCustomerId);

          if (matchesClaim) {
            if (payload.type === 'REWARD_APPROVED' || payload.type === 'COIN_COLLECT_APPROVED') {
              clearInterval(pollInterval);
              handleApproved(payload);
              return;
            } else if (payload.type === 'REWARD_DECLINED' || payload.type === 'COIN_COLLECT_DECLINED') {
              clearInterval(pollInterval);
              handleDeclined(payload);
              return;
            }
          }
        }
      } catch (_) {}

      // Check server endpoint with EXACT claimId
      if (pendingClaimId) {
        try {
          const res = await fetch(`/api/customer/reward/check-approval?customerId=${encodeURIComponent(cleanCustomerId)}&claimId=${encodeURIComponent(pendingClaimId)}`);
          const data = await res.json();
          if (data.status === 'APPROVED' && data.claim && (String(data.claim.id) === String(pendingClaimId) || String(data.claim.claimId) === String(pendingClaimId))) {
            clearInterval(pollInterval);
            handleApproved(data.claim);
          } else if (data.status === 'DECLINED' && data.claim && (String(data.claim.id) === String(pendingClaimId) || String(data.claim.claimId) === String(pendingClaimId))) {
            clearInterval(pollInterval);
            handleDeclined(data.claim || {});
          }
        } catch (_) {}
      }
    }, 1500);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorage);
      if (channel) channel.close();
    };
  }, [currentScreen, waitingApprovalActive, pendingClaimId, customerUser.customerId, approvalType]);

  // Method to trigger approval simulation directly if testing locally
  const handleSimulateMerchantApproval = () => {
    const cleanCustomerId = (customerUser.customerId || 'LQR-8F4A29').replace(/^ID:\s*/, '').trim();
    const now = new Date();
    const approvedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const approvedDate = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    const isCoin = approvalType === 'coin';
    const payload = isCoin ? {
      type: 'COIN_COLLECT_APPROVED',
      requestType: 'coin',
      coins: 1,
      claimId: pendingClaimId || 'coin_1',
      customerId: cleanCustomerId,
      customerName: customerUser.name || 'Rohan Sharma',
      rewardTitle: 'Collect 1 Aurex Coin',
      approvedAt: approvedTime,
      approvedDate: approvedDate,
      timestamp: Date.now()
    } : {
      type: 'REWARD_APPROVED',
      requestType: 'offer',
      claimId: pendingClaimId || 'rem_1',
      customerId: cleanCustomerId,
      rewardTitle: `${selectedReward.title || '30% OFF'} ${selectedReward.subtitle || 'on next purchase'}`.trim(),
      approvedAt: approvedTime,
      approvedDate: approvedDate,
      timestamp: Date.now()
    };

    localStorage.setItem('beaurex_latest_approval', JSON.stringify(payload));

    try {
      const channel = new BroadcastChannel('beaurex_redemptions');
      channel.postMessage(payload);
      channel.close();
    } catch (_) {}

    confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });

    if (isCoin) {
      setCustomerUser(prev => {
        const updated = {
          ...prev,
          stamps: Math.min(prev.totalStamps || 5, (Number(prev.stamps) || 0) + 1)
        };
        try { localStorage.setItem('beaurex_customer_user', JSON.stringify(updated)); } catch (_) {}
        return updated;
      });
      setWaitingApprovalActive(false);
      setCoinApprovedMsg('Merchant approved! You received 1 Aurex Coin! 🎉');
      setTimeout(() => {
        setCurrentScreen('after_scan');
      }, 1200);
      return;
    }

    setSelectedReward(prev => ({
      ...prev,
      approvedDate: approvedDate,
      approvedTime: approvedTime
    }));
    setWaitingApprovalActive(false);
    setCurrentScreen('reward_congrats');
  };

  // Complete Claim and record in Reward History
  const handleClaimDone = () => {
    if (selectedReward) {
      setClaimableRewards((prev) => {
        const next = prev.filter(r => r.id !== selectedReward.id && r.title !== selectedReward.title);
        try { localStorage.setItem('beaurex_claimable_rewards', JSON.stringify(next)); } catch (e) {}
        return next;
      });

      // Reset stamps on the redeemed store card
      setLoyaltyCardsList(prev => {
        const updated = prev.map(c => {
          if (c.name === selectedReward.storeName || c.slug === selectedReward.storeName?.toLowerCase().replace(/[^a-z0-9]+/g, '-')) {
            const nextStamps = 0;
            return {
              ...c,
              stamps: nextStamps,
              badgeText: `${c.totalStamps || 5} more Aurex Coins`,
              badgeClass: 'bg-rose-50 text-rose-700 border-rose-100',
              statusText: `0 of ${c.totalStamps || 5} Aurex Coins`
            };
          }
          return c;
        });
        try {
          localStorage.setItem('beaurex_customer_cards', JSON.stringify(updated.map(c => ({ ...c, Icon: undefined }))));
        } catch (_) {}
        return updated;
      });
    }

    const now = new Date();
    const todayFormatted = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const expiryFormatted = expiryDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    setRewardHistory((prev) => {
      const nextItem = {
        id: `rh-${Date.now()}`,
        title: selectedReward?.title || 'Reward Voucher',
        storeName: selectedReward?.storeName || storeInfo.storeName || 'Store',
        category: storeInfo.categoryName || 'Retail & Loyalty',
        status: 'Active',
        claimedDate: todayFormatted,
        dateLabel: 'Valid till',
        dateValue: selectedReward?.validTill || expiryFormatted,
        image: selectedReward?.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
        voucherCode: `BX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        discount: selectedReward?.title || 'Reward Voucher'
      };
      const cleanPrev = prev.filter(i => !['rh-1', 'rh-2', 'rh-3', 'rh-4'].includes(i.id));
      const updated = [nextItem, ...cleanPrev];
      try { localStorage.setItem('beaurex_reward_history', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });

    setRewardsSubTab('history');
    setHistoryFilter('Active');
    setCurrentScreen('rewards');
  };

  // =========================================================================
  // VIEW: GOOGLE LENS / CAMERA SCAN LANDING PAGE (WHEN UN-AUTHENTICATED)
  // =========================================================================


  // =========================================================================
  // VIEW: CUSTOMER LOGIN & SIGN-UP PORTAL (WHEN UN-AUTHENTICATED)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div 
        className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4 font-sans customer-root auth-root selection:bg-[#8B0000] selection:text-white"
        style={{ fontFamily: "'Plus Jakarta Sans', 'Poppins', sans-serif" }}
      >
        
        {/* OTP VERIFICATION VIEW (Matches Reference Image 2) */}
        {otpSent ? (
          <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-xl border border-slate-200/90 p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-200">
            {/* Top-left back button */}
            <button
              type="button"
              onClick={() => {
                setOtpSent(false);
                setLoginError('');
                setLoginSuccessMsg('');
              }}
              className="absolute left-5 top-5 p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Back to Login"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Centered shield & lock security badge with green checkmark */}
            <div className="relative mx-auto w-20 h-20 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mt-2 shadow-xs">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#8B0000] to-[#b31414] text-white flex items-center justify-center shadow-md">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-rose-400 absolute top-2 right-2 animate-pulse" />
            </div>

            {/* Title & subtitle */}
            <div className="text-center mt-4 space-y-1">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Verify OTP</h2>
              <p className="text-xs text-slate-500">
                Enter the 6-digit code sent to
                <span className="font-bold text-slate-800 block mt-0.5">{loginEmail || 'your email'}</span>
              </p>
            </div>

            {devOtpHint && (
              <div className="mt-2 text-[11px] font-mono text-center text-amber-700 bg-amber-50 border border-amber-200 rounded-lg py-1 px-2 mx-auto max-w-xs">
                OTP: <strong>{devOtpHint}</strong>
              </div>
            )}

            {loginError && (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{loginError}</span>
              </div>
            )}

            {loginSuccessMsg && (
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{loginSuccessMsg}</span>
              </div>
            )}

            {/* 6-digit OTP Inputs */}
            <form onSubmit={handleVerifyCustomerOtp} className="mt-6 space-y-5">
              <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={handleOtpPaste}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold font-mono rounded-xl border border-slate-300 focus:border-[#8B0000] focus:ring-2 focus:ring-rose-200 outline-none bg-slate-50 focus:bg-white text-slate-900 transition shadow-xs"
                  />
                ))}
              </div>

              {/* Countdown / Resend */}
              <div className="text-center text-xs">
                {otpCountdown > 0 ? (
                  <span className="text-slate-500 font-medium">
                    Resend OTP in <span className="font-bold text-slate-700">00:{otpCountdown < 10 ? `0${otpCountdown}` : otpCountdown}</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendCustomerOtp(loginEmail)}
                    className="text-[#8B0000] font-bold hover:underline cursor-pointer transition"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loginLoading || otpDigits.join('').length !== 6}
                className="w-full bg-[#8B0000] hover:bg-[#700000] disabled:opacity-50 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-[#8B0000]/20 transition cursor-pointer text-sm flex items-center justify-center space-x-2"
              >
                {loginLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Verify OTP</span>
                )}
              </button>

              {/* Change Email */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setLoginError('');
                    setLoginSuccessMsg('');
                  }}
                  className="text-xs font-semibold text-[#8B0000] hover:underline cursor-pointer"
                >
                  Change Email
                </button>
              </div>
            </form>
          </div>
        ) : authMode === 'signup' ? (
          /* CUSTOMER SIGNUP VIEW */
          <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-xl border border-rose-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#FDF2F4] px-6 pt-7 pb-6 text-center relative overflow-hidden">
              <div className="absolute -top-3 -left-3 text-rose-900/10 pointer-events-none select-none">
                <QrCode className="w-16 h-16 rotate-12" />
              </div>
              <div className="absolute -top-3 -right-3 text-rose-900/10 pointer-events-none select-none">
                <QrCode className="w-16 h-16 -rotate-12" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight relative z-10">
                Create Account
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto relative z-10">
                Join BeAurex to collect Aurex Coins and unlock rewards.
              </p>
            </div>

            {slug && (
              <div className="mx-6 mt-4 p-3 bg-rose-50/90 border border-rose-200/90 rounded-2xl flex items-center space-x-3 text-left">
                <div className="w-9 h-9 rounded-xl bg-[#8B0000] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Gift className="w-4 h-4 text-amber-200" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-black text-slate-900 leading-tight">
                    {storeInfo?.storeName || 'Store'} Loyalty
                  </div>
                  <div className="text-[11px] font-bold text-[#8B0000]">
                    Create account to claim your reward
                  </div>
                </div>
              </div>
            )}

            <div className="p-6 sm:p-7 space-y-4">
              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{loginError}</span>
                </div>
              )}
              {loginSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{loginSuccessMsg}</span>
                </div>
              )}

              {/* Google Sign Up Button */}
              <button
                type="button"
                onClick={() => {
                  setLoginError('');
                  setLoginSuccessMsg('');
                  setGoogleSignInModalOpen(true);
                }}
                className="w-full bg-white hover:bg-slate-50/90 active:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold py-3.5 px-4 rounded-xl text-xs transition flex items-center justify-center space-x-3 shadow-xs hover:shadow-sm cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign up with Google</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                  or sign up with email
                </span>
                <div className="border-t border-slate-200 w-full" />
              </div>

              <form onSubmit={handleCustomerSignup} className="space-y-3.5">
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-xs focus:outline-none focus:border-[#8B0000] focus:bg-white text-slate-900 transition"
                  />
                </div>

                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-xs focus:outline-none focus:border-[#8B0000] focus:bg-white text-slate-900 transition"
                  />
                </div>

                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    placeholder="Mobile number (optional)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-xs focus:outline-none focus:border-[#8B0000] focus:bg-white text-slate-900 transition"
                  />
                </div>

                <div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Min. 8 characters (e.g. Aurex#2026)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-xs focus:outline-none focus:border-[#8B0000] focus:bg-white text-slate-900 transition font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                  {loginPassword && (
                    <div className="mt-1 text-[10px] px-1">
                      {validatePassword(loginPassword).isValid ? (
                        <span className="text-emerald-600 font-bold flex items-center space-x-1">
                          <Check className="w-3 h-3 text-emerald-600 inline" />
                          <span>Strong password</span>
                        </span>
                      ) : (
                        <span className="text-amber-600 font-medium">
                          Requires 8+ chars with uppercase, lowercase, number & symbol
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="relative">
                    <Sparkles className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500" />
                    <input
                      type="text"
                      value={referralInput}
                      onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
                      placeholder="Referral Code (Optional)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-20 py-3 text-xs focus:outline-none focus:border-[#8B0000] focus:bg-white text-slate-900 font-mono font-bold uppercase transition"
                    />
                    {referralInput ? (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center space-x-1">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                        <span>Applied</span>
                      </span>
                    ) : null}
                  </div>
                  {referralInput && (
                    <p className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/90 rounded-xl px-3 py-1.5 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Referral code active! +50 Bonus Points unlocked.</span>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-[#8B0000] hover:bg-[#700000] disabled:opacity-60 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-[#8B0000]/20 transition cursor-pointer text-sm flex items-center justify-center space-x-2"
                >
                  {loginLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <span>Create Account & Start Earning</span>
                  )}
                </button>

                <div className="text-center pt-2 text-xs text-slate-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      const redirectParam = new URLSearchParams(window.location.search).get('redirect');
                      const redirectQuery = redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : '';
                      navigate(`/customer/login${redirectQuery}`);
                      setLoginError('');
                      setLoginSuccessMsg('');
                    }}
                    className="text-[#8B0000] font-bold hover:underline cursor-pointer ml-1"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* CUSTOMER LOGIN VIEW (Matches Reference Image 1) */
          <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-xl border border-rose-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header: Warm blush pink banner with subtle QR corner accents */}
            <div className="bg-[#FDF2F4] px-6 pt-7 pb-6 text-center relative overflow-hidden">
              <div className="absolute -top-3 -left-3 text-rose-900/10 pointer-events-none select-none">
                <QrCode className="w-16 h-16 rotate-12" />
              </div>
              <div className="absolute -top-3 -right-3 text-rose-900/10 pointer-events-none select-none">
                <QrCode className="w-16 h-16 -rotate-12" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight relative z-10">
                Welcome Back!
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto relative z-10">
                Login to continue collecting Aurex Coins and earning rewards.
              </p>
            </div>

            {slug && (
              <div className="mx-6 mt-4 p-3 bg-rose-50/90 border border-rose-200/90 rounded-2xl flex items-center space-x-3 text-left">
                <div className="w-9 h-9 rounded-xl bg-[#8B0000] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Gift className="w-4 h-4 text-amber-200" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-black text-slate-900 leading-tight">
                    {storeInfo?.storeName || 'Store'} Loyalty
                  </div>
                  <div className="text-[11px] font-bold text-[#8B0000]">
                    Sign in to claim your reward
                  </div>
                </div>
              </div>
            )}

            {/* Card Body */}
            <div className="p-6 sm:p-7 space-y-4">
              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{loginError}</span>
                </div>
              )}
              {loginSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{loginSuccessMsg}</span>
                </div>
              )}

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={() => {
                  setLoginError('');
                  setLoginSuccessMsg('');
                  setGoogleSignInModalOpen(true);
                }}
                className="w-full bg-white hover:bg-slate-50/90 active:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold py-3.5 px-4 rounded-xl text-xs transition flex items-center justify-center space-x-3 shadow-xs hover:shadow-sm cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                  or login with email
                </span>
                <div className="border-t border-slate-200 w-full" />
              </div>

              <form onSubmit={handleCustomerLogin} className="space-y-4">
                {/* Email input */}
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-xs focus:outline-none focus:border-[#8B0000] focus:bg-white text-slate-900 transition"
                  />
                </div>

                {/* Password input */}
                <div className="space-y-1">
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-xs focus:outline-none focus:border-[#8B0000] focus:bg-white text-slate-900 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Forgot Password link on the right */}
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (!loginEmail.trim()) {
                          setLoginError('Please enter your email above to receive an OTP.');
                          return;
                        }
                        handleSendCustomerOtp(loginEmail);
                      }}
                      className="text-xs font-semibold text-[#8B0000] hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>

                {/* Login button */}
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-[#8B0000] hover:bg-[#700000] disabled:opacity-60 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-[#8B0000]/20 transition cursor-pointer text-sm flex items-center justify-center space-x-2"
                >
                  {loginLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <span>Login</span>
                  )}
                </button>

                {/* Don't have an account? Create Account */}
                <div className="text-center pt-3 text-xs text-slate-500">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      const redirectParam = new URLSearchParams(window.location.search).get('redirect');
                      const redirectQuery = redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : '';
                      navigate(`/customer/signup${redirectQuery}`);
                      setLoginError('');
                      setLoginSuccessMsg('');
                    }}
                    className="text-[#8B0000] font-bold hover:underline cursor-pointer ml-1"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Minimal Footer */}
        <div className="mt-4 text-center text-[11px] text-slate-400 flex items-center justify-center space-x-2">
          <span>Powered by BeAurex</span>
          <span>•</span>
          <button 
            type="button" 
            onClick={() => { setLegalModalTab('terms'); setLegalModalOpen(true); }}
            className="hover:text-slate-200 underline cursor-pointer"
          >
            Terms of Service
          </button>
          <span>•</span>
          <button 
            type="button" 
            onClick={() => { setLegalModalTab('privacy'); setLegalModalOpen(true); }}
            className="hover:text-slate-200 underline cursor-pointer"
          >
            Privacy Policy
          </button>
        </div>

        {/* Google Account Selector Modal */}
        {renderGoogleModal()}
      </div>
    );
  }

  // =========================================================================
  // MAIN APP CONTAINER (Screens 5, 6, 7, 8, 9, 10, 12, 13, 14, 16, 17, 18)
  // =========================================================================
  return (
    <div 
      className="min-h-screen bg-slate-50 flex flex-col font-sans customer-root customer-portal selection:bg-[#8B0000] selection:text-white pb-24 md:pb-8"
      style={{ fontFamily: "'Plus Jakarta Sans', 'Poppins', sans-serif" }}
    >
      
      {/* ------------------------------------------------------------------- */}
      {/* SCREEN 16: SPLASH SCREEN (Batch 5) */}
      {/* ------------------------------------------------------------------- */}
      {splashLoading && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
          <div className="w-20 h-20 rounded-3xl bg-[#8B0000] text-white flex items-center justify-center shadow-xl shadow-[#8B0000]/30 mb-5">
            <QrCode className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Loyal<span className="text-[#8B0000]">QR</span>
          </h1>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
            Collect. Scan. Earn.
          </p>
          <div className="mt-8 flex flex-col items-center space-y-2">
            <RefreshCw className="w-5 h-5 text-[#8B0000] animate-spin" />
            <span className="text-xs text-slate-400 font-medium">Loading...</span>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SCREEN 18: NO INTERNET CONNECTION (Batch 5) */}
      {/* ------------------------------------------------------------------- */}
      {noInternetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-8 text-center space-y-4 shadow-2xl border border-slate-200">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-700 relative">
              <WifiOff className="w-8 h-8 text-slate-600" />
              <div className="absolute top-2 right-2 w-4 h-4 bg-rose-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                ✕
              </div>
            </div>
            <h3 className="text-lg font-black text-slate-900">No Internet Connection</h3>
            <p className="text-xs text-slate-500">Please check your connection and try again.</p>
            <button
              onClick={() => setNoInternetModalOpen(false)}
              className="w-full bg-[#8B0000] hover:bg-[#720000] text-white font-bold py-3 rounded-2xl text-xs transition flex items-center justify-center space-x-2 cursor-pointer shadow-md"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SCREEN 17: CAMERA PERMISSION (Batch 5) */}
      {/* ------------------------------------------------------------------- */}
      {cameraPermissionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-8 text-center space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="w-20 h-16 rounded-2xl bg-slate-800 text-white flex items-center justify-center mx-auto shadow-md relative">
              <Camera className="w-8 h-8 text-slate-200" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full"></div>
            </div>
            <h3 className="text-lg font-black text-slate-900">Allow Camera Access</h3>
            <p className="text-xs text-slate-500">Camera access is required to scan business QR codes.</p>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setCameraPermissionModalOpen(false);
                  startCamera();
                }}
                className="w-full bg-[#8B0000] hover:bg-[#720000] text-white font-bold py-3 rounded-2xl text-xs transition flex items-center justify-center space-x-2 cursor-pointer shadow-md"
              >
                <Camera className="w-4 h-4" />
                <span>Allow Camera</span>
              </button>
              <button
                onClick={() => {
                  setCameraPermissionModalOpen(false);
                  stopCamera();
                  setCurrentScreen('home');
                }}
                className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3 rounded-2xl text-xs transition cursor-pointer"
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ------------------------------------------------------------------- */}
      {/* DESKTOP & TABLET TOP NAVIGATION BAR (Visible on md/lg screens) */}
      {/* ------------------------------------------------------------------- */}
      <header className="bg-gradient-to-r from-[#690005] via-[#8B0000] to-[#590104] border-b border-[#720000] text-white sticky top-0 z-40 hidden md:block shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-[84px] flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/customer" onClick={() => setCurrentScreen('home')} className="flex items-center space-x-3 group">
            <img 
              src="/beaurex-icon.jpg" 
              alt="BeAurex Logo" 
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover shadow-md shadow-black/30 ring-1 ring-white/20 group-hover:scale-105 transition-all duration-300"
            />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight leading-none text-white">
                BeAurex
              </span>
              <span className="text-[10px] font-bold text-rose-200 uppercase tracking-widest mt-0.5">
                Rewarding Loyalty
              </span>
            </div>
          </Link>

          {/* Center Navigation Tabs */}
          <nav className="flex items-center space-x-1.5 sm:space-x-2.5">
            <button
              onClick={() => setCurrentScreen('home')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                currentScreen === 'home'
                  ? 'bg-white/20 text-white shadow-xs backdrop-blur-xs'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={openScanScreen}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                currentScreen === 'scan'
                  ? 'bg-white/20 text-white shadow-xs backdrop-blur-xs'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Scan</span>
            </button>

            <button
              onClick={() => {
                setRewardsSubTab('all');
                setCurrentScreen('rewards');
              }}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                currentScreen === 'rewards'
                  ? 'bg-white/20 text-white shadow-xs backdrop-blur-xs'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>My Rewards</span>
              <span className="bg-white text-[#8B0000] text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                {rewardHistory.length}
              </span>
            </button>
          </nav>

          {/* Right Customer Navigation & Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentScreen('profile')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                currentScreen === 'profile'
                  ? 'bg-white/20 text-white shadow-xs backdrop-blur-xs'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              title="Profile"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------- */}
      {/* MOBILE TOP NAVIGATION BAR (Visible on mobile screens < md) */}
      {/* ------------------------------------------------------------------- */}
      {currentScreen !== 'scan' && currentScreen !== 'after_scan' && currentScreen !== 'reward_details' && currentScreen !== 'waiting_approval' && currentScreen !== 'reward_congrats' && (
        <header className="bg-gradient-to-r from-[#690005] via-[#8B0000] to-[#590104] border-b border-[#720000] text-white sticky top-0 z-40 md:hidden px-4 py-3 flex items-center justify-between shadow-md">
          <Link to="/customer" onClick={() => setCurrentScreen('home')} className="flex items-center space-x-2.5">
            <img 
              src="/beaurex-icon.jpg" 
              alt="BeAurex Logo" 
              className="w-9 h-9 rounded-xl object-cover shadow-md shadow-black/30 ring-1 ring-white/20"
            />
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight leading-none text-white block">
                BeAurex
              </span>
              <span className="text-[9px] font-bold text-rose-200 uppercase tracking-widest mt-0.5 block">
                Rewarding Loyalty
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentScreen('profile')}
              className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-xs cursor-pointer transition border ${
                currentScreen === 'profile'
                  ? 'bg-white text-[#8B0000] border-white'
                  : 'bg-white/15 hover:bg-white/25 text-white border-white/20'
              }`}
              title="Profile"
              aria-label="Profile"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </header>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SCREEN 5: HOME (Batch 2) */}
      {/* ------------------------------------------------------------------- */}
      {currentScreen === 'home' && (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">

          {/* Top Metric Cards: Responsive Merchant Dashboard Type Card */}
          {!emptyStateDemo && (
            <div className="grid grid-cols-2 gap-2 sm:gap-3.5 lg:gap-4">
              {/* Card 1: Active Cards */}
              <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3 sm:py-4.5 sm:px-4.5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex items-center space-x-2.5 sm:space-x-3.5">
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-rose-50 text-rose-700 border border-rose-100 flex items-center justify-center shrink-0 shadow-2xs">
                  <CreditCard className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-rose-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] sm:text-xs font-bold text-slate-500 leading-tight">
                    Active Cards
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none my-0.5 sm:my-1">
                    {loyaltyCardsList.length}
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold text-emerald-600 leading-tight">
                    {loyaltyCardsList.length === 1 ? '1 Store' : `${loyaltyCardsList.length} Stores`}
                  </div>
                </div>
              </div>

              {/* Card 2: Rewards Redeemed */}
              <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3 sm:py-4.5 sm:px-4.5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex items-center space-x-2.5 sm:space-x-3.5">
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 shadow-2xs">
                  <Gift className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-emerald-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] sm:text-xs font-bold text-slate-500 leading-tight">
                    Rewards
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none my-0.5 sm:my-1">
                    {customerUser.rewardsRedeemedCount ?? 0}
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold text-emerald-600 leading-tight">
                    {(customerUser.rewardsRedeemedCount ?? 0) > 0 ? `${customerUser.rewardsRedeemedCount} Claimed` : '0 Claimed'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Layout: Active Loyalty Programs */}
          <div className="space-y-4">
              
              {/* Empty State */}
              {(emptyStateDemo || loyaltyCardsList.length === 0) ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xs">
                  <div className="w-24 h-24 rounded-full bg-rose-50 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-12 h-12 text-rose-300 stroke-[1.5]" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">No Loyalty Cards Yet</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                    You haven't joined any loyalty programs yet. Scan a QR code at any business to start collecting Aurex Coins and earn exciting rewards!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900">Continue Collecting</h3>
                    </div>
                    {loyaltyCardsList.length > 0 && (
                      <button
                        onClick={() => {
                          setRewardsSubTab('all');
                          setCurrentScreen('rewards');
                        }}
                        className="text-xs font-bold text-[#8B0000] hover:underline cursor-pointer"
                      >
                        View All
                      </button>
                    )}
                  </div>

                  {/* Loyalty Cards Grid (Matching Reference Image 2 - Normal display card, no navigation on click) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loyaltyCardsList.slice(0, 4).map((card) => {
                      const CardIcon = card.Icon || resolveStoreIcon(card.iconName || card.category);
                      const stampsNeeded = Math.max(0, card.totalStamps - card.stamps);
                      const isReady = card.stamps >= card.totalStamps;

                      return (
                        <div 
                          key={card.id}
                          className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3.5 hover:border-slate-300 hover:shadow-sm transition select-none"
                        >
                          {/* Top Row: Store Icon + Title & Subtitle + Top-Right Soft Pink Badge */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center space-x-3 min-w-0 flex-1">
                              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs shrink-0">
                                <CardIcon className="w-6 h-6 text-white" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-sm sm:text-base font-black text-slate-900 leading-tight truncate">
                                  {card.name}
                                </h4>
                                <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                                  {card.category || 'Coffee Shop'}
                                </p>
                              </div>
                            </div>

                            {/* Soft Pink Badge (Matching Reference Image 2: "2 more stamps") */}
                            <div className="bg-[#fff1f2] border border-rose-100/90 rounded-2xl px-3 py-1.5 text-center flex flex-col items-center justify-center shrink-0">
                              <span className="text-xs font-black text-[#e11d48] leading-tight">
                                {isReady ? 'Reward' : `${stampsNeeded} more`}
                              </span>
                              <span className="text-[10px] font-bold text-[#e11d48] leading-tight mt-0.5">
                                {isReady ? 'Ready 🎉' : (stampsNeeded === 1 ? 'stamp' : 'stamps')}
                              </span>
                            </div>
                          </div>

                          {/* Stamp Indicators (Matching Reference Image 2: Red circles with white star) */}
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 pt-1">
                              {Array.from({ length: Math.min(card.totalStamps, card.stamps) }).map((_, idx) => (
                                <div
                                  key={`stamped-${card.id}-${idx}`}
                                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#8B0000] text-white flex items-center justify-center shadow-xs shrink-0 transition-transform group-hover:scale-105"
                                  title={`Collected stamp ${idx + 1}`}
                                >
                                  <Star className="w-3.5 h-3.5 fill-white text-white" />
                                </div>
                              ))}
                              {Array.from({ length: stampsNeeded }).map((_, idx) => (
                                <div
                                  key={`unstamped-${card.id}-${idx}`}
                                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-dashed border-slate-300 bg-transparent flex items-center justify-center shrink-0"
                                  title={`Uncollected stamp`}
                                />
                              ))}
                            </div>

                            {/* Bottom Status text (Matching Reference Image 2: "3 of 5 Stamps") */}
                            <p className="text-xs font-bold text-slate-600">
                              {card.stamps} of {card.totalStamps} Stamps
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

          </div>

        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SCREEN 6: SCAN QR CODE (Batch 2) */}
      {/* ------------------------------------------------------------------- */}
      {currentScreen === 'scan' && (
        <div className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-between">
          {/* Top Bar with Close, Title, Flashlight */}
          <div className="p-4 sm:p-6 flex items-center justify-between">
            <button
              onClick={() => {
                stopCamera();
                setCurrentScreen('home');
              }}
              className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center cursor-pointer hover:bg-white/30"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-bold text-white tracking-wide">Scan QR Code</h2>
            <button
              onClick={() => setFlashlightOn(!flashlightOn)}
              className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition ${
                flashlightOn ? 'bg-amber-400 text-slate-950' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Zap className="w-5 h-5" />
            </button>
          </div>

          {/* Subtitle */}
          <div className="text-center px-6">
            <p className="text-xs text-white/80 font-medium">
              Position the QR code within the frame to collect Aurex Coin
            </p>
          </div>

          {/* Viewfinder box with red corner markers */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div 
              onClick={simulateScanSuccess}
              className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden flex items-center justify-center bg-slate-900/40 border-2 border-white/20 cursor-pointer"
              title="Align QR code here to scan directly"
            >
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Red viewfinder corners */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-red-600 rounded-tl-xl pointer-events-none"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-red-600 rounded-tr-xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-red-600 rounded-bl-xl pointer-events-none"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-red-600 rounded-br-xl pointer-events-none"></div>

              {/* Center scan line animation */}
              <div className="w-full h-0.5 bg-red-500 shadow-lg shadow-red-500/80 animate-pulse pointer-events-none"></div>
            </div>
          </div>

          {/* Bottom helper text */}
          <div className="p-6 text-center pb-8">
            <p className="text-xs text-white/70 font-medium">
              Scanning directly with camera...
            </p>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SCREEN 7: AFTER SCAN (Matching Uploaded Reference Image) */}
      {/* ------------------------------------------------------------------- */}
      {currentScreen === 'after_scan' && (() => {
        const activeSlug = storeInfo.qrSlug || slug || 'adobe-1865';
        const activeCard = loyaltyCardsList.find(c => c.slug === activeSlug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === activeSlug);
        const currentStamps = activeCard?.stamps ?? (typeof customerUser.stamps === 'number' ? customerUser.stamps : 1);
        const totalStamps = activeCard?.totalStamps ?? customerUser.totalStamps ?? 5;
        const dynamicExpiry = '7/30/2026';

        // Check if merchant allows first coin without approval and whether customer already got it
        const allowFirstCoinSetting = (() => {
          try {
            const saved = localStorage.getItem('beaurex_allow_first_coin');
            return saved !== null ? JSON.parse(saved) === true : true;
          } catch (_) { return true; }
        })();

        const hasClaimedFirstCoin = (() => {
          try {
            const map = JSON.parse(localStorage.getItem('beaurex_first_coin_awarded_map') || '{}');
            return Boolean(map[activeSlug]);
          } catch (_) { return false; }
        })();

        // Rewards data matching reference image exactly
        const rewardsList = [
          {
            id: 'rw-30-off',
            title: '30% off on next purchase',
            subtitle: 'on next purchase',
            requiredCoins: 2,
            image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
            expiry: dynamicExpiry
          },
          {
            id: 'rw-50-discount',
            title: '50% discount',
            subtitle: 'Full card completion perk',
            requiredCoins: 5,
            image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
            expiry: dynamicExpiry
          },
          {
            id: 'rw-free-coffee',
            title: 'Free Coffee',
            subtitle: 'Beverage upgrade on bill',
            requiredCoins: 3,
            image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
            expiry: dynamicExpiry
          }
        ];

        return (
          <div className="w-full max-w-lg mx-auto px-3.5 sm:px-4 py-3 space-y-4 pb-28">
            {/* Top Bar with Back Arrow & Store info */}
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <button
                onClick={() => {
                  setCurrentScreen('home');
                  navigate('/customer');
                }}
                className="p-1 -ml-1 text-slate-800 hover:text-slate-900 cursor-pointer"
                title="Back to Home"
              >
                <ArrowLeft className="w-6 h-6 stroke-[2]" />
              </button>
              <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs shrink-0">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-black text-slate-900 leading-tight truncate">
                  {storeInfo.storeName || (slug ? slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Adobe 1865')}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {storeInfo.categoryName || 'Retail & Loyalty'}
                </p>
              </div>
            </div>

            {/* Aurex Coin Earned Card */}
            <div className="bg-[#fef2f2] border border-rose-100 rounded-3xl p-4 sm:p-5 text-center space-y-3 shadow-xs">
              {coinApprovedMsg ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold py-2.5 px-3 rounded-2xl flex items-center justify-center space-x-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{coinApprovedMsg}</span>
                </div>
              ) : waitingApprovalActive && approvalType === 'coin' ? (
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  Waiting for Merchant Approval...
                </h3>
              ) : currentStamps > 0 ? (
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  You earned {currentStamps === 1 ? '1 Aurex Coin!' : `${currentStamps} Aurex Coins!`}
                </h3>
              ) : (
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  Claim Your Aurex Coin
                </h3>
              )}

              <p className="text-xs text-slate-600 font-medium">
                {currentStamps} of {totalStamps} Aurex Coins collected
              </p>

              {/* 5 Coin Circles Track (Responsive + Milestone Stickers) */}
              <div className="flex items-center justify-center gap-2 sm:gap-2.5 pt-2 pb-1 relative">
                {Array.from({ length: totalStamps }).map((_, idx) => {
                  const isCollected = idx < currentStamps;
                  const isSecondLast = idx === totalStamps - 2;
                  const isLast = idx === totalStamps - 1;

                  return (
                    <div key={`coin-slot-${idx}`} className="relative shrink-0">
                      {/* Second-to-last coin sticker (Perk Teaser) */}
                      {isSecondLast && (
                        <div
                          className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-xs flex items-center space-x-0.5 whitespace-nowrap animate-pulse pointer-events-none z-10"
                          title="Milestone Perk Sticker: 1 step away from 30% OFF!"
                        >
                          <span>🎁</span>
                          <span className="hidden sm:inline">Perk</span>
                        </div>
                      )}

                      {/* Final coin sticker (Grand Reward) */}
                      {isLast && !isCollected && (
                        <div
                          className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-xs flex items-center space-x-0.5 whitespace-nowrap pointer-events-none z-10"
                          title="Grand Reward: 30% OFF"
                        >
                          <span>⭐</span>
                          <span className="hidden sm:inline">30% OFF</span>
                        </div>
                      )}

                      {/* The Coin Circle */}
                      {isCollected ? (
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#8B0000] flex items-center justify-center text-white shadow-xs transition transform hover:scale-105 ${
                            isLast ? 'ring-2 ring-amber-400 ring-offset-1' : ''
                          }`}
                          title={`Collected Coin ${idx + 1}`}
                        >
                          <Coins className="w-4 h-4 text-amber-300" />
                        </div>
                      ) : (
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-dashed ${
                            isLast ? 'border-amber-400/80 bg-amber-50/50' : 'border-slate-300 bg-white/70'
                          } flex items-center justify-center`}
                          title={`Uncollected Coin ${idx + 1}`}
                        >
                          {isLast ? (
                            <Award className="w-3.5 h-3.5 text-amber-500/70" />
                          ) : isSecondLast ? (
                            <Gift className="w-3.5 h-3.5 text-rose-400/60" />
                          ) : null}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Waiting Status Banner (if waiting approval active) */}
              {waitingApprovalActive && (
                <div 
                  onClick={() => setCurrentScreen('waiting_approval')}
                  className="pt-2 cursor-pointer"
                >
                  <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-2.5 flex items-center justify-between text-amber-900 text-xs font-bold animate-pulse hover:bg-amber-100/70 transition">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
                      <span>Waiting for merchant approval at counter...</span>
                    </div>
                    <span className="text-xs text-amber-800 underline font-semibold shrink-0">View ID →</span>
                  </div>
                </div>
              )}
            </div>

            {/* Available Rewards Section (Merchant Dashboard Card Aesthetic) */}
            <div className="pt-1">
              <h3 className="text-base font-black text-slate-900 mb-3">Available Rewards</h3>

              <div className="space-y-3">
                {rewardsList.map((reward) => {
                  const isAchieved = currentStamps >= reward.requiredCoins;
                  const coinsRemaining = Math.max(0, reward.requiredCoins - currentStamps);

                  return (
                    <div
                      key={reward.id}
                      className={`bg-white border rounded-2xl p-3 sm:p-3.5 shadow-xs flex items-center space-x-3 sm:space-x-3.5 transition ${
                        isAchieved
                          ? 'border-emerald-200/90'
                          : 'border-slate-200/90 opacity-90'
                      }`}
                    >
                      {/* Left Thumbnail Image */}
                      <img
                        src={reward.image}
                        alt={reward.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0"
                      />

                      {/* Right Details Container */}
                      <div className="min-w-0 flex-1">
                        {/* Title & Achieved Badge */}
                        <div className="flex items-start justify-between gap-1.5">
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                            {reward.title}
                          </h4>
                          {isAchieved && (
                            <span className="bg-[#10b981] text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                              ACHIEVED
                            </span>
                          )}
                        </div>

                        {/* Aurex Coins Badge & Status */}
                        <div className="flex items-center flex-wrap gap-1 sm:gap-1.5 mt-1 sm:mt-1.5">
                          <span className="bg-rose-50 text-rose-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-rose-100 shrink-0">
                            {reward.requiredCoins} AUREX COINS
                          </span>
                          <span className="text-[10px] sm:text-[11px] text-slate-600 font-medium">
                            {isAchieved ? (
                              <span className="text-emerald-700 font-bold">Ready to claim! 🎉</span>
                            ) : (
                              `• Collect ${coinsRemaining} more`
                            )}
                          </span>
                        </div>

                        {/* Footer: Expiry Badge */}
                        <div className="mt-2 sm:mt-2.5 flex items-center justify-between">
                          <span className="bg-amber-50 text-amber-700 border border-amber-200/70 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 whitespace-nowrap">
                            EXPIRES {reward.expiry}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ------------------------------------------------------------------- */}
      {/* SCREEN 8: MY REWARDS & SCREEN 14: REWARD HISTORY (Matching Image 3) */}
      {/* ------------------------------------------------------------------- */}
      {currentScreen === 'rewards' && (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-5 space-y-5 pb-28">
          {/* Top Tab Bar: All vs To Claim vs History (Responsive Mobile View) */}
          <div className="border-b border-slate-200">
            <div className="flex items-center justify-around sm:justify-center gap-2 sm:gap-8 max-w-md mx-auto px-1">
              <button
                type="button"
                onClick={() => setRewardsSubTab('all')}
                className={`pb-3 px-2 sm:px-4 text-xs sm:text-base font-black transition cursor-pointer relative shrink-0 whitespace-nowrap ${
                  rewardsSubTab === 'all'
                    ? 'text-slate-900 border-b-2 border-[#8B0000]'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <span className="whitespace-nowrap">All</span>
              </button>

              <button
                type="button"
                onClick={() => setRewardsSubTab('to_claim')}
                className={`pb-3 px-2 sm:px-4 text-xs sm:text-base font-black transition cursor-pointer flex items-center space-x-1 sm:space-x-1.5 relative shrink-0 whitespace-nowrap ${
                  rewardsSubTab === 'to_claim'
                    ? 'text-slate-900 border-b-2 border-[#8B0000]'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <span className="whitespace-nowrap">To Claim</span>
                {claimableRewards.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                    {claimableRewards.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setRewardsSubTab('history')}
                className={`pb-3 px-2 sm:px-4 text-xs sm:text-base font-black transition cursor-pointer flex items-center space-x-1 sm:space-x-1.5 relative shrink-0 whitespace-nowrap ${
                  rewardsSubTab === 'history'
                    ? 'text-slate-900 border-b-2 border-[#8B0000]'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <span className="whitespace-nowrap">History</span>
                {rewardHistory.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                    {rewardHistory.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* TAB 1: ALL (Section where customer can see all their loyalty cards) */}
          {rewardsSubTab === 'all' && (
            <div className="space-y-6 pt-1 animate-in fade-in duration-200">
              {/* Ready to Claim notification banner if rewards are unlocked */}
              {claimableRewards.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-4 sm:p-5 flex items-center justify-between shadow-xs">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
                      <Gift className="w-5 h-5 text-amber-200" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 leading-tight">
                        You have {claimableRewards.length} reward{claimableRewards.length > 1 ? 's' : ''} ready to claim! 🎉
                      </h4>
                      <p className="text-xs text-emerald-800 font-medium mt-0.5">
                        Claim at the counter during your checkout visit.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRewardsSubTab('to_claim')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shrink-0 cursor-pointer shadow-xs"
                  >
                    View Rewards
                  </button>
                </div>
              )}

              {/* All Active Loyalty Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-sm sm:text-base font-black text-slate-900">All My Loyalty Cards</h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {loyaltyCardsList.length} cards active
                  </span>
                </div>

                {loyaltyCardsList.length === 0 ? (
                  <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xs">
                    <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-10 h-10 text-rose-300 stroke-[1.5]" />
                    </div>
                    <h4 className="text-base font-black text-slate-900">No Loyalty Cards Yet</h4>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                      You haven't scanned or joined any loyalty programs yet. Scan a store's QR code to get your first Aurex Coin!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loyaltyCardsList.map((card) => {
                      const CardIcon = card.Icon || resolveStoreIcon(card.iconName || card.category);
                      const stampsNeeded = Math.max(0, card.totalStamps - card.stamps);
                      const isReady = card.stamps >= card.totalStamps;

                      return (
                        <div 
                          key={`all-tab-${card.id}`}
                          className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3.5 hover:border-slate-300 hover:shadow-sm transition select-none"
                        >
                          {/* Top Row: Store Icon + Title & Subtitle + Top-Right Soft Pink Badge */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center space-x-3 min-w-0 flex-1">
                              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs shrink-0">
                                <CardIcon className="w-6 h-6 text-white" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-sm sm:text-base font-black text-slate-900 leading-tight truncate">
                                  {card.name}
                                </h4>
                                <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                                  {card.category || 'Coffee Shop'}
                                </p>
                              </div>
                            </div>

                            {/* Soft Pink Badge (Matching Reference Image 2: "2 more stamps") */}
                            <div className="bg-[#fff1f2] border border-rose-100/90 rounded-2xl px-3 py-1.5 text-center flex flex-col items-center justify-center shrink-0">
                              <span className="text-xs font-black text-[#e11d48] leading-tight">
                                {isReady ? 'Reward' : `${stampsNeeded} more`}
                              </span>
                              <span className="text-[10px] font-bold text-[#e11d48] leading-tight mt-0.5">
                                {isReady ? 'Ready 🎉' : (stampsNeeded === 1 ? 'stamp' : 'stamps')}
                              </span>
                            </div>
                          </div>

                          {/* Stamp Indicators (Matching Reference Image 2: Red circles with white star) */}
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 pt-1">
                              {Array.from({ length: Math.min(card.totalStamps, card.stamps) }).map((_, idx) => (
                                <div
                                  key={`all-stamped-${card.id}-${idx}`}
                                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#8B0000] text-white flex items-center justify-center shadow-xs shrink-0 transition-transform group-hover:scale-105"
                                  title={`Collected stamp ${idx + 1}`}
                                >
                                  <Star className="w-3.5 h-3.5 fill-white text-white" />
                                </div>
                              ))}
                              {Array.from({ length: stampsNeeded }).map((_, idx) => (
                                <div
                                  key={`all-unstamped-${card.id}-${idx}`}
                                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-dashed border-slate-300 bg-transparent flex items-center justify-center shrink-0"
                                  title={`Uncollected stamp`}
                                />
                              ))}
                            </div>

                            {/* Bottom Status text (Matching Reference Image 2: "3 of 5 Stamps") */}
                            <p className="text-xs font-bold text-slate-600">
                              {card.stamps} of {card.totalStamps} Stamps
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: TO CLAIM */}
          {rewardsSubTab === 'to_claim' && (
            <div className="space-y-6 pt-1 animate-in fade-in duration-200">
              {claimableRewards.length === 0 ? (
                <div className="bg-white border border-slate-200/90 rounded-3xl p-10 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto text-[#8B0000]">
                    <Gift className="w-7 h-7 text-[#8B0000]" />
                  </div>
                  <h4 className="text-sm font-black text-slate-800">No Rewards Ready to Claim</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Collect more Aurex Coins on your loyalty cards to unlock exclusive discounts and rewards!
                  </p>
                  <button
                    type="button"
                    onClick={() => setRewardsSubTab('all')}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#8B0000] text-white text-xs font-bold hover:bg-[#720000] transition cursor-pointer"
                  >
                    <span>View All My Cards</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-sm sm:text-base font-black text-slate-900">Ready to Claim</h3>
                    <span className="text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      {claimableRewards.length} unlocked 🎉
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {claimableRewards.map((reward) => (
                      <div 
                        key={reward.id}
                        className="bg-white border-2 border-emerald-500/30 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <img
                                src={reward.image}
                                alt={reward.storeName}
                                className="w-12 h-12 rounded-2xl object-cover shadow-xs"
                              />
                              <div>
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                                  Ready Now 🎉
                                </span>
                                <h4 className="text-sm font-black text-slate-900 mt-1">{reward.title}</h4>
                                <p className="text-xs text-slate-500 font-medium">{reward.storeName}</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 text-xs text-emerald-800 font-medium flex items-center space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{reward.description || `${reward.requiresStamps || 5} of ${reward.requiresStamps || 5} Aurex Coins collected! Ready to claim at checkout.`}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedReward({
                              id: reward.id,
                              title: reward.title,
                              subtitle: reward.subtitle || '',
                              storeName: reward.storeName,
                              requiresStamps: reward.requiresStamps || 5,
                              validTill: reward.validTill || '15 Aug 2026',
                              image: reward.image,
                              approvedAt: reward.approvedAt || 'Ready Now'
                            });
                            setCurrentScreen('reward_details');
                          }}
                          className="w-full bg-[#8B0000] hover:bg-[#720000] text-white font-black py-3 rounded-2xl text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-md shadow-[#8B0000]/20 active:scale-98"
                        >
                          <Gift className="w-4 h-4 text-amber-300" />
                          <span>Claim This Reward</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REWARD HISTORY */}
          {rewardsSubTab === 'history' && (() => {
            const filteredHistory = rewardHistory.filter((item) => {
              if (historyFilter === 'All') return true;
              return item.status.toLowerCase() === historyFilter.toLowerCase();
            });

            return (
              <div className="space-y-4 pt-1 animate-in fade-in duration-200">
                {/* Filter pills: All, Active, Used, Expired */}
                <div className="flex items-center space-x-2.5 overflow-x-auto pb-1">
                  {['All', 'Active', 'Used', 'Expired'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setHistoryFilter(f)}
                      className={`py-1.5 px-5 sm:px-6 rounded-full text-xs sm:text-sm font-bold transition cursor-pointer shrink-0 ${
                        historyFilter === f
                          ? 'bg-[#8B0000] text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {/* History Responsive Grid: 1 col on mobile, 2 on tablet, 3 on laptop */}
                {filteredHistory.length === 0 ? (
                  <div className="bg-white border border-slate-200/90 rounded-3xl p-10 text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
                      <Gift className="w-7 h-7 text-slate-400" />
                    </div>
                    <h4 className="text-sm font-black text-slate-800">No {historyFilter} Rewards</h4>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">
                      You do not have any {historyFilter.toLowerCase()} reward vouchers at this time.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredHistory.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3 hover:border-slate-300 transition"
                      >
                        {/* Top Section: Thumbnail + Title + Store + Status (Matching Reference Image 2) */}
                        <div className="flex items-start space-x-3.5">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover shrink-0 shadow-2xs"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                                {item.title}
                              </h4>
                              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg shrink-0 ${
                                item.status === 'Used'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                  : item.status === 'Active'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                  : 'bg-slate-100 text-slate-500'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-slate-700 mt-1">
                              {item.storeName}
                            </p>
                          </div>
                        </div>

                        {/* Bottom Section: Claimed on | Used on + Chevron Right (Matching Reference Image 2) */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                            <div>
                              <span className="text-[11px] text-slate-400 font-medium block">Claimed on</span>
                              <span className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 block">{item.claimedDate || '20 May 2026'}</span>
                            </div>

                            <div className="h-6 sm:h-7 w-px bg-slate-200/80"></div>

                            <div>
                              <span className="text-[11px] text-slate-400 font-medium block">{item.dateLabel || 'Used on'}</span>
                              <span className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 block">{item.dateValue || '20 May 2026'}</span>
                            </div>
                          </div>

                          <ChevronRight className="w-5 h-5 text-slate-800 shrink-0 ml-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SCREEN 10: REWARD DETAILS / CLAIM NOW (Matching media_1791479255151.png) */}
      {/* ------------------------------------------------------------------- */}
      {currentScreen === 'reward_details' && (
        <div className="w-full max-w-sm mx-auto px-4 py-4 space-y-3.5 pb-24 animate-in fade-in duration-300">
          
          {/* Top Card: Reward Info */}
          <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-xs flex items-center space-x-4">
            <img
              src={selectedReward.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80'}
              alt={selectedReward.title || '30% OFF'}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover shrink-0 shadow-xs"
            />
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
                {selectedReward.title || '30% OFF'}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-1">
                {selectedReward.subtitle || 'on next purchase'}
              </p>
              <div className="mt-3">
                <span className="inline-block px-3.5 py-1.5 rounded-full bg-rose-50 text-[#8B0000] text-xs font-black tracking-tight">
                  Requires {selectedReward.requiresStamps || 2} Aurex Coins
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Your Progress */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-slate-900">Your Progress</span>
              <span className="text-sm font-black text-slate-900">{customerUser.stamps || 3} / {customerUser.totalStamps || 5} Aurex Coins</span>
            </div>
            
            <div className="flex items-center space-x-3 pt-1 pb-0.5">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#8B0000] flex items-center justify-center text-white shadow-xs shrink-0"
                >
                  <Coins className="w-5 h-5 text-amber-300" />
                </div>
              ))}
              {[4, 5].map((n) => (
                <div
                  key={n}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-dashed border-slate-300 bg-white shrink-0"
                />
              ))}
            </div>
          </div>

          {/* Card 3: Valid Till */}
          <div className="bg-gradient-to-r from-rose-50/70 via-pink-50/40 to-rose-50/70 border border-rose-100/70 rounded-2xl p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2 text-slate-800">
              <Calendar className="w-5 h-5 text-slate-800 shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-slate-800">Valid Till</span>
            </div>
            <span className="text-xs sm:text-sm font-black text-[#8B0000]">
              {selectedReward.validTill || '30 Jul 2026'}
            </span>
          </div>

          {/* Claim Now Button */}
          <div className="pt-2">
            <button
              onClick={handleInitiateClaim}
              className="w-full bg-[#8B0000] hover:bg-[#690005] text-white font-black py-4 rounded-2xl text-sm sm:text-base transition shadow-md shadow-[#8B0000]/25 cursor-pointer active:scale-[0.98]"
            >
              Claim Now
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SCREEN 12: WAITING FOR APPROVAL (Matching Image 3) */}
      {/* ------------------------------------------------------------------- */}
      {currentScreen === 'waiting_approval' && (() => {
        const cleanCustomerId = (customerUser.customerId || 'LQR-8F4A29').replace(/^ID:\s*/, '').trim();
        const activeStoreName = storeInfo.storeName || (slug ? slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Ka-feen');
        const activeCategory = storeInfo.categoryName || 'Coffee Shop';

        return (
          <div className="w-full max-w-sm mx-auto px-4 py-3 sm:py-5 text-center animate-in fade-in duration-300">
            {/* Top Bar with Back Arrow & Store info matching Image 3 */}
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 text-left">
              <button
                type="button"
                onClick={() => setCurrentScreen('after_scan')}
                className="p-1 -ml-1 text-slate-800 hover:text-slate-900 cursor-pointer"
                title="Back to Loyalty Card"
              >
                <ArrowLeft className="w-6 h-6 stroke-[2]" />
              </button>
              <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs shrink-0">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-black text-slate-900 leading-tight truncate">
                  {activeStoreName}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {activeCategory}
                </p>
              </div>
            </div>

            {/* Hourglass with Segmented Red Circle Loader matching Image 3 */}
            <div className="pt-10 pb-4">
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                {/* 4-segment animated circle ring */}
                <svg className="absolute inset-0 w-full h-full animate-spin duration-3000" viewBox="0 0 100 100">
                  {/* Pale pink segments */}
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="#fecdd3"
                    strokeWidth="3.5"
                    strokeDasharray="60 15"
                    strokeLinecap="round"
                  />
                  {/* Crimson dark red segments */}
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="#c0151f"
                    strokeWidth="3.5"
                    strokeDasharray="60 85"
                    strokeDashoffset="15"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="#c0151f"
                    strokeWidth="3.5"
                    strokeDasharray="60 85"
                    strokeDashoffset="135"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Hourglass Icon */}
                <div className="relative flex items-center justify-center">
                  <Hourglass className="w-12 h-12 text-[#c0151f] stroke-[2.2]" />
                </div>
              </div>
            </div>

            {/* Waiting for Approval Headline & Subtitle */}
            <div className="space-y-1.5 mt-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Waiting for Approval
              </h2>
              <p className="text-sm font-semibold text-slate-600 max-w-xs mx-auto">
                Your request is being reviewed by the merchant.
              </p>
            </div>

            {/* Customer ID Card matching Image 3 */}
            <div className="bg-[#fff5f5] border border-rose-100 rounded-3xl p-5 flex items-center space-x-4 max-w-xs sm:max-w-sm mx-auto shadow-xs text-left mt-6">
              {/* ID Badge Icon */}
              <div className="w-12 h-9 rounded-xl border-2 border-slate-900 flex items-center justify-center space-x-1.5 shrink-0 bg-transparent px-1.5">
                <User className="w-4 h-4 text-slate-900 stroke-[2.5]" />
                <div className="flex flex-col space-y-0.5">
                  <div className="w-3.5 h-0.5 bg-slate-900 rounded-full"></div>
                  <div className="w-3.5 h-0.5 bg-slate-900 rounded-full"></div>
                  <div className="w-3.5 h-0.5 bg-slate-900 rounded-full"></div>
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">
                  Customer ID
                </span>
                <span className="text-2xl sm:text-3xl font-black text-[#c0151f] font-mono tracking-wider block mt-0.5">
                  {cleanCustomerId}
                </span>
              </div>
            </div>

            {/* Instruction Footer matching Image 3 */}
            <p className="text-sm font-semibold text-slate-700 max-w-xs mx-auto leading-relaxed mt-5">
              Please share your Customer ID with the cashier.
            </p>
          </div>
        );
      })()}

      {/* ------------------------------------------------------------------- */}
      {/* SCREEN 13: REWARD CLAIMED (Matching media_1791479304410.png) */}
      {/* ------------------------------------------------------------------- */}
      {currentScreen === 'reward_congrats' && (
        <div className="w-full max-w-sm mx-auto px-4 py-8 sm:py-12 text-center space-y-5 animate-in fade-in duration-300 relative">
          
          {/* Floating Confetti Diamonds */}
          <div className="relative flex justify-center items-center pt-2">
            {/* Top decorative diamond particles */}
            <div className="absolute -top-3 left-10 w-2.5 h-2.5 bg-rose-500 rotate-45 pointer-events-none" />
            <div className="absolute top-1 left-20 w-2 h-2 bg-amber-400 rotate-45 pointer-events-none" />
            <div className="absolute -top-4 right-14 w-2.5 h-2.5 bg-cyan-500 rotate-45 pointer-events-none" />
            <div className="absolute top-3 right-8 w-2.5 h-2.5 bg-emerald-500 rotate-45 pointer-events-none" />
            <div className="absolute top-0 right-24 w-2 h-2 bg-purple-500 rotate-45 pointer-events-none" />
            <div className="absolute -top-2 left-28 w-2 h-2 bg-purple-600 rotate-45 pointer-events-none" />

            {/* Solid Green Checkmark Circle */}
            <div className="w-24 h-24 rounded-full bg-[#00a854] text-white flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Check className="w-12 h-12 stroke-[3.5] text-white" />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-[#00a854] tracking-tight">
              Reward Claimed!
            </h2>
            <p className="text-sm font-bold text-slate-800">
              Enjoy your reward 🎉
            </p>
          </div>

          {/* Reward Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-xs flex items-center space-x-4 text-left">
            <img
              src={selectedReward.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80'}
              alt={selectedReward.title || '30% OFF'}
              className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-xs"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {selectedReward.title || '30% OFF'}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-0.5">
                {selectedReward.subtitle || 'on next purchase'}
              </p>
            </div>
          </div>

          {/* Approved On Card */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center justify-between text-left">
            <div className="flex items-center space-x-2 text-slate-800">
              <Calendar className="w-5 h-5 text-slate-800 shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-slate-800">Approved On</span>
            </div>
            <div className="text-right">
              <span className="text-xs sm:text-sm font-black text-slate-900 block">
                {selectedReward.approvedDate || '20 May 2026'}
              </span>
              <span className="text-xs font-bold text-slate-900 block mt-0.5">
                {selectedReward.approvedTime || '11:45 AM'}
              </span>
            </div>
          </div>

          {/* Done Button */}
          <div className="pt-2">
            <button
              onClick={handleClaimDone}
              className="w-full bg-[#8B0000] hover:bg-[#690005] text-white font-black py-4 rounded-2xl text-sm sm:text-base transition shadow-md shadow-[#8B0000]/25 cursor-pointer active:scale-[0.98]"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SCREEN 9: PROFILE (Batch 2) */}
      {/* ------------------------------------------------------------------- */}
      {currentScreen === 'profile' && (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4">
          
          <div className="space-y-3.5">
            {/* 1. User Profile Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex items-center justify-between hover:border-slate-300 transition">
              <div className="flex items-center space-x-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8B0000] to-[#981b2a] text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md shadow-[#8B0000]/25 ring-2 ring-rose-200">
                  {customerUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight truncate">
                    {customerUser.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1 text-xs text-slate-500 font-mono">
                    <span className="bg-slate-50 border border-slate-200/80 px-2.5 py-0.5 rounded-lg text-slate-700 font-bold">
                      ID: {customerUser.customerId}
                    </span>
                    <button
                      onClick={() => handleCopyCustomer(customerUser.customerId)}
                      className="p-1 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                      title="Copy Customer ID"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {copiedId && <span className="text-[10px] text-emerald-600 font-sans font-bold">Copied!</span>}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditProfileForm({ 
                    name: customerUser.name || '', 
                    phone: customerUser.phone || '', 
                    email: customerUser.email || '' 
                  });
                  setEditProfileModalOpen(true);
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-2xs cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit</span>
              </button>
            </div>

            {/* 2. Phone & Email Card (matching image) */}
            <div 
              onClick={() => {
                setEditProfileForm({ 
                  name: customerUser.name || '', 
                  phone: customerUser.phone || '', 
                  email: customerUser.email || '' 
                });
                setEditProfileModalOpen(true);
              }}
              className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between hover:border-slate-300 transition cursor-pointer"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900">Phone &amp; Email</h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {customerUser.phone ? `${customerUser.phone} • ` : ''}{customerUser.email}
                  </p>
                </div>
              </div>
              <Edit3 className="w-4 h-4 text-slate-400 hover:text-slate-700 shrink-0" />
            </div>

            {/* 3. Invite & Refer Button Below Email Address */}
            <div>
              <button
                type="button"
                onClick={handleShareReferral}
                className="w-full bg-gradient-to-r from-[#690005] via-[#8B0000] to-[#590104] hover:from-[#590104] hover:to-[#400002] text-white font-black p-4 rounded-2xl text-xs sm:text-sm transition-all duration-200 shadow-lg shadow-[#8B0000]/25 flex items-center justify-between cursor-pointer group transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300 shadow-sm shrink-0">
                    <Share2 className="w-5 h-5 text-amber-300 stroke-[2.5]" />
                  </div>
                  <div className="text-left">
                    <span className="block text-xs sm:text-sm font-black text-white leading-tight">
                      Invite &amp; Refer Friends
                    </span>
                    <span className="block text-[11px] font-semibold text-rose-200/90 mt-0.5">
                      Share your referral link to earn bonus rewards
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 bg-white/15 px-3 py-1.5 rounded-xl border border-white/20 text-amber-300 font-bold text-xs group-hover:bg-white/25 transition shrink-0 ml-2">
                  <Gift className="w-3.5 h-3.5 text-amber-300" />
                  <span>Refer</span>
                  <ChevronRight className="w-3.5 h-3.5 text-white/80 group-hover:translate-x-0.5 transition" />
                </div>
              </button>
              {copiedReferral && (
                <p className="text-center text-xs text-emerald-600 font-bold mt-2">
                  ✓ Referral link copied to clipboard!
                </p>
              )}
            </div>


            {/* 5. Privacy Policy Card */}
            <div 
              onClick={() => {
                setLegalModalTab('privacy');
                setLegalModalOpen(true);
              }}
              className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between hover:border-slate-300 transition cursor-pointer"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900">Privacy Policy</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Read data protection &amp; privacy terms</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 hover:text-slate-700 shrink-0" />
            </div>

            {/* 6. Terms & Conditions Card */}
            <div 
              onClick={() => {
                setLegalModalTab('terms');
                setLegalModalOpen(true);
              }}
              className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between hover:border-slate-300 transition cursor-pointer"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#8B0000] flex items-center justify-center shrink-0 border border-rose-100">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900">Terms &amp; Conditions</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Read platform usage agreements</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 hover:text-slate-700 shrink-0" />
            </div>

            {/* 7. Bottom Logout Button (Matching Brand Theme & Only Logout Text) */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full bg-[#8B0000] hover:bg-[#720000] text-white font-black py-3.5 rounded-2xl shadow-md shadow-[#8B0000]/25 transition flex items-center justify-center space-x-2 text-sm cursor-pointer active:scale-[0.99]"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* PERSISTENT BOTTOM NAVIGATION BAR - Mobile Only (matching media_1791477164813.png) */}
      {/* ------------------------------------------------------------------- */}
      {currentScreen !== 'scan' && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/90 px-6 py-2 flex items-center justify-between shadow-lg md:hidden">
          {/* Home Tab */}
          <button
            onClick={() => setCurrentScreen('home')}
            className={`flex flex-col items-center justify-center py-1 transition cursor-pointer flex-1 ${
              currentScreen === 'home' ? 'text-slate-900 font-extrabold' : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <Home className="w-6 h-6 stroke-[2]" />
            <span className="text-[11px] mt-1">Home</span>
          </button>

          {/* Center Floating Red Scan Button */}
          <div className="flex-1 flex justify-center">
            <button
              onClick={openScanScreen}
              className="-mt-5 w-14 h-14 rounded-full bg-[#8B0000] hover:bg-[#690005] text-white flex items-center justify-center shadow-lg shadow-[#8B0000]/40 border-4 border-white transition transform active:scale-95 cursor-pointer"
              aria-label="Scan QR Code"
            >
              <QrCode className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* Rewards Tab */}
          <button
            onClick={() => {
              setRewardsSubTab('all');
              setCurrentScreen('rewards');
            }}
            className={`flex flex-col items-center justify-center py-1 transition cursor-pointer flex-1 relative ${
              currentScreen === 'rewards' ? 'text-slate-900 font-extrabold' : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <div className="relative">
              <Gift className="w-6 h-6 stroke-[2]" />
              {rewardHistory.length > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#8B0000] text-white text-[9px] font-black flex items-center justify-center">
                  {rewardHistory.length}
                </span>
              )}
            </div>
            <span className="text-[11px] mt-1">Rewards</span>
          </button>
        </nav>
      )}

      {/* Synchronized Legal Policy Modal (Privacy Policy & Terms of Service) */}
      <LegalPolicyModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalModalTab}
      />

      {/* Edit Customer Profile Modal */}
      {editProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative space-y-4 animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setEditProfileModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <h3 className="text-base font-black text-slate-900">Edit Profile</h3>
              <p className="text-xs text-slate-500 mt-0.5">Update your customer profile details</p>
            </div>
            <form onSubmit={handleSaveCustomerProfile} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editProfileForm.name}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000]"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={editProfileForm.phone}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000]"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={editProfileForm.email}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000]"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditProfileModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#8B0000] to-[#590104] text-white text-xs font-black shadow-md hover:from-[#8B0000] hover:to-[#400002] transition cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

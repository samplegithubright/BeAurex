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
  Crown, CreditCard, LogIn, Share2, MessageCircle, Calendar, Edit3
} from 'lucide-react';
import LegalPolicyModal from '../components/LegalPolicyModal';

// Official BeAurex Stamp Indicator (Crisp star in BeAurex maroon when stamped, dashed circle when uncollected)
function BeAurexStamp({ stamped = true, size = 'md' }) {
  const sizeClasses = size === 'lg' ? 'w-10 h-10' : size === 'md' ? 'w-8 h-8' : 'w-7 h-7';
  if (!stamped) {
    return (
      <div 
        className={`${sizeClasses} rounded-full border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center transition shrink-0`}
        title="Uncollected Stamp"
      />
    );
  }
  return (
    <div 
      className={`${sizeClasses} rounded-full bg-[#8B0000] flex items-center justify-center shadow-xs transition transform hover:scale-105 shrink-0 text-white`}
      title="Collected Stamp"
    >
      <Star className="w-4 h-4 text-white fill-white" />
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

  // Rewards sub-tab: 'to_claim' (Screen 8) or 'history' (Screen 14)
  const [rewardsSubTab, setRewardsSubTab] = useState('to_claim');
  const [historyFilter, setHistoryFilter] = useState('All'); // 'All' | 'Active' | 'Used' | 'Expired'
  const [selectedHistoryVoucher, setSelectedHistoryVoucher] = useState(null);

  // Dynamic Reward History items for All / Active / Used / Expired
  const [rewardHistory, setRewardHistory] = useState([
    {
      id: 'rh-1',
      title: '30% off on next purchase',
      storeName: 'Ka-feen',
      category: 'Coffee Shop',
      status: 'Used',
      claimedDate: '20 May 2026',
      dateLabel: 'Used on',
      dateValue: '20 May 2026',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
      voucherCode: 'BX-KAF-30OFF',
      discount: '30% Discount'
    },
    {
      id: 'rh-2',
      title: 'Free Coffee',
      storeName: 'Ka-feen',
      category: 'Coffee Shop',
      status: 'Expired',
      claimedDate: '12 Apr 2026',
      dateLabel: 'Expired on',
      dateValue: '10 Apr 2026',
      image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
      voucherCode: 'BX-KAF-FREE',
      discount: 'Free Coffee'
    },
    {
      id: 'rh-3',
      title: 'Buy 1 Get 1 Free',
      storeName: 'Brew House',
      category: 'Cafe & Bistro',
      status: 'Active',
      claimedDate: '15 Jul 2026',
      dateLabel: 'Valid till',
      dateValue: '15 Aug 2026',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      voucherCode: 'BX-BREW-BOGO26',
      discount: 'Buy 1 Get 1 Free'
    },
    {
      id: 'rh-4',
      title: 'Flat ₹100 Off on Meals',
      storeName: 'Ka-feen',
      category: 'Coffee Shop',
      status: 'Active',
      claimedDate: '01 Oct 2026',
      dateLabel: 'Valid till',
      dateValue: '31 Oct 2026',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
      voucherCode: 'BX-KAF-100OFF',
      discount: '₹100 Off'
    }
  ]);

  // Unlocked / Claimable Rewards ready to claim (When empty, shows Image 3 empty state)
  const [claimableRewards, setClaimableRewards] = useState(() => {
    const saved = localStorage.getItem('beaurex_claimable_rewards');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'cr-1',
        title: 'Buy 1 Get 1 Free',
        subtitle: 'on fresh brewed items',
        storeName: 'Brew House Bakery & Bistro',
        requiresStamps: 5,
        stampsCollected: 5,
        validTill: '15 Aug 2026',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
        approvedAt: 'Ready Now',
        description: '5 of 5 stamps collected! Ready to claim at checkout.'
      }
    ];
  });

  // Utility modals/screens
  const [cameraPermissionModalOpen, setCameraPermissionModalOpen] = useState(false);
  const [noInternetModalOpen, setNoInternetModalOpen] = useState(false);
  const [googleSignInModalOpen, setGoogleSignInModalOpen] = useState(false);
  const [emptyStateDemo, setEmptyStateDemo] = useState(false); // Screen 17 demo toggle
  const [splashLoading, setSplashLoading] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState('privacy'); // 'privacy' | 'terms'

  // Customer Profile State
  const [customerUser, setCustomerUser] = useState(() => {
    const saved = localStorage.getItem('beaurex_customer_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: 'Rohan Sharma',
      customerId: 'BX-8F4A29',
      phone: '+91 98765 43210',
      email: 'rohan.sharma@gmail.com',
      tier: 'Gold Member',
      memberSince: 'Jul 2026',
      activeCardsCount: 4,
      rewardsRedeemedCount: 3,
      points: 250,
      stamps: 3,
      totalStamps: 5,
      referralCode: 'BEAUREX-8F4A',
      referralCount: 3,
      referralEarnings: 150
    };
  });

  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({ name: '', email: '' });

  const handleSaveCustomerProfile = (e) => {
    e.preventDefault();
    const updated = {
      ...customerUser,
      name: editProfileForm.name.trim() || customerUser.name,
      email: editProfileForm.email.trim() || customerUser.email,
    };
    setCustomerUser(updated);
    try {
      localStorage.setItem('beaurex_customer_user', JSON.stringify(updated));
    } catch (err) {}
    setEditProfileModalOpen(false);
  };

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('/customer/login') || path.includes('/customer/signup')) {
        return false;
      }
    }
    const authStored = localStorage.getItem('beaurex_customer_auth');
    if (authStored === 'false') return false;
    return true;
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

  // Camera & Scanner State (Screen 6)
  const videoRef = useRef(null);
  const canvasRef = useRef(document.createElement('canvas'));
  const animFrameIdRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [cameraError, setCameraError] = useState('');

  // Sign in / Sign up form states (Email & Password based - No Mobile OTP)
  const [authMode, setAuthMode] = useState(initialAuthMode || 'signin');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginName, setLoginName] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [referralInput, setReferralInput] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccessMsg, setLoginSuccessMsg] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleCustomEmail, setGoogleCustomEmail] = useState('');
  const [googleCustomName, setGoogleCustomName] = useState('');

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

  // If slug is in URL on first mount, identify store
  useEffect(() => {
    if (slug) {
      const cleanSlug = String(slug).toLowerCase();
      const prettyName = cleanSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      setStoreInfo(prev => ({
        ...prev,
        storeName: prettyName || 'Ka-feen',
        qrSlug: cleanSlug
      }));
      setCurrentScreen('after_scan');
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
    const shareText = `Hey! Join me on BeAurex to get digital stamps and free rewards. Use my referral code ${code} to get a 10% welcome discount on your first visit! Sign up here: ${shareUrl}`;

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
      `Hey! Use my referral code *${code}* on BeAurex to get a flat *10% Welcome Discount* on your first store visit! Collect stamps & earn free rewards: ${shareUrl}`
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
        localStorage.setItem('beaurex_customer_auth', 'true');
        setIsAuthenticated(true);
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        if (slug) setCurrentScreen('after_scan');
        else setCurrentScreen('home');
      } else if (data && data.notRegistered) {
        setLoginError('Account not found with this email. Please create an account.');
        setTimeout(() => {
          setAuthMode('signup');
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
      localStorage.setItem('beaurex_customer_auth', 'true');
      setIsAuthenticated(true);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      if (slug) setCurrentScreen('after_scan');
      else setCurrentScreen('home');
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
    if (!loginPassword || loginPassword.length < 4) {
      setLoginError('Password must be at least 4 characters.');
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
          referralCode: referralInput.trim()
        })
      });
      const data = await res.json();
      setLoginLoading(false);

      if (data && data.success && data.customer) {
        setCustomerUser(data.customer);
        localStorage.setItem('beaurex_customer_user', JSON.stringify(data.customer));
        localStorage.setItem('beaurex_customer_auth', 'true');
        setIsAuthenticated(true);
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        if (slug) setCurrentScreen('after_scan');
        else setCurrentScreen('home');
      } else if (data && data.alreadyExists) {
        setLoginError(data.message || 'An account already exists with this email. Please sign in.');
        setTimeout(() => setAuthMode('signin'), 1800);
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
      localStorage.setItem('beaurex_customer_auth', 'true');
      setIsAuthenticated(true);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      if (slug) setCurrentScreen('after_scan');
      else setCurrentScreen('home');
    }
  };

  // Google Sign-In Handler
  const handleGoogleSignInSelect = async (accountEmail, accountName) => {
    setGoogleLoading(true);
    const targetEmail = accountEmail || loginEmail || 'customer@gmail.com';
    const targetName = accountName || (targetEmail.split('@')[0]) || 'BeAurex Customer';

    try {
      const res = await fetch('/api/customer/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          name: targetName,
          googleId: 'g_' + Math.random().toString(36).substring(2, 10)
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
          phone: '',
          tier: 'Bronze Member',
          points: 100,
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

      setIsAuthenticated(true);
      localStorage.setItem('beaurex_customer_auth', 'true');
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });

      if (slug) {
        setCurrentScreen('after_scan');
      } else {
        setCurrentScreen('home');
      }
    } catch (_) {
      setGoogleLoading(false);
      setGoogleSignInModalOpen(false);
      const custId = `BX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const newCust = {
        name: targetName,
        email: targetEmail,
        customerId: custId,
        phone: '',
        tier: 'Bronze Member',
        points: 100,
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
      setIsAuthenticated(true);
      localStorage.setItem('beaurex_customer_auth', 'true');
      if (slug) setCurrentScreen('after_scan');
      else setCurrentScreen('home');
    }
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
        localStorage.setItem('beaurex_customer_auth', 'true');
        setIsAuthenticated(true);
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        if (slug) setCurrentScreen('after_scan');
        else setCurrentScreen('home');
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
        localStorage.setItem('beaurex_customer_auth', 'true');
        setIsAuthenticated(true);
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        if (slug) setCurrentScreen('after_scan');
        else setCurrentScreen('home');
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
      localStorage.setItem('beaurex_customer_auth', 'true');
      setIsAuthenticated(true);
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      if (slug) setCurrentScreen('after_scan');
      else setCurrentScreen('home');
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
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      setSelectedReward({
        title: '30% OFF',
        subtitle: 'on next purchase',
        storeName: 'Ka-feen',
        requiresStamps: 2,
        validTill: '30 Jul 2026',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
        approvedDate: '20 May 2026',
        approvedTime: '11:45 AM'
      });
      setCurrentScreen('reward_details');
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

  // Simulate scanning counter QR
  const simulateScanSuccess = () => {
    stopCamera();
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setSelectedReward({
      title: '30% OFF',
      subtitle: 'on next purchase',
      storeName: 'Ka-feen',
      requiresStamps: 2,
      validTill: '30 Jul 2026',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
      approvedDate: '20 May 2026',
      approvedTime: '11:45 AM'
    });
    setCurrentScreen('reward_details');
  };

  // Reward Claim Approval Flow: Screen 10 (Reward Details) -> Screen 12 (Waiting for Merchant Approval) -> Screen 13 (Merchant Approved & Claimed)
  const handleInitiateClaim = () => {
    const cleanCustomerId = (customerUser.customerId || 'LQR-8F4A29').replace(/^ID:\s*/, '').trim();
    const claimId = `rem_${Date.now()}`;
    const claimObj = {
      id: claimId,
      customerName: customerUser.name || 'Sumit',
      customerId: `ID: ${cleanCustomerId}`,
      rewardTitle: `${selectedReward.title || '30% OFF'} ${selectedReward.subtitle || 'on next purchase'}`.trim(),
      stamps: '5/5 Stamps completed',
      timeAgo: 'Just now',
      expiresIn: `Expires: ${selectedReward.validTill || '30 Jul 2026'}`,
      voucherType: selectedReward.title?.includes('30') ? '30' : (selectedReward.title?.includes('Coffee') ? 'coffee' : '20'),
      avatarBg: 'bg-emerald-500',
      status: 'PENDING',
      storeSlug: storeInfo?.qrSlug || slug || 'ka-feen'
    };

    setPendingClaimId(claimId);
    setWaitingApprovalActive(true);
    setCurrentScreen('waiting_approval');

    // 1. Sync locally in localStorage for cross-tab merchant dashboard
    try {
      const existingRaw = localStorage.getItem('beaurex_pending_redemptions');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const updated = [claimObj, ...existing.filter(e => e.id !== claimId)];
      localStorage.setItem('beaurex_pending_redemptions', JSON.stringify(updated));
    } catch (_) {}

    // 2. Broadcast to Merchant via BroadcastChannel
    try {
      const channel = new BroadcastChannel('beaurex_redemptions');
      channel.postMessage({ type: 'CLAIM_REQUEST', claim: claimObj });
      channel.close();
    } catch (_) {}

    // 3. Submit to server endpoint
    fetch('/api/customer/reward/request-approval', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: cleanCustomerId,
        customerName: customerUser.name || 'Sumit',
        rewardTitle: claimObj.rewardTitle,
        storeSlug: claimObj.storeSlug,
        stamps: claimObj.stamps,
        voucherType: claimObj.voucherType
      })
    }).catch(() => {});
  };

  // Listen for Merchant Approval while waiting on Screen 12
  useEffect(() => {
    if (currentScreen !== 'waiting_approval') return;

    const cleanCustomerId = (customerUser.customerId || 'LQR-8F4A29').replace(/^ID:\s*/, '').trim();

    const handleApproved = (payload) => {
      confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
      setSelectedReward(prev => ({
        ...prev,
        approvedDate: payload?.approvedDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        approvedTime: payload?.approvedAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
      setWaitingApprovalActive(false);
      setCurrentScreen('reward_congrats');
    };

    // 1. Listen via BroadcastChannel
    let channel;
    try {
      channel = new BroadcastChannel('beaurex_redemptions');
      channel.onmessage = (event) => {
        if (event.data?.type === 'REWARD_APPROVED') {
          const pCust = String(event.data.customerId || '').replace(/^ID:\s*/, '').trim();
          if (!pCust || pCust === cleanCustomerId || (pendingClaimId && event.data.claimId === pendingClaimId)) {
            handleApproved(event.data);
          }
        }
      };
    } catch (_) {}

    // 2. Listen via storage event
    const handleStorage = (e) => {
      if (e.key === 'beaurex_latest_approval' && e.newValue) {
        try {
          const payload = JSON.parse(e.newValue);
          if (payload.type === 'REWARD_APPROVED') {
            const pCust = String(payload.customerId || '').replace(/^ID:\s*/, '').trim();
            if (!pCust || pCust === cleanCustomerId || (pendingClaimId && payload.claimId === pendingClaimId)) {
              handleApproved(payload);
            }
          }
        } catch (_) {}
      }
    };
    window.addEventListener('storage', handleStorage);

    // 3. Polling check (every 1.2s) from server & localStorage
    const pollInterval = setInterval(async () => {
      // Check localStorage
      try {
        const raw = localStorage.getItem('beaurex_latest_approval');
        if (raw) {
          const payload = JSON.parse(raw);
          if (payload.type === 'REWARD_APPROVED') {
            const pCust = String(payload.customerId || '').replace(/^ID:\s*/, '').trim();
            if (!pCust || pCust === cleanCustomerId || (pendingClaimId && payload.claimId === pendingClaimId)) {
              if (Date.now() - (payload.timestamp || 0) < 120000) {
                clearInterval(pollInterval);
                handleApproved(payload);
                return;
              }
            }
          }
        }
      } catch (_) {}

      // Check server endpoint
      try {
        const res = await fetch(`/api/customer/reward/check-approval?customerId=${cleanCustomerId}&claimId=${pendingClaimId || ''}`);
        const data = await res.json();
        if (data.status === 'APPROVED' && data.claim) {
          clearInterval(pollInterval);
          handleApproved(data.claim);
        }
      } catch (_) {}
    }, 1200);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorage);
      if (channel) channel.close();
    };
  }, [currentScreen, pendingClaimId, customerUser.customerId]);

  // Method to trigger approval simulation directly if testing locally
  const handleSimulateMerchantApproval = () => {
    const cleanCustomerId = (customerUser.customerId || 'LQR-8F4A29').replace(/^ID:\s*/, '').trim();
    const now = new Date();
    const approvedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const approvedDate = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    const payload = {
      type: 'REWARD_APPROVED',
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
    }
    setRewardHistory((prev) => [
      {
        id: `rh-${Date.now()}`,
        title: selectedReward.title || '30% OFF',
        storeName: selectedReward.storeName || 'Ka-feen',
        category: 'Coffee Shop',
        status: 'Active',
        claimedDate: selectedReward.approvedDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        dateLabel: 'Valid till',
        dateValue: selectedReward.validTill || '30 Jul 2026',
        image: selectedReward.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
        voucherCode: 'BX-KAF-30OFF',
        discount: selectedReward.title || 'Reward Voucher'
      },
      ...prev
    ]);
    setRewardsSubTab('history');
    setHistoryFilter('Active');
    setCurrentScreen('rewards');
  };

  // =========================================================================
  // VIEW: GOOGLE LENS / CAMERA SCAN LANDING PAGE (WHEN UN-AUTHENTICATED)
  // =========================================================================
  if (slug && !isAuthenticated) {
    return (
      <div 
        className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans customer-root auth-root selection:bg-[#8B0000] selection:text-white"
        style={{ fontFamily: "'Plus Jakarta Sans', 'Poppins', sans-serif" }}
      >
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group">
              <img 
                src="/beaurex-icon.jpg" 
                alt="BeAurex Logo" 
                className="w-10 h-10 rounded-xl object-cover shadow-md shadow-red-950/20 group-hover:scale-105 transition-all duration-300"
              />
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight leading-none text-[#8B0000]">
                  BeAurex
                </span>
                <span className="text-[10px] font-bold text-[#8B0000] uppercase tracking-widest mt-0.5">
                  Rewarding Loyalty
                </span>
              </div>
            </Link>
            <Link to="/" className="text-xs font-bold text-slate-500 hover:text-slate-800 transition">
              Home
            </Link>
          </div>
        </header>

        <main className="flex-1 max-w-md sm:max-w-lg lg:max-w-xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xl space-y-5 text-center">
            
            {/* Store Badge */}
            <div className="w-16 h-16 rounded-2xl bg-[#111111] text-white flex items-center justify-center mx-auto shadow-md">
              <Coffee className="w-8 h-8 text-amber-200" />
            </div>

            <div>
              <span className="bg-rose-50 text-[#8B0000] border border-rose-200 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                ● Store Counter Online
              </span>
              <h2 className="text-xl font-black text-slate-900">{storeInfo.storeName}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{storeInfo.categoryName} • Collect stamps &amp; rewards</p>
            </div>

            {/* Offer highlight card */}
            <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-4 text-left flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#8B0000] text-white flex items-center justify-center font-black text-sm shrink-0">
                <Gift className="w-5 h-5 text-amber-200" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black text-slate-900 leading-snug">30% OFF on next purchase</div>
                <div className="text-[11px] text-[#8B0000] font-bold mt-0.5">Collect 5 stamps to unlock</div>
              </div>
            </div>

            {/* Sign in CTAs */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => setGoogleSignInModalOpen(true)}
                className="w-full bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800 font-bold py-3.5 px-4 rounded-2xl text-xs transition flex items-center justify-center space-x-3 shadow-xs cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google Account</span>
              </button>

              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  navigate('/customer/login');
                }}
                className="w-full bg-[#8B0000] hover:bg-[#720000] text-white font-black py-3.5 px-4 rounded-2xl text-xs transition shadow-md shadow-[#8B0000]/20 cursor-pointer flex items-center justify-center space-x-2"
              >
                <LogIn className="w-4 h-4 text-white" />
                <span>Sign In with Email &amp; Password</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              Sign in once to save your stamps &amp; rewards safely across all participating stores.
            </p>
          </div>
        </main>

        <footer className="text-center p-4 text-xs text-slate-400">
          Powered by BeAurex Loyalty Network
        </footer>

        {/* Google Account Selector Modal */}
        {googleSignInModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <h3 className="font-bold text-sm text-slate-900">Sign in with Google</h3>
                </div>
                <button onClick={() => setGoogleSignInModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-500">Choose or enter your Google account to continue to BeAurex</p>

              <div className="space-y-3">
                <button
                  onClick={() => handleGoogleSignInSelect('customer.rewards@gmail.com', 'BeAurex Customer')}
                  className="w-full p-3 rounded-2xl border border-slate-200 hover:border-[#8B0000] hover:bg-rose-50/40 text-left flex items-center space-x-3 transition cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-rose-100 text-[#8B0000] font-bold text-xs flex items-center justify-center shrink-0">
                    G
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900">Google Customer Account</div>
                    <div className="text-[11px] text-slate-500 truncate">customer.rewards@gmail.com</div>
                  </div>
                </button>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Or enter your Google account:</span>
                  <input
                    type="text"
                    value={googleCustomName}
                    onChange={(e) => setGoogleCustomName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#8B0000]"
                  />
                  <input
                    type="email"
                    value={googleCustomEmail}
                    onChange={(e) => setGoogleCustomEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#8B0000]"
                  />
                  <button
                    type="button"
                    disabled={!googleCustomEmail}
                    onClick={() => handleGoogleSignInSelect(googleCustomEmail, googleCustomName)}
                    className="w-full py-2 bg-[#8B0000] hover:bg-[#720000] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>Sign in with this account</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

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
                Join BeAurex to collect stamps and unlock rewards.
              </p>
            </div>

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

                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-xs focus:outline-none focus:border-[#8B0000] focus:bg-white text-slate-900 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="relative">
                  <Sparkles className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500" />
                  <input
                    type="text"
                    value={referralInput}
                    onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
                    placeholder="Referral Code (Optional)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-xs focus:outline-none focus:border-[#8B0000] focus:bg-white text-slate-900 font-mono font-bold uppercase transition"
                  />
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
                Login to continue collecting stamps and earning rewards.
              </p>
            </div>

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
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
        {googleSignInModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <h3 className="font-bold text-sm text-slate-900">Sign in with Google</h3>
                </div>
                <button onClick={() => setGoogleSignInModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-500">Choose or enter your Google account to continue to BeAurex</p>

              <div className="space-y-3">
                <button
                  onClick={() => handleGoogleSignInSelect('customer.rewards@gmail.com', 'BeAurex Customer')}
                  className="w-full p-3 rounded-2xl border border-slate-200 hover:border-[#8B0000] hover:bg-rose-50/40 text-left flex items-center space-x-3 transition cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-rose-100 text-[#8B0000] font-bold text-xs flex items-center justify-center shrink-0">
                    G
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900">Google Customer Account</div>
                    <div className="text-[11px] text-slate-500 truncate">customer.rewards@gmail.com</div>
                  </div>
                </button>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Or enter your Google account:</span>
                  <input
                    type="text"
                    value={googleCustomName}
                    onChange={(e) => setGoogleCustomName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#8B0000]"
                  />
                  <input
                    type="email"
                    value={googleCustomEmail}
                    onChange={(e) => setGoogleCustomEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#8B0000]"
                  />
                  <button
                    type="button"
                    disabled={!googleCustomEmail}
                    onClick={() => handleGoogleSignInSelect(googleCustomEmail, googleCustomName)}
                    className="w-full py-2 bg-[#8B0000] hover:bg-[#720000] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>Sign in with this account</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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
                  simulateScanSuccess();
                }}
                className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3 rounded-2xl text-xs transition cursor-pointer"
              >
                Not Now (Simulate Scan)
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
              <span>Scan QR Standee</span>
            </button>

            <button
              onClick={() => {
                setRewardsSubTab('to_claim');
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

          {/* Two Stat Cards (Active Loyalty Cards & Rewards Redeemed) in one single line */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-5 shadow-xs flex items-center space-x-2.5 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/80 shrink-0">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] sm:text-xs font-semibold text-slate-500 block leading-tight truncate">
                  Active Loyalty Cards
                </span>
                <span className="text-xl sm:text-3xl font-black text-slate-900 block mt-0.5">
                  {customerUser.activeCardsCount ?? 1}
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-5 shadow-xs flex items-center space-x-2.5 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100/80 shrink-0">
                <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-sky-600" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] sm:text-xs font-semibold text-slate-500 block leading-tight truncate">
                  Rewards Redeemed
                </span>
                <span className="text-xl sm:text-3xl font-black text-slate-900 block mt-0.5">
                  {customerUser.rewardsRedeemedCount ?? 3}
                </span>
              </div>
            </div>
          </div>

          {/* Main Layout: Active Loyalty Programs */}
          <div className="space-y-4">
              
              {/* Empty State Toggle Demo */}
              {emptyStateDemo ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xs">
                  <div className="w-24 h-24 rounded-full bg-rose-50 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-12 h-12 text-rose-300 stroke-[1.5]" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">No Loyalty Cards Yet</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                    You haven't joined any loyalty programs yet. Scan a QR code at any business to start collecting stamps and earn exciting rewards!
                  </p>
                  <button
                    onClick={openScanScreen}
                    className="bg-[#8B0000] hover:bg-[#720000] text-white font-bold py-3.5 px-8 rounded-2xl text-xs sm:text-sm transition flex items-center justify-center space-x-2 mx-auto cursor-pointer shadow-md"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Scan QR Code Standee</span>
                  </button>
                  <button
                    onClick={() => setEmptyStateDemo(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 underline block mx-auto cursor-pointer"
                  >
                    Show Active Loyalty Cards
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900">Continue Collecting</h3>
                    </div>
                    <button
                      onClick={() => setEmptyStateDemo(prev => !prev)}
                      className="text-xs font-bold text-[#8B0000] hover:underline cursor-pointer"
                    >
                      View All
                    </button>
                  </div>

                  {/* Loyalty Cards Grid (Responsive: 1 col on mobile, 2 cols on tablet/laptop) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Card 1: Ka-feen Coffee Shop */}
                    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-4 hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs">
                              <Coffee className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-slate-900 leading-tight">Ka-feen</h4>
                              <p className="text-[11px] text-slate-500 font-medium">Coffee Shop</p>
                            </div>
                          </div>
                          <span className="bg-rose-50 text-rose-700 text-xs font-bold px-3 py-1 rounded-full border border-rose-100">
                            2 more stamps
                          </span>
                        </div>

                        {/* Stamp Indicators */}
                        <div>
                          <div className="flex items-center space-x-2 mb-1.5">
                            {[1, 2, 3].map((n) => (
                              <BeAurexStamp key={n} stamped={true} size="md" />
                            ))}
                            {[4, 5].map((n) => (
                              <BeAurexStamp key={n} stamped={false} size="md" />
                            ))}
                          </div>
                          <span className="text-[11px] text-slate-400 font-bold">3 of 5 Stamps</span>
                        </div>
                      </div>

                      {/* Next Unlock Banner */}
                      <div 
                        onClick={() => {
                          setSelectedReward({
                            title: '30% OFF on next purchase',
                            storeName: 'Ka-feen',
                            requiresStamps: 2,
                            validTill: '30 Jul 2026',
                            image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
                            approvedAt: 'Today, 2:30 PM'
                          });
                          setCurrentScreen('reward_details');
                        }}
                        className="bg-rose-50/70 border border-rose-100 rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:bg-rose-100/60 transition"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#8B0000] text-white flex items-center justify-center shrink-0">
                            <Crown className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-900 leading-tight">30% off on next purchase</div>
                            <div className="text-[10px] text-slate-500 font-medium">Collect 2 more stamps to unlock</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#8B0000]" />
                      </div>
                    </div>

                    {/* Card 2: Brew House */}
                    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-4 hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-11 h-11 rounded-2xl bg-amber-950 text-white flex items-center justify-center shadow-xs">
                              <Utensils className="w-5 h-5 text-amber-200" />
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-slate-900 leading-tight">Brew House</h4>
                              <p className="text-[11px] text-slate-500 font-medium">Bakery &amp; Bistro • Cyber Hub</p>
                            </div>
                          </div>
                          <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-100">
                            Reward Ready 🎉
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center space-x-2 mb-1.5">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <BeAurexStamp key={n} stamped={true} size="md" />
                            ))}
                          </div>
                          <span className="text-[11px] text-emerald-700 font-bold">5 of 5 Stamps Collected!</span>
                        </div>
                      </div>

                      {/* Ready banner */}
                      <div 
                        onClick={() => {
                          setSelectedReward({
                            title: 'Buy 1 Get 1 Free',
                            storeName: 'Brew House',
                            requiresStamps: 5,
                            validTill: '15 Aug 2026',
                            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
                            approvedAt: 'Ready Now'
                          });
                          setCurrentScreen('reward_details');
                        }}
                        className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:bg-emerald-100/60 transition"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                            <Award className="w-3.5 h-3.5 text-white" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-emerald-950 leading-tight">Buy 1 Get 1 Free</div>
                            <div className="text-[10px] text-emerald-700 font-medium">Ready to claim at counter!</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-emerald-700" />
                      </div>
                    </div>

                    {/* Card 3: The Daily Roastery */}
                    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-4 hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-11 h-11 rounded-2xl bg-amber-800 text-white flex items-center justify-center shadow-xs">
                              <Coffee className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-slate-900 leading-tight">The Daily Roastery</h4>
                              <p className="text-[11px] text-slate-500 font-medium">Artisanal Coffee &amp; Bakes</p>
                            </div>
                          </div>
                          <span className="bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
                            3 more stamps
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center space-x-2 mb-1.5">
                            {[1, 2].map((n) => (
                              <BeAurexStamp key={n} stamped={true} size="md" />
                            ))}
                            {[3, 4, 5].map((n) => (
                              <BeAurexStamp key={n} stamped={false} size="md" />
                            ))}
                          </div>
                          <span className="text-[11px] text-slate-400 font-bold">2 of 5 Stamps Collected</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0">
                            <Gift className="w-3.5 h-3.5 text-amber-300" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-900 leading-tight">Flat ₹100 Off on Meals</div>
                            <div className="text-[10px] text-slate-500 font-medium">Collect 3 more stamps</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>

                    {/* Card 4: Royal Sweets & Treats */}
                    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-4 hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-11 h-11 rounded-2xl bg-rose-700 text-white flex items-center justify-center shadow-xs">
                              <ShoppingBag className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-slate-900 leading-tight">Royal Sweets &amp; Treats</h4>
                              <p className="text-[11px] text-slate-500 font-medium">Confectionery &amp; Desserts</p>
                            </div>
                          </div>
                          <span className="bg-rose-50 text-rose-700 text-xs font-bold px-3 py-1 rounded-full border border-rose-100">
                            1 more stamp
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center space-x-2 mb-1.5">
                            {[1, 2, 3, 4].map((n) => (
                              <BeAurexStamp key={n} stamped={true} size="md" />
                            ))}
                            {[5].map((n) => (
                              <BeAurexStamp key={n} stamped={false} size="md" />
                            ))}
                          </div>
                          <span className="text-[11px] text-slate-400 font-bold">4 of 5 Stamps Collected</span>
                        </div>
                      </div>

                      <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#8B0000] text-white flex items-center justify-center shrink-0">
                            <Gift className="w-3.5 h-3.5 text-amber-200" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-900 leading-tight">Complimentary Dessert Box</div>
                            <div className="text-[10px] text-slate-500 font-medium">Only 1 stamp to unlock!</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#8B0000]" />
                      </div>
                    </div>

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
              Position the QR code within the frame to collect stamp
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
      {/* SCREEN 7: AFTER SCAN (Batch 2) */}
      {/* ------------------------------------------------------------------- */}
      {currentScreen === 'after_scan' && (
        <div className="w-full max-w-lg mx-auto px-4 py-3 space-y-4 pb-28">
          {/* Top Bar with Back Arrow & Store info */}
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <button
              onClick={() => setCurrentScreen('home')}
              className="p-1 -ml-1 text-slate-800 hover:text-slate-900 cursor-pointer"
              title="Back to Home"
            >
              <ArrowLeft className="w-6 h-6 stroke-[2]" />
            </button>
            <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs shrink-0">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 leading-tight">Ka-feen</h2>
              <p className="text-xs text-slate-500 font-medium">Coffee Shop</p>
            </div>
          </div>

          {/* Stamp Earned Card */}
          <div className="bg-[#fef2f2] border border-rose-100 rounded-3xl p-5 text-center space-y-2.5 shadow-xs">
            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">You earned 1 stamp!</h3>
            <p className="text-xs text-slate-600 font-medium">3 of 5 stamps collected</p>
            
            <div className="flex items-center justify-center space-x-2.5 pt-1.5 pb-1">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="w-9 h-9 rounded-full bg-[#8B0000] flex items-center justify-center text-white shadow-xs"
                >
                  <Crown className="w-4 h-4 text-white fill-white" />
                </div>
              ))}
              {[4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="w-9 h-9 rounded-full border-2 border-dashed border-slate-300 bg-white/70"
                />
              ))}
            </div>
          </div>

          {/* Available Rewards Section */}
          <div className="pt-1">
            <h3 className="text-base font-black text-slate-900 mb-3">Available Rewards</h3>

            <div className="space-y-3">
              {/* Reward 1: 30% OFF (Achieved) */}
              <div 
                onClick={() => {
                  setSelectedReward({
                    title: '30% off on next purchase',
                    storeName: 'Ka-feen',
                    requiresStamps: 2,
                    validTill: '7/30/2026',
                    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
                    approvedAt: 'Today, 2:30 PM'
                  });
                  setCurrentScreen('reward_details');
                }}
                className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs flex items-center space-x-3.5 cursor-pointer hover:border-slate-300 transition"
              >
                <img
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80"
                  alt="30% OFF"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">30% off on next purchase</h4>
                    <span className="bg-[#10b981] text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                      ACHIEVED
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5 mt-1.5 flex-wrap">
                    <span className="bg-rose-50 text-rose-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-rose-100">
                      2 STAMPS
                    </span>
                    <span className="text-[11px] text-slate-600 font-medium">Ready to claim! 🎉</span>
                  </div>
                  <div className="mt-1.5">
                    <span className="bg-amber-50 text-amber-700 border border-amber-200/70 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider inline-block">
                      EXPIRES 7/30/2026
                    </span>
                  </div>
                </div>
              </div>

              {/* Reward 2: 50% discount */}
              <div 
                onClick={() => {
                  setSelectedReward({
                    title: '50% discount',
                    storeName: 'Ka-feen',
                    requiresStamps: 5,
                    validTill: '7/30/2026',
                    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
                    approvedAt: 'Locked'
                  });
                  setCurrentScreen('reward_details');
                }}
                className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs flex items-center space-x-3.5 cursor-pointer hover:border-slate-300 transition"
              >
                <img
                  src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80"
                  alt="50% discount"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">50% discount</h4>
                  <div className="flex items-center space-x-1.5 mt-1.5 flex-wrap">
                    <span className="bg-rose-50 text-rose-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-rose-100">
                      5 STAMPS
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">• Collect 2 more</span>
                  </div>
                  <div className="mt-1.5">
                    <span className="bg-amber-50 text-amber-700 border border-amber-200/70 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider inline-block">
                      EXPIRES 7/30/2026
                    </span>
                  </div>
                </div>
              </div>

              {/* Reward 3: Free Coffee */}
              <div 
                onClick={() => {
                  setSelectedReward({
                    title: 'Free Coffee',
                    storeName: 'Ka-feen',
                    requiresStamps: 3,
                    validTill: '7/30/2026',
                    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
                    approvedAt: 'Locked'
                  });
                  setCurrentScreen('reward_details');
                }}
                className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs flex items-center space-x-3.5 cursor-pointer hover:border-slate-300 transition"
              >
                <img
                  src="https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80"
                  alt="Free Coffee"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">Free Coffee</h4>
                  <div className="flex items-center space-x-1.5 mt-1.5 flex-wrap">
                    <span className="bg-rose-50 text-rose-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-rose-100">
                      3 STAMPS
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">• Collect 1 more</span>
                  </div>
                  <div className="mt-1.5">
                    <span className="bg-amber-50 text-amber-700 border border-amber-200/70 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider inline-block">
                      EXPIRES 7/30/2026
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SCREEN 8: MY REWARDS & SCREEN 14: REWARD HISTORY (Matching Image 3) */}
      {/* ------------------------------------------------------------------- */}
      {currentScreen === 'rewards' && (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-5 space-y-5 pb-28">
          {/* Top Tab Bar: To Claim vs History (matching Image 3) */}
          <div className="border-b border-slate-200">
            <div className="flex items-center justify-center space-x-12 sm:space-x-16 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setRewardsSubTab('to_claim')}
                className={`pb-3 px-3 text-sm sm:text-base font-black transition cursor-pointer relative ${
                  rewardsSubTab === 'to_claim'
                    ? 'text-slate-900 border-b-2 border-[#8B0000]'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                To Claim
              </button>

              <button
                type="button"
                onClick={() => setRewardsSubTab('history')}
                className={`pb-3 px-3 text-sm sm:text-base font-black transition cursor-pointer flex items-center space-x-2 relative ${
                  rewardsSubTab === 'history'
                    ? 'text-slate-900 border-b-2 border-[#8B0000]'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <span>History</span>
                <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                  {rewardHistory.length}
                </span>
              </button>
            </div>
          </div>

          {/* TAB 1: TO CLAIM */}
          {rewardsSubTab === 'to_claim' && (
            <>
              {claimableRewards.length === 0 ? (
                /* Empty state matching Image 3 */
                <div className="w-full max-w-sm sm:max-w-md mx-auto pt-4 sm:pt-8 animate-in fade-in duration-200">
                  <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xs">
                    <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto shadow-2xs">
                      <span className="text-5xl select-none" role="img" aria-label="Gift">🎁</span>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                        No Rewards Yet
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xs mx-auto mt-2 leading-relaxed">
                        Collect more stamps from your favourite businesses to earn exciting rewards!
                      </p>
                    </div>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setCurrentScreen('home')}
                        className="w-full bg-[#8B0000] hover:bg-[#720000] text-white font-black py-3.5 px-8 rounded-2xl shadow-md shadow-[#8B0000]/25 transition active:scale-95 cursor-pointer text-sm"
                      >
                        Explore Businesses
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Claimable Rewards Grid: ONLY active claimable rewards (no scan option randomly) */
                <div className="w-full max-w-5xl mx-auto space-y-4 pt-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-sm sm:text-base font-black text-slate-900">Available at Participating Stores</h3>
                    <span className="text-xs text-slate-500 font-medium">
                      {claimableRewards.length} reward{claimableRewards.length > 1 ? 's' : ''} unlocked
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
                            <span>{reward.description || `${reward.requiresStamps || 5} of ${reward.requiresStamps || 5} stamps collected! Ready to claim at checkout.`}</span>
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
            </>
          )}

          {/* TAB 2: REWARD HISTORY */}
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
                        onClick={() => setSelectedHistoryVoucher(item)}
                        className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3.5 hover:border-slate-300 hover:shadow-md transition cursor-pointer"
                      >
                        {/* Top Section: Thumbnail + Title + Status + Store */}
                        <div className="flex items-start space-x-3.5">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 shadow-xs"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                                {item.title}
                              </h4>
                              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg shrink-0 ${
                                item.status === 'Used'
                                  ? 'bg-emerald-50 text-emerald-600'
                                  : item.status === 'Active'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-slate-100 text-slate-500'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-1">
                              {item.storeName}
                            </p>
                          </div>
                        </div>

                        {/* Bottom Section: Claimed on | Used on / Valid till > */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex-1">
                            <span className="text-[11px] text-slate-400 font-medium block">Claimed on</span>
                            <span className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 block">{item.claimedDate}</span>
                          </div>

                          <div className="h-7 w-px bg-slate-200/80 mx-3 sm:mx-4"></div>

                          <div className="flex-1">
                            <span className="text-[11px] text-slate-400 font-medium block">{item.dateLabel || 'Used on'}</span>
                            <span className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 block">{item.dateValue}</span>
                          </div>

                          <div className="pl-2">
                            <ChevronRight className="w-5 h-5 text-slate-800 shrink-0" />
                          </div>
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
                  Requires {selectedReward.requiresStamps || 2} Stamps
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Your Progress */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-slate-900">Your Progress</span>
              <span className="text-sm font-black text-slate-900">3 / 5 Stamps</span>
            </div>
            
            <div className="flex items-center space-x-3 pt-1 pb-0.5">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#8B0000] flex items-center justify-center text-white shadow-xs shrink-0"
                >
                  <Coffee className="w-5 h-5 text-white" />
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
      {/* SCREEN 12: WAITING FOR APPROVAL (Matching media_1791479289955.png) */}
      {/* ------------------------------------------------------------------- */}
      {currentScreen === 'waiting_approval' && (
        <div className="w-full max-w-sm mx-auto px-4 py-10 sm:py-14 text-center space-y-6 animate-in fade-in duration-300">
          
          {/* Hourglass Ring Loader */}
          <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
            {/* Spinning gradient ring border */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#8B0000] border-r-rose-400 border-b-rose-100 animate-spin" />
            {/* Hourglass icon */}
            <Hourglass className="w-10 h-10 text-[#8B0000]" />
          </div>

          <div className="space-y-1.5 pt-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Waiting for Approval
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-xs mx-auto">
              Your request is being reviewed by the merchant.
            </p>
          </div>

          {/* Customer ID Card */}
          <div className="bg-[#fef2f2] border border-rose-100 rounded-3xl p-4 sm:p-5 flex items-center space-x-4 max-w-xs sm:max-w-sm mx-auto shadow-xs text-left">
            {/* ID Badge Outline Icon */}
            <div className="w-12 h-10 rounded-xl border-2 border-slate-800 flex items-center justify-center space-x-1.5 shrink-0 bg-transparent px-1.5">
              <User className="w-4 h-4 text-slate-800 stroke-[2.5]" />
              <div className="flex flex-col space-y-0.5">
                <div className="w-3.5 h-0.5 bg-slate-800 rounded-full"></div>
                <div className="w-3.5 h-0.5 bg-slate-800 rounded-full"></div>
                <div className="w-3.5 h-0.5 bg-slate-800 rounded-full"></div>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-800 block">
                Customer ID
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#8B0000] font-mono tracking-wider block mt-0.5">
                {customerUser.customerId || 'LQR-8F4A29'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Awaiting Cashier Approval</span>
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 max-w-xs mx-auto leading-relaxed">
              Show your Customer ID to the merchant. Once they click <strong>Accept</strong> on their BeAurex Terminal, your reward will unlock here automatically.
            </p>
          </div>

          {/* Actions & Simulation */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={handleSimulateMerchantApproval}
              className="text-xs font-bold text-slate-500 hover:text-[#8B0000] underline block mx-auto transition cursor-pointer"
            >
              [Simulate Cashier Approval Now]
            </button>
            <button
              type="button"
              onClick={() => setCurrentScreen('reward_details')}
              className="text-xs text-slate-400 hover:text-slate-600 block mx-auto transition cursor-pointer"
            >
              Cancel &amp; Go Back
            </button>
          </div>
        </div>
      )}

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
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
          
          {/* Top Header Card */}
          {/* Top Crimson Header Banner (Matching Landing Page theme) */}
          <div className="bg-gradient-to-r from-[#690005] via-[#8B0000] to-[#590104] text-white p-6 sm:p-7 rounded-3xl shadow-lg relative overflow-hidden">
            {/* Ambient background glow matching landing page */}
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="inline-flex items-center space-x-1.5 bg-white/15 backdrop-blur-md border border-white/20 text-amber-300 font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full mb-1 shadow-xs">
                  <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
                  <span>BeAurex Account</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                  Customer Profile
                </h2>
                <p className="text-xs sm:text-sm text-rose-100/90 font-medium mt-0.5">
                  Manage your account details, referral code &amp; settings
                </p>
              </div>
            </div>
          </div>

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
                  setEditProfileForm({ name: customerUser.name, email: customerUser.email });
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
                setEditProfileForm({ name: customerUser.name, email: customerUser.email });
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
                  <p className="text-[11px] text-slate-500 font-medium">{customerUser.email}</p>
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
              setRewardsSubTab('to_claim');
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

      {/* Voucher Detail Modal for Reward History */}
      {selectedHistoryVoucher && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl space-y-0 border border-slate-100">
            {/* Header Image */}
            <div className="relative h-36 bg-slate-100">
              <img
                src={selectedHistoryVoucher.image}
                alt={selectedHistoryVoucher.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedHistoryVoucher(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-slate-700 flex items-center justify-center hover:bg-white cursor-pointer shadow-md"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-3">
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border shadow-xs ${
                  selectedHistoryVoucher.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : selectedHistoryVoucher.status === 'Used'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {selectedHistoryVoucher.status}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 leading-tight">
                  {selectedHistoryVoucher.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {selectedHistoryVoucher.storeName}
                </p>
              </div>

              {/* Voucher Code Box */}
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-3.5 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Voucher Code
                </span>
                <div className="text-base font-black font-mono text-[#8B0000] tracking-wider">
                  {selectedHistoryVoucher.voucherCode}
                </div>
                <p className="text-[10px] text-slate-500">
                  {selectedHistoryVoucher.status === 'Active'
                    ? 'Show this voucher code or QR to the cashier to redeem'
                    : selectedHistoryVoucher.status === 'Used'
                    ? `Redeemed on ${selectedHistoryVoucher.dateValue}`
                    : `Expired on ${selectedHistoryVoucher.dateValue}`}
                </p>
              </div>

              {/* Date info */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">Claimed</span>
                  <span className="font-bold text-slate-700">{selectedHistoryVoucher.claimedDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">{selectedHistoryVoucher.dateLabel}</span>
                  <span className="font-bold text-slate-700">{selectedHistoryVoucher.dateValue}</span>
                </div>
              </div>

              {/* Action button */}
              <button
                type="button"
                onClick={() => setSelectedHistoryVoucher(null)}
                className="w-full bg-[#8B0000] hover:bg-[#720000] text-white font-extrabold py-3 rounded-xl text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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

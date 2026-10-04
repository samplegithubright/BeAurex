import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Home, QrCode, Gift, Scan, Camera, Sparkles, CheckCircle2, Clock, 
  ArrowLeft, Store, Zap, Check, ChevronRight, Menu, X, LogOut, 
  Star, Copy, Flashlight, Coffee, Utensils, ShoppingBag, Award, 
  ShieldCheck, AlertCircle, Phone, Mail, Lock, Eye, EyeOff, 
  ArrowRight, User, Hourglass, CheckCheck, TrendingUp, Trophy, Users
} from 'lucide-react';

export default function CustomerExperience() {
  const { slug } = useParams();
  
  // Auth state: check if customer is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('beaurex_customer_auth') === 'true';
  });

  // Auth Mode: 'signin' or 'signup'
  const [customerAuthMode, setCustomerAuthMode] = useState('signin');

  // Login Form States (Phone + OTP & Email + Password)
  const [loginMethod, setLoginMethod] = useState('phone'); // 'phone' or 'email'
  const [mobileInput, setMobileInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(60);
  const [customerDevOtp, setCustomerDevOtp] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up Form States
  const [signupName, setSignupName] = useState('');
  const [signupMobile, setSignupMobile] = useState('');
  const [signupOtpSent, setSignupOtpSent] = useState(false);
  const [signupOtp, setSignupOtp] = useState('');
  const [signupCountdown, setSignupCountdown] = useState(60);
  const [signupDevOtp, setSignupDevOtp] = useState('');

  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Customer Profile State (backed by real MongoDB Customer record)
  const [customerUser, setCustomerUser] = useState(() => {
    const saved = sessionStorage.getItem('beaurex_customer_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: 'Customer',
      customerId: 'LQR-MEMBER',
      phone: '',
      email: '',
      tier: 'Bronze Member',
      activeCardsCount: 1,
      rewardsRedeemedCount: 0,
      points: 100,
      memberSince: 'Today'
    };
  });

  // Navigation & UI States: EXACTLY 3 MENUS ('dashboard', 'scan', 'reward')
  const [activeTab, setActiveTab] = useState('dashboard');
  const [rewardSubTab, setRewardSubTab] = useState('to_claim'); // 'to_claim' | 'history'
  const [historyFilter, setHistoryFilter] = useState('All'); // 'All' | 'Active' | 'Used' | 'Expired'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Scanner Simulator States
  const [isScanning, setIsScanning] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [manualCode, setManualCode] = useState('KAFEEN-01');
  const [scanResult, setScanResult] = useState(null); // null or { storeName, earnedStamps, currentStamps, totalStamps }

  // Claim Flow Modal State (Screens 10, 12, 13)
  const [claimModal, setClaimModal] = useState({
    isOpen: false,
    step: 1, // 1: Details (Screen 10), 2: Waiting for Approval (Screen 12), 3: Congratulations (Screen 13)
    reward: null
  });

  // Store Name from URL Slug or Default (Ka-feen Coffee Shop matching screenshots)
  const [storeName, setStoreName] = useState('Ka-feen Coffee Shop');
  const [storeOnlineStatus, setStoreOnlineStatus] = useState({
    isOnline: true,
    isExpired: false,
    message: ''
  });

  useEffect(() => {
    const targetSlug = slug || 'ka-feen';
    if (slug) {
      const formatted = slug
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      setStoreName(formatted);
      sessionStorage.setItem('loyalqr_biz', formatted);
    } else {
      const saved = sessionStorage.getItem('loyalqr_biz');
      if (saved) setStoreName(saved);
    }

    // Verify merchant store subscription & online status in MongoDB
    fetch(`/api/customer/store-status?slug=${encodeURIComponent(targetSlug)}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.success) {
          setStoreOnlineStatus({
            isOnline: data.isOnline,
            isExpired: data.isExpired,
            message: data.message || ''
          });
          if (data.storeName) {
            setStoreName(data.storeName);
            sessionStorage.setItem('loyalqr_biz', data.storeName);
          }
        }
      })
      .catch(() => {});
  }, [slug]);

  // Sync latest customer profile from MongoDB on mount
  useEffect(() => {
    if (isAuthenticated && customerUser?.phone) {
      const clean = customerUser.phone.replace(/[^0-9]/g, '').slice(-10);
      if (clean) {
        fetch(`/api/customer/profile?mobile=${clean}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.customer) {
              setCustomerUser(prev => ({ ...prev, ...data.customer }));
              sessionStorage.setItem('beaurex_customer_user', JSON.stringify(data.customer));
            }
          })
          .catch(() => {});
      }
    }
  }, [isAuthenticated]);

  // Countdown timer for Phone OTP
  useEffect(() => {
    let timer;
    if (otpSent && otpCountdown > 0) {
      timer = setInterval(() => setOtpCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, otpCountdown]);

  // Countdown timer for Sign Up OTP
  useEffect(() => {
    let timer;
    if (signupOtpSent && signupCountdown > 0) {
      timer = setInterval(() => setSignupCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [signupOtpSent, signupCountdown]);

  // Automatic cashier approval simulation in Step 2 after 3.5s
  useEffect(() => {
    let timer;
    if (claimModal.isOpen && claimModal.step === 2) {
      timer = setTimeout(() => {
        handleApproveClaim();
      }, 3500);
    }
    return () => clearTimeout(timer);
  }, [claimModal.isOpen, claimModal.step]);

  // Copy Customer ID helper
  const handleCopyCustomerId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(customerUser.customerId);
    }
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // =========================================================================
  // Sign Up Handlers (Registers directly into MongoDB Customer Collection)
  // =========================================================================
  const handleSignupSendOtp = async (e) => {
    e.preventDefault();
    if (!signupName.trim()) {
      setLoginError('Please enter your full name');
      return;
    }
    const clean = String(signupMobile).replace(/[^0-9]/g, '').slice(-10);
    if (!clean || clean.length !== 10) {
      setLoginError('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/customer/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: clean, isSignup: true, name: signupName.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setSignupOtpSent(true);
        setSignupCountdown(60);
        setSignupOtp(''); // NEVER auto-fill: wait for SMS!
        if (data.devOtp) setSignupDevOtp(data.devOtp);
      } else {
        setLoginError(data.message || 'Error requesting registration OTP.');
        if (data.alreadyRegistered) {
          setTimeout(() => {
            setCustomerAuthMode('signin');
            setMobileInput(clean);
          }, 1800);
        }
      }
    } catch (err) {
      setLoginError('Unable to connect to BeAurex API: ' + err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignupVerifyOtp = async (e) => {
    e.preventDefault();
    if (!signupOtp || signupOtp.trim().length !== 6) {
      setLoginError('Please enter the 6-digit verification code sent to your mobile phone.');
      return;
    }
    const clean = String(signupMobile).replace(/[^0-9]/g, '').slice(-10);
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/customer/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName.trim(),
          mobile: clean,
          otp: signupOtp.trim()
        })
      });
      const data = await res.json();
      if (data.success && data.customer) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        completeLogin(data.customer);
      } else {
        setLoginError(data.message || 'OTP verification failed. Please try again.');
      }
    } catch (err) {
      setLoginError('Error registering customer: ' + err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  // =========================================================================
  // Sign In Handlers (Requires prior signup in MongoDB)
  // =========================================================================
  const handleSendOtp = async (e) => {
    e.preventDefault();
    const clean = String(mobileInput).replace(/[^0-9]/g, '').slice(-10);
    if (!clean || clean.length !== 10) {
      setLoginError('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/customer/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: clean, isSignup: false })
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setOtpCountdown(60);
        setOtpInput(''); // NEVER auto-fill: wait for SMS!
        if (data.devOtp) setCustomerDevOtp(data.devOtp);
      } else {
        setLoginError(data.message || 'Unable to send OTP.');
        if (data.notRegistered) {
          // STRICT: Redirect user to Sign Up!
          setTimeout(() => {
            setCustomerAuthMode('signup');
            setSignupMobile(clean);
          }, 1800);
        }
      }
    } catch (err) {
      setLoginError('Connection error: ' + err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpInput || otpInput.trim().length !== 6) {
      setLoginError('Please enter the 6-digit OTP code received on your phone.');
      return;
    }
    const clean = String(mobileInput).replace(/[^0-9]/g, '').slice(-10);
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/customer/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: clean, otp: otpInput.trim() })
      });
      const data = await res.json();
      if (data.success && data.customer) {
        completeLogin(data.customer);
      } else {
        setLoginError(data.message || 'Invalid or expired OTP code.');
      }
    } catch (err) {
      setLoginError('Verification server error: ' + err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setLoginError('Email login is currently for merchants. Please use Phone Number & SMS OTP to access Customer Rewards.');
  };

  const completeLogin = (user) => {
    sessionStorage.setItem('beaurex_customer_auth', 'true');
    sessionStorage.setItem('beaurex_customer_user', JSON.stringify(user));
    setCustomerUser(user);
    setIsAuthenticated(true);
    setLoginError('');
    setActiveTab('dashboard');
  };

  // Customer Logout: Clears auth and returns to Home Page
  const handleCustomerLogout = () => {
    sessionStorage.removeItem('beaurex_customer_auth');
    sessionStorage.removeItem('beaurex_customer_user');
    window.location.href = '/';
  };

  // Continue Collecting Loyalty Cards Data (Matching Screen 5)
  const [loyaltyCards, setLoyaltyCards] = useState([
    {
      id: 'ka-feen',
      storeName: 'Ka-feen Coffee Shop',
      category: 'Coffee & Cafe',
      stampsCollected: 3,
      totalStamps: 5,
      currentReward: '30% off on next purchase',
      unlockedAt: 3,
      isUnlocked: true,
      nextMilestoneNote: '2 more stamps to unlock next reward',
      icon: Coffee,
      iconBg: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'waffle-co',
      storeName: 'The Belgian Waffle Co.',
      category: 'Desserts & Waffles',
      stampsCollected: 4,
      totalStamps: 6,
      currentReward: 'Free Waffle on 6th stamp',
      unlockedAt: 6,
      isUnlocked: false,
      nextMilestoneNote: '2 more stamps to unlock',
      icon: Utensils,
      iconBg: 'bg-rose-100 text-rose-800'
    },
    {
      id: 'burger-club',
      storeName: 'Burger Club',
      category: 'Fast Casual',
      stampsCollected: 2,
      totalStamps: 4,
      currentReward: 'Free Loaded Fries',
      unlockedAt: 4,
      isUnlocked: false,
      nextMilestoneNote: '2 more stamps to unlock',
      icon: ShoppingBag,
      iconBg: 'bg-orange-100 text-orange-800'
    },
    {
      id: 'chai-point',
      storeName: 'Chai Point',
      category: 'Tea & Snacks',
      stampsCollected: 5,
      totalStamps: 5,
      currentReward: '1 Free Masala Chai',
      unlockedAt: 5,
      isUnlocked: true,
      nextMilestoneNote: 'Milestone complete! Claim reward now.',
      icon: Sparkles,
      iconBg: 'bg-emerald-100 text-emerald-800'
    }
  ]);

  // "To Claim" Rewards Data (Matching Screen 8)
  const [toClaimRewards, setToClaimRewards] = useState([
    {
      id: 'tc-1',
      title: '30% off on next purchase',
      storeName: 'Ka-feen Coffee Shop',
      stampsCollected: 3,
      totalStamps: 5,
      validTill: '28 Feb 2026',
      statusNote: 'Ready to claim! 🎉',
      isReady: true
    },
    {
      id: 'tc-2',
      title: '1 Free Masala Chai',
      storeName: 'Chai Point',
      stampsCollected: 5,
      totalStamps: 5,
      validTill: '15 Mar 2026',
      statusNote: 'Ready to claim! 🎉',
      isReady: true
    },
    {
      id: 'tc-3',
      title: 'Free Loaded Fries',
      storeName: 'Burger Club',
      stampsCollected: 2,
      totalStamps: 4,
      validTill: '10 Mar 2026',
      statusNote: 'Collect 2 more stamps to unlock',
      isReady: false
    }
  ]);

  // Rewards History Data (Matching Screen 14)
  const [rewardHistory, setRewardHistory] = useState([
    {
      id: 'rh-1',
      title: '30% off on next purchase',
      storeName: 'Ka-feen Coffee Shop',
      status: 'Used', // 'Used', 'Active', 'Expired'
      claimedOn: '24 Jan 2026, 04:30 PM',
      usedOn: '24 Jan 2026, 05:15 PM',
      expiryDate: '28 Feb 2026'
    },
    {
      id: 'rh-2',
      title: 'Free Espresso Shot',
      storeName: 'Ka-feen Coffee Shop',
      status: 'Expired',
      claimedOn: '10 Jan 2026, 11:20 AM',
      usedOn: null,
      expiryDate: '15 Jan 2026'
    },
    {
      id: 'rh-3',
      title: '10% OFF on Dine-in',
      storeName: 'The Belgian Waffle Co.',
      status: 'Active',
      claimedOn: '01 Feb 2026, 02:15 PM',
      usedOn: null,
      expiryDate: '28 Feb 2026'
    }
  ]);

  // QR Scanner Simulator Handlers (Persists to MongoDB Scan collection and awards customer stamps)
  const handleSimulateScan = async () => {
    if (!storeOnlineStatus.isOnline) {
      alert(`Cannot scan QR: ${storeName}'s subscription has expired. Stamping will resume as soon as the store owner renews their BeAurex subscription.`);
      return;
    }
    setIsScanning(true);
    const clean = customerUser?.phone ? customerUser.phone.replace(/[^0-9]/g, '').slice(-10) : '';

    try {
      const res = await fetch('/api/customer/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: clean,
          storeSlug: slug || 'ka-feen',
          storeName: storeName || 'Ka-feen Coffee Shop'
        })
      });
      const data = await res.json();
      setIsScanning(false);

      if (data.success) {
        setScanResult({
          storeName: storeName || 'Ka-feen Coffee Shop',
          earnedStamps: data.earnedStamps || 1,
          currentStamps: data.currentStamps || 1,
          totalStamps: data.totalStamps || 5
        });
        if (data.points) {
          setCustomerUser(prev => ({
            ...prev,
            points: data.points,
            stamps: (prev.stamps || 0) + 1
          }));
        }
        confetti({ particleCount: 65, spread: 60, origin: { y: 0.5 } });
      } else {
        alert(data.message || 'QR Scan failed: Store may be offline.');
      }
    } catch (err) {
      setIsScanning(false);
      alert('Scanning error: ' + err.message);
    }
  };

  const handleManualCodeSubmit = async (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    await handleSimulateScan();
  };

  // Claim Modal Handlers (Screens 10, 12, 13)
  const openClaimFlow = (reward) => {
    setClaimModal({
      isOpen: true,
      step: 1,
      reward: reward || {
        title: '30% off on next purchase',
        storeName: 'Ka-feen Coffee Shop',
        stampsCollected: 3,
        totalStamps: 5,
        validTill: '28 Feb 2026'
      }
    });
  };

  const handleProceedToWaiting = () => {
    setClaimModal(prev => ({ ...prev, step: 2 }));
  };

  const handleApproveClaim = async () => {
    if (!storeOnlineStatus.isOnline) {
      alert(`Cannot claim reward: ${storeName}'s subscription has expired. Reward redemptions are paused until the store renews.`);
      return;
    }
    const clean = customerUser?.phone ? customerUser.phone.replace(/[^0-9]/g, '').slice(-10) : '';
    try {
      const res = await fetch('/api/customer/reward/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: clean,
          storeSlug: slug || 'ka-feen',
          rewardTitle: claimModal.reward ? claimModal.reward.title : '30% off on next purchase'
        })
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message || 'Unable to claim reward. Store may be offline.');
        return;
      }
    } catch (_) {}

    confetti({
      particleCount: 85,
      spread: 70,
      origin: { y: 0.6 }
    });
    setClaimModal(prev => ({ ...prev, step: 3 }));
  };

  const handleFinishClaim = () => {
    if (claimModal.reward) {
      const newHistoryItem = {
        id: `rh-${Date.now()}`,
        title: claimModal.reward.title,
        storeName: claimModal.reward.storeName,
        status: 'Active',
        claimedOn: 'Today, Just Now',
        usedOn: null,
        expiryDate: claimModal.reward.validTill || '28 Feb 2026'
      };
      setRewardHistory(prev => [newHistoryItem, ...prev]);
      setCustomerUser(prev => ({
        ...prev,
        rewardsRedeemedCount: prev.rewardsRedeemedCount + 1
      }));
    }
    setClaimModal({ isOpen: false, step: 1, reward: null });
    setActiveTab('reward');
    setRewardSubTab('history');
  };

  // EXACTLY 3 MENUS FOR CUSTOMER NAVIGATION
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'scan', label: 'Scan', icon: QrCode },
    { id: 'reward', label: 'Rewards', icon: Gift },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning,';
    if (hour < 17) return 'Good Afternoon,';
    return 'Good Evening,';
  };

  // =========================================================================
  // VIEW 1: DEDICATED CUSTOMER LOGIN (Shown when !isAuthenticated)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-between selection:bg-red-500 selection:text-white">
        
        {/* Top Navbar */}
        <header className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5">
            <img 
              src="/beaurex-icon.jpg" 
              alt="BeAurex" 
              className="w-9 h-9 rounded-xl object-cover shadow-sm border border-white/20"
            />
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight leading-none text-white">
                Be<span className="text-[#851421]">Aurex</span>
              </span>
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider mt-0.5">
                Customer Rewards Portal
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="text-xs font-bold text-slate-300 hover:text-white flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
        </header>

        {/* Center Login Container */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            
            {/* BeAurex Red Landing Page Header */}
            <div className="bg-gradient-to-r from-[#6b0f1a] via-[#851421] to-[#5c0d16] p-6 sm:p-8 text-white relative">
              <div className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
                <Gift className="w-5 h-5 text-amber-300" />
              </div>
              <span className="inline-flex items-center space-x-1 bg-white/20 backdrop-blur-xs text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full mb-2 border border-white/20">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Loyalty & Counter Stamps</span>
              </span>
              <h2 className="text-2xl font-black tracking-tight">
                {customerAuthMode === 'signin' ? 'Customer Rewards Login' : 'Join Customer Rewards Club'}
              </h2>
              <p className="text-xs text-red-100 font-medium mt-1 leading-relaxed">
                {customerAuthMode === 'signin' 
                  ? 'Access your digital stamps, unlocked rewards, and counter vouchers.'
                  : 'Register in seconds to collect stamps and unlock instant in-store rewards!'}
              </p>
            </div>

            {/* Auth Mode Toggle */}
            <div className="p-6 sm:p-8">
              <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
                <button
                  type="button"
                  onClick={() => { setCustomerAuthMode('signin'); setLoginError(''); }}
                  className={`flex-1 py-2 text-xs font-black rounded-lg transition cursor-pointer ${
                    customerAuthMode === 'signin'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setCustomerAuthMode('signup'); setLoginError(''); }}
                  className={`flex-1 py-2 text-xs font-black rounded-lg transition cursor-pointer ${
                    customerAuthMode === 'signup'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Join Free (Sign Up)
                </button>
              </div>

              {loginError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* SIGN IN */}
              {customerAuthMode === 'signin' && (
                <div>
                  <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
                    <button
                      type="button"
                      onClick={() => { setLoginMethod('phone'); setLoginError(''); }}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                        loginMethod === 'phone'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Phone OTP</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setLoginMethod('email'); setLoginError(''); }}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                        loginMethod === 'email'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Password</span>
                    </button>
                  </div>

                  {loginMethod === 'phone' && (
                    <div>
                      {!otpSent ? (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                              Mobile Number
                            </label>
                            <div className="flex">
                              <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-700 text-xs font-bold">
                                +91
                              </span>
                              <input
                                type="tel"
                                required
                                pattern="[6-9][0-9]{9}"
                                value={mobileInput}
                                onChange={(e) => setMobileInput(e.target.value)}
                                placeholder="10-digit mobile number"
                                className="w-full bg-slate-50 border border-slate-200 rounded-r-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#74111d] focus:bg-white text-slate-900 font-bold transition"
                              />
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1">
                              We'll send a 6-digit one-time password to verify your account.
                            </p>
                          </div>

                          <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-[#74111d]/25 transition transform hover:-translate-y-0.5 cursor-pointer text-sm flex items-center justify-center space-x-2"
                          >
                            <span>{loginLoading ? 'Sending OTP...' : 'Get Instant OTP'}</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </form>
                      ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                          <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl flex items-center justify-between text-xs">
                            <div>
                              <span className="text-slate-600 block">OTP Sent to:</span>
                              <span className="font-extrabold text-slate-900">+91 {mobileInput}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setOtpSent(false)}
                              className="text-red-600 font-bold hover:underline cursor-pointer text-xs"
                            >
                              Change Number
                            </button>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="block text-xs font-bold uppercase text-slate-600">
                                Enter 6-Digit OTP Received on Phone
                              </label>
                              {customerDevOtp && (
                                <span className="text-[11px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
                                  Dev Terminal Code: {customerDevOtp}
                                </span>
                              )}
                            </div>
                            <input
                              type="text"
                              required
                              maxLength={6}
                              value={otpInput}
                              onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                              placeholder="••••••"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-center text-lg font-mono font-black tracking-widest text-slate-900 focus:outline-none focus:border-[#74111d] focus:bg-white transition"
                            />
                          </div>

                          <div className="flex items-center justify-between text-xs text-slate-500">
                            {otpCountdown > 0 ? (
                              <span>Resend OTP in <strong className="text-slate-900">{otpCountdown}s</strong></span>
                            ) : (
                              <button
                                type="button"
                                onClick={handleSendOtp}
                                className="text-red-600 font-bold hover:underline cursor-pointer"
                              >
                                Resend Code Now
                              </button>
                            )}
                            <span className="text-slate-400">Valid for 5 mins</span>
                          </div>

                          <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-[#74111d]/25 transition transform hover:-translate-y-0.5 cursor-pointer text-sm flex items-center justify-center space-x-2"
                          >
                            <span>{loginLoading ? 'Verifying OTP...' : 'Verify & Enter Dashboard'}</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {loginMethod === 'email' && (
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                          Email Address
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Mail className="w-4 h-4" />
                          </span>
                          <input
                            type="email"
                            required
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            placeholder="e.g. ajeet.kumar@gmail.com"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:border-[#74111d] focus:bg-white text-slate-900 font-medium transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                          Password
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Lock className="w-4 h-4" />
                          </span>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            placeholder="Enter password"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-[#74111d] focus:bg-white text-slate-900 font-medium transition"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4 text-red-600" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loginLoading}
                        className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-[#74111d]/25 transition transform hover:-translate-y-0.5 cursor-pointer text-sm flex items-center justify-center space-x-2"
                      >
                        <span>{loginLoading ? 'Signing In...' : 'Sign In with Password'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  )}

                  <div className="text-center text-xs text-slate-500 pt-4 mt-4 border-t border-slate-100">
                    New to BeAurex Rewards?{' '}
                    <button
                      type="button"
                      onClick={() => { setCustomerAuthMode('signup'); setLoginError(''); }}
                      className="text-red-600 font-extrabold hover:underline cursor-pointer"
                    >
                      Join Free & Collect Stamps
                    </button>
                  </div>
                </div>
              )}

              {/* SIGN UP */}
              {customerAuthMode === 'signup' && (
                <div>
                  {!signupOtpSent ? (
                    <form onSubmit={handleSignupSendOtp} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          placeholder="e.g. Ajeet Kumar"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#74111d] focus:bg-white text-slate-900 font-bold transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                          Mobile Number
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-700 text-xs font-bold">
                            +91
                          </span>
                          <input
                            type="tel"
                            required
                            pattern="[6-9][0-9]{9}"
                            value={signupMobile}
                            onChange={(e) => setSignupMobile(e.target.value)}
                            placeholder="10-digit mobile number"
                            className="w-full bg-slate-50 border border-slate-200 rounded-r-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#74111d] focus:bg-white text-slate-900 font-bold transition"
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center space-x-2 text-xs text-amber-900 font-bold">
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Instant Gold Member status awarded on registration!</span>
                      </div>

                      <button
                        type="submit"
                        disabled={loginLoading}
                        className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-[#74111d]/25 transition transform hover:-translate-y-0.5 cursor-pointer text-sm flex items-center justify-center space-x-2"
                      >
                        <span>{loginLoading ? 'Sending OTP...' : 'Get OTP & Join Rewards Club'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleSignupVerifyOtp} className="space-y-4">
                      <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <span className="text-slate-600 block">OTP Sent to:</span>
                          <span className="font-extrabold text-slate-900">+91 {signupMobile}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSignupOtpSent(false)}
                          className="text-red-600 font-bold hover:underline cursor-pointer text-xs"
                        >
                          Change Number
                        </button>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold uppercase text-slate-600">
                            Enter 6-Digit OTP Received on Phone
                          </label>
                          {signupDevOtp && (
                            <span className="text-[11px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
                              Dev Terminal Code: {signupDevOtp}
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={signupOtp}
                          onChange={(e) => setSignupOtp(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="••••••"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-center text-lg font-mono font-black tracking-widest text-slate-900 focus:outline-none focus:border-[#74111d] focus:bg-white transition"
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500">
                        {signupCountdown > 0 ? (
                          <span>Resend OTP in <strong className="text-slate-900">{signupCountdown}s</strong></span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSignupSendOtp}
                            className="text-red-600 font-bold hover:underline cursor-pointer"
                          >
                            Resend Code Now
                          </button>
                        )}
                        <span className="text-slate-400">Valid for 5 mins</span>
                      </div>

                      <button
                        type="submit"
                        disabled={loginLoading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-emerald-600/25 transition transform hover:-translate-y-0.5 cursor-pointer text-sm flex items-center justify-center space-x-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>{loginLoading ? 'Verifying OTP...' : 'Verify OTP & Activate Membership'}</span>
                      </button>
                    </form>
                  )}

                  <div className="text-center text-xs text-slate-500 pt-4 mt-4 border-t border-slate-100">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setCustomerAuthMode('signin'); setLoginError(''); }}
                      className="text-red-600 font-extrabold hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              )}

            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
              Protected by BeAurex Privacy Protocol • No App Download Required
            </div>

          </div>
        </div>

        <footer className="py-4 text-center text-xs text-slate-500">
          © 2026 BeAurex Loyalty Network • Connecting Shoppers & Local Retailers
        </footer>

      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED CUSTOMER DASHBOARD (MERCHANT THEME & 3 MENUS)
  // =========================================================================
  return (
    <div className="h-screen w-full bg-slate-50 text-slate-900 font-sans antialiased flex flex-col md:flex-row overflow-hidden selection:bg-red-500 selection:text-white">
      
      {/* ========================================================= */}
      {/* MOBILE TOPBAR (WITH PROFILE & LOGOUT IN NAVBAR) */}
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
              Customer Hub
            </span>
          </div>
        </Link>

        {/* Navbar Action Buttons */}
        <div className="flex items-center space-x-1.5">
          {/* Customer ID Badge */}
          <span className="text-[10px] font-mono font-black text-slate-700 bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg">
            {customerUser.customerId}
          </span>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-red-600" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer (Only the 3 menus + Profile & Logout in drawer footer) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

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
                    <span className="font-black text-slate-900 text-sm">Customer App</span>
                    <span className="text-[9px] font-bold text-red-600 uppercase">BeAurex Loyalty</span>
                  </div>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 border border-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Profile Card in Drawer */}
              <div 
                onClick={() => { setProfileModalOpen(true); setMobileMenuOpen(false); }}
                className="p-4 bg-slate-50 border-b border-slate-100 flex items-center space-x-3 cursor-pointer hover:bg-slate-100 transition"
              >
                <div className="w-10 h-10 rounded-full bg-red-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                  {customerUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-black text-slate-900 truncate">{customerUser.name}</h3>
                  <p className="text-[10px] text-amber-700 font-bold">{customerUser.tier}</p>
                  <p className="text-[10px] font-mono text-slate-500">{customerUser.customerId}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              {/* 3 Navigation Items */}
              <div className="p-3 space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Navigation
                </div>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (item.id === 'scan') setScanResult(null);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                        isActive
                          ? 'bg-red-600 text-white shadow-md shadow-[#74111d]/25'
                          : 'text-slate-600 hover:bg-rose-50 hover:text-[#74111d]'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                        <span className="text-sm">{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Drawer Footer: BOTH Profile & Logout Buttons */}
            <div className="p-4 border-t border-slate-200/90 bg-slate-50/50 space-y-2">
              <button
                onClick={() => { setProfileModalOpen(true); setMobileMenuOpen(false); }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 border border-slate-200 cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>My Profile</span>
              </button>

              <button
                onClick={handleCustomerLogout}
                className="w-full bg-white hover:bg-rose-50 text-[#74111d] border border-red-200 hover:border-red-300 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DESKTOP SIDEBAR NAVIGATION (Fixed Position: 3 Menus + Profile + Logout) */}
      {/* ========================================================= */}
      <aside className="hidden md:flex md:w-72 bg-white border-r border-slate-200/90 flex-col justify-between shrink-0 shadow-sm z-30 fixed inset-y-0 left-0 h-screen">
        <div className="flex-1 overflow-y-auto">
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-100">
            <Link to="/" className="flex items-center space-x-3 group">
              <img 
                src="/beaurex-icon.jpg" 
                alt="BeAurex Logo" 
                className="w-9 h-9 rounded-xl object-cover shadow-md shadow-[#74111d]/25 group-hover:scale-105 transition transform"
              />
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight leading-none text-slate-900">
                  Be<span className="text-[#851421]">Aurex</span>
                </span>
                <span className="text-[10px] font-black text-red-600 uppercase tracking-widest mt-1">
                  Customer Rewards
                </span>
              </div>
            </Link>
          </div>

          {/* Connected Store Bar */}
          <div className="p-4 bg-slate-50/80 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Coffee className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-black text-slate-900 truncate">{storeName}</h3>
                <p className="text-[10px] text-emerald-600 font-bold flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
                  Connected Counter
                </p>
              </div>
            </div>
          </div>

          {/* Customer Mini Card (Opens Profile Modal) */}
          <div 
            onClick={() => setProfileModalOpen(true)}
            className="p-4 border-b border-slate-100 flex items-center justify-between bg-white hover:bg-slate-50 cursor-pointer transition"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-600 to-rose-700 text-white font-black text-xs flex items-center justify-center shadow-xs">
                {customerUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 truncate">{customerUser.name}</span>
                <span className="text-[10px] font-mono text-slate-500">{customerUser.customerId}</span>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
              Gold
            </span>
          </div>

          {/* Strictly 3 Navigation Items */}
          <div className="p-4 space-y-1.5">
            <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Customer Menu
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.id === 'scan') setScanResult(null);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md shadow-[#74111d]/25'
                      : 'text-slate-600 hover:bg-rose-50 hover:text-[#74111d]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop Sidebar Footer: BOTH Profile & Logout Buttons */}
        <div className="p-4 border-t border-slate-200/90 bg-slate-50/50 space-y-2 shrink-0">
          <button
            onClick={() => setProfileModalOpen(true)}
            className="w-full bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold py-2 rounded-xl transition flex items-center justify-center space-x-1.5 border border-slate-200 shadow-xs cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span>My Profile</span>
          </button>
          
          <button
            onClick={handleCustomerLogout}
            className="w-full bg-white hover:bg-rose-50 text-[#74111d] border border-red-200 hover:border-red-300 text-xs font-bold py-2 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN CONTENT AREA (Only right side scrolls) */}
      {/* ========================================================= */}
      <div className="flex-1 md:ml-72 flex flex-col min-w-0 h-screen pb-24 md:pb-6 overflow-y-auto">
        
        {/* ========================================================= */}
        {/* TOP BRAND HEADER (BeAurex Landing Page Red Theme with Metrics) */}
        {/* ========================================================= */}
        <header className="bg-gradient-to-r from-[#6b0f1a] via-[#851421] to-[#5c0d16] text-white shadow-md relative z-20">
          
          {/* Sub-bar / Connected Counter Stripe */}
          <div className="bg-black/25 px-4 sm:px-8 py-2 flex items-center justify-between text-xs font-medium border-b border-white/10 backdrop-blur-xs">
            <div className="flex items-center space-x-2">
              <Store className="w-3.5 h-3.5 text-amber-300" />
              <span>Connected Store: <strong className="font-black text-white">{storeName}</strong></span>
            </div>
            <div className="flex items-center space-x-3 text-[11px]">
              <span className="text-red-100">ID: <strong className="text-amber-300 font-mono">{customerUser.customerId}</strong></span>
              <span className="bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full text-[10px] shadow-xs">
                {customerUser.tier}
              </span>
            </div>
          </div>

          {/* Store Offline Alert Bar */}
          {!storeOnlineStatus.isOnline && (
            <div className="bg-red-950/95 border-b border-red-700/60 px-4 sm:px-8 py-2.5 flex items-center justify-between text-xs font-bold text-amber-200">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
                <span>
                  Store Loyalty Paused: {storeName}'s subscription has expired. QR scanning and stamp rewards are temporarily offline.
                </span>
              </div>
              <span className="bg-red-800 text-white text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                Store Offline
              </span>
            </div>
          )}

          {/* Context & Actions Bar */}
          <div className="px-6 sm:px-8 py-5 flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-full bg-white text-[#74111d] font-black text-lg flex items-center justify-center shadow-lg shrink-0 border border-white/50">
                {storeName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight capitalize">
                  {storeName}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="bg-white text-emerald-800 font-extrabold px-3 py-0.5 rounded-full text-xs shadow-xs">
                    Active Member
                  </span>
                  <span className="bg-white/15 text-white border border-white/30 px-3 py-0.5 rounded-full text-xs font-bold backdrop-blur-xs">
                    {customerUser.tier}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2.5">
              <button
                onClick={() => { setActiveTab('scan'); setScanResult(null); }}
                className="bg-white/15 hover:bg-white/25 text-white text-xs font-bold px-3 py-2 rounded-xl transition flex items-center space-x-1.5 cursor-pointer backdrop-blur-xs border border-white/20"
              >
                <QrCode className="w-3.5 h-3.5 text-amber-300" />
                <span>Quick Scan</span>
              </button>
            </div>
          </div>

          {/* 4 Metric Boxes (Merchant Dashboard Style Summary) */}
          <div className="px-6 sm:px-8 pb-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 pt-1">
              
              {/* ACTIVE CARDS */}
              <div className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl p-3 text-center backdrop-blur-xs flex flex-col items-center justify-center transition">
                <Store className="w-4 h-4 text-white/80 mb-1" />
                <span className="text-xl sm:text-2xl font-black text-white leading-tight">{customerUser.activeCardsCount}</span>
                <span className="text-[10px] uppercase font-bold text-white/80 tracking-wider">Loyalty Cards</span>
              </div>

              {/* REWARDS REDEEMED */}
              <div className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl p-3 text-center backdrop-blur-xs flex flex-col items-center justify-center transition">
                <Gift className="w-4 h-4 text-white/80 mb-1" />
                <span className="text-xl sm:text-2xl font-black text-white leading-tight">{customerUser.rewardsRedeemedCount}</span>
                <span className="text-[10px] uppercase font-bold text-white/80 tracking-wider">Rewards Claimed</span>
              </div>

              {/* LOYALTY POINTS */}
              <div className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl p-3 text-center backdrop-blur-xs flex flex-col items-center justify-center transition">
                <Star className="w-4 h-4 text-amber-300 mb-1" />
                <span className="text-xl sm:text-2xl font-black text-amber-300 leading-tight">{customerUser.points}</span>
                <span className="text-[10px] uppercase font-bold text-white/80 tracking-wider">Points Balance</span>
              </div>

              {/* MEMBERSHIP TIER */}
              <div className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl p-3 text-center backdrop-blur-xs flex flex-col items-center justify-center transition">
                <Award className="w-4 h-4 text-white/80 mb-1" />
                <span className="text-base sm:text-lg font-black text-white leading-tight truncate max-w-full">{customerUser.tier}</span>
                <span className="text-[10px] uppercase font-bold text-white/80 tracking-wider">Tier Status</span>
              </div>

            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">

          {/* ========================================================= */}
          {/* TAB 1: HOME / DASHBOARD (MATCHING SCREEN 5) */}
          {/* ========================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Crimson Greeting Card (Exact match Screen 5 with Merchant Theme) */}
              <div className="bg-gradient-to-r from-[#8B0000] via-[#991b1b] to-[#7f1d1d] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-red-900/30">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs text-red-200 font-medium block">
                      {getGreeting()}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mt-0.5">
                      {customerUser.name}
                    </h2>
                    
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="bg-white/20 backdrop-blur-xs text-white text-xs font-mono font-bold px-3 py-1 rounded-full border border-white/20 flex items-center space-x-1">
                        <span>Customer ID:</span>
                        <strong className="tracking-wide text-amber-200">{customerUser.customerId}</strong>
                      </span>
                      <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-2.5 py-1 rounded-full flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-slate-950" />
                        <span>{customerUser.tier}</span>
                      </span>
                    </div>
                  </div>

                  {/* Profile Avatar click trigger */}
                  <button
                    onClick={() => setProfileModalOpen(true)}
                    className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/40 flex items-center justify-center text-white font-black text-sm shadow-md transition transform hover:scale-105 cursor-pointer shrink-0"
                    title="View Profile Details"
                  >
                    {customerUser.name.split(' ').map(n => n[0]).join('')}
                  </button>
                </div>
              </div>

              {/* 2 Metric Cards (Active Loyalty Cards & Rewards Redeemed) */}
              <div className="grid grid-cols-2 gap-4">
                
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Active Loyalty Cards
                    </span>
                    <div className="text-3xl font-black text-slate-900">
                      {customerUser.activeCardsCount}
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                    <Store className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Rewards Redeemed
                    </span>
                    <div className="text-3xl font-black text-slate-900">
                      {customerUser.rewardsRedeemedCount}
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                    <Gift className="w-5 h-5" />
                  </div>
                </div>

              </div>

              {/* "Continue Collecting" Section Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Continue Collecting
                  </h3>
                  <span className="text-xs font-bold text-slate-500">
                    {loyaltyCards.length} Cards in Progress
                  </span>
                </div>

                {/* Loyalty Cards List with Stamp Circles (Matching Screen 5) */}
                <div className="space-y-4">
                  {loyaltyCards.map((card) => {
                    const IconComponent = card.icon;
                    return (
                      <div 
                        key={card.id} 
                        className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs hover:border-slate-300 transition"
                      >
                        {/* Store Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-xs ${card.iconBg}`}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-base font-black text-slate-900 leading-tight">
                                {card.storeName}
                              </h4>
                              <p className="text-xs font-bold text-slate-500 mt-0.5">
                                {card.stampsCollected} of {card.totalStamps} Stamps Collected
                              </p>
                            </div>
                          </div>

                          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                            {card.nextMilestoneNote}
                          </span>
                        </div>

                        {/* Stamp Circles Row (Matching Image Screen 5) */}
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 my-3">
                          <div className="flex items-center justify-between gap-2">
                            {Array.from({ length: card.totalStamps }).map((_, idx) => {
                              const isCollected = idx < card.stampsCollected;
                              const isRewardStamp = idx === card.totalStamps - 1;
                              return (
                                <div 
                                  key={idx}
                                  className={`flex-1 aspect-square max-w-14 rounded-2xl flex flex-col items-center justify-center transition ${
                                    isCollected 
                                      ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
                                      : isRewardStamp
                                      ? 'border-2 border-dashed border-red-300 bg-white text-red-400'
                                      : 'border border-slate-200 bg-white text-slate-400'
                                  }`}
                                >
                                  {isCollected ? (
                                    <Check className="w-5 h-5 text-white stroke-[3]" />
                                  ) : isRewardStamp ? (
                                    <Gift className="w-4 h-4 text-red-500" />
                                  ) : (
                                    <span className="text-xs font-black font-mono">{idx + 1}</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Unlocked / In-progress Reward Banner */}
                        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div className="flex items-center space-x-2 text-xs">
                            <span className="font-bold text-slate-500">Reward:</span>
                            <span className="font-extrabold text-slate-900 bg-red-50 text-red-700 px-2.5 py-1 rounded-lg border border-red-100">
                              {card.currentReward}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            {card.isUnlocked ? (
                              <button
                                onClick={() => openClaimFlow({
                                  title: card.currentReward,
                                  storeName: card.storeName,
                                  stampsCollected: card.stampsCollected,
                                  totalStamps: card.totalStamps,
                                  validTill: '28 Feb 2026'
                                })}
                                className="w-full sm:w-auto bg-[#74111d] hover:bg-[#5e0c15] text-white text-xs font-black px-4 py-2 rounded-xl transition shadow-sm cursor-pointer flex items-center justify-center space-x-1.5"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                <span>Claim Now</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => { setActiveTab('scan'); setScanResult(null); }}
                                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5"
                              >
                                <QrCode className="w-3.5 h-3.5" />
                                <span>Collect Stamp</span>
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: SCAN (MATCHING SCREEN 6 & SCREEN 7) */}
          {/* ========================================================= */}
          {activeTab === 'scan' && (
            <div className="animate-in fade-in duration-150">
              
              {!scanResult ? (
                /* SCREEN 6: SCAN QR CODE VIEWPORT */
                <div className="max-w-md mx-auto space-y-5">
                  
                  {/* Top Bar matching Screen 6 */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      title="Back to Dashboard"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <h2 className="text-base font-black text-slate-900">
                      Scan QR Code
                    </h2>

                    {/* Flashlight Button */}
                    <button
                      onClick={() => setFlashlightOn(!flashlightOn)}
                      className={`p-2 rounded-xl border transition cursor-pointer ${
                        flashlightOn 
                          ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                      title="Toggle Flashlight"
                    >
                      <Flashlight className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-xs text-center text-slate-500 font-medium">
                    Position the QR code within the frame to collect stamp
                  </p>

                  {/* Dark Camera Viewport with Corner Brackets & Sweeping Laser Line */}
                  <div className="relative w-full aspect-square max-w-[340px] mx-auto bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 flex flex-col items-center justify-between p-6">
                    
                    {/* Viewfinder Header */}
                    <div className="w-full flex justify-between items-center text-white/70 text-[10px] font-mono z-10">
                      <span className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>CAMERA ACTIVE</span>
                      </span>
                      <span>BEAUREX SCAN</span>
                    </div>

                    {/* Center Viewfinder Target Brackets */}
                    <div className="relative w-52 h-52 border-2 border-dashed border-red-500/80 rounded-2xl flex items-center justify-center overflow-hidden my-auto">
                      
                      {/* Corner Target Brackets */}
                      <div className="absolute top-0 left-0 w-5 h-5 border-t-3 border-l-3 border-red-500"></div>
                      <div className="absolute top-0 right-0 w-5 h-5 border-t-3 border-r-3 border-red-500"></div>
                      <div className="absolute bottom-0 left-0 w-5 h-5 border-b-3 border-l-3 border-red-500"></div>
                      <div className="absolute bottom-0 right-0 w-5 h-5 border-b-3 border-r-3 border-red-500"></div>

                      {/* Watermark QR */}
                      <QrCode className="w-24 h-24 text-white/20" />

                      {/* Sweeping Laser Line */}
                      <div className={`absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-lg shadow-red-500 ${
                        isScanning ? 'animate-bounce' : 'opacity-80'
                      }`}></div>

                      {/* Flashlight Torch Glow Overlay */}
                      {flashlightOn && (
                        <div className="absolute inset-0 bg-amber-200/20 backdrop-blur-3xs pointer-events-none"></div>
                      )}
                    </div>

                    {/* Viewfinder Footer status */}
                    <div className="text-white/70 text-xs text-center z-10 font-medium">
                      {isScanning ? (
                        <span className="text-red-400 font-bold animate-pulse">Verifying counter QR standee...</span>
                      ) : (
                        <span>Align standee QR inside the square</span>
                      )}
                    </div>

                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 max-w-[340px] mx-auto">
                    {!storeOnlineStatus.isOnline && (
                      <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 text-center text-xs text-red-800 space-y-1">
                        <div className="flex items-center justify-center space-x-1.5 font-black text-red-900">
                          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                          <span>Store Stamping Currently Paused</span>
                        </div>
                        <p className="text-[11px] text-red-700">
                          {storeName}'s subscription has expired. QR scanning will resume once the store owner activates an active plan.
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleSimulateScan}
                      disabled={isScanning || !storeOnlineStatus.isOnline}
                      className={`w-full font-black py-3.5 rounded-2xl shadow-lg transition transform text-sm flex items-center justify-center space-x-2 ${
                        !storeOnlineStatus.isOnline
                          ? 'bg-slate-400 text-slate-200 cursor-not-allowed shadow-none'
                          : 'bg-[#74111d] hover:bg-[#5e0c15] text-white shadow-red-600/30 hover:-translate-y-0.5 cursor-pointer'
                      }`}
                    >
                      <Camera className="w-4 h-4" />
                      <span>
                        {!storeOnlineStatus.isOnline 
                          ? 'Scanning Offline (Store Expired)' 
                          : isScanning 
                          ? 'Scanning...' 
                          : `Simulate Scan (${storeName})`}
                      </span>
                    </button>

                    <div className="relative my-4 text-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                      </div>
                      <span className="relative bg-slate-100 px-3 text-[11px] font-bold text-slate-400 uppercase">
                        or enter code manually
                      </span>
                    </div>

                    <form onSubmit={handleManualCodeSubmit} className="flex space-x-2">
                      <input
                        type="text"
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                        placeholder="e.g. KAFEEN-01"
                        disabled={!storeOnlineStatus.isOnline}
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 uppercase focus:outline-none focus:border-[#74111d] disabled:bg-slate-100 disabled:cursor-not-allowed"
                      />
                      <button
                        type="submit"
                        disabled={!storeOnlineStatus.isOnline}
                        className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer disabled:cursor-not-allowed"
                      >
                        Submit
                      </button>
                    </form>
                  </div>

                </div>
              ) : (
                /* SCREEN 7: AFTER SCAN RESULT VIEW */
                <div className="max-w-md mx-auto space-y-6">
                  
                  {/* Top celebration Card */}
                  <div className="bg-white border border-slate-200/90 rounded-3xl p-6 text-center shadow-md">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>

                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      {scanResult.storeName}
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 mt-1">
                      You earned {scanResult.earnedStamps} stamp!
                    </h3>
                    <p className="text-sm font-extrabold text-red-600 mt-1">
                      {scanResult.currentStamps} of {scanResult.totalStamps} stamps collected
                    </p>

                    {/* Stamp Circles */}
                    <div className="flex items-center justify-center gap-2.5 mt-5">
                      {Array.from({ length: scanResult.totalStamps }).map((_, idx) => {
                        const isCollected = idx < scanResult.currentStamps;
                        return (
                          <div 
                            key={idx}
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition ${
                              isCollected 
                                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                                : 'border border-slate-200 bg-slate-50 text-slate-400'
                            }`}
                          >
                            {isCollected ? (
                              <Check className="w-5 h-5 stroke-[3]" />
                            ) : (
                              <span className="text-xs font-bold font-mono">{idx + 1}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Available Rewards Section matching Screen 7 */}
                  <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-3">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                      Available Rewards
                    </h4>

                    {/* Reward 1: Ready to claim */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h5 className="text-sm font-black text-slate-900">30% off on next purchase</h5>
                        </div>
                        <span className="text-[11px] font-black text-red-600 block mt-0.5">
                          Ready to claim! 🎉
                        </span>
                      </div>
                      <button
                        onClick={() => openClaimFlow({
                          title: '30% off on next purchase',
                          storeName: scanResult.storeName,
                          stampsCollected: scanResult.currentStamps,
                          totalStamps: scanResult.totalStamps,
                          validTill: '28 Feb 2026'
                        })}
                        className="bg-[#74111d] hover:bg-[#5e0c15] text-white text-xs font-black px-3.5 py-2 rounded-xl transition shadow-xs cursor-pointer"
                      >
                        Claim Now
                      </button>
                    </div>

                    {/* Reward 2: Locked */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between opacity-80">
                      <div>
                        <h5 className="text-sm font-bold text-slate-800">50% discount</h5>
                        <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                          1 more stamp to unlock
                        </span>
                      </div>
                      <Lock className="w-4 h-4 text-slate-400" />
                    </div>

                    {/* Reward 3: Locked */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between opacity-80">
                      <div>
                        <h5 className="text-sm font-bold text-slate-800">Free Coffee</h5>
                        <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                          2 more stamps to unlock
                        </span>
                      </div>
                      <Lock className="w-4 h-4 text-slate-400" />
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="flex-1 bg-[#74111d] hover:bg-[#5e0c15] text-white font-extrabold py-3.5 rounded-2xl transition cursor-pointer text-center text-xs shadow-md"
                    >
                      Done / Back to Home
                    </button>
                    <button
                      onClick={() => setScanResult(null)}
                      className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold px-4 py-3.5 rounded-2xl transition cursor-pointer text-xs"
                    >
                      Scan Again
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: REWARDS (MATCHING SCREEN 8 & SCREEN 14) */}
          {/* ========================================================= */}
          {activeTab === 'reward' && (
            <div className="max-w-2xl mx-auto space-y-5 animate-in fade-in duration-150">
              
              {/* Header Title matching Screen 8 */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  My Rewards
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  View rewards ready to claim and your past redemption history
                </p>
              </div>

              {/* Subtabs: "To Claim" | "History" (matching Screen 8 & Screen 14) */}
              <div className="flex rounded-2xl bg-slate-200 p-1">
                <button
                  type="button"
                  onClick={() => setRewardSubTab('to_claim')}
                  className={`flex-1 py-2.5 text-xs font-black rounded-xl transition cursor-pointer ${
                    rewardSubTab === 'to_claim'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  To Claim
                </button>
                <button
                  type="button"
                  onClick={() => setRewardSubTab('history')}
                  className={`flex-1 py-2.5 text-xs font-black rounded-xl transition cursor-pointer ${
                    rewardSubTab === 'history'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  History ({rewardHistory.length})
                </button>
              </div>

              {/* SUBTAB 1: TO CLAIM (Screen 8) */}
              {rewardSubTab === 'to_claim' && (
                <div className="space-y-4">
                  {toClaimRewards.map((item) => (
                    <div 
                      key={item.id}
                      className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs hover:border-slate-300 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="w-11 h-11 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-black text-sm shrink-0 mt-0.5">
                            <Gift className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                              {item.storeName}
                            </span>
                            <h4 className="text-base font-black text-slate-900 leading-snug">
                              {item.title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Valid till: <strong className="text-slate-700">{item.validTill}</strong>
                            </p>
                          </div>
                        </div>

                        {item.isReady ? (
                          <button
                            onClick={() => openClaimFlow(item)}
                            className="bg-[#74111d] hover:bg-[#5e0c15] text-white font-black text-xs px-4 py-2.5 rounded-xl transition shadow-md shadow-red-600/20 cursor-pointer shrink-0"
                          >
                            Claim Now
                          </button>
                        ) : (
                          <button
                            onClick={() => { setActiveTab('scan'); setScanResult(null); }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-xl transition cursor-pointer shrink-0"
                          >
                            Collect Stamps
                          </button>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">
                          Progress: <strong className="text-slate-800">{item.stampsCollected}/{item.totalStamps} stamps</strong>
                        </span>
                        <span className={`font-black text-[11px] ${item.isReady ? 'text-red-600' : 'text-slate-400'}`}>
                          {item.statusNote}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SUBTAB 2: HISTORY (Screen 14) */}
              {rewardSubTab === 'history' && (
                <div className="space-y-4">
                  {/* Filter Chips matching Screen 14 */}
                  <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                    {['All', 'Active', 'Used', 'Expired'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setHistoryFilter(filter)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                          historyFilter === filter
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  {/* History Cards matching Screen 14 */}
                  <div className="space-y-3">
                    {rewardHistory
                      .filter(item => historyFilter === 'All' || item.status === historyFilter)
                      .map((item) => {
                        const isUsed = item.status === 'Used';
                        const isExpired = item.status === 'Expired';
                        const isActive = item.status === 'Active';

                        return (
                          <div 
                            key={item.id}
                            className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="flex items-start space-x-3.5">
                              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200/80">
                                <Coffee className="w-6 h-6 text-slate-800" />
                              </div>

                              <div>
                                <div className="flex items-center space-x-2">
                                  <h4 className="text-sm font-black text-slate-900">
                                    {item.title}
                                  </h4>
                                </div>
                                <p className="text-xs font-bold text-slate-500 mt-0.5">
                                  {item.storeName}
                                </p>

                                <div className="text-[11px] text-slate-400 mt-2 space-y-0.5">
                                  <div>Claimed on: <strong className="text-slate-600">{item.claimedOn}</strong></div>
                                  {item.usedOn && (
                                    <div>Used on: <strong className="text-slate-600">{item.usedOn}</strong></div>
                                  )}
                                  {isExpired && (
                                    <div>Expired on: <strong className="text-slate-600">{item.expiryDate}</strong></div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Status Badges matching Screen 14 */}
                            <div className="self-start sm:self-center">
                              {isUsed && (
                                <span className="bg-slate-100 text-slate-700 font-black text-[11px] px-3 py-1 rounded-full border border-slate-200">
                                  Used
                                </span>
                              )}
                              {isExpired && (
                                <span className="bg-rose-50 text-rose-700 font-black text-[11px] px-3 py-1 rounded-full border border-rose-200">
                                  Expired
                                </span>
                              )}
                              {isActive && (
                                <span className="bg-emerald-50 text-emerald-700 font-black text-[11px] px-3 py-1 rounded-full border border-emerald-200 flex items-center space-x-1">
                                  <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                                  <span>Active</span>
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}

                    {rewardHistory.filter(item => historyFilter === 'All' || item.status === historyFilter).length === 0 && (
                      <div className="p-8 text-center bg-white border border-slate-200 rounded-3xl">
                        <Gift className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <h5 className="text-sm font-bold text-slate-700">No rewards found</h5>
                        <p className="text-xs text-slate-400 mt-0.5">No rewards match filter "{historyFilter}"</p>
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>
          )}

        </main>
      </div>

      {/* ========================================================= */}
      {/* MOBILE BOTTOM NAVIGATION BAR (FIXED EXACTLY 3 MENUS) */}
      {/* ========================================================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-6 py-2 flex items-center justify-around shadow-2xl">
        
        {/* Item 1: Home / Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-3 transition cursor-pointer ${
            activeTab === 'dashboard' ? 'text-red-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px] font-black mt-1">Home</span>
        </button>

        {/* Item 2: Scan (Raised Red Center Button) */}
        <button
          onClick={() => { setActiveTab('scan'); setScanResult(null); }}
          className="-mt-7 w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl shadow-red-600/40 border-4 border-white active:scale-95 transition transform cursor-pointer"
          aria-label="Scan QR Code"
        >
          <QrCode className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Item 3: Rewards */}
        <button
          onClick={() => setActiveTab('reward')}
          className={`flex flex-col items-center justify-center py-1 px-3 transition cursor-pointer ${
            activeTab === 'reward' ? 'text-red-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Gift className="w-5 h-5" />
          <span className="text-[11px] font-black mt-1">Rewards</span>
        </button>

      </nav>

      {/* ========================================================= */}
      {/* FAST REWARD CLAIM FLOW MODAL (SCREENS 10, 12, 13) */}
      {/* ========================================================= */}
      {claimModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setClaimModal({ isOpen: false, step: 1, reward: null })}
          />

          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 border border-slate-200">
            
            {/* STEP 1: REWARD DETAILS (Screen 10) */}
            {claimModal.step === 1 && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {claimModal.reward?.storeName}
                  </span>
                  <button 
                    onClick={() => setClaimModal({ isOpen: false, step: 1, reward: null })}
                    className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-center py-2">
                  <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
                    <Gift className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    {claimModal.reward?.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Progress: {claimModal.reward?.stampsCollected} of {claimModal.reward?.totalStamps} stamps collected
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 text-xs space-y-2 border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Valid Till:</span>
                    <span className="font-bold text-slate-900">{claimModal.reward?.validTill}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Eligible For:</span>
                    <span className="font-bold text-emerald-600">Dine-in & Takeaway</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Requirement:</span>
                    <span className="font-bold text-slate-900">Show Customer ID to cashier</span>
                  </div>
                </div>

                <button
                  onClick={handleProceedToWaiting}
                  className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-black py-3.5 rounded-2xl shadow-lg shadow-red-600/30 transition transform hover:-translate-y-0.5 cursor-pointer text-sm"
                >
                  Claim Now
                </button>
              </div>
            )}

            {/* STEP 2: WAITING FOR CASHIER APPROVAL (Screen 12) */}
            {claimModal.step === 2 && (
              <div className="p-6 text-center space-y-5">
                <div className="flex justify-end">
                  <button 
                    onClick={() => setClaimModal({ isOpen: false, step: 1, reward: null })}
                    className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Animated Pulsing Hourglass in Amber Circle */}
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-amber-400 border-t-transparent animate-spin"></div>
                  <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shadow-inner">
                    <Hourglass className="w-8 h-8 animate-pulse text-amber-600" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Waiting for Cashier Approval
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Please share your Customer ID with the cashier.
                  </p>
                </div>

                {/* Customer ID Card matching Screen 12 */}
                <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-md">
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                      Customer ID
                    </span>
                    <span className="text-xl font-mono font-black text-amber-300 tracking-wider">
                      {customerUser.customerId}
                    </span>
                  </div>

                  <button
                    onClick={handleCopyCustomerId}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 transition flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedId ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Instant Simulation Action */}
                <div className="pt-2">
                  <button
                    onClick={handleApproveClaim}
                    className="text-xs text-slate-500 hover:text-red-600 font-bold underline cursor-pointer"
                  >
                    Simulate Cashier Approve Now
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CONGRATULATIONS (Screen 13) */}
            {claimModal.step === 3 && (
              <div className="p-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
                {/* Large Green Checkmark */}
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-slate-900">
                    Reward Claimed!
                  </h3>
                  <p className="text-sm font-bold text-red-600 mt-1">
                    Enjoy your reward 🎉
                  </p>
                </div>

                {/* Reward Summary Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-1.5">
                  <div className="font-black text-slate-900 text-sm">
                    {claimModal.reward?.title}
                  </div>
                  <div className="text-slate-500 font-medium">
                    Store: <strong className="text-slate-800">{claimModal.reward?.storeName}</strong>
                  </div>
                  <div className="text-emerald-700 font-bold">
                    Approved by cashier at counter
                  </div>
                </div>

                <button
                  onClick={handleFinishClaim}
                  className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-black py-3.5 rounded-2xl shadow-lg shadow-red-600/30 transition transform hover:-translate-y-0.5 cursor-pointer text-sm"
                >
                  Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PROFILE MODAL (MATCHING SCREEN 9) */}
      {/* ========================================================= */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setProfileModalOpen(false)}
          />

          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 border border-slate-200">
            
            {/* Top Bar */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900">
                Customer Profile
              </h3>
              <button 
                onClick={() => setProfileModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Avatar & Header matching Screen 9 */}
            <div className="p-6 text-center border-b border-slate-100">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-red-600 to-rose-700 text-white font-black text-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-red-600/30">
                {customerUser.name.split(' ').map(n => n[0]).join('')}
              </div>

              <h4 className="text-xl font-black text-slate-900">
                {customerUser.name}
              </h4>
              <span className="inline-flex items-center space-x-1 text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full mt-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{customerUser.tier}</span>
              </span>

              {/* Customer ID Pill with Copy */}
              <div className="mt-4 bg-slate-100 rounded-xl p-2.5 flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Customer ID</span>
                  <span className="font-mono font-black text-slate-900 text-sm">{customerUser.customerId}</span>
                </div>
                <button
                  onClick={handleCopyCustomerId}
                  className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200 transition cursor-pointer flex items-center space-x-1"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Profile Contact Details */}
            <div className="p-5 space-y-3 text-xs border-b border-slate-100">
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 font-medium">Phone</span>
                <span className="font-bold text-slate-900">{customerUser.phone}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 font-medium">Email</span>
                <span className="font-bold text-slate-900">{customerUser.email}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 font-medium">Member Since</span>
                <span className="font-bold text-slate-900">{customerUser.memberSince}</span>
              </div>
            </div>

            {/* Legal / Policy Links matching Screen 9 */}
            <div className="p-4 bg-slate-50 text-xs space-y-2 border-b border-slate-100">
              <div className="text-slate-500 hover:text-slate-900 cursor-pointer font-medium py-1">
                Privacy Policy
              </div>
              <div className="text-slate-500 hover:text-slate-900 cursor-pointer font-medium py-1">
                Terms of Service
              </div>
              <div className="text-slate-500 hover:text-slate-900 cursor-pointer font-medium py-1">
                Help & Support Helpline
              </div>
            </div>

            {/* Prominent Logout Button matching user requirement */}
            <div className="p-4 bg-white">
              <button
                onClick={handleCustomerLogout}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-black py-3 rounded-2xl text-xs transition flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout Customer Account</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

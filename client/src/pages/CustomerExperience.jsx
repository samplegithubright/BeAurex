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
  Crown, CreditCard, LogIn, Share2, MessageCircle
} from 'lucide-react';
import LegalPolicyModal from '../components/LegalPolicyModal';

// Official BeAurex Stamp Indicator (Replaces plain star with official BeAurex Logo)
function BeAurexStamp({ stamped = true, size = 'sm' }) {
  const sizeClasses = size === 'lg' ? 'w-10 h-10' : size === 'md' ? 'w-8 h-8' : 'w-7 h-7';
  if (!stamped) {
    return (
      <div 
        className={`${sizeClasses} rounded-full border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-300 text-xs transition`}
        title="Uncollected Stamp"
      >
        <span className="text-[10px] font-bold text-slate-300">○</span>
      </div>
    );
  }
  return (
    <div 
      className={`${sizeClasses} rounded-full bg-[#74111d] flex items-center justify-center shadow-xs overflow-hidden ring-1 ring-[#5e0c15] p-0 transition transform hover:scale-105 shrink-0 relative`}
      title="BeAurex Stamped"
    >
      <img 
        src="/beaurex-icon.jpg" 
        alt="BeAurex Stamp" 
        className="w-full h-full object-cover scale-135 -translate-y-[8%]"
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
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
    title: '30% OFF on next purchase',
    storeName: 'Ka-feen',
    requiresStamps: 2,
    validTill: '30 Jul 2026',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    approvedAt: 'Today, 2:30 PM'
  });

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

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('beaurex_customer_auth', 'false');
    setLoginError('');
    setLoginSuccessMsg('');
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
      setCurrentScreen('after_scan');
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
    setCurrentScreen('after_scan');
  };

  // Fast Claim Flow: Screen 10 (Reward Details) -> Screen 12 (Waiting) -> Screen 13 (Claimed)
  const handleInitiateClaim = () => {
    setCurrentScreen('waiting_approval');
    // Auto simulate cashier approving in 2.5s for seamless demo
    setTimeout(() => {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      setCurrentScreen('reward_congrats');
    }, 2500);
  };

  // =========================================================================
  // VIEW: GOOGLE LENS / CAMERA SCAN LANDING PAGE (WHEN UN-AUTHENTICATED)
  // =========================================================================
  if (slug && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-[#74111d] selection:text-white">
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl overflow-hidden shadow-xs flex items-center justify-center bg-[#74111d]">
                <img src="/beaurex-icon.jpg" alt="BeAurex Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-base font-black text-slate-900 tracking-tight leading-none block">
                  Be<span className="text-[#74111d]">Aurex</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Counter Scan &amp; Earn
                </span>
              </div>
            </div>
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
              <span className="bg-rose-50 text-[#74111d] border border-rose-200 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                ● Store Counter Online
              </span>
              <h2 className="text-xl font-black text-slate-900">{storeInfo.storeName}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{storeInfo.categoryName} • Collect stamps &amp; rewards</p>
            </div>

            {/* Offer highlight card */}
            <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-4 text-left flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#74111d] text-white flex items-center justify-center font-black text-sm shrink-0">
                <Gift className="w-5 h-5 text-amber-200" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black text-slate-900 leading-snug">30% OFF on next purchase</div>
                <div className="text-[11px] text-[#74111d] font-bold mt-0.5">Collect 5 stamps to unlock</div>
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
                className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-black py-3.5 px-4 rounded-2xl text-xs transition shadow-md shadow-[#74111d]/20 cursor-pointer flex items-center justify-center space-x-2"
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
                  className="w-full p-3 rounded-2xl border border-slate-200 hover:border-[#74111d] hover:bg-rose-50/40 text-left flex items-center space-x-3 transition cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-rose-100 text-[#74111d] font-bold text-xs flex items-center justify-center shrink-0">
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
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#74111d]"
                  />
                  <input
                    type="email"
                    value={googleCustomEmail}
                    onChange={(e) => setGoogleCustomEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#74111d]"
                  />
                  <button
                    type="button"
                    disabled={!googleCustomEmail}
                    onClick={() => handleGoogleSignInSelect(googleCustomEmail, googleCustomName)}
                    className="w-full py-2 bg-[#74111d] hover:bg-[#5e0c15] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
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
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-[#74111d] selection:text-white">
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl overflow-hidden shadow-xs flex items-center justify-center bg-[#74111d]">
                <img src="/beaurex-icon.jpg" alt="BeAurex Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-base font-black text-slate-900 tracking-tight leading-none block">
                  Be<span className="text-[#74111d]">Aurex</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Customer Rewards Portal
                </span>
              </div>
            </div>
            <Link to="/" className="text-xs font-bold text-slate-500 hover:text-slate-800 transition">
              Back to Home
            </Link>
          </div>
        </header>

        <main className="flex-1 max-w-md sm:max-w-lg lg:max-w-xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
            
            {/* Header Icon & Title */}
            <div className="text-center space-y-1">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#74111d] border border-rose-200 flex items-center justify-center mx-auto shadow-xs">
                <Gift className="w-7 h-7 text-[#74111d]" />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight mt-2">
                {authMode === 'signup' ? 'Create BeAurex Account' : 'Welcome to BeAurex'}
              </h2>
              <p className="text-xs text-slate-500">
                {authMode === 'signup'
                  ? 'Join loyalty programs, collect digital stamps, and unlock rewards.'
                  : 'Sign in to access your digital loyalty cards, points, and saved rewards.'}
              </p>
            </div>

            {/* Segmented Tab Switcher: Sign In vs Sign Up */}
            <div className="p-1 rounded-2xl bg-slate-100 flex items-center text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setLoginError('');
                  setLoginSuccessMsg('');
                }}
                className={`flex-1 py-2 rounded-xl transition cursor-pointer text-center ${
                  authMode === 'signin'
                    ? 'bg-white text-slate-900 shadow-xs font-black'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setLoginError('');
                  setLoginSuccessMsg('');
                }}
                className={`flex-1 py-2 rounded-xl transition cursor-pointer text-center ${
                  authMode === 'signup'
                    ? 'bg-white text-slate-900 shadow-xs font-black'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Google Sign In Placed ABOVE */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setGoogleSignInModalOpen(true)}
                className="w-full bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 text-slate-800 font-bold py-3 px-4 rounded-2xl text-xs transition flex items-center justify-center space-x-3 shadow-xs cursor-pointer"
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
              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    or continue with email
                  </span>
                </div>
              </div>
            </div>

            {/* Error / Success Toast alerts */}
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}
            {loginSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{loginSuccessMsg}</span>
              </div>
            )}

            {/* Email & Password Authentication Form (No Mobile OTP) */}
            {authMode === 'signin' ? (
              <form onSubmit={handleCustomerLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="you@gmail.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs focus:outline-none focus:border-[#74111d] focus:bg-white text-slate-900 font-bold transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase text-slate-600">
                      Password *
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs focus:outline-none focus:border-[#74111d] focus:bg-white text-slate-900 font-bold transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-[#74111d]/20 transition cursor-pointer text-xs flex items-center justify-center space-x-2"
                >
                  {loginLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to BeAurex</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleCustomerSignup} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={loginName}
                      onChange={(e) => setLoginName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs focus:outline-none focus:border-[#74111d] focus:bg-white text-slate-900 font-bold transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="you@gmail.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs focus:outline-none focus:border-[#74111d] focus:bg-white text-slate-900 font-bold transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    10-Digit Mobile Number (Optional)
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-xs font-bold text-slate-500 pointer-events-none flex items-center space-x-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>+91</span>
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="98765 43210"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-16 pr-3.5 py-2.5 text-xs focus:outline-none focus:border-[#74111d] focus:bg-white text-slate-900 font-mono font-bold transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    Create Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Minimum 4 characters"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs focus:outline-none focus:border-[#74111d] focus:bg-white text-slate-900 font-bold transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    Referral / Invite Code (Optional)
                  </label>
                  <div className="relative">
                    <Sparkles className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500" />
                    <input
                      type="text"
                      value={referralInput}
                      onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
                      placeholder="e.g. BX-8F4A (Get Bonus Stamps)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs focus:outline-none focus:border-[#74111d] focus:bg-white text-slate-900 font-mono font-bold uppercase transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-[#74111d]/20 transition cursor-pointer text-xs flex items-center justify-center space-x-2"
                >
                  {loginLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account &amp; Start Earning</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        </main>

        <footer className="text-center p-4 text-xs text-slate-400 space-y-1.5">
          <div>Powered by BeAurex Customer Loyalty Platform</div>
          <div className="flex items-center justify-center space-x-3 text-[11px] text-slate-500">
            <button 
              type="button" 
              onClick={() => { setLegalModalTab('terms'); setLegalModalOpen(true); }}
              className="hover:text-slate-800 underline cursor-pointer"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button 
              type="button" 
              onClick={() => { setLegalModalTab('privacy'); setLegalModalOpen(true); }}
              className="hover:text-slate-800 underline cursor-pointer"
            >
              Privacy Policy
            </button>
          </div>
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
                  className="w-full p-3 rounded-2xl border border-slate-200 hover:border-[#74111d] hover:bg-rose-50/40 text-left flex items-center space-x-3 transition cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-rose-100 text-[#74111d] font-bold text-xs flex items-center justify-center shrink-0">
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
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#74111d]"
                  />
                  <input
                    type="email"
                    value={googleCustomEmail}
                    onChange={(e) => setGoogleCustomEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#74111d]"
                  />
                  <button
                    type="button"
                    disabled={!googleCustomEmail}
                    onClick={() => handleGoogleSignInSelect(googleCustomEmail, googleCustomName)}
                    className="w-full py-2 bg-[#74111d] hover:bg-[#5e0c15] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-[#74111d] selection:text-white pb-24 md:pb-8">
      
      {/* ------------------------------------------------------------------- */}
      {/* SCREEN 16: SPLASH SCREEN (Batch 5) */}
      {/* ------------------------------------------------------------------- */}
      {splashLoading && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
          <div className="w-20 h-20 rounded-3xl bg-[#74111d] text-white flex items-center justify-center shadow-xl shadow-[#74111d]/30 mb-5">
            <QrCode className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Loyal<span className="text-[#74111d]">QR</span>
          </h1>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
            Collect. Scan. Earn.
          </p>
          <div className="mt-8 flex flex-col items-center space-y-2">
            <RefreshCw className="w-5 h-5 text-[#74111d] animate-spin" />
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
              className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-bold py-3 rounded-2xl text-xs transition flex items-center justify-center space-x-2 cursor-pointer shadow-md"
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
                className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-bold py-3 rounded-2xl text-xs transition flex items-center justify-center space-x-2 cursor-pointer shadow-md"
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
      <header className="bg-white border-b border-slate-200/90 sticky top-0 z-40 hidden md:block">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Brand Logo & Title */}
          <Link to="/customer" onClick={() => setCurrentScreen('home')} className="flex items-center space-x-3 group">
            <img 
              src="/beaurex-icon.jpg" 
              alt="BeAurex Logo" 
              className="w-10 h-10 rounded-xl object-cover shadow-md shadow-red-950/20 group-hover:scale-105 transition"
            />
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight leading-none text-slate-900">
                Be<span className="text-[#74111d]">Aurex</span>
              </span>
              <span className="text-[10px] font-bold text-[#74111d] uppercase tracking-wider mt-0.5">
                Customer Rewards Portal
              </span>
            </div>
          </Link>

          {/* Center Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setCurrentScreen('home')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                currentScreen === 'home'
                  ? 'bg-rose-50 text-[#74111d] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={openScanScreen}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                currentScreen === 'scan'
                  ? 'bg-[#74111d] text-white shadow-xs'
                  : 'bg-rose-500/10 text-[#74111d] hover:bg-[#74111d] hover:text-white'
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
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                currentScreen === 'rewards'
                  ? 'bg-rose-50 text-[#74111d] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>My Rewards</span>
              <span className="bg-[#74111d] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {rewardHistory.length}
              </span>
            </button>

            <button
              onClick={() => setCurrentScreen('profile')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                currentScreen === 'profile'
                  ? 'bg-rose-50 text-[#74111d] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile & Refer</span>
            </button>
          </nav>

          {/* Right Customer Info & Logout */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden lg:block">
              <div className="text-xs font-black text-slate-900">{customerUser.name}</div>
              <div className="flex items-center space-x-1 justify-end text-[10px] font-mono text-slate-400">
                <span>{customerUser.customerId}</span>
                <button
                  onClick={() => handleCopyCustomer(customerUser.customerId)}
                  title="Copy ID"
                  className="hover:text-slate-700 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                </button>
                {copiedId && <span className="text-[9px] text-emerald-600 font-bold">Copied!</span>}
              </div>
            </div>
            
            <button
              onClick={() => setCurrentScreen('profile')}
              className="w-9 h-9 rounded-xl bg-rose-100 text-[#74111d] font-black text-xs flex items-center justify-center hover:ring-2 hover:ring-[#74111d]/30 transition cursor-pointer"
              title="Profile"
            >
              {customerUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </button>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------- */}
      {/* MOBILE TOP NAVIGATION BAR (Visible on mobile screens < md) */}
      {/* ------------------------------------------------------------------- */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-40 md:hidden px-4 py-3 flex items-center justify-between shadow-xs">
        <Link to="/customer" onClick={() => setCurrentScreen('home')} className="flex items-center space-x-2.5">
          <img 
            src="/beaurex-icon.jpg" 
            alt="BeAurex Logo" 
            className="w-8 h-8 rounded-xl object-cover shadow-xs"
          />
          <div>
            <span className="text-base font-black tracking-tight leading-none text-slate-900 block">
              Be<span className="text-[#74111d]">Aurex</span>
            </span>
            <span className="text-[9px] font-bold text-[#74111d] uppercase tracking-wider block">
              Rewards Portal
            </span>
          </div>
        </Link>

        <div className="flex items-center space-x-2">
          <div className="bg-rose-50 border border-rose-200/60 rounded-xl px-2.5 py-1 text-right">
            <span className="text-[8px] uppercase font-bold text-slate-400 block leading-tight">Customer ID</span>
            <span className="text-xs font-black font-mono text-[#74111d] leading-tight block">
              {customerUser.customerId}
            </span>
          </div>
          <button
            onClick={() => setCurrentScreen('profile')}
            className="w-8 h-8 rounded-xl bg-rose-100 text-[#74111d] font-black text-xs flex items-center justify-center shadow-xs cursor-pointer ring-1 ring-[#74111d]/20"
            title="Profile & Refer"
          >
            {customerUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------------- */}
      {/* SCREEN 5: HOME (Batch 2) */}
      {/* ------------------------------------------------------------------- */}
      {currentScreen === 'home' && (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
          
          {/* Top Crimson Header Banner */}
          <div className="bg-gradient-to-r from-[#590104] via-[#74111d] to-[#8f1927] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-10 -top-10 w-36 h-36 bg-white/5 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <span className="text-xs sm:text-sm text-rose-200 font-medium block">Good Evening,</span>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{customerUser.name}</h1>
                <div className="flex items-center space-x-1.5 mt-1 text-xs text-rose-200/90 font-mono">
                  <span>Customer ID: {customerUser.customerId}</span>
                  <button 
                    onClick={() => handleCopyCustomer(customerUser.customerId)}
                    title="Copy ID"
                    className="p-1 hover:text-white transition cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {copiedId && <span className="text-[10px] text-amber-300 font-sans font-bold">Copied!</span>}
                </div>
              </div>

              {/* Gold Member Card & Profile Trigger */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3">
                <div className="bg-gradient-to-r from-[#941c2b] to-[#600e18] border border-rose-300/30 rounded-2xl p-3 sm:p-4 shadow-sm flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-300/40 text-amber-300 flex items-center justify-center shrink-0">
                    <Crown className="w-5 h-5 fill-amber-300 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-amber-200 tracking-tight leading-tight">{customerUser.tier}</h4>
                    <p className="text-[11px] text-rose-200/80 font-medium">Member Since • {customerUser.memberSince}</p>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentScreen('profile')}
                  className="w-11 h-11 rounded-2xl border-2 border-white/60 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer md:hidden shrink-0"
                  title="View Profile"
                >
                  <User className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Metrics Row across banner */}
            <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mt-6 pt-5 border-t border-white/15">
              <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-3 sm:p-4">
                <div className="flex items-center space-x-2 text-rose-200 text-xs font-bold mb-1">
                  <CreditCard className="w-4 h-4 text-amber-300" />
                  <span>Active Cards</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">{customerUser.activeCardsCount}</div>
                <div className="text-[10px] text-rose-200/80">Loyalty programs joined</div>
              </div>

              <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-3 sm:p-4">
                <div className="flex items-center space-x-2 text-rose-200 text-xs font-bold mb-1">
                  <Gift className="w-4 h-4 text-emerald-300" />
                  <span>Redeemed</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">{customerUser.rewardsRedeemedCount}</div>
                <div className="text-[10px] text-rose-200/80">Rewards unlocked</div>
              </div>

              <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-3 sm:p-4">
                <div className="flex items-center space-x-2 text-rose-200 text-xs font-bold mb-1">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Stamps</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">{customerUser.stamps || 3} / {customerUser.totalStamps || 5}</div>
                <div className="text-[10px] text-rose-200/80">Current store progress</div>
              </div>

              <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-3 sm:p-4">
                <div className="flex items-center space-x-2 text-rose-200 text-xs font-bold mb-1">
                  <TrendingUp className="w-4 h-4 text-emerald-300" />
                  <span>Referral Profit</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-300">₹{customerUser.referralEarnings || 150}</div>
                <div className="text-[10px] text-rose-200/80">+{customerUser.referralCount || 3} bonus stamps</div>
              </div>
            </div>
          </div>

          {/* Main Layout Grid on Laptop (Left col: Cards, Right col: Digital Pass & Quick actions) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            
            {/* Left Column (8 cols): Active Loyalty Programs */}
            <div className="lg:col-span-8 space-y-6">
              
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
                    className="bg-[#74111d] hover:bg-[#5e0c15] text-white font-bold py-3.5 px-8 rounded-2xl text-xs sm:text-sm transition flex items-center justify-center space-x-2 mx-auto cursor-pointer shadow-md"
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
                      <h3 className="text-base font-black text-slate-900">Continue Collecting</h3>
                      <p className="text-xs text-slate-500">Tap any store card or reward to view details</p>
                    </div>
                    <button
                      onClick={() => setEmptyStateDemo(true)}
                      className="text-xs font-bold text-[#74111d] hover:underline cursor-pointer"
                    >
                      View Empty State
                    </button>
                  </div>

                  {/* Loyalty Cards Grid (Responsive: 1 col on mobile, 2 cols on tablet/laptop) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Card 1: Ka-feen Coffee Shop */}
                    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-4 hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-11 h-11 rounded-2xl bg-[#111111] text-white flex items-center justify-center shadow-xs">
                              <Coffee className="w-5 h-5 text-amber-200" />
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-slate-900 leading-tight">Ka-feen</h4>
                              <p className="text-[11px] text-slate-500 font-medium">Coffee Shop • Sector 29</p>
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
                          <span className="text-[11px] text-slate-400 font-bold">3 of 5 Stamps Collected</span>
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
                          <div className="w-7 h-7 rounded-full bg-[#74111d] text-white flex items-center justify-center shrink-0">
                            <Gift className="w-3.5 h-3.5 text-amber-200" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-900 leading-tight">30% off on next purchase</div>
                            <div className="text-[10px] text-slate-500 font-medium">Collect 2 more stamps to unlock</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#74111d]" />
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
                          <div className="w-7 h-7 rounded-full bg-[#74111d] text-white flex items-center justify-center shrink-0">
                            <Gift className="w-3.5 h-3.5 text-amber-200" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-900 leading-tight">Complimentary Dessert Box</div>
                            <div className="text-[10px] text-slate-500 font-medium">Only 1 stamp to unlock!</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#74111d]" />
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>

            {/* Right Column (4 cols): Customer Digital Pass, Scan CTA & Referral Widget */}
            <div className="lg:col-span-4 space-y-5">
              
              {/* Digital Pass / Membership Counter Card */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5 text-center">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <img src="/beaurex-icon.jpg" alt="BeAurex" className="w-6 h-6 rounded-lg object-cover" />
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Digital Pass</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    Active Member
                  </span>
                </div>

                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-4 space-y-2">
                  <QrCode className="w-20 h-20 text-slate-900 mx-auto" />
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Customer ID</div>
                  <div className="text-xl font-mono font-black text-[#74111d] tracking-wider">{customerUser.customerId}</div>
                  <p className="text-[11px] text-slate-500">Show this QR / ID to the cashier to earn stamps without scanning</p>
                </div>

                <button
                  onClick={openScanScreen}
                  className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-black py-3.5 px-6 rounded-2xl text-xs sm:text-sm transition flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-[#74111d]/20"
                >
                  <Camera className="w-4 h-4 text-amber-300" />
                  <span>Scan Store QR Standee</span>
                </button>
              </div>

              {/* Refer & Earn Quick Snapshot */}
              <div className="bg-gradient-to-br from-[#74111d] via-[#8c1725] to-[#550c14] text-white rounded-3xl p-5 shadow-md space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center">
                    <Gift className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-amber-300">Invite &amp; Earn Profit</span>
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">Give 10% Off, Get +1 Stamp &amp; ₹50</h4>
                  <p className="text-xs text-rose-100/90 mt-1 leading-relaxed">
                    Friends get a 10% instant welcome voucher when joining with your code.
                  </p>
                </div>

                <div className="bg-white/10 border border-white/20 rounded-2xl p-2.5 flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-white tracking-widest pl-2">
                    {customerUser.referralCode || 'BEAUREX-8F4A'}
                  </span>
                  <button
                    onClick={() => handleCopyReferralCode(customerUser.referralCode || 'BEAUREX-8F4A')}
                    className="bg-white text-[#74111d] hover:bg-rose-50 font-black px-3 py-1.5 rounded-xl text-[11px] transition flex items-center space-x-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedReferral ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <button
                  onClick={handleWhatsAppShare}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Share on WhatsApp</span>
                </button>
              </div>

              {/* Verified Trust Badge */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center space-x-3 text-slate-600">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">BeAurex Verified Platform</div>
                  <div className="text-[10px] text-slate-400">Zero auto-debit • 100% Secure Digital Stamps</div>
                </div>
              </div>

            </div>

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
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden flex items-center justify-center bg-slate-900/40 border-2 border-white/20">
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

          {/* Bottom Actions: Fallback simulate scan */}
          <div className="p-6 text-center space-y-3">
            <button
              onClick={simulateScanSuccess}
              className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-bold py-3.5 px-6 rounded-2xl text-xs transition shadow-lg shadow-[#74111d]/50 cursor-pointer flex items-center justify-center space-x-2"
            >
              <QrCode className="w-4 h-4" />
              <span>Simulate Counter Scan (Ka-feen)</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SCREEN 7: AFTER SCAN (Batch 2) */}
      {/* ------------------------------------------------------------------- */}
      {currentScreen === 'after_scan' && (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-5">
          {/* Top Bar with Back Arrow & Store info */}
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
            <button
              onClick={() => setCurrentScreen('home')}
              className="p-1.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-[#111] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Coffee className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 leading-tight">Ka-feen</h2>
              <p className="text-[10px] text-slate-500 font-medium">Coffee Shop • Sector 29</p>
            </div>
          </div>

          {/* Stamp Earned Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 text-center shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#74111d] flex items-center justify-center mx-auto shadow-xs border border-rose-100">
              <Sparkles className="w-6 h-6 text-[#74111d]" />
            </div>
            <h3 className="text-base font-black text-slate-900">You earned 1 stamp!</h3>
            <p className="text-xs text-slate-500">3 of 5 stamps collected</p>
            <div className="flex items-center justify-center space-x-2 py-1 flex-wrap gap-y-2">
              {[1, 2, 3].map((n) => (
                <BeAurexStamp key={n} stamped={true} size="md" />
              ))}
              {[4, 5].map((n) => (
                <BeAurexStamp key={n} stamped={false} size="md" />
              ))}
            </div>
          </div>

          {/* Available Rewards Section */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-black text-slate-900">Available Rewards</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">

            {/* Reward 1: 30% OFF (Achieved) */}
            <div 
              onClick={() => {
                setSelectedReward({
                  title: '30% off on next purchase',
                  storeName: 'Ka-feen',
                  requiresStamps: 2,
                  validTill: '30 Jul 2026',
                  image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
                  approvedAt: 'Today, 2:30 PM'
                });
                setCurrentScreen('reward_details');
              }}
              className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-xs flex items-center space-x-3.5 cursor-pointer hover:border-slate-300 transition"
            >
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80"
                alt="30% OFF"
                className="w-16 h-16 rounded-2xl object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 leading-tight">30% off on next purchase</h4>
                  <span className="bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                    ACHIEVED
                  </span>
                </div>
                <p className="text-[11px] text-[#74111d] font-bold mt-1">2 STAMPS • Ready to claim! 🎉</p>
                <p className="text-[10px] text-slate-400 mt-0.5">EXPIRES 7/30/2026</p>
              </div>
            </div>

            {/* Reward 2: 50% discount */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-xs flex items-center space-x-3.5 opacity-80">
              <img
                src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80"
                alt="50% discount"
                className="w-16 h-16 rounded-2xl object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-black text-slate-900 leading-tight">50% discount</h4>
                <p className="text-[11px] text-slate-600 font-bold mt-1">5 STAMPS • Collect 2 more</p>
                <p className="text-[10px] text-slate-400 mt-0.5">EXPIRES 7/30/2026</p>
              </div>
            </div>

            {/* Reward 3: Free Coffee */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-xs flex items-center space-x-3.5 opacity-80">
              <img
                src="https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80"
                alt="Free Coffee"
                className="w-16 h-16 rounded-2xl object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-black text-slate-900 leading-tight">Free Coffee</h4>
                <p className="text-[11px] text-slate-600 font-bold mt-1">3 STAMPS • Collect 1 more</p>
                <p className="text-[10px] text-slate-400 mt-0.5">EXPIRES 7/30/2026</p>
              </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SCREEN 8: MY REWARDS & SCREEN 14: REWARD HISTORY (Batch 2 & 3) */}
      {/* ------------------------------------------------------------------- */}
      {currentScreen === 'rewards' && (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
          
          {/* Header Card (Responsive on Mobile and Laptop) */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 text-[#74111d] flex items-center justify-center shrink-0 shadow-xs">
                <Gift className="w-5 h-5 text-[#74111d]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  My Rewards &amp; Vouchers
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  Track unlocked vouchers, redeem in-store, and review past rewards
                </p>
              </div>
            </div>

            {/* Quick stats pills */}
            <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-3.5 py-2 text-center min-w-[75px]">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block">Active</span>
                <span className="text-base font-black text-emerald-800">
                  {rewardHistory.filter(r => r.status === 'Active').length}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-center min-w-[75px]">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Total</span>
                <span className="text-base font-black text-slate-800">{rewardHistory.length}</span>
              </div>
            </div>
          </div>

          {/* Segmented Tab Control: To Claim vs History */}
          <div className="bg-slate-100 p-1.5 rounded-2xl flex max-w-md shadow-xs">
            <button
              onClick={() => setRewardsSubTab('to_claim')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition cursor-pointer text-center ${
                rewardsSubTab === 'to_claim'
                  ? 'bg-white text-[#74111d] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Ready to Claim
            </button>

            <button
              onClick={() => setRewardsSubTab('history')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition cursor-pointer text-center flex items-center justify-center space-x-1.5 ${
                rewardsSubTab === 'history'
                  ? 'bg-white text-[#74111d] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>Reward History</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                rewardsSubTab === 'history' ? 'bg-[#74111d] text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {rewardHistory.length}
              </span>
            </button>
          </div>

          {/* TAB 1: TO CLAIM (Screen 8) */}
          {rewardsSubTab === 'to_claim' && (
            <div className="space-y-6">
              {/* Ready Rewards Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-black text-slate-900">Available at Participating Stores</h3>
                  <span className="text-xs text-slate-500 font-medium">1 reward unlocked</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Ready to Claim Card: Brew House */}
                  <div className="bg-white border-2 border-emerald-500/30 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80"
                            alt="Brew House"
                            className="w-12 h-12 rounded-2xl object-cover shadow-xs"
                          />
                          <div>
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                              Ready Now 🎉
                            </span>
                            <h4 className="text-sm font-black text-slate-900 mt-1">Buy 1 Get 1 Free</h4>
                            <p className="text-xs text-slate-500 font-medium">Brew House Bakery &amp; Bistro</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 text-xs text-emerald-800 font-medium flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>5 of 5 stamps collected! Ready to claim at checkout.</span>
                      </div>
                    </div>

                    <button
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
                      className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-black py-3 rounded-2xl text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
                    >
                      <Gift className="w-4 h-4 text-amber-300" />
                      <span>Claim This Reward</span>
                    </button>
                  </div>

                  {/* Progress Card: Ka-feen */}
                  <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80"
                            alt="Ka-feen"
                            className="w-12 h-12 rounded-2xl object-cover shadow-xs"
                          />
                          <div>
                            <span className="bg-rose-50 text-rose-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase border border-rose-100">
                              2 More Stamps
                            </span>
                            <h4 className="text-sm font-black text-slate-900 mt-1">30% off on next purchase</h4>
                            <p className="text-xs text-slate-500 font-medium">Ka-feen Coffee Shop</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-xs text-slate-600 font-medium flex items-center justify-between">
                        <span>Progress: 3/5 Stamps</span>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3].map(n => <BeAurexStamp key={n} stamped={true} size="xs" />)}
                          {[4, 5].map(n => <BeAurexStamp key={n} stamped={false} size="xs" />)}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={openScanScreen}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-2xl text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <QrCode className="w-4 h-4 text-[#74111d]" />
                      <span>Scan to Collect Stamps</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Help Card */}
              <div className="bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-100 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#74111d] text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Want to earn faster?</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Invite your friends to BeAurex and earn +1 bonus stamp plus ₹50 profit for every referral.</p>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentScreen('profile')}
                  className="bg-[#74111d] hover:bg-[#5e0c15] text-white font-bold py-2.5 px-5 rounded-xl text-xs transition cursor-pointer shrink-0 shadow-xs"
                >
                  Invite Friends
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: REWARD HISTORY (Screen 14) */}
          {rewardsSubTab === 'history' && (() => {
            const filteredHistory = rewardHistory.filter((item) => {
              if (historyFilter === 'All') return true;
              return item.status.toLowerCase() === historyFilter.toLowerCase();
            });

            return (
              <div className="space-y-4">
                {/* Filter pills: All, Active, Used, Expired */}
                <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                  {['All', 'Active', 'Used', 'Expired'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setHistoryFilter(f)}
                      className={`py-2 px-5 rounded-full text-xs font-bold transition cursor-pointer shrink-0 ${
                        historyFilter === f
                          ? 'bg-[#74111d] text-white shadow-xs'
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredHistory.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedHistoryVoucher(item)}
                        className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4 hover:border-slate-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center space-x-3 min-w-0">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-12 h-12 rounded-2xl object-cover shrink-0 shadow-xs"
                              />
                              <div className="min-w-0">
                                <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate leading-tight">
                                  {item.title}
                                </h4>
                                <p className="text-[11px] text-slate-500 font-medium mt-0.5">{item.storeName}</p>
                              </div>
                            </div>
                            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border shrink-0 ${
                              item.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : item.status === 'Used'
                                ? 'bg-slate-100 text-slate-600 border-slate-200'
                                : 'bg-rose-50 text-rose-600 border-rose-200'
                            }`}>
                              {item.status}
                            </span>
                          </div>

                          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2.5 flex items-center justify-between text-xs">
                            <span className="text-slate-400 text-[10px] uppercase font-bold">Voucher</span>
                            <span className="font-mono font-black text-[#74111d]">{item.voucherCode}</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                          <div>
                            <span className="text-slate-400 block text-[9px]">Claimed</span>
                            <span className="font-bold text-slate-700">{item.claimedDate}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px]">{item.dateLabel}</span>
                            <span className="font-bold text-slate-700">{item.dateValue}</span>
                          </div>
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                            <ChevronRight className="w-3.5 h-3.5" />
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
      {/* SCREEN 10: REWARD DETAILS (Batch 3) */}
      {/* ------------------------------------------------------------------- */}
      {currentScreen === 'reward_details' && (
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-5">
          {/* Top Bar with Back Arrow & Store info */}
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
            <button
              onClick={() => setCurrentScreen('after_scan')}
              className="p-1.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-[#111] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Coffee className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 leading-tight">Ka-feen</h2>
              <p className="text-[10px] text-slate-500 font-medium">Coffee Shop • Sector 29</p>
            </div>
          </div>

          {/* Reward Details Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
            <img
              src={selectedReward.image}
              alt={selectedReward.title}
              className="w-full h-48 sm:h-56 object-cover"
            />
            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    {selectedReward.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedReward.storeName}</p>
                </div>
                <span className="bg-rose-50 text-rose-700 text-xs font-bold px-3 py-1 rounded-full border border-rose-100 self-start sm:self-auto">
                  Requires {selectedReward.requiresStamps || 2} Stamps
                </span>
              </div>

              {/* Progress */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Your Progress</span>
                  <span>3 / 5 Stamps</span>
                </div>
                <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                  {[1, 2, 3].map((n) => (
                    <BeAurexStamp key={n} stamped={true} size="md" />
                  ))}
                  {[4, 5].map((n) => (
                    <BeAurexStamp key={n} stamped={false} size="md" />
                  ))}
                </div>
              </div>

              {/* Validity */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 pt-3 border-t border-slate-100">
                <span className="flex items-center space-x-1.5 text-slate-500">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Valid Till</span>
                </span>
                <span className="text-[#74111d] font-bold">{selectedReward.validTill}</span>
              </div>
            </div>
          </div>

          {/* Claim Button */}
          <button
            onClick={handleInitiateClaim}
            className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-black py-4 rounded-2xl text-xs sm:text-sm transition shadow-lg shadow-[#74111d]/20 cursor-pointer flex items-center justify-center space-x-2"
          >
            <Gift className="w-4 h-4 text-amber-300" />
            <span>Claim Now at Counter</span>
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SCREEN 12: WAITING FOR APPROVAL (Batch 3) */}
      {/* ------------------------------------------------------------------- */}
      {currentScreen === 'waiting_approval' && (
        <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-8 text-center space-y-6">
          {/* Top Bar */}
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-200 text-left">
            <button
              onClick={() => setCurrentScreen('reward_details')}
              className="p-1.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-[#111] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Coffee className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 leading-tight">Ka-feen</h2>
              <p className="text-[10px] text-slate-500 font-medium">Coffee Shop</p>
            </div>
          </div>

          {/* Hourglass Ring Loader */}
          <div className="pt-2 flex flex-col items-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-rose-100 border-t-[#74111d] flex items-center justify-center animate-spin">
              <Hourglass className="w-8 h-8 text-[#74111d]" />
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-5">Waiting for Merchant Approval</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm">
              Your claim request is being reviewed by the merchant at the billing counter.
            </p>
          </div>

          {/* Large Customer ID Card */}
          <div className="bg-rose-50/70 border border-rose-200/80 rounded-3xl p-6 sm:p-7 text-center space-y-2.5">
            <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-500 font-bold uppercase tracking-wider">
              <CreditCard className="w-4 h-4 text-[#74111d]" />
              <span>Customer Identification</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#74111d] tracking-widest">
              {customerUser.customerId}
            </div>
            <p className="text-xs text-slate-600 font-medium pt-1">
              Please share your Customer ID with the cashier to verify your reward.
            </p>
          </div>

          {/* Instant Sim Button */}
          <button
            onClick={() => {
              confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
              setCurrentScreen('reward_congrats');
            }}
            className="text-xs font-bold text-[#74111d] hover:underline cursor-pointer"
          >
            [Simulate Instant Cashier Approval]
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SCREEN 13: CONGRATULATIONS / REWARD CLAIMED (Batch 3) */}
      {/* ------------------------------------------------------------------- */}
      {currentScreen === 'reward_congrats' && (
        <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-8 text-center space-y-6">
          {/* Top Bar */}
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-200 text-left">
            <button
              onClick={() => setCurrentScreen('home')}
              className="p-1.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-[#111] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Coffee className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 leading-tight">Ka-feen</h2>
              <p className="text-[10px] text-slate-500 font-medium">Coffee Shop</p>
            </div>
          </div>

          {/* Green Checkmark Circle & Congratulations */}
          <div className="pt-2 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-emerald-600 mt-4">Reward Claimed!</h3>
            <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">Enjoy your reward 🎉</p>
          </div>

          {/* Voucher Summary Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs text-left space-y-3">
            <div className="flex items-center space-x-3.5">
              <img
                src={selectedReward.image}
                alt={selectedReward.title}
                className="w-14 h-14 rounded-2xl object-cover shrink-0 shadow-xs"
              />
              <div className="min-w-0">
                <h4 className="text-sm font-black text-slate-900 leading-snug">{selectedReward.title}</h4>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Ka-feen Coffee</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
              <span className="flex items-center space-x-1.5 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Approved On</span>
              </span>
              <span>20 May 2026, 11:45 AM</span>
            </div>
          </div>

          {/* Done CTA */}
          <button
            onClick={() => setCurrentScreen('home')}
            className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-black py-4 rounded-2xl text-xs sm:text-sm transition shadow-lg shadow-[#74111d]/20 cursor-pointer"
          >
            Done &amp; Return to Home
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SCREEN 9: PROFILE (Batch 2) */}
      {/* ------------------------------------------------------------------- */}
      {currentScreen === 'profile' && (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
          
          {/* Top Header Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCurrentScreen('home')}
                className="p-1.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 cursor-pointer sm:hidden"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="w-11 h-11 rounded-2xl bg-rose-100 text-[#74111d] flex items-center justify-center shrink-0 shadow-xs">
                <User className="w-5 h-5 text-[#74111d]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  Customer Profile &amp; Referrals
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  Manage your account, view referral earnings, and share invite links
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold px-3 py-1.5 rounded-2xl flex items-center space-x-1.5">
                <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{customerUser.tier}</span>
              </span>
            </div>
          </div>

          {/* 2-Column Responsive Layout: Left (5 cols) Profile & Actions, Right (7 cols) Refer & Earn Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Left Column (5 cols): Profile Info, Contact, Policies & Logout */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* User Profile Card */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-rose-100 text-[#74111d] font-black text-xl flex items-center justify-center shrink-0 shadow-xs ring-2 ring-[#74111d]/20">
                    {customerUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight truncate">
                      {customerUser.name}
                    </h3>
                    <div className="flex items-center space-x-1.5 mt-1 text-xs text-slate-500 font-mono">
                      <span>ID: {customerUser.customerId}</span>
                      <button
                        onClick={() => handleCopyCustomer(customerUser.customerId)}
                        className="hover:text-slate-900 cursor-pointer p-0.5"
                        title="Copy Customer ID"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {copiedId && <span className="text-[10px] text-emerald-600 font-sans font-bold">Copied!</span>}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                  <div className="bg-slate-50 rounded-2xl p-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Member Since</span>
                    <span className="text-xs font-bold text-slate-800">{customerUser.memberSince}</span>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Membership</span>
                    <span className="text-xs font-bold text-amber-700">{customerUser.tier}</span>
                  </div>
                </div>
              </div>

              {/* Contact Details List */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-3 shadow-xs divide-y divide-slate-100">
                <div className="flex items-center space-x-3.5 p-3.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Phone Number</span>
                    <span className="text-xs font-bold text-slate-800">{customerUser.phone}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3.5 p-3.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Email Address</span>
                    <span className="text-xs font-bold text-slate-800">{customerUser.email}</span>
                  </div>
                </div>
              </div>

              {/* Settings / Policies Navigation Rows */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-2.5 shadow-xs divide-y divide-slate-100">
                <div 
                  onClick={() => {
                    setLegalModalTab('privacy');
                    setLegalModalOpen(true);
                  }}
                  className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl cursor-pointer transition"
                >
                  <div className="flex items-center space-x-3.5">
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-800">Privacy Policy</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>

                <div 
                  onClick={() => {
                    setLegalModalTab('terms');
                    setLegalModalOpen(true);
                  }}
                  className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl cursor-pointer transition"
                >
                  <div className="flex items-center space-x-3.5">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-800">Terms &amp; Conditions</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>

                <div 
                  onClick={handleLogout}
                  className="flex items-center justify-between p-3.5 hover:bg-rose-50/50 rounded-2xl cursor-pointer transition"
                >
                  <div className="flex items-center space-x-3.5 text-rose-600">
                    <LogOut className="w-4 h-4" />
                    <span className="text-xs font-black">Logout</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-rose-600" />
                </div>
              </div>

            </div>

            {/* Right Column (7 cols): Refer & Earn Card + How Referrals Work Guide */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Refer & Earn Rewards Card (Shows Customer Profit & Invite CTA) */}
              <div className="bg-gradient-to-br from-[#74111d] via-[#8c1725] to-[#550c14] text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden space-y-5">
                {/* Background glowing shapes */}
                <div className="absolute -right-6 -bottom-6 w-44 h-44 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
                <div className="absolute -left-6 -top-6 w-32 h-32 bg-white/5 rounded-full blur-lg pointer-events-none" />

                {/* Header with Gift badge */}
                <div className="flex items-start justify-between relative z-10">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30 text-[10px] font-black uppercase tracking-wider">
                      <Gift className="w-3.5 h-3.5 text-amber-300" />
                      <span>Refer &amp; Earn Profit</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black tracking-tight text-white pt-1">
                      Invite Friends, Get Free Stamps &amp; Cash!
                    </h3>
                    <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed max-w-lg">
                      Share your unique referral code. When your friends join and scan, they get 10% off and you receive direct profit on your account.
                    </p>
                  </div>
                </div>

                {/* Profit Breakdown Matrix */}
                <div className="grid grid-cols-2 gap-3 relative z-10 pt-1">
                  <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-3.5 sm:p-4">
                    <span className="text-[10px] font-bold text-amber-300 uppercase block tracking-wider">Your Profit</span>
                    <p className="text-base sm:text-lg font-black text-white mt-1">+1 Free Stamp</p>
                    <p className="text-xs text-rose-200 mt-0.5 font-medium">+ ₹50 Wallet Credit / friend</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-3.5 sm:p-4">
                    <span className="text-[10px] font-bold text-emerald-300 uppercase block tracking-wider">Friend's Profit</span>
                    <p className="text-base sm:text-lg font-black text-white mt-1">10% OFF</p>
                    <p className="text-xs text-rose-200 mt-0.5 font-medium">Instant welcome voucher</p>
                  </div>
                </div>

                {/* Your Referral Stats */}
                <div className="bg-black/25 rounded-2xl p-3.5 sm:p-4 flex items-center justify-around text-center border border-white/10 relative z-10">
                  <div>
                    <span className="text-[10px] text-rose-200 block font-medium">Invited</span>
                    <span className="text-lg font-black text-amber-300">{customerUser.referralCount || 0} friends</span>
                  </div>
                  <div className="h-7 w-px bg-white/20"></div>
                  <div>
                    <span className="text-[10px] text-rose-200 block font-medium">Bonus Stamps</span>
                    <span className="text-lg font-black text-white">{customerUser.referralCount || 0} stamps</span>
                  </div>
                  <div className="h-7 w-px bg-white/20"></div>
                  <div>
                    <span className="text-[10px] text-rose-200 block font-medium">Cash Profit</span>
                    <span className="text-lg font-black text-emerald-300">₹{customerUser.referralEarnings || 0}</span>
                  </div>
                </div>

                {/* Referral Code & Copy Bar */}
                <div className="bg-white/10 border border-white/20 rounded-2xl p-3 flex items-center justify-between relative z-10">
                  <div className="pl-2">
                    <span className="text-[9px] uppercase tracking-wider text-rose-200 block font-bold">Your Referral Code</span>
                    <span className="font-mono text-sm sm:text-base font-black text-white tracking-widest">{customerUser.referralCode || 'BEAUREX-8F4A'}</span>
                  </div>
                  <button
                    onClick={() => handleCopyReferralCode(customerUser.referralCode || 'BEAUREX-8F4A')}
                    className="bg-white text-[#74111d] hover:bg-rose-50 font-black px-4 py-2.5 rounded-xl text-xs transition flex items-center space-x-1.5 cursor-pointer shadow-sm shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedReferral ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>

                {/* Action Buttons: WhatsApp Share & Native Invite */}
                <div className="grid grid-cols-2 gap-3 relative z-10 pt-1">
                  <button
                    onClick={handleWhatsAppShare}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3.5 px-4 rounded-2xl text-xs sm:text-sm transition flex items-center justify-center space-x-2 cursor-pointer shadow-md"
                  >
                    <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                    <span>Share WhatsApp</span>
                  </button>
                  <button
                    onClick={handleShareReferral}
                    className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black py-3.5 px-4 rounded-2xl text-xs sm:text-sm transition flex items-center justify-center space-x-2 cursor-pointer shadow-md"
                  >
                    <Share2 className="w-4 h-4 shrink-0" />
                    <span>Invite &amp; Earn</span>
                  </button>
                </div>
              </div>

              {/* How Referrals Work Explainer Card */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
                <h4 className="text-sm font-black text-slate-900">How It Works in 3 Easy Steps</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-50 rounded-2xl p-3.5 space-y-1.5">
                    <div className="w-7 h-7 rounded-xl bg-[#74111d] text-white text-xs font-black flex items-center justify-center">
                      1
                    </div>
                    <h5 className="text-xs font-black text-slate-900">Share Your Code</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Send your link or referral code to friends via WhatsApp or social apps.
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3.5 space-y-1.5">
                    <div className="w-7 h-7 rounded-xl bg-[#74111d] text-white text-xs font-black flex items-center justify-center">
                      2
                    </div>
                    <h5 className="text-xs font-black text-slate-900">Friend Visits &amp; Scans</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Your friend joins with your code and gets 10% instant discount at checkout.
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3.5 space-y-1.5">
                    <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center justify-center">
                      3
                    </div>
                    <h5 className="text-xs font-black text-slate-900">Earn Profit</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      You instantly receive +1 Free Stamp and ₹50 profit credited to your account!
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* PERSISTENT BOTTOM NAVIGATION BAR (Screens 5, 7, 8, 9) - Mobile Only */}
      {/* ------------------------------------------------------------------- */}
      {currentScreen !== 'scan' && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-4 sm:px-6 py-2 flex items-center justify-around shadow-2xl md:hidden">
          {/* Home Tab */}
          <button
            onClick={() => setCurrentScreen('home')}
            className={`flex flex-col items-center justify-center py-1 transition cursor-pointer flex-1 ${
              currentScreen === 'home' ? 'text-[#74111d]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-black mt-1">Home</span>
          </button>

          {/* Rewards Tab */}
          <button
            onClick={() => {
              setRewardsSubTab('to_claim');
              setCurrentScreen('rewards');
            }}
            className={`flex flex-col items-center justify-center py-1 transition cursor-pointer flex-1 relative ${
              currentScreen === 'rewards' ? 'text-[#74111d]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="relative">
              <Gift className="w-5 h-5" />
              {rewardHistory.length > 0 && (
                <span className="absolute -top-1 -right-2.5 w-4 h-4 rounded-full bg-[#74111d] text-white text-[9px] font-black flex items-center justify-center">
                  {rewardHistory.length}
                </span>
              )}
            </div>
            <span className="text-[10px] font-black mt-1">Rewards</span>
          </button>

          {/* Center Floating Red Scan Button */}
          <div className="flex-1 flex justify-center">
            <button
              onClick={openScanScreen}
              className="-mt-7 w-14 h-14 rounded-full bg-[#74111d] hover:bg-[#5e0c15] text-white flex items-center justify-center shadow-xl shadow-[#74111d]/40 border-4 border-white transition transform active:scale-95 cursor-pointer"
              aria-label="Scan QR Code"
            >
              <QrCode className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* Profile & Refer Tab */}
          <button
            onClick={() => setCurrentScreen('profile')}
            className={`flex flex-col items-center justify-center py-1 transition cursor-pointer flex-1 ${
              currentScreen === 'profile' ? 'text-[#74111d]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-black mt-1">Profile</span>
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
                <div className="text-base font-black font-mono text-[#74111d] tracking-wider">
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
                className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-extrabold py-3 rounded-xl text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

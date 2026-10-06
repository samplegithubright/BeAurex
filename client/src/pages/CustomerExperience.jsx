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
  Crown, CreditCard
} from 'lucide-react';

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

  // Utility modals/screens
  const [cameraPermissionModalOpen, setCameraPermissionModalOpen] = useState(false);
  const [noInternetModalOpen, setNoInternetModalOpen] = useState(false);
  const [googleSignInModalOpen, setGoogleSignInModalOpen] = useState(false);
  const [emptyStateDemo, setEmptyStateDemo] = useState(false); // Screen 17 demo toggle
  const [splashLoading, setSplashLoading] = useState(false);

  // Customer Profile State matching Screen 5 & 9 (Ajeet Kumar / LQR-8F4A29)
  const [customerUser, setCustomerUser] = useState(() => {
    const saved = localStorage.getItem('beaurex_customer_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: 'Ajeet Kumar',
      customerId: 'LQR-8F4A29',
      phone: '+91 98765 43210',
      email: 'ajeet.kumar@gmail.com',
      tier: 'Gold Member',
      memberSince: 'Jul 2026',
      activeCardsCount: 4,
      rewardsRedeemedCount: 3,
      points: 250,
      stamps: 3,
      totalStamps: 5
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

  // Sign in / Sign up form states
  const [authMode, setAuthMode] = useState(initialAuthMode || 'signin');
  const [authMethod, setAuthMethod] = useState('phone'); // 'phone' | 'email'
  const [loginPhone, setLoginPhone] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginName, setLoginName] = useState('');
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [loginOtp, setLoginOtp] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccessMsg, setLoginSuccessMsg] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

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

  // Request Customer OTP (Phone or Email)
  const handleRequestOtp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoginError('');
    setLoginSuccessMsg('');
    
    if (authMethod === 'phone' && (!loginPhone || loginPhone.replace(/\D/g, '').length !== 10)) {
      setLoginError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (authMethod === 'email' && (!loginEmail || !loginEmail.includes('@'))) {
      setLoginError('Please enter a valid email address.');
      return;
    }
    if (authMode === 'signup' && !loginName.trim()) {
      setLoginError('Please enter your full name to create an account.');
      return;
    }

    setLoginLoading(true);
    try {
      const res = await fetch('/api/customer/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: loginPhone.replace(/\D/g, ''),
          email: loginEmail.trim().toLowerCase(),
          isSignup: authMode === 'signup'
        })
      });
      const data = await res.json();
      setLoginLoading(false);

      if (data && data.success) {
        setLoginOtpSent(true);
        setResendCooldown(30);
        setLoginSuccessMsg(data.message || 'OTP sent successfully!');
        if (data.devOtp) {
          setLoginOtp(data.devOtp);
        }
      } else if (data && data.notRegistered) {
        setAuthMode('signup');
        setLoginError(`${data.message || 'Mobile not registered.'} Please complete quick signup below.`);
      } else {
        // Fallback for demo/offline
        setLoginOtpSent(true);
        setLoginOtp('123456');
        setResendCooldown(30);
        setLoginSuccessMsg('Demo OTP: 123456 generated for testing.');
      }
    } catch (_) {
      setLoginLoading(false);
      setLoginOtpSent(true);
      setLoginOtp('123456');
      setResendCooldown(30);
      setLoginSuccessMsg('Demo OTP: 123456 generated for testing.');
    }
  };

  // Verify Customer OTP
  const handleVerifyOtp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoginError('');
    if (!loginOtp || loginOtp.length < 4) {
      setLoginError('Please enter the 6-digit verification code.');
      return;
    }

    setLoginLoading(true);
    try {
      const res = await fetch('/api/customer/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: loginPhone.replace(/\D/g, ''),
          email: loginEmail.trim().toLowerCase(),
          otp: loginOtp,
          name: loginName || 'Customer'
        })
      });
      const data = await res.json();
      setLoginLoading(false);

      const cust = (data && data.success && data.customer) ? data.customer : {
        name: loginName || (loginPhone ? `User ${loginPhone.slice(-4)}` : 'Ajeet Kumar'),
        customerId: `LQR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        phone: loginPhone ? `+91 ${loginPhone.slice(-10)}` : '+91 98765 43210',
        email: loginEmail || 'ajeet.kumar@gmail.com',
        tier: 'Member',
        memberSince: 'Today',
        activeCardsCount: 1,
        rewardsRedeemedCount: 0,
        points: 50,
        stamps: 1,
        totalStamps: 5
      };

      setCustomerUser(cust);
      localStorage.setItem('beaurex_customer_user', JSON.stringify(cust));
      localStorage.setItem('beaurex_customer_auth', 'true');
      setIsAuthenticated(true);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      if (slug) setCurrentScreen('after_scan');
      else setCurrentScreen('home');
    } catch (_) {
      setLoginLoading(false);
      const cust = {
        name: loginName || 'Ajeet Kumar',
        customerId: 'LQR-8F4A29',
        phone: loginPhone ? `+91 ${loginPhone.slice(-10)}` : '+91 98765 43210',
        email: loginEmail || 'ajeet.kumar@gmail.com',
        tier: 'Gold Member',
        memberSince: 'Jul 2026',
        activeCardsCount: 4,
        rewardsRedeemedCount: 3,
        points: 250,
        stamps: 3,
        totalStamps: 5
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

  // Quick 1-Tap Demo Login
  const handleQuickDemoLogin = (profileType = 'gold') => {
    const cust = profileType === 'gold' ? {
      name: 'Ajeet Kumar',
      customerId: 'LQR-8F4A29',
      phone: '+91 98765 43210',
      email: 'ajeet.kumar@gmail.com',
      tier: 'Gold Member',
      memberSince: 'Jul 2026',
      activeCardsCount: 4,
      rewardsRedeemedCount: 3,
      points: 250,
      stamps: 3,
      totalStamps: 5
    } : {
      name: 'Sumit Verma',
      customerId: 'LQR-9B1C44',
      phone: '+91 98112 33445',
      email: 'sumit.verma@gmail.com',
      tier: 'Silver Member',
      memberSince: 'Aug 2026',
      activeCardsCount: 2,
      rewardsRedeemedCount: 1,
      points: 120,
      stamps: 2,
      totalStamps: 5
    };
    setCustomerUser(cust);
    localStorage.setItem('beaurex_customer_user', JSON.stringify(cust));
    localStorage.setItem('beaurex_customer_auth', 'true');
    setIsAuthenticated(true);
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    if (slug) setCurrentScreen('after_scan');
    else setCurrentScreen('home');
  };

  // Google Sign-In Handler
  const handleGoogleSignInSelect = async (accountEmail, accountName) => {
    setGoogleLoading(true);
    try {
      const res = await fetch('/api/customer/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: accountEmail || 'ajeet.kumar@gmail.com',
          name: accountName || 'Ajeet Kumar',
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
        setCustomerUser(prev => ({
          ...prev,
          name: accountName || 'Ajeet Kumar',
          email: accountEmail || 'ajeet.kumar@gmail.com'
        }));
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
    setLoginOtpSent(false);
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
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#74111d] flex items-center justify-center text-white font-black text-sm shadow-xs">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-black text-slate-900 tracking-tight leading-none block">
                Loyal<span className="text-[#74111d]">QR</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Counter Scan &amp; Earn
              </span>
            </div>
          </div>
          <Link to="/" className="text-xs font-bold text-slate-500 hover:text-slate-800">
            Home
          </Link>
        </header>

        <main className="flex-1 max-w-md w-full mx-auto p-4 flex flex-col justify-center">
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
                  handleGoogleSignInSelect('ajeet.kumar@gmail.com', 'Ajeet Kumar');
                }}
                className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-black py-3.5 px-4 rounded-2xl text-xs transition shadow-md shadow-[#74111d]/20 cursor-pointer flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4 text-amber-200" />
                <span>1-Tap Sign In (Ajeet Kumar) &amp; Collect Stamp</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              Sign in once to save your stamps &amp; rewards safely across all participating stores.
            </p>
          </div>
        </main>

        <footer className="text-center p-4 text-xs text-slate-400">
          Powered by LoyalQR Loyalty Network
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

              <p className="text-xs text-slate-500">Choose an account to continue to LoyalQR</p>

              <div className="space-y-2">
                <button
                  onClick={() => handleGoogleSignInSelect('ajeet.kumar@gmail.com', 'Ajeet Kumar')}
                  className="w-full p-3 rounded-2xl border border-slate-200 hover:border-[#74111d] hover:bg-rose-50/40 text-left flex items-center space-x-3 transition cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-rose-100 text-[#74111d] font-bold text-xs flex items-center justify-center shrink-0">
                    AK
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900">Ajeet Kumar</div>
                    <div className="text-[11px] text-slate-500 truncate">ajeet.kumar@gmail.com</div>
                  </div>
                </button>

                <button
                  onClick={() => handleGoogleSignInSelect('sumit.verma@gmail.com', 'Sumit Verma')}
                  className="w-full p-3 rounded-2xl border border-slate-200 hover:border-[#74111d] hover:bg-rose-50/40 text-left flex items-center space-x-3 transition cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                    SV
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900">Sumit Verma</div>
                    <div className="text-[11px] text-slate-500 truncate">sumit.verma@gmail.com</div>
                  </div>
                </button>
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
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#74111d] flex items-center justify-center text-white font-black text-sm shadow-xs">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-black text-slate-900 tracking-tight leading-none block">
                Loyal<span className="text-[#74111d]">QR</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Customer Rewards Portal
              </span>
            </div>
          </div>
          <Link to="/" className="text-xs font-bold text-slate-500 hover:text-slate-800">
            Back to Home
          </Link>
        </header>

        <main className="flex-1 max-w-md w-full mx-auto p-4 flex flex-col justify-center">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
            
            {/* Header Icon & Title */}
            <div className="text-center space-y-1">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#74111d] border border-rose-200 flex items-center justify-center mx-auto shadow-xs">
                <Gift className="w-7 h-7 text-[#74111d]" />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight mt-2">
                {authMode === 'signup' ? 'Create Customer Account' : 'Welcome to LoyalQR'}
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
                  setLoginOtpSent(false);
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
                  setLoginOtpSent(false);
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

            {/* Form */}
            {!loginOtpSent ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                {/* Sign-up Name Field */}
                {authMode === 'signup' && (
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
                        placeholder="e.g. Ajeet Kumar"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs focus:outline-none focus:border-[#74111d] focus:bg-white text-slate-900 font-bold transition"
                      />
                    </div>
                  </div>
                )}

                {/* Sub-toggle: Phone vs Email for Sign In */}
                {authMode === 'signin' && (
                  <div className="flex items-center justify-between text-xs pb-1">
                    <span className="font-bold text-slate-600 uppercase text-[11px]">Sign in with:</span>
                    <div className="flex items-center space-x-2 font-bold text-xs">
                      <button
                        type="button"
                        onClick={() => setAuthMethod('phone')}
                        className={`cursor-pointer ${authMethod === 'phone' ? 'text-[#74111d] underline font-black' : 'text-slate-400'}`}
                      >
                        Mobile Number
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => setAuthMethod('email')}
                        className={`cursor-pointer ${authMethod === 'email' ? 'text-[#74111d] underline font-black' : 'text-slate-400'}`}
                      >
                        Email
                      </button>
                    </div>
                  </div>
                )}

                {/* Mobile Input */}
                {(authMethod === 'phone' || authMode === 'signup') && (
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                      10-Digit Mobile Number *
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3 text-xs font-bold text-slate-500 pointer-events-none flex items-center space-x-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="98765 43210"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-16 pr-3.5 py-2.5 text-xs focus:outline-none focus:border-[#74111d] focus:bg-white text-slate-900 font-mono font-bold transition"
                      />
                    </div>
                  </div>
                )}

                {/* Email Input (if email method or optional in signup) */}
                {(authMethod === 'email' || authMode === 'signup') && (
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                      Email Address {authMode === 'signup' ? '(Optional)' : '*'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required={authMethod === 'email'}
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="you@gmail.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs focus:outline-none focus:border-[#74111d] focus:bg-white text-slate-900 font-bold transition"
                      />
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-[#74111d]/20 transition cursor-pointer text-xs flex items-center justify-center space-x-2"
                >
                  {loginLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending verification code...</span>
                    </>
                  ) : (
                    <>
                      <span>{authMode === 'signup' ? 'Continue with Mobile Verification' : 'Send Verification Code (OTP)'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* OTP VERIFICATION STEP */
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-600">
                    Code sent to: <strong className="text-slate-900">{authMethod === 'phone' ? `+91 ${loginPhone}` : loginEmail}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setLoginOtpSent(false)}
                    className="text-[#74111d] font-bold underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    Enter 6-Digit OTP Code
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={loginOtp}
                      onChange={(e) => setLoginOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-center text-sm focus:outline-none focus:border-[#74111d] focus:bg-white text-slate-900 font-mono font-black tracking-widest transition"
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
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify &amp; Access My Loyalty Cards</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    disabled={resendCooldown > 0}
                    onClick={handleRequestOtp}
                    className={`font-bold transition cursor-pointer ${
                      resendCooldown > 0 ? 'text-slate-400' : 'text-[#74111d] hover:underline'
                    }`}
                  >
                    {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginOtp('123456');
                      setLoginSuccessMsg('Auto-filled test code: 123456');
                    }}
                    className="text-slate-400 hover:text-slate-600 text-[11px]"
                  >
                    Fill Demo Code
                  </button>
                </div>
              </form>
            )}

            {/* Divider: or continue with */}
            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-slate-400 font-medium">or continue with</span>
              </div>
            </div>

            {/* Alternative One-Tap Logins */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => setGoogleSignInModalOpen(true)}
                className="w-full bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800 font-bold py-3 px-4 rounded-2xl text-xs transition flex items-center justify-center space-x-3 shadow-xs cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('gold')}
                className="w-full bg-rose-50/70 hover:bg-rose-100/70 border border-rose-200 text-[#74111d] font-black py-2.5 px-4 rounded-2xl text-xs transition cursor-pointer flex items-center justify-center space-x-2"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>1-Tap Demo Login (Ajeet Kumar • Gold Member)</span>
              </button>
            </div>

          </div>
        </main>

        <footer className="text-center p-4 text-xs text-slate-400">
          Powered by LoyalQR Customer Loyalty Platform
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

              <p className="text-xs text-slate-500">Choose an account to continue to LoyalQR</p>

              <div className="space-y-2">
                <button
                  onClick={() => handleGoogleSignInSelect('ajeet.kumar@gmail.com', 'Ajeet Kumar')}
                  className="w-full p-3 rounded-2xl border border-slate-200 hover:border-[#74111d] hover:bg-rose-50/40 text-left flex items-center space-x-3 transition cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-rose-100 text-[#74111d] font-bold text-xs flex items-center justify-center shrink-0">
                    AK
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900">Ajeet Kumar</div>
                    <div className="text-[11px] text-slate-500 truncate">ajeet.kumar@gmail.com</div>
                  </div>
                </button>

                <button
                  onClick={() => handleGoogleSignInSelect('sumit.verma@gmail.com', 'Sumit Verma')}
                  className="w-full p-3 rounded-2xl border border-slate-200 hover:border-[#74111d] hover:bg-rose-50/40 text-left flex items-center space-x-3 transition cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                    SV
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900">Sumit Verma</div>
                    <div className="text-[11px] text-slate-500 truncate">sumit.verma@gmail.com</div>
                  </div>
                </button>
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-[#74111d] selection:text-white pb-20">
      
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
      {/* SCREEN 5: HOME (Batch 2) */}
      {/* ------------------------------------------------------------------- */}
      {currentScreen === 'home' && (
        <div className="space-y-4 max-w-md w-full mx-auto">
          
          {/* Top Crimson Header */}
          <div className="bg-[#74111d] text-white p-6 rounded-b-[36px] shadow-lg relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs text-rose-200 font-medium block">Good Evening,</span>
                <h1 className="text-xl font-black tracking-tight text-white">{customerUser.name}</h1>
                <div className="flex items-center space-x-1.5 mt-0.5 text-xs text-rose-200/90 font-mono">
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

              {/* Profile Avatar Trigger */}
              <button
                onClick={() => setCurrentScreen('profile')}
                className="w-10 h-10 rounded-full border-2 border-white/60 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
                title="View Profile"
              >
                <User className="w-5 h-5" />
              </button>
            </div>

            {/* Gold Member Card */}
            <div className="mt-5 bg-gradient-to-r from-[#941c2b] to-[#600e18] border border-rose-300/30 rounded-2xl p-4 shadow-sm flex items-center space-x-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-300/40 text-amber-300 flex items-center justify-center shrink-0">
                <Crown className="w-5 h-5 fill-amber-300 text-amber-300" />
              </div>
              <div>
                <h4 className="text-sm font-black text-amber-200 tracking-tight leading-tight">{customerUser.tier}</h4>
                <p className="text-[11px] text-rose-200/80 font-medium">Member Since • {customerUser.memberSince}</p>
              </div>
            </div>
          </div>

          <div className="px-4 space-y-4">
            
            {/* Summary Metrics Row (Active Cards & Redeemed) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="text-[11px] text-slate-500 font-bold leading-tight">Active<br />Loyalty Cards</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{customerUser.activeCardsCount}</div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                  <Gift className="w-4 h-4" />
                </div>
                <div className="text-[11px] text-slate-500 font-bold leading-tight">Rewards<br />Redeemed</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{customerUser.rewardsRedeemedCount}</div>
              </div>
            </div>

            {/* Empty State Toggle (for Screen 17 demonstration) */}
            {emptyStateDemo ? (
              /* ------------------------------------------------------------- */
              /* SCREEN 17: EMPTY STATE (Batch 3 & Batch 5) */
              /* ------------------------------------------------------------- */
              <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4 shadow-xs">
                <div className="w-24 h-24 rounded-full bg-rose-50 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-12 h-12 text-rose-300 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-black text-slate-900">No Loyalty Cards Yet</h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                  You haven't joined any loyalty programs yet. Scan a QR code at any business to start collecting stamps and earn exciting rewards!
                </p>
                <button
                  onClick={openScanScreen}
                  className="bg-[#74111d] hover:bg-[#5e0c15] text-white font-bold py-3.5 px-6 rounded-2xl text-xs transition flex items-center justify-center space-x-2 mx-auto cursor-pointer shadow-md"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Scan QR Code</span>
                </button>
                <button
                  onClick={() => setEmptyStateDemo(false)}
                  className="text-[11px] text-slate-400 hover:text-slate-600 underline block mx-auto cursor-pointer"
                >
                  Show Active Loyalty Cards
                </button>
              </div>
            ) : (
              /* Continue Collecting Section */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900">Continue Collecting</h3>
                  <button
                    onClick={() => setEmptyStateDemo(true)}
                    className="text-xs font-bold text-[#74111d] hover:underline cursor-pointer"
                  >
                    View Empty State
                  </button>
                </div>

                {/* Card 1: Ka-feen Coffee Shop */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-4 hover:border-slate-300 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 rounded-2xl bg-[#111111] text-white flex items-center justify-center shadow-xs">
                        <Coffee className="w-5 h-5 text-amber-200" />
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
                        <div key={n} className="w-7 h-7 rounded-full bg-[#74111d] flex items-center justify-center text-white text-xs shadow-xs">
                          <Star className="w-3.5 h-3.5 fill-white text-white" />
                        </div>
                      ))}
                      {[4, 5].map((n) => (
                        <div key={n} className="w-7 h-7 rounded-full border-2 border-slate-200 bg-slate-50 flex items-center justify-center text-slate-300 text-xs">
                          ○
                        </div>
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400 font-bold">3 of 5 Stamps</span>
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
                    className="bg-rose-50/70 border border-rose-100 rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:bg-rose-100/50 transition"
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
                <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 rounded-2xl bg-amber-950 text-white flex items-center justify-center shadow-xs">
                        <Utensils className="w-5 h-5 text-amber-200" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 leading-tight">Brew House</h4>
                        <p className="text-[11px] text-slate-500 font-medium">Bakery &amp; Bistro</p>
                      </div>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-100">
                      Reward Ready 🎉
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-1.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <div key={n} className="w-7 h-7 rounded-full bg-[#0e5c36] flex items-center justify-center text-white text-xs shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ))}
                    </div>
                    <span className="text-[11px] text-emerald-700 font-bold">5 of 5 Stamps Collected!</span>
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
        <div className="space-y-4 max-w-md w-full mx-auto px-4 pt-3">
          {/* Top Bar with Back Arrow & Store info */}
          <div className="flex items-center space-x-3 pb-2 border-b border-slate-200">
            <button
              onClick={() => setCurrentScreen('home')}
              className="p-1 text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="w-8 h-8 rounded-xl bg-[#111] text-white flex items-center justify-center shrink-0">
              <Coffee className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 leading-tight">Ka-feen</h2>
              <p className="text-[10px] text-slate-500 font-medium">Coffee Shop</p>
            </div>
          </div>

          {/* Stamp Earned Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 text-center shadow-xs space-y-3">
            <h3 className="text-sm font-black text-slate-900">You earned 1 stamp!</h3>
            <p className="text-xs text-slate-500">3 of 5 stamps collected</p>
            <div className="flex items-center justify-center space-x-2 py-1">
              {[1, 2, 3].map((n) => (
                <div key={n} className="w-8 h-8 rounded-full bg-[#74111d] flex items-center justify-center text-white text-xs shadow-xs">
                  <Star className="w-4 h-4 fill-white text-white" />
                </div>
              ))}
              {[4, 5].map((n) => (
                <div key={n} className="w-8 h-8 rounded-full border-2 border-slate-200 bg-slate-50 flex items-center justify-center text-slate-300 text-xs">
                  ○
                </div>
              ))}
            </div>
          </div>

          {/* Available Rewards Section */}
          <div className="space-y-3 pt-1">
            <h3 className="text-sm font-black text-slate-900">Available Rewards</h3>

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
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SCREEN 8: MY REWARDS & SCREEN 14: REWARD HISTORY (Batch 2 & 3) */}
      {/* ------------------------------------------------------------------- */}
      {currentScreen === 'rewards' && (
        <div className="space-y-4 max-w-md w-full mx-auto px-4 pt-4">
          {/* Top Bar with My Rewards title & Profile avatar */}
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">My Rewards</h2>
            <button
              onClick={() => setCurrentScreen('profile')}
              className="w-8 h-8 rounded-full border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
            >
              <User className="w-4 h-4" />
            </button>
          </div>

          {/* Segmented Tab Control: To Claim vs History (2) */}
          <div className="border-b border-slate-200 flex">
            <button
              onClick={() => setRewardsSubTab('to_claim')}
              className={`flex-1 pb-2.5 text-xs font-black transition cursor-pointer relative ${
                rewardsSubTab === 'to_claim' ? 'text-[#74111d]' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <span>To Claim</span>
              {rewardsSubTab === 'to_claim' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#74111d] rounded-full"></div>
              )}
            </button>

            <button
              onClick={() => setRewardsSubTab('history')}
              className={`flex-1 pb-2.5 text-xs font-black transition cursor-pointer relative flex items-center justify-center space-x-1.5 ${
                rewardsSubTab === 'history' ? 'text-[#74111d]' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <span>History</span>
              <span className="w-4 h-4 rounded-full bg-[#74111d] text-white text-[9px] font-bold flex items-center justify-center">
                2
              </span>
              {rewardsSubTab === 'history' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#74111d] rounded-full"></div>
              )}
            </button>
          </div>

          {/* TAB 1: TO CLAIM (Screen 8) */}
          {rewardsSubTab === 'to_claim' && (
            <div className="space-y-4 pt-6">
              {/* Empty state matching Screen 8 */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-8 text-center space-y-4 shadow-xs">
                <div className="w-20 h-20 rounded-3xl bg-amber-50 flex items-center justify-center mx-auto text-amber-500 shadow-xs border border-amber-100">
                  <Gift className="w-10 h-10 text-amber-600" />
                </div>
                <h3 className="text-base font-black text-slate-900">No Rewards Yet</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Collect more stamps from your favourite businesses to earn exciting rewards!
                </p>
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="bg-[#74111d] hover:bg-[#5e0c15] text-white font-bold py-3 px-6 rounded-2xl text-xs transition cursor-pointer mx-auto shadow-md"
                >
                  Explore Businesses
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: REWARD HISTORY (Screen 14) */}
          {rewardsSubTab === 'history' && (
            <div className="space-y-3.5 pt-1">
              {/* Filter pills: All, Active, Used, Expired */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                {['All', 'Active', 'Used', 'Expired'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setHistoryFilter(f)}
                    className={`py-1.5 px-4 rounded-full text-xs font-bold transition cursor-pointer ${
                      historyFilter === f
                        ? 'bg-[#74111d] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* History Cards */}
              <div className="space-y-3">
                {/* Card 1: Used 30% */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3 hover:border-slate-300 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0">
                      <img
                        src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80"
                        alt="30% off"
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-slate-900 truncate">30% off on next purchase</h4>
                        <p className="text-[11px] text-slate-500 font-medium">Ka-feen</p>
                      </div>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Used
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <div>
                      <span className="text-slate-400 block text-[9px]">Claimed on</span>
                      <span>20 May 2026</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">Used on</span>
                      <span>20 May 2026</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* Card 2: Expired Coffee */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0">
                      <img
                        src="https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80"
                        alt="Free Coffee"
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-slate-900 truncate">Free Coffee</h4>
                        <p className="text-[11px] text-slate-500 font-medium">Ka-feen</p>
                      </div>
                    </div>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-slate-200">
                      Expired
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <div>
                      <span className="text-slate-400 block text-[9px]">Claimed on</span>
                      <span>12 Apr 2026</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">Expired on</span>
                      <span>10 Apr 2026</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* Card 3: Active Buy 1 Get 1 */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0">
                      <img
                        src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80"
                        alt="Buy 1 Get 1"
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-slate-900 truncate">Buy 1 Get 1 Free</h4>
                        <p className="text-[11px] text-slate-500 font-medium">Brew House</p>
                      </div>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Active
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <div>
                      <span className="text-slate-400 block text-[9px]">Claimed on</span>
                      <span>15 Jul 2026</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">Valid till</span>
                      <span>15 Aug 2026</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SCREEN 10: REWARD DETAILS (Batch 3) */}
      {/* ------------------------------------------------------------------- */}
      {currentScreen === 'reward_details' && (
        <div className="space-y-4 max-w-md w-full mx-auto px-4 pt-3">
          {/* Top Bar with Back Arrow & Store info */}
          <div className="flex items-center space-x-3 pb-2 border-b border-slate-200">
            <button
              onClick={() => setCurrentScreen('after_scan')}
              className="p-1 text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="w-8 h-8 rounded-xl bg-[#111] text-white flex items-center justify-center shrink-0">
              <Coffee className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 leading-tight">Ka-feen</h2>
              <p className="text-[10px] text-slate-500 font-medium">Coffee Shop</p>
            </div>
          </div>

          {/* Reward Details Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
            <img
              src={selectedReward.image}
              alt={selectedReward.title}
              className="w-full h-44 object-cover"
            />
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-base font-black text-slate-900">{selectedReward.title}</h3>
                <span className="bg-rose-50 text-rose-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full mt-1.5 inline-block border border-rose-100">
                  Requires 2 Stamps
                </span>
              </div>

              {/* Progress */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Your Progress</span>
                  <span>3 / 5 Stamps</span>
                </div>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="w-8 h-8 rounded-full bg-[#74111d] flex items-center justify-center text-white text-xs shadow-xs">
                      <Coffee className="w-4 h-4 text-amber-200" />
                    </div>
                  ))}
                  {[4, 5].map((n) => (
                    <div key={n} className="w-8 h-8 rounded-full border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-300 text-xs">
                      ○
                    </div>
                  ))}
                </div>
              </div>

              {/* Validity */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 pt-2 border-t border-slate-100">
                <span className="flex items-center space-x-1.5 text-slate-500">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Valid Till</span>
                </span>
                <span className="text-[#74111d]">{selectedReward.validTill}</span>
              </div>
            </div>
          </div>

          {/* Claim Button */}
          <button
            onClick={handleInitiateClaim}
            className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-black py-4 rounded-2xl text-xs transition shadow-lg shadow-[#74111d]/20 cursor-pointer"
          >
            Claim Now
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SCREEN 12: WAITING FOR APPROVAL (Batch 3) */}
      {/* ------------------------------------------------------------------- */}
      {currentScreen === 'waiting_approval' && (
        <div className="space-y-6 max-w-md w-full mx-auto px-4 pt-3 text-center">
          {/* Top Bar */}
          <div className="flex items-center space-x-3 pb-2 border-b border-slate-200 text-left">
            <button
              onClick={() => setCurrentScreen('reward_details')}
              className="p-1 text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="w-8 h-8 rounded-xl bg-[#111] text-white flex items-center justify-center shrink-0">
              <Coffee className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 leading-tight">Ka-feen</h2>
              <p className="text-[10px] text-slate-500 font-medium">Coffee Shop</p>
            </div>
          </div>

          {/* Hourglass Ring Loader */}
          <div className="pt-4 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-4 border-rose-100 border-t-[#74111d] flex items-center justify-center animate-spin">
              <Hourglass className="w-8 h-8 text-[#74111d]" />
            </div>

            <h3 className="text-lg font-black text-slate-900 mt-5">Waiting for Approval</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Your request is being reviewed by the merchant.
            </p>
          </div>

          {/* Large Customer ID Card */}
          <div className="bg-rose-50/60 border border-rose-200/80 rounded-3xl p-6 text-center space-y-2">
            <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-500 font-bold uppercase tracking-wider">
              <CreditCard className="w-4 h-4 text-[#74111d]" />
              <span>Customer ID</span>
            </div>
            <div className="text-2xl font-black font-mono text-[#74111d] tracking-widest">
              {customerUser.customerId}
            </div>
            <p className="text-[11px] text-slate-500 font-medium pt-1">
              Please share your Customer ID with the cashier.
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
            [Simulate Instant Approval]
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SCREEN 13: CONGRATULATIONS / REWARD CLAIMED (Batch 3) */}
      {/* ------------------------------------------------------------------- */}
      {currentScreen === 'reward_congrats' && (
        <div className="space-y-5 max-w-md w-full mx-auto px-4 pt-3 text-center">
          {/* Top Bar */}
          <div className="flex items-center space-x-3 pb-2 border-b border-slate-200 text-left">
            <button
              onClick={() => setCurrentScreen('home')}
              className="p-1 text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="w-8 h-8 rounded-xl bg-[#111] text-white flex items-center justify-center shrink-0">
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
            <h3 className="text-xl font-black text-emerald-600 mt-4">Reward Claimed!</h3>
            <p className="text-xs font-bold text-slate-600 mt-1">Enjoy your reward 🎉</p>
          </div>

          {/* Voucher Summary Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-xs text-left space-y-3">
            <div className="flex items-center space-x-3">
              <img
                src={selectedReward.image}
                alt={selectedReward.title}
                className="w-14 h-14 rounded-2xl object-cover shrink-0"
              />
              <div className="min-w-0">
                <h4 className="text-xs font-black text-slate-900 leading-snug">{selectedReward.title}</h4>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Ka-feen Coffee</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-600">
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
            className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-black py-4 rounded-2xl text-xs transition shadow-lg shadow-[#74111d]/20 cursor-pointer"
          >
            Done
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SCREEN 9: PROFILE (Batch 2) */}
      {/* ------------------------------------------------------------------- */}
      {currentScreen === 'profile' && (
        <div className="space-y-4 max-w-md w-full mx-auto px-4 pt-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentScreen('home')}
                className="p-1 text-slate-700 hover:text-slate-900 cursor-pointer -ml-2"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Profile</h2>
            </div>
            <div className="w-8 h-8 rounded-full border border-slate-200 text-slate-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
          </div>

          {/* User Profile Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-[#74111d] font-black text-lg flex items-center justify-center shrink-0">
              {customerUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-black text-slate-900 leading-tight">{customerUser.name}</h3>
              <div className="flex items-center space-x-1.5 mt-0.5 text-xs text-slate-500 font-mono">
                <span>Customer ID: {customerUser.customerId}</span>
                <button
                  onClick={() => handleCopyCustomer(customerUser.customerId)}
                  className="hover:text-slate-900 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                {copiedId && <span className="text-[10px] text-emerald-600 font-sans font-bold">Copied!</span>}
              </div>
            </div>
          </div>

          {/* Contact Details List */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-2 shadow-xs divide-y divide-slate-100">
            <div className="flex items-center space-x-3.5 p-3.5">
              <Phone className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-800">{customerUser.phone}</span>
            </div>
            <div className="flex items-center space-x-3.5 p-3.5">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-800">{customerUser.email}</span>
            </div>
          </div>

          {/* Settings / Policies Navigation Rows */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-2 shadow-xs divide-y divide-slate-100">
            <div className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl cursor-pointer transition">
              <div className="flex items-center space-x-3.5">
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-800">Privacy Policy</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <div className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl cursor-pointer transition">
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
      )}

      {/* ------------------------------------------------------------------- */}
      {/* PERSISTENT BOTTOM NAVIGATION BAR (Screens 5, 7, 8, 9) */}
      {/* ------------------------------------------------------------------- */}
      {currentScreen !== 'scan' && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-white border-t border-slate-200/90 px-8 py-2 flex items-center justify-around shadow-2xl">
          {/* Home Tab */}
          <button
            onClick={() => setCurrentScreen('home')}
            className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
              currentScreen === 'home' ? 'text-[#74111d]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-black mt-1">Home</span>
          </button>

          {/* Center Floating Red Scan Button */}
          <button
            onClick={openScanScreen}
            className="-mt-7 w-14 h-14 rounded-full bg-[#74111d] hover:bg-[#5e0c15] text-white flex items-center justify-center shadow-xl shadow-[#74111d]/40 border-4 border-white transition transform active:scale-95 cursor-pointer"
            aria-label="Scan QR Code"
          >
            <QrCode className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Rewards Tab */}
          <button
            onClick={() => {
              setRewardsSubTab('to_claim');
              setCurrentScreen('rewards');
            }}
            className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
              currentScreen === 'rewards' ? 'text-[#74111d]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Gift className="w-5 h-5" />
            <span className="text-[10px] font-black mt-1">Rewards</span>
          </button>
        </nav>
      )}

    </div>
  );
}

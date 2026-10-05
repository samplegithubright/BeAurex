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
  RefreshCw, SlidersHorizontal, Image, KeyRound
} from 'lucide-react';

export default function CustomerExperience({ initialAuthMode = 'signin' }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Persistent Customer Mobile & User from localStorage
  const [customerMobile, setCustomerMobile] = useState(() => {
    return localStorage.getItem('beaurex_customer_mobile') || '';
  });

  const [customerUser, setCustomerUser] = useState(() => {
    const saved = localStorage.getItem('beaurex_customer_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: 'Customer',
      customerId: 'LQR-MEMBER',
      phone: '',
      mobile: '',
      tier: 'Bronze Member',
      activeCardsCount: 1,
      rewardsRedeemedCount: 0,
      points: 100,
      stamps: 0,
      memberSince: 'Today',
      storeProgress: []
    };
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('beaurex_customer_mobile') || sessionStorage.getItem('beaurex_customer_auth') === 'true');
  });

  // Auth Mode: 'signin' or 'signup'
  const [authMode, setAuthMode] = useState(() => {
    if (window.location.pathname.includes('/signup')) return 'signup';
    if (window.location.pathname.includes('/login')) return 'signin';
    return initialAuthMode || 'signin';
  });

  // Sign In Form States (Phone + OTP)
  const [loginPhone, setLoginPhone] = useState('');
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [loginOtp, setLoginOtp] = useState('');
  const [loginDevOtp, setLoginDevOtp] = useState('');
  const [loginCountdown, setLoginCountdown] = useState(60);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Sign Up Form States (Name + Phone + OTP)
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupOtpSent, setSignupOtpSent] = useState(false);
  const [signupOtp, setSignupOtp] = useState('');
  const [signupDevOtp, setSignupDevOtp] = useState('');
  const [signupCountdown, setSignupCountdown] = useState(60);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState('');

  // Store information identified from slug or default
  const [storeInfo, setStoreInfo] = useState({
    storeName: 'Kafeen Coffee',
    businessName: 'Kafeen Coffee',
    qrSlug: slug || 'kafeen-4040',
    category: 'CAFE_RESTAURANT',
    brandColor: '#74111d',
    city: 'Delhi NCR',
    branch: { branchName: 'Main Outlet', counterName: 'Counter 1' },
    rewardOffer: {
      title: '30% off on your next purchase',
      discountType: 'PERCENTAGE',
      discountValue: 30,
      minBillAmount: 200,
      totalStamps: 5
    },
    isOnline: true,
    isExpired: false,
    message: ''
  });

  const [storeLoading, setStoreLoading] = useState(true);

  // In-Store Stamping State: Checkin -> Merchant Grant -> Customer Claim
  const [inputPhone, setInputPhone] = useState('');
  const [inputName, setInputName] = useState('');
  const [checkinData, setCheckinData] = useState(null); // { checkinToken, pendingMerchant: true, storeSlug }
  const [stampGrantedByMerchant, setStampGrantedByMerchant] = useState(false);
  const [claimingStamp, setClaimingStamp] = useState(false);
  const [stampSuccess, setStampSuccess] = useState(null);
  const [unlockedRewardModal, setUnlockedRewardModal] = useState(null);

  // Merchant Counter Passcode Drawer/Modal state
  const [merchantPinModalOpen, setMerchantPinModalOpen] = useState(false);
  const [merchantPinInput, setMerchantPinInput] = useState('');
  const [merchantPinError, setMerchantPinError] = useState('');
  const [merchantPinLoading, setMerchantPinLoading] = useState(false);

  // Dashboard Navigation: 'dashboard' | 'scan' | 'reward'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [rewardSubTab, setRewardSubTab] = useState('to_claim');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);

  // Live Camera QR Scanner states (Powered by jsQR)
  const videoRef = useRef(null);
  const canvasRef = useRef(document.createElement('canvas'));
  const animFrameIdRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [scannedQrData, setScannedQrData] = useState(null);
  const [manualCodeInput, setManualCodeInput] = useState('');
  const [selectedSimStore, setSelectedSimStore] = useState(slug || 'kafeen-4040');

  // Customer Vouchers / Rewards fetched from MongoDB
  const [vouchersList, setVouchersList] = useState([]);

  // Available Stores list
  const availableStores = [
    { slug: 'kafeen-4040', name: 'Kafeen Coffee', category: 'Coffee & Cafe', icon: Coffee },
    { slug: 'chandanbakery-2475', name: 'Chandan Bakery', category: 'Bakery & Sweets', icon: Utensils },
    { slug: 'ram-chole-4771', name: 'Ram Chole Bhature', category: 'Street Food', icon: ShoppingBag },
    { slug: 'rahilsatet-2640', name: 'Rahil Sweets', category: 'Desserts & Sweets', icon: Gift }
  ];

  // Countdown timer for Login OTP
  useEffect(() => {
    let timer;
    if (loginOtpSent && loginCountdown > 0) {
      timer = setInterval(() => setLoginCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [loginOtpSent, loginCountdown]);

  // Countdown timer for Sign Up OTP
  useEffect(() => {
    let timer;
    if (signupOtpSent && signupCountdown > 0) {
      timer = setInterval(() => setSignupCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [signupOtpSent, signupCountdown]);

  // Fetch Identified Store Info whenever target slug changes
  const fetchStoreBySlug = async (targetSlug) => {
    setStoreLoading(true);
    try {
      const res = await fetch(`/api/customer/store-status?slug=${encodeURIComponent(targetSlug)}`);
      const data = await res.json();
      setStoreLoading(false);
      if (data && data.success) {
        setStoreInfo({
          storeName: data.storeName || data.businessName || 'Kafeen Coffee',
          businessName: data.businessName || data.storeName || 'Kafeen Coffee',
          qrSlug: data.qrSlug || targetSlug,
          category: data.category || 'CAFE_RESTAURANT',
          brandColor: data.brandColor || '#74111d',
          city: data.city || 'Delhi NCR',
          branch: data.branch || { branchName: 'Main Outlet', counterName: 'Counter 1' },
          rewardOffer: data.rewardOffer || {
            title: '30% off on your next purchase',
            discountType: 'PERCENTAGE',
            discountValue: 30,
            minBillAmount: 200,
            totalStamps: 5
          },
          isOnline: data.isOnline !== false,
          isExpired: Boolean(data.isExpired),
          message: data.message || ''
        });
      }
    } catch (err) {
      setStoreLoading(false);
    }
  };

  useEffect(() => {
    const targetSlug = slug || 'kafeen-4040';
    fetchStoreBySlug(targetSlug);
  }, [slug]);

  // Fetch and Sync Customer Profile & Vouchers from MongoDB
  const fetchCustomerProfile = async (phone) => {
    const clean = String(phone || customerMobile).replace(/[^0-9]/g, '').slice(-10);
    if (!clean) return;

    try {
      const res = await fetch(`/api/customer/profile?mobile=${clean}`);
      const data = await res.json();
      if (data && data.success && data.customer) {
        setCustomerUser(data.customer);
        localStorage.setItem('beaurex_customer_user', JSON.stringify(data.customer));
        localStorage.setItem('beaurex_customer_mobile', clean);
        if (data.customer.vouchers) {
          setVouchersList(data.customer.vouchers);
        }
      }
    } catch (err) {
      console.warn('Error fetching profile:', err);
    }
  };

  useEffect(() => {
    if (customerMobile) {
      fetchCustomerProfile(customerMobile);
    }
  }, [customerMobile]);

  // Poll for Merchant Stamp Authorization when customer is checked in
  useEffect(() => {
    let pollInterval;
    const activePhone = customerMobile || inputPhone;
    if (checkinData && !stampGrantedByMerchant && activePhone) {
      pollInterval = setInterval(async () => {
        try {
          const res = await fetch(`/api/customer/stamp-status?mobile=${encodeURIComponent(activePhone)}&storeSlug=${encodeURIComponent(storeInfo.qrSlug)}`);
          const data = await res.json();
          if (data && data.success && data.granted) {
            setStampGrantedByMerchant(true);
            confetti({ particleCount: 50, spread: 50, origin: { y: 0.5 } });
          }
        } catch (_) {}
      }, 2000);
    }
    return () => clearInterval(pollInterval);
  }, [checkinData, stampGrantedByMerchant, customerMobile, inputPhone, storeInfo.qrSlug]);

  // =========================================================================
  // CAMERA QR SCANNER ENGINE: Frame-by-Frame decoding using jsQR
  // =========================================================================
  const scanQrCodeLoop = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (qrCode && qrCode.data) {
        handleQrDetected(qrCode.data);
        return;
      }
    }
    animFrameIdRef.current = requestAnimationFrame(scanQrCodeLoop);
  };

  const handleQrDetected = (qrDataString) => {
    stopCamera();
    let detectedSlug = 'kafeen-4040';
    try {
      if (qrDataString.includes('/scan/')) {
        detectedSlug = qrDataString.split('/scan/')[1].split('?')[0].split('/')[0];
      } else if (qrDataString.includes('/')) {
        const parts = qrDataString.split('/');
        detectedSlug = parts[parts.length - 1];
      } else {
        detectedSlug = qrDataString.trim();
      }
    } catch (_) {}

    setScannedQrData(detectedSlug);
    fetchStoreBySlug(detectedSlug);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
  };

  const startCamera = async () => {
    setCameraError('');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera API not supported in this browser. Use Quick Scan simulator or enter code below.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
        animFrameIdRef.current = requestAnimationFrame(scanQrCodeLoop);
      }
    } catch (err) {
      console.warn('Camera error:', err);
      setCameraError('Camera access not granted. You can use 1-Tap Quick Scan simulator or file upload below.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (activeTab === 'scan' && !scannedQrData) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeTab, scannedQrData]);

  // Image File QR upload handler
  const handleQrImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
        if (qrCode && qrCode.data) {
          handleQrDetected(qrCode.data);
        } else {
          alert('No readable QR code found in this image. Please select a clear picture of the standee QR.');
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // =========================================================================
  // STEP 1: CUSTOMER CHECK-IN (AWAITS MERCHANT AUTHORITY)
  // =========================================================================
  const handleCustomerCheckin = async (phoneToUse = null) => {
    const activePhone = phoneToUse || customerMobile || inputPhone;
    const clean = String(activePhone).replace(/[^0-9]/g, '').slice(-10);

    if (!clean || clean.length !== 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!storeInfo.isOnline) {
      alert(`Cannot check in: ${storeInfo.storeName}'s loyalty program is paused.`);
      return;
    }

    setStoreLoading(true);
    try {
      const res = await fetch('/api/customer/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: clean,
          name: inputName.trim() || customerUser.name || 'Customer',
          storeSlug: storeInfo.qrSlug,
          storeName: storeInfo.storeName
        })
      });
      const data = await res.json();
      setStoreLoading(false);

      if (data && data.success) {
        setCustomerMobile(clean);
        localStorage.setItem('beaurex_customer_mobile', clean);
        sessionStorage.setItem('beaurex_customer_auth', 'true');
        setIsAuthenticated(true);

        setCheckinData({
          checkinToken: data.checkinToken,
          pendingMerchant: true,
          storeSlug: storeInfo.qrSlug
        });
        setStampGrantedByMerchant(false);
      } else {
        alert(data.message || 'Error recording check-in.');
      }
    } catch (err) {
      setStoreLoading(false);
      alert('Network error: ' + err.message);
    }
  };

  // =========================================================================
  // STEP 2: MERCHANT AUTHORIZES STAMP (AUTHORITY ONLY WITH MERCHANT)
  // Cashier enters their 4-digit PIN (default: 1234 or 2026) at counter
  // =========================================================================
  const handleAuthorizeStampWithMerchantPin = async (e) => {
    e.preventDefault();
    if (!merchantPinInput.trim()) {
      setMerchantPinError('Please enter the Merchant Authority PIN');
      return;
    }

    const activePhone = customerMobile || inputPhone;
    setMerchantPinLoading(true);
    setMerchantPinError('');

    try {
      const res = await fetch('/api/customer/grant-stamp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: activePhone,
          storeSlug: storeInfo.qrSlug,
          merchantPin: merchantPinInput.trim()
        })
      });
      const data = await res.json();
      setMerchantPinLoading(false);

      if (data && data.success) {
        setStampGrantedByMerchant(true);
        setMerchantPinModalOpen(false);
        setMerchantPinInput('');
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } else {
        setMerchantPinError(data.message || 'Invalid PIN. Only merchant account holder can authorize stamps.');
      }
    } catch (err) {
      setMerchantPinLoading(false);
      setMerchantPinError('Verification error: ' + err.message);
    }
  };

  // =========================================================================
  // STEP 3: CUSTOMER CLAIMS STAMP (ONLY WHEN MERCHANT GIVES IT - NOT AUTOMATIC!)
  // =========================================================================
  const handleClaimStamp = async () => {
    if (!stampGrantedByMerchant) {
      alert('Stamp has not been authorized yet by the merchant. The merchant must authorize it first.');
      return;
    }

    const activePhone = customerMobile || inputPhone;
    setClaimingStamp(true);

    try {
      const res = await fetch('/api/customer/claim-stamp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: activePhone,
          storeSlug: storeInfo.qrSlug
        })
      });
      const data = await res.json();
      setClaimingStamp(false);

      if (data && data.success) {
        setStampSuccess({
          message: data.message,
          currentStamps: data.currentStamps,
          totalStamps: data.totalStamps,
          points: data.points,
          rewardAvailable: data.rewardAvailable,
          reward: data.reward
        });

        confetti({
          particleCount: data.rewardAvailable ? 120 : 80,
          spread: 70,
          origin: { y: 0.6 }
        });

        if (data.rewardAvailable && data.reward) {
          setUnlockedRewardModal(data.reward);
        }

        // Reset check-in state
        setCheckinData(null);
        setStampGrantedByMerchant(false);
        fetchCustomerProfile(activePhone);
      } else {
        alert(data.message || 'Error claiming stamp.');
      }
    } catch (err) {
      setClaimingStamp(false);
      alert('Network error claiming stamp: ' + err.message);
    }
  };

  // =========================================================================
  // STEP 4: CUSTOMER CLAIMS AVAILABLE STORE REWARD / VOUCHER (MONGODB PERSISTENCE)
  // =========================================================================
  const [claimingRewardId, setClaimingRewardId] = useState(null);

  const availableOffersToClaim = [
    {
      id: 'off_current',
      storeName: storeInfo.storeName || 'Kafeen Coffee',
      storeSlug: storeInfo.qrSlug || 'kafeen-4040',
      title: storeInfo.rewardOffer?.title || '30% off on your next purchase',
      discountValue: storeInfo.rewardOffer?.discountValue || 30,
      minBillAmount: storeInfo.rewardOffer?.minBillAmount || 200,
      tag: 'Store Active Perk',
      color: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      id: 'off_bakery',
      storeName: 'Chandan Bakery',
      storeSlug: 'chandanbakery-2475',
      title: '20% Flat Discount on Pastry & Fresh Bakery',
      discountValue: 20,
      minBillAmount: 300,
      tag: 'Bakery Special',
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      id: 'off_street',
      storeName: 'Ram Chole Bhature',
      storeSlug: 'ram-chole-4771',
      title: 'Flat ₹50 OFF on Special Lunch Thali',
      discountValue: 50,
      minBillAmount: 150,
      tag: 'Foodie Delight',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 'off_sweets',
      storeName: 'Rahil Sweets',
      storeSlug: 'rahilsatet-2640',
      title: 'Free Box of Special Kaju Katli (Orders ₹400+)',
      discountValue: 100,
      minBillAmount: 400,
      tag: 'Festive Reward',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    }
  ];

  const handleClaimAvailableReward = async (offer) => {
    const activePhone = customerMobile || inputPhone;
    if (!activePhone) {
      alert('Please log in with your mobile number to claim rewards.');
      return;
    }

    setClaimingRewardId(offer.id || offer.storeSlug);
    try {
      const res = await fetch('/api/customer/reward/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: activePhone,
          storeSlug: offer.storeSlug || storeInfo.qrSlug,
          rewardTitle: offer.title || '30% off on your next purchase',
          discountValue: offer.discountValue || 30
        })
      });
      const data = await res.json();
      setClaimingRewardId(null);

      if (data && data.success) {
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        // Refresh customer vouchers from MongoDB immediately
        await fetchCustomerProfile(activePhone);
        setActiveTab('reward');
        setRewardSubTab('to_claim');
        alert(`🎉 ${data.message || 'Reward claimed! Your 4-digit Cashier Verification PIN is ready.'}`);
      } else {
        alert(data?.message || 'Could not claim reward.');
      }
    } catch (err) {
      setClaimingRewardId(null);
      alert('Error claiming reward: ' + err.message);
    }
  };

  // AUTH HANDLERS
  const handleSendLoginOtp = async (e) => {
    e.preventDefault();
    const clean = String(loginPhone).replace(/[^0-9]/g, '').slice(-10);
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
      setLoginLoading(false);

      if (data.success) {
        setLoginOtpSent(true);
        setLoginCountdown(60);
        setLoginOtp('');
        if (data.devOtp) setLoginDevOtp(data.devOtp);
      } else {
        setLoginError(data.message || 'Unable to send OTP.');
        if (data.notRegistered) {
          setTimeout(() => {
            setAuthMode('signup');
            setSignupPhone(clean);
          }, 1800);
        }
      }
    } catch (err) {
      setLoginLoading(false);
      setLoginError('Connection error: ' + err.message);
    }
  };

  const handleVerifyLoginOtp = async (e) => {
    e.preventDefault();
    if (!loginOtp || loginOtp.trim().length !== 6) {
      setLoginError('Please enter the 6-digit OTP code received on your phone.');
      return;
    }
    const clean = String(loginPhone).replace(/[^0-9]/g, '').slice(-10);
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/customer/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: clean, otp: loginOtp.trim() })
      });
      const data = await res.json();
      setLoginLoading(false);

      if (data.success && data.customer) {
        confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
        localStorage.setItem('beaurex_customer_mobile', clean);
        localStorage.setItem('beaurex_customer_user', JSON.stringify(data.customer));
        sessionStorage.setItem('beaurex_customer_auth', 'true');
        setCustomerMobile(clean);
        setCustomerUser(data.customer);
        setIsAuthenticated(true);
        setActiveTab('dashboard');
        navigate('/customer', { replace: true });
      } else {
        setLoginError(data.message || 'Invalid or expired OTP code.');
      }
    } catch (err) {
      setLoginLoading(false);
      setLoginError('Verification server error: ' + err.message);
    }
  };

  const handleSendSignupOtp = async (e) => {
    e.preventDefault();
    if (!signupName.trim()) {
      setSignupError('Please enter your full name');
      return;
    }
    const clean = String(signupPhone).replace(/[^0-9]/g, '').slice(-10);
    if (!clean || clean.length !== 10) {
      setSignupError('Please enter a valid 10-digit mobile number');
      return;
    }
    setSignupError('');
    setSignupLoading(true);

    try {
      const res = await fetch('/api/customer/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: clean, isSignup: true, name: signupName.trim() })
      });
      const data = await res.json();
      setSignupLoading(false);

      if (data.success) {
        setSignupOtpSent(true);
        setSignupCountdown(60);
        setSignupOtp('');
        if (data.devOtp) setSignupDevOtp(data.devOtp);
      } else {
        setSignupError(data.message || 'Error requesting registration OTP.');
        if (data.alreadyRegistered) {
          setTimeout(() => {
            setAuthMode('signin');
            setLoginPhone(clean);
          }, 1800);
        }
      }
    } catch (err) {
      setSignupLoading(false);
      setSignupError('Unable to connect to server: ' + err.message);
    }
  };

  const handleVerifySignupOtp = async (e) => {
    e.preventDefault();
    if (!signupOtp || signupOtp.trim().length !== 6) {
      setSignupError('Please enter the 6-digit verification code.');
      return;
    }
    const clean = String(signupPhone).replace(/[^0-9]/g, '').slice(-10);
    setSignupLoading(true);
    setSignupError('');

    try {
      const res = await fetch('/api/customer/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName.trim(),
          mobile: clean,
          email: signupEmail.trim(),
          otp: signupOtp.trim()
        })
      });
      const data = await res.json();
      setSignupLoading(false);

      if (data.success && data.customer) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        localStorage.setItem('beaurex_customer_mobile', clean);
        localStorage.setItem('beaurex_customer_user', JSON.stringify(data.customer));
        sessionStorage.setItem('beaurex_customer_auth', 'true');
        setCustomerMobile(clean);
        setCustomerUser(data.customer);
        setIsAuthenticated(true);
        setActiveTab('dashboard');
        navigate('/customer', { replace: true });
      } else {
        setSignupError(data.message || 'OTP verification failed. Please try again.');
      }
    } catch (err) {
      setSignupLoading(false);
      setSignupError('Error registering customer: ' + err.message);
    }
  };

  const handleCustomerLogout = () => {
    setIsLoggingOut(true);
    localStorage.removeItem('beaurex_customer_mobile');
    localStorage.removeItem('beaurex_customer_user');
    localStorage.removeItem('beaurex_customer_token');
    sessionStorage.removeItem('beaurex_customer_auth');
    setIsAuthenticated(false);
    setCustomerMobile('');
    setAuthMode('signin');
    setProfileModalOpen(false);
    navigate('/', { replace: true });
  };

  const handleCopyText = (text, type = 'pin') => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    if (type === 'pin') {
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2000);
    } else {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const getStoreProgress = (storeSlug) => {
    if (!customerUser?.storeProgress) return { stampsCollected: 0, totalStamps: 5 };
    const cleanSlug = storeSlug.toLowerCase().replace(/[^a-z0-9]/g, '');
    const found = customerUser.storeProgress.find(p => 
      p.storeSlug === storeSlug || 
      p.storeSlug.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanSlug
    );
    return found ? found : { stampsCollected: customerUser.stamps || 0, totalStamps: 5 };
  };

  const currentStoreProgress = getStoreProgress(storeInfo.qrSlug);
  const displayStamps = stampSuccess ? stampSuccess.currentStamps : currentStoreProgress.stampsCollected;
  const displayTotal = stampSuccess ? stampSuccess.totalStamps : currentStoreProgress.totalStamps || 5;

  // =========================================================================
  // VIEW 1: IN-STORE STAND-EE OR SCANNED QR EXPERIENCE
  // Flow: Scans QR -> Store Identified -> Check-in -> Merchant Gives Stamp -> Customer Claims!
  // =========================================================================
  if (slug || scannedQrData) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-red-500 selection:text-white font-sans">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
          <Link to="/customer" className="flex items-center space-x-2">
            <img 
              src="/beaurex-icon.jpg" 
              alt="BeAurex" 
              className="w-8 h-8 rounded-xl object-cover border border-white/20 shadow-xs"
            />
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight text-white leading-none">
                Be<span className="text-[#851421]">Aurex</span>
              </span>
              <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider">
                Store Loyalty Counter
              </span>
            </div>
          </Link>

          {customerMobile ? (
            <Link 
              to="/customer" 
              className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center space-x-1.5 transition"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>My Wallet</span>
            </Link>
          ) : (
            <Link
              to="/customer/login"
              className="text-xs font-bold bg-[#74111d] hover:bg-[#5e0c15] text-white px-3 py-1.5 rounded-xl shadow-xs transition"
            >
              Sign In
            </Link>
          )}
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-md w-full mx-auto p-4 flex flex-col justify-center my-4 space-y-4">
          
          {/* BUSINESS IDENTIFICATION CARD */}
          <div className="bg-gradient-to-br from-slate-800/90 via-slate-800/70 to-slate-900 rounded-3xl p-5 border border-slate-700/80 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#74111d]/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center space-x-1.5 bg-[#74111d]/40 text-rose-300 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-[#74111d]/60">
                <Store className="w-3.5 h-3.5 text-amber-400" />
                <span>BeAurex Verified Business</span>
              </span>

              {storeInfo.isOnline ? (
                <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Active</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-rose-400 bg-rose-950/60 border border-rose-800 px-2 py-0.5 rounded-full">
                  <span>Paused</span>
                </span>
              )}
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#851421] to-[#550c15] text-white flex items-center justify-center font-black text-2xl shadow-lg border border-white/20 shrink-0">
                <Coffee className="w-7 h-7 text-amber-300" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white tracking-tight">
                  {storeInfo.storeName}
                </h1>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {storeInfo.branch?.branchName || 'Main Outlet'} • {storeInfo.branch?.counterName || 'Counter 1'} ({storeInfo.city})
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-[10px] font-mono bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700 text-slate-300">
                    QR: {storeInfo.qrSlug}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/60 bg-amber-500/10 rounded-2xl p-3 border border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Gift className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-300 tracking-wider block">
                    Counter Loyalty Offer
                  </span>
                  <div className="text-xs font-black text-white">
                    {storeInfo.rewardOffer?.title || '30% off on your next purchase'}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2.5 py-1 rounded-lg shrink-0">
                5 Stamps
              </span>
            </div>
          </div>

          {/* STAMP PROGRESSION & CLAIM CARD */}
          <div className="bg-white text-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-4">
            
            <div className="text-center">
              {stampSuccess ? (
                <div className="space-y-1">
                  <span className="inline-flex items-center space-x-1 text-emerald-600 bg-emerald-50 border border-emerald-200 text-xs font-black px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Stamp Claimed!</span>
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-2">
                    {stampSuccess.rewardAvailable 
                      ? '🎉 Reward Milestone Reached!' 
                      : `You claimed Stamp #${stampSuccess.currentStamps}!`}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {stampSuccess.rewardAvailable
                      ? 'Your milestone reward is unlocked and ready for cashier redemption below.'
                      : `Visit again to collect Stamp #${stampSuccess.currentStamps + 1} and unlock your reward.`}
                  </p>
                </div>
              ) : checkinData ? (
                <div className="space-y-1">
                  <span className="inline-flex items-center space-x-1 text-amber-700 bg-amber-50 border border-amber-200 text-xs font-black px-3 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Check-in #{checkinData.checkinToken} Recorded</span>
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-2">
                    {stampGrantedByMerchant ? '🎁 1 Stamp Authorized by Merchant!' : 'Waiting for Merchant to Give Stamp'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {stampGrantedByMerchant 
                      ? 'The store merchant has authorized your visit stamp! Tap below to claim it.' 
                      : 'Stamp authority belongs to the merchant account holder. Please ask the cashier to give you a stamp.'}
                  </p>
                </div>
              ) : customerMobile ? (
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Welcome Back!
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-0.5">
                    {customerUser.name || `+91 ${customerMobile}`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    You have <strong className="text-red-700 font-bold">{displayStamps} of {displayTotal}</strong> stamps collected for {storeInfo.storeName}.
                  </p>
                </div>
              ) : (
                <div>
                  <span className="inline-flex items-center space-x-1 text-red-700 bg-red-50 border border-red-200 text-xs font-bold px-3 py-1 rounded-full mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-red-600" />
                    <span>First Visit Bonus: +100 Points</span>
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    Enter Mobile for In-Store Visit
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Enter your mobile number to check in at the counter:
                  </p>
                </div>
              )}
            </div>

            {/* STAMP CIRCLES GRID */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase text-slate-600 tracking-wider">
                  Stamp Progress Card
                </span>
                <span className="text-xs font-black text-red-600">
                  {displayStamps} / {displayTotal} Collected
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 my-2">
                {Array.from({ length: displayTotal }).map((_, idx) => {
                  const stampNum = idx + 1;
                  const isCollected = stampNum <= displayStamps;
                  const isNext = stampNum === displayStamps + 1;
                  const isRewardStamp = stampNum === displayTotal;

                  return (
                    <div 
                      key={idx}
                      className={`flex-1 aspect-square max-w-14 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 transform ${
                        isCollected 
                          ? 'bg-gradient-to-tr from-[#74111d] to-[#9b1727] text-white shadow-md shadow-red-900/30 scale-102 ring-2 ring-red-400/50'
                          : isNext
                          ? 'border-2 border-dashed border-red-400 bg-red-50/50 text-red-600 animate-pulse'
                          : isRewardStamp
                          ? 'border-2 border-dashed border-amber-400 bg-amber-50 text-amber-600'
                          : 'border border-slate-200 bg-white text-slate-400'
                      }`}
                    >
                      {isCollected ? (
                        <Check className="w-5 h-5 text-white stroke-[3] animate-in zoom-in-75 duration-200" />
                      ) : isRewardStamp ? (
                        <Gift className="w-4 h-4 text-amber-500" />
                      ) : (
                        <span className="text-xs font-black font-mono">{stampNum}</span>
                      )}
                      <span className="text-[9px] font-black mt-0.5 opacity-90">
                        {isCollected ? '✓' : isRewardStamp ? '🎁' : `#${stampNum}`}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-3">
                <div 
                  className="bg-[#74111d] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, (displayStamps / displayTotal) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* UNLOCKED REWARD PIN CARD (IF MILESTONE REACHED) */}
            {displayStamps >= displayTotal && (
              <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white rounded-2xl p-4 shadow-xl border border-amber-300/40 text-center space-y-3">
                <div className="flex items-center justify-center space-x-1.5 text-xs font-black uppercase tracking-wider text-amber-100">
                  <Trophy className="w-4 h-4 text-amber-200" />
                  <span>Reward Ready for Cashier Redemption!</span>
                </div>

                <div className="text-base font-black text-white">
                  {storeInfo.rewardOffer?.title || '30% off on your next purchase'}
                </div>

                <div className="bg-slate-950/80 rounded-xl p-3 border border-white/20">
                  <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block">
                    Show Cashier This 4-Digit Verification PIN
                  </span>
                  <div className="flex items-center justify-center gap-2 my-1.5">
                    {String(stampSuccess?.reward?.pinCode || unlockedRewardModal?.pinCode || '4821').split('').map((digit, i) => (
                      <span 
                        key={i}
                        className="w-10 h-11 bg-white text-slate-950 font-mono font-black text-xl rounded-xl flex items-center justify-center shadow-md border border-amber-300"
                      >
                        {digit}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-center space-x-2 mt-1">
                    <span className="text-[10px] text-slate-400 font-mono">
                      Voucher Code: {stampSuccess?.reward?.voucherCode || unlockedRewardModal?.voucherCode || 'LQR-REWARD-01'}
                    </span>
                    <button 
                      onClick={() => handleCopyText(stampSuccess?.reward?.pinCode || '4821', 'pin')}
                      className="text-[10px] text-amber-300 font-bold underline flex items-center space-x-0.5 cursor-pointer"
                    >
                      <Copy className="w-2.5 h-2.5" />
                      <span>{copiedPin ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-amber-100">
                  Cashier will enter this PIN at POS to burn your voucher and apply the discount immediately.
                </p>
              </div>
            )}

            {/* ACTION SECTION: ENFORCES MERCHANT STAMP AUTHORITY & MANUAL CLAIM */}
            {checkinData ? (
              /* CHECK-IN ACTIVE: SHOWS MERCHANT AUTHORITY & CLAIM BUTTON */
              <div className="space-y-3">
                {stampGrantedByMerchant ? (
                  /* MERCHANT HAS GRANTED STAMP -> CUSTOMER CAN NOW CLAIM IT! */
                  <div className="space-y-2 animate-in zoom-in-95 duration-200">
                    <button
                      type="button"
                      onClick={handleClaimStamp}
                      disabled={claimingStamp}
                      className="w-full py-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-lg shadow-emerald-900/30 transition transform active:scale-98 cursor-pointer flex items-center justify-center space-x-2"
                    >
                      {claimingStamp ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Gift className="w-5 h-5 text-amber-300" />
                          <span>CLAIM MY AUTHORIZED STAMP NOW 🎁</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-center text-emerald-700 font-bold">
                      ✓ Stamp authorized by merchant! Tap above to add to your loyalty card.
                    </p>
                  </div>
                ) : (
                  /* WAITING FOR MERCHANT AUTHORITY */
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center space-y-3">
                    <div className="flex items-center justify-center space-x-2 text-amber-800 font-black text-xs uppercase tracking-wider">
                      <Hourglass className="w-4 h-4 animate-spin text-amber-600" />
                      <span>Awaiting Merchant Authority</span>
                    </div>

                    <p className="text-xs text-amber-900 leading-relaxed font-medium">
                      Show your Check-in Token <strong className="font-mono text-sm bg-amber-200/60 px-2 py-0.5 rounded-md">#{checkinData.checkinToken}</strong> or phone to the cashier.
                      Once the merchant gives the stamp, your Claim button will activate.
                    </p>

                    {/* Cashier Quick Passcode Authorization at Counter */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setMerchantPinModalOpen(true)}
                        className="text-xs font-bold text-[#74111d] hover:underline flex items-center justify-center space-x-1 mx-auto cursor-pointer"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Cashier: Authorize Stamp with PIN</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : customerMobile ? (
              /* RETURNING CUSTOMER CHECK-IN TRIGGER */
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => handleCustomerCheckin(customerMobile)}
                  disabled={storeLoading || !storeInfo.isOnline}
                  className="w-full py-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-[#74111d] to-[#961625] hover:from-[#5e0c15] hover:to-[#74111d] shadow-lg shadow-red-900/30 transition transform active:scale-98 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Check In at Counter & Request Stamp</span>
                </button>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Linked Phone: <strong className="text-slate-800">+91 {customerMobile}</strong></span>
                  <button
                    onClick={() => {
                      localStorage.removeItem('beaurex_customer_mobile');
                      setCustomerMobile('');
                    }}
                    className="text-red-600 hover:underline font-bold cursor-pointer"
                  >
                    Change Number
                  </button>
                </div>
              </div>
            ) : (
              /* FIRST-TIME VISITOR 1-TAP CHECK-IN FORM */
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCustomerCheckin(inputPhone);
                }} 
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Your Mobile Number
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 text-slate-700 text-xs font-bold">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={inputPhone}
                      onChange={(e) => setInputPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                      placeholder="Enter 10-digit mobile"
                      required
                      className="w-full bg-white border border-slate-300 rounded-r-xl px-3.5 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#74111d]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Your Name <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#74111d]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={storeLoading || !storeInfo.isOnline}
                  className="w-full py-3.5 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-[#74111d] to-[#961625] hover:from-[#5e0c15] hover:to-[#74111d] shadow-lg shadow-red-900/30 transition transform active:scale-98 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Gift className="w-4 h-4 text-amber-300" />
                  <span>Check In & Request Visit Stamp 🎁</span>
                </button>
              </form>
            )}

            {/* Back to Full Dashboard */}
            <div className="pt-2 text-center">
              <button 
                onClick={() => {
                  setScannedQrData(null);
                  setActiveTab('dashboard');
                }}
                className="inline-flex items-center space-x-1.5 text-xs font-black text-slate-600 hover:text-red-700 transition cursor-pointer"
              >
                <span>View Full Rewards Dashboard & Wallet</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </main>

        {/* CASHIER MERCHANT PIN AUTHORIZATION MODAL */}
        {merchantPinModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div 
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
              onClick={() => setMerchantPinModalOpen(false)}
            />
            <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 text-slate-900 z-10 border border-slate-200 animate-in zoom-in-95 duration-200 my-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center space-x-2">
                  <KeyRound className="w-5 h-5 text-[#74111d]" />
                  <h3 className="font-black text-sm text-slate-900">Merchant Authority Authorization</h3>
                </div>
                <button 
                  onClick={() => setMerchantPinModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAuthorizeStampWithMerchantPin} className="space-y-4">
                <p className="text-xs text-slate-600">
                  Cashier/Merchant: Enter your 4-digit store authority PIN to grant this stamp to <strong>+91 {customerMobile || inputPhone}</strong>.
                </p>

                {merchantPinError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold">
                    {merchantPinError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Merchant Authority PIN
                  </label>
                  <input
                    type="password"
                    value={merchantPinInput}
                    onChange={(e) => setMerchantPinInput(e.target.value)}
                    placeholder="Enter PIN (e.g. 1234)"
                    maxLength={6}
                    required
                    autoFocus
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-center text-xl font-mono font-black tracking-widest text-slate-900 focus:outline-none focus:border-[#74111d]"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1 text-center font-mono">
                    Default Merchant PIN: 1234
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={merchantPinLoading}
                  className="w-full py-3 bg-[#74111d] hover:bg-[#5e0c15] text-white font-black rounded-xl text-xs shadow-md transition cursor-pointer flex items-center justify-center space-x-2"
                >
                  {merchantPinLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Authorize 1 Stamp for Customer</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        <footer className="text-center p-3 text-slate-500 text-[11px]">
          Powered by <strong className="text-slate-400">BeAurex In-Store Loyalty</strong> • Scan • Merchant Authority • Customer Claim
        </footer>

      </div>
    );
  }

  // If logging out or unauthenticated on /customer dashboard route, immediately navigate to landing page
  if (isLoggingOut) {
    return <Navigate to="/" replace />;
  }

  // When customer is on /customer without being logged in and not on explicit login/signup/scan routes:
  if (!isAuthenticated && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup') && !slug) {
    return <Navigate to="/" replace />;
  }

  // =========================================================================
  // VIEW 2: DEDICATED CUSTOMER LOGIN & SIGN UP PAGE (WITH OTP SIGNIN)
  // When customer accesses /customer/login or /customer/signup
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-between selection:bg-red-500 selection:text-white font-sans">
        
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
                Customer Rewards Club
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

        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            
            <div className="bg-gradient-to-r from-[#6b0f1a] via-[#851421] to-[#5c0d16] p-6 sm:p-8 text-white relative">
              <div className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
                <Gift className="w-5 h-5 text-amber-300" />
              </div>
              <span className="inline-flex items-center space-x-1 bg-white/20 backdrop-blur-xs text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full mb-2 border border-white/20">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Loyalty & Counter Stamps</span>
              </span>
              <h2 className="text-2xl font-black tracking-tight">
                {authMode === 'signin' ? 'Customer Rewards Login' : 'Join Customer Rewards Club'}
              </h2>
              <p className="text-xs text-red-100 font-medium mt-1 leading-relaxed">
                {authMode === 'signin' 
                  ? 'Access your digital stamps, unlocked rewards, and counter vouchers.'
                  : 'Register in seconds to collect stamps and unlock instant in-store rewards!'}
              </p>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
                <button
                  type="button"
                  onClick={() => { setAuthMode('signin'); setLoginError(''); setSignupError(''); }}
                  className={`flex-1 py-2 text-xs font-black rounded-lg transition cursor-pointer ${
                    authMode === 'signin'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Sign In (OTP)
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setLoginError(''); setSignupError(''); }}
                  className={`flex-1 py-2 text-xs font-black rounded-lg transition cursor-pointer ${
                    authMode === 'signup'
                      ? 'bg-[#74111d] text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Join Free (Sign Up)
                </button>
              </div>

              {loginError && authMode === 'signin' && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{loginError}</span>
                </div>
              )}
              {signupError && authMode === 'signup' && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{signupError}</span>
                </div>
              )}

              {authMode === 'signin' && (
                <div>
                  {!loginOtpSent ? (
                    <form onSubmit={handleSendLoginOtp} className="space-y-4">
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
                            value={loginPhone}
                            onChange={(e) => setLoginPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                            placeholder="Enter 10-digit mobile"
                            required
                            className="w-full bg-white border border-slate-200 rounded-r-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#74111d]"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loginLoading}
                        className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-black py-3 rounded-xl text-xs transition shadow-md shadow-red-900/20 cursor-pointer flex items-center justify-center space-x-1.5"
                      >
                        {loginLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <span>Send Login OTP</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyLoginOtp} className="space-y-4">
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-slate-500 font-medium">OTP sent to:</span>
                          <div className="font-bold text-slate-900">+91 {loginPhone}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setLoginOtpSent(false); setLoginError(''); }}
                          className="text-red-700 hover:underline font-bold text-xs"
                        >
                          Change
                        </button>
                      </div>

                      {loginDevOtp && (
                        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between">
                          <span>Demo/Test Code: <strong className="font-mono text-sm">{loginDevOtp}</strong></span>
                          <button
                            type="button"
                            onClick={() => setLoginOtp(loginDevOtp)}
                            className="text-[11px] bg-amber-200 hover:bg-amber-300 px-2 py-0.5 rounded-lg font-bold"
                          >
                            Auto-fill
                          </button>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                          6-Digit OTP Code
                        </label>
                        <input
                          type="text"
                          value={loginOtp}
                          onChange={(e) => setLoginOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                          placeholder="e.g. 123456"
                          maxLength={6}
                          required
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-3 text-center text-lg font-mono font-black tracking-widest text-slate-900 focus:outline-none focus:border-[#74111d]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loginLoading}
                        className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-black py-3 rounded-xl text-xs transition shadow-md shadow-red-900/20 cursor-pointer flex items-center justify-center space-x-1.5"
                      >
                        {loginLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Verify OTP & Open Dashboard</span>
                          </>
                        )}
                      </button>

                      <div className="text-center text-xs text-slate-500">
                        {loginCountdown > 0 ? (
                          <span>Resend OTP in <strong>{loginCountdown}s</strong></span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendLoginOtp}
                            className="text-red-700 hover:underline font-bold cursor-pointer"
                          >
                            Resend OTP Code
                          </button>
                        )}
                      </div>
                    </form>
                  )}
                </div>
              )}

              {authMode === 'signup' && (
                <div>
                  {!signupOtpSent ? (
                    <form onSubmit={handleSendSignupOtp} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          placeholder="e.g. Ananya Sharma"
                          required
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#74111d]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                          Mobile Number
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-700 text-xs font-bold">
                            +91
                          </span>
                          <input
                            type="tel"
                            value={signupPhone}
                            onChange={(e) => setSignupPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                            placeholder="Enter 10-digit mobile"
                            required
                            className="w-full bg-white border border-slate-200 rounded-r-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#74111d]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                          Email <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="email"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          placeholder="e.g. ananya@gmail.com"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#74111d]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={signupLoading}
                        className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-black py-3 rounded-xl text-xs transition shadow-md shadow-red-900/20 cursor-pointer flex items-center justify-center space-x-1.5"
                      >
                        {signupLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <span>Send Verification Code</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifySignupOtp} className="space-y-4">
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-slate-500 font-medium">Code sent to:</span>
                          <div className="font-bold text-slate-900">+91 {signupPhone}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setSignupOtpSent(false); setSignupError(''); }}
                          className="text-red-700 hover:underline font-bold text-xs"
                        >
                          Change
                        </button>
                      </div>

                      {signupDevOtp && (
                        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between">
                          <span>Demo/Test Code: <strong className="font-mono text-sm">{signupDevOtp}</strong></span>
                          <button
                            type="button"
                            onClick={() => setSignupOtp(signupDevOtp)}
                            className="text-[11px] bg-amber-200 hover:bg-amber-300 px-2 py-0.5 rounded-lg font-bold"
                          >
                            Auto-fill
                          </button>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                          6-Digit Verification Code
                        </label>
                        <input
                          type="text"
                          value={signupOtp}
                          onChange={(e) => setSignupOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                          placeholder="e.g. 123456"
                          maxLength={6}
                          required
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-3 text-center text-lg font-mono font-black tracking-widest text-slate-900 focus:outline-none focus:border-[#74111d]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={signupLoading}
                        className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-black py-3 rounded-xl text-xs transition shadow-md shadow-red-900/20 cursor-pointer flex items-center justify-center space-x-1.5"
                      >
                        {signupLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Gift className="w-4 h-4 text-amber-300" />
                            <span>Verify & Create Account 🎁</span>
                          </>
                        )}
                      </button>

                      <div className="text-center text-xs text-slate-500">
                        {signupCountdown > 0 ? (
                          <span>Resend in <strong>{signupCountdown}s</strong></span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendSignupOtp}
                            className="text-red-700 hover:underline font-bold cursor-pointer"
                          >
                            Resend Code
                          </button>
                        )}
                      </div>
                    </form>
                  )}
                </div>
              )}

            </div>

          </div>
        </div>

        <footer className="text-center p-4 text-slate-500 text-xs">
          © 2026 BeAurex Loyalty Portal • Fast SMS OTP Authentication
        </footer>

      </div>
    );
  }

  // =========================================================================
  // VIEW 3: FULL CUSTOMER DASHBOARD & WALLET (/customer)
  // Contains 3 Tabs: Home (Dashboard), Scan (QR Camera & Simulator), Rewards (PINs)
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between selection:bg-red-500 selection:text-white pb-20 md:pb-6 font-sans">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <Link to="/" className="flex items-center space-x-2.5">
          <img 
            src="/beaurex-icon.jpg" 
            alt="BeAurex" 
            className="w-9 h-9 rounded-xl object-cover shadow-xs border border-slate-200"
          />
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight leading-none text-slate-900">
              Be<span className="text-[#851421]">Aurex</span>
            </span>
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider mt-0.5">
              Customer Loyalty & Rewards
            </span>
          </div>
        </Link>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={() => {
              setScannedQrData('kafeen-4040');
              fetchStoreBySlug('kafeen-4040');
            }}
            className="hidden sm:inline-flex items-center space-x-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 transition cursor-pointer"
            title="Test Counter Standee Scan"
          >
            <Store className="w-3.5 h-3.5 text-red-600" />
            <span>Counter Standee View</span>
          </button>

          <button
            onClick={() => setProfileModalOpen(true)}
            className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full pl-1.5 pr-3 py-1 transition cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#74111d] to-[#9e1627] text-white flex items-center justify-center font-black text-xs shadow-xs">
              {(customerUser.name || 'C').charAt(0)}
            </div>
            <span className="text-xs font-bold text-slate-700 max-w-[90px] truncate">
              {customerUser.name || (customerMobile ? `+91 ${customerMobile.slice(-4)}` : 'Guest')}
            </span>
          </button>

          <button
            onClick={handleCustomerLogout}
            className="flex items-center space-x-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 px-2.5 py-1.5 rounded-xl transition cursor-pointer text-xs font-bold"
            title="Log Out to Landing Page"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 pb-28 sm:pb-32">
        
        {/* ========================================================= */}
        {/* TAB 1: HOME (CUSTOMER METRICS & LOYALTY STAMP CARDS) */}
        {/* ========================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            
            <div className="bg-gradient-to-r from-[#660f1a] via-[#851421] to-[#550c15] text-white rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-start justify-between relative z-10">
                <div>
                  <span className="inline-flex items-center space-x-1 bg-white/20 backdrop-blur-xs text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full mb-2 border border-white/20">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>{customerUser.tier || 'Bronze Member'}</span>
                  </span>
                  <h2 className="text-2xl font-black tracking-tight">
                    Welcome, {customerUser.name || (customerMobile ? `+91 ${customerMobile}` : 'Shopper')}!
                  </h2>
                  <p className="text-xs text-red-100 font-medium mt-1">
                    Collect stamps at your favorite stores and unlock instant discounts.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/20 text-center shrink-0">
                  <span className="text-[10px] uppercase font-bold text-amber-300 block">Balance</span>
                  <div className="text-xl font-black font-mono mt-0.5">
                    {customerUser.points || 150} <span className="text-xs font-normal">pts</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
                <span className="text-xs text-red-200">
                  Standing at a store counter?
                </span>
                <button
                  onClick={() => { setActiveTab('scan'); }}
                  className="bg-white text-slate-900 hover:bg-slate-100 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-red-600" />
                  <span>Scan Standee QR</span>
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Active Cards
                  </span>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">
                    {customerUser.storeProgress?.length || 1}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                  <Store className="w-5 h-5" />
                </div>
              </div>

              <div 
                onClick={() => { setActiveTab('reward'); setRewardSubTab('to_claim'); }}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between cursor-pointer hover:border-amber-400 transition"
                title="View your unlocked vouchers"
              >
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Unlocked Rewards
                  </span>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">
                    {vouchersList.filter(v => v.status === 'ACTIVE').length}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                  <Gift className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* ACTIVE LOYALTY CARDS */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Continue Collecting Stamps
                </h3>
                <span className="text-xs font-bold text-slate-500">
                  Tap card to check in
                </span>
              </div>

              <div className="space-y-3.5">
                {availableStores.map((store) => {
                  const prog = getStoreProgress(store.slug);
                  const isUnlocked = prog.stampsCollected >= (prog.totalStamps || 5);
                  const StoreIcon = store.icon;

                  return (
                    <div 
                      key={store.slug}
                      className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs hover:border-slate-300 transition"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center font-bold border border-red-100">
                            <StoreIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-900">
                              {store.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 font-medium">
                              {prog.stampsCollected} of {prog.totalStamps || 5} Stamps Collected
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                          {isUnlocked ? 'Milestone Complete 🎉' : `${(prog.totalStamps || 5) - prog.stampsCollected} more to reward`}
                        </span>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 my-2">
                        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                          {Array.from({ length: prog.totalStamps || 5 }).map((_, idx) => {
                            const isCollected = idx < prog.stampsCollected;
                            const isRewardStamp = idx === (prog.totalStamps || 5) - 1;

                            return (
                              <div
                                key={idx}
                                className={`flex-1 aspect-square max-w-12 rounded-xl flex items-center justify-center transition ${
                                  isCollected
                                    ? 'bg-[#74111d] text-white shadow-xs'
                                    : isRewardStamp
                                    ? 'border-2 border-dashed border-amber-300 bg-amber-50 text-amber-500'
                                    : 'border border-slate-200 bg-white text-slate-400'
                                }`}
                              >
                                {isCollected ? (
                                  <Check className="w-4 h-4 stroke-[3]" />
                                ) : isRewardStamp ? (
                                  <Gift className="w-3.5 h-3.5" />
                                ) : (
                                  <span className="text-[11px] font-bold font-mono">{idx + 1}</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                        <div className="text-xs">
                          <span className="text-slate-500 font-medium">Reward: </span>
                          <span className="font-black text-slate-900 bg-red-50 text-red-700 px-2 py-0.5 rounded-md border border-red-100">
                            30% OFF Order
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            if (isUnlocked) {
                              handleClaimAvailableReward({
                                id: 'milestone_' + store.slug,
                                storeName: store.name,
                                storeSlug: store.slug,
                                title: `${store.name} Milestone Reward (Unlocked)`,
                                discountValue: 30
                              });
                            } else {
                              setScannedQrData(store.slug);
                              fetchStoreBySlug(store.slug);
                              setActiveTab('scan');
                            }
                          }}
                          className="bg-[#74111d] hover:bg-[#5e0c15] text-white text-xs font-black px-3.5 py-2 rounded-xl transition flex items-center space-x-1 shadow-xs cursor-pointer"
                        >
                          {isUnlocked ? <Gift className="w-3.5 h-3.5 text-amber-300" /> : <QrCode className="w-3.5 h-3.5" />}
                          <span>{isUnlocked ? 'Claim Reward 🎁' : 'Check In at Store'}</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: SCAN (REAL CAMERA QR DECODER & STAND-EE SIMULATOR) */}
        {/* Powered by live jsQR video frame decoding! */}
        {/* ========================================================= */}
        {activeTab === 'scan' && (
          <div className="max-w-md mx-auto space-y-4 animate-in fade-in duration-150">
            
            <div className="text-center">
              <h2 className="text-xl font-black text-slate-900">
                Scan Store QR Standee
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Point your camera at any store's counter standee to decode & check in
              </p>
            </div>

            {/* REAL CAMERA VIEWFINDER WITH jsQR */}
            <div className="relative w-full aspect-square max-w-[320px] mx-auto bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 flex flex-col items-center justify-between p-4">
              
              <div className="w-full flex justify-between items-center text-white/80 text-[10px] font-mono z-10">
                <span className="flex items-center space-x-1.5">
                  <span className={`w-2 h-2 rounded-full ${cameraActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                  <span>{cameraActive ? 'jsQR SCANNING LIVE' : 'CAMERA READY'}</span>
                </span>
                <span>BEAUREX 2.0</span>
              </div>

              {/* Video Element */}
              <video 
                ref={videoRef}
                playsInline
                muted
                className={`absolute inset-0 w-full h-full object-cover ${cameraActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              />

              {/* Viewfinder Target Brackets */}
              <div className="relative w-48 h-48 border-2 border-dashed border-red-500/80 rounded-2xl flex items-center justify-center overflow-hidden my-auto z-10">
                <div className="absolute top-0 left-0 w-5 h-5 border-t-3 border-l-3 border-red-500"></div>
                <div className="absolute top-0 right-0 w-5 h-5 border-t-3 border-r-3 border-red-500"></div>
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b-3 border-l-3 border-red-500"></div>
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b-3 border-r-3 border-red-500"></div>

                <QrCode className="w-20 h-20 text-white/30" />
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-lg shadow-red-500 animate-bounce"></div>
              </div>

              <div className="text-white/80 text-xs text-center z-10 font-medium">
                <span>Hold steady — QR decodes automatically in frame</span>
              </div>

            </div>

            {cameraError && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 text-center font-medium">
                {cameraError}
              </div>
            )}

            {/* SCAN ALTERNATIVES: IMAGE UPLOAD & CODE ENTRY */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
                  Scan Options & Standee Selector
                </span>
                <label className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1 rounded-xl cursor-pointer flex items-center space-x-1 border border-slate-200">
                  <Image className="w-3.5 h-3.5 text-red-600" />
                  <span>Upload QR Photo</span>
                  <input type="file" accept="image/*" onChange={handleQrImageUpload} className="hidden" />
                </label>
              </div>

              {/* Store Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Or Pick a Store to Check In
                </label>
                <div className="flex space-x-2">
                  <select
                    value={selectedSimStore}
                    onChange={(e) => setSelectedSimStore(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#74111d]"
                  >
                    {availableStores.map(s => (
                      <option key={s.slug} value={s.slug}>
                        {s.name} ({s.category})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      setScannedQrData(selectedSimStore);
                      fetchStoreBySlug(selectedSimStore);
                    }}
                    className="bg-[#74111d] hover:bg-[#5e0c15] text-white px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer"
                  >
                    Open
                  </button>
                </div>
              </div>

              {/* Manual Code / Slug Input */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (manualCodeInput.trim()) {
                    handleQrDetected(manualCodeInput.trim());
                  }
                }}
                className="pt-2 border-t border-slate-100 flex space-x-2"
              >
                <input
                  type="text"
                  value={manualCodeInput}
                  onChange={(e) => setManualCodeInput(e.target.value)}
                  placeholder="Enter store slug (e.g. kafeen-4040)"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#74111d]"
                />
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Go
                </button>
              </form>

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: REWARDS (UNLOCKED CASHIER PINs & VOUCHERS) */}
        {/* ========================================================= */}
        {activeTab === 'reward' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            
            <div>
              <h2 className="text-xl font-black text-slate-900">
                My Rewards & Vouchers
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Show the 4-digit PIN to the cashier at the counter to redeem your discount
              </p>
            </div>

            <div className="flex rounded-2xl bg-slate-200 p-1">
              <button
                type="button"
                onClick={() => setRewardSubTab('to_claim')}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition cursor-pointer ${
                  rewardSubTab === 'to_claim'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Active Rewards ({vouchersList.filter(v => v.status === 'ACTIVE').length})
              </button>
              <button
                type="button"
                onClick={() => setRewardSubTab('history')}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition cursor-pointer ${
                  rewardSubTab === 'history'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Redeemed History ({vouchersList.filter(v => v.status === 'REDEEMED').length})
              </button>
            </div>

            {rewardSubTab === 'to_claim' && (
              <div className="space-y-4">
                {/* Active Vouchers from MongoDB */}
                {vouchersList.filter(v => v.status === 'ACTIVE').length > 0 ? (
                  <div className="space-y-3.5">
                    {vouchersList.filter(v => v.status === 'ACTIVE').map((voucher) => (
                      <div 
                        key={voucher._id}
                        className="bg-white border-2 border-emerald-500/20 rounded-3xl p-5 shadow-xs space-y-3 hover:border-emerald-500/40 transition"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-sm shrink-0">
                              <Gift className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                {voucher.storeName || 'Store Reward'}
                              </span>
                              <h4 className="text-base font-black text-slate-900 leading-snug">
                                {voucher.rewardTitle}
                              </h4>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Min. order ₹{voucher.minBillAmount || 200} • Valid for 7 days
                              </p>
                            </div>
                          </div>

                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                            Ready to Burn
                          </span>
                        </div>

                        <div className="bg-slate-900 text-white rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
                          <div>
                            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                              Cashier Verification PIN
                            </span>
                            <div className="flex items-center space-x-1.5 mt-1 font-mono font-black text-lg text-amber-300">
                              {String(voucher.pinCode || '4821').split('').map((d, i) => (
                                <span key={i} className="bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
                                  {d}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] font-mono text-slate-400 block">
                              {voucher.voucherCode || 'LQR-VOUCHER'}
                            </span>
                            <button
                              onClick={() => handleCopyText(voucher.pinCode || '4821', 'pin')}
                              className="mt-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-1 rounded-xl border border-slate-700 transition flex items-center space-x-1 cursor-pointer"
                            >
                              <Copy className="w-3 h-3 text-amber-400" />
                              <span>{copiedPin ? 'Copied' : 'Copy PIN'}</span>
                            </button>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-500 bg-slate-50 rounded-xl p-2.5 text-center font-medium">
                          Show this 4-digit PIN to the cashier at billing counter to apply your discount.
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center space-y-2 shadow-xs">
                    <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100">
                      <Gift className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-black text-slate-900">No active vouchers right now</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Claim an available store reward below or collect stamps at checkout to unlock rewards!
                    </p>
                  </div>
                )}

                {/* Available Store Rewards to Claim */}
                <div className="pt-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Available Rewards to Claim</span>
                    </h3>
                    <span className="text-[11px] font-bold text-slate-400">1-Tap Claim</span>
                  </div>

                  <div className="space-y-2.5">
                    {availableOffersToClaim.map((offer) => (
                      <div
                        key={offer.id}
                        className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between gap-3 hover:border-slate-300 transition"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                              {offer.storeName}
                            </span>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${offer.color}`}>
                              {offer.tag}
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate mt-0.5">
                            {offer.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Min. order ₹{offer.minBillAmount} • Instant 4-digit Cashier PIN
                          </p>
                        </div>

                        <button
                          onClick={() => handleClaimAvailableReward(offer)}
                          disabled={claimingRewardId === (offer.id || offer.storeSlug)}
                          className="bg-[#74111d] hover:bg-[#5e0c15] text-white text-xs font-black px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-xs shrink-0 cursor-pointer disabled:opacity-50"
                        >
                          <Gift className="w-3.5 h-3.5 text-amber-300" />
                          <span>{claimingRewardId === (offer.id || offer.storeSlug) ? 'Claiming...' : 'Claim Reward 🎁'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {rewardSubTab === 'history' && (
              <div className="space-y-3">
                {vouchersList.filter(v => v.status === 'REDEEMED').length > 0 ? (
                  vouchersList.filter(v => v.status === 'REDEEMED').map((item) => (
                    <div key={item._id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-black text-slate-900">{item.rewardTitle}</h4>
                        <p className="text-xs text-slate-500">Redeemed at counter</p>
                      </div>
                      <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-2.5 py-1 rounded-full">
                        Redeemed
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-white border border-slate-200 rounded-3xl">
                    <Gift className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <h5 className="text-sm font-bold text-slate-700">No past redemptions yet</h5>
                    <p className="text-xs text-slate-400 mt-0.5">Collect stamps at the counter to unlock your first reward.</p>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 sm:max-w-md sm:mx-auto sm:bottom-3 sm:rounded-2xl sm:border sm:border-slate-200/80 sm:shadow-xl z-40 bg-white border-t border-slate-200 px-6 py-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-3 transition cursor-pointer ${
            activeTab === 'dashboard' ? 'text-red-700 font-black' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px] font-black mt-1">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('scan')}
          className="-mt-7 w-14 h-14 rounded-full bg-gradient-to-tr from-[#74111d] to-[#9b1727] text-white flex items-center justify-center shadow-xl shadow-red-900/40 border-4 border-white active:scale-95 transition transform cursor-pointer"
          aria-label="Scan Counter QR"
        >
          <QrCode className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          onClick={() => setActiveTab('reward')}
          className={`flex flex-col items-center justify-center py-1 px-3 transition cursor-pointer ${
            activeTab === 'reward' ? 'text-red-700 font-black' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Gift className="w-5 h-5" />
          <span className="text-[11px] font-black mt-1">Rewards</span>
        </button>
      </nav>

      {/* PROFILE DETAILS & LOGOUT MODAL */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setProfileModalOpen(false)}
          />

          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-200 my-auto">
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

            <div className="p-6 text-center border-b border-slate-100">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#74111d] to-[#9e1627] text-white font-black text-xl flex items-center justify-center mx-auto mb-2 shadow-md">
                {(customerUser.name || 'C').charAt(0)}
              </div>
              <h4 className="text-lg font-black text-slate-900">
                {customerUser.name || 'Shopper'}
              </h4>
              <span className="inline-flex items-center space-x-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-0.5 rounded-full mt-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{customerUser.tier || 'Bronze Member'}</span>
              </span>

              <div className="mt-4 bg-slate-50 rounded-xl p-2.5 flex items-center justify-between border border-slate-200">
                <div className="text-left">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Customer ID</span>
                  <span className="font-mono font-black text-slate-900 text-sm">
                    {customerUser.customerId || 'LQR-MEMBER'}
                  </span>
                </div>
                <button
                  onClick={() => handleCopyText(customerUser.customerId || 'LQR-MEMBER', 'id')}
                  className="bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200 transition cursor-pointer flex items-center space-x-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedId ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="p-4 space-y-2 text-xs border-b border-slate-100">
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Mobile:</span>
                <span className="font-bold text-slate-900">+91 {customerMobile || 'Not set'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Reward Points:</span>
                <span className="font-black text-red-700">{customerUser.points || 150} pts</span>
              </div>
            </div>

            <div className="p-4 bg-white">
              <button
                onClick={handleCustomerLogout}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-black py-2.5 rounded-xl text-xs transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out of Rewards</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

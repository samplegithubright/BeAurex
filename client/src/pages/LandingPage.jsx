import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { 
  Store, Gift, ShieldCheck, Sparkles, Check, X, ArrowRight, 
  ExternalLink, Smartphone, Lock, AlertTriangle, ChevronDown, 
  CheckCircle2, Mail, MapPin, Zap, Star, Shield, RefreshCw, Eye, Menu,
  QrCode, Phone, Bell, Sliders, Layers, UserCheck, Flame
} from 'lucide-react';

// =========================================================================
// 3D PHYSICS TILT CARD COMPONENT (Framer Motion)
// =========================================================================
function TiltCard({ children, className = '', depth = 20, glow = true }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 260, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 260, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-8deg', '8deg']);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`perspective-1000 transition-shadow duration-300 ${glow ? 'hover:shadow-2xl hover:shadow-red-950/20' : ''} ${className}`}
    >
      <div style={{ transform: `translateZ(${depth}px)` }}>
        {children}
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [legalModalContent, setLegalModalContent] = useState(null);
  const [businessName, setBusinessName] = useState('');
  const [merchantPhone, setMerchantPhone] = useState('');
  const [merchantEmail, setMerchantEmail] = useState('');
  const [merchantPassword, setMerchantPassword] = useState('');
  const [merchantCategory, setMerchantCategory] = useState('CAFE_RESTAURANT');
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);
  const [contactSuccess, setContactSuccess] = useState(false);

  // Live Platform Subscription Plans (Synced from MongoDB & Super Admin)
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
      features: [
        'Customer retention system',
        'Free account setup & acrylic config',
        'Custom QR code standee generator',
        'Unlimited customer QR scans',
        'Standard Business Hours Support'
      ],
      ctaText: 'Start 3-Day Free Trial'
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
      features: [
        'Customer retention system',
        'Free account setup & acrylic config',
        'Custom QR code standee generator',
        'Unlimited customer QR scans',
        'Priority VIP Support',
        'Free Continuous Feature Updates'
      ],
      ctaText: 'Start 2-Day Trial'
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
      features: [
        'Customer retention system',
        'Free account setup & acrylic config',
        'Unlimited customer QR scans',
        'Priority VIP Support',
        'Dedicated Relationship Manager',
        'All Future Enterprise Upgrades'
      ],
      ctaText: 'Start 2-Day Trial'
    }
  ]);

  useEffect(() => {
    // 1. Fetch live plans from centralized systemStore API
    fetch('/api/public/plans')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.plans) && data.plans.length > 0) {
          const visible = data.plans.filter(p => p.isActive !== false && p.showOnLandingPage !== false);
          if (visible.length > 0) {
            setPlans(visible);
            try {
              localStorage.setItem('beaurex_platform_plans', JSON.stringify(visible));
            } catch (e) {}
          }
        }
      })
      .catch(() => {
        // Offline / cached fallback
        try {
          const cached = JSON.parse(localStorage.getItem('beaurex_platform_plans') || '[]');
          if (Array.isArray(cached) && cached.length > 0) {
            setPlans(cached);
          }
        } catch (e) {}
      });

    // 2. Real-time dynamic updates listener (triggers immediately when Super Admin updates plans)
    const handlePlansUpdate = (e) => {
      try {
        const updated = e.detail || JSON.parse(localStorage.getItem('beaurex_platform_plans') || '[]');
        if (Array.isArray(updated) && updated.length > 0) {
          const visible = updated.filter(p => p.isActive !== false && p.showOnLandingPage !== false);
          if (visible.length > 0) setPlans(visible);
        }
      } catch (err) {}
    };

    window.addEventListener('beaurex_plans_updated', handlePlansUpdate);
    window.addEventListener('storage', handlePlansUpdate);

    return () => {
      window.removeEventListener('beaurex_plans_updated', handlePlansUpdate);
      window.removeEventListener('storage', handlePlansUpdate);
    };
  }, []);

  // Scratch card simulator inside landing page
  const canvasRef = useRef(null);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [isScratched, setIsScratched] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#94a3b8');
    grad.addColorStop(0.3, '#cbd5e1');
    grad.addColorStop(0.5, '#f8fafc');
    grad.addColorStop(0.7, '#cbd5e1');
    grad.addColorStop(1, '#64748b');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 15px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH WITH MOUSE / FINGER', width / 2, height / 2 - 12);

    ctx.font = 'bold 12px Plus Jakarta Sans, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Reveal Live BeAurex Reward', width / 2, height / 2 + 14);

    let isDrawing = false;

    function scratch(x, y) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 24, 0, Math.PI * 2);
      ctx.fill();

      const imgData = ctx.getImageData(0, 0, width, height);
      const pixels = imgData.data;
      let transparentCount = 0;
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparentCount++;
      }
      const pct = Math.floor((transparentCount / (pixels.length / 4)) * 100);
      setScratchPercent(pct);

      if (pct > 35 && !isScratched) {
        setIsScratched(true);
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      }
    }

    function getCoords(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    }

    const onDown = (e) => { isDrawing = true; const { x, y } = getCoords(e); scratch(x, y); };
    const onMove = (e) => { if (!isDrawing) return; const { x, y } = getCoords(e); scratch(x, y); };
    const onUp = () => { isDrawing = false; };

    canvas.addEventListener('mousedown', onDown);
    canvas.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    canvas.addEventListener('touchstart', onDown, { passive: true });
    canvas.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);

    return () => {
      canvas.removeEventListener('mousedown', onDown);
      canvas.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      canvas.removeEventListener('touchstart', onDown);
      canvas.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  const handleStartTrialSubmit = async (e) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: businessName.trim() || 'My Business',
          mobile: merchantPhone.trim(),
          email: merchantEmail.trim(),
          password: merchantPassword || 'BeAurex@2026',
          category: merchantCategory || 'CAFE_RESTAURANT',
          city: 'Delhi NCR'
        })
      });

      const data = await res.json();
      if (!data.success) {
        setSignupError(data.message || 'Registration failed. Please check details and try again.');
        setSignupLoading(false);
        return;
      }

      sessionStorage.setItem('loyalqr_token', data.token);
      sessionStorage.setItem('loyalqr_merchant', JSON.stringify(data.merchant));
      sessionStorage.setItem('loyalqr_biz', data.merchant.businessName);
      localStorage.setItem('loyalqr_token', data.token);
      localStorage.setItem('loyalqr_merchant', JSON.stringify(data.merchant));
      localStorage.setItem('loyalqr_biz', data.merchant.businessName);

      window.location.href = '/merchant/dashboard?onboarding=true';
    } catch (err) {
      setSignupError(err.message || 'Network error connecting to BeAurex server.');
      setSignupLoading(false);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => setContactSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 text-slate-900 font-sans antialiased selection:bg-red-500 selection:text-white">
      
      {/* ========================================================= */}
      {/* 1. TOP TRUST NOTIFICATION BAR */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-r from-[#690005] via-[#8B0000] to-[#590104] text-white text-center py-2.5 px-4 text-xs font-bold tracking-wide flex items-center justify-center space-x-2 border-b border-[#590104] shadow-xs">
        <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center p-0.5 shrink-0 backdrop-blur-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-white" />
        </div>
        <span>Trusted by Fast-Growing Retail Stores, Cafes & Brands Across India</span>
        <span className="hidden md:inline bg-white text-[#8B0000] font-black px-2.5 py-0.5 rounded-full text-[10px] uppercase shadow-xs">
          3-Day Free Trial Active
        </span>
      </div>

      {/* ========================================================= */}
      {/* 2. NAVIGATION BAR */}
      {/* ========================================================= */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#8B0000] flex items-center justify-center text-white shadow-md shadow-red-950/20 group-hover:scale-105 transition transform">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight leading-none text-slate-900">
                BeAurex
              </span>
              <span className="text-[10px] font-black text-[#8B0000] uppercase tracking-widest mt-0.5">
                Smart QR & Loyalty Hub
              </span>
            </div>
          </Link>

          {/* Center Links (Desktop) */}
          <div className="hidden lg:flex items-center space-x-8 text-xs font-extrabold text-slate-600">
            <a href="#strengths" className="hover:text-[#8B0000] transition">Features</a>
            <a href="#reality-check" className="hover:text-[#8B0000] transition">The Reality Check</a>
            <a href="#how-it-works" className="hover:text-[#8B0000] transition">How It Works</a>
            <a href="#pricing" className="hover:text-[#8B0000] transition">Pricing Plans</a>
            <a href="#faq" className="hover:text-[#8B0000] transition">FAQs</a>
            <a href="#contact" className="hover:text-[#8B0000] transition">Contact</a>
          </div>

          {/* Actions: Login Dropdown & Start Free Trial */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Login Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                className="text-slate-700 hover:text-slate-900 font-bold text-xs sm:text-sm px-3 py-2 rounded-xl transition flex items-center space-x-1 border border-slate-200 hover:border-slate-300 bg-slate-50 cursor-pointer"
              >
                <span>Login</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {loginDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <Link
                    to="/merchant/login"
                    onClick={() => setLoginDropdownOpen(false)}
                    className="w-full text-left px-3.5 py-3 hover:bg-slate-50 rounded-xl font-bold text-xs text-slate-700 flex items-center space-x-2.5 transition"
                  >
                    <div className="w-7 h-7 rounded-lg bg-rose-100 text-[#74111d] flex items-center justify-center shrink-0">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-slate-900 font-extrabold">Store Owner / Merchant Login</div>
                      <div className="text-[10px] text-slate-400 font-normal">Manage standees, scans & rewards</div>
                    </div>
                  </Link>

                  <Link
                    to="/customer/login"
                    onClick={() => setLoginDropdownOpen(false)}
                    className="w-full text-left px-3.5 py-3 hover:bg-slate-50 rounded-xl font-bold text-xs text-slate-700 flex items-center space-x-2.5 border-t border-slate-100 transition"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-slate-900 font-extrabold">Customer Login</div>
                      <div className="text-[10px] text-slate-400 font-normal">Login with Phone OTP or Email</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Start Free Trial CTA */}
            <button
              onClick={() => setSignupModalOpen(true)}
              className="hidden sm:flex bg-[#74111d] hover:bg-[#5e0c15] text-white font-extrabold px-4 sm:px-6 py-2.5 rounded-xl shadow-md shadow-[#74111d]/25 transition transform hover:-translate-y-0.5 cursor-pointer text-xs sm:text-sm items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Free Trial</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileNavOpen ? <X className="w-5 h-5 text-red-600" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer Modal */}
        {mobileNavOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileNavOpen(false)}
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
                      <span className="font-black text-slate-900 text-sm">Be<span className="text-[#851421]">Aurex</span></span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Loyalty Platform</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setMobileNavOpen(false)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 border border-slate-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Section Links */}
                <div className="p-4 space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Explore Platform
                  </div>
                  <a 
                    href="#strengths" 
                    onClick={() => setMobileNavOpen(false)}
                    className="block px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-[#851421] transition"
                  >
                    Features & Apps
                  </a>
                  <a 
                    href="#reality-check" 
                    onClick={() => setMobileNavOpen(false)}
                    className="block px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-[#851421] transition"
                  >
                    The Reality Check
                  </a>
                  <a 
                    href="#how-it-works" 
                    onClick={() => setMobileNavOpen(false)}
                    className="block px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-[#851421] transition"
                  >
                    How It Works
                  </a>
                  <a 
                    href="#pricing" 
                    onClick={() => setMobileNavOpen(false)}
                    className="block px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-[#851421] transition"
                  >
                    Pricing Plans
                  </a>
                  <a 
                    href="#faq" 
                    onClick={() => setMobileNavOpen(false)}
                    className="block px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-[#851421] transition"
                  >
                    Frequently Asked Questions
                  </a>
                  <a 
                    href="#contact" 
                    onClick={() => setMobileNavOpen(false)}
                    className="block px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-[#851421] transition"
                  >
                    Contact Support
                  </a>

                  {/* Portals Section */}
                  <div className="pt-3 mt-2 border-t border-slate-100">
                    <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Access Portals
                    </div>
                    <Link
                      to="/merchant/login"
                      onClick={() => setMobileNavOpen(false)}
                      className="block px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-red-50 hover:text-[#851421] transition"
                    >
                      Store Owner / Merchant Login
                    </Link>
                    <Link
                      to="/customer/login"
                      onClick={() => setMobileNavOpen(false)}
                      className="block px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
                    >
                      Customer Login (Phone OTP / Email)
                    </Link>
                    <Link
                      to="/admin"
                      onClick={() => setMobileNavOpen(false)}
                      className="block px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                    >
                      Super Admin Console
                    </Link>
                    <Link
                      to="/team"
                      onClick={() => setMobileNavOpen(false)}
                      className="block px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                    >
                      Team & Operations
                    </Link>
                  </div>
                </div>
              </div>

              {/* Drawer Footer CTA */}
              <div className="p-4 border-t border-slate-200/90 bg-slate-50">
                <button
                  onClick={() => {
                    setMobileNavOpen(false);
                    setSignupModalOpen(true);
                  }}
                  className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-extrabold py-3 rounded-xl shadow-md shadow-[#74111d]/25 transition text-xs flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start 3-Day Free Trial</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ========================================================= */}
      {/* 3. HERO SECTION (Framer Motion 3D Depth & Hover Physics)  */}
      {/* ========================================================= */}
      <motion.header 
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center relative"
      >
        
        {/* Top Tagline */}
        <div className="inline-flex items-center space-x-2 bg-rose-50 border border-rose-200/80 text-[#8B0000] font-extrabold text-xs uppercase px-4 py-1.5 rounded-full mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#8B0000]" />
          <span>India's Leading Counter Retention Engine</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto mb-6">
          Turn Every Customer Visit Into A <span className="text-[#8B0000]">Repeat Customer</span>
        </h1>
        
        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
          A powerful counter gamification system that turns your local business into a high-loyalty customer magnet.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 max-w-md mx-auto mb-6">
          <button
            onClick={() => setSignupModalOpen(true)}
            className="w-full bg-[#8B0000] hover:bg-[#720000] text-white font-black px-7 py-3.5 rounded-xl text-sm shadow-xl shadow-red-950/25 transition transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>Claim Your 3-Day Free Trial</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <a
            href="#strengths"
            className="w-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold px-5 py-3.5 rounded-xl text-sm transition cursor-pointer flex items-center justify-center space-x-2 shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-[#8B0000]" />
            <span>Explore Standee Features</span>
          </a>
        </div>

        <div className="max-w-2xl mx-auto bg-slate-100 border border-slate-200/80 rounded-xl p-3 mb-12 flex items-center justify-center space-x-2 text-xs text-slate-700 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>A Proudly Indian Platform built to empower retail stores, bakeries, cafes & supermarkets across INDIA.</span>
        </div>

        {/* 3D Acrylic Counter Standee Showcase Image (Mobile + Desktop Responsive) */}
        <motion.div 
          animate={{ y: [0, -7, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="max-w-5xl mx-auto bg-white/90 backdrop-blur-md border border-white/60 sm:border-slate-200/90 rounded-3xl p-3 sm:p-5 shadow-2xl overflow-hidden relative group perspective-1000"
        >
          <picture className="block w-full">
            <source media="(max-width: 767px)" srcSet="/hero-standee-mobile.jpg" />
            <img 
              src="/hero-standee.jpg" 
              alt="BeAurex Counter Standee & Mobile Scratch Card Experience" 
              className="w-full h-auto rounded-2xl object-cover shadow-sm group-hover:scale-[1.01] transition duration-500 max-h-[580px] sm:max-h-none"
            />
          </picture>
          <div className="mt-3 sm:mt-0 sm:absolute sm:bottom-6 sm:left-10 sm:right-10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-xl text-left">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-[#8B0000] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="font-black text-sm text-slate-900">Custom Acrylic Counter Standees</div>
                <div className="text-xs text-slate-500 font-medium">Download print-ready vector 5x7" counter templates instantly</div>
              </div>
            </div>
            <button
              onClick={() => setSignupModalOpen(true)}
              className="w-full sm:w-auto bg-[#8B0000] hover:bg-[#720000] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap shadow-md shadow-red-950/20 text-center"
            >
              Get Your Store QR Standee
            </button>
          </div>
        </motion.div>

      </motion.header>

      {/* ========================================================= */}
      {/* 4. CORE STRENGTHS 3-CARD GRID (3D Tilt Cards)             */}
      {/* ========================================================= */}
      <section id="strengths" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          <TiltCard className="h-full">
            <div className="bg-white border border-slate-200/90 p-6 rounded-3xl shadow-xs hover:shadow-xl transition h-full flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#8B0000] flex items-center justify-center mb-4 border border-rose-100 shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-900 text-base mb-1.5">Zero Hidden Contracts</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">
                No credit card required to start. No auto-debits, no hidden platform charges, and no forced renewals. You retain full control.
              </p>
            </div>
          </TiltCard>
          
          <TiltCard className="h-full">
            <div className="bg-white border border-slate-200/90 p-6 rounded-3xl shadow-xs hover:shadow-xl transition h-full flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#8B0000] flex items-center justify-center mb-4 border border-rose-100 shadow-xs">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-900 text-base mb-1.5">Quick & Instant Browser Scan</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">
                Customers scan instantly through their default phone camera. No slow app installations or tedious account setups.
              </p>
            </div>
          </TiltCard>

          <TiltCard className="h-full">
            <div className="bg-white border border-slate-200/90 p-6 rounded-3xl shadow-xs hover:shadow-xl transition h-full flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#8B0000] flex items-center justify-center mb-4 border border-rose-100 shadow-xs">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-900 text-base mb-1.5">100% Guarded Privacy</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">
                Customer data is strictly isolated and guarded with bank-level encryption. Customers face zero unsolicited marketing spam.
              </p>
            </div>
          </TiltCard>

        </div>
      </section>



      {/* ========================================================= */}
      {/* 6. CRITICAL PAIN POINTS & SOLUTIONS (THE REALITY CHECK) */}
      {/* ========================================================= */}
      <section id="reality-check" className="bg-white py-20 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-50 border border-red-200 px-3 py-1 rounded-full">
              The Reality Check
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 mt-3">
              Why Traditional Stores Lose Valued Customers
            </h2>
            <p className="text-slate-600 text-sm mt-3 font-medium leading-relaxed">
              Without an automated retention loop, local customers naturally shift to aggressive delivery apps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* The Retention Leak Box */}
            <div className="bg-rose-50/70 border-2 border-rose-200/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-rose-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">
                    <X className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-rose-950 font-black text-xl tracking-tight">The Retention Leak</h3>
                </div>

                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs">
                    <h4 className="font-black text-rose-900 text-sm flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Lost After the Sale</span>
                    </h4>
                    <p className="text-slate-600 text-xs mt-1.5 leading-relaxed font-medium">
                      Most customers buy, pay cash or UPI, and leave—making them completely unreachable tomorrow for repeat purchases.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs">
                    <h4 className="font-black text-rose-900 text-sm flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Profit-Bleeding Discounts</span>
                    </h4>
                    <p className="text-slate-600 text-xs mt-1.5 leading-relaxed font-medium">
                      Displaying flat percentage cuts on checkout counters permanently burns your daily profit margin without driving future curiosity.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs">
                    <h4 className="font-black text-rose-900 text-sm flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Aggressive App Competition</span>
                    </h4>
                    <p className="text-slate-600 text-xs mt-1.5 leading-relaxed font-medium">
                      Online delivery platforms spend millions to capture your daily offline neighborhood clients away with targeted push promotions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* The BeAurex Solution Box */}
            <div className="bg-emerald-50/70 border-2 border-emerald-200/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-emerald-950 font-black text-xl tracking-tight">The BeAurex Solution</h3>
                </div>

                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-2xs">
                    <h4 className="font-black text-emerald-900 text-sm flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Automated Dynamic Retention</span>
                    </h4>
                    <p className="text-slate-600 text-xs mt-1.5 leading-relaxed font-medium">
                      Customers scan the QR code right at your register. It opens instantly on their phone, unlocking time-sensitive vouchers that bring them back.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-2xs">
                    <h4 className="font-black text-emerald-900 text-sm flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>High-Dopamine Gamification</span>
                    </h4>
                    <p className="text-slate-600 text-xs mt-1.5 leading-relaxed font-medium">
                      Scratch card curiosity mechanics convert regular checkout loops into memorable moments that customers tell their friends and family about.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-2xs">
                    <h4 className="font-black text-emerald-900 text-sm flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>100% Privacy & Zero Spam</span>
                    </h4>
                    <p className="text-slate-600 text-xs mt-1.5 leading-relaxed font-medium">
                      We protect customer data completely. No promotional spam. Shoppers feel safe and respect your business's modern digital environment.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. SETUP IN JUST 3 SIMPLE STEPS */}
      {/* ========================================================= */}
      <section id="how-it-works" className="bg-slate-50 py-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h2 className="text-3xl font-black text-center text-slate-900 mb-12">
            Setup in Just 3 Simple Steps
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            <TiltCard className="h-full">
              <div className="bg-white border border-slate-200/90 p-6 sm:p-8 rounded-3xl text-center shadow-xs hover:shadow-xl transition h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-[#8B0000] text-white font-black text-lg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-red-950/20">
                    1
                  </div>
                  <h3 className="font-black text-lg mb-2 text-slate-900">Register Your Business</h3>
                  <p className="text-slate-600 text-xs leading-relaxed font-medium">
                    Create your account inside two minutes and activate your live trial block immediately without entering credit card details.
                  </p>
                </div>
              </div>
            </TiltCard>

            <TiltCard className="h-full">
              <div className="bg-white border border-slate-200/90 p-6 sm:p-8 rounded-3xl text-center shadow-xs hover:shadow-xl transition h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-[#8B0000] text-white font-black text-lg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-red-950/20">
                    2
                  </div>
                  <h3 className="font-black text-lg mb-2 text-slate-900">Display Your Shop Standee</h3>
                  <p className="text-slate-600 text-xs leading-relaxed font-medium">
                    Download your custom high-resolution counter configuration template from the dashboard and insert it into a standard acrylic holder.
                  </p>
                </div>
              </div>
            </TiltCard>

            <TiltCard className="h-full">
              <div className="bg-white border border-slate-200/90 p-6 sm:p-8 rounded-3xl text-center shadow-xs hover:shadow-xl transition h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-[#8B0000] text-white font-black text-lg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-red-950/20">
                    3
                  </div>
                  <h3 className="font-black text-lg mb-2 text-slate-900">Watch Customers Return</h3>
                  <p className="text-slate-600 text-xs leading-relaxed font-medium">
                    Visitors scan to play instant scratch cards, unlocking discounts for their next visit and keeping them loyal to your local business.
                  </p>
                </div>
              </div>
            </TiltCard>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. PRICING PLANS SECTION (3D Framer Motion Tilt Physics)  */}
      {/* ========================================================= */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#8B0000] uppercase tracking-widest bg-rose-50 border border-rose-200/80 px-3.5 py-1 rounded-full shadow-xs">
            Fair & Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 mt-3 mb-2">
            Invest in Your Business Growth
          </h2>
          <p className="text-slate-600 text-sm font-medium">
            Choose a timeline that works best for your expansion strategy. No hidden charges or automatic debit renewals.
          </p>
        </div>
        
        <div className={`grid grid-cols-1 ${plans.length === 2 ? 'md:grid-cols-2 max-w-4xl' : plans.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4 max-w-7xl' : plans.length > 4 ? 'md:grid-cols-2 lg:grid-cols-3 max-w-7xl' : 'lg:grid-cols-3 max-w-6xl'} gap-8 items-stretch mx-auto`}>
          {plans.map((p) => {
            const isPopular = p.isPopular || p.highlightBadge === 'Most Popular';
            const isDark = p.highlightBadge === 'Best Value' || p.id?.includes('legacy');
            
            if (isDark) {
              return (
                <TiltCard key={p.id} className="h-full" depth={28}>
                  <div className="bg-gradient-to-b from-[#1c0407] to-[#0d0204] border border-[#8B0000]/50 p-8 rounded-3xl shadow-2xl text-white relative flex flex-col justify-between pt-12 h-full">
                    {(p.highlightBadge || 'Best Value') && (
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#8B0000] text-amber-300 text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider border border-[#8B0000] shadow-md">
                        {p.highlightBadge || 'Best Value'}
                      </span>
                    )}
                    
                    <div>
                      <h3 className="text-xl font-black text-white tracking-tight">{p.name}</h3>
                      <p className="text-xs text-red-200/70 mt-1 font-medium">{p.subtext}</p>
                      
                      <div className="mt-6 mb-6 pb-6 border-b border-white/10">
                        {p.originalPrice > 0 && (
                          <span className="text-sm font-bold text-red-300/60 line-through block mb-1">
                            ₹{Number(p.originalPrice).toLocaleString('en-IN')}
                          </span>
                        )}
                        <div className="text-3xl font-black text-amber-400 tracking-tight">
                          ₹{Number(p.price).toLocaleString('en-IN')} {p.period && <span className="text-sm font-medium text-slate-400">{p.period}</span>}
                        </div>
                        {p.tagText && (
                          <div className="text-slate-300 text-[10px] font-bold uppercase tracking-widest mt-1.5 flex items-center space-x-1.5">
                            <span className="bg-black/40 px-2 py-0.5 rounded text-emerald-400 font-bold border border-emerald-500/30">{p.tagText}</span>
                          </div>
                        )}
                      </div>
                      
                      <ul className="space-y-3 text-slate-300 text-xs font-semibold mb-8">
                        {(p.features || []).map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <button
                      onClick={() => setSignupModalOpen(true)}
                      className="w-full bg-white hover:bg-slate-100 text-slate-900 font-black py-3.5 rounded-xl transition cursor-pointer text-xs tracking-wide shadow-lg"
                    >
                      {p.ctaText || 'Start 2-Day Trial'}
                    </button>
                  </div>
                </TiltCard>
              );
            }

            if (isPopular) {
              return (
                <TiltCard key={p.id} className="h-full" depth={32}>
                  <div className="bg-white border-2 border-[#8B0000] p-8 rounded-3xl shadow-2xl relative flex flex-col justify-between pt-12 transform lg:-translate-y-2 h-full">
                    {(p.highlightBadge || 'Most Popular') && (
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#8B0000] text-white text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md shadow-red-950/20">
                        {p.highlightBadge || 'Most Popular'}
                      </span>
                    )}
                    
                    <div>
                      <h3 className="text-xl font-black text-[#8B0000] tracking-tight">{p.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 font-medium">{p.subtext}</p>
                      
                      <div className="mt-6 mb-6 pb-6 border-b border-slate-100">
                        {p.originalPrice > 0 && (
                          <span className="text-sm font-bold text-slate-400 line-through block mb-1">
                            ₹{Number(p.originalPrice).toLocaleString('en-IN')}
                          </span>
                        )}
                        <div className="text-3xl font-black text-slate-900 tracking-tight">
                          ₹{Number(p.price).toLocaleString('en-IN')} <span className="text-sm font-medium text-slate-500">{p.period}</span>
                        </div>
                        {p.tagText && (
                          <div className="text-[#8B0000] text-xs font-bold mt-1.5 flex items-center space-x-1 bg-rose-50 px-2.5 py-1 rounded w-fit border border-rose-200">
                            <Zap className="w-3.5 h-3.5" />
                            <span>{p.tagText}</span>
                          </div>
                        )}
                      </div>
                      
                      <ul className="space-y-3 text-slate-600 text-xs font-semibold mb-8">
                        {(p.features || []).map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span className={fIdx >= 4 ? 'font-bold text-slate-900' : ''}>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <button
                      onClick={() => setSignupModalOpen(true)}
                      className="w-full bg-[#8B0000] hover:bg-[#720000] text-white font-black py-3.5 rounded-xl transition shadow-lg shadow-red-950/25 cursor-pointer text-xs tracking-wide"
                    >
                      {p.ctaText || 'Start 2-Day Trial'}
                    </button>
                  </div>
                </TiltCard>
              );
            }

            // Standard card
            return (
              <TiltCard key={p.id} className="h-full" depth={20}>
                <div className="bg-white border border-slate-200/90 p-8 rounded-3xl shadow-sm hover:shadow-xl transition flex flex-col justify-between relative pt-10 h-full">
                  {p.highlightBadge && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      {p.highlightBadge}
                    </span>
                  )}
                  
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{p.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 font-medium">{p.subtext}</p>
                    
                    <div className="mt-6 mb-6 pb-6 border-b border-slate-100">
                      {p.originalPrice > 0 && (
                        <span className="text-sm font-bold text-slate-400 line-through block mb-1">
                          ₹{Number(p.originalPrice).toLocaleString('en-IN')}
                        </span>
                      )}
                      <div className="text-3xl font-black text-slate-900 tracking-tight">
                        ₹{Number(p.price).toLocaleString('en-IN')} <span className="text-sm font-medium text-slate-500">{p.period}</span>
                      </div>
                      {p.tagText && (
                        <div className="text-emerald-600 text-xs font-bold mt-1.5 flex items-center space-x-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{p.tagText}</span>
                        </div>
                      )}
                    </div>
                    
                    <ul className="space-y-3 text-slate-600 text-xs font-semibold mb-8">
                      {(p.features || []).map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button
                    onClick={() => setSignupModalOpen(true)}
                    className="w-full bg-slate-900 hover:bg-[#8B0000] text-white font-extrabold py-3.5 rounded-xl transition cursor-pointer text-xs tracking-wide shadow-sm"
                  >
                    {p.ctaText || 'Start 2-Day Trial'}
                  </button>
                </div>
              </TiltCard>
            );
          })}
        </div>
        
        <p className="text-center text-xs text-emerald-700 font-extrabold mt-12 bg-emerald-50 max-w-sm mx-auto py-2 rounded-full border border-emerald-200">
          Enjoy any plan free for 2 days. No card required.
        </p>
      </section>

      {/* ========================================================= */}
      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      {/* ========================================================= */}
      {/* ========================================================= */}
      {/* 9. FREQUENTLY ASKED QUESTIONS (3D Glassmorphism & Framer Motion Hover) */}
      {/* ========================================================= */}
      <section id="faq" className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-t border-slate-200/80 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-rose-200/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-50 border border-red-200 px-3.5 py-1.5 rounded-full shadow-xs">
              Clear & Transparent
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium max-w-lg mx-auto">
              Everything you need to know about setting up BeAurex customer retention at your store counter.
            </p>
          </div>
          
          <div className="space-y-4">
            
            {[
              {
                id: 1,
                q: "Will my account be automatically charged when the trial ends?",
                a: "Absolutely not. We do not require credit card details to start your trial. There are zero auto-debit loops. You manually choose whether to upgrade from your merchant hub when you see real repeat visit revenue."
              },
              {
                id: 2,
                q: "How is user phone number security managed?",
                a: "We focus strictly on isolated cloud privacy. Mobile numbers are verified via instantaneous SMS OTP and used solely for in-store voucher redemption. Shoppers face zero unsolicited promotional marketing."
              },
              {
                id: 3,
                q: "Do customers need to download an application from the App Store?",
                a: "No app download is required! Shoppers open their standard smartphone camera, scan the standee QR, and the scratch card immediately appears in their default browser."
              },
              {
                id: 4,
                q: "Can I customize the discounts and reward percentages?",
                a: "Yes, you have full control over scratch card campaign rules in your Merchant Hub. You can set percentage discounts, flat rupee off amounts, or free signature items with specific probability chances."
              }
            ].map((faq) => {
              const isOpen = activeFaq === faq.id;
              return (
                <motion.div
                  key={faq.id}
                  whileHover={{ y: -4, scale: 1.012 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                  className={`backdrop-blur-xl transition-all duration-300 rounded-3xl p-6 cursor-pointer border shadow-sm hover:shadow-2xl ${
                    isOpen
                      ? 'bg-white/95 border-red-400 ring-2 ring-red-500/15 shadow-xl shadow-red-950/5'
                      : 'bg-white/80 hover:bg-white border-white/80 hover:border-red-200/90'
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                    perspective: 1000
                  }}
                >
                  <div className="flex items-center justify-between font-extrabold text-slate-900 text-sm sm:text-base">
                    <span className="flex items-center space-x-3">
                      <span className={`w-2 h-2 rounded-full transition-colors ${isOpen ? 'bg-red-600' : 'bg-slate-300'}`}></span>
                      <span>{faq.q}</span>
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isOpen ? 'bg-red-50 text-red-700 rotate-180' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="pt-4 border-t border-slate-100 mt-4"
                    >
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 10. CONTACT US SECTION */}
      {/* ========================================================= */}
      <section id="contact" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs grid grid-cols-1 md:grid-cols-5 gap-8">
          
          <div className="md:col-span-2 space-y-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
              Direct Support
            </span>
            <h3 className="text-2xl font-black text-slate-900">Get In Touch</h3>
            <p className="text-slate-500 text-xs leading-relaxed font-medium">
              Have questions about standee delivery, counter integration, or franchise setups? Reach out to our activation desk.
            </p>
            
            <div className="text-xs text-slate-700 space-y-2 pt-2 font-semibold">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-red-600" />
                <span>support@beaurex.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>Connaught Place, New Delhi, India</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleContactSubmit} className="md:col-span-3 space-y-3.5">
            {contactSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Message dispatched! Our regional activation officer will reply shortly.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <input
                type="text"
                placeholder="Your Name"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600"
              />
            </div>

            <input
              type="email"
              placeholder="Business Email Address"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600"
            />

            <textarea
              rows={3}
              placeholder="Describe your store or queries..."
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 rounded-xl transition text-xs cursor-pointer shadow-sm"
            >
              Send Message
            </button>
          </form>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 11. LUXURY RUBY OBSIDIAN FOOTER (Exact Image Matched)      */}
      {/* ========================================================= */}
      <footer className="bg-[#0c0305] text-slate-400 text-xs pt-16 pb-12 border-t-2 border-[#8B0000] relative overflow-hidden">
        {/* Subtle glowing ruby top radial aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-36 bg-gradient-to-b from-[#8B0000]/25 to-transparent pointer-events-none blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10 text-left">
            
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-4">
              <Link to="/" className="flex items-center space-x-3 group inline-flex">
                <div className="w-10 h-10 rounded-xl bg-[#8B0000] flex items-center justify-center text-white shadow-md shadow-red-950/40">
                  <QrCode className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-tight leading-none text-white">
                    BeAurex
                  </span>
                  <span className="text-[10px] font-bold text-red-200/80 uppercase tracking-widest mt-0.5">
                    Admin & Counter Hub
                  </span>
                </div>
              </Link>

              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                The high-conversion counter gamification & customer retention engine empowering local retail businesses, bakeries, cafes, and supermarkets across India.
              </p>

              <div className="flex items-center space-x-2 pt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-bold text-emerald-400">Production Cluster Operational • 256-bit TLS</span>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-slate-300 font-bold flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Safe</span>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-slate-300 font-bold flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-red-400" />
                  <span>Zero Auto-Debits</span>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-slate-300 font-bold flex items-center space-x-1.5">
                  <Store className="w-3.5 h-3.5 text-amber-400" />
                  <span>Instant Counter POS</span>
                </div>
              </div>
            </div>

            {/* Navigation Col 1: Platform */}
            <div>
              <h4 className="font-black text-white text-xs uppercase tracking-wider mb-4">
                Platform
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#strengths" className="hover:text-white transition">Counter Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
                <li><a href="#demo" className="hover:text-white transition">Scratch Simulator</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing Plans</a></li>
                <li><a href="#faq" className="hover:text-white transition">Merchant FAQs</a></li>
              </ul>
            </div>

            {/* Navigation Col 2: Portals */}
            <div>
              <h4 className="font-black text-white text-xs uppercase tracking-wider mb-4">
                Access Portals
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link to="/merchant/login" className="hover:text-white transition">Store Owner Login</Link></li>
                <li><Link to="/customer/login" className="hover:text-white transition">Customer Portal</Link></li>
                <li><Link to="/admin" className="hover:text-white transition">Super Admin Console</Link></li>
                <li><Link to="/team" className="hover:text-white transition">Field Operations Hub</Link></li>
                <li>
                  <button onClick={() => setSignupModalOpen(true)} className="text-red-400 hover:text-red-300 font-bold transition cursor-pointer">
                    Start 3-Day Trial
                  </button>
                </li>
              </ul>
            </div>

            {/* Navigation Col 3: Legal & Support */}
            <div>
              <h4 className="font-black text-white text-xs uppercase tracking-wider mb-4">
                Trust & Legal
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button
                    onClick={() => setLegalModalContent({
                      title: 'Terms & Conditions',
                      body: 'BeAurex terms govern the merchant customer retention platform. Merchants agree to honor valid in-store 4-digit scratch PINs generated by the loyalty engine. Free trials do not charge or store auto-debit cards.'
                    })}
                    className="hover:text-white transition text-left cursor-pointer"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setLegalModalContent({
                      title: 'Privacy Policy',
                      body: 'BeAurex enforces strict cloud isolation protocols. Customer phone numbers collected during SMS OTP login are strictly used for in-store discount validation and are never sold or shared with third-party marketing brokers.'
                    })}
                    className="hover:text-white transition text-left cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li><span className="text-slate-500">Refund Policy (Manual Only)</span></li>
                <li><span className="text-slate-500">Security Whitepaper</span></li>
                <li><span className="text-red-300 font-mono">support@beaurex.com</span></li>
              </ul>
            </div>

          </div>

          {/* Bottom Footer Credits */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-4">
            <p>
              © 2026 BeAurex Platform. All rights reserved. Pure Value-Driven Manual Activation System.
            </p>
            <div className="flex items-center space-x-6 text-slate-400 font-medium">
              <span>Made with ❤️ for Indian Counter Commerce</span>
              <span className="text-[#8B0000] font-black">•</span>
              <span>ISO 27001 Security Standard</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================= */}
      {/* MODALS */}
      {/* ========================================================= */}
      
      {/* Start Free Trial Signup Modal */}
      {signupModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setSignupModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#74111d] to-[#981b2a] flex items-center justify-center text-white font-black text-xl shadow-md shadow-[#74111d]/30">
                B
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">Activate 3-Day Free Trial</h3>
                <p className="text-xs text-slate-500">No credit card required • Instant BeAurex access</p>
              </div>
            </div>

            {signupError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {signupError}
              </div>
            )}

            <form onSubmit={handleStartTrialSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Business / Store Name</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Royal Sweets & Cafe"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Business Category</label>
                <select
                  value={merchantCategory}
                  onChange={(e) => setMerchantCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                >
                  <option value="CAFE_RESTAURANT">Cafe & Restaurant / Bakery</option>
                  <option value="RETAIL">Retail Store / Fashion / Footwear</option>
                  <option value="SALON_SPA">Salon, Spa & Beauty</option>
                  <option value="GROCERY">Grocery & Supermarket</option>
                  <option value="HEALTHCARE">Healthcare & Pharmacy</option>
                  <option value="OTHER">Other Local Business</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Owner Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={merchantPhone}
                  onChange={(e) => setMerchantPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Owner Email</label>
                <input
                  type="email"
                  required
                  value={merchantEmail}
                  onChange={(e) => setMerchantEmail(e.target.value)}
                  placeholder="owner@yourstore.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Set Account Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={merchantPassword}
                  onChange={(e) => setMerchantPassword(e.target.value)}
                  placeholder="Create secure password (min. 6 chars)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={signupLoading}
                  className="w-full bg-[#74111d] hover:bg-[#5e0c15] disabled:opacity-50 text-white font-black py-3 rounded-xl transition text-xs shadow-md shadow-[#74111d]/25 cursor-pointer flex items-center justify-center space-x-2"
                >
                  {signupLoading ? (
                    <span>Creating Business Account...</span>
                  ) : (
                    <span>Start 3-Day Free Trial & Launch Setup</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Legal Content Modal */}
      {legalModalContent && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setLegalModalContent(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-black text-xl text-slate-900 mb-3">{legalModalContent.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium mb-6">
              {legalModalContent.body}
            </p>
            <button
              onClick={() => setLegalModalContent(null)}
              className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

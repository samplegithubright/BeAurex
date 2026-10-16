import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Store, Gift, ShieldCheck, Sparkles, Check, X, ArrowRight, ArrowDown,
  Smartphone, Lock, AlertTriangle, ChevronDown, 
  CheckCircle2, Mail, MapPin, Zap, Star, Shield, Eye, Menu,
  QrCode, Phone, Bell, Sliders, Layers, Users, Clock, BarChart3,
  HelpCircle, CreditCard, Award, Flame, Calendar, ShoppingCart, TrendingDown
} from 'lucide-react';
import LegalPolicyModal from '../components/LegalPolicyModal';

// Distinct multi-color palettes for plan tags with generous spacing
const DARK_TAG_PALETTES = [
  { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/40', icon: 'text-emerald-400' },
  { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/40', icon: 'text-amber-400' },
  { bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-500/40', icon: 'text-rose-400' },
  { bg: 'bg-cyan-500/15', text: 'text-cyan-300', border: 'border-cyan-500/40', icon: 'text-cyan-400' },
  { bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/40', icon: 'text-purple-400' },
  { bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/40', icon: 'text-blue-400' }
];

const LIGHT_TAG_PALETTES = [
  { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-300', icon: 'text-emerald-600' },
  { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300', icon: 'text-amber-600' },
  { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-300', icon: 'text-rose-600' },
  { bg: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-300', icon: 'text-sky-600' },
  { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-300', icon: 'text-purple-600' },
  { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-300', icon: 'text-blue-600' }
];

const FAQ_GRADIENTS = [
  'from-amber-400 to-orange-500',
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-purple-500 to-pink-600',
  'from-rose-500 to-red-600',
  'from-cyan-500 to-blue-600',
  'from-violet-500 to-purple-600',
  'from-amber-500 to-rose-500'
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

const isDarkBg = (hex) => {
  if (!hex || typeof hex !== 'string') return false;
  let c = hex.replace('#', '').trim();
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  if (c.length !== 6) return false;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return false;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 140;
};

const darkenHex = (hex, percent = 15) => {
  if (!hex || typeof hex !== 'string') return '#720000';
  let c = hex.replace('#', '').trim();
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  if (c.length !== 6) return hex;
  const num = parseInt(c, 16);
  let r = (num >> 16) - Math.round(255 * (percent / 100));
  let g = ((num >> 8) & 0x00FF) - Math.round(255 * (percent / 100));
  let b = (num & 0x0000FF) - Math.round(255 * (percent / 100));
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

function PlanCardButton({ plan, isDark }) {
  const [hovered, setHovered] = useState(false);
  const isPopular = Boolean(plan.isPopular || plan.highlightBadge === 'Most Popular');
  const defaultBg = isPopular ? '#8B0000' : (isDark ? '#FFFFFF' : '#0D1527');
  const defaultHover = isPopular ? '#720000' : (isDark ? '#F1F5F9' : '#8B0000');
  const btnBg = plan.btnBg || defaultBg;
  const btnHoverBg = plan.btnHoverBg || (plan.btnBg ? darkenHex(plan.btnBg, 15) : defaultHover);
  const activeBg = hovered ? btnHoverBg : btnBg;
  const isBtnDark = isDarkBg(activeBg);

  return (
    <Link
      to="/merchant/login"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: activeBg,
        color: isBtnDark ? '#FFFFFF' : '#0F172A',
        boxShadow: hovered ? '0 12px 25px -4px rgba(0, 0, 0, 0.2)' : '0 4px 12px -2px rgba(0, 0, 0, 0.1)'
      }}
      className="relative overflow-hidden group/btn w-full font-bold py-3.5 px-4 rounded-2xl transition-all duration-300 cursor-pointer text-xs tracking-wide flex items-center justify-center space-x-2 transform hover:scale-[1.02] active:scale-[0.98]"
    >
      {/* Dynamic shimmer gloss line on hover */}
      <div className="absolute inset-0 -translate-x-[120%] group-hover/btn:translate-x-[120%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
      <Sparkles className={`w-3.5 h-3.5 shrink-0 ${isBtnDark ? 'text-amber-300' : 'text-amber-600'}`} />
      <span className="font-extrabold tracking-wide">{plan.ctaText || 'Start 2-Day Trial'}</span>
      <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover/btn:translate-x-1" />
    </Link>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  // If visiting with an invite link (?ref=...), redirect immediately to Merchant Login & Onboarding
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const refCode = params.get('ref') || params.get('referral');
      if (refCode) {
        navigate(`/merchant/login?ref=${encodeURIComponent(refCode.trim())}`, { replace: true });
      }
    } catch (_) {}
  }, [navigate]);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState('privacy');
  const [activeFaq, setActiveFaq] = useState(null);
  const [faqs, setFaqs] = useState(() => {
    try {
      const saved = localStorage.getItem('beaurex_faqs') || localStorage.getItem('loyalqr_faqs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return [
      {
        id: 'f1',
        question: "Will my account be automatically charged when the trial ends?",
        answer: "Absolutely not. We do not require payment details to start your trial. There are zero auto-debit loops. You manually choose whether to upgrade from your merchant hub when you see real repeat visit revenue."
      },
      {
        id: 'f2',
        question: "How is user phone number security managed?",
        answer: "We focus strictly on isolated cloud privacy. Mobile numbers are verified via instantaneous SMS OTP and used solely for in-store voucher redemption. Shoppers face zero unsolicited promotional marketing."
      },
      {
        id: 'f3',
        question: "Do customers need to download an application from the App Store?",
        answer: "No app download is required! Shoppers open their standard smartphone camera, scan the standee QR, and the reward experience immediately appears in their default browser."
      },
      {
        id: 'f4',
        question: "Can I customize the discounts and reward percentages?",
        answer: "Yes, you have full control over reward campaign rules in your Merchant Hub. You can set percentage discounts, flat rupee off amounts, or free signature items with specific probability chances."
      },
      {
        id: 'f5',
        question: "How does the acrylic counter standee get configured?",
        answer: "Once registered, your dashboard instantly generates a customized, high-resolution vector print file sized for standard 5x7 inch acrylic tabletop frames. You can download and place it immediately on your checkout desk."
      }
    ];
  });
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactError, setContactError] = useState('');

  // Live Platform Subscription Plans (Synced from MongoDB & System Store)
  const [plans, setPlans] = useState(() => {
    try {
      const cached = JSON.parse(localStorage.getItem('beaurex_platform_plans') || '[]');
      if (Array.isArray(cached) && cached.length > 0) {
        return cached.filter(p => p.isActive !== false && p.showOnLandingPage !== false);
      }
    } catch (e) {}
    return [
      {
        id: 'plan_standard',
        name: 'Standard Plan',
        price: 24000,
        originalPrice: 36000,
        period: '/ Year',
        subtext: 'Perfect for local retail shops getting started',
        tagText: 'Equivalent to ₹2,000/month',
        tags: ['Equivalent to ₹2,000/month', 'Starter Choice'],
        highlightBadge: '',
        isPopular: false,
        features: [
          'Customer retention system',
          'Free account setup & acrylic config',
          'Custom QR code standee generator',
          'Unlimited customer QR scans',
          'Standard Business Hours Support'
        ],
        ctaText: 'Start 2-Day Trial'
      },
      {
        id: 'plan_professional',
        name: 'Professional Plan',
        price: 49000,
        originalPrice: 72000,
        period: '/ 3 Years',
        subtext: 'Accelerated conversion tools for multi-counter growth',
        tagText: 'Only ₹1,361/month',
        tags: ['Only ₹1,361/month', 'Best Retention Value'],
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
      }
    ];
  });

  useEffect(() => {
    // 1. Fetch live plans from centralized systemStore API
    fetch('/api/public/plans')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.plans)) {
          setPlans(data.plans);
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

    // 2. Real-time dynamic updates listener
    const handlePlansUpdate = (e) => {
      try {
        const updated = e.detail || JSON.parse(localStorage.getItem('beaurex_platform_plans') || '[]');
        if (Array.isArray(updated)) {
          setPlans(updated);
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

  // Filter ONLY active plans and strictly limit to at most 3 plans on Landing Page
  const landingPlans = useMemo(() => {
    return (plans || []).filter(p => p.isActive !== false && p.showOnLandingPage !== false).slice(0, 3);
  }, [plans]);

  useEffect(() => {
    // 3. Fetch live FAQs from centralized systemStore API
    fetch('/api/public/faqs')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.faqs) && data.faqs.length > 0) {
          setFaqs(data.faqs);
          try {
            localStorage.setItem('beaurex_faqs', JSON.stringify(data.faqs));
          } catch (e) {}
        }
      })
      .catch(() => {
        try {
          const cached = JSON.parse(localStorage.getItem('beaurex_faqs') || localStorage.getItem('loyalqr_faqs') || '[]');
          if (Array.isArray(cached) && cached.length > 0) setFaqs(cached);
        } catch (e) {}
      });

    // Real-time dynamic FAQ update listener
    const handleFaqsUpdate = (e) => {
      try {
        const updated = e.detail || JSON.parse(localStorage.getItem('beaurex_faqs') || localStorage.getItem('loyalqr_faqs') || '[]');
        if (Array.isArray(updated) && updated.length > 0) {
          setFaqs(updated);
        }
      } catch (err) {}
    };

    window.addEventListener('beaurex_faqs_updated', handleFaqsUpdate);
    window.addEventListener('storage', handleFaqsUpdate);

    return () => {
      window.removeEventListener('beaurex_faqs_updated', handleFaqsUpdate);
      window.removeEventListener('storage', handleFaqsUpdate);
    };
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactError('');
    setContactSuccess(false);

    const name = (contactForm.name || '').trim();
    const rawPhone = (contactForm.phone || '').trim();
    const cleanPhone = rawPhone.replace(/\D/g, '').replace(/^91/, '').replace(/^0/, '');
    const email = (contactForm.email || '').trim();
    const message = (contactForm.message || '').trim();

    if (!name) {
      setContactError('Please enter your full name.');
      return;
    }

    if (!cleanPhone || cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      setContactError('Please enter a valid 10-digit mobile number (e.g. 9876543210).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      setContactError('Please enter a valid email address (e.g. name@company.com).');
      return;
    }

    if (!message) {
      setContactError('Please enter your message or query.');
      return;
    }

    setContactSubmitting(true);

    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone: cleanPhone,
          email,
          message
        })
      });
      const data = await res.json();
      if (data && data.success) {
        setContactSuccess(true);
        setContactForm({ name: '', phone: '', email: '', message: '' });
        setTimeout(() => setContactSuccess(false), 7000);
      } else {
        setContactError(data?.message || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err) {
      setContactError('Unable to connect to server. Please try again later.');
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden font-sans antialiased bg-slate-50 text-slate-900 selection:bg-red-500 selection:text-white">
      
      {/* ========================================================= */}
      {/* 1. TOP TRUST NOTIFICATION BAR */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-r from-[#690005] via-[#8B0000] to-[#590104] text-white text-center py-2.5 px-4 text-xs font-semibold tracking-wide flex items-center justify-center space-x-2 border-b border-[#590104]">
        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center p-0.5 shrink-0 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
        </div>
        <span>Trusted by Fast-Growing Retail Stores, Cafes & Brands Across India</span>
        <span className="hidden md:inline bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase shadow-xs">
          2-Day Free Trial Active
        </span>
      </div>

      {/* ========================================================= */}
      {/* 2. NAVIGATION BAR */}
      {/* ========================================================= */}
      <nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md border-slate-200/90">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/beaurex-icon.jpg" 
              alt="BeAurex Logo" 
              className="object-cover w-10 h-10 transition-all duration-300 shadow-md sm:w-11 sm:h-11 rounded-xl shadow-red-950/20 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight leading-none text-[#8B0000]">
                BeAurex
              </span>
              <span className="text-[10px] font-bold text-[#8B0000] uppercase tracking-widest mt-0.5">
                Rewarding Loyalty
              </span>
            </div>
          </Link>

          {/* Center Links (Desktop) */}
          <div className="items-center hidden space-x-8 text-xs font-bold lg:flex text-slate-600">
            <a href="#features" className="hover:text-[#8B0000] transition-colors duration-200">Features</a>
            <a href="#reality-check" className="hover:text-[#8B0000] transition-colors duration-200">The Reality</a>
            <a href="#how-it-works" className="hover:text-[#8B0000] transition-colors duration-200">How It Works</a>
            <a href="#pricing" className="hover:text-[#8B0000] transition-colors duration-200">Pricing</a>
            <a href="#faq" className="hover:text-[#8B0000] transition-colors duration-200">FAQs</a>
            <a href="#contact" className="hover:text-[#8B0000] transition-colors duration-200">Contact</a>
          </div>

          {/* Action: Login Button (Styled in Brand Red Gradient) */}
          <div className="flex items-center">
            
            {/* Login Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                className="flex bg-gradient-to-r from-[#8B0000] to-[#981b2a] hover:from-[#720000] hover:to-[#801321] text-white font-bold px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl shadow-md shadow-[#8B0000]/20 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer text-xs sm:text-sm items-center space-x-1.5 sm:space-x-2"
              >
                <span>Login</span>
                <ChevronDown className={`w-3.5 h-3.5 text-white/80 transition-transform duration-200 ${loginDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {loginDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-50 transition-all duration-200">
                  <Link
                    to="/merchant/login"
                    onClick={() => setLoginDropdownOpen(false)}
                    className="w-full text-left px-3 py-2.5 hover:bg-rose-50/70 rounded-xl font-bold text-xs text-slate-800 flex items-center space-x-2.5 transition-colors duration-150 cursor-pointer"
                  >
                    <div className="flex items-center justify-center text-white rounded-lg shadow-sm w-7 h-7 bg-gradient-to-br from-rose-500 to-red-600 shrink-0 shadow-red-500/25">
                      <Store className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-slate-900">Merchant Login</span>
                  </Link>

                  <Link
                    to="/customer/login"
                    onClick={() => setLoginDropdownOpen(false)}
                    className="w-full text-left px-3 py-2.5 hover:bg-emerald-50/70 rounded-xl font-bold text-xs text-slate-800 flex items-center space-x-2.5 border-t border-slate-100 transition-colors duration-150 cursor-pointer"
                  >
                    <div className="flex items-center justify-center text-white rounded-lg shadow-sm w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-600 shrink-0 shadow-emerald-500/25">
                      <Gift className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-slate-900">Customer Login</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ========================================================= */}
      {/* 3. HERO SECTION */}
      {/* ========================================================= */}
      {/* ========================================================= */}
      {/* 4. HERO SECTION */}
      {/* ========================================================= */}
      <header className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8 pb-10 lg:pb-12 relative">
        <div className="grid items-center grid-cols-1 gap-7 lg:grid-cols-12 lg:gap-10">
          
          {/* Left Column: Content */}
          <div className="order-2 space-y-5 text-left lg:col-span-6 sm:space-y-6 lg:order-1">
            


            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[50px] font-black text-slate-900 tracking-tight leading-[1.12]">
              Turn Every Customer Visit Into <br className="hidden sm:inline" />
              <span className="text-[#8B0000] bg-gradient-to-r from-[#8B0000] via-rose-700 to-[#720000] bg-clip-text text-transparent">A Repeat Customer</span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-xl text-base font-normal leading-relaxed text-slate-600">
              Transform one-time walk-ins into high-frequency loyal patrons with tabletop QR scans, instant Aurex rewards, and zero app downloads.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <Link
                to="/merchant/login"
                className="bg-gradient-to-r from-[#8B0000] to-[#a30d0d] hover:from-[#720000] hover:to-[#8B0000] text-white font-extrabold px-8 py-3.5 rounded-2xl text-base shadow-xl shadow-red-950/20 transition-all duration-200 hover:-translate-y-0.5 text-center cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <span>Claim Your 2-Day Free Trial</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-6 py-3.5 text-base font-bold text-center transition-all bg-white border shadow-xs hover:bg-slate-50 text-slate-700 rounded-2xl border-slate-200 hover:border-slate-300"
              >
                See How It Works
              </a>
            </div>

            {/* Indian Platform Trust Pill */}
            <div className="pt-1">
              <div className="inline-flex items-center gap-2.5 bg-slate-100/90 border border-slate-200/90 rounded-2xl px-4 py-2 text-xs text-slate-700 font-medium shadow-2xs">
                <span className="text-[11px] font-black text-rose-800 bg-rose-100 px-2 py-0.5 rounded-md uppercase tracking-wider">🇮🇳 INDIA</span>
                <span>A Proudly Indian Platform Built with love to empower local retailers &amp; businesses across INDIA.</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero QR Standee Visual */}
          <div className="relative flex items-center justify-center order-1 lg:col-span-6 lg:order-2">
            {/* Ambient Theme Halo Glow Container (Height decreased & max-w compact) */}
            <div className="relative w-full max-w-[430px] lg:max-w-[450px] p-2 rounded-3xl group">
              
              {/* Theme Background Glow matching website tones */}
              <div className="absolute inset-0 transition-transform duration-700 transform scale-95 bg-gradient-to-tr from-rose-200/50 via-red-100/30 to-amber-100/40 rounded-3xl blur-2xl -z-10 group-hover:scale-100"></div>

              {/* Floating Badge 1: Top Right - 10,000+ Active Counters (Animated Floating + Live Pulse Ring) */}
              <div className="absolute -top-3.5 -right-2 sm:-right-4 bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl px-3.5 py-2.5 shadow-2xl shadow-red-950/15 backdrop-saturate-150 flex items-center space-x-2.5 z-20 animate-float-badge transition-transform duration-300 hover:scale-105 cursor-default">
                {/* Animated Pulsing Icon Container */}
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-rose-50 via-red-50 to-rose-100 border border-rose-200 text-[#8B0000] flex items-center justify-center shadow-xs shrink-0">
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border-2 border-white"></span>
                  </span>
                  <Users className="w-4.5 h-4.5 text-[#8B0000] transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black leading-none text-slate-900 tracking-tight">10,000+</span>
                    <span className="text-[9px] font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-md">LIVE</span>
                  </div>
                  <div className="text-[9.5px] text-slate-500 font-bold leading-tight mt-0.5">Active Retail Counters</div>
                </div>
              </div>

              {/* Floating Badge 2: Bottom Left - Retention Lift (Alternate Floating) */}
              <div className="absolute -bottom-3 -left-2 sm:-left-3 bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl px-3.5 py-2 shadow-xl shadow-amber-950/10 backdrop-saturate-150 flex items-center space-x-2.5 z-20 animate-float-badge-alt transition-transform duration-300 hover:scale-105 cursor-default">
                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 text-amber-700 shadow-2xs shrink-0">
                  <Zap className="w-4 h-4 text-amber-600 fill-amber-500 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-black leading-none text-slate-900">2.4x Lift</div>
                  <div className="text-[9.5px] text-slate-500 font-semibold leading-tight mt-0.5">Repeat Customer Visits</div>
                </div>
              </div>

              {/* Pristine Cleaned Graphic (Retailer Smiling + Tabletop QR Standee) with Soft Theme Pearl Shadow */}
              <div className="relative overflow-hidden bg-white border shadow-xl rounded-2xl border-rose-100/90 ring-1 ring-slate-900/5 max-h-[460px] sm:max-h-[500px] flex items-center justify-center">
                <img 
                  src="/beaurex-hero-banner.jpg" 
                  alt="BeAurex Tabletop QR Standee with Smiling Retailer" 
                  className="w-full h-auto max-h-[500px] object-cover rounded-2xl transition-transform duration-700 group-hover:scale-[1.01]"
                  loading="eager"
                />
              </div>

            </div>
          </div>

        </div>
      </header>



      {/* ========================================================= */}
      {/* 5. COMPLETE FEATURES GRID */}
      {/* ========================================================= */}
      <section id="features" className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200/70">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <span className="text-xs font-bold text-[#8B0000] uppercase tracking-widest bg-rose-50 border border-rose-200 px-3.5 py-1.5 rounded-full">
            Powerful Platform Capabilities
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-950">
            Everything You Need To Grow Store Loyalty
          </h2>
          <p className="mt-3 text-sm font-normal leading-relaxed text-slate-600">
            Crafted specially for local businesses, cafes, bakeries, salons and shops wanting customer repeat retention without the complexity.
          </p>
        </div>

        {/* 3 Core Highlights (Zero Hidden Contracts, Quick & Easy, 100% Guarded Privacy) with Glassmorphism */}
        <div className="grid grid-cols-1 gap-6 mb-8 text-center md:grid-cols-3 sm:mb-10">
          
          <div className="flex flex-col items-center p-6 text-center transition-all duration-300 bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-7 rounded-2xl hover:shadow-xl hover:bg-white/90 hover:border-rose-300/80 hover:-translate-y-1 group backdrop-saturate-150">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white transition-transform shadow-md rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/25 group-hover:scale-110">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-2 text-base font-bold text-center text-slate-900">Zero Hidden Contracts</h3>
            <p className="text-xs leading-relaxed text-center text-slate-500">
              No credit card required to start. No auto-debits, No hidden charges, No forced renewals
            </p>
          </div>

          <div className="flex flex-col items-center p-6 text-center transition-all duration-300 bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-7 rounded-2xl hover:shadow-xl hover:bg-white/90 hover:border-blue-300/80 hover:-translate-y-1 group backdrop-saturate-150">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white transition-transform shadow-md rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-blue-500/25 group-hover:scale-110">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-2 text-base font-bold text-center text-slate-900">Quick & Easy</h3>
            <p className="text-xs leading-relaxed text-center text-slate-500">
              Customers scan instantly through their default smartphone browser. No slow app downloads or long account setups.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 text-center transition-all duration-300 bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-7 rounded-2xl hover:shadow-xl hover:bg-white/90 hover:border-emerald-300/80 hover:-translate-y-1 group backdrop-saturate-150">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white transition-transform shadow-md rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/25 group-hover:scale-110">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-2 text-base font-bold text-center text-slate-900">100% Guarded Privacy</h3>
            <p className="text-xs leading-relaxed text-center text-slate-500">
              We secure and isolate user details. Customers get a safe experience without facing unwanted marketing spam.
            </p>
          </div>

        </div>

        {/* 8 Feature Capabilities Grid with Glassmorphism */}
        <div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-2 lg:grid-cols-4">
          
          <div className="flex flex-col items-center p-6 text-center transition-all duration-300 bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-7 rounded-2xl hover:shadow-xl hover:bg-white/90 hover:border-rose-300/80 hover:-translate-y-1 group backdrop-saturate-150">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white transition-transform shadow-md rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/25 group-hover:scale-110">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-2 text-base font-bold text-center text-slate-900">Camera QR Scan</h3>
            <p className="text-xs leading-relaxed text-center text-slate-500">
              Customers scan with their phone camera directly from your desk standee. No app download needed.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 text-center transition-all duration-300 bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-7 rounded-2xl hover:shadow-xl hover:bg-white/90 hover:border-amber-300/80 hover:-translate-y-1 group backdrop-saturate-150">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white transition-transform shadow-md rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/25 group-hover:scale-110">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-2 text-base font-bold text-center text-slate-900">Instant QR Loyalty Rewards</h3>
            <p className="text-xs leading-relaxed text-center text-slate-500">
              Exciting digital Aurex rewards unlocked instantly every time a customer scans your counter QR standee.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 text-center transition-all duration-300 bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-7 rounded-2xl hover:shadow-xl hover:bg-white/90 hover:border-emerald-300/80 hover:-translate-y-1 group backdrop-saturate-150">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white transition-transform shadow-md rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/25 group-hover:scale-110">
              <Sliders className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-2 text-base font-bold text-center text-slate-900">Custom Reward Control</h3>
            <p className="text-xs leading-relaxed text-center text-slate-500">
              Set discount percentages, rupee-off coupons, or complimentary items based on your margins.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 text-center transition-all duration-300 bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-7 rounded-2xl hover:shadow-xl hover:bg-white/90 hover:border-blue-300/80 hover:-translate-y-1 group backdrop-saturate-150">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white transition-transform shadow-md rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-blue-500/25 group-hover:scale-110">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-2 text-base font-bold text-center text-slate-900">Real-Time Visitation Analytics</h3>
            <p className="text-xs leading-relaxed text-center text-slate-500">
              Track live daily scan counts, return rates, and customer redemption data from your store portal.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 text-center transition-all duration-300 bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-7 rounded-2xl hover:shadow-xl hover:bg-white/90 hover:border-purple-300/80 hover:-translate-y-1 group backdrop-saturate-150">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white transition-transform shadow-md rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/25 group-hover:scale-110">
              <Store className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-2 text-base font-bold text-center text-slate-900">Printable Standee Artwork</h3>
            <p className="text-xs leading-relaxed text-center text-slate-500">
              Instant vector counter templates customized with your store name, branding, and dynamic QR code.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 text-center transition-all duration-300 bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-7 rounded-2xl hover:shadow-xl hover:bg-white/90 hover:border-rose-300/80 hover:-translate-y-1 group backdrop-saturate-150">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white transition-transform shadow-md rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/25 group-hover:scale-110">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-2 text-base font-bold text-center text-slate-900">Approval System</h3>
            <p className="text-xs leading-relaxed text-center text-slate-500">
              Guarded verification protects against fraudulent redemptions and repeated double-claims.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 text-center transition-all duration-300 bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-7 rounded-2xl hover:shadow-xl hover:bg-white/90 hover:border-teal-300/80 hover:-translate-y-1 group backdrop-saturate-150">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white transition-transform shadow-md rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 shadow-teal-500/25 group-hover:scale-110">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-2 text-base font-bold text-center text-slate-900">2-Minute Setup</h3>
            <p className="text-xs leading-relaxed text-center text-slate-500">
              No technical or coding knowledge needed. Just enter your store name, print your standee, and start.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 text-center transition-all duration-300 bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-7 rounded-2xl hover:shadow-xl hover:bg-white/90 hover:border-indigo-300/80 hover:-translate-y-1 group backdrop-saturate-150">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white transition-transform shadow-md rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-indigo-500/25 group-hover:scale-110">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-2 text-base font-bold text-center text-slate-900">Zero Marketing Spam</h3>
            <p className="text-xs leading-relaxed text-center text-slate-500">
              Shopper privacy is guarded strictly. No promotional third-party spam messages sent to customers.
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. CRITICAL PAIN POINTS & SOLUTIONS (THE REALITY CHECK) */}
      {/* ========================================================= */}
      <section id="reality-check" className="relative py-20 overflow-hidden border-b bg-gradient-to-b from-slate-50/50 via-white to-slate-50/40 sm:py-24 border-slate-200/80">
        {/* Subtle decorative dot pattern in corners matching image */}
        <div className="absolute top-4 left-4 w-32 h-32 opacity-25 pointer-events-none bg-[radial-gradient(#8B0000_1.5px,transparent_1.5px)] [background-size:12px_12px]" />
        <div className="absolute top-4 right-4 w-32 h-32 opacity-25 pointer-events-none bg-[radial-gradient(#10B981_1.5px,transparent_1.5px)] [background-size:12px_12px]" />
        <div className="absolute rounded-full pointer-events-none -top-24 -left-24 w-80 h-80 bg-rose-100/40 blur-3xl" />
        <div className="absolute rounded-full pointer-events-none -top-24 -right-24 w-80 h-80 bg-emerald-100/40 blur-3xl" />

        <div className="relative z-10 max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
          
          {/* Section Header matching exact image styling */}
          <div className="max-w-2xl mx-auto text-center mb-14 sm:mb-16">
            <div className="inline-flex items-center space-x-2.5 mb-3.5">
              <span className="w-5 sm:w-7 h-[1.5px] bg-[#8B0000]/60 rounded-full" />
              <span className="text-[11px] sm:text-xs font-black text-[#8B0000] uppercase tracking-widest bg-rose-50 border border-rose-200/90 px-3.5 py-1 rounded-full shadow-2xs">
                THE REALITY CHECK
              </span>
              <span className="w-5 sm:w-7 h-[1.5px] bg-[#8B0000]/60 rounded-full" />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-900 tracking-tight leading-tight">
              Why Traditional Stores Lose
              <span className="text-[#8B0000] block mt-1">Valued Customers</span>
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm mt-3.5 font-medium leading-relaxed max-w-xl mx-auto">
              Without an automated retention loop, local customers naturally shift to aggressive delivery apps.
            </p>
          </div>
          
          {/* Two-Column Comparison Grid with Center Arrow matching image */}
          <div className="relative grid items-stretch grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            
            {/* Center Linking Pill Arrow (Desktop) */}
            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white border border-slate-200/90 shadow-lg shadow-slate-900/10 items-center justify-center text-[#8B0000] hover:scale-105 transition-transform">
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </div>

            {/* LEFT CARD: THE PROBLEM (The Retention Leak) with Glassmorphism */}
            <div className="bg-gradient-to-b from-[#FFE4E8]/90 via-[#FFF1F4]/80 to-[#FFDDE3]/90 backdrop-blur-xl border border-rose-300/80 rounded-3xl p-6 sm:p-7 relative flex flex-col justify-between transition-all duration-300 shadow-[0_8px_32px_0_rgba(139,0,0,0.06)] hover:shadow-xl hover:border-rose-400 hover:translate-y-[-2px] backdrop-saturate-150">
              <div>
                {/* Header Row: Problem Tag, Title & 3D Store Illustration */}
                <div className="flex items-start justify-between gap-3 mb-6">
                  <div className="space-y-1">
                    <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block shadow-2xs">
                      THE PROBLEM
                    </span>
                    <h3 className="pt-1 text-xl font-black tracking-tight sm:text-2xl text-slate-900">
                      The Retention Leak
                    </h3>
                    <p className="text-xs font-medium leading-snug sm:text-sm text-slate-500">
                      Where traditional stores lose daily repeat walk-ins.
                    </p>
                  </div>

                  {/* 3D Isometric Store with Red Leak Illustration matching design */}
                  <div className="flex items-center justify-center w-24 h-24 -mt-2 -mr-1 sm:w-28 sm:h-28 lg:w-32 lg:h-32 shrink-0">
                    <img
                      src="/reality-retention-leak-hd.jpg"
                      alt="The Retention Leak"
                      className="object-contain w-full h-full transition-transform duration-300 pointer-events-none select-none mix-blend-multiply drop-shadow-sm hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* 3 Problem Item Rows with Glassmorphism */}
                <div className="space-y-3 sm:space-y-3.5">
                  {/* Row 1: Lost After the Sale */}
                  <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-4.5 border border-white/80 shadow-xs hover:shadow-md hover:bg-white/95 hover:border-rose-200 transition-all duration-200">
                    <div className="flex items-start space-x-3.5">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-rose-100/80 border border-rose-200 text-[#8B0000] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                        <ShoppingCart className="w-5 h-5 text-[#8B0000]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-bold leading-tight text-slate-900 sm:text-base">
                            Lost After the Sale
                          </h4>
                          <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[9.5px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full shrink-0">
                            UNREACHABLE
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs sm:text-[12.5px] leading-relaxed font-normal mt-1.5">
                          Most customers buy, pay cash or UPI, and leave—making them completely unreachable tomorrow for repeat purchases.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Profit-Bleeding Discounts */}
                  <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-4.5 border border-white/80 shadow-xs hover:shadow-md hover:bg-white/95 hover:border-rose-200 transition-all duration-200">
                    <div className="flex items-start space-x-3.5">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-rose-100/80 border border-rose-200 text-[#8B0000] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                        <TrendingDown className="w-5 h-5 text-[#8B0000]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-bold leading-tight text-slate-900 sm:text-base">
                            Profit-Bleeding Discounts
                          </h4>
                          <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[9.5px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full shrink-0">
                            MARGIN BURN
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs sm:text-[12.5px] leading-relaxed font-normal mt-1.5">
                          Displaying flat percentage cuts on checkout counters permanently burns your daily profit margin without driving future curiosity.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Aggressive App Competition */}
                  <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-4.5 border border-white/80 shadow-xs hover:shadow-md hover:bg-white/95 hover:border-rose-200 transition-all duration-200">
                    <div className="flex items-start space-x-3.5">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-rose-100/80 border border-rose-200 text-[#8B0000] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                        <Users className="w-5 h-5 text-[#8B0000]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-bold leading-tight text-slate-900 sm:text-base">
                            Aggressive App Competition
                          </h4>
                          <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[9.5px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full shrink-0">
                            CUSTOMER DRAIN
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs sm:text-[12.5px] leading-relaxed font-normal mt-1.5">
                          Online delivery platforms spend millions to capture your daily offline neighborhood clients away with targeted push promotions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Arrow linking the two cards */}
            <div className="z-20 flex justify-center -my-2 lg:hidden">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-[#8B0000]">
                <ArrowDown className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>

            {/* RIGHT CARD: THE SOLUTION (The BeAurex Solution) with Glassmorphism */}
            <div className="bg-gradient-to-b from-[#E6F8ED]/90 via-[#F0FBF4]/80 to-[#DCF5E5]/90 backdrop-blur-xl border border-emerald-300/80 rounded-3xl p-6 sm:p-7 relative flex flex-col justify-between transition-all duration-300 shadow-[0_8px_32px_0_rgba(16,185,129,0.06)] hover:shadow-xl hover:border-emerald-400 hover:translate-y-[-2px] backdrop-saturate-150">
              <div>
                {/* Header Row: Solution Tag, Title & 3D QR Mobile Loop Illustration */}
                <div className="flex items-start justify-between gap-3 mb-6">
                  <div className="space-y-1">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block">
                      THE SOLUTION
                    </span>
                    <h3 className="pt-1 text-xl font-black tracking-tight sm:text-2xl text-slate-900">
                      The BeAurex Solution
                    </h3>
                    <p className="text-xs font-medium leading-snug sm:text-sm text-slate-500">
                      Automated counter QR retention loop
                    </p>
                  </div>

                  {/* 3D Mobile Phone with QR Code and Looping Green Cycle Arrows matching design */}
                  <div className="flex items-center justify-center w-24 h-24 -mt-2 -mr-1 sm:w-28 sm:h-28 lg:w-32 lg:h-32 shrink-0">
                    <img
                      src="/reality-qr-solution-hd.jpg"
                      alt="The BeAurex Solution"
                      className="object-contain w-full h-full transition-transform duration-300 pointer-events-none select-none mix-blend-multiply drop-shadow-sm hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* 3 Solution Item Rows with Glassmorphism */}
                <div className="space-y-3 sm:space-y-3.5">
                  {/* Row 1: Automated Dynamic Retention */}
                  <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-4.5 border border-white/80 shadow-xs hover:shadow-md hover:bg-white/95 hover:border-emerald-200 transition-all duration-200">
                    <div className="flex items-start space-x-3.5">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                        <QrCode className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-bold leading-tight text-slate-900 sm:text-base">
                            Automated Dynamic Retention
                          </h4>
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full shrink-0">
                            100% AUTOMATIC
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs sm:text-[12.5px] leading-relaxed font-normal mt-1.5">
                          Customers scan the QR code right at your register. It opens instantly on their phone, unlocking time-sensitive vouchers that bring them back.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Instant QR Reward Gamification */}
                  <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-4.5 border border-white/80 shadow-xs hover:shadow-md hover:bg-white/95 hover:border-emerald-200 transition-all duration-200">
                    <div className="flex items-start space-x-3.5">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                        <Gift className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-bold leading-tight text-slate-900 sm:text-base">
                            Instant QR Reward Gamification
                          </h4>
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full shrink-0">
                            HIGH RETURN
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs sm:text-[12.5px] leading-relaxed font-normal mt-1.5">
                          Instant Aurex coin reveal mechanics convert regular checkout loops into exciting loyalty moments that customers love coming back for.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Row 3: 100% Privacy & Zero Spam */}
                  <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-4.5 border border-white/80 shadow-xs hover:shadow-md hover:bg-white/95 hover:border-emerald-200 transition-all duration-200">
                    <div className="flex items-start space-x-3.5">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                        <ShieldCheck className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-bold leading-tight text-slate-900 sm:text-base">
                            100% Privacy & Zero Spam
                          </h4>
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full shrink-0">
                            BANK-GRADE TRUST
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs sm:text-[12.5px] leading-relaxed font-normal mt-1.5">
                          We protect customer data completely. No promotional spam. Shoppers feel safe and respect your business's modern digital environment.
                        </p>
                      </div>
                    </div>
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
      <section id="how-it-works" className="py-20 border-b bg-slate-50 border-slate-200/80">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <h2 className="mb-12 text-3xl font-extrabold text-center text-slate-900">
            Setup in Just 3 Simple Steps
          </h2>
          
          <div className="grid max-w-5xl grid-cols-1 gap-8 mx-auto md:grid-cols-3">
            
            <div className="flex flex-col justify-between p-6 text-center transition-all duration-300 bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8 rounded-2xl hover:shadow-xl hover:bg-white/90 hover:border-blue-300/80 hover:-translate-y-1 group backdrop-saturate-150">
              <div>
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-lg font-bold text-white transition-transform shadow-md bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-blue-500/25 group-hover:scale-105">
                  1
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">Register Your Business</h3>
                <p className="text-xs font-normal leading-relaxed text-slate-600">
                  Create your account inside two minutes and activate your live trial block immediately without entering credit card details.
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between p-6 text-center transition-all duration-300 bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8 rounded-2xl hover:shadow-xl hover:bg-white/90 hover:border-rose-300/80 hover:-translate-y-1 group backdrop-saturate-150">
              <div>
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-[#8B0000] text-white font-bold text-lg rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-red-500/25 group-hover:scale-105 transition-transform">
                  2
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">Display Your Shop Standee</h3>
                <p className="text-xs font-normal leading-relaxed text-slate-600">
                  Download your custom high-resolution counter configuration template from the dashboard and insert it into a standard acrylic holder.
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between p-6 text-center transition-all duration-300 bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8 rounded-2xl hover:shadow-xl hover:bg-white/90 hover:border-emerald-300/80 hover:-translate-y-1 group backdrop-saturate-150">
              <div>
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-lg font-bold text-white transition-transform shadow-md bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-emerald-500/25 group-hover:scale-105">
                  3
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">Watch Customers Return</h3>
                <p className="text-xs font-normal leading-relaxed text-slate-600">
                  Visitors scan your counter QR to earn instant Aurex coin rewards, unlocking discounts for their next visit and keeping them loyal to your local business.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. PRICING PLANS SECTION */}
      {/* ========================================================= */}
      <section id="pricing" className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
        
        {/* Ambient background glow */}
        <div className="absolute w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none top-1/2 left-1/2 h-96 bg-gradient-to-tr from-rose-100/40 via-amber-50/20 to-red-100/30 blur-3xl -z-10"></div>

        <div className="max-w-3xl mx-auto mb-16 text-center">
          <span className="text-xs font-black text-[#8B0000] uppercase tracking-widest bg-rose-50 border border-rose-200/90 px-4 py-1.5 rounded-full shadow-2xs inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Fair &amp; Transparent Growth Plans</span>
          </span>
          <h2 className="mt-4 mb-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-slate-950">
            Invest in High-Velocity Repeat Footfall
          </h2>
          <p className="max-w-2xl mx-auto text-sm font-normal leading-relaxed text-slate-600 sm:text-base">
            Choose a timeline built for your store's growth. Zero auto-debit deductions, zero hidden processing fees, and full retail data ownership.
          </p>
        </div>
        
        {/* Dynamic Responsive Grid strictly showing active plans (max 3) */}
        <div className={`grid grid-cols-1 ${landingPlans.length === 1 ? 'max-w-md' : landingPlans.length === 2 ? 'md:grid-cols-2 max-w-3xl' : 'md:grid-cols-2 lg:grid-cols-3 max-w-[1140px]'} gap-7 items-stretch mx-auto`}>
          {landingPlans.map((p) => {
            const isPopular = Boolean(p.isPopular || p.highlightBadge === 'Most Popular');
            const isDark = isDarkBg(p.cardBg);
            const customBg = p.cardBg ? p.cardBg : undefined;
            const customBorder = p.borderColor ? p.borderColor : undefined;
            
            // Percentage discount
            const discountPct = p.originalPrice > p.price && p.originalPrice > 0
              ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
              : null;

            return (
              <div key={p.id} className="flex flex-col h-full group">
                <div
                  style={{
                    backgroundColor: customBg,
                    borderColor: customBorder,
                    borderWidth: customBorder ? '2px' : undefined
                  }}
                  className={`relative flex-1 ${!customBg ? (isDark ? 'bg-slate-900/85 backdrop-blur-2xl' : 'bg-white/80 backdrop-blur-2xl') : 'backdrop-blur-2xl'} p-7 sm:p-8 rounded-[28px] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-2xl hover:shadow-rose-950/15 transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.015] flex flex-col justify-between border backdrop-saturate-150 ${
                    !customBorder
                      ? isPopular
                        ? 'border-rose-400/80 ring-2 ring-rose-300/40 hover:ring-rose-400/70 shadow-rose-950/10'
                        : (isDark ? 'border-white/20 hover:border-white/40' : 'border-white/80 hover:border-rose-300/80')
                      : ''
                  } ${isDark ? 'text-white' : 'text-slate-900'}`}
                >
                  {/* Subtle top shimmer glow line on card hover */}
                  <div className="absolute top-0 left-8 right-8 h-1 rounded-t-full bg-gradient-to-r from-transparent via-rose-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div>
                    {/* Header Row: Title & Subtext (Store Icon Removed) */}
                    <div className="mb-1">
                      <h3 className={`text-2xl sm:text-[26px] font-black tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {p.name.replace(/\s+Plan$/i, '')}
                      </h3>
                      <p className={`mt-1 text-xs font-normal ${isDark ? 'text-slate-300' : 'text-slate-400'}`}>
                        {p.subtext || 'Retail subscription tier'}
                      </p>
                    </div>

                    {/* Price Block: Strikethrough + Save Badge + Sized-Down Price with Custom Color */}
                    <div className={`mt-5 mb-5 pb-5 border-b ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                      {p.originalPrice > 0 && (
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`text-xs sm:text-sm font-semibold line-through ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                            ₹{Number(p.originalPrice).toLocaleString('en-IN')}
                          </span>
                          {discountPct && (
                            <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md tracking-wider">
                              SAVE {discountPct}%
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-baseline gap-1.5">
                        <span
                          style={{ color: p.priceColor || undefined }}
                          className={`text-2xl sm:text-[28px] font-black tracking-tight transition-colors ${
                            !p.priceColor ? (isDark ? 'text-white' : 'text-slate-900') : ''
                          }`}
                        >
                          ₹{Number(p.price).toLocaleString('en-IN')}
                        </span>
                        {p.period && (
                          <span className={`text-xs font-bold tracking-wider uppercase ${isDark ? 'text-slate-300' : 'text-slate-400'}`}>
                            {p.period}
                          </span>
                        )}
                      </div>

                      {/* Pill Tags Row matching Image 1 (RECOMMENDED, INSTANT SETUP, etc.) */}
                      {(() => {
                        const tagList = getPlanTagList(p);
                        if (tagList.length === 0) return null;
                        return (
                          <div className="flex flex-wrap items-center gap-2 mt-3.5">
                            {tagList.map((tag, tIdx) => {
                              const theme = LIGHT_TAG_PALETTES[tIdx % LIGHT_TAG_PALETTES.length];
                              return (
                                <span
                                  key={tIdx}
                                  className={`inline-flex items-center space-x-1.5 ${theme.bg} ${theme.text} border ${theme.border} px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-2xs`}
                                >
                                  <Sparkles className={`w-3.5 h-3.5 ${theme.icon} shrink-0`} />
                                  <span>{tag}</span>
                                </span>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Features List with Emerald Checkmarks matching Image 1 */}
                    <ul className={`space-y-3 text-xs font-medium mb-7 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {(p.features || []).map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start space-x-2.5">
                          <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span className={`font-normal leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Dark Theme Pill Button matching Image 1 with dynamic background & hover effect */}
                  <div className="pt-2">
                    <PlanCardButton plan={p} isDark={isDark} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Risk-free Guarantee Banner */}
        <div className="max-w-md mx-auto mt-12 text-center">
          <div className="inline-flex items-center justify-center gap-2.5 bg-emerald-50/90 border border-emerald-200/90 py-3 px-5 rounded-2xl shadow-xs">
            <span className="flex items-center justify-center w-5 h-5 text-xs font-black text-white rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 shrink-0">✓</span>
            <span className="text-xs font-bold text-emerald-900">Enjoy any plan risk-free for 2 days. No Payment required</span>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      {/* ========================================================= */}
      <section id="faq" className="relative py-24 overflow-hidden border-t bg-gradient-to-b from-slate-50 via-white to-slate-50 border-slate-200/80">
        
        <div className="relative z-10 max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
          
          <div className="mb-12 text-center">
            <span className="text-xs font-bold text-[#8B0000] uppercase tracking-widest bg-rose-50 border border-rose-200 px-3.5 py-1.5 rounded-full shadow-xs">
              Clear & Transparent
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="max-w-lg mx-auto mt-2 text-xs font-normal sm:text-sm text-slate-500">
              Everything you need to know about setting up BeAurex customer retention at your store counter.
            </p>
          </div>
          
          <div className="space-y-4">
            
            {faqs.map((faq, index) => {
              const faqId = faq.id || index + 1;
              const isOpen = activeFaq === faqId;
              const itemNumber = index + 1;
              const gradient = faq.gradient || FAQ_GRADIENTS[index % FAQ_GRADIENTS.length];
              const questionText = faq.question || faq.q;
              const answerText = faq.answer || faq.a;
              return (
                <div
                  key={faqId}
                  onClick={() => setActiveFaq(isOpen ? null : faqId)}
                  className={`group transition-all duration-300 rounded-2xl p-5 sm:p-6 cursor-pointer border backdrop-blur-xl backdrop-saturate-150 ${
                    isOpen
                      ? 'bg-gradient-to-r from-white/95 to-rose-50/70 border-red-400 shadow-xl shadow-red-950/5 ring-1 ring-red-400/25 -translate-y-1'
                      : 'bg-white/80 hover:bg-white/95 border-white/80 hover:border-red-300/80 hover:shadow-xl hover:-translate-y-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-sm font-bold text-slate-900 sm:text-base">
                    <span className="flex items-center space-x-3.5">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform duration-200 font-black text-sm`}>
                        {itemNumber}
                      </div>
                      <span className="group-hover:text-[#8B0000] transition-colors duration-200">{questionText}</span>
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                      isOpen ? 'bg-red-50 text-red-700 rotate-180 ring-2 ring-red-200' : 'bg-slate-100 text-slate-500 group-hover:bg-red-50 group-hover:text-red-700'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                  {isOpen && (
                    <div className="pt-4 mt-4 duration-200 border-t border-slate-100 animate-in fade-in">
                      <p className="pl-12 text-xs font-normal leading-relaxed text-slate-600 sm:text-sm">
                        {answerText}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 10. CONTACT US SECTION */}
      {/* ========================================================= */}
      <section id="contact" className="max-w-5xl px-4 py-20 mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 p-6 bg-white/80 backdrop-blur-2xl border border-white/80 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] rounded-3xl sm:p-10 md:grid-cols-5 backdrop-saturate-150">
          
          <div className="space-y-4 md:col-span-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B0000] bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
              Direct Support
            </span>
            <h3 className="text-2xl font-bold text-slate-900">Get In Touch</h3>
            <p className="text-xs font-normal leading-relaxed text-slate-500">
              Have questions about standee delivery, counter integration, or store setups? Reach out to our activation desk.
            </p>
            
            <div className="pt-2 space-y-3 text-xs font-medium text-slate-700">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 text-white shadow-sm rounded-xl bg-gradient-to-br from-rose-500 to-red-600 shrink-0 shadow-red-500/25">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <span>support@beaurex.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 text-white shadow-sm rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shrink-0 shadow-blue-500/25">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span>Connaught Place, New Delhi, India</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleContactSubmit} className="md:col-span-3 space-y-3.5">
            {contactSuccess && (
              <div className="flex items-center p-3 space-x-2 text-xs font-bold border bg-emerald-50 border-emerald-300 rounded-xl text-emerald-800">
                <div className="flex items-center justify-center w-5 h-5 text-white rounded-full bg-emerald-600 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </div>
                <span>Message dispatched! Our team will contact you shortly.</span>
              </div>
            )}

            {contactError && (
              <div className="flex items-center p-3 space-x-2 text-xs font-bold border bg-rose-50 border-rose-300 rounded-xl text-rose-800">
                <div className="flex items-center justify-center w-5 h-5 text-white rounded-full bg-rose-600 shrink-0">
                  <span className="text-xs font-black text-white">!</span>
                </div>
                <span>{contactError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <input
                type="text"
                placeholder="Your Name *"
                required
                disabled={contactSubmitting}
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 transition-colors disabled:opacity-50"
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                required
                disabled={contactSubmitting}
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 transition-colors disabled:opacity-50"
              />
            </div>

            <input
              type="email"
              placeholder="Business Email Address *"
              required
              disabled={contactSubmitting}
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 transition-colors disabled:opacity-50"
            />

            <textarea
              rows={3}
              placeholder="Describe your store or queries... *"
              required
              disabled={contactSubmitting}
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 transition-colors disabled:opacity-50"
            ></textarea>

            <button
              type="submit"
              disabled={contactSubmitting}
              className="w-full bg-slate-900 hover:bg-[#8B0000] text-white font-bold py-3 rounded-xl transition-all duration-200 text-xs cursor-pointer shadow-sm hover:shadow-md flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>{contactSubmitting ? 'Submitting Inquiry...' : 'Send Message'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
            </button>
          </form>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 11. LUXURY FOOTER (No Super Admin / Team info) */}
      {/* ========================================================= */}
      <footer className="bg-[#0c0305] text-slate-400 text-xs pt-16 pb-12 border-t-2 border-[#8B0000] relative overflow-hidden">
        {/* Subtle glowing ruby top radial aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-36 bg-gradient-to-b from-[#8B0000]/20 to-transparent pointer-events-none blur-3xl" />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 gap-10 pb-12 text-left border-b md:grid-cols-2 lg:grid-cols-5 border-white/10">
            
            {/* Brand Column */}
            <div className="space-y-4 lg:col-span-2">
              <Link to="/" className="flex inline-flex items-center space-x-3 group">
                <img 
                  src="/beaurex-icon.jpg" 
                  alt="BeAurex Logo" 
                  className="object-cover w-10 h-10 transition-all duration-300 shadow-md sm:w-11 sm:h-11 rounded-xl shadow-red-950/40 group-hover:scale-105"
                />
                <div className="flex flex-col">
                  <span className="text-2xl font-black leading-none tracking-tight text-white">
                    BeAurex
                  </span>
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mt-0.5">
                    Rewarding Loyalty
                  </span>
                </div>
              </Link>

              <p className="max-w-sm text-xs font-normal leading-relaxed text-slate-400">
                The high-conversion counter gamification & customer retention engine empowering local retail businesses likes  bakeries, cafes, and supermarkets across India.
              </p>

              <div className="flex items-center pt-1 space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-semibold text-emerald-400">Production Cluster Operational</span>
              </div>

              {/* Trust Badges with Colorful Icons */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-slate-300 font-semibold flex items-center space-x-1.5">
                  <div className="flex items-center justify-center w-4 h-4 text-white rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 shrink-0">
                    <ShieldCheck className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span>Verified Safe</span>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-slate-300 font-semibold flex items-center space-x-1.5">
                  <div className="flex items-center justify-center w-4 h-4 text-white rounded-full bg-gradient-to-r from-rose-500 to-red-600 shrink-0">
                    <Lock className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span>Zero Auto-Debits</span>
                </div>
               
              </div>
            </div>

            {/* Navigation Col 1: Platform */}
            <div>
              <h4 className="mb-4 text-xs font-bold tracking-wider text-white uppercase">
                Platform
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#features" className="transition-colors hover:text-white">Platform Features</a></li>
                <li><a href="#reality-check" className="transition-colors hover:text-white">The Reality Check</a></li>
                <li><a href="#how-it-works" className="transition-colors hover:text-white">How It Works</a></li>
                <li><a href="#pricing" className="transition-colors hover:text-white">Pricing Plans</a></li>
                <li><a href="#faq" className="transition-colors hover:text-white">Merchant FAQs</a></li>
              </ul>
            </div>

            {/* Navigation Col 2: Portals (Customer & Merchant Only) */}
            <div>
              <h4 className="mb-4 text-xs font-bold tracking-wider text-white uppercase">
                Access Portals
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link to="/merchant/login" className="transition-colors hover:text-white">Merchant Login</Link></li>
                <li><Link to="/customer/login" className="transition-colors hover:text-white">Customer Login</Link></li>
                <li>
                  <Link to="/merchant/login" className="font-semibold text-red-400 transition-colors hover:text-red-300">
                    Start 2-Day Free Trial
                  </Link>
                </li>
              </ul>
            </div>

            {/* Navigation Col 3: Legal & Support */}
            <div>
              <h4 className="mb-4 text-xs font-bold tracking-wider text-white uppercase">
                Trust & Legal
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button
                    onClick={() => {
                      setLegalModalTab('terms');
                      setLegalModalOpen(true);
                    }}
                    className="text-left transition-colors cursor-pointer hover:text-white"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setLegalModalTab('privacy');
                      setLegalModalOpen(true);
                    }}
                    className="text-left transition-colors cursor-pointer hover:text-white"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li><span className="text-slate-500">Refund Policy (Manual Only)</span></li>
                <li><span className="text-slate-500">Security Standard ISO 27001</span></li>
                <li><span className="font-mono text-red-300">support@beaurex.com</span></li>
              </ul>
            </div>

          </div>

          {/* Bottom Footer Credits */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-4">
            <p>
              © 2026 BeAurex Platform. All rights reserved. Pure Value-Driven Manual Activation System.
            </p>
            <div className="flex items-center space-x-6 font-normal text-slate-400">
              <span>Made with ❤️ for Indian Counter Commerce</span>
              <span className="text-[#8B0000] font-bold">•</span>
              <span>ISO 27001 Security Standard</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================= */}
      {/* MODALS */}
      {/* ========================================================= */}

      {/* Synchronized Legal Content Modal (Privacy Policy & Terms of Service) */}
      <LegalPolicyModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalModalTab}
      />

    </div>
  );
}

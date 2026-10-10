import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Store, Gift, ShieldCheck, Sparkles, Check, X, ArrowRight, 
  Smartphone, Lock, AlertTriangle, ChevronDown, 
  CheckCircle2, Mail, MapPin, Zap, Star, Shield, Eye, Menu,
  QrCode, Phone, Bell, Sliders, Layers, Users, Clock, BarChart3,
  HelpCircle, CreditCard, Award, Flame, Calendar
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

export default function LandingPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState('privacy');
  const [businessName, setBusinessName] = useState('');
  const [merchantPhone, setMerchantPhone] = useState('');
  const [merchantEmail, setMerchantEmail] = useState('');
  const [merchantPassword, setMerchantPassword] = useState('');
  const [merchantCategory, setMerchantCategory] = useState('CAFE_RESTAURANT');
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
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

    // 2. Real-time dynamic updates listener
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

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactSubmitting(true);
    setContactError('');
    setContactSuccess(false);

    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
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
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 text-slate-900 font-sans antialiased selection:bg-red-500 selection:text-white">
      
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
      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/beaurex-icon.jpg" 
              alt="BeAurex Logo" 
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover shadow-md shadow-red-950/20 group-hover:scale-105 transition-all duration-300"
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
          <div className="hidden lg:flex items-center space-x-8 text-xs font-bold text-slate-600">
            <a href="#strengths" className="hover:text-[#8B0000] transition-colors duration-200">Strengths</a>
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
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-red-500/25">
                      <Store className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-slate-900 font-bold">Merchant Login</span>
                  </Link>

                  <Link
                    to="/customer/login"
                    onClick={() => setLoginDropdownOpen(false)}
                    className="w-full text-left px-3 py-2.5 hover:bg-emerald-50/70 rounded-xl font-bold text-xs text-slate-800 flex items-center space-x-2.5 border-t border-slate-100 transition-colors duration-150 cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/25">
                      <Gift className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-slate-900 font-bold">Customer Login</span>
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
      <header className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-14 lg:pb-18 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-slate-900 tracking-tight leading-[1.15]">
              Turn Every Customer Visit Into <br className="hidden sm:inline" />
              <span className="text-[#8B0000]">A Repeat Customer</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
              A powerful system that turns your business into a customer magnet.
            </p>

            {/* Action CTA Button */}
            <div className="pt-2">
              <button
                onClick={() => setSignupModalOpen(true)}
                className="bg-[#8B0000] hover:bg-[#720000] text-white font-bold px-8 py-3.5 rounded-2xl text-base shadow-lg shadow-red-950/20 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer inline-flex items-center justify-center"
              >
                Claim Your 2-Day Free Trial
              </button>
            </div>

            {/* Indian Platform Trust Pill */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 bg-slate-100/90 border border-slate-200/90 rounded-2xl px-4 sm:px-5 py-2.5 text-xs text-slate-700 font-medium shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">IN</span>
                <span>A Proudly Indian Platform Built with love to empower local retailers &amp; businesses across INDIA.</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero QR Standee Visual */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Ambient Peach/Rose Warm Glow Container */}
            <div className="relative w-full max-w-[480px] bg-gradient-to-tr from-rose-100/80 via-rose-50/60 to-amber-50/80 p-3 sm:p-4 rounded-3xl border border-rose-200/70 shadow-xl group">
              
              {/* Floating Badge 1: Top Right */}
              <div className="absolute -top-3 -right-2 sm:-right-4 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl px-4 py-2.5 shadow-xl flex items-center space-x-2.5 z-20">
                <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-[#8B0000] shadow-2xs">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 leading-none">10,000+</div>
                  <div className="text-[10px] text-slate-500 font-medium leading-tight">Happy Businesses</div>
                </div>
              </div>

              {/* Realistic QR Standee Hero Photo */}
              <div className="overflow-hidden rounded-2xl border border-white/80 shadow-md bg-white">
                <img 
                  src="/hero-qr-standee.jpg" 
                  alt="Store Owner with Tabletop Aurex QR Standee" 
                  className="w-full h-auto object-cover rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]"
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
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#8B0000] uppercase tracking-widest bg-rose-50 border border-rose-200 px-3.5 py-1.5 rounded-full">
            Powerful Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mt-4 tracking-tight">
            Everything You Need To Grow Store Loyalty
          </h2>
          <p className="text-slate-600 text-sm mt-3 font-normal leading-relaxed">
            Crafted specially for local businesses, cafes, bakeries, salons and shops wanting customer repeat retention without the complexity.
          </p>
        </div>

        {/* 3 Core Highlights (Zero Hidden Contracts, Quick & Easy, 100% Guarded Privacy) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 sm:mb-10 text-center">
          
          <div className="bg-white border border-slate-200/90 p-6 sm:p-7 rounded-2xl shadow-xs hover:shadow-lg hover:border-red-300 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-red-500/25 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2 text-center">Zero Hidden Contracts</h3>
            <p className="text-slate-500 text-xs leading-relaxed text-center">
              No credit card required to start. No auto-debits, No hidden charges, No forced renewals
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 p-6 sm:p-7 rounded-2xl shadow-xs hover:shadow-lg hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-blue-500/25 group-hover:scale-110 transition-transform">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2 text-center">Quick & Easy</h3>
            <p className="text-slate-500 text-xs leading-relaxed text-center">
              Customers scan instantly through their default smartphone browser. No slow app downloads or long account setups.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 p-6 sm:p-7 rounded-2xl shadow-xs hover:shadow-lg hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-500/25 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2 text-center">100% Guarded Privacy</h3>
            <p className="text-slate-500 text-xs leading-relaxed text-center">
              We secure and isolate user details. Customers get a safe experience without facing unwanted marketing spam.
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          
          <div className="bg-white border border-slate-200/90 p-6 sm:p-7 rounded-2xl shadow-xs hover:shadow-lg hover:border-red-300 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-red-500/25 group-hover:scale-110 transition-transform">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2 text-center">Camera QR Scan</h3>
            <p className="text-slate-500 text-xs leading-relaxed text-center">
              Customers scan with their phone camera directly from your desk standee. No app download needed.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 p-6 sm:p-7 rounded-2xl shadow-xs hover:shadow-lg hover:border-amber-300 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-amber-500/25 group-hover:scale-110 transition-transform">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2 text-center">Instant QR Loyalty Rewards</h3>
            <p className="text-slate-500 text-xs leading-relaxed text-center">
              Exciting digital Aurex rewards unlocked instantly every time a customer scans your counter QR standee.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 p-6 sm:p-7 rounded-2xl shadow-xs hover:shadow-lg hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-500/25 group-hover:scale-110 transition-transform">
              <Sliders className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2 text-center">Custom Reward Control</h3>
            <p className="text-slate-500 text-xs leading-relaxed text-center">
              Set discount percentages, rupee-off coupons, or complimentary items based on your margins.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 p-6 sm:p-7 rounded-2xl shadow-xs hover:shadow-lg hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-blue-500/25 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2 text-center">Real-Time Visitation Analytics</h3>
            <p className="text-slate-500 text-xs leading-relaxed text-center">
              Track live daily scan counts, return rates, and customer redemption data from your store portal.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 p-6 sm:p-7 rounded-2xl shadow-xs hover:shadow-lg hover:border-purple-300 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-purple-500/25 group-hover:scale-110 transition-transform">
              <Store className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2 text-center">Printable Standee Artwork</h3>
            <p className="text-slate-500 text-xs leading-relaxed text-center">
              Instant vector counter templates customized with your store name, branding, and dynamic QR code.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 p-6 sm:p-7 rounded-2xl shadow-xs hover:shadow-lg hover:border-rose-300 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-rose-500/25 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2 text-center">Approval System</h3>
            <p className="text-slate-500 text-xs leading-relaxed text-center">
              Guarded verification protects against fraudulent redemptions and repeated double-claims.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 p-6 sm:p-7 rounded-2xl shadow-xs hover:shadow-lg hover:border-teal-300 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-teal-500/25 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2 text-center">2-Minute Setup</h3>
            <p className="text-slate-500 text-xs leading-relaxed text-center">
              No technical or coding knowledge needed. Just enter your store name, print your standee, and start.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 p-6 sm:p-7 rounded-2xl shadow-xs hover:shadow-lg hover:border-indigo-300 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-indigo-500/25 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2 text-center">Zero Marketing Spam</h3>
            <p className="text-slate-500 text-xs leading-relaxed text-center">
              Shopper privacy is guarded strictly. No promotional third-party spam messages sent to customers.
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. CRITICAL PAIN POINTS & SOLUTIONS (THE REALITY CHECK) */}
      {/* ========================================================= */}
      <section id="reality-check" className="bg-white py-20 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#8B0000] uppercase tracking-widest bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
              The Reality Check
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mt-3">
              Why Traditional Stores Lose Valued Customers
            </h2>
            <p className="text-slate-600 text-sm mt-3 font-normal leading-relaxed">
              Without an automated retention loop, local customers naturally shift to aggressive delivery apps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* The Retention Leak Box */}
            <div className="bg-gradient-to-b from-rose-100/95 via-rose-100/65 to-red-100/85 border-2 border-rose-300 shadow-xl shadow-rose-950/5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden">
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-rose-200/80 mb-6">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 bg-gradient-to-br from-red-600 to-[#8B0000] text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-md shadow-red-600/30 shrink-0">
                      <X className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="text-rose-950 font-black text-xl tracking-tight">The Retention Leak</h3>
                      <p className="text-[11px] text-rose-800 font-semibold mt-0.5">Where traditional stores lose daily repeat walk-ins</p>
                    </div>
                  </div>
                  <span className="bg-rose-200 text-rose-900 border border-rose-300 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider hidden sm:inline-block shadow-2xs">
                    Without BeAurex
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/95 backdrop-blur-xs p-5 rounded-2xl border border-rose-200 shadow-xs hover:shadow-md hover:border-rose-400 hover:-translate-y-0.5 transition-all duration-200 group">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                          <AlertTriangle className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span>Lost After the Sale</span>
                      </h4>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md shrink-0">
                        Unreachable
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-[13px] pl-9 leading-relaxed font-normal">
                      Most customers buy, pay cash or UPI, and leave—making them completely unreachable tomorrow for repeat purchases.
                    </p>
                  </div>

                  <div className="bg-white/95 backdrop-blur-xs p-5 rounded-2xl border border-rose-200 shadow-xs hover:shadow-md hover:border-rose-400 hover:-translate-y-0.5 transition-all duration-200 group">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-600 to-red-700 flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                          <AlertTriangle className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span>Profit-Bleeding Discounts</span>
                      </h4>
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-md shrink-0">
                        Margin Burn
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-[13px] pl-9 leading-relaxed font-normal">
                      Displaying flat percentage cuts on checkout counters permanently burns your daily profit margin without driving future curiosity.
                    </p>
                  </div>

                  <div className="bg-white/95 backdrop-blur-xs p-5 rounded-2xl border border-rose-200 shadow-xs hover:shadow-md hover:border-rose-400 hover:-translate-y-0.5 transition-all duration-200 group">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                          <AlertTriangle className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span>Aggressive App Competition</span>
                      </h4>
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200/80 px-2 py-0.5 rounded-md shrink-0">
                        Customer Drain
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-[13px] pl-9 leading-relaxed font-normal">
                      Online delivery platforms spend millions to capture your daily offline neighborhood clients away with targeted push promotions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* The BeAurex Solution Box */}
            <div className="bg-gradient-to-b from-emerald-100/95 via-emerald-100/65 to-teal-100/85 border-2 border-emerald-300 shadow-xl shadow-emerald-950/5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden">
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-emerald-200/80 mb-6">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-600/30 shrink-0">
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="text-emerald-950 font-black text-xl tracking-tight">The BeAurex Solution</h3>
                      <p className="text-[11px] text-emerald-800 font-semibold mt-0.5">Automated counter QR retention loop</p>
                    </div>
                  </div>
                  <span className="bg-emerald-200 text-emerald-900 border border-emerald-300 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider hidden sm:inline-block shadow-2xs">
                    With BeAurex
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/95 backdrop-blur-xs p-5 rounded-2xl border border-emerald-200 shadow-xs hover:shadow-md hover:border-emerald-400 hover:-translate-y-0.5 transition-all duration-200 group">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                          <Sparkles className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span>Automated Dynamic Retention</span>
                      </h4>
                      <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 border border-cyan-200/80 px-2 py-0.5 rounded-md shrink-0">
                        100% Automatic
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-[13px] pl-9 leading-relaxed font-normal">
                      Customers scan the QR code right at your register. It opens instantly on their phone, unlocking time-sensitive vouchers that bring them back.
                    </p>
                  </div>

                  <div className="bg-white/95 backdrop-blur-xs p-5 rounded-2xl border border-emerald-200 shadow-xs hover:shadow-md hover:border-emerald-400 hover:-translate-y-0.5 transition-all duration-200 group">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                          <Gift className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span>Instant QR Reward Gamification</span>
                      </h4>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md shrink-0">
                        High Return
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-[13px] pl-9 leading-relaxed font-normal">
                      Instant Aurex coin reveal mechanics convert regular checkout loops into exciting loyalty moments that customers love coming back for.
                    </p>
                  </div>

                  <div className="bg-white/95 backdrop-blur-xs p-5 rounded-2xl border border-emerald-200 shadow-xs hover:shadow-md hover:border-emerald-400 hover:-translate-y-0.5 transition-all duration-200 group">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                          <ShieldCheck className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span>100% Privacy & Zero Spam</span>
                      </h4>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md shrink-0">
                        Bank-Grade Trust
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-[13px] pl-9 leading-relaxed font-normal">
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
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-12">
            Setup in Just 3 Simple Steps
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            <div className="bg-white border border-slate-200/90 p-6 sm:p-8 rounded-2xl text-center shadow-xs hover:shadow-lg hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
                  1
                </div>
                <h3 className="font-bold text-lg mb-2 text-slate-900">Register Your Business</h3>
                <p className="text-slate-600 text-xs leading-relaxed font-normal">
                  Create your account inside two minutes and activate your live trial block immediately without entering credit card details.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 p-6 sm:p-8 rounded-2xl text-center shadow-xs hover:shadow-lg hover:border-rose-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-[#8B0000] text-white font-bold text-lg rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-red-500/25 group-hover:scale-105 transition-transform">
                  2
                </div>
                <h3 className="font-bold text-lg mb-2 text-slate-900">Display Your Shop Standee</h3>
                <p className="text-slate-600 text-xs leading-relaxed font-normal">
                  Download your custom high-resolution counter configuration template from the dashboard and insert it into a standard acrylic holder.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 p-6 sm:p-8 rounded-2xl text-center shadow-xs hover:shadow-lg hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-lg rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform">
                  3
                </div>
                <h3 className="font-bold text-lg mb-2 text-slate-900">Watch Customers Return</h3>
                <p className="text-slate-600 text-xs leading-relaxed font-normal">
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
      <section id="pricing" className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#8B0000] uppercase tracking-widest bg-rose-50 border border-rose-200/80 px-3.5 py-1 rounded-full shadow-xs">
            Fair & Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mt-3 mb-2">
            Invest in Your Business Growth
          </h2>
          <p className="text-slate-600 text-sm font-normal">
            Choose a timeline that works best for your expansion strategy. No hidden charges or automatic debit renewals.
          </p>
        </div>
        
        <div className={`grid grid-cols-1 ${plans.length === 2 ? 'md:grid-cols-2 max-w-4xl' : plans.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4 max-w-[1200px]' : plans.length > 4 ? 'md:grid-cols-2 lg:grid-cols-3 max-w-[1200px]' : 'lg:grid-cols-3 max-w-6xl'} gap-8 items-stretch mx-auto`}>
          {plans.map((p) => {
            const isPopular = p.isPopular || p.highlightBadge === 'Most Popular';
            const isDark = p.highlightBadge === 'Best Value' || p.id?.includes('legacy');
            
            if (isDark) {
              return (
                <div key={p.id} className="h-full">
                  <div className="bg-gradient-to-b from-[#1c0407] to-[#0d0204] border border-[#8B0000]/50 p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:border-[#8B0000] hover:-translate-y-1.5 transition-all duration-300 text-white relative flex flex-col justify-between pt-12 h-full">
                    {(p.highlightBadge || 'Best Value') && (
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#8B0000] to-rose-700 text-amber-300 text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider border border-[#8B0000] shadow-md flex items-center space-x-1">
                        <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                        <span>{p.highlightBadge || 'Best Value'}</span>
                      </span>
                    )}
                    
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">{p.name}</h3>
                      <p className="text-xs text-red-200/70 mt-1 font-normal">{p.subtext}</p>
                      
                      <div className="mt-6 mb-6 pb-6 border-b border-white/10">
                        {p.originalPrice > 0 && (
                          <span className="text-sm font-semibold text-red-300/60 line-through block mb-1">
                            ₹{Number(p.originalPrice).toLocaleString('en-IN')}
                          </span>
                        )}
                        <div className="text-3xl font-extrabold text-amber-400 tracking-tight">
                          ₹{Number(p.price).toLocaleString('en-IN')} {p.period && <span className="text-sm font-normal text-slate-400">{p.period}</span>}
                        </div>
                        {/* Distinct Multi-Colored Plan Tags with Gap */}
                        {(() => {
                          const tagList = getPlanTagList(p);
                          if (tagList.length === 0) return null;
                          return (
                            <div className="flex flex-wrap items-center gap-2 mt-2.5">
                              {tagList.map((tag, tIdx) => {
                                const theme = DARK_TAG_PALETTES[tIdx % DARK_TAG_PALETTES.length];
                                return (
                                  <span
                                    key={tIdx}
                                    className={`inline-flex items-center space-x-1.5 ${theme.bg} ${theme.text} border ${theme.border} px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-2xs`}
                                  >
                                    <Zap className={`w-3 h-3 ${theme.icon} shrink-0`} />
                                    <span>{tag}</span>
                                  </span>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </div>
                      
                      <ul className="space-y-3 text-slate-300 text-xs font-medium mb-8">
                        {(p.features || []).map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-center space-x-2.5">
                            <div className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3" />
                            </div>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <button
                      onClick={() => setSignupModalOpen(true)}
                      className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-3.5 rounded-xl transition-all duration-200 cursor-pointer text-xs tracking-wide shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{p.ctaText || 'Start 2-Day Trial'}</span>
                    </button>
                  </div>
                </div>
              );
            }

            if (isPopular) {
              return (
                <div key={p.id} className="h-full">
                  <div className="bg-white border-2 border-[#8B0000] p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 relative flex flex-col justify-between pt-12 transform lg:-translate-y-2 h-full">
                    {(p.highlightBadge || 'Most Popular') && (
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#8B0000] to-rose-700 text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-md shadow-red-950/20 flex items-center space-x-1">
                        <Flame className="w-3 h-3 text-amber-300 fill-amber-300" />
                        <span>{p.highlightBadge || 'Most Popular'}</span>
                      </span>
                    )}
                    
                    <div>
                      <h3 className="text-xl font-bold text-[#8B0000] tracking-tight">{p.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 font-normal">{p.subtext}</p>
                      
                      <div className="mt-6 mb-6 pb-6 border-b border-slate-100">
                        {p.originalPrice > 0 && (
                          <span className="text-sm font-semibold text-slate-400 line-through block mb-1">
                            ₹{Number(p.originalPrice).toLocaleString('en-IN')}
                          </span>
                        )}
                        <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                          ₹{Number(p.price).toLocaleString('en-IN')} <span className="text-sm font-normal text-slate-500">{p.period}</span>
                        </div>
                        {/* Distinct Multi-Colored Plan Tags with Gap */}
                        {(() => {
                          const tagList = getPlanTagList(p);
                          if (tagList.length === 0) return null;
                          return (
                            <div className="flex flex-wrap items-center gap-2 mt-2.5">
                              {tagList.map((tag, tIdx) => {
                                const theme = LIGHT_TAG_PALETTES[tIdx % LIGHT_TAG_PALETTES.length];
                                return (
                                  <span
                                    key={tIdx}
                                    className={`inline-flex items-center space-x-1.5 ${theme.bg} ${theme.text} border ${theme.border} px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-2xs`}
                                  >
                                    <Zap className={`w-3 h-3 ${theme.icon} shrink-0`} />
                                    <span>{tag}</span>
                                  </span>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </div>
                      
                      <ul className="space-y-3 text-slate-600 text-xs font-medium mb-8">
                        {(p.features || []).map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-center space-x-2.5">
                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                            <span className={fIdx >= 4 ? 'font-bold text-slate-900' : ''}>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <button
                      onClick={() => setSignupModalOpen(true)}
                      className="w-full bg-gradient-to-r from-[#8B0000] to-rose-700 hover:from-[#720000] hover:to-rose-800 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-xl shadow-red-950/20 cursor-pointer text-xs tracking-wide flex items-center justify-center space-x-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{p.ctaText || 'Start 2-Day Trial'}</span>
                    </button>
                  </div>
                </div>
              );
            }

            // Standard card
            return (
              <div key={p.id} className="h-full">
                <div className="bg-white border border-slate-200/90 p-8 rounded-2xl shadow-xs hover:shadow-xl hover:border-slate-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative pt-10 h-full">
                  {p.highlightBadge && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      {p.highlightBadge}
                    </span>
                  )}
                  
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">{p.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 font-normal">{p.subtext}</p>
                    
                    <div className="mt-6 mb-6 pb-6 border-b border-slate-100">
                      {p.originalPrice > 0 && (
                        <span className="text-sm font-semibold text-slate-400 line-through block mb-1">
                          ₹{Number(p.originalPrice).toLocaleString('en-IN')}
                        </span>
                      )}
                      <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        ₹{Number(p.price).toLocaleString('en-IN')} <span className="text-sm font-normal text-slate-500">{p.period}</span>
                      </div>
                      {/* Distinct Multi-Colored Plan Tags with Gap */}
                      {(() => {
                        const tagList = getPlanTagList(p);
                        if (tagList.length === 0) return null;
                        return (
                          <div className="flex flex-wrap items-center gap-2 mt-2.5">
                            {tagList.map((tag, tIdx) => {
                              const theme = LIGHT_TAG_PALETTES[tIdx % LIGHT_TAG_PALETTES.length];
                              return (
                                <span
                                  key={tIdx}
                                  className={`inline-flex items-center space-x-1.5 ${theme.bg} ${theme.text} border ${theme.border} px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-2xs`}
                                >
                                  <Sparkles className={`w-3 h-3 ${theme.icon} shrink-0`} />
                                  <span>{tag}</span>
                                </span>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                    
                    <ul className="space-y-3 text-slate-600 text-xs font-medium mb-8">
                      {(p.features || []).map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center space-x-2.5">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button
                    onClick={() => setSignupModalOpen(true)}
                    className="w-full bg-slate-900 hover:bg-[#8B0000] text-white font-bold py-3.5 rounded-xl transition-all duration-200 cursor-pointer text-xs tracking-wide shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{p.ctaText || 'Start 2-Day Trial'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Replacement from image 2: No payment required */}
        <div className="text-center mt-12 max-w-sm mx-auto">
          <p className="text-xs text-emerald-800 font-bold bg-emerald-50/90 py-2.5 px-4 rounded-full border border-emerald-200 shadow-xs flex items-center justify-center space-x-2">
            <span className="w-4 h-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
            <span>Enjoy any plan free for 2 days. No payment required.</span>
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      {/* ========================================================= */}
      <section id="faq" className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-t border-slate-200/80 relative overflow-hidden">
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#8B0000] uppercase tracking-widest bg-rose-50 border border-rose-200 px-3.5 py-1.5 rounded-full shadow-xs">
              Clear & Transparent
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 font-normal max-w-lg mx-auto">
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
                  className={`group transition-all duration-300 rounded-2xl p-5 sm:p-6 cursor-pointer border ${
                    isOpen
                      ? 'bg-gradient-to-r from-white to-rose-50/50 border-red-400 shadow-lg ring-1 ring-red-400/25 -translate-y-1'
                      : 'bg-white hover:bg-gradient-to-r hover:from-white hover:to-rose-50/30 border-slate-200/90 hover:border-red-300 hover:shadow-xl hover:-translate-y-1.5 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-slate-900 text-sm sm:text-base gap-3">
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
                    <div className="pt-4 border-t border-slate-100 mt-4 animate-in fade-in duration-200">
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal pl-12">
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
      <section id="contact" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm grid grid-cols-1 md:grid-cols-5 gap-8">
          
          <div className="md:col-span-2 space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B0000] bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
              Direct Support
            </span>
            <h3 className="text-2xl font-bold text-slate-900">Get In Touch</h3>
            <p className="text-slate-500 text-xs leading-relaxed font-normal">
              Have questions about standee delivery, counter integration, or store setups? Reach out to our activation desk.
            </p>
            
            <div className="text-xs text-slate-700 space-y-3 pt-2 font-medium">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-red-500/25">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <span>support@beaurex.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/25">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span>Connaught Place, New Delhi, India</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleContactSubmit} className="md:col-span-3 space-y-3.5">
            {contactSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-bold flex items-center space-x-2">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </div>
                <span>Message dispatched! Our team will contact you shortly.</span>
              </div>
            )}

            {contactError && (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 font-bold flex items-center space-x-2">
                <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-black">!</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10 text-left">
            
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-4">
              <Link to="/" className="flex items-center space-x-3 group inline-flex">
                <img 
                  src="/beaurex-icon.jpg" 
                  alt="BeAurex Logo" 
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover shadow-md shadow-red-950/40 group-hover:scale-105 transition-all duration-300"
                />
                <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-tight leading-none text-white">
                    BeAurex
                  </span>
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mt-0.5">
                    Rewarding Loyalty
                  </span>
                </div>
              </Link>

              <p className="text-slate-400 text-xs leading-relaxed max-w-sm font-normal">
                The high-conversion counter gamification & customer retention engine empowering local retail businesses likes  bakeries, cafes, and supermarkets across India.
              </p>

              <div className="flex items-center space-x-2 pt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-semibold text-emerald-400">Production Cluster Operational</span>
              </div>

              {/* Trust Badges with Colorful Icons */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-slate-300 font-semibold flex items-center space-x-1.5">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span>Verified Safe</span>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-slate-300 font-semibold flex items-center space-x-1.5">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-rose-500 to-red-600 text-white flex items-center justify-center shrink-0">
                    <Lock className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span>Zero Auto-Debits</span>
                </div>
               
              </div>
            </div>

            {/* Navigation Col 1: Platform */}
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
                Platform
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#strengths" className="hover:text-white transition-colors">Counter Strengths</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Platform Features</a></li>
                <li><a href="#reality-check" className="hover:text-white transition-colors">The Reality Check</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing Plans</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">Merchant FAQs</a></li>
              </ul>
            </div>

            {/* Navigation Col 2: Portals (Customer & Merchant Only) */}
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
                Access Portals
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link to="/merchant/login" className="hover:text-white transition-colors">Merchant Login</Link></li>
                <li><Link to="/customer/login" className="hover:text-white transition-colors">Customer Login</Link></li>
                <li>
                  <button onClick={() => setSignupModalOpen(true)} className="text-red-400 hover:text-red-300 font-semibold transition-colors cursor-pointer">
                    Start 3-Day Free Trial
                  </button>
                </li>
              </ul>
            </div>

            {/* Navigation Col 3: Legal & Support */}
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
                Trust & Legal
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button
                    onClick={() => {
                      setLegalModalTab('terms');
                      setLegalModalOpen(true);
                    }}
                    className="hover:text-white transition-colors text-left cursor-pointer"
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
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li><span className="text-slate-500">Refund Policy (Manual Only)</span></li>
                <li><span className="text-slate-500">Security Standard ISO 27001</span></li>
                <li><span className="text-red-300 font-mono">support@beaurex.com</span></li>
              </ul>
            </div>

          </div>

          {/* Bottom Footer Credits */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-4">
            <p>
              © 2026 BeAurex Platform. All rights reserved. Pure Value-Driven Manual Activation System.
            </p>
            <div className="flex items-center space-x-6 text-slate-400 font-normal">
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
      
      {/* Start Free Trial Signup Modal */}
      {signupModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div 
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 relative animate-in fade-in duration-200 auth-root"
            style={{ fontFamily: "'Plus Jakarta Sans', 'Poppins', sans-serif" }}
          >
            <button
              onClick={() => setSignupModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/beaurex-icon.jpg" 
                alt="BeAurex Logo" 
                className="w-10 h-10 rounded-xl object-cover shadow-md shadow-[#8B0000]/30 shrink-0"
              />
              <div>
                <h3 className="font-bold text-lg text-slate-900">Activate 2-Day Free Trial</h3>
                <p className="text-xs text-slate-500">No payment required • Instant BeAurex access</p>
              </div>
            </div>

            {signupError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {signupError}
              </div>
            )}

            <form onSubmit={handleStartTrialSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Business / Store Name</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Royal Sweets & Cafe"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Business Category</label>
                <select
                  value={merchantCategory}
                  onChange={(e) => setMerchantCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-red-600 transition-colors"
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
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Owner Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={merchantPhone}
                  onChange={(e) => setMerchantPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Owner Email</label>
                <input
                  type="email"
                  required
                  value={merchantEmail}
                  onChange={(e) => setMerchantEmail(e.target.value)}
                  placeholder="owner@yourstore.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Set Account Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={merchantPassword}
                  onChange={(e) => setMerchantPassword(e.target.value)}
                  placeholder="Create secure password (min. 6 chars)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={signupLoading}
                  className="w-full bg-[#8B0000] hover:bg-[#720000] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all duration-200 text-xs shadow-md shadow-[#8B0000]/20 cursor-pointer flex items-center justify-center space-x-2"
                >
                  {signupLoading ? (
                    <span>Creating Business Account...</span>
                  ) : (
                    <span>Start 2-Day Free Trial & Launch Setup</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Synchronized Legal Content Modal (Privacy Policy & Terms of Service) */}
      <LegalPolicyModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalModalTab}
      />

    </div>
  );
}

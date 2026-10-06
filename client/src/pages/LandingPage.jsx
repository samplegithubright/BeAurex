import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Store, Gift, ShieldCheck, Sparkles, Check, X, ArrowRight, 
  Smartphone, Lock, AlertTriangle, ChevronDown, 
  CheckCircle2, Mail, MapPin, Zap, Star, Shield, Eye, Menu,
  QrCode, Phone, Bell, Sliders, Layers, Users, Clock, BarChart3,
  HelpCircle, CreditCard, Award, Flame
} from 'lucide-react';

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
      <div className="bg-gradient-to-r from-[#690005] via-[#8B0000] to-[#590104] text-white text-center py-2.5 px-4 text-xs font-semibold tracking-wide flex items-center justify-center space-x-2 border-b border-[#590104]">
        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center p-0.5 shrink-0 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
        </div>
        <span>Trusted by Fast-Growing Retail Stores, Cafes & Brands Across India</span>
        <span className="hidden md:inline bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase shadow-xs">
          3-Day Free Trial Active
        </span>
      </div>

      {/* ========================================================= */}
      {/* 2. NAVIGATION BAR */}
      {/* ========================================================= */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B0000] via-[#a30b17] to-[#ef4444] flex items-center justify-center text-white shadow-md shadow-red-950/20 group-hover:scale-105 transition-all duration-300">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold tracking-tight leading-none text-slate-900">
                BeAurex
              </span>
              <span className="text-[10px] font-bold text-[#8B0000] uppercase tracking-widest mt-0.5">
                Smart QR & Loyalty Hub
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

          {/* Actions: Login Dropdown & Start Free Trial */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Login Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                className="text-slate-700 hover:text-slate-900 font-semibold text-xs sm:text-sm px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center space-x-1.5 border border-slate-200 hover:border-slate-300 bg-slate-50 cursor-pointer"
              >
                <span>Login</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${loginDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {loginDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 transition-all duration-200">
                  <Link
                    to="/merchant/login"
                    onClick={() => setLoginDropdownOpen(false)}
                    className="w-full text-left px-3.5 py-3 hover:bg-rose-50/60 rounded-xl font-medium text-xs text-slate-700 flex items-center space-x-2.5 transition-colors duration-150"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-red-500/25">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-slate-900 font-bold">Store Owner / Merchant Login</div>
                      <div className="text-[10px] text-slate-400 font-normal">Manage standees, scans & rewards</div>
                    </div>
                  </Link>

                  <Link
                    to="/customer/login"
                    onClick={() => setLoginDropdownOpen(false)}
                    className="w-full text-left px-3.5 py-3 hover:bg-emerald-50/60 rounded-xl font-medium text-xs text-slate-700 flex items-center space-x-2.5 border-t border-slate-100 transition-colors duration-150"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/25">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-slate-900 font-bold">Customer Login</div>
                      <div className="text-[10px] text-slate-400 font-normal">Login with Phone OTP or Email</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Start Free Trial CTA */}
            <button
              onClick={() => setSignupModalOpen(true)}
              className="flex bg-gradient-to-r from-[#74111d] to-[#981b2a] hover:from-[#5e0c15] hover:to-[#801321] text-white font-bold px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl shadow-md shadow-[#74111d]/20 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer text-xs sm:text-sm items-center space-x-1.5 sm:space-x-2"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
              <span>Start Free Trial</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ========================================================= */}
      {/* 3. HERO SECTION */}
      {/* ========================================================= */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center relative">
        
        {/* Top Tagline */}
        <div className="inline-flex items-center space-x-2 bg-rose-50 border border-rose-200/80 text-[#8B0000] font-semibold text-xs uppercase px-4 py-1.5 rounded-full mb-6">
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 flex items-center justify-center text-white shrink-0">
            <Sparkles className="w-2.5 h-2.5" />
          </div>
          <span>India's Leading Counter Retention Engine</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto mb-6">
          Turn Every Customer Visit Into A <span className="text-[#8B0000]">Repeat Customer</span>
        </h1>
        
        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          A powerful counter gamification system that turns your local business into a high-loyalty customer magnet.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 max-w-md mx-auto mb-6">
          <button
            onClick={() => setSignupModalOpen(true)}
            className="w-full bg-[#8B0000] hover:bg-[#720000] text-white font-bold px-7 py-3.5 rounded-xl text-sm shadow-lg shadow-red-950/20 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>Claim Your 3-Day Free Trial</span>
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
            </div>
          </button>
          
          <a
            href="#features"
            className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold px-5 py-3.5 rounded-xl text-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex items-center justify-center space-x-2 shadow-xs"
          >
            <div className="w-5 h-5 rounded-full bg-rose-100 text-[#8B0000] flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-[#8B0000]" />
            </div>
            <span>Explore Standee Features</span>
          </a>
        </div>

        <div className="max-w-2xl mx-auto bg-slate-100 border border-slate-200/80 rounded-xl p-3 mb-12 flex items-center justify-center space-x-2.5 text-xs text-slate-700 font-medium">
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
          </div>
          <span>A Proudly Indian Platform built to empower retail stores, bakeries, cafes & supermarkets across INDIA.</span>
        </div>

        {/* Counter Standee Showcase Image */}
        <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-3xl p-3 sm:p-5 shadow-lg overflow-hidden relative group hover:shadow-xl transition-all duration-300">
          <picture className="block w-full">
            <source media="(max-width: 767px)" srcSet="/hero-standee-mobile.jpg" />
            <img 
              src="/hero-standee.jpg" 
              alt="BeAurex Counter Standee & Mobile Scratch Card Experience" 
              className="w-full h-auto rounded-2xl object-cover transition-transform duration-300 group-hover:scale-[1.005] max-h-[580px] sm:max-h-none"
            />
          </picture>
          <div className="mt-3 sm:mt-0 sm:absolute sm:bottom-6 sm:left-10 sm:right-10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-xl text-left">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-[#8B0000] to-[#590104] text-white flex items-center justify-center font-bold shadow-md shadow-red-950/20 shrink-0">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900">Custom Acrylic Counter Standees</div>
                <div className="text-xs text-slate-500 font-medium">Download print-ready vector 5x7" counter templates instantly</div>
              </div>
            </div>
            <button
              onClick={() => setSignupModalOpen(true)}
              className="w-full sm:w-auto bg-[#8B0000] hover:bg-[#720000] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap shadow-md shadow-red-950/20 text-center flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Get Your Store QR Standee</span>
            </button>
          </div>
        </div>

      </header>

      {/* ========================================================= */}
      {/* 4. CORE STRENGTHS 3-CARD GRID */}
      {/* ========================================================= */}
      <section id="strengths" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs hover:shadow-lg hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center mb-4 shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-200">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Zero Hidden Contracts</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-normal">
                No payment required to start. No auto-debits, no hidden platform charges, and no forced renewals. You retain full control.
              </p>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs hover:shadow-lg hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center mb-4 shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Quick & Instant Browser Scan</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-normal">
                Customers scan instantly through their default phone camera. No slow app installations or tedious account setups.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs hover:shadow-lg hover:border-purple-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 text-white flex items-center justify-center mb-4 shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform duration-200">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">100% Guarded Privacy</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-normal">
                Customer data is strictly isolated and guarded with bank-level encryption. Customers face zero unsolicited marketing spam.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. COMPLETE FEATURES GRID */}
      {/* ========================================================= */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200/70">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          
          <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs hover:shadow-lg hover:border-red-300 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center mb-4 shadow-md shadow-red-500/25 group-hover:scale-110 transition-transform">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">Camera QR Scan</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Customers scan with their phone camera directly from your desk standee. No app download needed.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs hover:shadow-lg hover:border-amber-300 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center mb-4 shadow-md shadow-amber-500/25 group-hover:scale-110 transition-transform">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">Gamified Scratch Cards</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Interactive high-dopamine scratch reveal mechanism that excites customers and secures repeat visits.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs hover:shadow-lg hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center mb-4 shadow-md shadow-emerald-500/25 group-hover:scale-110 transition-transform">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">Custom Reward Control</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Set discount percentages, rupee-off coupons, or complimentary items based on your margins.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs hover:shadow-lg hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center mb-4 shadow-md shadow-blue-500/25 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">Real-Time Visitation Analytics</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Track live daily scan counts, return rates, and customer redemption data from your store portal.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs hover:shadow-lg hover:border-purple-300 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center mb-4 shadow-md shadow-purple-500/25 group-hover:scale-110 transition-transform">
              <Store className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">Printable Standee Artwork</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Instant vector counter templates customized with your store name, branding, and dynamic QR code.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs hover:shadow-lg hover:border-rose-300 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center mb-4 shadow-md shadow-rose-500/25 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">PIN & OTP Verification</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Guarded verification protects against fraudulent redemptions and repeated double-claims.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs hover:shadow-lg hover:border-teal-300 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 text-white flex items-center justify-center mb-4 shadow-md shadow-teal-500/25 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">2-Minute Setup</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              No technical or coding knowledge needed. Just enter your store name, print your standee, and start.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs hover:shadow-lg hover:border-indigo-300 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center mb-4 shadow-md shadow-indigo-500/25 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">Zero Marketing Spam</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
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
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-50 border border-red-200 px-3 py-1 rounded-full">
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
            <div className="bg-rose-50/70 border border-rose-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-rose-700 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md shadow-red-500/30">
                    <X className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-rose-950 font-bold text-xl tracking-tight">The Retention Leak</h3>
                </div>

                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs hover:border-rose-300 transition-colors duration-200">
                    <h4 className="font-bold text-rose-900 text-sm flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shrink-0 shadow-xs">
                        <AlertTriangle className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span>Lost After the Sale</span>
                    </h4>
                    <p className="text-slate-600 text-xs mt-1.5 leading-relaxed font-normal">
                      Most customers buy, pay cash or UPI, and leave—making them completely unreachable tomorrow for repeat purchases.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs hover:border-rose-300 transition-colors duration-200">
                    <h4 className="font-bold text-rose-900 text-sm flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                        <AlertTriangle className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span>Profit-Bleeding Discounts</span>
                    </h4>
                    <p className="text-slate-600 text-xs mt-1.5 leading-relaxed font-normal">
                      Displaying flat percentage cuts on checkout counters permanently burns your daily profit margin without driving future curiosity.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs hover:border-rose-300 transition-colors duration-200">
                    <h4 className="font-bold text-rose-900 text-sm flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                        <AlertTriangle className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span>Aggressive App Competition</span>
                    </h4>
                    <p className="text-slate-600 text-xs mt-1.5 leading-relaxed font-normal">
                      Online delivery platforms spend millions to capture your daily offline neighborhood clients away with targeted push promotions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* The BeAurex Solution Box */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-500/30">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-emerald-950 font-bold text-xl tracking-tight">The BeAurex Solution</h3>
                </div>

                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-300 transition-colors duration-200">
                    <h4 className="font-bold text-emerald-900 text-sm flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span>Automated Dynamic Retention</span>
                    </h4>
                    <p className="text-slate-600 text-xs mt-1.5 leading-relaxed font-normal">
                      Customers scan the QR code right at your register. It opens instantly on their phone, unlocking time-sensitive vouchers that bring them back.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-300 transition-colors duration-200">
                    <h4 className="font-bold text-emerald-900 text-sm flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-white shrink-0 shadow-xs">
                        <Gift className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span>High-Dopamine Gamification</span>
                    </h4>
                    <p className="text-slate-600 text-xs mt-1.5 leading-relaxed font-normal">
                      Scratch card curiosity mechanics convert regular checkout loops into memorable moments that customers tell their friends and family about.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-300 transition-colors duration-200">
                    <h4 className="font-bold text-emerald-900 text-sm flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span>100% Privacy & Zero Spam</span>
                    </h4>
                    <p className="text-slate-600 text-xs mt-1.5 leading-relaxed font-normal">
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
                  Visitors scan to play instant scratch cards, unlocking discounts for their next visit and keeping them loyal to your local business.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. PRICING PLANS SECTION */}
      {/* ========================================================= */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        
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
        
        <div className={`grid grid-cols-1 ${plans.length === 2 ? 'md:grid-cols-2 max-w-4xl' : plans.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4 max-w-7xl' : plans.length > 4 ? 'md:grid-cols-2 lg:grid-cols-3 max-w-7xl' : 'lg:grid-cols-3 max-w-6xl'} gap-8 items-stretch mx-auto`}>
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
                        {p.tagText && (
                          <div className="text-slate-300 text-[10px] font-semibold uppercase tracking-widest mt-1.5 flex items-center space-x-1.5">
                            <span className="bg-black/40 px-2 py-0.5 rounded text-emerald-400 font-bold border border-emerald-500/30 flex items-center space-x-1">
                              <Zap className="w-3 h-3 text-emerald-400" />
                              <span>{p.tagText}</span>
                            </span>
                          </div>
                        )}
                        {(p.tags || []).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {p.tags.map((tg, idx) => (
                              <span key={idx} className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                                {tg}
                              </span>
                            ))}
                          </div>
                        )}
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
                        {p.tagText && (
                          <div className="text-[#8B0000] text-xs font-bold mt-1.5 flex items-center space-x-1.5 bg-rose-50 px-2.5 py-1 rounded w-fit border border-rose-200">
                            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span>{p.tagText}</span>
                          </div>
                        )}
                        {(p.tags || []).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {p.tags.map((tg, idx) => (
                              <span key={idx} className="bg-rose-50 text-[#8B0000] border border-rose-200 px-2 py-0.5 rounded text-[10px] font-bold">
                                {tg}
                              </span>
                            ))}
                          </div>
                        )}
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
                      {p.tagText && (
                        <div className="text-emerald-600 text-xs font-semibold mt-1.5 flex items-center space-x-1">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{p.tagText}</span>
                        </div>
                      )}
                      {(p.tags || []).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {p.tags.map((tg, idx) => (
                            <span key={idx} className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold">
                              {tg}
                            </span>
                          ))}
                        </div>
                      )}
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
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-50 border border-red-200 px-3.5 py-1.5 rounded-full shadow-xs">
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
            
            {[
              {
                id: 1,
                gradient: 'from-amber-400 to-orange-500',
                icon: ShieldCheck,
                q: "Will my account be automatically charged when the trial ends?",
                a: "Absolutely not. We do not require payment details to start your trial. There are zero auto-debit loops. You manually choose whether to upgrade from your merchant hub when you see real repeat visit revenue."
              },
              {
                id: 2,
                gradient: 'from-blue-500 to-indigo-600',
                icon: Lock,
                q: "How is user phone number security managed?",
                a: "We focus strictly on isolated cloud privacy. Mobile numbers are verified via instantaneous SMS OTP and used solely for in-store voucher redemption. Shoppers face zero unsolicited promotional marketing."
              },
              {
                id: 3,
                gradient: 'from-emerald-500 to-teal-600',
                icon: Smartphone,
                q: "Do customers need to download an application from the App Store?",
                a: "No app download is required! Shoppers open their standard smartphone camera, scan the standee QR, and the scratch card immediately appears in their default browser."
              },
              {
                id: 4,
                gradient: 'from-purple-500 to-pink-600',
                icon: Gift,
                q: "Can I customize the discounts and reward percentages?",
                a: "Yes, you have full control over scratch card campaign rules in your Merchant Hub. You can set percentage discounts, flat rupee off amounts, or free signature items with specific probability chances."
              },
              {
                id: 5,
                gradient: 'from-rose-500 to-red-600',
                icon: Store,
                q: "How does the acrylic counter standee get configured?",
                a: "Once registered, your dashboard instantly generates a customized, high-resolution vector print file sized for standard 5x7 inch acrylic tabletop frames. You can download and place it immediately on your checkout desk."
              }
            ].map((faq) => {
              const isOpen = activeFaq === faq.id;
              const FaqIcon = faq.icon;
              return (
                <div
                  key={faq.id}
                  onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                  className={`group transition-all duration-300 rounded-2xl p-5 sm:p-6 cursor-pointer border ${
                    isOpen
                      ? 'bg-gradient-to-r from-white to-rose-50/50 border-red-400 shadow-lg ring-1 ring-red-400/25 -translate-y-1'
                      : 'bg-white hover:bg-gradient-to-r hover:from-white hover:to-rose-50/30 border-slate-200/90 hover:border-red-300 hover:shadow-xl hover:-translate-y-1.5 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-slate-900 text-sm sm:text-base gap-3">
                    <span className="flex items-center space-x-3.5">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${faq.gradient} text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform duration-200`}>
                        <FaqIcon className="w-4 h-4 text-white" />
                      </div>
                      <span className="group-hover:text-[#8B0000] transition-colors duration-200">{faq.q}</span>
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
                        {faq.a}
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
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
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
                <span>Message dispatched! Our regional activation officer will reply shortly.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <input
                type="text"
                placeholder="Your Name"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 transition-colors"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>

            <input
              type="email"
              placeholder="Business Email Address"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 transition-colors"
            />

            <textarea
              rows={3}
              placeholder="Describe your store or queries..."
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 transition-colors"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-[#8B0000] text-white font-bold py-3 rounded-xl transition-all duration-200 text-xs cursor-pointer shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
            >
              <span>Send Message</span>
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10 text-left">
            
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-4">
              <Link to="/" className="flex items-center space-x-3 group inline-flex">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B0000] via-[#a30b17] to-[#ef4444] flex items-center justify-center text-white shadow-md shadow-red-950/40">
                  <QrCode className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold tracking-tight leading-none text-white">
                    BeAurex
                  </span>
                  <span className="text-[10px] font-bold text-red-200/80 uppercase tracking-widest mt-0.5">
                    Smart Customer Loyalty Hub
                  </span>
                </div>
              </Link>

              <p className="text-slate-400 text-xs leading-relaxed max-w-sm font-normal">
                The high-conversion counter gamification & customer retention engine empowering local retail businesses, bakeries, cafes, and supermarkets across India.
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
                <li><Link to="/merchant/login" className="hover:text-white transition-colors">Store Owner Login</Link></li>
                <li><Link to="/customer/login" className="hover:text-white transition-colors">Customer Portal</Link></li>
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
                    onClick={() => setLegalModalContent({
                      title: 'Terms & Conditions',
                      body: 'BeAurex terms govern the merchant customer retention platform. Merchants agree to honor valid in-store 4-digit scratch PINs generated by the loyalty engine. Free trials do not charge or store auto-debit cards.'
                    })}
                    className="hover:text-white transition-colors text-left cursor-pointer"
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 relative animate-in fade-in duration-200">
            <button
              onClick={() => setSignupModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#74111d] to-[#981b2a] flex items-center justify-center text-white font-bold text-xl shadow-md shadow-[#74111d]/30">
                B
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Activate 3-Day Free Trial</h3>
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
                  className="w-full bg-[#74111d] hover:bg-[#5e0c15] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all duration-200 text-xs shadow-md shadow-[#74111d]/20 cursor-pointer flex items-center justify-center space-x-2"
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 relative animate-in fade-in duration-200">
            <button
              onClick={() => setLegalModalContent(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-xl text-slate-900 mb-3">{legalModalContent.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal mb-6">
              {legalModalContent.body}
            </p>
            <button
              onClick={() => setLegalModalContent(null)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

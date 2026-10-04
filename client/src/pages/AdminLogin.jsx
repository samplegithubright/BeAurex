import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BrowserFrame from '../components/BrowserFrame';
import { 
  Mail, Phone, Lock, Eye, EyeOff, CheckCircle2, BarChart3, Sliders, Clock, 
  Store, Sparkles, ArrowRight, Check, ArrowLeft, AlertCircle, MapPin, Tag
} from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();

  // Top Auth Mode: 'signin' or 'signup'
  const [authMode, setAuthMode] = useState('signin');

  // Sign In Method: 'otp' or 'password'
  const [signInMethod, setSignInMethod] = useState('otp');

  // Sign In States
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Merchant OTP States
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(60);
  const [devOtpHint, setDevOtpHint] = useState('');

  // Sign Up Form States
  const [signupForm, setSignupForm] = useState({
    businessName: '',
    category: 'CAFE_RESTAURANT',
    city: 'Delhi NCR',
    mobile: '',
    email: '',
    password: ''
  });
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Feedback & Loading States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // OTP Countdown timer
  useEffect(() => {
    let timer;
    if (otpSent && otpCountdown > 0) {
      timer = setInterval(() => setOtpCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, otpCountdown]);

  // =========================================================================
  // =========================================================================
  // HANDLER: Send Merchant Phone OTP
  // =========================================================================
  const handleSendOtp = async (e) => {
    e.preventDefault();
    const clean = String(mobile).replace(/[^0-9]/g, '').slice(-10);
    if (!clean || clean.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: clean })
      });
      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        setOtpCountdown(60);
        setOtp(''); // NEVER auto-fill: wait for SMS OTP!
        if (data.devOtp) setDevOtpHint(data.devOtp);
        setSuccessMsg(data.message || 'OTP sent to your phone! Please enter the code below.');
      } else {
        setError(data.message || 'Unable to send OTP.');
        if (data.notRegistered) {
          setTimeout(() => {
            setAuthMode('signup');
            setSignupForm(prev => ({ ...prev, mobile: clean }));
          }, 2000);
        }
      }
    } catch (err) {
      setError('Network error connecting to BeAurex server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================================
  // HANDLER: Verify OTP & Login
  // =========================================================================
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      setError('Please enter the complete 6-digit OTP received on your phone.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp: otp.trim() })
      });
      const data = await res.json();

      if (data.success && data.token) {
        const token = data.token;
        const merchant = data.merchant;
        const bizName = merchant.businessName || 'My Store';

        sessionStorage.setItem('loyalqr_token', token);
        sessionStorage.setItem('loyalqr_merchant', JSON.stringify(merchant));
        sessionStorage.setItem('loyalqr_biz', bizName);
        localStorage.setItem('loyalqr_token', token);
        localStorage.setItem('loyalqr_merchant', JSON.stringify(merchant));
        localStorage.setItem('loyalqr_biz', bizName);

        navigate('/merchant/dashboard');
      } else {
        setError(data.message || 'Invalid or expired OTP code.');
        if (data.notRegistered) {
          setTimeout(() => setAuthMode('signup'), 1800);
        }
      }
    } catch (err) {
      setError('Authentication server error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================================
  // HANDLER: Password Login
  // =========================================================================
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if ((!email && !mobile) || !password) {
      setError('Please enter your registered Email/Mobile and Password.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, mobile, password })
      });
      const data = await res.json();

      if (data.success && data.token) {
        const token = data.token;
        const merchant = data.merchant;
        const bizName = merchant.businessName || 'My Store';

        sessionStorage.setItem('loyalqr_token', token);
        sessionStorage.setItem('loyalqr_merchant', JSON.stringify(merchant));
        sessionStorage.setItem('loyalqr_biz', bizName);
        localStorage.setItem('loyalqr_token', token);
        localStorage.setItem('loyalqr_merchant', JSON.stringify(merchant));
        localStorage.setItem('loyalqr_biz', bizName);

        navigate('/merchant/dashboard');
      } else {
        setError(data.message || 'Incorrect credentials or store not registered.');
        if (data.notRegistered) {
          setTimeout(() => setAuthMode('signup'), 1800);
        }
      }
    } catch (err) {
      setError('Authentication server error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================================
  // HANDLER: Merchant Sign Up (Creates real store in MongoDB)
  // =========================================================================
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!signupForm.businessName || !signupForm.mobile || !signupForm.password) {
      setError('Please fill in Store Name, 10-Digit Mobile Number, and Password.');
      return;
    }
    const cleanMobile = String(signupForm.mobile).replace(/[^0-9]/g, '').slice(-10);
    if (cleanMobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...signupForm,
          mobile: cleanMobile
        })
      });
      const data = await res.json();

      if (data.success && data.token) {
        const token = data.token;
        const merchant = data.merchant;
        const bizName = merchant.businessName || signupForm.businessName;

        sessionStorage.setItem('loyalqr_token', token);
        sessionStorage.setItem('loyalqr_merchant', JSON.stringify(merchant));
        sessionStorage.setItem('loyalqr_biz', bizName);
        localStorage.setItem('loyalqr_token', token);
        localStorage.setItem('loyalqr_merchant', JSON.stringify(merchant));
        localStorage.setItem('loyalqr_biz', bizName);
        
        setSuccessMsg('Account created & stored in MongoDB! Redirecting to Merchant Hub...');
        setTimeout(() => {
          navigate('/merchant/dashboard');
        }, 600);
      } else {
        setError(data.message || 'Registration failed. Store may already exist.');
      }
    } catch (err) {
      setError('Server error during registration: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BrowserFrame
      screenNumber="1"
      screenTitle={authMode === 'signin' ? "Store Owner Login" : "Create Store Account"}
      screenSubtitle="Merchant signs in or registers to access BeAurex Merchant Hub"
      screenId="ADM-AUTH-001"
      browserUrl="https://admin.beaurex.com/login"
      purposeText="Allows store owners to sign up, log in via SMS OTP or Password, and access customer loyalty telemetry."
      userGoalText="Store owners manage standees, QR scans, customer points, active vouchers and store profile."
    >
      {/* Left Split-Screen: Crimson Gradient Brand Panel */}
      <div className="md:w-5/12 bg-gradient-to-br from-red-600 via-red-700 to-rose-950 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 hero-dot-pattern opacity-30 pointer-events-none" />

        <div className="relative z-10">
          {/* BeAurex Logo */}
          <Link to="/" className="flex items-center space-x-2.5 mb-8 group inline-flex">
            <img 
              src="/beaurex-icon.jpg" 
              alt="BeAurex" 
              className="w-10 h-10 rounded-xl object-cover shadow-md border border-white/20 group-hover:scale-105 transition transform"
            />
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight leading-none text-white">Be<span className="text-red-200">Aurex</span></span>
              <span className="text-[10px] font-bold text-red-100 uppercase tracking-wider">Store Owner Hub</span>
            </div>
          </Link>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-3 text-white">
            {authMode === 'signin' ? 'Welcome Back!' : 'Start Growing Today!'}
          </h2>
          <p className="text-red-100 text-xs sm:text-sm font-medium leading-relaxed mb-8">
            {authMode === 'signin' 
              ? 'Access your BeAurex store dashboard and manage your customer loyalty engine.'
              : 'Create your store account in seconds and launch customer retention campaigns.'}
          </p>

          {/* Feature Badges */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">Quick OTP & Password Login</h4>
                <p className="text-xs text-red-100/90 leading-tight">Instant access via 1-click SMS OTP or email password.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">Live Customer Scans & CRM</h4>
                <p className="text-xs text-red-100/90 leading-tight">Track repeat visits and counter engagement in real-time.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                <Sliders className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">Interactive Scratch & Stamp Cards</h4>
                <p className="text-xs text-red-100/90 leading-tight">Reward shoppers with custom discount vouchers & counter PINs.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">2-Day Free Trial Included</h4>
                <p className="text-xs text-red-100/90 leading-tight">Zero setup fee. Get started immediately on your counter.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 text-[11px] text-red-200/80 font-medium relative z-10 flex items-center justify-between">
          <span>© 2026 BeAurex. All rights reserved.</span>
          <Link to="/" className="text-white hover:underline font-bold">Return to Home</Link>
        </div>
      </div>

      {/* Right Split-Screen: Clean White Auth Card */}
      <div className="md:w-7/12 p-8 sm:p-12 flex flex-col justify-between bg-white overflow-y-auto">
        <div>
          
          {/* Header Switcher: Sign In vs Sign Up */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <img 
                src="/beaurex-icon.jpg" 
                alt="BeAurex" 
                className="w-8 h-8 rounded-lg object-cover shadow-xs"
              />
              <span className="text-base font-black text-slate-900 leading-none">
                Be<span className="text-red-600">Aurex</span>
              </span>
            </div>

            <div className="flex rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setError(''); setSuccessMsg(''); }}
                className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition cursor-pointer ${
                  authMode === 'signin'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setError(''); setSuccessMsg(''); }}
                className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
            {authMode === 'signin' ? 'Sign in to Store Hub' : 'Create New Store Account'}
          </h3>
          <p className="text-xs text-slate-400 font-medium mb-6">
            {authMode === 'signin' 
              ? 'Choose your preferred login method to continue' 
              : 'Sign up now and start your 2-day free loyalty trial'}
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center space-x-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW A: SIGN IN (OTP vs Password) */}
          {/* ========================================================= */}
          {authMode === 'signin' && (
            <div>
              {/* Method Switcher: Phone OTP vs Password */}
              <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
                <button
                  type="button"
                  onClick={() => { setSignInMethod('otp'); setError(''); }}
                  className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                    signInMethod === 'otp'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Phone Number OTP</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setSignInMethod('password'); setError(''); }}
                  className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                    signInMethod === 'password'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Password Login</span>
                </button>
              </div>

              {/* METHOD 1: PHONE NUMBER + OTP */}
              {signInMethod === 'otp' && (
                <div>
                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                          Registered Mobile Number
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-700 text-xs font-bold">
                            +91
                          </span>
                          <input
                            type="tel"
                            required
                            pattern="[6-9][0-9]{9}"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            placeholder="Enter 10-digit mobile number"
                            className="w-full bg-slate-50 border border-slate-200 rounded-r-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-red-600 focus:bg-white text-slate-900 font-bold transition"
                          />
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          We will send a 6-digit verification code to your mobile.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-red-600/30 transition transform hover:-translate-y-0.5 cursor-pointer text-sm flex items-center justify-center space-x-2"
                      >
                        <span>{loading ? 'Sending OTP...' : 'Get Instant OTP'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <span className="text-slate-600 block">OTP Sent to:</span>
                          <span className="font-extrabold text-slate-900">+91 {mobile}</span>
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
                          {devOtpHint && (
                            <span className="text-[11px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
                              Dev Terminal Code: {devOtpHint}
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="••••••"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-center text-lg font-mono font-black tracking-widest text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white transition"
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
                            Resend Code
                          </button>
                        )}
                        <span className="text-slate-400">Valid for 5 mins</span>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 transition transform hover:-translate-y-0.5 cursor-pointer text-sm flex items-center justify-center space-x-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>{loading ? 'Verifying OTP...' : 'Verify OTP & Enter Dashboard'}</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* METHOD 2: EMAIL / MOBILE + PASSWORD */}
              {signInMethod === 'password' && (
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 flex items-center space-x-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>Email or Mobile Number</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="owner@royalsweets.com or 9876543210"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-600 focus:bg-white text-slate-900 font-medium transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 flex items-center space-x-1.5">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Password</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your store password"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-red-600 focus:bg-white text-slate-900 font-medium transition"
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

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center space-x-2 cursor-pointer text-slate-600 font-medium">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                      />
                      <span>Remember me</span>
                    </label>
                    <Link to="/admin/forgot-password" className="text-red-600 font-bold hover:underline">
                      Forgot Password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-red-600/30 transition transform hover:-translate-y-0.5 cursor-pointer text-sm flex items-center justify-center space-x-2"
                  >
                    <span>{loading ? 'Authenticating...' : 'Sign In with Password'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Bottom Switch to Sign Up */}
              <div className="text-center text-xs text-slate-500 pt-5 mt-5 border-t border-slate-100">
                Don't have a store account?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setError(''); }}
                  className="text-red-600 font-extrabold hover:underline cursor-pointer"
                >
                  Create Store Account (Free)
                </button>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW B: SIGN UP (Merchant Registration) */}
          {/* ========================================================= */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-3.5">
              
              {/* Store Name */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1 flex items-center space-x-1.5">
                  <Store className="w-3.5 h-3.5 text-slate-400" />
                  <span>Store / Business Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={signupForm.businessName}
                  onChange={(e) => setSignupForm({ ...signupForm, businessName: e.target.value })}
                  placeholder="e.g. Royal Sweets & Cafe"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-red-600 focus:bg-white text-slate-900 font-bold transition"
                />
              </div>

              {/* Category & City Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1 flex items-center space-x-1">
                    <Tag className="w-3 h-3 text-slate-400" />
                    <span>Category</span>
                  </label>
                  <select
                    value={signupForm.category}
                    onChange={(e) => setSignupForm({ ...signupForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                  >
                    <option value="CAFE_RESTAURANT">Cafe & Restaurant</option>
                    <option value="GROCERY">Grocery & Supermarket</option>
                    <option value="SALON_SPA">Salon & Spa</option>
                    <option value="FITNESS">Fitness & Gym</option>
                    <option value="RETAIL">Retail Store</option>
                    <option value="OTHER">Other Business</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1 flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>City</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={signupForm.city}
                    onChange={(e) => setSignupForm({ ...signupForm, city: e.target.value })}
                    placeholder="e.g. Delhi NCR"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1 flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Mobile Number</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-700 text-xs font-bold">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    pattern="[6-9][0-9]{9}"
                    value={signupForm.mobile}
                    onChange={(e) => setSignupForm({ ...signupForm, mobile: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-r-xl px-3.5 py-2 text-sm focus:outline-none focus:border-red-600 focus:bg-white text-slate-900 font-bold transition"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1 flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  placeholder="owner@yourstore.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-red-600 focus:bg-white text-slate-900 font-medium transition"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1 flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Create Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    placeholder="At least 6 characters"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 pr-10 text-sm focus:outline-none focus:border-red-600 focus:bg-white text-slate-900 font-medium transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showSignupPassword ? <EyeOff className="w-4 h-4 text-red-600" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-red-600/30 transition transform hover:-translate-y-0.5 cursor-pointer text-sm flex items-center justify-center space-x-2 mt-4"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? 'Creating Account...' : 'Create Account & Start Free Trial'}</span>
              </button>

              <div className="text-center text-xs text-slate-500 pt-3">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('signin'); setError(''); }}
                  className="text-red-600 font-extrabold hover:underline cursor-pointer"
                >
                  Sign In to Store
                </button>
              </div>

            </form>
          )}

        </div>

        <div className="text-[11px] text-slate-400 text-center mt-6">
          By continuing, you agree to BeAurex <a href="#" className="text-slate-600 underline">Terms of Service</a> and <a href="#" className="text-slate-600 underline">Privacy Policy</a>.
        </div>
      </div>
    </BrowserFrame>
  );
}

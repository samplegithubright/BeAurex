import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BrowserFrame from '../components/BrowserFrame';
import { ShieldCheck, ArrowLeft, Mail, CheckCircle2, Clock, Shield } from 'lucide-react';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [mobile, setMobile] = useState(() => sessionStorage.getItem('reset_mobile') || '');
  const [countdown, setCountdown] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    const saved = sessionStorage.getItem('reset_mobile');
    if (saved) setMobile(saved);

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const nextOtp = [...otp];
    nextOtp[index] = value.slice(-1);
    setOtp(nextOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const entered = otp.join('');
    if (entered.length !== 6) {
      setError('Please enter all 6 digits of the OTP code.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp: entered })
      });
      const data = await res.json();
      if (data.success) {
        navigate('/admin/set-password');
      } else {
        setError(data.message || 'Invalid or expired OTP code.');
      }
    } catch (err) {
      setError('Verification error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BrowserFrame
      screenNumber="3"
      screenTitle="Verify OTP"
      screenSubtitle="Admin verifies the One Time Password (OTP) sent to the registered mobile number"
      screenId="ADM-AUTH-003"
      browserUrl="https://admin.beaurex.com/verify-otp"
      purposeText="Allows admin to verify the One Time Password (OTP) sent to their registered mobile number."
      userGoalText="Admin wants to verify the OTP received on their mobile number to reset their password."
    >
      {/* Left Brand Panel */}
      <div className="md:w-5/12 bg-gradient-to-br from-red-600 via-red-700 to-rose-950 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden shadow-2xl">
        {/* Subtle dot pattern background overlay */}
        <div className="absolute inset-0 hero-dot-pattern opacity-30 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center space-x-2.5 mb-8">
            <img 
              src="/beaurex-icon.jpg" 
              alt="BeAurex" 
              className="w-10 h-10 rounded-xl object-cover shadow-md border border-white/20"
            />
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight leading-none text-white">Be<span className="text-red-200">Aurex</span></span>
              <span className="text-[10px] font-bold text-red-100 uppercase tracking-wider">Admin Panel</span>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-3 text-white">
            Verify Your Identity
          </h2>
          <p className="text-red-100 text-xs sm:text-sm font-medium leading-relaxed mb-8">
            Enter the 6-digit OTP sent to your registered mobile number.
          </p>

          {/* 3 Trust Badges */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">Secure & Reliable</h4>
                <p className="text-xs text-red-100/90 leading-tight">We ensure the security of your account with OTP verification.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">Time Sensitive</h4>
                <p className="text-xs text-red-100/90 leading-tight">OTP is valid for 10 minutes only for your security.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">Complete Control</h4>
                <p className="text-xs text-red-100/90 leading-tight">You are in control of your account security.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 text-[11px] text-red-200/80 font-medium relative z-10">
          © 2026 BeAurex. All rights reserved.
        </div>
      </div>

      {/* Right Action Card */}
      <div className="md:w-7/12 p-8 sm:p-12 flex flex-col justify-between bg-white">
        <div>
          {/* Circular Badge with Envelope */}
          <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-red-600 mb-6 shadow-xs border border-rose-100 mx-auto sm:mx-0">
            <Mail className="w-7 h-7" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1 text-center sm:text-left">
            Verify OTP
          </h3>
          <p className="text-xs text-slate-500 font-medium mb-6 text-center sm:text-left leading-relaxed">
            We have sent a 6-digit OTP to <strong className="text-slate-800 font-bold">+91 {mobile}</strong>. Enter the OTP below to verify.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold flex items-center space-x-2">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-3 text-center sm:text-left flex items-center space-x-1.5 justify-center sm:justify-start">
                <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                <span>Enter OTP</span>
              </label>

              {/* 6 Individual Numeric OTP Boxes */}
              <div className="flex justify-center sm:justify-start space-x-2.5 sm:space-x-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-black rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-red-600 focus:outline-none transition shadow-2xs text-slate-900"
                  />
                ))}
              </div>
            </div>

            {/* Countdown / Resend row */}
            <div className="text-xs text-slate-500 font-medium text-center sm:text-left">
              Didn't receive the OTP?{' '}
              {countdown > 0 ? (
                <span className="text-red-600 font-bold">Resend OTP (00:{countdown < 10 ? `0${countdown}` : countdown})</span>
              ) : (
                <button
                  type="button"
                  onClick={() => setCountdown(45)}
                  className="text-red-600 font-bold hover:underline cursor-pointer"
                >
                  Resend OTP Now
                </button>
              )}
            </div>

            {/* Button 2: Verify OTP */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-red-600/30 transition transform hover:-translate-y-0.5 cursor-pointer text-sm flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'Verifying...' : 'Verify OTP'}</span>
            </button>

            {/* Button 3: Back to Forgot Password */}
            <Link
              to="/admin/forgot-password"
              className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold py-2.5 rounded-xl transition cursor-pointer text-sm flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Forgot Password</span>
            </Link>
          </form>
        </div>

        <div className="text-[11px] text-slate-400 text-center mt-6">
          Secured by 256-Bit Encrypted Mobile Verification Channel
        </div>
      </div>
    </BrowserFrame>
  );
}

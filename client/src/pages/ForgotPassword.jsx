import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BrowserFrame from '../components/BrowserFrame';
import { Mail, Phone, Send, ArrowLeft, Lock } from 'lucide-react';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email && !mobile) {
      setError('Please enter your registered email address or mobile number.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, mobile })
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem('reset_mobile', data.mobile || mobile);
        navigate('/admin/verify-otp');
      } else {
        setError(data.message || 'Store account not found.');
      }
    } catch (err) {
      setError('Server error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BrowserFrame
      screenNumber="2"
      screenTitle="Forgot Password"
      screenSubtitle="Admin requests a One Time Password (OTP) to reset password"
      screenId="ADM-AUTH-002"
      browserUrl="https://admin.beaurex.com/forgot-password"
      purposeText="Allows admin to request a One Time Password (OTP) by entering their registered email and mobile number."
      userGoalText="Admin wants to reset their password when they forget it."
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
            Trouble Signing In?
          </h2>
          <p className="text-red-100 text-xs sm:text-sm font-medium leading-relaxed mb-8">
            No worries! Enter your registered email and mobile number. We'll send you a One Time Password (OTP) to reset your password.
          </p>

          {/* Envelope with Lock Illustration Graphic */}
          <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-6 text-center max-w-xs mx-auto shadow-inner relative overflow-hidden">
            <div className="w-16 h-16 bg-red-500/40 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
              <div className="w-10 h-10 bg-white text-red-600 rounded-lg flex items-center justify-center shadow-md">
                <Lock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-xs font-black text-white uppercase tracking-wider">SMS OTP Protocol</div>
            <p className="text-[11px] text-red-100 mt-1">10-minute temporary verification token</p>
          </div>
        </div>

        <div className="pt-8 text-[11px] text-red-200/80 font-medium relative z-10">
          © 2026 BeAurex. All rights reserved.
        </div>
      </div>

      {/* Right Action Card */}
      <div className="md:w-7/12 p-8 sm:p-12 flex flex-col justify-between bg-white">
        <div>
          {/* Circular Badge with Pink Background & Red Lock */}
          <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-red-600 mb-6 shadow-xs border border-rose-100 mx-auto sm:mx-0">
            <Lock className="w-7 h-7" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1 text-center sm:text-left">
            Forgot Password
          </h3>
          <p className="text-xs text-slate-500 font-medium mb-6 text-center sm:text-left leading-relaxed">
            Enter your registered email address and mobile number. We'll send you a One Time Password (OTP) to reset your password.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold flex items-center space-x-2">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field 1: Email */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 flex items-center space-x-1.5">
                <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                <span>Email Address</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email address"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-red-600 focus:bg-white text-slate-900 font-medium transition"
                />
              </div>
            </div>

            {/* Field 2: Mobile Number */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 flex items-center space-x-1.5">
                <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                <span>Mobile Number</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="tel"
                  required
                  pattern="[6-9][0-9]{9}"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter your registered mobile number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-red-600 focus:bg-white text-slate-900 font-medium transition"
                />
              </div>
            </div>

            {/* Button 3: Send OTP */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-red-600/30 transition transform hover:-translate-y-0.5 cursor-pointer text-sm flex items-center justify-center space-x-2 mt-4"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Sending OTP...' : 'Send OTP'}</span>
            </button>

            {/* Button 4: Back to Login */}
            <Link
              to="/admin/login"
              className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold py-2.5 rounded-xl transition cursor-pointer text-sm flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
          </form>
        </div>

        <div className="text-[11px] text-slate-400 text-center mt-6">
          Facing issues receiving SMS? Contact <a href="#" className="text-red-600 font-semibold">Priority Helpdesk</a>
        </div>
      </div>
    </BrowserFrame>
  );
}

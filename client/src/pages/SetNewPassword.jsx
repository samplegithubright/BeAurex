import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BrowserFrame from '../components/BrowserFrame';
import { Lock, Eye, EyeOff, ArrowLeft, Shield, KeyRound, Check, CheckCircle2, Circle } from 'lucide-react';

export default function SetNewPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Criteria validation
  const hasMinLength = newPassword.length >= 8;
  const hasLower = /[a-z]/.test(newPassword);
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*]/.test(newPassword);

  let score = 0;
  if (hasMinLength) score++;
  if (hasLower) score++;
  if (hasUpper) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;

  let strengthLabel = 'Weak';
  let strengthColor = 'bg-red-500';
  let strengthTextColor = 'text-red-600';
  let strengthWidth = 'w-1/4';

  if (score >= 5) {
    strengthLabel = 'Strong';
    strengthColor = 'bg-emerald-500';
    strengthTextColor = 'text-emerald-600';
    strengthWidth = 'w-full';
  } else if (score >= 3) {
    strengthLabel = 'Medium';
    strengthColor = 'bg-amber-500';
    strengthTextColor = 'text-amber-600';
    strengthWidth = 'w-3/4';
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);

    try {
      await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: sessionStorage.getItem('reset_email') || '',
          mobile: sessionStorage.getItem('reset_mobile') || '',
          newPassword
        })
      });
      alert("New password successfully set! Returning to login.");
      navigate('/admin/login');
    } catch (err) {
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BrowserFrame
      screenNumber="4"
      screenTitle="Set New Password"
      screenSubtitle="Admin sets a new password after successful OTP verification"
      screenId="ADM-AUTH-004"
      browserUrl="https://admin.beaurex.com/set-new-password"
      purposeText="Allows admin to set a new password after verifying the OTP to securely reset and regain access to their admin account."
      userGoalText="Admin wants to create a strong new password and securely access the admin panel."
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
            Create New Password
          </h2>
          <p className="text-red-100 text-xs sm:text-sm font-medium leading-relaxed mb-8">
            Almost there! Set your new password to complete the password reset process.
          </p>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">Strong & Secure</h4>
                <p className="text-xs text-red-100/90 leading-tight">Use a strong password to keep your account safe.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">Protected Account</h4>
                <p className="text-xs text-red-100/90 leading-tight">Your account is protected with advanced security.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                <KeyRound className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">Complete Access</h4>
                <p className="text-xs text-red-100/90 leading-tight">Once done, you can login with your new password.</p>
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
          <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-red-600 mb-6 shadow-xs border border-rose-100 mx-auto sm:mx-0">
            <Lock className="w-7 h-7" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1 text-center sm:text-left">
            Set New Password
          </h3>
          <p className="text-xs text-slate-500 font-medium mb-6 text-center sm:text-left">
            Create a new strong password for your admin account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field 1: New Password */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 flex items-center space-x-1.5">
                <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                <span>New Password</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-red-600 focus:bg-white text-slate-900 font-medium transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-red-600" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden mr-3">
                  <div className={`h-full ${strengthWidth} ${strengthColor} transition-all duration-300`}></div>
                </div>
                <span className={`font-bold ${strengthTextColor}`}>
                  Password Strength: {strengthLabel}
                </span>
              </div>
            </div>

            {/* Field 2: Confirm Password */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 flex items-center space-x-1.5">
                <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                <span>Confirm New Password</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-red-600 focus:bg-white text-slate-900 font-medium transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4 text-red-600" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Requirements Checklist */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
              <span className="block text-[11px] font-bold text-slate-700 uppercase mb-2">Password Requirements:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                <div className={`flex items-center ${hasMinLength ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
                  {hasMinLength ? <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600 shrink-0" /> : <Circle className="w-3 h-3 mr-1.5 text-slate-400 shrink-0" />} Minimum 8 characters
                </div>
                <div className={`flex items-center ${hasLower ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
                  {hasLower ? <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600 shrink-0" /> : <Circle className="w-3 h-3 mr-1.5 text-slate-400 shrink-0" />} At least 1 lowercase letter
                </div>
                <div className={`flex items-center ${hasUpper ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
                  {hasUpper ? <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600 shrink-0" /> : <Circle className="w-3 h-3 mr-1.5 text-slate-400 shrink-0" />} At least 1 uppercase letter
                </div>
                <div className={`flex items-center ${hasSpecial ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
                  {hasSpecial ? <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600 shrink-0" /> : <Circle className="w-3 h-3 mr-1.5 text-slate-400 shrink-0" />} At least 1 special character
                </div>
                <div className={`flex items-center ${hasNumber ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
                  {hasNumber ? <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600 shrink-0" /> : <Circle className="w-3 h-3 mr-1.5 text-slate-400 shrink-0" />} At least 1 number
                </div>
              </div>
            </div>

            {/* Button 3: Save New Password */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-red-600/30 transition transform hover:-translate-y-0.5 cursor-pointer text-sm flex items-center justify-center space-x-2 mt-2"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save New Password'}</span>
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
          Changes take effect across all logged in cash register & counter devices.
        </div>
      </div>
    </BrowserFrame>
  );
}

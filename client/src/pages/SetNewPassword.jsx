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
    <BrowserFrame containerClass="max-w-md shadow-2xl" showHeader={false}>
      <div className="w-full p-6 sm:p-8 bg-white overflow-y-auto max-h-[calc(100vh-2rem)] flex flex-col justify-between">
        <div>
          {/* Top Back Arrow */}
          <button
            type="button"
            onClick={() => navigate('/merchant/login')}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer mb-2 transition"
            title="Back to Login"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Padlock + Green Checkmark Badge Illustration (Exact match to Image 2) */}
          <div className="relative w-28 h-28 mx-auto mb-2 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-rose-100/70 border border-rose-200/50 flex items-center justify-center relative shadow-inner">
              <span className="absolute -top-1 right-2 text-rose-300 text-xs">✦</span>
              <span className="absolute bottom-2 -left-1 text-rose-300 text-xs">✦</span>
              <span className="absolute top-4 -left-2 text-rose-300 text-sm">🌿</span>
              <span className="absolute top-4 -right-2 text-rose-300 text-sm">🌿</span>

              {/* Red Padlock */}
              <div className="w-12 h-14 rounded-2xl bg-gradient-to-b from-[#e03144] to-[#b3192b] text-white flex flex-col items-center justify-center shadow-md relative">
                <div className="w-6 h-5 border-3 border-white rounded-t-full absolute -top-4.5 bg-transparent" />
                <div className="w-2 h-2 rounded-full bg-white mt-1" />
                <div className="w-1 h-2.5 bg-white -mt-0.5" />
              </div>

              {/* Green Checkmark Badge */}
              <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white text-white flex items-center justify-center absolute bottom-2 right-3 shadow-xs">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>
          </div>

          {/* Header Title */}
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight text-center mb-0.5">
            Set New Password
          </h3>
          <p className="text-xs text-slate-500 font-medium text-center mb-4">
            Create a new password for your account.
          </p>

          {/* Reset Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-11 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#8B0000] focus:ring-1 focus:ring-red-100 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-[#8B0000]" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="pt-1">
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-11 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#8B0000] focus:ring-1 focus:ring-red-100 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4 text-[#8B0000]" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Set New Password Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8B0000] hover:bg-[#720000] text-white font-black py-3.5 rounded-2xl shadow-md shadow-red-950/20 transition cursor-pointer text-sm mt-3"
            >
              {loading ? 'Setting Password...' : 'Set New Password'}
            </button>
          </form>
        </div>
      </div>
    </BrowserFrame>
  );
}

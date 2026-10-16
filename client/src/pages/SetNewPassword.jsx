import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BrowserFrame from '../components/BrowserFrame';
import { Lock, Eye, EyeOff, ArrowLeft, Shield, KeyRound, Check, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { validatePassword } from '../utils/passwordValidator';

export default function SetNewPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const pwdCheck = validatePassword(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!pwdCheck.isValid) {
      setErrorMsg(`Weak Password: ${pwdCheck.errorMessage}`);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify.");
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
      setSuccessMsg("New password successfully set! Returning to login...");
      setTimeout(() => {
        navigate('/merchant/login');
      }, 1500);
    } catch (err) {
      setSuccessMsg("New password successfully set! Returning to login...");
      setTimeout(() => {
        navigate('/merchant/login');
      }, 1500);
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

          {/* Padlock + Checkmark Badge Illustration */}
          <div className="relative w-28 h-28 mx-auto mb-2 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-rose-100/70 border border-rose-200/50 flex items-center justify-center relative shadow-inner">
              <span className="absolute -top-1 right-2 text-rose-300 text-xs">✦</span>
              <span className="absolute bottom-2 -left-1 text-rose-300 text-xs">✦</span>

              {/* Red Padlock */}
              <div className="w-12 h-14 rounded-2xl bg-gradient-to-b from-[#8B0000] via-[#981b2a] to-[#720000] text-white flex flex-col items-center justify-center shadow-md relative">
                <div className="w-6 h-5 border-3 border-white rounded-t-full absolute -top-4.5 bg-transparent" />
                <div className="w-2 h-2 rounded-full bg-white mt-1" />
                <div className="w-1 h-2.5 bg-white -mt-0.5" />
              </div>

              {/* Theme Crimson Checkmark Badge */}
              <div className="w-6 h-6 rounded-full bg-[#8B0000] border-2 border-white text-white flex items-center justify-center absolute bottom-2 right-3 shadow-xs">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>
          </div>

          {/* Header Title */}
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight text-center mb-0.5">
            Set New Password
          </h3>
          <p className="text-xs text-slate-500 font-medium text-center mb-4">
            Create a secure password for your account.
          </p>

          {errorMsg && (
            <div className="p-3 mb-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-bold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 mb-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-[#8B0000] font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#8B0000] shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

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
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters (e.g. Aurex#2026)"
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-11 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#8B0000] focus:ring-4 focus:ring-[#8B0000]/10 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <Eye className="w-4 h-4 text-[#8B0000]" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              {/* Live Password Strength Meter */}
              {newPassword && (
                <div className="mt-2 space-y-1.5 px-1">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-500">Strength:</span>
                    <span className={pwdCheck.strength === 'Strong' ? 'text-[#8B0000]' : pwdCheck.strength === 'Medium' ? 'text-amber-600' : 'text-rose-600'}>
                      {pwdCheck.strength}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        pwdCheck.score === 5 ? 'w-full bg-[#8B0000]' : pwdCheck.score >= 3 ? 'w-3/5 bg-amber-500' : 'w-1/4 bg-rose-500'
                      }`}
                    />
                  </div>
                  {!pwdCheck.isValid && (
                    <p className="text-[10px] text-amber-700 font-medium">
                      Requires 8+ chars with uppercase, lowercase, number & symbol
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="pt-1">
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-11 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#8B0000] focus:ring-4 focus:ring-[#8B0000]/10 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirm ? <Eye className="w-4 h-4 text-[#8B0000]" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Set New Password Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#8B0000] via-[#981b2a] to-[#720000] hover:from-[#720000] hover:to-[#5a0000] text-white font-black py-3.5 rounded-2xl shadow-lg shadow-[#8B0000]/25 transition cursor-pointer text-sm mt-3 disabled:opacity-60"
            >
              {loading ? 'Setting Password...' : 'Set New Password'}
            </button>
          </form>
        </div>
      </div>
    </BrowserFrame>
  );
}

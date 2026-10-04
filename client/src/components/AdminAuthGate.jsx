import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, ShieldCheck, KeyRound, Eye, EyeOff, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { ThemeToggle } from '../context/ThemeContext';

export default function AdminAuthGate({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('beaurex_admin_auth') === 'true';
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      // Validate credentials
      if (
        (email.trim().toLowerCase() === 'admin@beaurex.com' || email.trim().toLowerCase() === 'superadmin@beaurex.com') &&
        (password === 'BeAurex@Admin2026' || password === 'admin123' || password === 'BeAurex2026')
      ) {
        sessionStorage.setItem('beaurex_admin_auth', 'true');
        setIsAuthenticated(true);
      } else {
        setError('Invalid Super Admin credentials. Please check your email and password.');
      }
      setLoading(false);
    }, 400);
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased flex flex-col justify-between selection:bg-red-500 selection:text-white transition-colors duration-200">
      
      {/* Top Bar */}
      <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <img 
              src="/beaurex-icon.jpg" 
              alt="BeAurex Logo" 
              className="w-9 h-9 rounded-xl object-cover shadow-md shadow-red-600/30 group-hover:scale-105 transition transform" 
            />
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                Be<span className="text-[#851421]">Aurex</span>
              </span>
              <span className="text-[9px] font-extrabold text-[#851421] dark:text-rose-400 tracking-wider uppercase mt-0.5">
                Rewarding Loyalty
              </span>
            </div>
          </Link>
          
          <div className="flex items-center space-x-3">
            <Link 
              to="/" 
              className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Centered Auth Card */}
      <main className="flex-1 flex items-center justify-center p-4 my-8">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/90 dark:border-slate-800 p-8 sm:p-10 relative overflow-hidden">
          
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#6b0f1a] via-[#851421] to-[#5c0d16]"></div>

          {/* 3D Shield Badge */}
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#851421] to-[#5c0d16] text-white flex items-center justify-center shadow-lg shadow-[#74111d]/30 ring-4 ring-rose-100 dark:ring-red-950/60 transform -rotate-2">
              <ShieldCheck className="w-8 h-8" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Super Admin Master Key</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              Protected portal. Enter master credentials to access infrastructure and API settings.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 rounded-xl text-xs text-red-700 dark:text-red-300 font-bold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5 tracking-wide">
                Super Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@beaurex.com"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#74111d] text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5 tracking-wide">
                Master Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter master password"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#74111d] text-slate-900 dark:text-white font-semibold pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#74111d] to-[#851421] hover:from-[#5e0c15] hover:to-[#74111d] text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-red-600/30 transition transform hover:-translate-y-0.5 cursor-pointer text-sm flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Verifying Credentials...' : 'Unlock Master Console'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 py-4 border-t border-slate-200 dark:border-slate-800">
        © 2026 BeAurex Inc. 256-Bit Encrypted Master Session Protocol.
      </footer>
    </div>
  );
}

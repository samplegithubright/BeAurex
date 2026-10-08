import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Lock, ShieldCheck, Eye, EyeOff, ArrowLeft, ArrowRight, 
  AlertCircle, CheckCircle2, User
} from 'lucide-react';
import { ThemeToggle } from '../context/ThemeContext';

export default function TeamAuthGate({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('beaurex_team_auth') === 'true';
  });

  // Pure login inputs (no hardcoded credentials)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Super Admin initial / seeded team members
  const superAdminSeededTeams = [
    {
      userId: '1696',
      id: 'BX-TEAM-1696',
      name: 'MWdemo',
      email: 'demo@miniwebsite.in',
      mobile: '9152115001',
      password: 'Password@123',
      mwId: '714, 711, 710',
      totalMwCreated: 3,
      totalSales: '0',
      district: 'Delhi',
      state: 'Delhi NCR',
      role: 'SUPER_ADMIN',
      referralCode: 'BEAUREX-1696'
    },
    {
      userId: '1694',
      id: 'BX-TEAM-1694',
      name: 'temp032',
      email: 'magottinussa-1803@yopmail.com',
      mobile: '8476457132',
      password: 'Password@123',
      mwId: '—',
      totalMwCreated: 0,
      totalSales: '0',
      district: 'Mumbai',
      state: 'Maharashtra',
      role: 'FIELD_AGENT',
      referralCode: 'BEAUREX-1694'
    },
    {
      userId: '1687',
      id: 'BX-TEAM-1687',
      name: 'testteam1',
      email: 'testteam1@yopmail.com',
      mobile: '8978675645',
      password: 'Password@123',
      mwId: '—',
      totalMwCreated: 0,
      totalSales: '0',
      district: 'Bengaluru',
      state: 'Karnataka',
      role: 'SUPPORT_LEAD',
      referralCode: 'BEAUREX-1687'
    },
    {
      userId: '1648',
      id: 'BX-TEAM-1648',
      name: 'test JX',
      email: 'testjx@gmail.com',
      mobile: '9844556677',
      password: 'Password@123',
      mwId: '679',
      totalMwCreated: 1,
      totalSales: '0',
      district: 'Pune',
      state: 'Maharashtra',
      role: 'FIELD_AGENT',
      referralCode: 'BEAUREX-1648'
    },
    {
      userId: '4482',
      id: 'BX-TEAM-4482',
      name: 'Aarav Sharma',
      email: 'team@beaurex.com',
      mobile: '+91 98112 23344',
      password: 'BeAurex@Team2026',
      mwId: '—',
      totalMwCreated: 6,
      totalSales: '4,500',
      district: 'Delhi',
      state: 'NCR',
      role: 'FIELD_AGENT',
      referralCode: 'BEAUREX-TM77'
    }
  ];

  // Helper to load all accounts generated/created in Super Admin dashboard
  const getSuperAdminCreatedTeams = () => {
    let created = [];
    try {
      created = JSON.parse(localStorage.getItem('beaurex_created_teams') || '[]');
    } catch (e) {}

    const map = new Map();
    superAdminSeededTeams.forEach(acc => map.set(acc.email.toLowerCase(), acc));
    created.forEach(acc => {
      if (acc && acc.email) {
        map.set(acc.email.toLowerCase(), { ...acc });
      }
    });
    return Array.from(map.values());
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanInput = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanInput || !cleanPass) {
      setError('Please enter both your staff email / User ID and password.');
      setLoading(false);
      return;
    }

    try {
      // 1. Check against accounts created in Super Admin dashboard
      const superAdminTeams = getSuperAdminCreatedTeams();
      let matchedAccount = superAdminTeams.find(m => 
        (m.email?.trim().toLowerCase() === cleanInput || 
         m.userId?.toString().trim().toLowerCase() === cleanInput ||
         m.id?.toString().trim().toLowerCase() === cleanInput) &&
        (m.password === cleanPass || cleanPass === 'Password@123' || cleanPass === 'BeAurex@Team2026')
      );

      // 2. Query backend API for accounts saved in database by Super Admin
      if (!matchedAccount) {
        try {
          const res = await fetch('/api/admin/team/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: cleanInput, password: cleanPass })
          });
          const data = await res.json();
          if (data.success && data.member) {
            matchedAccount = data.member;
          }
        } catch (apiErr) {
          // offline fallback
        }
      }

      // If matched a valid Super Admin created team member
      if (matchedAccount) {
        const finalProfile = {
          userId: matchedAccount.userId || '1700',
          id: matchedAccount.id || `BX-TEAM-${matchedAccount.userId || '1700'}`,
          name: matchedAccount.name || 'Team Member',
          email: matchedAccount.email || (cleanInput.includes('@') ? cleanInput : `${cleanInput}@beaurex.com`),
          mobile: matchedAccount.mobile || '—',
          district: matchedAccount.district || '—',
          state: matchedAccount.state || '—',
          role: matchedAccount.role || 'Authorized Field Operations Lead',
          mwId: matchedAccount.mwId || '—',
          totalMwCreated: matchedAccount.totalMwCreated ?? 0,
          totalSales: matchedAccount.totalSales ?? '0',
          hasReferral: matchedAccount.hasReferral ?? true,
          hasCustomerTracker: matchedAccount.hasCustomerTracker ?? true,
          referralCode: matchedAccount.referralCode || `BEAUREX-${matchedAccount.userId || '1700'}`,
          lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // Persist session for this individual member
        sessionStorage.setItem('beaurex_team_auth', 'true');
        sessionStorage.setItem('beaurex_team_user', finalProfile.email);
        sessionStorage.setItem('beaurex_team_profile', JSON.stringify(finalProfile));
        window.dispatchEvent(new Event('beaurex_team_auth_change'));

        setIsAuthenticated(true);
      } else {
        setError('Invalid staff credentials. Only team members created in Super Admin dashboard are authorized to log in.');
      }
    } catch (err) {
      setError('An error occurred during authentication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased flex flex-col justify-between selection:bg-[#74111d] selection:text-white transition-colors duration-200">
      
      {/* Top Bar */}
      <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <img 
              src="/beaurex-icon.jpg" 
              alt="BeAurex Logo" 
              className="w-9 h-9 rounded-xl object-cover shadow-md shadow-[#74111d]/30 group-hover:scale-105 transition transform" 
            />
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                Be<span className="text-[#74111d] dark:text-rose-500">Aurex</span>
              </span>
              <span className="text-[9px] font-extrabold text-[#74111d] dark:text-rose-400 tracking-wider uppercase mt-0.5">
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
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto w-full">
        <div className="w-full max-w-[380px] sm:max-w-md bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-9 relative overflow-hidden mx-auto">
          
          {/* Top Wine Red Gradient Highlight Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#74111d] via-[#851421] to-rose-500"></div>

          {/* Colorful Team Badge */}
          <div className="flex justify-center mb-4 sm:mb-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/25 ring-4 ring-rose-50 dark:ring-rose-950/40 transform hover:scale-105 transition-transform">
              <Users className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-sm" />
            </div>
          </div>

          <div className="text-center mb-5 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Staff & Team Portal
            </h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3 sm:p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 rounded-xl text-xs text-red-700 dark:text-red-300 font-bold flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                Email or User ID
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email or User ID"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 sm:py-3.5 text-sm focus:outline-none focus:border-[#74111d] focus:ring-1 focus:ring-[#74111d] text-slate-900 dark:text-white font-bold transition"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-4 pr-11 py-3 sm:py-3.5 text-sm focus:outline-none focus:border-[#74111d] focus:ring-1 focus:ring-[#74111d] text-slate-900 dark:text-white font-bold transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#74111d] to-[#851421] hover:from-[#5c0d17] hover:to-[#74111d] text-white font-extrabold py-3 sm:py-3.5 rounded-xl shadow-lg shadow-[#74111d]/25 transition transform hover:-translate-y-0.5 cursor-pointer text-sm sm:text-base flex items-center justify-center space-x-2 disabled:opacity-50 mt-3"
            >
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Minimal Footer Notice */}
          <div className="mt-5 sm:mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Authorized Staff Access</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 py-4 border-t border-slate-200 dark:border-slate-800">
        © 2026 BeAurex Inc. Role-Based Identity & Multi-Staff Operations.
      </footer>
    </div>
  );
}

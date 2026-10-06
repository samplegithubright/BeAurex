import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BrowserFrame({ children, containerClass = "max-w-5xl md:flex-row md:min-h-[580px]" }) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between selection:bg-red-500 selection:text-white font-sans">
      
      {/* Clean Top Navbar */}
      <header className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5">
          <img 
            src="/beaurex-icon.jpg" 
            alt="BeAurex" 
            className="w-9 h-9 rounded-xl object-cover shadow-sm border border-white/20"
          />
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight leading-none text-white">
              Be<span className="text-red-500">Aurex</span>
            </span>
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider mt-0.5">
              Store Owner Portal
            </span>
          </div>
        </Link>

        <Link
          to="/"
          className="text-xs font-bold text-slate-300 hover:text-white flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Home</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-6 lg:p-8 my-4 sm:my-8">
        <div className={`w-full mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col min-h-0 ${containerClass}`}>
          {children}
        </div>
      </main>

      {/* Clean Production Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-800 bg-slate-950/60">
        © 2026 BeAurex Loyalty Network • Enterprise Store Retention Engine
      </footer>

    </div>
  );
}

import React from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-[#74111d] flex items-center justify-center mx-auto border border-rose-100">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-[#74111d] bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                Application Recovery
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-2">Something went wrong</h2>
              <p className="text-xs text-slate-500 mt-1">
                We encountered an unexpected view error. You can refresh or return to the main portal.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left text-[11px] font-mono text-slate-700 overflow-x-auto max-h-28">
                {this.state.error.toString()}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="bg-[#74111d] hover:bg-[#5e0c15] text-white py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-[#74111d]/20"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Home Page</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

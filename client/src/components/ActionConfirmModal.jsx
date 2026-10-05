import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, Save, ShieldAlert, CheckCircle2, X } from 'lucide-react';

export default function ActionConfirmModal({
  isOpen,
  title = 'Permission Required',
  message = 'Are you sure you want to proceed with this action?',
  confirmText = 'Yes, Proceed',
  cancelText = 'Cancel',
  type = 'warning', // 'danger' | 'warning' | 'primary' | 'success'
  onConfirm,
  onClose
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getTheme = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: 'bg-rose-100 text-rose-600 border-rose-200',
          badgeText: 'Permanent Action',
          badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
          btnBg: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30',
          icon: Trash2
        };
      case 'primary':
      case 'save':
        return {
          iconBg: 'bg-red-100 text-[#8B0000] border-red-200',
          badgeText: 'Save to Database',
          badgeBg: 'bg-red-50 text-red-700 border-red-200',
          btnBg: 'bg-[#8B0000] hover:bg-[#6b0000] text-white shadow-red-950/30',
          icon: Save
        };
      case 'success':
        return {
          iconBg: 'bg-emerald-100 text-emerald-600 border-emerald-200',
          badgeText: 'Verified Action',
          badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30',
          icon: CheckCircle2
        };
      case 'warning':
      default:
        return {
          iconBg: 'bg-amber-100 text-amber-700 border-amber-200',
          badgeText: 'Admin Permission Required',
          badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
          btnBg: 'bg-[#8B0000] hover:bg-[#6b0000] text-white shadow-[#8B0000]/30',
          icon: ShieldAlert
        };
    }
  };

  const theme = getTheme();
  const IconComponent = theme.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-900 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle top ambient glow */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-[#8B0000] to-rose-600" />

          {/* Close button top right */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Strip with Icon */}
          <div className="flex items-start space-x-3.5 mb-4">
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-xs ${theme.iconBg}`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div className="flex-1 pr-6">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${theme.badgeBg}`}>
                {theme.badgeText}
              </span>
              <h3 className="text-base font-black text-slate-900 tracking-tight mt-1">
                {title}
              </h3>
            </div>
          </div>

          {/* Prompt Message Body */}
          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl mb-6 text-xs text-slate-600 font-medium leading-relaxed">
            {message}
          </div>

          {/* Actions Button Bar */}
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition cursor-pointer shadow-md flex items-center space-x-2 ${theme.btnBg}`}
            >
              <span>{confirmText}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

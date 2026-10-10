import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, FileText, X, Check, Award, 
  ExternalLink, ChevronRight 
} from 'lucide-react';

// Fallback BeAurex default policies in case server is unreachable offline
const DEFAULT_POLICIES = {
  privacy: {
    type: 'Privacy Policy',
    title: 'Privacy Policy',
    status: 'Published',
    version: '1.0',
    lastUpdated: 'May 24, 2026',
    publishedBy: 'Super Admin',
    content: `BeAurex Platform Privacy Policy (v1.0)

At BeAurex, we value your privacy and are committed to protecting your personal information and commercial integrity.

1. Information We Collect
We collect necessary information to provide and operate digital loyalty programs:
• Merchant Business Information (Store name, business category, counter address, contact details)
• Customer Profile Data (Name, email address, customer ID, phone number if provided)
• QR & Stamp Activity (Counter scan timestamps, stamps earned, rewards unlocked and redeemed)
• Analytics & Device Telemetry (Browser details, IP address for security & fraud protection)

2. How We Use Your Information
We use information strictly for:
• Operating customer rewards and digital stamp issuance
• Validating customer reward claims at merchant physical counters
• Preventing fraudulent or duplicate scans
• Facilitating peer-to-peer customer referral rewards
• Account security and service announcements

3. Zero Third-Party Selling Guarantee
BeAurex NEVER sells, rents, or shares customer or merchant personal contact information with third-party advertisers, data brokers, or marketing networks.

4. Data Security & Storage
All communication between apps and BeAurex servers is protected using 256-bit TLS/SSL encryption. Data is stored in secure, SOC2-compliant cloud database infrastructure with automated backups and firewall filtering.

5. Your Rights & Data Deletion
Customers and merchants have full control over their account data. You may request account review, data export, or complete account deletion at any time by contacting our privacy compliance desk at support@beaurex.com. Requests are processed within 48 business hours.`
  },
  terms: {
    type: 'Terms & Conditions',
    title: 'Terms & Conditions',
    status: 'Published',
    version: '1.0',
    lastUpdated: 'May 24, 2026',
    publishedBy: 'Super Admin',
    content: `BeAurex Platform Terms & Conditions (v1.0)

Welcome to BeAurex. These Terms and Conditions govern your access to and usage of the BeAurex loyalty platform, merchant dashboard, counter standee QR codes, and customer web experience.

1. Acceptance of Terms
By accessing or using BeAurex, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to all terms, you may not access or use our services.

2. Merchant Obligations & Counter Conduct
• Participating merchants agree to honor validly earned digital stamps and approved reward claims presented by registered customers.
• Merchants must not manipulate scan telemetry or create counterfeit QR displays.
• Counter staff must verify the 6-character Customer ID before confirming reward redemptions.

3. Customer Rewards & Points Policy
• Loyalty stamps and reward vouchers are issued at participating merchant businesses and hold promotional value solely for in-store redemption as described.
• Stamps and points carry no direct legal tender cash value outside designated partner stores.
• Referrals: Customers earning referral bonuses must ensure referred friends are authentic first-time visitors.

4. Platform Availability & Fair Use
• BeAurex strives for 99.9% platform availability. Periodic system maintenance will be communicated in advance.
• Automated bots, GPS spoofing, automated QR scan spamming, and rate-limit circumvention are strictly prohibited and will result in immediate account termination.

5. Subscription & Billing Terms
• Merchants choosing paid subscription plans are billed according to their chosen billing period (Annual / 3-Year / Lifetime).
• Standee acrylic kits are dispatched within 2-3 business days upon account activation.
• Any disputes regarding subscription billing must be raised within 14 calendar days to support@beaurex.com.`
  }
};

export default function LegalPolicyModal({ isOpen, onClose, initialTab = 'privacy' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'privacy' | 'terms'
  const [policies, setPolicies] = useState(() => {
    try {
      const stored = localStorage.getItem('beaurex_legal_policies');
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return DEFAULT_POLICIES;
  });
  const [loading, setLoading] = useState(false);

  // Sync tab when initialTab changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab === 'terms' ? 'terms' : 'privacy');
    }
  }, [initialTab, isOpen]);

  // Fetch latest policies from API whenever modal opens
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchPolicies = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/public/policies');
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && data.policies && isMounted) {
            setPolicies(data.policies);
            try {
              localStorage.setItem('beaurex_legal_policies', JSON.stringify(data.policies));
            } catch (_) {}
          }
        }
      } catch (err) {
        console.warn('Could not fetch live policies, using cached/default:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPolicies();

    // Listen to custom updates dispatched from Super Admin in same window
    const handleUpdate = () => fetchPolicies();
    window.addEventListener('beaurex_policy_updated', handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('beaurex_policy_updated', handleUpdate);
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentDoc = policies[activeTab] || DEFAULT_POLICIES[activeTab];

  // Format content text with clean headings & bullet points
  const renderFormattedContent = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={idx} className="h-3" />;
      }

      // Check if numbered heading like "1. Information We Collect"
      if (/^\d+\.\s+/.test(trimmed)) {
        return (
          <h4 key={idx} className="text-sm font-black text-slate-900 mt-4 mb-1.5 flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B0000] inline-block mr-1"></span>
            <span>{trimmed}</span>
          </h4>
        );
      }

      // Check if bullet point
      if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
        return (
          <div key={idx} className="flex items-start space-x-2 text-xs text-slate-600 leading-relaxed pl-2 my-1">
            <span className="text-[#8B0000] font-bold text-sm leading-none">•</span>
            <span>{trimmed.replace(/^[•\-]\s*/, '')}</span>
          </div>
        );
      }

      // Check if header line like "BeAurex Platform..."
      if (idx === 0 || trimmed.includes('(v1.0)')) {
        return (
          <div key={idx} className="font-bold text-slate-800 text-xs sm:text-sm mb-2 text-[#8B0000]">
            {trimmed}
          </div>
        );
      }

      // Regular paragraph
      return (
        <p key={idx} className="text-xs text-slate-600 leading-relaxed my-1">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 relative my-auto animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#8B0000] to-[#550c14] text-white p-5 sm:p-6 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
              {activeTab === 'privacy' ? (
                <ShieldCheck className="w-6 h-6 text-emerald-300" />
              ) : (
                <FileText className="w-6 h-6 text-amber-300" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
                  BeAurex Official Legal
                </span>
                <span className="text-[10px] font-mono text-rose-200">
                  v{currentDoc.version || '1.0'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
                {activeTab === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
              </h2>
            </div>
          </div>

          {/* Sub-Tabs Switcher */}
          <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-white/15">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
                activeTab === 'privacy'
                  ? 'bg-white text-[#8B0000] shadow-md font-black'
                  : 'bg-white/10 text-white hover:bg-white/15'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Privacy Policy</span>
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
                activeTab === 'terms'
                  ? 'bg-white text-[#8B0000] shadow-md font-black'
                  : 'bg-white/10 text-white hover:bg-white/15'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Terms &amp; Conditions</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-6 sm:p-7 overflow-y-auto flex-1 font-sans space-y-2 selection:bg-rose-100">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-[#8B0000] border-t-transparent rounded-full animate-spin"></div>
              <span>Loading latest verified platform policy...</span>
            </div>
          ) : (
            renderFormattedContent(currentDoc.content)
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 shrink-0 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-[#8B0000] hover:bg-[#550c14] text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

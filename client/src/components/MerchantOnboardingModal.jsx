import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Store, Gift, MapPin, QrCode, CheckCircle2, 
  ArrowRight, ArrowLeft, Printer, Download, Eye, X, ShieldCheck, Check
} from 'lucide-react';
import QRCode from 'qrcode';

export default function MerchantOnboardingModal({ 
  isOpen, 
  onClose, 
  merchant, 
  onComplete 
}) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Step 1: Business Profile State
  const [businessName, setBusinessName] = useState(merchant?.businessName || '');
  const [category, setCategory] = useState(merchant?.category || 'CAFE_RESTAURANT');
  const [tagline, setTagline] = useState(merchant?.tagline || 'Scan & Earn Loyalty Rewards');
  const [brandColor, setBrandColor] = useState(merchant?.brandColor || '#8B0000');
  const [city, setCity] = useState(merchant?.city || 'Delhi NCR');

  // Step 2: First Reward State
  const [rewardTitle, setRewardTitle] = useState('15% OFF On Total Bill');
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState(15);
  const [minBillAmount, setMinBillAmount] = useState(400);
  const [validityDays, setValidityDays] = useState(7);
  const [probabilityWeight, setProbabilityWeight] = useState(70);

  // Step 3: Location / Branch State
  const [branchName, setBranchName] = useState(
    merchant?.branches?.[0]?.branchName || (merchant?.businessName ? `${merchant.businessName} - Main Outlet` : 'Main Outlet')
  );
  const [address, setAddress] = useState(merchant?.branches?.[0]?.address || 'Main Market, Central Street');
  const [pincode, setPincode] = useState(merchant?.branches?.[0]?.pincode || '110001');
  const [counterName, setCounterName] = useState(merchant?.branches?.[0]?.counterName || 'Counter 1');

  // Step 4: Generated QR State
  const [generatedQrDataUrl, setGeneratedQrDataUrl] = useState('');
  const [qrTargetUrl, setQrTargetUrl] = useState('');

  const merchantId = merchant?.id || merchant?._id;
  const qrSlug = (businessName || merchant?.qrSlug || 'beaurex-store')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  useEffect(() => {
    if (merchant) {
      if (merchant.businessName) setBusinessName(merchant.businessName);
      if (merchant.category) setCategory(merchant.category);
      if (merchant.city) setCity(merchant.city);
      if (merchant.tagline) setTagline(merchant.tagline);
      if (merchant.brandColor) setBrandColor(merchant.brandColor);
    }
  }, [merchant]);

  // Generate QR code when on step 4 or when businessName changes
  useEffect(() => {
    const slug = (businessName || 'beaurex-store').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const targetUrl = `${window.location.origin}/scan/${slug || 'store'}`;
    setQrTargetUrl(targetUrl);
    QRCode.toDataURL(targetUrl, {
      width: 400,
      margin: 2,
      color: { dark: '#111827', light: '#ffffff' }
    }).then(url => {
      setGeneratedQrDataUrl(url);
    }).catch(err => {
      console.error('QR generation error:', err);
    });
  }, [step, businessName]);

  if (!isOpen) return null;

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Helper to persist updates locally and inform parent dashboard
  const syncLocalMerchant = (extra = {}) => {
    try {
      if (businessName) {
        sessionStorage.setItem('loyalqr_biz', businessName);
        localStorage.setItem('loyalqr_biz', businessName);
      }
      const raw = localStorage.getItem('loyalqr_merchant') || '{}';
      const m = JSON.parse(raw);
      m.businessName = businessName;
      m.category = category;
      m.city = city;
      m.tagline = tagline;
      m.brandColor = brandColor;
      m.qrSlug = qrSlug;
      localStorage.setItem('loyalqr_merchant', JSON.stringify(m));
      sessionStorage.setItem('loyalqr_merchant', JSON.stringify(m));
    } catch (_) {}

    if (onComplete) {
      onComplete({
        businessName,
        category,
        tagline,
        brandColor,
        city,
        branchName,
        ...extra
      });
    }
  };

  // Handle Step 1 Save (Store Profile)
  const handleSaveProfile = async (e, advance = false) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!businessName.trim()) {
      setError('Please enter your store or business name.');
      return;
    }
    setLoading(true);
    setError('');

    // Instant local save
    syncLocalMerchant();

    try {
      await fetch('/api/merchant/onboarding/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantId,
          businessName: businessName.trim(),
          category,
          tagline,
          brandColor,
          city: city.trim()
        })
      });
    } catch (err) {
      console.warn('API sync warning:', err.message);
    } finally {
      setLoading(false);
      showNotification('✓ Store profile updated successfully!');
      if (advance) setStep(2);
    }
  };

  // Handle Step 2 Save (Reward)
  const handleSaveReward = async (e, advance = false) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!rewardTitle.trim()) {
      setError('Please enter a reward offer title.');
      return;
    }
    setLoading(true);
    setError('');

    syncLocalMerchant({ rewardTitle, discountValue, minBillAmount });

    try {
      await fetch('/api/merchant/onboarding/reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantId,
          title: rewardTitle,
          discountType,
          discountValue: Number(discountValue),
          minBillAmount: Number(minBillAmount),
          validityDays: Number(validityDays),
          probabilityWeight: Number(probabilityWeight)
        })
      });
    } catch (err) {
      console.warn('API sync warning:', err.message);
    } finally {
      setLoading(false);
      showNotification('✓ Reward offer updated successfully!');
      if (advance) setStep(3);
    }
  };

  // Handle Step 3 Save (Location)
  const handleSaveLocation = async (e, advance = false) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!branchName.trim()) {
      setError('Please enter a branch or outlet name.');
      return;
    }
    setLoading(true);
    setError('');

    syncLocalMerchant({ branchName, address, pincode, counterName });

    try {
      await fetch('/api/merchant/onboarding/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantId,
          branchName: branchName.trim(),
          address,
          city,
          pincode,
          counterName
        })
      });
    } catch (err) {
      console.warn('API sync warning:', err.message);
    } finally {
      setLoading(false);
      showNotification('✓ Location and branch updated successfully!');
      if (advance) setStep(4);
    }
  };

  // Handle Final Complete & Close
  const handleFinishOnboarding = async () => {
    setLoading(true);
    syncLocalMerchant();
    try {
      await fetch('/api/merchant/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantId })
      });
    } catch (err) {
      console.warn('API sync warning:', err.message);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handlePrintStandee = () => {
    window.print();
  };

  const handleDownloadQr = () => {
    if (!generatedQrDataUrl) return;
    const a = document.createElement('a');
    a.href = generatedQrDataUrl;
    a.download = `${qrSlug}-qr-standee.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 z-50 overflow-y-auto merchant-portal merchant-root"
      style={{ fontFamily: "'Plus Jakarta Sans', 'Poppins', sans-serif" }}
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        
        {/* Header Bar */}
        <div className="bg-[#8B0000] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-xs font-black text-lg">
              ⚙️
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-black">Store Setup &amp; Configuration</h2>
                <span className="bg-emerald-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  Live
                </span>
              </div>
              <p className="text-xs text-rose-100 font-medium">Update your store details, loyalty rules, and counter standee</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clickable Step / Tab Bar */}
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-3">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            
            {/* Step 1: Profile */}
            <button
              type="button"
              onClick={() => { setError(''); setStep(1); }}
              className={`flex items-center space-x-2 cursor-pointer transition ${step === 1 ? 'text-[#8B0000]' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition ${
                step === 1 ? 'bg-[#8B0000] text-white ring-4 ring-rose-100 shadow-xs' : 'bg-slate-200 text-slate-700'
              }`}>
                1
              </div>
              <span className={`text-xs ${step === 1 ? 'font-black text-[#8B0000]' : 'font-bold hidden sm:inline'}`}>Profile</span>
            </button>
            <div className={`h-0.5 flex-1 mx-2 ${step > 1 ? 'bg-[#8B0000]' : 'bg-slate-200'}`} />

            {/* Step 2: Reward */}
            <button
              type="button"
              onClick={() => { setError(''); setStep(2); }}
              className={`flex items-center space-x-2 cursor-pointer transition ${step === 2 ? 'text-[#8B0000]' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition ${
                step === 2 ? 'bg-[#8B0000] text-white ring-4 ring-rose-100 shadow-xs' : 'bg-slate-200 text-slate-700'
              }`}>
                2
              </div>
              <span className={`text-xs ${step === 2 ? 'font-black text-[#8B0000]' : 'font-bold hidden sm:inline'}`}>Reward</span>
            </button>
            <div className={`h-0.5 flex-1 mx-2 ${step > 2 ? 'bg-[#8B0000]' : 'bg-slate-200'}`} />

            {/* Step 3: Location */}
            <button
              type="button"
              onClick={() => { setError(''); setStep(3); }}
              className={`flex items-center space-x-2 cursor-pointer transition ${step === 3 ? 'text-[#8B0000]' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition ${
                step === 3 ? 'bg-[#8B0000] text-white ring-4 ring-rose-100 shadow-xs' : 'bg-slate-200 text-slate-700'
              }`}>
                3
              </div>
              <span className={`text-xs ${step === 3 ? 'font-black text-[#8B0000]' : 'font-bold hidden sm:inline'}`}>Location</span>
            </button>
            <div className={`h-0.5 flex-1 mx-2 ${step > 3 ? 'bg-[#8B0000]' : 'bg-slate-200'}`} />

            {/* Step 4: Standee QR */}
            <button
              type="button"
              onClick={() => { setError(''); setStep(4); }}
              className={`flex items-center space-x-2 cursor-pointer transition ${step === 4 ? 'text-[#8B0000]' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition ${
                step === 4 ? 'bg-[#8B0000] text-white ring-4 ring-rose-100 shadow-xs' : 'bg-slate-200 text-slate-700'
              }`}>
                4
              </div>
              <span className={`text-xs ${step === 4 ? 'font-black text-[#8B0000]' : 'font-bold hidden sm:inline'}`}>Standee QR</span>
            </button>

          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-in fade-in">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 1: BUSINESS PROFILE */}
          {/* ========================================================= */}
          {step === 1 && (
            <form onSubmit={(e) => handleSaveProfile(e, true)} className="space-y-4">
              <div className="flex items-center space-x-2 text-slate-900 font-black text-base mb-1">
                <Store className="w-5 h-5 text-[#8B0000]" />
                <span>Store &amp; Business Profile</span>
              </div>
              <p className="text-xs text-slate-500 mb-3">Update your store identity displayed to customers upon scanning.</p>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Store / Business Name *</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Royal Sweets & Cafe"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#8B0000]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#8B0000]"
                  >
                    <option value="CAFE_RESTAURANT">Cafe & Restaurant</option>
                    <option value="RETAIL">Retail / Fashion</option>
                    <option value="SALON_SPA">Salon & Spa</option>
                    <option value="GROCERY">Grocery & Mart</option>
                    <option value="HEALTHCARE">Healthcare & Clinic</option>
                    <option value="OTHER">Other Local Store</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">City / Location *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Delhi NCR, Bengaluru, Mumbai"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#8B0000]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Customer Header Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Scan & Win Instant Counter Rewards"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#8B0000]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Brand Theme Color</label>
                <div className="flex items-center space-x-3">
                  {[
                    { label: 'Burgundy Red', hex: '#8B0000' },
                    { label: 'Royal Blue', hex: '#1e3a8a' },
                    { label: 'Emerald Green', hex: '#065f46' },
                    { label: 'Sunset Amber', hex: '#b45309' },
                    { label: 'Midnight Slate', hex: '#0f172a' }
                  ].map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setBrandColor(c.hex)}
                      className={`w-8 h-8 rounded-full border-2 transition cursor-pointer flex items-center justify-center ${
                        brandColor === c.hex ? 'border-slate-900 scale-110 shadow-md' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.label}
                    >
                      {brandColor === c.hex && <span className="text-white text-xs font-black">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={(e) => handleSaveProfile(e, false)}
                  disabled={loading}
                  className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Save Profile Changes</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-[#8B0000] hover:bg-[#720000] text-white font-black px-6 py-2.5 rounded-xl text-xs transition shadow-md shadow-[#8B0000]/20 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>Save &amp; Continue to Reward</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* STEP 2: REWARD CONFIGURATION */}
          {/* ========================================================= */}
          {step === 2 && (
            <form onSubmit={(e) => handleSaveReward(e, true)} className="space-y-4">
              <div className="flex items-center space-x-2 text-slate-900 font-black text-base mb-1">
                <Gift className="w-5 h-5 text-[#8B0000]" />
                <span>Customer Loyalty Reward</span>
              </div>
              <p className="text-xs text-slate-500 mb-3">Configure the reward offer unlocked when customers complete their stamps.</p>

              {/* Quick Presets */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Quick Popular Presets</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { title: '15% OFF On Total Bill', type: 'PERCENTAGE', val: 15, min: 400 },
                    { title: '₹150 Flat Cash Discount', type: 'FLAT_AMOUNT', val: 150, min: 600 },
                    { title: 'Free Signature Item / Coffee', type: 'FREE_ITEM', val: 100, min: 250 }
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setRewardTitle(p.title);
                        setDiscountType(p.type);
                        setDiscountValue(p.val);
                        setMinBillAmount(p.min);
                      }}
                      className={`text-left p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        rewardTitle === p.title ? 'bg-rose-50 border-rose-300 text-[#8B0000]' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="truncate">{p.title}</div>
                      <div className="text-[10px] text-slate-400 font-medium">Min bill ₹{p.min}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Offer Title *</label>
                <input
                  type="text"
                  required
                  value={rewardTitle}
                  onChange={(e) => setRewardTitle(e.target.value)}
                  placeholder="e.g. 15% OFF On Next Dine-In Bill"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#8B0000]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#8B0000]"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT_AMOUNT">Flat Amount (₹)</option>
                    <option value="FREE_ITEM">Free Item Voucher</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Discount Value</label>
                  <input
                    type="number"
                    min="1"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#8B0000]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Min. Bill (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={minBillAmount}
                    onChange={(e) => setMinBillAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#8B0000]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={(e) => handleSaveReward(e, false)}
                  disabled={loading}
                  className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Save Reward Changes</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-[#8B0000] hover:bg-[#720000] text-white font-black px-6 py-2.5 rounded-xl text-xs transition shadow-md shadow-[#8B0000]/20 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>Save &amp; Continue to Location</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* STEP 3: LOCATION / BRANCH */}
          {/* ========================================================= */}
          {step === 3 && (
            <form onSubmit={(e) => handleSaveLocation(e, true)} className="space-y-4">
              <div className="flex items-center space-x-2 text-slate-900 font-black text-base mb-1">
                <MapPin className="w-5 h-5 text-[#8B0000]" />
                <span>Store Location &amp; Outlet</span>
              </div>
              <p className="text-xs text-slate-500 mb-3">Define where your counter standee is situated for customer check-ins.</p>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Branch / Outlet Name *</label>
                <input
                  type="text"
                  required
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="e.g. Connaught Place Main Branch"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#8B0000]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Shop 42, Block B, Inner Circle"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#8B0000]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 110001"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#8B0000]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Counter Identifier</label>
                  <input
                    type="text"
                    value={counterName}
                    onChange={(e) => setCounterName(e.target.value)}
                    placeholder="e.g. Billing Counter 1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#8B0000]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={(e) => handleSaveLocation(e, false)}
                  disabled={loading}
                  className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Save Location Changes</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-[#8B0000] hover:bg-[#720000] text-white font-black px-6 py-2.5 rounded-xl text-xs transition shadow-md shadow-[#8B0000]/20 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>Save &amp; View Standee QR</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* STEP 4: COUNTER STANDEE QR */}
          {/* ========================================================= */}
          {step === 4 && (
            <div className="space-y-5 text-center animate-in fade-in duration-200">
              <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 font-extrabold text-xs px-4 py-1.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Store Ready &amp; Live!</span>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Live Counter QR Standee
              </h3>

              {/* Printable Standee Card Preview */}
              <div 
                className="max-w-xs mx-auto bg-white rounded-3xl p-5 shadow-lg border-2 relative overflow-hidden text-center"
                style={{ borderColor: brandColor || '#8B0000' }}
              >
                <div 
                  className="absolute top-0 inset-x-0 h-2.5"
                  style={{ backgroundColor: brandColor || '#8B0000' }}
                />
                
                <div className="mt-2 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#8B0000]">BeAurex Smart Standee</span>
                  <h4 className="text-base font-black text-slate-900 capitalize truncate mt-0.5">{businessName || 'Your Store'}</h4>
                  <p className="text-[11px] text-slate-500 font-medium truncate">{branchName || 'Main Outlet'}</p>
                </div>

                {/* QR Code Container */}
                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 flex items-center justify-center my-2 shadow-inner">
                  {generatedQrDataUrl ? (
                    <img 
                      src={generatedQrDataUrl} 
                      alt="Store QR Code" 
                      className="w-44 h-44 object-contain"
                    />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center text-xs text-slate-400">
                      Generating QR...
                    </div>
                  )}
                </div>

                <div className="text-[11px] font-black text-slate-900 uppercase tracking-wide">
                  Scan to Collect Loyalty Stamps
                </div>
                <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                  🎁 Reward: {rewardTitle}
                </div>
              </div>

              {/* Action Buttons: Print Standee & Download QR */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handlePrintStandee}
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Standee</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download QR Image</span>
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleFinishOnboarding}
                  className="w-full bg-[#8B0000] hover:bg-[#720000] text-white font-black py-3 rounded-xl text-xs transition shadow-md shadow-[#8B0000]/20 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>Done &amp; Close Store Setup</span>
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

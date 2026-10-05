import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Store, Gift, MapPin, QrCode, CheckCircle2, 
  ArrowRight, ArrowLeft, Printer, Download, Eye, X, ShieldCheck
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

  // Step 1: Business Profile State
  const [businessName, setBusinessName] = useState(merchant?.businessName || '');
  const [category, setCategory] = useState(merchant?.category || 'CAFE_RESTAURANT');
  const [tagline, setTagline] = useState(merchant?.tagline || 'Scan & Earn Loyalty Rewards');
  const [brandColor, setBrandColor] = useState(merchant?.brandColor || '#74111d');
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
  const qrSlug = merchant?.qrSlug || 'beaurex-store';

  useEffect(() => {
    if (merchant) {
      if (merchant.businessName) setBusinessName(merchant.businessName);
      if (merchant.category) setCategory(merchant.category);
      if (merchant.city) setCity(merchant.city);
    }
  }, [merchant]);

  // Generate QR code on step 4
  useEffect(() => {
    if (step === 4) {
      const targetUrl = `${window.location.origin}/scan/${qrSlug}`;
      setQrTargetUrl(targetUrl);
      QRCode.toDataURL(targetUrl, {
        width: 320,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' }
      }).then(url => {
        setGeneratedQrDataUrl(url);
      }).catch(err => {
        console.error('QR generation error:', err);
      });
    }
  }, [step, qrSlug]);

  if (!isOpen) return null;

  // Handle Step 1 Submit
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/merchant/onboarding/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantId,
          businessName,
          category,
          tagline,
          brandColor,
          city
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to save profile');
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 2 Submit
  const handleSaveReward = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/merchant/onboarding/reward', {
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
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to save reward');
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 3 Submit
  const handleSaveLocation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/merchant/onboarding/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantId,
          branchName,
          address,
          city,
          pincode,
          counterName
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to save location');
      setStep(4);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Final Complete
  const handleFinishOnboarding = async () => {
    setLoading(true);
    try {
      await fetch('/api/merchant/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantId })
      });
      if (onComplete) {
        onComplete({
          businessName,
          category,
          tagline,
          brandColor,
          city,
          branchName
        });
      }
      onClose();
    } catch (err) {
      console.error('Error completing onboarding:', err);
      onClose();
    } finally {
      setLoading(false);
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
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#6b0f1a] to-[#851421] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-xs font-black text-lg">
              B
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-black">BeAurex Store Setup</h2>
                <span className="bg-emerald-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  3-Day Free Trial
                </span>
              </div>
              <p className="text-xs text-rose-100 font-medium">Complete setup in 2 minutes to generate your live counter QR</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-3.5">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            
            {/* Step 1 */}
            <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-[#74111d]' : 'text-slate-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                step > 1 ? 'bg-emerald-600 text-white' : step === 1 ? 'bg-[#74111d] text-white ring-4 ring-rose-100' : 'bg-slate-200 text-slate-500'
              }`}>
                {step > 1 ? '✓' : '1'}
              </div>
              <span className="text-xs font-bold hidden sm:inline">Profile</span>
            </div>
            <div className={`h-0.5 flex-1 mx-2 ${step > 1 ? 'bg-emerald-500' : 'bg-slate-200'}`} />

            {/* Step 2 */}
            <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-[#74111d]' : 'text-slate-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                step > 2 ? 'bg-emerald-600 text-white' : step === 2 ? 'bg-[#74111d] text-white ring-4 ring-rose-100' : 'bg-slate-200 text-slate-500'
              }`}>
                {step > 2 ? '✓' : '2'}
              </div>
              <span className="text-xs font-bold hidden sm:inline">Reward</span>
            </div>
            <div className={`h-0.5 flex-1 mx-2 ${step > 2 ? 'bg-emerald-500' : 'bg-slate-200'}`} />

            {/* Step 3 */}
            <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-[#74111d]' : 'text-slate-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                step > 3 ? 'bg-emerald-600 text-white' : step === 3 ? 'bg-[#74111d] text-white ring-4 ring-rose-100' : 'bg-slate-200 text-slate-500'
              }`}>
                {step > 3 ? '✓' : '3'}
              </div>
              <span className="text-xs font-bold hidden sm:inline">Location</span>
            </div>
            <div className={`h-0.5 flex-1 mx-2 ${step > 3 ? 'bg-emerald-500' : 'bg-slate-200'}`} />

            {/* Step 4 */}
            <div className={`flex items-center space-x-2 ${step === 4 ? 'text-[#74111d]' : 'text-slate-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                step === 4 ? 'bg-[#74111d] text-white ring-4 ring-rose-100' : 'bg-slate-200 text-slate-500'
              }`}>
                4
              </div>
              <span className="text-xs font-bold hidden sm:inline">Get QR</span>
            </div>

          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 1: BUSINESS PROFILE */}
          {/* ========================================================= */}
          {step === 1 && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex items-center space-x-2 text-slate-900 font-black text-base mb-1">
                <Store className="w-5 h-5 text-[#851421]" />
                <span>Step 1: Your Business Profile</span>
              </div>
              <p className="text-xs text-slate-500 mb-3">This information appears when customers scan your QR code.</p>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Store / Business Name *</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Royal Sweets & Cafe"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
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
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">City / Hub *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Delhi NCR, Bengaluru, Mumbai"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Brand Theme Color</label>
                <div className="flex items-center space-x-3">
                  {[
                    { label: 'Burgundy Red', hex: '#74111d' },
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

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#74111d] hover:bg-[#5e0c15] text-white font-black px-6 py-3 rounded-xl text-xs transition shadow-md shadow-[#74111d]/25 cursor-pointer flex items-center space-x-2"
                >
                  <span>Continue to Reward Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* STEP 2: REWARD CONFIGURATION */}
          {/* ========================================================= */}
          {step === 2 && (
            <form onSubmit={handleSaveReward} className="space-y-4">
              <div className="flex items-center space-x-2 text-slate-900 font-black text-base mb-1">
                <Gift className="w-5 h-5 text-[#851421]" />
                <span>Step 2: Create Your First Customer Reward</span>
              </div>
              <p className="text-xs text-slate-500 mb-3">Customers unlock this offer when they scan your QR at the counter.</p>

              {/* Quick Presets */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Quick Popular Presets</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { title: '15% OFF On Total Bill', type: 'PERCENTAGE', val: 15, min: 400 },
                    { title: '₹150 Flat Cash Discount', type: 'FLAT_AMOUNT', val: 150, min: 600 },
                    { title: 'Free Signature Item / Drink', type: 'FREE_ITEM', val: 100, min: 250 }
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
                        rewardTitle === p.title ? 'bg-rose-50 border-rose-300 text-[#74111d]' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT_AMOUNT">Flat Cash (₹)</option>
                    <option value="FREE_ITEM">Free Item Voucher</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    {discountType === 'PERCENTAGE' ? 'Discount (%)' : 'Value (₹)'} *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Min. Bill (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={minBillAmount}
                    onChange={(e) => setMinBillAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Voucher Validity (Days)</label>
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={validityDays}
                    onChange={(e) => setValidityDays(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Scratch Win Chance</label>
                  <select
                    value={probabilityWeight}
                    onChange={(e) => setProbabilityWeight(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                  >
                    <option value={70}>70% Chance (High Volume regular reward)</option>
                    <option value={25}>25% Chance (High Value milestone reward)</option>
                    <option value={5}>5% Chance (Jackpot reward)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer flex items-center space-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#74111d] hover:bg-[#5e0c15] text-white font-black px-6 py-3 rounded-xl text-xs transition shadow-md shadow-[#74111d]/25 cursor-pointer flex items-center space-x-2"
                >
                  <span>Save Reward & Set Branch</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* STEP 3: LOCATION / BRANCH */}
          {/* ========================================================= */}
          {step === 3 && (
            <form onSubmit={handleSaveLocation} className="space-y-4">
              <div className="flex items-center space-x-2 text-slate-900 font-black text-base mb-1">
                <MapPin className="w-5 h-5 text-[#851421]" />
                <span>Step 3: Setup Store Location / Branch</span>
              </div>
              <p className="text-xs text-slate-500 mb-3">Define where the physical QR standee will be placed for customer scans.</p>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Branch / Outlet Name *</label>
                <input
                  type="text"
                  required
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="e.g. Connaught Place Main Branch"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Shop 42, Block B, Inner Circle"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Counter / Table Identifier</label>
                  <input
                    type="text"
                    value={counterName}
                    onChange={(e) => setCounterName(e.target.value)}
                    placeholder="e.g. Billing POS Counter 1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-3 text-xs text-[#74111d]">
                <ShieldCheck className="w-5 h-5 text-[#851421] shrink-0" />
                <span className="font-semibold">
                  Each branch gets its own dedicated QR code slug linked to your central BeAurex merchant hub.
                </span>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer flex items-center space-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#74111d] hover:bg-[#5e0c15] text-white font-black px-6 py-3 rounded-xl text-xs transition shadow-md shadow-[#74111d]/25 cursor-pointer flex items-center space-x-2"
                >
                  <span>Generate QR Standee</span>
                  <QrCode className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* STEP 4: SYSTEM GENERATES QR & PRINT/DISPLAY */}
          {/* ========================================================= */}
          {step === 4 && (
            <div className="space-y-6 text-center animate-in fade-in duration-300">
              <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 font-extrabold text-xs px-4 py-1.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Account Configured & QR Generated!</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Your Live Counter Standee Is Ready
              </h3>

              {/* Printable Standee Card Preview */}
              <div 
                className="max-w-xs mx-auto bg-white rounded-3xl p-6 shadow-xl border-2 border-slate-200 relative overflow-hidden text-center"
                style={{ borderColor: brandColor }}
              >
                <div 
                  className="absolute top-0 inset-x-0 h-3"
                  style={{ backgroundColor: brandColor }}
                />
                
                <div className="mt-2 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#851421]">BeAurex Smart Standee</span>
                  <h4 className="text-base font-black text-slate-900 capitalize truncate mt-0.5">{businessName}</h4>
                  <p className="text-[11px] text-slate-500 font-medium truncate">{branchName}</p>
                </div>

                {/* QR Code Container */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-center my-3 shadow-inner">
                  {generatedQrDataUrl ? (
                    <img 
                      src={generatedQrDataUrl} 
                      alt="Store QR Code" 
                      className="w-48 h-48 object-contain"
                    />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400">
                      Generating QR...
                    </div>
                  )}
                </div>

                <div className="text-[11px] font-black text-slate-900 uppercase tracking-wide">
                  Scan With Any Camera Or UPI App
                </div>
                <div className="text-[10px] text-emerald-700 font-bold mt-1">
                  🎁 Win: {rewardTitle}
                </div>
              </div>

              {/* Action Buttons: Print Standee & Launch Dashboard */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrintStandee}
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-5 py-3 rounded-xl text-xs transition cursor-pointer flex items-center justify-center space-x-2 shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print 5x7 Acrylic Standee</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold px-5 py-3 rounded-xl text-xs transition cursor-pointer flex items-center justify-center space-x-2 shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download QR Image</span>
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleFinishOnboarding}
                  className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-black py-3.5 rounded-xl text-sm transition shadow-xl shadow-[#74111d]/25 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>Launch Merchant Dashboard (All 6 Tools)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ActionConfirmModal from '../components/ActionConfirmModal';
import { 
  LayoutDashboard, Share2, Users, Layers, CreditCard, Copy, Check, CheckCircle2, 
  Download, ExternalLink, QrCode, Printer, Search, Phone, Mail, MapPin, Sparkles, 
  Clock, ArrowRight, Lock, Menu, X, TrendingUp, Wallet, Send, FileText, ShieldCheck, 
  Store, Award, Plus, Calendar, AlertCircle, LogOut, User, Building2, Globe, Save,
  History, RotateCcw, MessageSquare, ChevronDown, ChevronUp
} from 'lucide-react';

export default function TeamManagement() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [agentProfileModalOpen, setAgentProfileModalOpen] = useState(false);

  // Global Action Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: 'Permission Required',
    message: '',
    confirmText: 'Yes, Proceed',
    cancelText: 'Cancel',
    type: 'warning',
    onConfirm: () => {}
  });

  const requestConfirm = ({ title, message, confirmText = 'Yes, Proceed', cancelText = 'Cancel', type = 'warning', onConfirm }) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      type,
      onConfirm
    });
  };

  // 5 required tabs: 'dashboard', 'referral_details', 'customer_manager', 'marketing_kit', 'id_card'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Dynamic Agent Profile (Loaded from logged-in session or Super Admin created profile)
  const getInitialAgentProfile = () => {
    try {
      const stored = sessionStorage.getItem('beaurex_team_profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        const codeNum = parsed.userId || parsed.id || '1700';
        return {
          name: parsed.name || 'Team Member',
          id: parsed.id?.startsWith('BX-') ? parsed.id : `BX-TEAM-${codeNum}`,
          role: parsed.roleTitle || parsed.role || 'Authorized Field Operations Lead & Merchant Specialist',
          email: parsed.email || sessionStorage.getItem('beaurex_team_user') || 'team@beaurex.com',
          phone: parsed.mobile || parsed.phone || '+91 98112 23344',
          city: (parsed.district && parsed.state && parsed.district !== '—' && parsed.state !== '—') 
            ? `${parsed.district}, ${parsed.state}` 
            : (parsed.district && parsed.district !== '—' ? parsed.district : (parsed.city || 'Delhi NCR')),
          district: parsed.district || '—',
          state: parsed.state || '—',
          bloodGroup: parsed.bloodGroup || 'O+',
          issueDate: parsed.issueDate || '01 Jan 2026',
          validTill: parsed.validTill || '31 Dec 2027',
          referralCode: parsed.referralCode || `BEAUREX-${codeNum}`,
          userId: parsed.userId || codeNum,
          mwId: parsed.mwId || '—',
          totalMwCreated: parsed.totalMwCreated ?? 0,
          totalSales: parsed.totalSales ?? '0'
        };
      }

      // Check if user email or ID was stored
      const userKey = sessionStorage.getItem('beaurex_team_user');
      if (userKey) {
        let created = [];
        try {
          created = JSON.parse(localStorage.getItem('beaurex_created_teams') || '[]');
        } catch (e) {}
        const matched = created.find(m => 
          m.email?.toLowerCase() === userKey.toLowerCase() || 
          m.userId?.toString() === userKey
        );
        if (matched) {
          const codeNum = matched.userId || '1700';
          return {
            name: matched.name || 'Team Member',
            id: matched.id || `BX-TEAM-${codeNum}`,
            role: matched.role || 'Authorized Field Operations Lead & Merchant Specialist',
            email: matched.email || userKey,
            phone: matched.mobile || '—',
            city: (matched.district && matched.state && matched.district !== '—' && matched.state !== '—')
              ? `${matched.district}, ${matched.state}`
              : (matched.city || 'Delhi NCR'),
            district: matched.district || '—',
            state: matched.state || '—',
            bloodGroup: 'O+',
            issueDate: '01 Jan 2026',
            validTill: '31 Dec 2027',
            referralCode: matched.referralCode || `BEAUREX-${codeNum}`,
            userId: matched.userId || codeNum,
            mwId: matched.mwId || '—',
            totalMwCreated: matched.totalMwCreated ?? 0,
            totalSales: matched.totalSales ?? '0'
          };
        }
      }
    } catch (e) {}

    return {
      name: 'Team Member',
      id: 'BX-TEAM-1700',
      role: 'Authorized Field Operations Lead & Merchant Specialist',
      email: 'team@beaurex.com',
      phone: '+91 98112 23344',
      city: 'Delhi NCR',
      district: 'Delhi',
      state: 'NCR',
      bloodGroup: 'O+',
      issueDate: '01 Jan 2026',
      validTill: '31 Dec 2027',
      referralCode: 'BEAUREX-1700',
      userId: '1700',
      mwId: '—',
      totalMwCreated: 0,
      totalSales: '0'
    };
  };

  const [agentProfile, setAgentProfile] = useState(getInitialAgentProfile);

  // Sync profile immediately if session changes or on auth event
  useEffect(() => {
    const handleSync = () => {
      const updated = getInitialAgentProfile();
      setAgentProfile(updated);
    };

    window.addEventListener('beaurex_team_auth_change', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('beaurex_team_auth_change', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const getInitials = (name) => {
    if (!name) return 'TM';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const agentKey = agentProfile.userId || agentProfile.email || 'default';

  const [copiedCodeToast, setCopiedCodeToast] = useState(false);
  const [copiedLinkToast, setCopiedLinkToast] = useState(false);
  const [copiedScriptToast, setCopiedScriptToast] = useState(false);
  const [downloadToast, setDownloadToast] = useState('');

  // Referral Stores State (Scoped by user ID)
  const [referralSearch, setReferralSearch] = useState('');
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [newStoreForm, setNewStoreForm] = useState({
    storeName: '',
    category: 'Cafe & Dining',
    owner: '',
    phone: '',
    city: '',
    plan: 'Professional Plan',
    commission: '₹1,500',
    status: 'PAID'
  });

  const [referrals, setReferrals] = useState(() => {
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem(`beaurex_team_referrals_${agentKey}`) || '[]');
    } catch (e) {}
    if (saved && saved.length > 0) return saved;

    // Seed if MWdemo (User 1696)
    if (agentKey === '1696' || agentProfile.name === 'MWdemo') {
      return [
        { id: 'ref_714', storeName: 'MW-714 Connaught Cafe', category: 'Cafe & Dining', owner: 'Ramesh Gupta', phone: '98765 43210', city: 'Connaught Place, Delhi', date: '18 Sep 2026', plan: 'Professional Plan', commission: '₹1,500', status: 'PAID' },
        { id: 'ref_711', storeName: 'MW-711 Organic Supermart', category: 'Grocery', owner: 'Anita Rao', phone: '98112 23399', city: 'Indiranagar, Bengaluru', date: '24 Sep 2026', plan: 'Professional Plan', commission: '₹1,500', status: 'PAID' },
        { id: 'ref_710', storeName: 'MW-710 Glamour Spa', category: 'Salon & Wellness', owner: 'Pooja Mehta', phone: '98990 01122', city: 'Bandra West, Mumbai', date: '28 Sep 2026', plan: 'Standard Plan', commission: '₹1,000', status: 'PAID' }
      ];
    }

    // Seed if test JX (User 1648)
    if (agentKey === '1648' || agentProfile.name === 'test JX') {
      return [
        { id: 'ref_679', storeName: 'MW-679 Urban Fitness Hub', category: 'Fitness & Gym', owner: 'Vikram Joshi', phone: '97112 23344', city: 'Koregaon Park, Pune', date: '01 Oct 2026', plan: 'Legacy Pro', commission: '₹2,000', status: 'PAID' }
      ];
    }

    // Seed if Aarav Sharma / demo account
    if (agentKey === '4482' || agentProfile.name === 'Aarav Sharma' || agentProfile.email === 'team@beaurex.com' || agentProfile.email === 'aarav@beaurex.com') {
      return [
        { id: 'ref1', storeName: 'Royal Sweets & Cafe', category: 'Cafe & Dining', owner: 'Ramesh Gupta', phone: '98765 43210', city: 'Connaught Place, Delhi', date: '18 Sep 2026', plan: 'Professional Plan', commission: '₹1,500', status: 'PAID' },
        { id: 'ref2', storeName: 'Gourmet Organic Supermarket', category: 'Grocery', owner: 'Anita Rao', phone: '98112 23399', city: 'Indiranagar, Bengaluru', date: '24 Sep 2026', plan: 'Professional Plan', commission: '₹1,500', status: 'PAID' },
        { id: 'ref3', storeName: 'Glamour Salon & Spa', category: 'Salon & Wellness', owner: 'Pooja Mehta', phone: '98990 01122', city: 'Bandra West, Mumbai', date: '28 Sep 2026', plan: 'Standard Plan', commission: '₹1,000', status: 'PAID' },
        { id: 'ref4', storeName: 'Urban Fitness Studio', category: 'Fitness & Gym', owner: 'Vikram Joshi', phone: '97112 23344', city: 'Koregaon Park, Pune', date: '01 Oct 2026', plan: 'Legacy Pro', commission: '₹2,000', status: 'PROCESSING' },
        { id: 'ref5', storeName: 'Spice Junction Biryani', category: 'Restaurant', owner: 'Kareem Khan', phone: '98445 56611', city: 'Banjara Hills, Hyderabad', date: '02 Oct 2026', plan: 'Standard Plan', commission: '₹1,000', status: 'PROCESSING' },
        { id: 'ref6', storeName: 'Chai Chaska Bar', category: 'Beverages', owner: 'Deepak Verma', phone: '98123 45678', city: 'Cyber Hub, Gurugram', date: '03 Oct 2026', plan: 'Free 2-Day Trial', commission: '₹500', status: 'PENDING' }
      ];
    }

    return [];
  });

  const handleAddStoreReferral = (e) => {
    e.preventDefault();
    if (!newStoreForm.storeName.trim() || !newStoreForm.owner.trim()) return;

    const newStore = {
      id: 'ref_' + Date.now(),
      storeName: newStoreForm.storeName.trim(),
      category: newStoreForm.category,
      owner: newStoreForm.owner.trim(),
      phone: newStoreForm.phone.trim() || '98000 00000',
      city: newStoreForm.city.trim() || agentProfile.city || 'Delhi NCR',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      plan: newStoreForm.plan,
      commission: newStoreForm.commission,
      status: newStoreForm.status
    };

    const updated = [newStore, ...referrals];
    setReferrals(updated);
    try {
      localStorage.setItem(`beaurex_team_referrals_${agentKey}`, JSON.stringify(updated));
    } catch (err) {}

    setShowAddStoreModal(false);
    setNewStoreForm({
      storeName: '',
      category: 'Cafe & Dining',
      owner: '',
      phone: '',
      city: '',
      plan: 'Professional Plan',
      commission: '₹1,500',
      status: 'PAID'
    });
  };

  // Customer Tracker / CRM State (Matching Image 2, 3, 4 - Scoped per user)
  const [crmCustomers, setCrmCustomers] = useState(() => {
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem(`beaurex_team_crm_${agentKey}`) || '[]');
    } catch (e) {}
    if (saved && saved.length > 0) return saved;

    if (agentKey === '4482' || agentProfile.name === 'Aarav Sharma' || agentProfile.email === 'team@beaurex.com' || agentProfile.email === 'aarav@beaurex.com') {
      let fallback = [];
      try {
        fallback = JSON.parse(localStorage.getItem('beaurex_team_crm_customers') || '[]');
      } catch (e) {}
      if (fallback && fallback.length > 0) return fallback;
      return [
        {
          id: 'crm_1',
          name: 'MW Sales Lead',
          approachedFor: 'MW Sales',
          followupMethod: 'Call',
          status: 'Important',
          source: 'Direct',
          email: '—',
          companyName: '—',
          website: '—',
          address: '—',
          lastUpdated: '09-09-2026 13:54',
          phone: '9811223344',
          businessType: 'Retail',
          followups: [
            { id: 'f1', dateTime: '09-09-2026 13:54', method: 'Call', status: 'Important', comments: 'ggn' }
          ]
        },
        {
          id: 'crm_2',
          name: 'Chai Chaska Gurugram',
          approachedFor: 'BeAurex Loyalty',
          followupMethod: 'Visit',
          status: 'Followup required',
          source: 'Walk-in',
          email: 'owner@chaichaska.in',
          companyName: 'Chai Chaska Pvt Ltd',
          website: 'https://chaichaska.in',
          address: 'Cyber Hub, DLF Phase 2, Gurugram',
          lastUpdated: '01-10-2026 11:20',
          phone: '9812345678',
          businessType: 'Cafe & Restaurant',
          followups: [
            { id: 'f2', dateTime: '01-10-2026 11:20', method: 'Visit', status: 'Followup required', comments: 'Interested in acrylic standee, demo scheduled.' }
          ]
        },
        {
          id: 'crm_3',
          name: 'Royal Sweets Counter Lead',
          approachedFor: 'Standee Setup',
          followupMethod: 'Call',
          status: 'Closed Won',
          source: 'Referral',
          email: 'sales@royalsweets.com',
          companyName: 'Royal Sweets & Cafe',
          website: 'https://royalsweets.com',
          address: 'Connaught Place, New Delhi',
          lastUpdated: '03-10-2026 17:40',
          phone: '9876543210',
          businessType: 'Cafe & Restaurant',
          followups: [
            { id: 'f3', dateTime: '03-10-2026 17:40', method: 'Call', status: 'Closed Won', comments: 'Setup completed. Standee dispatched.' }
          ]
        }
      ];
    }

    if (agentKey === '1696' || agentProfile.name === 'MWdemo') {
      return [
        {
          id: 'crm_mw1',
          name: 'Delhi Retail Central',
          approachedFor: 'MW Sales',
          followupMethod: 'Call',
          status: 'Important',
          source: 'Direct',
          email: 'contact@delhiretail.com',
          companyName: 'Delhi Retail Central',
          website: '—',
          address: 'Connaught Place, Delhi',
          lastUpdated: '18-09-2026 14:00',
          phone: '9152115001',
          businessType: 'Retail',
          followups: [
            { id: 'f_mw1', dateTime: '18-09-2026 14:00', method: 'Call', status: 'Important', comments: 'Stores 714, 711 active. Renewal discussed.' }
          ]
        }
      ];
    }

    return [];
  });

  const [customerSearch, setCustomerSearch] = useState('');
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);

  // Business categories & status options with dynamic addition
  const [businessCategories, setBusinessCategories] = useState([
    'Retail', 'Cafe & Restaurant', 'Salon & Spa', 'Grocery', 'Healthcare & Clinic', 'Services & Agency'
  ]);
  const [statusOptions, setStatusOptions] = useState([
    'Followup required', 'Important', 'Hot Lead', 'Interested', 'Closed Won', 'Not Interested'
  ]);
  const [showAddCatInput, setShowAddCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [showAddStatusInput, setShowAddStatusInput] = useState(false);
  const [newStatusName, setNewStatusName] = useState('');

  // Quick Add Customer Form State (Image 3)
  const [quickCustomerForm, setQuickCustomerForm] = useState({
    name: '',
    phone: '',
    businessType: 'Retail',
    approachedFor: 'MW Sales',
    followupMethod: 'Call',
    status: 'Followup required',
    companyName: '',
    website: '',
    address: '',
    email: '',
    source: 'Direct'
  });

  // Followup Modal State (Image 4)
  const [selectedCustomerForFollowup, setSelectedCustomerForFollowup] = useState(null);
  const [followupForm, setFollowupForm] = useState({
    dateTime: '',
    method: 'Call',
    status: 'Followup required',
    comments: ''
  });

  // Sync referrals & CRM customers whenever logged-in agent profile changes
  useEffect(() => {
    const key = agentProfile.userId || agentProfile.email || 'default';
    
    // 1. Sync Referrals
    let savedRefs = [];
    try {
      savedRefs = JSON.parse(localStorage.getItem(`beaurex_team_referrals_${key}`) || '[]');
    } catch (e) {}
    if (savedRefs && savedRefs.length > 0) {
      setReferrals(savedRefs);
    } else if (key === '1696' || agentProfile.name === 'MWdemo') {
      setReferrals([
        { id: 'ref_714', storeName: 'MW-714 Connaught Cafe', category: 'Cafe & Dining', owner: 'Ramesh Gupta', phone: '98765 43210', city: 'Connaught Place, Delhi', date: '18 Sep 2026', plan: 'Professional Plan', commission: '₹1,500', status: 'PAID' },
        { id: 'ref_711', storeName: 'MW-711 Organic Supermart', category: 'Grocery', owner: 'Anita Rao', phone: '98112 23399', city: 'Indiranagar, Bengaluru', date: '24 Sep 2026', plan: 'Professional Plan', commission: '₹1,500', status: 'PAID' },
        { id: 'ref_710', storeName: 'MW-710 Glamour Spa', category: 'Salon & Wellness', owner: 'Pooja Mehta', phone: '98990 01122', city: 'Bandra West, Mumbai', date: '28 Sep 2026', plan: 'Standard Plan', commission: '₹1,000', status: 'PAID' }
      ]);
    } else if (key === '1648' || agentProfile.name === 'test JX') {
      setReferrals([
        { id: 'ref_679', storeName: 'MW-679 Urban Fitness Hub', category: 'Fitness & Gym', owner: 'Vikram Joshi', phone: '97112 23344', city: 'Koregaon Park, Pune', date: '01 Oct 2026', plan: 'Legacy Pro', commission: '₹2,000', status: 'PAID' }
      ]);
    } else if (key === '4482' || agentProfile.name === 'Aarav Sharma') {
      setReferrals([
        { id: 'ref1', storeName: 'Royal Sweets & Cafe', category: 'Cafe & Dining', owner: 'Ramesh Gupta', phone: '98765 43210', city: 'Connaught Place, Delhi', date: '18 Sep 2026', plan: 'Professional Plan', commission: '₹1,500', status: 'PAID' },
        { id: 'ref2', storeName: 'Gourmet Organic Supermarket', category: 'Grocery', owner: 'Anita Rao', phone: '98112 23399', city: 'Indiranagar, Bengaluru', date: '24 Sep 2026', plan: 'Professional Plan', commission: '₹1,500', status: 'PAID' },
        { id: 'ref3', storeName: 'Glamour Salon & Spa', category: 'Salon & Wellness', owner: 'Pooja Mehta', phone: '98990 01122', city: 'Bandra West, Mumbai', date: '28 Sep 2026', plan: 'Standard Plan', commission: '₹1,000', status: 'PAID' },
        { id: 'ref4', storeName: 'Urban Fitness Studio', category: 'Fitness & Gym', owner: 'Vikram Joshi', phone: '97112 23344', city: 'Koregaon Park, Pune', date: '01 Oct 2026', plan: 'Legacy Pro', commission: '₹2,000', status: 'PROCESSING' },
        { id: 'ref5', storeName: 'Spice Junction Biryani', category: 'Restaurant', owner: 'Kareem Khan', phone: '98445 56611', city: 'Banjara Hills, Hyderabad', date: '02 Oct 2026', plan: 'Standard Plan', commission: '₹1,000', status: 'PROCESSING' },
        { id: 'ref6', storeName: 'Chai Chaska Bar', category: 'Beverages', owner: 'Deepak Verma', phone: '98123 45678', city: 'Cyber Hub, Gurugram', date: '03 Oct 2026', plan: 'Free 2-Day Trial', commission: '₹500', status: 'PENDING' }
      ]);
    } else {
      setReferrals([]);
    }

    // 2. Sync CRM Customers
    let savedCrm = [];
    try {
      savedCrm = JSON.parse(localStorage.getItem(`beaurex_team_crm_${key}`) || '[]');
    } catch (e) {}
    if (savedCrm && savedCrm.length > 0) {
      setCrmCustomers(savedCrm);
    } else if (key === '4482' || agentProfile.name === 'Aarav Sharma') {
      setCrmCustomers([
        {
          id: 'crm_1',
          name: 'MW Sales Lead',
          approachedFor: 'MW Sales',
          followupMethod: 'Call',
          status: 'Important',
          source: 'Direct',
          email: '—',
          companyName: '—',
          website: '—',
          address: '—',
          lastUpdated: '09-09-2026 13:54',
          phone: '9811223344',
          businessType: 'Retail',
          followups: [{ id: 'f1', dateTime: '09-09-2026 13:54', method: 'Call', status: 'Important', comments: 'ggn' }]
        },
        {
          id: 'crm_2',
          name: 'Chai Chaska Gurugram',
          approachedFor: 'BeAurex Loyalty',
          followupMethod: 'Visit',
          status: 'Followup required',
          source: 'Walk-in',
          email: 'owner@chaichaska.in',
          companyName: 'Chai Chaska Pvt Ltd',
          website: 'https://chaichaska.in',
          address: 'Cyber Hub, DLF Phase 2, Gurugram',
          lastUpdated: '01-10-2026 11:20',
          phone: '9812345678',
          businessType: 'Cafe & Restaurant',
          followups: [{ id: 'f2', dateTime: '01-10-2026 11:20', method: 'Visit', status: 'Followup required', comments: 'Interested in acrylic standee, demo scheduled.' }]
        },
        {
          id: 'crm_3',
          name: 'Royal Sweets Counter Lead',
          approachedFor: 'Standee Setup',
          followupMethod: 'Call',
          status: 'Closed Won',
          source: 'Referral',
          email: 'sales@royalsweets.com',
          companyName: 'Royal Sweets & Cafe',
          website: 'https://royalsweets.com',
          address: 'Connaught Place, New Delhi',
          lastUpdated: '03-10-2026 17:40',
          phone: '9876543210',
          businessType: 'Cafe & Restaurant',
          followups: [{ id: 'f3', dateTime: '03-10-2026 17:40', method: 'Call', status: 'Closed Won', comments: 'Setup completed. Standee dispatched.' }]
        }
      ]);
    } else if (key === '1696' || agentProfile.name === 'MWdemo') {
      setCrmCustomers([
        {
          id: 'crm_mw1',
          name: 'Delhi Retail Central',
          approachedFor: 'MW Sales',
          followupMethod: 'Call',
          status: 'Important',
          source: 'Direct',
          email: 'contact@delhiretail.com',
          companyName: 'Delhi Retail Central',
          website: '—',
          address: 'Connaught Place, Delhi',
          lastUpdated: '18-09-2026 14:00',
          phone: '9152115001',
          businessType: 'Retail',
          followups: [{ id: 'f_mw1', dateTime: '18-09-2026 14:00', method: 'Call', status: 'Important', comments: 'Stores 714, 711 active. Renewal discussed.' }]
        }
      ]);
    } else {
      setCrmCustomers([]);
    }
  }, [agentProfile.userId, agentProfile.email, agentProfile.name]);

  const referralLink = `${window.location.origin}/?ref=${agentProfile.referralCode}`;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCodeToast(true);
      setTimeout(() => setCopiedCodeToast(false), 3000);
    } else if (type === 'link') {
      setCopiedLinkToast(true);
      setTimeout(() => setCopiedLinkToast(false), 3000);
    } else if (type === 'script') {
      setCopiedScriptToast(true);
      setTimeout(() => setCopiedScriptToast(false), 3000);
    }
  };

  const triggerDownload = (assetName) => {
    setDownloadToast(`Preparing & downloading ${assetName}...`);
    setTimeout(() => {
      setDownloadToast('');
    }, 3500);
  };

  // Handle Save Quick Add Customer (Image 3)
  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    if (!quickCustomerForm.name || !quickCustomerForm.phone) {
      alert("Please enter customer name and phone number.");
      return;
    }

    requestConfirm({
      title: 'Permission Required: Add Merchant Lead',
      message: `Are you sure you want to add "${quickCustomerForm.name}" (+91 ${quickCustomerForm.phone}) to your CRM customer pipeline?`,
      confirmText: 'Yes, Add Lead',
      type: 'primary',
      onConfirm: () => {
        const now = new Date();
        const formattedDate = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const newCustomer = {
          id: 'crm_' + Date.now(),
          name: quickCustomerForm.name,
          phone: quickCustomerForm.phone,
          businessType: quickCustomerForm.businessType,
          approachedFor: quickCustomerForm.approachedFor,
          followupMethod: quickCustomerForm.followupMethod,
          status: quickCustomerForm.status,
          source: quickCustomerForm.source || 'Direct',
          email: quickCustomerForm.email || '—',
          companyName: quickCustomerForm.companyName || '—',
          website: quickCustomerForm.website || '—',
          address: quickCustomerForm.address || '—',
          lastUpdated: formattedDate,
          followups: [
            {
              id: 'f_' + Date.now(),
              dateTime: formattedDate,
              method: quickCustomerForm.followupMethod,
              status: quickCustomerForm.status,
              comments: `Quick Add Customer - Approached for ${quickCustomerForm.approachedFor}`
            }
          ]
        };

        const updated = [newCustomer, ...crmCustomers];
        setCrmCustomers(updated);
        try {
          localStorage.setItem(`beaurex_team_crm_${agentKey}`, JSON.stringify(updated));
          localStorage.setItem('beaurex_team_crm_customers', JSON.stringify(updated));
        } catch (e) {}

        // Send to backend database
        fetch('/api/admin/crm/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(quickCustomerForm)
        }).catch(() => {});

        setShowAddCustomerModal(false);
        setQuickCustomerForm({
          name: '',
          phone: '',
          businessType: 'Retail',
          approachedFor: 'MW Sales',
          followupMethod: 'Call',
          status: 'Followup required',
          companyName: '',
          website: '',
          address: '',
          email: '',
          source: 'Direct'
        });
        setShowAdditionalDetails(false);
      }
    });
  };

  // Open Followup Modal (Image 4)
  const handleOpenFollowup = (customer) => {
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setSelectedCustomerForFollowup(customer);
    setFollowupForm({
      dateTime: formattedDate,
      method: customer.followupMethod || 'Call',
      status: customer.status || 'Followup required',
      comments: ''
    });
  };

  // Handle Save Followup (Image 4)
  const handleSaveFollowup = async (e) => {
    e.preventDefault();
    if (!selectedCustomerForFollowup) return;

    requestConfirm({
      title: 'Permission Required: Log CRM Follow-up',
      message: `Are you sure you want to record this ${followupForm.method} follow-up for "${selectedCustomerForFollowup.name}" with status "${followupForm.status}"?`,
      confirmText: 'Yes, Save Follow-up',
      type: 'primary',
      onConfirm: () => {
        const newFollowup = {
          id: 'f_' + Date.now(),
          dateTime: followupForm.dateTime || new Date().toLocaleString(),
          method: followupForm.method,
          status: followupForm.status,
          comments: followupForm.comments || '—'
        };

        const updatedList = crmCustomers.map(c => {
          if (c.id === selectedCustomerForFollowup.id) {
            return {
              ...c,
              status: followupForm.status,
              followupMethod: followupForm.method,
              lastUpdated: newFollowup.dateTime,
              followups: [newFollowup, ...(c.followups || [])]
            };
          }
          return c;
        });

        setCrmCustomers(updatedList);
        try {
          localStorage.setItem(`beaurex_team_crm_${agentKey}`, JSON.stringify(updatedList));
          localStorage.setItem('beaurex_team_crm_customers', JSON.stringify(updatedList));
        } catch (e) {}

        fetch(`/api/admin/crm/customers/${selectedCustomerForFollowup.id}/followups`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(followupForm)
        }).catch(() => {});

        setSelectedCustomerForFollowup(null);
      }
    });
  };

  const handleLogout = () => {
    requestConfirm({
      title: 'Permission Required: Log Out Agent Session',
      message: 'Are you sure you want to log out of your Team Agent account session?',
      confirmText: 'Yes, Log Out',
      type: 'danger',
      onConfirm: () => {
        sessionStorage.removeItem('beaurex_team_auth');
        sessionStorage.removeItem('beaurex_team_user');
        sessionStorage.removeItem('beaurex_team_profile');
        window.location.reload();
      }
    });
  };

  // 5 exact navigation tabs requested by user
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'referral_details', label: 'Referral Details', icon: Share2, badge: `${referrals.length} Stores` },
    { id: 'customer_manager', label: 'Customer Manager', icon: Users, badge: `${crmCustomers.length} Leads` },
    { id: 'marketing_kit', label: 'Marketing Kit', icon: Layers, badge: '5 Assets' },
    { id: 'id_card', label: 'ID Card', icon: CreditCard, badge: 'Verified' },
  ];

  const filteredReferrals = referrals.filter(r => 
    r.storeName.toLowerCase().includes(referralSearch.toLowerCase()) ||
    r.owner.toLowerCase().includes(referralSearch.toLowerCase()) ||
    r.city.toLowerCase().includes(referralSearch.toLowerCase())
  );

  const filteredCrmCustomers = crmCustomers.filter(c => {
    const term = customerSearch.toLowerCase();
    return (
      (c.name && c.name.toLowerCase().includes(term)) ||
      (c.phone && c.phone.includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      (c.companyName && c.companyName.toLowerCase().includes(term)) ||
      (c.source && c.source.toLowerCase().includes(term)) ||
      (c.approachedFor && c.approachedFor.toLowerCase().includes(term)) ||
      (c.status && c.status.toLowerCase().includes(term)) ||
      (c.businessType && c.businessType.toLowerCase().includes(term))
    );
  });


  return (
    <div className="h-screen w-full bg-slate-50 text-slate-900 font-sans antialiased flex flex-col md:flex-row overflow-hidden selection:bg-red-500 selection:text-white">
        
        {/* Toast Notifications */}
        {copiedCodeToast && (
          <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-200">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Referral Code copied to clipboard!</span>
          </div>
        )}
        {copiedLinkToast && (
          <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-200">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Referral Link copied! Share with merchants.</span>
          </div>
        )}
        {copiedScriptToast && (
          <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-200">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp pitch script copied to clipboard!</span>
          </div>
        )}
        {downloadToast && (
          <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-200">
            <Download className="w-4 h-4 text-rose-400 animate-bounce" />
            <span>{downloadToast}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* MOBILE TOPBAR WITH HAMBURGER (Visible only on < md screens) */}
        {/* ========================================================= */}
        <header className="md:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/beaurex-icon.jpg" 
              alt="BeAurex Logo" 
              className="w-8 h-8 rounded-xl object-cover shadow-xs"
            />
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight leading-none text-slate-900">
                Be<span className="text-[#851421]">Aurex</span>
              </span>
              <span className="text-[9px] font-black text-red-600 uppercase tracking-widest mt-0.5">
                Team Hub
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg">
              {agentProfile.id}
            </span>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
              aria-label="Toggle team navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-red-600" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer Modal */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer Panel */}
            <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200 overflow-y-auto">
              <div>
                {/* Drawer Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <img 
                      src="/beaurex-icon.jpg" 
                      alt="BeAurex Logo" 
                      className="w-8 h-8 rounded-xl object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 text-sm">Team Portal</span>
                      <span className="text-[9px] font-bold text-red-600 uppercase">{agentProfile.name}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 border border-slate-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Status Indicator */}
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-bold text-slate-700 text-[11px]">Authorized Specialist</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 bg-slate-100 font-bold px-1.5 py-0.5 rounded">{agentProfile.id}</span>
                </div>

                {/* Drawer Links: ONLY the 5 requested items */}
                <div className="p-3 space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Navigation
                  </div>
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          isActive
                            ? 'bg-red-600 text-white shadow-md shadow-[#74111d]/25'
                            : 'text-slate-600 hover:bg-rose-50 hover:text-[#74111d]'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-200/90 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#74111d] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {getInitials(agentProfile.name)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900">{agentProfile.name}</span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{agentProfile.email}</span>
                    </div>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Active
                  </span>
                </div>

                <button
                  onClick={() => { setAgentProfileModalOpen(true); setMobileMenuOpen(false); }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 rounded-xl transition flex items-center justify-center space-x-1.5 border border-slate-200 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Agent Profile</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full bg-white hover:bg-rose-50 text-[#74111d] border border-red-200 hover:border-red-300 text-xs font-bold py-2 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* LEFT SIDEBAR NAVIGATION (Desktop: Fixed Position) */}
        {/* ========================================================= */}
        <aside className="hidden md:flex md:w-72 bg-white border-r border-slate-200/90 flex-col justify-between shrink-0 shadow-sm z-30 fixed inset-y-0 left-0 h-screen">
          <div className="flex-1 overflow-y-auto">
            {/* Brand Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-3 group">
                <img 
                  src="/beaurex-icon.jpg" 
                  alt="BeAurex Logo" 
                  className="w-10 h-10 rounded-xl object-cover shadow-md shadow-red-600/30 group-hover:scale-105 transition transform"
                />
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tight leading-none text-slate-900">
                    Be<span className="text-[#851421]">Aurex</span>
                  </span>
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-widest mt-1">
                    Team Portal
                  </span>
                </div>
              </Link>
            </div>

            {/* Status Indicator */}
            <div className="px-6 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-bold text-slate-700 text-[11px]">Field Agent Active</span>
              </div>
              <span className="text-[10px] font-mono text-slate-600 bg-slate-100 font-bold px-1.5 py-0.5 rounded">{agentProfile.id}</span>
            </div>

            {/* Navigation Menu: Exactly the 5 items */}
            <div className="p-4 space-y-1">
              <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
                Menu
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isActive
                        ? 'bg-red-600 text-white shadow-md shadow-[#74111d]/25'
                        : 'text-slate-600 hover:bg-rose-50 hover:text-[#74111d]'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-200/90 bg-slate-50/50 space-y-2 shrink-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-[#74111d] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {getInitials(agentProfile.name)}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900">{agentProfile.name}</span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[130px]">{agentProfile.email}</span>
                </div>
              </div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.5 rounded">
                Active
              </span>
            </div>

            <button
              onClick={() => setAgentProfileModalOpen(true)}
              className="w-full bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold py-2 rounded-xl transition flex items-center justify-center space-x-1.5 border border-slate-200 shadow-xs cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Agent Profile</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-white hover:bg-rose-50 text-[#74111d] border border-red-200 hover:border-red-300 text-xs font-bold py-2 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* MAIN WORKSPACE CONTENT AREA (Only right side scrolls) */}
        {/* ========================================================= */}
        <div className="flex-1 md:ml-72 flex flex-col min-w-0 min-h-0 h-full md:h-screen overflow-y-auto">
          

          {/* Main Content Area */}
          <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
            
            {/* ========================================================= */}
            {/* TAB 1: DASHBOARD */}
            {/* ========================================================= */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                
                {/* Welcome & Quick Share Hero */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-xl">
                      <div className="inline-flex items-center space-x-2 bg-red-600/20 border border-red-500/30 text-red-300 text-[11px] font-bold px-3 py-1 rounded-full">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Field Operations Representative</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                        Welcome back, {agentProfile.name}!
                      </h2>
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                        You have onboarded <span className="font-bold text-white">{referrals.length} retail stores</span> and connected over <span className="font-bold text-white">{crmCustomers.length} customer leads</span> to digital loyalty programs.
                      </p>
                      {agentProfile.mwId && agentProfile.mwId !== '—' && (
                        <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 px-3 py-1 rounded-xl text-xs font-mono text-amber-300">
                          <Store className="w-3.5 h-3.5 text-amber-400" />
                          <span>Linked Store Codes (MW ID): <strong>{agentProfile.mwId}</strong></span>
                        </div>
                      )}
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col space-y-3 shrink-0 sm:min-w-[280px]">
                      <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        My Referral Code
                      </div>
                      <div className="flex items-center justify-between bg-black/30 rounded-xl px-3 py-2 border border-white/10 font-mono text-sm font-bold text-white">
                        <span>{agentProfile.referralCode}</span>
                        <button 
                          onClick={() => copyToClipboard(agentProfile.referralCode, 'code')}
                          className="hover:text-red-400 p-1 cursor-pointer transition"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => copyToClipboard(referralLink, 'link')}
                        className="w-full bg-[#74111d] hover:bg-[#5e0c15] text-white font-bold py-2 rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow-md shadow-red-600/30 cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Copy Referral Link</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4 Stat Cards (Dynamic per Agent) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Referred Stores</span>
                      <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                        <Store className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900">{referrals.length}</div>
                    <div className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      <span>{referrals.length > 0 ? `+${Math.min(referrals.length, 4)} active` : 'Ready to onboard'}</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Tracked Leads</span>
                      <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#74111d] flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900">{crmCustomers.length}</div>
                    <div className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      <span>{crmCustomers.length > 0 ? `${crmCustomers.length} CRM records` : 'Add first lead'}</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Total Commission</span>
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Wallet className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900">
                      ₹{agentProfile.totalSales && agentProfile.totalSales !== '0' ? agentProfile.totalSales : (referrals.length * 1500).toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-amber-600 font-bold mt-1">
                      <span>{referrals.length > 0 ? `₹${Math.floor(referrals.length * 1500 * 0.25).toLocaleString('en-IN')} pending` : '₹0 pending payout'}</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Conversion Rate</span>
                      <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Award className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900">{referrals.length > 0 ? '71.4%' : '0%'}</div>
                    <div className="text-[11px] text-emerald-600 font-bold mt-1">
                      <span>Trial to Paid tier</span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div 
                    onClick={() => setActiveTab('referral_details')}
                    className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-red-300 hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <h3 className="font-black text-slate-900 text-sm mb-1">Referral Details</h3>
                    <p className="text-xs text-slate-500 mb-3">View all 28 stores onboarded through your link and track payouts.</p>
                    <div className="text-xs font-bold text-red-600 flex items-center space-x-1">
                      <span>Open Referrals</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition transform" />
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveTab('marketing_kit')}
                    className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-red-300 hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#74111d] flex items-center justify-center mb-4 group-hover:scale-105 transition">
                      <Layers className="w-5 h-5" />
                    </div>
                    <h3 className="font-black text-slate-900 text-sm mb-1">Field Marketing Kit</h3>
                    <p className="text-xs text-slate-500 mb-3">Download printable 5x7 standees, sales brochures, and WhatsApp scripts.</p>
                    <div className="text-xs font-bold text-[#74111d] flex items-center space-x-1">
                      <span>Get Marketing Assets</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition transform" />
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveTab('id_card')}
                    className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-red-300 hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <h3 className="font-black text-slate-900 text-sm mb-1">Official ID Card</h3>
                    <p className="text-xs text-slate-500 mb-3">Verify your identity on field visits with your official BeAurex digital badge.</p>
                    <div className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                      <span>View My ID Card</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition transform" />
                    </div>
                  </div>
                </div>

                {/* Recent Referred Stores Preview */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900">Recent Merchant Onboardings</h3>
                      <p className="text-xs text-slate-500">Latest retail stores registered through your referral network</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('referral_details')}
                      className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                    >
                      View All
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {referrals.slice(0, 4).map((r) => (
                      <div key={r.id} className="py-3 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">
                            <Store className="w-4 h-4 text-slate-600" />
                          </div>
                          <div>
                            <div className="font-black text-slate-900">{r.storeName}</div>
                            <div className="text-[11px] text-slate-400">{r.category} • {r.city}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-slate-900">{r.commission}</div>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            r.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {r.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 2: REFERRAL DETAILS */}
            {/* ========================================================= */}
            {activeTab === 'referral_details' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                
                {/* Referral Link & Share Card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                  <h3 className="text-base font-black text-slate-900 mb-1">Your Personal Merchant Invitation Link</h3>
                  <p className="text-xs text-slate-500 mb-4">Share this link with store owners to grant them an instant 2-day free trial and earn onboarding commissions.</p>
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-xs text-slate-700 truncate select-all">
                      {referralLink}
                    </div>
                    <button
                      onClick={() => copyToClipboard(referralLink, 'link')}
                      className="bg-[#74111d] hover:bg-[#5e0c15] text-white text-xs font-bold px-5 py-3 rounded-xl transition flex items-center justify-center space-x-2 shadow-sm shadow-red-600/20 cursor-pointer shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy Link</span>
                    </button>
                    <a
                      href={`https://wa.me/?text=Hello!%20Get%20started%20with%20BeAurex%20QR%20Customer%20Loyalty%20for%20your%20store%20with%20a%20Free%202-Day%20Trial:%20${encodeURIComponent(referralLink)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition flex items-center justify-center space-x-2 shadow-sm shadow-emerald-600/20 shrink-0"
                    >
                      <Send className="w-4 h-4" />
                      <span>WhatsApp Share</span>
                    </a>
                  </div>
                </div>

                {/* Commission Structure Banner */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                    <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider">Tier 1 Bonus</span>
                    <div className="text-xl font-black text-emerald-950 mt-1">₹1,000 / Store</div>
                    <p className="text-xs text-emerald-800 mt-1">Paid on successful merchant subscription activation</p>
                  </div>
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5">
                    <span className="text-[10px] font-black uppercase text-[#74111d] tracking-wider">Monthly Recurring</span>
                    <div className="text-xl font-black text-[#5c0d16] mt-1">10% Commission</div>
                    <p className="text-xs text-[#74111d] mt-1">Every month as long as the merchant stays active</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5">
                    <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider">Total Lifetime Paid</span>
                    <div className="text-xl font-black text-purple-950 mt-1">₹21,000</div>
                    <p className="text-xs text-purple-800 mt-1">Directly credited to verified bank account</p>
                  </div>
                </div>

                {/* Filterable Table of Referred Merchants */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-black text-slate-900">Referred Merchant Accounts</h3>
                      <p className="text-xs text-slate-500">Complete register of stores onboarded under your referral ID (<span className="font-mono font-bold text-[#74111d]">{agentProfile.referralCode}</span>)</p>
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <div className="relative flex-1 sm:w-60">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={referralSearch}
                          onChange={(e) => setReferralSearch(e.target.value)}
                          placeholder="Search store, owner or city..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#74111d]"
                        />
                      </div>
                      <button
                        onClick={() => setShowAddStoreModal(true)}
                        className="bg-[#74111d] hover:bg-[#851421] text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center space-x-1.5 shrink-0 shadow-sm cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Onboard Store</span>
                      </button>
                    </div>
                  </div>

                  {filteredReferrals.length === 0 ? (
                    <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <Store className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <h4 className="text-sm font-bold text-slate-700">No Stores Onboarded Yet</h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                        Share your referral link ({referralLink}) with merchants or click Onboard Store to record an onboarded retail shop.
                      </p>
                      <button
                        onClick={() => setShowAddStoreModal(true)}
                        className="bg-[#74111d] hover:bg-[#851421] text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                      >
                        + Onboard Store Now
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[750px] text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                            <th className="py-3 px-4">Store & Owner</th>
                            <th className="py-3 px-4">Location</th>
                            <th className="py-3 px-4">Onboarded</th>
                            <th className="py-3 px-4">Subscription Plan</th>
                            <th className="py-3 px-4 text-center">Commission</th>
                            <th className="py-3 px-4 text-right">Payout Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredReferrals.map((r) => (
                            <tr key={r.id} className="hover:bg-slate-50/70 transition">
                              <td className="py-3.5 px-4">
                                <div className="font-black text-slate-900">{r.storeName}</div>
                                <div className="text-[11px] text-slate-500">{r.owner} • {r.phone}</div>
                              </td>
                              <td className="py-3.5 px-4 text-slate-600">{r.city}</td>
                              <td className="py-3.5 px-4 text-slate-500 font-medium">{r.date}</td>
                              <td className="py-3.5 px-4">
                                <span className="font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg text-[10px]">
                                  {r.plan}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-center font-black text-slate-900">{r.commission}</td>
                              <td className="py-3.5 px-4 text-right">
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                                  r.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 
                                  r.status === 'PROCESSING' ? 'bg-rose-100 text-[#74111d]' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {r.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Modal: Onboard Store Referral */}
                {showAddStoreModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200 my-auto">
                      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#74111d] to-[#851421] text-white flex items-center justify-center shadow-xs">
                            <Store className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-black text-slate-900">Onboard Merchant Store</h3>
                            <p className="text-[11px] text-slate-500">Record merchant under code {agentProfile.referralCode}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowAddStoreModal(false)}
                          className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleAddStoreReferral} className="space-y-3.5 text-xs font-bold">
                        <div>
                          <label className="block text-slate-600 mb-1">Store / Business Name *</label>
                          <input
                            type="text"
                            required
                            value={newStoreForm.storeName}
                            onChange={(e) => setNewStoreForm({ ...newStoreForm, storeName: e.target.value })}
                            placeholder="e.g. Apex Cafe & Bakery"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#74111d]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-600 mb-1">Owner Name *</label>
                            <input
                              type="text"
                              required
                              value={newStoreForm.owner}
                              onChange={(e) => setNewStoreForm({ ...newStoreForm, owner: e.target.value })}
                              placeholder="e.g. Rahul Singh"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#74111d]"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-600 mb-1">Phone Number</label>
                            <input
                              type="tel"
                              value={newStoreForm.phone}
                              onChange={(e) => setNewStoreForm({ ...newStoreForm, phone: e.target.value })}
                              placeholder="98765 43210"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#74111d]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-600 mb-1">Category</label>
                            <select
                              value={newStoreForm.category}
                              onChange={(e) => setNewStoreForm({ ...newStoreForm, category: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#74111d]"
                            >
                              <option>Cafe & Dining</option>
                              <option>Retail Store</option>
                              <option>Grocery</option>
                              <option>Salon & Spa</option>
                              <option>Fitness & Gym</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-slate-600 mb-1">City / Location</label>
                            <input
                              type="text"
                              value={newStoreForm.city}
                              onChange={(e) => setNewStoreForm({ ...newStoreForm, city: e.target.value })}
                              placeholder={agentProfile.city || "Delhi"}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#74111d]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-600 mb-1">Subscription Plan</label>
                            <select
                              value={newStoreForm.plan}
                              onChange={(e) => setNewStoreForm({ ...newStoreForm, plan: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#74111d]"
                            >
                              <option>Professional Plan</option>
                              <option>Standard Plan</option>
                              <option>Legacy Pro</option>
                              <option>Free 2-Day Trial</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-slate-600 mb-1">Commission Amount</label>
                            <input
                              type="text"
                              value={newStoreForm.commission}
                              onChange={(e) => setNewStoreForm({ ...newStoreForm, commission: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#74111d]"
                            />
                          </div>
                        </div>

                        <div className="pt-3 flex justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => setShowAddStoreModal(false)}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-gradient-to-r from-[#74111d] to-[#851421] hover:from-[#5c0d17] hover:to-[#74111d] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-[#74111d]/25 cursor-pointer"
                          >
                            Save Store Referral
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 3: CUSTOMER TRACKER (Matching Image 2, 3, 4) */}
            {/* ========================================================= */}
            {activeTab === 'customer_manager' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                
                {/* Customer Tracker Header Card (Matching Image 2) */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Customer Tracker</h2>
                      <p className="text-xs text-slate-500">Track and manage prospective retail stores, lead channels, and scheduled follow-ups</p>
                    </div>

                    {/* + Add Customer Button (Image 2 - styled in BeAurex crimson red) */}
                    <button
                      onClick={() => setShowAddCustomerModal(true)}
                      className="bg-[#74111d] hover:bg-[#5e0c15] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-md shadow-[#74111d]/25 cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add Customer</span>
                    </button>
                  </div>

                  {/* Search Bar (Image 2) */}
                  <div className="relative w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      placeholder="Search name, phone, email, company, source..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white transition"
                    />
                  </div>
                </div>

                {/* Customer Tracker Table (Matching Image 2 columns) */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px] text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px] font-bold select-none">
                          <th className="py-3 px-4 uppercase">Approached For</th>
                          <th className="py-3 px-4 uppercase">Follow-up Method</th>
                          <th className="py-3 px-4 uppercase text-center">Status</th>
                          <th className="py-3 px-4 uppercase">Source</th>
                          <th className="py-3 px-4 uppercase">Email ID</th>
                          <th className="py-3 px-4 uppercase">Company Name</th>
                          <th className="py-3 px-4 uppercase">Website</th>
                          <th className="py-3 px-4 uppercase">Address</th>
                          <th className="py-3 px-4 uppercase">Last updated</th>
                          <th className="py-3 px-4 uppercase text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredCrmCustomers.length === 0 ? (
                          <tr>
                            <td colSpan={10} className="py-12 text-center text-slate-400">
                              <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                              <p className="font-bold text-xs">No customer leads found matching your search</p>
                              <button
                                onClick={() => setShowAddCustomerModal(true)}
                                className="mt-3 text-red-600 font-bold hover:underline text-xs"
                              >
                                + Add first customer lead
                              </button>
                            </td>
                          </tr>
                        ) : (
                          filteredCrmCustomers.map((c) => (
                            <tr key={c.id} className="hover:bg-slate-50/70 transition">
                              
                              {/* 1. Approached For / Customer Name */}
                              <td className="py-3.5 px-4 font-black text-slate-900">
                                <div>{c.approachedFor || 'MW Sales'}</div>
                                <div className="text-[11px] text-slate-500 font-normal">
                                  {c.name} • <span className="font-mono text-slate-700 font-semibold">{c.phone}</span>
                                </div>
                              </td>

                              {/* 2. Follow-up Method */}
                              <td className="py-3.5 px-4">
                                <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200 text-[10px]">
                                  {c.followupMethod || 'Call'}
                                </span>
                              </td>

                              {/* 3. Status */}
                              <td className="py-3.5 px-4 text-center">
                                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                  c.status === 'Important' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                  c.status === 'Closed Won' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                  c.status === 'Hot Lead' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                                  'bg-rose-100 text-[#74111d] border border-rose-200'
                                }`}>
                                  {c.status || 'Followup required'}
                                </span>
                              </td>

                              {/* 4. Source */}
                              <td className="py-3.5 px-4 text-slate-600 font-semibold">{c.source || 'Direct'}</td>

                              {/* 5. Email ID */}
                              <td className="py-3.5 px-4 text-slate-500">{c.email || '—'}</td>

                              {/* 6. Company Name */}
                              <td className="py-3.5 px-4 text-slate-800 font-bold">{c.companyName || '—'}</td>

                              {/* 7. Website */}
                              <td className="py-3.5 px-4 text-slate-500">
                                {c.website && c.website !== '—' ? (
                                  <a href={c.website} target="_blank" rel="noreferrer" className="text-red-600 hover:underline">
                                    {c.website.replace('https://', '').replace('http://', '')}
                                  </a>
                                ) : '—'}
                              </td>

                              {/* 8. Address */}
                              <td className="py-3.5 px-4 text-slate-500 max-w-[160px] truncate" title={c.address}>
                                {c.address || '—'}
                              </td>

                              {/* 9. Last updated */}
                              <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                                {c.lastUpdated || '09-09-2026 13:54'}
                              </td>

                              {/* 10. Actions: Followup button (Image 4) */}
                              <td className="py-3.5 px-4 text-right">
                                <button
                                  onClick={() => handleOpenFollowup(c)}
                                  className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer inline-flex items-center space-x-1"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>Follow up</span>
                                </button>
                              </td>

                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ========================================================= */}
                {/* MODAL: QUICK ADD CUSTOMER (Matching Image 3) */}
                {/* ========================================================= */}
                {showAddCustomerModal && (
                  <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative space-y-4 animate-in zoom-in-95 duration-150 border border-slate-200">
                      
                      {/* Top Modal Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-sm">
                            <Sparkles className="w-5 h-5 fill-current" />
                          </div>
                          <div>
                            <h3 className="text-lg font-black text-slate-900">Quick Add Customer</h3>
                            <p className="text-xs text-slate-500">Record new prospective retail store lead</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowAddCustomerModal(false)}
                          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveCustomer} className="space-y-4 text-xs font-bold">
                        
                        {/* 1. Customer Name * */}
                        <div>
                          <label className="block text-slate-700 mb-1">Customer Name *</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                              <User className="w-4 h-4" />
                            </span>
                            <input
                              type="text"
                              required
                              value={quickCustomerForm.name}
                              onChange={(e) => setQuickCustomerForm({ ...quickCustomerForm, name: e.target.value })}
                              placeholder="Enter customer name"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white"
                            />
                          </div>
                        </div>

                        {/* 2. Phone Number * */}
                        <div>
                          <label className="block text-slate-700 mb-1">Phone Number *</label>
                          <div className="relative flex">
                            <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-600 text-xs font-bold">
                              <Phone className="w-3.5 h-3.5 mr-1" />
                              +91
                            </span>
                            <input
                              type="tel"
                              required
                              pattern="[0-9]{10}"
                              value={quickCustomerForm.phone}
                              onChange={(e) => setQuickCustomerForm({ ...quickCustomerForm, phone: e.target.value })}
                              placeholder="Enter 10-digit phone number"
                              className="w-full bg-slate-50 border border-slate-200 rounded-r-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white"
                            />
                          </div>
                        </div>

                        {/* 3. Row: Business Type & Approached For */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          
                          {/* Business Type */}
                          <div>
                            <label className="block text-slate-700 mb-1">Business Type</label>
                            <div className="flex items-center space-x-1.5">
                              <select
                                value={quickCustomerForm.businessType}
                                onChange={(e) => setQuickCustomerForm({ ...quickCustomerForm, businessType: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-red-600"
                              >
                                {businessCategories.map((cat, i) => (
                                  <option key={i} value={cat}>{cat}</option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={() => setShowAddCatInput(!showAddCatInput)}
                                className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 cursor-pointer"
                                title="Add New Category"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            {showAddCatInput && (
                              <div className="mt-2 flex items-center space-x-1">
                                <input
                                  type="text"
                                  value={newCatName}
                                  onChange={(e) => setNewCatName(e.target.value)}
                                  placeholder="New category..."
                                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (newCatName.trim()) {
                                      setBusinessCategories([...businessCategories, newCatName.trim()]);
                                      setQuickCustomerForm({ ...quickCustomerForm, businessType: newCatName.trim() });
                                      setNewCatName('');
                                      setShowAddCatInput(false);
                                    }
                                  }}
                                  className="bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold"
                                >
                                  Add
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Approached For */}
                          <div>
                            <label className="block text-slate-700 mb-1">Approached For</label>
                            <select
                              value={quickCustomerForm.approachedFor}
                              onChange={(e) => setQuickCustomerForm({ ...quickCustomerForm, approachedFor: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-red-600"
                            >
                              <option value="MW Sales">MW Sales</option>
                              <option value="BeAurex Loyalty">BeAurex Loyalty</option>
                              <option value="Standee Setup">Standee Setup</option>
                              <option value="Digital Menu QR">Digital Menu QR</option>
                              <option value="Custom Plan">Custom Plan</option>
                            </select>
                          </div>

                        </div>

                        {/* 4. Row: Followed-Up Method & Status */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          
                          {/* Followed-Up Method */}
                          <div>
                            <label className="block text-slate-700 mb-1">Followed-Up Method</label>
                            <select
                              value={quickCustomerForm.followupMethod}
                              onChange={(e) => setQuickCustomerForm({ ...quickCustomerForm, followupMethod: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-red-600"
                            >
                              <option value="Call">Call</option>
                              <option value="Visit">In-Person Visit</option>
                              <option value="WhatsApp">WhatsApp Message</option>
                              <option value="Email">Email</option>
                              <option value="Meeting">Scheduled Meeting</option>
                            </select>
                          </div>

                          {/* Status */}
                          <div>
                            <label className="block text-slate-700 mb-1">Status</label>
                            <div className="flex items-center space-x-1.5">
                              <select
                                value={quickCustomerForm.status}
                                onChange={(e) => setQuickCustomerForm({ ...quickCustomerForm, status: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-red-600"
                              >
                                {statusOptions.map((st, i) => (
                                  <option key={i} value={st}>{st}</option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={() => setShowAddStatusInput(!showAddStatusInput)}
                                className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 cursor-pointer"
                                title="Add New Status"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            {showAddStatusInput && (
                              <div className="mt-2 flex items-center space-x-1">
                                <input
                                  type="text"
                                  value={newStatusName}
                                  onChange={(e) => setNewStatusName(e.target.value)}
                                  placeholder="New status..."
                                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (newStatusName.trim()) {
                                      setStatusOptions([...statusOptions, newStatusName.trim()]);
                                      setQuickCustomerForm({ ...quickCustomerForm, status: newStatusName.trim() });
                                      setNewStatusName('');
                                      setShowAddStatusInput(false);
                                    }
                                  }}
                                  className="bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold"
                                >
                                  Add
                                </button>
                              </div>
                            )}
                          </div>

                        </div>

                        {/* 5. Additional Details (Optional) Expandable Accordion (Image 3) */}
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => setShowAdditionalDetails(!showAdditionalDetails)}
                            className="text-red-600 hover:text-red-700 text-xs font-bold flex items-center space-x-1 cursor-pointer"
                          >
                            <span>+ Additional Details (Optional)</span>
                            {showAdditionalDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          {showAdditionalDetails && (
                            <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 animate-in fade-in duration-100">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-slate-600 text-[11px] mb-1">Company Name</label>
                                  <input
                                    type="text"
                                    value={quickCustomerForm.companyName}
                                    onChange={(e) => setQuickCustomerForm({ ...quickCustomerForm, companyName: e.target.value })}
                                    placeholder="e.g. Royal Sweets & Cafe"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-slate-600 text-[11px] mb-1">Website URL</label>
                                  <input
                                    type="url"
                                    value={quickCustomerForm.website}
                                    onChange={(e) => setQuickCustomerForm({ ...quickCustomerForm, website: e.target.value })}
                                    placeholder="https://example.com"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-slate-600 text-[11px] mb-1">Email ID</label>
                                  <input
                                    type="email"
                                    value={quickCustomerForm.email}
                                    onChange={(e) => setQuickCustomerForm({ ...quickCustomerForm, email: e.target.value })}
                                    placeholder="store@example.com"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-slate-600 text-[11px] mb-1">Lead Source</label>
                                  <select
                                    value={quickCustomerForm.source}
                                    onChange={(e) => setQuickCustomerForm({ ...quickCustomerForm, source: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                                  >
                                    <option value="Direct">Direct</option>
                                    <option value="Referral">Referral</option>
                                    <option value="Walk-in">Walk-in Counter</option>
                                    <option value="Social Media">Social Media</option>
                                  </select>
                                </div>
                              </div>

                              <div>
                                <label className="block text-slate-600 text-[11px] mb-1">Store Address / City</label>
                                <input
                                  type="text"
                                  value={quickCustomerForm.address}
                                  onChange={(e) => setQuickCustomerForm({ ...quickCustomerForm, address: e.target.value })}
                                  placeholder="Full store address"
                                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Modal Footer Buttons */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => setShowAddCustomerModal(false)}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold transition text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-[#74111d] hover:bg-[#5e0c15] text-white font-extrabold px-5 py-2.5 rounded-xl shadow-md shadow-[#74111d]/25 transition text-xs cursor-pointer flex items-center space-x-1.5"
                          >
                            <Save className="w-4 h-4" />
                            <span>Save Customer</span>
                          </button>
                        </div>

                      </form>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* MODAL: ADD FOLLOWUP (Matching Image 4) */}
                {/* ========================================================= */}
                {selectedCustomerForFollowup && (
                  <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative space-y-5 animate-in zoom-in-95 duration-150 border border-slate-200">
                      
                      {/* Top Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-sm">
                            <RotateCcw className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-lg font-black text-slate-900">
                              Add Followup — {selectedCustomerForFollowup.name}
                            </h3>
                            <p className="text-xs text-slate-500">Record scheduled interaction or counter visit progress</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedCustomerForFollowup(null)}
                          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Section 1: + New followup Form */}
                      <form onSubmit={handleSaveFollowup} className="space-y-4 text-xs font-bold">
                        <div className="flex items-center space-x-2 text-slate-900 font-black text-sm">
                          <Plus className="w-4 h-4 text-red-600" />
                          <span>New followup</span>
                        </div>

                        {/* Date & Time + Followup Method */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-700 mb-1">Date & Time *</label>
                            <input
                              type="text"
                              required
                              value={followupForm.dateTime}
                              onChange={(e) => setFollowupForm({ ...followupForm, dateTime: e.target.value })}
                              placeholder="DD-MM-YYYY HH:mm"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-700 mb-1">Followup Method *</label>
                            <select
                              value={followupForm.method}
                              onChange={(e) => setFollowupForm({ ...followupForm, method: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-red-600"
                            >
                              <option value="Call">Call</option>
                              <option value="Visit">In-Person Visit</option>
                              <option value="WhatsApp">WhatsApp</option>
                              <option value="Email">Email</option>
                            </select>
                          </div>
                        </div>

                        {/* Followup Status + Comments */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-700 mb-1">Followup Status *</label>
                            <select
                              value={followupForm.status}
                              onChange={(e) => setFollowupForm({ ...followupForm, status: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-red-600"
                            >
                              <option value="Followup required">Followup required</option>
                              <option value="Important">Important</option>
                              <option value="Hot Lead">Hot Lead</option>
                              <option value="Closed Won">Closed Won</option>
                              <option value="Closed Lost">Closed Lost</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-slate-700 mb-1">Comments</label>
                            <textarea
                              rows={2}
                              value={followupForm.comments}
                              onChange={(e) => setFollowupForm({ ...followupForm, comments: e.target.value })}
                              placeholder="Notes (optional)"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white resize-none"
                            />
                          </div>
                        </div>

                        {/* Section 2: Previous Followups Table (Image 4) */}
                        <div className="pt-2">
                          <div className="flex items-center space-x-2 text-slate-900 font-black text-sm mb-2">
                            <History className="w-4 h-4 text-red-600" />
                            <span>Previous Followups</span>
                          </div>

                          <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-2xs">
                            <table className="w-full min-w-[500px] text-left text-xs border-collapse">
                              <thead>
                                <tr className="bg-red-600 text-white font-bold text-[11px]">
                                  <th className="py-2.5 px-3">Date & Time</th>
                                  <th className="py-2.5 px-3">Method</th>
                                  <th className="py-2.5 px-3">Status</th>
                                  <th className="py-2.5 px-3">Comments</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 bg-white">
                                {(!selectedCustomerForFollowup.followups || selectedCustomerForFollowup.followups.length === 0) ? (
                                  <tr>
                                    <td colSpan={4} className="py-4 text-center text-slate-400 font-normal">
                                      No previous followups recorded yet
                                    </td>
                                  </tr>
                                ) : (
                                  selectedCustomerForFollowup.followups.map((f, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition">
                                      <td className="py-2.5 px-3 font-mono text-slate-700">{f.dateTime}</td>
                                      <td className="py-2.5 px-3 font-semibold text-slate-900">{f.method}</td>
                                      <td className="py-2.5 px-3">
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                          {f.status}
                                        </span>
                                      </td>
                                      <td className="py-2.5 px-3 text-slate-600">{f.comments || '—'}</td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Modal Action Buttons */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => setSelectedCustomerForFollowup(null)}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold transition text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-[#74111d] hover:bg-[#5e0c15] text-white font-extrabold px-5 py-2.5 rounded-xl shadow-md shadow-[#74111d]/25 transition text-xs cursor-pointer flex items-center space-x-1.5"
                          >
                            <Save className="w-4 h-4" />
                            <span>Save Followup</span>
                          </button>
                        </div>

                      </form>
                    </div>
                  </div>
                )}

              </div>
            )}


            {/* ========================================================= */}
            {/* TAB 4: MARKETING KIT */}
            {/* ========================================================= */}
            {activeTab === 'marketing_kit' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                
                {/* Intro Card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-black text-slate-900">BeAurex Field Representative Marketing Kit</h3>
                      <p className="text-xs text-slate-500">Official promotional resources, printable standees, and pitch scripts for onboarding local retailers.</p>
                    </div>
                    <span className="bg-rose-50 text-[#74111d] border border-rose-200 text-xs font-bold px-3 py-1 rounded-full shrink-0">
                      Print Ready Assets
                    </span>
                  </div>
                </div>

                {/* 5 Official Marketing Assets */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Asset 1: 5x7 Acrylic Standee */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black uppercase text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                          High Res Print
                        </span>
                        <span className="text-xs text-slate-400 font-mono">PDF • 300 DPI</span>
                      </div>
                      <h4 className="font-black text-slate-900 text-base mb-1">5x7 Acrylic Counter Standee</h4>
                      <p className="text-xs text-slate-500 mb-4">
                        Standard table standee featuring the "Scan & Win Mystery Reward" callout, QR frame, and 3-step redemption guide.
                      </p>
                    </div>
                    <button
                      onClick={() => triggerDownload('5x7 Acrylic Standee (PDF)')}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Standee PDF (300 DPI)</span>
                    </button>
                  </div>

                  {/* Asset 2: Merchant Pitch Deck */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black uppercase text-[#74111d] bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                          Sales Slide Deck
                        </span>
                        <span className="text-xs text-slate-400 font-mono">12 Slides • PDF</span>
                      </div>
                      <h4 className="font-black text-slate-900 text-base mb-1">Retailer Onboarding Pitch Deck</h4>
                      <p className="text-xs text-slate-500 mb-4">
                        Visually compelling pitch presentation explaining why digital loyalty beats paper punch cards and boosts repeat visits by 42%.
                      </p>
                    </div>
                    <button
                      onClick={() => triggerDownload('Merchant Onboarding Pitch Deck (PDF)')}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Pitch Deck (PDF)</span>
                    </button>
                  </div>

                  {/* Asset 3: WhatsApp Pitch Script */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition md:col-span-2">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          Direct Outreach Script
                        </span>
                        <span className="text-xs text-slate-400 font-mono">Instant Copy</span>
                      </div>
                      <h4 className="font-black text-slate-900 text-base mb-1">WhatsApp Store Owner Outreach Script</h4>
                      <p className="text-xs text-slate-500 mb-3">
                        Pre-tested high-converting message script to send to cafe, restaurant, salon, and grocery store owners.
                      </p>
                      
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-sans text-xs text-slate-700 leading-relaxed mb-4">
                        "Namaste! 🙏 Are you looking to turn walk-in customers into regular weekly visitors for your store? 
                        <br /><br />
                        With <strong>BeAurex QR Loyalty</strong>, your customers scan a table standee to scratch mystery reward coupons on their phone — with zero app download and zero cashier headache.
                        <br /><br />
                        👉 <strong>Claim your 2-Day Free Trial Standee:</strong> {referralLink}
                        <br />
                        Let me know and I will drop by to deliver your acrylic standee tomorrow!"
                      </div>
                    </div>

                    <button
                      onClick={() => copyToClipboard(`Namaste! Are you looking to turn walk-in customers into regular weekly visitors? With BeAurex QR Loyalty, customers scan to win mystery rewards on their phones with zero app download. Claim your Free 2-Day Trial: ${referralLink}`, 'script')}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer shadow-sm shadow-emerald-600/20"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy WhatsApp Pitch Script</span>
                    </button>
                  </div>

                  {/* Asset 4: Table Tent & Window Sticker */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                          Storefront Asset
                        </span>
                        <span className="text-xs text-slate-400 font-mono">PNG • Vector</span>
                      </div>
                      <h4 className="font-black text-slate-900 text-base mb-1">Window & Door "Scan to Win" Stickers</h4>
                      <p className="text-xs text-slate-500 mb-4">
                        Eye-catching round vinyl sticker design for glass entrance doors to attract pedestrians into the store.
                      </p>
                    </div>
                    <button
                      onClick={() => triggerDownload('Storefront Window Stickers (PNG)')}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Sticker Pack</span>
                    </button>
                  </div>

                  {/* Asset 5: ROI Calculator One-Pager */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black uppercase text-purple-600 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
                          Merchant Brochure
                        </span>
                        <span className="text-xs text-slate-400 font-mono">1-Page • PDF</span>
                      </div>
                      <h4 className="font-black text-slate-900 text-base mb-1">Merchant ROI Comparison Sheet</h4>
                      <p className="text-xs text-slate-500 mb-4">
                        Side-by-side cost breakdown comparing paper punch cards vs WhatsApp marketing vs BeAurex automated loyalty.
                      </p>
                    </div>
                    <button
                      onClick={() => triggerDownload('Merchant ROI Comparison Sheet (PDF)')}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download ROI One-Pager</span>
                    </button>
                  </div>

                </div>

              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 5: ID CARD */}
            {/* ========================================================= */}
            {activeTab === 'id_card' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Official Field Representative Identification</h3>
                    <p className="text-xs text-slate-500">Authorized digital credential for in-person retail merchant visits and onboarding</p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => window.print()}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print ID Card</span>
                    </button>
                    <button
                      onClick={() => triggerDownload('Digital ID Card Badge')}
                      className="bg-[#74111d] hover:bg-[#5e0c15] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-sm shadow-red-600/20"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Save Badge</span>
                    </button>
                  </div>
                </div>

                {/* Vertical ID Badge Card Representation */}
                <div className="flex justify-center py-4">
                  <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative">
                    
                    {/* Top Lanyard Slot Graphic */}
                    <div className="h-6 bg-slate-100 flex items-center justify-center border-b border-slate-200">
                      <div className="w-14 h-2 bg-slate-300 rounded-full"></div>
                    </div>

                    {/* Badge Header with Red Gradient */}
                    <div className="bg-gradient-to-br from-red-600 to-rose-700 p-6 text-white text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
                      
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <img 
                          src="/beaurex-icon.jpg" 
                          alt="BeAurex" 
                          className="w-8 h-8 rounded-lg object-cover border border-white/30 shadow-xs"
                        />
                        <span className="text-lg font-black tracking-tight">BeAurex</span>
                      </div>
                      
                      <div className="text-[10px] font-black uppercase tracking-widest text-red-200">
                        Official Field Specialist
                      </div>
                    </div>

                    {/* Agent Avatar & Core Info */}
                    <div className="p-6 text-center space-y-4">
                      
                      {/* Photo Avatar */}
                      <div className="relative inline-block">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-700 text-white text-2xl font-black flex items-center justify-center mx-auto shadow-md border-4 border-white">
                          AS
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full border-2 border-white" title="Active Credential">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Name & Role */}
                      <div>
                        <h2 className="text-xl font-black text-slate-900">{agentProfile.name}</h2>
                        <p className="text-xs font-bold text-red-600 mt-0.5">{agentProfile.role}</p>
                        <p className="text-[11px] text-slate-400 font-mono mt-1">ID: {agentProfile.id}</p>
                      </div>

                      {/* QR Code Verification Frame */}
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-2">
                        <div className="w-28 h-28 bg-white border border-slate-200 rounded-xl p-2 flex items-center justify-center shadow-xs">
                          <QrCode className="w-24 h-24 text-slate-900" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">Scan to Verify Authorization</span>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-2 text-left bg-slate-50 rounded-2xl p-4 border border-slate-100 text-[11px]">
                        <div>
                          <span className="text-slate-400 font-bold block text-[9px] uppercase">Issued Date</span>
                          <span className="font-bold text-slate-800">{agentProfile.issueDate}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold block text-[9px] uppercase">Valid Until</span>
                          <span className="font-bold text-slate-800">{agentProfile.validTill}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold block text-[9px] uppercase">Region / Territory</span>
                          <span className="font-bold text-slate-800">{agentProfile.city}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold block text-[9px] uppercase">Blood Group</span>
                          <span className="font-bold text-slate-800">{agentProfile.bloodGroup}</span>
                        </div>
                      </div>

                      {/* Security Bar */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <div className="flex items-center space-x-1 text-emerald-600 font-bold">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Holograph Protected</span>
                        </div>
                        <span>Helpline: +91 98112 23344</span>
                      </div>

                    </div>

                  </div>
                </div>

              </div>
            )}

          </main>

          {/* Footer */}
          <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400 mt-auto bg-white">
            BeAurex Field Operations & Merchant Development • Authorized Personnel Hub
          </footer>
        </div>

        {/* ========================================================= */}
        {/* AGENT PROFILE MODAL */}
        {/* ========================================================= */}
        {agentProfileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div 
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
              onClick={() => setAgentProfileModalOpen(false)}
            />

            <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 border border-slate-200 my-auto">
              
              {/* Top Bar */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900">
                  Agent Identity & Profile
                </h3>
                <button 
                  onClick={() => setAgentProfileModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Avatar & Header */}
              <div className="p-6 text-center border-b border-slate-100 bg-slate-50/50">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#74111d] to-[#851421] text-white font-black text-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#74111d]/30">
                  {getInitials(agentProfile.name)}
                </div>

                <h4 className="text-xl font-black text-slate-900">
                  {agentProfile.name}
                </h4>
                <p className="text-xs font-bold text-red-600 mt-0.5">
                  {agentProfile.role}
                </p>

                <div className="mt-3 flex items-center justify-center space-x-2">
                  <span className="font-mono bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    {agentProfile.id}
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Verified Specialist</span>
                  </span>
                </div>
              </div>

              {/* Agent Details */}
              <div className="p-5 space-y-3 text-xs border-b border-slate-100">
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500 font-medium">Referral Code</span>
                  <span className="font-mono font-black text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    {agentProfile.referralCode}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500 font-medium">Official Phone</span>
                  <span className="font-bold text-slate-900">{agentProfile.phone}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500 font-medium">Email</span>
                  <span className="font-bold text-slate-900">{agentProfile.email}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500 font-medium">Territory</span>
                  <span className="font-bold text-slate-900">{agentProfile.city}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500 font-medium">ID Validity</span>
                  <span className="font-bold text-slate-900">{agentProfile.validTill}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 bg-slate-50 space-y-2">
                <button
                  onClick={() => { setActiveTab('id_card'); setAgentProfileModalOpen(false); }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>View Official Field ID Card</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-black py-2.5 rounded-xl text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout Agent Account</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Global Action Confirmation Modal */}
        <ActionConfirmModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmText={confirmModal.confirmText}
          cancelText={confirmModal.cancelText}
          type={confirmModal.type}
          onConfirm={confirmModal.onConfirm}
          onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        />

      </div>
  );
}

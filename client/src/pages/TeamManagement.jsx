import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import ActionConfirmModal from '../components/ActionConfirmModal';
import { 
  LayoutDashboard, Share2, Users, Layers, CreditCard, Copy, Check, CheckCircle2, 
  Download, ExternalLink, QrCode, Printer, Search, Phone, Mail, MapPin, Sparkles, 
  Clock, ArrowRight, Lock, Menu, X, TrendingUp, Wallet, Send, FileText, ShieldCheck, 
  Store, Award, Plus, Calendar, AlertCircle, LogOut, User, Building2, Globe, Save,
  History, RotateCcw, MessageSquare, ChevronDown, ChevronUp, Camera, Upload, Trash2,
  Eye, Folder, Video, Play, File, Edit3, Image as ImageIcon, Briefcase, Megaphone, Handshake,
  ArrowLeft, MoreVertical, Film, CheckCircle, Gift
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

  const [agentPhoto, setAgentPhoto] = useState(() => {
    try {
      return localStorage.getItem(`beaurex_team_photo_${agentKey}`) || '';
    } catch (e) {
      return '';
    }
  });

  const photoInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('File size must be less than 3MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result;
        if (base64) {
          setAgentPhoto(base64);
          try {
            localStorage.setItem(`beaurex_team_photo_${agentKey}`, base64);
          } catch (err) {}
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setAgentPhoto('');
    try {
      localStorage.removeItem(`beaurex_team_photo_${agentKey}`);
    } catch (err) {}
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

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

    // Seed if Rajesh Sharma / MWdemo (User 1696)
    if (agentKey === '1696' || agentProfile.name === 'Rajesh Sharma' || agentProfile.name === 'MWdemo') {
      return [
        { id: 'ref_714', storeName: 'MW-714 Connaught Cafe', category: 'Cafe & Dining', owner: 'Ramesh Gupta', phone: '98765 43210', city: 'Connaught Place, Delhi', date: '18 Sep 2026', plan: 'Professional Plan', commission: '₹1,500', status: 'PAID' },
        { id: 'ref_711', storeName: 'MW-711 Organic Supermart', category: 'Grocery', owner: 'Anita Rao', phone: '98112 23399', city: 'Indiranagar, Bengaluru', date: '24 Sep 2026', plan: 'Professional Plan', commission: '₹1,500', status: 'PAID' },
        { id: 'ref_710', storeName: 'MW-710 Glamour Spa', category: 'Salon & Wellness', owner: 'Pooja Mehta', phone: '98990 01122', city: 'Bandra West, Mumbai', date: '28 Sep 2026', plan: 'Standard Plan', commission: '₹1,000', status: 'PAID' }
      ];
    }

    // Seed if Pooja Nair / test JX (User 1648)
    if (agentKey === '1648' || agentProfile.name === 'Pooja Nair' || agentProfile.name === 'test JX') {
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
          name: 'Sales Lead',
          approachedFor: 'BeAurex Loyalty',
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
          approachedFor: 'BeAurex Loyalty',
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
    approachedFor: 'BeAurex Loyalty',
    followupMethod: 'Call',
    status: 'Followup required',
    companyName: '',
    website: '',
    address: '',
    email: '',
    source: 'Direct',
    comments: ''
  });

  // Followup Modal State (Image 4)
  const [selectedCustomerForFollowup, setSelectedCustomerForFollowup] = useState(null);
  const [followupForm, setFollowupForm] = useState({
    dateTime: '',
    method: 'Call',
    status: 'Followup required',
    comments: ''
  });

  // Edit Customer Lead Modal State
  const [editCustomerModal, setEditCustomerModal] = useState({
    isOpen: false,
    customer: null,
    form: {
      name: '',
      phone: '',
      email: '',
      companyName: '',
      businessType: 'Retail',
      approachedFor: 'BeAurex Loyalty',
      followupMethod: 'Call',
      status: 'Followup required',
      source: 'Direct',
      website: '',
      address: '',
      comments: ''
    }
  });

  // =========================================================================
  // REFERRAL DETAILS (IMAGES 2 & 3): REFERRED USERS & BANK ACCOUNT DETAILS
  // =========================================================================
  const [referralSubTab, setReferralSubTab] = useState('referred_users'); // 'referred_users' | 'bank_details'
  
  // Exact 10 Referred Users (Clean Real Data)
  const initialReferredUsers = [
    { id: '1728', mwFrId: 'MW - 737', isMwLink: true, email: 'rohit.verma@gmail.com', userType: 'MW', name: 'Rohit Verma', number: '9876543210', joinedOn: '03-07-2026', dateCreated: '03-07-2026', validityDate: '03-07-2027', mwStatus: 'Active Pro', paymentStatus: 'Paid' },
    { id: '1727', mwFrId: 'FR - 1727', isMwLink: true, email: 'ananya.deshmukh@gmail.com', userType: 'Franchise', name: 'Ananya Deshmukh', number: '9822012345', joinedOn: '03-07-2026', dateCreated: '03-07-2026', validityDate: '03-07-2027', mwStatus: 'Active Pro', paymentStatus: 'Paid' },
    { id: '1590', mwFrId: '605', isMwLink: true, email: 'siddharth.mehta@outlook.com', userType: 'MW', name: 'Siddharth Mehta', number: '9819054321', joinedOn: '26-12-2025', dateCreated: '27-12-2025', validityDate: '27-12-2026', mwStatus: 'Active Standard', paymentStatus: 'Paid' },
    { id: '1589', mwFrId: 'MW - 732', isMwLink: true, email: 'kavita.reddy@gmail.com', userType: 'MW', name: 'Kavita Reddy', number: '9849011223', joinedOn: '26-12-2025', dateCreated: '26-12-2025', validityDate: '26-12-2026', mwStatus: 'Active Pro', paymentStatus: 'Paid' },
    { id: '1587', mwFrId: '601', isMwLink: true, email: 'vikram.singh@gmail.com', userType: 'MW', name: 'Vikram Singh', number: '9810123456', joinedOn: '25-12-2025', dateCreated: '25-12-2025', validityDate: '25-12-2026', mwStatus: 'Active Standard', paymentStatus: 'Paid' },
    { id: '1586', mwFrId: '597', isMwLink: true, email: 'priya.nair@gmail.com', userType: 'MW', name: 'Priya Nair', number: '9848033221', joinedOn: '25-12-2025', dateCreated: '25-12-2025', validityDate: '25-12-2026', mwStatus: 'Active Pro', paymentStatus: 'Paid' },
    { id: '1075', mwFrId: '587', isMwLink: true, email: 'arjun.sharma@yahoo.com', userType: 'MW', name: 'Arjun Sharma', number: '9833045678', joinedOn: '23-12-2025', dateCreated: '23-12-2025', validityDate: '30-12-2026', mwStatus: 'Active Standard', paymentStatus: 'Paid' },
    { id: '1074', mwFrId: '586', isMwLink: true, email: 'ajay.kapoor@gmail.com', userType: 'MW', name: 'Ajay Kapoor', number: '9800321450', joinedOn: '23-12-2025', dateCreated: '23-12-2025', validityDate: '23-12-2026', mwStatus: 'Active Standard', paymentStatus: 'Paid' },
    { id: '1072', mwFrId: '584', isMwLink: true, email: 'manish.joshi@gmail.com', userType: 'MW', name: 'Manish Joshi', number: '9658732140', joinedOn: '23-12-2025', dateCreated: '23-12-2025', validityDate: '23-12-2026', mwStatus: 'Active Pro', paymentStatus: 'Paid' },
    { id: '1068', mwFrId: '581', isMwLink: true, email: 'deepak.verma@gmail.com', userType: 'MW', name: 'Deepak Verma', number: '9654823170', joinedOn: '22-12-2025', dateCreated: '22-12-2025', validityDate: '22-12-2026', mwStatus: 'Active Standard', paymentStatus: 'Paid' }
  ];

  const [referredUsers, setReferredUsers] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('beaurex_team_referred_users') || '[]');
      if (Array.isArray(saved) && saved.length > 0 && !JSON.stringify(saved).includes('yopmail') && !JSON.stringify(saved).includes('thisistest') && !JSON.stringify(saved).includes('akhitest')) {
        return saved;
      }
    } catch (_) {}
    return initialReferredUsers;
  });

  const [selectedMwPreviewModal, setSelectedMwPreviewModal] = useState({ isOpen: false, item: null });

  // Bank Account Details State (Matching Image 3)
  const [bankDetails, setBankDetails] = useState(() => {
    try {
      const saved = localStorage.getItem('beaurex_team_bank_details');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return {
      bankName: 'Kotak Mahindra Bank',
      accountHolderName: 'Ajeet Kumar',
      accountNumber: '921100345671',
      ifscCode: 'KKBK0000154',
      upiId: '22233@upi',
      upiName: 'Ajeet Kumar',
      isSaved: true
    };
  });
  const [bankSavedToast, setBankSavedToast] = useState('');
  const [isEditingBankDetails, setIsEditingBankDetails] = useState(false);
  const [showMaskedAccount, setShowMaskedAccount] = useState(true);

  // =========================================================================
  // MARKETING KIT STATE (IMAGE 4: FOLDERS, METRICS BANNER, MODALS)
  // =========================================================================
  const [kitSubTab, setKitSubTab] = useState('mw_sales_kit'); // 'mw_sales_kit' (14) | 'creator_kit' (9) | 'franchise_sales_kit' (16)
  const [openFolder, setOpenFolder] = useState(null); // null | 'Document' | 'My Kit' or folder object
  const [addFolderModalOpen, setAddFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [addImagesModalOpen, setAddImagesModalOpen] = useState(false);
  const [newImageForm, setNewImageForm] = useState({ name: '', targetFolder: '', size: '2.5 MB', res: '300 DPI High-Res' });
  const [addVideoLinkModalOpen, setAddVideoLinkModalOpen] = useState(false);
  const [newVideoLinkForm, setNewVideoLinkForm] = useState({ name: '', url: '', targetFolder: '' });
  const [uploadVideoModalOpen, setUploadVideoModalOpen] = useState(false);
  const [uploadVideoForm, setUploadVideoForm] = useState({ name: '', size: '25 MB', targetFolder: '' });
  const [addFileModalOpen, setAddFileModalOpen] = useState(false);
  const [newFileForm, setNewFileForm] = useState({ name: '', size: '1.5 MB', ext: 'PDF', targetFolder: '' });
  const [previewKitItem, setPreviewKitItem] = useState(null);
  const [kitToast, setKitToast] = useState('');

  // Marketing Kits Data Structure (Image 4 exact data & categories)
  const [kitsData, setKitsData] = useState(() => {
    try {
      const saved = localStorage.getItem('beaurex_marketing_kits_data');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return {
      mw_sales_kit: {
        title: 'Sales Kit',
        folders: [
          {
            id: 'doc',
            name: 'Document',
            subCount: 0,
            items: [
              { id: 'd1', name: 'Merchant Agreement & Franchise Protocol Guide.pdf', type: 'file', ext: 'PDF', size: '2.4 MB', date: '15 Sep 2026', res: 'Official Document' }
            ]
          },
          {
            id: 'mykit',
            name: 'My Kit',
            subCount: 0,
            items: [
              { id: 'img1', name: '5x7 Table Standee QR Print.png', type: 'image', ext: 'PNG', size: '3.8 MB', date: '18 Sep 2026', res: '300 DPI High-Res' },
              { id: 'img2', name: 'Window & Door Scan To Win Vinyl Sticker.png', type: 'image', ext: 'PNG', size: '1.9 MB', date: '18 Sep 2026', res: 'Round Vinyl' },
              { id: 'img3', name: 'Table Tent Counter Flyer A5.png', type: 'image', ext: 'PNG', size: '2.6 MB', date: '19 Sep 2026', res: 'Print Ready' },
              { id: 'img4', name: 'Instagram Story Promotional Template 1.png', type: 'image', ext: 'PNG', size: '1.2 MB', date: '20 Sep 2026', res: '1080x1920' },
              { id: 'img5', name: 'Instagram Story Promotional Template 2.png', type: 'image', ext: 'PNG', size: '1.4 MB', date: '20 Sep 2026', res: '1080x1920' },
              { id: 'img6', name: 'WhatsApp Offer & Scratch Card Banner.png', type: 'image', ext: 'PNG', size: '890 KB', date: '22 Sep 2026', res: '1200x628' },
              { id: 'img7', name: 'Merchant 20% Cashback Poster.png', type: 'image', ext: 'PNG', size: '2.1 MB', date: '23 Sep 2026', res: 'A4 Print' },
              { id: 'img8', name: 'Customer Mystery Reward Mockup.png', type: 'image', ext: 'PNG', size: '1.7 MB', date: '24 Sep 2026', res: '3D Mockup' },
              { id: 'img9', name: 'Retailer Onboarding Pitch One-Pager.png', type: 'image', ext: 'PNG', size: '1.5 MB', date: '25 Sep 2026', res: 'One-Pager' },
              { id: 'img10', name: 'BeAurex Official Vector Brand Logo Pack.png', type: 'image', ext: 'PNG', size: '4.2 MB', date: '25 Sep 2026', res: 'Vector Asset' },
              { id: 'img11', name: 'Store Cash Counter Decal.png', type: 'image', ext: 'PNG', size: '1.1 MB', date: '26 Sep 2026', res: 'Plexiglass' },
              { id: 'img12', name: 'Festival Mega Rewards Banner Template.png', type: 'image', ext: 'PNG', size: '2.8 MB', date: '27 Sep 2026', res: 'Editable' },
              { id: 'img13', name: 'VIP Customer Loyalty Card Graphic.png', type: 'image', ext: 'PNG', size: '950 KB', date: '28 Sep 2026', res: 'Wallet Card' }
            ]
          }
        ]
      },
      creator_kit: {
        title: 'Creator Kit',
        folders: [
          {
            id: 'creator_gfx',
            name: 'Creator Graphics',
            subCount: 0,
            items: [
              { id: 'cg1', name: 'YouTube Thumbnail Brand Kit.png', type: 'image', ext: 'PNG', size: '2.1 MB', date: '20 Sep 2026', res: '1920x1080' },
              { id: 'cg2', name: 'Reels Hook Overlay Graphics.png', type: 'image', ext: 'PNG', size: '1.5 MB', date: '21 Sep 2026', res: '1080x1920' },
              { id: 'cg3', name: 'BeAurex Sticker Pack for Stories.png', type: 'image', ext: 'PNG', size: '1.8 MB', date: '22 Sep 2026', res: 'Transparent PNG' },
              { id: 'cg4', name: 'Affiliate Commission Badge.png', type: 'image', ext: 'PNG', size: '820 KB', date: '23 Sep 2026', res: 'Vector' },
              { id: 'cg5', name: 'QR Scan Callout Arrow Graphic.png', type: 'image', ext: 'PNG', size: '640 KB', date: '24 Sep 2026', res: 'Vector' },
              { id: 'cg6', name: 'Creator Showcase Banner.png', type: 'image', ext: 'PNG', size: '2.4 MB', date: '25 Sep 2026', res: 'Full HD' },
              { id: 'cg7', name: 'Social Proof Testimonial Card.png', type: 'image', ext: 'PNG', size: '1.1 MB', date: '26 Sep 2026', res: 'Square 1080' },
              { id: 'cg8', name: 'End Screen Call to Action.png', type: 'image', ext: 'PNG', size: '1.3 MB', date: '27 Sep 2026', res: '16:9 HD' }
            ]
          },
          {
            id: 'creator_vid',
            name: 'Video Assets',
            subCount: 0,
            items: [
              { id: 'cv1', name: 'BeAurex 15s Story Animation Intro.mp4', type: 'video', ext: 'MP4', size: '14.2 MB', date: '28 Sep 2026', res: '1080p 60fps' }
            ]
          }
        ]
      },
      franchise_sales_kit: {
        title: 'Franchise Sales Kit',
        folders: [
          {
            id: 'fr_legal',
            name: 'Franchise Legal & Agreements',
            subCount: 0,
            items: [
              { id: 'fl1', name: 'Master Franchise Agreement Template.pdf', type: 'file', ext: 'PDF', size: '3.5 MB', date: '10 Sep 2026', res: 'Document' },
              { id: 'fl2', name: 'Territory Exclusivity Certificate.pdf', type: 'file', ext: 'PDF', size: '1.8 MB', date: '12 Sep 2026', res: 'Document' },
              { id: 'fl3', name: 'Franchise Commission Structure Breakdown.pdf', type: 'file', ext: 'PDF', size: '1.2 MB', date: '15 Sep 2026', res: 'Document' },
              { id: 'fl4', name: 'GST & Compliance Manual 2026.pdf', type: 'file', ext: 'PDF', size: '2.1 MB', date: '18 Sep 2026', res: 'Document' }
            ]
          },
          {
            id: 'fr_pitch',
            name: 'Pitch Decks & Marketing Standees',
            subCount: 0,
            items: [
              { id: 'fp1', name: 'Franchise Investor Pitch Deck 2026.pdf', type: 'file', ext: 'PDF', size: '8.4 MB', date: '20 Sep 2026', res: 'Presentation' },
              { id: 'fp2', name: 'Roll-up Standee 6x3 Feet High Res.png', type: 'image', ext: 'PNG', size: '12.4 MB', date: '21 Sep 2026', res: 'Vector 300 DPI' },
              { id: 'fp3', name: 'Franchise Billboard Outdoor Banner.png', type: 'image', ext: 'PNG', size: '18.1 MB', date: '22 Sep 2026', res: 'Large Format' },
              { id: 'fp4', name: 'Newspaper Print Ad 16x20cm.png', type: 'image', ext: 'PNG', size: '6.2 MB', date: '23 Sep 2026', res: 'CMYK Print' },
              { id: 'fp5', name: 'City Launch Invitation Card.png', type: 'image', ext: 'PNG', size: '2.8 MB', date: '24 Sep 2026', res: 'Gloss Finish' },
              { id: 'fp6', name: 'District Partner ID Template.png', type: 'image', ext: 'PNG', size: '1.4 MB', date: '25 Sep 2026', res: 'Badge' },
              { id: 'fp7', name: 'Partner Welcome Letterhead.png', type: 'image', ext: 'PNG', size: '1.6 MB', date: '26 Sep 2026', res: 'A4' },
              { id: 'fp8', name: 'Franchise Expo Booth Backdrop 10x8ft.png', type: 'image', ext: 'PNG', size: '22.0 MB', date: '27 Sep 2026', res: 'Backdrop' },
              { id: 'fp9', name: 'Merchant Referral QR Table Cards.png', type: 'image', ext: 'PNG', size: '3.1 MB', date: '28 Sep 2026', res: 'Die Cut' },
              { id: 'fp10', name: 'Certificate of Franchise Authorization.png', type: 'image', ext: 'PNG', size: '2.9 MB', date: '29 Sep 2026', res: 'Gold Foil Ready' }
            ]
          },
          {
            id: 'fr_training',
            name: 'Franchise Training Videos',
            subCount: 0,
            items: [
              { id: 'ft1', name: 'How to Onboard 50 Retailers in Month 1.mp4', type: 'video', ext: 'MP4', size: '48.5 MB', date: '01 Oct 2026', res: '1080p Video' },
              { id: 'ft2', name: 'BeAurex CRM Mastery for Franchisees.mp4', type: 'video', ext: 'MP4', size: '62.0 MB', date: '02 Oct 2026', res: '1080p Video' }
            ]
          }
        ]
      }
    };
  });

  const saveKitsData = (newData) => {
    setKitsData(newData);
    try {
      localStorage.setItem('beaurex_marketing_kits_data', JSON.stringify(newData));
      window.dispatchEvent(new Event('storage'));
    } catch (_) {}
  };

  useEffect(() => {
    const handleStorageChange = (e) => {
      if ((!e.key || e.key === 'beaurex_marketing_kits_data')) {
        try {
          const saved = localStorage.getItem('beaurex_marketing_kits_data');
          if (saved) setKitsData(JSON.parse(saved));
        } catch (_) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Dynamic counts for each kit tab
  const salesKitItemCount = (kitsData.mw_sales_kit?.folders || []).reduce((acc, f) => acc + (f.items?.length || 0), 0);
  const creatorKitItemCount = (kitsData.creator_kit?.folders || []).reduce((acc, f) => acc + (f.items?.length || 0), 0);
  const franchiseKitItemCount = (kitsData.franchise_sales_kit?.folders || []).reduce((acc, f) => acc + (f.items?.length || 0), 0);

  // Helper calculations for current sub-tab
  const currentKit = kitsData[kitSubTab] || kitsData.mw_sales_kit;
  const currentFolders = currentKit.folders || [];
  const currentTotalFolders = currentFolders.length;
  let currentImagesCount = 0;
  let currentVideosCount = 0;
  let currentFilesCount = 0;
  let currentActiveItemsCount = 0;

  currentFolders.forEach(f => {
    (f.items || []).forEach(item => {
      currentActiveItemsCount++;
      if (item.type === 'image') currentImagesCount++;
      else if (item.type === 'video') currentVideosCount++;
      else currentFilesCount++;
    });
  });

  const showKitToast = (msg) => {
    setKitToast(msg);
    setTimeout(() => setKitToast(''), 3000);
  };

  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    const updated = { ...kitsData };
    const folderId = 'folder_' + Date.now();
    updated[kitSubTab].folders.push({
      id: folderId,
      name: newFolderName.trim(),
      subCount: 0,
      items: []
    });
    saveKitsData(updated);
    setNewFolderName('');
    setAddFolderModalOpen(false);
    showKitToast(`Folder "${newFolderName.trim()}" created successfully!`);
  };

  const handleAddImage = (e) => {
    e.preventDefault();
    if (!newImageForm.name.trim()) return;
    const updated = { ...kitsData };
    const targetFolderName = newImageForm.targetFolder || (currentFolders[0] ? currentFolders[0].name : 'Default');
    let targetF = updated[kitSubTab].folders.find(f => f.name === targetFolderName);
    if (!targetF) {
      if (updated[kitSubTab].folders.length > 0) {
        targetF = updated[kitSubTab].folders[0];
      } else {
        targetF = { id: 'f_' + Date.now(), name: 'General', subCount: 0, items: [] };
        updated[kitSubTab].folders.push(targetF);
      }
    }
    targetF.items.push({
      id: 'img_' + Date.now(),
      name: newImageForm.name.trim().endsWith('.png') ? newImageForm.name.trim() : `${newImageForm.name.trim()}.png`,
      type: 'image',
      ext: 'PNG',
      size: newImageForm.size || '2.5 MB',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      res: newImageForm.res || '300 DPI High-Res'
    });
    saveKitsData(updated);
    setNewImageForm({ name: '', targetFolder: '', size: '2.5 MB', res: '300 DPI High-Res' });
    setAddImagesModalOpen(false);
    showKitToast('Image added to kit successfully!');
  };

  const handleAddVideoLink = (e) => {
    e.preventDefault();
    if (!newVideoLinkForm.name.trim()) return;
    const updated = { ...kitsData };
    const targetFolderName = newVideoLinkForm.targetFolder || (currentFolders[0] ? currentFolders[0].name : 'Videos');
    let targetF = updated[kitSubTab].folders.find(f => f.name === targetFolderName);
    if (!targetF) {
      if (updated[kitSubTab].folders.length > 0) {
        targetF = updated[kitSubTab].folders[0];
      } else {
        targetF = { id: 'f_' + Date.now(), name: 'Videos', subCount: 0, items: [] };
        updated[kitSubTab].folders.push(targetF);
      }
    }
    targetF.items.push({
      id: 'vid_' + Date.now(),
      name: newVideoLinkForm.name.trim(),
      type: 'video',
      ext: 'LINK',
      size: 'Web Stream',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      res: 'Online Video Link',
      url: newVideoLinkForm.url
    });
    saveKitsData(updated);
    setNewVideoLinkForm({ name: '', url: '', targetFolder: '' });
    setAddVideoLinkModalOpen(false);
    showKitToast('Video link added to kit successfully!');
  };

  const handleUploadVideo = (e) => {
    e.preventDefault();
    if (!uploadVideoForm.name.trim()) return;
    const updated = { ...kitsData };
    const targetFolderName = uploadVideoForm.targetFolder || (currentFolders[0] ? currentFolders[0].name : 'Videos');
    let targetF = updated[kitSubTab].folders.find(f => f.name === targetFolderName);
    if (!targetF) {
      if (updated[kitSubTab].folders.length > 0) {
        targetF = updated[kitSubTab].folders[0];
      } else {
        targetF = { id: 'f_' + Date.now(), name: 'Videos', subCount: 0, items: [] };
        updated[kitSubTab].folders.push(targetF);
      }
    }
    targetF.items.push({
      id: 'vid_' + Date.now(),
      name: uploadVideoForm.name.trim().endsWith('.mp4') ? uploadVideoForm.name.trim() : `${uploadVideoForm.name.trim()}.mp4`,
      type: 'video',
      ext: 'MP4',
      size: uploadVideoForm.size || '32 MB',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      res: '1080p HD'
    });
    saveKitsData(updated);
    setUploadVideoForm({ name: '', size: '25 MB', targetFolder: '' });
    setUploadVideoModalOpen(false);
    showKitToast('Video asset uploaded successfully!');
  };

  const handleAddFile = (e) => {
    e.preventDefault();
    if (!newFileForm.name.trim()) return;
    const updated = { ...kitsData };
    const targetFolderName = newFileForm.targetFolder || (currentFolders[0] ? currentFolders[0].name : 'Documents');
    let targetF = updated[kitSubTab].folders.find(f => f.name === targetFolderName);
    if (!targetF) {
      if (updated[kitSubTab].folders.length > 0) {
        targetF = updated[kitSubTab].folders[0];
      } else {
        targetF = { id: 'f_' + Date.now(), name: 'Documents', subCount: 0, items: [] };
        updated[kitSubTab].folders.push(targetF);
      }
    }
    const ext = newFileForm.ext || 'PDF';
    targetF.items.push({
      id: 'file_' + Date.now(),
      name: newFileForm.name.trim().endsWith(`.${ext.toLowerCase()}`) ? newFileForm.name.trim() : `${newFileForm.name.trim()}.${ext.toLowerCase()}`,
      type: 'file',
      ext: ext,
      size: newFileForm.size || '1.8 MB',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      res: 'Resource Document'
    });
    saveKitsData(updated);
    setNewFileForm({ name: '', size: '1.5 MB', ext: 'PDF', targetFolder: '' });
    setAddFileModalOpen(false);
    showKitToast('File resource added to kit successfully!');
  };

  const handleDeleteKitItem = (folderName, itemId) => {
    requestConfirm({
      title: 'Delete Asset',
      message: 'Are you sure you want to remove this asset from the marketing kit?',
      confirmText: 'Yes, Delete',
      type: 'danger',
      onConfirm: () => {
        const updated = { ...kitsData };
        const f = updated[kitSubTab].folders.find(folder => folder.name === folderName);
        if (f) {
          f.items = f.items.filter(item => item.id !== itemId);
          saveKitsData(updated);
          showKitToast('Asset removed from folder.');
        }
      }
    });
  };

  // Delete Referred User with confirmation modal
  const handleDeleteReferredUser = (userId) => {
    const target = referredUsers.find(u => u.id === userId);
    requestConfirm({
      title: 'Permission Required: Delete Referred User',
      message: `Are you sure you want to delete referred user "${target?.name || userId}"?`,
      confirmText: 'Yes, Delete',
      type: 'danger',
      onConfirm: () => {
        const updated = referredUsers.filter(u => u.id !== userId);
        setReferredUsers(updated);
        try {
          localStorage.setItem('beaurex_team_referred_users', JSON.stringify(updated));
        } catch (e) {}
      }
    });
  };

  // Delete CRM Customer Lead with confirmation modal
  const handleDeleteCrmCustomer = (customerId) => {
    const target = crmCustomers.find(c => c.id === customerId);
    requestConfirm({
      title: 'Permission Required: Delete Customer Lead',
      message: `Are you sure you want to delete CRM lead "${target?.name || 'Customer'}"?`,
      confirmText: 'Yes, Delete',
      type: 'danger',
      onConfirm: () => {
        const updatedList = crmCustomers.filter(c => c.id !== customerId);
        setCrmCustomers(updatedList);
        try {
          localStorage.setItem(`beaurex_team_crm_${agentKey}`, JSON.stringify(updatedList));
          localStorage.setItem('beaurex_team_crm_customers', JSON.stringify(updatedList));
        } catch (e) {}
        fetch(`/api/admin/crm/customers/${customerId}`, { method: 'DELETE' }).catch(() => {});
      }
    });
  };

  // Delete Store Referral with confirmation modal
  const handleDeleteStoreReferral = (referralId) => {
    const target = referrals.find(r => r.id === referralId);
    requestConfirm({
      title: 'Permission Required: Delete Store Referral',
      message: `Are you sure you want to remove referred store "${target?.storeName || 'Store'}"?`,
      confirmText: 'Yes, Delete',
      type: 'danger',
      onConfirm: () => {
        const updated = referrals.filter(r => r.id !== referralId);
        setReferrals(updated);
        try {
          localStorage.setItem(`beaurex_team_referrals_${agentKey}`, JSON.stringify(updated));
        } catch (e) {}
      }
    });
  };

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
    } else if (key === '1696' || agentProfile.name === 'Rajesh Sharma' || agentProfile.name === 'MWdemo') {
      setReferrals([
        { id: 'ref_714', storeName: 'MW-714 Connaught Cafe', category: 'Cafe & Dining', owner: 'Ramesh Gupta', phone: '98765 43210', city: 'Connaught Place, Delhi', date: '18 Sep 2026', plan: 'Professional Plan', commission: '₹1,500', status: 'PAID' },
        { id: 'ref_711', storeName: 'MW-711 Organic Supermart', category: 'Grocery', owner: 'Anita Rao', phone: '98112 23399', city: 'Indiranagar, Bengaluru', date: '24 Sep 2026', plan: 'Professional Plan', commission: '₹1,500', status: 'PAID' },
        { id: 'ref_710', storeName: 'MW-710 Glamour Spa', category: 'Salon & Wellness', owner: 'Pooja Mehta', phone: '98990 01122', city: 'Bandra West, Mumbai', date: '28 Sep 2026', plan: 'Standard Plan', commission: '₹1,000', status: 'PAID' }
      ]);
    } else if (key === '1648' || agentProfile.name === 'Pooja Nair' || agentProfile.name === 'test JX') {
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
          name: 'Sales Lead',
          approachedFor: 'BeAurex Loyalty',
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
          followups: [{ id: 'f1', dateTime: '09-09-2026 13:54', method: 'Call', status: 'Important', comments: 'Store setup inquiry.' }]
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
    } else if (key === '1696' || agentProfile.name === 'Rajesh Sharma' || agentProfile.name === 'MWdemo') {
      setCrmCustomers([
        {
          id: 'crm_mw1',
          name: 'Delhi Retail Central',
          approachedFor: 'BeAurex Loyalty',
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
    } else if (key === '1648' || agentProfile.name === 'Pooja Nair' || agentProfile.name === 'test JX') {
      setCrmCustomers([
        {
          id: 'crm_jx1',
          name: 'Urban Fitness Pune',
          approachedFor: 'Gym Standee Setup',
          followupMethod: 'Visit',
          status: 'Closed Won',
          source: 'Direct',
          email: 'vikram@urbanfitness.in',
          companyName: 'Urban Fitness Hub',
          website: '—',
          address: 'Koregaon Park, Pune',
          lastUpdated: '01-10-2026 16:30',
          phone: '9711223344',
          businessType: 'Fitness & Gym',
          followups: [{ id: 'f_jx1', dateTime: '01-10-2026 16:30', method: 'Visit', status: 'Closed Won', comments: 'Setup finished and membership cards delivered.' }]
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
          ],
          comments: quickCustomerForm.comments || ''
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
          approachedFor: 'BeAurex Loyalty',
          followupMethod: 'Call',
          status: 'Followup required',
          companyName: '',
          website: '',
          address: '',
          email: '',
          source: 'Direct',
          comments: ''
        });
        setShowAdditionalDetails(false);
      }
    });
  };

  const handleOpenEditCustomer = (customer) => {
    setEditCustomerModal({
      isOpen: true,
      customer,
      form: {
        name: customer.name || '',
        phone: customer.phone || '',
        email: customer.email && customer.email !== '—' ? customer.email : '',
        companyName: customer.companyName && customer.companyName !== '—' ? customer.companyName : '',
        businessType: customer.businessType || 'Retail',
        approachedFor: customer.approachedFor || 'BeAurex Loyalty',
        followupMethod: customer.followupMethod || 'Call',
        status: customer.status || 'Followup required',
        source: customer.source || 'Direct',
        website: customer.website && customer.website !== '—' ? customer.website : '',
        address: customer.address && customer.address !== '—' ? customer.address : '',
        comments: customer.comments || ''
      }
    });
  };

  const handleSaveEditCustomer = (e) => {
    e.preventDefault();
    if (!editCustomerModal.customer) return;
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const agentKey = agentProfile.userId || agentProfile.email || 'default';
    const form = editCustomerModal.form;

    const updatedList = crmCustomers.map(c => {
      if (c.id === editCustomerModal.customer.id) {
        return {
          ...c,
          name: form.name.trim() || c.name,
          phone: form.phone.trim() || c.phone,
          email: form.email.trim() || '—',
          companyName: form.companyName.trim() || '—',
          businessType: form.businessType || c.businessType,
          approachedFor: form.approachedFor || c.approachedFor,
          followupMethod: form.followupMethod || c.followupMethod,
          status: form.status || c.status,
          source: form.source || c.source,
          website: form.website.trim() || '—',
          address: form.address.trim() || '—',
          comments: form.comments.trim() || c.comments || '',
          lastUpdated: formattedDate
        };
      }
      return c;
    });

    setCrmCustomers(updatedList);
    try {
      localStorage.setItem(`beaurex_team_crm_${agentKey}`, JSON.stringify(updatedList));
      localStorage.setItem('beaurex_team_crm_customers', JSON.stringify(updatedList));
    } catch (e) {}

    setEditCustomerModal({
      isOpen: false,
      customer: null,
      form: {
        name: '',
        phone: '',
        email: '',
        companyName: '',
        businessType: 'Retail',
        approachedFor: 'BeAurex Loyalty',
        followupMethod: 'Call',
        status: 'Followup required',
        source: 'Direct',
        website: '',
        address: '',
        comments: ''
      }
    });
  };

  const handleSaveBankDetails = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!bankDetails.bankName?.trim()) {
      setBankSavedToast('Please enter your Bank Name');
      return;
    }
    if (!bankDetails.accountNumber?.trim()) {
      setBankSavedToast('Please enter your Bank Account Number');
      return;
    }
    if (!bankDetails.ifscCode?.trim()) {
      setBankSavedToast('Please enter your Bank IFSC Code');
      return;
    }
    const updated = { ...bankDetails, isSaved: true };
    setBankDetails(updated);
    try {
      localStorage.setItem('beaurex_team_bank_details', JSON.stringify(updated));
    } catch (_) {}
    setIsEditingBankDetails(false);
    setBankSavedToast('Bank details saved successfully! All future referral payouts will be transferred to this account.');
    setTimeout(() => setBankSavedToast(''), 5000);
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
        {/* LEFT SIDEBAR NAVIGATION (Desktop: Colored Crimson Theme)  */}
        {/* ========================================================= */}
        <aside className="hidden md:flex md:w-72 bg-[#8B0000] text-white flex-col justify-between shrink-0 shadow-lg z-30 fixed inset-y-0 left-0 h-screen">
          <div className="flex-1 overflow-y-auto">
            {/* Brand Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md p-1.5 shrink-0 group-hover:scale-105 transition transform">
                  <QrCode className="w-6 h-6 text-[#8B0000]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tight leading-none text-white">
                    BeAurex
                  </span>
                  <span className="text-[10px] font-bold text-red-200 uppercase tracking-widest mt-1">
                    Team Portal
                  </span>
                </div>
              </Link>
            </div>

            {/* Navigation Menu: Exactly the 5 items */}
            <div className="p-4 space-y-1.5">
              <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-red-200/60">
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
                        ? 'bg-black/30 text-white shadow-inner font-black border border-white/15'
                        : 'text-white/85 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-red-200'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/25 text-white' : 'bg-black/20 text-red-100 border border-white/10'
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
          <div className="p-4 border-t border-white/10 bg-black/20 space-y-2.5 shrink-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-white text-[#8B0000] font-black text-xs flex items-center justify-center shadow-xs">
                  {getInitials(agentProfile.name)}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">{agentProfile.name}</span>
                  <span className="text-[10px] text-red-200 truncate max-w-[130px]">{agentProfile.email}</span>
                </div>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-1.5 py-0.5 rounded">
                Active
              </span>
            </div>

            <button
              onClick={() => setAgentProfileModalOpen(true)}
              className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 rounded-xl transition flex items-center justify-center space-x-1.5 border border-white/15 shadow-xs cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Agent Profile</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-white hover:bg-rose-50 text-[#8B0000] text-xs font-black py-2 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>

            <div className="pt-1 border-t border-white/10 text-[10px] text-red-200/70 text-center">
              © 2026 BeAurex. Team Hub.
            </div>
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
                
                {/* Referral Code (Image 1: Only show referral code as given) */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 rounded-2xl p-4 sm:p-5 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center shadow-md shadow-red-500/25 shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-[11px] font-black text-slate-300 uppercase tracking-wider block">
                        My Referral Code
                      </span>
                      <span className="text-xs text-slate-400 font-bold">
                        Partner Referral Identifier
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-black/40 rounded-xl px-4 py-2 border border-white/10 font-mono text-sm sm:text-base font-black text-white space-x-4 w-full sm:w-auto shadow-inner">
                    <span>{agentProfile.referralCode}</span>
                    <button 
                      onClick={() => copyToClipboard(agentProfile.referralCode, 'code')}
                      className="hover:text-red-400 text-slate-300 p-1 cursor-pointer transition"
                      title="Copy Referral Code"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 4 Stat Cards (Dynamic per Agent with Landing Page Style Icons - Image 2) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md transition group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-500 text-[11px] font-black uppercase tracking-wider">Referred Stores</span>
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center shadow-md shadow-red-500/25 group-hover:scale-105 transition-transform">
                        <Store className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900">{referrals.length}</div>
                    <div className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      <span>{referrals.length > 0 ? `+${Math.min(referrals.length, 4)} active` : 'Ready to onboard'}</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md transition group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-500 text-[11px] font-black uppercase tracking-wider">Tracked Leads</span>
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900">{crmCustomers.length}</div>
                    <div className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      <span>{crmCustomers.length > 0 ? `${crmCustomers.length} CRM records` : 'Add first lead'}</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md transition group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-500 text-[11px] font-black uppercase tracking-wider">Total Commission</span>
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform">
                        <Wallet className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900">
                      ₹{agentProfile.totalSales && agentProfile.totalSales !== '0' ? agentProfile.totalSales : (referrals.length * 1500).toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-amber-600 font-bold mt-1">
                      <span>{referrals.length > 0 ? `₹${Math.floor(referrals.length * 1500 * 0.25).toLocaleString('en-IN')} pending` : '₹0 pending payout'}</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md transition group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-500 text-[11px] font-black uppercase tracking-wider">Conversion Rate</span>
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 text-white flex items-center justify-center shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform">
                        <Award className="w-5 h-5 text-white" />
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

              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 2: REFERRAL DETAILS */}
            {/* ========================================================= */}
            {activeTab === 'referral_details' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                
                {/* Referral Sub-Navigation Bar (Matching Images 2 & 3) */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setReferralSubTab('referred_users')}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center space-x-2 ${
                        referralSubTab === 'referred_users'
                          ? 'bg-[#74111d] text-white shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span>Referred Users ({referredUsers.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReferralSubTab('bank_details')}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center space-x-2 ${
                        referralSubTab === 'bank_details'
                          ? 'bg-[#74111d] text-white shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Bank Account Details</span>
                    </button>
                  </div>

                  {/* Personal Invitation Link Quick Copy */}
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-bold text-slate-400 hidden lg:inline">Your Invite Link:</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(referralLink, 'link')}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] font-bold px-3 py-1.5 rounded-xl border border-slate-300 flex items-center space-x-1.5 transition cursor-pointer"
                      title="Copy referral link"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{agentProfile.referralCode}</span>
                    </button>
                    <a
                      href={`https://wa.me/?text=Hello!%20Get%20started%20with%20BeAurex%20QR%20Customer%20Loyalty%20for%20your%20store%20with%20a%20Free%202-Day%20Trial:%20${encodeURIComponent(referralLink)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center space-x-1 shadow-xs cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </a>
                  </div>
                </div>

                {/* ========================================================= */}
                {/* VIEW 1: REFERRED USERS (Matching Image 2) */}
                {/* ========================================================= */}
                {referralSubTab === 'referred_users' && (
                  <div className="space-y-6">
                    {/* Top Stat Cards (Landing Page Style Gradient Icons & Page-Relevant Metrics) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Stat Card 1: Total Sales */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition group flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center font-black shadow-md shadow-red-500/25 shrink-0 group-hover:scale-105 transition-transform">
                          <Store className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-600">Total Sales</p>
                          <h3 className="text-2xl font-black text-slate-900 mt-0.5">0</h3>
                        </div>
                      </div>

                      {/* Stat Card 2: Total Referred Users (Replaced Total MW Created) */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition group flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/25 shrink-0 group-hover:scale-105 transition-transform">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-600">Total Referred Users</p>
                          <h3 className="text-2xl font-black text-slate-900 mt-0.5">{referredUsers.length}</h3>
                        </div>
                      </div>
                    </div>

                    {/* Table Card (SuperAdmin Merchants Design System) */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50">
                        <div>
                          <h3 className="text-lg font-black text-slate-900 tracking-tight">Referred Users</h3>
                          <p className="text-xs text-slate-500 font-bold mt-0.5">Live registry of accounts onboarded under your referral footprint</p>
                        </div>

                        <div className="flex items-center space-x-2 w-full sm:w-auto">
                          <div className="relative flex-1 sm:w-64">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                            <input
                              type="text"
                              value={referralSearch}
                              onChange={(e) => setReferralSearch(e.target.value)}
                              placeholder="Search user ID, email, name, phone..."
                              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 shadow-2xs font-bold"
                            />
                          </div>
                          <button
                            onClick={() => setShowAddStoreModal(true)}
                            className="bg-[#74111d] hover:bg-[#851421] text-white text-xs font-black px-4 py-2 rounded-xl transition flex items-center space-x-1.5 shrink-0 shadow-sm cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Onboard Store</span>
                          </button>
                        </div>
                      </div>

                      {/* Table with SuperAdmin Merchants Horizontal Scrollbar and Bold Typography */}
                      <div className="overflow-x-auto custom-scrollbar pb-3">
                        <table className="w-full min-w-[1200px] text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-black tracking-wider whitespace-nowrap select-none">
                              <th className="py-3.5 px-4 whitespace-nowrap min-w-[120px]">User ID</th>
                              <th className="py-3.5 px-4 whitespace-nowrap min-w-[200px]">User Name</th>
                              <th className="py-3.5 px-4 whitespace-nowrap min-w-[240px]">User Email</th>
                              <th className="py-3.5 px-4 whitespace-nowrap min-w-[170px]">User Number</th>
                              <th className="py-3.5 px-4 whitespace-nowrap min-w-[150px]">Joined On</th>
                              <th className="py-3.5 px-4 whitespace-nowrap min-w-[150px]">Validity Date</th>
                              <th className="py-3.5 px-4 whitespace-nowrap text-center min-w-[160px]">User Payment Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {referredUsers
                              .filter(u => {
                                if (!referralSearch) return true;
                                const q = referralSearch.toLowerCase();
                                return (
                                  u.id.toLowerCase().includes(q) ||
                                  u.email.toLowerCase().includes(q) ||
                                  u.name.toLowerCase().includes(q) ||
                                  u.number.toLowerCase().includes(q)
                                );
                              })
                              .map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50/80 transition">
                                  {/* 1. User ID */}
                                  <td className="py-3.5 px-4 whitespace-nowrap font-mono font-black text-slate-900 text-xs">
                                    {u.id}
                                  </td>

                                  {/* 2. User Name */}
                                  <td className="py-3.5 px-4 whitespace-nowrap">
                                    <div className="font-black text-slate-900 text-sm whitespace-nowrap flex items-center space-x-2">
                                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                      <span>{u.name}</span>
                                    </div>
                                  </td>

                                  {/* 3. User Email */}
                                  <td className="py-3.5 px-4 whitespace-nowrap">
                                    <div className="font-bold text-slate-700 text-xs whitespace-nowrap flex items-center space-x-1.5">
                                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                      <span>{u.email}</span>
                                    </div>
                                  </td>

                                  {/* 4. User Number */}
                                  <td className="py-3.5 px-4 whitespace-nowrap">
                                    <div className="font-mono font-black text-slate-900 text-xs whitespace-nowrap flex items-center space-x-1.5">
                                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                      <span>{u.number}</span>
                                    </div>
                                  </td>

                                  {/* 5. Joined On */}
                                  <td className="py-3.5 px-4 whitespace-nowrap">
                                    <div className="font-mono font-bold text-slate-800 text-xs whitespace-nowrap flex items-center space-x-1.5">
                                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                      <span>{u.joinedOn}</span>
                                    </div>
                                  </td>

                                  {/* 6. Validity Date */}
                                  <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-slate-700 text-xs">
                                    {u.validityDate}
                                  </td>

                                  {/* 7. User Payment Status */}
                                  <td className="py-3.5 px-4 whitespace-nowrap text-center">
                                    <span className={`inline-flex items-center space-x-1.5 font-black px-3 py-1 rounded-xl text-xs whitespace-nowrap shadow-2xs ${
                                      u.paymentStatus?.toLowerCase() === 'paid'
                                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                                        : 'bg-amber-50 text-amber-800 border border-amber-300'
                                    }`}>
                                      <span className={`w-2 h-2 rounded-full ${
                                        u.paymentStatus?.toLowerCase() === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'
                                      }`}></span>
                                      <span>{u.paymentStatus || 'Paid'}</span>
                                    </span>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* VIEW 2: BANK ACCOUNT DETAILS (Matching Image 3) */}
                {/* ========================================================= */}
                {referralSubTab === 'bank_details' && (
                  <div className="space-y-6">
                    {/* 4 Top Stat Cards (Matching Image 3) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Card 1: Pending Amt */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-black shadow-2xs">
                          <Gift className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-600">Pending Amt</p>
                          <h3 className="text-xl font-black text-slate-900 mt-0.5">₹ 0/-</h3>
                        </div>
                      </div>

                      {/* Card 2: Total Earning */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black shadow-2xs">
                          <Wallet className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-600">Total Earning</p>
                          <h3 className="text-xl font-black text-slate-900 mt-0.5">₹ 0/-</h3>
                        </div>
                      </div>

                      {/* Card 3: Referred MW */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-[#74111d] flex items-center justify-center font-black shadow-2xs">
                          <Users className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-600">Referred MW</p>
                          <h3 className="text-xl font-black text-slate-900 mt-0.5">2</h3>
                        </div>
                      </div>

                      {/* Card 4: Referred Franchise */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#8B0000] flex items-center justify-center font-black shadow-2xs">
                          <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-600">Referred Franchise</p>
                          <h3 className="text-xl font-black text-slate-900 mt-0.5">6</h3>
                        </div>
                      </div>
                    </div>

                    {/* Bank Account Details Form Card (Image 3) */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                      {/* Success / Alert Toast if saved */}
                      {bankSavedToast && (
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between text-xs font-bold animate-in fade-in duration-200">
                          <div className="flex items-center space-x-2.5">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            <span>{bankSavedToast}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setBankSavedToast('')}
                            className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-100 transition cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {/* Header with Title and Status */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center space-x-2.5">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Bank Account Details:</h3>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black flex items-center space-x-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              <span>Payouts Active</span>
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Submit or update the bank account & UPI details where you want us to transfer your referral earnings.
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              const profile = getInitialAgentProfile();
                              setBankDetails({
                                bankName: 'Kotak Mahindra Bank',
                                accountHolderName: profile?.name || 'Ajeet Kumar',
                                accountNumber: '921100345671',
                                ifscCode: 'KKBK0000154',
                                upiId: '22233@upi',
                                upiName: profile?.name || 'Ajeet Kumar',
                                isSaved: true
                              });
                              setBankSavedToast('Sample bank details filled. Click "Save Bank Details" to persist.');
                              setTimeout(() => setBankSavedToast(''), 4000);
                            }}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs transition cursor-pointer flex items-center space-x-1.5"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset Sample</span>
                          </button>
                        </div>
                      </div>

                      {/* Luxury Virtual Passbook / Payout Card */}
                      <div className="bg-gradient-to-br from-slate-900 via-[#74111d] to-slate-950 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden border border-rose-950/40">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

                        <div className="relative z-10 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2.5">
                              <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-rose-300">
                                <Building2 className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-sm font-black text-white tracking-wide">
                                  {bankDetails.bankName || 'YOUR BANK NAME'}
                                </h4>
                                <p className="text-[10px] text-rose-200/80 font-semibold uppercase tracking-wider">
                                  Official Payout Settlement Account
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3 py-1 rounded-full text-[10px] font-black">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Direct IMPS / NEFT</span>
                            </div>
                          </div>

                          {/* Account Number with Mask toggle */}
                          <div className="pt-2">
                            <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider mb-1">
                              Account Number
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-lg sm:text-xl font-mono font-black tracking-widest text-white">
                                {showMaskedAccount && bankDetails.accountNumber && bankDetails.accountNumber.length > 4
                                  ? `•••• •••• ${bankDetails.accountNumber.slice(-4)}`
                                  : (bankDetails.accountNumber || '•••• •••• ••••')}
                              </span>
                              <button
                                type="button"
                                onClick={() => setShowMaskedAccount(!showMaskedAccount)}
                                className="text-xs text-rose-200 hover:text-white underline cursor-pointer font-bold"
                              >
                                {showMaskedAccount ? 'Show' : 'Hide'}
                              </button>
                            </div>
                          </div>

                          {/* Card Details Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/10 text-xs">
                            <div>
                              <p className="text-[10px] uppercase text-rose-200/70 font-bold">Holder Name</p>
                              <p className="font-black text-white truncate">{bankDetails.accountHolderName || '—'}</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase text-rose-200/70 font-bold">IFSC Code</p>
                              <p className="font-black font-mono text-white truncate">{bankDetails.ifscCode || '—'}</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase text-rose-200/70 font-bold">UPI ID</p>
                              <p className="font-black font-mono text-white truncate">{bankDetails.upiId || '—'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Editable Form */}
                      <form onSubmit={handleSaveBankDetails} className="space-y-5 text-xs font-bold">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {/* Col 1 */}
                          <div className="space-y-4">
                            <div>
                              <label className="block text-slate-700 mb-1.5 flex items-center justify-between">
                                <span>Bank Name *</span>
                                <span className="text-[10px] font-normal text-slate-400">e.g. HDFC, SBI, Kotak</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={bankDetails.bankName}
                                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                                placeholder="e.g. Kotak Mahindra Bank"
                                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:border-[#74111d] focus:ring-2 focus:ring-[#74111d]/15 transition"
                              />
                            </div>

                            <div>
                              <label className="block text-slate-700 mb-1.5 flex items-center justify-between">
                                <span>Bank Account Number *</span>
                                <span className="text-[10px] font-normal text-slate-400">Numbers only</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={bankDetails.accountNumber}
                                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value.replace(/[^0-9]/g, '') })}
                                placeholder="e.g. 921100345671"
                                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-900 bg-white focus:outline-none focus:border-[#74111d] focus:ring-2 focus:ring-[#74111d]/15 transition"
                              />
                            </div>

                            <div>
                              <label className="block text-slate-700 mb-1.5 flex items-center justify-between">
                                <span>UPI ID *</span>
                                <span className="text-[10px] font-normal text-slate-400">e.g. user@okhdfcbank</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={bankDetails.upiId}
                                onChange={(e) => setBankDetails({ ...bankDetails, upiId: e.target.value })}
                                placeholder="e.g. 22233@upi"
                                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-900 bg-white focus:outline-none focus:border-[#74111d] focus:ring-2 focus:ring-[#74111d]/15 transition"
                              />
                            </div>
                          </div>

                          {/* Col 2 */}
                          <div className="space-y-4">
                            <div>
                              <label className="block text-slate-700 mb-1.5 flex items-center justify-between">
                                <span>Account Holder Name *</span>
                                <span className="text-[10px] font-normal text-slate-400">As per bank passbook</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={bankDetails.accountHolderName}
                                onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
                                placeholder="e.g. Ajeet Kumar"
                                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:border-[#74111d] focus:ring-2 focus:ring-[#74111d]/15 transition"
                              />
                            </div>

                            <div>
                              <label className="block text-slate-700 mb-1.5 flex items-center justify-between">
                                <span>Bank IFSC Code *</span>
                                <span className="text-[10px] font-normal text-slate-400">11-character code</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={bankDetails.ifscCode}
                                onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
                                placeholder="e.g. KKBK0000154"
                                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-mono uppercase text-slate-900 bg-white focus:outline-none focus:border-[#74111d] focus:ring-2 focus:ring-[#74111d]/15 transition"
                              />
                            </div>

                            <div>
                              <label className="block text-slate-700 mb-1.5 flex items-center justify-between">
                                <span>UPI Name *</span>
                                <span className="text-[10px] font-normal text-slate-400">Registered UPI name</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={bankDetails.upiName}
                                onChange={(e) => setBankDetails({ ...bankDetails, upiName: e.target.value })}
                                placeholder="e.g. Ajeet Kumar"
                                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:border-[#74111d] focus:ring-2 focus:ring-[#74111d]/15 transition"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Save Action Buttons - ALWAYS VISIBLE */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                          <p className="text-[11px] text-slate-500 font-normal">
                            Changes saved here are instantly synced to your referral payout profile.
                          </p>
                          <div className="flex items-center space-x-2 w-full sm:w-auto">
                            <button
                              type="submit"
                              className="w-full sm:w-auto bg-[#74111d] hover:bg-[#5e0c15] text-white px-6 py-2.5 rounded-xl font-black text-xs shadow-md shadow-[#74111d]/25 transition cursor-pointer flex items-center justify-center space-x-2"
                            >
                              <Save className="w-4 h-4" />
                              <span>Save Bank Details</span>
                            </button>
                          </div>
                        </div>
                      </form>

                      {/* Status Banner */}
                      <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200/60 flex items-center space-x-3 text-xs text-slate-700">
                        <div className="w-6 h-6 rounded-full bg-[#74111d] text-white flex items-center justify-center text-xs font-black shrink-0">
                          ✓
                        </div>
                        <p className="font-medium text-slate-700">
                          <strong className="text-slate-900">Direct Payout Settlement:</strong> All referral commission earnings are processed directly to this verified bank account via IMPS / NEFT. You can update these details anytime.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODAL: MW ID PREVIEW (Eye icon in Table) */}
                {selectedMwPreviewModal.isOpen && selectedMwPreviewModal.item && (
                  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 overflow-y-auto">
                    <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative my-auto p-6 sm:p-7 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                          <h3 className="text-base font-black text-slate-900">MW ID #{selectedMwPreviewModal.item.mwFrId} Details</h3>
                          <p className="text-xs text-slate-500">{selectedMwPreviewModal.item.name} • {selectedMwPreviewModal.item.email}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedMwPreviewModal({ isOpen: false, item: null })}
                          className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-500">User ID:</span>
                            <span className="font-bold text-slate-900">{selectedMwPreviewModal.item.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">User Type:</span>
                            <span className="font-bold text-slate-900">{selectedMwPreviewModal.item.userType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Phone:</span>
                            <span className="font-mono font-bold text-slate-900">{selectedMwPreviewModal.item.number}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Joined On:</span>
                            <span className="font-bold text-slate-900">{selectedMwPreviewModal.item.joinedOn}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Date Created:</span>
                            <span className="font-bold text-slate-900">{selectedMwPreviewModal.item.dateCreated}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Validity Date:</span>
                            <span className="font-bold text-slate-900">{selectedMwPreviewModal.item.validityDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">MW Status:</span>
                            <span className="font-bold text-purple-700">{selectedMwPreviewModal.item.mwStatus}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Payment Status:</span>
                            <span className="font-bold text-slate-700">{selectedMwPreviewModal.item.paymentStatus}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setSelectedMwPreviewModal({ isOpen: false, item: null })}
                          className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}

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

                    {/* Add Customer Button (Styled in BeAurex crimson red) */}
                    <button
                      onClick={() => setShowAddCustomerModal(true)}
                      className="bg-[#74111d] hover:bg-[#5e0c15] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-md shadow-[#74111d]/25 cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Customer</span>
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

                {/* Customer Tracker Table (SuperAdmin Merchants Design System) */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto custom-scrollbar pb-3">
                    <table className="w-full min-w-[1650px] text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-black tracking-wider whitespace-nowrap select-none">
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[180px]">Customer Name</th>
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[190px]">Company Name</th>
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[160px]">Phone Number</th>
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[160px]">Approached For</th>
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[150px]">Follow-up Method</th>
                          <th className="py-3.5 px-4 whitespace-nowrap text-center min-w-[170px]">Status</th>
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[130px]">Source</th>
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[220px]">Email ID</th>
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[180px]">Website</th>
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[200px]">Address</th>
                          <th className="py-3.5 px-4 whitespace-nowrap min-w-[170px]">Last Updated</th>
                          <th className="py-3.5 px-4 whitespace-nowrap text-center min-w-[220px]">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {filteredCrmCustomers.length === 0 ? (
                          <tr>
                            <td colSpan={12} className="py-12 text-center text-slate-400">
                              <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                              <p className="font-black text-xs text-slate-500">No customer leads found matching your search</p>
                              <button
                                onClick={() => setShowAddCustomerModal(true)}
                                className="mt-3 text-red-600 font-black hover:underline text-xs cursor-pointer"
                              >
                                + Add first customer lead
                              </button>
                            </td>
                          </tr>
                        ) : (
                          filteredCrmCustomers.map((c) => (
                            <tr key={c.id} className="hover:bg-slate-50/80 transition">
                              
                              {/* 1. Customer Name */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <div className="font-black text-slate-900 text-sm whitespace-nowrap flex items-center space-x-2">
                                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span>{c.name}</span>
                                </div>
                              </td>

                              {/* 2. Company Name */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <div className="font-black text-slate-900 text-xs whitespace-nowrap flex items-center space-x-1.5">
                                  <Building2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                  <span>{c.companyName && c.companyName !== '—' && c.companyName !== '-' ? c.companyName : '—'}</span>
                                </div>
                              </td>

                              {/* 3. Phone Number */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <div className="font-mono font-black text-slate-900 text-xs whitespace-nowrap flex items-center space-x-1.5">
                                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span>{c.phone}</span>
                                </div>
                              </td>

                              {/* 4. Approached For */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <span className="font-bold text-slate-800 text-xs whitespace-nowrap">
                                  {c.approachedFor || 'BeAurex Loyalty'}
                                </span>
                              </td>

                              {/* 5. Follow-up Method */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200 text-xs whitespace-nowrap shadow-2xs">
                                  {c.followupMethod || 'Call'}
                                </span>
                              </td>

                              {/* 6. Status */}
                              <td className="py-3.5 px-4 whitespace-nowrap text-center">
                                <span className={`inline-flex items-center space-x-1.5 font-black px-3 py-1 rounded-xl text-xs whitespace-nowrap shadow-2xs ${
                                  c.status === 'Important' ? 'bg-amber-50 text-amber-800 border border-amber-300' :
                                  c.status === 'Closed Won' ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' :
                                  c.status === 'Hot Lead' ? 'bg-rose-50 text-rose-800 border border-rose-300' :
                                  'bg-rose-50 text-[#74111d] border border-rose-300'
                                }`}>
                                  <span className={`w-2 h-2 rounded-full ${
                                    c.status === 'Important' ? 'bg-amber-500' :
                                    c.status === 'Closed Won' ? 'bg-emerald-500' :
                                    c.status === 'Hot Lead' ? 'bg-rose-500' :
                                    'bg-[#74111d]'
                                  }`}></span>
                                  <span>{c.status || 'Followup required'}</span>
                                </span>
                              </td>

                              {/* 7. Source */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <span className="font-bold text-slate-700 text-xs whitespace-nowrap">
                                  {c.source || 'Direct'}
                                </span>
                              </td>

                              {/* 8. Email ID */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <div className="font-bold text-slate-600 text-xs whitespace-nowrap flex items-center space-x-1.5">
                                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span>{c.email || '—'}</span>
                                </div>
                              </td>

                              {/* 9. Website */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <div className="font-bold text-slate-600 text-xs whitespace-nowrap flex items-center space-x-1.5">
                                  <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  {c.website && c.website !== '—' && c.website !== '-' ? (
                                    <a
                                      href={c.website.startsWith('http') ? c.website : `https://${c.website}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-red-600 hover:underline"
                                    >
                                      {c.website.replace('https://', '').replace('http://', '')}
                                    </a>
                                  ) : (
                                    <span>—</span>
                                  )}
                                </div>
                              </td>

                              {/* 10. Address */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <div className="font-bold text-slate-600 text-xs whitespace-nowrap flex items-center space-x-1.5" title={c.address}>
                                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span>{c.address || '—'}</span>
                                </div>
                              </td>

                              {/* 11. Last updated */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <div className="font-mono font-bold text-slate-700 text-xs whitespace-nowrap flex items-center space-x-1.5">
                                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span>{c.lastUpdated || '08-10-2026 16:19'}</span>
                                </div>
                              </td>

                              {/* 12. Actions */}
                              <td className="py-3.5 px-4 whitespace-nowrap text-center">
                                <div className="inline-flex items-center space-x-1.5 justify-center whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditCustomer(c)}
                                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-xl font-black text-xs transition cursor-pointer inline-flex items-center space-x-1 shadow-2xs whitespace-nowrap"
                                    title="Edit Customer"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenFollowup(c)}
                                    className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-xl font-black text-xs transition cursor-pointer inline-flex items-center space-x-1 shadow-2xs whitespace-nowrap"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>Follow up</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCrmCustomer(c.id)}
                                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition cursor-pointer inline-flex items-center shadow-2xs"
                                    title="Delete Customer Lead"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
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

                        {/* 2. Company / Store Name (Positioned directly below Customer Name) */}
                        <div>
                          <label className="block text-slate-700 mb-1">Company Name</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                              <Building2 className="w-4 h-4" />
                            </span>
                            <input
                              type="text"
                              value={quickCustomerForm.companyName}
                              onChange={(e) => setQuickCustomerForm({ ...quickCustomerForm, companyName: e.target.value })}
                              placeholder="Enter company / business name"
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
                                  <label className="block text-slate-600 text-[11px] mb-1">Website URL</label>
                                  <input
                                    type="url"
                                    value={quickCustomerForm.website}
                                    onChange={(e) => setQuickCustomerForm({ ...quickCustomerForm, website: e.target.value })}
                                    placeholder="https://example.com"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                                  />
                                </div>
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
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                            </div>
                          )}
                        </div>

                        {/* Comment / Notes Section */}
                        <div>
                          <label className="block text-slate-700 mb-1">Comment / Notes</label>
                          <textarea
                            rows={2}
                            value={quickCustomerForm.comments}
                            onChange={(e) => setQuickCustomerForm({ ...quickCustomerForm, comments: e.target.value })}
                            placeholder="Enter discussion notes, preliminary requirements or initial comments..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white resize-none"
                          />
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
                {/* MODAL: EDIT CUSTOMER LEAD (Requested Feature) */}
                {/* ========================================================= */}
                {editCustomerModal.isOpen && editCustomerModal.customer && (
                  <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative space-y-4 animate-in zoom-in-95 duration-150 border border-slate-200 my-auto">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                            <Edit3 className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-lg font-black text-slate-900">Edit Customer Lead</h3>
                            <p className="text-xs text-slate-500">Update details for {editCustomerModal.form.name || 'Lead'}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditCustomerModal({ isOpen: false, customer: null, form: { name: '', phone: '', email: '', companyName: '', businessType: 'Retail', approachedFor: 'BeAurex Loyalty', followupMethod: 'Call', status: 'Followup required', source: 'Direct', website: '', address: '', comments: '' } })}
                          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveEditCustomer} className="space-y-3.5 text-xs font-bold">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-700 mb-1">Customer Name *</label>
                            <input
                              type="text"
                              required
                              value={editCustomerModal.form.name}
                              onChange={(e) => setEditCustomerModal({
                                ...editCustomerModal,
                                form: { ...editCustomerModal.form, name: e.target.value }
                              })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-700 mb-1">Company / Store Name</label>
                            <input
                              type="text"
                              value={editCustomerModal.form.companyName}
                              onChange={(e) => setEditCustomerModal({
                                ...editCustomerModal,
                                form: { ...editCustomerModal.form, companyName: e.target.value }
                              })}
                              placeholder="e.g. Royal Sweets & Cafe"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-700 mb-1">Phone Number *</label>
                            <input
                              type="tel"
                              required
                              value={editCustomerModal.form.phone}
                              onChange={(e) => setEditCustomerModal({
                                ...editCustomerModal,
                                form: { ...editCustomerModal.form, phone: e.target.value }
                              })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-700 mb-1">Email ID</label>
                            <input
                              type="email"
                              value={editCustomerModal.form.email}
                              onChange={(e) => setEditCustomerModal({
                                ...editCustomerModal,
                                form: { ...editCustomerModal.form, email: e.target.value }
                              })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-700 mb-1">Approached For</label>
                            <select
                              value={editCustomerModal.form.approachedFor}
                              onChange={(e) => setEditCustomerModal({
                                ...editCustomerModal,
                                form: { ...editCustomerModal.form, approachedFor: e.target.value }
                              })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                            >
                              <option value="BeAurex Loyalty">BeAurex Loyalty</option>
                              <option value="Standee Setup">Standee Setup</option>
                              <option value="Digital Menu QR">Digital Menu QR</option>
                              <option value="Custom Plan">Custom Plan</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-slate-700 mb-1">Status</label>
                            <select
                              value={editCustomerModal.form.status}
                              onChange={(e) => setEditCustomerModal({
                                ...editCustomerModal,
                                form: { ...editCustomerModal.form, status: e.target.value }
                              })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                            >
                              {statusOptions.map((st, i) => (
                                <option key={i} value={st}>{st}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-700 mb-1">Follow-up Method</label>
                            <select
                              value={editCustomerModal.form.followupMethod}
                              onChange={(e) => setEditCustomerModal({
                                ...editCustomerModal,
                                form: { ...editCustomerModal.form, followupMethod: e.target.value }
                              })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                            >
                              <option value="Call">Call</option>
                              <option value="Visit">In-Person Visit</option>
                              <option value="WhatsApp">WhatsApp Message</option>
                              <option value="Email">Email</option>
                              <option value="Meeting">Meeting</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-slate-700 mb-1">Lead Source</label>
                            <select
                              value={editCustomerModal.form.source}
                              onChange={(e) => setEditCustomerModal({
                                ...editCustomerModal,
                                form: { ...editCustomerModal.form, source: e.target.value }
                              })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                            >
                              <option value="Direct">Direct</option>
                              <option value="Referral">Referral</option>
                              <option value="Walk-in">Walk-in</option>
                              <option value="Social Media">Social Media</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-700 mb-1">Store Address / Location</label>
                          <input
                            type="text"
                            value={editCustomerModal.form.address}
                            onChange={(e) => setEditCustomerModal({
                              ...editCustomerModal,
                              form: { ...editCustomerModal.form, address: e.target.value }
                            })}
                            placeholder="Address..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 mb-1">Comments / Discussion Notes</label>
                          <textarea
                            rows={2}
                            value={editCustomerModal.form.comments}
                            onChange={(e) => setEditCustomerModal({
                              ...editCustomerModal,
                              form: { ...editCustomerModal.form, comments: e.target.value }
                            })}
                            placeholder="Add comments or conversation notes..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 resize-none"
                          />
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => setEditCustomerModal({ isOpen: false, customer: null, form: { name: '', phone: '', email: '', companyName: '', businessType: 'Retail', approachedFor: 'BeAurex Loyalty', followupMethod: 'Call', status: 'Followup required', source: 'Direct', website: '', address: '', comments: '' } })}
                            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl shadow-md shadow-blue-600/20 text-xs cursor-pointer"
                          >
                            Save Changes
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
            {/* TAB 4: MARKETING KIT (EXACT IMAGE 4 IMPLEMENTATION) */}
            {/* ========================================================= */}
            {activeTab === 'marketing_kit' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                
                {/* Toast Notification */}
                {kitToast && (
                  <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center justify-between animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center space-x-2 text-xs font-bold">
                      <CheckCircle className="w-4 h-4 text-emerald-200" />
                      <span>{kitToast}</span>
                    </div>
                    <button onClick={() => setKitToast('')} className="text-emerald-200 hover:text-white text-xs ml-4">✕</button>
                  </div>
                )}

                {/* Top Header Row with Back to Dashboard Button & Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:text-[#74111d] bg-white border border-slate-200 hover:border-rose-200 px-3.5 py-2 rounded-xl shadow-2xs transition hover:bg-rose-50/40 cursor-pointer shrink-0"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
                      <span>Back to Dashboard</span>
                    </button>
                    <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                        Marketing Kit
                      </h2>
                      <p className="text-xs text-slate-500 font-medium">
                        Manage promotional materials and resources for franchisees.
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-[#74111d] bg-rose-50 border border-rose-200/80 px-3.5 py-1.5 rounded-full shrink-0 shadow-2xs self-start sm:self-center">
                    Franchise Asset Hub
                  </span>
                </div>

                {/* Sub-Tabs: Sales Kit */}
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
                  <button
                    onClick={() => { setKitSubTab('mw_sales_kit'); setOpenFolder(null); }}
                    className="px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center space-x-2 bg-gradient-to-r from-[#74111d] to-[#8B0000] text-white shadow-md shadow-[#74111d]/25"
                  >
                    <span>Sales Kit ({salesKitItemCount})</span>
                  </button>
                </div>

                {/* Landing Page Themed Banner - Exact Metrics from Image 4 */}
                <div className="bg-gradient-to-r from-[#690005] via-[#8B0000] to-[#590104] rounded-2xl p-5 text-white shadow-md border border-[#590104]">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-6 text-sm sm:text-base font-extrabold divide-x divide-rose-400/30">
                      <div className="flex items-center space-x-2">
                        <Folder className="w-4 h-4 text-rose-200" />
                        <span>{currentTotalFolders} Folders</span>
                      </div>
                      <div className="pl-6 flex items-center space-x-2">
                        <ImageIcon className="w-4 h-4 text-rose-200" />
                        <span>{currentImagesCount} Images</span>
                      </div>
                      <div className="pl-6 flex items-center space-x-2">
                        <Video className="w-4 h-4 text-rose-200" />
                        <span>{currentVideosCount} Videos</span>
                      </div>
                      <div className="pl-6 flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-rose-200" />
                        <span>{currentFilesCount} Files</span>
                      </div>
                      <div className="pl-6 flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-rose-100">{currentActiveItemsCount} Active Items</span>
                      </div>
                    </div>

                    <div className="text-xs text-rose-200 font-semibold bg-[#49070f]/70 px-3 py-1.5 rounded-lg border border-rose-300/20">
                      All Assets Synced
                    </div>
                  </div>
                </div>

                {/* Content View: Folders Grid OR Folder Contents */}
                {openFolder === null ? (
                  /* ================= FOLDER CARDS GRID ================= */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-slate-900 tracking-tight">Folders ({currentFolders.length})</h3>
                      <span className="text-xs text-slate-400">Click any folder to view and download assets</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {currentFolders.map((folder) => {
                        const itemCount = (folder.items || []).length;
                        return (
                          <div
                            key={folder.id}
                            onClick={() => setOpenFolder(folder.name)}
                            className="group bg-white rounded-2xl p-5 border border-slate-200 hover:border-rose-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between relative"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="w-12 h-12 rounded-xl bg-amber-50 group-hover:bg-rose-50 flex items-center justify-center transition border border-amber-200/60 group-hover:border-rose-200">
                                <Folder className="w-7 h-7 text-amber-500 fill-amber-400 group-hover:text-[#74111d] group-hover:fill-[#8B0000] transition" />
                              </div>
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                                0 sub • {itemCount} items
                              </span>
                            </div>

                            <div>
                              <h4 className="text-base font-black text-slate-900 group-hover:text-[#74111d] transition truncate">
                                {folder.name}
                              </h4>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {folder.name === 'Document' ? 'Official Franchise agreements & forms' : 'High resolution promotional designs'}
                              </p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#74111d]">
                              <span>Open Folder</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* ================= FOLDER ITEMS VIEW ================= */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-rose-50/70 border border-rose-200 rounded-2xl px-5 py-3">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setOpenFolder(null)}
                          className="bg-white hover:bg-rose-50 text-[#74111d] text-xs font-black px-3 py-1.5 rounded-xl border border-rose-200 transition shadow-xs flex items-center space-x-1.5 cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Back to Folders</span>
                        </button>
                        <div>
                          <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                            <Folder className="w-4 h-4 text-amber-500 fill-amber-400 inline" />
                            <span>{openFolder}</span>
                          </h3>
                          <p className="text-[11px] text-[#74111d] font-semibold">
                            {currentFolders.find(f => f.name === openFolder)?.items?.length || 0} items in this folder
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            showKitToast(`All assets in "${openFolder}" queued for zip download`);
                          }}
                          className="bg-gradient-to-r from-[#74111d] to-[#8B0000] hover:from-[#5e0c15] hover:to-[#74111d] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download All (.zip)</span>
                        </button>
                      </div>
                    </div>

                    {/* Items Grid */}
                    {(() => {
                      const activeFolderObj = currentFolders.find(f => f.name === openFolder);
                      const folderItems = activeFolderObj?.items || [];

                      if (folderItems.length === 0) {
                        return (
                          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                            <Folder className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <h4 className="text-sm font-bold text-slate-700">This folder is currently empty</h4>
                            <p className="text-xs text-slate-400 mt-1">Official assets for this folder will be uploaded and managed by the Super Admin.</p>
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {folderItems.map((item) => (
                            <div
                              key={item.id}
                              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition p-4 flex flex-col justify-between"
                            >
                              <div>
                                {/* Icon / Preview banner */}
                                <div className="h-32 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center p-3 text-center mb-3 relative overflow-hidden group">
                                  {item.type === 'image' ? (
                                    <>
                                      <div className="w-12 h-12 rounded-full bg-rose-100 text-[#74111d] flex items-center justify-center mb-2">
                                        <ImageIcon className="w-6 h-6" />
                                      </div>
                                      <span className="text-[10px] font-black uppercase tracking-wider text-[#74111d] bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                                        {item.ext || 'PNG'}
                                      </span>
                                    </>
                                  ) : item.type === 'video' ? (
                                    <>
                                      <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 mb-2">
                                        <Play className="w-6 h-6 fill-rose-600" />
                                      </div>
                                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                                        {item.ext || 'VIDEO'}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mb-2">
                                        <FileText className="w-6 h-6" />
                                      </div>
                                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                                        {item.ext || 'PDF'}
                                      </span>
                                    </>
                                  )}

                                  {/* Quick Preview Hover Overlay */}
                                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-2">
                                    <button
                                      onClick={() => setPreviewKitItem(item)}
                                      className="bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm hover:bg-slate-100 cursor-pointer flex items-center space-x-1"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                      <span>Preview</span>
                                    </button>
                                  </div>
                                </div>

                                <h4 className="text-xs font-black text-slate-900 truncate mb-1" title={item.name}>
                                  {item.name}
                                </h4>

                                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3">
                                  <span>{item.size || '1.5 MB'}</span>
                                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                    {item.res || item.date || '300 DPI'}
                                  </span>
                                </div>
                              </div>

                              {/* Card Actions: View & Download only */}
                              <div className="pt-3 border-t border-slate-100 flex items-center space-x-2">
                                <button
                                  onClick={() => setPreviewKitItem(item)}
                                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-1.5 rounded-xl transition flex items-center justify-center space-x-1 cursor-pointer"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>View</span>
                                </button>

                                <button
                                  onClick={() => {
                                    triggerDownload(item.name);
                                    showKitToast(`Downloaded ${item.name}`);
                                  }}
                                  className="flex-1 bg-gradient-to-r from-[#74111d] to-[#8B0000] hover:from-[#5e0c15] hover:to-[#74111d] text-white text-xs font-bold py-1.5 rounded-xl transition flex items-center justify-center space-x-1 cursor-pointer shadow-xs"
                                >
                                  <Download className="w-3 h-3" />
                                  <span>Download</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* ================= MODAL 1: ADD FOLDER ================= */}
                {addFolderModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                        <div className="flex items-center space-x-2">
                          <Folder className="w-5 h-5 text-[#74111d]" />
                          <h3 className="text-base font-black text-slate-900">Create New Folder</h3>
                        </div>
                        <button onClick={() => setAddFolderModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
                      </div>

                      <form onSubmit={handleCreateFolder} className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-slate-700 mb-1 block">Folder Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Social Media Banners, Retail Pitch Guides"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#74111d] focus:border-[#74111d]"
                          />
                        </div>

                        <p className="text-[11px] text-slate-400">
                          This folder will be added to <strong>{currentKit.title}</strong> and visible to all field representatives.
                        </p>

                        <div className="pt-2 flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => setAddFolderModalOpen(false)}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-gradient-to-r from-[#74111d] to-[#8B0000] hover:from-[#5e0c15] hover:to-[#74111d] text-white text-xs font-black px-5 py-2 rounded-xl shadow-md transition"
                          >
                            Create Folder
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* ================= MODAL 2: ADD IMAGES ================= */}
                {addImagesModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                        <div className="flex items-center space-x-2">
                          <ImageIcon className="w-5 h-5 text-[#74111d]" />
                          <h3 className="text-base font-black text-slate-900">Add Images to Marketing Kit</h3>
                        </div>
                        <button onClick={() => setAddImagesModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
                      </div>

                      <form onSubmit={handleAddImage} className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-slate-700 mb-1 block">Image Title / Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 5x7 Counter Standee QR.png"
                            value={newImageForm.name}
                            onChange={(e) => setNewImageForm({ ...newImageForm, name: e.target.value })}
                            className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#74111d] focus:border-[#74111d]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 mb-1 block">Select Target Folder</label>
                          <select
                            value={newImageForm.targetFolder}
                            onChange={(e) => setNewImageForm({ ...newImageForm, targetFolder: e.target.value })}
                            className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#74111d] focus:border-[#74111d]"
                          >
                            {currentFolders.map(f => (
                              <option key={f.id} value={f.name}>{f.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-slate-700 mb-1 block">File Size</label>
                            <input
                              type="text"
                              value={newImageForm.size}
                              onChange={(e) => setNewImageForm({ ...newImageForm, size: e.target.value })}
                              className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#74111d] focus:border-[#74111d]"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-700 mb-1 block">Resolution / Tag</label>
                            <input
                              type="text"
                              value={newImageForm.res}
                              onChange={(e) => setNewImageForm({ ...newImageForm, res: e.target.value })}
                              className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#74111d] focus:border-[#74111d]"
                            />
                          </div>
                        </div>

                        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center bg-slate-50">
                          <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                          <span className="text-xs font-bold text-slate-600 block">Drag & drop PNG/JPG or click to browse</span>
                          <span className="text-[10px] text-slate-400">High resolution 300 DPI recommended for print</span>
                        </div>

                        <div className="pt-2 flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => setAddImagesModalOpen(false)}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-gradient-to-r from-[#74111d] to-[#8B0000] hover:from-[#5e0c15] hover:to-[#74111d] text-white text-xs font-black px-5 py-2 rounded-xl shadow-md transition"
                          >
                            Add Image
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* ================= MODAL 3: ADD VIDEO LINK ================= */}
                {addVideoLinkModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                        <div className="flex items-center space-x-2">
                          <Video className="w-5 h-5 text-[#74111d]" />
                          <h3 className="text-base font-black text-slate-900">Add Video Link</h3>
                        </div>
                        <button onClick={() => setAddVideoLinkModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
                      </div>

                      <form onSubmit={handleAddVideoLink} className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-slate-700 mb-1 block">Video Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. How to Pitch BeAurex to Retailers (Walkthrough)"
                            value={newVideoLinkForm.name}
                            onChange={(e) => setNewVideoLinkForm({ ...newVideoLinkForm, name: e.target.value })}
                            className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#74111d] focus:border-[#74111d]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 mb-1 block">Video URL (YouTube, Vimeo, Loom) *</label>
                          <input
                            type="url"
                            required
                            placeholder="https://youtube.com/watch?v=..."
                            value={newVideoLinkForm.url}
                            onChange={(e) => setNewVideoLinkForm({ ...newVideoLinkForm, url: e.target.value })}
                            className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#74111d] focus:border-[#74111d]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 mb-1 block">Select Target Folder</label>
                          <select
                            value={newVideoLinkForm.targetFolder}
                            onChange={(e) => setNewVideoLinkForm({ ...newVideoLinkForm, targetFolder: e.target.value })}
                            className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#74111d] focus:border-[#74111d]"
                          >
                            {currentFolders.map(f => (
                              <option key={f.id} value={f.name}>{f.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="pt-2 flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => setAddVideoLinkModalOpen(false)}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-gradient-to-r from-[#74111d] to-[#8B0000] hover:from-[#5e0c15] hover:to-[#74111d] text-white text-xs font-black px-5 py-2 rounded-xl shadow-md transition"
                          >
                            Add Video Link
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* ================= MODAL 4: UPLOAD VIDEO ================= */}
                {uploadVideoModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                        <div className="flex items-center space-x-2">
                          <Upload className="w-5 h-5 text-[#74111d]" />
                          <h3 className="text-base font-black text-slate-900">Upload Video Asset</h3>
                        </div>
                        <button onClick={() => setUploadVideoModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
                      </div>

                      <form onSubmit={handleUploadVideo} className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-slate-700 mb-1 block">Video Title / File Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. BeAurex Loyalty Demo 1080p.mp4"
                            value={uploadVideoForm.name}
                            onChange={(e) => setNewImageForm({ ...uploadVideoForm, name: e.target.value })}
                            className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#74111d] focus:border-[#74111d]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 mb-1 block">Select Target Folder</label>
                          <select
                            value={uploadVideoForm.targetFolder}
                            onChange={(e) => setUploadVideoForm({ ...uploadVideoForm, targetFolder: e.target.value })}
                            className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#74111d] focus:border-[#74111d]"
                          >
                            {currentFolders.map(f => (
                              <option key={f.id} value={f.name}>{f.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center bg-slate-50">
                          <Video className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                          <span className="text-xs font-bold text-slate-600 block">Select MP4, MOV or WebM video file</span>
                          <span className="text-[10px] text-slate-400">Max size 250 MB</span>
                        </div>

                        <div className="pt-2 flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => setUploadVideoModalOpen(false)}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-gradient-to-r from-[#74111d] to-[#8B0000] hover:from-[#5e0c15] hover:to-[#74111d] text-white text-xs font-black px-5 py-2 rounded-xl shadow-md transition"
                          >
                            Upload Video
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* ================= MODAL 5: ADD FILE ================= */}
                {addFileModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-5 h-5 text-[#74111d]" />
                          <h3 className="text-base font-black text-slate-900">Add File Resource</h3>
                        </div>
                        <button onClick={() => setAddFileModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
                      </div>

                      <form onSubmit={handleAddFile} className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-slate-700 mb-1 block">File Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Merchant Onboarding Guide 2026.pdf"
                            value={newFileForm.name}
                            onChange={(e) => setNewFileForm({ ...newFileForm, name: e.target.value })}
                            className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#74111d] focus:border-[#74111d]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-slate-700 mb-1 block">File Type</label>
                            <select
                              value={newFileForm.ext}
                              onChange={(e) => setNewFileForm({ ...newFileForm, ext: e.target.value })}
                              className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#74111d] focus:border-[#74111d]"
                            >
                              <option value="PDF">PDF Document</option>
                              <option value="DOCX">Word Document (.docx)</option>
                              <option value="XLSX">Spreadsheet (.xlsx)</option>
                              <option value="ZIP">Archive (.zip)</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-700 mb-1 block">Estimated Size</label>
                            <input
                              type="text"
                              value={newFileForm.size}
                              onChange={(e) => setNewFileForm({ ...newFileForm, size: e.target.value })}
                              className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#74111d] focus:border-[#74111d]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 mb-1 block">Select Target Folder</label>
                          <select
                            value={newFileForm.targetFolder}
                            onChange={(e) => setNewFileForm({ ...newFileForm, targetFolder: e.target.value })}
                            className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#74111d] focus:border-[#74111d]"
                          >
                            {currentFolders.map(f => (
                              <option key={f.id} value={f.name}>{f.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="pt-2 flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => setAddFileModalOpen(false)}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-gradient-to-r from-[#74111d] to-[#8B0000] hover:from-[#5e0c15] hover:to-[#74111d] text-white text-xs font-black px-5 py-2 rounded-xl shadow-md transition"
                          >
                            Upload File
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* ================= MODAL 6: PREVIEW ITEM MODAL ================= */}
                {previewKitItem && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                        <div className="flex items-center space-x-2">
                          {previewKitItem.type === 'image' ? (
                            <ImageIcon className="w-5 h-5 text-[#74111d]" />
                          ) : previewKitItem.type === 'video' ? (
                            <Video className="w-5 h-5 text-rose-700" />
                          ) : (
                            <FileText className="w-5 h-5 text-amber-700" />
                          )}
                          <h3 className="text-sm font-black text-slate-900 truncate max-w-xs">{previewKitItem.name}</h3>
                        </div>
                        <button onClick={() => setPreviewKitItem(null)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
                      </div>

                      {/* Preview Graphic Canvas */}
                      <div className="rounded-2xl bg-gradient-to-br from-[#450103] via-[#690005] to-[#260102] p-6 text-center text-white mb-4 relative overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 border border-white/20">
                          {previewKitItem.type === 'image' ? (
                            <ImageIcon className="w-8 h-8 text-rose-200" />
                          ) : previewKitItem.type === 'video' ? (
                            <Play className="w-8 h-8 text-rose-300 fill-rose-300" />
                          ) : (
                            <FileText className="w-8 h-8 text-amber-300" />
                          )}
                        </div>
                        <h4 className="font-extrabold text-sm mb-1">{previewKitItem.name}</h4>
                        <span className="text-[11px] font-mono text-rose-200">
                          {previewKitItem.ext} • {previewKitItem.size} • {previewKitItem.res || 'High-Resolution Asset'}
                        </span>
                        <div className="mt-4 inline-flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                          <CheckCircle className="w-3 h-3" />
                          <span>Official Verified BeAurex Marketing Material</span>
                        </div>
                      </div>

                      {/* Modal Actions */}
                      <div className="flex items-center justify-end space-x-3 pt-2">
                        <button
                          onClick={() => setPreviewKitItem(null)}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 cursor-pointer"
                        >
                          Close
                        </button>
                        <button
                          onClick={() => {
                            triggerDownload(previewKitItem.name);
                            showKitToast(`Downloaded ${previewKitItem.name}`);
                            setPreviewKitItem(null);
                          }}
                          className="bg-gradient-to-r from-[#74111d] to-[#8B0000] hover:from-[#5e0c15] hover:to-[#74111d] text-white text-xs font-extrabold px-5 py-2 rounded-xl shadow-md transition flex items-center space-x-2 cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download Asset</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 5: ID CARD */}
            {/* ========================================================= */}
            {activeTab === 'id_card' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                
                {/* Hidden photo input */}
                <input 
                  type="file" 
                  ref={photoInputRef} 
                  accept="image/*" 
                  onChange={handlePhotoUpload} 
                  className="hidden" 
                />

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Official Field Representative Identification</h3>
                    <p className="text-xs text-slate-500">Authorized digital credential for in-person retail merchant visits and onboarding</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={() => photoInputRef.current?.click()}
                      className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold px-3.5 py-2.5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer border border-red-200 shadow-xs"
                      title="Upload custom ID photo"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{agentPhoto ? 'Change Photo' : 'Upload Photo'}</span>
                    </button>
                    {agentPhoto && (
                      <button
                        onClick={handleRemovePhoto}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold px-2.5 py-2.5 rounded-xl transition cursor-pointer"
                        title="Remove uploaded photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => window.print()}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print ID</span>
                    </button>
                    <button
                      onClick={() => triggerDownload('Digital ID Card Badge')}
                      className="bg-[#74111d] hover:bg-[#5e0c15] text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-sm shadow-red-600/20"
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

                    {/* Badge Header with Brand Red Gradient */}
                    <div className="bg-gradient-to-br from-[#74111d] via-[#851421] to-[#590d16] p-6 text-white text-center relative overflow-hidden">
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
                      
                      {/* Photo Avatar with Upload Trigger */}
                      <div className="relative inline-block group">
                        <div 
                          onClick={() => photoInputRef.current?.click()}
                          className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-700 text-white text-2xl font-black flex items-center justify-center mx-auto shadow-md border-4 border-white overflow-hidden cursor-pointer relative"
                          title="Click to change photo"
                        >
                          {agentPhoto ? (
                            <img 
                              src={agentPhoto} 
                              alt={agentProfile.name} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            getInitials(agentProfile.name)
                          )}

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-[10px] font-bold">
                            <Camera className="w-5 h-5 mb-0.5" />
                            <span>Upload</span>
                          </div>
                        </div>

                        {/* Camera Floating Button */}
                        <button
                          type="button"
                          onClick={() => photoInputRef.current?.click()}
                          className="absolute -bottom-2 -right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl border-2 border-white shadow-md transition cursor-pointer"
                          title="Upload / Change Photo"
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </button>

                        {/* Active Credential Badge */}
                        <div className="absolute -top-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-xs" title="Active Credential">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* Name & Role */}
                      <div>
                        <h2 className="text-xl font-black text-slate-900">{agentProfile.name}</h2>
                        <p className="text-xs font-bold text-red-600 mt-0.5">{agentProfile.role}</p>
                        <p className="text-[11px] text-slate-400 font-mono mt-1">ID: {agentProfile.id}</p>
                      </div>

                      {/* Security IC Chip & Authenticity Badge (Replaces old QR code) */}
                      <div className="bg-gradient-to-r from-amber-50 via-slate-50 to-amber-50/60 p-4 border border-amber-200/80 rounded-2xl flex items-center justify-between shadow-xs">
                        <div className="flex items-center space-x-3">
                          {/* Gold Metallic Smart Chip Graphic */}
                          <div className="w-12 h-9 rounded-lg bg-gradient-to-br from-amber-300 via-amber-200 to-amber-400 border border-amber-500/40 p-1.5 shadow-inner relative flex flex-col justify-between overflow-hidden">
                            <div className="w-full h-0.5 bg-amber-600/40"></div>
                            <div className="flex justify-between items-center h-full my-0.5">
                              <div className="w-2.5 h-full border-r border-amber-600/40"></div>
                              <div className="w-2.5 h-full border-l border-amber-600/40"></div>
                            </div>
                            <div className="w-full h-0.5 bg-amber-600/40"></div>
                          </div>
                          <div className="text-left">
                            <div className="flex items-center space-x-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-[11px] font-black uppercase tracking-wider text-slate-800">Tamper-Proof ID</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">SEC-UID: BX9042-AUTH</span>
                          </div>
                        </div>
                        {/* Holographic Seal badge */}
                        <div className="px-2.5 py-1 bg-gradient-to-tr from-amber-500 to-amber-300 text-amber-950 text-[9px] font-black uppercase rounded-lg shadow-xs tracking-wider flex items-center space-x-1 border border-amber-300">
                          <Award className="w-3 h-3 text-amber-900" />
                          <span>Verified</span>
                        </div>
                      </div>

                      {/* Security Barcode Strip & Digital Signature Block */}
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                        {/* Barcode representation */}
                        <div className="flex flex-col items-center justify-center space-y-1">
                          <div className="h-8 flex items-center space-x-[2px] opacity-80 px-2 py-0.5 bg-white rounded border border-slate-200">
                            {[4,2,6,1,3,5,2,4,1,6,3,2,5,1,4,3,2,6,1,5,2,4,3,1,5,2,6,3,1,4,2,5].map((w, i) => (
                              <div 
                                key={i} 
                                className={`h-full bg-slate-900 ${i % 3 === 0 ? 'opacity-100' : 'opacity-70'}`} 
                                style={{ width: `${(w % 3) + 1.5}px` }}
                              />
                            ))}
                          </div>
                          <span className="font-mono text-[9px] tracking-widest text-slate-500 font-bold uppercase">
                            AUTH-SERIAL: {agentProfile.id} • SECURE-NFC
                          </span>
                        </div>

                        {/* Authorizing Signature */}
                        <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                          <div className="text-left">
                            <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold block">Authorizing Officer</span>
                            <span className="font-serif italic text-xs font-bold text-slate-800 tracking-wide select-none">
                              K. Singhania
                            </span>
                            <span className="text-[8px] text-slate-400 block -mt-0.5">Dir. Field Operations</span>
                          </div>
                          <div className="w-10 h-10 rounded-full border border-red-200 bg-red-50 flex items-center justify-center text-[7px] font-black text-red-600 text-center leading-tight uppercase p-1">
                            OFFICIAL SEAL
                          </div>
                        </div>
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
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#74111d] to-[#851421] text-white font-black text-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#74111d]/30 overflow-hidden border-2 border-white">
                  {agentPhoto ? (
                    <img src={agentPhoto} alt={agentProfile.name} className="w-full h-full object-cover" />
                  ) : (
                    getInitials(agentProfile.name)
                  )}
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

// Shared in-memory and file-backed store for live reward redemptions
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const REDEMPTIONS_FILE = path.join(DATA_DIR, 'redemptions.json');

// Initial pending redemptions matching demo state
const defaultPending = [
  {
    id: 'rem_1',
    customerName: 'Sumit',
    customerId: 'ID: LQR-8F4A29',
    rewardTitle: '30% OFF on Next Purchase',
    stamps: '5/5 Stamps completed',
    timeAgo: 'Today, 2:18 PM',
    expiresIn: 'Expires: 30 Jul 2026',
    voucherType: '30',
    avatarBg: 'bg-emerald-500',
    status: 'PENDING',
    storeSlug: 'ka-feen'
  },
  {
    id: 'rem_2',
    customerName: 'Ajeet',
    customerId: 'ID: LQR-3K9D21',
    rewardTitle: 'Free Coffee on Any Purchase',
    stamps: '5/5 Stamps completed',
    timeAgo: 'Today, 12:45 PM',
    expiresIn: 'Expires: 28 Jul 2026',
    voucherType: 'coffee',
    avatarBg: 'bg-indigo-500',
    status: 'PENDING',
    storeSlug: 'ka-feen'
  },
  {
    id: 'rem_3',
    customerName: 'Pooja',
    customerId: 'ID: LQR-7H2M56',
    rewardTitle: '20% OFF on Next Purchase',
    stamps: '5/5 Stamps completed',
    timeAgo: 'Yesterday, 6:30 PM',
    expiresIn: 'Expires: 27 Jul 2026',
    voucherType: '20',
    avatarBg: 'bg-amber-500',
    status: 'PENDING',
    storeSlug: 'ka-feen'
  }
];

let pendingList = [...defaultPending];
let approvedList = [
  {
    id: 'rem_4',
    customerName: 'Rohit',
    customerId: 'ID: LQR-1A2B34',
    rewardTitle: 'Free Coffee on Any Purchase',
    approvedAt: '11:20 AM',
    approvedDate: '20 May 2026',
    voucherType: 'coffee',
    avatarBg: 'bg-purple-500',
    status: 'APPROVED'
  }
];
let declinedList = [];

// Persistence
function saveToFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(REDEMPTIONS_FILE, JSON.stringify({ pending: pendingList, approved: approvedList, declined: declinedList }, null, 2));
  } catch (err) {
    console.warn('Could not save redemptions to disk:', err.message);
  }
}

function loadFromFile() {
  try {
    if (fs.existsSync(REDEMPTIONS_FILE)) {
      const data = JSON.parse(fs.readFileSync(REDEMPTIONS_FILE, 'utf8'));
      if (Array.isArray(data.pending)) pendingList = data.pending;
      if (Array.isArray(data.approved)) approvedList = data.approved;
      if (Array.isArray(data.declined)) declinedList = data.declined;
    }
  } catch (err) {
    console.warn('Could not load redemptions from disk:', err.message);
  }
}

loadFromFile();

function getPending() {
  return pendingList;
}

function getApproved() {
  return approvedList;
}

function getDeclined() {
  return declinedList;
}

function addPendingClaim(claim) {
  const cleanId = String(claim.customerId || 'LQR-8F4A29').replace(/^ID:\s*/, '').trim();
  const existingIdx = pendingList.findIndex(p => 
    p.id === claim.id || 
    (p.customerId && p.customerId.includes(cleanId) && p.rewardTitle === claim.rewardTitle)
  );

  const newClaim = {
    id: claim.id || `rem_${Date.now()}`,
    customerName: claim.customerName || 'Customer',
    customerId: claim.customerId?.startsWith('ID:') ? claim.customerId : `ID: ${cleanId}`,
    rewardTitle: claim.rewardTitle || '30% OFF on Next Purchase',
    stamps: claim.stamps || '5/5 Stamps completed',
    timeAgo: 'Just now',
    expiresIn: claim.expiresIn || 'Expires: 30 Jul 2026',
    voucherType: claim.voucherType || '30',
    avatarBg: claim.avatarBg || 'bg-emerald-500',
    status: 'PENDING',
    storeSlug: claim.storeSlug || 'ka-feen',
    requestedAt: new Date().toISOString()
  };

  if (existingIdx >= 0) {
    pendingList[existingIdx] = newClaim;
  } else {
    pendingList.unshift(newClaim);
  }
  saveToFile();
  return newClaim;
}

function approveClaim(claimId, customerId) {
  const cleanCustomer = customerId ? String(customerId).replace(/^ID:\s*/, '').trim() : '';
  const idx = pendingList.findIndex(p => 
    (claimId && p.id === claimId) || 
    (cleanCustomer && p.customerId && p.customerId.includes(cleanCustomer))
  );

  if (idx === -1) {
    // Check if already approved
    const already = approvedList.find(a => 
      (claimId && a.id === claimId) || 
      (cleanCustomer && a.customerId && a.customerId.includes(cleanCustomer))
    );
    if (already) return already;
    return null;
  }

  const item = pendingList.splice(idx, 1)[0];
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const approvedItem = {
    ...item,
    status: 'APPROVED',
    approvedAt: timeStr,
    approvedDate: dateStr,
    approvedTimestamp: now.toISOString()
  };

  approvedList.unshift(approvedItem);
  saveToFile();
  return approvedItem;
}

function declineClaim(claimId, customerId, reason = 'Declined by Merchant') {
  const cleanCustomer = customerId ? String(customerId).replace(/^ID:\s*/, '').trim() : '';
  const idx = pendingList.findIndex(p => 
    (claimId && p.id === claimId) || 
    (cleanCustomer && p.customerId && p.customerId.includes(cleanCustomer))
  );

  if (idx === -1) return null;

  const item = pendingList.splice(idx, 1)[0];
  const declinedItem = {
    ...item,
    status: 'DECLINED',
    reason,
    declinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  declinedList.unshift(declinedItem);
  saveToFile();
  return declinedItem;
}

function checkClaimStatus(customerId, claimId) {
  const cleanCustomer = customerId ? String(customerId).replace(/^ID:\s*/, '').trim() : '';
  
  // Check approved first
  const approved = approvedList.find(a => 
    (claimId && a.id === claimId) || 
    (cleanCustomer && a.customerId && a.customerId.includes(cleanCustomer))
  );
  if (approved) {
    return { status: 'APPROVED', claim: approved };
  }

  // Check declined
  const declined = declinedList.find(d => 
    (claimId && d.id === claimId) || 
    (cleanCustomer && d.customerId && d.customerId.includes(cleanCustomer))
  );
  if (declined) {
    return { status: 'DECLINED', claim: declined };
  }

  // Check pending
  const pending = pendingList.find(p => 
    (claimId && p.id === claimId) || 
    (cleanCustomer && p.customerId && p.customerId.includes(cleanCustomer))
  );
  if (pending) {
    return { status: 'PENDING', claim: pending };
  }

  return { status: 'NOT_FOUND' };
}

module.exports = {
  getPending,
  getApproved,
  getDeclined,
  addPendingClaim,
  approveClaim,
  declineClaim,
  checkClaimStatus
};

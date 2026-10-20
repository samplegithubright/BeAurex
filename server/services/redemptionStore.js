// Shared in-memory and file-backed store for live reward redemptions
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const REDEMPTIONS_FILE = path.join(DATA_DIR, 'redemptions.json');

// Initial pending redemptions matching demo state (Both Aurex Coin requests and Offer claims)
const defaultPending = [
  {
    id: 'rem_1',
    requestType: 'offer',
    customerName: 'Sumit',
    customerId: 'ID: LQR-8F4A29',
    rewardTitle: '30% OFF on Next Purchase',
    stamps: '5/5 Aurex Coins completed',
    timeAgo: 'Today, 2:18 PM',
    expiresIn: 'Expires: 30 Jul 2026',
    voucherType: '30',
    avatarBg: 'bg-emerald-500',
    status: 'PENDING',
    storeSlug: 'ka-feen'
  },
  {
    id: 'rem_2',
    requestType: 'offer',
    customerName: 'Ajeet',
    customerId: 'ID: LQR-3K9D21',
    rewardTitle: 'Free Coffee on Any Purchase',
    stamps: '5/5 Aurex Coins completed',
    timeAgo: 'Today, 12:45 PM',
    expiresIn: 'Expires: 28 Jul 2026',
    voucherType: 'coffee',
    avatarBg: 'bg-indigo-500',
    status: 'PENDING',
    storeSlug: 'ka-feen'
  },
  {
    id: 'rem_3',
    requestType: 'coin',
    customerName: 'Rohan Sharma',
    customerId: 'ID: BX-8F4A29',
    rewardTitle: 'Wants to collect 1 Aurex Coin',
    coins: 1,
    stamps: '1 Aurex Coin Requested',
    timeAgo: 'Today, 11:30 AM',
    expiresIn: 'Aurex Coin Request',
    voucherType: 'coin',
    avatarBg: 'bg-amber-500',
    status: 'PENDING',
    storeSlug: 'ka-feen'
  }
];

let pendingList = [...defaultPending];
let approvedList = [
  {
    id: 'rem_4',
    requestType: 'offer',
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

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  const createdAtIso = claim.createdAt || claim.requestedAt || now.toISOString();

  const genClaimNum = Math.floor(1000000 + Math.random() * 9000000);
  const genClaimId = `CLM${genClaimNum}`;

  const newClaim = {
    id: claim.id || genClaimId,
    claimId: claim.claimId || claim.id || genClaimId,
    requestType: claim.requestType || (claim.voucherType === 'coin' || claim.coins ? 'coin' : 'offer'),
    coins: claim.coins || (claim.voucherType === 'coin' ? 1 : undefined),
    customerName: claim.customerName || 'Customer',
    customerId: claim.customerId?.startsWith('ID:') ? claim.customerId : `ID: ${cleanId}`,
    rewardTitle: claim.rewardTitle || (claim.coins ? 'Wants to collect 1 Aurex Coin' : '30% OFF on Next Purchase'),
    stamps: claim.stamps || (claim.coins ? '1 Aurex Coin Requested' : '5/5 Aurex Coins completed'),
    timeAgo: claim.timeAgo && claim.timeAgo !== 'Just now' ? claim.timeAgo : `${dateStr}, ${timeStr}`,
    createdDate: claim.createdDate || dateStr,
    createdTime: claim.createdTime || timeStr,
    createdAt: createdAtIso,
    requestedAt: createdAtIso,
    expiresIn: claim.expiresIn || (claim.coins ? 'Aurex Coin Request' : 'Expires: 30 Jul 2026'),
    voucherType: claim.voucherType || (claim.coins ? 'coin' : '30'),
    avatarBg: claim.avatarBg || (claim.coins ? 'bg-amber-500' : 'bg-emerald-500'),
    status: 'PENDING',
    storeSlug: claim.storeSlug || 'ka-feen'
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
    approvedAt: `Today, ${timeStr}`,
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
  const targetClaimId = claimId ? String(claimId).trim() : '';
  
  if (targetClaimId) {
    // 1. Check pending first - if it's still pending, it is NEVER approved!
    const pending = pendingList.find(p => p.id === targetClaimId || p.claimId === targetClaimId);
    if (pending) {
      return { status: 'PENDING', claim: pending };
    }

    // 2. Check approved with exact claimId
    const approved = approvedList.find(a => a.id === targetClaimId || a.claimId === targetClaimId);
    if (approved) {
      return { status: 'APPROVED', claim: approved };
    }

    // 3. Check declined with exact claimId
    const declined = declinedList.find(d => d.id === targetClaimId || d.claimId === targetClaimId);
    if (declined) {
      return { status: 'DECLINED', claim: declined };
    }

    return { status: 'NOT_FOUND' };
  }

  // If no claimId provided, only check if there is an active pending item
  if (cleanCustomer) {
    const pending = pendingList.find(p => p.customerId && p.customerId.includes(cleanCustomer));
    if (pending) {
      return { status: 'PENDING', claim: pending };
    }
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

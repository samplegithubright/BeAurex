// Shared in-memory and file-backed store for live reward redemptions
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const REDEMPTIONS_FILE = path.join(DATA_DIR, 'redemptions.json');

// Clean initial pending list (no hardcoded mock claims leaking into merchant dashboards)
let pendingList = [];
let approvedList = [];
let declinedList = [];

// Helper to filter items strictly by merchantId or storeSlug (strict isolation per merchant)
function filterByMerchant(list, merchantId, storeSlug) {
  if (!merchantId && !storeSlug) return [];
  const cleanTargetSlug = storeSlug ? String(storeSlug).toLowerCase().replace(/[^a-z0-9]/g, '') : '';
  const cleanMid = merchantId ? String(merchantId).trim() : '';

  return list.filter(item => {
    const itemMid = item.merchantId ? String(item.merchantId).trim() : '';
    const itemSlug = item.storeSlug ? String(item.storeSlug).toLowerCase().replace(/[^a-z0-9]/g, '') : '';

    // 1. If both merchantIds exist, strict ID comparison is mandatory!
    if (cleanMid && itemMid) {
      return cleanMid === itemMid;
    }

    // 2. If one side is missing merchantId, match by storeSlug (excluding generic fallback slugs)
    if (cleanTargetSlug && itemSlug && cleanTargetSlug === itemSlug) {
      if (cleanTargetSlug !== 'store' && cleanTargetSlug !== 'default' && cleanTargetSlug !== 'kafeen-cafe') {
        return true;
      }
    }

    return false;
  });
}

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
      // Filter out any legacy dummy records from previous testing
      if (Array.isArray(data.pending)) {
        pendingList = data.pending.filter(p => p.id !== 'rem_1' && p.id !== 'rem_2' && p.id !== 'rem_3');
      }
      if (Array.isArray(data.approved)) {
        approvedList = data.approved.filter(a => a.id !== 'rem_4');
      }
      if (Array.isArray(data.declined)) declinedList = data.declined;
    }
  } catch (err) {
    console.warn('Could not load redemptions from disk:', err.message);
  }
}

loadFromFile();

function getPending(merchantId, storeSlug) {
  return filterByMerchant(pendingList, merchantId, storeSlug);
}

function getApproved(merchantId, storeSlug) {
  return filterByMerchant(approvedList, merchantId, storeSlug);
}

function getDeclined(merchantId, storeSlug) {
  return filterByMerchant(declinedList, merchantId, storeSlug);
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
    coinsRequired: Number(claim.coinsRequired || claim.stampsRequired) || (claim.requestType === 'offer' ? 5 : undefined),
    stampsRequired: Number(claim.stampsRequired || claim.coinsRequired) || (claim.requestType === 'offer' ? 5 : undefined),
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
    storeSlug: claim.storeSlug || '',
    merchantId: claim.merchantId || null,
    storeName: claim.storeName || '',
    category: claim.category || ''
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
  const targetId = claimId ? String(claimId).trim() : '';

  const idx = pendingList.findIndex(p => 
    (targetId && (p.id === targetId || p.claimId === targetId)) || 
    (!targetId && cleanCustomer && p.customerId && (p.customerId.replace(/^ID:\s*/, '').trim() === cleanCustomer || p.customerId.includes(cleanCustomer)))
  );

  if (idx === -1) {
    // Check if already approved
    const already = approvedList.find(a => 
      (targetId && (a.id === targetId || a.claimId === targetId)) || 
      (!targetId && cleanCustomer && a.customerId && (a.customerId.replace(/^ID:\s*/, '').trim() === cleanCustomer || a.customerId.includes(cleanCustomer)))
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
    approvedTimestamp: now.toISOString(),
    coinsRequired: item.coinsRequired || item.stampsRequired || (item.requestType === 'offer' ? 5 : undefined),
    coinsDeducted: item.requestType === 'offer' ? (item.coinsRequired || item.stampsRequired || 5) : 0,
    coinsAdded: item.requestType === 'coin' ? (item.coins || 1) : 0
  };

  approvedList.unshift(approvedItem);
  saveToFile();
  return approvedItem;
}

function declineClaim(claimId, customerId, reason = 'Declined by Merchant') {
  const cleanCustomer = customerId ? String(customerId).replace(/^ID:\s*/, '').trim() : '';
  const targetId = claimId ? String(claimId).trim() : '';

  const idx = pendingList.findIndex(p => 
    (targetId && (p.id === targetId || p.claimId === targetId)) || 
    (!targetId && cleanCustomer && p.customerId && (p.customerId.replace(/^ID:\s*/, '').trim() === cleanCustomer || p.customerId.includes(cleanCustomer)))
  );

  if (idx === -1) return null;

  const item = pendingList.splice(idx, 1)[0];
  const declinedItem = {
    ...item,
    status: 'DECLINED',
    reason,
    declinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    declinedTimestamp: new Date().toISOString()
  };

  declinedList.unshift(declinedItem);
  saveToFile();
  return declinedItem;
}

function checkClaimStatus(customerId, claimId) {
  const cleanCustomer = customerId ? String(customerId).replace(/^ID:\s*/, '').trim() : '';
  const targetClaimId = claimId ? String(claimId).trim() : '';
  
  // 1. Check pending first - if it's still pending, it is NEVER approved!
  if (targetClaimId) {
    const pending = pendingList.find(p => p.id === targetClaimId || p.claimId === targetClaimId);
    if (pending) {
      return { status: 'PENDING', claim: pending };
    }
  } else if (cleanCustomer) {
    const pending = pendingList.find(p => p.customerId && (p.customerId.replace(/^ID:\s*/, '').trim() === cleanCustomer || p.customerId.includes(cleanCustomer)));
    if (pending) {
      return { status: 'PENDING', claim: pending };
    }
  }

  // 2. Check approved
  if (targetClaimId) {
    const approved = approvedList.find(a => a.id === targetClaimId || a.claimId === targetClaimId);
    if (approved) {
      return { status: 'APPROVED', claim: approved };
    }
  } else if (cleanCustomer) {
    // Only return recent approvals (within the last 60 seconds) to prevent resurrecting old claims
    const approved = approvedList.find(a => {
      const match = a.customerId && (a.customerId.replace(/^ID:\s*/, '').trim() === cleanCustomer || a.customerId.includes(cleanCustomer));
      if (!match) return false;
      const ts = a.approvedTimestamp ? new Date(a.approvedTimestamp).getTime() : 0;
      return Date.now() - ts < 60000;
    });
    if (approved) {
      return { status: 'APPROVED', claim: approved };
    }
  }

  // 3. Check declined
  if (targetClaimId) {
    const declined = declinedList.find(d => d.id === targetClaimId || d.claimId === targetClaimId);
    if (declined) {
      return { status: 'DECLINED', claim: declined };
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

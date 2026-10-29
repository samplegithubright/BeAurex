/**
 * Business Name Normalization Utility
 * Ensures consistent Title Case display across all customer cards, vouchers,
 * merchant headers, and approval requests while stripping random slug numbers
 * anywhere they occur (e.g., 'adobe-1865' -> 'Adobe', 'adobe-1232' -> 'Adobe',
 * 'adobe1234' -> 'Adobe', 'argwal seet2344' -> 'Argwal Seet',
 * 'adobe-1865 Reward Voucher' -> 'Adobe Reward Voucher').
 */

function formatBusinessName(name) {
  if (!name || typeof name !== 'string') return '';
  let cleaned = name.trim();
  // 1. Remove separator + numbers attached to a word: e.g. adobe-1865, adobe-1232, adobe_1865, adobe 1865
  cleaned = cleaned.replace(/([a-zA-Z]{2,})[-_#\s]+[0-9]{2,}(?=\s|$|[-_])/g, (m, p1) => p1);
  // 2. Remove digits stuck directly to word: e.g. adobe1234, seet2344, abode1234
  cleaned = cleaned.replace(/([a-zA-Z]{2,})[0-9]{3,}(?=\s|$|[-_])/g, (m, p1) => p1);
  // 3. Remove standalone trailing numbers
  cleaned = cleaned.replace(/[-_#\s]+[0-9]{2,}$/, '');
  // 4. Replace hyphens and underscores with spaces
  cleaned = cleaned.replace(/[-_]+/g, ' ').trim();
  // 5. Title Case words
  return cleaned
    .split(/\s+/)
    .map(w => w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : '')
    .join(' ');
}

module.exports = { formatBusinessName };

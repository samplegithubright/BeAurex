# LoyalQR — Master Product Requirements Document (PRD) & Architecture Plan
**Turn Every Customer Visit Into A Repeat Customer**

*Version:* 2.0  
*Status:* Approved & Production-Ready  
*Brand Standard:* LoyalQR  
*Target Market:* Indian Offline Retail, F&B, Salons, Supermarkets, & Service Businesses  
*Core Tech Stack:* Modern Responsive Frontend (Tailwind CSS, HTML5 Canvas Scratch Engine), RESTful Backend Architecture, Multi-tenant Data Schema, Role-Based Access Control (RBAC).

---

## 1. Executive Summary & Vision

### 1.1 The Market Problem
Traditional offline brick-and-mortar stores across India face an existential retention crisis:
- **The Retention Leak:** Walk-in customers buy once, pay via cash or UPI, and walk away. Store owners have **zero contact information** or mechanism to re-engage them.
- **Aggressive App Competition:** Quick-commerce and delivery giants heavily subsidize discounts and use aggressive push notifications to capture neighborhood customers.
- **Profit-Bleeding Blanket Discounts:** Merchants display flat counter discounts (e.g. 10% off) that cut into daily operating margins without building repeat customer habits.
- **Customer Resistance to App Downloads:** Customers refuse to download heavy mobile apps or fill out cumbersome 10-field paper forms just to earn points at a local store.

### 1.2 The LoyalQR Solution
**LoyalQR** is a zero-app-install, QR-driven customer retention and gamification ecosystem:
1. **Zero App Download:** Customers simply scan the store's counter QR code using their default smartphone camera or UPI scanner. It opens instantly in mobile Chrome/Safari.
2. **High-Dopamine Gamification:** Customers scratch an interactive digital scratch card on their phone right after their purchase, unlocking instant personalized rewards for their *next* visit.
3. **100% Privacy & Zero Spam:** No intrusive phone spam or cold calls. Isolated, secure customer profiles build mutual trust.
4. **Autonomous Merchant Machine:** Store owners print an elegant table/counter standee once, and the automated system handles loyalty tiers, repeat visit nudges, and fraud-proof voucher redemptions.

---

## 2. Brand Identity & Design System Specification

Derived from the verified UI design specifications (Screens `ADM-AUTH-001` through `ADM-AUTH-004`):

### 2.1 Color Palette
| Token | Hex / Class | Semantic Role |
| :--- | :--- | :--- |
| **Brand Primary Red** | `#C8102E` / `#B91C1C` / `bg-red-600` | Primary buttons, active tabs, header logos, key highlight text |
| **Brand Crimson Deep** | `#991B1B` / `#7F1D1D` | Gradient anchors on left split-screen brand hero, hover states |
| **Dark Neutral** | `#0F172A` / `#1E293B` / `bg-slate-900` | Primary typography, top trust bars, dark cards, footer backgrounds |
| **Subtle Slate** | `#F8FAFC` / `#F1F5F9` | Page backgrounds, input field backgrounds, neutral card fills |
| **Border Neutral** | `#E2E8F0` / `border-slate-200` | Clean structural dividing borders, form input borders |
| **Success Emerald** | `#059669` / `#10B981` | Free trial indicators, savings callouts, verification badges |
| **Warning / Best Value** | `#D97706` / `#F59E0B` | Legacy pricing tier highlight, timer alerts, scratch gold badges |

### 2.2 Split-Screen Design Language
As standardized across all LoyalQR web portals:
- **Left Hero Panel (Brand & Trust Anchor)**:
  - Deep Crimson background with subtle dot matrix overlay.
  - White LoyalQR logo with distinctive QR icon mark.
  - Bold headline (`font-black`) + contextual subheadings.
  - Highlighting icon feature badges in white translucent pills (e.g., *Secure & Reliable*, *Real-time Insights*, *Complete Control*, *Always Accessible*).
  - 3D-styled security illustration (Shield lock, Flying paper plane, Phone verification graphic).
  - Copyright and compliance statement.
- **Right Action Card (User Interaction)**:
  - Clean white canvas (`bg-white`) with generous padding (`p-8 sm:p-10`).
  - Circular badge icon with contextual symbol (padlock, envelope, key).
  - Clear section title (`font-black text-slate-900`) and guiding subtext.
  - Modern form inputs with icon prefixes, subtle border, focus rings in primary red.
  - Prominent primary action button in solid red (`bg-red-600 hover:bg-red-700`).
  - Outlined secondary action button for navigation (`border-red-600 text-red-600`).
  - Legal disclaimer / helper links.

---

## 3. Role-Based Access Control (RBAC)

The platform supports 3 primary user personas:

### 3.1 Super Admin (`ADM`)
- Platform-wide telemetry: active merchants, total customer scans, vouchers generated vs redeemed.
- Merchant subscription management (Trial active, Standard, Professional, Legacy).
- System security, audit logging, rate limiting, and fraud rule tuning.

### 3.2 Merchant / Store Owner (`MER`)
- **Self-Service Onboarding:** 2-minute registration with Business Name, Phone, and Email; instant 2-day unrestricted trial activation.
- **Counter QR Standee Generator:** Instant generation of printable, branded counter standees with custom store name and QR code.
- **Reward Campaign Engine:** Configure scratch card win rules:
  - Reward types: Flat ₹ Discount, % Off Next Bill, Free Item/Add-on, Mystery BOGO.
  - Minimum purchase condition (e.g. *Valid on orders above ₹299*).
  - Expiry windows (e.g. *Valid for 7 days from issue*).
  - Probability weighting (e.g. 70% chance of 15% off, 25% chance of ₹100 voucher, 5% jackpot).
- **In-Store Redemption Scanner:** Quick counter verification via 4-digit code entry or merchant camera scan to mark vouchers as "REDEEMED".
- **Customer CRM:** Track visit frequencies, identify VIP regulars, and re-engage dormant customers.

### 3.3 Customer / End-User (`CUS`)
- **No App Required:** Opens directly in standard mobile browser (Chrome, Safari, Firefox).
- **Frictionless Phone Auth:** 10-digit mobile number + 6-digit OTP verification.
- **High-Dopamine Scratch Card:** Realistic canvas scratch-off action revealing secret rewards, followed by confetti celebration.
- **Persistent Digital Wallet:** Saved rewards with visual countdown timer, clear redemption terms, and dynamic redemption QR code.

---

## 4. UI Specification: Detailed Screen Catalog (Screens 1 to 18)

Below is the design catalog, including the 4 authentication screens from the UI wireframes:

### Screen 1 of 18: Admin & Merchant Login (`ADM-AUTH-001`)
- **Purpose:** Securely authenticate store owners and platform administrators.
- **Layout:** Split-screen layout (Crimson brand features left, clean login card right).
- **UI Elements:**
  - Email Address input (`type="email"` with leading mail icon).
  - Mobile Number input (`type="tel"` with leading phone icon).
  - Password input (`type="password"` with lock icon and eye toggle).
  - "Remember me" checkbox + "Forgot Password?" hyperlink.
  - Primary CTA: `-> Login` (Solid Red).
  - Secondary CTA: `Secure Admin Access` (Outlined Red with Shield).
- **Validations:**
  - Email required & valid email format.
  - Mobile number required, exactly 10 digits (`/^[6-9]\d{9}$/`).
  - Password minimum 8 characters.
- **Business Rules:**
  - Account must be in active status (or within valid trial period).
  - Rate limit: max 5 failed attempts per 15 minutes before temporary lock.

### Screen 2 of 18: Forgot Password (`ADM-AUTH-002`)
- **Purpose:** Request a secure One-Time Password (OTP) to initiate password reset.
- **Layout:** Split-screen with paper plane and envelope illustration on left; lock icon badge on right.
- **UI Elements:**
  - Registered Email Address field.
  - Registered Mobile Number field.
  - Primary CTA: `Send OTP` with paper plane icon.
  - Secondary CTA: `Back to Login`.
- **Validations & Rules:**
  - System checks that both email and mobile correspond to the same registered account.
  - OTP generated is valid for exactly 10 minutes.
  - Resend cooldown locked for 60 seconds.

### Screen 3 of 18: Verify OTP (`ADM-AUTH-003`)
- **Purpose:** Verify the 6-digit OTP sent via SMS to the user's mobile device.
- **Layout:** Split-screen with phone shield illustration on left; envelope lock badge on right.
- **UI Elements:**
  - Masked destination indicator (e.g. `+91 98765 43210`).
  - 6 individual numeric OTP input boxes with auto-focus and auto-advance.
  - Real-time countdown timer: `Didn't receive the OTP? Resend OTP (00:45)`.
  - Primary CTA: `Verify OTP` with shield checkmark icon.
  - Secondary CTA: `Back to Forgot Password`.
- **Validations & Rules:**
  - Only numeric digits allowed.
  - Auto-submits or enables button once all 6 digits are entered.
  - Maximum 5 attempts allowed; on 5th failure, session terminates.

### Screen 4 of 18: Set New Password (`ADM-AUTH-004`)
- **Purpose:** Create and enforce a new strong password following security protocols.
- **Layout:** Split-screen with 3D star shield graphic on left; key lock badge on right.
- **UI Elements:**
  - "New Password" field with eye toggle.
  - Real-time Password Strength meter (`Weak` / `Medium` / `Strong`).
  - "Confirm New Password" field with live match indicator.
  - Live Checklist of Password Requirements:
    - [x] Minimum 8 characters
    - [x] At least 1 uppercase letter (A-Z)
    - [x] At least 1 lowercase letter (a-z)
    - [x] At least 1 number (0-9)
    - [x] At least 1 special character (!@#$%^&*)
  - Primary CTA: `Save New Password` with lock icon.
  - Secondary CTA: `Back to Login`.

### Screens 5 to 18: Operational & Customer Flows
- **Screen 5 (`MER-REG-001`): Merchant Onboarding & Business Profile**
  - Business Name, Business Category (Restaurant, Retail, Salon, Grocery, etc.), City, GST (optional), 2-Day Trial auto-activation.
- **Screen 6 (`MER-DASH-001`): Merchant Central Overview**
  - Live performance cards: Total Visits, Repeat Rate (%), Active Rewards, Redeemed Value.
- **Screen 7 (`MER-QR-001`): Counter Standee Designer & PDF Exporter**
  - Instant high-resolution print-ready counter standee download (A5 & A6 acrylic size) with custom store branding.
- **Screen 8 (`MER-CAM-001`): Scratch Card Campaign Rule Builder**
  - Gamification probability settings, discount thresholds, expiration rules.
- **Screen 9 (`MER-POS-001`): Fast Counter Redemption Terminal**
  - Merchant enters customer's 4-digit voucher PIN or scans voucher QR code to instantly redeem and log sales value.
- **Screen 10 (`MER-CRM-001`): Customer Visit Ledger & Loyalty Segmenter**
  - Filter by "First-time Visitors", "Loyal Regulars (3+ visits)", "At-Risk (No visit in 30 days)".
- **Screen 11 (`MER-SUB-001`): Plan Management & Manual Activation**
  - Standard (₹24,000/yr), Professional (₹49,000/3yr), Legacy (₹75,000 lifetime) with UPI QR payment link & invoice download.
- **Screen 12 (`CUS-SCAN-001`): In-Store Counter QR Welcome Screen**
  - Branded greeting: *"Welcome to [Store Name]! Claim your mystery scratch card reward."*
- **Screen 13 (`CUS-AUTH-001`): Quick 1-Click Mobile OTP Verification**
  - Seamless 10-digit phone verification with SMS auto-read support.
- **Screen 14 (`CUS-SCRATCH-001`): Interactive Scratch Card Canvas Engine**
  - Realistic metallic foil layer that erases on touch/drag, reveals reward at 45% scratched, and triggers full confetti explosion.
- **Screen 15 (`CUS-VOUCHER-001`): Reward Card & Countdown Timer**
  - Voucher card showing discount details, expiry date, terms, and counter redemption code.
- **Screen 16 (`CUS-WALLET-001`): Customer Rewards Locker**
  - List of all active, redeemed, and expired rewards across favorite local stores.
- **Screen 17 (`ADM-DASH-001`): Super Admin Master Control**
  - Global subscription telemetry, merchant verification, revenue metrics.
- **Screen 18 (`ADM-AUDIT-001`): Security & Anti-Fraud Audit Log**
  - Tracks suspicious multiple scans, IP velocities, and invalid OTP attempts.

---

## 5. Technical Architecture & Data Schema

### 5.1 System Architecture
- **Client Layer:** Static/SPA Jamstack architecture for ultra-fast loading over 4G/5G networks. Zero hydration delay for instant mobile camera scans.
- **State & Gamification Engine:** HTML5 Canvas API with composite operations (`destination-out`) to simulate physical silver foil scratch cards at 60 FPS on mobile browsers.
- **Security & Anti-Abuse:**
  - Token-based JWT authentication with 24-hour expiration.
  - SMS OTP via Indian DLT-compliant gateways (SMSCountry, MSG91, Twilio).
  - Rate limiting (Redis Token Bucket) for OTP generation (max 3 per 10 mins).
  - Scan Cooldown Engine: 12-hour per-device throttle to prevent discount spamming.

### 5.2 Core Data Models
- **`merchants`**: Store details, business category, phone, email, hashed credentials, subscription tier (`TRIAL`, `STANDARD`, `PROFESSIONAL`, `LEGACY`), trial expiration date.
- **`campaign_rewards`**: Title, discount type (`PERCENTAGE`, `FLAT_AMOUNT`, `FREE_ITEM`), minimum bill value, win probability weight, validity days.
- **`customers`**: Mobile phone, name, registration date, total lifetime visits.
- **`customer_scans`**: Timestamp, store ID, IP address, user agent, geolocation status.
- **`vouchers`**: Unique voucher code (e.g. `LQR-8492-91`), rapid counter PIN (4 digits), status (`UNSCRATCHED`, `ACTIVE`, `REDEEMED`, `EXPIRED`), expiry timestamp, redeemed timestamp.

---

## 6. Anti-Fraud & Fair Play Engine

To protect merchants against discount abuse:
1. **Device & Cooldown Throttling:** A customer can only claim 1 scratch card per merchant every 12 hours. Subsequent scans within this cooldown window show their existing active voucher instead of generating a new one.
2. **Dynamic 4-Digit Counter PIN:** Vouchers feature a secure 4-digit PIN that the merchant must verify on their dashboard before applying the discount to the POS bill.
3. **Single-Use Burn:** Once redeemed, the voucher status transitions to `REDEEMED` with an irreversible timestamp and cannot be claimed again.
4. **Geolocation Geofencing (Optional):** Merchants can enforce counter proximity verification so rewards cannot be farmed remotely via shared QR photos.

---

## 7. Pricing & Commercial Structure

Aligned with the approved landing page tiers:

| Tier | Price | Duration | Target Segment | Features Included |
| :--- | :--- | :--- | :--- | :--- |
| **2-Day Free Trial** | ₹0 | 2 Days | Every new business | Unlimited scans, full scratch card customization, instant counter QR |
| **Standard Plan** | ₹24,000 *(₹36,000 cut)* | 1 Year (₹2,000/mo) | Single outlet shops | Retention system, unlimited scans, standard support, standee designer |
| **Professional Plan** *(Most Popular)* | ₹49,000 *(₹72,000 cut)* | 3 Years (₹1,361/mo) | High-volume retail & cafes | Priority support, feature updates, multi-staff redemption pins, advanced analytics |
| **Legacy Plan** *(Best Value)* | ₹75,000 *(₹1,20,000 cut)* | Lifetime (One-time) | Established brands | Lifetime access, dedicated relationship manager, zero renewals, all future updates |

---

## 8. Implementation Verification Matrix

- [x] **Architecture & Requirements Document (`plan.md`):** Complete PRD with 18-screen catalog, data schemas, anti-abuse protocols, and tier specifications.
- [x] **Landing Page (`index.html`):** Fully integrated with the Crimson/Slate theme, Indian trust bar, 3 setup steps, comparison cards, 3 pricing tiers, and modals.
- [x] **Merchant Portal & Auth Suite (`merchant.html`):** High-fidelity implementation of Screens 1 to 4 (`ADM-AUTH-001` through `ADM-AUTH-004`) + interactive merchant workspace preview.
- [x] **Customer Mobile Experience (`customer.html`):** Mobile-optimized browser application with phone OTP, HTML5 interactive scratch card canvas, celebratory confetti, and digital voucher wallet.

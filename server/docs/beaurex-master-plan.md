You are a senior full-stack MERN architect, product designer, UI/UX engineer, security engineer, and DevOps engineer.

I want you to build a production-ready MERN-stack loyalty and rewards platform called:

BEAUREX

Tagline:
"REWARDING LOYALTY"

The platform should be inspired by the WORKFLOW and user journey of Druto.in, but DO NOT copy Druto's branding, source code, exact UI, text, assets, or visual design.

Use Druto only as a reference for the general product concept and workflow:
https://druto.in/

My brand is BeAurex and I have supplied brand assets/images that should be treated as the source of truth for the visual identity.

==================================================
1. BRAND IDENTITY
==================================================

Brand:
BeAurex

Tagline:
REWARDING LOYALTY

Primary visual identity:
- Strong red
- White
- Black/dark text where necessary
- Premium, modern, clean loyalty/rewards aesthetic
- Rounded cards
- Subtle shadows
- Modern SaaS dashboard design
- High contrast
- Mobile-first
- Professional Indian business/fintech-style UX

Use the supplied BeAurex assets:
- BeAurex QR
- App icon
- Social media icon
- Transparent Red Version/logo

IMPORTANT:
Do not recreate the logo using another design.
Use the supplied logo/assets wherever appropriate.

The uploaded brand assets are the source of truth for:
- Logo
- Symbol
- Brand colors
- Icon style
- QR presentation
- Overall visual language

Use the logo consistently in:
- Navbar
- Login/signup pages
- Merchant dashboard
- Customer dashboard
- Team dashboard
- Super admin
- QR pages
- Emails/notifications where applicable
- Footer

==================================================
2. CORE PRODUCT CONCEPT
==================================================

BeAurex is a QR-based loyalty and rewards platform.

The basic customer journey:

MERCHANT
    ↓
Creates loyalty program
    ↓
Creates/display BeAurex QR
    ↓
Customer visits merchant
    ↓
Customer scans QR
    ↓
Customer is identified/authenticated
    ↓
Customer earns BeAurex coins/rewards
    ↓
Transaction/visit is recorded
    ↓
Merchant sees activity
    ↓
Customer accumulates coins
    ↓
Customer redeems rewards
    ↓
Merchant verifies redemption
    ↓
Transaction completed

The system must support both merchants and customers.

==================================================
3. FOUR DIFFERENT APPLICATION EXPERIENCES
==================================================

The platform must have FOUR major dashboard/application areas.

A. MERCHANT DASHBOARD

B. CUSTOMER DASHBOARD

C. TEAM DASHBOARD

D. SUPER ADMIN DASHBOARD

Architecture should allow all four experiences to share the same backend/API/database while having separate route groups, permissions, navigation, and UI.

==================================================
4. DOMAIN / ROUTING ARCHITECTURE
==================================================

Main public website:

https://domain.com/

Merchant:

https://domain.com/merchant
or preferably:
https://merchant.domain.com/

Customer:

https://domain.com/customer
or:
https://app.domain.com/

Team:

https://team.domain.com/

Super Admin:

https://domain.com/admin

The production architecture should support subdomains.

For development, make it easy to use paths such as:

/merchant
/customer
/team
/admin

while preparing the application for production subdomains.

IMPORTANT:

The Team application must be designed so that:

team.domain.com

opens the Team dashboard.

The Super Admin application must be accessible at:

domain.com/admin

Do not expose admin functionality to normal users.

==================================================
5. PUBLIC WEBSITE
==================================================

Create a polished public landing website for BeAurex.

The public website should explain:

- What BeAurex is
- How the loyalty system works
- Benefits for merchants
- Benefits for customers
- QR-based earning
- Rewards
- Merchant analytics
- Customer rewards
- How businesses can join
- Pricing
- FAQ
- Contact
- Login
- Merchant registration

Suggested landing flow:

Hero:
"Reward every visit. Build lasting loyalty."

Subtext explaining QR-based rewards.

Primary CTA:
"Get Started"

Secondary CTA:
"I'm a Customer"

Show a BeAurex QR/rewards visual.

Sections:

1. Hero
2. How BeAurex Works
3. Merchant Benefits
4. Customer Benefits
5. QR Scan Experience
6. Earn Coins
7. Redeem Rewards
8. Merchant Analytics
9. Multi-location support
10. Rewards/campaigns
11. Pricing
12. Testimonials
13. FAQ
14. Final CTA
15. Footer

Do not make the website look like Druto.

Use BeAurex branding.

==================================================
6. MERCHANT ONBOARDING
==================================================

Merchant registration flow:

Step 1:
Create account

Fields:
- Business name
- Owner name
- Email
- Mobile number
- Password
- Business category

Step 2:
Business information

Fields:
- Business name
- Business category
- Description
- Phone
- Email
- Address
- City
- State
- Pincode
- GSTIN (optional)
- Website (optional)
- Social media links

Step 3:
Location

Allow merchant to create:
- Primary location
- Additional branches

Branch fields:
- Branch name
- Address
- Latitude
- Longitude
- Contact number
- Manager

Step 4:
Loyalty program

Merchant configures:
- Coin name
- Coins earned per visit
- Minimum transaction amount if applicable
- Reward thresholds
- Reward expiry
- Daily earning limits
- Redemption rules

Step 5:
Generate QR

Generate a merchant/branch QR.

The QR should connect to the BeAurex scan workflow.

==================================================
7. MERCHANT DASHBOARD
==================================================

Create a premium SaaS dashboard.

Sidebar:

Dashboard
Customers
Transactions
Rewards
Loyalty Program
QR Codes
Branches
Campaigns
Analytics
Team
Notifications
Settings
Billing
Support

Dashboard overview:

Top KPI cards:

- Total Customers
- Total Visits
- Coins Issued
- Coins Redeemed
- Active Rewards
- Repeat Customers
- Revenue influenced by loyalty
- Today's scans

Charts:

- Daily scans
- Weekly scans
- Monthly scans
- Customer growth
- Coins issued vs redeemed
- Repeat customer percentage
- Reward redemption rate

Recent activity table:

Customer
Transaction
Coins Earned
Reward
Branch
Date
Status

==================================================
8. MERCHANT CUSTOMER MANAGEMENT
==================================================

Merchant can see customers associated with the business.

Customer list:

- Name
- Phone
- Email
- Total visits
- Coins earned
- Coins redeemed
- Current balance
- Last visit
- Customer status

Customer detail page:

- Customer profile
- Visit history
- Transaction history
- Coins history
- Rewards claimed
- Rewards redeemed
- Campaign interactions

Merchant must NOT be able to see unnecessary sensitive information.

Implement proper authorization.

==================================================
9. MERCHANT TRANSACTIONS
==================================================

Transaction page.

Fields:

- Transaction ID
- Customer
- Branch
- Amount
- Coins earned
- Coins redeemed
- Reward
- Date/time
- Status
- Staff/team member

Statuses:

Pending
Completed
Cancelled
Refunded

Merchant can filter:

- Date
- Branch
- Customer
- Status
- Transaction amount

==================================================
10. LOYALTY PROGRAM
==================================================

Merchant can configure loyalty rules.

Example:

₹100 spent = 10 coins

or:

Every visit = 10 coins

Allow flexible configuration.

Possible rule types:

- Visit based
- Amount based
- Product based
- Campaign based
- Birthday bonus
- Referral bonus
- First visit bonus
- Special event bonus

Admin must be able to control which features are available to each merchant plan.

==================================================
11. REWARDS
==================================================

Merchant can create rewards.

Reward fields:

- Reward name
- Description
- Image
- Coins required
- Quantity
- Start date
- End date
- Redemption limit
- Branch availability
- Terms and conditions
- Active/inactive

Examples:

100 Coins → Free Coffee

250 Coins → ₹100 OFF

500 Coins → Premium Service

==================================================
12. QR CODE SYSTEM
==================================================

QR functionality is one of the core features.

Each merchant/branch should have a unique QR identifier.

QR flow:

Customer scans QR
    ↓
BeAurex opens
    ↓
Identify merchant/branch
    ↓
Authenticate customer
    ↓
Show merchant information
    ↓
Show current loyalty balance
    ↓
Allow transaction/visit confirmation
    ↓
Calculate coins
    ↓
Create transaction
    ↓
Show success screen

Example success:

"Congratulations!"

"+50 BeAurex Coins"

"Your current balance: 340 Coins"

The QR should NOT directly expose sensitive database identifiers.

Use secure signed/opaque tokens.

Prevent QR abuse and replay attacks.

==================================================
13. CUSTOMER DASHBOARD
==================================================

Customer dashboard should be mobile-first.

Navigation:

Home
Discover
My Wallet
Rewards
Transactions
Favorites
Notifications
Profile
Settings

Home:

- Current coin balance
- Recent activity
- Nearby merchants
- Available rewards
- Progress toward next reward
- Recent visits

Wallet:

- Total balance
- Coins earned
- Coins redeemed
- Expiring coins
- Transaction history

Rewards:

Cards showing:

Reward
Merchant
Coins required
Current progress
Redeem button

Example:

"Free Coffee"

250 Coins

Your balance:
180 / 250

Progress bar.

==================================================
14. CUSTOMER QR EXPERIENCE
==================================================

This is extremely important.

Customer scans QR.

Do not force unnecessary app download.

Open a mobile-friendly BeAurex page.

Show:

Merchant logo
Merchant name
Location
Offer/reward
Customer's balance
Earn coins button

If not logged in:

Login/signup.

Support:

- OTP login
- Mobile number
- Email
- Google login if appropriate

After authentication:

Confirm transaction/visit.

Then:

Animated success state.

Example:

+50 Coins Earned

"You've earned rewards from [Merchant Name]"

Update wallet immediately.

==================================================
15. CUSTOMER REDEMPTION
==================================================

Customer chooses reward.

Click:

Redeem Reward

Show confirmation:

Reward:
Free Coffee

Cost:
250 Coins

Current balance:
430 Coins

After confirmation:

Generate a secure redemption code/QR.

Merchant/team scans/verifies it.

Redemption becomes:

Pending → Verified → Completed

Prevent duplicate redemption.

Use idempotency.

==================================================
16. TEAM DASHBOARD
==================================================

Team dashboard is for merchant employees/staff.

Accessible through:

team.domain.com

or development:

/team

Team members should NOT have full merchant permissions.

Roles:

- Staff
- Manager
- Branch Manager
- Support Staff

Team dashboard should focus on operational workflows.

Dashboard:

Today's visits
Today's transactions
Coins issued
Rewards redeemed
Pending redemptions

Quick actions:

Scan Customer QR
Verify Redemption
Add Transaction
View Customer
View Today's Activity

Team member can scan a customer's reward redemption QR.

After scan:

Show:

Customer
Reward
Coins used
Merchant
Branch
Time
Status

Then:

Verify Redemption

==================================================
17. ROLE-BASED ACCESS CONTROL
==================================================

Implement strict RBAC.

Roles:

CUSTOMER
MERCHANT_OWNER
MERCHANT_MANAGER
BRANCH_MANAGER
STAFF
TEAM_ADMIN
SUPER_ADMIN

Permissions should be granular.

Example:

Customer:
- Own profile
- Own wallet
- Own transactions
- Own rewards

Merchant Owner:
- Everything related to merchant
- Billing
- Team
- Analytics
- Branches
- Rewards

Manager:
- Customers
- Transactions
- Rewards
- Analytics

Staff:
- Scan
- Verify
- Create permitted transactions

Team Admin:
- Manage assigned merchants/customers/support operations

Super Admin:
- Entire platform

Never rely only on frontend authorization.

Enforce permissions in backend middleware.

==================================================
18. SUPER ADMIN DASHBOARD
==================================================

URL:

domain.com/admin

This should be a completely separate administration experience.

The admin dashboard should use the BeAurex visual identity shown in the supplied reference image.

Admin sidebar:

Dashboard
Merchants
Customers
Transactions
Rewards
Coins
Branches
Teams
Subscriptions
Plans
Payments
Campaigns
QR Management
Fraud Detection
Reports
Analytics
Support
Notifications
Audit Logs
Settings

Dashboard KPIs:

Total Merchants
Active Merchants
Total Customers
Total Transactions
Coins Issued
Coins Redeemed
Rewards Redeemed
Revenue
Active Subscriptions

Charts:

Merchant growth
Customer growth
Transactions
Revenue
Coins issued
Coins redeemed
Daily scans
Monthly active users

==================================================
19. SUPER ADMIN MERCHANT MANAGEMENT
==================================================

Admin can:

Create merchant
Edit merchant
Suspend merchant
Activate merchant
Delete/deactivate merchant
View merchant details
View merchant branches
View merchant team
View merchant transactions
View merchant rewards
View merchant analytics

Merchant details:

Business information
Owner
Subscription
Branches
Customers
Transactions
Rewards
Team
Activity
Audit history

==================================================
20. SUPER ADMIN CUSTOMER MANAGEMENT
==================================================

Admin can:

Search customer
View profile
View wallet
View transaction history
View rewards
View redemptions
Suspend account if necessary
View account activity

Do not allow arbitrary modification of coin balances without an audit record.

==================================================
21. COIN LEDGER
==================================================

Do NOT simply store:

user.coins = 500

and modify it without history.

Create a proper immutable-ish ledger.

Example:

CoinTransaction:

id
customerId
merchantId
branchId
type
amount
balanceAfter
referenceType
referenceId
description
createdAt
createdBy

Types:

EARN
REDEEM
BONUS
REFUND
EXPIRED
ADJUSTMENT

Every manual adjustment must create:

- Admin/staff identity
- Reason
- Previous balance
- Adjustment amount
- New balance
- Timestamp

==================================================
22. FRAUD PREVENTION
==================================================

This is a loyalty/rewards financial-value system, so implement anti-abuse controls.

Consider:

- QR replay prevention
- Signed QR tokens
- Expiring scan sessions
- Rate limiting
- Device/IP monitoring
- Duplicate transaction detection
- Daily earning limits
- Suspicious activity flags
- Redemption validation
- Idempotency keys
- Transaction locking
- Audit logs

Do not trust frontend-calculated coin values.

All coin calculations must happen server-side.

==================================================
23. AUTHENTICATION
==================================================

Use secure authentication.

Preferred:

JWT access token
+
refresh token

or secure session architecture.

Password hashing:

bcrypt or Argon2.

Support:

Email/password
Mobile OTP
Forgot password
Reset password
Email verification
Phone verification

Implement:

- Secure cookies where appropriate
- CSRF protection if cookie authentication is used
- Rate limiting
- Brute-force protection
- Session/token revocation

Never store passwords in plaintext.

==================================================
24. DATABASE
==================================================

Use MongoDB.

Use Mongoose.

Suggested collections:

users
merchants
branches
customers
teams
teamMembers
transactions
coinTransactions
rewards
redemptions
qrCodes
campaigns
subscriptions
plans
payments
notifications
auditLogs
supportTickets
sessions

Use proper indexes.

Important indexes:

users.email
users.phone
merchantId
branchId
customerId
transactionId
qrCodeId
createdAt

Use MongoDB transactions where necessary.

==================================================
25. BACKEND API STRUCTURE
==================================================

Use Express.js.

Organize backend professionally.

Example:

server/
  src/
    config/
    controllers/
    models/
    routes/
    services/
    middleware/
    validators/
    utils/
    jobs/
    events/
    integrations/

API:

/api/v1/auth
/api/v1/customers
/api/v1/merchants
/api/v1/branches
/api/v1/transactions
/api/v1/rewards
/api/v1/redemptions
/api/v1/qr
/api/v1/coins
/api/v1/teams
/api/v1/admin
/api/v1/analytics
/api/v1/notifications
/api/v1/subscriptions

Use controllers → services → models architecture.

Do not put all business logic inside route handlers.

==================================================
26. FRONTEND
==================================================

Use React.

Preferred stack:

React
Vite
React Router
Tailwind CSS
shadcn/ui where useful
Lucide icons
React Query/TanStack Query
React Hook Form
Zod

Use reusable components.

Structure:

client/
  src/
    components/
    layouts/
    pages/
    features/
    hooks/
    services/
    api/
    contexts/
    routes/
    utils/

==================================================
27. UI/UX DESIGN
==================================================

The design should feel like a premium modern SaaS product.

Brand colors:

Primary red:
Use the red from the supplied BeAurex assets.

Approximate brand red can be based around:

#E6020B

but extract/use the actual supplied logo color where possible.

Secondary:
White

Dark:
#111111 / similar near-black

Do NOT use excessive gradients.

Use:

- White backgrounds
- Red primary CTAs
- Red accents
- Dark text
- Soft gray borders
- Rounded 12–20px cards
- Clean spacing
- Large readable typography

Desktop:
Professional SaaS layout.

Mobile:
App-like experience.

==================================================
28. ADMIN DESIGN
==================================================

The admin panel should visually match the BeAurex brand reference.

Header:

BeAurex logo
Search
Notifications
Admin profile

Sidebar:

Red accent
Clean navigation
Active-state highlighting

Main content:

Cards
Charts
Tables
Filters
Modal dialogs
Drawer panels

Use consistent spacing.

Do not make admin look like a generic Bootstrap template.

==================================================
29. RESPONSIVE DESIGN
==================================================

Must work well on:

Mobile
Tablet
Laptop
Desktop
Large screens

Customer QR flow must be especially optimized for mobile.

Merchant/admin dashboards must be optimized for desktop but remain usable on tablet/mobile.

==================================================
30. NOTIFICATIONS
==================================================

Support:

In-app notifications

Future-ready for:

Email
SMS
WhatsApp
Push notifications

Events:

Coins earned
Reward available
Reward redeemed
Reward expiring
New customer
New transaction
Merchant subscription events
Admin alerts

==================================================
31. ANALYTICS
==================================================

Merchant analytics:

Daily scans
Weekly scans
Monthly scans
New customers
Returning customers
Coins earned
Coins redeemed
Rewards redeemed
Top customers
Top rewards
Top branches
Revenue/transaction trends

Admin analytics:

Platform-wide metrics.

Use chart libraries such as Recharts.

==================================================
32. SUBSCRIPTION SYSTEM
==================================================

Create merchant subscription architecture.

Plans should be configurable by Super Admin.

Example:

Basic
Growth
Pro
Enterprise

Plan limits:

Branches
Team members
Rewards
Campaigns
Analytics
Customers
Transactions

Do not hardcode plan limitations throughout the application.

Create a central subscription/feature entitlement service.

==================================================
33. PAYMENT ARCHITECTURE
==================================================

Prepare for Indian payment gateway integration.

Structure the system so Razorpay/Stripe/etc. can be plugged in.

Payment flow:

Merchant selects plan
↓
Checkout
↓
Payment gateway
↓
Webhook
↓
Verify payment server-side
↓
Activate subscription
↓
Create invoice/payment record

Never trust frontend payment success alone.

==================================================
34. SEARCH AND FILTERS
==================================================

All major admin/merchant tables should support:

Search
Filter
Sort
Pagination
Date range
Export where appropriate

Examples:

Search merchant by:
Name
Email
Phone
Business

Search customer by:
Name
Phone
Email

Transaction filters:
Date
Branch
Merchant
Customer
Status

==================================================
35. AUDIT LOGS
==================================================

Important admin actions must be logged.

Example:

Admin X changed merchant Y's subscription.

Log:

actorId
actorRole
action
entityType
entityId
before
after
IP
userAgent
timestamp

==================================================
36. SECURITY
==================================================

Follow OWASP best practices.

Implement:

Input validation
Output sanitization
Rate limiting
Helmet
CORS
Secure cookies
Password hashing
JWT security
Refresh token rotation
RBAC
Permission middleware
Audit logs
MongoDB injection protection
XSS protection
CSRF protection where applicable
File upload validation
API request validation

Never expose:

Passwords
Private keys
JWT secrets
Payment secrets
Database credentials

Use environment variables.

==================================================
37. ENVIRONMENT VARIABLES
==================================================

Create:

.env.example

Example:

NODE_ENV=
PORT=
MONGODB_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=
CLIENT_URL=
ADMIN_URL=
TEAM_URL=
SMTP_HOST=
SMTP_USER=
SMTP_PASSWORD=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

Never commit .env.

==================================================
38. PROJECT STRUCTURE
==================================================

Create a clean monorepo or well-structured full-stack repository.

Preferred:

be-aurex/
  apps/
    web/
    api/
    team/
    admin/
  packages/
    ui/
    config/
    types/

OR, if a simpler architecture is more appropriate:

client/
server/

Choose the architecture that is easiest to maintain while supporting the four experiences.

==================================================
39. QR URL ARCHITECTURE
==================================================

Use something like:

domain.com/scan/<secure-token>

or:

domain.com/q/<secure-token>

When scanned:

1. Resolve QR
2. Resolve merchant
3. Resolve branch
4. Create scan session
5. Authenticate customer
6. Validate session
7. Create transaction
8. Calculate coins
9. Write ledger entry
10. Update customer balance/cache if used
11. Return success
12. Notify merchant/customer

Do not expose MongoDB ObjectIds unnecessarily.

==================================================
40. CUSTOMER REGISTRATION AFTER QR SCAN
==================================================

Important flow:

Customer scans QR
↓
Merchant identified
↓
"Welcome to BeAurex"
↓
Mobile number
↓
OTP
↓
Create/login customer
↓
Show merchant
↓
Confirm visit/purchase
↓
Earn coins
↓
Show reward progress

Keep this flow very short.

==================================================
41. DEMO DATA
==================================================

Create realistic seed data.

Seed:

5 merchants
10 branches
50 customers
100+ transactions
20 rewards
10 team members
Sample campaigns
Sample notifications
Sample coin ledger

Make dashboards visually populated on first launch.

==================================================
42. ERROR HANDLING
==================================================

Create a consistent API response format.

Success:

{
  success: true,
  data: {}
}

Error:

{
  success: false,
  error: {
    code: "...",
    message: "..."
  }
}

Frontend should show polished error states.

Include:

404
403
401
500
Network errors
Validation errors
Expired QR
Invalid QR
Duplicate transaction
Insufficient coins

==================================================
43. LOADING STATES
==================================================

Every data-driven page must have:

Skeleton loaders
Empty states
Error states

Do not show blank screens while loading.

==================================================
44. ACCESSIBILITY
==================================================

Use:

Semantic HTML
Keyboard navigation
ARIA labels
Good contrast
Focus states
Accessible forms

==================================================
45. SEO
==================================================

Public website:

SEO metadata
Open Graph
Twitter cards
robots.txt
sitemap
Structured data where useful

Dashboard pages should generally not be indexed.

==================================================
46. PERFORMANCE
==================================================

Use:

Lazy-loaded routes
Code splitting
Image optimization
Pagination
Caching
React Query
MongoDB indexes
Backend pagination

Avoid unnecessary API requests.

==================================================
47. API DOCUMENTATION
==================================================

Create API documentation.

Use Swagger/OpenAPI if practical.

Document:

Authentication
Merchant APIs
Customer APIs
QR APIs
Reward APIs
Transaction APIs
Admin APIs

==================================================
48. TESTING
==================================================

Create tests for critical business logic.

Especially:

Authentication
RBAC
QR validation
Coin calculation
Coin ledger
Reward redemption
Duplicate prevention
Subscription limits
Admin permissions

Use:

Vitest/Jest
Supertest
React Testing Library

==================================================
49. CRITICAL BUSINESS RULE
==================================================

Never calculate or trust reward/coin values from the frontend.

Example:

Frontend says:
"Customer should receive 500 coins"

Backend must ignore this.

Backend calculates:

transaction amount
+
merchant loyalty rules
+
campaign rules
+
limits
=
final coins

Then creates the ledger entry.

==================================================
50. ADMIN CONTROL OVER COINS
==================================================

Super Admin may adjust coins only through a controlled process.

UI:

Customer
Current Balance
Adjustment
Reason
Preview
Confirm

Require reason.

Create audit log.

==================================================
51. DASHBOARD VISUALIZATION
==================================================

Merchant dashboard should show visually useful data rather than simply many cards.

Example:

------------------------------------------------
Today's Overview
------------------------------------------------
Customers      Visits       Coins       Rewards
1,245          342          8,420       73
------------------------------------------------

Customer Growth Chart

        ╭────╮
   ╭────╯    ╰────╮
───╯               ╰───

------------------------------------------------

Coins Earned vs Redeemed

------------------------------------------------

Recent Transactions
------------------------------------------------

Use polished charts.

==================================================
52. ADMIN DASHBOARD VISUALIZATION
==================================================

Super Admin home:

Total Merchants
Active Merchants
Total Customers
Transactions
Coins Circulated
Revenue

Then:

Platform Growth
Revenue
Transactions
New Merchants
New Customers

Then:

Recent Merchants
Recent Transactions
Fraud Alerts
System Activity

==================================================
53. TEAM WORKFLOW
==================================================

Team member logs into:

team.domain.com

They see:

"Good morning, [Name]"

Today's activity.

Primary CTA:

SCAN REDEMPTION

Second:

SCAN CUSTOMER

Team should be optimized for operational speed.

Large touch-friendly controls.

==================================================
54. MERCHANT REWARD REDEMPTION WORKFLOW
==================================================

Customer:

Reward
↓
Redeem
↓
Secure redemption token generated
↓
Customer shows QR/code
↓
Merchant/team scans
↓
Backend validates
↓
Check reward status
↓
Check expiration
↓
Check merchant
↓
Check branch if required
↓
Mark redemption
↓
Deduct coins
↓
Create ledger
↓
Success

Must be atomic.

==================================================
55. SUPER ADMIN SUPPORT
==================================================

Create support ticket system.

Merchant/customer can create ticket.

Admin can:

Assign
Reply
Change status
Add internal note
Close ticket

Statuses:

Open
In Progress
Waiting
Resolved
Closed

==================================================
56. FILE UPLOADS
==================================================

For merchant:

Logo
Cover image
Reward image
Business images

Validate:

MIME type
File size
Extension

Prepare storage abstraction so local storage can later be replaced with S3/Cloudinary.

==================================================
57. DO NOT COPY DRUTO
==================================================

This is extremely important.

Use Druto only as a conceptual workflow reference.

DO NOT:

Copy their HTML
Copy their CSS
Copy their source code
Copy their exact page design
Copy their exact wording
Copy their branding
Copy their logo
Copy their proprietary assets
Copy their exact pricing
Copy their exact UI

Create an independent BeAurex product.

==================================================
58. BEAUREX BRAND EXPERIENCE
==================================================

The product should feel like:

"BeAurex = rewards + loyalty + modern technology"

Use the supplied visual identity heavily.

Brand impression:

Premium
Trustworthy
Modern
Fast
Simple
Rewarding

Primary CTA:
Red background + white text.

Secondary CTA:
White background + red border/text.

Cards:
White with subtle gray borders/shadows.

==================================================
59. FINAL DELIVERABLE
==================================================

I want a REAL WORKING APPLICATION.

Do not only create static mockups.

Implement:

Frontend
Backend
MongoDB models
Authentication
RBAC
QR workflow
Coin ledger
Rewards
Redemption
Merchant dashboard
Customer dashboard
Team dashboard
Super Admin
Analytics
Notifications
Subscription architecture
Audit logs
Seed data
Tests
README

==================================================
60. DEVELOPMENT PROCESS
==================================================

Before coding:

1. Analyze the requirements.
2. Create the architecture.
3. Create database schema.
4. Create route map.
5. Create permission matrix.
6. Create user flows.
7. Create component architecture.

Then implement incrementally.

Do not stop after creating the landing page.

Build the complete application.

==================================================
61. IMPORTANT: WORKING FLOW
==================================================

At minimum, this complete demo flow must work:

MERCHANT:

Register
↓
Login
↓
Create business
↓
Create branch
↓
Configure loyalty
↓
Generate QR
↓
View dashboard

CUSTOMER:

Scan QR
↓
Register/login
↓
View merchant
↓
Complete visit
↓
Earn coins
↓
View wallet
↓
See rewards
↓
Redeem reward

TEAM:

Login at team.domain.com
↓
View assigned merchant/branch
↓
Scan redemption QR
↓
Verify reward
↓
Complete redemption

SUPER ADMIN:

domain.com/admin
↓
Login
↓
View platform dashboard
↓
Manage merchants
↓
Manage customers
↓
Manage rewards
↓
Manage transactions
↓
Manage plans
↓
View analytics
↓
View audit logs

==================================================
62. ROUTE MAP
==================================================

Public:

/
 /about
 /how-it-works
 /pricing
 /contact
 /login
 /register
 /merchant/register
 /customer/login
 /scan/:token

Merchant:

/merchant
/merchant/login
/merchant/dashboard
/merchant/customers
/merchant/customers/:id
/merchant/transactions
/merchant/rewards
/merchant/rewards/create
/merchant/qr
/merchant/branches
/merchant/campaigns
/merchant/analytics
/merchant/team
/merchant/settings
/merchant/billing

Customer:

/customer
/customer/login
/customer/home
/customer/wallet
/customer/rewards
/customer/rewards/:id
/customer/transactions
/customer/profile
/customer/settings

Team:

/team
/team/login
/team/dashboard
/team/scan
/team/redemptions
/team/customers
/team/transactions
/team/profile

Admin:

/admin
/admin/login
/admin/dashboard
/admin/merchants
/admin/merchants/:id
/admin/customers
/admin/transactions
/admin/rewards
/admin/branches
/admin/teams
/admin/plans
/admin/subscriptions
/admin/payments
/admin/campaigns
/admin/qr
/admin/analytics
/admin/fraud
/admin/support
/admin/audit-logs
/admin/settings

==================================================
63. RESPONSIVE MOBILE CUSTOMER EXPERIENCE
==================================================

The customer interface should feel closer to a mobile app than a traditional website.

Bottom navigation:

Home
Rewards
Wallet
Activity
Profile

Large buttons.

Minimal typing.

Fast QR scan workflow.

==================================================
64. UI COMPONENT SYSTEM
==================================================

Build reusable:

Button
Input
Select
Modal
Drawer
Card
Badge
Avatar
Table
Pagination
Tabs
Dropdown
Toast
Alert
Dialog
Tooltip
Skeleton
EmptyState
DatePicker
SearchInput
StatCard
ChartCard
QRCodeCard
RewardCard
TransactionTable

Do not duplicate UI code.

==================================================
65. FINAL QUALITY BAR
==================================================

The application must look like a professional startup SaaS product.

Avoid:

Generic bootstrap styling
Poor spacing
Inconsistent fonts
Random colors
Unstyled forms
Placeholder-looking dashboards
Broken mobile layouts
Fake interactions

Everything should be connected to the backend where applicable.

Use realistic demo content.

==================================================
66. START NOW
==================================================

First inspect the supplied BeAurex assets and use them as the visual source of truth.

Then create:

1. Architecture
2. Database schema
3. Permission matrix
4. Route structure
5. UI design system
6. Backend
7. Frontend
8. Authentication
9. Merchant workflow
10. Customer workflow
11. Team workflow
12. Admin workflow
13. QR workflow
14. Coin ledger
15. Reward redemption
16. Analytics
17. Testing
18. Seed data
19. Documentation

Do not ask me to repeatedly confirm obvious implementation decisions.

When there are reasonable implementation choices, choose the most maintainable production-ready option and continue.

At the end, provide:

- Complete project structure
- Setup instructions
- Environment variables
- Database setup
- Seed command
- Development commands
- Production build commands
- API documentation
- Test commands
- Default demo credentials for seeded accounts
- Explanation of how to configure:
    team.domain.com
    domain.com/admin

Make sure the application can actually run locally.
# COMPREHENSIVE SYSTEM SPECIFICATION - AlertMe/Ecobank Express Lite

**Document Status**: Complete System Evaluation  
**Date**: January 23, 2026  
**Version**: 1.0  
**Framework**: Next.js 15.2.8 with TypeScript  
**Target Platform**: Progressive Web App (PWA) for Mobile Banking  

---

## TABLE OF CONTENTS
1. [Executive Summary](#executive-summary)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Business Logic Flow](#business-logic-flow)
5. [Authentication System](#authentication-system)
6. [Data Management](#data-management)
7. [State Management](#state-management)
8. [Third-Party Integrations](#third-party-integrations)
9. [Component Architecture](#component-architecture)
10. [Navigation & Routing](#navigation--routing)
11. [API Endpoints](#api-endpoints)
12. [Storage Strategy](#storage-strategy)
13. [PWA & Offline Capabilities](#pwa--offline-capabilities)
14. [Component Analysis](#component-analysis)
15. [Identified Issues & Failures](#identified-issues--failures)
16. [Recommendations](#recommendations)

---

## EXECUTIVE SUMMARY

**AlertMe** is a Progressive Web Application (PWA) designed as an Ecobank mobile banking platform called "Ecobank Omni Lite Express." It provides pan-African banking services including:

- **Account Management**: Login, registration, profile management
- **Money Transfer**: Domestic transfers with beneficiary management
- **Transaction History**: Complete tracking of all transactions
- **Loan Management**: Loan applications and tracking
- **Bill Payments**: Pay bills directly from the app
- **Virtual Cards**: Access to virtual card services
- **SMS Alerts**: Transaction notifications via Twilio
- **Offline Support**: Service worker for offline functionality

**Current Status**: Largely functional with identified architectural gaps and security concerns.

---

## TECHNOLOGY STACK

### Frontend Framework & Libraries

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 15.2.8 | React-based full-stack framework with SSR/SSG |
| **Language** | TypeScript 5.x | Type-safe JavaScript development |
| **UI Components** | Radix UI (24+ components) | Accessible, headless UI primitives |
| **CSS Framework** | Tailwind CSS 3.4.19 | Utility-first CSS styling |
| **Component Library** | Custom + Bulma, Materialize, Foundation | Multiple CSS frameworks (potential conflicts) |
| **Icons** | Iconify React 4.1.1 | Icon library with 100K+ icons |
| **Forms** | React Hook Form + Zod | Form state management and validation |
| **Animations** | Framer Motion 12.23.26 | Smooth animations and transitions |
| **Charts** | Recharts (latest) | Data visualization |
| **Theme Management** | Next-themes (latest) | Dark/light mode support |
| **Toast Notifications** | Sonner (latest) | User-friendly notification system |
| **Carousel** | Embla Carousel React (latest) | Touch-friendly carousel component |
| **UI Enhancements** | Cmdk, Vaul, Embla-carousel | Command palette, drawer, carousel |

### Backend & Server-Side

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Runtime** | Node.js (v18+) | JavaScript runtime |
| **Server Framework** | Express 5.2.1 | HTTP server (referenced in dependencies) |
| **SMS Service** | Twilio SDK 5.12.0 | Third-party SMS messaging |
| **vCard Generation** | vcards-js 2.10.0 | Business card format generation |

### Build & Development

| Tool | Purpose |
|------|---------|
| PostCSS 8.5.6 | CSS transformation |
| Autoprefixer 10.4.23 | CSS vendor prefixing |
| Tailwind CSS Animator 1.0.7 | Animation utilities |
| dotenv 16.6.1 | Environment variables |
| TypeScript Compiler | Type checking |

### Package Manager
- **npm/pnpm** (specified in README)

---

## SYSTEM ARCHITECTURE

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Browser)                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  React Components (60+ UI Components)               │    │
│  │  - LoginScreen, Dashboard, TransferScreen, etc.     │    │
│  └──────────────────┬──────────────────────────────────┘    │
│                     │                                         │
│  ┌──────────────────▼──────────────────────────────────┐    │
│  │  State Management Layer                             │    │
│  │  ├─ DataStore (Singleton Pattern)                  │    │
│  │  ├─ StorageManager (localStorage/IndexedDB)        │    │
│  │  └─ Theme Provider (next-themes)                   │    │
│  └──────────────────┬──────────────────────────────────┘    │
│                     │                                         │
│  ┌──────────────────▼──────────────────────────────────┐    │
│  │  Hooks & Utilities                                  │    │
│  │  ├─ use-storage-init (IndexedDB initialization)    │    │
│  │  ├─ use-theme-init (Theme persistence)             │    │
│  │  ├─ use-pwa (PWA state management)                 │    │
│  │  ├─ use-toast (Notification system)                │    │
│  │  └─ use-validated-form (Form validation)           │    │
│  └──────────────────┬──────────────────────────────────┘    │
│                     │                                         │
│  ┌──────────────────▼──────────────────────────────────┐    │
│  │  Service Layer                                      │    │
│  │  ├─ SMS Client (sendTransactionAlert)              │    │
│  │  ├─ SMS Service (Twilio integration)               │    │
│  │  ├─ Alert Templates (SMS message generation)       │    │
│  │  └─ Form Utils (Validation schemas)                │    │
│  └──────────────────┬──────────────────────────────────┘    │
│                     │                                         │
│  ┌──────────────────▼──────────────────────────────────┐    │
│  │  Storage Layer (Client-side)                        │    │
│  │  ├─ localStorage (default, 5-10MB limit)           │    │
│  │  ├─ IndexedDB (large data, profile pictures)       │    │
│  │  └─ In-Memory Cache (fast access)                  │    │
│  └──────────────────┬──────────────────────────────────┘    │
│                     │                                         │
│  ┌──────────────────▼──────────────────────────────────┐    │
│  │  Service Worker (PWA)                               │    │
│  │  ├─ Offline caching (network-first strategy)       │    │
│  │  ├─ Cache versioning (v1.1)                        │    │
│  │  └─ Static asset caching                           │    │
│  └──────────────────┬──────────────────────────────────┘    │
│                     │                                         │
└─────────────────────┼──────────────────────────────────────────┘
                      │ HTTP/HTTPS
┌─────────────────────▼──────────────────────────────────────────┐
│                    SERVER LAYER (Next.js)                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  API Routes (Next.js App Router)                        │   │
│  │  ├─ /api/sms/send (Twilio SMS sending)                 │   │
│  │  ├─ /api/sms/verify (Twilio credential verification)   │   │
│  │  ├─ /api/sms/business-card (Business card SMS)         │   │
│  │  ├─ /api/vcard (vCard generation for contacts)         │   │
│  │  └─ /api/sw (Service worker management)                │   │
│  └──────────────────┬──────────────────────────────────────┘   │
│                     │                                             │
│  ┌──────────────────▼──────────────────────────────────────┐   │
│  │  Third-Party Integrations                               │   │
│  │  ├─ Twilio (SMS/MMS messaging)                         │   │
│  │  └─ Environment Variables (Secrets management)         │   │
│  └──────────────────┬──────────────────────────────────────┘   │
│                     │                                             │
│  ┌──────────────────▼──────────────────────────────────────┐   │
│  │  Middleware & Configuration                             │   │
│  │  ├─ ESLint (linting, disabled during build)            │   │
│  │  ├─ TypeScript (type checking, errors ignored)         │   │
│  │  └─ Image Optimization (disabled, unoptimized)         │   │
│  └──────────────────┬──────────────────────────────────────┘   │
│                     │                                             │
└─────────────────────┼──────────────────────────────────────────────┘
                      │
┌─────────────────────▼──────────────────────────────────────────┐
│           EXTERNAL SERVICES & INFRASTRUCTURE                   │
├────────────────────────────────────────────────────────────────┤
│  ├─ Twilio (SMS/MMS Provider)                                 │
│  ├─ Environment Variables (.env.local, .env.production)       │
│  └─ CDN (Vercel default)                                       │
└────────────────────────────────────────────────────────────────┘
```

### Deployment Architecture

```
GitHub Repository
       │
       ▼
Vercel CI/CD
       │
       ├─ Build Stage: npm run build
       ├─ Lint Stage: next lint (configured to ignore)
       ├─ Type Check: TypeScript (configured to ignore errors)
       │
       ▼
Vercel Edge Network
       │
       ├─ Static Assets (optimized for CDN)
       ├─ API Routes (Serverless Functions)
       ├─ Server-side Rendering (when needed)
       │
       ▼
End Users (Browser)
```

---

## BUSINESS LOGIC FLOW

### 1. USER JOURNEY - Authentication Flow

```
START
  │
  ├─► Splash Screen (2-3 sec delay)
  │   └─► Check: Has Existing Account?
  │
  ├─YES─► Login Screen
  │       ├─ Input: Account Number, PIN
  │       ├─ Validate credentials against localStorage
  │       ├─ Success: Navigate to Dashboard
  │       └─ Failure: Display error, retry
  │
  ├─NO──► Registration Screen (3-step form)
  │       ├─ Step 1: Email validation
  │       ├─ Step 2: Personal details (Name, Account #, Phone)
  │       ├─ Step 3: PIN setup & confirmation
  │       ├─ Store in DataStore
  │       ├─ Success: Emit notification
  │       └─ Navigate to Dashboard
  │
  ▼
Dashboard (Main Hub)
```

### 2. MONEY TRANSFER FLOW

```
User clicks "Send Money"
  │
  ├─► Transfer Options Screen
  │   ├─ Select transfer type:
  │   │  ├─ Quick transfer (recent beneficiary)
  │   │  ├─ New transfer (different beneficiary)
  │   │  └─ International transfer (if enabled)
  │   │
  │   ▼
  ├─► New Beneficiary Selection
  │   ├─ Search existing beneficiaries
  │   ├─ Or add new beneficiary
  │   │  ├─ Input: Name, Account #, Bank
  │   │  ├─ Checkbox: "Save as Beneficiary" (default: checked)
  │   │  └─ Validate account number format
  │   │
  │   ▼
  ├─► Transfer Screen
  │   ├─ Display: From account, To beneficiary, Amount
  │   ├─ Calculate fees (flat ₦30 or percentage-based)
  │   ├─ Show total debit amount
  │   ├─ Verify sender has sufficient balance
  │   │
  │   ▼
  ├─► PIN Confirmation Screen
  │   ├─ Input: 4-digit PIN pad
  │   ├─ Verify PIN against stored PIN
  │   │
  │   ├─FAIL─► Display error, allow retry (max 3)
  │   │
  │   ▼
  ├─SUCCESS─► Transfer Processing Screen
  │   ├─ Step 1: "Verifying PIN" (0-33% progress)
  │   ├─ Step 2: "Processing Payment" (33-66% progress)
  │   ├─ Step 3: "Sending Money" (66-100% progress)
  │   │
  │   ├─► [CRITICAL] Save Beneficiary (if flag = true)
  │   │   └─ Add to DataStore.beneficiaries
  │   │
  │   ├─► Add Transaction to DataStore
  │   │   ├─ Generate transaction ID & reference
  │   │   ├─ Update sender balance (debit)
  │   │   ├─ Add notification
  │   │   └─ Trigger SMS alerts (if enabled)
  │   │
  │   ├─► Send SMS Alerts
  │   │   ├─ Debit alert to sender
  │   │   ├─ Credit alert to recipient (if phone available)
  │   │   └─ Use Twilio SMS API
  │   │
  │   ▼
  └─► Transaction Success Screen
      ├─ Display transaction details & receipt
      ├─ Option: Generate detailed receipt (PDF)
      ├─ Option: Share receipt via SMS
      └─ Navigate back to Dashboard
```

### 3. BENEFICIARY MANAGEMENT FLOW

```
User navigates to Beneficiary Management
  │
  ├─► Display Beneficiary List
  │   ├─ Load from DataStore
  │   ├─ Sort alphabetically or by recency
  │   ├─ Show statistics (Total: N, Recent: N)
  │   │
  │   ├─► Search/Filter
  │   │   ├─ Input: Beneficiary name/account
  │   │   ├─ Real-time filter
  │   │   └─ Show count of matching results
  │   │
  │   ├─► Per Beneficiary Actions
  │   │   ├─ View details
  │   │   ├─ Edit beneficiary info
  │   │   ├─ Send money to beneficiary
  │   │   ├─ DELETE beneficiary
  │   │   │   ├─ Show confirmation dialog
  │   │   │   ├─ On confirm: Remove from DataStore
  │   │   │   ├─ Emit notification
  │   │   │   └─ Toast success message
  │   │   │
  │   │   └─ Share (via SMS/vCard)
  │   │
  │   ├─► Empty State
  │   │   └─ Show when no beneficiaries exist
  │   │       ├─ Display helpful message
  │   │       └─ Button to add first beneficiary
  │   │
  │   ▼
  └─► Auto-save on any changes
```

### 4. LOAN APPLICATION FLOW

```
User navigates to Loans
  │
  ├─► View Active Loans & Applications
  │   ├─ Display pending applications
  │   ├─ Display approved loans
  │   ├─ Show loan status: Draft, Submitted, Under Review, Approved, Rejected
  │   │
  │   ▼
  ├─► Loan Requirements Checklist
  │   ├─ Display requirements for loan type
  │   ├─ Allow user to review prerequisites
  │   │
  │   ▼
  ├─► Loan Application Form
  │   ├─ Input: Loan type, Amount, Term, Purpose
  │   ├─ Validate against balance & limits
  │   ├─ Calculate monthly payment & total repayment
  │   │
  │   ▼
  └─► Submit Application
      ├─ Store in DataStore.loanApplications
      ├─ Status = "Submitted"
      ├─ Emit notification
      └─ Display confirmation
```

### 5. SETTINGS & PROFILE FLOW

```
User navigates to Settings
  │
  ├─► Profile Management
  │   ├─ View/Edit: Name, Email, Phone, Address, BVN
  │   ├─ Upload profile picture
  │   │   ├─ Store in IndexedDB (large images)
  │   │   ├─ Compress/optimize if needed
  │   │   └─ Fallback gradient avatar if not provided
  │   │
  │   ▼
  ├─► App Settings
  │   ├─ Theme selection (light/dark/auto)
  │   ├─ Notification toggle
  │   ├─ SMS Alerts toggle
  │   ├─ Biometric login toggle (future)
  │   ├─ Language selection (future)
  │   │
  │   ▼
  ├─► Advanced Features
  │   ├─ Theme customizer (custom colors, fonts)
  │   ├─ SMS Template composer
  │   ├─ Receipt generator
  │   ├─ Export data (JSON)
  │   ├─ Import data from backup
  │   │
  │   ▼
  └─► Save all settings to DataStore & localStorage
```

---

## AUTHENTICATION SYSTEM

### Current Authentication Model

**Type**: Simple Local Authentication (No Backend)  
**Security Level**: ⚠️ LOW - For demonstration/testing only

### Authentication Flow

```
Registration Phase:
┌────────────────────────────────────────┐
│ User provides:                          │
│ • Name                                  │
│ • Email                                 │
│ • Account Number (10 digits)           │
│ • Phone (Nigerian format)              │
│ • PIN (4 digits)                       │
│ • PIN Confirmation (4 digits)          │
└────────────────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────┐
│ Validation (Zod schemas):              │
│ • Email: valid email format            │
│ • Name: 2-50 chars, letters only       │
│ • Account: exactly 10 digits           │
│ • Phone: Nigerian format (+234...)     │
│ • PIN: exactly 4 digits                │
│ • PIN match: confirmPin === pin        │
└────────────────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────┐
│ Store in DataStore:                    │
│ • userData: { name, email, phone,      │
│              accountNumber, pin }      │
│ • Mark hasExistingAccount = true       │
│ • Persist to localStorage              │
└────────────────────────────────────────┘

Login Phase:
┌────────────────────────────────────────┐
│ User provides:                          │
│ • Account Number                       │
│ • PIN                                  │
└────────────────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────┐
│ Validation:                            │
│ • Format check (10 digits, 4 digits)   │
│ • Retrieve from localStorage           │
│ • Compare: input PIN === stored PIN    │
│ • Compare: input account ===           │
│            stored account number       │
└────────────────────────────────────────┘
           │
      ┌────┴────┐
      │          │
   PASS        FAIL
      │          │
      ▼          ▼
   Login    Error Message
   Success  Retry allowed
```

### Security Issues ⚠️

| Issue | Severity | Details |
|-------|----------|---------|
| **No Backend Authentication** | CRITICAL | Credentials stored locally in plaintext |
| **PIN Stored in localStorage** | CRITICAL | No encryption, accessible to JavaScript |
| **No Session Management** | HIGH | No JWT, no session tokens, no expiration |
| **No Biometric Auth** | HIGH | PIN-only authentication is weak |
| **XSS Vulnerability** | HIGH | localStorage accessible to XSS attacks |
| **No Rate Limiting** | MEDIUM | Unlimited login attempts possible |
| **No Account Lockout** | MEDIUM | No protection after failed attempts |
| **Mock Data Only** | CRITICAL | No real backend validation |

### Recommended Improvements

1. **Implement Backend Authentication**
   - Create Node.js/Express authentication service
   - Use JWT tokens with expiration
   - Implement refresh token rotation
   - Hash PINs with bcrypt before storage

2. **Add Security Headers**
   - Implement CSP (Content Security Policy)
   - Add X-Frame-Options header
   - Enable HSTS
   - Implement X-Content-Type-Options

3. **Enable Biometric Authentication**
   - Use WebAuthn/FIDO2
   - Support fingerprint/face recognition
   - Keep PIN as fallback

4. **Implement Rate Limiting**
   - Limit login attempts (3-5 per minute)
   - Implement account lockout (15 minutes after 3 failures)
   - Log failed attempts

5. **Add Session Management**
   - Session timeout (15-30 minutes of inactivity)
   - Automatic logout on browser close
   - Session validation on every request

---

## DATA MANAGEMENT

### Data Models

#### 1. UserData Interface
```typescript
{
  name: string              // Full name (e.g., "ADEFEMI JOHN OLAYEMI")
  accountNumber: string     // 10-digit account number
  phone: string            // Phone number (e.g., "+234 801 234 5678")
  balance: number          // Current account balance in NGN
  email: string            // Email address
  address: string          // Physical address
  bvn: string              // Bank Verification Number (11 digits)
  profilePicture?: string  // Base64 or URL to profile image
  status: "Active" | "Inactive"
}
```

#### 2. Transaction Interface
```typescript
{
  id: string                      // Unique transaction ID
  type: string                    // "Transfer to other bank", "Bank Deposit", etc.
  amount: number                  // Transaction amount (NGN)
  recipient?: string              // Recipient name (for debits)
  sender?: string                 // Sender name (for credits)
  date: string                    // ISO date (YYYY-MM-DD)
  time: string                    // Time (HH:MMAM/PM format)
  status: "Successful" | "Pending" | "Failed"
  reference: string               // Transaction reference (TXN + timestamp)
  description: string             // Transaction description
  isDebit: boolean                // True if money went out
  section: string                 // "Today", "Yesterday", "This Week", etc.
  recipientBank?: string          // Recipient's bank name
  senderBank?: string             // Sender's bank name
  recipientAccount?: string       // Recipient account number
  senderAccount?: string          // Sender account number
  fee?: number                    // Transaction fee (NGN)
}
```

#### 3. Beneficiary Interface
```typescript
{
  id: string              // Unique beneficiary ID
  name: string            // Beneficiary name
  accountNumber: string   // 10-digit account number
  bank: string            // Bank name
  phone?: string          // Phone number (optional)
}
```

#### 4. Notification Interface
```typescript
{
  id: string                                    // Unique notification ID
  title: string                                 // Notification title
  message: string                               // Notification message
  type: "success" | "info" | "warning" | "error"
  timestamp: string                             // ISO timestamp
  read: boolean                                 // Read status
}
```

#### 5. LoanApplication Interface
```typescript
{
  id: string                                              // Unique application ID
  type: string                                            // Loan type (Personal, Business, etc.)
  amount: number                                          // Loan amount requested (NGN)
  term: number                                            // Loan term in months
  purpose: string                                         // Purpose of loan
  status: "Draft" | "Submitted" | "Under Review" | "Approved" | "Rejected"
  applicationDate: string                                 // ISO timestamp
  monthlyPayment: number                                  // Calculated monthly payment
  interestRate: number                                    // Interest rate percentage
  totalRepayment: number                                  // Total amount to repay
}
```

#### 6. AppSettings Interface
```typescript
{
  theme: string                    // "default", "dark", "light"
  notifications: boolean           // Enable/disable app notifications
  smsAlerts: boolean              // Enable/disable SMS alerts
  biometricLogin: boolean         // Enable/disable biometric login
  language: string                // Language code (e.g., "en", "fr")
}
```

### AppState (Complete Application State)

```typescript
interface AppState {
  userData: UserData
  transactions: Transaction[]      // Sorted by date/time descending
  beneficiaries: Beneficiary[]     // Sorted by name or recency
  notifications: Notification[]    // Sorted by timestamp descending
  loanApplications: LoanApplication[]
  settings: AppSettings
  lastSynced: string              // ISO timestamp of last save
  version: number                 // Data format version (current: 1)
}
```

### Data Persistence Strategy

```
Priority Order (Fallback Chain):
1. localStorage (default, 5-10MB limit)
   ├─ Fast access
   ├─ Synchronous reads/writes
   ├─ Suitable for most data
   └─ Used for: Main AppState, Settings
   
2. IndexedDB (when localStorage full or data > 100KB)
   ├─ Asynchronous access
   ├─ Can store up to 50MB+ (browser-dependent)
   ├─ Suitable for large binary data
   └─ Used for: Profile pictures, large transaction lists
   
3. In-Memory Cache (fallback only)
   ├─ Fast access
   ├─ Lost on page refresh
   ├─ Used during current session
   └─ Used for: Runtime optimization
```

---

## STATE MANAGEMENT

### DataStore Singleton Pattern

```typescript
class DataStore {
  private static instance: DataStore          // Singleton instance
  private state: AppState                     // Current application state
  private listeners: Set<() => void>          // Subscriber callbacks
  
  // Debouncing for performance
  private saveTimeout: NodeJS.Timeout | null  // Debounce saves (2 seconds)
  private notifyTimeout: NodeJS.Timeout | null // Debounce notifications (300ms)
  
  static getInstance(): DataStore {
    // Lazy initialization, ensures single instance
  }
  
  private constructor() {
    // Load from storage
    // Initialize IndexedDB
    // Request persistent storage
    // Setup auto-save on beforeunload
  }
}
```

### State Methods

#### Read Methods (Non-mutating)
```typescript
getUserData(): UserData
getTransactions(): Transaction[]
getTransaction(id: string): Transaction | undefined
getBeneficiaries(): Beneficiary[]
findBeneficiaryByAccount(accountNumber: string): Beneficiary | undefined
getNotifications(): Notification[]
getUnreadNotificationCount(): number
getLoanApplications(): LoanApplication[]
getSettings(): AppSettings
getStorageStats(): { totalTransactions, totalBeneficiaries, currentBalance, lastSynced }
```

#### Write Methods (Mutating)
```typescript
// User data
updateUserData(updates: Partial<UserData>): void
updateBalance(newBalance: number): void
updateProfilePicture(pictureUrl: string): void

// Transactions
addTransaction(transaction: Omit<Transaction, "id" | "reference" | "date" | "time">): Promise<string>

// Beneficiaries
addBeneficiary(beneficiary: Omit<Beneficiary, "id">): string
deleteBeneficiary(id: string): boolean
updateBeneficiary(id: string, updates: Partial<Beneficiary>): boolean

// Notifications
addNotification(notification: Omit<Notification, "id" | "timestamp" | "read">): void
markNotificationAsRead(id: string): void

// Loan applications
addLoanApplication(application: Omit<LoanApplication, "id" | "applicationDate">): string
updateLoanApplicationStatus(id: string, status: LoanApplication["status"]): void

// Settings
updateSettings(updates: Partial<AppSettings>): void

// Utility
clearAllData(): void
exportData(): string
importData(jsonData: string): Promise<boolean>
restoreFromBackup(): Promise<boolean>

// Authentication
registerNewAccount(accountData): void
hasExistingAccount(): boolean
```

#### Subscription System
```typescript
subscribe(listener: () => void): () => void {
  // Returns unsubscribe function
  // Called whenever state changes
  // Debounced to prevent excessive re-renders
}
```

### Component State Integration

**Problem**: State is managed at the DataStore singleton level, but components use local React state to subscribe to changes.

**Solution**: Hooks connect components to DataStore

```typescript
// In component
useEffect(() => {
  const unsubscribe = dataStore.subscribe(() => {
    setUserData(dataStore.getUserData())
    setTransactions(dataStore.getTransactions())
  })
  
  return unsubscribe  // Cleanup
}, [])
```

### Performance Optimizations

1. **Debounced Saves** (2 second delay)
   - Prevents excessive localStorage writes
   - Multiple state changes batched into single save

2. **Debounced Notifications** (300ms delay)
   - Prevents excessive re-renders
   - Multiple mutations trigger single update

3. **Memory Cache**
   - Subscription cache in StorageManager
   - Fast reads within same session

4. **Lazy Loading**
   - Profile pictures load asynchronously
   - Large data sets load on-demand

---

## THIRD-PARTY INTEGRATIONS

### Twilio SMS Service

#### Configuration
```
Environment Variables Required:
├─ TWILIO_ACCOUNT_SID      (e.g., ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx)
├─ TWILIO_AUTH_TOKEN       (Authentication token)
└─ TWILIO_PHONE_NUMBER     (e.g., +12203008040)

Storage Location:
├─ Development: .env.local (Git ignored)
└─ Production: Vercel Environment Variables (Dashboard)
```

#### SMS Alert Types

| Type | Trigger | Template |
|------|---------|----------|
| **Debit** | Money sent from account | `ECOBANK ALERT: Debit of NGN{amount} to {recipient}. Bal: NGN{balance}. Ref: {reference}. Time: {time}` |
| **Credit** | Money received in account | `ECOBANK ALERT: Credit of NGN{amount} from {sender}. Bal: NGN{balance}. Ref: {reference}. Time: {time}` |
| **Balance** | Balance inquiry | `ECOBANK ALERT: Your account balance is NGN{balance}. Time: {time}` |
| **Low Balance** | Low balance warning | `ECOBANK ALERT: Low balance warning. Your account balance is NGN{balance}. Please fund your account.` |

#### SMS Flow

```
User initiates transaction
        │
        ▼
Amount, recipient, fee calculated
        │
        ├─► Check: settings.smsAlerts === true?
        │
        ├─YES─► Format SMS messages (debit & credit alerts)
        │        │
        │        ▼
        │        Call Twilio API
        │        ├─ POST /api/sms/send
        │        ├─ Body: { to, message, type }
        │        └─ Retry up to 3 times on failure
        │
        └─NO──► Skip SMS alerts
```

#### Twilio API Endpoints

**1. Send SMS**
```
POST /api/sms/send
Content-Type: application/json

Request:
{
  "to": "+234 801 234 5678",
  "message": "ECOBANK ALERT: ...",
  "type": "debit" | "credit" | "balance" | "notification"
}

Response:
{
  "success": true,
  "messageId": "SM1234567890abcdef1234567890abcdef",
  "status": "queued" | "sent" | "failed",
  "type": "debit"
}
```

**2. Verify Twilio Credentials**
```
GET /api/sms/verify

Response:
{
  "success": true,
  "accountSid": "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "friendlyName": "My Twilio Account",
  "status": "active"
}
```

**3. Generate Business Card (vCard)**
```
GET /api/vcard?bank=Ecobank&email=user@bank.com&phone=+234801234567

Response:
BEGIN:VCARD
VERSION:3.0
FN:Ecobank
TITLE:Banking Partner
EMAIL:user@bank.com
TEL:+234801234567
ORG:Ecobank
NOTE:Business card shared via Ecobank Mobile App
END:VCARD
```

#### Phone Number Formatting

Nigerian phone number formats supported:

```
Input Format              → Output Format (E.164)
+234 801 234 5678       → +2348012345678
234 801 234 5678        → +2348012345678
0801 234 5678           → +2348012345678
2348012345678           → +2348012345678
+2348012345678          → +2348012345678
```

#### Error Handling

| Error | Status | Handling |
|-------|--------|----------|
| Missing required fields | 400 | Return error, don't retry |
| Twilio credentials not configured | 500 | Log error, return error |
| Invalid phone number | N/A | Format and retry |
| Network timeout | N/A | Retry up to 3 times (1 sec between) |
| Twilio API error | 500 | Log error, return error |

---

## COMPONENT ARCHITECTURE

### Component Hierarchy

```
Root (app/page.tsx)
│
├─ SplashScreen
│  └─ 2-3 second loading animation
│
├─ LoginScreen
│  ├─ Account Number Input
│  ├─ PIN Input (masked)
│  ├─ Login Button
│  ├─ Registration Link
│  └─ Error Display
│
├─ RegistrationScreen (3-step form)
│  ├─ Email Step
│  ├─ Details Step (Name, Account, Phone)
│  ├─ PIN Step (Setup & Confirm)
│  └─ Submit Button
│
├─ EnhancedDashboard (Main Hub)
│  ├─ Header (Menu toggle, notifications, profile)
│  ├─ Balance Display (show/hide toggle)
│  ├─ Quick Actions (Add Money, Transfer, Pay Bills)
│  ├─ More Actions (Loans, Virtual Cards, etc.)
│  ├─ Recent Transactions (3 most recent)
│  └─ SideMenu (conditional rendering)
│
├─ SideMenu
│  ├─ Profile Section
│  ├─ Navigation Items
│  │  ├─ Dashboard
│  │  ├─ Transactions
│  │  ├─ Transfer
│  │  ├─ Beneficiaries
│  │  ├─ Loans
│  │  ├─ Settings
│  │  ├─ Profile
│  │  ├─ Themes
│  │  └─ Help
│  ├─ Logout Button
│  └─ Version Info
│
├─ TransactionHistory
│  ├─ Transaction List (scrollable)
│  ├─ Filter/Sort Options
│  ├─ Transaction Detail Navigation
│  └─ Empty State
│
├─ TransactionDetailScreen
│  ├─ Full transaction details
│  ├─ Receipt generation
│  ├─ Share options
│  └─ Back button
│
├─ TransferOptions (Decision tree)
│  ├─ Recent Transfers (quick select)
│  ├─ New Transfer Button
│  ├─ Beneficiary Selection
│  └─ Back button
│
├─ BeneficiaryManagement
│  ├─ Search/Filter bar
│  ├─ Statistics cards
│  ├─ Beneficiary List
│  │  ├─ Each item with:
│  │  │  ├─ Avatar
│  │  │  ├─ Name & Account
│  │  │  ├─ Bank info
│  │  │  ├─ Edit button
│  │  │  └─ Delete button (with confirmation)
│  │  └─ Empty state
│  └─ Add New Beneficiary button
│
├─ NewBeneficiary (Form)
│  ├─ Beneficiary Name Input
│  ├─ Account Number Input
│  ├─ Bank Dropdown/Select
│  ├─ Phone Input (optional)
│  ├─ "Save as Beneficiary" Checkbox (default: checked)
│  ├─ Validate Button
│  └─ Cancel Button
│
├─ TransferScreen
│  ├─ From Account Display
│  ├─ To Beneficiary Display
│  ├─ Amount Display
│  ├─ Fee Display
│  ├─ Continue Button
│  └─ Back Button
│
├─ PinConfirmation
│  ├─ PIN dots (4)
│  ├─ Number pad (0-9)
│  ├─ Delete button
│  ├─ Submit button
│  └─ Cancel button
│
├─ TransferProcessingScreen
│  ├─ Progress bar (0-100%)
│  ├─ Step indicators:
│  │  ├─ Verifying PIN
│  │  ├─ Processing Payment
│  │  └─ Sending Money
│  └─ Error display (if failure)
│
├─ TransactionSuccessScreen
│  ├─ Success animation
│  ├─ Transaction receipt
│  ├─ Reference number
│  ├─ Share/Print options
│  └─ Done button
│
├─ EnhancedProfileScreen
│  ├─ Profile picture (upload)
│  ├─ Name display/edit
│  ├─ Email display/edit
│  ├─ Phone display/edit
│  ├─ Address display/edit
│  ├─ BVN display (masked)
│  ├─ Account status
│  └─ Save button
│
├─ EnhancedLoansScreen
│  ├─ Loan products list
│  ├─ Active loans display
│  ├─ Loan applications status
│  ├─ Apply for new loan button
│  └─ Loan requirements checklist
│
├─ PayBillsScreen
│  ├─ Billers list
│  ├─ Recent bills
│  ├─ Bill category filters
│  ├─ Amount input
│  └─ Confirm button
│
├─ POSScreen
│  ├─ Accept card payments
│  ├─ Transaction list
│  ├─ Daily/Weekly/Monthly stats
│  └─ Settlement details
│
├─ VirtualCardsScreen
│  ├─ Card list
│  ├─ Create new card
│  ├─ Card details (masked)
│  ├─ Activate/Deactivate
│  └─ Manage limits
│
├─ SettingsScreen
│  ├─ Theme selector
│  ├─ Notification toggles
│  ├─ SMS alerts toggle
│  ├─ Biometric login toggle
│  ├─ Language selector
│  ├─ Data export/import
│  └─ Logout button
│
├─ ThemeCustomizer
│  ├─ Color picker
│  ├─ Font selector
│  ├─ Preview
│  ├─ Save/Reset buttons
│  └─ Back button
│
├─ SMSTemplateComposer
│  ├─ Template selector
│  ├─ Message editor
│  ├─ Variable insertion
│  ├─ Preview
│  └─ Save/Send buttons
│
├─ NotificationsScreen
│  ├─ Notification list
│  ├─ Filter by type
│  ├─ Mark as read
│  ├─ Delete notification
│  └─ Clear all button
│
├─ AddMoneyScreen
│  ├─ Funding method selector
│  ├─ Amount input
│  ├─ Bank account display
│  ├─ USSD code (if applicable)
│  └─ Confirm button
│
├─ DetailedReceiptScreen
│  ├─ Full receipt details
│  ├─ Barcode/QR code
│  ├─ Print button
│  ├─ Share button
│  ├─ Download button
│  └─ Back button
│
├─ UpgradeLimitScreen
│  ├─ Current limits display
│  ├─ Upgrade options
│  ├─ Requirements list
│  ├─ Apply button
│  └─ Info section
│
├─ CurrencyScreen
│  ├─ Exchange rates
│  ├─ Currency selector
│  ├─ Conversion calculator
│  └─ Back button
│
├─ NetworkChatModal
│  ├─ Chat interface
│  ├─ Message input
│  ├─ Message list
│  └─ Send/Close buttons
│
├─ ShareDetailsModal
│  ├─ Share options (SMS, Email, etc.)
│  ├─ Contact selector
│  ├─ Message customization
│  └─ Send/Cancel buttons
│
├─ AddFundsModal
│  ├─ Funding options
│  ├─ Amount input
│  ├─ Confirm button
│  └─ Cancel button
│
├─ ThemeProvider
│  └─ Wraps app with theme context
│
└─ Toaster (Toast notification system)
   └─ Displays notifications from Sonner
```

---

## NAVIGATION & ROUTING

### Navigation Model

**Type**: Client-side state-based navigation (not using Next.js App Router for views)

```typescript
// app/page.tsx (Main navigation hub)
const [currentScreen, setCurrentScreen] = useState("splash")

const handleNavigate = (screen: string, data?: any) => {
  setCurrentScreen(screen)
  if (data) setTransferData(data)
  setIsMenuOpen(false)
}

const renderScreen = () => {
  switch (currentScreen) {
    case "splash": return <SplashScreen />
    case "login": return <LoginScreen />
    case "dashboard": return <EnhancedDashboard />
    case "transactions": return <TransactionHistory />
    case "transfer": return <TransferScreen />
    // ... etc
  }
}
```

### Screen State Machine

```
splash
  │
  └──(after 2-3 sec)──► login
                        │
                        ├──(has account)──► dashboard
                        │
                        └──(new user)──► registration
                                        │
                                        └──(after register)──► dashboard

dashboard (Hub)
  ├──► transactions
  │     └──► transaction-detail
  │
  ├──► transfer-options
  │     ├──► new-beneficiary
  │     │    └──► transfer
  │     │         └──► pin-confirmation
  │     │              └──► transfer-processing
  │     │                   └──► transaction-success ──► dashboard
  │     │
  │     └──► (recent beneficiary)
  │          └──► transfer ──► pin-confirmation ──► ...
  │
  ├──► beneficiary-management
  │
  ├──► loans
  │     ├──► loan-requirements-checklist
  │     └──► (loan application form)
  │
  ├──► pay-bills
  ├──► pos
  ├──► virtual-cards
  ├──► add-money
  ├──► currency
  ├──► notifications
  ├──► transaction-history
  │
  ├──► settings
  │     ├──► themes
  │     └──► sms-templates
  │
  ├──► profile
  │
  └──► receipt-generator
```

### Data Flow Through Navigation

```
User Action
    │
    ├─► handleNavigate("screen-name", optional_data)
    │    │
    │    ├─ Update currentScreen state
    │    ├─ Save optional_data to transferData state
    │    └─ Close menu if open
    │
    ▼
renderScreen() returns appropriate component
    │
    ├─ Component receives:
    │  ├─ onNavigate = handleNavigate
    │  ├─ onBack = () => handleNavigate("dashboard")
    │  ├─ onMenuToggle = () => setIsMenuOpen(!isMenuOpen)
    │  └─ transferData = current transfer data (if applicable)
    │
    ▼
Component renders with passed props
```

---

## API ENDPOINTS

### Public API Routes

#### 1. SMS Sending
```
POST /api/sms/send

Purpose: Send transaction alerts and notifications via Twilio
Requires: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER

Request Headers:
Content-Type: application/json

Request Body:
{
  "to": "+234801234567",              // Required: recipient phone number
  "message": "ECOBANK ALERT: ...",   // Required: message content
  "type": "debit|credit|balance|notification"  // Optional
}

Response (Success):
{
  "success": true,
  "messageId": "SM1234567890abcdef",
  "status": "queued",
  "type": "debit"
}

Response (Error):
{
  "success": false,
  "error": "Missing required fields: to, message"  // Error description
}

Error Codes:
- 400: Bad Request (missing fields)
- 500: Twilio not configured or API error
```

#### 2. Twilio Verification
```
GET /api/sms/verify

Purpose: Verify Twilio credentials are configured correctly
Requires: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN

Response (Success):
{
  "success": true,
  "accountSid": "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "friendlyName": "My Twilio Account",
  "status": "active"
}

Response (Error):
{
  "success": false,
  "error": "Twilio not configured"
}

Error Codes:
- 500: Twilio not configured or credential verification failed
```

#### 3. Business Card SMS
```
POST /api/sms/business-card

Purpose: Send business card (vCard) via SMS/MMS
Requires: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER

Request Body:
{
  "to": "+234801234567",
  "sender": "John Olayemi",
  "accountNumber": "0099348976",
  "bank": "Ecobank",
  "phone": "+234801234567",
  "email": "john@email.com"
}

Response (Success):
{
  "success": true,
  "messageId": "MM1234567890abcdef"
}

Response (Error):
{
  "success": false,
  "error": "Business Card SMS Error: ..."
}
```

#### 4. vCard Generation
```
GET /api/vcard?bank=Ecobank&email=user@bank.com&phone=+234801234567

Purpose: Generate vCard (contact/business card file)
Format: RFC 6350 (vCard 3.0)

Query Parameters:
- bank (optional): Bank/company name (default: "Ecobank")
- email (optional): Email address
- phone (optional): Phone number

Response (Success):
Content-Type: text/vcard; charset=utf-8
Content-Disposition: attachment; filename="Ecobank_businesscard.vcf"

BEGIN:VCARD
VERSION:3.0
FN:Ecobank
TITLE:Banking Partner
EMAIL:user@bank.com
TEL:+234801234567
ORG:Ecobank
NOTE:Business card shared via Ecobank Mobile App
END:VCARD

Response (Error):
{
  "error": "Failed to generate vCard"
}

Error Codes:
- 500: vCard generation failed
```

#### 5. Service Worker
```
GET /api/sw

Purpose: Serve service worker file
Returns: sw.js (Service Worker registration script)
```

### API Error Handling

All errors return JSON response with structure:
```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

Retry Logic (implemented in SMSService):
- Retries up to 3 times
- 1 second delay between retries
- Only retries on network errors, not validation errors

---

## STORAGE STRATEGY

### Multi-Tier Storage Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Storage Availability Check                  │
└──────────────────┬──────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
   localStorage         IndexedDB
    Available?           Available?
        │                     │
       YES                   YES
        │                     │
        ▼                     ▼
   Try to save          Try to save
        │                     │
     PASS?                 PASS?
     /   \                /   \
   YES   NO              YES   NO
    │     │               │     │
    ✓     │               ✓     │
          │                     │
          └─────────┬───────────┘
                    │
                    ▼
           Use In-Memory Cache
                (Volatile)
```

### Storage Limits & Usage

| Storage Type | Size Limit | Use Case | Persistence |
|--------------|-----------|----------|-------------|
| **localStorage** | 5-10 MB | Main AppState, Settings, transactions (most users) | Persistent across sessions |
| **IndexedDB** | 50+ MB | Profile pictures, large datasets | Persistent across sessions |
| **Memory Cache** | Limited by RAM | Fast access, runtime optimization | Lost on refresh |

### Data Stored in Each Location

#### localStorage
```
Key: "ecobank_app_data"
Value: {
  userData: { ... }
  transactions: [ ... ]
  beneficiaries: [ ... ]
  notifications: [ ... ]
  loanApplications: [ ... ]
  settings: { ... }
  lastSynced: ISO timestamp
  version: 1
}

Size: ~500KB - 5MB depending on transaction count
```

#### IndexedDB
```
Database: "ecobank_db"
Version: 1
ObjectStore: "app_data"

Stored Data:
├─ Key: "ecobank_profile_picture"
│  Value: Base64 encoded image (> 100KB)
│
├─ Key: "ecobank_app_backup"
│  Value: Complete AppState backup
│
└─ Key: "ecobank_app_data"
   Value: Full application state (fallback)
```

### Data Synchronization

**Not Implemented**: Server-side sync currently disabled

```
Manual Sync (planned for future):
├─ Export data: JSON file download
├─ Import data: JSON file upload
└─ Backup restore: Previous state recovery
```

### Data Persistence Flow

```
User makes change (e.g., update balance)
  │
  ├─► DataStore.updateBalance(newBalance)
  │   │
  │   ├─ Update internal state
  │   │
  │   ├─► Call notify() (debounced 300ms)
  │   │   └─ Trigger listener callbacks
  │   │       └─ Components re-render with new state
  │   │
  │   └─► Queue saveToStorage (debounced 2 seconds)
  │       │
  │       ▼
  │   After 2 seconds (or on page unload):
  │   ├─ Serialize AppState to JSON
  │   ├─ Try localStorage.setItem("ecobank_app_data", json)
  │   │   │
  │   │   ├─ SUCCESS: Exit
  │   │   │
  │   │   └─ FAILURE (quota exceeded):
  │   │       │
  │   │       ├─► Try IndexedDB
  │   │       │   ├─ Create transaction
  │   │       │   ├─ Put serialized data in object store
  │   │       │   └─ On success: Exit
  │   │       │
  │   │       └─► Fallback to in-memory (session only)
  │   │           └─ Log warning
  │
  └─► Load data on next app start:
      ├─ Try localStorage.getItem("ecobank_app_data")
      │  ├─ SUCCESS: Parse and return
      │  └─ FAILURE: Try IndexedDB
      │
      ├─ Try IndexedDB transaction
      │  ├─ SUCCESS: Parse and return
      │  └─ FAILURE: Load default state
      │
      └─ Load default state as last resort
         └─ User sees fresh account
```

### Backup & Recovery

```
Automatic Backup (on each save):
├─ Create backup copy in separate key
├─ Store in localStorage (5MB limit)
└─ Kept for manual restoration

Manual Restore:
├─ User triggers restore from Backup in Settings
├─ Retrieve backup data from storage
├─ Validate version compatibility
├─ Migrate if needed
└─ Replace current state with backup
```

### Data Export & Import

**Export** (Settings Screen):
```typescript
// User clicks "Export Data"
const json = dataStore.exportData()
// Downloads as: "ecobank_data_2026-01-23.json"
// Contains complete AppState with metadata
```

**Import** (Settings Screen):
```typescript
// User selects JSON file
// App parses JSON
// Validates structure & version
// Migrates if needed
// Replaces AppState with imported data
// Reloads UI with imported state
```

---

## PWA & OFFLINE CAPABILITIES

### Progressive Web App Features

#### 1. Web App Manifest
```json
{
  "name": "Ecobank Omni Lite Express",
  "short_name": "Express Lite",
  "description": "Seamless Pan-African Banking Experience",
  "start_url": "/",
  "display": "standalone",
  "scope": "/",
  "theme_color": "#004A9F",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/icon-192.svg",
      "sizes": "192x192",
      "type": "image/svg+xml",
      "purpose": "any"
    },
    {
      "src": "/icon-192-maskable.svg",
      "sizes": "192x192",
      "type": "image/svg+xml",
      "purpose": "maskable"
    },
    {
      "src": "/icon-512.svg",
      "sizes": "512x512",
      "type": "image/svg+xml"
    },
    {
      "src": "/apple-icon.png",
      "sizes": "180x180",
      "type": "image/png"
    }
  ],
  "shortcuts": [
    {
      "name": "Send Money",
      "short_name": "Send",
      "description": "Send money to beneficiaries",
      "url": "/?action=transfer",
      "icons": [{ "src": "/icon-192.svg", "sizes": "192x192" }]
    },
    {
      "name": "View Transactions",
      "short_name": "History",
      "description": "View transaction history",
      "url": "/?action=transactions",
      "icons": [{ "src": "/icon-192.svg", "sizes": "192x192" }]
    }
  ]
}
```

#### 2. Service Worker Implementation

**Location**: `/public/sw.js`

**Functionality**:
```
Install Event:
├─ Cache version: v1.1
├─ Cache static assets:
│  ├─ manifest.json
│  ├─ icon-192.svg
│  ├─ icon-512.svg
│  ├─ icon-maskable-192.svg
│  ├─ icon-maskable-512.svg
│  └─ apple-icon.png
└─ skipWaiting() - Activate immediately

Activate Event:
├─ Delete old cache versions
├─ Claim all clients
└─ Update page on new worker

Fetch Event:
├─ Network-first strategy
├─ GET requests only
├─ Skip cross-origin requests
├─ Return cached response on network failure
└─ Cache status updates in console
```

**Cache Strategy**: Network-first with fallback
```
1. Try network fetch
2. If successful (200 OK): Cache and return
3. If failed: Return cached version
4. If not cached: Serve offline page
```

#### 3. Offline Capabilities

**Available Offline**:
- ✅ View dashboard
- ✅ View transactions
- ✅ View beneficiaries
- ✅ View settings & profile
- ✅ View notifications
- ✅ All static UI/themes

**NOT Available Offline**:
- ❌ Send money (requires backend verification)
- ❌ Load transactions (no sync)
- ❌ SMS alerts (requires Twilio)
- ❌ Any API calls

#### 4. Installation & Standalone Mode

**iOS Installation**:
```
1. Open Safari
2. Share → Add to Home Screen
3. App runs in fullscreen mode
4. Status bar: black-translucent
5. No browser UI visible
```

**Android Installation**:
```
1. Open Chrome/Edge
2. Menu → "Install app" appears
3. Accept installation
4. App runs in standalone mode
5. Native app feel
```

**Fullscreen Auto-Request** (layout.tsx):
```typescript
// Requests fullscreen on app start
document.documentElement.requestFullscreen()
  .catch(() => console.warn("Fullscreen unavailable"))
```

#### 5. Viewport Configuration

```typescript
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#004A9F" },
    { media: "(prefers-color-scheme: dark)", color: "#002D5F" },
  ]
}
```

#### 6. Apple Web App Meta Tags

```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Express Lite">
<link rel="apple-touch-icon" href="/apple-icon.png" sizes="180x180">
```

---

## COMPONENT ANALYSIS

### Component Categories

#### 1. Screen/Page Components (30+ components)

| Component | Purpose | State Management | Data Sources |
|-----------|---------|------------------|--------------|
| **SplashScreen** | Initial loading screen | Local (timer) | None |
| **LoginScreen** | User authentication | Local (form state) | DataStore.userData |
| **RegistrationScreen** | New account creation | Local (3-step form) | Form inputs |
| **EnhancedDashboard** | Main hub (balance, quick actions, recent transactions) | Local + DataStore subscribe | DataStore |
| **TransactionHistory** | List all transactions | Local + DataStore subscribe | DataStore.transactions |
| **TransferOptions** | Select transfer type | Local | DataStore.beneficiaries |
| **NewBeneficiary** | Add/edit beneficiary form | Local (form state) | Form inputs |
| **TransferScreen** | Review transfer details | Local | transferData prop |
| **PinConfirmation** | Enter PIN for confirmation | Local (pin state) | transferData prop |
| **TransferProcessingScreen** | Progress animation | Local (progress %) | transferData prop |
| **TransactionSuccessScreen** | Success receipt | Local | transferData prop |
| **TransactionDetailScreen** | Full transaction details | Local | dataStore.getTransaction() |
| **BeneficiaryManagement** | List, search, edit, delete beneficiaries | Local + DataStore subscribe | DataStore.beneficiaries |
| **EnhancedProfileScreen** | View/edit user profile | Local + DataStore subscribe | DataStore.userData |
| **EnhancedLoansScreen** | View loans and applications | Local + DataStore subscribe | DataStore.loanApplications |
| **PayBillsScreen** | Bill payment interface | Local | DataStore.userData |
| **POSScreen** | Point of sale interface | Local + DataStore subscribe | DataStore.transactions |
| **VirtualCardsScreen** | View/manage virtual cards | Local | Mock data |
| **SettingsScreen** | App settings & preferences | Local + DataStore subscribe | DataStore.settings |
| **ThemeCustomizer** | Custom theme editor | Local | DataStore.settings |
| **EnhancedProfileScreen** | Profile management | Local + DataStore subscribe | DataStore.userData |
| **NotificationsScreen** | View all notifications | Local + DataStore subscribe | DataStore.notifications |
| **AddMoneyScreen** | Add funds to account | Local | DataStore.userData |
| **DetailedReceiptScreen** | Full receipt with QR code | Local | transferData prop |
| **UpgradeLimitScreen** | Upgrade account limits | Local | DataStore.userData |
| **CurrencyScreen** | Currency conversion | Local | Mock rates |
| **SMSTemplateComposer** | Create SMS templates | Local | DataStore.settings |
| **ReceiptGenerator** | Generate transaction receipt | Local | DataStore.transactions |
| **LoanRequirementsChecklist** | Show loan requirements | Local | Mock requirements |

#### 2. UI Component Library (Radix UI + Custom)

Located in `/components/ui/`

| Component | Radix UI | Usage |
|-----------|----------|-------|
| `button.tsx` | Alert Dialog | Buttons throughout app |
| `card.tsx` | Card | Content containers |
| `input.tsx` | Input | Form fields |
| `form.tsx` | Form | Form wrapper & validation |
| `dialog.tsx` | Dialog | Modals (confirmation, info) |
| `select.tsx` | Select | Dropdowns (banks, categories) |
| `checkbox.tsx` | Checkbox | Toggle options |
| `toggle.tsx` | Toggle | On/off switches |
| `tabs.tsx` | Tabs | Tab navigation |
| `scroll-area.tsx` | Scroll Area | Scrollable lists |
| `accordion.tsx` | Accordion | Collapsible sections |
| `popover.tsx` | Popover | Floating content |
| `tooltip.tsx` | Tooltip | Hover hints |
| `badge.tsx` | Badge | Status indicators |
| `progress.tsx` | Progress | Progress bars |
| `slider.tsx` | Slider | Range input |
| `toast.tsx` | Toast | Notifications (Sonner) |

#### 3. Modal Components (4 components)

| Modal | Purpose | Trigger |
|-------|---------|---------|
| **NetworkChatModal** | Chat/messaging | Manual open |
| **ShareDetailsModal** | Share transaction | Transaction detail |
| **AddFundsModal** | Add funds dialog | Quick action |
| **ThemeCustomizer** | Theme editor | Settings |

#### 4. Layout Components

| Component | Purpose |
|-----------|---------|
| **SideMenu** | Main navigation sidebar |
| **layout.tsx** | Root layout wrapper |
| **ThemeProvider** | Theme context (dark/light) |

### Component Props & Interfaces

**Standard Navigation Props** (passed to most screen components):
```typescript
interface NavigationProps {
  onNavigate: (screen: string, data?: any) => void
  onBack: () => void
  onMenuToggle?: () => void
  transferData?: any  // For transfer flow components
}
```

### Component Lifecycle

```
Component Mount
  │
  ├─► useEffect (subscribe to DataStore)
  │   └─► const unsubscribe = dataStore.subscribe(() => {
  │         setLocalState(dataStore.get...)
  │       })
  │
  ├─► useEffect (cleanup on unmount)
  │   └─► return unsubscribe
  │
  ├─► User interaction
  │   ├─ Form submission
  │   ├─ Button click
  │   └─ Selection change
  │
  ├─► Call handler function
  │   ├─ dataStore.updateUserData()
  │   ├─ dataStore.addBeneficiary()
  │   └─ etc.
  │
  ├─► DataStore updates & triggers notify()
  │   └─ All subscribed components re-render
  │
  └─► Component re-render with new state
```

---

## IDENTIFIED ISSUES & FAILURES

### CRITICAL ISSUES 🔴

#### 1. **No Real Backend Authentication**
- **Location**: Authentication system
- **Severity**: CRITICAL
- **Description**: PIN and credentials stored in plaintext localStorage
- **Impact**: Anyone with browser access can steal credentials
- **Evidence**:
  ```typescript
  // From login-screen.tsx
  const userData = dataStore.getUserData()
  if (userData.accountNumber === accountInput && 
      userData.pin === pinInput.toString())
  ```
  All credentials stored in unencrypted localStorage
- **Root Cause**: App designed as PWA demo, not production banking app
- **Fix Priority**: P0 - Implement server authentication immediately

#### 2. **No Server-Side Persistence**
- **Location**: Data layer
- **Severity**: CRITICAL
- **Description**: All data is mock data, no backend database
- **Impact**: Data is lost on app uninstall, no real transactions
- **Evidence**:
  - `dataStore.ts` uses localStorage only
  - `addTransaction()` generates mock transactions locally
  - No API calls for data persistence
- **Root Cause**: Frontend-only implementation
- **Fix Priority**: P0 - Implement backend with persistent database

#### 3. **No Encryption of Sensitive Data**
- **Location**: Storage layer
- **Severity**: CRITICAL
- **Description**: PIN, account numbers stored in plaintext
- **Impact**: XSS attack can expose all user credentials
- **Evidence**:
  - `StorageManager.save()` stores data as-is
  - No encryption/decryption functions
  - PIN visible in localStorage key inspection
- **Root Cause**: Browser storage used without encryption
- **Fix Priority**: P0 - Implement encryption for sensitive fields

#### 4. **No Rate Limiting on Authentication**
- **Location**: Login screen
- **Severity**: HIGH
- **Description**: Unlimited login attempts possible
- **Impact**: Brute force attacks can compromise accounts
- **Evidence**:
  - No attempt counter
  - No account lockout mechanism
  - No timeout after failed attempts
- **Root Cause**: Client-side only authentication
- **Fix Priority**: P1 - Add rate limiting

#### 5. **SMS Service Exposed to XSS**
- **Location**: SMS API routes
- **Severity**: HIGH
- **Description**: User input not properly validated before SMS sending
- **Impact**: SMS injection attacks possible
- **Evidence**:
  ```typescript
  // From /api/sms/send/route.ts
  const { to, message, type } = body
  // No message sanitization before sending to Twilio
  const twilioMessage = await client.messages.create({
    body: message,  // Could contain injection payload
    from: twilioPhoneNumber,
    to: formattedPhone,
  })
  ```
- **Root Cause**: No input validation layer
- **Fix Priority**: P1 - Sanitize SMS messages

#### 6. **Build Configuration Issues**
- **Location**: Build process
- **Severity**: HIGH
- **Description**: TypeScript errors and linting disabled
- **Evidence**:
  ```javascript
  // From next.config.mjs
  eslint: {
    ignoreDuringBuilds: true,  // ❌ Ignoring lint errors
  },
  typescript: {
    ignoreBuildErrors: true,   // ❌ Ignoring TypeScript errors
  }
  ```
- **Impact**: Potential bugs hidden, type safety compromised
- **Root Cause**: Rapid development, errors not addressed
- **Fix Priority**: P1 - Fix actual errors, enable checking

---

### HIGH PRIORITY ISSUES 🟠

#### 7. **Multiple CSS Framework Conflicts**
- **Location**: Dependencies
- **Severity**: HIGH
- **Description**: Project uses Tailwind, Bulma, Materialize, and Foundation CSS
- **Impact**: CSS conflicts, larger bundle size, inconsistent styling
- **Evidence**:
  ```json
  {
    "bulma": "^1.0.4",
    "foundation-sites": "^6.9.0",
    "materialize-css": "^1.0.0",
    "tailwindcss": "^3.4.19"
  }
  ```
- **Root Cause**: Multiple v0 generations with different frameworks
- **Fix Priority**: P1 - Choose single framework (recommend Tailwind)

#### 8. **No Error Boundaries**
- **Location**: React components
- **Severity**: HIGH
- **Description**: No error boundary components, app crashes on component error
- **Impact**: Single component error crashes entire app
- **Evidence**: No ErrorBoundary wrapper in layout.tsx
- **Root Cause**: Missing React 18 error handling
- **Fix Priority**: P1 - Implement error boundaries

#### 9. **Unoptimized Profile Picture Storage**
- **Location**: `data-store.ts`, profile management
- **Severity**: MEDIUM
- **Description**: Profile pictures stored as Base64, duplicated in multiple stores
- **Impact**: Storage quota exceeded easily, app slowdown
- **Evidence**:
  ```typescript
  // From data-store.ts
  updateProfilePicture(pictureUrl: string): void {
    // Stored in AppState
    this.state.userData.profilePicture = optimizedUrl
    // Also stored in IndexedDB
    StorageManager.save("ecobank_profile_picture", pictureUrl)
  }
  ```
- **Root Cause**: Dual storage without deduplication
- **Fix Priority**: P2 - Implement single storage with reference

#### 10. **No Input Validation on Phone Numbers**
- **Location**: SMS client, phone formatting
- **Severity**: MEDIUM
- **Description**: Phone number validation insufficient
- **Evidence**:
  ```typescript
  // From sms-service.ts
  validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^(\+234|234|0)?[789][01]\d{8}$/
    // Regex is fragile, only handles Nigerian numbers
    return phoneRegex.test(phone.replace(/\s+/g, ""))
  }
  ```
- **Impact**: SMS sent to invalid numbers, failed transactions
- **Root Cause**: Limited regex, no international support
- **Fix Priority**: P2 - Use phone validation library

#### 11. **Race Condition in Transfer Processing**
- **Location**: `transfer-processing-screen.tsx`
- **Severity**: MEDIUM
- **Description**: Beneficiary saved BEFORE transaction, can create orphaned beneficiaries
- **Impact**: If transaction fails, beneficiary still added
- **Evidence**:
  ```typescript
  // Should be: 1) Transaction succeeds, 2) Then add beneficiary
  // Currently: 1) Add beneficiary, 2) Then transaction
  if (transferData.saveAsBeneficiary) {
    dataStore.addBeneficiary({ ... })  // Saved first
  }
  dataStore.addTransaction({ ... })    // Added second
  ```
- **Root Cause**: Incorrect order of operations
- **Fix Priority**: P2 - Fix transaction order

#### 12. **No Transaction Rollback**
- **Location**: `transfer-processing-screen.tsx`
- **Severity**: MEDIUM
- **Description**: No ability to rollback failed transactions
- **Impact**: Inconsistent state if something fails mid-transaction
- **Evidence**: No try/catch in transaction processing
- **Root Cause**: Simple linear flow, no rollback mechanism
- **Fix Priority**: P2 - Implement transaction rollback

---

### MEDIUM PRIORITY ISSUES 🟡

#### 13. **Incomplete Loan Management**
- **Location**: `enhanced-loans-screen.tsx`
- **Severity**: MEDIUM
- **Description**: Loan feature mostly UI, no real calculations
- **Impact**: Users see broken loan calculations
- **Evidence**:
  - `LoanRequirementsChecklist` has hardcoded requirements
  - No loan approval algorithm
  - Mock interest rate calculations
- **Root Cause**: Feature incomplete/stubbed out
- **Fix Priority**: P3 - Implement complete loan system

#### 14. **No Real Bill Payment Integration**
- **Location**: `pay-bills-screen.tsx`
- **Severity**: MEDIUM
- **Description**: Bill payment UI without backend processing
- **Impact**: Users can't actually pay bills
- **Evidence**: No API endpoint for bill payments
- **Root Cause**: Feature not connected to backend
- **Fix Priority**: P3 - Implement bill payment processor

#### 15. **No Virtual Card Management**
- **Location**: `virtual-cards-screen.tsx`
- **Severity**: MEDIUM
- **Description**: Virtual cards UI without real card generation
- **Impact**: Feature appears broken to users
- **Evidence**: No card creation/management logic
- **Root Cause**: Feature stubbed out
- **Fix Priority**: P3 - Implement card service integration

#### 16. **Excessive Console Logging**
- **Location**: Throughout codebase
- **Severity**: LOW
- **Description**: Too many console.log statements in production
- **Impact**: Performance impact, information leakage
- **Evidence**: 50+ console.log statements in transfer flow
- **Root Cause**: Debugging left in code
- **Fix Priority**: P3 - Implement proper logging level

#### 17. **No Loading States**
- **Location**: UI components
- **Severity**: LOW
- **Description**: No loading indicators on async operations
- **Impact**: Users unsure if app is working
- **Evidence**: SMS sending has no loading indicator
- **Root Cause**: Async operations not tracked
- **Fix Priority**: P3 - Add loading states

#### 18. **Hardcoded Transfer Fee**
- **Location**: `transfer-screen.tsx`
- **Severity**: LOW
- **Description**: Transfer fee hardcoded to ₦30
- **Impact**: Can't change fee structure dynamically
- **Evidence**:
  ```typescript
  const transferFee = 30.0  // Hardcoded
  ```
- **Root Cause**: No fee configuration service
- **Fix Priority**: P3 - Implement configurable fees

#### 19. **No Internationalization (i18n)**
- **Location**: All components
- **Severity**: MEDIUM
- **Description**: All text hardcoded in English
- **Impact**: Can't support other languages
- **Evidence**: No i18n library, no translation files
- **Root Cause**: Single-language design
- **Fix Priority**: P3 - Implement i18n

#### 20. **No Accessibility Features**
- **Location**: Components
- **Severity**: MEDIUM
- **Description**: Limited accessibility (ARIA labels, keyboard nav)
- **Impact**: App not usable for disabled users
- **Evidence**: Missing aria-labels, no keyboard navigation
- **Root Cause**: Accessibility not prioritized
- **Fix Priority**: P2 - Add WCAG compliance

---

### LOW PRIORITY ISSUES 🔵

#### 21. **Duplicate Dependencies**
- **Location**: package.json
- **Severity**: LOW
- **Description**: Some Radix UI packages using "latest" version
- **Impact**: Unpredictable updates, version conflicts
- **Evidence**:
  ```json
  "@radix-ui/react-accordion": "latest",  // Should be pinned version
  "@radix-ui/react-alert-dialog": "latest"
  ```
- **Root Cause**: Rapid scaffolding with v0
- **Fix Priority**: P3 - Pin all dependencies

#### 22. **No Performance Optimization**
- **Location**: Components
- **Severity**: LOW
- **Description**: No lazy loading, code splitting, or memoization
- **Impact**: Slower app startup
- **Evidence**: All components imported directly
- **Root Cause**: Performance not prioritized
- **Fix Priority**: P3 - Add code splitting

#### 23. **Service Worker Outdated**
- **Location**: `/public/sw.js`
- **Severity**: LOW
- **Description**: Service worker v1.1, no versioning strategy
- **Impact**: Hard to manage cache updates
- **Evidence**: `CACHE_NAME = "ecobank-express-v1.1"`
- **Root Cause**: Manual versioning
- **Fix Priority**: P3 - Implement workbox

#### 24. **No Analytics**
- **Location**: App
- **Severity**: LOW
- **Description**: No usage analytics or error tracking
- **Impact**: Can't track user behavior or bugs
- **Evidence**: No analytics service integrated
- **Root Cause**: Not in scope for MVP
- **Fix Priority**: P3 - Add Sentry/Analytics

#### 25. **No Testing**
- **Location**: Project root
- **Severity**: MEDIUM
- **Description**: No unit tests, integration tests, or e2e tests
- **Impact**: No confidence in code changes
- **Evidence**: No jest.config, no test files
- **Root Cause**: Testing not implemented
- **Fix Priority**: P2 - Add testing framework

---

## RECOMMENDATIONS

### Immediate Actions (Week 1)

1. **Fix Build Configuration**
   - [ ] Enable TypeScript type checking (remove `ignoreBuildErrors`)
   - [ ] Enable ESLint (remove `ignoreDuringBuilds`)
   - [ ] Fix all TypeScript errors
   - [ ] Fix all lint errors

2. **Reduce CSS Framework Bloat**
   - [ ] Remove Bulma, Materialize, Foundation from package.json
   - [ ] Standardize on Tailwind CSS only
   - [ ] Audit CSS classes for conflicts
   - [ ] Rebuild components with Tailwind only

3. **Fix Critical Security Issues**
   - [ ] Implement server-side authentication
   - [ ] Use environment variables for Twilio credentials (already done, verify)
   - [ ] Remove PIN from client storage
   - [ ] Add CORS headers to API routes
   - [ ] Add Content Security Policy headers

### Short-Term Actions (Month 1)

4. **Implement Backend**
   - [ ] Create Node.js/Express backend service
   - [ ] Implement user authentication with JWT
   - [ ] Create database schema for users, transactions, beneficiaries
   - [ ] Implement API endpoints for all data operations
   - [ ] Add rate limiting and request validation

5. **Add Error Handling**
   - [ ] Implement React Error Boundary component
   - [ ] Add try/catch blocks in all async operations
   - [ ] Implement proper error logging/tracking
   - [ ] Add user-friendly error messages
   - [ ] Implement fallback UI for errors

6. **Add Testing**
   - [ ] Set up Jest and React Testing Library
   - [ ] Write unit tests for utilities (form-utils, data-store)
   - [ ] Write integration tests for transfer flow
   - [ ] Add e2e tests with Playwright/Cypress
   - [ ] Set up CI/CD test pipeline

7. **Implement Rate Limiting**
   - [ ] Add login attempt limiting (3 per minute)
   - [ ] Implement account lockout (15 min after 3 failures)
   - [ ] Add API request rate limiting
   - [ ] Implement CAPTCHA for repeated failures

### Medium-Term Actions (Q1 2026)

8. **Complete Feature Implementations**
   - [ ] Finish Loan Management system
   - [ ] Implement Bill Payment processor
   - [ ] Integrate Virtual Card service
   - [ ] Add POS transaction support
   - [ ] Implement Currency Exchange service

9. **Add Internationalization**
   - [ ] Set up i18n library (next-i18next)
   - [ ] Create translation files for major languages
   - [ ] Add language selector in settings
   - [ ] Test with RTL languages (Arabic, etc.)

10. **Improve Accessibility**
    - [ ] Add ARIA labels to all interactive elements
    - [ ] Implement keyboard navigation
    - [ ] Test with screen readers
    - [ ] Ensure WCAG 2.1 AA compliance
    - [ ] Add accessibility testing in CI/CD

11. **Optimize Performance**
    - [ ] Implement code splitting with dynamic imports
    - [ ] Add lazy loading for images/components
    - [ ] Optimize bundle size (analyze with webpack-bundle-analyzer)
    - [ ] Implement request memoization
    - [ ] Add performance monitoring

### Long-Term Actions (Q2-Q3 2026)

12. **Enhance Security**
    - [ ] Implement OAuth/OpenID Connect
    - [ ] Add biometric authentication (WebAuthn)
    - [ ] Implement certificate pinning for API calls
    - [ ] Add encryption for sensitive data at rest
    - [ ] Implement regular security audits

13. **Scale Infrastructure**
    - [ ] Migrate to production database (PostgreSQL/MongoDB)
    - [ ] Implement caching layer (Redis)
    - [ ] Set up CDN for static assets
    - [ ] Implement load balancing
    - [ ] Add disaster recovery/backup strategy

14. **Add Advanced Features**
    - [ ] Implement real-time notifications (WebSocket)
    - [ ] Add dispute/chargeback handling
    - [ ] Implement transaction scheduling
    - [ ] Add multi-currency support
    - [ ] Implement investment/savings products

### Priority Matrix

```
             IMPACT
           Low    High
        ┌──────────────┐
    H   │  13    8,4   │
I   i   │        3,5   │
M   g   ├──────────────┤
P   h   │  22   1,2,6,7│
A       │  24   10,20  │
C   L   └──────────────┘
T   o
    w
```

**P0 (Do Immediately)**:
- Fix build configuration (1)
- Implement backend authentication (2)
- Remove plaintext credential storage (3)

**P1 (Do This Sprint)**:
- Add rate limiting (4)
- Implement error boundaries (8)
- Reduce CSS framework bloat (reduce)

**P2 (Do This Quarter)**:
- Add testing framework (25)
- Improve accessibility (20)
- Fix transaction order (11)

**P3 (Nice to Have)**:
- Complete feature implementations (13-15)
- Add i18n (19)
- Performance optimization (22)

---

## CONCLUSION

**AlertMe/Ecobank Express Lite** is a well-designed prototype PWA for mobile banking with comprehensive UI components and reasonable state management. However, it has critical security and architecture issues that prevent production deployment.

### Current State
- ✅ UI/UX: Modern, responsive, well-designed
- ✅ PWA: Offline support, installable, fullscreen mode
- ✅ State Management: Singleton DataStore with persistence
- ✅ SMS Integration: Twilio properly configured
- ❌ Authentication: No backend, credentials in plaintext
- ❌ Data Persistence: Mock data only, no real database
- ❌ Error Handling: No error boundaries or proper error handling
- ❌ Testing: No tests, no test infrastructure

### Path Forward

The application requires significant architectural changes before production use:

1. **Backend Development** (~4 weeks)
   - Implement REST/GraphQL API
   - Set up authentication service
   - Create database schema
   - Implement transaction processing

2. **Security Hardening** (~2 weeks)
   - Implement proper authentication
   - Add encryption for sensitive data
   - Add rate limiting and validation
   - Implement CORS and security headers

3. **Quality Assurance** (~3 weeks)
   - Implement testing framework
   - Write comprehensive tests
   - Perform security audit
   - Load and performance testing

4. **Feature Completion** (~Ongoing)
   - Complete loan management
   - Implement bill payments
   - Add virtual cards
   - Add real-time notifications

**Estimated Timeline to Production**: 12-16 weeks with dedicated team

---

**Document End**

Version 1.0 | Date: January 23, 2026 | Status: Complete System Evaluation

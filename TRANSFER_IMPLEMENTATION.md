# Transfer Pages Implementation Guide

## Overview
This document outlines the comprehensive implementation of transfer pages with proper form validation, CBN banking standards compliance, error handling, and unit tests.

## Transfer Types Implemented

### 1. **Domestic Bank Transfer** (`domestic-transfer-form.tsx`)
- **Purpose**: Transfer funds to other Nigerian banks
- **Key Features**:
  - Account number validation (10-digit format)
  - Real-time beneficiary lookup
  - Daily limit: ₦5,000,000
  - Save beneficiary functionality
  - Transaction remarks

**CBN Compliance**:
- ✅ Account validation to 10 digits
- ✅ Daily transfer limits enforced
- ✅ Beneficiary verification required
- ✅ Audit trail via dataStore

---

### 2. **Mobile Money Transfer** (`mobile-money-transfer-form.tsx`)
- **Purpose**: Transfer to mobile wallets (Opay, PalmPay, Paga, etc.)
- **Key Features**:
  - Phone number validation (Nigerian format)
  - Provider selection (8 major providers)
  - Phone number normalization to +234 format
  - Daily limit: ₦1,000,000
  - Auto-normalize phone format

**Supported Providers**:
- Opay
- PalmPay
- Paga
- Kuda Bank
- Fairmoney
- MoMo PSB (MTN)
- MONIPOINT MFB
- NowNow Digital

**CBN Compliance**:
- ✅ Phone number validation
- ✅ Mobile money-specific limits
- ✅ KYC through phone number
- ✅ Transaction logging

---

### 3. **International Transfer** (`international-transfer-form.tsx`)
- **Purpose**: Cross-border transfers to other countries
- **Key Features**:
  - SWIFT code validation (8-11 character alphanumeric)
  - IBAN validation (country code + digits + alphanumeric)
  - Currency selection (USD, EUR, GBP, CAD, AUD)
  - Purpose of transfer (required for AML)
  - Beneficiary address requirement
  - Daily limit: ₦100,000
  - BVN verification required

**Supported Countries**:
- United States (USD)
- United Kingdom (GBP)
- Canada (CAD)
- Australia (AUD)
- Germany, France (EUR)
- South Africa (ZAR)
- Kenya (KES)
- Ghana (GHS)

**CBN Compliance**:
- ✅ KYC/BVN verification required
- ✅ AML - Purpose of transfer mandatory
- ✅ SWIFT/IBAN validation
- ✅ Enhanced due diligence for international
- ✅ Daily transfer limits strictly enforced

---

### 4. **Standing Order (Recurring Transfer)** (`standing-order-form.tsx`)
- **Purpose**: Scheduled recurring transfers
- **Key Features**:
  - Start and end date validation
  - Frequency options (daily, weekly, biweekly, monthly, quarterly, yearly)
  - Minimum 7-day duration
  - Maximum 3-year duration
  - Daily limit: ₦1,000,000

**Frequencies Supported**:
- Daily
- Weekly (7 days)
- Biweekly (14 days)
- Monthly (30 days)
- Quarterly (90 days)
- Yearly (365 days)

**CBN Compliance**:
- ✅ Recurring transaction limits
- ✅ Duration validation (7 days - 3 years)
- ✅ Start date must be current or future
- ✅ Audit trail for all occurrences

---

### 5. **Visa Direct** (`visa-direct-transfer-form.tsx`)
- **Purpose**: Card-to-card transfers
- **Key Features**:
  - 16-digit card number validation
  - Luhn algorithm card validation
  - Expiry date validation
  - Card holder name verification
  - Daily limit: ₦500,000
  - Card security indicators

**CBN Compliance**:
- ✅ Card validation (Luhn algorithm)
- ✅ Expiry date checking
- ✅ Daily Visa Direct limits
- ✅ Cardholder verification
- ✅ Fraud detection ready

---

## Form Label Standards

All forms follow consistent labeling:
- **Source Account**: Always displayed as read-only
- **Amount**: Clearly shows max limit and currency (₦)
- **Optional fields**: Marked with "(Optional)"
- **Required fields**: Marked with * asterisk
- **Error messages**: Red background with AlertCircle icon
- **Success indicators**: Green/blue checkmarks for valid input

---

## Validation Framework

### Custom Schemas (from `form-utils.ts`):
```typescript
- accountNumberSchema: 10 digits, numeric only
- nameSchema: 1-100 characters
- amountSchema: Positive number, max 2 decimals
- phoneSchema: Valid Nigerian format
- emailSchema: Valid email format
- pinSchema: Exactly 4 digits
```

### Type-Specific Schemas:
1. **Domestic Transfer**: Adds daily limit ₦5M
2. **Mobile Money**: Adds phone validation, daily limit ₦1M
3. **International**: Adds SWIFT/IBAN, currency, purpose, daily limit ₦100K
4. **Standing Order**: Adds date range, frequency validation
5. **Visa Direct**: Adds card validation, Luhn check, daily limit ₦500K

---

## Error Handling

### SMS Error Handler (`sms-error-handler.ts`)

**Error Types Categorized**:
1. `NETWORK_ERROR` - Retryable, user message about internet
2. `INVALID_PHONE` - Non-retryable, invalid format
3. `THROTTLE_LIMIT` - Retryable, rate limit exceeded
4. `INVALID_RECIPIENT` - Non-retryable, recipient verification failed
5. `DELIVERY_FAILED` - Retryable, SMS delivery failed
6. `TIMEOUT` - Retryable, request timeout
7. `UNKNOWN` - Retryable, unexpected error

### Retry Logic:
- **Max Retries**: 3 attempts
- **Initial Delay**: 1000ms
- **Backoff**: Exponential (multiplier: 2x)
- **Max Delay**: 10000ms
- **Retryable Errors**: Network, throttle, timeout, delivery failed
- **Non-Retryable**: Invalid phone, invalid recipient

### Integration with Transfers:
```typescript
// In transfer-processing-screen.tsx
await sendSMSWithRetry(
  userPhone,
  smsMessage,
  sendFunction,
  { maxRetries: 3, initialDelayMs: 1000, ... }
)
```

---

## User Input Validation

### Phone Number Validation:
```
✅ +2348012345678
✅ 08012345678
✅ 2348012345678
❌ 12345678901 (wrong country)
❌ 080123456 (too short)
```

### Account Number Validation:
```
✅ 1234567890 (exactly 10 digits)
❌ 123456789 (9 digits)
❌ 12345678901 (11 digits)
❌ 123ABC7890 (contains letters)
```

### Amount Validation:
```
✅ 1000 (integer)
✅ 1000.00 (two decimals)
✅ 1000.50 (two decimals)
❌ 1000.123 (three decimals)
❌ 0 (must be positive)
❌ -100 (must be positive)
❌ abc (must be numeric)
```

### Card Validation:
```
✅ 4532123456789010 (valid 16-digit, passes Luhn)
❌ 453212345678901 (15 digits)
❌ 1111111111111111 (16 digits, fails Luhn)
```

---

## CBN Banking Standards Compliance

### Daily Transfer Limits by Type:
| Transfer Type | Daily Limit | CBN Requirement |
|---|---|---|
| Domestic | ₦5,000,000 | Tier 1 customer |
| Mobile Money | ₦1,000,000 | Tier 2 customer |
| International | ₦100,000 | KYC + BVN required |
| Standing Order | ₦1,000,000 | Recurring verification |
| Visa Direct | ₦500,000 | Card holder verification |

### KYC Requirements:
- **Domestic**: Name, account number, phone
- **Mobile Money**: Phone number, recipient name
- **International**: BVN mandatory, address required, purpose required
- **Standing Order**: Account number, start/end dates
- **Visa Direct**: Card details, cardholder name, expiry

### Audit Trail Implementation:
- Transaction ID generation
- Reference number tracking
- Timestamp logging
- User identification
- Amount tracking
- Status updates (pending, successful, failed)

---

## Unit Tests

### Test Files:
1. **`__tests__/sms-error-handler.test.ts`**
   - Error categorization
   - Retry delay calculation
   - Error formatting for users

2. **`__tests__/transfer-validation.test.ts`**
   - Account number validation
   - Name validation
   - Amount validation
   - Phone validation
   - Transfer-type specific validation
   - CBN compliance checks

3. **`__tests__/transfer-integration.test.ts`**
   - Complete form validation flows
   - Daily limit enforcement
   - Field requirement validation
   - Date range validation
   - Phone normalization
   - SWIFT/IBAN validation
   - Card Luhn validation
   - CBN compliance validation

### Running Tests:
```bash
npm run test
npm run test:watch
npm run test:coverage
```

---

## Component Structure

```
components/
├── transfer-router.tsx (Main router)
├── transfer-forms/
│   ├── domestic-transfer-form.tsx
│   ├── mobile-money-transfer-form.tsx
│   ├── international-transfer-form.tsx
│   ├── standing-order-form.tsx
│   └── visa-direct-transfer-form.tsx
├── transfer-processing-screen.tsx (Enhanced with SMS)
└── transfer-options.tsx (Entry point)

lib/
├── form-utils.ts (Base validation schemas)
├── sms-error-handler.ts (SMS error handling)
├── sms-service.ts (SMS sending logic)
└── data-store.ts (Transaction storage)
```

---

## Integration Points

### TransferRouter Component:
Routes based on transfer type to appropriate form:
```typescript
<TransferRouter 
  transferType="domestic" | "mobile-money" | "international" | "standing-order" | "visa-direct"
  onBack={() => handleBack()}
  onSubmit={(data) => handleTransfer(data)}
/>
```

### TransferProcessingScreen:
- Validates PIN
- Processes payment
- Sends SMS alert with retry logic
- Logs transaction
- Navigates to success screen

---

## Future Enhancements

1. **Biometric Authentication**: For high-value transfers
2. **Real-time Exchange Rates**: For international transfers
3. **Push Notifications**: Transaction status updates
4. **Scheduled Transfer Management**: View/edit/cancel standing orders
5. **Transfer Templates**: Save frequent transfer patterns
6. **Multi-Currency Wallet**: Support for forex transfers
7. **Transaction Analytics**: Spending patterns and insights

---

## Troubleshooting

### Form Label Issues:
All form labels now use consistent class: `"text-sm font-medium text-gray-700 mb-2 block"`

### Validation Not Working:
Check that zod schema is properly imported and methods.register() is used.

### SMS Alerts Not Sent:
Check SMS error handler logs and ensure phone number is valid.

### Transfer Not Completing:
Verify daily limits haven't been exceeded and account has sufficient balance.

---

## Testing Checklist

- [ ] Test each transfer form with valid data
- [ ] Test daily limits enforcement
- [ ] Test phone number normalization
- [ ] Test date range validation for standing orders
- [ ] Test card validation with Luhn algorithm
- [ ] Test SMS error handling and retry logic
- [ ] Test beneficiary saving
- [ ] Test transaction logging
- [ ] Test error message display
- [ ] Test accessibility (keyboard navigation, screen readers)

---

## Version Information

- **Last Updated**: January 28, 2026
- **CBN Standards**: As of 2026
- **Validation Framework**: Zod v3
- **Testing Framework**: Vitest

---


# Nigerian Banks & Digital Wallets Integration Guide

## Overview
This guide explains how the comprehensive Nigerian banks and digital wallets list has been integrated into the AlertMe system, ensuring consistency, maintainability, and CBN compliance across all forms and validations.

---

## File Structure

### Primary Data File: `/lib/banks-data.ts`
**Purpose**: Centralized, single source of truth for all Nigerian financial institutions

**Contents**:
- ✅ 24 Commercial Banks (Tier 1 & 2)
- ✅ 4 Development Banks
- ✅ 20+ Microfinance Banks
- ✅ 22 Digital Wallets & Payment Platforms
- ✅ USSD codes for direct banking access
- ✅ Bank codes (CBN-standardized)
- ✅ Institution types and descriptions

**Data Structure**:
```typescript
interface BankData {
  name: string           // Official institution name
  code: string           // CBN standard code or custom ID
  type: "bank" | "wallet" | "microfinance" | "international" | "development"
  description?: string   // Institution category/description
  ussd?: string         // Direct banking USSD code
}
```

### Reference Documentation: `/lib/NIGERIAN_BANKS_WALLETS_REFERENCE.md`
**Purpose**: Human-readable reference with complete list, USSD codes, and descriptions

**Includes**:
- Tabular view of all institutions by category
- USSD codes for mobile banking
- Institution codes and descriptions
- Maintenance schedule

### Integration Guide: `/lib/BANKS_WALLETS_INTEGRATION_GUIDE.md` (this file)
**Purpose**: Documentation for developers on integration patterns

---

## Helper Functions

All functions are exported from `/lib/banks-data.ts`:

### Getting Specific Institution Lists

```typescript
// Get all commercial banks (Tier 1 & 2)
import { getAllBanks } from '@/lib/banks-data'
const banks = getAllBanks()

// Get all microfinance institutions
import { getAllMicrofinanceBanks } from '@/lib/banks-data'
const mfbs = getAllMicrofinanceBanks()

// Get all digital wallets and payment platforms
import { getAllWallets } from '@/lib/banks-data'
const wallets = getAllWallets()

// Get all banks suitable for transfers (commercial + microfinance + development)
import { getAllTransferBanks } from '@/lib/banks-data'
const transferBanks = getAllTransferBanks()

// Get combined list of banks and wallets
import { getAllBanksAndWallets } from '@/lib/banks-data'
const all = getAllBanksAndWallets()
```

### Finding Specific Institutions

```typescript
// Find by name
import { findBankByName } from '@/lib/banks-data'
const gtb = findBankByName("Guaranty Trust Bank (GTB)")

// Find by code
import { findBankByCode } from '@/lib/banks-data'
const gtb = findBankByCode("058")
```

---

## Component Integration

### Domestic Transfer Form
**File**: `/components/transfer-forms/domestic-transfer-form.tsx`

**Integration**:
```typescript
import { getAllTransferBanks } from '@/lib/banks-data'

// In render:
<SelectContent className="max-h-60">
  {getAllTransferBanks().map((bank) => (
    <SelectItem key={bank.code} value={bank.name}>
      {bank.name}
    </SelectItem>
  ))}
</SelectContent>
```

**Benefits**:
- ✅ Includes all commercial banks, microfinance, and development banks
- ✅ Automatically updated when banks-data.ts is modified
- ✅ CBN-compliant codes and names
- ✅ Consistent with other forms

### Mobile Money Transfer Form
**File**: `/components/transfer-forms/mobile-money-transfer-form.tsx`

**Integration**:
```typescript
import { getAllWallets } from '@/lib/banks-data'

// Dynamically build provider list:
const MOBILE_MONEY_PROVIDERS = getAllWallets().map((wallet) => ({
  name: wallet.name,
  code: wallet.code,
}))
```

**Benefits**:
- ✅ All digital wallets in one place
- ✅ No hardcoded strings to maintain
- ✅ Easy to add/remove wallets
- ✅ Consistent with international transfer and other forms

---

## Form Validation Schemas

All form validation schemas in the system reference the centralized banks list for consistency:

### Domestic Transfer Schema
```typescript
const domesticTransferSchema = z.object({
  bank: z.string().min(1, "Please select a bank"),
  accountNumber: accountNumberSchema,
  beneficiaryName: nameSchema,
  amount: amountSchema.refine((n) => n <= 5000000, {
    message: "Daily transfer limit is ₦5,000,000",
  }),
})
```

### Mobile Money Transfer Schema
```typescript
const mobileMoneyTransferSchema = z.object({
  provider: z.string().min(1, "Please select a provider"),
  phoneNumber: phoneNumberSchema,
  beneficiaryName: nameSchema,
  amount: amountSchema.refine((n) => n <= 1000000, {
    message: "Daily mobile money limit is ₦1,000,000",
  }),
})
```

---

## Adding New Institutions

### Step 1: Update banks-data.ts

Add the institution to the appropriate array:

```typescript
// For a new commercial bank:
export const NIGERIAN_BANKS: BankData[] = [
  // ... existing banks ...
  {
    name: "New Bank Nigeria",
    code: "999",  // CBN code
    type: "bank",
    description: "Tier 2 Commercial Bank",
    ussd: "*NEW#"
  },
]
```

### Step 2: Update Reference Documentation
Update `/lib/NIGERIAN_BANKS_WALLETS_REFERENCE.md` with the new institution in the appropriate table.

### Step 3: Forms Automatically Update
Since all forms use helper functions, they automatically include the new institution.

### Step 4: Test
Verify the institution appears in all relevant forms:
- Domestic transfers
- Mobile money transfers
- Beneficiary management
- Payment screens

---

## Removing or Deprecating Institutions

### Step 1: Archive in banks-data.ts
```typescript
// Mark as archived (optional, for historical records)
{
  name: "Deprecated Bank Nigeria",
  code: "888",
  type: "bank",
  description: "DEPRECATED - Archived 2026",
  // This will NOT appear in getAllBanks()
}
```

### Step 2: Update Reference
Remove from `/lib/NIGERIAN_BANKS_WALLETS_REFERENCE.md`

### Step 3: Communicate
Forms will automatically stop showing this institution

---

## CBN Compliance

### Bank Codes
- All bank codes follow CBN standard format
- Codes are immutable and official
- See `/lib/NIGERIAN_BANKS_WALLETS_REFERENCE.md` for full code list

### Transfer Limits
- **Domestic**: ₦5,000,000 per transaction
- **Mobile Money**: ₦1,000,000 per transaction
- **International**: ₦100,000 per transaction (managed separately)

### USSD Codes
- Direct banking USSD codes where available
- Enables quick access without app for featured banks
- See reference document for complete USSD list

---

## Usage Examples

### Example 1: Display Banks in a Select Dropdown
```typescript
import { getAllTransferBanks } from '@/lib/banks-data'

export function BankSelect() {
  const banks = getAllTransferBanks()
  
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select a bank" />
      </SelectTrigger>
      <SelectContent>
        {banks.map(bank => (
          <SelectItem key={bank.code} value={bank.code}>
            {bank.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

### Example 2: Get Bank Details
```typescript
import { findBankByCode } from '@/lib/banks-data'

export function displayBankInfo(bankCode: string) {
  const bank = findBankByCode(bankCode)
  
  if (bank) {
    return `${bank.name} (${bank.code})`
  }
  return "Unknown bank"
}
```

### Example 3: Filter Wallets for Mobile Money
```typescript
import { getAllWallets } from '@/lib/banks-data'

export function getMobileMoneyWallets() {
  return getAllWallets().filter(w => 
    w.type === "wallet" && 
    w.description?.includes("Mobile") || 
    w.description?.includes("Payment")
  )
}
```

---

## Maintenance Schedule

- **Weekly**: Monitor for new fintech registrations
- **Monthly**: Review CBN bulletins for regulatory changes
- **Quarterly**: Update microfinance bank list (most volatile)
- **Annually**: Comprehensive audit against CBN official records

**Last Update**: February 2, 2026
**Next Review**: May 2, 2026

---

## Support & Questions

For questions about bank data integration:
1. Check `/lib/NIGERIAN_BANKS_WALLETS_REFERENCE.md` for complete list
2. Review helper functions in `/lib/banks-data.ts`
3. Check component implementations in `/components/transfer-forms/`

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-02-02 | 1.0 | Initial comprehensive list with 70+ institutions, USSD codes, helper functions, and integration patterns |

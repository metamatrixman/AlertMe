# Bank and Wallet Integration Guide

## Overview

This guide explains how the Nigerian banks and digital wallets system is integrated throughout the AlertMe application, and how to properly utilize and update this data.

---

## Files and Data Structure

### Core Data Files

#### 1. `/lib/banks-data.ts` - Primary Source
- **Purpose:** Central repository for all Nigerian banks and digital wallet data
- **Exports:**
  - `NIGERIAN_BANKS`: Main array containing all bank/wallet definitions
  - `BankData`: TypeScript interface for bank objects
  - Helper functions: `getAllBanks()`, `getAllWallets()`, `getAllMicrofinanceBanks()`, etc.
  - `PHONE_BASED_WALLETS`: Array of wallets accepting phone numbers as account identifiers

**When to Update:**
- Adding new banks or wallets
- Updating bank codes
- Changing bank classifications
- Adding/modifying bank descriptions

#### 2. `/lib/bank-selection-utils.ts` - Form Integration Utilities
- **Purpose:** Provides form-ready utilities for bank selection across components
- **Key Functions:**
  - `getBankOptionsForFormType()`: Get options for specific form types
  - `getBankConfigForFormType()`: Get full configuration (label, options, etc.)
  - `formatBankOptionsForSelect()`: Grouped options for Select components
  - `formatBankOptionsFlat()`: Flat options list
  - `validateBankSelection()`: Validate bank codes
  - `getBankName()`, `getBankCode()`: Lookup functions

**When to Use:**
- In any form component requiring bank selection
- For validation logic
- For consistent formatting across the app

---

## Components Using Bank Data

### 1. Transfer Forms

#### `components/transfer-forms/domestic-transfer-form.tsx`
- **Uses:** `NIGERIAN_BANKS`
- **Purpose:** Domestic bank transfers
- **Bank Selection:** All banks and microfinance banks
- **Implementation:**
  ```typescript
  import { NIGERIAN_BANKS } from "@/lib/banks-data"
  
  // In the Select component:
  {NIGERIAN_BANKS.map(bank => (
    <SelectItem key={bank.code} value={bank.code}>
      {bank.name}
    </SelectItem>
  ))}
  ```

#### `components/transfer-forms/standing-order-form.tsx`
- **Uses:** `NIGERIAN_BANKS`
- **Purpose:** Recurring transfer setup
- **Bank Selection:** All banks and microfinance banks
- **Implementation:** Same as domestic transfer form

#### `components/transfer-forms/international-transfer-form.tsx`
- **Uses:** `NIGERIAN_BANKS`
- **Purpose:** International transfers
- **Bank Selection:** Only tier-1 and international banks
- **Implementation:** Filter banks by type before rendering

#### `components/transfer-forms/mobile-money-transfer-form.tsx`
- **Uses:** `NIGERIAN_BANKS`, `PHONE_BASED_WALLETS`
- **Purpose:** Mobile money transfers
- **Bank Selection:** Wallets only
- **Special Logic:** Phone number as account identifier

#### `components/transfer-forms/ecobank-domestic-transfer-form.tsx`
- **Uses:** `NIGERIAN_BANKS`
- **Purpose:** Ecobank-specific transfers
- **Implementation:** Single bank pre-selected

#### `components/transfer-forms/ecobank-africa-transfer-form.tsx`
- **Uses:** `NIGERIAN_BANKS`
- **Purpose:** Ecobank pan-African transfers
- **Implementation:** Filtered country-specific banks

#### `components/transfer-forms/email-sms-transfer-form.tsx`
- **Uses:** `NIGERIAN_BANKS`
- **Purpose:** Transfer via email/SMS
- **Implementation:** Limited bank selection

#### `components/transfer-forms/visa-direct-transfer-form.tsx`
- **Uses:** `NIGERIAN_BANKS`
- **Purpose:** Visa Direct international transfers
- **Implementation:** International banks only

### 2. Beneficiary Management

#### `components/new-beneficiary.tsx`
- **Uses:** `NIGERIAN_BANKS`
- **Purpose:** Add new beneficiaries
- **Bank Selection:** All banks and wallets
- **Features:**
  - Save beneficiary with bank details
  - Lookup existing beneficiaries
  - Transfer amount input

#### `components/enhanced-new-beneficiary.tsx`
- **Uses:** `NIGERIAN_BANKS`, `PHONE_BASED_WALLETS`
- **Purpose:** Enhanced beneficiary interface
- **Bank Selection:** All banks and wallets
- **Special Features:**
  - Conditional account number/phone field
  - Beneficiary tabs (new/saved)
  - Visual feedback

#### `components/beneficiary-management.tsx`
- **Uses:** `NIGERIAN_BANKS`
- **Purpose:** Manage saved beneficiaries
- **Implementation:** Display bank info from stored beneficiary data

#### `components/beneficiary-lookup.tsx`
- **Uses:** `NIGERIAN_BANKS`
- **Purpose:** Search and verify beneficiaries
- **Implementation:** Lookup account details by bank code

### 3. Service Status and Monitoring

#### `components/bank-service-status.tsx`
- **Uses:** `NIGERIAN_BANKS`
- **Purpose:** Display bank operational status
- **Implementation:**
  - Generates status for all banks
  - Shows uptime percentage
  - Color-coded status indicators

#### `components/enhanced-bank-service-status.tsx`
- **Uses:** `NIGERIAN_BANKS`
- **Purpose:** Enhanced status monitoring
- **Implementation:** Similar to bank-service-status with improvements

### 4. Business Card / Share Details

#### `components/share-details-modal.tsx`
- **Uses:** `NIGERIAN_BANKS`
- **Purpose:** Share account details via SMS
- **Implementation:** Select bank for business card

### 5. SMS Notifications

#### `components/sms-template-composer.tsx`
- **Uses:** `NIGERIAN_BANKS`
- **Purpose:** SMS template creation
- **Implementation:** Bank references in templates

---

## Data Flow Architecture

```
┌─────────────────────────────┐
│  /lib/banks-data.ts         │
│  (Primary Source)           │
│  - NIGERIAN_BANKS array     │
│  - Helper functions         │
│  - Type definitions         │
└──────────────┬──────────────┘
               │
      ┌────────┴────────┐
      │                 │
┌─────▼──────────────────┐     ┌──────────────────────┐
│ /lib/bank-selection-   │     │ Components using     │
│ utils.ts               │     │ banks data directly  │
│ (Form Integration)     │     │ - Transfer forms     │
│ - formatOptions()      │     │ - Beneficiary comps  │
│ - validate()           │     │ - Service status     │
│ - lookup()             │     │ - Share details      │
└──────────────┬─────────┘     └──────────────────────┘
               │
      ┌────────▼────────┐
      │   Components    │
      │ with proper     │
      │ formatting      │
      └─────────────────┘
```

---

## How to Add a New Bank

### Step 1: Update `banks-data.ts`

```typescript
// Add to the appropriate section of NIGERIAN_BANKS array
{ 
  name: "New Bank Name", 
  code: "XXX", // 3-digit CBN code
  type: "bank" | "wallet" | "microfinance", // as appropriate
  description: "Tier X Commercial Bank" // optional
}
```

### Step 2: Verify Consistency

- Check if the bank code already exists
- Ensure consistent naming with official CBN records
- Verify the type classification

### Step 3: Test in Components

```bash
# Components automatically pick up the new bank
# No changes needed in individual components
# Run tests to verify:

npm run test
```

### Example: Adding Minted Bank

```typescript
// In /lib/banks-data.ts
{ 
  name: "Minted Bank", 
  code: "108", 
  type: "bank", 
  description: "Tier 2 Commercial Bank" 
}
```

All components that reference `NIGERIAN_BANKS` will automatically include Minted Bank.

---

## How to Update a Bank

### Example: Update Opay Details

```typescript
// Before
{ name: "Opay", code: "999992", type: "wallet", description: "Digital Wallet & Payment Platform" }

// After
{ name: "Opay", code: "999992", type: "wallet", description: "Digital Wallet & Payment Platform (FMDA License)" }
```

---

## Form-Specific Implementation Patterns

### Pattern 1: Simple Select with All Banks

```typescript
import { NIGERIAN_BANKS } from "@/lib/banks-data"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"

export function BankSelectExample() {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select a bank" />
      </SelectTrigger>
      <SelectContent>
        {NIGERIAN_BANKS.map(bank => (
          <SelectItem key={bank.code} value={bank.code}>
            {bank.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

### Pattern 2: Grouped Banks (Recommended)

```typescript
import { formatBankOptionsForSelect } from "@/lib/bank-selection-utils"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"

export function BankSelectGroupedExample() {
  const grouped = formatBankOptionsForSelect()
  
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select a bank" />
      </SelectTrigger>
      <SelectContent>
        {grouped.map(group => (
          <optgroup key={group.label} label={group.label}>
            {group.options.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </optgroup>
        ))}
      </SelectContent>
    </Select>
  )
}
```

### Pattern 3: Filtered Banks by Type

```typescript
import { getAllBanks, getAllWallets } from "@/lib/banks-data"
import { formatBankOptionsFlat } from "@/lib/bank-selection-utils"

// Only commercial banks
const bankOptions = formatBankOptionsFlat("banks")

// Only wallets
const walletOptions = formatBankOptionsFlat("wallets")

// Only microfinance
const mfbOptions = formatBankOptionsFlat("microfinance")
```

### Pattern 4: Validation

```typescript
import { validateBankSelection, requiresPhoneNumber } from "@/lib/bank-selection-utils"

// Validate bank code
const result = validateBankSelection(selectedBankCode)
if (!result.valid) {
  console.error(result.error)
}

// Check if bank requires phone number
if (requiresPhoneNumber(selectedBankName)) {
  // Show phone number input instead of account number
}
```

---

## Testing Bank Integration

### Unit Tests Example

```typescript
import { validateBankSelection, getBankName, getBankCode } from "@/lib/bank-selection-utils"

describe("Bank Selection Utils", () => {
  it("should validate correct bank code", () => {
    const result = validateBankSelection("044")
    expect(result.valid).toBe(true)
    expect(result.bank?.name).toBe("Access Bank")
  })
  
  it("should return error for invalid code", () => {
    const result = validateBankSelection("999")
    expect(result.valid).toBe(false)
    expect(result.error).toBeDefined()
  })
  
  it("should get bank name from code", () => {
    expect(getBankName("044")).toBe("Access Bank")
  })
  
  it("should get bank code from name", () => {
    expect(getBankCode("Access Bank")).toBe("044")
  })
})
```

---

## Data Validation Rules

### Bank Code Requirements
- ✓ 3-digit codes for CBN-registered banks
- ✓ 6-digit codes for microfinance banks
- ✓ 99XXXX format for digital wallets (non-standard)
- ✗ Codes must be unique
- ✗ Codes must be alphanumeric (digits only)

### Bank Name Requirements
- ✓ Exact match with official CBN records
- ✓ Consistent capitalization
- ✗ No abbreviations unless official
- ✗ No special characters except parentheses

---

## Performance Considerations

The `NIGERIAN_BANKS` array is intentionally:
- ✓ Imported once and cached
- ✓ Loaded synchronously (small dataset)
- ✓ Used directly in components (no API calls)
- ✓ Searchable in O(n) time

For large-scale applications:
- Consider indexing by code for O(1) lookups
- Implement memoization for repeated searches
- Cache grouped/formatted options

---

## Migration Guide: From Hardcoded to Centralized

If you find hardcoded bank lists in components:

### Before (Hardcoded)
```typescript
const banks = [
  { label: "Access Bank", value: "044" },
  { label: "Zenith Bank", value: "057" },
  // ... manually maintained list
]
```

### After (Centralized)
```typescript
import { formatBankOptionsFlat } from "@/lib/bank-selection-utils"

const banks = formatBankOptionsFlat("banks")
```

---

## Future Enhancements

Planned improvements to the banking system:

1. **Bank Logos**: Add logo URLs to BankData
2. **Mobile Money Codes**: Expand digital wallet support
3. **SWIFT Codes**: Add SWIFT codes for international transfers
4. **Contact Info**: Add customer service contact numbers
5. **Branch Locator**: Integration with branch/ATM data
6. **Real-time Status**: API integration for bank service status
7. **Fee Information**: Dynamic fee calculation per bank
8. **Rate Information**: Live forex rates for international transfers

---

## Support and Updates

For questions or to suggest new banks:
1. Check `/docs/NIGERIAN_BANKS_AND_WALLETS.md` for current list
2. Verify against official CBN records
3. Submit pull request with updates
4. Include CBN reference documentation

---

**Document Version:** 1.0  
**Last Updated:** February 2, 2026  
**Maintained By:** AlertMe Development Team

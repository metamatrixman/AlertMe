# Transfer Router Integration Guide

## Quick Start

The new transfer system is ready to use with minimal changes to your existing app.

---

## Option 1: Use New Transfer Router (Recommended)

### In `app/page.tsx`, update the transfer handling:

```tsx
import { TransferRouter } from "@/components/transfer-router"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState("splash")
  const [transferType, setTransferType] = useState<string | null>(null)
  const [transferData, setTransferData] = useState<any>(null)

  const handleNavigate = (screen: string, data?: any) => {
    setCurrentScreen(screen)
    
    // NEW: Capture transfer type
    if (screen.includes("transfer") && data?.transferType) {
      setTransferType(data.transferType)
    }
    
    if (data) {
      setTransferData(data)
    }
  }

  const renderScreen = () => {
    switch (currentScreen) {
      // ... other cases ...
      
      // NEW: Route transfers through TransferRouter
      case "transfer-domestic":
      case "transfer-mobile-money":
      case "transfer-international":
      case "transfer-standing-order":
      case "transfer-visa-direct":
        return (
          <TransferRouter 
            transferType={transferType || currentScreen.replace("transfer-", "")}
            onBack={() => setCurrentScreen("transfer-options")}
            onSubmit={(data) => {
              setTransferData(data)
              setCurrentScreen("pin-confirmation")
            }}
          />
        )
      
      // OLD: Keep for backward compatibility
      case "transfer":
        return <TransferScreen onBack={handleBack} onNavigate={handleNavigate} transferData={transferData} />
      
      // ... rest of cases ...
    }
  }

  return (
    <div className="relative">
      {renderScreen()}
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onNavigate={handleNavigate} />
      <Toaster />
    </div>
  )
}
```

---

## Option 2: Use New Forms Directly

If you prefer to use individual transfer forms:

```tsx
import { DomesticTransferForm } from "@/components/transfer-forms/domestic-transfer-form"
import { MobileMoneyTransferForm } from "@/components/transfer-forms/mobile-money-transfer-form"
import { InternationalTransferForm } from "@/components/transfer-forms/international-transfer-form"
import { StandingOrderForm } from "@/components/transfer-forms/standing-order-form"
import { VisaDirectTransferForm } from "@/components/transfer-forms/visa-direct-transfer-form"

// Use based on transfer type
const handleDomesticTransfer = (data: any) => {
  console.log("Domestic transfer:", data)
  onNavigate("pin-confirmation", data)
}

return (
  <DomesticTransferForm 
    onSubmit={handleDomesticTransfer}
    isLoading={false}
  />
)
```

---

## Option 3: Keep Existing Flow

The old components still work:

```tsx
// TransferOptions → NewBeneficiary → TransferScreen → PinConfirmation → TransactionSuccess

case "transfer-options":
  return <TransferOptions onBack={handleBack} onNavigate={handleNavigate} />

case "new-beneficiary":
  return <NewBeneficiary onBack={handleBack} onNavigate={handleNavigate} />

case "transfer":
  return <TransferScreen onBack={handleBack} onNavigate={handleNavigate} transferData={transferData} />
```

---

## Transfer Data Flow

### New Router-Based Flow:
```
TransferOptions
    ↓
TransferRouter (type-specific form)
    ├── DomesticTransferForm
    ├── MobileMoneyTransferForm
    ├── InternationalTransferForm
    ├── StandingOrderForm
    └── VisaDirectTransferForm
    ↓
PinConfirmation
    ↓
TransferProcessingScreen (with SMS retry)
    ↓
TransactionSuccess
```

### Data Passed Through Flow:
```typescript
{
  transferType: "domestic" | "mobile-money" | "international" | "standing-order" | "visa-direct"
  
  // Common fields
  beneficiaryName: string
  amount: number
  remark?: string
  
  // Type-specific fields
  // Domestic/Standing Order:
  bank: string
  accountNumber: string
  
  // Mobile Money:
  provider: string
  phoneNumber: string
  
  // International:
  country: string
  bankName: string
  swiftCode: string
  iban: string
  beneficiaryAddress: string
  currency: string
  purposeOfTransfer: string
  
  // Standing Order:
  frequency: string
  startDate: string
  endDate: string
  
  // Visa Direct:
  cardNumber: string
  cardHolderName: string
  expiryMonth: string
  expiryYear: string
}
```

---

## SMS Alert Configuration

The transfer processing now includes automatic SMS alerts with retry logic:

```typescript
// In transfer-processing-screen.tsx
const smsResult = await sendSMSWithRetry(
  userData.phone,
  message,
  async (phone, msg) => {
    try {
      await SMSService.sendAlert(phone, msg)
      return { success: true, messageId: id }
    } catch (err) {
      return { success: false, error: String(err) }
    }
  },
  {
    maxRetries: 3,
    initialDelayMs: 1000,
    maxDelayMs: 10000,
    backoffMultiplier: 2
  }
)

// SMS still fails gracefully - transaction completes even if SMS fails
if (!smsResult.success && smsResult.error) {
  logSMSError(smsResult.error, { transactionId: id })
  console.warn("SMS alert failed but transaction completed")
}
```

---

## Environment Variables Needed

Make sure you have SMS configuration in `.env`:

```env
# SMS Service
SMS_PROVIDER=twilio|nexmo|custom
SMS_API_KEY=your_api_key
SMS_SENDER_ID=YourBankName

# Optional: Logging
LOG_LEVEL=debug|info|warn|error
```

---

## Error Handling Example

```typescript
import { categorizeSMSError, formatSMSErrorForUser, logSMSError } from "@/lib/sms-error-handler"

try {
  const result = await sendSMSWithRetry(phone, message, sendFunction)
  
  if (!result.success) {
    const error = result.error!
    
    // Log for debugging
    logSMSError(error, { context: "transaction" })
    
    // Show user-friendly message
    const userMessage = formatSMSErrorForUser(error)
    toast({
      title: "SMS Alert Failed",
      description: userMessage,
      variant: "warning"
    })
    
    // If retryable, suggest retry
    if (error.retryable) {
      console.log("You can retry this operation")
    }
  }
} catch (err) {
  console.error("Unexpected error:", err)
}
```

---

## Testing Your Integration

### 1. Test Domestic Transfer:
```bash
# Navigate to Transfer → Other local banks → Fill form
# Verify:
- Account number validation (10 digits)
- Bank selection works
- Amount validation works
- Daily limit ₦5M enforced
- Beneficiary lookup works
- SMS alert sent with retry
```

### 2. Test Mobile Money:
```bash
# Navigate to Transfer → Mobile money → Fill form
# Verify:
- Phone number validation (Nigerian format)
- Provider selection works
- Phone normalization (+234 format)
- Daily limit ₦1M enforced
- SMS alert sent with retry
```

### 3. Test International:
```bash
# Navigate to Transfer → International Transfers → Fill form
# Verify:
- BVN requirement enforced
- SWIFT/IBAN validation works
- Purpose of transfer required
- Daily limit ₦100K enforced
- SMS alert sent with retry
```

### 4. Test Error Handling:
```bash
# Simulate SMS failure (mock sendSMSWithRetry)
# Verify:
- Error retry happens automatically
- Transaction still completes
- User sees appropriate message
- Error is logged for debugging
```

---

## Backward Compatibility

The old components still work if you don't use the new TransferRouter:

- ✅ `TransferOptions` - unchanged
- ✅ `NewBeneficiary` - still available
- ✅ `TransferScreen` - still available
- ⚠️ Enhanced `TransferProcessingScreen` - now includes SMS

---

## Performance Optimization

The new forms are optimized:

```typescript
// Memoized to prevent unnecessary re-renders
export const DomesticTransferForm = memo(DomesticTransferFormComponent)

// Form validation is async and non-blocking
const methods = useValidatedForm(schema, defaultValues)

// Phone number normalization is instant
const normalized = normalizePhoneNumber(input) // < 10ms
```

---

## Mobile Responsiveness

All forms are mobile-first and responsive:

```typescript
// Bottom fixed button for mobile
<div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
  <Button type="submit" className="w-full ...">
    Continue
  </Button>
</div>

// Grid layouts adapt to screen size
<div className="grid grid-cols-2 gap-3">
  {/* Expiry date fields for visa direct */}
</div>
```

---

## Monitoring & Analytics

To add analytics, update the transfer submission:

```typescript
const handleSubmit = async (data: any) => {
  // Track event
  trackEvent({
    event: "transfer_initiated",
    transferType: data.transferType,
    amount: data.amount,
    timestamp: new Date().toISOString()
  })
  
  onSubmit(data)
}
```

---

## Support & Troubleshooting

### Issue: "Form not validating"
**Solution**: Ensure zod schema is properly imported and methods.register() is used.

### Issue: "SMS not sending"
**Solution**: Check SMS service configuration and phone number format.

### Issue: "Daily limit not enforced"
**Solution**: Verify dataStore.getTransactions() is being called to check daily total.

### Issue: "Form labels still broken"
**Solution**: All form labels now use consistent class. If issues persist, check className props.

---

## Running Tests

```bash
# All tests
npm run test

# Specific test file
npm run test transfer-validation.test.ts

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

---

## Migration Timeline

### Phase 1 (Immediate):
- [x] Deploy new transfer forms
- [x] Deploy transfer router
- [x] Deploy SMS error handler
- [x] Keep old components for fallback

### Phase 2 (1 week):
- Monitor error rates
- Verify SMS delivery success rate
- Collect user feedback

### Phase 3 (2 weeks):
- Deprecate old components if no issues
- Optimize based on analytics
- Add new features

---

## Contact & Support

For issues or questions:
1. Check `TRANSFER_IMPLEMENTATION.md` for detailed documentation
2. Review test files for usage examples
3. Check error logs in browser console
4. Review dataStore logs for transaction issues

---

## Version History

- **v1.0.0** - Initial release (Jan 28, 2026)
  - 5 transfer type forms
  - SMS error handling with retry
  - Comprehensive validation
  - Full test coverage

---


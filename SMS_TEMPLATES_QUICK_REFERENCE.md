# SMS Templates Quick Reference

## 📌 Quick Stats
- **Total Templates**: 192
- **Banks Covered**: 24
- **Wallets Covered**: 24
- **Templates per Institution**: 4 (Debit, Credit, Balance, Low Balance)

---

## 🚀 Quick Usage

### Option 1: Get Templates for a Bank
```typescript
import { getBankTemplates } from "@/lib/alert-templates"

const zenithTemplates = getBankTemplates("Zenith Bank")
// Returns: { debit, credit, balance, lowBalance }
```

### Option 2: Generate Bank-Branded Alert
```typescript
import { generateDebitAlert } from "@/lib/alert-templates"

const alert = generateDebitAlert(
  50000,              // amount
  "John Doe",         // recipient
  250000,             // balance
  "REF123456",        // reference
  "Zenith Bank"       // ← bank name
)
```

### Option 3: Use SMS Service
```typescript
import { SMSService } from "@/lib/sms-service"

// Get all templates for a bank
const templates = SMSService.getTemplatesForBank("Access Bank")

// Get specific template type
const debit = SMSService.getTemplatesByType("Access Bank", "debit")

// Process template with variables
const message = SMSService.processTemplate(debit.content, {
  amount: "100,000",
  recipient: "Jane Smith",
  balance: "500,000",
  reference: "ACC123456"
})
```

---

## 📚 All Supported Banks

### Commercial Banks (24)
Access Bank, Citibank Nigeria, Ecobank Nigeria, Fidelity Bank, First Bank, FCMB, GTB, Heritage Bank, Keystone Bank, Polaris Bank, Providus Bank, Stanbic IBTC, Standard Chartered, Sterling Bank, UBN, UBA, Unity Bank, Wema Bank, Zenith Bank, Jaiz Bank, SunTrust Bank, Titan Trust Bank, Globus Bank, PremiumTrust Bank

### Digital Wallets (24)
Opay, PalmPay, Kuda Bank, Carbon, Cowrywise, PiggyVest, Flutterwave, Paystack, Interswitch, Paga, Quickteller, Remita, VFD MFB, Rubies Bank, Sparkle MFB, Mint Finex MFB, GoMoney, Eyowo, Fairmoney, NowNow Digital, MoMo PSB, Renmoney, MONIPOINT MFB, Plam Pay

---

## 🔤 Template Variables

All templates use these standard variables:
- `{amount}` - Transaction amount (formatted with currency)
- `{recipient}` - Person/account receiving funds
- `{sender}` - Person/account sending funds
- `{balance}` - Current account balance
- `{reference}` - Transaction reference number

---

## 📄 Files

| File | Purpose |
|------|---------|
| `lib/alert-templates.ts` | Template definitions and generators |
| `lib/sms-service.ts` | SMS service with template methods |
| `SMS_TEMPLATES_COVERAGE.md` | Complete coverage report |
| `SMS_TEMPLATES_IMPLEMENTATION.md` | Implementation details |
| `lib/sms-templates-demo.ts` | Usage examples |

---

## 💡 Examples

### Access Bank Debit Alert
```
ACCESS ALERT: Your account has been debited with NGN50,000 to John Doe. 
Available Bal: NGN250,000. Ref: ACC20250123001
```

### Zenith Bank Debit Alert
```
ZENITH ALERT: Debit of NGN50,000 to John Doe. Bal: NGN250,000. Ref: REF123456
```

### Opay Debit Alert
```
OPAY: NGN50,000 sent to John Doe. Bal: NGN250,000. Ref: OPY20250123001
```

### GTB Credit Alert
```
GTB ALERT: Credit of NGN100,000 from Nigeria Revenue Service. 
Available balance: NGN500,000. Ref: GTB20250123002
```

---

## ✅ Verification

All templates are:
- ✅ Bank/wallet branded
- ✅ Professionally formatted
- ✅ Consistent variable usage
- ✅ Clear and informative
- ✅ Ready for production use

---

## 🔗 Related Documentation

- [Complete Coverage Report](SMS_TEMPLATES_COVERAGE.md)
- [Implementation Details](SMS_TEMPLATES_IMPLEMENTATION.md)
- [Demo & Examples](lib/sms-templates-demo.ts)

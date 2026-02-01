# Business Logic Implementation Patterns

## Standard Balance Validation Pattern (Used in All Transfer Forms)

```typescript
// CRITICAL: Validate sufficient balance for transfer + fee
const totalAmount = transferAmount + fee

if (userData.balance < totalAmount) {
  setFormError(
    `Insufficient balance. You need ₦${totalAmount.toLocaleString()} ` +
    `(₦${transferAmount.toLocaleString()} transfer + ₦${fee} fee). ` +
    `Current balance: ₦${userData.balance.toLocaleString()}`
  )
  return
}
```

## Transfer Fee Definitions

```typescript
// Domestic Transfer
const transferFee = 30.0  // CBN regulated

// Ecobank Domestic
const transferFee = 0  // No fee for same-bank transfers

// Ecobank Africa
const africaTransferFee = 100  // Cross-country within Ecobank

// International
const internationalFee = 500  // SWIFT transfers

// Mobile Money
const mobileFee = 50  // Third-party wallet transfers

// Email/SMS
const emailSmsFee = 10  // Claim link transfers

// Visa Direct
const visaDirectFee = 25  // Card-to-card transfers

// Bill Payment
const billFee = 50  // Utility/service provider payments
```

## Fee Inclusion in Transaction (All Forms)

```typescript
onSubmit({
  accountNumber: payload.accountNumber,
  bank: payload.bank,
  beneficiaryName: payload.name,
  amount: values.amount,
  remark: values.remark,
  transferType: "domestic",
  fee: 30,  // ← CRITICAL: Always include fee
})
```

## Balance Deduction Logic (in dataStore)

```typescript
async addTransaction(transaction: Transaction) {
  // ... setup transaction
  
  // Ensure amount and fee are numbers with proper precision
  newTransaction.amount = Number(Number(newTransaction.amount).toFixed(2))
  if (newTransaction.fee !== undefined) {
    newTransaction.fee = Number(Number(newTransaction.fee).toFixed(2))
  }

  // Update balance with precise rounding
  if (newTransaction.isDebit) {
    const delta = -(newTransaction.amount + (newTransaction.fee || 0))
    this.state.userData.balance = Number((this.state.userData.balance + delta).toFixed(2))
  } else {
    const delta = newTransaction.amount
    this.state.userData.balance = Number((this.state.userData.balance + delta).toFixed(2))
  }
}
```

## Daily Transfer Limit Pattern

```typescript
const dailyTransactions = dataStore.getTransactions().filter((t) => {
  const txDate = new Date(t.date).toDateString()
  const today = new Date().toDateString()
  return txDate === today && t.isDebit  // Only count debits on today's date
})

const dailyTotal = dailyTransactions.reduce((sum, tx) => sum + tx.amount, 0)
if (dailyTotal + values.amount > DAILY_LIMIT) {
  setFormError(`Daily limit exceeded. Today's usage: ₦${dailyTotal.toLocaleString()}`)
  return
}
```

## Form Error Display Pattern

```typescript
{formError && (
  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
    <div className="text-sm text-red-700">{formError}</div>
  </div>
)}
```

## Bill Payment Handler Pattern

```typescript
const handlePayBill = async () => {
  setFormError("")
  try {
    const billAmount = Number(amount)
    const billFee = 50
    const totalAmount = billAmount + billFee

    // 1. Validate balance
    if (userData.balance < totalAmount) {
      setFormError(
        `Insufficient balance. You need ₦${totalAmount.toLocaleString()} ` +
        `(₦${billAmount.toLocaleString()} bill + ₦${billFee} fee). ` +
        `Current balance: ₦${userData.balance.toLocaleString()}`
      )
      return
    }

    setIsProcessing(true)

    // 2. Record transaction
    await dataStore.addTransaction({
      type: `${selectedCategory} Bill Payment`,
      amount: billAmount,
      recipient: selectedProvider,
      status: "Successful",
      description: `${selectedProvider} - ${customerID}`,
      isDebit: true,
      section: "Today",
      recipientBank: selectedCategory,
      fee: billFee,
    })

    // 3. Reset form and navigate
    setSelectedCategory("")
    setSelectedProvider("")
    setCustomerID("")
    setAmount("")
    setIsProcessing(false)
    onNavigate("dashboard")
  } catch (err) {
    setIsProcessing(false)
    setFormError(err instanceof Error ? err.message : "Failed to process bill payment")
  }
}
```

## Amount Formatting Pattern

```typescript
const handleAmountInput = (value: string) => {
  // Remove all non-numeric except decimal point
  const cleaned = value.replace(/[^0-9.]/g, '')
  // Remove multiple decimal points
  const formatted = cleaned.replace(/(\..*)\./g, '$1')
  setAmount(formatted)
}

const handleAmountBlur = () => {
  if (!amount) return
  // Parse as float and format to 2 decimal places
  const n = Number(amount)
  setAmount(Number(n.toFixed(2)).toFixed(2))
}
```

## Total Amount Display Pattern

```typescript
{amount && (
  <div className="bg-gray-50 p-3 rounded-lg">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm text-gray-600">Bill Amount</span>
      <span className="font-semibold">₦{formatCurrency(Number(amount))}</span>
    </div>
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm text-gray-600">Bill Fee</span>
      <span className="font-semibold">₦50.00</span>
    </div>
    <div className="flex justify-between items-center pt-2 border-t">
      <span className="text-sm font-bold">Total</span>
      <span className="font-bold text-[#004A9F]">
        ₦{formatCurrency(Number(amount) + 50)}
      </span>
    </div>
  </div>
)}
```

## Transaction Recording Pattern

```typescript
await dataStore.addTransaction({
  type: "Transfer to other bank",        // Transaction type
  amount: transferAmount,                 // Principal amount
  recipient: transferData.beneficiaryName, // Recipient info
  status: "Successful",                   // Status
  description: `Transfer to ${transferData.bank}`, // Details
  isDebit: true,                          // Debit flag (for balance calculation)
  section: "Today",                       // Time section
  recipientBank: transferData.bank,       // Additional details
  recipientAccount: transferData.accountNumber,
  senderAccount: userData.accountNumber,
  fee: 30,                                // ← CRITICAL: Fee included
})
```

## Floating Point Precision Pattern

```typescript
// Always use .toFixed(2) for financial calculations
const amount = Number((50000.126).toFixed(2))  // 50000.13

const balance = Number((100000.456).toFixed(2))  // 100000.46

// For multi-step calculations
let balance = 100000.00
balance -= 30.00
balance -= 30.00
balance -= 30.00

// Result should be 99910.00, not 99909.99999999998
expect(balance).toBe(99910.00)
```

---

## Summary of Fix Scope

### Forms Updated (8 total)
1. Domestic Transfer ✅
2. Ecobank Domestic ✅
3. Ecobank Africa ✅
4. International ✅
5. Mobile Money ✅
6. Email/SMS ✅
7. Visa Direct ✅
8. Standing Order ✅

### Screens Updated (1 total)
1. Pay Bills Screen ✅

### Screens Verified (1 total)
1. Add Funds Modal ✅ (no changes needed)

### Validation Added
- Balance check (amount + fee) ✅
- Daily limits preserved ✅
- Per-transaction limits preserved ✅
- Fee calculations ✅
- Error messages ✅

### Data Integrity
- Floating point precision ✅
- Transaction recording ✅
- Balance updates ✅
- Fee deductions ✅

---

This implementation ensures:
1. **Security**: Users can't initiate transfers they can't afford
2. **Accuracy**: All calculations use proper rounding to prevent floating point errors
3. **Compliance**: CBN regulations for transfer limits and fees are enforced
4. **Transparency**: Users see clear breakdowns of transfers + fees
5. **Auditability**: All transactions record fees for auditing purposes

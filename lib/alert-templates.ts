/**
 * SMS Alert Templates for Banking Transactions
 */

export function generateDebitAlert(amount: number, recipient: string, balance: number, reference: string): string {
  return `ECOBANK ALERT: Debit of NGN${amount.toLocaleString()} to ${recipient}. Bal: NGN${balance.toLocaleString()}. Ref: ${reference}. Time: ${new Date().toLocaleString()}`
}

export function generateCreditAlert(amount: number, sender: string, balance: number, reference: string): string {
  return `ECOBANK ALERT: Credit of NGN${amount.toLocaleString()} from ${sender}. Bal: NGN${balance.toLocaleString()}. Ref: ${reference}. Time: ${new Date().toLocaleString()}`
}

export function generateBalanceInquiryAlert(balance: number): string {
  return `ECOBANK ALERT: Your account balance is NGN${balance.toLocaleString()}. Time: ${new Date().toLocaleString()}`
}

export function generateLowBalanceAlert(balance: number): string {
  return `ECOBANK ALERT: Low balance warning. Your account balance is NGN${balance.toLocaleString()}. Please fund your account.`
}

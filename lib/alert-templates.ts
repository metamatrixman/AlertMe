/**
 * SMS Alert Templates for Banking Transactions
 */

import { formatCurrency } from "@/lib/form-utils"

export function generateDebitAlert(amount: number, recipient: string, balance: number, reference: string): string {
  return `ECOBANK ALERT: Debit of NGN${formatCurrency(amount)} to ${recipient}. Bal: NGN${formatCurrency(balance)}. Ref: ${reference}. Time: ${new Date().toLocaleString()}`
}

export function generateCreditAlert(amount: number, sender: string, balance: number, reference: string): string {
  return `ECOBANK ALERT: Credit of NGN${formatCurrency(amount)} from ${sender}. Bal: NGN${formatCurrency(balance)}. Ref: ${reference}. Time: ${new Date().toLocaleString()}`
}

export function generateBalanceInquiryAlert(balance: number): string {
  return `ECOBANK ALERT: Your account balance is NGN${formatCurrency(balance)}. Time: ${new Date().toLocaleString()}`
}

export function generateLowBalanceAlert(balance: number): string {
  return `ECOBANK ALERT: Low balance warning. Your account balance is NGN${formatCurrency(balance)}. Please fund your account.`
}

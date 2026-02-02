"use client"

import { NIGERIAN_BANKS, BankData, getAllBanks, getAllMicrofinanceBanks, getAllWallets, getAllBanksAndWallets } from "./banks-data"

/**
 * Bank and Wallet Selection Utilities
 * Provides structured data and helper functions for forms requiring bank/wallet selection
 */

/**
 * Configuration for different form types that need bank selection
 */
export const BANK_SELECTION_CONFIG = {
  // Domestic transfers: Banks + Microfinance banks
  domesticTransfer: {
    label: "Select Recipient Bank",
    description: "Choose the bank where the recipient holds an account",
    options: getAllBanksAndWallets(),
    placeholder: "Search and select a bank",
    required: true,
  },
  
  // International transfers: Only tier-1 and international banks
  internationalTransfer: {
    label: "Select Receiving Bank",
    description: "Select your receiving bank (must be internationally connected)",
    options: NIGERIAN_BANKS.filter(b => b.type === "bank" || b.type === "international"),
    placeholder: "Search and select a bank",
    required: true,
  },
  
  // Beneficiary setup: All banks and wallets
  addBeneficiary: {
    label: "Select Bank",
    description: "Select the bank or wallet associated with this account",
    options: getAllBanksAndWallets(),
    placeholder: "Search and select a bank or wallet",
    required: true,
  },
  
  // Loan applications: Banks for income verification
  loanApplication: {
    label: "Select Your Bank",
    description: "Select your primary bank account for document verification",
    options: getAllBanks(),
    placeholder: "Choose your bank",
    required: true,
  },
  
  // Mobile money transfers: Only digital wallets
  mobileMoney: {
    label: "Select Mobile Money Service",
    description: "Choose the mobile money service",
    options: getAllWallets(),
    placeholder: "Search and select a service",
    required: true,
  },
  
  // Standing orders: Banks and microfinance
  standingOrder: {
    label: "Select Recipient Bank",
    description: "Choose the bank for recurring transfers",
    options: getAllBanksAndWallets(),
    placeholder: "Search and select a bank",
    required: true,
  },
}

/**
 * Get bank options for a specific form type
 */
export function getBankOptionsForFormType(formType: keyof typeof BANK_SELECTION_CONFIG): BankData[] {
  return BANK_SELECTION_CONFIG[formType]?.options || []
}

/**
 * Get bank config for a specific form type
 */
export function getBankConfigForFormType(formType: keyof typeof BANK_SELECTION_CONFIG) {
  return BANK_SELECTION_CONFIG[formType] || BANK_SELECTION_CONFIG.domesticTransfer
}

/**
 * Format bank options for Select components (with grouping)
 */
export function formatBankOptionsForSelect() {
  const groupedOptions = [
    {
      label: "Tier 1 Banks",
      options: NIGERIAN_BANKS.filter(b => b.type === "bank" && b.description?.includes("Tier 1")).map(b => ({
        value: b.code,
        label: b.name,
      })),
    },
    {
      label: "Tier 2 Banks",
      options: NIGERIAN_BANKS.filter(b => b.type === "bank" && b.description?.includes("Tier 2")).map(b => ({
        value: b.code,
        label: b.name,
      })),
    },
    {
      label: "Microfinance Banks",
      options: NIGERIAN_BANKS.filter(b => b.type === "microfinance").map(b => ({
        value: b.code,
        label: b.name,
      })),
    },
    {
      label: "Digital Wallets",
      options: NIGERIAN_BANKS.filter(b => b.type === "wallet").map(b => ({
        value: b.code,
        label: b.name,
      })),
    },
  ]
  
  return groupedOptions.filter(group => group.options.length > 0)
}

/**
 * Format flat bank options for simple Select components
 */
export function formatBankOptionsFlat(filterType?: "all" | "banks" | "wallets" | "microfinance") {
  let banks = NIGERIAN_BANKS
  
  if (filterType === "banks") {
    banks = getAllBanks()
  } else if (filterType === "wallets") {
    banks = getAllWallets()
  } else if (filterType === "microfinance") {
    banks = getAllMicrofinanceBanks()
  }
  
  return banks.map(b => ({
    value: b.code,
    label: b.name,
  }))
}

/**
 * Validate bank selection
 */
export function validateBankSelection(bankCode: string): { valid: boolean; bank?: BankData; error?: string } {
  const bank = NIGERIAN_BANKS.find(b => b.code === bankCode)
  
  if (!bank) {
    return {
      valid: false,
      error: "Invalid bank selection",
    }
  }
  
  return {
    valid: true,
    bank,
  }
}

/**
 * Get bank name from code
 */
export function getBankName(code: string): string {
  const bank = NIGERIAN_BANKS.find(b => b.code === code)
  return bank?.name || "Unknown Bank"
}

/**
 * Get bank code from name
 */
export function getBankCode(name: string): string {
  const bank = NIGERIAN_BANKS.find(b => b.name.toLowerCase() === name.toLowerCase())
  return bank?.code || ""
}

/**
 * Check if a bank is a wallet/digital service
 */
export function isWallet(bankCode: string): boolean {
  const bank = NIGERIAN_BANKS.find(b => b.code === bankCode)
  return bank?.type === "wallet" || false
}

/**
 * Check if a bank requires phone number as account number
 */
export function requiresPhoneNumber(bankName: string): boolean {
  const walletName = getBankName(getBankCode(bankName))
  return ["Opay", "PalmPay", "Paga", "Kuda Bank", "Fairmoney", "NowNow Digital Systems", "MoMo PSB"].some(
    w => walletName.includes(w)
  )
}

/**
 * Export all banks as a simple array for quick reference
 */
export function getAllBankNames(): string[] {
  return NIGERIAN_BANKS.map(b => b.name).sort()
}

/**
 * Export all banks with codes as a map
 */
export function getBankNameCodeMap(): Record<string, string> {
  const map: Record<string, string> = {}
  NIGERIAN_BANKS.forEach(b => {
    map[b.name] = b.code
  })
  return map
}

/**
 * Export codes to names map
 */
export function getBankCodeNameMap(): Record<string, string> {
  const map: Record<string, string> = {}
  NIGERIAN_BANKS.forEach(b => {
    map[b.code] = b.name
  })
  return map
}

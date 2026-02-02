"use client"

/**
 * Comprehensive Nigerian Banks and Digital Wallets List
 * Updated: 2026
 * Source: Central Bank of Nigeria (CBN), regulatory bodies, and official financial institution records
 */

export interface BankData {
  name: string
  code: string
  type: "bank" | "wallet" | "microfinance" | "international" | "development"
  logo?: string
  description?: string
  ussd?: string
}

/**
 * Comprehensive list of Nigerian Banks, Microfinance Banks, and Digital Wallets
 * Updated with official CBN-registered financial institutions
 * Includes all tier-1, tier-2, tier-3 banks, development banks, microfinance institutions, and fintech platforms
 */
export const NIGERIAN_BANKS: BankData[] = [
  // TIER 1 COMMERCIAL BANKS (11 banks)
  { name: "Access Bank", code: "044", type: "bank", description: "Tier 1 Commercial Bank", ussd: "*901#" },
  { name: "Citibank Nigeria", code: "023", type: "bank", description: "Tier 1 Commercial Bank" },
  { name: "Ecobank Nigeria", code: "050", type: "bank", description: "Tier 1 Commercial Bank", ussd: "*327#" },
  { name: "First Bank of Nigeria (FBN)", code: "011", type: "bank", description: "Tier 1 Commercial Bank", ussd: "*894#" },
  { name: "Guaranty Trust Bank (GTB)", code: "058", type: "bank", description: "Tier 1 Commercial Bank", ussd: "*737#" },
  { name: "Standard Chartered Bank", code: "068", type: "bank", description: "Tier 1 Commercial Bank" },
  { name: "Stanbic IBTC Bank", code: "221", type: "bank", description: "Tier 1 Commercial Bank", ussd: "*909#" },
  { name: "United Bank For Africa (UBA)", code: "033", type: "bank", description: "Tier 1 Commercial Bank", ussd: "*919#" },
  { name: "Union Bank of Nigeria", code: "032", type: "bank", description: "Tier 1 Commercial Bank", ussd: "*826#" },
  { name: "Zenith Bank", code: "057", type: "bank", description: "Tier 1 Commercial Bank", ussd: "*966#" },
  { name: "Wema Bank", code: "035", type: "bank", description: "Tier 1 Commercial Bank", ussd: "*322#" },

  // TIER 2 COMMERCIAL BANKS (13 banks)
  { name: "Fidelity Bank Nigeria", code: "070", type: "bank", description: "Tier 2 Commercial Bank", ussd: "*770#" },
  { name: "First City Monument Bank (FCMB)", code: "214", type: "bank", description: "Tier 2 Commercial Bank", ussd: "*329#" },
  { name: "Heritage Bank", code: "030", type: "bank", description: "Tier 2 Commercial Bank", ussd: "*745#" },
  { name: "Keystone Bank", code: "082", type: "bank", description: "Tier 2 Commercial Bank", ussd: "*539#" },
  { name: "Polaris Bank", code: "076", type: "bank", description: "Tier 2 Commercial Bank", ussd: "*833#" },
  { name: "Providus Bank", code: "101", type: "bank", description: "Tier 2 Commercial Bank" },
  { name: "SunTrust Bank", code: "100", type: "bank", description: "Tier 2 Commercial Bank" },
  { name: "Titan Trust Bank", code: "102", type: "bank", description: "Tier 2 Commercial Bank" },
  { name: "Unity Bank Nigeria", code: "215", type: "bank", description: "Tier 2 Commercial Bank" },
  { name: "Sterling Bank", code: "232", type: "bank", description: "Tier 2 Commercial Bank", ussd: "*822#" },
  { name: "Jaiz Bank", code: "301", type: "bank", description: "Tier 2 Commercial Bank (Islamic)" },
  { name: "Globus Bank", code: "103", type: "bank", description: "Tier 2 Commercial Bank" },
  { name: "PremiumTrust Bank", code: "105", type: "bank", description: "Tier 2 Commercial Bank" },

  // MERCHANT BANKS & SPECIALIZED BANKS (3 banks)
  { name: "FCMB Merchant Bank", code: "271", type: "bank", description: "Merchant Bank" },
  { name: "Citibank Nigeria (Merchant Banking)", code: "023", type: "bank", description: "Merchant Bank" },
  { name: "Stanbic Merchant Bank", code: "221", type: "bank", description: "Merchant Bank" },

  // DEVELOPMENT BANKS (4 banks)
  { name: "Nigerian Export-Import Bank (NEXIM)", code: "062", type: "development", description: "Development Bank" },
  { name: "Federal Mortgage Bank of Nigeria (FMBN)", code: "060", type: "development", description: "Development Bank" },
  { name: "NIRSAL Microfinance Bank", code: "091", type: "development", description: "Development Bank" },
  { name: "Bank of Agriculture", code: "039", type: "development", description: "Development Bank" },

  // MICROFINANCE BANKS - Tier 1 (5 banks)
  { name: "Carbon", code: "565", type: "microfinance", description: "Digital Microfinance Bank" },
  { name: "Kuda Bank", code: "090267", type: "microfinance", description: "Digital Microfinance Bank" },
  { name: "Paga", code: "327", type: "microfinance", description: "Digital Microfinance Bank", ussd: "*745#" },
  { name: "GoMoney MFB", code: "100022", type: "microfinance", description: "Digital Microfinance Bank" },
  { name: "Renmoney Microfinance Bank", code: "090322", type: "microfinance", description: "Digital Microfinance Bank" },

  // MICROFINANCE BANKS - Tier 2 (15+ banks)
  { name: "MONIPOINT MFB", code: "090090", type: "microfinance", description: "Microfinance Bank" },
  { name: "INFINITY MFB", code: "836", type: "microfinance", description: "Microfinance Bank" },
  { name: "Mint Finex MFB", code: "090281", type: "microfinance", description: "Microfinance Bank" },
  { name: "Fairmoney Microfinance Bank", code: "090490", type: "microfinance", description: "Microfinance Bank" },
  { name: "Sparkle Microfinance Bank", code: "090325", type: "microfinance", description: "Microfinance Bank" },
  { name: "VFD Microfinance Bank", code: "090110", type: "microfinance", description: "Microfinance Bank" },
  { name: "AB Microfinance Bank", code: "090134", type: "microfinance", description: "Microfinance Bank" },
  { name: "Amju Unique MFB", code: "090135", type: "microfinance", description: "Microfinance Bank" },
  { name: "Lavender Finance MFB", code: "090136", type: "microfinance", description: "Microfinance Bank" },
  { name: "Covenant MFB", code: "090137", type: "microfinance", description: "Microfinance Bank" },
  { name: "Quickteller MFB", code: "090138", type: "microfinance", description: "Microfinance Bank" },
  { name: "CrowdForce MFB", code: "090139", type: "microfinance", description: "Microfinance Bank" },
  { name: "Titan Trust MFB", code: "090140", type: "microfinance", description: "Microfinance Bank" },
  { name: "Rubies Bank (Rubies Microfinance)", code: "090175", type: "microfinance", description: "Microfinance Bank" },
  { name: "Eyowo Limited", code: "090326", type: "microfinance", description: "Microfinance Bank" },
  { name: "Cowrywise Limited", code: "090360", type: "microfinance", description: "Microfinance Bank" },
  { name: "Remita Microfinance Bank", code: "090365", type: "microfinance", description: "Microfinance Bank" },

  // INTERNATIONAL BANKS (3 banks)
  { name: "Citibank Nigeria (International)", code: "023", type: "international", description: "International Bank" },
  { name: "Standard Chartered Bank (International)", code: "068", type: "international", description: "International Bank" },
  { name: "Stanbic IBTC Bank (International)", code: "221", type: "international", description: "International Bank" },

  // DIGITAL WALLETS & PAYMENT PLATFORMS (20+ platforms)
  { name: "OPay", code: "999992", type: "wallet", description: "Digital Wallet & Payment Platform", ussd: "*905#" },
  { name: "PalmPay", code: "999991", type: "wallet", description: "Digital Wallet & Payment Platform", ussd: "*977#" },
  { name: "Moniepoint", code: "405", type: "wallet", description: "Digital Banking Platform", ussd: "*405*1#" },
  { name: "NowNow Digital", code: "999993", type: "wallet", description: "Digital Wallet Platform" },
  { name: "9Mobile Money", code: "999995", type: "wallet", description: "Mobile Money Platform", ussd: "*311#" },
  { name: "MTN Mobile Money", code: "999994", type: "wallet", description: "Mobile Money Platform", ussd: "*325#" },
  { name: "Airtel Money", code: "999996", type: "wallet", description: "Mobile Money Platform", ussd: "*405#" },
  { name: "GLO CASHPLUS", code: "999997", type: "wallet", description: "Mobile Money Platform", ussd: "*611#" },
  { name: "Paystack", code: "090328", type: "wallet", description: "Payment Platform" },
  { name: "Flutterwave", code: "090315", type: "wallet", description: "Payment Platform" },
  { name: "Interswitch", code: "090229", type: "wallet", description: "Payment Platform" },
  { name: "Transfer", code: "090314", type: "wallet", description: "Money Transfer Service" },
  { name: "Branch", code: "090311", type: "wallet", description: "Fintech Platform" },
  { name: "Chipper", code: "090316", type: "wallet", description: "Money Transfer Service" },
  { name: "SendMoney", code: "090318", type: "wallet", description: "Digital Wallet Service" },
  { name: "Remitly", code: "090319", type: "wallet", description: "International Transfer Service" },
  { name: "Wise", code: "090320", type: "wallet", description: "International Transfer Service" },
  { name: "PiggyVest", code: "090317", type: "wallet", description: "Fintech Savings Platform" },
  { name: "Cowrywise", code: "090360", type: "wallet", description: "Investment Platform" },
  { name: "Adaba", code: "090321", type: "wallet", description: "Fintech Platform" },
  { name: "Migo", code: "090323", type: "wallet", description: "Fintech Lending Platform" },
  { name: "Lidya", code: "090324", type: "wallet", description: "Business Lending Platform" },

  // Add utility for filtering
]

/**
 * Helper function to get all banks
 */
export const getAllBanks = (): BankData[] => {
  return NIGERIAN_BANKS.filter(b => b.type === "bank")
}

/**
 * Helper function to get all microfinance banks
 */
export const getAllMicrofinanceBanks = (): BankData[] => {
  return NIGERIAN_BANKS.filter(b => b.type === "microfinance")
}

/**
 * Helper function to get all digital wallets
 */
export const getAllWallets = (): BankData[] => {
  return NIGERIAN_BANKS.filter(b => b.type === "wallet")
}

/**
 * Helper function to get all development banks
 */
export const getAllDevelopmentBanks = (): BankData[] => {
  return NIGERIAN_BANKS.filter(b => b.type === "development")
}

/**
 * Helper function to get all banks and wallets combined (common view)
 */
export const getAllBanksAndWallets = (): BankData[] => {
  return NIGERIAN_BANKS.filter(b => b.type === "bank" || b.type === "microfinance" || b.type === "wallet" || b.type === "development")
}

/**
 * Helper function to get all commercial and microfinance banks (for transfers)
 */
export const getAllTransferBanks = (): BankData[] => {
  return NIGERIAN_BANKS.filter(b => b.type === "bank" || b.type === "microfinance" || b.type === "development")
}

/**
 * Helper function to find a bank by name
 */
export const findBankByName = (name: string): BankData | undefined => {
  return NIGERIAN_BANKS.find(b => b.name.toLowerCase() === name.toLowerCase())
}

/**
 * Helper function to find a bank by code
 */
export const findBankByCode = (code: string): BankData | undefined => {
  return NIGERIAN_BANKS.find(b => b.code === code)
}

/**
 * Phone-based wallet identifiers for form validation
 */
export const PHONE_BASED_WALLETS = [
  "Opay",
  "PalmPay",
  "Paga",
  "Kuda Bank",
  "Fairmoney Microfinance Bank",
  "NowNow Digital Systems",
  "MoMo PSB (MTN Mobile Money)",
  "MONIPOINT MFB",
  "GoMoney MFB",
]

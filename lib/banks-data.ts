"use client"

export interface BankData {
  name: string
  code: string
  type: "bank" | "wallet"
  logo?: string
}

export const NIGERIAN_BANKS: BankData[] = [
  // Commercial Banks
  { name: "Access Bank", code: "044", type: "bank" },
  { name: "Citibank Nigeria", code: "023", type: "bank" },
  { name: "Ecobank Nigeria", code: "050", type: "bank" },
  { name: "Fidelity Bank", code: "070", type: "bank" },
  { name: "First Bank of Nigeria", code: "011", type: "bank" },
  { name: "First City Monument Bank", code: "214", type: "bank" },
  { name: "Guaranty Trust Bank", code: "058", type: "bank" },
  { name: "Heritage Bank", code: "030", type: "bank" },
  { name: "Keystone Bank", code: "082", type: "bank" },
  { name: "Polaris Bank", code: "076", type: "bank" },
  { name: "Providus Bank", code: "101", type: "bank" },
  { name: "Stanbic IBTC Bank", code: "221", type: "bank" },
  { name: "Standard Chartered Bank", code: "068", type: "bank" },
  { name: "Sterling Bank", code: "232", type: "bank" },
  { name: "Union Bank of Nigeria", code: "032", type: "bank" },
  { name: "United Bank For Africa", code: "033", type: "bank" },
  { name: "Unity Bank", code: "215", type: "bank" },
  { name: "Wema Bank", code: "035", type: "bank" },
  { name: "Zenith Bank", code: "057", type: "bank" },
  { name: "Jaiz Bank", code: "301", type: "bank" },
  { name: "SunTrust Bank", code: "100", type: "bank" },
  { name: "Titan Trust Bank", code: "102", type: "bank" },
  { name: "Globus Bank", code: "103", type: "bank" },
  { name: "PremiumTrust Bank", code: "105", type: "bank" },

  // Digital Wallets & Fintech
  { name: "Opay", code: "999992", type: "wallet" },
  { name: "PalmPay", code: "999991", type: "wallet" },
  { name: "Kuda Bank", code: "090267", type: "wallet" },
  { name: "Carbon", code: "565", type: "wallet" },
  { name: "Cowrywise", code: "090360", type: "wallet" },
  { name: "PiggyVest", code: "090317", type: "wallet" },
  { name: "Flutterwave", code: "090315", type: "wallet" },
  { name: "Paystack", code: "090328", type: "wallet" },
  { name: "Interswitch", code: "090229", type: "wallet" },
  { name: "Paga", code: "327", type: "wallet" },
  { name: "Quickteller", code: "090138", type: "wallet" },
  { name: "Remita", code: "090365", type: "wallet" },
  { name: "VFD Microfinance Bank", code: "090110", type: "wallet" },
  { name: "Rubies Bank", code: "090175", type: "wallet" },
  { name: "Sparkle Microfinance Bank", code: "090325", type: "wallet" },
  { name: "Mint Finex MFB", code: "090281", type: "wallet" },
  { name: "GoMoney", code: "100022", type: "wallet" },
  { name: "Eyowo", code: "090326", type: "wallet" },
  { name: "Fairmoney", code: "090490", type: "wallet" },
  { name: "Renmoney", code: "090322", type: "wallet" },
]

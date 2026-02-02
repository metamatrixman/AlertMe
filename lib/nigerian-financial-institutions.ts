/**
 * Comprehensive list of Nigerian Banks and Digital Wallets
 * Updated: 2026
 * Source: Central Bank of Nigeria (CBN), regulatory bodies, and official financial institution records
 */

export interface Bank {
  id: string
  name: string
  code: string
  category: "commercial" | "microfinance" | "development"
  ussd?: string
}

export interface DigitalWallet {
  id: string
  name: string
  type: "mobile_money" | "fintech" | "payment_provider"
  ussd?: string
}

// Commercial Banks in Nigeria (as of 2026)
export const NIGERIAN_COMMERCIAL_BANKS: Bank[] = [
  {
    id: "gtb",
    name: "Guaranty Trust Bank (GTB)",
    code: "058",
    category: "commercial",
    ussd: "*737#",
  },
  {
    id: "zenith",
    name: "Zenith Bank",
    code: "057",
    category: "commercial",
    ussd: "*966#",
  },
  {
    id: "access",
    name: "Access Bank",
    code: "044",
    category: "commercial",
    ussd: "*901#",
  },
  {
    id: "first",
    name: "First Bank of Nigeria",
    code: "011",
    category: "commercial",
    ussd: "*894#",
  },
  {
    id: "sterling",
    name: "Sterling Bank",
    code: "232",
    category: "commercial",
    ussd: "*822#",
  },
  {
    id: "uba",
    name: "United Bank for Africa (UBA)",
    code: "033",
    category: "commercial",
    ussd: "*919#",
  },
  {
    id: "fidelity",
    name: "Fidelity Bank",
    code: "070",
    category: "commercial",
    ussd: "*770#",
  },
  {
    id: "eco",
    name: "Ecobank Nigeria",
    code: "050",
    category: "commercial",
    ussd: "*327#",
  },
  {
    id: "wema",
    name: "Wema Bank",
    code: "035",
    category: "commercial",
    ussd: "*322#",
  },
  {
    id: "diamond",
    name: "Diamond Bank",
    code: "063",
    category: "commercial",
  },
  {
    id: "union",
    name: "Union Bank of Nigeria",
    code: "032",
    category: "commercial",
    ussd: "*826#",
  },
  {
    id: "polaris",
    name: "Polaris Bank",
    code: "076",
    category: "commercial",
    ussd: "*833#",
  },
  {
    id: "stanbic",
    name: "Stanbic IBTC Bank",
    code: "221",
    category: "commercial",
    ussd: "*909#",
  },
  {
    id: "standard_chartered",
    name: "Standard Chartered Bank",
    code: "068",
    category: "commercial",
  },
  {
    id: "heritage",
    name: "Heritage Bank",
    code: "030",
    category: "commercial",
    ussd: "*745#",
  },
  {
    id: "skye",
    name: "Skye Bank",
    code: "074",
    category: "commercial",
  },
  {
    id: "providus",
    name: "Providus Bank",
    code: "101",
    category: "commercial",
  },
  {
    id: "titan",
    name: "Titan Trust Bank",
    code: "102",
    category: "commercial",
  },
  {
    id: "fcmb",
    name: "FCMB Group",
    code: "214",
    category: "commercial",
    ussd: "*329#",
  },
  {
    id: "keystone",
    name: "Keystone Bank",
    code: "082",
    category: "commercial",
    ussd: "*539#",
  },
]

// Microfinance Banks in Nigeria
export const NIGERIAN_MICROFINANCE_BANKS: Bank[] = [
  {
    id: "mfb_fortis",
    name: "Fortis Microfinance Bank",
    code: "440",
    category: "microfinance",
  },
  {
    id: "mfb_lapo",
    name: "LAPO Microfinance Bank",
    code: "526",
    category: "microfinance",
  },
  {
    id: "mfb_aella",
    name: "Aella Microfinance Bank",
    code: "551",
    category: "microfinance",
  },
  {
    id: "mfb_bless",
    name: "Bless Microfinance Bank",
    code: "563",
    category: "microfinance",
  },
  {
    id: "mfb_rapid",
    name: "Rapid Microfinance Bank",
    code: "576",
    category: "microfinance",
  },
  {
    id: "mfb_farmcrowdy",
    name: "Farmcrowdy Microfinance Bank",
    code: "098",
    category: "microfinance",
  },
  {
    id: "mfb_paga",
    name: "Paga Microfinance Bank",
    code: "327",
    category: "microfinance",
  },
  {
    id: "mfb_credit",
    name: "Credit Microfinance Bank",
    code: "605",
    category: "microfinance",
  },
  {
    id: "mfb_groundwork",
    name: "Groundwork Microfinance Bank",
    code: "404",
    category: "microfinance",
  },
  {
    id: "mfb_infinity",
    name: "Infinity Microfinance Bank",
    code: "506",
    category: "microfinance",
  },
]

// Development Banks in Nigeria
export const NIGERIAN_DEVELOPMENT_BANKS: Bank[] = [
  {
    id: "dbn_ned",
    name: "Nigerian Export-Import Bank (NEXIM)",
    code: "062",
    category: "development",
  },
  {
    id: "dbn_fbn",
    name: "Federal Mortgage Bank of Nigeria (FMBN)",
    code: "060",
    category: "development",
  },
  {
    id: "dbn_nirsal",
    name: "NIRSAL Microfinance Bank",
    code: "091",
    category: "development",
  },
  {
    id: "dbn_nnpc",
    name: "Bank of Agriculture",
    code: "039",
    category: "development",
  },
]

// Digital Wallets and Mobile Money Services in Nigeria
export const NIGERIAN_DIGITAL_WALLETS: DigitalWallet[] = [
  {
    id: "wallet_flutterwave",
    name: "Flutterwave Wallet",
    type: "fintech",
  },
  {
    id: "wallet_paystack",
    name: "Paystack Account",
    type: "fintech",
  },
  {
    id: "wallet_moniepoint",
    name: "Moniepoint",
    type: "fintech",
    ussd: "*405*1#",
  },
  {
    id: "wallet_kuda",
    name: "Kuda Bank",
    type: "fintech",
  },
  {
    id: "wallet_opay",
    name: "OPay",
    type: "fintech",
    ussd: "*905#",
  },
  {
    id: "wallet_palmpay",
    name: "PalmPay",
    type: "fintech",
    ussd: "*977#",
  },
  {
    id: "wallet_9mobile_money",
    name: "9Mobile Money",
    type: "mobile_money",
    ussd: "*311#",
  },
  {
    id: "wallet_mtn_mobile",
    name: "MTN Mobile Money",
    type: "mobile_money",
    ussd: "*325#",
  },
  {
    id: "wallet_airtel_money",
    name: "Airtel Money",
    type: "mobile_money",
    ussd: "*405#",
  },
  {
    id: "wallet_glo_cashplus",
    name: "GLO CASHPLUS",
    type: "mobile_money",
    ussd: "*611#",
  },
  {
    id: "wallet_one_pay",
    name: "Remitly",
    type: "payment_provider",
  },
  {
    id: "wallet_wise",
    name: "Wise",
    type: "payment_provider",
  },
  {
    id: "wallet_sendmoney",
    name: "SendMoney",
    type: "fintech",
  },
  {
    id: "wallet_chipper",
    name: "Chipper",
    type: "fintech",
  },
  {
    id: "wallet_paga",
    name: "Paga",
    type: "fintech",
    ussd: "*745#",
  },
  {
    id: "wallet_transfer",
    name: "Transfer",
    type: "fintech",
  },
  {
    id: "wallet_branch",
    name: "Branch",
    type: "fintech",
  },
  {
    id: "wallet_adaba",
    name: "Adaba",
    type: "fintech",
  },
  {
    id: "wallet_migo",
    name: "Migo",
    type: "fintech",
  },
  {
    id: "wallet_lidya",
    name: "Lidya",
    type: "fintech",
  },
]

// Combined list of all banks for easy access
export const ALL_NIGERIAN_BANKS = [
  ...NIGERIAN_COMMERCIAL_BANKS,
  ...NIGERIAN_MICROFINANCE_BANKS,
  ...NIGERIAN_DEVELOPMENT_BANKS,
]

// Helper functions
export const getBankById = (id: string): Bank | undefined => {
  return ALL_NIGERIAN_BANKS.find((bank) => bank.id === id)
}

export const getBankByCode = (code: string): Bank | undefined => {
  return ALL_NIGERIAN_BANKS.find((bank) => bank.code === code)
}

export const getWalletById = (id: string): DigitalWallet | undefined => {
  return NIGERIAN_DIGITAL_WALLETS.find((wallet) => wallet.id === id)
}

export const getAllBanksAndWallets = () => {
  return {
    banks: ALL_NIGERIAN_BANKS,
    wallets: NIGERIAN_DIGITAL_WALLETS,
  }
}

// Export as array for form select components
export const BANK_OPTIONS = ALL_NIGERIAN_BANKS.map((bank) => ({
  value: bank.code,
  label: bank.name,
  code: bank.code,
}))

export const WALLET_OPTIONS = NIGERIAN_DIGITAL_WALLETS.map((wallet) => ({
  value: wallet.id,
  label: wallet.name,
}))

export const MICROFINANCE_BANK_OPTIONS = NIGERIAN_MICROFINANCE_BANKS.map(
  (bank) => ({
    value: bank.code,
    label: bank.name,
    code: bank.code,
  })
)

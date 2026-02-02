# Nigerian Banks and Digital Wallets Reference
**Updated: February 2026**
**Source: Central Bank of Nigeria (CBN) and Official Financial Institution Records**

## Overview
This document provides a comprehensive list of all Nigerian banks, microfinance banks, development banks, and digital wallets integrated into the AlertMe system. All values are standardized for consistency across forms and validation schemas.

---

## Commercial Banks (Tier 1 & Tier 2)

### Tier 1 Commercial Banks (11 banks)
| Bank Name | Code | USSD |
|-----------|------|------|
| Access Bank | 044 | *901# |
| Citibank Nigeria | 023 | - |
| Ecobank Nigeria | 050 | *327# |
| First Bank of Nigeria (FBN) | 011 | *894# |
| Guaranty Trust Bank (GTB) | 058 | *737# |
| Standard Chartered Bank | 068 | - |
| Stanbic IBTC Bank | 221 | *909# |
| United Bank For Africa (UBA) | 033 | *919# |
| Union Bank of Nigeria | 032 | *826# |
| Zenith Bank | 057 | *966# |
| Wema Bank | 035 | *322# |

### Tier 2 Commercial Banks (13 banks)
| Bank Name | Code | USSD |
|-----------|------|------|
| Fidelity Bank Nigeria | 070 | *770# |
| First City Monument Bank (FCMB) | 214 | *329# |
| Heritage Bank | 030 | *745# |
| Keystone Bank | 082 | *539# |
| Polaris Bank | 076 | *833# |
| Providus Bank | 101 | - |
| SunTrust Bank | 100 | - |
| Titan Trust Bank | 102 | - |
| Unity Bank Nigeria | 215 | - |
| Sterling Bank | 232 | *822# |
| Jaiz Bank | 301 | - |
| Globus Bank | 103 | - |
| PremiumTrust Bank | 105 | - |

---

## Development Banks (4 banks)

| Bank Name | Code |
|-----------|------|
| Nigerian Export-Import Bank (NEXIM) | 062 |
| Federal Mortgage Bank of Nigeria (FMBN) | 060 |
| NIRSAL Microfinance Bank | 091 |
| Bank of Agriculture | 039 |

---

## Microfinance Banks

### Tier 1 Digital Microfinance Banks (5 banks)
| Bank Name | Code | USSD |
|-----------|------|------|
| Carbon | 565 | - |
| Kuda Bank | 090267 | - |
| Paga | 327 | *745# |
| GoMoney MFB | 100022 | - |
| Renmoney Microfinance Bank | 090322 | - |

### Tier 2 Microfinance Banks (15+ banks)
| Bank Name | Code |
|-----------|------|
| MONIPOINT MFB | 090090 |
| INFINITY MFB | 836 |
| Mint Finex MFB | 090281 |
| Fairmoney Microfinance Bank | 090490 |
| Sparkle Microfinance Bank | 090325 |
| VFD Microfinance Bank | 090110 |
| AB Microfinance Bank | 090134 |
| Amju Unique MFB | 090135 |
| Lavender Finance MFB | 090136 |
| Covenant MFB | 090137 |
| Quickteller MFB | 090138 |
| CrowdForce MFB | 090139 |
| Titan Trust MFB | 090140 |
| Rubies Bank (Rubies Microfinance) | 090175 |
| Eyowo Limited | 090326 |
| Cowrywise Limited | 090360 |
| Remita Microfinance Bank | 090365 |

---

## Digital Wallets & Payment Platforms

### Mobile Money Platforms
| Platform Name | Code | USSD |
|---------------|------|------|
| 9Mobile Money | 999995 | *311# |
| MTN Mobile Money (MoMo PSB) | 999994 | *325# |
| Airtel Money | 999996 | *405# |
| GLO CASHPLUS | 999997 | *611# |

### Digital Banking & Fintech Wallets
| Platform Name | Code | USSD |
|---------------|------|------|
| OPay | 999992 | *905# |
| PalmPay | 999991 | *977# |
| Moniepoint | 405 | *405*1# |
| NowNow Digital | 999993 | - |

### Payment & Transfer Services
| Platform Name | Code |
|---------------|------|
| Paystack | 090328 |
| Flutterwave | 090315 |
| Interswitch | 090229 |
| Transfer | 090314 |
| Branch | 090311 |
| Chipper | 090316 |
| SendMoney | 090318 |
| Remitly | 090319 |
| Wise | 090320 |

### Fintech Investment & Lending
| Platform Name | Code |
|---------------|------|
| PiggyVest | 090317 |
| Cowrywise | 090360 |
| Adaba | 090321 |
| Migo | 090323 |
| Lidya | 090324 |

---

## Total Count

- **Commercial Banks**: 24 (11 Tier 1 + 13 Tier 2)
- **Development Banks**: 4
- **Microfinance Banks**: 20+
- **Digital Wallets**: 22
- **Total Institutions**: 70+

---

## Integration Notes

### For Domestic Transfer Forms
Use `getAllTransferBanks()` which includes:
- All Commercial Banks (Tier 1 & 2)
- All Development Banks
- All Microfinance Banks

### For Mobile Money Transfers
Use `getAllWallets()` which includes all digital wallets and payment platforms

### Code Standards
- Bank codes are standardized with CBN (Central Bank of Nigeria) codes
- USSD codes are included where available for mobile banking
- All names use official institution naming conventions
- Codes are consistent across all forms and validation schemas

---

## Maintenance & Updates

This list should be reviewed and updated:
- Quarterly: For new fintech/wallet additions
- Annually: For regulatory changes and CBN updates
- When: New banks receive CBN license approval
- When: Banks merge or change operations

**Last Updated**: February 2, 2026
**Next Review**: May 2, 2026

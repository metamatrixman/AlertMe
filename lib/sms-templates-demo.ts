/**
 * SMS Templates Test & Demonstration
 * 
 * This file demonstrates the comprehensive SMS template system
 * that covers all banks and wallets in the AlertMe system.
 */

import { getBankTemplates, getAllSMSTemplates, generateDebitAlert, generateCreditAlert } from "@/lib/alert-templates"
import { SMSService } from "@/lib/sms-service"
import { NIGERIAN_BANKS } from "@/lib/banks-data"

/**
 * DEMONSTRATION: Get templates for a specific bank
 */
export function demonstrateGetBankTemplates() {
  console.log("=== SMS Template System Demo ===\n")

  // Example 1: Get templates for Zenith Bank
  const zenithTemplates = getBankTemplates("Zenith Bank")
  console.log("Zenith Bank Templates:")
  console.log("Debit:", zenithTemplates.debit)
  console.log("Credit:", zenithTemplates.credit)
  console.log("Balance:", zenithTemplates.balance)
  console.log("Low Balance:", zenithTemplates.lowBalance)
  console.log()

  // Example 2: Get templates for a wallet (Opay)
  const opayTemplates = getBankTemplates("Opay")
  console.log("Opay Wallet Templates:")
  console.log("Debit:", opayTemplates.debit)
  console.log("Credit:", opayTemplates.credit)
  console.log()
}

/**
 * DEMONSTRATION: Generate alerts for a specific bank
 */
export function demonstrateAlertGeneration() {
  console.log("=== Alert Generation Demo ===\n")

  // Generate debit alert for Access Bank
  const accessDebitAlert = generateDebitAlert(
    50000,
    "John Doe",
    250000,
    "ACC20250123001",
    "Access Bank"
  )
  console.log("Access Bank Debit Alert:")
  console.log(accessDebitAlert)
  console.log()

  // Generate credit alert for GTB
  const gtbCreditAlert = generateCreditAlert(
    100000,
    "Nigeria Revenue Service",
    500000,
    "GTB20250123002",
    "Guaranty Trust Bank"
  )
  console.log("GTB Credit Alert:")
  console.log(gtbCreditAlert)
  console.log()
}

/**
 * DEMONSTRATION: Get all SMS templates from service
 */
export function demonstrateAllTemplates() {
  console.log("=== All SMS Templates Demo ===\n")

  const allTemplates = SMSService.getDefaultTemplates()
  console.log(`Total SMS Templates: ${allTemplates.length}`)
  console.log(`Banks: ${NIGERIAN_BANKS.filter(b => b.type === "bank").length}`)
  console.log(`Wallets: ${NIGERIAN_BANKS.filter(b => b.type === "wallet").length}`)
  console.log(`Templates per Institution: 4\n`)

  // Group by bank
  const templatesByBank: Record<string, any[]> = {}
  allTemplates.forEach(template => {
    const bankName = template.name.split(" - ")[0]
    if (!templatesByBank[bankName]) {
      templatesByBank[bankName] = []
    }
    templatesByBank[bankName].push(template)
  })

  console.log("Sample of templates by bank:")
  Object.entries(templatesByBank)
    .slice(0, 3)
    .forEach(([bankName, templates]) => {
      console.log(`\n${bankName}:`)
      templates.forEach(t => {
        console.log(`  - ${t.id}: ${t.name}`)
      })
    })
}

/**
 * DEMONSTRATION: Get templates for a specific bank using service
 */
export function demonstrateServiceTemplates() {
  console.log("=== SMS Service Templates Demo ===\n")

  const udoTemplates = SMSService.getTemplatesForBank("United Bank For Africa")
  console.log(`UBA Templates (${udoTemplates.length} total):`)
  udoTemplates.forEach(t => {
    console.log(`  - ${t.name}`)
    console.log(`    Content: ${t.content}`)
    console.log(`    Variables: ${t.variables.join(", ")}`)
    console.log()
  })

  // Get specific template type
  const ubaDebitTemplate = SMSService.getTemplatesByType("United Bank For Africa", "debit")
  console.log(`UBA Debit Template:`)
  console.log(ubaDebitTemplate?.content)
}

/**
 * VERIFICATION: Verify complete coverage
 */
export function verifyCoverage() {
  console.log("=== Coverage Verification ===\n")

  const allTemplates = SMSService.getDefaultTemplates()
  const allBanks = NIGERIAN_BANKS

  // Create a map of which banks have templates
  const bankCoverage: Record<string, boolean> = {}
  allBanks.forEach(bank => {
    bankCoverage[bank.name] = false
  })

  // Check each template
  allTemplates.forEach(template => {
    const bankName = template.name.split(" - ")[0]
    if (bankCoverage[bankName] !== undefined) {
      bankCoverage[bankName] = true
    }
  })

  // Report
  const covered = Object.values(bankCoverage).filter(v => v).length
  const total = allBanks.length

  console.log(`Coverage: ${covered}/${total} banks/wallets`)
  console.log(`Total Templates: ${allTemplates.length}`)
  console.log(`Templates per Institution: ${allTemplates.length / total}`)

  // Check for any missing
  const missing = Object.entries(bankCoverage)
    .filter(([_, covered]) => !covered)
    .map(([bank]) => bank)

  if (missing.length === 0) {
    console.log("\n✅ All banks and wallets have complete SMS template coverage!")
  } else {
    console.log("\n❌ Missing templates for:")
    missing.forEach(bank => console.log(`  - ${bank}`))
  }
}

/**
 * Example usage in a component
 */
export function exampleUsageInComponent() {
  // When sending an SMS, get the bank's template
  const userBank = "Zenith Bank"
  const templates = SMSService.getTemplatesForBank(userBank)

  // Get the appropriate template for the transaction type
  const debitTemplate = templates.find(t => t.id.includes("debit"))

  if (debitTemplate) {
    // Process the template with transaction data
    const message = SMSService.processTemplate(debitTemplate.content, {
      amount: "50,000",
      recipient: "John Doe",
      balance: "250,000",
      reference: "REF123456",
    })

    console.log("SMS to send:", message)
  }
}

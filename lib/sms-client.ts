/**
 * SMS Alert Service
 * Calls the server-side SMS API endpoint
 */

export interface SMSAlert {
  to: string
  message: string
  type: "debit" | "credit" | "balance" | "notification"
}

export async function sendTransactionAlert(alert: SMSAlert): Promise<void> {
  try {
    // Call server-side SMS endpoint
    const response = await fetch("/api/sms/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alert),
    })

    const result = await response.json()
    
    if (result.success) {
      console.log(`✅ SMS Alert [${alert.type.toUpperCase()}] sent successfully:`)
      console.log(`   To: ${alert.to}`)
      console.log(`   Message ID: ${result.messageId}`)
    } else {
      console.error(`❌ SMS Alert [${alert.type.toUpperCase()}] failed:`)
      console.error(`   Error: ${result.error}`)
    }
  } catch (error) {
    console.error(`❌ SMS Service Error:`, error)
  }
}

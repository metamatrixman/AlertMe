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

    const responseText = await response.text()
    
    if (!response.ok) {
      console.warn(`❌ SMS API Error (Status ${response.status}):`)
      try {
        const errorData = JSON.parse(responseText)
        console.warn(`   Message: ${errorData.error || 'Unknown error'}`)
        console.warn(`   Details: ${errorData.details || ''}`)
      } catch {
        console.warn(`   Response: ${responseText || 'Empty response'}`)
      }
      // Don't throw - SMS is non-critical, log and continue
      return
    }

    try {
      const result = JSON.parse(responseText)
      if (result.success) {
        console.log(`✅ SMS Alert [${alert.type.toUpperCase()}] sent successfully:`)
        console.log(`   To: ${alert.to}`)
        console.log(`   Message ID: ${result.messageId}`)
        if (result.demo) {
          console.log(`   (Demo Mode)`)
        }
      } else {
        console.error(`❌ SMS Alert [${alert.type.toUpperCase()}] failed: ${result.error}`)
      }
      } catch (parseError) {
      console.warn(`❌ SMS Client Error: Failed to parse API response:`, parseError)
      console.warn(`   Raw Response: ${responseText}`)
    }
  } catch (error) {
    console.warn(`❌ SMS Service Exception:`, error)
    // Don't rethrow - SMS is non-critical. The transaction should continue even if SMS fails
  }
}

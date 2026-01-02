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
      console.error(`❌ SMS API Error (Status ${response.status}):`)
      try {
        const errorData = JSON.parse(responseText)
        console.error(`   Message: ${errorData.error || 'Unknown error'}`)
      } catch {
        console.error(`   Response: ${responseText || 'Empty response'}`)
      }
      return
    }

    try {
      const result = JSON.parse(responseText)
      if (result.success) {
        console.log(`✅ SMS Alert [${alert.type.toUpperCase()}] sent successfully:`)
        console.log(`   To: ${alert.to}`)
        console.log(`   Message ID: ${result.messageId}`)
      } else {
        console.error(`❌ SMS Alert [${alert.type.toUpperCase()}] failed: ${result.error}`)
      }
    } catch (parseError) {
      console.error(`❌ SMS Client Error: Failed to parse API response:`, parseError)
      console.error(`   Raw Response: ${responseText}`)
    }
  } catch (error) {
    console.error(`❌ SMS Service Exception:`, error)
  }
}

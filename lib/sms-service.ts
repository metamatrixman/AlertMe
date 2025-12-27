"use server"

import {
  generateDebitAlert,
  generateCreditAlert,
  generateBalanceInquiryAlert,
  generateLowBalanceAlert,
} from "./alert-templates"

export interface SMSAlert {
  to: string
  message: string
  type: "debit" | "credit" | "balance" | "general"
}

export interface SMSTemplate {
  id: string
  name: string
  content: string
  variables: string[]
  category: "transaction" | "marketing" | "notification"
}

export interface BusinessCard {
  sender: string
  accountNumber?: string
  bank?: string
  phone?: string
  email?: string
}

export class SMSService {
  private static retryAttempts = 3
  private static retryDelay = 1000 // ms
  private static lastError: string | null = null

  static getLastError(): string | null {
    return this.lastError
  }

  // Re-export alert generators for backward compatibility
  static generateDebitAlert = generateDebitAlert
  static generateCreditAlert = generateCreditAlert
  static generateBalanceInquiryAlert = generateBalanceInquiryAlert
  static generateLowBalanceAlert = generateLowBalanceAlert

  private static async retryFetch(
    url: string,
    options: RequestInit,
    attempts = 0
  ): Promise<Response> {
    try {
      const response = await fetch(url, options)
      if (!response.ok && attempts < this.retryAttempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay))
        return this.retryFetch(url, options, attempts + 1)
      }
      return response
    } catch (error) {
      if (attempts < this.retryAttempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay))
        return this.retryFetch(url, options, attempts + 1)
      }
      throw error
    }
  }

  static async sendTransactionAlert(alert: SMSAlert): Promise<boolean> {
    try {
      const response = await this.retryFetch("/api/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alert),
      })

      const result = await response.json()

      if (!result.success) {
        this.lastError = `Failed to send SMS: ${result.error || "Unknown error"}`
        console.error(this.lastError)
        return false
      }

      console.log(`SMS sent successfully: ${result.messageId}`)
      this.lastError = null
      return true
    } catch (error) {
      this.lastError = `SMS Service Error: ${error instanceof Error ? error.message : String(error)}`
      console.error(this.lastError)
      return false
    }
  }

  static async sendBusinessCard(to: string, card: BusinessCard): Promise<boolean> {
    try {
      const response = await this.retryFetch("/api/sms/business-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, ...card }),
      })

      const result = await response.json()
      if (!result.success) {
        this.lastError = `Business Card SMS Error: ${result.error || "Unknown error"}`
        return false
      }
      this.lastError = null
      return true
    } catch (error) {
      this.lastError = `Business Card SMS Error: ${error instanceof Error ? error.message : String(error)}`
      console.error(this.lastError)
      return false
    }
  }

  static async sendBulkSMS(alerts: SMSAlert[]): Promise<{ sent: number; failed: number }> {
    let sent = 0
    let failed = 0

    for (const alert of alerts) {
      const success = await this.sendTransactionAlert(alert)
      if (success) {
        sent++
      } else {
        failed++
      }
    }

    return { sent, failed }
  }

  static validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^(\+234|234|0)?[789][01]\d{8}$/
    return phoneRegex.test(phone.replace(/\s+/g, ""))
  }

  static formatPhoneNumber(phone: string): string {
    let cleaned = phone.replace(/\s+/g, "")

    if (cleaned.startsWith("0")) {
      cleaned = "+234" + cleaned.substring(1)
    } else if (cleaned.startsWith("234")) {
      cleaned = "+" + cleaned
    } else if (!cleaned.startsWith("+234")) {
      cleaned = "+234" + cleaned
    }

    return cleaned
  }

  static getDefaultTemplates(): SMSTemplate[] {
    return [
      {
        id: "debit_alert",
        name: "Debit Alert",
        content:
          "ECOBANK ALERT: Your account has been debited with NGN{amount} to {recipient}. Available balance: NGN{balance}. Ref: {reference}. Time: {time}",
        variables: ["amount", "recipient", "balance", "reference", "time"],
        category: "transaction",
      },
      {
        id: "credit_alert",
        name: "Credit Alert",
        content:
          "ECOBANK ALERT: Your account has been credited with NGN{amount} from {sender}. Available balance: NGN{balance}. Ref: {reference}. Time: {time}",
        variables: ["amount", "sender", "balance", "reference", "time"],
        category: "transaction",
      },
      {
        id: "welcome_message",
        name: "Welcome Message",
        content:
          "Welcome to Ecobank Mobile Banking, {name}! Your account {account} is now active. Enjoy seamless banking experience.",
        variables: ["name", "account"],
        category: "notification",
      },
    ]
  }

  static processTemplate(template: string, variables: Record<string, string>): string {
    let processed = template

    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{${key}}`
      processed = processed.replace(new RegExp(placeholder, "g"), value)
    })

    return processed
  }
}

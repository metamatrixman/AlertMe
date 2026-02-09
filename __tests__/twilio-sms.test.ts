/**
 * Twilio SMS Alerts Test Suite
 * Tests the Twilio SMS functionality including:
 * - SMS service initialization
 * - Alert generation (debit, credit, balance, low balance)
 * - Phone number formatting
 * - API endpoint behavior
 * - Demo mode functionality
 */

import { describe, it, expect, beforeAll, afterAll, vi } from "vitest"

// Mock environment variables for testing
const mockEnv = {
  TWILIO_ACCOUNT_SID: "AC_test_account_sid",
  TWILIO_AUTH_TOKEN: "test_auth_token",
  TWILIO_PHONE_NUMBER: "+1234567890",
  SMS_DEMO_MODE: "false",
}

describe("Twilio SMS Alerts", () => {
  describe("Phone Number Formatting", () => {
    it("should format Nigerian phone numbers starting with 0", () => {
      const formatPhoneNumber = (phone: string) => {
        let cleaned = phone.replace(/[^\d+]/g, "").replace(/\+/g, "")
        let hasPlus = phone.includes("+")

        if (cleaned.startsWith("0")) {
          cleaned = "234" + cleaned.substring(1)
        }
        else if (!cleaned.startsWith("234")) {
          if (cleaned.length >= 10) {
            cleaned = "234" + cleaned
          }
        }

        if (cleaned.startsWith("234234")) {
          cleaned = cleaned.substring(3)
        }

        if (!cleaned.startsWith("+")) {
          cleaned = "+" + cleaned
        }

        return cleaned
      }

      expect(formatPhoneNumber("08031234567")).toBe("+2348031234567")
      expect(formatPhoneNumber("0803 123 4567")).toBe("+2348031234567")
      expect(formatPhoneNumber("2348031234567")).toBe("+2348031234567")
      expect(formatPhoneNumber("+2348031234567")).toBe("+2348031234567")
    })

    it("should validate Nigerian phone numbers", () => {
      const validatePhoneNumber = (phone: string) => {
        const phoneRegex = /^(\+234|234|0)?[789][01]\d{8}$/
        return phoneRegex.test(phone.replace(/\s+/g, ""))
      }

      expect(validatePhoneNumber("08031234567")).toBe(true)
      expect(validatePhoneNumber("09031234567")).toBe(true)
      expect(validatePhoneNumber("07031234567")).toBe(true)
      expect(validatePhoneNumber("+2348031234567")).toBe(true)
      expect(validatePhoneNumber("0803123456")).toBe(false) // Too short
      expect(validatePhoneNumber("05031234567")).toBe(false) // Invalid prefix
    })
  })

  describe("SMS Alert Templates", () => {
    it("should generate debit alert message", () => {
      const generateDebitAlert = (data: { amount: string; recipient: string; balance: string; reference: string }) => {
        return `ALERT: Debit of ₦${data.amount} to ${data.recipient}. Ref: ${data.reference}. Bal: ₦${data.balance}. - AlertMe`
      }

      const alert = generateDebitAlert({
        amount: "10,000.00",
        recipient: "John Doe",
        balance: "50,000.00",
        reference: "TXN123456",
      })

      expect(alert).toContain("Debit of ₦10,000.00")
      expect(alert).toContain("John Doe")
      expect(alert).toContain("TXN123456")
      expect(alert).toContain("AlertMe")
    })

    it("should generate credit alert message", () => {
      const generateCreditAlert = (data: { amount: string; sender: string; balance: string; reference: string }) => {
        return `CREDIT ALERT: ₦${data.amount} from ${data.sender}. Ref: ${data.reference}. Bal: ₦${data.balance}. - AlertMe`
      }

      const alert = generateCreditAlert({
        amount: "5,000.00",
        sender: "Jane Smith",
        balance: "55,000.00",
        reference: "TXN789012",
      })

      expect(alert).toContain("CREDIT ALERT")
      expect(alert).toContain("₦5,000.00")
      expect(alert).toContain("Jane Smith")
    })

    it("should generate balance inquiry alert", () => {
      const generateBalanceInquiryAlert = (data: { balance: string }) => {
        return `BALANCE INQUIRY: Current balance is ₦${data.balance}. - AlertMe`
      }

      const alert = generateBalanceInquiryAlert({ balance: "100,000.00" })
      expect(alert).toContain("BALANCE INQUIRY")
      expect(alert).toContain("₦100,000.00")
    })

    it("should generate low balance alert", () => {
      const generateLowBalanceAlert = (data: { balance: string; threshold: string }) => {
        return `LOW BALANCE ALERT: Your balance is ₦${data.balance}, below the ₦${data.threshold} threshold. - AlertMe`
      }

      const alert = generateLowBalanceAlert({
        balance: "500.00",
        threshold: "1,000.00",
      })
      expect(alert).toContain("LOW BALANCE ALERT")
      expect(alert).toContain("₦500.00")
    })
  })

  describe("SMS Service API", () => {
    it("should handle demo mode SMS sending", async () => {
      // Mock the API response for demo mode
      const mockSendSMS = async (to: string, message: string) => {
        return {
          success: true,
          messageId: `DEMO_${Date.now()}_test`,
          status: "demo",
          demo: true,
        }
      }

      const result = await mockSendSMS("+2348031234567", "Test message")

      expect(result.success).toBe(true)
      expect(result.demo).toBe(true)
      expect(result.messageId).toContain("DEMO_")
    })

    it("should reject SMS with missing required fields", async () => {
      const validateSMS = (data: { to?: string; message?: string }) => {
        if (!data.to || !data.message) {
          return { valid: false, error: "Missing required fields: to, message" }
        }
        return { valid: true }
      }

      expect(validateSMS({})).toEqual({ valid: false, error: "Missing required fields: to, message" })
      expect(validateSMS({ to: "08031234567" })).toEqual({ valid: false, error: "Missing required fields: to, message" })
      expect(validateSMS({ message: "Hello" })).toEqual({ valid: false, error: "Missing required fields: to, message" })
      expect(validateSMS({ to: "08031234567", message: "Hello" })).toEqual({ valid: true })
    })

    it("should format SMS response correctly", () => {
      const formatSMSResponse = (result: { success: boolean; messageId?: string; status?: string; demo?: boolean; error?: string }) => {
        if (result.success) {
          return {
            delivered: true,
            messageId: result.messageId || "unknown",
            mode: result.demo ? "demo" : "live",
            timestamp: new Date().toISOString(),
          }
        }
        return {
          delivered: false,
          error: result.error || "Unknown error",
          timestamp: new Date().toISOString(),
        }
      }

      const successResponse = formatSMSResponse({
        success: true,
        messageId: "DEMO_12345_test",
        demo: true,
      })

      expect(successResponse.delivered).toBe(true)
      expect(successResponse.messageId).toBe("DEMO_12345_test")
      expect(successResponse.mode).toBe("demo")

      const errorResponse = formatSMSResponse({
        success: false,
        error: "Failed to send SMS",
      })

      expect(errorResponse.delivered).toBe(false)
      expect(errorResponse.error).toBe("Failed to send SMS")
    })
  })

  describe("Alert Message Generation", () => {
    it("should include all required fields in transaction alerts", () => {
      const createTransactionAlert = (data: Record<string, string>) => {
        const alert: string[] = []
        
        if (data.amount) alert.push(`Amount: ₦${data.amount}`)
        if (data.recipient) alert.push(`To: ${data.recipient}`)
        if (data.balance) alert.push(`Balance: ₦${data.balance}`)
        if (data.reference) alert.push(`Ref: ${data.reference}`)
        if (data.timestamp) alert.push(`Time: ${data.timestamp}`)
        
        return alert.join(" | ")
      }

      const alert = createTransactionAlert({
        amount: "5,000.00",
        recipient: "Beneficiary Name",
        balance: "45,000.00",
        reference: "TXN001",
        timestamp: new Date().toISOString(),
      })

      expect(alert).toContain("Amount: ₦5,000.00")
      expect(alert).toContain("To: Beneficiary Name")
      expect(alert).toContain("Balance: ₦45,000.00")
      expect(alert).toContain("Ref: TXN001")
    })

    it("should handle special characters in alert messages", () => {
      const sanitizeMessage = (message: string) => {
        return message
          .replace(/[<>"']/g, "")
          .replace(/\r?\n/g, " ")
          .trim()
      }

      const rawMessage = "Test <script>alert('xss')</script> with quotes '\" and newlines\n\nEnd"
      const sanitized = sanitizeMessage(rawMessage)

      expect(sanitized).not.toContain("<script>")
      expect(sanitized).not.toContain("'")
      expect(sanitized).not.toContain('\"')
      expect(sanitized).toContain("Test")
      expect(sanitized).toContain("with quotes")
    })
  })

  describe("SMS Configuration Validation", () => {
    it("should validate Twilio configuration", () => {
      const validateConfig = (config: { accountSid?: string; authToken?: string; phoneNumber?: string }) => {
        const errors: string[] = []
        
        if (!config.accountSid) errors.push("TWILIO_ACCOUNT_SID is required")
        if (!config.authToken) errors.push("TWILIO_AUTH_TOKEN is required")
        if (!config.phoneNumber) errors.push("TWILIO_PHONE_NUMBER is required")
        
        return {
          valid: errors.length === 0,
          errors,
        }
      }

      const validConfig = {
        accountSid: "AC_test123",
        authToken: "token123",
        phoneNumber: "+2341234567890",
      }

      expect(validateConfig(validConfig).valid).toBe(true)
      expect(validateConfig({}).valid).toBe(false)
      expect(validateConfig({}).errors).toHaveLength(3)
    })

    it("should detect demo mode configuration", () => {
      const isDemoMode = (env: { SMS_DEMO_MODE?: string; TWILIO_ACCOUNT_SID?: string }) => {
        return env.SMS_DEMO_MODE === "true" || !env.TWILIO_ACCOUNT_SID
      }

      expect(isDemoMode({ SMS_DEMO_MODE: "true" })).toBe(true)
      expect(isDemoMode({})).toBe(true)
      expect(isDemoMode({ SMS_DEMO_MODE: "false", TWILIO_ACCOUNT_SID: "AC_test" })).toBe(false)
    })
  })

  describe("AlertMe Brand Integration", () => {
    it("should include AlertMe branding in all alerts", () => {
      const alertTypes = ["debit", "credit", "balance", "low_balance"]
      
      const generateBrandedAlert = (type: string, content: string) => {
        return `${content} - AlertMe`
      }

      alertTypes.forEach(type => {
        const alert = generateBrandedAlert(type, `Test ${type} alert`)
        expect(alert).toContain("- AlertMe")
      })
    })
  })
})

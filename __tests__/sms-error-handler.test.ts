import { describe, it, expect, beforeEach, vi } from "vitest"
import { categorizeSMSError, calculateRetryDelay, formatSMSErrorForUser, SMSErrorType } from "@/lib/sms-error-handler"

describe("SMS Error Handler", () => {
  describe("categorizeSMSError", () => {
    it("should categorize network errors correctly", () => {
      const error = new Error("ECONNREFUSED: Connection refused")
      const result = categorizeSMSError(error)
      expect(result.type).toBe(SMSErrorType.NETWORK_ERROR)
      expect(result.retryable).toBe(true)
    })

    it("should categorize invalid phone errors", () => {
      const error = new Error("Invalid phone number format")
      const result = categorizeSMSError(error)
      expect(result.type).toBe(SMSErrorType.INVALID_PHONE)
      expect(result.retryable).toBe(false)
    })

    it("should categorize throttle errors", () => {
      const error = new Error("Rate limit exceeded - 429")
      const result = categorizeSMSError(error)
      expect(result.type).toBe(SMSErrorType.THROTTLE_LIMIT)
      expect(result.retryable).toBe(true)
    })

    it("should categorize delivery failure errors", () => {
      const error = new Error("SMS delivery failed to recipient")
      const result = categorizeSMSError(error)
      expect(result.type).toBe(SMSErrorType.DELIVERY_FAILED)
      expect(result.retryable).toBe(true)
    })

    it("should handle unknown errors", () => {
      const error = new Error("Something unexpected happened")
      const result = categorizeSMSError(error)
      expect(result.type).toBe(SMSErrorType.UNKNOWN)
      expect(result.retryable).toBe(true)
    })
  })

  describe("calculateRetryDelay", () => {
    it("should calculate exponential backoff correctly", () => {
      const config = { maxRetries: 3, initialDelayMs: 1000, maxDelayMs: 10000, backoffMultiplier: 2 }

      const delay0 = calculateRetryDelay(0, config)
      const delay1 = calculateRetryDelay(1, config)
      const delay2 = calculateRetryDelay(2, config)

      expect(delay0).toBe(1000)
      expect(delay1).toBe(2000)
      expect(delay2).toBe(4000)
    })

    it("should respect max delay", () => {
      const config = { maxRetries: 5, initialDelayMs: 1000, maxDelayMs: 5000, backoffMultiplier: 2 }
      const delay = calculateRetryDelay(5, config)
      expect(delay).toBeLessThanOrEqual(5000)
    })
  })

  describe("formatSMSErrorForUser", () => {
    it("should format error message with retry count", () => {
      const error = {
        type: SMSErrorType.NETWORK_ERROR,
        message: "Network connection failed",
        retryable: true,
        retryCount: 1,
        maxRetries: 3,
      }

      const formatted = formatSMSErrorForUser(error)
      expect(formatted).toContain("Attempt 2 of 4")
    })

    it("should format error message without retry count", () => {
      const error = {
        type: SMSErrorType.INVALID_PHONE,
        message: "Invalid phone number format",
        retryable: false,
      }

      const formatted = formatSMSErrorForUser(error)
      expect(formatted).toBe("Invalid phone number format")
    })
  })
})

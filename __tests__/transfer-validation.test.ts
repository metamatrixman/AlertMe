import { describe, it, expect } from "vitest"
import { z } from "zod"
import { accountNumberSchema, nameSchema, amountSchema, phoneSchema } from "@/lib/form-utils"

describe("Form Validation Schemas", () => {
  describe("accountNumberSchema", () => {
    it("should accept valid 10-digit account numbers", () => {
      const result = accountNumberSchema.safeParse("1234567890")
      expect(result.success).toBe(true)
    })

    it("should reject non-numeric account numbers", () => {
      const result = accountNumberSchema.safeParse("123ABC7890")
      expect(result.success).toBe(false)
    })

    it("should reject account numbers with less than 10 digits", () => {
      const result = accountNumberSchema.safeParse("123456789")
      expect(result.success).toBe(false)
    })

    it("should reject empty account numbers", () => {
      const result = accountNumberSchema.safeParse("")
      expect(result.success).toBe(false)
    })
  })

  describe("nameSchema", () => {
    it("should accept valid names", () => {
      const result = nameSchema.safeParse("John Doe")
      expect(result.success).toBe(true)
    })

    it("should reject empty names", () => {
      const result = nameSchema.safeParse("")
      expect(result.success).toBe(false)
    })

    it("should reject names longer than 100 characters", () => {
      const longName = "A".repeat(101)
      const result = nameSchema.safeParse(longName)
      expect(result.success).toBe(false)
    })
  })

  describe("amountSchema", () => {
    it("should accept valid amounts as strings", () => {
      const result = amountSchema.safeParse("1000.00")
      expect(result.success).toBe(true)
      expect(result.data).toBe(1000)
    })

    it("should accept valid amounts as numbers", () => {
      const result = amountSchema.safeParse(1000)
      expect(result.success).toBe(true)
      expect(result.data).toBe(1000)
    })

    it("should reject zero amounts", () => {
      const result = amountSchema.safeParse("0")
      expect(result.success).toBe(false)
    })

    it("should reject negative amounts", () => {
      const result = amountSchema.safeParse("-100")
      expect(result.success).toBe(false)
    })

    it("should handle decimal places correctly", () => {
      const result = amountSchema.safeParse("1000.50")
      expect(result.success).toBe(true)
      expect(result.data).toBe(1000.50)
    })

    it("should reject amounts with more than 2 decimal places", () => {
      const result = amountSchema.safeParse("1000.123")
      expect(result.success).toBe(false)
    })

    it("should reject non-numeric amounts", () => {
      const result = amountSchema.safeParse("abc")
      expect(result.success).toBe(false)
    })
  })

  describe("phoneSchema", () => {
    it("should accept valid Nigerian phone numbers with country code", () => {
      const result = phoneSchema.safeParse("+2348012345678")
      expect(result.success).toBe(true)
    })

    it("should accept valid Nigerian phone numbers without country code", () => {
      const result = phoneSchema.safeParse("08012345678")
      expect(result.success).toBe(true)
    })

    it("should reject invalid phone numbers", () => {
      const result = phoneSchema.safeParse("12345")
      expect(result.success).toBe(false)
    })

    it("should reject empty phone numbers", () => {
      const result = phoneSchema.safeParse("")
      expect(result.success).toBe(false)
    })

    it("should reject phone numbers with wrong format", () => {
      const result = phoneSchema.safeParse("+1234567890")
      expect(result.success).toBe(false)
    })
  })
})

/**
 * Test Transfer Type Specific Validation
 */

describe("Domestic Transfer Validation", () => {
  const domesticTransferSchema = z.object({
    bank: z.string().min(1, "Please select a bank"),
    accountNumber: accountNumberSchema,
    beneficiaryName: nameSchema,
    amount: amountSchema.refine((n) => n <= 5000000, {
      message: "Daily transfer limit is ₦5,000,000",
    }),
  })

  it("should validate complete domestic transfer data", () => {
    const data = {
      bank: "First Bank",
      accountNumber: "1234567890",
      beneficiaryName: "John Doe",
      amount: 50000,
    }
    const result = domesticTransferSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it("should reject transfer exceeding daily limit", () => {
    const data = {
      bank: "First Bank",
      accountNumber: "1234567890",
      beneficiaryName: "John Doe",
      amount: 6000000,
    }
    const result = domesticTransferSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  it("should reject transfer without bank", () => {
    const data = {
      bank: "",
      accountNumber: "1234567890",
      beneficiaryName: "John Doe",
      amount: 50000,
    }
    const result = domesticTransferSchema.safeParse(data)
    expect(result.success).toBe(false)
  })
})

describe("International Transfer Validation", () => {
  const swiftCodeSchema = z
    .string()
    .min(8, "SWIFT code must be at least 8 characters")
    .regex(/^[A-Z0-9]{8,11}$/, "Invalid SWIFT code format")

  const ibanSchema = z
    .string()
    .min(15, "IBAN must be at least 15 characters")
    .regex(/^[A-Z]{2}\d{2}[A-Z0-9]+$/, "Invalid IBAN format")

  it("should accept valid SWIFT code", () => {
    const result = swiftCodeSchema.safeParse("CHASUS33")
    expect(result.success).toBe(true)
  })

  it("should reject invalid SWIFT code", () => {
    const result = swiftCodeSchema.safeParse("CHASUS33X")
    expect(result.success).toBe(false)
  })

  it("should accept valid IBAN", () => {
    const result = ibanSchema.safeParse("DE89370400440532013000")
    expect(result.success).toBe(true)
  })

  it("should reject invalid IBAN format", () => {
    const result = ibanSchema.safeParse("INVALID123")
    expect(result.success).toBe(false)
  })
})

describe("Standing Order Validation", () => {
  const standingOrderSchema = z
    .object({
      startDate: z.string(),
      endDate: z.string(),
      frequency: z.enum(["daily", "weekly", "monthly"]),
    })
    .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
      message: "End date must be after start date",
    })

  it("should validate valid standing order dates", () => {
    const data = {
      startDate: "2026-02-01",
      endDate: "2026-03-01",
      frequency: "weekly" as const,
    }
    const result = standingOrderSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it("should reject when end date is before start date", () => {
    const data = {
      startDate: "2026-03-01",
      endDate: "2026-02-01",
      frequency: "weekly" as const,
    }
    const result = standingOrderSchema.safeParse(data)
    expect(result.success).toBe(false)
  })
})

describe("Visa Direct Validation", () => {
  const cardNumberSchema = z.string().regex(/^\d{16}$/, "Card number must be exactly 16 digits")

  function validateLuhn(cardNumber: string): boolean {
    let sum = 0
    let isEven = false

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i])

      if (isEven) {
        digit *= 2
        if (digit > 9) digit -= 9
      }

      sum += digit
      isEven = !isEven
    }

    return sum % 10 === 0
  }

  it("should accept valid card number format", () => {
    const result = cardNumberSchema.safeParse("4532123456789010")
    expect(result.success).toBe(true)
  })

  it("should reject non-16-digit card numbers", () => {
    const result = cardNumberSchema.safeParse("453212345678901")
    expect(result.success).toBe(false)
  })

  it("should validate Luhn algorithm", () => {
    // Valid test card number
    expect(validateLuhn("4532123456789010")).toBe(true)
    // Invalid
    expect(validateLuhn("1111111111111111")).toBe(false)
  })
})

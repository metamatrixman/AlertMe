import { type NextRequest, NextResponse } from "next/server"
import twilio from "twilio"
import { ensureTwilioConfig } from "@/lib/env-check"
import { rateLimit, requestKeyFromHeaders } from "@/lib/rate-limiter"

ensureTwilioConfig()

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER

/**
 * Send Business Card via SMS/MMS
 * 
 * Request body:
 * - to: recipient phone number
 * - bank: selected bank name
 * - email: sender's email
 * - phone: sender's phone
 * - mediaUrl: URL to vCard file (optional, for MMS)
 */
export async function POST(request: NextRequest) {
  try {
    const key = requestKeyFromHeaders(request.headers)
    const rl = rateLimit(key)
    if (!rl.allowed) {
      return NextResponse.json({ success: false, error: "Rate limit exceeded" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter || 60) } })
    }

    const body = await request.json()
    const { to, bank, email, phone, mediaUrl } = body

    // Validate required fields
    if (!to || !bank) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: to, bank",
          details: "Both 'to' and 'bank' fields are required to send a business card."
        },
        { status: 400 }
      )
    }

    // Validate Twilio credentials
    if (!accountSid || !authToken || !twilioPhoneNumber) {
      console.error("Twilio credentials not configured")
      return NextResponse.json(
        {
          success: false,
          error: "SMS service not configured",
          details: "Twilio credentials are missing or invalid. Please check your environment variables."
        },
        { status: 500 }
      )
    }

    // Initialize Twilio client
    const client = twilio(accountSid, authToken)

    // Format business card message
    const businessCardMessage = `
BUSINESS CARD
━━━━━━━━━━━━━━━
Bank: ${bank}
${email ? `Email: ${email}` : ""}
${phone ? `Phone: ${phone}` : ""}
━━━━━━━━━━━━━━━
Shared via Ecobank Mobile App
`.trim()

    // Format phone number to international format
    const formattedPhone = formatPhoneNumber(to)

    // Build message options
    const messageOptions: any = {
      body: businessCardMessage,
      from: twilioPhoneNumber,
      to: formattedPhone,
    }

    // Add vCard attachment if mediaUrl is provided (MMS)
    if (mediaUrl) {
      messageOptions.mediaUrl = [mediaUrl]
    }

    // Send message via Twilio
    const twilioMessage = await client.messages.create(messageOptions)

    console.log(`Business card sent successfully: ${twilioMessage.sid}`)

    return NextResponse.json({
      success: true,
      messageId: twilioMessage.sid,
      status: twilioMessage.status,
      bank,
      to: formattedPhone,
    })
  } catch (error: unknown) {
    console.error("Business Card SMS Error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to send business card"
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: "An error occurred while sending the business card. Please try again later."
      },
      { status: 500 }
    )
  }
}

/**
 * Format phone number to E.164 international format
 * Handles various Nigerian phone number formats
 */
function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, "")

  // Handle local Nigerian format (starts with 0)
  if (cleaned.startsWith("0")) {
    cleaned = "+234" + cleaned.substring(1)
  }
  // Handle 234 prefix without '+'
  else if (cleaned.startsWith("234") && !cleaned.startsWith("+")) {
    cleaned = "+" + cleaned
  }
  // Handle international format without '+' prefix
  else if (!cleaned.startsWith("+")) {
    cleaned = "+234" + cleaned
  }

  // Fix double country codes (+2340...)
  if (cleaned.startsWith("+2340")) {
    cleaned = "+234" + cleaned.substring(4)
  }

  // Validate Nigerian number format (13-14 digits with +234 prefix)
  const isValidNigerianNumber =
    (cleaned.length === 13 || cleaned.length === 14) &&
    cleaned.startsWith("+234") &&
    cleaned.substring(4).length >= 9

  if (isValidNigerianNumber) {
    return cleaned
  }

  throw new Error(`Invalid phone number format: ${phone} (formatted to ${cleaned})`)
}

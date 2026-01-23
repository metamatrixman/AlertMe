import { type NextRequest, NextResponse } from "next/server"
import twilio from "twilio"

// Initialize Twilio client with environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, message, type } = body

    if (!to || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: to, message",
          details: "Both 'to' and 'message' fields are required to send an SMS."
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

    // Format phone number for international format
    const formattedPhone = formatPhoneNumber(to)

    // Send SMS via Twilio
    const twilioMessage = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: formattedPhone,
    })

    console.log(`SMS sent successfully: ${twilioMessage.sid}`)

    return NextResponse.json({
      success: true,
      messageId: twilioMessage.sid,
      status: twilioMessage.status,
      type: type || "general",
    })
  } catch (error: unknown) {
    console.error("Twilio SMS Error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to send SMS"
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: "An error occurred while sending the SMS. Please try again later."
      },
      { status: 500 }
    )
  }
}

function formatPhoneNumber(phone: string): string {
  // 1. Remove all non-digit characters, preserving an optional leading '+'
  let cleaned = phone.replace(/\D/g, "")
  let hasPlus = phone.startsWith("+")

  // If the original number started with '+', we re-add it after cleaning.
  if (hasPlus && !cleaned.startsWith("234")) {
    // Assuming the number was supposed to be in international format but had invalid chars.
    // For Nigerian numbers, we expect them to start with 234 after the '+'.
    // We will enforce +234 prefix if it's missing the country code after cleaning.
    if (cleaned.length < 10) { // Less than 10 digits, likely incomplete/invalid.
        // Do not format anything that looks obviously incomplete or masked (like the previous error suggests)
    } else if (cleaned.startsWith("234")) {
        cleaned = "+" + cleaned
    } else {
        // If it starts with other digits, it's not a Nigerian number we can easily correct.
        // We will default to trying to prepend +234 if it doesn't start with 234.
        cleaned = "+234" + cleaned
    }
  }
  
  // 2. Handle local Nigerian format (starts with 0)
  if (cleaned.startsWith("0")) {
    cleaned = "+234" + cleaned.substring(1)
  } 
  // 3. Handle 234 prefix without '+'
  else if (cleaned.startsWith("234") && !cleaned.startsWith("+")) {
    cleaned = "+" + cleaned
  }
  // 4. Handle international format without '+' but with country code (if not already handled above)
  else if (!cleaned.startsWith("+")) {
    cleaned = "+234" + cleaned
  }

  // 5. Final check for "+2340..." pattern which was an issue before
  if (cleaned.startsWith("+2340")) {
    cleaned = "+234" + cleaned.substring(4)
  }

  // Twilio expects E.164 format. For Nigeria, this is +234XXYYYYYYY (13 digits total after + is 14 chars).
  // Standard Nigerian mobile numbers have 10 digits after the 234 country code.
  const isValidNigerianNumber = cleaned.length === 14 && cleaned.startsWith("+234") && cleaned.substring(4).length === 10;
  
  if (isValidNigerianNumber) {
      return cleaned;
  }

  // If it fails validation, throw an error to be caught by the outer try/catch
  throw new Error(`Invalid 'To' Phone Number: ${phone} formatted to ${cleaned}`);
}

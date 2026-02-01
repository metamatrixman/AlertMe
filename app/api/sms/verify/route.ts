import { type NextRequest, NextResponse } from "next/server"
import twilio from "twilio"
import { ensureTwilioConfig } from "@/lib/env-check"
import { rateLimit, requestKeyFromHeaders } from "@/lib/rate-limiter"

ensureTwilioConfig()

// Server-only endpoint to verify Twilio credentials without sending an SMS.
// Use this to confirm account SID + auth token are valid.

export async function GET(request: NextRequest) {
  // lightweight rate-limit to prevent abuse of the verify endpoint
  const key = requestKeyFromHeaders(request.headers)
  const rl = rateLimit(key)
  if (!rl.allowed) {
    return NextResponse.json({ success: false, error: "Rate limit exceeded" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter || 60) } })
  }
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN

    if (!accountSid || !authToken) {
      console.error("Twilio credentials not configured")
      return NextResponse.json({ success: false, error: "Twilio not configured" }, { status: 500 })
    }

    const client = twilio(accountSid, authToken)

    // Fetch account details as a safe verification step
    const account = await client.api.accounts(accountSid).fetch()

    return NextResponse.json({
      success: true,
      accountSid: account.sid,
      friendlyName: account.friendlyName,
      status: account.status,
    })
  } catch (error: unknown) {
    console.error("Twilio Verify Error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to verify Twilio credentials"
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}

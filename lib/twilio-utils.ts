import twilio from "twilio"

/**
 * Verify Twilio signature for incoming webhook requests.
 * Returns true when valid, false otherwise.
 */
export function verifyTwilioSignature(
  authToken: string | undefined,
  signature: string | null,
  url: string,
  params: Record<string, string>
): boolean {
  if (!authToken || !signature) return false

  try {
    // twilio.validateRequest expects (authToken, twilioSignature, url, params)
    // The types in the Twilio SDK may vary; we call it dynamically.
    // @ts-ignore - runtime call
    if (typeof (twilio as any).validateRequest === "function") {
      return (twilio as any).validateRequest(authToken, signature, url, params)
    }

    // Fallback: treat as invalid when validateRequest is not available
    return false
  } catch (err) {
    console.warn("Twilio signature verification failed:", err)
    return false
  }
}

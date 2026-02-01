export function ensureTwilioConfig(): void {
  const required = [
    "TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN",
    "TWILIO_PHONE_NUMBER",
  ]

  const missing = required.filter((k) => !process.env[k])

  if (missing.length > 0) {
    console.warn(
      `Twilio configuration missing environment variables: ${missing.join(", ")}`
    )
  }
}

export function ensureEnvVar(name: string): void {
  if (!process.env[name]) {
    console.warn(`Environment variable ${name} is not set`)
  }
}

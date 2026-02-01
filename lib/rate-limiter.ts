type Bucket = {
  tokens: number
  lastRefill: number
}

const buckets = new Map<string, Bucket>()

const DEFAULT_RATE_PER_MINUTE = Number(process.env.SMS_RATE_LIMIT_PER_MINUTE) || 60
const BURST = Number(process.env.SMS_RATE_LIMIT_BURST) || 10

function now() {
  return Date.now()
}

export function rateLimit(key: string): { allowed: boolean; retryAfter?: number } {
  const capacity = DEFAULT_RATE_PER_MINUTE
  const refillIntervalMs = 60_000 // per minute

  let bucket = buckets.get(key)
  const t = now()

  if (!bucket) {
    bucket = { tokens: capacity + BURST, lastRefill: t }
    buckets.set(key, bucket)
  }

  // Refill tokens linearly based on elapsed time
  const elapsed = t - bucket.lastRefill
  if (elapsed > 0) {
    const refill = (elapsed / refillIntervalMs) * capacity
    bucket.tokens = Math.min(capacity + BURST, bucket.tokens + refill)
    bucket.lastRefill = t
  }

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1
    return { allowed: true }
  }

  // Not allowed — calculate retryAfter (seconds)
  const retryAfter = Math.ceil((1 / capacity) * 60)
  return { allowed: false, retryAfter }
}

// Helper to derive a request key (IP-based fallback)
export function requestKeyFromHeaders(headers: Headers): string {
  // Prefer x-forwarded-for, then x-real-ip, otherwise 'unknown'
  const xff = headers.get("x-forwarded-for") || headers.get("x-real-ip") || "unknown"
  // If xff contains multiple IPs, take the first
  const ip = xff.split(",")[0].trim()
  return ip || "unknown"
}

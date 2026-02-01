const statusCounts: Record<string, number> = {}
let totalWebhooks = 0

export function incrementWebhookEvent(status?: string) {
  totalWebhooks += 1
  const key = status || "unknown"
  statusCounts[key] = (statusCounts[key] || 0) + 1
}

export function getMetrics() {
  return {
    totalWebhooks,
    statusCounts,
    timestamp: new Date().toISOString(),
  }
}

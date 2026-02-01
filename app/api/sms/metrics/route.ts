import { type NextRequest, NextResponse } from "next/server"
import { getMetrics } from "@/lib/metrics"

export async function GET(request: NextRequest) {
  try {
    const metrics = getMetrics()
    return NextResponse.json({ success: true, metrics })
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to read metrics" }, { status: 500 })
  }
}

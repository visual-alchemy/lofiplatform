import { NextResponse } from "next/server"
import logger from "@/lib/logger"

export async function GET() {
  try {
    const logs = logger.getLogs()
    return NextResponse.json({ logs })
  } catch (error) {
    console.error("Error fetching stream logs:", error)
    return NextResponse.json({ error: "Failed to fetch stream logs", logs: [] }, { status: 500 })
  }
}

// Export the logger for other API routes to use
export { logger }

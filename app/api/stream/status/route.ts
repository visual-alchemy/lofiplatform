import { NextResponse } from "next/server"
import { getStreamStatus } from "@/lib/stream-engine"

// Mock stream status for now - replace with actual implementation
export async function GET() {
  try {
    // Get actual stream status from the stream engine
    const status = await getStreamStatus()
    return NextResponse.json(status)
  } catch (error) {
    console.error("Error fetching stream status:", error)
    return NextResponse.json({ error: "Failed to fetch stream status", status: "error" }, { status: 500 })
  }
}

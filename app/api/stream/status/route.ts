import { NextResponse } from "next/server"

// Mock stream status for now - replace with actual implementation
export async function GET() {
  try {
    // For now, return mock data since we don't have the actual stream engine running
    const mockStatus = {
      status: "idle",
      stats: {
        uptime: "00:00:00",
        fps: "0",
        bitrate: "0 kbps",
        lastReconnect: "Never",
      },
    }

    return NextResponse.json(mockStatus)
  } catch (error) {
    console.error("Error fetching stream status:", error)
    return NextResponse.json({ error: "Failed to fetch stream status", status: "error" }, { status: 500 })
  }
}

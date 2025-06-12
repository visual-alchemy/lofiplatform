import { NextResponse } from "next/server"
import logger from "@/lib/logger"

// Mock settings
const mockSettings = {
  rtmpUrl: "rtmp://a.rtmp.youtube.com/live2",
  streamKey: "",
  videoBitrate: 2500,
  audioBitrate: 128,
  resolution: "1280x720",
  fps: 30,
  audioVolume: 1.0,
}

export async function GET() {
  try {
    return NextResponse.json(mockSettings)
  } catch (error: any) {
    console.error("Error fetching stream settings:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch stream settings",
        details: error.message || "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { changes, ...settings } = data

    console.log("Settings saved:", settings)

    // Log changes to stream logs
    if (changes && changes.length > 0) {
      console.log("Settings changes logged:", changes)

      // Add each change to the logs
      changes.forEach((change: string) => {
        logger.addLog(`Settings: ${change}`)
      })

      // Also log a summary
      logger.addLog(`Stream settings updated with ${changes.length} change(s)`)
    } else {
      logger.addLog("Stream settings saved (no changes detected)")
    }

    return NextResponse.json({ message: "Stream settings saved successfully" })
  } catch (error: any) {
    console.error("Error saving stream settings:", error)
    logger.addLog(`Error saving settings: ${error.message}`)

    return NextResponse.json(
      {
        error: error.message || "Failed to save stream settings",
        details: "An unexpected error occurred while saving settings",
      },
      { status: 500 },
    )
  }
}

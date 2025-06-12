import { NextResponse } from "next/server"
import logger from "@/lib/logger"
import { stopStream } from "@/lib/stream-engine"

export async function POST(request: Request) {
  try {
    console.log("Stream stop requested")
    logger.addLog("Stream stop requested")

    // Actually stop the stream using the stream-engine
    await stopStream()

    logger.addLog("Stream stopped successfully")

    return NextResponse.json({
      message: "Stream stopped successfully",
      status: "idle",
    })
  } catch (error: any) {
    console.error("Error stopping stream:", error)
    logger.addLog(`Stream stop failed: ${error.message}`)

    return NextResponse.json(
      {
        error: error.message || "Failed to stop stream",
        status: "error",
      },
      { status: 500 },
    )
  }
}

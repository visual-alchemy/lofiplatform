import { NextResponse } from "next/server"
import logger from "@/lib/logger"
import { restartStream } from "@/lib/stream-engine"

export async function POST(request: Request) {
  try {
    console.log("Stream restart requested")
    logger.addLog("Stream restart requested")

    // Actually restart the stream using the stream-engine
    const result = await restartStream()

    logger.addLog("Stream restarted successfully")

    return NextResponse.json({
      message: "Stream restarted successfully",
      pid: result.pid,
      status: "streaming",
    })
  } catch (error: any) {
    console.error("Error restarting stream:", error)
    logger.addLog(`Stream restart failed: ${error.message}`)

    return NextResponse.json(
      {
        error: error.message || "Failed to restart stream",
        status: "error",
      },
      { status: 500 },
    )
  }
}

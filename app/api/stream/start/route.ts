import { NextResponse } from "next/server"
import logger from "@/lib/logger"
import { startStream } from "@/lib/stream-engine"

export async function POST(request: Request) {
  try {
    console.log("Stream start requested")
    logger.addLog("Stream start requested")

    // Actually start the stream using the stream-engine
    const result = await startStream()

    logger.addLog("Stream started successfully")

    return NextResponse.json({
      message: "Stream started successfully",
      pid: result.pid,
      status: "streaming",
    })
  } catch (error: any) {
    console.error("Error starting stream:", error)
    logger.addLog(`Stream start failed: ${error.message}`)

    return NextResponse.json(
      {
        error: error.message || "Failed to start stream",
        status: "error",
      },
      { status: 500 },
    )
  }
}

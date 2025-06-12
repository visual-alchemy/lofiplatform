import { NextResponse } from "next/server"
import logger from "@/lib/logger"

export async function POST(request: Request) {
  try {
    console.log("Stream start requested")
    logger.addLog("Stream start requested")

    // Add a small delay to simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1000))

    logger.addLog("Stream started successfully")

    return NextResponse.json({
      message: "Stream started successfully",
      pid: Math.floor(Math.random() * 10000),
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

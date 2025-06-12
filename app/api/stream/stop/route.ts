import { NextResponse } from "next/server"
import logger from "@/lib/logger"

export async function POST(request: Request) {
  try {
    console.log("Stream stop requested")
    logger.addLog("Stream stop requested")

    // Add a small delay to simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1000))

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

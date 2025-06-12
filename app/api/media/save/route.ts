import { NextResponse } from "next/server"
import logger from "@/lib/logger"
import { saveMediaSelection } from "@/lib/media-manager"

export async function POST(request: Request) {
  try {
    const { video, audioPlaylist, videoLooping } = await request.json()

    console.log("Media selection saved:", { video, audioPlaylist, videoLooping })

    // Actually save the media selection
    await saveMediaSelection(video, audioPlaylist)

    // Create detailed log message
    let logMessage = "Media selection updated: "

    if (video) {
      const videoName = video.split("/").pop()
      logMessage += `Video: ${videoName}, `
    } else {
      logMessage += `No video selected, `
    }

    logMessage += `Audio playlist: ${audioPlaylist.length} file(s), `
    logMessage += `Video looping: ${videoLooping ? "enabled" : "disabled"}`

    logger.addLog(logMessage)

    return NextResponse.json({ message: "Media selection saved successfully" })
  } catch (error: any) {
    console.error("Error saving media selection:", error)
    logger.addLog(`Media selection save failed: ${error.message}`)

    return NextResponse.json(
      {
        error: error.message || "Failed to save media selection",
        details: "An unexpected error occurred while saving media selection",
      },
      { status: 500 },
    )
  }
}

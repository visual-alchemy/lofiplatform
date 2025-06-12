import { NextResponse } from "next/server"
import { getMediaFiles } from "@/lib/media-manager"

export async function GET() {
  try {
    // Get actual media files from the media-manager
    const mediaFiles = await getMediaFiles()
    return NextResponse.json(mediaFiles)
  } catch (error) {
    console.error("Error fetching media files:", error)
    return NextResponse.json({ error: "Failed to fetch media files", videos: [], audio: [] }, { status: 500 })
  }
}

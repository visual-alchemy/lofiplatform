import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock media files for now
    const mockMediaFiles = {
      videos: [
        {
          name: "lofi-background-1.mp4",
          path: "/media/videos/lofi-background-1.mp4",
          selected: false,
        },
        {
          name: "lofi-background-2.mp4",
          path: "/media/videos/lofi-background-2.mp4",
          selected: false,
        },
      ],
      audio: [
        {
          name: "chill-beats-1.mp3",
          path: "/media/audio/chill-beats-1.mp3",
          selected: false,
        },
        {
          name: "chill-beats-2.mp3",
          path: "/media/audio/chill-beats-2.mp3",
          selected: false,
        },
      ],
    }

    return NextResponse.json(mockMediaFiles)
  } catch (error) {
    console.error("Error fetching media files:", error)
    return NextResponse.json({ error: "Failed to fetch media files", videos: [], audio: [] }, { status: 500 })
  }
}

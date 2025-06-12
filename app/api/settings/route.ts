import { NextResponse } from "next/server"

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
  } catch (error) {
    console.error("Error fetching stream settings:", error)
    return NextResponse.json({ error: "Failed to fetch stream settings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const settings = await request.json()

    console.log("Settings saved:", settings)

    return NextResponse.json({ message: "Stream settings saved successfully (mock)" })
  } catch (error: any) {
    console.error("Error saving stream settings:", error)
    return NextResponse.json({ error: error.message || "Failed to save stream settings" }, { status: 500 })
  }
}

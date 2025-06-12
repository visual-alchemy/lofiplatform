import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { video, audioPlaylist } = await request.json()

    console.log("Media selection saved:", { video, audioPlaylist })

    return NextResponse.json({ message: "Media selection saved successfully (mock)" })
  } catch (error: any) {
    console.error("Error saving media selection:", error)
    return NextResponse.json({ error: error.message || "Failed to save media selection" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import logger from "@/lib/logger"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]
    const type = formData.get("type") as string

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    console.log(`Upload requested: ${files.length} ${type} files`)

    // Log the upload attempt
    logger.addLog(`Upload started: ${files.length} ${type} file(s)`)

    // Add a small delay to simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock response
    const mockFiles = files.map((file) => ({
      name: file.name,
      path: `/media/${type}/${file.name}`,
      selected: true, // Mark as selected by default
    }))

    // Log successful upload with file names
    const fileNames = files.map((f) => f.name).join(", ")
    logger.addLog(`Upload completed: ${files.length} ${type} file(s) - ${fileNames}`)

    // Log auto-selection
    if (type === "video") {
      logger.addLog(`Auto-selected video: ${files[0].name}`)
    } else {
      logger.addLog(`Auto-added ${files.length} audio file(s) to playlist`)
    }

    return NextResponse.json({
      message: `${files.length} files uploaded successfully`,
      files: mockFiles,
    })
  } catch (error: any) {
    console.error("Error uploading files:", error)
    logger.addLog(`Upload failed: ${error.message}`)

    return NextResponse.json(
      {
        error: error.message || "Failed to upload files",
        details: "An unexpected error occurred during file upload",
      },
      { status: 500 },
    )
  }
}

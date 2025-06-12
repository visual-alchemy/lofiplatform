import { NextResponse } from "next/server"
import logger from "@/lib/logger"
import { uploadMediaFiles } from "@/lib/media-manager"
import { saveMediaSelection, getMediaSelection } from "@/lib/media-manager"

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

    // Actually upload the files using the media-manager
    const uploadedFiles = await uploadMediaFiles(files, type)

    // Log successful upload with file names
    const fileNames = files.map((f) => f.name).join(", ")
    logger.addLog(`Upload completed: ${files.length} ${type} file(s) - ${fileNames}`)

    // Auto-select the uploaded files
    const currentSelection = await getMediaSelection()
    
    if (type === "video" && uploadedFiles.length > 0) {
      // Auto-select the first video
      const newVideo = uploadedFiles[0].path
      logger.addLog(`Auto-selected video: ${uploadedFiles[0].name}`)
      
      // Save the selection
      await saveMediaSelection(newVideo, currentSelection.audioPlaylist || [])
    } else if (type === "audio" && uploadedFiles.length > 0) {
      // Add all audio files to playlist
      const newPlaylist = [
        ...(currentSelection.audioPlaylist || []),
        ...uploadedFiles.map(file => file.path)
      ]
      logger.addLog(`Auto-added ${files.length} audio file(s) to playlist`)
      
      // Save the selection
      await saveMediaSelection(currentSelection.video, newPlaylist)
    }

    return NextResponse.json({
      message: `${files.length} files uploaded successfully`,
      files: uploadedFiles,
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

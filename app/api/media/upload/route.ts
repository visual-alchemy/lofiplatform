import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]
    const type = formData.get("type") as string

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    console.log(`Upload requested: ${files.length} ${type} files`)

    // Mock response
    const mockFiles = files.map((file) => ({
      name: file.name,
      path: `/media/${type}/${file.name}`,
      selected: false,
    }))

    return NextResponse.json({
      message: `${files.length} files uploaded successfully (mock)`,
      files: mockFiles,
    })
  } catch (error: any) {
    console.error("Error uploading files:", error)
    return NextResponse.json({ error: error.message || "Failed to upload files" }, { status: 500 })
  }
}

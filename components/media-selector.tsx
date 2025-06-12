"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Check, Music, Video, X, Trash2, RotateCcw, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface MediaFile {
  name: string
  path: string
  selected: boolean
}

export function MediaSelector() {
  const [videoFiles, setVideoFiles] = useState<MediaFile[]>([])
  const [audioFiles, setAudioFiles] = useState<MediaFile[]>([])
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [selectedAudioPlaylist, setSelectedAudioPlaylist] = useState<string[]>([])
  const [videoLooping, setVideoLooping] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Fetch available media files
    const fetchMedia = async () => {
      try {
        const response = await fetch("/api/media/list")

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (response.ok && data) {
          setVideoFiles(data.videos?.map((v: any) => ({ ...v, selected: v.selected || false })) || [])
          setAudioFiles(data.audio?.map((a: any) => ({ ...a, selected: a.selected || false })) || [])

          // Set selected video and audio
          const selectedVid = data.videos?.find((v: any) => v.selected)
          if (selectedVid) setSelectedVideo(selectedVid.path)

          const selectedAudio = data.audio?.filter((a: any) => a.selected).map((a: any) => a.path) || []
          setSelectedAudioPlaylist(selectedAudio)
        }
      } catch (error) {
        console.error("Failed to fetch media files:", error)
        toast.error("Failed to load media files")
      }
    }

    fetchMedia()
  }, [])

  const handleVideoSelect = (path: string) => {
    setSelectedVideo(path)
    setVideoFiles(
      videoFiles.map((file) => ({
        ...file,
        selected: file.path === path,
      })),
    )

    // Auto-save when a video is selected
    handleSaveMedia(path, selectedAudioPlaylist, videoLooping)
  }

  const handleAudioToggle = (path: string) => {
    const isSelected = selectedAudioPlaylist.includes(path)
    let newPlaylist: string[]

    if (isSelected) {
      newPlaylist = selectedAudioPlaylist.filter((p) => p !== path)
      setSelectedAudioPlaylist(newPlaylist)
      setAudioFiles(audioFiles.map((file) => (file.path === path ? { ...file, selected: false } : file)))
    } else {
      newPlaylist = [...selectedAudioPlaylist, path]
      setSelectedAudioPlaylist(newPlaylist)
      setAudioFiles(audioFiles.map((file) => (file.path === path ? { ...file, selected: true } : file)))
    }

    // Auto-save when audio selection changes
    handleSaveMedia(selectedVideo, newPlaylist, videoLooping)
  }

  const handleDeleteFile = async (filePath: string, type: "video" | "audio") => {
    try {
      const response = await fetch("/api/media/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePath, type }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (response.ok) {
        toast.success("File deleted successfully")

        // Remove from local state
        if (type === "video") {
          setVideoFiles(videoFiles.filter((file) => file.path !== filePath))
          if (selectedVideo === filePath) {
            setSelectedVideo(null)
            // Auto-save when selected video is deleted
            handleSaveMedia(null, selectedAudioPlaylist, videoLooping)
          }
        } else {
          setAudioFiles(audioFiles.filter((file) => file.path !== filePath))
          const newPlaylist = selectedAudioPlaylist.filter((path) => path !== filePath)
          setSelectedAudioPlaylist(newPlaylist)
          // Auto-save when audio is removed from playlist
          handleSaveMedia(selectedVideo, newPlaylist, videoLooping)
        }
      } else {
        toast.error(data.error || "Failed to delete file")
      }
    } catch (error: any) {
      console.error("Delete file error:", error)
      toast.error("Failed to connect to server")
    }
  }

  const handleToggleVideoLooping = (checked: boolean) => {
    setVideoLooping(checked)
    // Auto-save when looping setting changes
    handleSaveMedia(selectedVideo, selectedAudioPlaylist, checked)
  }

  const handleSaveMedia = async (
    videoPath: string | null = selectedVideo,
    audioPlaylist: string[] = selectedAudioPlaylist,
    looping: boolean = videoLooping,
  ) => {
    setIsSaving(true)

    try {
      const response = await fetch("/api/media/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          video: videoPath,
          audioPlaylist: audioPlaylist,
          videoLooping: looping,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (response.ok) {
        toast.success("Media selection saved")
      } else {
        toast.error(data.error || "Failed to save media selection")
      }
    } catch (error: any) {
      console.error("Save media error:", error)
      toast.error("Failed to connect to server")
    } finally {
      setIsSaving(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: "video" | "audio") => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i])
    }
    formData.append("type", type)

    setIsLoading(true)

    try {
      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      })

      // Check if response is ok first
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Check if response is actually JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response")
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      toast.success(`${files.length} ${type} file(s) uploaded successfully`)

      // Update the file lists and automatically select newly uploaded files
      if (type === "video" && data.files && data.files.length > 0) {
        // For videos, select the first uploaded video
        const newVideoPath = data.files[0].path

        // Update video files list with the new files
        const updatedVideoFiles = [
          ...videoFiles.map((file) => ({ ...file, selected: false })), // Deselect all existing videos
          ...data.files.map((f: any, index: number) => ({
            ...f,
            selected: index === 0, // Select only the first uploaded video
          })),
        ]

        setVideoFiles(updatedVideoFiles)
        setSelectedVideo(newVideoPath)

        // Auto-save with the newly uploaded video selected
        handleSaveMedia(newVideoPath, selectedAudioPlaylist, videoLooping)
      } else if (type === "audio" && data.files && data.files.length > 0) {
        // For audio, add all uploaded files to the playlist
        const newAudioPaths = data.files.map((f: any) => f.path)

        // Update audio files list with the new files
        const updatedAudioFiles = [
          ...audioFiles,
          ...data.files.map((f: any) => ({ ...f, selected: true })), // Select all new audio files
        ]

        setAudioFiles(updatedAudioFiles)
        const newPlaylist = [...selectedAudioPlaylist, ...newAudioPaths]
        setSelectedAudioPlaylist(newPlaylist)

        // Auto-save with the newly uploaded audio added to playlist
        handleSaveMedia(selectedVideo, newPlaylist, videoLooping)
      }
    } catch (error: any) {
      console.error("Upload error:", error)

      // Provide more specific error messages
      if (error.message.includes("HTTP error")) {
        toast.error("Server error occurred during upload")
      } else if (error.message.includes("non-JSON response")) {
        toast.error("Server returned an invalid response")
      } else {
        toast.error(error.message || "Failed to upload files")
      }
    } finally {
      setIsLoading(false)
      // Reset the file input
      event.target.value = ""
    }
  }

  return (
    <Card className="bg-white border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Media Selection</CardTitle>
        <CardDescription className="text-gray-600">
          Choose video background and audio playlist for your stream
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="video">
          <TabsList className="grid grid-cols-2 mb-4 bg-gray-100">
            <TabsTrigger value="video" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">
              Video
            </TabsTrigger>
            <TabsTrigger value="audio" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">
              Audio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="video">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Background Videos</h3>
                <Label
                  htmlFor="video-upload"
                  className={`cursor-pointer text-xs text-purple-600 hover:text-purple-700 font-medium ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isLoading ? "Uploading..." : "Upload Video"}
                </Label>
                <Input
                  id="video-upload"
                  type="file"
                  accept="video/mp4,video/webm"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "video")}
                  disabled={isLoading}
                  multiple
                />
              </div>

              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                <Switch id="video-looping" checked={videoLooping} onCheckedChange={handleToggleVideoLooping} />
                <Label htmlFor="video-looping" className="text-sm text-gray-700 flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Loop selected video
                </Label>
              </div>

              <ScrollArea className="h-64 rounded-md border border-gray-200 bg-gray-50">
                <div className="p-4 space-y-2">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 text-purple-600 animate-spin" />
                      <span className="ml-2 text-sm text-gray-600">Uploading video...</span>
                    </div>
                  ) : videoFiles.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">No video files available</p>
                  ) : (
                    videoFiles.map((file) => (
                      <div
                        key={file.path}
                        className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                          file.selected
                            ? "bg-purple-100 border border-purple-300"
                            : "bg-white hover:bg-gray-100 border border-gray-200"
                        }`}
                        onClick={() => handleVideoSelect(file.path)}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <Video className="h-4 w-4 text-gray-600" />
                          <span className="text-sm truncate max-w-[200px] text-gray-900">{file.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {file.selected && <Check className="h-4 w-4 text-purple-600" />}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteFile(file.path, "video")
                            }}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="audio">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Audio Playlist</h3>
                <Label
                  htmlFor="audio-upload"
                  className={`cursor-pointer text-xs text-purple-600 hover:text-purple-700 font-medium ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isLoading ? "Uploading..." : "Upload Audio"}
                </Label>
                <Input
                  id="audio-upload"
                  type="file"
                  accept="audio/mp3,audio/wav"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "audio")}
                  disabled={isLoading}
                  multiple
                />
              </div>

              <ScrollArea className="h-64 rounded-md border border-gray-200 bg-gray-50">
                <div className="p-4 space-y-2">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 text-purple-600 animate-spin" />
                      <span className="ml-2 text-sm text-gray-600">Uploading audio...</span>
                    </div>
                  ) : audioFiles.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">No audio files available</p>
                  ) : (
                    audioFiles.map((file) => (
                      <div
                        key={file.path}
                        className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                          file.selected
                            ? "bg-purple-100 border border-purple-300"
                            : "bg-white hover:bg-gray-100 border border-gray-200"
                        }`}
                        onClick={() => handleAudioToggle(file.path)}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <Music className="h-4 w-4 text-gray-600" />
                          <span className="text-sm truncate max-w-[200px] text-gray-900">{file.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {file.selected ? (
                            <Check className="h-4 w-4 text-purple-600" />
                          ) : (
                            <X className="h-4 w-4 text-gray-400" />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteFile(file.path, "audio")
                            }}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>

              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                {selectedAudioPlaylist.length} audio files selected for playlist
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-gray-500 italic flex items-center gap-2">
          {isSaving && <Loader2 className="h-3 w-3 animate-spin" />}
          Changes are saved automatically when you select or upload files
        </p>
      </CardFooter>
    </Card>
  )
}

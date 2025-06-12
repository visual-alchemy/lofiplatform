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
import { Check, Music, Video, X, Trash2, RotateCcw } from "lucide-react"
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

  useEffect(() => {
    // Fetch available media files
    const fetchMedia = async () => {
      try {
        const response = await fetch("/api/media/list")
        const data = await response.json()

        if (response.ok) {
          setVideoFiles(data.videos.map((v: any) => ({ ...v, selected: v.selected || false })))
          setAudioFiles(data.audio.map((a: any) => ({ ...a, selected: a.selected || false })))

          // Set selected video and audio
          const selectedVid = data.videos.find((v: any) => v.selected)
          if (selectedVid) setSelectedVideo(selectedVid.path)

          const selectedAudio = data.audio.filter((a: any) => a.selected).map((a: any) => a.path)
          setSelectedAudioPlaylist(selectedAudio)
        }
      } catch (error) {
        console.error("Failed to fetch media files:", error)
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
  }

  const handleAudioToggle = (path: string) => {
    const isSelected = selectedAudioPlaylist.includes(path)

    if (isSelected) {
      setSelectedAudioPlaylist(selectedAudioPlaylist.filter((p) => p !== path))
      setAudioFiles(audioFiles.map((file) => (file.path === path ? { ...file, selected: false } : file)))
    } else {
      setSelectedAudioPlaylist([...selectedAudioPlaylist, path])
      setAudioFiles(audioFiles.map((file) => (file.path === path ? { ...file, selected: true } : file)))
    }
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

      if (response.ok) {
        toast.success("File deleted successfully")

        // Remove from local state
        if (type === "video") {
          setVideoFiles(videoFiles.filter((file) => file.path !== filePath))
          if (selectedVideo === filePath) {
            setSelectedVideo(null)
          }
        } else {
          setAudioFiles(audioFiles.filter((file) => file.path !== filePath))
          setSelectedAudioPlaylist(selectedAudioPlaylist.filter((path) => path !== filePath))
        }
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to delete file")
      }
    } catch (error) {
      toast.error("Failed to connect to server")
      console.error(error)
    }
  }

  const handleSaveMedia = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/media/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          video: selectedVideo,
          audioPlaylist: selectedAudioPlaylist,
          videoLooping,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Media selection saved successfully")
      } else {
        toast.error(data.error || "Failed to save media selection")
      }
    } catch (error) {
      toast.error("Failed to connect to server")
      console.error(error)
    } finally {
      setIsLoading(false)
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

      const data = await response.json()

      if (response.ok) {
        toast.success(`${files.length} ${type} file(s) uploaded successfully`)

        // Update the file lists
        if (type === "video") {
          setVideoFiles([...videoFiles, ...data.files.map((f: any) => ({ ...f, selected: false }))])
        } else {
          setAudioFiles([...audioFiles, ...data.files.map((f: any) => ({ ...f, selected: false }))])
        }
      } else {
        toast.error(data.error || `Failed to upload ${type} files`)
      }
    } catch (error) {
      toast.error("Failed to connect to server")
      console.error(error)
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
                  className="cursor-pointer text-xs text-purple-600 hover:text-purple-700 font-medium"
                >
                  Upload Video
                </Label>
                <Input
                  id="video-upload"
                  type="file"
                  accept="video/mp4,video/webm"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "video")}
                  multiple
                />
              </div>

              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                <Switch id="video-looping" checked={videoLooping} onCheckedChange={setVideoLooping} />
                <Label htmlFor="video-looping" className="text-sm text-gray-700 flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Loop selected video
                </Label>
              </div>

              <ScrollArea className="h-64 rounded-md border border-gray-200 bg-gray-50">
                <div className="p-4 space-y-2">
                  {videoFiles.length === 0 ? (
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
                  className="cursor-pointer text-xs text-purple-600 hover:text-purple-700 font-medium"
                >
                  Upload Audio
                </Label>
                <Input
                  id="audio-upload"
                  type="file"
                  accept="audio/mp3,audio/wav"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "audio")}
                  multiple
                />
              </div>

              <ScrollArea className="h-64 rounded-md border border-gray-200 bg-gray-50">
                <div className="p-4 space-y-2">
                  {audioFiles.length === 0 ? (
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
        <Button
          onClick={handleSaveMedia}
          disabled={isLoading || (!selectedVideo && selectedAudioPlaylist.length === 0)}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          Save Media Selection
        </Button>
      </CardFooter>
    </Card>
  )
}

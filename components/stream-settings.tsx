"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"

interface StreamSettings {
  rtmpUrl: string
  streamKey: string
  videoBitrate: number
  audioBitrate: number
  resolution: string
  fps: number
  audioVolume: number
}

export function StreamSettings() {
  const [settings, setSettings] = useState<StreamSettings>({
    rtmpUrl: "rtmp://a.rtmp.youtube.com/live2",
    streamKey: "",
    videoBitrate: 2500,
    audioBitrate: 128,
    resolution: "1280x720",
    fps: 30,
    audioVolume: 1.0,
  })

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Fetch current settings
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings")
        const data = await response.json()

        if (response.ok) {
          setSettings(data)
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error)
      }
    }

    fetchSettings()
  }, [])

  const handleSaveSettings = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Stream settings saved successfully")
      } else {
        toast.error(data.error || "Failed to save settings")
      }
    } catch (error) {
      toast.error("Failed to connect to server")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-white border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Stream Settings</CardTitle>
        <CardDescription className="text-gray-600">Configure your stream quality and destination</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rtmpUrl" className="text-gray-900">
              RTMP URL
            </Label>
            <Input
              id="rtmpUrl"
              value={settings.rtmpUrl}
              onChange={(e) => setSettings({ ...settings, rtmpUrl: e.target.value })}
              className="bg-white border-gray-300 text-gray-900"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="streamKey" className="text-gray-900">
              Stream Key
            </Label>
            <Input
              id="streamKey"
              type="password"
              value={settings.streamKey}
              onChange={(e) => setSettings({ ...settings, streamKey: e.target.value })}
              className="bg-white border-gray-300 text-gray-900"
              placeholder="Your YouTube stream key"
            />
            <p className="text-xs text-gray-500">Get this from YouTube Studio &gt; Go Live &gt; Stream</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="resolution" className="text-gray-900">
              Resolution
            </Label>
            <Select
              value={settings.resolution}
              onValueChange={(value) => setSettings({ ...settings, resolution: value })}
            >
              <SelectTrigger id="resolution" className="bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder="Select resolution" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="1920x1080">1080p (1920x1080)</SelectItem>
                <SelectItem value="1280x720">720p (1280x720)</SelectItem>
                <SelectItem value="854x480">480p (854x480)</SelectItem>
                <SelectItem value="640x360">360p (640x360)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fps" className="text-gray-900">
              Frame Rate (FPS)
            </Label>
            <Select
              value={settings.fps.toString()}
              onValueChange={(value) => setSettings({ ...settings, fps: Number.parseInt(value) })}
            >
              <SelectTrigger id="fps" className="bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder="Select FPS" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="60">60 FPS</SelectItem>
                <SelectItem value="30">30 FPS</SelectItem>
                <SelectItem value="24">24 FPS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="videoBitrate" className="text-gray-900">
                Video Bitrate: {settings.videoBitrate} kbps
              </Label>
            </div>
            <Slider
              id="videoBitrate"
              min={500}
              max={8000}
              step={100}
              value={[settings.videoBitrate]}
              onValueChange={(value) => setSettings({ ...settings, videoBitrate: value[0] })}
              className="py-4"
            />
            <p className="text-xs text-gray-500">Higher values = better quality but requires more bandwidth</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="audioBitrate" className="text-gray-900">
                Audio Bitrate: {settings.audioBitrate} kbps
              </Label>
            </div>
            <Slider
              id="audioBitrate"
              min={64}
              max={320}
              step={32}
              value={[settings.audioBitrate]}
              onValueChange={(value) => setSettings({ ...settings, audioBitrate: value[0] })}
              className="py-4"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="audioVolume" className="text-gray-900">
                Audio Volume: {Math.round(settings.audioVolume * 100)}%
              </Label>
            </div>
            <Slider
              id="audioVolume"
              min={0}
              max={2}
              step={0.05}
              value={[settings.audioVolume]}
              onValueChange={(value) => setSettings({ ...settings, audioVolume: value[0] })}
              className="py-4"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSaveSettings}
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  )
}

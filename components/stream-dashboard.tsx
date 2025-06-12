"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StreamControl } from "@/components/stream-control"
import { MediaSelector } from "@/components/media-selector"
import { StreamSettings } from "@/components/stream-settings"
import { StreamMonitor } from "@/components/stream-monitor"
import { toast } from "sonner"

export function StreamDashboard() {
  const [streamStatus, setStreamStatus] = useState<"idle" | "streaming" | "error">("idle")
  const [streamStats, setStreamStats] = useState({
    uptime: "00:00:00",
    fps: "0",
    bitrate: "0 kbps",
    lastReconnect: "Never",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch initial stream status with error handling
    const fetchStatus = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/stream/status")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setStreamStatus(data.status)
        if (data.stats) {
          setStreamStats(data.stats)
        }
      } catch (err) {
        console.error("Failed to fetch stream status:", err)
        setStreamStatus("error")
        toast.error("Failed to connect to stream server")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStatus()

    // Set up polling for stream status updates
    const interval = setInterval(fetchStatus, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Tabs defaultValue="control" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4 bg-gray-100">
            <TabsTrigger value="control" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">
              Control
            </TabsTrigger>
            <TabsTrigger value="media" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">
              Media
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="control" className="space-y-4">
            <StreamControl status={streamStatus} />
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <MediaSelector />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <StreamSettings />
          </TabsContent>
        </Tabs>
      </div>

      <div className="lg:col-span-1">
        <StreamMonitor status={streamStatus} stats={streamStats} />
      </div>
    </div>
  )
}

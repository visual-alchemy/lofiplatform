"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, Gauge, Activity, RefreshCw } from "lucide-react"

interface StreamMonitorProps {
  status: "idle" | "streaming" | "error"
  stats: {
    uptime: string
    fps: string
    bitrate: string
    lastReconnect: string
  }
}

export function StreamMonitor({ status, stats }: StreamMonitorProps) {
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    // Fetch initial logs with error handling
    const fetchLogs = async () => {
      try {
        const response = await fetch("/api/stream/logs")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (data.logs) {
          setLogs(data.logs)
        }
      } catch (err) {
        console.error("Failed to fetch logs:", err)
        setLogs(["Error: Failed to fetch logs"])
      }
    }

    fetchLogs()

    // Set up polling for log updates
    const interval = setInterval(fetchLogs, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-gray-900">Stream Status</CardTitle>
          <CardDescription className="text-gray-600">Current stream metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-gray-500 flex items-center">
                <Clock className="h-3 w-3 mr-1" /> Uptime
              </span>
              <span className="font-mono text-sm text-gray-900">{stats.uptime}</span>
            </div>

            <div className="flex flex-col space-y-1">
              <span className="text-xs text-gray-500 flex items-center">
                <Activity className="h-3 w-3 mr-1" /> FPS
              </span>
              <span className="font-mono text-sm text-gray-900">{stats.fps}</span>
            </div>

            <div className="flex flex-col space-y-1">
              <span className="text-xs text-gray-500 flex items-center">
                <Gauge className="h-3 w-3 mr-1" /> Bitrate
              </span>
              <span className="font-mono text-sm text-gray-900">{stats.bitrate}</span>
            </div>

            <div className="flex flex-col space-y-1">
              <span className="text-xs text-gray-500 flex items-center">
                <RefreshCw className="h-3 w-3 mr-1" /> Last Reconnect
              </span>
              <span className="font-mono text-sm text-gray-900">{stats.lastReconnect}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-gray-900">Stream Logs</CardTitle>
          <CardDescription className="text-gray-600">Recent activity</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] rounded-md border border-gray-200 bg-gray-50 p-2">
            <div className="font-mono text-xs space-y-1">
              {logs.length === 0 ? (
                <p className="text-gray-500 p-2">No logs available</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="py-1 border-b border-gray-200 last:border-0 text-gray-800">
                    {log}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

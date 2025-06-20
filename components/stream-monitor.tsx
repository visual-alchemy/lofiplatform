"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, Gauge, Activity, RefreshCw, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StreamMonitorProps {
  status: "idle" | "streaming" | "error"
  stats: {
    uptime: string
    fps: string
    bitrate: string
    lastReconnect: string
    currentTrack?: string
  }
}

export function StreamMonitor({ status, stats }: StreamMonitorProps) {
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLogs = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/stream/logs")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.logs) {
        // Reverse the logs array to show newest logs at the top
        setLogs([...data.logs].reverse())
      } else {
        // Handle case where logs property is missing
        setLogs([`[${new Date().toISOString()}] No logs available`])
      }
    } catch (err: any) {
      console.error("Failed to fetch logs:", err)
      setError(err.message || "Failed to fetch logs")
      // Don't clear existing logs on error
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Fetch initial logs
    fetchLogs()

    // Set up polling for log updates
    const interval = setInterval(fetchLogs, 10000)

    return () => clearInterval(interval)
  }, [])

  const handleRefreshLogs = () => {
    fetchLogs()
  }

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
            
            {/* Current Track - spans full width */}
            <div className="flex flex-col space-y-1 col-span-2 mt-2 pt-2 border-t border-gray-200">
              <span className="text-xs text-gray-500 flex items-center">
                <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Now Playing
              </span>
              <span className="font-mono text-sm text-gray-900 truncate">
                {status === "streaming" ? (stats.currentTrack || "No track info available") : "No track playing"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg text-gray-900">Stream Logs</CardTitle>
            <CardDescription className="text-gray-600">Recent activity (newest first)</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefreshLogs} disabled={isLoading} className="h-8 px-2">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-1">Refresh</span>
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] rounded-md border border-gray-200 bg-gray-50 p-2">
            {error ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
                <p className="text-red-500 font-medium">{error}</p>
                <p className="text-gray-500 text-sm mt-1">Check your connection and try refreshing</p>
              </div>
            ) : isLoading && logs.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 text-purple-600 animate-spin" />
                <span className="ml-2 text-gray-600">Loading logs...</span>
              </div>
            ) : logs.length === 0 ? (
              <p className="text-gray-500 p-2">No logs available</p>
            ) : (
              <div className="font-mono text-xs space-y-1">
                {logs.map((log, index) => (
                  <div key={index} className="py-1 border-b border-gray-200 last:border-0 text-gray-800">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Play, Square, RefreshCw } from "lucide-react"
import { toast } from "sonner"

interface StreamControlProps {
  status: "idle" | "streaming" | "error"
}

export function StreamControl({ status }: StreamControlProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleStreamAction = async (action: "start" | "stop" | "restart") => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/stream/${action}`, {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
      } else {
        toast.error(data.error || "Failed to perform action")
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
        <CardTitle className="flex items-center gap-2 text-gray-900">
          Stream Control
          {status === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
        </CardTitle>
        <CardDescription className="text-gray-600">Manage your YouTube RTMP stream</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full ${
                status === "streaming"
                  ? "bg-green-500 animate-pulse"
                  : status === "error"
                    ? "bg-red-500"
                    : "bg-gray-400"
              }`}
            />
            <span className="text-sm font-medium text-gray-900">
              {status === "streaming" ? "Streaming" : status === "error" ? "Error" : "Idle"}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          {status === "streaming"
            ? "Your stream is currently active and broadcasting to YouTube."
            : status === "error"
              ? "There was an error with your stream. Check the logs for details."
              : "Your stream is currently stopped. Press Start to begin streaming."}
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          variant={status === "streaming" ? "destructive" : "default"}
          onClick={() => handleStreamAction(status === "streaming" ? "stop" : "start")}
          disabled={isLoading || status === "error"}
          className={status !== "streaming" ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}
        >
          {status === "streaming" ? (
            <>
              <Square className="mr-2 h-4 w-4" />
              Stop Stream
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Start Stream
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={() => handleStreamAction("restart")}
          disabled={isLoading}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Restart
        </Button>
      </CardFooter>
    </Card>
  )
}

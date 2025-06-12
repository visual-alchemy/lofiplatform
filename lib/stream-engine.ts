import fs from "fs"
import path from "path"
import { spawn, type ChildProcess } from "child_process"
import { getStreamSettings } from "./settings-manager"
import { getMediaSelection } from "./media-manager"

// Store the FFmpeg process
let ffmpegProcess: ChildProcess | null = null
let streamStartTime: Date | null = null
let lastReconnectTime: Date | null = null
const streamStats = {
  fps: "0",
  bitrate: "0 kbps",
}

// Path to log file
const LOG_FILE = path.join(process.cwd(), "logs", "stream.log")
const LOG_MAX_LINES = 100

// Ensure logs directory exists
if (!fs.existsSync(path.join(process.cwd(), "logs"))) {
  fs.mkdirSync(path.join(process.cwd(), "logs"), { recursive: true })
}

// Function to log messages
function logMessage(message: string) {
  const timestamp = new Date().toISOString()
  const logEntry = `[${timestamp}] ${message}`

  // Append to log file
  fs.appendFileSync(LOG_FILE, logEntry + "\n")

  console.log(logEntry)
}

// Function to get stream status
export async function getStreamStatus() {
  const isStreaming = ffmpegProcess !== null && !ffmpegProcess.killed

  let uptime = "00:00:00"
  if (isStreaming && streamStartTime) {
    const uptimeMs = Date.now() - streamStartTime.getTime()
    const uptimeSec = Math.floor(uptimeMs / 1000)
    const hours = Math.floor(uptimeSec / 3600)
    const minutes = Math.floor((uptimeSec % 3600) / 60)
    const seconds = uptimeSec % 60
    uptime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const lastReconnect = lastReconnectTime ? lastReconnectTime.toLocaleString() : "Never"

  return {
    status: isStreaming ? "streaming" : "idle",
    stats: {
      uptime,
      fps: streamStats.fps,
      bitrate: streamStats.bitrate,
      lastReconnect,
    },
  }
}

// Function to get stream logs
export async function getStreamLogs() {
  if (!fs.existsSync(LOG_FILE)) {
    return []
  }

  const logContent = fs.readFileSync(LOG_FILE, "utf-8")
  const logLines = logContent.split("\n").filter((line) => line.trim() !== "")

  // Return the last LOG_MAX_LINES lines
  return logLines.slice(-LOG_MAX_LINES)
}

// Function to build FFmpeg command
async function buildFFmpegCommand() {
  const settings = await getStreamSettings()
  const { video, audioPlaylist } = await getMediaSelection()

  if (!video || audioPlaylist.length === 0) {
    throw new Error("No video or audio files selected")
  }

  if (!settings.streamKey) {
    throw new Error("Stream key is not set")
  }

  const [width, height] = settings.resolution.split("x")

  // Build FFmpeg command
  const args = [
    // Input video file (looped)
    "-stream_loop",
    "-1",
    "-re",
    "-i",
    video,

    // Input audio files (playlist)
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    createAudioPlaylist(audioPlaylist),

    // Video settings
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-b:v",
    `${settings.videoBitrate}k`,
    "-maxrate",
    `${settings.videoBitrate * 1.5}k`,
    "-bufsize",
    `${settings.videoBitrate * 3}k`,
    "-vf",
    `scale=${width}:${height}`,
    "-r",
    settings.fps.toString(),
    "-g",
    (settings.fps * 2).toString(),
    "-pix_fmt",
    "yuv420p",

    // Audio settings
    "-c:a",
    "aac",
    "-b:a",
    `${settings.audioBitrate}k`,
    "-ar",
    "44100",
    "-af",
    `volume=${settings.audioVolume}`,

    // Output settings
    "-f",
    "flv",
    "-flvflags",
    "no_duration_filesize",

    // Stream reconnection settings
    "-reconnect",
    "1",
    "-reconnect_streamed",
    "1",
    "-reconnect_delay_max",
    "120",

    // RTMP destination
    `${settings.rtmpUrl}/${settings.streamKey}`,
  ]

  return args
}

// Function to create a temporary audio playlist file
function createAudioPlaylist(audioFiles: string[]) {
  const playlistPath = path.join(process.cwd(), "temp", "audio_playlist.txt")

  // Ensure temp directory exists
  if (!fs.existsSync(path.join(process.cwd(), "temp"))) {
    fs.mkdirSync(path.join(process.cwd(), "temp"), { recursive: true })
  }

  // Create playlist file content
  const playlistContent = audioFiles.map((file) => `file '${file.replace(/'/g, "'\\''")}'`).join("\n")

  fs.writeFileSync(playlistPath, playlistContent)

  return playlistPath
}

// Function to start the stream
export async function startStream() {
  if (ffmpegProcess) {
    throw new Error("Stream is already running")
  }

  try {
    const ffmpegArgs = await buildFFmpegCommand()

    logMessage("Starting stream with FFmpeg")
    logMessage(`FFmpeg command: ffmpeg ${ffmpegArgs.join(" ")}`)

    ffmpegProcess = spawn("ffmpeg", ffmpegArgs)
    streamStartTime = new Date()

    // Handle FFmpeg output
    ffmpegProcess.stdout?.on("data", (data) => {
      logMessage(`FFmpeg stdout: ${data}`)
    })

    ffmpegProcess.stderr?.on("data", (data) => {
      const output = data.toString()
      logMessage(`FFmpeg stderr: ${output}`)

      // Parse FFmpeg output for stats
      if (output.includes("fps=")) {
        const fpsMatch = output.match(/fps=\s*([0-9.]+)/)
        if (fpsMatch) {
          streamStats.fps = fpsMatch[1]
        }
      }

      if (output.includes("bitrate=")) {
        const bitrateMatch = output.match(/bitrate=\s*([0-9.]+\w+)/)
        if (bitrateMatch) {
          streamStats.bitrate = bitrateMatch[1]
        }
      }

      // Detect reconnection attempts
      if (output.includes("Reconnecting")) {
        lastReconnectTime = new Date()
        logMessage("Detected reconnection attempt")
      }
    })

    // Handle FFmpeg process exit
    ffmpegProcess.on("close", (code) => {
      logMessage(`FFmpeg process exited with code ${code}`)

      // Auto-restart if process exits unexpectedly
      if (code !== 0 && ffmpegProcess !== null) {
        logMessage("Stream ended unexpectedly, attempting to restart...")
        ffmpegProcess = null
        setTimeout(() => {
          startStream().catch((err) => {
            logMessage(`Failed to restart stream: ${err.message}`)
          })
        }, 5000)
      } else {
        ffmpegProcess = null
        streamStartTime = null
      }
    })

    return { pid: ffmpegProcess.pid }
  } catch (error: any) {
    logMessage(`Error starting stream: ${error.message}`)
    throw error
  }
}

// Function to stop the stream
export async function stopStream() {
  if (!ffmpegProcess) {
    throw new Error("Stream is not running")
  }

  return new Promise<void>((resolve, reject) => {
    logMessage("Stopping stream")

    // Send SIGTERM to gracefully stop FFmpeg
    ffmpegProcess?.kill("SIGTERM")

    // Set a timeout to force kill if it doesn't exit gracefully
    const timeout = setTimeout(() => {
      if (ffmpegProcess) {
        logMessage("Force killing FFmpeg process")
        ffmpegProcess.kill("SIGKILL")
      }
    }, 5000)

    // Handle process exit
    ffmpegProcess?.on("exit", () => {
      clearTimeout(timeout)
      ffmpegProcess = null
      streamStartTime = null
      logMessage("Stream stopped successfully")
      resolve()
    })

    ffmpegProcess?.on("error", (err) => {
      clearTimeout(timeout)
      logMessage(`Error stopping stream: ${err.message}`)
      reject(err)
    })
  })
}

// Function to restart the stream
export async function restartStream() {
  logMessage("Restarting stream")

  if (ffmpegProcess) {
    await stopStream()
  }

  return startStream()
}

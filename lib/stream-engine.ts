import fs from "fs"
import path from "path"
import { spawn, type ChildProcess } from "child_process"
import { getStreamSettings } from "./settings-manager"
import { getMediaSelection } from "./media-manager"

// Store the FFmpeg process
let ffmpegProcess: ChildProcess | null = null
let streamStartTime: Date | null = null
let lastReconnectTime: Date | null = null
let currentPlayingFile: string = "None"
let currentPlayingIndex: number = 0
let selectedAudioFiles: string[] = []
let audioPlaybackStartTime: Date | null = null
const streamStats = {
  fps: "0",
  bitrate: "0 kbps",
  currentTrack: "None",
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

  // Make sure we have a valid current track if we're streaming
  if (isStreaming && selectedAudioFiles.length > 0 && 
      (streamStats.currentTrack === "None" || streamStats.currentTrack === "")) {
    const firstTrack = path.basename(selectedAudioFiles[0]);
    streamStats.currentTrack = firstTrack.replace(".mp3", "");
    logMessage(`Correcting current track in status to: ${streamStats.currentTrack}`);
  }

  return {
    status: isStreaming ? "streaming" : "idle",
    stats: {
      uptime,
      fps: streamStats.fps,
      bitrate: streamStats.bitrate,
      lastReconnect,
      currentTrack: streamStats.currentTrack,
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

// Function to create a temporary audio playlist file
function createAudioPlaylist(audioFiles: string[]) {
  const playlistPath = path.join(process.cwd(), "temp", "audio_playlist.txt")

  // Ensure temp directory exists
  if (!fs.existsSync(path.join(process.cwd(), "temp"))) {
    fs.mkdirSync(path.join(process.cwd(), "temp"), { recursive: true })
  }

  // Create playlist file content for FFmpeg concat demuxer
  let playlistContent = "";
  
  // Add each file with proper format for FFmpeg concat demuxer
  audioFiles.forEach(file => {
    // Format for FFmpeg concat demuxer
    playlistContent += `file '${file}'\n`;
  });
  
  fs.writeFileSync(playlistPath, playlistContent);
  logMessage(`Created audio playlist with ${audioFiles.length} files at ${playlistPath}`);
  logMessage(`Playlist content sample (first few entries): ${playlistContent.split('\n').slice(0, 5).join('\n')}...`);

  return playlistPath;
}

// Function to build FFmpeg command
async function buildFFmpegCommand() {
  const settings = await getStreamSettings()
  const { video, audioPlaylist, videoLooping } = await getMediaSelection()

  if (!video) {
    throw new Error("No video selected")
  }
  
  if (audioPlaylist.length === 0) {
    throw new Error("No audio files available in playlist")
  }

  if (!settings.streamKey) {
    throw new Error("Stream key is not set")
  }

  const [width, height] = settings.resolution.split("x")
  
  // Filter out audio files with special characters
  const filteredAudioPlaylist = audioPlaylist.filter((file: string) => !file.includes("'"));
  logMessage(`Filtered out ${audioPlaylist.length - filteredAudioPlaylist.length} audio files with special characters`);
  
  if (filteredAudioPlaylist.length === 0) {
    throw new Error("No valid audio files available after filtering");
  }
  
  // Use all filtered audio files instead of limiting to just 5
  selectedAudioFiles = filteredAudioPlaylist;
  currentPlayingIndex = 0;
  audioPlaybackStartTime = new Date();
  
  // Set initial track information
  if (selectedAudioFiles.length > 0) {
    const firstTrack = path.basename(selectedAudioFiles[0]);
    streamStats.currentTrack = firstTrack.replace(".mp3", "");
    currentPlayingFile = selectedAudioFiles[0];
    logMessage(`Starting playback with track: ${streamStats.currentTrack}`);
  }
  
  // Log the full paths for debugging
  logMessage(`Video file: ${video}`);
  logMessage(`Selected ${selectedAudioFiles.length} audio files for playlist`);
  logMessage(`Initial track: ${streamStats.currentTrack}`);
  
  // Create a playlist file for FFmpeg to use
  const playlistPath = createAudioPlaylist(selectedAudioFiles);
  
  // Build FFmpeg command
  const args = [
    // Input video file (looped if enabled)
    ...(videoLooping ? ["-stream_loop", "-1"] : []),
    "-re",
    "-i",
    video,
    
    // Use the playlist file for audio input
    "-f", "concat",
    "-safe", "0",
    "-i", playlistPath,
    
    // Map video from first input and audio from second input
    "-map", "0:v", // Map video from first input
    "-map", "1:a", // Map audio from second input (playlist)

    // Video settings for CBR (Constant Bit Rate)
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-b:v",
    `${settings.videoBitrate}k`,
    "-minrate", 
    `${settings.videoBitrate}k`,
    "-maxrate",
    `${settings.videoBitrate}k`,
    "-bufsize",
    `${settings.videoBitrate * 2}k`,
    "-vf",
    `scale=${width}:${height}`,
    "-r",
    settings.fps.toString(),
    "-g",
    (settings.fps * 2).toString(),
    "-pix_fmt",
    "yuv420p",
    "-tune", 
    "zerolatency",
    "-profile:v",
    "main",
    "-level",
    "4.1",

    // Audio settings - also using CBR for audio
    "-c:a",
    "aac",
    "-b:a",
    `${settings.audioBitrate}k`,
    "-ar",
    "44100",
    "-ac",
    "2",  // Stereo audio
    
    // Ensure audio is properly handled
    "-async", 
    "1",  // Audio sync method
    
    // Loop the output indefinitely
    "-shortest",
    
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
    
    // Ensure we have the correct initial track set
    if (selectedAudioFiles.length > 0) {
      const firstTrack = path.basename(selectedAudioFiles[0]);
      streamStats.currentTrack = firstTrack.replace(".mp3", "");
      logMessage(`Setting initial track on stream start: ${streamStats.currentTrack}`);
      
      // Force the current track to be the first one in the playlist
      setTimeout(() => {
        if (selectedAudioFiles.length > 0) {
          const firstTrack = path.basename(selectedAudioFiles[0]);
          streamStats.currentTrack = firstTrack.replace(".mp3", "");
          logMessage(`Forcing initial track after delay: ${streamStats.currentTrack}`);
        }
      }, 2000);
    }

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
      
      // Track current playing file
      if (output.includes("mp3") && (output.includes("Opening") || output.includes("from"))) {
        // Try different regex patterns to match FFmpeg's output formats
        let fileMatch = output.match(/Opening '([^']+\.mp3)'/i) || 
                       output.match(/from ['"]([^'"]+\.mp3)['"]/i) ||
                       output.match(/Input #\d+, .+, from '([^']+\.mp3)'/i);
        
        if (fileMatch && fileMatch[1]) {
          const fullPath = fileMatch[1];
          const fileName = path.basename(fullPath);
          
          // We'll collect the detected files but only use them after initialization
          // Store this detection for later use but don't update the current track yet
          if (!output.includes("Input #")) {
            // This is likely actual playback, not initialization
            currentPlayingFile = fileName;
            streamStats.currentTrack = fileName.replace(".mp3", "");
            logMessage(`Now playing: ${streamStats.currentTrack}`);
          }
        }
      }
      
      // Update current track based on time progress
      if (output.includes("time=")) {
        // This is a progress update, which confirms we're playing
        // Make sure we have the correct track displayed
        if (selectedAudioFiles.length > 0 && streamStats.currentTrack === "None") {
          const firstTrack = path.basename(selectedAudioFiles[0]);
          streamStats.currentTrack = firstTrack.replace(".mp3", "");
          logMessage(`Setting initial track: ${streamStats.currentTrack}`);
        }
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
  logMessage("Stream stop requested")
  
  // Try to find and kill any running FFmpeg processes even if our ffmpegProcess is null
  try {
    // On Unix-like systems (Mac, Linux), try to kill FFmpeg processes
    const { exec } = require('child_process');
    exec('pkill -f ffmpeg', (error: Error | null, stdout: string, stderr: string) => {
      if (error) {
        logMessage(`No external FFmpeg processes found or could not kill: ${error.message}`);
      } else {
        logMessage("Killed external FFmpeg processes");
      }
    });
  } catch (err: unknown) {
    const error = err as Error;
    logMessage(`Error trying to kill external FFmpeg processes: ${error.message}`);
  }
  
  // Handle our tracked FFmpeg process
  if (!ffmpegProcess) {
    logMessage("Stream is not running, nothing to stop");
    return { success: true, message: "Stream was not running" };
  }

  return new Promise<void>((resolve, reject) => {
    logMessage("Stopping tracked FFmpeg process");
    
    // Try SIGKILL directly instead of SIGTERM for more reliable termination
    try {
      if (ffmpegProcess) {
        ffmpegProcess.kill('SIGKILL');
        logMessage("SIGKILL sent to FFmpeg process");
      }
    } catch (err: unknown) {
      const error = err as Error;
      logMessage(`Error sending SIGKILL: ${error.message}`);
    }

    // Set a timeout to check if process is still running
    const timeout = setTimeout(() => {
      if (ffmpegProcess && ffmpegProcess.pid) {
        try {
          // Try again with process.kill
          process.kill(ffmpegProcess.pid, 'SIGKILL');
          logMessage("Force killed FFmpeg process with process.kill");
        } catch (err: unknown) {
          const error = err as Error;
          logMessage(`Could not force kill: ${error.message}`);
        }
      }
    }, 1000);

    // Handle process exit
    if (ffmpegProcess) {
      ffmpegProcess.on("exit", () => {
        clearTimeout(timeout);
        ffmpegProcess = null;
        streamStartTime = null;
        logMessage("Stream stopped successfully");
        resolve();
      });

      ffmpegProcess.on("error", (err) => {
        clearTimeout(timeout);
        logMessage(`Error stopping stream: ${err.message}`);
        
        // Still consider the stream stopped even if there was an error
        ffmpegProcess = null;
        streamStartTime = null;
        resolve();
      });
    } else {
      clearTimeout(timeout);
      resolve();
    }
    
    // Add a fallback to resolve the promise after a timeout
    setTimeout(() => {
      if (ffmpegProcess) {
        ffmpegProcess = null;
        streamStartTime = null;
        logMessage("Stream stop timed out, but considering it stopped");
      }
      resolve();
    }, 3000);
  });
}

// Function to restart the stream
export async function restartStream() {
  logMessage("Restarting stream")

  if (ffmpegProcess) {
    await stopStream()
  }

  return startStream()
}

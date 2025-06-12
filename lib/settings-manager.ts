import fs from "fs"
import path from "path"

// Define paths
const CONFIG_DIR = path.join(process.cwd(), "config")
const SETTINGS_FILE = path.join(CONFIG_DIR, "settings.json")

// Ensure config directory exists
if (!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true })
}

// Default settings
const defaultSettings = {
  rtmpUrl: "rtmp://a.rtmp.youtube.com/live2",
  streamKey: "",
  videoBitrate: 2500,
  audioBitrate: 128,
  resolution: "1280x720",
  fps: 30,
  audioVolume: 1.0,
}

// Function to get stream settings
export async function getStreamSettings() {
  if (!fs.existsSync(SETTINGS_FILE)) {
    return defaultSettings
  }

  try {
    const settingsData = fs.readFileSync(SETTINGS_FILE, "utf-8")
    const settings = JSON.parse(settingsData)

    // Merge with defaults to ensure all properties exist
    return { ...defaultSettings, ...settings }
  } catch (error) {
    console.error("Error reading settings:", error)
    return defaultSettings
  }
}

// Function to save stream settings
export async function saveStreamSettings(settings: any) {
  // Validate settings
  if (!settings.rtmpUrl) {
    throw new Error("RTMP URL is required")
  }

  if (settings.videoBitrate < 500 || settings.videoBitrate > 8000) {
    throw new Error("Video bitrate must be between 500 and 8000 kbps")
  }

  if (settings.audioBitrate < 64 || settings.audioBitrate > 320) {
    throw new Error("Audio bitrate must be between 64 and 320 kbps")
  }

  if (settings.fps < 1 || settings.fps > 60) {
    throw new Error("FPS must be between 1 and 60")
  }

  if (settings.audioVolume < 0 || settings.audioVolume > 2) {
    throw new Error("Audio volume must be between 0 and 2")
  }

  // Save settings
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2))

  return settings
}

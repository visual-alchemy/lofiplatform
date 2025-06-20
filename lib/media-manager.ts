import fs from "fs"
import path from "path"
import { writeFile } from "fs/promises"

// Define paths
const MEDIA_DIR = path.join(process.cwd(), "media")
const VIDEO_DIR = path.join(MEDIA_DIR, "videos")
const AUDIO_DIR = path.join(MEDIA_DIR, "audio")
const CONFIG_FILE = path.join(process.cwd(), "config", "media.json")

// Ensure directories exist
if (!fs.existsSync(MEDIA_DIR)) {
  fs.mkdirSync(MEDIA_DIR, { recursive: true })
}
if (!fs.existsSync(VIDEO_DIR)) {
  fs.mkdirSync(VIDEO_DIR, { recursive: true })
}
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true })
}
if (!fs.existsSync(path.join(process.cwd(), "config"))) {
  fs.mkdirSync(path.join(process.cwd(), "config"), { recursive: true })
}

// Default media config
const defaultMediaConfig = {
  video: null,
  audioPlaylist: [],
  videoLooping: true,
}

// Function to get media files
export async function getMediaFiles() {
  // Get all video files
  const videoFiles = fs.existsSync(VIDEO_DIR)
    ? fs
        .readdirSync(VIDEO_DIR)
        .filter((file) => file.endsWith(".mp4") || file.endsWith(".webm"))
        .map((file) => ({
          name: file,
          path: path.join(VIDEO_DIR, file),
          selected: false,
        }))
    : []

  // Get all audio files
  const audioFiles = fs.existsSync(AUDIO_DIR)
    ? fs
        .readdirSync(AUDIO_DIR)
        .filter((file) => file.endsWith(".mp3") || file.endsWith(".wav"))
        .map((file) => ({
          name: file,
          path: path.join(AUDIO_DIR, file),
          selected: false,
        }))
    : []

  // Get current selection
  const { video, audioPlaylist } = await getMediaSelection()

  // Mark selected files
  if (video) {
    const selectedVideo = videoFiles.find((file) => file.path === video)
    if (selectedVideo) {
      selectedVideo.selected = true
    }
  }

  audioPlaylist.forEach((audioPath: string) => {
    const selectedAudio = audioFiles.find((file) => file.path === audioPath)
    if (selectedAudio) {
      selectedAudio.selected = true
    }
  })

  return {
    videos: videoFiles,
    audio: audioFiles,
  }
}

// Function to get all audio files from the audio directory
export function getAllAudioFiles() {
  if (!fs.existsSync(AUDIO_DIR)) {
    return [];
  }
  
  return fs
    .readdirSync(AUDIO_DIR)
    .filter((file) => file.endsWith(".mp3") || file.endsWith(".wav"))
    .map((file) => path.join(AUDIO_DIR, file));
}

// Function to get current media selection
export async function getMediaSelection() {
  if (!fs.existsSync(CONFIG_FILE)) {
    return defaultMediaConfig
  }

  try {
    const configData = fs.readFileSync(CONFIG_FILE, "utf-8")
    const config = JSON.parse(configData)
    
    // If no audio files are selected, use all available audio files
    if (config.audioPlaylist && config.audioPlaylist.length === 0) {
      config.audioPlaylist = getAllAudioFiles();
    }
    
    return { ...defaultMediaConfig, ...config }
  } catch (error) {
    console.error("Error reading media config:", error)
    return defaultMediaConfig
  }
}

// Function to save media selection
export async function saveMediaSelection(video: string | null, audioPlaylist: string[]) {
  // Get current selection to preserve videoLooping setting
  const currentConfig = await getMediaSelection()

  // Validate video file exists if provided
  if (video && !fs.existsSync(video)) {
    console.warn(`Video file not found: ${video}`)
  }

  // Validate audio files exist
  for (const audioFile of audioPlaylist) {
    if (!fs.existsSync(audioFile)) {
      console.warn(`Audio file not found: ${audioFile}`)
    }
  }

  const mediaConfig = {
    video,
    audioPlaylist,
    videoLooping: currentConfig.videoLooping,
  }

  fs.writeFileSync(CONFIG_FILE, JSON.stringify(mediaConfig, null, 2))

  return mediaConfig
}

// Function to upload media files
export async function uploadMediaFiles(files: File[], type: string) {
  const uploadDir = type === "video" ? VIDEO_DIR : AUDIO_DIR
  const uploadedFiles = []

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer())
    const filePath = path.join(uploadDir, file.name)

    await writeFile(filePath, buffer)

    uploadedFiles.push({
      name: file.name,
      path: filePath,
      selected: false,
    })
  }

  return uploadedFiles
}

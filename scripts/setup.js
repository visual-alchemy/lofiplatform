const fs = require("fs")
const path = require("path")

console.log("Setting up Lo-Fi Streaming Platform...")

// Create necessary directories
const directories = ["media", "media/videos", "media/audio", "config", "logs", "temp"]

directories.forEach((dir) => {
  const dirPath = path.join(process.cwd(), dir)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    console.log(`Created directory: ${dir}`)
  }
})

// Create initial configuration files
const defaultSettings = {
  rtmpUrl: "rtmp://a.rtmp.youtube.com/live2",
  streamKey: "",
  videoBitrate: 2500,
  audioBitrate: 128,
  resolution: "1280x720",
  fps: 30,
  audioVolume: 1.0,
}

const settingsPath = path.join(process.cwd(), "config", "settings.json")
if (!fs.existsSync(settingsPath)) {
  fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2))
  console.log("Created default settings.json")
}

// Create initial media config
const defaultMediaConfig = {
  video: null,
  audioPlaylist: [],
}

const mediaConfigPath = path.join(process.cwd(), "config", "media.json")
if (!fs.existsSync(mediaConfigPath)) {
  fs.writeFileSync(mediaConfigPath, JSON.stringify(defaultMediaConfig, null, 2))
  console.log("Created default media.json")
}

// Create initial changelog
const changelogPath = path.join(process.cwd(), "CHANGELOG.md")
if (!fs.existsSync(changelogPath)) {
  const initialChangelog = `# Changelog

All notable changes to this Lo-Fi streaming platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## ${new Date().toISOString().split("T")[0]}

### Initial Setup

- Created Lo-Fi streaming platform
- Set up web interface for stream control
- Configured FFmpeg streaming engine
- Added media file management
- Implemented automatic changelog tracking

`

  fs.writeFileSync(changelogPath, initialChangelog)
  console.log("Created initial CHANGELOG.md")
}

// Create package.json scripts section
const packageJsonPath = path.join(process.cwd(), "package.json")
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"))

  if (!packageJson.scripts) {
    packageJson.scripts = {}
  }

  packageJson.scripts = {
    ...packageJson.scripts,
    setup: "node scripts/setup.js",
    "start:prod": "pm2 start ecosystem.config.js",
    "stop:prod": "pm2 stop lofi-stream",
    "restart:prod": "pm2 restart lofi-stream",
    "logs:prod": "pm2 logs lofi-stream",
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
  console.log("Updated package.json scripts")
}

console.log("\n✅ Setup complete!")
console.log("\nNext steps:")
console.log("1. Install FFmpeg: sudo apt update && sudo apt install ffmpeg")
console.log("2. Install PM2: npm install -g pm2")
console.log("3. Add your video files to media/videos/")
console.log("4. Add your audio files to media/audio/")
console.log("5. Configure your YouTube stream key in the web interface")
console.log("6. Start the application: npm run dev")
console.log("7. Open http://localhost:3000 to access the dashboard")

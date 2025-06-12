# 🎵 24/7 Lo-Fi Streaming Platform

<div align="center">

![Lo-Fi Stream Control](https://img.shields.io/badge/Stream-Lo--Fi-purple?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-Ubuntu-orange?style=for-the-badge)
![Tech](https://img.shields.io/badge/Tech-Next.js%20%7C%20FFmpeg-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A lightweight, self-hosted streaming platform that broadcasts 24/7 Lo-Fi radio to YouTube Live with a beautiful web interface for complete control and monitoring.**

[🚀 Quick Start](#-quick-start) • [📖 Documentation](#-documentation) • [🎛️ Features](#️-features) • [🔧 Configuration](#-configuration) • [🐛 Troubleshooting](#-troubleshooting)

</div>

---

## 🌟 Overview

Transform your Ubuntu server into a professional 24/7 Lo-Fi streaming station! This platform combines MP4 video backgrounds with MP3 audio playlists, streams continuously to YouTube Live via RTMP, and provides a sleek web dashboard for complete control.

### ✨ What Makes This Special?

- **🎬 Video + Audio Mixing**: Seamlessly combines looping video backgrounds with audio playlists
- **🔄 Auto-Recovery**: Automatically reconnects when YouTube RTMP drops
- **🎛️ Web Dashboard**: Beautiful, responsive interface for complete stream control
- **📊 Real-time Monitoring**: Live stream statistics, logs, and performance metrics
- **⚙️ Highly Configurable**: Adjust bitrate, resolution, FPS, and audio settings on-the-fly
- **📝 Change Tracking**: Automatic changelog generation for all modifications
- **🔒 Self-Hosted**: Complete control over your streaming infrastructure

---

## 🎛️ Features

### 🎥 Stream Management
- **One-Click Control**: Start, stop, and restart streams instantly
- **Live Status**: Real-time stream status with visual indicators
- **Auto-Reconnection**: Handles YouTube RTMP disconnections gracefully
- **Process Monitoring**: FFmpeg process management with health checks

### 📁 Media Management
- **File Upload**: Drag-and-drop or click to upload video/audio files
- **Smart Selection**: Visual file browser with selection indicators
- **Video Looping**: Toggle video looping on/off
- **Playlist Management**: Create and manage audio playlists with sequential playback
- **Automatic Audio Selection**: Uses all available audio files if none are specifically selected
- **Sequential Playback**: Plays all audio files in sequence and loops the entire playlist
- **File Deletion**: Remove unwanted files with confirmation

### ⚙️ Stream Configuration
- **Quality Settings**: Adjust video bitrate (500-8000 kbps)
- **Resolution Control**: Support for 360p to 1080p streaming
- **Frame Rate**: 24, 30, or 60 FPS options
- **Audio Settings**: Bitrate and volume control
- **RTMP Configuration**: Custom RTMP URLs and stream keys

### 📊 Monitoring & Logging
- **Live Statistics**: Uptime, FPS, bitrate monitoring
- **Stream Logs**: Real-time FFmpeg output and system logs
- **Performance Metrics**: Track stream health and performance
- **Error Tracking**: Detailed error logging and reporting

---

## 🚀 Quick Start

### Prerequisites

- **Ubuntu 18.04+** (or similar Linux distribution)
- **Node.js 16+**
- **FFmpeg** (for video processing)
- **PM2** (for production deployment)
- **YouTube Channel** with live streaming enabled

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/lofi-streaming-platform.git
cd lofi-streaming-platform

# Make install script executable
chmod +x install.sh

# Run the automated installer
./install.sh
```

The installer will:
- ✅ Update system packages
- ✅ Install FFmpeg
- ✅ Install Node.js (if needed)
- ✅ Install PM2 globally
- ✅ Install project dependencies
- ✅ Create necessary directories
- ✅ Set up configuration files

### 2. Add Your Media Files

```bash
# Add video backgrounds (MP4 format recommended)
cp your-video.mp4 media/videos/

# Add audio tracks (MP3 format recommended)
cp your-audio.mp3 media/audio/
```

### 3. Configure Your Stream

1. **Start the application**:
   ```bash
   npm run dev
   ```

2. **Open the dashboard**: Navigate to `http://localhost:3000`

3. **Configure settings**:
   - Go to the **Settings** tab
   - Add your YouTube stream key
   - Adjust quality settings as needed

4. **Select media**:
   - Go to the **Media** tab
   - Select a video background
   - Choose audio files for your playlist
   - Enable video looping if desired

5. **Start streaming**:
   - Go to the **Control** tab
   - Click "Start Stream"
   - Monitor status in the Stream Monitor panel

### 4. Production Deployment

For 24/7 operation, use PM2:

```bash
# Start in production mode
npm run start:prod

# Monitor the application
npm run logs:prod

# Restart if needed
npm run restart:prod

# Stop the application
npm run stop:prod
```

---

## 📖 Documentation

### 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Dashboard │    │  Stream Engine  │    │   YouTube Live  │
│                 │    │                 │    │                 │
│  • Control UI   │◄──►│  • FFmpeg Proc  │───►│  • RTMP Server  │
│  • Media Mgmt   │    │  • Auto-restart │    │  • Live Stream  │
│  • Settings     │    │  • Monitoring   │    │                 │
│  • Logs         │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│  Configuration  │    │   Media Files   │
│                 │    │                 │
│  • settings.json│    │  • videos/      │
│  • media.json   │    │  • audio/       │
│  • CHANGELOG.md │    │  • playlists    │
└─────────────────┘    └─────────────────┘
```

### 📁 Project Structure

```
lofi-streaming-platform/
├── 📁 app/                     # Next.js app directory
│   ├── 📁 api/                 # API routes
│   │   ├── 📁 stream/          # Stream control endpoints
│   │   ├── 📁 media/           # Media management endpoints
│   │   └── 📁 settings/        # Configuration endpoints
│   ├── layout.tsx              # App layout
│   └── page.tsx                # Main dashboard page
├── 📁 components/              # React components
│   ├── stream-dashboard.tsx    # Main dashboard
│   ├── stream-control.tsx      # Stream controls
│   ├── media-selector.tsx      # Media management
│   ├── stream-settings.tsx     # Configuration
│   └── stream-monitor.tsx      # Monitoring panel
├── 📁 lib/                     # Core libraries
│   ├── stream-engine.ts        # FFmpeg integration
│   ├── media-manager.ts        # File management
│   ├── settings-manager.ts     # Configuration
│   └── changelog.ts            # Change tracking
├── 📁 media/                   # Media storage
│   ├── 📁 videos/              # Video backgrounds
│   └── 📁 audio/               # Audio tracks
├── 📁 config/                  # Configuration files
│   ├── settings.json           # Stream settings
│   └── media.json              # Media selection
├── 📁 logs/                    # Log files
│   └── stream.log              # Stream logs
├── 📁 scripts/                 # Utility scripts
│   └── setup.js                # Initial setup
├── CHANGELOG.md                # Change history
├── ecosystem.config.js         # PM2 configuration
├── install.sh                  # Installation script
└── README.md                   # This file
```

### 🔧 Configuration Files

#### `config/settings.json`
```json
{
  "rtmpUrl": "rtmp://a.rtmp.youtube.com/live2",
  "streamKey": "your-youtube-stream-key",
  "videoBitrate": 2500,
  "audioBitrate": 128,
  "resolution": "1280x720",
  "fps": 30,
  "audioVolume": 1.0
}
```

#### `config/media.json`
```json
{
  "video": "/path/to/selected/video.mp4",
  "audioPlaylist": [
    "/path/to/audio1.mp3",
    "/path/to/audio2.mp3"
  ],
  "videoLooping": true
}
```

#### `ecosystem.config.js` (PM2)
```javascript
module.exports = {
  apps: [{
    name: "lofi-stream",
    script: "npm",
    args: "start",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "production",
      PORT: 3000
    }
  }]
}
```

---

## 🎛️ Web Dashboard Guide

### 🎮 Control Tab
- **Stream Status**: Visual indicator (green = streaming, red = error, gray = idle)
- **Start/Stop**: One-click stream control
- **Restart**: Restart stream with current settings
- **Status Messages**: Real-time feedback on stream operations

### 📁 Media Tab
- **Video Section**:
  - Upload new video files
  - Select background video
  - Toggle video looping
  - Delete unwanted files
- **Audio Section**:
  - Upload audio tracks
  - Build playlists by selecting multiple files
  - Sequential playback of all selected audio files
  - Automatic selection of all available audio files if none selected
  - Remove files from playlist
  - Delete audio files

### ⚙️ Settings Tab
- **RTMP Configuration**: YouTube stream URL and key
- **Quality Settings**: Resolution, FPS, bitrates
- **Audio Controls**: Volume adjustment
- **Save Settings**: Persist configuration changes

### 📊 Monitor Panel
- **Live Stats**: Uptime, FPS, bitrate, reconnection info
- **Stream Logs**: Real-time FFmpeg output and system messages
- **Auto-refresh**: Updates every 5-10 seconds

---

## 🔧 Advanced Configuration

### 🎥 FFmpeg Command Structure

The platform generates FFmpeg commands like this:

```bash
ffmpeg \
  # Video Input (looped)
  -stream_loop -1 -re -i /path/to/video.mp4 \
  
  # Audio Input (playlist with sequential playback)
  -f concat -safe 0 -stream_loop -1 -i /path/to/audio_playlist.txt \
  
  # Stream Mapping
  -map 0:v -map 1:a \
  
  # Video Encoding
  -c:v libx264 -preset veryfast \
  -b:v 2500k -minrate 2500k -maxrate 2500k -bufsize 5000k \
  -vf scale=1280:720 -r 30 -g 60 -pix_fmt yuv420p \
  -tune zerolatency -profile:v main -level 4.1 \
  
  # Audio Encoding
  -c:a aac -b:a 128k -ar 44100 -af volume=1.0 -ac 2 \
  -async 1 \
  
  # Output Settings
  -f flv -flvflags no_duration_filesize \
  
  # Reconnection Settings
  -reconnect 1 -reconnect_streamed 1 -reconnect_delay_max 120 \
  
  # RTMP Destination
  rtmp://a.rtmp.youtube.com/live2/YOUR_STREAM_KEY
```

The audio playlist file is formatted for the FFmpeg concat demuxer to ensure all audio files play in sequence:

```
file '/path/to/audio1.mp3'
file '/path/to/audio2.mp3'
file '/path/to/audio3.mp3'
```

When the playlist reaches the end, it automatically loops back to the beginning.

### 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/stream/status` | Get current stream status and stats |
| `POST` | `/api/stream/start` | Start the stream |
| `POST` | `/api/stream/stop` | Stop the stream |
| `POST` | `/api/stream/restart` | Restart the stream |
| `GET` | `/api/stream/logs` | Get recent stream logs |
| `GET` | `/api/media/list` | List available media files |
| `POST` | `/api/media/save` | Save media selection |
| `POST` | `/api/media/upload` | Upload new media files |
| `DELETE` | `/api/media/delete` | Delete media files |
| `GET` | `/api/settings` | Get stream settings |
| `POST` | `/api/settings` | Save stream settings |

### 🎚️ Quality Presets

#### 🏆 High Quality (1080p)
```json
{
  "resolution": "1920x1080",
  "fps": 30,
  "videoBitrate": 4500,
  "audioBitrate": 192
}
```

#### ⚖️ Balanced (720p)
```json
{
  "resolution": "1280x720",
  "fps": 30,
  "videoBitrate": 2500,
  "audioBitrate": 128
}
```

#### 💾 Low Bandwidth (480p)
```json
{
  "resolution": "854x480",
  "fps": 24,
  "videoBitrate": 1200,
  "audioBitrate": 96
}
```

---

## 🐛 Troubleshooting

### 🚫 Stream Won't Start

**Problem**: Stream fails to start or immediately stops

**Solutions**:
1. **Check FFmpeg installation**:
   ```bash
   ffmpeg -version
   ```
2. **Verify media files are selected**:
   - Go to Media tab
   - Ensure video is selected
   - Ensure audio files are available (the system will automatically use all audio files if none are specifically selected)
3. **Check YouTube stream key**:
   - Go to Settings tab
   - Verify stream key is correct
   - Test with YouTube's stream health check
4. **Review logs**:
   - Check the Monitor panel for error messages
   - Look for file permission issues

### 🌐 Connection Issues

**Problem**: Stream disconnects frequently or fails to connect

**Solutions**:
1. **Test internet connection**:
   ```bash
   ping youtube.com
   speedtest-cli
   ```
2. **Check RTMP URL**:
   - Verify the RTMP endpoint is correct
   - Try alternative YouTube RTMP servers
3. **Adjust bitrate**:
   - Lower video bitrate if bandwidth is limited
   - Monitor connection stability
4. **Firewall settings**:
   ```bash
   sudo ufw allow 1935/tcp  # RTMP port
   ```

### 🖥️ Performance Issues

**Problem**: High CPU usage or stream quality issues

**Solutions**:
1. **Monitor system resources**:
   \`\`\`bash
   htop
   df -h
   \`\`\`
2. **Optimize FFmpeg settings**:
   - Use faster presets (`-preset ultrafast`)
   - Lower resolution or FPS
   - Reduce video bitrate
3. **Check disk space**:
   - Ensure sufficient space for logs
   - Clean up old log files if needed
4. **Hardware acceleration** (if available):
   ```bash
   # Check for hardware encoders
   ffmpeg -encoders | grep nvenc  # NVIDIA
   ffmpeg -encoders | grep vaapi  # Intel/AMD
   ```

### 📁 File Upload Issues

**Problem**: Cannot upload or files not appearing

**Solutions**:
1. **Check file permissions**:
   ```bash
   sudo chown -R $USER:$USER media/
   chmod -R 755 media/
   ```
2. **Verify file formats**:
   - Videos: MP4, WebM
   - Audio: MP3, WAV
3. **Check file size limits**:
   - Ensure files aren't too large
   - Check available disk space
4. **Browser issues**:
   - Try a different browser
   - Clear browser cache

### 🔧 Service Management

**Problem**: Application won't start or crashes

**Solutions**:
1. **Check PM2 status**:
   ```bash
   pm2 status
   pm2 logs lofi-stream
   ```
2. **Restart services**:
   ```bash
   pm2 restart lofi-stream
   # or
   npm run restart:prod
   ```
3. **Check port availability**:
   ```bash
   sudo netstat -tlnp | grep :3000
   ```
4. **Review system logs**:
   ```bash
   journalctl -u pm2-$USER -f
   ```

---

## 🔒 Security Considerations

### 🛡️ Network Security
- **Firewall**: Only open necessary ports (3000 for web interface)
- **HTTPS**: Use reverse proxy (nginx) with SSL certificates for production
- **Access Control**: Restrict web interface access to trusted networks

### 🔑 Stream Security
- **Stream Key Protection**: Never commit stream keys to version control
- **Environment Variables**: Use `.env` files for sensitive configuration
- **Regular Rotation**: Change stream keys periodically

### 📁 File Security
- **File Permissions**: Ensure proper file ownership and permissions
- **Upload Validation**: Validate file types and sizes
- **Storage Limits**: Implement disk usage monitoring

---

## 🚀 Performance Optimization

### 🎯 Stream Optimization
- **Bitrate Calculation**: `resolution_width × resolution_height × fps × 0.1`
- **Keyframe Interval**: Set to 2× FPS for optimal streaming
- **Buffer Size**: 3× video bitrate for stable streaming

### 💾 System Optimization
- **SSD Storage**: Use SSD for media files and logs
- **RAM**: Minimum 4GB, recommended 8GB+
- **CPU**: Multi-core processor for better encoding performance

### 🌐 Network Optimization
- **Upload Bandwidth**: Ensure 1.5× your total bitrate
- **Latency**: Use servers geographically close to YouTube
- **QoS**: Prioritize streaming traffic if possible

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### 🐛 Bug Reports
1. Check existing issues first
2. Use the bug report template
3. Include system information and logs
4. Provide steps to reproduce

### ✨ Feature Requests
1. Check the roadmap and existing requests
2. Use the feature request template
3. Explain the use case and benefits
4. Consider implementation complexity

### 💻 Development
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

### 📝 Documentation
- Fix typos and improve clarity
- Add examples and use cases
- Update API documentation
- Translate to other languages

---

## 📋 Roadmap

### 🎯 Short Term (v1.1)
- [ ] Stream overlays and branding
- [ ] Multiple platform streaming (Twitch, Facebook)
- [ ] Advanced audio processing (EQ, compression)
- [ ] Stream scheduling system

### 🚀 Medium Term (v1.2)
- [ ] Web-based media editor
- [ ] Analytics and viewer statistics
- [ ] Mobile app for remote control
- [ ] Cloud storage integration

### 🌟 Long Term (v2.0)
- [ ] AI-powered content generation
- [ ] Multi-language support
- [ ] Plugin system for extensions
- [ ] Enterprise features and scaling

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 🙏 Acknowledgments

- **FFmpeg Team** - For the amazing video processing capabilities
- **Next.js Team** - For the excellent React framework
- **shadcn/ui** - For the beautiful UI components
- **YouTube** - For providing the streaming platform
- **Lo-Fi Community** - For the inspiration and support

---

## 📞 Support

### 💬 Community Support
- **GitHub Issues**: [Report bugs and request features](https://github.com/yourusername/lofi-streaming-platform/issues)
- **Discussions**: [Community discussions and Q&A](https://github.com/yourusername/lofi-streaming-platform/discussions)

### 📚 Resources
- **Documentation**: This README and inline code comments
- **Examples**: Check the `examples/` directory for configuration samples
- **Video Tutorials**: Coming soon!

### 🆘 Professional Support
For commercial use or professional support, please contact [your-email@domain.com](mailto:your-email@domain.com).

---

<div align="center">

**⭐ Star this repository if you find it useful!**

Made with ❤️ for the Lo-Fi community

[🔝 Back to Top](#-24-7-lo-fi-streaming-platform)

</div>

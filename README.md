# 24/7 Lo-Fi Streaming Platform

A lightweight streaming platform for Ubuntu that streams 24/7 Lo-Fi radio to YouTube Live with a web interface for control and monitoring.

## Features

- 🎵 **24/7 Streaming**: Continuous streaming to YouTube Live via RTMP
- 🎬 **Video + Audio**: Combines MP4 video backgrounds with MP3 audio playlists
- 🎛️ **Web Interface**: Simple dashboard for stream control and monitoring
- ⚙️ **Configurable**: Adjustable bitrate, resolution, FPS, and audio volume
- 📊 **Monitoring**: Real-time stream status, logs, and statistics
- 🔄 **Auto-reconnect**: Automatic reconnection if YouTube RTMP drops
- 📝 **Changelog**: Track all changes with automatic changelog generation

## System Requirements

- Ubuntu 18.04+ (or similar Linux distribution)
- Node.js 16+
- FFmpeg
- PM2 (for production deployment)

## Quick Start

1. **Clone and Install**
   \`\`\`bash
   git clone <repository-url>
   cd lofi-streaming-platform
   chmod +x install.sh
   ./install.sh
   \`\`\`

2. **Add Media Files**
   - Place video files (.mp4) in `media/videos/`
   - Place audio files (.mp3) in `media/audio/`

3. **Configure Stream**
   - Start the application: `npm run dev`
   - Open http://localhost:3000
   - Go to Settings tab and add your YouTube stream key
   - Select video and audio files in Media tab

4. **Start Streaming**
   - Click "Start Stream" in the Control tab
   - Monitor status in the Stream Monitor panel

## Production Deployment

For 24/7 operation, use PM2:

\`\`\`bash
# Start in production mode
npm run start:prod

# Monitor logs
npm run logs:prod

# Restart stream
npm run restart:prod

# Stop stream
npm run stop:prod
\`\`\`

## Configuration

### Stream Settings
- **RTMP URL**: YouTube Live RTMP endpoint
- **Stream Key**: Your YouTube stream key
- **Resolution**: 1080p, 720p, 480p, or 360p
- **FPS**: 24, 30, or 60 frames per second
- **Video Bitrate**: 500-8000 kbps
- **Audio Bitrate**: 64-320 kbps
- **Audio Volume**: 0-200%

### File Structure
\`\`\`
lofi-streaming-platform/
├── media/
│   ├── videos/          # MP4 video files
│   └── audio/           # MP3 audio files
├── config/
│   ├── settings.json    # Stream configuration
│   └── media.json       # Media selection
├── logs/
│   └── stream.log       # Stream logs
└── CHANGELOG.md         # Human-readable changelog
\`\`\`

## FFmpeg Command

The platform generates FFmpeg commands like this:

\`\`\`bash
ffmpeg \
  -stream_loop -1 -re -i /path/to/video.mp4 \
  -f concat -safe 0 -i /path/to/audio_playlist.txt \
  -c:v libx264 -preset veryfast \
  -b:v 2500k -maxrate 3750k -bufsize 7500k \
  -vf scale=1280:720 -r 30 -g 60 -pix_fmt yuv420p \
  -c:a aac -b:a 128k -ar 44100 -af volume=1.0 \
  -f flv -flvflags no_duration_filesize \
  -reconnect 1 -reconnect_streamed 1 -reconnect_delay_max 120 \
  rtmp://a.rtmp.youtube.com/live2/YOUR_STREAM_KEY
\`\`\`

## API Endpoints

- `GET /api/stream/status` - Get stream status and stats
- `POST /api/stream/start` - Start streaming
- `POST /api/stream/stop` - Stop streaming
- `POST /api/stream/restart` - Restart streaming
- `GET /api/stream/logs` - Get stream logs
- `GET /api/media/list` - List available media files
- `POST /api/media/save` - Save media selection
- `POST /api/media/upload` - Upload media files
- `GET /api/settings` - Get stream settings
- `POST /api/settings` - Save stream settings

## Troubleshooting

### Stream Won't Start
- Check that FFmpeg is installed: `ffmpeg -version`
- Verify video and audio files are selected
- Ensure YouTube stream key is configured
- Check logs for detailed error messages

### Connection Issues
- Verify internet connection and bandwidth
- Check YouTube Live streaming status
- Ensure RTMP URL is correct
- Monitor logs for reconnection attempts

### Performance Issues
- Lower video bitrate or resolution
- Reduce FPS to 24 or 30
- Check system resources (CPU, memory)
- Ensure sufficient disk space for logs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add changelog entry
5. Submit a pull request

## License

MIT License - see LICENSE file for details

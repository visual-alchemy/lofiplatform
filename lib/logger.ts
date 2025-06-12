// Centralized logging system
class Logger {
  private logs: string[] = []
  private maxLogs = 100

  addLog(message: string) {
    const timestamp = new Date().toISOString()
    const logEntry = `[${timestamp}] ${message}`
    this.logs.push(logEntry)

    // Keep logs at a reasonable size
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    console.log(logEntry)
  }

  getLogs(): string[] {
    return [...this.logs]
  }

  clearLogs() {
    this.logs = []
  }
}

// Create a singleton instance
const logger = new Logger()

// Initialize with some default logs
logger.addLog("Stream engine initialized")
logger.addLog("Waiting for stream configuration")
logger.addLog("Ready to start streaming")

export default logger

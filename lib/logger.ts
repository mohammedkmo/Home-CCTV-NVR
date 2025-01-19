type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogMessage {
  level: LogLevel
  message: string
  timestamp: string
  data?: any
}

export class Logger {
  private static instance: Logger

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private formatMessage(level: LogLevel, message: string, data?: any): LogMessage {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
    }
  }

  public info(message: string, data?: any) {
    const log = this.formatMessage('info', message, data)
    console.log(JSON.stringify(log))
  }

  public warn(message: string, data?: any) {
    const log = this.formatMessage('warn', message, data)
    console.warn(JSON.stringify(log))
  }

  public error(message: string, error?: any) {
    const log = this.formatMessage('error', message, error)
    console.error(JSON.stringify(log))
  }

  public debug(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      const log = this.formatMessage('debug', message, data)
      console.debug(JSON.stringify(log))
    }
  }
} 
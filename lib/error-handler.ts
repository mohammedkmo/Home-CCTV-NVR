import { Logger } from './logger'

const logger = Logger.getInstance()

export class StreamError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: any
  ) {
    super(message)
    this.name = 'StreamError'
  }
}

export function handleStreamError(error: unknown, cameraId: string): never {
  if (error instanceof StreamError) {
    logger.error(`Stream error for camera ${cameraId}:`, {
      code: error.code,
      message: error.message,
      details: error.details,
    })
    throw error
  }

  if (error instanceof Error) {
    logger.error(`Unexpected error for camera ${cameraId}:`, {
      name: error.name,
      message: error.message,
      stack: error.stack,
    })
    throw new StreamError('Unexpected streaming error', 'UNKNOWN_ERROR', error)
  }

  logger.error(`Unknown error type for camera ${cameraId}:`, error)
  throw new StreamError('Unknown error type', 'UNKNOWN_ERROR', error)
} 
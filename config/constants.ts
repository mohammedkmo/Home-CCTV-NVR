export const STREAM_SETTINGS = {
  BUFFER_SIZE: 1024 * 1024 * 2, // 2MB
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  CLEANUP_TIMEOUT: 300, // 300ms
} as const

export const STREAM_ERRORS = {
  CODEC_UNSUPPORTED: 'Codec not supported',
  NO_RESPONSE: 'No response from camera',
  BUFFER_FULL: 'Buffer full',
  CONNECTION_LOST: 'Connection lost',
} as const 
export interface StreamStatus {
  [key: number]: string
}

export interface MuteState {
  [key: number]: boolean
}

export interface VideoRefs {
  [key: number]: HTMLVideoElement | null
}

export interface HLSInstances {
  [key: number]: any
}

export interface AuthConfig {
  username: string
  password: string
}

export interface StreamResponse {
  stream: ReadableStream
  cleanup: () => void
} 
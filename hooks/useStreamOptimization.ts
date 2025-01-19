import { useCallback, useEffect, useRef } from 'react'
import { STREAM_SETTINGS } from '@/config/constants'

export function useStreamOptimization(videoRef: React.RefObject<HTMLVideoElement>) {
  const bufferCheckInterval = useRef<NodeJS.Timeout | undefined>(undefined)
  const lastPlaybackTime = useRef<number>(0)
  
  const checkBufferHealth = useCallback(() => {
    if (!videoRef.current) return
    
    const video = videoRef.current
    const currentTime = video.currentTime
    
    // Check if playback is stuck
    if (currentTime === lastPlaybackTime.current) {
      console.warn('Playback appears to be stuck, attempting recovery...')
      video.currentTime = currentTime + 0.1
    }
    
    lastPlaybackTime.current = currentTime
    
    // Check buffer size
    if (video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(0)
      const bufferSize = bufferedEnd - currentTime
      
      if (bufferSize > STREAM_SETTINGS.BUFFER_SIZE) {
        console.warn('Buffer too large, trimming...')
        // Seek forward to reduce buffer
        video.currentTime = bufferedEnd - (STREAM_SETTINGS.BUFFER_SIZE / 2)
      }
    }
  }, [videoRef])
  
  useEffect(() => {
    bufferCheckInterval.current = setInterval(checkBufferHealth, 1000)
    
    return () => {
      if (bufferCheckInterval.current) {
        clearInterval(bufferCheckInterval.current)
      }
    }
  }, [checkBufferHealth])
  
  return {
    checkBufferHealth
  }
} 
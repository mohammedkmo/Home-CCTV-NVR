'use client'

import { useEffect, useRef } from 'react'
import { StreamControls } from './StreamControls'
import { StreamStatus } from './StreamStatus'
import { siteConfig } from '@/config/site'
import { initializeStream } from '@/lib/stream'

interface VideoPlayerProps {
  cameraId: number
  isMuted: boolean
  onMuteToggle: (muted: boolean) => void
  status: string
}

export function VideoPlayer({ cameraId, isMuted, onMuteToggle, status }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    let mounted = true
    let cleanup: (() => void) | undefined

    async function setupStream() {
      if (!videoRef.current || !mounted) return
      
      try {
        if (videoRef.current.src) {
          videoRef.current.pause()
          videoRef.current.src = ''
          videoRef.current.load()
        }

        await initializeStream(videoRef.current, cameraId)
      } catch (error) {
        console.error('Failed to initialize stream:', error)
      }
    }

    setupStream()

    return () => {
      mounted = false
      if (cleanup) cleanup()
      if (videoRef.current) {
        const video = videoRef.current
        video.pause()
        if (video.srcObject) {
          const tracks = (video.srcObject as MediaStream).getTracks()
          tracks.forEach(track => track.stop())
        }
        video.src = ''
        video.load()
      }
    }
  }, [cameraId])

  return (
    <div className="relative aspect-video rounded-[20px] overflow-hidden border border-white/15 group-hover:border-white/60 transition-all duration-300">
      <video 
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        playsInline
        muted={isMuted}
        controls={false}
      />
      <StreamStatus 
        cameraName={siteConfig.cameras[cameraId as keyof typeof siteConfig.cameras]}
        status={status} 
      />
      <StreamControls 
        videoRef={videoRef}
        isMuted={isMuted}
        onMuteToggle={onMuteToggle}
      />
    </div>
  )
}
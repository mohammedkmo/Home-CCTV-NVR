'use client'

import { Volume2, VolumeX } from 'lucide-react'
import { RefObject } from 'react'

interface StreamControlsProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  isMuted: boolean
  onMuteToggle: (muted: boolean) => void
}

export function StreamControls({ videoRef, isMuted, onMuteToggle }: StreamControlsProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <button
        onClick={() => onMuteToggle(!isMuted)}
        className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-white" />
        )}
      </button>
    </div>
  )
} 
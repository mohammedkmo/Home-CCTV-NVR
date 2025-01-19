'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { StreamStatus, MuteState } from '@/types'

interface StreamContextType {
  streamStatus: StreamStatus
  isMuted: MuteState
  updateStreamStatus: (cameraId: number, status: string) => void
  toggleMute: (cameraId: number) => void
}

const StreamContext = createContext<StreamContextType | undefined>(undefined)

export function StreamProvider({ children }: { children: React.ReactNode }) {
  const [streamStatus, setStreamStatus] = useState<StreamStatus>({})
  const [isMuted, setIsMuted] = useState<MuteState>({1: true, 2: true, 3: true})
  
  const updateStreamStatus = useCallback((cameraId: number, status: string) => {
    setStreamStatus(prev => ({ ...prev, [cameraId]: status }))
  }, [])
  
  const toggleMute = useCallback((cameraId: number) => {
    setIsMuted(prev => ({ ...prev, [cameraId]: !prev[cameraId] }))
  }, [])
  
  return (
    <StreamContext.Provider value={{
      streamStatus,
      isMuted,
      updateStreamStatus,
      toggleMute
    }}>
      {children}
    </StreamContext.Provider>
  )
}

export function useStream() {
  const context = useContext(StreamContext)
  if (context === undefined) {
    throw new Error('useStream must be used within a StreamProvider')
  }
  return context
} 
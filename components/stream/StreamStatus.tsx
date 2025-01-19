interface StreamStatusProps {
  cameraName: string
  status: string
}

export function StreamStatus({ cameraName, status }: StreamStatusProps) {
  return (
    <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium">{cameraName}</h3>
        <span className="text-xs text-white/80">{status}</span>
      </div>
    </div>
  )
} 
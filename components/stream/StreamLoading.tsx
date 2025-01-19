export function StreamLoading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="mt-2 text-sm text-white/80">جاري تحميل البث...</p>
      </div>
    </div>
  )
} 
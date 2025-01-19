export async function initializeStream(videoElement: HTMLVideoElement, cameraId: number) {
  if (!videoElement) return

  const mediaSource = new MediaSource()
  videoElement.src = URL.createObjectURL(mediaSource)

  return new Promise((resolve, reject) => {
    mediaSource.addEventListener('sourceopen', async () => {
      try {
        const mimeCodec = 'video/mp4; codecs="avc1.42E01E,mp4a.40.2"'
        if (!MediaSource.isTypeSupported(mimeCodec)) {
          throw new Error('Codec not supported')
        }

        const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec)
        sourceBuffer.mode = 'segments'
        
        const response = await fetch(`/api/stream?camera=${cameraId}`)
        if (!response.body) throw new Error('No response body')

        const reader = response.body.getReader()
        
        const processChunk = async () => {
          try {
            const { value, done } = await reader.read()
            if (done) {
              mediaSource.endOfStream()
              return
            }

            if (sourceBuffer.updating || mediaSource.readyState !== 'open') {
              await new Promise(resolve => {
                sourceBuffer.addEventListener('updateend', resolve, { once: true })
              })
            }

            sourceBuffer.appendBuffer(value)
            await videoElement.play()
            processChunk()
          } catch (error: any) {
            if (error.name === 'QuotaExceededError') {
              const removeEnd = sourceBuffer.buffered.end(0) - 10
              if (removeEnd > 0) {
                sourceBuffer.remove(0, removeEnd)
              }
              processChunk()
            } else {
              reject(error)
            }
          }
        }

        await processChunk()
        resolve(true)
      } catch (error) {
        reject(error)
      }
    }, { once: true })
  })
}
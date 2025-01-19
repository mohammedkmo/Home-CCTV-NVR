import { spawn } from 'child_process';
import { NextRequest } from 'next/server';

const getCameraIP = (cameraId: string): string => {
  const cameraIPs: Record<string, string> = {
    '1': process.env.CAMERAS_IP?.split(',')[0] || '0.0.0.0',
    '2': process.env.CAMERAS_IP?.split(',')[1] || '0.0.0.0', 
    '3': process.env.CAMERAS_IP?.split(',')[2] || '0.0.0.0'
  };
  return cameraIPs[cameraId] || '192.168.0.10';
};

async function streamCamera(cameraId: string): Promise<{ stream: ReadableStream; cleanup: () => void }> {
  const cameraIP = getCameraIP(cameraId);
  const rtspUrl = `rtsp://${process.env.CAMS_USERNAME}:${process.env.CAMS_PASSWORD}@${cameraIP}:554/1/1?transmode=unicast&profile=vam`;

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  let isWriterClosed = false;
  let ffmpeg: any = null;

  const cleanup = () => {
    if (ffmpeg) {
      ffmpeg.kill('SIGTERM');
    }
    if (!isWriterClosed) {
      isWriterClosed = true;
      writer.close().catch(() => {});
    }
  };

  ffmpeg = spawn('ffmpeg', [
    '-loglevel', 'error',              // Only show errors, not warnings
    '-rtsp_transport', 'tcp',
    '-i', rtspUrl,
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-tune', 'zerolatency',
    '-profile:v', 'high',              // Changed from baseline to high
    '-level', '4.1',                   // Changed from 3.0 to 4.1 to support higher resolution
    '-maxrate', '4M',                  // Increased from 2M
    '-bufsize', '8M',                  // Increased from 4M
    '-g', '30',
    '-keyint_min', '30',
    '-sc_threshold', '0',
    '-vf', 'scale=-2:720',            // Scale video to 720p
    '-c:a', 'aac',
    '-ac', '2',
    '-ar', '44100',
    '-b:a', '128k',                   // Added explicit audio bitrate
    '-async', '1',                    // Audio sync method
    '-vsync', '1',                    // Video sync method
    '-f', 'mp4',
    '-movflags', 'frag_keyframe+empty_moov+default_base_moof+faststart',
    'pipe:1'
  ]);

  ffmpeg.stdout.on('data', async (chunk: any) => {
    if (!isWriterClosed) {
      try {
        await writer.write(chunk);
      } catch (error) {
        cleanup();
      }
    }
  });

  ffmpeg.stderr.on('data', (data: any) => {
    const errorMsg = data.toString();
    if (!errorMsg.includes('Queue input is backward in time') && 
        !errorMsg.includes('Non-monotonic DTS')) {
      console.error(`FFmpeg error for camera ${cameraId}:`, errorMsg);
    }
  });

  ffmpeg.on('error', cleanup);
  ffmpeg.on('close', cleanup);

  return { stream: readable, cleanup };
}

export async function GET(request: NextRequest) {
  const cameraId = request.nextUrl.searchParams.get('camera');
  if (!cameraId) {
    return new Response('Camera ID is required', { status: 400 });
  }

  try {
    const { stream, cleanup } = await streamCamera(cameraId);
    
    request.signal.addEventListener('abort', cleanup);
    
    return new Response(stream, {
      headers: {
        'Content-Type': 'video/mp4',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Connection': 'keep-alive',
        'Transfer-Encoding': 'chunked',
        'X-Accel-Buffering': 'no',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error: any) {
    console.error('Error streaming camera:', error);
    return new Response(`Failed to stream camera: ${error.message}`, { status: 500 });
  }
}

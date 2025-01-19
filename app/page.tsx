'use client';

import { useEffect, useState, useRef } from "react";
import Hls from 'hls.js';
import { Volume2, VolumeX, PictureInPicture2, Maximize2, Camera, Activity, Dot } from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';

export default function Home() {
  const [streamStatus, setStreamStatus] = useState<Record<string, string>>({});
  const [isMuted, setIsMuted] = useState<Record<number, boolean>>({1: true, 2: true, 3: true});
  const videoRefs = useRef<Record<number, HTMLVideoElement>>({});
  const hlsInstances = useRef<Record<number, Hls>>({});

  const cameraNames = {
    1: "الشارع",
    2: "الباب الامامي", 
    3: "السطح"
  };

  const camerasBlocks = [
    {
      id: 1,
      video: (
        <video 
        ref={el => { if (el) videoRefs.current[1] = el; }}
        className="w-full h-full object-cover" 
        autoPlay 
        muted={isMuted[1]}
        playsInline
        controls={false}
        />
      )
    },
    {
      id: 2,
      video: (
        <video 
        ref={el => { if (el) videoRefs.current[2] = el; }}
        className="w-full h-full object-cover" 
        autoPlay 
        muted={isMuted[2]}
        playsInline
        controls={false}
      />
    )},
    {
      id: 3,
      video: (
        <video 
        ref={el => { if (el) videoRefs.current[3] = el; }}
        className="w-full h-full object-cover" 
        autoPlay 
        muted={isMuted[3]}
        playsInline
        controls={false}
      />
    )}
  ]

  const initializeStream = (videoElement: HTMLVideoElement, cameraId: number) => {
    if (videoElement) {
      try {
        const mediaSource = new MediaSource();
        videoElement.src = URL.createObjectURL(mediaSource);

        mediaSource.addEventListener('sourceopen', async () => {
          try {
            const mimeCodec = 'video/mp4; codecs="avc1.42E01E,mp4a.40.2"';
            if (!MediaSource.isTypeSupported(mimeCodec)) {
              throw new Error('Codec not supported');
            }

            const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
            sourceBuffer.mode = 'segments';
            
            // Add error recovery
            sourceBuffer.addEventListener('error', async (e) => {
              console.warn(`Buffer error for camera ${cameraId}:`, e);
              if (!sourceBuffer.updating) {
                try {
                  sourceBuffer.abort();
                  // Clear buffer and try to recover
                  if (sourceBuffer.buffered.length > 0) {
                    sourceBuffer.remove(0, sourceBuffer.buffered.end(0));
                  }
                } catch (err) {
                  console.error('Recovery failed:', err);
                }
              }
            });

            const response = await fetch(`/api/stream?camera=${cameraId}`);
            if (!response.body) throw new Error('No response body');

            const reader = response.body.getReader();
            
            while (true) {
              const { value, done } = await reader.read();
              if (done) break;
              
              if (sourceBuffer.updating || mediaSource.readyState !== 'open') {
                await new Promise(resolve => {
                  sourceBuffer.addEventListener('updateend', resolve, { once: true });
                });
              }
              
              try {
                sourceBuffer.appendBuffer(value);
              } catch (error: any) {
                if (error.name === 'QuotaExceededError') {
                  const removeEnd = sourceBuffer.buffered.end(0) - 10;
                  if (removeEnd > 0) {
                    sourceBuffer.remove(0, removeEnd);
                  }
                }
              }
            }
          } catch (error) {
            console.error(`Stream error for camera ${cameraId}:`, error);
            setStreamStatus(prev => ({
              ...prev,
              [cameraId]: 'خطأ في البث'
            }));
          }
        });

        videoElement.play().catch(console.error);
      } catch (error) {
        console.error(`Error initializing camera ${cameraId}:`, error);
        setStreamStatus(prev => ({
          ...prev,
          [cameraId]: 'خطأ في التهيئة'
        }));
      }
    }
  };

  useEffect(() => {
    const initializeStreams = async () => {
      const cameras = [1, 2, 3];
      
      for (const camera of cameras) {
        try {
          setStreamStatus(prev => ({
            ...prev,
            [camera]: 'جاري الاتصال...'
          }));
          
          if (videoRefs.current[camera]) {
            await initializeStream(videoRefs.current[camera], camera);
            setStreamStatus(prev => ({
              ...prev,
              [camera]: 'متصل'
            }));
          }
        } catch (error: any) {
          setStreamStatus(prev => ({
            ...prev,
            [camera]: `خطأ: ${error.message}`
          }));
        }
      }
    };

    // Add a delay before initialization
    const initTimer = setTimeout(() => {
      initializeStreams();
    }, 500);

    return () => {
      clearTimeout(initTimer);
      
      // Enhanced cleanup function
      Object.values(videoRefs.current).forEach(async (video) => {
        if (video) {
          try {
            // First pause and remove src
            video.pause();
            video.src = '';
            video.load();
            
            // Remove all event listeners
            video.onplay = null;
            video.onpause = null;
            video.onended = null;
            video.onerror = null;
            
            // Clear the source
            if (video.srcObject) {
              const tracks = (video.srcObject as MediaStream).getTracks();
              tracks.forEach(track => track.stop());
              video.srcObject = null;
            }
          } catch (error) {
            console.error('Error during cleanup:', error);
          }
        }
      });

      // Clear refs and states
      videoRefs.current = {};
      hlsInstances.current = {};
      setStreamStatus({});
      setIsMuted({1: true, 2: true, 3: true});
    };
  }, []);

  return (
    <main className="min-h-screen bg-black p-4 sm:p-8" dir="rtl">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-10 gap-4">
          <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            كاميرات المراقبة <hr className="w-[2px] h-6 sm:h-8 bg-white/20" /> <span className="text-emerald-300">المنزل</span>
          </h1>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none flex items-center gap-2 bg-white/5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-[20px] backdrop-blur-lg border border-white/10 relative">
              <Dot className="h-3 sm:h-4 w-3 sm:w-4 text-emerald-400 animate-pulse relative z-10" />
              <div className="absolute w-3 sm:w-4 h-3 sm:h-4 translate-x-[6px] sm:translate-x-[8px] blur-lg bg-emerald-500"></div>
              <span className="text-white/90 text-[10px] sm:text-xs font-medium -ms-1 sm:-ms-2">جميع الأنظمة نشطة</span>
            </div>
            <LogoutButton />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {[1, 2, 3].map((camera) => (
            <div key={camera} className="group relative backdrop-blur-lg transition-all duration-300">
              <div className="relative aspect-video rounded-[15px] sm:rounded-[20px] overflow-hidden border border-white/15 group-hover:border-white/60 transition-all duration-300">
                <video 
                  ref={el => { if (el) videoRefs.current[camera] = el; }}
                  className="w-full h-full object-cover" 
                  autoPlay 
                  muted={isMuted[camera]}
                  playsInline
                  controls={false}
                />
                
                {/* Status overlay */}
                <div className="absolute inset-0">
                  {/* Top bar */}
                  <div className="absolute top-0 left-0 right-0 px-3 sm:px-4 py-2 flex items-center gap-2 sm:gap-3 bg-gradient-to-b from-black/40 to-transparent">
                    <h2 className="font-medium text-white text-[10px] sm:text-xs tracking-wide">
                      {cameraNames[camera as keyof typeof cameraNames]}
                    </h2>
                    <div className={`mr-auto px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium backdrop-blur-sm ${
                      streamStatus[camera] === 'متصل'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : streamStatus[camera]?.includes('خطأ')
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    }`}>
                      {streamStatus[camera] || 'جاري الاتصال...'}
                    </div>
                  </div>

                  {/* Custom Controls - Bottom Bar */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 to-transparent opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Mute/Unmute Button */}
                      <button
                        onClick={() => setIsMuted(prev => ({
                          ...prev,
                          [camera]: !prev[camera]
                        }))}
                        className="text-white hover:text-emerald-400 transition-colors"
                      >
                        {isMuted[camera] ? (
                          <VolumeX className="h-4 sm:h-5 w-4 sm:w-5" />
                        ) : (
                          <Volume2 className="h-4 sm:h-5 w-4 sm:w-5" />
                        )}
                      </button>

                      {/* Picture in Picture */}
                      <button
                        onClick={() => {
                          if (document.pictureInPictureElement) {
                            document.exitPictureInPicture();
                          } else if (document.pictureInPictureEnabled && videoRefs.current[camera]) {
                            videoRefs.current[camera].requestPictureInPicture();
                          }
                        }}
                        className="text-white hover:text-emerald-400 transition-colors"
                      >
                        <PictureInPicture2 className="h-4 sm:h-5 w-4 sm:w-5" />
                      </button>

                      {/* Fullscreen */}
                      <button
                        onClick={() => {
                          const videoElement = videoRefs.current[camera];
                          if (!videoElement) return;
                          
                          if (document.fullscreenElement) {
                            document.exitFullscreen();
                          } else {
                            videoElement.requestFullscreen();
                          }
                        }}
                        className="text-white hover:text-emerald-400 transition-colors"
                      >
                        <Maximize2 className="h-4 sm:h-5 w-4 sm:w-5" />
                      </button>

                      {/* Stream Status Indicator */}
                      <div className="mr-auto flex items-center gap-2">
                        <Activity className="h-3 sm:h-4 w-3 sm:w-4 text-emerald-400" />
                        <span className="text-white/90 text-[10px] sm:text-xs">مباشر</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

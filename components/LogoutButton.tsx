'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      // Get all video elements
      const mediaStreams = document.getElementsByTagName('video');
      
      // Create an array of cleanup promises
      const cleanupPromises = Array.from(mediaStreams).map(async (video) => {
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
          
          // Wait for cleanup to complete
          await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
          console.error('Error cleaning up video:', error);
        }
      });

      // Wait for all cleanup operations to complete
      await Promise.all(cleanupPromises);
      
      // Additional wait before signOut
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Perform logout
      await signOut({ callbackUrl: '/login' });
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback logout
      window.location.href = '/login';
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 px-4 py-2.5 rounded-[20px] backdrop-blur-lg border border-red-500/20 transition-all duration-300"
    >
      <LogOut className="h-4 w-4 text-red-400" />
      <span className="text-red-400 text-[10px] sm:text-xs font-medium">تسجيل خروج</span>
    </button>
  );
}
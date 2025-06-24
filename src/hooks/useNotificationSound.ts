
import { useRef, useCallback } from 'react';

export const useNotificationSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const initializeAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/sounds/pop.mp3');
      audioRef.current.volume = 0.6;
      audioRef.current.preload = 'auto';
      
      audioRef.current.onerror = () => {
        console.log('Custom sound not found, using system notification');
      };
    }
  }, []);

  const playNotification = useCallback(() => {
    initializeAudio();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => {
        console.log('Audio play failed:', e);
        // Fallback to visual notification only
      });
    }
  }, [initializeAudio]);

  return { playNotification, initializeAudio };
};


import { useEffect } from 'react';
import { initScrollAnimations } from '@/utils/gsapAnimations';

export const useScrollAnimations = () => {
  useEffect(() => {
    // Initialize animations after component mount
    const timer = setTimeout(() => {
      initScrollAnimations();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);
};

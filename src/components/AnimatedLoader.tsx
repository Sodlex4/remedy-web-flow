
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface AnimatedLoaderProps {
  onComplete: () => void;
}

const AnimatedLoader = ({ onComplete }: AnimatedLoaderProps) => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const leafRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(onComplete, 500);
      }
    });

    // Initial state
    gsap.set([leafRef.current, textRef.current], { opacity: 0, scale: 0.5 });

    // Animation sequence
    tl.to(leafRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "power2.out"
    })
    .to(leafRef.current, {
      scale: 1.1,
      duration: 0.8,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    }, "-=0.5")
    .to(textRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.5")
    .to([leafRef.current, textRef.current], {
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      ease: "power2.in"
    }, "+=1")
    .to(loaderRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut"
    });

    // Pulsing glow effect
    gsap.to(leafRef.current, {
      filter: "drop-shadow(0 0 20px #4caf50) drop-shadow(0 0 40px #4caf5080)",
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: "power2.inOut"
    });

  }, [onComplete]);

  return (
    <div 
      ref={loaderRef}
      className="fixed inset-0 bg-background z-50 flex items-center justify-center"
    >
      <div className="text-center">
        <svg
          ref={leafRef}
          width="120"
          height="120"
          viewBox="0 0 100 100"
          className="mb-6"
        >
          <path
            d="M50 10 C35 20, 25 35, 30 50 C35 65, 45 75, 50 85 C55 75, 65 65, 70 50 C75 35, 65 20, 50 10 Z"
            fill="#4caf50"
            stroke="#2e7d32"
            strokeWidth="2"
          />
          <path
            d="M50 10 C40 25, 35 40, 40 55 C45 70, 50 80, 50 85"
            fill="none"
            stroke="#2e7d32"
            strokeWidth="1.5"
          />
          <path
            d="M50 10 C60 25, 65 40, 60 55 C55 70, 50 80, 50 85"
            fill="none"
            stroke="#2e7d32"
            strokeWidth="1.5"
          />
        </svg>
        
        <div ref={textRef} className="text-primary text-xl font-semibold">
          Don't Panic, It's Organic
        </div>
      </div>
    </div>
  );
};

export default AnimatedLoader;

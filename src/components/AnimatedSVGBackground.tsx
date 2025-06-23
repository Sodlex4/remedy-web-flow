
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const AnimatedSVGBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const leaves = containerRef.current?.querySelectorAll('.floating-leaf');
    
    if (leaves) {
      leaves.forEach((leaf, index) => {
        // Random initial positions
        gsap.set(leaf, {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          rotation: Math.random() * 360,
          opacity: 0.1 + Math.random() * 0.2
        });

        // Floating animation
        gsap.to(leaf, {
          y: "-=50",
          x: `+=${20 - Math.random() * 40}`,
          rotation: "+=180",
          duration: 8 + Math.random() * 4,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: index * 0.5
        });
      });
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <svg
          key={index}
          className="floating-leaf absolute"
          width="40"
          height="40"
          viewBox="0 0 100 100"
        >
          <path
            d="M50 10 C35 20, 25 35, 30 50 C35 65, 45 75, 50 85 C55 75, 65 65, 70 50 C75 35, 65 20, 50 10 Z"
            fill="none"
            stroke="#4caf50"
            strokeWidth="1"
            opacity="0.3"
          />
        </svg>
      ))}
    </div>
  );
};

export default AnimatedSVGBackground;

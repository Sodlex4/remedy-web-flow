
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Typed from 'typed.js';

interface AnimatedLoaderProps {
  onComplete: () => void;
}

const AnimatedLoader = ({ onComplete }: AnimatedLoaderProps) => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Initialize Typed.js for the text
    let typed: Typed | null = null;
    
    if (textRef.current) {
      typed = new Typed(textRef.current, {
        strings: ["Don't Panic, It's Organic"],
        typeSpeed: 80,
        showCursor: true,
        cursorChar: '|',
        startDelay: 1000,
        onComplete: () => {
          // Hide cursor after typing is complete
          if (textRef.current) {
            const cursor = textRef.current.querySelector('.typed-cursor');
            if (cursor) {
              gsap.to(cursor, { opacity: 0, duration: 0.5 });
            }
          }
        }
      });
    }

    // GSAP Animation Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(onComplete, 300);
      }
    });

    // Initial state
    gsap.set([imageRef.current, textRef.current], { 
      scale: 0.3, 
      opacity: 0 
    });

    // Animation sequence
    tl.to(imageRef.current, {
      scale: 1.2,
      opacity: 1,
      duration: 2,
      ease: "power2.out"
    })
    .to(imageRef.current, {
      scale: 1.1,
      duration: 1.5,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    }, "-=1")
    .to(textRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out"
    }, "-=1.5")
    .to([imageRef.current, textRef.current], {
      opacity: 0,
      scale: 0.8,
      duration: 1,
      ease: "power2.in"
    }, "+=0.5")
    .to(loaderRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut"
    });

    // Continuous glow effect
    gsap.to(imageRef.current, {
      filter: "drop-shadow(0 0 30px #4caf50) drop-shadow(0 0 60px #4caf5060)",
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: "power2.inOut"
    });

    return () => {
      if (typed) {
        typed.destroy();
      }
    };
  }, [onComplete]);

  const handleImageError = () => {
    console.log("Image failed to load, using fallback");
    // If image fails to load, still run animations on a fallback element
    if (imageRef.current) {
      imageRef.current.style.display = 'none';
    }
  };

  return (
    <div 
      ref={loaderRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ 
        background: '#0d0d0d',
        width: '100vw',
        height: '100vh'
      }}
    >
      <img
        ref={imageRef}
        src="/weed.png"
        alt="Nature's Remedy"
        className="w-36 h-36 md:w-40 md:h-40"
        style={{
          filter: 'drop-shadow(0 0 20px #4caf50)'
        }}
        onError={handleImageError}
        onLoad={() => console.log("Image loaded successfully")}
      />
      
      <p 
        ref={textRef}
        className="mt-6 text-primary text-lg md:text-xl font-semibold font-['Poppins',sans-serif] text-center"
      >
      </p>
    </div>
  );
};

export default AnimatedLoader;

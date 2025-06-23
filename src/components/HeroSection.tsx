
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Typed from 'typed.js';
import { gsap } from 'gsap';

const HeroSection = () => {
  const typedRef = useRef<HTMLSpanElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const floatingElementsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typedRef.current) {
      const typed = new Typed(typedRef.current, {
        strings: ["Don't Panic, It's Organic"],
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000,
        startDelay: 500,
        loop: true,
        showCursor: true,
        cursorChar: '|',
      });

      return () => {
        typed.destroy();
      };
    }
  }, []);

  useEffect(() => {
    // Animate hero image on mount
    if (heroImageRef.current) {
      gsap.fromTo(heroImageRef.current,
        { scale: 0.8, opacity: 0, rotation: -5 },
        { scale: 1, opacity: 1, rotation: 0, duration: 1.5, ease: "power2.out", delay: 0.5 }
      );
    }

    // Animate floating elements
    if (floatingElementsRef.current) {
      const elements = floatingElementsRef.current.children;
      Array.from(elements).forEach((element, index) => {
        gsap.to(element, {
          y: -20,
          duration: 2 + index * 0.5,
          yoyo: true,
          repeat: -1,
          ease: "power2.inOut",
          delay: index * 0.3
        });
      });
    }
  }, []);

  const scrollToShop = () => {
    const element = document.querySelector('#shop');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center pt-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              <span ref={typedRef} className="text-primary"></span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
              Welcome to Nature's Remedy, your trusted licensed cannabis dispensary in Murang'a. 
              We're committed to providing premium, organic cannabis products with the highest standards of quality and compliance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={scrollToShop}
                className="bg-primary hover:bg-secondary text-primary-foreground px-8 py-3 text-lg gsap-zoom"
              >
                Explore Our Strains
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 text-lg gsap-fade"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Content - Enhanced Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative" ref={heroImageRef}>
              <div className="w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center overflow-hidden backdrop-blur-sm">
                <div className="w-72 h-72 md:w-88 md:h-88 bg-card rounded-full flex items-center justify-center border border-primary/30 relative">
                  <div className="text-center text-primary relative z-10">
                    <div className="w-32 h-32 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-4xl">🌿</span>
                    </div>
                    <p className="text-sm">Premium Cannabis</p>
                  </div>
                  
                  {/* Animated glow effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 animate-pulse"></div>
                </div>
              </div>
              
              {/* Enhanced floating elements */}
              <div ref={floatingElementsRef}>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-secondary rounded-full"></div>
                <div className="absolute top-1/2 -left-8 w-4 h-4 bg-primary/60 rounded-full"></div>
                <div className="absolute bottom-1/4 -right-8 w-5 h-5 bg-secondary/60 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

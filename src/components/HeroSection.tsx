
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useBusiness } from '@/context/BusinessContext';

const HeroSection = () => {
  const { businessName, county } = useBusiness();
  const typedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Simple typing effect without external library
    if (typedRef.current) {
      const text = "Don't Panic, It's Organic";
      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          typedRef.current!.innerHTML += text.charAt(i);
          i++;
          setTimeout(typeWriter, 100);
        }
      };
      typeWriter();
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
              Welcome to {businessName}, your trusted licensed cannabis dispensary in {county}. 
              We're committed to providing premium, organic cannabis products with the highest standards of quality and compliance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={scrollToShop}
                className="bg-primary hover:bg-secondary text-primary-foreground px-8 py-3 text-lg"
              >
                Explore Our Strains
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 text-lg"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Content - Simple Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-80 h-80 md:w-96 md:h-96 max-w-full bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center overflow-hidden backdrop-blur-sm">
                <div className="w-72 h-72 md:w-88 md:h-88 bg-card rounded-full flex items-center justify-center border border-primary/30 relative">
                  <div className="text-center text-primary relative z-10">
                    <div className="w-32 h-32 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-4xl">🌿</span>
                    </div>
                    <p className="text-sm">Premium Cannabis</p>
                  </div>
                  
                  {/* Simple glow effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;


import { useEffect, useRef } from 'react';
import Typed from 'typed.js';

const TypedFooter = () => {
  const typedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typedRef.current) {
      const typed = new Typed(typedRef.current, {
        strings: [
          'UI/UX Developer',
          'Frontend Developer',
          'React Developer',
          'Web Designer',
          'Full-Stack Developer'
        ],
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|',
      });

      return () => typed.destroy();
    }
  }, []);

  return (
    <div className="bg-background border-t border-border py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-muted-foreground">
          Made with <span className="text-red-500">❤️</span> in Kenya{' '}
          <span className="text-lg">🇰🇪</span> by{' '}
          <span className="text-primary font-semibold">Stephen Odongo</span> —{' '}
          <span ref={typedRef} className="text-primary font-medium"></span>
        </p>
      </div>
    </div>
  );
};

export default TypedFooter;

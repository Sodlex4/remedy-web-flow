
import { useEffect, useState } from 'react';

const StarryBackground = () => {
  const [stars, setStars] = useState<Array<{
    id: number;
    size: number;
    left: number;
    top: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 50; i++) {
        newStars.push({
          id: i,
          size: Math.random() * 3 + 1,
          left: Math.random() * 100,
          top: Math.random() * 100,
          delay: Math.random() * 6,
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.left}%`,
            top: `${star.top}%`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default StarryBackground;


import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export const initScrollAnimations = () => {
  // Fade in animations
  gsap.utils.toArray('.gsap-fade').forEach((element: any) => {
    gsap.fromTo(element, 
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Zoom in animations
  gsap.utils.toArray('.gsap-zoom').forEach((element: any) => {
    gsap.fromTo(element,
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Slide up animations
  gsap.utils.toArray('.gsap-slide-up').forEach((element: any) => {
    gsap.fromTo(element,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Rotate animations
  gsap.utils.toArray('.gsap-rotate').forEach((element: any) => {
    gsap.fromTo(element,
      { rotation: -10, opacity: 0 },
      {
        rotation: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });
};

export const createFloatingAnimation = (element: Element) => {
  gsap.to(element, {
    y: -10,
    duration: 2,
    yoyo: true,
    repeat: -1,
    ease: "power2.inOut"
  });
};

export const createPulseAnimation = (element: Element) => {
  gsap.to(element, {
    scale: 1.05,
    duration: 1.5,
    yoyo: true,
    repeat: -1,
    ease: "power2.inOut"
  });
};

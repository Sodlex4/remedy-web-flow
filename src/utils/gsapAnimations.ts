
// Simple scroll animations without GSAP
export const initScrollAnimations = () => {
  // Use Intersection Observer for scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
      }
    });
  });

  // Observe all animation elements
  document.querySelectorAll('.gsap-fade, .gsap-zoom, .gsap-slide-up, .gsap-rotate').forEach((el) => {
    observer.observe(el);
  });
};

export const createFloatingAnimation = (element: Element) => {
  // Simple CSS animation
  element.classList.add('animate-bounce');
};

export const createPulseAnimation = (element: Element) => {
  // Simple CSS animation
  element.classList.add('animate-pulse');
};

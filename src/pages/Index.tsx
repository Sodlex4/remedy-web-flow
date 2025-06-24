
import { useState, useEffect } from 'react';
import AgeVerificationModal from '@/components/AgeVerificationModal';
import StarryBackground from '@/components/StarryBackground';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ProductShowcase from '@/components/ProductShowcase';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import FeedbackModal from '@/components/FeedbackModal';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import TypedFooter from '@/components/TypedFooter';
import Footer from '@/components/Footer';
import AnimatedSVGBackground from '@/components/AnimatedSVGBackground';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';

const Index = () => {
  const [showAgeModal, setShowAgeModal] = useState(false);

  useScrollAnimations();

  useEffect(() => {
    // Check if user has already verified their age
    const hasVerified = localStorage.getItem('ageVerified');
    if (!hasVerified) {
      setShowAgeModal(true);
    }
  }, []);

  const handleAgeVerification = () => {
    localStorage.setItem('ageVerified', 'true');
    setShowAgeModal(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      <StarryBackground />
      <AnimatedSVGBackground />
      
      <AgeVerificationModal 
        isOpen={showAgeModal} 
        onClose={handleAgeVerification} 
      />
      
      <div className="gsap-fade">
        <Navigation />
      </div>
      
      <div className="gsap-slide-up">
        <HeroSection />
      </div>
      
      <div className="gsap-zoom">
        <ProductShowcase />
      </div>
      
      <div className="gsap-fade">
        <AboutSection />
      </div>
      
      <div className="gsap-slide-up">
        <ContactSection />
      </div>
      
      {/* Feedback Modal */}
      <FeedbackModal />
      
      {/* WhatsApp Widget */}
      <WhatsAppWidget />
      
      {/* Typed Footer */}
      <div className="gsap-fade">
        <TypedFooter />
      </div>
      
      {/* Main Footer */}
      <div className="gsap-fade">
        <Footer />
      </div>
    </div>
  );
};

export default Index;

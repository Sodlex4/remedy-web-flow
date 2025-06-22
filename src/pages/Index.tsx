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

const Index = () => {
  const [showAgeModal, setShowAgeModal] = useState(false);

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
      
      <AgeVerificationModal 
        isOpen={showAgeModal} 
        onClose={handleAgeVerification} 
      />
      
      <Navigation />
      <HeroSection />
      <ProductShowcase />
      <AboutSection />
      <ContactSection />
      
      {/* Feedback Modal */}
      <FeedbackModal />
      
      {/* WhatsApp Widget */}
      <WhatsAppWidget />
      
      {/* Typed Footer */}
      <TypedFooter />
      
      {/* Main Footer */}
      <Footer />
    </div>
  );
};

export default Index;

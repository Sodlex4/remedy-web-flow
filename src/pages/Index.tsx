import { useState, useEffect } from 'react';
import AgeVerificationModal from '@/components/AgeVerificationModal';
import StarryBackground from '@/components/StarryBackground';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import CountySelector from '@/components/CountySelector';
import PeddlerList from '@/components/PeddlerList';
import ProductShowcase from '@/components/ProductShowcase';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import FeedbackModal from '@/components/FeedbackModal';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import Footer from '@/components/Footer';
import AnimatedSVGBackground from '@/components/AnimatedSVGBackground';
import LocationPermissionModal from '@/components/LocationPermissionModal';
import NearbySellers from '@/components/NearbySellers';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';
import { useLocation } from '@/context/LocationContext';

const Index = () => {
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const { selectedCounty, locationPhase, nearbySellers } = useLocation();

  useScrollAnimations();

  useEffect(() => {
    const hasVerified = localStorage.getItem('ageVerified');
    if (!hasVerified) {
      setShowAgeModal(true);
    }
  }, []);

  useEffect(() => {
    if (locationPhase === 'idle' || locationPhase === 'awaiting-permission') {
      setShowLocationModal(true);
    }
    if (locationPhase === 'located' || locationPhase === 'denied') {
      setShowLocationModal(false);
    }
  }, [locationPhase]);

  const handleAgeVerification = () => {
    localStorage.setItem('ageVerified', 'true');
    setShowAgeModal(false);
  };

  const handleCloseLocationModal = () => {
    setShowLocationModal(false);
  };

  const handleManualFallback = () => {
    setShowLocationModal(false);
  };

  const showLocationFallback = locationPhase === 'denied' || locationPhase === 'error';
  const showAutoLocatedContent = locationPhase === 'located' && nearbySellers.length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      <StarryBackground />
      <AnimatedSVGBackground />

      <AgeVerificationModal isOpen={showAgeModal} onClose={handleAgeVerification} />

      <LocationPermissionModal
        isOpen={showLocationModal}
        onClose={handleCloseLocationModal}
        onManualFallback={handleManualFallback}
      />

      {showAutoLocatedContent && (
        <NearbySellers />
      )}

      <div className="gsap-fade">
        <Navigation />
      </div>

      <div className="gsap-slide-up">
        <HeroSection />
      </div>

      {showLocationFallback && (
        <>
          <CountySelector />
          {selectedCounty && (
            <div className="gsap-fade">
              <PeddlerList />
            </div>
          )}
        </>
      )}

      {locationPhase === 'idle' && !showLocationModal && (
        <>
          <CountySelector />
          {selectedCounty && (
            <div className="gsap-fade">
              <PeddlerList />
            </div>
          )}
        </>
      )}

      <div id="products" className="gsap-zoom">
        <ProductShowcase />
      </div>

      <div className="gsap-fade">
        <AboutSection />
      </div>

      <div className="gsap-slide-up">
        <ContactSection />
      </div>

      <FeedbackModal />
      <WhatsAppWidget />

      <div className="gsap-fade">
        <Footer />
      </div>
    </div>
  );
};

export default Index;

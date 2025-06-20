
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface AgeVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AgeVerificationModal = ({ isOpen, onClose }: AgeVerificationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-2xl font-bold mb-4 text-primary">Age Verification Required</h2>
        
        <p className="text-muted-foreground mb-6">
          You must be 21 years or older to enter this website. This site contains information about cannabis products.
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={onClose}
            className="w-full bg-primary hover:bg-secondary text-primary-foreground"
          >
            I am 21 or older - Enter Site
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.location.href = 'https://google.com'}
            className="w-full border-border hover:bg-muted"
          >
            I am under 21 - Exit
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-4">
          By entering this site, you acknowledge that you are of legal age and agree to our terms.
        </p>
      </div>
    </div>
  );
};

export default AgeVerificationModal;

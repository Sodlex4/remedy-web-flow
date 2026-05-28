import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, LocateFixed, Loader2, AlertCircle, X } from 'lucide-react';
import { useLocation } from '@/context/LocationContext';

interface LocationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onManualFallback: () => void;
}

const LocationPermissionModal = ({ isOpen, onClose, onManualFallback }: LocationPermissionModalProps) => {
  const { locationPhase, locationError, detectLocation } = useLocation();
  const [dismissed, setDismissed] = useState(false);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    if (locationPhase === 'located') {
      onClose();
    }
  }, [locationPhase, onClose]);

  useEffect(() => {
    if (locationPhase === 'detecting') {
      const timer = setTimeout(() => {
        setHasTimedOut(true);
      }, 15000);
      return () => clearTimeout(timer);
    }
    setHasTimedOut(false);
  }, [locationPhase]);

  if (!isOpen || dismissed) return null;

  const handleDetect = () => {
    detectLocation();
  };

  const handleManual = () => {
    setDismissed(true);
    onManualFallback();
  };

  const handleSkip = () => {
    setDismissed(true);
    onClose();
  };

  const isDetecting = locationPhase === 'detecting';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 border-border shadow-2xl">
        {isDetecting ? (
          <>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 size={32} className="text-primary animate-spin" />
              </div>
              <CardTitle className="text-xl">Finding sellers near you</CardTitle>
              <CardDescription className="mt-2">
                Detecting your location to find nearby dispensaries...
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center gap-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              {hasTimedOut && (
                <p className="text-xs text-muted-foreground text-center">
                  Taking longer than expected. You can{' '}
                  <button onClick={handleManual} className="text-primary underline">
                    select your county manually
                  </button>
                  .
                </p>
              )}
            </CardContent>
          </>
        ) : locationPhase === 'error' ? (
          <>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle size={32} className="text-destructive" />
              </div>
              <CardTitle className="text-xl">Location error</CardTitle>
              <CardDescription className="mt-2">
                {locationError || 'Could not determine your location.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleDetect} variant="default" className="w-full">
                <LocateFixed size={16} className="mr-2" />
                Try again
              </Button>
              <Button onClick={handleManual} variant="outline" className="w-full">
                <MapPin size={16} className="mr-2" />
                Select county manually
              </Button>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin size={32} className="text-primary" />
              </div>
              <CardTitle className="text-xl">Discover sellers near you</CardTitle>
              <CardDescription className="mt-2">
                Allow location access to find licensed dispensaries in your area.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleDetect} variant="default" className="w-full h-12 text-base">
                <LocateFixed size={18} className="mr-2" />
                Use my current location
              </Button>
              <Button onClick={handleManual} variant="outline" className="w-full">
                <MapPin size={16} className="mr-2" />
                Enter county manually
              </Button>
              <div className="text-center pt-2">
                <Button variant="link" size="sm" onClick={handleSkip} className="text-muted-foreground">
                  <X size={14} className="mr-1" />
                  Skip — browse all products
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default LocationPermissionModal;

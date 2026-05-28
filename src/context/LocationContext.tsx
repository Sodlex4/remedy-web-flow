import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useNearbySellers } from '@/hooks/useNearbySellers';
import { useRealtimeSellers } from '@/hooks/useRealtimeSellers';
import type {
  NearbySeller,
  GeoLocation,
  PermissionState,
  LocationPhase,
} from '@/types/seller';

interface SellerInfo {
  id: string;
  businessName: string;
  whatsappNumber: string;
  county: string;
  bio: string;
}

interface LocationContextValue {
  selectedCounty: string;
  setSelectedCounty: (county: string) => void;
  selectedSellerId: string;
  setSelectedSellerId: (id: string) => void;
  selectedSeller: SellerInfo | null;
  counties: string[];
  sellers: SellerInfo[];
  loading: boolean;
  clearLocation: () => void;

  geoLocation: GeoLocation | null;
  permissionState: PermissionState;
  locationPhase: LocationPhase;
  locationError: string | null;
  nearbySellers: NearbySeller[];
  nearbyLoading: boolean;
  nearbyExpanded: boolean;
  detectLocation: () => void;
  resetLocation: () => void;
}

const LocationContext = createContext<LocationContextValue>({
  selectedCounty: '',
  setSelectedCounty: () => {},
  selectedSellerId: '',
  setSelectedSellerId: () => {},
  selectedSeller: null,
  counties: [],
  sellers: [],
  loading: true,
  clearLocation: () => {},

  geoLocation: null,
  permissionState: 'prompt',
  locationPhase: 'idle',
  locationError: null,
  nearbySellers: [],
  nearbyLoading: false,
  nearbyExpanded: false,
  detectLocation: () => {},
  resetLocation: () => {},
});

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedCounty, setSelectedCounty] = useState(() => localStorage.getItem('selectedCounty') || '');
  const [selectedSellerId, setSelectedSellerId] = useState(() => localStorage.getItem('selectedSellerId') || '');
  const [counties, setCounties] = useState<string[]>([]);
  const [sellers, setSellers] = useState<SellerInfo[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<SellerInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    location: geoLocation,
    permissionState,
    phase: locationPhase,
    error: locationError,
    detectLocation,
    resetLocation: resetGeo,
  } = useGeolocation();

  const {
    data: nearbyData,
    isLoading: nearbyLoading,
  } = useNearbySellers(
    geoLocation?.latitude ?? null,
    geoLocation?.longitude ?? null
  );

  const nearbyExpanded = nearbyData?.expanded ?? false;

  const [liveSellers, setLiveSellers] = useState<NearbySeller[]>([]);

  useEffect(() => {
    const data = nearbyData?.sellers ?? [];
    setLiveSellers((prev) => {
      if (prev.length === 0 && data.length === 0) return prev;
      return data;
    });
  }, [nearbyData]);

  const nearbySellers = useMemo(() => liveSellers, [liveSellers]);

  const handleSellerUpdate = useCallback((update: { id: string; is_online: boolean }) => {
    setLiveSellers((prev) =>
      prev.map((s) =>
        s.id === update.id ? { ...s, is_online: update.is_online } : s
      )
    );
  }, []);

  useRealtimeSellers(liveSellers, handleSellerUpdate);

  const displaySellers = useMemo(() => {
    return [...liveSellers].sort((a, b) => {
      if (a.is_online !== b.is_online) return a.is_online ? -1 : 1;
      return a.distance_km - b.distance_km;
    });
  }, [liveSellers]);

  useEffect(() => {
    supabase
      .from('sellers')
      .select('county')
      .not('county', 'eq', '')
      .then(({ data, error }) => {
        if (error) {
          console.error('Failed to load counties:', error);
          return;
        }
        if (data) {
          const unique = [...new Set(data.map(p => p.county).filter(Boolean))].sort() as string[];
          setCounties(unique);
        }
      });
  }, []);

  useEffect(() => {
    if (!selectedCounty) {
      setSellers([]);
      setSelectedSeller(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    supabase
      .from('sellers')
      .select('id, business_name, whatsapp_number, county, bio')
      .eq('county', selectedCounty)
      .not('business_name', 'eq', '')
      .then(({ data, error }) => {
        if (error) {
          console.error('Failed to load sellers:', error);
          setSellers([]);
          setLoading(false);
          return;
        }
        if (data) {
          const mapped: SellerInfo[] = data.map(p => ({
            id: p.id,
            businessName: p.business_name || 'Unknown',
            whatsappNumber: p.whatsapp_number || '254700000000',
            county: p.county || selectedCounty,
            bio: p.bio || '',
          }));
          setSellers(mapped);
        }
        setLoading(false);
      });
  }, [selectedCounty]);

  useEffect(() => {
    if (selectedSellerId && sellers.length > 0) {
      const found = sellers.find(p => p.id === selectedSellerId);
      setSelectedSeller(found || null);
    } else {
      setSelectedSeller(null);
    }
  }, [selectedSellerId, sellers]);

  useEffect(() => {
    if (sellers.length === 1 && !selectedSellerId) {
      setSelectedSellerId(sellers[0].id);
    }
  }, [sellers, selectedSellerId, setSelectedSellerId]);

  useEffect(() => {
    localStorage.setItem('selectedCounty', selectedCounty);
  }, [selectedCounty]);

  useEffect(() => {
    localStorage.setItem('selectedSellerId', selectedSellerId);
  }, [selectedSellerId]);

  const clearLocation = useCallback(() => {
    setSelectedCounty('');
    setSelectedSellerId('');
    localStorage.removeItem('selectedCounty');
    localStorage.removeItem('selectedSellerId');
  }, []);

  const resetLocation = useCallback(() => {
    resetGeo();
    clearLocation();
  }, [resetGeo, clearLocation]);

  return (
    <LocationContext.Provider
      value={{
        selectedCounty, setSelectedCounty,
        selectedSellerId, setSelectedSellerId,
        selectedSeller,
        counties, sellers, loading,
        clearLocation,

        geoLocation,
        permissionState,
        locationPhase,
        locationError,
        nearbySellers: displaySellers,
        nearbyLoading,
        nearbyExpanded,
        detectLocation,
        resetLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface PeddlerInfo {
  id: string;
  businessName: string;
  whatsappNumber: string;
  county: string;
  bio: string;
}

interface LocationContextValue {
  selectedCounty: string;
  setSelectedCounty: (county: string) => void;
  selectedPeddlerId: string;
  setSelectedPeddlerId: (id: string) => void;
  selectedPeddler: PeddlerInfo | null;
  counties: string[];
  peddlers: PeddlerInfo[];
  loading: boolean;
  clearLocation: () => void;
}

const LocationContext = createContext<LocationContextValue>({
  selectedCounty: '',
  setSelectedCounty: () => {},
  selectedPeddlerId: '',
  setSelectedPeddlerId: () => {},
  selectedPeddler: null,
  counties: [],
  peddlers: [],
  loading: true,
  clearLocation: () => {},
});

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedCounty, setSelectedCounty] = useState(() => localStorage.getItem('selectedCounty') || '');
  const [selectedPeddlerId, setSelectedPeddlerId] = useState(() => localStorage.getItem('selectedPeddlerId') || '');
  const [counties, setCounties] = useState<string[]>([]);
  const [peddlers, setPeddlers] = useState<PeddlerInfo[]>([]);
  const [selectedPeddler, setSelectedPeddler] = useState<PeddlerInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Load available counties (from profiles with non-empty county)
  useEffect(() => {
    supabase
      .from('profiles')
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

  // Load peddlers in selected county
  useEffect(() => {
    if (!selectedCounty) {
      setPeddlers([]);
      setSelectedPeddler(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    supabase
      .from('profiles')
      .select('id, business_name, whatsapp_number, county, bio')
      .eq('county', selectedCounty)
      .not('business_name', 'eq', '')
      .then(({ data, error }) => {
        if (error) {
          console.error('Failed to load peddlers:', error);
          setPeddlers([]);
          setLoading(false);
          return;
        }
        if (data) {
          const mapped: PeddlerInfo[] = data.map(p => ({
            id: p.id,
            businessName: p.business_name || 'Unknown',
            whatsappNumber: p.whatsapp_number || '254700000000',
            county: p.county || selectedCounty,
            bio: p.bio || '',
          }));
          setPeddlers(mapped);
        }
        setLoading(false);
      });
  }, [selectedCounty]);

  // Track the selected peddler object
  useEffect(() => {
    if (selectedPeddlerId && peddlers.length > 0) {
      const found = peddlers.find(p => p.id === selectedPeddlerId);
      setSelectedPeddler(found || null);
    } else {
      setSelectedPeddler(null);
    }
  }, [selectedPeddlerId, peddlers]);

  // Auto-select first peddler if only one
  useEffect(() => {
    if (peddlers.length === 1 && !selectedPeddlerId) {
      setSelectedPeddlerId(peddlers[0].id);
    }
  }, [peddlers, selectedPeddlerId, setSelectedPeddlerId]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('selectedCounty', selectedCounty);
  }, [selectedCounty]);

  useEffect(() => {
    localStorage.setItem('selectedPeddlerId', selectedPeddlerId);
  }, [selectedPeddlerId]);

  const clearLocation = useCallback(() => {
    setSelectedCounty('');
    setSelectedPeddlerId('');
    localStorage.removeItem('selectedCounty');
    localStorage.removeItem('selectedPeddlerId');
  }, []);

  return (
    <LocationContext.Provider value={{
      selectedCounty, setSelectedCounty,
      selectedPeddlerId, setSelectedPeddlerId,
      selectedPeddler,
      counties, peddlers, loading,
      clearLocation,
    }}>
      {children}
    </LocationContext.Provider>
  );
};

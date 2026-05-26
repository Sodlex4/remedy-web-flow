import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface BusinessInfo {
  businessName: string;
  whatsappNumber: string;
  county: string;
  bio: string;
  email: string;
  address: string;
  licenseNumber: string;
  loading: boolean;
}

const defaultBusiness: BusinessInfo = {
  businessName: "Nature's Remedy",
  whatsappNumber: '254700000000',
  county: 'Murang\'a County',
  bio: 'Your trusted licensed cannabis dispensary',
  email: 'info@naturesremedy.co.ke',
  address: '123 Main Street',
  licenseNumber: '[Your License Number]',
  loading: true,
};

const BusinessContext = createContext<BusinessInfo>(defaultBusiness);

export const useBusiness = () => useContext(BusinessContext);

export const BusinessProvider = ({ children }: { children: React.ReactNode }) => {
  const [info, setInfo] = useState<BusinessInfo>(defaultBusiness);

  const fetchBusiness = useCallback(async () => {
    const { data } = await supabase
      .from('profiles')
      .select('business_name, whatsapp_number, county, bio, name')
      .eq('role', 'admin')
      .limit(1)
      .maybeSingle();

    if (data) {
      setInfo({
        businessName: data.business_name || defaultBusiness.businessName,
        whatsappNumber: data.whatsapp_number || defaultBusiness.whatsappNumber,
        county: data.county || defaultBusiness.county,
        bio: data.bio || defaultBusiness.bio,
        email: defaultBusiness.email,
        address: defaultBusiness.address,
        licenseNumber: defaultBusiness.licenseNumber,
        loading: false,
      });
    } else {
      setInfo(prev => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    fetchBusiness();
  }, [fetchBusiness]);

  return (
    <BusinessContext.Provider value={info}>
      {children}
    </BusinessContext.Provider>
  );
};

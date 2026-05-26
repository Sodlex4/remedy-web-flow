import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface ContentSettings {
  tagline: string;
  hero_welcome: string;
  hero_description: string;
  about_story: string;
  about_features: { title: string; description: string }[];
  about_compliance_text: string;
  address: string;
  store_hours: string;
  footer_mission: string;
  legal_disclaimer: string;
  admin_welcome: string;
  [key: string]: unknown;
}

interface BusinessInfo {
  businessName: string;
  whatsappNumber: string;
  county: string;
  bio: string;
  email: string;
  address: string;
  licenseNumber: string;
  loading: boolean;
  settings: ContentSettings;
}

const DEFAULT_SETTINGS: ContentSettings = {
  tagline: "Don't Panic, It's Organic",
  hero_welcome: "Welcome to {businessName}, your trusted licensed cannabis dispensary in {county}.",
  hero_description: "We're committed to providing premium, organic cannabis products with the highest standards of quality and compliance.",
  about_story: "{businessName} was founded on the belief that everyone deserves access to high-quality, natural cannabis products in a safe, welcoming environment. We're more than just a dispensary — we're your partners in wellness and advocates for responsible cannabis use.",
  about_features: [
    { title: 'Licensed & Compliant', description: 'Fully licensed cannabis dispensary operating in full compliance with local regulations.' },
    { title: 'Organic & Natural', description: 'Premium organic cannabis products sourced from trusted growers committed to sustainability.' },
    { title: 'Quality Assured', description: 'Every product is rigorously tested for potency, purity, and safety before reaching our shelves.' },
    { title: 'Expert Guidance', description: 'Our knowledgeable staff provides personalized recommendations for your wellness journey.' },
  ],
  about_compliance_text: "As a licensed cannabis dispensary, we take our responsibility seriously. We operate under strict compliance with all local and state regulations, ensuring every transaction is legal, documented, and conducted with the highest standards of professionalism.",
  address: '123 Main Street',
  store_hours: 'Monday - Friday: 9:00 AM - 8:00 PM\nSaturday: 10:00 AM - 6:00 PM\nSunday: 11:00 AM - 5:00 PM',
  footer_mission: 'Your trusted licensed cannabis dispensary in {county}, committed to quality, compliance, and responsible cannabis education.',
  legal_disclaimer: 'All cannabis products are for medical or recreational use only where permitted by law. Cannabis has not been analyzed or approved by the FDA. You must be 21 years of age or older to purchase cannabis products. Please consume responsibly. Keep out of reach of children and pets. Do not operate vehicles or machinery after use. This website is for informational purposes only and does not constitute an e-commerce platform — no online sales are conducted here.',
  admin_welcome: 'Welcome back, {name} 👑',
};

const defaultBusiness: BusinessInfo = {
  businessName: "Nature's Remedy",
  whatsappNumber: '254700000000',
  county: "Murang'a County",
  bio: 'Your trusted licensed cannabis dispensary',
  email: 'info@naturesremedy.co.ke',
  address: '123 Main Street',
  licenseNumber: '[Your License Number]',
  loading: true,
  settings: DEFAULT_SETTINGS,
};

interface BusinessContextValue extends BusinessInfo {
  content: (key: string, vars?: Record<string, string>) => string;
}

const BusinessContext = createContext<BusinessContextValue>({
  ...defaultBusiness,
  content: () => '',
});

export const useBusiness = () => useContext(BusinessContext);

function interpolate(text: string, vars: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`);
}

export const BusinessProvider = ({ children }: { children: React.ReactNode }) => {
  const [info, setInfo] = useState<BusinessInfo>(defaultBusiness);

  const fetchBusiness = useCallback(async () => {
    const { data } = await supabase
      .from('profiles')
      .select('business_name, whatsapp_number, county, bio, name, settings')
      .eq('role', 'admin')
      .limit(1)
      .maybeSingle();

    if (data) {
      const savedSettings = data.settings as Record<string, unknown> | null;
      const settings: ContentSettings = {
        ...DEFAULT_SETTINGS,
        ...(savedSettings || {}),
        about_features: Array.isArray(savedSettings?.about_features)
          ? savedSettings.about_features as { title: string; description: string }[]
          : DEFAULT_SETTINGS.about_features,
      };

      setInfo({
        businessName: data.business_name || defaultBusiness.businessName,
        whatsappNumber: data.whatsapp_number || defaultBusiness.whatsappNumber,
        county: data.county || defaultBusiness.county,
        bio: data.bio || defaultBusiness.bio,
        email: defaultBusiness.email,
        address: settings.address || defaultBusiness.address,
        licenseNumber: defaultBusiness.licenseNumber,
        loading: false,
        settings,
      });
    } else {
      setInfo(prev => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    fetchBusiness();
  }, [fetchBusiness]);

  const content = useCallback((key: string, vars?: Record<string, string>): string => {
    const value = info.settings[key as keyof ContentSettings];
    if (typeof value !== 'string') return '';
    const defaults = { businessName: info.businessName, county: info.county, ...vars };
    return interpolate(value, defaults);
  }, [info.settings, info.businessName, info.county]);

  return (
    <BusinessContext.Provider value={{ ...info, content }}>
      {children}
    </BusinessContext.Provider>
  );
};

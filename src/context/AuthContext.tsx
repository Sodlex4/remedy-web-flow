import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextValue {
  user: User | null;
  role: 'admin' | 'assistant' | 'viewer';
  sellerId: string;
  loading: boolean;
  businessName: string;
  whatsappNumber: string;
  county: string;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  role: 'viewer',
  sellerId: '',
  loading: true,
  businessName: '',
  whatsappNumber: '',
  county: '',
  signIn: async () => null,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'admin' | 'assistant' | 'viewer'>('viewer');
  const [sellerId, setSellerId] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [county, setCounty] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, seller_id')
      .eq('id', userId)
      .single();

    if (profile) {
      const r = (profile.role || 'viewer') as 'admin' | 'assistant' | 'viewer';
      setRole(r);
      const sid = profile.seller_id || '';
      setSellerId(sid);

      if (sid) {
        const { data: seller } = await supabase
          .from('sellers')
          .select('business_name, whatsapp_number, county')
          .eq('id', sid)
          .maybeSingle();

        if (seller) {
          setBusinessName(seller.business_name || '');
          setWhatsappNumber(seller.whatsapp_number || '');
          setCounty(seller.county || '');
          return;
        }
      }
      setBusinessName('');
      setWhatsappNumber('');
      setCounty('');
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) fetchProfile(u.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) fetchProfile(u.id);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signIn = useCallback(async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error?.message ?? null;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setRole('viewer');
    setSellerId('');
    setBusinessName('');
    setWhatsappNumber('');
    setCounty('');
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, sellerId, loading, businessName, whatsappNumber, county, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

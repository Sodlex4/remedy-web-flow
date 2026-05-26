import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextValue {
  user: User | null;
  role: 'admin' | 'assistant' | 'viewer';
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
  const [businessName, setBusinessName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [county, setCounty] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('role, business_name, whatsapp_number, county')
      .eq('id', userId)
      .single();
    if (data) {
      setRole((data.role || 'viewer') as 'admin' | 'assistant' | 'viewer');
      setBusinessName(data.business_name || '');
      setWhatsappNumber(data.whatsapp_number || '');
      setCounty(data.county || '');
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
    setBusinessName('');
    setWhatsappNumber('');
    setCounty('');
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, businessName, whatsappNumber, county, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

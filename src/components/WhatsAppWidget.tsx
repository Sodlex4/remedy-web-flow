import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, X, Leaf } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useBusiness } from '@/context/BusinessContext';
import { useLocation } from '@/context/LocationContext';

const WhatsAppWidget = () => {
  const { businessName: defaultName, whatsappNumber: defaultPhone } = useBusiness();
  const { selectedSeller } = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [selectedStrain, setSelectedStrain] = useState<string>('');
  const [showStrainSelector, setShowStrainSelector] = useState(false);
  const [strainNames, setStrainNames] = useState<string[]>([]);

  const businessName = selectedSeller?.businessName || defaultName;
  const whatsappNumber = selectedSeller?.whatsappNumber || defaultPhone;

  useEffect(() => {
    setIsSearchPage(window.location.pathname === '/search' || window.location.pathname.startsWith('/admin'));
  }, []);

  useEffect(() => {
    const query = supabase
      .from('strains')
      .select('name')
      .eq('available', true)
      .order('name');

    if (selectedSeller?.id) {
      query.eq('seller_id', selectedSeller.id);
    }

    query.then(({ data, error }) => {
      if (error) {
        console.error('Failed to load strain names:', error);
        return;
      }
      if (data) setStrainNames(data.map(s => s.name));
    });
  }, [selectedSeller?.id]);

  const handleWhatsAppClick = (customMessage?: string) => {
    const baseMessage = customMessage || `Hello ${businessName} 🌿 — I'd like to request a pickup${selectedStrain ? ` for ${selectedStrain}` : ''}. Please assist with discreet delivery.`;
    const message = encodeURIComponent(baseMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    setIsExpanded(false);
  };

  const handleStrainSelection = () => {
    if (selectedStrain) {
      handleWhatsAppClick(`Hello ${businessName} 🌿 — I'd like to request a pickup for ${selectedStrain}. Please assist with discreet delivery and let me know your current pricing.`);
    } else {
      handleWhatsAppClick();
    }
  };

  if (isSearchPage) return null;

  return (
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+24px)] right-6 z-50">
      {!isExpanded && (
        <div className="absolute bottom-16 right-0 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium animate-bounce mb-2 shadow-lg">
          Chat with Us! 💬
          <div className="absolute bottom-0 right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-primary transform translate-y-full"></div>
        </div>
      )}

      {isExpanded && (
        <div className="mb-4 bg-card dark:bg-card border border-border dark:border-border rounded-lg p-4 shadow-lg max-w-[calc(100vw-48px)] sm:max-w-sm animate-scale-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground dark:text-foreground">{businessName} 🌿</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsExpanded(false)}><X size={14} /></Button>
          </div>
          
          <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-3">
            Start your pickup via WhatsApp — discreet & fast delivery to your location.
          </p>

          <div className="mb-3">
            <Button variant="outline" size="sm" onClick={() => setShowStrainSelector(!showStrainSelector)} className="w-full justify-between">
              <div className="flex items-center"><Leaf size={16} className="mr-2 text-primary" />Select Your Strain</div>
              <span className="text-xs">{showStrainSelector ? '▲' : '▼'}</span>
            </Button>
          </div>

          {showStrainSelector && (
            <div className="mb-3 animate-fade-in">
              <Select value={selectedStrain} onValueChange={setSelectedStrain}>
                <SelectTrigger className="w-full bg-muted dark:bg-muted">
                  <SelectValue placeholder="Choose your preferred strain..." />
                </SelectTrigger>
                <SelectContent>
                  {strainNames.map(strain => (
                    <SelectItem key={strain} value={strain}>
                      <div className="flex items-center"><Leaf size={14} className="mr-2 text-primary" />{strain}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Button onClick={handleStrainSelection} className="w-full bg-green-500 hover:bg-green-600 text-white" size="sm">
              <MessageCircle size={16} className="mr-2" />
              {selectedStrain ? `Chat about ${selectedStrain}` : 'Start WhatsApp Chat'}
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => handleWhatsAppClick(`Hello ${businessName} 🌿 — What strains do you currently have available for pickup?`)} className="text-xs">Check Menu</Button>
              <Button variant="outline" size="sm" onClick={() => handleWhatsAppClick(`Hello ${businessName} 🌿 — What are your current prices and pickup times?`)} className="text-xs">Pricing Info</Button>
            </div>
          </div>

          <div className="mt-3 text-xs text-muted-foreground dark:text-muted-foreground text-center">🔒 Discreet • Licensed • Professional</div>
        </div>
      )}
      
      <Button onClick={() => setIsExpanded(!isExpanded)} className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-pulse" size="icon">
        {isExpanded ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>
    </div>
  );
};

export default WhatsAppWidget;

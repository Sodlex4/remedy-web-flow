import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, X } from 'lucide-react';
import { useLocation } from '@/context/LocationContext';

const KENYAN_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa', 'Homa Bay',
  'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii',
  'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
  'Marsabit', 'Meru', 'Migori', 'Mombasa', "Murang'a", 'Nairobi', 'Nakuru', 'Nandi',
  'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River',
  'Tharaka-Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot',
];

const CountySelector = () => {
  const { selectedCounty, setSelectedCounty, setSelectedPeddlerId, counties } = useLocation();
  const [dismissed, setDismissed] = useState(false);

  if (selectedCounty || dismissed) return null;

  const handleSelect = (county: string) => {
    setSelectedCounty(county);
    setSelectedPeddlerId('');
  };

  // Merge available counties from DB with full list — highlight ones that have peddlers
  const availableCounties = KENYAN_COUNTIES;

  return (
    <section className="py-12 bg-card/30 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Where are you located?</h2>
          <p className="text-muted-foreground">Select your county to find a licensed dispensary near you</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
          {availableCounties.map(county => {
            const hasPeddler = counties.includes(county);
            return (
              <Button
                key={county}
                variant={hasPeddler ? "default" : "outline"}
                size="sm"
                onClick={() => hasPeddler && handleSelect(county)}
                disabled={!hasPeddler}
                className={`
                  ${hasPeddler
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    : 'border-border text-muted-foreground opacity-50 cursor-not-allowed'
                  }
                  transition-all duration-200
                `}
              >
                <MapPin size={14} className="mr-1" />
                {county}
              </Button>
            );
          })}
        </div>

        {counties.length === 0 && (
          <p className="text-center text-muted-foreground text-sm mt-6">
            Loading available counties...
          </p>
        )}

        <div className="text-center mt-4">
          <Button variant="ghost" size="sm" onClick={() => setDismissed(true)} className="text-muted-foreground">
            <X size={14} className="mr-1" /> Skip — browse all products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CountySelector;

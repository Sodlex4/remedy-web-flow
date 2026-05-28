import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, MapPin, MessageCircle, RefreshCw } from 'lucide-react';
import { useLocation } from '@/context/LocationContext';

const PeddlerList = () => {
  const {
    selectedCounty,
    selectedSellerId, setSelectedSellerId,
    sellers, loading,
    selectedSeller, clearLocation,
  } = useLocation();

  if (!selectedCounty) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Dispensaries in {selectedCounty}
            </h2>
            <p className="text-muted-foreground text-sm">
              {loading ? 'Loading...' : `${sellers.length} dispensar${sellers.length === 1 ? 'y' : 'ies'} available`}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={clearLocation} className="text-muted-foreground">
            <RefreshCw size={14} className="mr-1" /> Change County
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading dispensaries...</p>
          </div>
        ) : sellers.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <MapPin size={40} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No dispensaries yet</h3>
              <p className="text-muted-foreground">
                We're expanding to {selectedCounty} soon. Check back later!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellers.map(seller => {
              const isActive = selectedSellerId === seller.id;
              return (
                <Card
                  key={seller.id}
                  className={`
                    bg-card border-border cursor-pointer transition-all duration-200
                    ${isActive
                      ? 'ring-2 ring-primary border-primary'
                      : 'hover:border-primary/50 hover:shadow-lg'
                    }
                  `}
                  onClick={() => setSelectedSellerId(seller.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                          <Leaf size={24} className="text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{seller.businessName}</CardTitle>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <MapPin size={12} className="mr-1" /> {seller.county}
                          </div>
                        </div>
                      </div>
                      {isActive && <Badge>Selected</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {seller.bio && (
                      <p className="text-sm text-muted-foreground mb-3">{seller.bio}</p>
                    )}
                    <a
                      href={`https://wa.me/${seller.whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-green-500 hover:text-green-400"
                      onClick={e => e.stopPropagation()}
                    >
                      <MessageCircle size={14} className="mr-1" /> Chat on WhatsApp
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default PeddlerList;

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, RefreshCw, Store, Navigation } from 'lucide-react';
import SellerCard from '@/components/SellerCard';
import { useLocation } from '@/context/LocationContext';
import type { NearbySeller } from '@/types/seller';

const SkeletonCard = () => (
  <Card className="bg-card border-border overflow-hidden animate-pulse">
    <CardContent className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-28 bg-muted rounded" />
            <div className="h-3 w-20 bg-muted rounded" />
          </div>
        </div>
        <div className="h-5 w-14 bg-muted rounded-full" />
      </div>
      <div className="flex gap-3 mb-3">
        <div className="h-3 w-20 bg-muted rounded" />
        <div className="h-3 w-12 bg-muted rounded" />
      </div>
      <div className="h-3 w-full bg-muted rounded mb-1" />
      <div className="h-3 w-3/4 bg-muted rounded mb-4" />
      <div className="h-9 w-full bg-muted rounded" />
    </CardContent>
  </Card>
);

const NearbySellers = () => {
  const {
    nearbySellers,
    nearbyLoading,
    geoLocation,
    locationPhase,
    setSelectedCounty,
    setSelectedSellerId,
  } = useLocation();

  const handleSelectSeller = (seller: NearbySeller) => {
    setSelectedCounty(seller.county);
    setSelectedSellerId(seller.id);
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const town = geoLocation?.town || geoLocation?.county || 'your area';

  if (locationPhase !== 'located') return null;

  return (
    <section className="py-10 bg-gradient-to-b from-background to-card/30 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Navigation size={22} className="text-primary" />
              Sellers near {town}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {nearbySellers.length > 0
                ? `${nearbySellers.length} dispensar${nearbySellers.length === 1 ? 'y' : 'ies'} near you`
                : 'Discover licensed dispensaries in your area'}
            </p>
          </div>
        </div>

        {nearbyLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : nearbySellers.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {nearbySellers.map((seller) => (
              <SellerCard
                key={seller.id}
                seller={seller}
                onSelect={handleSelectSeller}
              />
            ))}
          </div>
        ) : (
          <Card className="bg-card/50 border-dashed border-border">
            <CardContent className="py-12 text-center">
              <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                <Store size={28} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No sellers found nearby
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                There are no registered dispensaries within delivery range of your location.
                Try selecting a county to browse available sellers.
              </p>
              <Button
                variant="default"
                onClick={() => {
                  const el = document.getElementById('county-selector');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <MapPin size={16} className="mr-2" />
                Browse by county
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default NearbySellers;

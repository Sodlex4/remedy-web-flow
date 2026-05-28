import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Zap, Store } from 'lucide-react';
import type { NearbySeller } from '@/types/seller';

interface SellerCardProps {
  seller: NearbySeller;
  onSelect: (seller: NearbySeller) => void;
}

function distanceLabel(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m away`;
  return `${km.toFixed(1)} km away`;
}

function ratingStars(rating: number): string {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

const SellerCard = ({ seller, onSelect }: SellerCardProps) => {
  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/50 bg-card border-border overflow-hidden"
      onClick={() => onSelect(seller)}
    >
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Store size={22} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-base leading-tight">
                  {seller.business_name}
                </h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin size={10} />
                  {seller.county || 'Kenya'}
                </p>
              </div>
            </div>
            <Badge
              variant={seller.is_online ? 'default' : 'secondary'}
              className={`text-[10px] px-2 py-0 h-5 ${
                seller.is_online
                  ? 'bg-green-500/15 text-green-600 hover:bg-green-500/20'
                  : 'text-muted-foreground'
              }`}
            >
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${
                  seller.is_online ? 'bg-green-500' : 'bg-muted-foreground'
                }`}
              />
              {seller.is_online ? 'Open' : 'Closed'}
            </Badge>
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Zap size={13} className="text-primary" />
              {distanceLabel(seller.distance_km)}
            </span>
            {seller.rating > 0 && (
              <span className="flex items-center gap-1">
                <Star size={13} className="text-amber-500 fill-amber-500" />
                {seller.rating.toFixed(1)}
              </span>
            )}
          </div>

          {seller.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {seller.bio}
            </p>
          )}

          <Button
            variant="secondary"
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            size="sm"
          >
            <Store size={14} className="mr-1.5" />
            View store
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SellerCard;

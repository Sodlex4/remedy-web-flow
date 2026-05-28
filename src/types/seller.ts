export interface NearbySeller {
  id: string;
  business_name: string;
  county: string;
  whatsapp_number: string;
  bio: string;
  avatar_url: string;
  latitude: number;
  longitude: number;
  delivery_radius_km: number;
  is_online: boolean;
  distance_km: number;
  rating: number;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  county: string;
  town: string;
  region: string;
}

export type PermissionState = 'prompt' | 'granted' | 'denied' | 'unavailable';
export type LocationPhase =
  | 'idle'
  | 'awaiting-permission'
  | 'detecting'
  | 'located'
  | 'denied'
  | 'error';

export interface SellerCardProps {
  seller: NearbySeller;
  onSelect: (seller: NearbySeller) => void;
}


// Shared type definition to avoid conflicts between components
export interface PickupRequest {
  id: string;
  customerName: string;
  whatsappNumber: string;
  items: string[];
  pickupTime: string;
  status: 'new' | 'seen' | 'ready' | 'completed';
  createdAt: string;
  totalAmount: number;
  peddlerId?: string;
  county?: string;
  isGoogleSynced?: boolean;
  lastSynced?: string;
}

export interface PickupRequestsTableProps {
  requests: PickupRequest[];
  onRequestClick: (request: PickupRequest) => void;
  onUpdateStatus: (id: string, status: 'seen' | 'ready' | 'completed') => void;
  onDeleteRequest?: (id: string) => void;
  userRole: 'admin' | 'assistant' | 'viewer';
}

// Supabase database schema type
export interface SupabasePickupRequest {
  id: number;
  name: string;
  phone: string;
  strain: string;
  quantity: number;
  pickup_time: string;
  status: 'new' | 'seen' | 'ready' | 'completed';
  created_at: string;
  total_amount: number;
  peddler_id?: string;
  county?: string;
}

// Database strain type (per-peddler)
export interface DbStrain {
  id: string;
  peddler_id: string;
  name: string;
  type: 'Indica' | 'Sativa' | 'Hybrid' | 'Edibles' | 'Accessories';
  thc?: string;
  price: number;
  image: string;
  effects: string[];
  description: string;
  flavor?: string;
  available: boolean;
  created_at: string;
  updated_at: string;
}

// Database profile type (includes peddler fields)
export interface DbProfile {
  id: string;
  name: string;
  role: 'admin' | 'assistant' | 'viewer';
  business_name?: string;
  whatsapp_number?: string;
  county?: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

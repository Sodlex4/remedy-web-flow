
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
}

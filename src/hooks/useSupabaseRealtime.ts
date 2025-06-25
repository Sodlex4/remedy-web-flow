
import { useEffect, useCallback } from 'react';
import { supabase, SupabasePickupRequest } from '@/lib/supabase';
import { PickupRequest } from '@/types/pickupRequest';
import { toast } from 'sonner';

interface UseSupabaseRealtimeProps {
  onNewRequest: (request: PickupRequest) => void;
  onUpdateRequest: (request: PickupRequest) => void;
  onDeleteRequest: (id: string) => void;
  playNotification: () => void;
  isMuted: boolean;
}

export const useSupabaseRealtime = ({
  onNewRequest,
  onUpdateRequest,
  onDeleteRequest,
  playNotification,
  isMuted
}: UseSupabaseRealtimeProps) => {
  
  const convertSupabaseToInternal = useCallback((supabaseRequest: SupabasePickupRequest): PickupRequest => {
    return {
      id: supabaseRequest.id.toString(),
      customerName: supabaseRequest.name,
      whatsappNumber: supabaseRequest.phone,
      items: [supabaseRequest.strain + ` (${supabaseRequest.quantity}g)`],
      pickupTime: supabaseRequest.pickup_time,
      status: supabaseRequest.status,
      createdAt: supabaseRequest.created_at,
      totalAmount: supabaseRequest.total_amount
    };
  }, []);

  useEffect(() => {
    console.log('🔄 Setting up Supabase realtime subscription...');
    
    const channel = supabase
      .channel('realtime:pickup_requests')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'pickup_requests' },
        (payload) => {
          console.log('🔄 New pickup request:', payload.new);
          const newRequest = convertSupabaseToInternal(payload.new as SupabasePickupRequest);
          
          onNewRequest(newRequest);
          
          // Play notification sound
          if (!isMuted) {
            playNotification();
          }
          
          // Show toast notification
          toast.success(`📦 New pickup request from ${newRequest.customerName}`, {
            description: `${newRequest.items.join(', ')} - KSh ${newRequest.totalAmount.toLocaleString()}`,
            duration: 5000,
            action: {
              label: "View",
              onClick: () => {
                // This will be handled by the parent component
                console.log('View request clicked:', newRequest.id);
              },
            },
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'pickup_requests' },
        (payload) => {
          console.log('🔄 Updated pickup request:', payload.new);
          const updatedRequest = convertSupabaseToInternal(payload.new as SupabasePickupRequest);
          onUpdateRequest(updatedRequest);
          
          toast.info(`📋 Request updated: ${updatedRequest.customerName}`, {
            description: `Status changed to ${updatedRequest.status}`,
            duration: 3000,
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'pickup_requests' },
        (payload) => {
          console.log('🗑️ Deleted pickup request:', payload.old);
          const deletedId = payload.old.id.toString();
          onDeleteRequest(deletedId);
          
          toast.info('🗑️ Pickup request deleted', {
            duration: 3000,
          });
        }
      )
      .subscribe((status) => {
        console.log('📡 Realtime subscription status:', status);
      });

    return () => {
      console.log('🔌 Cleaning up Supabase realtime subscription...');
      supabase.removeChannel(channel);
    };
  }, [convertSupabaseToInternal, onNewRequest, onUpdateRequest, onDeleteRequest, playNotification, isMuted]);
};

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { NearbySeller } from '@/types/seller';

interface RealtimeSellerUpdate {
  id: string;
  is_online: boolean;
}

export function useRealtimeSellers(
  sellers: NearbySeller[],
  onSellerUpdate: (update: RealtimeSellerUpdate) => void
) {
  useEffect(() => {
    if (sellers.length === 0) return;

    const sellerIds = sellers.map((s) => s.id);

    const channel = supabase
      .channel('realtime:sellers-online')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sellers',
          filter: `id=in.(${sellerIds.join(',')})`,
        },
        (payload) => {
          const newData = payload.new as { id: string; is_online: boolean };
          if (typeof newData.is_online === 'boolean') {
            onSellerUpdate({ id: newData.id, is_online: newData.is_online });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sellers, onSellerUpdate]);
}

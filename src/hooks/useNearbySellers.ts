import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { NearbySeller } from '@/types/seller';

interface NearbySellersResult {
  sellers: NearbySeller[];
  expanded: boolean;
}

export function useNearbySellers(lat: number | null, lng: number | null) {
  return useQuery<NearbySellersResult>({
    queryKey: ['nearby-sellers', lat, lng],
    queryFn: async () => {
      if (lat === null || lng === null) {
        return { sellers: [], expanded: false };
      }

      const { data, error } = await supabase.rpc('find_nearby_sellers', {
        user_lat: lat,
        user_lng: lng,
      });

      if (error) {
        console.error('find_nearby_sellers error:', error);
        throw error;
      }

      const sellers = (data || []) as NearbySeller[];

      if (sellers.length > 0) {
        return { sellers, expanded: false };
      }

      return { sellers, expanded: false };
    },
    enabled: lat !== null && lng !== null,
    staleTime: 2 * 60 * 1000,
    refetchInterval: 3 * 60 * 1000,
    retry: 1,
  });
}

import { useQuery } from '@tanstack/react-query';
import type { FearGreedData } from '@/services/alternativeMe';

export function useFearGreed() {
  return useQuery<FearGreedData | null>({
    queryKey: ['fear-greed'],
    queryFn: async () => {
      const res = await fetch('/api/fear-greed');
      if (!res.ok) return null;
      return res.json();
    },
    refetchInterval: 60 * 60_000,
    staleTime: 60 * 60_000,
  });
}

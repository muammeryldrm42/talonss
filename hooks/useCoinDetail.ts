import { useQuery } from '@tanstack/react-query';
import type { CoinDetail } from '@/types/coin';

export function useCoinDetail(id: string | null) {
  return useQuery<CoinDetail>({
    queryKey: ['coin', 'detail', id],
    queryFn: async () => {
      const res = await fetch(`/api/coin/${id}?action=detail`);
      if (!res.ok) throw new Error('Failed to fetch coin detail');
      return res.json();
    },
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function useCoinChart(id: string | null, days: string) {
  return useQuery({
    queryKey: ['coin', 'chart', id, days],
    queryFn: async () => {
      const res = await fetch(`/api/coin/${id}?action=chart&days=${days}`);
      if (!res.ok) throw new Error('Failed to fetch chart');
      return res.json();
    },
    enabled: !!id,
    staleTime: 30_000,
  });
}

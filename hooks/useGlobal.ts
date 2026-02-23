import { useQuery } from '@tanstack/react-query';
import type { GlobalData } from '@/types/global';

export function useGlobal() {
  return useQuery<GlobalData>({
    queryKey: ['global'],
    queryFn: async () => {
      const res = await fetch('/api/global');
      if (!res.ok) throw new Error('Failed to fetch global data');
      return res.json();
    },
    refetchInterval: 120_000,
  });
}

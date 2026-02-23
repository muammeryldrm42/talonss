import { useQuery } from '@tanstack/react-query';
import type { NewsPost } from '@/types/news';

export function useNews(filter = 'hot') {
  return useQuery<NewsPost[]>({
    queryKey: ['news', filter],
    queryFn: async () => {
      const res = await fetch(`/api/news?filter=${filter}`);
      if (!res.ok) throw new Error('Failed to fetch news');
      return res.json();
    },
    refetchInterval: 5 * 60_000,
    staleTime: 5 * 60_000,
  });
}

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import type { CoinMarket } from '@/types/coin';

async function fetchCoins(page: number, perPage: number): Promise<CoinMarket[]> {
  const res = await fetch(`/api/coins?page=${page}&per_page=${perPage}`);
  if (!res.ok) throw new Error('Failed to fetch coins');
  return res.json();
}

export function useCoins(page = 1, perPage = 50) {
  return useQuery({
    queryKey: ['coins', 'markets', page, perPage],
    queryFn: () => fetchCoins(page, perPage),
    placeholderData: keepPreviousData,
    refetchInterval: 60_000,
  });
}

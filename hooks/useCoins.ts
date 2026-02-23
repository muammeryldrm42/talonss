import { useQuery, keepPreviousData } from '@tanstack/react-query';
import type { CoinMarket } from '@/types/coin';

export type MarketSource = 'all' | 'coingecko' | 'coinmarketcap';

async function fetchCoins(page: number, perPage: number, source: MarketSource): Promise<CoinMarket[]> {
  const res = await fetch(`/api/coins?page=${page}&per_page=${perPage}&source=${source}`);
  if (!res.ok) throw new Error('Failed to fetch coins');
  return res.json();
}

export function useCoins(page = 1, perPage = 10_000, source: MarketSource = 'all') {
  return useQuery({
    queryKey: ['coins', 'markets', page, perPage, source],
    queryFn: () => fetchCoins(page, perPage, source),
    placeholderData: keepPreviousData,
    refetchInterval: 60_000,
  });
}

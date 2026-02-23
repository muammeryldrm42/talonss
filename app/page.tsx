import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getCoinsMarkets, getGlobalData } from '@/services/coingecko';
import { getFearGreedIndex } from '@/services/alternativeMe';
import { Dashboard } from '@/components/Dashboard';

export const revalidate = 60;

export default async function HomePage() {
  const qc = new QueryClient();

  await Promise.allSettled([
    qc.prefetchQuery({
      queryKey: ['coins', 'markets', 1, 50],
      queryFn: () => getCoinsMarkets({ page: 1, perPage: 50 }),
    }),
    qc.prefetchQuery({
      queryKey: ['global'],
      queryFn: getGlobalData,
    }),
    qc.prefetchQuery({
      queryKey: ['fear-greed'],
      queryFn: getFearGreedIndex,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <Dashboard />
    </HydrationBoundary>
  );
}

import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getCoinDetail, getMarketChart } from '@/services/coingecko';
import { CoinDetailPage } from '@/components/detail/CoinDetailPage';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const coin = await getCoinDetail(params.id);
    return {
      title: `${coin.name} (${coin.symbol.toUpperCase()}) Price & Chart`,
      description: `Live ${coin.name} price chart, market cap, ATH, ATL, volume and full statistics on Talons.`,
      openGraph: {
        title: `${coin.name} — Talons`,
        description: `${coin.name} live price and market data.`,
      },
    };
  } catch {
    return {
      title: 'Coin Detail',
      description: 'Cryptocurrency price and statistics on Talons.',
    };
  }
}

export default async function Page({ params }: Props) {
  const qc = new QueryClient();

  await Promise.allSettled([
    qc.prefetchQuery({
      queryKey: ['coin', 'detail', params.id],
      queryFn: () => getCoinDetail(params.id),
    }),
    qc.prefetchQuery({
      queryKey: ['coin', 'chart', params.id, '7'],
      queryFn: () => getMarketChart(params.id, 7),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <CoinDetailPage id={params.id} />
    </HydrationBoundary>
  );
}

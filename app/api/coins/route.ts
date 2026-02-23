import { NextRequest, NextResponse } from 'next/server';
import { getCoinsMarkets } from '@/services/coingecko';
import { getCoinMarketCapListings } from '@/services/coinmarketcap';

export const runtime = 'edge';

type Source = 'all' | 'coingecko' | 'coinmarketcap';

function parseSource(value: string | null): Source {
  if (value === 'coingecko' || value === 'coinmarketcap') return value;
  return 'all';
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') ?? 1);
  const perPage = Math.min(Number(searchParams.get('per_page') ?? 50), 100);
  const currency = searchParams.get('currency') ?? 'usd';
  const source = parseSource(searchParams.get('source'));

  try {
    if (source === 'coingecko') {
      const data = await getCoinsMarkets({ page, perPage, currency });
      return NextResponse.json(data, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      });
    }

    if (source === 'coinmarketcap') {
      const data = await getCoinMarketCapListings({ page, perPage });
      return NextResponse.json(data, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      });
    }

    const [coingeckoData, cmcResult] = await Promise.all([
      getCoinsMarkets({ page, perPage, currency }),
      getCoinMarketCapListings({ page, perPage }).catch(() => []),
    ]);

    const merged = [...coingeckoData, ...cmcResult].sort((a, b) => b.market_cap - a.market_cap);

    return NextResponse.json(merged, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

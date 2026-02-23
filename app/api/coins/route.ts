import { NextRequest, NextResponse } from 'next/server';
import { getCoinsMarkets } from '@/services/coingecko';
import { getCoinMarketCapListings } from '@/services/coinmarketcap';
import type { CoinMarket } from '@/types/coin';

export const runtime = 'edge';

type Source = 'all' | 'coingecko' | 'coinmarketcap';

const MAX_PER_PAGE = 10_000;
const COINGECKO_MAX_PAGE_SIZE = 250;
const CMC_MAX_PAGE_SIZE = 5_000;

function parseSource(value: string | null): Source {
  if (value === 'coingecko' || value === 'coinmarketcap') return value;
  return 'all';
}

function parsePositiveInt(value: string | null, fallback: number): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.floor(n);
}

async function fetchCoingeckoRange(page: number, perPage: number, currency: string): Promise<CoinMarket[]> {
  const startIndex = (page - 1) * perPage;
  const startPage = Math.floor(startIndex / COINGECKO_MAX_PAGE_SIZE) + 1;
  const skip = startIndex % COINGECKO_MAX_PAGE_SIZE;

  const rows: CoinMarket[] = [];
  let currentPage = startPage;

  while (rows.length < perPage) {
    const chunk = await getCoinsMarkets({
      page: currentPage,
      perPage: COINGECKO_MAX_PAGE_SIZE,
      currency,
    });

    if (!chunk.length) break;

    const sliced = currentPage === startPage ? chunk.slice(skip) : chunk;
    rows.push(...sliced);

    if (chunk.length < COINGECKO_MAX_PAGE_SIZE) break;
    currentPage += 1;
  }

  return rows.slice(0, perPage);
}

async function fetchCoinMarketCapRange(page: number, perPage: number): Promise<CoinMarket[]> {
  const startIndex = (page - 1) * perPage;

  const rows: CoinMarket[] = [];
  let offset = startIndex;

  while (rows.length < perPage) {
    const remaining = perPage - rows.length;
    const chunkSize = Math.min(remaining, CMC_MAX_PAGE_SIZE);

    const chunk = await getCoinMarketCapListings({ start: offset + 1, perPage: chunkSize });

    if (!chunk.length) break;

    rows.push(...chunk);

    if (chunk.length < chunkSize) break;
    offset += chunk.length;
  }

  return rows.slice(0, perPage);
}

function dedupeMergedRows(coingeckoData: CoinMarket[], cmcData: CoinMarket[]): CoinMarket[] {
  const mergedMap = new Map<string, CoinMarket>();

  for (const coin of coingeckoData) {
    const key = `${coin.symbol.toLowerCase()}:${coin.name.toLowerCase()}`;
    mergedMap.set(key, coin);
  }

  for (const coin of cmcData) {
    const key = `${coin.symbol.toLowerCase()}:${coin.name.toLowerCase()}`;
    if (!mergedMap.has(key)) {
      mergedMap.set(key, coin);
    }
  }

  return Array.from(mergedMap.values()).sort((a, b) => b.market_cap - a.market_cap);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parsePositiveInt(searchParams.get('page'), 1);
  const perPage = Math.min(parsePositiveInt(searchParams.get('per_page'), 10_000), MAX_PER_PAGE);
  const currency = searchParams.get('currency') ?? 'usd';
  const source = parseSource(searchParams.get('source'));

  try {
    if (source === 'coingecko') {
      const data = await fetchCoingeckoRange(page, perPage, currency);
      return NextResponse.json(data, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      });
    }

    if (source === 'coinmarketcap') {
      const data = await fetchCoinMarketCapRange(page, perPage);
      return NextResponse.json(data, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      });
    }

    const [coingeckoData, cmcResult] = await Promise.all([
      fetchCoingeckoRange(page, perPage, currency),
      fetchCoinMarketCapRange(page, perPage).catch(() => []),
    ]);

    const merged = dedupeMergedRows(coingeckoData, cmcResult);

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

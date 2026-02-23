import { NextRequest, NextResponse } from 'next/server';
import { getCoinsMarkets } from '@/services/coingecko';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') ?? 1);
  const perPage = Math.min(Number(searchParams.get('per_page') ?? 50), 100);
  const currency = searchParams.get('currency') ?? 'usd';

  try {
    const data = await getCoinsMarkets({ page, perPage, currency });
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

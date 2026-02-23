import { NextRequest, NextResponse } from 'next/server';
import { getCoinDetail, getMarketChart } from '@/services/coingecko';

export const runtime = 'edge';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action'); // 'detail' | 'chart'
  const days = searchParams.get('days') ?? '7';

  try {
    if (action === 'chart') {
      const data = await getMarketChart(params.id, days);
      return NextResponse.json(data, {
        headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' },
      });
    }

    const data = await getCoinDetail(params.id);
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

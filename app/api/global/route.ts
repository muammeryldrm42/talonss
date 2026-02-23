import { NextResponse } from 'next/server';
import { getGlobalData } from '@/services/coingecko';

export const runtime = 'edge';

export async function GET() {
  try {
    const data = await getGlobalData();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=240' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

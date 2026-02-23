import { NextResponse } from 'next/server';
import { getFearGreedIndex } from '@/services/alternativeMe';

export const runtime = 'edge';

export async function GET() {
  try {
    const data = await getFearGreedIndex();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

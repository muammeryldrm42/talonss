import { NextRequest, NextResponse } from 'next/server';
import { getNews, NewsFilter } from '@/services/cryptopanic';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filter = (searchParams.get('filter') ?? 'hot') as NewsFilter;

  try {
    const data = await getNews(filter);
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

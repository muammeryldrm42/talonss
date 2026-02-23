import type { NewsPost } from '@/types/news';

const BASE = 'https://cryptopanic.com/api/free/v1';

export type NewsFilter = 'rising' | 'hot' | 'bullish' | 'bearish' | 'important' | 'saved' | 'lol';

export async function getNews(filter: NewsFilter = 'hot', limit = 20): Promise<NewsPost[]> {
  const token = process.env.CRYPTOPANIC_TOKEN;

  if (!token || token === 'your_token_here') {
    console.warn('[CryptoPanic] No API token set — returning empty news');
    return [];
  }

  const url = new URL(`${BASE}/posts/`);
  url.searchParams.set('auth_token', token);
  url.searchParams.set('public', 'true');
  url.searchParams.set('filter', filter);

  const res = await fetch(url.toString(), {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    console.error(`[CryptoPanic] Error ${res.status}`);
    return [];
  }

  const data = await res.json();
  return (data.results ?? []).slice(0, limit);
}

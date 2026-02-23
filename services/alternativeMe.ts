export interface FearGreedData {
  value: string;
  value_classification: string;
  timestamp: string;
  time_until_update: string;
}

export async function getFearGreedIndex(limit = 1): Promise<FearGreedData | null> {
  try {
    const res = await fetch(
      `https://api.alternative.me/fng/?limit=${limit}&format=json`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.[0] ?? null;
  } catch {
    return null;
  }
}

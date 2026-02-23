export const fmt = {
  usd: (n: number | null | undefined): string => {
    if (n == null) return '—';
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
    if (n >= 1) return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return `$${n.toFixed(8)}`;
  },

  pct: (n: number | null | undefined): string => {
    if (n == null) return '—';
    return `${n > 0 ? '+' : ''}${n.toFixed(2)}%`;
  },

  supply: (n: number | null | undefined): string => {
    if (n == null) return '—';
    if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(2)}K`;
    return n.toLocaleString('en-US');
  },

  date: (iso: string): string =>
    new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
};

export const pctColor = (v: number | null | undefined): string => {
  if (v == null) return 'text-slate-400';
  return v > 0 ? 'text-emerald-400' : v < 0 ? 'text-rose-400' : 'text-slate-400';
};

export const pctBg = (v: number | null | undefined): string => {
  if (v == null) return 'bg-slate-400/10';
  return v > 0 ? 'bg-emerald-400/10' : v < 0 ? 'bg-rose-400/10' : 'bg-slate-400/10';
};

'use client';
import { Globe, BarChart2, Zap } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { fmt, pctColor } from '@/lib/format';
import type { GlobalData } from '@/types/global';

interface Props {
  data: GlobalData | undefined;
  isLoading: boolean;
}

export function GlobalHeader({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="flex gap-3 flex-wrap">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-16 flex-1 min-w-[160px] rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!data) return null;

  const items = [
    {
      label: 'Market Cap',
      value: fmt.usd(data.total_market_cap?.usd),
      icon: <Globe size={14} />,
      sub: data.market_cap_change_percentage_24h_usd,
      color: '#60a5fa',
    },
    {
      label: '24h Volume',
      value: fmt.usd(data.total_volume?.usd),
      icon: <BarChart2 size={14} />,
      sub: null,
      color: '#a78bfa',
    },
    {
      label: 'BTC Dom.',
      value: `${data.market_cap_percentage?.btc?.toFixed(1)}%`,
      icon: <span className="text-orange-400 text-xs font-black">₿</span>,
      sub: null,
      color: '#fb923c',
    },
    {
      label: 'ETH Dom.',
      value: `${data.market_cap_percentage?.eth?.toFixed(1)}%`,
      icon: <Zap size={14} />,
      sub: null,
      color: '#818cf8',
    },
  ];

  return (
    <div className="flex gap-3 flex-wrap">
      {items.map((item, i) => (
        <GlassCard key={i} className="px-5 py-3 flex items-center gap-3 flex-1 min-w-[160px]">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${item.color}22`, color: item.color }}
          >
            {item.icon}
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">{item.label}</div>
            <div
              className="text-base font-bold text-white"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              {item.value}
            </div>
            {item.sub != null && (
              <div className={`text-xs ${pctColor(item.sub)}`}>
                {fmt.pct(item.sub)} (24h)
              </div>
            )}
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

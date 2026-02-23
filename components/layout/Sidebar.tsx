'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Flame, Globe, Cpu } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { FearGreedGauge } from '@/components/ui/FearGreedGauge';
import { PctBadge } from '@/components/ui/PctBadge';
import { fmt } from '@/lib/format';
import { useFearGreed } from '@/hooks/useFearGreed';
import type { GlobalData } from '@/types/global';
import type { CoinMarket } from '@/types/coin';

interface Props {
  globalData: GlobalData | undefined;
  coins: CoinMarket[];
}

export function Sidebar({ globalData, coins }: Props) {
  const { data: fearGreed, isLoading: fgLoading } = useFearGreed();

  const topMovers = [...coins]
    .sort(
      (a, b) =>
        Math.abs(b.price_change_percentage_24h_in_currency ?? 0) -
        Math.abs(a.price_change_percentage_24h_in_currency ?? 0),
    )
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <FearGreedGauge data={fearGreed} isLoading={fgLoading} />

      {/* Top Movers */}
      {coins.length > 0 && (
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Flame size={14} className="text-orange-400" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
              Top Movers 24h
            </span>
          </div>
          <div className="space-y-1">
            {topMovers.map((c) => (
              <Link
                key={c.id}
                href={`/coin/${c.id}`}
                className="flex items-center gap-2 hover:bg-white/5 rounded-xl px-2 py-1.5 transition-colors"
              >
                <Image src={c.image} alt={c.name} width={24} height={24} className="rounded-full" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white truncate">{c.name}</div>
                  <div className="text-xs text-slate-500 font-mono">
                    {fmt.usd(c.current_price)}
                  </div>
                </div>
                <PctBadge value={c.price_change_percentage_24h_in_currency} />
              </Link>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Market Dominance */}
      {globalData && (
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Globe size={14} className="text-sky-400" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
              Dominance
            </span>
          </div>
          <div className="space-y-2.5">
            {Object.entries(globalData.market_cap_percentage ?? {})
              .slice(0, 5)
              .map(([sym, pct]) => (
                <div key={sym}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 uppercase font-semibold">{sym}</span>
                    <span className="text-slate-400 font-mono">{pct.toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background:
                          sym === 'btc'
                            ? 'linear-gradient(90deg,#fb923c,#f59e0b)'
                            : sym === 'eth'
                            ? 'linear-gradient(90deg,#818cf8,#a78bfa)'
                            : 'linear-gradient(90deg,#60a5fa,#38bdf8)',
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </GlassCard>
      )}

      {/* Market Stats */}
      {globalData && (
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa' }}
            >
              <Cpu size={14} />
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">Active</div>
              <div className="text-sm font-bold text-white font-mono">
                {globalData.active_cryptocurrencies?.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(96,165,250,0.15)', color: '#60a5fa' }}
            >
              <Globe size={14} />
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">Exchanges</div>
              <div className="text-sm font-bold text-white font-mono">
                {globalData.markets?.toLocaleString()}
              </div>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

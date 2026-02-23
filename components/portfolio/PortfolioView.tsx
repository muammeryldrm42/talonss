'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Trash2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { PctBadge } from '@/components/ui/PctBadge';
import { fmt } from '@/lib/format';
import type { PortfolioEntry } from '@/types/portfolio';
import type { CoinMarket } from '@/types/coin';

interface Props {
  portfolio: PortfolioEntry[];
  coins: CoinMarket[];
  onRemove: (id: string) => void;
}

export function PortfolioView({ portfolio, coins, onRemove }: Props) {
  const enriched = portfolio.map((p) => {
    const live = coins.find((c) => c.id === p.id);
    const currentPrice = live?.current_price ?? p.buyPrice;
    const pnl = p.buyPrice ? ((currentPrice - p.buyPrice) / p.buyPrice) * 100 : null;
    const pnlUsd = p.buyPrice ? (currentPrice - p.buyPrice) * p.quantity : null;
    const totalValue = currentPrice * p.quantity;
    return { ...p, currentPrice, pnl, pnlUsd, totalValue };
  });

  const totalValue = enriched.reduce((s, c) => s + c.totalValue, 0);

  if (!portfolio.length) {
    return (
      <GlassCard className="p-12 flex flex-col items-center justify-center text-center gap-3">
        <Star size={32} className="text-slate-600" />
        <div className="text-slate-400 font-semibold">Your portfolio is empty</div>
        <div className="text-slate-600 text-sm">
          Click the ★ icon on any coin in the Market tab to track it
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      {/* Portfolio Summary */}
      <GlassCard className="p-5">
        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
          Simulated Portfolio Value
        </div>
        <div
          className="text-3xl font-black text-white"
          style={{ fontFamily: "'Space Mono',monospace" }}
        >
          {fmt.usd(totalValue)}
        </div>
        <div className="text-xs text-slate-500 mt-1">{portfolio.length} asset(s) tracked</div>
      </GlassCard>

      {/* Portfolio Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Asset', 'Qty', 'Buy Price', 'Current', 'P&L %', 'P&L USD', 'Value', ''].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {enriched.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/coin/${c.id}`}
                      className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                    >
                      {c.image && (
                        <Image
                          src={c.image}
                          alt={c.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      )}
                      <div>
                        <div className="font-semibold text-white text-sm">{c.name}</div>
                        <div className="text-xs text-slate-500 uppercase">{c.symbol}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-300 font-mono text-xs">{c.quantity}</td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">
                    {fmt.usd(c.buyPrice)}
                  </td>
                  <td className="px-4 py-3 text-white font-mono font-semibold text-xs">
                    {fmt.usd(c.currentPrice)}
                  </td>
                  <td className="px-4 py-3">
                    <PctBadge value={c.pnl} />
                  </td>
                  <td className="px-4 py-3 text-xs font-mono">
                    {c.pnlUsd != null ? (
                      <span className={c.pnlUsd >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {c.pnlUsd >= 0 ? '+' : ''}{fmt.usd(c.pnlUsd)}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-300 font-mono text-xs">
                    {fmt.usd(c.totalValue)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onRemove(c.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-400/10 text-slate-600 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

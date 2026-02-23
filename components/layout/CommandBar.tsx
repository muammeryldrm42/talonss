'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { PctBadge } from '@/components/ui/PctBadge';
import { fmt } from '@/lib/format';
import type { CoinMarket } from '@/types/coin';

interface Props {
  coins: CoinMarket[];
  onClose: () => void;
}

export function CommandBar({ coins, onClose }: Props) {
  const [q, setQ] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    ref.current?.focus();
  }, []);

  const results = useMemo(() => {
    if (!q.trim()) return coins.slice(0, 8);
    const lq = q.toLowerCase();
    return coins
      .filter(
        (c) =>
          c.name.toLowerCase().includes(lq) || c.symbol.toLowerCase().includes(lq),
      )
      .slice(0, 10);
  }, [q, coins]);

  const handleSelect = (coin: CoinMarket) => {
    router.push(`/coin/${coin.id}`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <GlassCard
        className="w-full max-w-lg overflow-hidden"
        style={{ border: '1px solid rgba(99,179,255,0.25)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <Search size={16} className="text-slate-400" />
          <input
            ref={ref}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search coins by name or symbol..."
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-slate-500"
          />
          <kbd
            className="text-xs text-slate-600 bg-white/5 px-1.5 py-0.5 rounded"
            style={{ fontFamily: 'monospace' }}
          >
            ESC
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {results.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.05] cursor-pointer transition-colors"
              onClick={() => handleSelect(c)}
            >
              <Image src={c.image} alt={c.name} width={28} height={28} className="rounded-full" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-white">{c.name}</div>
                <div className="text-xs text-slate-500 uppercase">{c.symbol}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono text-white">{fmt.usd(c.current_price)}</div>
                <PctBadge value={c.price_change_percentage_24h_in_currency} />
              </div>
            </div>
          ))}
          {results.length === 0 && (
            <div className="px-4 py-8 text-center text-slate-500 text-sm">
              No coins found for &quot;{q}&quot;
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

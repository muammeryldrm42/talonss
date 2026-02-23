'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronUp, ChevronDown, ChevronsUpDown, Star } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { PctBadge } from '@/components/ui/PctBadge';
import { Sparkline } from './Sparkline';
import { fmt } from '@/lib/format';
import type { CoinMarket } from '@/types/coin';

interface SortConfig {
  key: string;
  dir: 'asc' | 'desc';
}

interface Props {
  coins: CoinMarket[];
  loading: boolean;
  portfolio: { id: string }[];
  onTogglePortfolio: (coin: CoinMarket) => void;
  sortConfig: SortConfig;
  onSort: (key: string) => void;
  page: number;
  setPage: (fn: (p: number) => number) => void;
}

function SortIcon({ col, sortConfig }: { col: string; sortConfig: SortConfig }) {
  if (sortConfig.key !== col) return <ChevronsUpDown size={12} className="text-slate-600" />;
  return sortConfig.dir === 'asc'
    ? <ChevronUp size={12} className="text-sky-400" />
    : <ChevronDown size={12} className="text-sky-400" />;
}

function TH({ col, label, className, onSort, sortConfig }: {
  col: string; label: string; className?: string;
  onSort: (k: string) => void; sortConfig: SortConfig;
}) {
  return (
    <th
      className={`px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none hover:text-slate-300 transition-colors ${className ?? ''}`}
      onClick={() => onSort(col)}
    >
      <div className="flex items-center gap-1">
        {label} <SortIcon col={col} sortConfig={sortConfig} />
      </div>
    </th>
  );
}

export function CoinTable({ coins, loading, portfolio, onTogglePortfolio, sortConfig, onSort, page, setPage }: Props) {
  if (loading) {
    return (
      <GlassCard className="overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-white/5">
            <Skeleton className="w-6 h-3" />
            <Skeleton className="w-7 h-7 rounded-full" />
            <Skeleton className="w-28 h-3" />
            <Skeleton className="w-24 h-3 ml-auto" />
            <Skeleton className="w-16 h-3" />
            <Skeleton className="w-16 h-3" />
            <Skeleton className="w-20 h-8" />
          </div>
        ))}
      </GlassCard>
    );
  }

  const sharedTH = { onSort, sortConfig };

  return (
    <GlassCard className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <TH col="market_cap_rank" label="#" className="w-12" {...sharedTH} />
              <TH col="name" label="Asset" className="min-w-[180px]" {...sharedTH} />
              <TH col="current_price" label="Price" {...sharedTH} />
              <TH col="price_change_percentage_1h_in_currency" label="1h" {...sharedTH} />
              <TH col="price_change_percentage_24h_in_currency" label="24h" {...sharedTH} />
              <TH col="price_change_percentage_7d_in_currency" label="7d" {...sharedTH} />
              <TH col="market_cap" label="Mkt Cap" {...sharedTH} />
              <TH col="circulating_supply" label="Supply" {...sharedTH} />
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                7d Chart
              </th>
              <th className="px-3 py-3 w-10" />
            </tr>
          </thead>
          <tbody>
            {coins.map((coin, i) => {
              const inPortfolio = portfolio.some((p) => p.id === coin.id);
              return (
                <tr
                  key={coin.id}
                  className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors"
                  style={{ animationDelay: `${i * 15}ms` }}
                >
                  <td className="px-3 py-3 text-slate-500 font-mono text-xs">
                    {coin.market_cap_rank}
                  </td>
                  <td className="px-3 py-3">
                    <Link href={`/coin/${coin.id}`} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                      <Image
                        src={coin.image}
                        alt={coin.name}
                        width={28}
                        height={28}
                        className="rounded-full"
                      />
                      <div>
                        <div className="font-semibold text-white text-sm">{coin.name}</div>
                        <div className="text-xs text-slate-500 uppercase">{coin.symbol}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-3 py-3 font-mono font-semibold text-white">
                    {fmt.usd(coin.current_price)}
                  </td>
                  <td className="px-3 py-3">
                    <PctBadge value={coin.price_change_percentage_1h_in_currency} />
                  </td>
                  <td className="px-3 py-3">
                    <PctBadge value={coin.price_change_percentage_24h_in_currency} />
                  </td>
                  <td className="px-3 py-3">
                    <PctBadge value={coin.price_change_percentage_7d_in_currency} />
                  </td>
                  <td className="px-3 py-3 text-slate-300 font-mono text-xs">
                    {fmt.usd(coin.market_cap)}
                  </td>
                  <td className="px-3 py-3 text-slate-400 font-mono text-xs">
                    {fmt.supply(coin.circulating_supply)}
                  </td>
                  <td className="px-3 py-3">
                    <Sparkline data={coin.sparkline_in_7d?.price} />
                  </td>
                  <td
                    className="px-3 py-3"
                    onClick={(e) => { e.preventDefault(); onTogglePortfolio(coin); }}
                  >
                    <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                      {inPortfolio
                        ? <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        : <Star size={14} className="text-slate-600 hover:text-yellow-400" />
                      }
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="text-xs text-slate-500">
          Page {page} &nbsp;·&nbsp; {coins.length} coins
        </span>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-30 hover:bg-white/10 transition-colors text-slate-300"
          >
            ← Prev
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-white/10 transition-colors text-slate-300"
          >
            Next →
          </button>
        </div>
      </div>
    </GlassCard>
  );
}

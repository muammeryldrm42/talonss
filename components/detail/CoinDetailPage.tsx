'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Globe, ExternalLink, Star } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { PctBadge } from '@/components/ui/PctBadge';
import { PriceChart } from './PriceChart';
import { useCoinDetail, useCoinChart } from '@/hooks/useCoinDetail';
import { usePortfolio } from '@/hooks/usePortfolio';
import { fmt, pctColor } from '@/lib/format';

interface Props {
  id: string;
}

export function CoinDetailPage({ id }: Props) {
  const [period, setPeriod] = useState('7');
  const { data: coin, isLoading } = useCoinDetail(id);
  const { data: chartData = [], isLoading: chartLoading } = useCoinChart(id, period);
  const { has, add, remove } = usePortfolio();
  const inPortfolio = has(id);

  const togglePortfolio = () => {
    if (!coin) return;
    if (inPortfolio) {
      remove(id);
    } else {
      add({
        id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image.large,
        quantity: 1,
        buyPrice: coin.market_data.current_price.usd,
        addedAt: Date.now(),
      });
    }
  };

  const md = coin?.market_data;

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(ellipse 80% 60% at 10% 0%, rgba(30,64,120,0.4) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 100%, rgba(88,28,135,0.3) 0%, transparent 60%), #060b18',
        fontFamily: "'Syne', sans-serif",
      }}
    >
      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-4">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Back to Market
        </Link>

        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="w-40 h-6" />
                <Skeleton className="w-24 h-4" />
              </div>
            </div>
            <Skeleton className="w-full h-80 rounded-2xl" />
          </div>
        ) : coin ? (
          <div className="space-y-4 animate-slide-up">
            {/* Coin Header */}
            <div className="flex items-center gap-4 flex-wrap">
              <Image
                src={coin.image.large}
                alt={coin.name}
                width={56}
                height={56}
                className="rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-white">{coin.name}</h1>
                  <span className="text-xs text-slate-500 uppercase bg-white/5 px-2 py-0.5 rounded">
                    {coin.symbol}
                  </span>
                  {coin.market_cap_rank && (
                    <span className="text-xs text-slate-500">#{coin.market_cap_rank}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span
                    className="text-3xl font-black"
                    style={{ fontFamily: "'Space Mono',monospace" }}
                  >
                    {fmt.usd(md?.current_price?.usd)}
                  </span>
                  <PctBadge value={md?.price_change_percentage_24h} />
                </div>
              </div>
              <button
                onClick={togglePortfolio}
                className="p-2.5 rounded-xl hover:bg-white/10 transition-colors"
                title={inPortfolio ? 'Remove from portfolio' : 'Add to portfolio'}
              >
                {inPortfolio ? (
                  <Star size={22} className="text-yellow-400 fill-yellow-400" />
                ) : (
                  <Star size={22} className="text-slate-500 hover:text-yellow-400" />
                )}
              </button>
            </div>

            {/* Chart */}
            <GlassCard className="p-5">
              <PriceChart
                data={chartData}
                isLoading={chartLoading}
                period={period}
                onPeriodChange={setPeriod}
              />
            </GlassCard>

            {/* Stats Grid */}
            {md && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: '24h High', value: fmt.usd(md.high_24h?.usd) },
                  { label: '24h Low', value: fmt.usd(md.low_24h?.usd) },
                  {
                    label: 'All-Time High',
                    value: fmt.usd(md.ath?.usd),
                    sub: md.ath_change_percentage?.usd,
                    subLabel: 'from ATH',
                  },
                  {
                    label: 'All-Time Low',
                    value: fmt.usd(md.atl?.usd),
                    sub: md.atl_change_percentage?.usd,
                    subLabel: 'from ATL',
                  },
                  { label: 'Market Cap', value: fmt.usd(md.market_cap?.usd) },
                  {
                    label: 'Fully Diluted',
                    value: fmt.usd(md.fully_diluted_valuation?.usd),
                  },
                  { label: 'Total Supply', value: fmt.supply(md.total_supply) },
                  {
                    label: 'Max Supply',
                    value: md.max_supply ? fmt.supply(md.max_supply) : '∞',
                  },
                ].map((s, i) => (
                  <GlassCard key={i} className="p-4">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                      {s.label}
                    </div>
                    <div
                      className="text-sm font-bold text-white"
                      style={{ fontFamily: "'Space Mono',monospace" }}
                    >
                      {s.value}
                    </div>
                    {'sub' in s && s.sub != null && (
                      <div className={`text-xs mt-0.5 ${pctColor(s.sub)}`}>
                        {fmt.pct(s.sub)} {s.subLabel}
                      </div>
                    )}
                  </GlassCard>
                ))}
              </div>
            )}

            {/* Description & Links */}
            {coin.description?.en && (
              <GlassCard className="p-5">
                <div className="text-sm font-semibold text-slate-400 mb-2">About</div>
                <div
                  className="text-sm text-slate-300 leading-relaxed"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                  dangerouslySetInnerHTML={{
                    __html: coin.description.en,
                  }}
                />
                <div className="flex gap-4 mt-4 flex-wrap">
                  {coin.links?.homepage?.[0] && (
                    <a
                      href={coin.links.homepage[0]}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors"
                    >
                      <Globe size={12} /> Website <ExternalLink size={10} />
                    </a>
                  )}
                  {coin.links?.repos_url?.github?.[0] && (
                    <a
                      href={coin.links.repos_url.github[0]}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors"
                    >
                      GitHub <ExternalLink size={10} />
                    </a>
                  )}
                  {coin.links?.subreddit_url && (
                    <a
                      href={coin.links.subreddit_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors"
                    >
                      Reddit <ExternalLink size={10} />
                    </a>
                  )}
                  {coin.links?.twitter_screen_name && (
                    <a
                      href={`https://twitter.com/${coin.links.twitter_screen_name}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors"
                    >
                      Twitter <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </GlassCard>
            )}
          </div>
        ) : (
          <div className="text-center text-slate-500 py-20">Coin not found.</div>
        )}
      </div>
    </div>
  );
}

'use client';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { Search, RefreshCw, Zap, BarChart2, Star, Newspaper, AlertTriangle } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { GlobalHeader } from './layout/GlobalHeader';
import { Sidebar } from './layout/Sidebar';
import { CommandBar } from './layout/CommandBar';
import { CoinTable } from './market/CoinTable';
import { PortfolioView } from './portfolio/PortfolioView';
import { AddPositionModal } from './portfolio/AddPositionModal';
import { NewsCard } from './news/NewsCard';
import { Skeleton } from './ui/Skeleton';
import { useCoins } from '@/hooks/useCoins';
import { useGlobal } from '@/hooks/useGlobal';
import { useNews } from '@/hooks/useNews';
import { usePortfolio } from '@/hooks/usePortfolio';
import type { CoinMarket } from '@/types/coin';

type Tab = 'market' | 'portfolio' | 'news';

export function Dashboard() {
  const [tab, setTab] = useState<Tab>('market');
  const [page, setPage] = useState(1);
  const [showSearch, setShowSearch] = useState(false);
  const [addModal, setAddModal] = useState<CoinMarket | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; dir: 'asc' | 'desc' }>({
    key: 'market_cap_rank',
    dir: 'asc',
  });

  const { data: coins = [], isLoading, isError, refetch } = useCoins(page);
  const { data: globalData, isLoading: globalLoading } = useGlobal();
  const { data: news = [], isLoading: newsLoading } = useNews();
  const { portfolio, add, remove, has } = usePortfolio();

  // CMD+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch((s) => !s);
      }
      if (e.key === 'Escape') setShowSearch(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleSort = useCallback((key: string) => {
    setSortConfig((sc) => ({
      key,
      dir: sc.key === key && sc.dir === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const sortedCoins = useMemo(() => {
    if (!coins.length) return coins;
    return [...coins].sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortConfig.key] as number ?? -Infinity;
      const bv = (b as Record<string, unknown>)[sortConfig.key] as number ?? -Infinity;
      return sortConfig.dir === 'asc' ? (av > bv ? 1 : -1) : av < bv ? 1 : -1;
    });
  }, [coins, sortConfig]);

  const handleTogglePortfolio = (coin: CoinMarket) => {
    if (has(coin.id)) {
      remove(coin.id);
    } else {
      setAddModal(coin);
    }
  };

  const TABS: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'market', label: 'Market', icon: <BarChart2 size={15} /> },
    { id: 'portfolio', label: 'Portfolio', icon: <Star size={15} />, badge: portfolio.length },
    { id: 'news', label: 'News', icon: <Newspaper size={15} /> },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap');
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          background:
            'radial-gradient(ellipse 80% 60% at 10% 0%, rgba(30,64,120,0.4) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 100%, rgba(88,28,135,0.3) 0%, transparent 60%), #060b18',
          fontFamily: "'Syne', sans-serif",
          color: '#fff',
        }}
      >
        {/* Grid Background */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0,
            backgroundImage:
              'linear-gradient(rgba(99,179,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,179,255,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div
          style={{ position: 'relative', zIndex: 1 }}
          className="max-w-screen-xl mx-auto px-4 py-6 space-y-5"
        >
          {/* Top Nav */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                style={{
                  background: 'linear-gradient(135deg,#60a5fa,#a78bfa)',
                  borderRadius: 12,
                  width: 38,
                  height: 38,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 24px rgba(96,165,250,0.4)',
                  flexShrink: 0,
                }}
              >
                <Zap size={18} fill="white" color="white" />
              </div>
              <div>
                <h1
                  style={{
                    fontFamily: "'Syne',sans-serif",
                    fontSize: 22,
                    fontWeight: 800,
                    background: 'linear-gradient(135deg,#60a5fa,#a78bfa,#f0abfc)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.1,
                    margin: 0,
                  }}
                >
                  Talons
                </h1>
                <div
                  style={{
                    fontSize: 10,
                    color: '#475569',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    marginTop: 2,
                  }}
                >
                  Crypto Market Intelligence
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSearch(true)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10,
                }}
                className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white transition-colors"
              >
                <Search size={14} />
                <span className="text-xs hidden sm:block">Search coins</span>
                <kbd
                  className="text-xs bg-white/5 px-1.5 py-0.5 rounded hidden sm:block"
                  style={{ fontFamily: 'monospace' }}
                >
                  ⌘K
                </kbd>
              </button>
              <button
                onClick={() => refetch()}
                className="p-2 rounded-xl text-slate-500 hover:text-sky-400 transition-all"
                style={{ background: 'rgba(255,255,255,0.05)' }}
                title="Refresh"
              >
                <RefreshCw size={15} />
              </button>
            </div>
          </div>

          {/* Global Stats Header */}
          <GlobalHeader data={globalData} isLoading={globalLoading} />

          {/* Error Banner */}
          {isError && (
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-amber-400 text-sm"
              style={{
                background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.2)',
              }}
            >
              <AlertTriangle size={15} />
              CoinGecko rate limit reached. Please wait a moment and refresh.
              <button onClick={() => refetch()} className="ml-auto text-xs underline">
                Retry
              </button>
            </div>
          )}

          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Tab Bar */}
              <div
                className="flex gap-1"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  padding: 4,
                  borderRadius: 14,
                  width: 'fit-content',
                }}
              >
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={
                      tab === t.id
                        ? {
                            background:
                              'linear-gradient(135deg,rgba(96,165,250,0.25),rgba(167,139,250,0.25))',
                            color: '#fff',
                            boxShadow: '0 0 20px rgba(96,165,250,0.15)',
                            border: '1px solid rgba(96,165,250,0.25)',
                          }
                        : { color: '#64748b' }
                    }
                  >
                    {t.icon}
                    {t.label}
                    {t.badge != null && t.badge > 0 && (
                      <span
                        className="w-5 h-5 rounded-full text-xs flex items-center justify-center"
                        style={{
                          background: 'rgba(96,165,250,0.3)',
                          color: '#60a5fa',
                          fontSize: 9,
                        }}
                      >
                        {t.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {tab === 'market' && (
                <CoinTable
                  coins={sortedCoins}
                  loading={isLoading}
                  portfolio={portfolio}
                  onTogglePortfolio={handleTogglePortfolio}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  page={page}
                  setPage={setPage}
                />
              )}

              {tab === 'portfolio' && (
                <PortfolioView
                  portfolio={portfolio}
                  coins={coins}
                  onRemove={remove}
                />
              )}

              {tab === 'news' && (
                <div className="space-y-3">
                  {newsLoading ? (
                    [...Array(6)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
                  ) : news.length > 0 ? (
                    news.map((item, i) => <NewsCard key={i} item={item} />)
                  ) : (
                    <GlassCard className="p-8 text-center">
                      <Newspaper size={28} className="mx-auto mb-3 text-slate-600" />
                      <div className="text-slate-400 font-semibold mb-1">No news available</div>
                      <div className="text-slate-600 text-sm">
                        Add your{' '}
                        <a
                          href="https://cryptopanic.com/developers/api/"
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-400 hover:underline"
                        >
                          CryptoPanic API token
                        </a>{' '}
                        to <code className="text-sky-400">.env.local</code>
                      </div>
                    </GlassCard>
                  )}
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <Sidebar globalData={globalData} coins={coins} />
          </div>

          <div className="text-center text-xs text-slate-700 pb-4">
            Data by CoinGecko & Alternative.me · News by CryptoPanic · © Talons
          </div>
        </div>
      </div>

      {/* CMD+K Search Modal */}
      {showSearch && (
        <CommandBar coins={coins} onClose={() => setShowSearch(false)} />
      )}

      {/* Add to Portfolio Modal */}
      {addModal && (
        <AddPositionModal
          coin={addModal}
          onConfirm={add}
          onClose={() => setAddModal(null)}
        />
      )}
    </>
  );
}

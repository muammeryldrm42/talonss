'use client';
import { useState } from 'react';
import Image from 'next/image';
import { X, Plus } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import type { CoinMarket } from '@/types/coin';
import type { PortfolioEntry } from '@/types/portfolio';

interface Props {
  coin: CoinMarket;
  onConfirm: (entry: PortfolioEntry) => void;
  onClose: () => void;
}

export function AddPositionModal({ coin, onConfirm, onClose }: Props) {
  const [quantity, setQuantity] = useState('1');
  const [buyPrice, setBuyPrice] = useState(coin.current_price?.toString() ?? '');

  const handleConfirm = () => {
    onConfirm({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image,
      quantity: parseFloat(quantity) || 1,
      buyPrice: parseFloat(buyPrice) || coin.current_price,
      addedAt: Date.now(),
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
    >
      <GlassCard
        className="w-full max-w-sm p-6 space-y-4"
        style={{ border: '1px solid rgba(99,179,255,0.25)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src={coin.image} alt={coin.name} width={36} height={36} className="rounded-full" />
            <div>
              <div className="font-bold text-white">{coin.name}</div>
              <div className="text-xs text-slate-500 uppercase">{coin.symbol}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-500 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="0"
              step="any"
              className="w-full rounded-xl px-3 py-2 text-sm text-white outline-none"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
              Buy Price (USD)
            </label>
            <input
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              min="0"
              step="any"
              className="w-full rounded-xl px-3 py-2 text-sm text-white outline-none"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl text-sm text-slate-400 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2 rounded-xl text-sm font-semibold text-white transition-all"
            style={{
              background: 'linear-gradient(135deg,rgba(96,165,250,0.4),rgba(167,139,250,0.4))',
              border: '1px solid rgba(96,165,250,0.3)',
            }}
          >
            <Plus size={14} className="inline mr-1" /> Add to Portfolio
          </button>
        </div>
      </GlassCard>
    </div>
  );
}

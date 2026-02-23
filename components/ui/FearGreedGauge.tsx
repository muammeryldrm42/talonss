'use client';
import { Activity } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { Skeleton } from './Skeleton';
import type { FearGreedData } from '@/services/alternativeMe';

function getColor(v: number) {
  if (v <= 25) return '#f43f5e';
  if (v <= 45) return '#fb923c';
  if (v <= 55) return '#facc15';
  if (v <= 75) return '#a3e635';
  return '#34d399';
}

interface Props {
  data: FearGreedData | null | undefined;
  isLoading?: boolean;
}

export function FearGreedGauge({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <GlassCard className="p-5">
        <Skeleton className="h-4 w-32 mb-3" />
        <div className="flex items-center gap-4">
          <Skeleton className="w-[90px] h-[90px] rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </GlassCard>
    );
  }

  if (!data) return null;

  const v = parseInt(data.value);
  const color = getColor(v);
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (v / 100) * circ;

  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-2 mb-3">
        <Activity size={14} className="text-sky-400" />
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
          Fear & Greed
        </span>
      </div>
      <div className="flex items-center gap-4">
        <svg width={90} height={90} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={45} cy={45} r={r}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8}
          />
          <circle
            cx={45} cy={45} r={r}
            fill="none"
            stroke={color}
            strokeWidth={8}
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dasharray 0.8s ease',
              filter: `drop-shadow(0 0 6px ${color})`,
            }}
          />
        </svg>
        <div>
          <div
            className="text-3xl font-black"
            style={{
              color,
              fontFamily: "'Space Mono', monospace",
              textShadow: `0 0 20px ${color}60`,
            }}
          >
            {v}
          </div>
          <div className="text-sm font-semibold text-slate-300 mt-0.5">
            {data.value_classification}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {data.timestamp
              ? new Date(parseInt(data.timestamp) * 1000).toLocaleDateString()
              : 'Today'}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

'use client';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { Skeleton } from '@/components/ui/Skeleton';
import { fmt } from '@/lib/format';
import type { ChartPoint } from '@/types/coin';

const PERIODS = [
  { label: '1D', value: '1' },
  { label: '7D', value: '7' },
  { label: '1M', value: '30' },
  { label: '1Y', value: '365' },
];

interface Props {
  data: ChartPoint[];
  isLoading: boolean;
  period: string;
  onPeriodChange: (p: string) => void;
}

export function PriceChart({ data, isLoading, period, onPeriodChange }: Props) {
  const chartMin = data.length ? Math.min(...data.map((d) => d.price)) * 0.998 : 0;
  const chartMax = data.length ? Math.max(...data.map((d) => d.price)) * 1.002 : 0;
  const chartUp = data.length > 1 ? data[data.length - 1].price >= data[0].price : true;
  const stroke = chartUp ? '#34d399' : '#f43f5e';

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-slate-400">Price Chart</span>
        <div className="flex gap-1">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => onPeriodChange(p.value)}
              className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
              style={
                period === p.value
                  ? {
                      background: 'rgba(99,179,255,0.2)',
                      color: '#fff',
                      boxShadow: '0 0 12px rgba(99,179,255,0.2)',
                    }
                  : { color: '#64748b' }
              }
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading || !data.length ? (
        <Skeleton className="w-full h-64" />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity={0.3} />
                <stop offset="100%" stopColor={stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[chartMin, chartMax]}
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => fmt.usd(v)}
              width={80}
            />
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <Tooltip
              contentStyle={{
                background: 'rgba(15,20,40,0.95)',
                border: '1px solid rgba(99,179,255,0.2)',
                borderRadius: 12,
                color: '#fff',
                fontSize: 12,
              }}
              formatter={(v: number) => [fmt.usd(v), 'Price']}
              labelStyle={{ color: '#64748b' }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={stroke}
              strokeWidth={2}
              fill="url(#chartGrad)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

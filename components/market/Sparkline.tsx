'use client';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface Props {
  data: number[] | undefined;
}

export function Sparkline({ data }: Props) {
  if (!data || data.length < 2) {
    return (
      <div className="w-20 h-8 flex items-center justify-center text-slate-600 text-xs">
        —
      </div>
    );
  }

  const last = data[data.length - 1];
  const first = data[0];
  const up = last >= first;
  const pts = data.slice(-24).map((v) => ({ v }));

  return (
    <ResponsiveContainer width={80} height={32}>
      <LineChart data={pts}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={up ? '#34d399' : '#f43f5e'}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

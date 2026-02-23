import { ChevronUp, ChevronDown } from 'lucide-react';
import { pctColor, pctBg } from '@/lib/format';

interface Props {
  value: number | null | undefined;
}

export function PctBadge({ value }: Props) {
  if (value == null) return <span className="text-slate-500 text-xs">—</span>;
  const up = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md ${pctColor(value)} ${pctBg(value)}`}
    >
      {up ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
      {Math.abs(value).toFixed(2)}%
    </span>
  );
}

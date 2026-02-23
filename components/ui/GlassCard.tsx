import { cn } from '@/lib/utils';
import type { ReactNode, CSSProperties, MouseEventHandler } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLDivElement>;
  hover?: boolean;
}

export function GlassCard({ children, className, style, onClick, hover }: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'rgba(15,20,40,0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(99,179,255,0.12)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        ...style,
      }}
      className={cn(
        'rounded-2xl',
        hover && 'hover:border-sky-400/25 transition-all cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  );
}

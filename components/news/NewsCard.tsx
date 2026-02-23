import { ExternalLink } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import type { NewsPost } from '@/types/news';

interface Props {
  item: NewsPost;
}

export function NewsCard({ item }: Props) {
  const positive = item.votes?.positive ?? 0;
  const negative = item.votes?.negative ?? 0;
  const sentimentUp = positive > negative;

  return (
    <GlassCard hover className="p-4">
      <a href={item.url} target="_blank" rel="noreferrer" className="block">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            {/* Tags */}
            <div className="flex gap-1.5 flex-wrap mb-2">
              {item.currencies?.slice(0, 3).map((c) => (
                <span
                  key={c.code}
                  className="text-xs text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded-full"
                >
                  {c.code}
                </span>
              ))}
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  item.kind === 'news'
                    ? 'text-slate-400 bg-white/5'
                    : 'text-purple-400 bg-purple-400/10'
                }`}
              >
                {item.kind}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold text-slate-200 leading-snug group-hover:text-white transition-colors line-clamp-2">
              {item.title}
            </h3>

            {/* Meta */}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="text-xs text-slate-500">{item.source?.title}</span>
              <span className="text-xs text-slate-600">
                {item.published_at
                  ? new Date(item.published_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : ''}
              </span>
              {(positive > 0 || negative > 0) && (
                <span
                  className={`text-xs ml-auto ${sentimentUp ? 'text-emerald-400' : 'text-rose-400'}`}
                >
                  {sentimentUp ? '▲' : '▼'} {positive} positive
                </span>
              )}
            </div>
          </div>

          <ExternalLink
            size={14}
            className="text-slate-600 group-hover:text-sky-400 transition-colors flex-shrink-0 mt-1"
          />
        </div>
      </a>
    </GlassCard>
  );
}

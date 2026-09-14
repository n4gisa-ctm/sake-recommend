import { ExternalLink, Heart, ThumbsUp, ThumbsDown } from 'lucide-react';
import type { SakeStatus } from '@/types';
import { tasteLabel, type SakeInfo } from '@/data/sakeNames';

interface SakeCardsProps {
  sakes: SakeInfo[];
  getStatus: (name: string) => SakeStatus | null;
  onToggleStatus: (name: string, status: SakeStatus) => void;
}

function searchUrl(store: 'amazon' | 'rakuten', name: string): string {
  const q = encodeURIComponent(`${name} 日本酒`);
  return store === 'amazon'
    ? `https://www.amazon.co.jp/s?k=${q}`
    : `https://search.rakuten.co.jp/search/mall/${q}/`;
}

const STATUS_BUTTONS: { status: SakeStatus; label: string; Icon: typeof Heart }[] = [
  { status: 'interested', label: '気になる', Icon: Heart },
  { status: 'liked', label: '美味かった', Icon: ThumbsUp },
  { status: 'disliked', label: 'イマイチ', Icon: ThumbsDown },
];

/**
 * AIの返答から検出した銘柄を、購入リンク＋マイ酒ログ登録ボタン付きのカードで表示する。
 */
export default function SakeCards({ sakes, getStatus, onToggleStatus }: SakeCardsProps) {
  if (sakes.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mt-2 ml-11 max-w-[80%] animate-fade-in">
      {sakes.map((sake) => {
        const current = getStatus(sake.name);
        return (
          <div
            key={sake.name}
            className="glass-panel rounded-xl border border-ai-500/15 shadow-sm shadow-ai-800/5 px-3.5 py-2.5"
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-baseline gap-2">
                <span
                  className="text-sumi-900 text-sm font-bold"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {sake.name}
                </span>
                <span className="text-ai-500/80 text-[11px]">{tasteLabel(sake)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <a
                  href={searchUrl('amazon', sake.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2 py-1 rounded-lg border border-ai-500/20 text-[11px] text-sumi-500 hover:border-ai-500/45 hover:text-sumi-700 transition-colors"
                >
                  Amazon
                  <ExternalLink size={10} />
                </a>
                <a
                  href={searchUrl('rakuten', sake.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2 py-1 rounded-lg border border-ai-500/20 text-[11px] text-sumi-500 hover:border-ai-500/45 hover:text-sumi-700 transition-colors"
                >
                  楽天
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              {STATUS_BUTTONS.map(({ status, label, Icon }) => {
                const active = current === status;
                return (
                  <button
                    key={status}
                    onClick={() => onToggleStatus(sake.name, status)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] border transition-all ${
                      active
                        ? 'bg-ai-600 border-ai-600 text-washi-50'
                        : 'border-ai-500/20 text-sumi-500 hover:border-ai-500/45'
                    }`}
                  >
                    <Icon size={11} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

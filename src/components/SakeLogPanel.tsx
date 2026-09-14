import { X, Trash2, ExternalLink } from 'lucide-react';
import type { SakeLogEntry, SakeStatus } from '@/types';
import { findSake, tasteLabel } from '@/data/sakeNames';
import TasteMap from './TasteMap';

interface SakeLogPanelProps {
  log: SakeLogEntry[];
  onRemove: (name: string) => void;
  onClose: () => void;
}

const SECTIONS: { status: SakeStatus; title: string }[] = [
  { status: 'liked', title: '◎ 美味かった' },
  { status: 'interested', title: '♡ 気になる' },
  { status: 'disliked', title: '△ イマイチだった' },
];

/**
 * マイ酒ログ: 記録した銘柄の一覧と味覚マップを表示する右側ドロワー。
 */
export default function SakeLogPanel({ log, onRemove, onClose }: SakeLogPanelProps) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-sumi-900/20" onClick={onClose} />
      <aside className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm glass-panel border-l border-ai-500/15 shadow-xl shadow-ai-800/10 flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ai-500/10">
          <h2 className="text-sumi-900 text-lg font-bold" style={{ fontFamily: 'var(--font-serif)' }}>
            マイ酒ログ
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-ai-500/20 flex items-center justify-center text-sumi-500 hover:border-ai-500/45 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="chat-scroll flex-1 overflow-y-auto px-5 py-4">
          {/* 味覚マップ */}
          <h3 className="text-sumi-700 text-sm font-bold mb-2">味覚マップ</h3>
          <TasteMap log={log} />

          {/* 記録一覧 */}
          {SECTIONS.map(({ status, title }) => {
            const entries = log
              .filter((e) => e.status === status)
              .sort((a, b) => b.addedAt - a.addedAt);
            if (entries.length === 0) return null;
            return (
              <div key={status} className="mt-6">
                <h3 className="text-sumi-700 text-sm font-bold mb-2">{title}</h3>
                <ul className="space-y-1.5">
                  {entries.map((entry) => {
                    const info = findSake(entry.name);
                    return (
                      <li
                        key={entry.name}
                        className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl border border-ai-500/10 bg-washi-50/60"
                      >
                        <div className="flex items-baseline gap-2 min-w-0">
                          <span
                            className="text-sumi-900 text-sm font-bold truncate"
                            style={{ fontFamily: 'var(--font-serif)' }}
                          >
                            {entry.name}
                          </span>
                          {info && (
                            <span className="text-ai-500/80 text-[11px] flex-shrink-0">{tasteLabel(info)}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <a
                            href={`https://www.amazon.co.jp/s?k=${encodeURIComponent(`${entry.name} 日本酒`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-7 h-7 rounded-lg border border-ai-500/20 flex items-center justify-center text-sumi-500 hover:border-ai-500/45 transition-colors"
                            title="Amazonで探す"
                          >
                            <ExternalLink size={12} />
                          </a>
                          <button
                            onClick={() => onRemove(entry.name)}
                            className="w-7 h-7 rounded-lg border border-ai-500/20 flex items-center justify-center text-sumi-300 hover:text-sakura-600 hover:border-sakura-500/40 transition-colors"
                            title="記録を削除"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}

          <p className="text-sumi-300 text-[11px] leading-relaxed mt-6 pb-2">
            記録はこのブラウザにのみ保存されます。記録があると、AIへの質問に好みの傾向が自動で添えられ、レコメンドの精度が上がります。
          </p>
        </div>
      </aside>
    </>
  );
}

import type { SakeLogEntry } from '@/types';
import { findSake } from '@/data/sakeNames';

interface TasteMapProps {
  log: SakeLogEntry[];
}

const SIZE = 300;
const PAD = 34;
const RANGE = 2.2; // 味覚値 -2..2 に少し余白

/** 味覚値 (-2..2) をSVG座標へ。x: 辛口→甘口、y: 淡麗(下)→濃醇(上) */
function toXY(sweet: number, rich: number): [number, number] {
  const inner = SIZE - PAD * 2;
  const x = PAD + ((sweet + RANGE) / (RANGE * 2)) * inner;
  const y = PAD + ((RANGE - rich) / (RANGE * 2)) * inner;
  return [x, y];
}

const STATUS_STYLE = {
  liked: { fill: '#2c4a7c', stroke: 'none', label: '美味かった' },
  interested: { fill: '#f6f1e6', stroke: '#b8954a', label: '気になる' },
  disliked: { fill: '#9a938a', stroke: 'none', label: 'イマイチ' },
} as const;

/**
 * マイ酒ログの銘柄を「甘辛×濃淡」の2軸にプロットする味覚マップ。
 * 「美味かった」が2件以上あれば、その重心を好みゾーンとして表示する。
 */
export default function TasteMap({ log }: TasteMapProps) {
  const points = log
    .map((entry) => {
      const info = findSake(entry.name);
      return info ? { ...entry, sweet: info.sweet, rich: info.rich } : null;
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  const liked = points.filter((p) => p.status === 'liked');
  const centroid =
    liked.length >= 2
      ? {
          sweet: liked.reduce((sum, p) => sum + p.sweet, 0) / liked.length,
          rich: liked.reduce((sum, p) => sum + p.rich, 0) / liked.length,
        }
      : null;

  const mid = SIZE / 2;

  return (
    <div>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full max-w-[300px] mx-auto block"
        role="img"
        aria-label="味覚マップ（甘辛×濃淡）"
      >
        {/* 背景と軸 */}
        <rect x={PAD} y={PAD} width={SIZE - PAD * 2} height={SIZE - PAD * 2} rx={10} fill="rgba(44,74,124,0.04)" />
        <line x1={PAD} y1={mid} x2={SIZE - PAD} y2={mid} stroke="rgba(44,74,124,0.2)" strokeWidth={1} />
        <line x1={mid} y1={PAD} x2={mid} y2={SIZE - PAD} stroke="rgba(44,74,124,0.2)" strokeWidth={1} />

        {/* 軸ラベル */}
        <text x={PAD - 6} y={mid + 3.5} textAnchor="end" fontSize={10} fill="#5a554c">辛口</text>
        <text x={SIZE - PAD + 6} y={mid + 3.5} textAnchor="start" fontSize={10} fill="#5a554c">甘口</text>
        <text x={mid} y={PAD - 8} textAnchor="middle" fontSize={10} fill="#5a554c">濃醇</text>
        <text x={mid} y={SIZE - PAD + 15} textAnchor="middle" fontSize={10} fill="#5a554c">淡麗</text>

        {/* 好みゾーン */}
        {centroid && (() => {
          const [cx, cy] = toXY(centroid.sweet, centroid.rich);
          return (
            <g>
              <circle cx={cx} cy={cy} r={26} fill="rgba(184,149,74,0.12)" stroke="rgba(184,149,74,0.5)" strokeWidth={1} strokeDasharray="3 3" />
              <text x={cx} y={cy - 30} textAnchor="middle" fontSize={9.5} fill="#9c7d3a" fontWeight="bold">あなたの好みゾーン</text>
            </g>
          );
        })()}

        {/* 銘柄プロット */}
        {points.map((p) => {
          const [x, y] = toXY(p.sweet, p.rich);
          const style = STATUS_STYLE[p.status];
          return (
            <g key={p.name}>
              <circle
                cx={x}
                cy={y}
                r={5}
                fill={style.fill}
                stroke={style.stroke}
                strokeWidth={style.stroke === 'none' ? 0 : 1.5}
              />
              <text x={x} y={y - 8} textAnchor="middle" fontSize={9} fill="#33302b">
                {p.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* 凡例 */}
      <div className="flex items-center justify-center gap-4 mt-1">
        {(Object.keys(STATUS_STYLE) as (keyof typeof STATUS_STYLE)[]).map((key) => {
          const style = STATUS_STYLE[key];
          return (
            <span key={key} className="flex items-center gap-1.5 text-[11px] text-sumi-500">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{
                  background: style.fill,
                  border: style.stroke !== 'none' ? `1.5px solid ${style.stroke}` : 'none',
                }}
              />
              {style.label}
            </span>
          );
        })}
      </div>

      {points.length === 0 && (
        <p className="text-center text-sumi-300 text-xs mt-3 leading-relaxed">
          まだ記録がありません。
          <br />
          チャットで提案された銘柄を「気になる」「美味かった」で記録すると、ここに好みの地図ができていきます。
        </p>
      )}
    </div>
  );
}

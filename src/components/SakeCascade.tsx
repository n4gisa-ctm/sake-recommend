import { useEffect, useMemo, useState } from 'react';
import { pickSakeNames } from '@/data/sakeNames';

interface Drop {
  name: string;
  left: string;
  delay: string;
  duration: string;
  fontSize: number;
  opacity: number;
  color: string;
}

interface SakeCascadeProps {
  /**
   * ambient: ウェルカム/設定画面の背景演出（主役級に見せる）
   * chat: チャット画面のオーバーレイ（控えめ・タップで質問可能）
   */
  variant?: 'ambient' | 'chat';
}

const COLORS = ['#2c4a7c', '#4a6ba0', '#b8954a']; // 藍2種＋金
const ACCENT = '#c25e6e'; // sakura — 約1割だけ混ぜる

/** 画面幅に応じた表示単語数のバケット（幅0＝非表示中はデスクトップ扱い） */
function widthBucket(width: number): number {
  if (width <= 0) return 32;
  return width < 640 ? 16 : width < 1024 ? 24 : 32;
}

function buildDrops(variant: 'ambient' | 'chat', base: number): Drop[] {
  const count = variant === 'chat' ? Math.round(base * 0.7) : base;
  const [minOp, maxOp] = variant === 'chat' ? [0.1, 0.2] : [0.22, 0.45];

  return pickSakeNames(count).map((name, i) => {
    const duration = 12 + Math.random() * 16;
    return {
      name,
      left: `${(i * (100 / count)) + Math.random() * 2}%`,
      // 負のdelayで開始時点から画面全体に降っている状態にする
      delay: `-${(Math.random() * duration).toFixed(2)}s`,
      duration: `${duration.toFixed(2)}s`,
      fontSize: 15 + Math.random() * (variant === 'chat' ? 12 : 20),
      opacity: minOp + Math.random() * (maxOp - minOp),
      color: Math.random() < 0.1 ? ACCENT : COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  });
}

/**
 * 実在の日本酒銘柄名が縦書きのまま滝のように降ってくる背景演出。
 * 参考: Word Cascade (https://river.tango-gacha.com/)
 * チャット画面では ChatScreen 側が座標判定で data-sake 属性を拾い、
 * タップされた銘柄をAIへの質問に変換する。
 */
export default function SakeCascade({ variant = 'ambient' }: SakeCascadeProps) {
  const [bucket, setBucket] = useState(() =>
    widthBucket(typeof window !== 'undefined' ? window.innerWidth : 1024),
  );

  useEffect(() => {
    const onResize = () => setBucket(widthBucket(window.innerWidth));
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const drops = useMemo(() => buildDrops(variant, bucket), [variant, bucket]);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 overflow-hidden pointer-events-none ${
        variant === 'chat' ? 'z-[15]' : 'z-[1]'
      }`}
    >
      {drops.map((drop, i) => (
        <span
          key={i}
          data-sake={drop.name}
          className="sake-drop"
          style={{
            left: drop.left,
            animationDelay: drop.delay,
            animationDuration: drop.duration,
            fontSize: `${drop.fontSize}px`,
            color: drop.color,
            ['--max-opacity' as string]: drop.opacity,
          }}
        >
          {drop.name}
        </span>
      ))}
    </div>
  );
}

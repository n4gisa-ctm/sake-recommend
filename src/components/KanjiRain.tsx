import { useMemo } from 'react';

// Sake-related kanji —酒銘, taste descriptors, seasons, brewing terms
const KANJI_POOL = [
  '酒', '吟', '醸', '純', '米', '大', '杜', '氏',
  '甘', '辛', '芳', '醇', '燗', '冷', '純', '米',
  '櫻', '雪', '月', '花', '風', '山', '水', '光',
  '黒', '白', '赤', '錦', '福', '寿', '賀', '禧',
  '瑞', '祥', '雅', '澄', '馨', '薰', '凛', '茜',
  '楓', '菖', '葵', '雫', '滴', '波', '瀧', '澪',
  '斗', '升', '合', '石', '粕', '麹', '醪', '糟',
  '薰', '睦', '斗', '瓮', '醴', '酌', '盞', '觴',
  '香', '味', '喉', '越', '鶴', '龍', '虎', '獅',
  '牡丹', '菊', '梅', '竹', '松', '柏', '椿', '藤',
];

interface Column {
  left: string;
  chars: string[];
  delay: string;
  duration: string;
  fontSize: number;
  opacity: number;
}

export default function KanjiRain({ columns = 22 }: { columns?: number }) {
  const cols = useMemo<Column[]>(() => {
    return Array.from({ length: columns }).map((_, i) => {
      const charCount = 8 + Math.floor(Math.random() * 14);
      const chars = Array.from({ length: charCount }).map(
        () => KANJI_POOL[Math.floor(Math.random() * KANJI_POOL.length)],
      );
      return {
        left: `${(i * (100 / columns)) + (Math.random() * 3 - 1.5)}%`,
        chars,
        delay: `${Math.random() * 15}s`,
        duration: `${14 + Math.random() * 16}s`,
        fontSize: 14 + Math.random() * 20,
        opacity: 0.05 + Math.random() * 0.13,
      };
    });
  }, [columns]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {cols.map((col, i) => (
        <div
          key={i}
          className="kanji-column"
          style={{
            left: col.left,
            animationDelay: col.delay,
            animationDuration: col.duration,
            fontSize: `${col.fontSize}px`,
            fontWeight: 400,
            color: i % 5 === 0 ? '#c9a96e' : i % 7 === 0 ? '#ebb5b8' : '#d9b07a',
            ['--max-opacity' as string]: col.opacity,
          }}
        >
          {col.chars.map((ch, j) => (
            <div
              key={j}
              style={{
                opacity: Math.max(0.1, 1 - j / col.chars.length),
              }}
            >
              {ch}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

import { ArrowRight } from 'lucide-react';

interface WelcomeProps {
  onStart: () => void;
}

export default function Welcome({ onStart }: WelcomeProps) {
  return (
    <div className="min-h-screen bg-washi-radial flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-ai-400/5 blur-3xl animate-glow-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-gold-400/10 blur-3xl animate-glow-pulse"
        style={{ animationDelay: '2s' }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* Decorative kanji emblem */}
        <div className="relative mb-10 animate-fade-in">
          <div className="absolute inset-0 bg-ai-400/10 blur-2xl rounded-full scale-150 animate-glow-pulse" />
          <div
            className="relative w-28 h-28 rounded-full border border-ai-500/30 flex items-center justify-center"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            <span className="text-6xl text-ai-600 font-bold">酒</span>
          </div>
        </div>

        <p
          className="text-ai-500/70 text-sm tracking-[0.4em] uppercase mb-6 animate-fade-in-up"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Sake AI Sommelier
        </p>

        <h1
          className="text-sumi-900 text-4xl md:text-5xl font-bold leading-snug mb-6 animate-fade-in-up delay-200"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          <span className="block mb-5 md:mb-6">今日、私は</span>
          <span className="block">
            <span className="shimmer-text">日本酒</span>を好きになる
          </span>
        </h1>

        <p className="text-sumi-500 text-base leading-relaxed mb-12 animate-fade-in-up delay-400 max-w-md">
          銘柄も選び方も、わからなくて大丈夫。
          <br />
          好みやシーンを伝えるだけで、AIソムリエが
          <br className="hidden md:block" />
          あなたの一本を見つけます。
        </p>

        <button
          onClick={onStart}
          className="group relative px-10 py-4 bg-ai-600 text-washi-50 text-base font-bold rounded-full shadow-lg shadow-ai-600/25 ring-1 ring-ai-500/40 hover:bg-ai-500 hover:shadow-ai-500/30 hover:scale-105 active:scale-95 transition-all duration-300 animate-fade-in-up delay-600"
        >
          <span className="flex items-center gap-2">
            日本酒を探してみる
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </span>
        </button>

        <div className="mt-16 flex items-center gap-6 animate-fade-in delay-1000">
          {['獺祭', '久保田', '八海山'].map((tag) => (
            <span
              key={tag}
              className="text-xs text-sumi-500/60 tracking-wider"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-3 text-sumi-300/70 text-xs animate-fade-in delay-1200">
          — 聞いたことある銘柄、きっと降ってくる —
        </p>
      </div>
    </div>
  );
}

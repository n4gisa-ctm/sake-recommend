import { ArrowRight } from 'lucide-react';

interface WelcomeProps {
  onStart: () => void;
}

export default function Welcome({ onStart }: WelcomeProps) {
  return (
    <div className="min-h-screen bg-dark-radial flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl animate-glow-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-sakura-600/5 blur-3xl animate-glow-pulse"
        style={{ animationDelay: '2s' }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* Decorative kanji emblem */}
        <div className="relative mb-10 animate-fade-in">
          <div className="absolute inset-0 bg-gold-500/10 blur-2xl rounded-full scale-150 animate-glow-pulse" />
          <div
            className="relative w-28 h-28 rounded-full border border-gold-500/20 flex items-center justify-center"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            <span className="text-6xl text-gold-400/80 font-bold">酒</span>
          </div>
        </div>

        <p
          className="text-gold-400/60 text-sm tracking-[0.4em] uppercase mb-6 animate-fade-in-up"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Sake AI Sommelier
        </p>

        <h1
          className="text-cream-200 text-4xl md:text-5xl font-bold leading-snug mb-6 animate-fade-in-up delay-200"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          あなたに似合う<span className="shimmer-text">日本酒</span>を
          <br />
          いっしょに見つけよう
        </h1>

        <p className="text-cream-200/40 text-base leading-relaxed mb-12 animate-fade-in-up delay-400 max-w-md">
          気になる味やシーンを伝えるだけで、
          <br />
          あなただけの一本を提案します。
        </p>

        <button
          onClick={onStart}
          className="group relative px-10 py-4 bg-gold-500 text-night-800 text-base font-bold rounded-full shadow-lg shadow-gold-500/20 ring-1 ring-gold-400/30 hover:bg-gold-400 hover:shadow-gold-400/30 hover:scale-105 active:scale-95 transition-all duration-300 animate-fade-in-up delay-600"
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
          {['純米大吟醸', '夏酒', '熟成古酒'].map((tag) => (
            <span
              key={tag}
              className="text-xs text-cream-200/30 tracking-wider"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

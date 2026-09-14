export default function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="flex items-start gap-2.5">
        <div
          className="flex-shrink-0 w-9 h-9 rounded-full border border-gold-500/20 bg-night-600 flex items-center justify-center text-gold-400/80 text-lg font-bold"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          酒
        </div>
        <div className="glass-panel rounded-2xl rounded-tl-md px-5 py-4 border border-gold-500/10">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-gold-400 typing-dot" style={{ animationDelay: '0s' }} />
            <span className="w-2 h-2 rounded-full bg-gold-400 typing-dot" style={{ animationDelay: '0.2s' }} />
            <span className="w-2 h-2 rounded-full bg-gold-400 typing-dot" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

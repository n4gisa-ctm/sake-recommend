export default function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="flex items-start gap-2.5">
        <div
          className="flex-shrink-0 w-9 h-9 rounded-full border border-ai-500/25 bg-washi-100 flex items-center justify-center text-ai-600 text-lg font-bold"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          酒
        </div>
        <div className="glass-panel rounded-2xl rounded-tl-md px-5 py-4 border border-ai-500/15">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-ai-500 typing-dot" style={{ animationDelay: '0s' }} />
            <span className="w-2 h-2 rounded-full bg-ai-500 typing-dot" style={{ animationDelay: '0.2s' }} />
            <span className="w-2 h-2 rounded-full bg-ai-500 typing-dot" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

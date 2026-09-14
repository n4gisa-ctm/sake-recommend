import type { ChatMessage } from '@/types';
import { User } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end animate-slide-in-right">
        <div className="flex items-start gap-2.5 max-w-[80%]">
          <div className="bg-gold-500 text-night-800 rounded-2xl rounded-tr-md px-4 py-3 shadow-md shadow-gold-500/10">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mt-0.5">
            <User size={18} className="text-gold-400" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start animate-slide-in-left">
      <div className="flex items-start gap-2.5 max-w-[80%]">
        <div
          className="flex-shrink-0 w-9 h-9 rounded-full border border-gold-500/20 bg-night-600 flex items-center justify-center mt-0.5 text-gold-400/80 text-lg font-bold"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          酒
        </div>
        <div className="glass-panel text-cream-200 rounded-2xl rounded-tl-md px-4 py-3 border border-gold-500/10">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
}

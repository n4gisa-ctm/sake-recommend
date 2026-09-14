import type { ChatMessage, SakeStatus } from '@/types';
import { User } from 'lucide-react';
import { detectSakeNames } from '@/data/sakeNames';
import SakeCards from './SakeCards';

interface MessageBubbleProps {
  message: ChatMessage;
  getStatus: (name: string) => SakeStatus | null;
  onToggleStatus: (name: string, status: SakeStatus) => void;
}

/** Difyの返答に含まれる軽いMarkdown（**太字**・### 見出し）を整形する */
function renderInline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>
    ) : (
      part
    ),
  );
}

function renderContent(content: string) {
  return content.split('\n').map((line, i) => {
    const heading = line.match(/^#{1,4}\s+(.*)$/);
    if (heading) {
      return (
        <span key={i} className="block font-bold mt-2 first:mt-0">
          {renderInline(heading[1])}
        </span>
      );
    }
    if (/^\s*(---+|\*\*\*+)\s*$/.test(line)) {
      return <span key={i} className="block border-t border-ai-500/15 my-2" />;
    }
    const bullet = line.match(/^(\s*)[-*・]\s+(.*)$/);
    if (bullet) {
      return (
        <span key={i} className="block pl-4 -indent-3">
          <span className="text-ai-500/80">・</span>
          {renderInline(bullet[2])}
        </span>
      );
    }
    return (
      <span key={i} className="block min-h-[0.5em]">
        {renderInline(line)}
      </span>
    );
  });
}

export default function MessageBubble({ message, getStatus, onToggleStatus }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end animate-slide-in-right">
        <div className="flex items-start gap-2.5 max-w-[80%]">
          <div className="bg-ai-600 text-washi-50 rounded-2xl rounded-tr-md px-4 py-3 shadow-md shadow-ai-600/15">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-ai-500/10 border border-ai-500/25 flex items-center justify-center mt-0.5">
            <User size={18} className="text-ai-600" />
          </div>
        </div>
      </div>
    );
  }

  const mentionedSakes = detectSakeNames(message.content);

  return (
    <div className="animate-slide-in-left">
      <div className="flex justify-start">
        <div className="flex items-start gap-2.5 max-w-[80%]">
          <div
            className="flex-shrink-0 w-9 h-9 rounded-full border border-ai-500/25 bg-washi-100 flex items-center justify-center mt-0.5 text-ai-600 text-lg font-bold"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            酒
          </div>
          <div className="glass-panel text-sumi-700 rounded-2xl rounded-tl-md px-4 py-3 border border-ai-500/15 shadow-sm shadow-ai-800/5">
            <p className="text-sm leading-relaxed">
              {renderContent(message.content)}
            </p>
          </div>
        </div>
      </div>
      {/* 返答内で言及された実在銘柄のカード */}
      <SakeCards sakes={mentionedSakes} getStatus={getStatus} onToggleStatus={onToggleStatus} />
    </div>
  );
}

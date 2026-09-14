import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Settings, RotateCcw, AlertCircle } from 'lucide-react';
import type { ChatMessage, ChatSettings } from '@/types';
import { streamDifyChat } from '@/lib/dify';
import { generateId } from '@/lib/storage';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

interface ChatScreenProps {
  settings: ChatSettings;
  onUpdateSettings: (s: ChatSettings) => void;
  onResetSettings: () => void;
}

const SUGGESTIONS = [
  '初心者だけど、日本酒に興味があります',
  '甘めでフルーティーな日本酒が飲みたい',
  '女子会に合う日本酒を教えて',
  '魚料理に合う日本酒は？',
];

export default function ChatScreen({
  settings,
  onUpdateSettings,
  onResetSettings,
}: ChatScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<boolean>(false);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;
    setError(null);
    setInput('');
    abortRef.current = false;

    const userMsg: ChatMessage = { id: generateId(), role: 'user', content: text.trim(), timestamp: Date.now() };
    const assistantId = generateId();
    const assistantMsg: ChatMessage = { id: assistantId, role: 'assistant', content: '', timestamp: Date.now() };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsStreaming(true);

    try {
      let accumulated = '';
      let newConvId = settings.conversationId;

      for await (const chunk of streamDifyChat(settings, text.trim())) {
        if (abortRef.current) break;
        accumulated += chunk.delta;
        if (chunk.conversationId) newConvId = chunk.conversationId;
        setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content: accumulated } : m)));
      }

      if (newConvId && newConvId !== settings.conversationId) {
        onUpdateSettings({ ...settings, conversationId: newConvId });
      }

      if (!accumulated) {
        setMessages((prev) => prev.map((m) =>
          m.id === assistantId ? { ...m, content: '申し訳ありません、回答を取得できませんでした。もう一度お試しください。' } : m,
        ));
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : '通信エラーが発生しました';
      setError(msg);
      setMessages((prev) => prev.map((m) =>
        m.id === assistantId ? { ...m, content: `エラーが発生しました: ${msg}\n設定を確認してもう一度お試しください。` } : m,
      ));
    } finally {
      setIsStreaming(false);
    }
  };

  const handleNewConversation = () => {
    setMessages([]);
    setError(null);
    onUpdateSettings({ ...settings, conversationId: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen bg-dark-gradient flex flex-col relative overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-24 bg-gold-500/5 blur-3xl rounded-full pointer-events-none" />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-4 md:px-6 py-4 glass-dark border-b border-gold-500/10">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full border border-gold-500/20 bg-night-600 flex items-center justify-center text-gold-400/80 text-lg font-bold"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            酒
          </div>
          <div>
            <h1 className="text-cream-200 text-lg font-bold leading-none" style={{ fontFamily: 'var(--font-serif)' }}>
              さけAIソムリエ
            </h1>
            <p className="text-gold-400/50 text-xs mt-0.5">あなたの日本酒ガイド</p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowSettingsMenu((s) => !s)}
            className="w-10 h-10 rounded-full bg-night-600/60 border border-gold-500/15 flex items-center justify-center transition-all hover:scale-105 hover:border-gold-500/30"
          >
            <Settings size={18} className="text-cream-200/60" />
          </button>

          {showSettingsMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowSettingsMenu(false)} />
              <div className="absolute right-0 top-12 z-40 glass-panel rounded-xl border border-gold-500/15 py-1.5 min-w-[180px] animate-scale-in">
                <button
                  onClick={() => { handleNewConversation(); setShowSettingsMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-cream-200/70 hover:bg-gold-500/5 transition-colors"
                >
                  <RotateCcw size={15} className="text-gold-400/60" />
                  新しい会話
                </button>
                <div className="border-t border-gold-500/10 my-1" />
                <button
                  onClick={() => { onResetSettings(); setShowSettingsMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-cream-200/70 hover:bg-gold-500/5 transition-colors"
                >
                  <Settings size={15} className="text-gold-400/60" />
                  設定を変更
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Messages area */}
      <div ref={scrollRef} className="chat-scroll flex-1 overflow-y-auto px-4 md:px-6 py-6 relative z-10">
        <div className="max-w-2xl mx-auto space-y-4">
          {!hasMessages && (
            <div className="flex flex-col items-center justify-center py-16 animate-fade-in-up">
              <div
                className="w-20 h-20 rounded-full border border-gold-500/20 bg-night-600/50 flex items-center justify-center text-gold-400/60 text-3xl font-bold mb-6"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                酒
              </div>
              <h2 className="text-cream-200 text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
                日本酒の旅を始めましょう
              </h2>
              <p className="text-cream-200/40 text-sm text-center mb-8 max-w-xs leading-relaxed">
                何でも気軽に聞いてください。
                好みやシーンに合わせて提案します。
              </p>

              <div className="grid gap-3 w-full max-w-sm">
                {SUGGESTIONS.map((text, i) => (
                  <button
                    key={text}
                    onClick={() => sendMessage(text)}
                    className="group flex items-center gap-3 px-4 py-3 glass-panel rounded-2xl border border-gold-500/10 text-left text-sm text-cream-200/70 hover:border-gold-500/30 hover:scale-[1.02] active:scale-95 transition-all animate-fade-in-up"
                    style={{ animationDelay: `${i * 0.1 + 0.3}s` }}
                  >
                    <span className="w-7 h-7 rounded-full bg-gold-500/10 border border-gold-500/15 flex items-center justify-center text-gold-400/70 text-xs font-bold flex-shrink-0 group-hover:bg-gold-500/15 transition-colors">
                      {i + 1}
                    </span>
                    {text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasMessages && messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)}

          {isStreaming && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && messages[messages.length - 1].content === '' && <TypingIndicator />}

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-900/30 border border-red-400/20 rounded-xl text-red-300 text-sm animate-scale-in">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="relative z-10 px-4 md:px-6 pb-4 pt-2">
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 glass-panel rounded-2xl border border-gold-500/10 p-2 focus-within:border-gold-500/25 transition-all"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
              }}
              placeholder="メッセージを入力…"
              rows={1}
              disabled={isStreaming}
              className="flex-1 resize-none px-3 py-2.5 text-sm text-cream-200 placeholder:text-cream-200/20 bg-transparent focus:outline-none max-h-32"
              style={{ minHeight: '42px' }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-gold-500 text-night-800 flex items-center justify-center shadow-md hover:shadow-gold-500/20 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100 disabled:shadow-none transition-all"
            >
              <Send size={18} />
            </button>
          </form>
          <p className="text-center text-cream-200/20 text-xs mt-2">Enterで送信 / Shift+Enterで改行</p>
        </div>
      </div>
    </div>
  );
}

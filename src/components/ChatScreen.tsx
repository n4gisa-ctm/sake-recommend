import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Settings, RotateCcw, AlertCircle, Wine, BookOpen } from 'lucide-react';
import type { ChatMessage, ChatSettings, SakeLogEntry, SakeStatus } from '@/types';
import { streamDifyChat } from '@/lib/dify';
import { generateId } from '@/lib/storage';
import { loadLog, saveLog, toggleStatus, statusOf, buildPreferenceContext } from '@/lib/sakeLog';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import SakeLogPanel from './SakeLogPanel';

interface ChatScreenProps {
  settings: ChatSettings;
  envConfigured: boolean;
  onUpdateSettings: (s: ChatSettings) => void;
  onResetSettings: () => void;
}

const SUGGESTIONS = [
  '日本酒初心者。まず何から飲めばいい？',
  '居酒屋でスマートに頼める一本を教えて',
  '獺祭って何がすごいの？',
  '焼き鳥や刺身に合う日本酒は？',
];

/** タップ位置に降っている銘柄（data-sake要素）があれば名前を返す */
function findSakeAtPoint(x: number, y: number): string | null {
  const TOLERANCE = 10; // 縦書きで細長いため、当たり判定を少し広げる
  const drops = document.querySelectorAll<HTMLElement>('[data-sake]');
  for (const el of drops) {
    const rect = el.getBoundingClientRect();
    if (
      x >= rect.left - TOLERANCE &&
      x <= rect.right + TOLERANCE &&
      y >= rect.top - TOLERANCE &&
      y <= rect.bottom + TOLERANCE
    ) {
      return el.dataset.sake ?? null;
    }
  }
  return null;
}

export default function ChatScreen({
  settings,
  envConfigured,
  onUpdateSettings,
  onResetSettings,
}: ChatScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [sakeLog, setSakeLog] = useState<SakeLogEntry[]>(loadLog);
  const [showLogPanel, setShowLogPanel] = useState(false);

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

    // マイ酒ログの好み傾向を質問に自動で添える（画面上のメッセージには表示しない）
    const preference = buildPreferenceContext(sakeLog);
    const query = preference ? `${text.trim()}\n\n${preference}` : text.trim();

    try {
      let accumulated = '';
      let newConvId = settings.conversationId;

      for await (const chunk of streamDifyChat(settings, query)) {
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

  /** 背景に降ってくる銘柄名をタップしたら、その銘柄について質問する */
  const handleBackgroundClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button, a, input, textarea, form')) return;
    if (isStreaming) return;
    const name = findSakeAtPoint(e.clientX, e.clientY);
    if (name) {
      sendMessage(`「${name}」ってどんな日本酒？初心者にもわかるように教えて`);
    }
  };

  const handleNewConversation = () => {
    setMessages([]);
    setError(null);
    onUpdateSettings({ ...settings, conversationId: '' });
  };

  const handleToggleStatus = (name: string, status: SakeStatus) => {
    setSakeLog((prev) => {
      const next = toggleStatus(prev, name, status);
      saveLog(next);
      return next;
    });
  };

  const handleRemoveLog = (name: string) => {
    setSakeLog((prev) => {
      const next = prev.filter((e) => e.name !== name);
      saveLog(next);
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const hasMessages = messages.length > 0;

  return (
    <div
      className="min-h-screen bg-washi-gradient flex flex-col relative overflow-hidden"
      onClick={handleBackgroundClick}
    >
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-24 bg-ai-400/8 blur-3xl rounded-full pointer-events-none" />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-4 md:px-6 py-4 glass-header border-b border-ai-500/15">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full border border-ai-500/25 bg-washi-100 flex items-center justify-center text-ai-600 text-lg font-bold"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            酒
          </div>
          <div>
            <h1 className="text-sumi-900 text-lg font-bold leading-none" style={{ fontFamily: 'var(--font-serif)' }}>
              さけAIソムリエ
            </h1>
            <p className="text-ai-500/70 text-xs mt-0.5">あなたの日本酒ガイド</p>
          </div>
        </div>

        <div className="relative flex items-center gap-2">
          <button
            onClick={() => setShowLogPanel(true)}
            className="relative w-10 h-10 rounded-full bg-washi-50/70 border border-ai-500/20 flex items-center justify-center transition-all hover:scale-105 hover:border-ai-500/40"
            title="マイ酒ログ"
          >
            <BookOpen size={18} className="text-ai-600/80" />
            {sakeLog.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-ai-600 text-washi-50 text-[10px] font-bold flex items-center justify-center">
                {sakeLog.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowSettingsMenu((s) => !s)}
            className="w-10 h-10 rounded-full bg-washi-50/70 border border-ai-500/20 flex items-center justify-center transition-all hover:scale-105 hover:border-ai-500/40"
          >
            <Settings size={18} className="text-sumi-500" />
          </button>

          {showSettingsMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowSettingsMenu(false)} />
              <div className="absolute right-0 top-12 z-40 glass-panel rounded-xl border border-ai-500/15 shadow-lg shadow-ai-800/5 py-1.5 min-w-[180px] animate-scale-in">
                <button
                  onClick={() => { handleNewConversation(); setShowSettingsMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-sumi-700 hover:bg-ai-500/5 transition-colors"
                >
                  <RotateCcw size={15} className="text-ai-500/80" />
                  新しい会話
                </button>
                {!envConfigured && (
                  <>
                    <div className="border-t border-ai-500/10 my-1" />
                    <button
                      onClick={() => { onResetSettings(); setShowSettingsMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-sumi-700 hover:bg-ai-500/5 transition-colors"
                    >
                      <Settings size={15} className="text-ai-500/80" />
                      設定を変更
                    </button>
                  </>
                )}
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
                className="w-20 h-20 rounded-full border border-ai-500/25 bg-washi-50/60 flex items-center justify-center text-ai-600/80 text-3xl font-bold mb-6"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                酒
              </div>
              <h2 className="text-sumi-900 text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
                日本酒の旅を始めましょう
              </h2>
              <p className="text-sumi-500 text-sm text-center mb-8 max-w-xs leading-relaxed">
                何でも気軽に聞いてください。
                好みやシーンに合わせて提案します。
              </p>

              <div className="grid gap-3 w-full max-w-sm">
                {SUGGESTIONS.map((text, i) => (
                  <button
                    key={text}
                    onClick={() => sendMessage(text)}
                    className="group flex items-center gap-3 px-4 py-3 glass-panel rounded-2xl border border-ai-500/15 shadow-sm shadow-ai-800/5 text-left text-sm text-sumi-700 hover:border-ai-500/40 hover:scale-[1.02] active:scale-95 transition-all animate-fade-in-up"
                    style={{ animationDelay: `${i * 0.1 + 0.3}s` }}
                  >
                    <span className="w-7 h-7 rounded-full bg-ai-500/10 border border-ai-500/20 flex items-center justify-center text-ai-600 text-xs font-bold flex-shrink-0 group-hover:bg-ai-500/15 transition-colors">
                      {i + 1}
                    </span>
                    {text}
                  </button>
                ))}
              </div>

              <p className="mt-8 flex items-center gap-1.5 text-sumi-300 text-xs animate-fade-in delay-800">
                <Wine size={13} className="text-ai-500/60" />
                降ってくる銘柄をタップすると、その日本酒について聞けます
              </p>
            </div>
          )}

          {hasMessages && messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              getStatus={(name) => statusOf(sakeLog, name)}
              onToggleStatus={handleToggleStatus}
            />
          ))}

          {isStreaming && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && messages[messages.length - 1].content === '' && <TypingIndicator />}

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-sakura-300/20 border border-sakura-500/40 rounded-xl text-sakura-600 text-sm animate-scale-in">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="relative z-20 px-4 md:px-6 pb-4 pt-2">
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 glass-panel rounded-2xl border border-ai-500/20 shadow-sm shadow-ai-800/5 p-2 focus-within:border-ai-500/45 transition-all"
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
              className="flex-1 resize-none px-3 py-2.5 text-sm text-sumi-900 placeholder:text-sumi-300/70 bg-transparent focus:outline-none max-h-32"
              style={{ minHeight: '42px' }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-ai-600 text-washi-50 flex items-center justify-center shadow-md hover:shadow-ai-600/25 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100 disabled:shadow-none transition-all"
            >
              <Send size={18} />
            </button>
          </form>
          <p className="text-center text-sumi-300/80 text-xs mt-2">Enterで送信 / Shift+Enterで改行</p>
        </div>
      </div>

      {/* マイ酒ログ（味覚マップ＋記録一覧） */}
      {showLogPanel && (
        <SakeLogPanel
          log={sakeLog}
          onRemove={handleRemoveLog}
          onClose={() => setShowLogPanel(false)}
        />
      )}
    </div>
  );
}

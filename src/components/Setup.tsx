import { useState } from 'react';
import { Link2, Key, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import type { ChatSettings } from '@/types';

interface SetupProps {
  onComplete: (settings: ChatSettings) => void;
  onBack: () => void;
}

export default function Setup({ onComplete, onBack }: SetupProps) {
  const [apiKey, setApiKey] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [errors, setErrors] = useState<{ apiKey?: string; apiUrl?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { apiKey?: string; apiUrl?: string } = {};
    if (!apiKey.trim()) newErrors.apiKey = 'APIキーを入力してください';
    if (!apiUrl.trim()) newErrors.apiUrl = 'API URLを入力してください';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    onComplete({
      difyApiKey: apiKey.trim(),
      difyApiUrl: apiUrl.trim(),
      conversationId: '',
    });
  };

  return (
    <div className="min-h-screen bg-dark-radial flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-md">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-cream-200/40 hover:text-cream-200/70 text-sm mb-8 transition-colors animate-fade-in"
        >
          <ArrowLeft size={16} />
          戻る
        </button>

        <div className="glass-panel rounded-3xl border border-gold-500/10 p-8 animate-scale-in">
          <h2
            className="text-cream-200 text-2xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            チャットの準備
          </h2>
          <p className="text-cream-200/40 text-sm mb-8 leading-relaxed">
            Difyで作成したチャットボットのAPI情報を入力してください。
            ここで入力した情報は、あなたのブラウザにのみ保存されます。
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-cream-200/70 text-sm font-medium mb-2">
                <Link2 size={16} className="text-gold-400" />
                API URL
              </label>
              <input
                type="url"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://api.dify.ai/v1"
                className={`w-full px-4 py-3 rounded-xl border bg-night-900/50 text-sm text-cream-200 placeholder:text-cream-200/20 focus:outline-none focus:ring-2 transition-all ${
                  errors.apiUrl
                    ? 'border-red-400/40 focus:ring-red-400/20'
                    : 'border-gold-500/15 focus:border-gold-400/40 focus:ring-gold-400/10'
                }`}
              />
              {errors.apiUrl && <p className="text-red-400/70 text-xs mt-1.5">{errors.apiUrl}</p>}
              <p className="text-cream-200/30 text-xs mt-1.5">Difyの「APIアクセス」ページにあるエンドポイントURL</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-cream-200/70 text-sm font-medium mb-2">
                <Key size={16} className="text-gold-400" />
                APIキー
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="app-xxxxxxxxxxxxxxxxx"
                className={`w-full px-4 py-3 rounded-xl border bg-night-900/50 text-sm text-cream-200 placeholder:text-cream-200/20 focus:outline-none focus:ring-2 transition-all ${
                  errors.apiKey
                    ? 'border-red-400/40 focus:ring-red-400/20'
                    : 'border-gold-500/15 focus:border-gold-400/40 focus:ring-gold-400/10'
                }`}
              />
              {errors.apiKey && <p className="text-red-400/70 text-xs mt-1.5">{errors.apiKey}</p>}
              <p className="text-cream-200/30 text-xs mt-1.5">Difyの「APIアクセス」ページで取得したAPIシークレットキー</p>
            </div>

            <button
              type="submit"
              className="group w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gold-500 text-night-800 text-base font-bold rounded-xl shadow-lg shadow-gold-500/20 ring-1 ring-gold-400/30 hover:bg-gold-400 hover:shadow-gold-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              チャットを始める
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gold-500/10">
            <div className="flex items-start gap-2 text-cream-200/30 text-xs leading-relaxed">
              <Check size={14} className="text-gold-400/60 mt-0.5 flex-shrink-0" />
              <span>入力した情報はサーバーに送信されず、お使いのブラウザ内にのみ保存されます。いつでも設定から変更・削除できます。</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

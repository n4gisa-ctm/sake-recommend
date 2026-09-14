import type { ChatSettings } from '@/types';

/**
 * ビルド時の環境変数から Dify 接続設定を取得する。
 * 設定済みならユーザーは設定画面を経由せずにチャットを開始できる。
 */
export function getEnvSettings(): ChatSettings | null {
  const apiUrl = import.meta.env.VITE_DIFY_API_URL;
  const apiKey = import.meta.env.VITE_DIFY_API_KEY;
  if (!apiUrl || !apiKey) return null;
  return {
    difyApiUrl: apiUrl,
    difyApiKey: apiKey,
    conversationId: '',
  };
}

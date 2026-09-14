import { useState } from 'react';
import type { AppPhase, ChatSettings } from '@/types';
import { loadSettings, saveSettings, clearSettings } from '@/lib/storage';
import { getEnvSettings } from '@/lib/config';
import SakeCascade from '@/components/SakeCascade';
import Welcome from '@/components/Welcome';
import Setup from '@/components/Setup';
import ChatScreen from '@/components/ChatScreen';

function resolveSettings(): ChatSettings | null {
  const env = getEnvSettings();
  const saved = loadSettings();
  if (env) {
    // APIキーは環境変数を正とし、会話の継続IDだけ引き継ぐ
    return { ...env, conversationId: saved?.conversationId ?? '' };
  }
  if (saved && saved.difyApiKey && saved.difyApiUrl) return saved;
  return null;
}

function App() {
  const [phase, setPhase] = useState<AppPhase>('welcome');
  const [settings, setSettings] = useState<ChatSettings | null>(resolveSettings);
  const envConfigured = getEnvSettings() !== null;

  const handleStart = () => {
    const resolved = resolveSettings();
    if (resolved) {
      setSettings(resolved);
      setPhase('chat');
    } else {
      setPhase('setup');
    }
  };

  const handleSetupComplete = (s: ChatSettings) => {
    saveSettings(s);
    setSettings(s);
    setPhase('chat');
  };

  const handleUpdateSettings = (s: ChatSettings) => {
    saveSettings(s);
    setSettings(s);
  };

  const handleResetSettings = () => {
    clearSettings();
    setSettings(null);
    setPhase('welcome');
  };

  const handleBack = () => {
    setPhase('welcome');
  };

  return (
    <>
      {/* 銘柄カスケード：全画面共通の演出。チャットではタップで質問できる */}
      <SakeCascade variant={phase === 'chat' ? 'chat' : 'ambient'} />

      {phase === 'welcome' && <Welcome onStart={handleStart} />}

      {phase === 'setup' && <Setup onComplete={handleSetupComplete} onBack={handleBack} />}

      {phase === 'chat' && settings && (
        <ChatScreen
          settings={settings}
          envConfigured={envConfigured}
          onUpdateSettings={handleUpdateSettings}
          onResetSettings={handleResetSettings}
        />
      )}
    </>
  );
}

export default App;

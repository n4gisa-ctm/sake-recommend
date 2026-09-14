import { useState, useEffect } from 'react';
import type { AppPhase, ChatSettings } from '@/types';
import { loadSettings, saveSettings, clearSettings } from '@/lib/storage';
import KanjiRain from '@/components/KanjiRain';
import Welcome from '@/components/Welcome';
import Setup from '@/components/Setup';
import ChatScreen from '@/components/ChatScreen';

function App() {
  const [phase, setPhase] = useState<AppPhase>('welcome');
  const [settings, setSettings] = useState<ChatSettings | null>(null);

  useEffect(() => {
    const saved = loadSettings();
    if (saved && saved.difyApiKey && saved.difyApiUrl) {
      setSettings(saved);
      setPhase('chat');
    }
  }, []);

  const handleStart = () => {
    const saved = loadSettings();
    if (saved && saved.difyApiKey && saved.difyApiUrl) {
      setSettings(saved);
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
      {/* Kanji rain on all screens for ambient atmosphere */}
      <KanjiRain />

      {phase === 'welcome' && <Welcome onStart={handleStart} />}

      {phase === 'setup' && <Setup onComplete={handleSetupComplete} onBack={handleBack} />}

      {phase === 'chat' && settings && (
        <ChatScreen
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onResetSettings={handleResetSettings}
        />
      )}
    </>
  );
}

export default App;

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: number;
}

export type AppPhase = 'welcome' | 'setup' | 'chat';

export interface DifyConfig {
  apiKey: string;
  apiUrl: string;
}

export interface ChatSettings {
  difyApiKey: string;
  difyApiUrl: string;
  conversationId: string;
}

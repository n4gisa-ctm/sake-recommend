import type { ChatSettings } from '@/types';

interface DifyResponse {
  conversation_id: string;
  answer: string;
  message_id: string;
}

interface DifyStreamEvent {
  event: string;
  conversation_id?: string;
  message_id?: string;
  answer?: string;
}

/**
 * Send a message to a Dify chat-bot API.
 * Uses streaming (SSE) when supported, falls back to a plain JSON POST.
 */
export async function* streamDifyChat(
  settings: ChatSettings,
  message: string,
): AsyncGenerator<{ delta: string; conversationId?: string }> {
  const url = `${settings.difyApiUrl.replace(/\/$/, '')}/chat-messages`;

  const body = {
    inputs: {},
    query: message,
    response_mode: 'streaming',
    conversation_id: settings.conversationId || '',
    user: 'sake-ai-web-user',
  };

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.difyApiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`Dify API error ${resp.status}: ${text}`);
  }

  // If the server doesn't stream, fall back to JSON
  const contentType = resp.headers.get('content-type') || '';
  if (!contentType.includes('text/event-stream')) {
    const data: DifyResponse = await resp.json();
    yield {
      delta: data.answer,
      conversationId: data.conversation_id,
    };
    return;
  }

  const reader = resp.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const jsonStr = trimmed.slice(5).trim();
      if (!jsonStr) continue;
      try {
        const evt: DifyStreamEvent = JSON.parse(jsonStr);
        if (evt.event === 'message' && evt.answer) {
          yield {
            delta: evt.answer,
            conversationId: evt.conversation_id,
          };
        }
      } catch {
        // skip malformed chunk
      }
    }
  }
}

/** Non-streaming fallback (kept for simple setups) */
export async function sendDifyChat(
  settings: ChatSettings,
  message: string,
): Promise<{ answer: string; conversationId: string }> {
  const url = `${settings.difyApiUrl.replace(/\/$/, '')}/chat-messages`;

  const body = {
    inputs: {},
    query: message,
    response_mode: 'blocking',
    conversation_id: settings.conversationId || '',
    user: 'sake-ai-web-user',
  };

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.difyApiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`Dify API error ${resp.status}: ${text}`);
  }

  const data: DifyResponse = await resp.json();
  return {
    answer: data.answer,
    conversationId: data.conversation_id,
  };
}

import type { SakeLogEntry, SakeStatus } from '@/types';

const LOG_KEY = 'sake-ai-log';

export function loadLog(): SakeLogEntry[] {
  try {
    const raw = localStorage.getItem(LOG_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLog(log: SakeLogEntry[]): void {
  try {
    localStorage.setItem(LOG_KEY, JSON.stringify(log));
  } catch {
    // ignore
  }
}

/** 記録を追加/変更する。同じ status を再指定した場合は解除（削除）する */
export function toggleStatus(log: SakeLogEntry[], name: string, status: SakeStatus): SakeLogEntry[] {
  const existing = log.find((e) => e.name === name);
  if (existing?.status === status) {
    return log.filter((e) => e.name !== name);
  }
  const entry: SakeLogEntry = { name, status, addedAt: existing?.addedAt ?? Date.now() };
  return [...log.filter((e) => e.name !== name), entry];
}

export function statusOf(log: SakeLogEntry[], name: string): SakeStatus | null {
  return log.find((e) => e.name === name)?.status ?? null;
}

/**
 * 記録をDifyへの質問に添える一文にする（記録が空なら null）。
 * レコメンドのパーソナライズに使う。
 */
export function buildPreferenceContext(log: SakeLogEntry[]): string | null {
  if (log.length === 0) return null;
  const pick = (status: SakeStatus) =>
    log.filter((e) => e.status === status).slice(-8).map((e) => e.name);
  const liked = pick('liked');
  const disliked = pick('disliked');
  const interested = pick('interested');
  const parts: string[] = [];
  if (liked.length) parts.push(`美味しかった: ${liked.join('、')}`);
  if (disliked.length) parts.push(`好みに合わなかった: ${disliked.join('、')}`);
  if (interested.length) parts.push(`気になっている: ${interested.join('、')}`);
  if (parts.length === 0) return null;
  return `（参考: 私のこれまでの日本酒の記録 — ${parts.join(' / ')}。この好みの傾向も踏まえて提案してください）`;
}

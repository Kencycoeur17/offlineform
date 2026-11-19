export type Draft<T> = { version: 1; savedAt: number; values: T };
export interface DraftStorage { getItem(key: string): string | null; setItem(key: string, value: string): void; removeItem(key: string): void; }
export function saveDraft<T>(storage: DraftStorage, key: string, values: T, now = Date.now()): void {
  storage.setItem(key, JSON.stringify({ version: 1, savedAt: now, values } satisfies Draft<T>));
}
export function readDraft<T>(storage: DraftStorage, key: string, maxAgeMs?: number, now = Date.now()): T | null {
  try {
    const raw = storage.getItem(key);
    if (!raw) return null;
    const draft: unknown = JSON.parse(raw);
    if (!draft || typeof draft !== "object") return null;
    const d = draft as Partial<Draft<T>>;
    if (d.version !== 1 || typeof d.savedAt !== "number" || !("values" in d)) return null;
    if (maxAgeMs !== undefined && (now - d.savedAt > maxAgeMs || now < d.savedAt)) return null;
    return d.values as T;
  } catch { return null; }
}

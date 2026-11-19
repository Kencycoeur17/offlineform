import { useCallback, useEffect, useRef, useState } from "react";
import { readDraft, saveDraft, type DraftStorage } from "./storage.js";

export type DraftStatus = "idle" | "saved" | "error";
export interface OfflineFormOptions<T extends Record<string, unknown>> {
  key: string;
  initialValues: T;
  persistence?: "none" | "local";
  maxAgeMs?: number;
  storage?: DraftStorage;
}

export function useOfflineForm<T extends Record<string, unknown>>(options: OfflineFormOptions<T>) {
  const { key, initialValues, persistence = "none", maxAgeMs, storage } = options;
  const [values, setValues] = useState<T>(initialValues);
  const [status, setStatus] = useState<DraftStatus>("idle");
  const [hydratedKey, setHydratedKey] = useState<string | null>(null);
  const initialRef = useRef(initialValues);
  const skipNextSave = useRef(false);

  const getStorage = useCallback((): DraftStorage | undefined => {
    if (persistence !== "local") return undefined;
    if (storage) return storage;
    try { return typeof window === "undefined" ? undefined : window.localStorage; }
    catch { return undefined; }
  }, [persistence, storage]);

  useEffect(() => {
    const target = getStorage();
    const draft = target ? readDraft<T>(target, key, maxAgeMs) : null;
    setValues(draft ?? initialRef.current);
    setStatus("idle");
    setHydratedKey(key);
  }, [getStorage, key, maxAgeMs]);

  useEffect(() => {
    if (hydratedKey !== key || persistence !== "local") return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    const target = getStorage();
    if (!target) { setStatus("error"); return; }
    try { saveDraft(target, key, values); setStatus("saved"); }
    catch { setStatus("error"); }
  }, [values, hydratedKey, persistence, key, getStorage]);

  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues(previous => ({ ...previous, [field]: value }));
  }, []);

  const clearDraft = useCallback(() => {
    try { getStorage()?.removeItem(key); }
    catch { setStatus("error"); return; }
    skipNextSave.current = true;
    setValues({ ...initialRef.current });
    setStatus("idle");
  }, [getStorage, key]);

  return { values, setValues, setValue, status, ready: hydratedKey === key, clearDraft };
}

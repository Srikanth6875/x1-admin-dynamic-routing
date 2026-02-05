import { AsyncLocalStorage } from "node:async_hooks";

type ContextStore = Map<string, unknown>;
const asyncLocalStorage = new AsyncLocalStorage<ContextStore>();

export function runWithRequestContext<T>(initialValues: Record<string, unknown>, callback: () => Promise<T>): Promise<T> {
  const store = new Map<string, unknown>(Object.entries(initialValues));
  return asyncLocalStorage.run(store, callback);
}

export function setRequestContext(key: string, value: unknown): void {
  const store = asyncLocalStorage.getStore();
  if (!store) throw new Error("RequestContext not initialized");
  // console.log("ccccccccccc", key, value);
  store.set(key, value);
}

export function getRequestContext<T = unknown>(key: string): T | undefined {
  const store = asyncLocalStorage.getStore();
  // console.log("$$$$$$$$$$$$$$", store);
  if (!store) throw new Error("RequestContext not initialized");
  return store.get(key) as T | undefined;
}


import { AsyncLocalStorage } from "node:async_hooks";
/**
 * We use requestStore (AsyncLocalStorage) to hold request-scoped data
 * like formData and query params,
 * This avoids passing payloads through every layer and keeps routes clean.
 * Data is isolated per request and safe for concurrent users.
 * Services can access request data consistently without tight coupling.
 */

export interface RequestStoreData {
  /** Parsed POST / Form data */
  formData: Record<string, unknown>;

  /** Parsed query string (?a=1&b=2) */
  query: Record<string, string>;
}

/**
 * RequestStore
 * -------------
 * Acts like PHP's $_POST / $_GET but is:
 * - request scoped
 * - concurrency safe
 * - async safe
 */
class RequestStore {
  private storage = new AsyncLocalStorage<RequestStoreData>();

  /**
   * Initialize store for a single request
   */
  run<T>(data: RequestStoreData, callback: () => Promise<T>): Promise<T> {
    return this.storage.run(data, callback);
  }

  /**
   * Get current request store
   */
  get(): RequestStoreData {
    const store = this.storage.getStore();
    if (!store) {
      throw new Error(
        "RequestStore not initialized. Did you forget to call RequestStore.run()?",
      );
    }
    return store;
  }

  /**
   * Safe getter (returns undefined instead of throwing)
   */
  tryGet(): RequestStoreData | undefined {
    return this.storage.getStore();
  }
}

/** Singleton instance */
export const requestStore = new RequestStore();

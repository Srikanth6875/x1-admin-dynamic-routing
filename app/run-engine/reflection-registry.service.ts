import { getEnvKey } from "~/shared/util-helper";

/* -------------------------------------------------------
 * Reflection Registry – DEV reload / PROD singleton
 * ----------------------------------------------------- */
type AnyClass<T = unknown> = new () => T;
class ReflectionService {
  private ReflectionClasses = new Map<string, AnyClass>();
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  /**
   * Runs the reflection engine exactly once per lifecycle.
   * Safe to call multiple times.
   */
  runEngine(): Promise<void> {
    if (!this.initPromise) {
      this.initPromise = this.init_Engine();
    }
    return this.initPromise;
  }

  private async init_Engine(): Promise<void> {
    const isDev = getEnvKey("NODE_ENV") === "development";

    // In prod, never re-run once initialized
    if (!isDev && this.initialized) return;

    this.ReflectionClasses.clear();
    const serviceFiles = await import("~/server/x1-apps/admin-includes");

    for (const key of Object.keys(serviceFiles)) {
      this.registerClass(serviceFiles[key as keyof typeof serviceFiles]);
    }
    this.initialized = true;
  }

  private registerClass(target: unknown) {
    if (!this.isES6Class(target)) return;

    const name = (target as AnyClass).name;
    if (!name) return;

    this.ReflectionClasses.set(name, target as AnyClass);
  }

  private isES6Class(value: unknown): value is AnyClass {
    return (typeof value === "function" && Function.prototype.toString.call(value).startsWith("class "));
  }

  private getClassInstance<T = unknown>(name: string): T | null {
    const ClassRef = this.ReflectionClasses.get(name);

    if (!ClassRef) {
      console.warn(`[Reflection] Class not registered: ${name}`);
      return null;
    }

    return new ClassRef() as T;
  }

  async executeReflectionEngine<T = unknown>(className: string, methodName: string): Promise<T> {
    if (!className || !methodName) {
      throw new Response("Reflection execution requires className and methodName", { status: 400 });
    }

    // Always safe — already initialized at startup
    await this.runEngine();

    const instance = this.getClassInstance<Record<string, unknown>>(className);
    if (!instance) {
      throw new Response(`Reflection class not registered: ${className}`, { status: 500 });
    }

    const method = instance[methodName];
    if (typeof method !== "function") {
      throw new Response(`Reflection method not found: ${className}.${methodName}`, { status: 500 });
    }

    try {
      return (await (method as () => T).call(instance)) as T;
    } catch (err) {
      console.error("[Reflection Error]", err);
      return [] as unknown as T;
    }
  }

  listAllClasses(): string[] {
    return [...this.ReflectionClasses.keys()];
  }
}

/* -------------------------------------------------------
 * Global Singleton
 * ----------------------------------------------------- */

declare global {
  // eslint-disable-next-line no-var
  var __ReflectionRegistry__: ReflectionService | undefined;
}

const isDev = getEnvKey("NODE_ENV") === "development";
export const ReflectionRegistry: ReflectionService = isDev
  ? new ReflectionService() // fresh on every HMR reload
  : (global.__ReflectionRegistry__ ??= new ReflectionService());


// auto-init
// void ReflectionRegistry.runEngine();

/* -------------------------------------------------------
 * Explicit Bootstrap API (IMPORTANT)
 * ----------------------------------------------------- */

export function bootstrapReflectionRegistry(): Promise<void> {
  return ReflectionRegistry.runEngine();
}


if (isDev) {
  void (async () => {
    await ReflectionRegistry.runEngine();
    console.warn("[Reflection][DEV] Registered Classes:", ReflectionRegistry.listAllClasses());
  })();
}

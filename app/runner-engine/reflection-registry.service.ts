/* -------------------------------------------------------
 * Reflection Registry – DEV reload / PROD singleton
 * ----------------------------------------------------- */
type AnyClass = new (...args: any[]) => any;

class ReflectionService {
  private ReflectionClasses = new Map<string, AnyClass>();
  private initialized = false;

  async runEngine(): Promise<void> {
    const isDev = process.env.NODE_ENV === "development";

    if (!isDev && this.initialized) return;
    this.ReflectionClasses.clear();

    const serviceFiles = await import("~/x1-apps/admin-includes");

    for (const key of Object.keys(serviceFiles)) {
      this.registerClass((serviceFiles as any)[key]);
    }
    this.initialized = true;
  }

  private registerClass(target: unknown) {
    if (!this.isES6Class(target)) return;

    const name = (target as AnyClass).name;
    if (!name) return;

    this.ReflectionClasses.set(name, target as AnyClass);
  }

  private isES6Class(value: unknown): boolean {
    return (typeof value === "function" && Function.prototype.toString.call(value).startsWith("class "));
  }

  private getClassInstance<T = any>(name: string): T | null {
    const ClassRef = this.ReflectionClasses.get(name);

    if (!ClassRef) {
      console.warn(`[Reflection] Class not registered: ${name}`);
      return null;
    }

    return new ClassRef();
  }

  async executeReflectionEngine<T = any>(className: string, methodName: string, args: any[] = []): Promise<T> {
    if (!className || !methodName) return [] as T;
    await this.runEngine();

    const instance = this.getClassInstance(className);
    if (!instance) return [] as T;

    const method = (instance as any)[methodName];

    if (typeof method !== "function") {
      console.warn(`[Reflection] Method not found: ${className}.${methodName}`);
      return [] as T;
    }

    try {
      return (await method.apply(instance, args)) ?? ([] as T);
    } catch (err) {
      console.error("[Reflection Error]", err);
      return [] as T;
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
  var __ReflectionRegistry__: ReflectionService | undefined;
}

const isDev = process.env.NODE_ENV === "development";

export const ReflectionRegistry: ReflectionService = isDev ? new ReflectionService() // new instance every reload
  : (global.__ReflectionRegistry__ ??= new ReflectionService());

// auto-init
void ReflectionRegistry.runEngine();

if (isDev) {
  void (async () => {
    await ReflectionRegistry.runEngine();
    console.log("[Reflection][DEV] Registered Classes:", ReflectionRegistry.listAllClasses());
  })();
}


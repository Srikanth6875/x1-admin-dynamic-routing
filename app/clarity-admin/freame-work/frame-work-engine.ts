import type { Knex } from "knex";
import { getShellEngine } from "~/database/pg-connector.server";
export abstract class ShellEngine {
  protected readonly sql_query: Knex;
  protected constructor() {
    this.sql_query = getShellEngine();
  }

  protected async executeQuery<T>(query: Knex.QueryBuilder): Promise<T[]> {
    return await query;
  }

  protected async executeRawQuery<T = any>(
    sql: string,
    bindings?: Knex.RawBinding[] | Record<string, any>,
  ): Promise<T[]> {
    const result = bindings
      ? await this.sql_query.raw(sql, bindings)
      : await this.sql_query.raw(sql);

    if ("rows" in result) return result.rows as T[]; // PostgreSQL response shape
    return result as unknown as T[]; // Fallback for other dialects
  }
}

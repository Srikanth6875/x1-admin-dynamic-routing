import type { Knex } from "knex";
import { getShellEngine } from "~/database/pg-server";

export abstract class ShellEngine {
  protected readonly sql_query: Knex;

  protected constructor() {
    this.sql_query = getShellEngine();
  }

  protected async executeQuery<T>(query: Knex.QueryBuilder | Knex.Raw): Promise<T[]> {
    const result = await query;

    // If it's a raw query in PostgreSQL, rows live under .rows
    if (result && typeof result === "object" && "rows" in result) {
      return (result as any).rows as T[];
    }

    // Normal QueryBuilder already returns array
    return result as T[];
  }
}

import type { Knex } from "knex";
import { getShellEngine } from "~/database/pg-server";

export abstract class ShellEngine {
  protected readonly query: Knex;

  protected constructor() {
    this.query = getShellEngine();
  }

  protected async executeQuery<T>(sqlQuery: Knex.QueryBuilder | Knex.Raw): Promise<T[]> {
    const result = await sqlQuery;

    // If it's a raw query in PostgreSQL, rows live under .rows
    if (result && typeof result === "object" && "rows" in result) {
      return (result as any).rows as T[];
    }
    // Normal QueryBuilder already returns array
    return result as T[];
  }
}

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
}

import type { Knex } from "knex";
import { getShellEngine } from "~/database/pg-server";
import { requestStore } from "~/database/request-store";
import { getRecordId } from "./forms-service";

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

   protected getQueryParams(): Record<string, string | string[]> {
    return requestStore.tryGet()?.query ?? {};
  }

  /** Get all form/POST data from current request */
  protected getFormData(): Record<string, unknown> {
    return requestStore.tryGet()?.formData ?? {};
  }

  /** Get a single query param value by key */
  protected getQueryParam(key: string): string | string[] | undefined {
    return this.getQueryParams()[key];
  }

  /** Get record ID from query params (GET/loader context) */
  protected getQueryRecordId(idColumn: string): number | null {
    return getRecordId(this.getQueryParams(), idColumn);
  }

  /** Get record ID from form data (POST/action context) */
  protected getFormRecordId(idColumn: string): number | null {
    return getRecordId(this.getFormData(), idColumn);
  }

}

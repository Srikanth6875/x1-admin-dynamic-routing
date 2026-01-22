import type { Knex } from "knex";
import { getDb } from "~/__database/pg-connector.server";

export abstract class FrameWorkEngine {
    protected readonly sql_query: Knex;
    protected constructor() {
        this.sql_query = getDb();
    }

    protected async executeQuery<T>(query: Knex.QueryBuilder): Promise<T[]> {
        return await query;
    }
}

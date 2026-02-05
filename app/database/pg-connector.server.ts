import knexInit from "knex";
import type { Knex } from "knex";
import { getTrimEnvKey } from "~/utils/get-env-helper";
let knexInstance: Knex | undefined;

function CreatePgConnection(): Knex {
  return knexInit({
    client: "pg",
    connection: {
      host: getTrimEnvKey("DB_HOST"),
      port: Number(getTrimEnvKey("DB_PORT", "5432")),
      user: getTrimEnvKey("DB_USER"),
      password: getTrimEnvKey("DB_PASSWORD"),
      database: getTrimEnvKey("DB_NAME"),
    },
    pool: {
      min: 4,
      max: 10,
    },
  });
}

export function getShellEngine(): Knex {
  if (!knexInstance) {
    knexInstance = CreatePgConnection();
  }
  return knexInstance;
}

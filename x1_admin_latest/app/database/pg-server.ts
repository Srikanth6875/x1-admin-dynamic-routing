import knexInit from "knex";
import type { Knex } from "knex";
import { getEnvKey } from "~/shared/util-helper";
let knexInstance: Knex | undefined;

function CreatePgConnection(): Knex {
  return knexInit({
    client: "pg",
    connection: {
      host: getEnvKey("DB_HOST"),
      port: Number(getEnvKey("DB_PORT", "5432")),
      user: getEnvKey("DB_USER"),
      password: getEnvKey("DB_PASSWORD"),
      database: getEnvKey("DB_NAME"),
      keepAlive: true,
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

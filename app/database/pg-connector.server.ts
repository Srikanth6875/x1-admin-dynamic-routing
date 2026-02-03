import knexInit from "knex";
import type { Knex } from "knex";
import { getTrimEnv } from "~/utils/get-env-helper";
let knexInstance: Knex | undefined;

function CreatePgConnection(): Knex {
  return knexInit({
    client: "pg",
    connection: {
      host: getTrimEnv("DB_HOST"),
      port: Number(getTrimEnv("DB_PORT", "5432")),
      user: getTrimEnv("DB_USER"),
      password: getTrimEnv("DB_PASSWORD"),
      database: getTrimEnv("DB_NAME"),
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

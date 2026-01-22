import knexInit from "knex";
import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

let knexInstance: Knex | undefined;

function createKnex(): Knex {
  return knexInit({
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 5432),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    pool: {
      min: 4,
      max: 10,
    },
  });
}

export function getDb(): Knex {
  if (!knexInstance) {
    knexInstance = createKnex();
  }
  return knexInstance;
}

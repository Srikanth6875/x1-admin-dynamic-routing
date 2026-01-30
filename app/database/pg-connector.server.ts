import knexInit from "knex";
import type { Knex } from "knex";
import dotenv from "dotenv";
dotenv.config();
let knexInstance: Knex | undefined;

function CreatePgConnection(): Knex {
  return knexInit({
    client: "pg",
    connection: {
      host: env("DB_HOST"),
      port: Number(env("DB_PORT", "5432")),
      user: env("DB_USER"),
      password: env("DB_PASSWORD"),
      database: env("DB_NAME"),
    },
    pool: {
      min: 4,
      max: 10,
    },
  });
}

const env = (key: string, fallback = ""): string => (process.env[key] ?? fallback).trim();

export function getShellEngine(): Knex {
  if (!knexInstance) {
    knexInstance = CreatePgConnection();
  }
  return knexInstance;
}

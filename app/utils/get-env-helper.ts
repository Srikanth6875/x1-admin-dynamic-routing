import "dotenv/config";

export const getTrimEnv = (key: string, fallback = ""): string => (process.env[key] ?? fallback).trim();

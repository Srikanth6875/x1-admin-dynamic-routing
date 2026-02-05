import "dotenv/config";

export function getTrimEnvKey(key: string, fallback = ""): string {
    return (process.env[key] ?? fallback).trim();
}

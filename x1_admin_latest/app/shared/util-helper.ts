import "dotenv/config";
import { randomUUID } from "crypto";
import type { DeepPartial } from "../types/listining-types";

export function generateUUID() {
    return randomUUID();
}

export function getEnvKey(key: string, fallback = ""): string {
    return (process.env[key] ?? fallback).trim();
}

export function ObjectdeepMerge<T>(target: T, source: DeepPartial<T>): T {
    if (!source) return target;

    const output = { ...target } as T;
    const sourceObj = source as Partial<Record<keyof T, unknown>>;

    for (const key in sourceObj) {
        const typedKey = key as keyof T;

        const sourceValue = sourceObj[typedKey];
        const targetValue = target[typedKey];

        if (sourceValue && typeof sourceValue === "object" && !Array.isArray(sourceValue)) {
            output[typedKey] = ObjectdeepMerge((targetValue ?? {}) as T[keyof T], sourceValue as DeepPartial<T[keyof T]>);

        } else if (sourceValue !== undefined) {
            output[typedKey] = sourceValue as T[keyof T];
        }
    }
    return output;
}

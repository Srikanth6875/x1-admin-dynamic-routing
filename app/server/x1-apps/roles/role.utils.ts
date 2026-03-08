import type { SaveFormResult } from "~/types/form-builder.types";

export function parseIds(raw: unknown): number[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return (raw as any[]).map(Number).filter((v) => !isNaN(v));
  return String(raw).split(",").map(Number).filter((v) => !isNaN(v));
}

export function requireApp(apps: number[]): SaveFormResult | null {
  if (!apps.length) return { success: false, message: "Select at least one App" };
  return null;
}
import type { FormField } from "~/types/form.types";

export function validateForm<T extends Record<string, FormField>>(
  fields: T,
  values: Record<string, unknown>,
  mode: "blur" | "submit" = "submit",
): Record<string, string> {
  const errors: Record<string, string> = {};

  Object.entries(fields).forEach(([name, field]) => {
    const rawValue = values[name];
    const value =
      rawValue === null || rawValue === undefined
        ? ""
        : String(rawValue).trim();

    const label = field.label ?? name.replace(/_/g, " ").toUpperCase();

    if (mode === "submit" && field.required && value.length === 0) {
      errors[name] = `${label} is required`;
      return;
    }

    if (value.length === 0) return;

    if (field.min !== undefined && value.length < field.min) {
      errors[name] = `${label} must be at least ${field.min} characters`;
      return;
    }

    if (field.max !== undefined && value.length > field.max) {
      errors[name] = `${label} must be at most ${field.max} characters`;
      return;
    }

    switch (field.type) {
      case "text":
        if (!/^[A-Za-z0-9 #_\/\-,.]+$/.test(value)) {
          errors[name] =
            `${label} must contain only letters, numbers, space, #, /, _, -, comma or period`;
          return;
        }
        if (/<[^>]*>/g.test(value)) {
          errors[name] = `${label} cannot contain HTML & script tags`;
          return;
        }
        break;

      case "phone":
        if (!/^\d{10}$/.test(value)) {
          errors[name] = `${label} must be exactly 10 digits`;
          return;
        }
        break;

      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors[name] = `Invalid ${label}`;
          return;
        }
        break;

      case "number":
        if (isNaN(Number(value))) {
          errors[name] = `${label} must be a valid number`;
          return;
        }
        break;

      case "url":
        try {
          new URL(value);
        } catch {
          errors[name] = `Invalid ${label}`;
          return;
        }
        break;

      default:
        break;
    }
  });

  return errors;
}

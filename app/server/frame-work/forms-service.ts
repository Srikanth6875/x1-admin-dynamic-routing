import type { FormMode, SaveFormResult } from "~/types/form-builder.types";
import type { FormFields } from "~/types/form.types";

export function getRecordId(
  source: Record<string, unknown>,
  idColumn: string,
): number | null {
  const raw = source[idColumn];
  if (typeof raw === "number") return raw;
  if (typeof raw === "string" && raw.trim() !== "") return Number(raw);
  return null;
}

export function resolveFormMode(
  del: boolean,
  recordId: number | null,
): FormMode {
  if (del) return "DELETE";
  if (recordId) return "EDIT";
  return "ADD";
}

export function buildTitle(mode: FormMode, header: string): string {
  switch (mode) {
    case "DELETE":
      return `Delete ${header}`;
    case "EDIT":
      return `Update ${header}`;
    default:
      return `Create ${header}`;
  }
}

export function assertDeleteAllowed(
  del: boolean,
  recordId: number | null,
  idColumn: string,
): void {
  if (del && !recordId) {
    throw new Error(`Delete requires ${idColumn}`);
  }
}

export function deleteById(formData: Record<string, unknown>): boolean {
  return formData.del === true || formData.del === "true";
}

export function prepareDbPayload(
  fields: FormFields,
  idColumn: string,
  formData: Record<string, unknown>,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  for (const [key, def] of Object.entries(fields)) {
    if (!def.db || key === idColumn) continue;

    let value = formData[key];
    if (value === "") value = null;

    if (value !== undefined) {
      payload[def.db] = value;
    }
  }

  return payload;
}
//DB Errro handling 
export function handleDbError(
  err: unknown,
  formFields?: FormFields,
): SaveFormResult {
  const error = err as {
    code?: string;
    detail?: string;
    constraint?: string;
  };

  if (error.code !== "23505") {
    console.error("Database error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }

  const { columns, values } = extractColumnsAndValues(error.detail);

  if (columns.length === 0) {
    return {
      success: false,
      message: "A record with these values already exists.",
    };
    
  }

  const mainColumn = columns[columns.length - 1];
  const mainValue = values[columns.length - 1]?.trim() ?? "this value";

  let label = ColumnReplace(mainColumn);

  if (formFields) {
    const fieldEntry = Object.entries(formFields).find(
      ([_, def]) => def.db === mainColumn,
    );

    if (fieldEntry) {
      const field = fieldEntry[1];
      label = field.label?.trim() || label;
    }
  }

  let context = "";
  if (columns.length > 1) {
    const contextLabels: string[] = [];
    
    for (let i = 0; i < columns.length - 1; i++) {
      const col = columns[i];
      let colLabel = ColumnReplace(col);
      
      if (formFields) {
        const fieldEntry = Object.entries(formFields).find(
          ([_, def]) => def.db === col,
        );
        if (fieldEntry) {
          colLabel = fieldEntry[1].label?.trim() || colLabel;
        }
      }
      
      contextLabels.push(colLabel);
    }
    
    if (contextLabels.length > 0) {
      context = ` for this ${contextLabels.join(" + ")}`;
    }
  }

  return {
    success: false,
    message: `${label} "${mainValue}" already exists${context}`,
  };
  
}

function extractColumnsAndValues(detail?: string): {
  columns: string[];
  values: string[];
} {
  if (!detail) return { columns: [], values: [] };

  const match = detail.match(/Key\s*\(([^)]+)\)\s*=\(([^)]+)\)/i);
  if (!match) return { columns: [], values: [] };

  const columnsPart = match[1];
  const valuesPart = match[2];

  const columns = columnsPart.split(",").map((s) => s.trim().replace(/"/g, "")); // "trim" → trim

  const values = valuesPart
    .split(",")
    .map((s) => s.trim().replace(/^["']|["']$/g, "")); // 'C Class' → C Class

  return { columns, values };
}


function ColumnReplace(column: string): string {
  return column
    .replace(/^[a-z]{1,4}_/i, "")             // remove tbl_, veh_, etc.
    .replace(/_id$|_name$|_code$/i, "")       // make_id → make, trim_name → trim
    .replace(/_/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim() || "Value";
}
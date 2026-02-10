import type { ColumnMetadata } from "@codeJ09/design-system/data-table";
import { z } from "zod";
export const MAKE_TABLE_HEADING: { title: string; } = {
  title: "Vehicle Makes",
};

export const MAKES_TABLE_CONFIG = {
  features: {
    search: {
      placeholder: "Search vehicle makes...",
    },
  },
};

export const MAKES_COLUMNS_CONFIG: ColumnMetadata[] = [
  { key: "id", label: "Id", type: "number" },
  { key: "make", label: "Make", type: "string" },
  { key: "make_ctime", label: "Create", type: "string" },
  { key: "make_mtime", label: "Update", type: "string" },
];

/*-------------------------------------------------------------*/
export const MODEL_TABLE_HEADING: { title: string; } = {
  title: "Vehicle Models",
};

export const MODEL_TABLE_CONFIG = {
  features: {
    search: {
      placeholder: "Search vehicle models...",
    },
  },
};

export const MODEL_COLUMNS_CONFIG: ColumnMetadata[] = [
  { key: "id", label: "Id", type: "number" },
  { key: "make", label: "Make", type: "string" },
  { key: "model", label: "Model", type: "string" },
  { key: "model_ctime", label: "Create", type: "string" },
  { key: "model_mtime", label: "Update", type: "string" },
];

/*-------------------------------------------------------------*/
export const TRIM_TABLE_HEADING: { title: string; } = {
  title: "Vehicle Trims",
};
export const TRIM_TABLE_CONFIG = {
  features: {
    search: {
      placeholder: "Search Vehicle trims...",
    },
  },
};

export const TRIM_COLUMNS_CONFIG: ColumnMetadata[] = [
  { key: "id", label: "Id", type: "number" },
  { key: "make", label: "Make", type: "string" },
  { key: "model", label: "Model", type: "string", },
  {
    key: "trim",
    label: "Trim",
    type: "string",
    editable: true,
    editor: {
      type: "select",
      validation: [
        z.string().trim().min(1, "Trim is required"),
      ],
    },
  },
  { key: "trim_ctime", label: "Create", type: "string" },
  { key: "trim_mtime", label: "Update", type: "string" },
];

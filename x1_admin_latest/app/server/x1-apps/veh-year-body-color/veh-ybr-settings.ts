import type { ColumnMetadata } from "@codeJ09/design-system/data-table";
export const COLORS_TABLE_HEADING: { title: string; } = {
  title: "Vehicle Colors",
};
export const COLORS_TABLE_CONFIG = {
  features: {
    search: {
      placeholder: "Search Vehicle colors...",
    },
  },
};

export const COLORS_COLUMNS_CONFIG: ColumnMetadata[] = [
  { key: "id", label: "Id", type: "number" },
  { key: "color", label: "Color", type: "string" },
  { key: "ctime", label: "Create", type: "string" },
  { key: "mtime", label: "Update", type: "string" },
];

/*-------------------------------------------------------------*/
export const BODY_TYPE_TABLE_HEADING: { title: string; } = {
  title: "Vehicle Body Types",
};
export const BODY_TYPE_TABLE_CONFIG = {
  features: {
    search: {
      placeholder: "Search Vehicle Body types...",
    },
  },
};

export const BODY_TYPE_COLUMNS_CONFIG: ColumnMetadata[] = [
  { key: "id", label: "Id", type: "number" },
  { key: "body_type", label: "Body", type: "string" },
  { key: "ctime", label: "Create", type: "string" },
  { key: "mtime", label: "Update", type: "string" },
];

/*-------------------------------------------------------------*/
export const YEAR_TYPE_TABLE_HEADING: { title: string; } = {
  title: "Vehicle Years",
};

export const YEAR_TABLE_CONFIG = {
  features: {
    search: {
      placeholder: "Search vehicle Years...",
    },
  },
};

export const YEAR_COLUMNS_CONFIG: ColumnMetadata[] = [
  { key: "id", label: "Id", type: "number" },
  { key: "year", label: "Year", type: "number" },
  { key: "ctime", label: "Create", type: "string" },
  { key: "mtime", label: "Update", type: "string" },
];

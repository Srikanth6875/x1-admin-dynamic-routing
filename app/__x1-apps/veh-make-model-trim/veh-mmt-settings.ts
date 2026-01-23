export const MAKE_TABLE_CONFIG = {
  features: {
    search: {
      placeholder: "Search vehicle makes...",
    },
  },
};

export const MAKE_COLUMNS_CONFIG = [
  { key: "id", label: "Id", type: "number" },
  { key: "make", label: "Make", type: "string" },
  { key: "make_ctime", label: "Create", type: "Date" },
  { key: "make_mtime", label: "Update", type: "Date" },
];

/*-------------------------------------------------------------*/

export const MODEL_TABLE_CONFIG = {
  features: {
    search: {
      placeholder: "Search vehicle models...",
    },
  },
};

export const MODEL_COLUMNS_CONFIG = [
  { key: "id", label: "Id", type: "number" },
  { key: "make", label: "Make", type: "string" },
  { key: "model", label: "Model", type: "string" },
  { key: "model_ctime", label: "Create", type: "string" },
  { key: "model_mtime", label: "Update", type: "string" },
];

/*-------------------------------------------------------------*/

export const TRIM_TABLE_CONFIG = {
  features: {
    search: {
      placeholder: "Search Vehicle trims...",
    },
  },
};

export const TRIM_COLUMNS_CONFIG = [
  { key: "id", label: "Id", type: "number" },
  { key: "make", label: "Make", type: "string" },
  { key: "model", label: "Model", type: "string" },
  { key: "trim", label: "Trim", type: "string" },
  { key: "trim_ctime", label: "Create", type: "Date" },
  { key: "trim_mtime", label: "Upadte", type: "Date" },
];

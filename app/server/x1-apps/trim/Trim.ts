import type { ColumnMetadata } from "@codeJ09/design-system/data-table";
import type { TableActionBtn } from "~/shared/listining-types";
import type { FormFields } from "~/types/form.types";

export const TRIM_FIELDS = (): FormFields => {
  return {
    id: {
      db: "id",
      type: "number",
      hidden: true,
    },

    makeId: {
      db: "make_id",
      type: "select",
      required: true,
      label: "Select Make",
      options: [],
    },

    modelId: {
      db: "model_id",
      type: "select",
      required: true,
      label: "Select Model",
      options: [],
    },

    trim: {
      db: "trim",
      type: "text",
      required: true,
      max: 250,
      label: "Trim Name",
    },
  };
};

export const TRIM_COLUMNS_CONFIG: ColumnMetadata[] = [
  { key: "id", label: "Id", type: "number" },
  { key: "make", label: "Make", type: "string" },
  { key: "model", label: "Model", type: "string" },
  { key: "trim", label: "Trim", type: "string" },
  { key: "trim_ctime", label: "Create", type: "string" },
  { key: "trim_mtime", label: "Update", type: "string" },
];

export const TRIM_TABLE_CONFIG = {
  features: {
    search: {
      placeholder: "Search Vehicle trims...",
    },
  },
};

export const TRIM_TABLE_HEADING: {
  title: string;
  actions: TableActionBtn[];
} = {
  title: "Vehicle Trims",
  actions: [
    {
      btn_label: "Add Trim",
      btn_variant: "primary",
      route_prefix: "forms",
      appType: "TRIM",
      runType: "ADD_TRIM",
    },
  ],
};
export const TRIM_TABLE_ROW_ACTIONS: TableActionBtn[] = [
  {
    btn_label: "Edit",
    btn_variant: "secondary",
    route_prefix: "forms",
    appType: "TRIM",
    runType: "EDIT_TRIM",
    params: { id: "id" },
  },
  {
    btn_label: "Delete",
    btn_variant: "danger",
    route_prefix: "forms",
    appType: "TRIM",
    runType: "DELETE_TRIM",
    params: { id: "id" },
  },
];

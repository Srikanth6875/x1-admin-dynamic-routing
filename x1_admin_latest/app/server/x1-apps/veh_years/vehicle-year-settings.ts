import type { ColumnMetadata } from "@codeJ09/design-system/data-table";
import type { TableActionBtn } from "~/types/listining-types";
import type { FormFields } from "~/types/form.types";

export const YEAR_FIELDS = (): FormFields => {
  return {
    id: {
      db: "id",
      type: "number",
      hidden: true,
    },

    year: {
      db: "year",
      type: "number",
      required: true,
      min: 4,
      max: 4,
      label: "Year",
    },
  };
};

export const YEAR_COLUMNS_CONFIG: ColumnMetadata[] = [
  { key: "id", label: "Id", type: "number" },
  { key: "year", label: "Year", type: "string" },
  { key: "ctime", label: "Create", type: "string" },
  { key: "mtime", label: "Update", type: "string" },
];

export const YEAR_TABLE_CONFIG = {
  features: {
    search: {
      placeholder: "Search vehicle years...",
    },
  },
};

export const YEAR_TABLE_ACTION_CONFIG: {
  heading: {
    title: string;
    actions: TableActionBtn[];
  };
  rowActions: TableActionBtn[];
} = {
  heading: {
    title: "Vehicle Years",
    actions: [
      {
        btn_label: "Add Year",
        btn_variant: "primary",
        route_prefix: "forms",
        appType: "YEAR",
        runType: "ADD_YEAR",
      },
    ],
  },
  rowActions: [
    {
      btn_label: "Edit",
      btn_variant: "secondary",
      route_prefix: "forms",
      appType: "YEAR",
      runType: "EDIT_YEAR",
      params: { id: "id" },
    },
    {
      btn_label: "Delete",
      btn_variant: "danger",
      route_prefix: "forms",
      appType: "YEAR",
      runType: "DELETE_YEAR",
      params: { id: "id" },
    },
  ],
};

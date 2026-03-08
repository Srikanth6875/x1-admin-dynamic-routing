import type { ColumnMetadata } from "@codeJ09/design-system/data-table";
import type { TableActionBtn } from "~/types/listining-types";
import type { FormFields } from "~/types/form.types";

export const BODY_TYPE_FIELDS = (): FormFields => {
  return {
    id: {
      db: "id",
      type: "number",
      hidden: true,
    },

    body_type: {
      db: "body_type",
      type: "text",
      required: true,
      min: 2,
      max: 255,
      label: "Body Type",
    },
  };
};

export const BODY_TYPE_COLUMNS_CONFIG: ColumnMetadata[] = [
  { key: "id", label: "Id", type: "number" },
  { key: "body_type", label: "Body Type", type: "string" },
  { key: "ctime", label: "Create", type: "string" },
  { key: "mtime", label: "Update", type: "string" },
];

export const BODY_TYPE_TABLE_CONFIG = {
  features: {
    search: {
      placeholder: "Search  body types...",
    },
  },
};

export const BODY_TYPE_TABLE_ACTION_CONFIG: {
  heading: {
    title: string;
    actions: TableActionBtn[];
  };
  rowActions: TableActionBtn[];
} = {
  heading: {
    title: "Vehicle Body Types",
    actions: [
      {
        btn_label: "Add Body Type",
        btn_variant: "primary",
        route_prefix: "forms",
        appType: "BODY_TYPE",
        runType: "ADD_BODY_TYPE",
      },
    ],
  },

  rowActions: [
    {
      btn_label: "Edit",
      btn_variant: "secondary",
      route_prefix: "forms",
      appType: "BODY_TYPE",
      runType: "EDIT_BODY_TYPE",
      params: { id: "id" },
    },
    {
      btn_label: "Delete",
      btn_variant: "danger",
      route_prefix: "forms",
      appType: "BODY_TYPE",
      runType: "DELETE_BODY_TYPE",
      params: { id: "id" },
    },
  ],
};
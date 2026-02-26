import type { ColumnMetadata } from "@codeJ09/design-system/data-table";
import type { TableActionBtn } from "~/types/listining-types";
import type { FormFields } from "~/types/form.types";

export const APPS_FIELDS = (): FormFields => {
  return {
    xa_id: {
      db: "xa_id",
      type: "number",
      hidden: true,
    },

    xa_name: {
      db: "xa_name",
      type: "text",
      required: true,
      min: 2,
      max: 150,
      label: "App Name",
    },

    xa_label: {
      db: "xa_label",
      type: "text",
      required: true,
      min: 2,
      max: 150,
      label: "App Label",
    },

    xa_base_class: {
      db: "xa_base_class",
      type: "text",
      required: true,
      min: 2,
      max: 150,
      label: "Base Service Class",
    },

    xa_status: {
      db: "xa_status",
      type: "select",
      label: "Status",
      options: [
        { label: "Active", value: 1 },
        { label: "Inactive", value: 0 },
      ],
    },
  };
};

export const APPS_COLUMNS_CONFIG: ColumnMetadata[] = [
  { key: "xa_id", label: "ID", type: "number" },
  { key: "xa_name", label: "Code", type: "string" },
  { key: "xa_label", label: "Label", type: "string" },
  { key: "xa_base_class", label: "Base Class", type: "string" },
  { key: "xa_status", label: "Status", type: "number" },
  { key: "xa_created_time", label: "Created", type: "string" },
  { key: "xa_last_updated", label: "Updated", type: "string" },
];

export const APPS_TABLE_CONFIG = {
  features: {
    search: {
      placeholder: "Search Applications...",
    },
  },
};

export const APPS_TABLE_ACTION_CONFIG: {
  heading: {
    title: string;
    actions: TableActionBtn[];
  };
  rowActions: TableActionBtn[];
} = {
  heading: {
    title: "Applications",
    actions: [
      {
        btn_label: "Add Application",
        btn_variant: "primary",
        route_prefix: "forms",
        appType: "APPS",
        runType: "ADD_APP",
      },
    ],
  },
  rowActions: [
    {
      btn_label: "Edit",
      btn_variant: "secondary",
      route_prefix: "forms",
      appType: "APPS",
      runType: "EDIT_APP",
      params: { xa_id: "xa_id" },
    },
    {
      btn_label: "Delete",
      btn_variant: "danger",
      route_prefix: "forms",
      appType: "APPS",
      runType: "DELETE_APP",
      params: { xa_id: "xa_id" },
    },
  ],
};
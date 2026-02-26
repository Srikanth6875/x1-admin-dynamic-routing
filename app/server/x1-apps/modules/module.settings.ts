import type { ColumnMetadata } from "@codeJ09/design-system/data-table";
import type { TableActionBtn } from "~/types/listining-types";
import type { FormFields } from "~/types/form.types";

export const MODULES_FIELDS = (): FormFields => {
  return {
    xm_id: {
      db: "xm_id",
      type: "number",
      hidden: true,
    },

    // xm_xa_id: {
    //   db: "xm_xa_id",
    //   type: "number",
    //   required: true,
    //   label: "App ID",
    // },

    xm_name: {
      db: "xm_name",
      type: "text",
      required: true,
      min: 2,
      max: 150,
      label: "Module Name",
    },

    xm_label: {
      db: "xm_label",
      type: "text",
      required: true,
      min: 2,
      max: 150,
      label: "Module Label",
    },

    xm_class: {
      db: "xm_class",
      type: "text",
      required: true,
      min: 2,
      max: 150,
      label: "Module Service Class",
    },

    xm_default_runtype_id: {
      db: "xm_default_runtype_id",
      type: "number",
      label: "Default RunType ID",
    },

    xm_status: {
      db: "xm_status",
      type: "select",
      label: "Status",
      options: [
        { label: "Active", value: 1 },
        { label: "Inactive", value: 0 },
      ],
    },
  };
};
export const MODULES_COLUMNS_CONFIG: ColumnMetadata[] = [
  { key: "xm_id", label: "ID", type: "number" },
  { key: "xm_xa_id", label: "App ID", type: "number" },
  { key: "xm_name", label: "Code", type: "string" },
  { key: "xm_label", label: "Label", type: "string" },
  { key: "xm_class", label: "Service Class", type: "string" },
  { key: "xm_default_runtype_id", label: "Default RunType", type: "number" },
  { key: "xm_status", label: "Status", type: "number" },
  { key: "xm_created_time", label: "Created", type: "string" },
  { key: "xm_last_updated", label: "Updated", type: "string" },
];

export const MODULES_TABLE_CONFIG = {
  features: {
    search: {
      placeholder: "Search Modules...",
    },
  },
};

export const MODULES_TABLE_ACTION_CONFIG: {
  heading: {
    title: string;
    actions: TableActionBtn[];
  };
  rowActions: TableActionBtn[];
} = {
  heading: {
    title: "Modules",
    actions: [
      {
        btn_label: "Add Module",
        btn_variant: "primary",
        route_prefix: "forms",
        appType: "MODULES",
        runType: "ADD_MODULE",
      },
    ],
  },
  rowActions: [
    {
      btn_label: "Edit",
      btn_variant: "secondary",
      route_prefix: "forms",
      appType: "MODULES",
      runType: "EDIT_MODULE",
      params: { xm_id: "xm_id" },
    },
    {
      btn_label: "Delete",
      btn_variant: "danger",
      route_prefix: "forms",
      appType: "MODULES",
      runType: "DELETE_MODULE",
      params: { xm_id: "xm_id" },
    },
  ],
};

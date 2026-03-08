import type { ColumnMetadata } from "@codeJ09/design-system/data-table";
import type { TableActionBtn } from "~/types/listining-types";
import type { FormFields } from "~/types/form.types";

export const RUNTYPES_FIELDS = (
  appOptions: { label: string; value: number }[] = [],
  moduleOptions: { label: string; value: number }[] = [],
  selectedAppId: number | null = null,
  selectedModuleId: number | null = null,
): FormFields => ({
  xr_id: {
    db: "xr_id",
    type: "number",
    hidden: true,
  },
  app_selector: {
    type: "select",
    label: "App",
    options: appOptions,
    reloadOnChange: true,
    default: selectedAppId,
    required: true,
  },
  xr_xm_id: {
    db: "xr_xm_id",
    type: "select",
    label: "Module",
    options: moduleOptions,
    reloadOnChange: true,
    hidden: !selectedAppId,
    default: selectedModuleId,
    required: true,
  },
  xr_class: {
    db: "xr_class",
    type: "text",
    required: true,
    max: 150,
    label: "Class",
    hidden: !selectedAppId || !selectedModuleId,
  },
  xr_method: {
    db: "xr_method",
    type: "text",
    required: true,
    min: 2,
    max: 150,
    label: "Method",
    hidden: !selectedAppId || !selectedModuleId,
  },
  xr_shortcut: {
    db: "xr_shortcut",
    type: "text",
    required: true,
    min: 2,
    max: 50,
    label: "RunType Shortcut",
    hidden: !selectedAppId || !selectedModuleId,
  },
  xr_status: {
    db: "xr_status",
    type: "select",
    label: "Status",
    options: [
      { label: "Active", value: 1 },
      { label: "Inactive", value: 0 },
    ],
    hidden: !selectedAppId || !selectedModuleId,
  },
});

export const RUNTYPES_COLUMNS_CONFIG: ColumnMetadata[] = [
  { key: "xr_id", label: "ID", type: "number" },
  { key: "app_name", label: "App", type: "string" },
  { key: "module_name", label: "Module", type: "string" },
  { key: "xr_class", label: "Class", type: "string" },
  { key: "xr_method", label: "Method", type: "string" },
  { key: "xr_shortcut", label: "Shortcut", type: "string" },
  { key: "xr_status", label: "Status", type: "string" },
  { key: "xr_created_time", label: "Created", type: "string" },
  { key: "xr_last_updated", label: "Updated", type: "string" },
];

export const RUNTYPES_TABLE_CONFIG = {
  features: {
    search: { placeholder: "Search Run Types..." },
  },
};

export const RUNTYPES_TABLE_ACTION_CONFIG: {
  heading: { title: string; actions: TableActionBtn[] };
  rowActions: TableActionBtn[];
} = {
  heading: {
    title: "Run Types",
    actions: [
      {
        btn_label: "Add Run Type",
        btn_variant: "primary",
        route_prefix: "forms",
        appType: "RUNTYPES",
        runType: "ADD_RUNTYPE",
      },
    ],
  },
  rowActions: [
    {
      btn_label: "Edit",
      btn_variant: "secondary",
      route_prefix: "forms",
      appType: "RUNTYPES",
      runType: "EDIT_RUNTYPE",
      params: { xr_id: "xr_id" },
    },
    {
      btn_label: "Delete",
      btn_variant: "danger",
      route_prefix: "forms",
      appType: "RUNTYPES",
      runType: "DELETE_RUNTYPE",
      params: { xr_id: "xr_id" },
    },
  ],
};

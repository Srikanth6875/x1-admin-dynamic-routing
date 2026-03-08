import type { ColumnMetadata } from "@codeJ09/design-system/data-table";
import type { TableActionBtn } from "~/types/listining-types";
import type { FormFields } from "~/types/form.types";
import type { DetailTable } from "~/types/admin-details.types";

export const ROLES_COLUMNS_CONFIG: ColumnMetadata[] = [
  { key: "r_id", label: "Id", type: "number" },
  { key: "r_name", label: "Role", type: "string" },
  { key: "r_status", label: "Status", type: "string" },
  { key: "r_created_time", label: "Created", type: "string" },
  { key: "r_last_updated", label: "Updated", type: "string" },
];

export const ROLES_TABLE_CONFIG = {
  features: { search: { placeholder: "Search Roles..." } },
};

export const ROLE_TABLE_ACTION_CONFIG: {
  heading: { title: string; actions: TableActionBtn[] };
  rowActions: TableActionBtn[];
} = {
  heading: {
    title: "Roles",
    actions: [
      {
        btn_label: "Add Role",
        btn_variant: "primary",
        route_prefix: "forms",
        appType: "ROLE",
        runType: "ADD_ROLE",
      },
    ],
  },
  rowActions: [
    {
      btn_label: "Edit",
      btn_variant: "secondary",
      route_prefix: "forms",
      appType: "ROLE",
      runType: "EDIT_ROLE",
      params: { r_id: "r_id" },
    },
    {
      btn_label: "Delete",
      btn_variant: "danger",
      route_prefix: "forms",
      appType: "ROLE",
      runType: "DELETE_ROLE",
      params: { r_id: "r_id" },
    },
    {
      btn_label: "View",
      btn_variant: "view",
      route_prefix: "details",
      appType: "ROLE",
      runType: "ROLE_DETAILS_X",
      params: { r_id: "r_id" },
    },
  ],
};

export const ROLE_PERMISSION_X_COLUMNS: ColumnMetadata[] = [
  { key: "app_name", label: "App", type: "string" },
  { key: "module_name", label: "Module", type: "string" },
  { key: "run_types", label: "Run Types", type: "string" },
];

export const ROLE_DETAILS_X_TABLES: DetailTable[] = [
  { title: "", dataKey: "permissions", columns: ROLE_PERMISSION_X_COLUMNS },
];

export const ROLE_PERMISSION_X_FIELDS = (
  appOptions: { label: string; value: number }[],
  moduleOptions: { label: string; value: number }[],
  runTypeOptions: any[],
  selectedApps: number[],
  selectedModules: number[],
  selectedRunTypes: number[],
): FormFields => ({
  r_id: { db: "r_id", type: "number", hidden: true },
  role_name: { type: "text", label: "Role", readOnly: true },
  apps: {
    db: "apps",
    type: "select",
    label: "Select App",
    options: appOptions,
    default: selectedApps,
    required: true,
    reloadOnChange: true,
  },
  modules: {
    db: "modules",
    type: "picklist",
    label: "Select Modules",
    options: moduleOptions,
    default: selectedModules,
    required: true,
    hidden: selectedApps.length === 0,
    reloadOnChange: true,
    groupedBy: "apps",
    allLabel: "All Modules",
    selectedLabel: "Selected Modules",
  },
  run_types: {
    db: "run_types",
    type: "picklist",
    label: "Select Run Types",
    options: runTypeOptions as any,
    default: selectedRunTypes,
    required: true,
    hidden: selectedModules.length === 0 || selectedApps.length === 0,
    groupedBy: "modules",
    excludeFromUrl: true,
    allLabel: "All Runtypes",
    selectedLabel: "Selected Runtypes",
  },
});

export const ROLE_ADD_FIELDS = (
  appOptions: { label: string; value: number }[],
  moduleOptions: { label: string; value: number; apps: number }[],
  runTypeOptions: { label: string; value: number; modules: number }[],
  selectedApps: number[],
  selectedModules: number[],
  selectedRunTypes: string[],
): FormFields => ({
  r_id: { db: "r_id", type: "number", hidden: true },
  name: {
    db: "r_name",
    type: "text",
    required: true,
    max: 100,
    label: "User Role",
  },
  status: { db: "r_status", type: "checkbox", label: "Active", default: 1 },
  apps: {
    db: "apps",
    type: "select",
    label: "App Type",
    options: appOptions,
    default: selectedApps,
    required: true,
    reloadOnChange: true,
  },
  modules: {
    db: "modules",
    type: "picklist",
    label: "Assign Modules",
    options: moduleOptions,
    default: selectedModules,
    hidden: selectedApps.length === 0,
    reloadOnChange: true,
    groupedBy: "apps",
    allLabel: "Available Modules",
    selectedLabel: "Selected Modules",
  },
  run_types: {
    db: "run_types",
    type: "picklist",
    label: "Assign Runtypes",
    options: runTypeOptions as any,
    default: selectedRunTypes,
    hidden: selectedModules.length === 0 || selectedApps.length === 0,
    groupedBy: "modules",
    excludeFromUrl: true,
    allLabel: "Available Run Types",
    selectedLabel: "Selected Run Types",
  },
});

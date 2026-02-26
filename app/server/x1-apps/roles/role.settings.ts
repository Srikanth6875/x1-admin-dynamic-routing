import type { ColumnMetadata } from "@codeJ09/design-system/data-table";
import type { TableActionBtn } from "~/types/listining-types";
import type { FormFields } from "~/types/form.types";
import type { DetailTable } from "~/types/admin-details.types";

export const ROLE_FIELDS = (): FormFields => {
  return {
    r_id: {
      db: "r_id",
      type: "number",
      hidden: true,
    },

    name: {
      db: "r_name",
      type: "text",
      required: true,
      max: 100,
      label: "Role Name",
    },

    label: {
      db: "r_label",
      type: "text",
      max: 150,
      label: "Role Label",
    },
    status: {
      db: "r_status",
      type: "select",
      label: "Status",
      //   required: true,
      options: [
        { label: "Active", value: 1 },
        { label: "Inactive", value: 0 },
      ],
      default: 1,
    },
  };
};

export const ROLES_COLUMNS_CONFIG: ColumnMetadata[] = [
  { key: "r_id", label: "Id", type: "number" },
  { key: "r_name", label: "Role Name", type: "string" },
  { key: "r_label", label: "Role Label", type: "string" },
  { key: "r_status", label: "Status", type: "number" },
  { key: "r_created_time", label: "Created", type: "string" },
  { key: "r_last_updated", label: "Updated", type: "string" },
];

export const ROLES_TABLE_CONFIG = {
  features: {
    search: {
      placeholder: "Search Roles...",
    },
  },
};

export const ROLE_TABLE_ACTION_CONFIG: {
  heading: {
    title: string;
    actions: TableActionBtn[];
  };
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
      btn_label: "Role Permission Map",
      btn_variant: "outline",
      route_prefix: "forms",
      appType: "ROLE",
      runType: "ROLE_PERMISSION",
      params: { r_id: "r_id" },
    },
    {
      btn_label: "View",
      btn_variant: "view",
      route_prefix: "details",
      appType: "ROLE",
      runType: "ROLE_DETAILS",
      params: { r_id: "r_id" },
    },
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
  ],
};

type Option = {
  label: string;
  value: number;
};

export const ROLE_PERMISSION_FIELDS = (
  appTypes: Option[],
  runTypes: Option[],
  selectedAppTypes: number[],
  selectedRunTypes: number[],
): FormFields => {
  return {
    r_id: {
      db: "r_id",
      type: "number",
      hidden: true,
    },

    role_name: {
      db: "r_name",
      type: "text",
      label: "Role Name",
      readOnly: true,
    },

    app_types: {
      db: "app_types",
      type: "multiselectdropdown", // multiselectdropdown
      label: "App Types",
      options: appTypes,
      default: selectedAppTypes,
      required: true,
      reloadOnChange: true,
      // allLabel: "All APP Types",
      // selectedLabel: "Selected APP Types",
    },

    // run_types: {
    //   db: "run_types",
    //   type: "multiselectdropdown", //picklist
    //   label: "Run Types",
    //   options: runTypes,
    //   required: true,
    //   default: selectedRunTypes,
    //   allLabel: "All RUN-Types",
    //   selectedLabel: "Selected RUN-Types",
    // },

    run_types: {
      db: "run_types",
      type: "groupedruntype",
      label: "Run Types",
      options: runTypes,
      required: true,
      default: selectedRunTypes,
      groupedBy: "app_types", 
    },
  };
};

export const ROLE_PERMISSION_COLUMNS: ColumnMetadata[] = [
  { key: "app_type", label: "App Type", type: "string" },
  { key: "run_types", label: "Run Types", type: "string" },
];

export const ROLE_DETAILS_TABLES: DetailTable[] = [
  {
    title: "",
    dataKey: "permissions",
    columns: ROLE_PERMISSION_COLUMNS,
    // actions: [
    //   {
    //     label: "Edit",
    //     variant: "secondary",
    //     route_prefix: "forms",
    //     appType: "ROLE",
    //     runType: "ROLE_PERMISSION",
    //     params: { r_id: "r_id" },
    //   },
    //   {
    //     label: "Delete",
    //     variant: "danger",
    //     route_prefix: "forms",
    //     appType: "ROLE",
    //     runType: "DELETE_ROLE",
    //     params: { r_id: "r_id" },
    //   },
    // ],
  },
];

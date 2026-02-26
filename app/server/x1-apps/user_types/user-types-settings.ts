import type { ColumnMetadata } from "@codeJ09/design-system/data-table";
import type { TableActionBtn } from "~/types/listining-types";
import type { FormFields } from "~/types/form.types";

export const USER_TYPE_FIELDS = (): FormFields => {
  return {
    ut_id: {
      db: "ut_id",
      type: "number",
      hidden: true,
    },

    ut_name: {
      db: "ut_name",
      type: "text",
      required: true,
      min: 2,
      max: 100,
      label: "User Type Name",
    },

    ut_label: {
      db: "ut_label",
      type: "text",
      required: false,
      min: 2,
      max: 150,
      label: "User Type Label",
    },

    ut_status: {
      db: "ut_status",
      type: "select",

      label: "Status",
      options: [
        { label: "Active", value: 1 },
        { label: "Inactive", value: 0 },
      ],
    },
  };
};

export const USER_TYPES_COLUMNS_CONFIG: ColumnMetadata[] = [
  { key: "ut_id", label: "ID", type: "number" },
  { key: "ut_name", label: "Name", type: "string" },
  { key: "ut_label", label: "Label", type: "string" },
  { key: "ut_status", label: "Status", type: "number" },
  { key: "roles", label: "Roles", type: "string" },
  { key: "ut_created_time", label: "Created", type: "string" },
  { key: "ut_last_updated", label: "Updated", type: "string" },
];

export const USER_TYPES_TABLE_CONFIG = {
  features: {
    search: {
      placeholder: "Search User Types...",
    },
  },
};

export const USER_TYPE_ROLE_MAP_FIELDS = (
  roleOptions: { label: string; value: number }[],
  selectedRoles: number[],
): FormFields => {
  return {
    ut_id: {
      db: "ut_id",
      type: "number",
      hidden: true,
    },

    ut_name: {
      db: "ut_name",
      type: "text",
      label: "User Type",
      readOnly: true,
    },

    roles: {
      db: "roles",
      type: "picklist",  //multiselectdropdown
      label: "Assign Roles",
      options: roleOptions,
      default: selectedRoles,
      allLabel: "All Roles",
      selectedLabel: "Selected Roles",
    },
  };
};

export const USER_TYPES_TABLE_ACTION_CONFIG: {
  heading: {
    title: string;
    actions: TableActionBtn[];
  };
  rowActions: TableActionBtn[];
} = {
  heading: {
    title: "User Types",
    actions: [
      {
        btn_label: "Add User Type",
        btn_variant: "primary",
        route_prefix: "forms",
        appType: "USER_TYPE",
        runType: "ADD_USER_TYPE",
      },
    ],
  },
  rowActions: [
    {
      btn_label: "Role Map",
      btn_variant: "outline",
      route_prefix: "forms",
      appType: "USER_TYPE",
      runType: "USER_TYPE_ROLE_MAP",
      params: { ut_id: "ut_id" },
    },
    {
      btn_label: "Edit",
      btn_variant: "secondary",
      route_prefix: "forms",
      appType: "USER_TYPE",
      runType: "EDIT_USER_TYPE",
      params: { ut_id: "ut_id" },
    },
    {
      btn_label: "Delete",
      btn_variant: "danger",
      route_prefix: "forms",
      appType: "USER_TYPE",
      runType: "DELETE_USER_TYPE",
      params: { ut_id: "ut_id" },
    },
  ],
};

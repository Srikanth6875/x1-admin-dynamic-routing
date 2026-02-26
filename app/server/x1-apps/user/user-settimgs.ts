import type { ColumnMetadata } from "@codeJ09/design-system/data-table";
import type { TableActionBtn } from "~/types/listining-types";
import type { FormFields } from "~/types/form.types";

export const USER_FIELDS = (): FormFields => {
  return {
    u_id: {
      db: "u_id",
      type: "number",
      hidden: true,
    },

    username: {
      db: "u_username",
      type: "text",
      required: true,
      max: 100,
      label: "Username",
    },

    email: {
      db: "u_email",
      type: "email",
      required: true,
      max: 255,
      label: "Email",
    },

    status: {
      db: "u_status",
      type: "select",
      label: "Status",
      //   required: true,
      options: [
        { label: "Active", value: 1 },
        { label: "Inactive", value: 0 },
      ],
      default: 1,
    },

    password: {
      db: "u_password_hash",
      type: "password",
      required: true,
      max: 255,
      label: "Password",
    },
  };
};

export const USERS_COLUMNS_CONFIG: ColumnMetadata[] = [
  { key: "u_id", label: "Id", type: "number" },
  { key: "u_username", label: "Username", type: "string" },
  { key: "u_email", label: "Email", type: "string" },
  { key: "u_status", label: "Status", type: "number" },
  { key: "user_type", label: "User Type", type: "string" },
  { key: "u_created_time", label: "Created", type: "string" },
  { key: "u_last_updated", label: "Updated", type: "string" },
];

export const USERS_TABLE_CONFIG = {
  features: {
    search: {
      placeholder: "Search Users...",
    },
  },
};

export const USER_USER_TYPE_MAP_FIELDS = (
  userTypeOptions: { label: string; value: number }[],
): FormFields => {
  return {
    u_id: {
      db: "u_id",
      type: "number",
      hidden: true,
    },

    username: {
      db: "u_username",
      type: "text",
      label: "Username",
      readOnly: true,
    },

    user_type: {
      db: "u_ut_id",
      type: "select",
      label: "Assign User Type",
      options: userTypeOptions,
      required: true,
    },
  };
};

export const USER_TABLE_ACTION_CONFIG: {
  heading: {
    title: string;
    actions: TableActionBtn[];
  };
  rowActions: TableActionBtn[];
} = {
  heading: {
    title: "Users",
    actions: [
      {
        btn_label: "Add User",
        btn_variant: "primary",
        route_prefix: "forms",
        appType: "USER",
        runType: "ADD_USER",
      },
    ],
  },
  rowActions: [
    {
      btn_label: "User-Type Map",
      btn_variant: "outline",
      route_prefix: "forms",
      appType: "USER",
      runType: "USER_TYPE_MAP",
      params: { u_id: "u_id" },
    },

    {
      btn_label: "Edit",
      btn_variant: "secondary",
      route_prefix: "forms",
      appType: "USER",
      runType: "EDIT_USER",
      params: { u_id: "u_id" },
    },
    {
      btn_label: "Delete",
      btn_variant: "danger",
      route_prefix: "forms",
      appType: "USER",
      runType: "DELETE_USER",
      params: { u_id: "u_id" },
    },
  ],
};

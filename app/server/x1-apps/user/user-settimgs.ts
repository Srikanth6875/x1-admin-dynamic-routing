import type { ColumnMetadata } from "@codeJ09/design-system/data-table";
import type { TableActionBtn } from "~/types/listining-types";
import type { FormFields } from "~/types/form.types";

export const USER_FIELDS = (
  userTypeOptions: { label: string; value: number }[] = [],
): FormFields => ({
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
    label: "User Name",
  },

  user_type: {
    db: "u_ut_id",
    type: "select",
    label: "User Type",
     required: true,
    options: [{ label: "NONE", value: 0 }, ...userTypeOptions],
    default: 0,
  },

  password: {
    db: "u_password_hash",
    type: "password",
    required: true,
    max: 255,
    label: "Password",
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
    type: "checkbox",
    label: "Active",
    default: 1,
  },
});

export const USERS_COLUMNS_CONFIG: ColumnMetadata[] = [
  { key: "u_id",           label: "Id",         type: "number" },
  { key: "u_username",     label: "Username",   type: "string" },
  { key: "u_email",        label: "Email",      type: "string" },
  { key: "u_status",       label: "Status",     type: "number" },
  { key: "user_type",      label: "User Type",  type: "string" },
  { key: "u_created_time", label: "Created",    type: "string" },
  { key: "u_last_updated", label: "Updated",    type: "string" },
];

export const USERS_TABLE_CONFIG = {
  features: {
    search: { placeholder: "Search Users..." },
  },
};

export const USER_TABLE_ACTION_CONFIG: {
  heading: { title: string; actions: TableActionBtn[] };
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
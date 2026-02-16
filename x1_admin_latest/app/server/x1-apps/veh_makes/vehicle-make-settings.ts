import type { ColumnMetadata } from "@codeJ09/design-system/data-table";
import type { TableActionBtn } from "~/types/listining-types";
import type { FormFields } from "~/types/form.types";

export const MAKE_FIELDS = (): FormFields => {
  return {
    id: {
      db: "id",
      type: "number",
      hidden: true,
    },

    make: {
      db: "make",
      type: "text",
      required: true,
      max: 250,
      label: "Make",
    },
  };
};

export const MAKES_TABLE_CONFIG = {
  features: {
    search: {
      placeholder: "Search vehicle makes...",
    },
  },
};

export const MAKES_COLUMNS_CONFIG: ColumnMetadata[] = [
  { key: "id", label: "Id", type: "number" },
  { key: "make", label: "Make", type: "string" },
  { key: "make_ctime", label: "Create", type: "string" },
  { key: "make_mtime", label: "Update", type: "string" },
];

export const MAKE_TABLE_ACTION_CONFIG: {
  heading: {
    title: string;
    actions: TableActionBtn[];
  };
  rowActions: TableActionBtn[];
} = {
  heading: {
    title: "Vehicle Makes",
    actions: [
      {
        btn_label: "Add Make",
        btn_variant: "primary",
        route_prefix: "forms",
        appType: "MAKE",
        runType: "ADD_MAKE",
      },
    ],
  },
  rowActions: [
    {
      btn_label: "Edit",
      btn_variant: "secondary",
      route_prefix: "forms",
      appType: "MAKE",
      runType: "EDIT_MAKE",
      params: { id: "id" },
    },
    {
      btn_label: "Delete",
      btn_variant: "danger",
      route_prefix: "forms",
      appType: "MAKE",
      runType: "DELETE_MAKE",
      params: { id: "id" },
    },
  ],
};

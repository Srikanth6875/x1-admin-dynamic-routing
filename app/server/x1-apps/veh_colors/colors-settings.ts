import type { ColumnMetadata } from "@codeJ09/design-system/data-table";
import type { TableActionBtn } from "~/types/listining-types";
import type { FormFields } from "~/types/form.types";

export const COLOUR_FIELDS = (): FormFields => {
  return {
    id: {
      db: "id",
      type: "number",
      hidden: true,
    },

    color: {
      db: "color",
      type: "text",
      required: true,
      max: 250,
      label: "Colour",
    },
  };
};

export const COLORS_COLUMNS_CONFIG: ColumnMetadata[] = [
  { key: "id", label: "Id", type: "number" },
  { key: "color", label: "Color", type: "string" },
  { key: "ctime", label: "Create", type: "string" },
  { key: "mtime", label: "Update", type: "string" },
];

export const COLORS_TABLE_CONFIG = {
  features: {
    search: {
      placeholder: "Search Vehicle colors...",
    },
  },
};

export const COLOUR_TABLE_ACTION_CONFIG: {
  heading: {
    title: string;
    actions: TableActionBtn[];
  };
  rowActions: TableActionBtn[];
} = {
  heading: {
    title: "Vehicle Colors",
    actions: [
      {
        btn_label: "Add Colour",
        btn_variant: "primary",
        route_prefix: "forms",
        appType: "COLOUR",
        runType: "ADD_COLOUR",
      },
    ],
  },
  rowActions: [
    {
      btn_label: "Edit",
      btn_variant: "secondary",
      route_prefix: "forms",
      appType: "COLOUR",
      runType: "EDIT_COLOUR",
      params: { id: "id" },
    },
    {
      btn_label: "Delete",
      btn_variant: "danger",
      route_prefix: "forms",
      appType: "COLOUR",
      runType: "DELETE_COLOUR",
      params: { id: "id" },
    },
  ],
};

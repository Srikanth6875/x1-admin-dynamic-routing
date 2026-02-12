import type { ColumnMetadata } from "@codeJ09/design-system/data-table";
import type { TableActionBtn } from "~/types/listining-types";
import type { FormFields } from "~/types/form.types";


export const MODEL_FIELDS = (): FormFields => {
  return {
    id: {
      db: "id",
      type: "number",
      hidden: true,
    },

    makeId: {
      db: "make_id",
      type: "select",
      required: true,
      label: "Select Make",
      options: [],
    },

    model: {
      db: "model",
      type: "text",
      required: true,
      min: 2,
      max: 50,
      label: "Model Name",
    },
  };
};

export const MODEL_COLUMNS_CONFIG: ColumnMetadata[] = [
  { key: "id", label: "Id", type: "number" },
  { key: "make", label: "Make", type: "string" },
  { key: "model", label: "Model", type: "string" },
  { key: "model_ctime", label: "Create", type: "string" },
  { key: "model_mtime", label: "Update", type: "string" },
];

export const MODEL_TABLE_CONFIG = {
  features: {
    search: {
      placeholder: "Search vehicle models...",
    },
  },
};

export const MODEL_TABLE_ACTION_CONFIG: {
  heading: {
    title: string;
    actions: TableActionBtn[];
  };
  rowActions: TableActionBtn[];
} = {
  heading: {
    title: "Vehicle Models",
    actions: [
      {
        btn_label: "Add Model",
        btn_variant: "primary",
        route_prefix: "forms",
        appType: "MODEL",
        runType: "ADD_MODEL",
      },
    ],
  },
  rowActions: [
    {
      btn_label: "Edit",
      btn_variant: "secondary",
      route_prefix: "forms",
      appType: "MODEL",
      runType: "EDIT_MODEL",
      params: { id: "id" },
    },
    {
      btn_label: "Delete",
      btn_variant: "danger",
      route_prefix: "forms",
      appType: "MODEL",
      runType: "DELETE_MODEL",
      params: { id: "id" },
    },
  ],
};

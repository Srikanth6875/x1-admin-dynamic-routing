import type { ColumnMetadata } from "@codeJ09/design-system/data-table";
import type { TableActionBtn } from "~/types/listining-types";
import type { FormFields } from "~/types/form.types";

export const RUNTYPES_FIELDS = (): FormFields => {
  return {
    xr_id: {
      db: "xr_id",
      type: "number",
      hidden: true,
    },

    // xr_xm_id: {
    //   db: "xr_xm_id",
    //   type: "number",
    //   required: true,
    //   label: "Module ID",
    // },

    // xr_code: {
    //   db: "xr_code",
    //   type: "text",
    //   required: true,
    //   min: 2,
    //   max: 150,
    //   label: "RunType Name",
    // },

    xr_label: {
      db: "xr_label",
      type: "text",
      min: 2,
      max: 150,
      label: "RunType Label",
    },

    xr_method: {
      db: "xr_method",
      type: "text",
      required: true,
      min: 2,
      max: 150,
      label: "Method Name",
    },

    xr_status: {
      db: "xr_status",
      type: "select",
      label: "Status",
      options: [
        { label: "Active", value: 1 },
        { label: "Inactive", value: 0 },
      ],
    },
  };
};

export const RUNTYPES_COLUMNS_CONFIG: ColumnMetadata[] = [
  { key: "xr_id", label: "ID", type: "number" },
  { key: "xr_xm_id", label: "Module ID", type: "number" },
  { key: "xr_code", label: "Code", type: "string" },
  { key: "xr_label", label: "Label", type: "string" },
  { key: "xr_method", label: "Method", type: "string" },
  { key: "xr_status", label: "Status", type: "number" },
  { key: "xr_created_time", label: "Created", type: "string" },
  { key: "xr_last_updated", label: "Updated", type: "string" },
];

export const RUNTYPES_TABLE_CONFIG = {
  features: {
    search: {
      placeholder: "Search Run Types...",
    },
  },
};

export const RUNTYPES_TABLE_ACTION_CONFIG: {
  heading: {
    title: string;
    actions: TableActionBtn[];
  };
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

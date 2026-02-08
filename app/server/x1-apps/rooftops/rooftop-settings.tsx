import type { ColumnMetadata } from "@codeJ09/design-system/data-table";

import { z } from "zod";
import type { TableActionBtn } from "~/shared/listining-types";

export const ROOFTOP_TABLE_HEADING: { title: string; actions: TableActionBtn[]; } = {
  title: "Rooftops",
  actions: [
    {
      btn_label: "Add Rooftop",
      btn_variant: "primary",
      route_prefix: "list",
      appType: "rooftop",
      runType: "create",
      params: { mode: "new" },
    },
  ],
};

export const ROOFTOP_TABLE_CONFIG = {
  features: {
    pagination: {
      pageSize: 25,
      pageSizeOptions: [25, 50, 75, 100],
    },
    search: {
      placeholder: "Search Rooftops...",
    },
    editing: {
      enabled: false
    }
  }
}

export const ROOFTOP_COLUMNS_CONFIG: ColumnMetadata[] = [
  { key: "rt_dealer_id", label: "Rooftop ID", type: "string" },
  {
    key: "rt_name",
    label: "RoofTop Name",
    type: "string",
    editable: false,
    editor: {
      type: 'text',
      validation: [
        z.string().trim().min(1, 'RoofTop name is required'),
        z.string().trim().min(3, 'Name must be at least 3 characters'),
        z.string().trim().max(50, 'Name must be less than 50 characters'),
      ],
    },
  },
  {
    key: "rt_street",
    label: "Street",
    type: "string",
    editable: true,
    editor: {
      type: 'text',
      validation: [
        z.string().trim().min(1, 'Street name is required'),
        z.string().trim().min(3, 'Street must be at least 3 characters'),
        z.string().trim().max(50, 'Street must be less than 50 characters'),
      ],
    },
  },
  {
    key: "rt_city",
    label: "City",
    type: "string",
    editable: true,
    editor: {
      type: 'text',
      validation: [
        z.string().trim().min(1, 'City name is required'),
        z.string().trim().min(3, 'City must be at least 3 characters'),
        z.string().trim().max(50, 'City must be less than 50 characters'),
      ],
    },
  },
  { key: "rt_state", label: "State", type: "string" },
  { key: "rt_zip", label: "Zip", type: "string" },
  { key: "rt_ph", label: "Phone", type: "string" }
];

export const ROOFTOP_TABLE_ROW_ACTIONS: TableActionBtn[] = [
  {
    btn_label: "Edit",
    btn_variant: "secondary",
    route_prefix: "forms",
    appType: "VEH_INFO",
    runType: "EDIT_ROOFTOP",
    params: { mode: "edit" },
  },
  {
    btn_label: "Delete",
    btn_variant: "danger",
    route_prefix: "forms",
    appType: "VEH_INFO",
    runType: "DELETE_ROOFTOP",
    params: { mode: "delete" },
  }
];
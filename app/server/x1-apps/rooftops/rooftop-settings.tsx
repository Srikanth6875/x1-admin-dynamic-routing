import type { ColumnMetadata } from "@codeJ09/design-system/data-table";
import type { TableActionBtn } from "~/types/listining-types";
import type { FormFields } from "~/types/form.types";
import type { DetailSection, DetailTable } from "~/types/admin-details.types";
import { VEHICLE_COLUMNS_CONFIG } from "../vehicles/vehicles-settings";

export const ROOFTOP_TABLE_ACTION_CONFIG: {
  heading: {
    title: string;
    actions: TableActionBtn[];
  };
  rowActions: TableActionBtn[];
} = {
  heading: {
    title: "Rooftops",
    actions: [
      {
        btn_label: "Add Rooftop",
        btn_variant: "primary",
        route_prefix: "forms",
        appType: "ROOFTOPS",
        runType: "ADD_ROOFTOP",
      },
    ],
  },
  rowActions: [
    {
      btn_label: "View",
      btn_variant: "view",
      route_prefix: "details",
      appType: "ROOFTOPS",
      runType: "ROOFTOP_DETAILS",
      params: { rt_id: "rt_id" },
    },
    {
      btn_label: "Edit",
      btn_variant: "secondary",
      route_prefix: "forms",
      appType: "ROOFTOPS",
      runType: "EDIT_ROOFTOP",
      params: { rt_id: "rt_id" },
    },
    {
      btn_label: "Delete",
      btn_variant: "danger",
      route_prefix: "forms",
      appType: "ROOFTOPS",
      runType: "DELETE_ROOFTOP",
      params: { rt_id: "rt_id" },
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
      enabled: true,
    },
  },
};

export const ROOFTOP_COLUMNS_CONFIG: ColumnMetadata[] = [
  { key: "rt_dealer_id", label: "Rooftop ID", type: "string" },
  {
    key: "rt_name",
    label: "RoofTop Name",
    type: "string",
    width: 250,
    sortable: true,
    filterable: true,
    editable: true,
    editor: {
      type: "text",
      validation: [
        { kind: "required", message: "RoofTop name is required" },
        {
          kind: "min",
          value: 3,
          message: "Name must be at least 3 characters",
        },
        {
          kind: "max",
          value: 50,
          message: "Name must be less than 50 characters",
        },
      ],
    },
  },
  {
    key: "rt_street",
    label: "Street",
    type: "string",
    editable: true,
    width: 250,
    editor: {
      type: "text",
      validation: [
        { kind: "required", message: "Street is required" },
        {
          kind: "min",
          value: 3,
          message: "Name must be at least 3 characters",
        },
        {
          kind: "max",
          value: 50,
          message: "Name must be less than 50 characters",
        },
      ],
    },
  },
  {
    key: "rt_city",
    label: "City",
    type: "string",
    width: 250,
    editable: true,
    editor: {
      type: "text",
      validation: [
        { kind: "required", message: "City is required" },
        {
          kind: "min",
          value: 3,
          message: "Name must be at least 3 characters",
        },
        {
          kind: "max",
          value: 50,
          message: "Name must be less than 50 characters",
        },
      ],
    },
  },
  { key: "rt_state", label: "State", type: "string" },
  { key: "rt_zip", label: "Zip", type: "string" },
  {
    key: "rt_ph",
    label: "Phone",
    type: "string",
    width: 250,
    editable: true,
    editor: {
      type: "tel",
      validation: [
        { kind: "required", message: "Phone number is required" },
        {
          kind: "pattern",
          value: "^[0-9]{10}$",
          message: "Phone number must be 10 digits",
        },
      ],
    },
  },
];

export const ROOFTOP_FILEDS = (): FormFields => {
  return {
    rt_id: { db: "rt_id", type: "number", hidden: true },
    guid: { db: "rt_guid", type: "guid", hidden: true },

    dealerId: {
      db: "rt_dealer_id",
      type: "number",
      required: true,
      min: 4,
      max: 50,
      label: "Dealer ID",
    },

    name: {
      db: "rt_name",
      type: "text",
      required: true,
      max: 50,
      label: "Dealer Name",
    },

    street: {
      db: "rt_street",
      type: "text",
      max: 255,
      label: "Street",
    },

    city: {
      db: "rt_city",
      type: "text",
      max: 100,
      label: "City",
    },

    state: {
      db: "rt_state",
      type: "text",
      max: 50,
      label: "State",
    },

    zip: {
      db: "rt_zip",
      type: "text",
      max: 20,
      label: "Zip",
    },

    phone: {
      db: "rt_ph",
      type: "number",
      min: 10,
      max: 10,
      label: "Phone",
    },

    fax: {
      db: "rt_carfax",
      type: "number",
      min: 10,
      max: 10,
      label: "Fax",
    },

    email: {
      db: "rt_email",
      type: "email",
      max: 255,
      label: "Email",
    },
    website: {
      db: "rt_site",
      type: "url",
      max: 255,
      label: "URL",
    },
  };
};


export const ROOFTOP_VEHICLE_DETAILS_TABLES: DetailTable[] = [
  {
    title: "Vehicles",
    dataKey: "vehicles",                 
    columns: VEHICLE_COLUMNS_CONFIG,
    actions: [
      {
        label: "Details",
        variant: "primary",
        route_prefix: "details",
        appType: "VEHICLES",
        runType: "VEHICLE_DETAILS",
        params: { veh_vin: "veh_vin" },
      },
    ],
  },
 
];
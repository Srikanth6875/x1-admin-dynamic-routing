import type { ColumnMetadata } from "@codeJ09/design-system";
import type { DetailTab, DetailTable } from "~/types/admin-details.types";
import type { FormFields } from "~/types/form.types";
import type { TableActionBtn } from "~/types/listining-types";

export const VEHICLE_TABLE_META = {
  heading: { title: "Vehicles List" },
  config: {
    features: {
      pagination: {
        pageSize: 250,
        pageSizeOptions: [250, 500, 750, 1000],
      },
      search: {
        placeholder: "Search Vehicles...",
      },
    },
  },
};


export const VEHICLE_COLUMNS_CONFIG: ColumnMetadata[] = [
  { key: "veh_id", label: "ID", type: "number" },
  { key: "veh_vin", label: "Vin", type: "string" },
  { key: "veh_stock", label: "Stock", type: "string" },
  { key: "veh_listing_type", label: "Type", type: "string" },
  { key: "veh_certified", label: "Cert", type: "string" },
  { key: "veh_miles", label: "Miles", type: "number" },
  { key: "veh_active", label: "Active", type: "number" },
  { key: "year", label: "Year", type: "number" },
  { key: "make", label: "Make", type: "string" },
  { key: "model", label: "Model", type: "string" },
  { key: "trim", label: "Trim", type: "string" },
  { key: "body_type", label: "Body", type: "string" },
  { key: "exterior_color", label: "Ext col", type: "string" },
  { key: "interior_color", label: "Int col", type: "string" },
  { key: "veh_ctime", label: "Create", type: "string" },
];
export const VEHICLE_FIELDS = (): FormFields => {
  return {
    veh_id: { db: "veh_id", type: "number", label: "ID", hidden: true },
    veh_vin: { db: "veh_vin", type: "text", label: "VIN" },
    veh_stock: { db: "veh_stock", type: "text", label: "Stock" },
    veh_listing_type: { db: "veh_listing_type", type: "text", label: "Listing Type" },
    veh_miles: { db: "veh_miles", type: "number", label: "Miles" },
    year: { db: "year", type: "number", label: "Year" },
    make: { db: "make", type: "text", label: "Make" },
    model: { db: "model", type: "text", label: "Model" },
    trim: { db: "trim", type: "text", label: "Trim" },
    body_type: { db: "body_type", type: "text", label: "Body Type" },
    exterior_color: { db: "exterior_color", type: "text", label: "Exterior Color" },
    interior_color: { db: "interior_color", type: "text", label: "Interior Color" },
  };
};

export const VEHICLE_OPTIONS_TABLE_COLUMNS: ColumnMetadata[] = [
  { key: "option", label: "Option", type: "string" },
];

// export const VEHICLE_DETAILS_TABLES: DetailTable[] = [
//   {
//     title: "Vehicles",
//     dataKey: "vehicles",
//     columns: VEHICLE_COLUMNS_CONFIG, 
//     actions: [
//       {
//         label: "Details",
//         variant: "primary",
//         route_prefix: "details",
//         appType: "VEHICLES",
//         runType: "VEHICLE_DETAILS",
//         params: { veh_vin: "veh_vin" },
//       },
//     ],
//   },
// ];


export const VEHICLE_DETAILS_TABLES: DetailTable[] = [
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
  {
    title: "Vehicle Options",
    dataKey: "options",                   
    columns: VEHICLE_OPTIONS_TABLE_COLUMNS,
  },
];

export const VEHICLE_TABLE_ACTION_CONFIG: {
  heading: { title: string; actions: TableActionBtn[] };
  rowActions: TableActionBtn[];
} = {
  heading: {
    title: "Vehicles",
    actions: [],
  },
  rowActions: [
    {
      btn_label: "View",
      btn_variant: "primary",
      route_prefix: "details",
      appType: "VEHICLES",
      runType: "VEHICLE_DETAILS",
      params: { veh_vin: "veh_vin" },
    },
  ],
};

export const VEHICLE_DETAILS_TABS: DetailTab[] = [
  {
    id: "info",
    label: "Information",
    type: "fields",
  },
  {
    id: "options",
    label: "Options",
    type: "table",
    content: {
      tableKey: "options",
    },
  },
  {
    id: "desc",
    label: "Description",
    type: "html",
    content: {
      htmlKey: "veh_description",
    },
  },
];
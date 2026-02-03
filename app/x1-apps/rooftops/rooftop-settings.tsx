import { TableHeaderAction } from "~/clarity-admin/frame-work-types";
export const ROOFTOP_TABLE_HEADING = "Rooftops";

export const ROOFTOP_TABLE_CONFIG = {
  features: {
    pagination: {
      pageSize: 20,
      pageSizeOptions: [50, 100, 750, 1000],
    },
    search: {
      placeholder: "Search Rooftops...",
    },
  },
};

export const ROOFTOP_COLUMNS_CONFIG = [
  { key: "rt_dealer_id", label: "Rooftop ID", type: "string" },
  { key: "rt_name", label: "Roof Top Name", type: "string" },
  { key: "rt_street", label: "Street", type: "string" },
  { key: "rt_city", label: "City", type: "string" },
  { key: "rt_state", label: "State", type: "string" },
  { key: "rt_zip", label: "Zip", type: "string" },
  { key: "rt_ph", label: "Phone", type: "string" },
];

export const ROOFTOP_TABLE_ACTIONS: TableHeaderAction[] = [
  {
    btn_label: "Add Rooftop",
    btn_variant: "primary",
    appType: "VEH_INFO",
    runType: "ADD_ROOFTOP",
    params: { mode: "create" },
  },
];
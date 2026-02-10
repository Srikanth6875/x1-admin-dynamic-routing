import { CLARITY_DATA_TABLE_UNIQUE_IDS, TABLE_NAMES } from "~/shared/contstants";
import type { TableUpdateConfig } from "./inline-table-types";

export const TABLE_UPDATE_MAP: Record<string, TableUpdateConfig> = {
    [CLARITY_DATA_TABLE_UNIQUE_IDS.ROOFTOP]: {
        editableColumns: {
            rt_name: { tableName: TABLE_NAMES.ROOFTOP, column: "rt_name", primaryKey: "rt_id" },
            rt_street: { tableName: TABLE_NAMES.ROOFTOP, column: "rt_street", primaryKey: "rt_id" },
            rt_city: { tableName: TABLE_NAMES.ROOFTOP, column: "rt_city", primaryKey: "rt_id" },
            rt_ph: { tableName: TABLE_NAMES.ROOFTOP, column: "rt_ph", primaryKey: "rt_id" }
        },
    },
    [CLARITY_DATA_TABLE_UNIQUE_IDS.VEHICLE_TRIMS]: {
        editableColumns: {
            trim: { tableName: TABLE_NAMES.VEHICLE_TRIM, column: "trim", primaryKey: "id", },
        },
    },
};

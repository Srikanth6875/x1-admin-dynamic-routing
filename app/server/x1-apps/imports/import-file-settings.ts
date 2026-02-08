import type { ColumnMetadata } from "@codeJ09/design-system";
import type { TableActionBtn } from "~/shared/listining-types";

export const IMPORT_JOB_TABLE_HEADING: { title: string; } = {
    title: "Import Jobs"
};

export const IMPORT_FILE_JOB_TABLE_HEADING: { title: string; } = {
    title: "Import File Jobs"
};

export const IMPORT_JOB_TABLE_CONFIG = {
    features: {
        pagination: {
            pageSize: 25,
            pageSizeOptions: [50, 100, 750, 1000],
        },
        search: {
            placeholder: "Search Import Jobs...",
        },
    },
};

export const IMPORT_JOB_COLUMNS_CONFIG: ColumnMetadata[] = [
    { key: "ij_source", label: "Source", type: "string" },
    { key: "ij_status", label: "Status", type: "string" },
    { key: "ij_total_records", label: "Total Records", type: "number" },
    { key: "ij_file_name", label: "File Name", type: "string" },
    { key: "ij_file_size", label: "File Size (MB)", type: "number", width: 200 },
    { key: "ij_duration_time", label: "Duration", type: "number" },
    { key: "ij_start_time", label: "Start Time", type: "date" },
    { key: "ij_end_time", label: "End Time", type: "date" },
    { key: "ij_error_message", label: "Error Message", type: "string", width: 300 },
];

/*-------------------------------------------------------------*/
export const IMPORT_FILE_JOB_TABLE_CONFIG = {
    features: {
        pagination: {
            pageSize: 25,
            pageSizeOptions: [50, 100, 750, 1000],
        },
        search: {
            placeholder: "Search File Import Jobs...",
        },
    },
};

export const IMPORT_FILE_JOB_COLUMNS_CONFIG: ColumnMetadata[] = [
    { key: "ifj_id", label: "ID", type: "number" },
    { key: "ifj_local_file_name", label: "Local File Name", type: "string" },
    { key: "ifj_file_size", label: "File Size (MB)", type: "number", width: 200 },
    { key: "ifj_status", label: "Status", type: "string" },
    { key: "ifj_total_records", label: "Total Records", type: "number" },
    { key: "ifj_skipped_records", label: "Skipped Records", type: "number" },
    { key: "ifj_added_records", label: "Added Records", type: "number" },
    { key: "ifj_updated_records", label: "Updated Records", type: "number" },
    { key: "ifj_no_change_records", label: "No Change Records", type: "number" },
    { key: "ifj_deleted_records", label: "Deleted Records", type: "number" },
    { key: "ifj_error_message", label: "Error Message", type: "string", width: 300 },
    { key: "ifj_start_time", label: "Start Time", type: "string" },
    { key: "ifj_end_time", label: "End Time", type: "string" },
];
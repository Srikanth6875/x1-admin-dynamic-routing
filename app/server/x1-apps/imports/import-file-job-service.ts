import { FrameWorkAppService } from "~/server/frame-work/frame-work-app-service";
import { UIComponentType } from "~/shared/admin.enums";
import { CLARITY_DATA_TABLE_UNIQUE_IDS, TABLE_NAMES } from "~/shared/contstants";
import { IMPORT_FILE_JOB_COLUMNS_CONFIG, IMPORT_FILE_JOB_TABLE_CONFIG, IMPORT_FILE_JOB_TABLE_HEADING, IMPORT_JOB_COLUMNS_CONFIG, IMPORT_JOB_TABLE_CONFIG, IMPORT_JOB_TABLE_HEADING } from "./import-file-settings";

export class ImportJobsAppService extends FrameWorkAppService {
    async ImportJobList() {
        const sqlQuery = this.query.raw(`SELECT ij_source, ij_status, ij_total_records, ij_file_name,
                            ROUND((ij_file_size::numeric / 1024 / 1024), 2) AS ij_file_size,
                            ij_start_time,
                            ij_end_time,
                            ij_error_message,
                            CONCAT(
                            FLOOR(EXTRACT(EPOCH FROM ij_duration_time::interval) / 60), ' min ',
                            FLOOR(EXTRACT(EPOCH FROM ij_duration_time::interval) % 60), ' sec'
                            ) AS ij_duration_time
                        FROM import_jobs ORDER BY ij_start_time DESC
                        `);

        return this.BuildClarifyDataTable({
            sqlQuery,
            table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.IMPORT_JOBS,
            columns: IMPORT_JOB_COLUMNS_CONFIG,
            configOverrides: IMPORT_JOB_TABLE_CONFIG,
            component_type: UIComponentType.TABLE,
            table_header: IMPORT_JOB_TABLE_HEADING
        });
    }

    async ImportFileJobList() {
        const sqlQuery = this.query(TABLE_NAMES.IMPORT_FILE_JOBS)
            .select(
                "ifj_id",
                "ifj_local_file_name",
                this.query.raw(`ROUND((ifj_file_size::numeric / 1024 / 1024), 2) as ifj_file_size`),
                "ifj_status",
                "ifj_total_records",
                "ifj_skipped_records",
                "ifj_added_records",
                "ifj_updated_records",
                "ifj_no_change_records",
                "ifj_deleted_records",
                "ifj_start_time",
                "ifj_end_time",
                "ifj_error_message"
            ).orderBy("ifj_id", "desc");

        return this.BuildClarifyDataTable({
            sqlQuery,
            table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.IMPORT_FILE_JOBS,
            columns: IMPORT_FILE_JOB_COLUMNS_CONFIG,
            configOverrides: IMPORT_FILE_JOB_TABLE_CONFIG,
            component_type: UIComponentType.TABLE,
            table_header: IMPORT_FILE_JOB_TABLE_HEADING
        });
    }
}
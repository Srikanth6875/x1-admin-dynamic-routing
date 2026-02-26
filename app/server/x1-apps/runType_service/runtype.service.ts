import { FrameWorkAppService } from "~/server/frame-work/frame-work-app-service";
import type {
  BuildFormResult,
  SaveFormResult,
} from "~/types/form-builder.types";
import {
  CLARITY_DATA_TABLE_UNIQUE_IDS,
  TABLE_NAMES,
} from "~/shared/contstants";
import { UIComponentType } from "~/shared/admin.enums";
import {
  RUNTYPES_COLUMNS_CONFIG,
  RUNTYPES_FIELDS,
  RUNTYPES_TABLE_ACTION_CONFIG,
  RUNTYPES_TABLE_CONFIG,
} from "./runtype.settings";

export class RunTypesService extends FrameWorkAppService {

  async RunTypesList() {

    const sqlQuery = this.query({ xr: TABLE_NAMES.X_APP_RUNTYPE })
      .select(
        "xr_id",
        "xr_xm_id",
        "xr_code",
        "xr_label",
        "xr_method",
        "xr_status",
        "xr_created_time",
        "xr_last_updated"
      )
      .orderBy("xr_id", "desc");

    return await this.BuildClarityDataTable({
      sqlQuery,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.X_APP_RUNTYPE,
      columns: RUNTYPES_COLUMNS_CONFIG,
      configOverrides: RUNTYPES_TABLE_CONFIG,
      component_type: UIComponentType.TABLE,
      table_header: RUNTYPES_TABLE_ACTION_CONFIG.heading,
      row_actions: RUNTYPES_TABLE_ACTION_CONFIG.rowActions,
    });
  }

  async AddRunType(del: boolean = false): Promise<BuildFormResult> {

    const fields = RUNTYPES_FIELDS();

    const url_cols = {
      APP_TYPE: "RUNTYPES",
      ID_COL: "xr_id",
      ACTION: "SAVE_RUNTYPE",
      CANCEL_ACTION: "GET_RUNTYPES",
      TABLE: "x_app_run_types",
      HEADER: "Run Type",
    };

    return this.BuildForm({
      fields,
      url_cols,
      del,
    });
  }

  async EditRunType(): Promise<BuildFormResult> {
    return this.AddRunType();
  }

  async SaveRunType(): Promise<SaveFormResult> {
    const fields = RUNTYPES_FIELDS();
    return this.SaveFormData("x_app_run_types", fields, "xr_id");
  }

  async DeleteRunType(): Promise<BuildFormResult> {
    return this.AddRunType(true);
  }

  
}
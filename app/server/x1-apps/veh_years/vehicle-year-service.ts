import { FrameWorkAppService } from "~/server/frame-work/frame-work-app-service";
import type {
  BuildFormResult,
  SaveFormResult,
} from "~/types/form-builder.types";
import {
  YEAR_COLUMNS_CONFIG,
  YEAR_FIELDS,
  YEAR_TABLE_CONFIG,
  YEAR_TABLE_ACTION_CONFIG,
} from "./vehicle-year-settings";
import {
  CLARITY_DATA_TABLE_UNIQUE_IDS,
  TABLE_NAMES,
} from "~/shared/contstants";
import { UIComponentType } from "~/shared/admin.enums";

export class YearAppService extends FrameWorkAppService {
  async YearList() {
    const sqlQuery = this.query({ vm: TABLE_NAMES.VEHICLE_YEAR }).select(
      "id",
      "year",
      "ctime",
      "mtime",
    )
    .orderBy("id","desc");
    
    return await this.BuildClarityDataTable({
      sqlQuery,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.VEHICLE_YEARS,
      columns: YEAR_COLUMNS_CONFIG,
      configOverrides: YEAR_TABLE_CONFIG,
      component_type: UIComponentType.TABLE,
      table_header: YEAR_TABLE_ACTION_CONFIG.heading,
      row_actions: YEAR_TABLE_ACTION_CONFIG.rowActions,
    });
  }

  async AddYear(del: boolean = false): Promise<BuildFormResult> {
    const fields = YEAR_FIELDS();
    const url_cols = {
      APP_TYPE: "YEAR",
      ID_COL: "id",
      ACTION: "SAVE_YEAR",
      CANCEL_ACTION: "GET_YEARS",
      TABLE: "veh_year",
      HEADER: "Year",
    };

    return this.BuildForm({
      fields,
      url_cols,
      del,
    });
  }

  async YearEdit(): Promise<BuildFormResult> {
    return this.AddYear();
  }

  async YearSave(form_data: Record<string, unknown>): Promise<SaveFormResult> {
    const fields = YEAR_FIELDS();
    return this.SaveFormData("veh_year", fields, "id");
  }

  async YearDelete(): Promise<BuildFormResult> {
    return this.AddYear(true);
  }
}

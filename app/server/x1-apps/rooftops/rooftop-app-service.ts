import { FrameWorkAppService } from "~/server/frame-work/frame-work-app-service";
import { ROOFTOP_COLUMNS_CONFIG, ROOFTOP_FILEDS, ROOFTOP_TABLE_CONFIG, ROOFTOP_TABLE_ACTION_CONFIG } from "~/server/x1-apps/rooftops/rooftop-settings";
import { UIComponentType } from "~/shared/admin.enums";
import { CLARITY_DATA_TABLE_UNIQUE_IDS, TABLE_NAMES } from "~/shared/contstants";
import type { BuildFormResult, SaveFormResult } from "~/types/form-builder.types";

export class RoofTopAppService extends FrameWorkAppService {
  async RoofTopList() {
    const sqlQuery = this.query(TABLE_NAMES.ROOFTOP)
      .select("rt_id", "rt_dealer_id", "rt_name", "rt_street", "rt_city", "rt_state", "rt_zip", "rt_ph")
      .orderBy("rt_id", "desc");

    return this.BuildClarifyDataTable({
      sqlQuery,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.ROOFTOP,
      columns: ROOFTOP_COLUMNS_CONFIG,
      configOverrides: ROOFTOP_TABLE_CONFIG,
      component_type: UIComponentType.TABLE,
      table_header: ROOFTOP_TABLE_ACTION_CONFIG.heading,
      row_actions: ROOFTOP_TABLE_ACTION_CONFIG.rowActions
    });
  }

  async AddRooftop(del: boolean = false): Promise<BuildFormResult> {
    const fields = ROOFTOP_FILEDS();
    const url_cols = {
      APP_TYPE: "ROOFTOPS",
      ID_COL: "rt_id",
      DISPLAY_COL: "Rooftop",
      ACTION: "SAVE_ROOFTOP",
      CANCEL_ACTION: "GET_ROOFTOPS",
      TABLE: "rooftop",
      HEADER: "Rooftop",
    };
    return this.BuildForm({
      fields,
      url_cols,
      del,
    });
  }

  async EditRooftop(): Promise<BuildFormResult> {
    return this.AddRooftop();
  }

  async RooftopSave(): Promise<SaveFormResult> {
    const fields = ROOFTOP_FILEDS();
    return this.SaveFormData("rooftop", fields, "rt_id");
  }

  async RooftopDelete(): Promise<BuildFormResult> {
    return this.AddRooftop(true);
  }


}

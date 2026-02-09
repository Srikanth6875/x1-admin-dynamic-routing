import { FrameWorkAppService } from "~/server/frame-work/frame-work-app-service";
import { ROOFTOP_COLUMNS_CONFIG, ROOFTOP_TABLE_CONFIG, ROOFTOP_TABLE_HEADING, ROOFTOP_TABLE_ROW_ACTIONS } from "~/server/x1-apps/rooftops/rooftop-settings";
import { UIComponentType } from "~/shared/admin.enums";
import { CLARITY_DATA_TABLE_UNIQUE_IDS, TABLE_NAMES } from "~/shared/contstants";

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
      table_header: ROOFTOP_TABLE_HEADING
    });
  }
}

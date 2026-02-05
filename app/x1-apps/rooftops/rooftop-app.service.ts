import { ROOFTOP_COLUMNS_CONFIG, ROOFTOP_TABLE_CONFIG, ROOFTOP_TABLE_ACTIONS, ROOFTOP_TABLE_HEADING } from "~/x1-apps/rooftops/rooftop-settings";
import { FrameWorkAppService } from "../../clarity-admin/freame-work/frame-work-app";
import { CLARITY_DATA_TABLE_UNIQUE_IDS, TABLE_NAMES } from "~/shared-constants/contstants";
import { UIComponentType } from "~/shared-constants/admin.enums";

export class RoofTopAppService extends FrameWorkAppService {
  async RoofTopList() {
    const query = this.sql_query(TABLE_NAMES.ROOFTOP)
      .select("rt_dealer_id", "rt_name", "rt_street", "rt_city", "rt_state", "rt_zip", "rt_ph")
      .orderBy("rt_id", "desc");

    return this.BuildClarifyDataTable({
      query,
      component_type: UIComponentType.TABLE,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.ROOFTOP,
      columns: ROOFTOP_COLUMNS_CONFIG,
      configOverrides: ROOFTOP_TABLE_CONFIG,
      table_header: ROOFTOP_TABLE_HEADING,
      header_actions: ROOFTOP_TABLE_ACTIONS
    });
  }
}

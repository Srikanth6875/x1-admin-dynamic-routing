import { COLUMNS_CONFIG, RESELLER_TABLE_CONFIG, } from "~/x1-apps/rooftops/rooftop-settings";
import { FrameWorkAppService } from "../../clarity-admin/freame-work/frame-work-app";
import { TABLE_NAMES } from "~/shared-constants/contstants";

export class ResellerAppService extends FrameWorkAppService {

  async ResellerList() {
    const query = this.sql_query(TABLE_NAMES.ROOFTOP)
      .select(
        "rt_dealer_id",
        "rt_name",
        "rt_street",
        "rt_city",
        "rt_state",
        "rt_zip",
        "rt_ph"
      )
      .orderBy("rt_id", "desc");

    return this.buildTable({
      query,
      columns: COLUMNS_CONFIG,
      configOverrides: RESELLER_TABLE_CONFIG,
      table_header: "Rooftops",
    });
  }
}

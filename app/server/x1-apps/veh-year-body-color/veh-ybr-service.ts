import { FrameWorkAppService } from "~/server/frame-work/frame-work-app-service";
import { UIComponentType } from "~/shared/admin.enums";
import { CLARITY_DATA_TABLE_UNIQUE_IDS, TABLE_NAMES } from "~/shared/contstants";
import { BODY_TYPE_COLUMNS_CONFIG, BODY_TYPE_TABLE_CONFIG, BODY_TYPE_TABLE_HEADING, COLORS_COLUMNS_CONFIG, COLORS_TABLE_CONFIG, COLORS_TABLE_HEADING, YEAR_COLUMNS_CONFIG, YEAR_TABLE_CONFIG, YEAR_TYPE_TABLE_HEADING } from "./veh-ybr-settings";

export class VehicleYearBodyColorService extends FrameWorkAppService {
  async YearList() {
    const sqlQuery = this.query({ vm: TABLE_NAMES.VEHICLE_YEAR }).select("id", "year", "ctime", "mtime",);
    return await this.BuildClarifyDataTable({
      sqlQuery,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.VEHICLE_YEARS,
      columns: YEAR_COLUMNS_CONFIG,
      configOverrides: YEAR_TABLE_CONFIG,
      component_type: UIComponentType.TABLE,
      table_header: YEAR_TYPE_TABLE_HEADING,
    });
  }

  async BodyTypeList() {
    const sqlQuery = this.query({ vm: TABLE_NAMES.VEHICLE_BODY_TYPE }).select("id", "body_type", "ctime", "mtime",);

    return await this.BuildClarifyDataTable({
      sqlQuery,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.VEHICLE_BODY_TYPES,
      columns: BODY_TYPE_COLUMNS_CONFIG,
      configOverrides: BODY_TYPE_TABLE_CONFIG,
      component_type: UIComponentType.TABLE,
      table_header: BODY_TYPE_TABLE_HEADING,
    });
  }

  async VehColorList() {
    const sqlQuery = this.query({ vm: TABLE_NAMES.VEHICLE_COLOR }).select("id", "color", "ctime", "mtime",);

    return await this.BuildClarifyDataTable({
      sqlQuery,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.VEHICLE_COLORS,
      columns: COLORS_COLUMNS_CONFIG,
      configOverrides: COLORS_TABLE_CONFIG,
      component_type: UIComponentType.TABLE,
      table_header: COLORS_TABLE_HEADING,
    });
  }
}

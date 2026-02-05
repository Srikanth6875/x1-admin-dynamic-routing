import { FrameWorkAppService } from "~/clarity-admin/freame-work/frame-work-app";
import { CLARITY_DATA_TABLE_UNIQUE_IDS, TABLE_NAMES } from "~/shared-constants/contstants";
import {
  BODY_TYPE_COLUMNS_CONFIG,
  BODY_TYPE_TABLE_CONFIG,
  COLORS_COLUMNS_CONFIG,
  COLORS_TABLE_CONFIG,
  YEAR_COLUMNS_CONFIG,
  YEAR_TABLE_CONFIG,
} from "./veh-ybr-settings";
import { UIComponentType } from "~/shared-constants/admin.enums";

export class VehicleYearBodyColorService extends FrameWorkAppService {
  async YearList() {
    const query = this.sql_query({ vm: TABLE_NAMES.VEHICLE_YEAR }).select("id", "year", "ctime", "mtime",);
    return await this.BuildClarifyDataTable({
      query,
      component_type: UIComponentType.TABLE,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.VEHICLE_YEARS,
      columns: YEAR_COLUMNS_CONFIG,
      configOverrides: YEAR_TABLE_CONFIG,
      table_header: "Vehicle Years",
    });
  }

  async BodyTypeList() {
    const query = this.sql_query({ vm: TABLE_NAMES.VEHICLE_BODY_TYPE }).select("id", "body_type", "ctime", "mtime",);

    return await this.BuildClarifyDataTable({
      query,
      component_type: UIComponentType.TABLE,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.VEHICLE_BODY_TYPES,
      columns: BODY_TYPE_COLUMNS_CONFIG,
      configOverrides: BODY_TYPE_TABLE_CONFIG,
      table_header: "Vehicle Body Types",
    });
  }

  async VehColorList() {
    const query = this.sql_query({ vm: TABLE_NAMES.VEHICLE_COLOR }).select("id", "color", "ctime", "mtime",);

    return await this.BuildClarifyDataTable({
      query,
      component_type: UIComponentType.TABLE,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.VEHICLE_COLORS,
      columns: COLORS_COLUMNS_CONFIG,
      configOverrides: COLORS_TABLE_CONFIG,
      table_header: "Vehicle Int/Ext Colors",
    });
  }
}

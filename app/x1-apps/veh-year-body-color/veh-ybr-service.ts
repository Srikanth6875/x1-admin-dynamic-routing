import { FrameWorkAppService } from "~/clarity-admin/freame-work/frame-work-app";
import { TABLE_NAMES } from "~/shared-constants/contstants";
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
    const query = this.sql_query({ vm: TABLE_NAMES.VEHICLE_YEAR }).select(
      "id",
      "year",
      "ctime",
      "mtime",
    );
    return await this.buildDataTable({
      query,
      type: UIComponentType.TABLE,
      table_unique_id: TABLE_NAMES.VEHICLE_YEAR,
      columns: YEAR_COLUMNS_CONFIG,
      configOverrides: YEAR_TABLE_CONFIG,
      table_header: "Vehicle Years",
    });
  }

  async BodyTypeList() {
    const query = this.sql_query({ vm: TABLE_NAMES.VEHICLE_BODY_TYPE }).select(
      "id",
      "body_type",
      "ctime",
      "mtime",
    );
    return await this.buildDataTable({
      query,
      type: UIComponentType.TABLE,
      table_unique_id: TABLE_NAMES.VEHICLE_BODY_TYPE,
      columns: BODY_TYPE_COLUMNS_CONFIG,
      configOverrides: BODY_TYPE_TABLE_CONFIG,
      table_header: "Vehicle Body Types",
    });
  }

  async VehColorList() {
    const query = this.sql_query({ vm: TABLE_NAMES.VEHICLE_COLOR }).select(
      "id",
      "color",
      "ctime",
      "mtime",
    );
    return await this.buildDataTable({
      query,
      type: UIComponentType.TABLE,
      table_unique_id: TABLE_NAMES.VEHICLE_COLOR,
      columns: COLORS_COLUMNS_CONFIG,
      configOverrides: COLORS_TABLE_CONFIG,
      table_header: "Vehicle Int/Ext Colors",
    });
  }
}

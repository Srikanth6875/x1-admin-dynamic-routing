import { FrameWorkAppService } from "~/__clarity-admin/freame-work/frame-work-app";
import { TABLE_NAMES } from "~/__shared-constants/contstants";
import { BODY_TYPE_COLUMNS_CONFIG, BODY_TYPE_TABLE_CONFIG, COLORS_COLUMNS_CONFIG, COLORS_TABLE_CONFIG, YEAR_COLUMNS_CONFIG, YEAR_TABLE_CONFIG } from "./veh-ybr-settings";

export class VehicleYearBodyColorService extends FrameWorkAppService {
    async YearList() {
        const query = this.sql_query({ vm: TABLE_NAMES.VEHICLE_YEAR }).select("id", "year", "ctime", "mtime")
        return await this.buildTable({
            query,
            columns: YEAR_COLUMNS_CONFIG,
            configOverrides: YEAR_TABLE_CONFIG,
            table_header: "Vehicle Years",
        });
    }

    async BodyTypeList() {
        const query = this.sql_query({ vm: TABLE_NAMES.VEHICLE_BODY_TYPE }).select("id", "body_type", "ctime", "mtime")
        return await this.buildTable({
            query,
            columns: BODY_TYPE_COLUMNS_CONFIG,
            configOverrides: BODY_TYPE_TABLE_CONFIG,
            table_header: "Vehicle Body Types",
        });
    }

    async VehColorList() {
        const query = this.sql_query({ vm: TABLE_NAMES.VEHICLE_COLOR }).select("id", "color", "ctime", "mtime")
        return await this.buildTable({
            query,
            columns: COLORS_COLUMNS_CONFIG,
            configOverrides: COLORS_TABLE_CONFIG,
            table_header: "Vehicle Int/Ext Colors",
        });
    }
}

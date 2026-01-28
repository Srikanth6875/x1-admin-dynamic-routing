import { FrameWorkAppService } from "~/clarity-admin/freame-work/frame-work-app";
import { TABLE_NAMES } from "~/shared-constants/contstants";
import { MAKE_TABLE_CONFIG, MAKE_COLUMNS_CONFIG, MODEL_COLUMNS_CONFIG, MODEL_TABLE_CONFIG, TRIM_COLUMNS_CONFIG, TRIM_TABLE_CONFIG } from "./veh-mmt-settings";

export class VehicleMakeModelTrimService extends FrameWorkAppService {

    async MakeList() {
        const query = this.sql_query(TABLE_NAMES.VEHICLE_MAKE).select("id", "make", "make_ctime", "make_mtime")

        return await this.buildTable({
            query,
            columns: MAKE_COLUMNS_CONFIG,
            configOverrides: MAKE_TABLE_CONFIG,
            table_header: "Vehicle Makes",
        });
    }

    async ModelList() {
        const query = this.sql_query({ vm: TABLE_NAMES.VEHICLE_MODEL })
            .select(
                "vm.id",
                "mk.make as make",
                "vm.model",
                "vm.model_ctime",
                "vm.model_mtime",
            )
            .leftJoin({ mk: TABLE_NAMES.VEHICLE_MAKE }, "mk.id", "vm.make_id");

        return await this.buildTable({
            query,
            columns: MODEL_COLUMNS_CONFIG,
            configOverrides: MODEL_TABLE_CONFIG,
            table_header: "Vehicle Models",
        });
    }

    async VehicleTrimList() {
        const query = this.sql_query({ vt: TABLE_NAMES.VEHICLE_TRIM })
            .select(
                "vt.id",
                "mk.make as make",
                "vm.model as model",
                "vt.trim",
                "vt.trim_ctime",
                "vt.trim_mtime"
            )
            .leftJoin({ mk: TABLE_NAMES.VEHICLE_MAKE }, "mk.id", "vt.make_id")
            .leftJoin({ vm: TABLE_NAMES.VEHICLE_MODEL }, "vm.id", "vt.model_id");

        return await this.buildTable({
            query,
            columns: TRIM_COLUMNS_CONFIG,
            configOverrides: TRIM_TABLE_CONFIG,
            table_header: "Vehicle Trims",
        });
    }
}
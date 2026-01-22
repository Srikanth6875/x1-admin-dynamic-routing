import { FrameWorkAppService } from "~/__clarity-admin/freame-work/frame-work-app";
import { TABLE_NAMES } from "~/__shared-constants/contstants";
import { VEHICLE_COLUMNS_CONFIG, VEHICLE_TABLE_CONFIG } from "./vehicles-settings";

export class VehicleService extends FrameWorkAppService {

    async getVehicleList() {
        const query = this.sql_query({ v: TABLE_NAMES.VEHICLES })
            .leftJoin({ y: TABLE_NAMES.VEHICLE_YEAR }, "v.veh_year_id", "y.id")
            .leftJoin({ mk: TABLE_NAMES.VEHICLE_MAKE }, "v.veh_make_id", "mk.id")
            .leftJoin({ md: TABLE_NAMES.VEHICLE_MODEL }, "v.veh_model_id", "md.id")
            .leftJoin({ tr: TABLE_NAMES.VEHICLE_TRIM }, "v.veh_trim_id", "tr.id")
            .leftJoin({ bt: TABLE_NAMES.VEHICLE_BODY_TYPE }, "v.veh_body_type_id", "bt.id")
            .leftJoin({ ec: TABLE_NAMES.VEHICLE_COLOR }, "v.veh_ext_color_id", "ec.id")
            .leftJoin({ ic: TABLE_NAMES.VEHICLE_COLOR }, "v.veh_int_color_id", "ic.id")
            .select([
                "v.veh_id",
                "v.veh_stock",
                "v.veh_vin",
                "v.veh_active",
                "v.veh_listing_type",
                "v.veh_certified",
                "v.veh_miles",

                this.sql_query.raw("y.year AS year"),
                this.sql_query.raw("mk.make AS make"),
                this.sql_query.raw("md.model AS model"),
                this.sql_query.raw("tr.trim AS trim"),
                this.sql_query.raw("bt.body_type AS body_type"),
                this.sql_query.raw("ec.color AS exterior_color"),
                this.sql_query.raw("ic.color AS interior_color"),

                "v.veh_ctime",
            ]).whereNull("v.veh_dtime");

        return this.buildTable({
            query,
            columns: VEHICLE_COLUMNS_CONFIG,
            configOverrides: VEHICLE_TABLE_CONFIG,
        });
    }

    async getVehicleMakes(){

    }
}
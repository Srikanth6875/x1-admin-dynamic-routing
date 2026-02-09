import { FrameWorkAppService } from "~/server/frame-work/frame-work-app-service";
import { CLARITY_DATA_TABLE_UNIQUE_IDS, TABLE_NAMES } from "~/shared/contstants";
import { VEHICLE_COLUMNS_CONFIG, VEHICLE_TABLE_CONFIG, VEHICLE_TABLE_HEADING } from "./vehicles-settings";
import { UIComponentType } from "~/shared/admin.enums";

export class VehicleService extends FrameWorkAppService {
  async getVehicleList() {
    const sqlQuery = this.query({ v: TABLE_NAMES.VEHICLES })
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
        this.query.raw("y.year AS year"),
        this.query.raw("mk.make AS make"),
        this.query.raw("md.model AS model"),
        this.query.raw("tr.trim AS trim"),
        this.query.raw("bt.body_type AS body_type"),
        this.query.raw("ec.color AS exterior_color"),
        this.query.raw("ic.color AS interior_color"),
        "v.veh_ctime",
      ])
      .whereNull("v.veh_dtime");

    return this.BuildClarifyDataTable({
      sqlQuery,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.VEHICLES,
      columns: VEHICLE_COLUMNS_CONFIG,
      configOverrides: VEHICLE_TABLE_CONFIG,
      component_type: UIComponentType.TABLE,
      table_header: VEHICLE_TABLE_HEADING,
    });
  }
}

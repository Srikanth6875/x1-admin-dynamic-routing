import { FrameWorkAppService } from "~/server/frame-work/frame-work-app-service";
import {
  CLARITY_DATA_TABLE_UNIQUE_IDS,
  TABLE_NAMES,
} from "~/shared/contstants";
import {
  VEHICLE_COLUMNS_CONFIG,
  VEHICLE_DETAILS_TABLES,
  VEHICLE_DETAILS_TABS,
  VEHICLE_FIELDS,
  // VEHICLE_OPTIONS_TABLE_COLUMNS,
  VEHICLE_TABLE_ACTION_CONFIG, 
  VEHICLE_TABLE_META,
} from "./vehicles-settings";
import { UIComponentType } from "~/shared/admin.enums";
import { requestStore } from "~/database/request-store";
import type { RenderResult } from "~/types/listining-types";
import { getMongoDb } from "~/shared/mongodb.server";

export class VehicleService extends FrameWorkAppService {

  async getVehicleList() {
    const sqlQuery = this.query({ v: TABLE_NAMES.VEHICLES })
      .leftJoin({ y: TABLE_NAMES.VEHICLE_YEAR }, "v.veh_year_id", "y.id")
      .leftJoin({ mk: TABLE_NAMES.VEHICLE_MAKE }, "v.veh_make_id", "mk.id")
      .leftJoin({ md: TABLE_NAMES.VEHICLE_MODEL }, "v.veh_model_id", "md.id")
      .leftJoin({ tr: TABLE_NAMES.VEHICLE_TRIM }, "v.veh_trim_id", "tr.id")
      .leftJoin(
        { bt: TABLE_NAMES.VEHICLE_BODY_TYPE },
        "v.veh_body_type_id",
        "bt.id",
      )
      .leftJoin(
        { ec: TABLE_NAMES.VEHICLE_COLOR },
        "v.veh_ext_color_id",
        "ec.id",
      )
      .leftJoin(
        { ic: TABLE_NAMES.VEHICLE_COLOR },
        "v.veh_int_color_id",
        "ic.id",
      )
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
      .whereNull("v.veh_dtime").andWhere("v.veh_active", 1);

    return this.BuildClarityDataTable({
      sqlQuery,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.VEHICLES,
      columns: VEHICLE_COLUMNS_CONFIG,
      configOverrides: VEHICLE_TABLE_META.config,
      component_type: UIComponentType.TABLE,
      table_header: VEHICLE_TABLE_META.heading,
        row_actions: VEHICLE_TABLE_ACTION_CONFIG.rowActions,

    });
  }

  async getVehicleInformation(veh_vin: string) {
    const vehicle = await this.query(TABLE_NAMES.VEHICLES)
      .select(
        "vehicles.veh_id",
        "vehicles.veh_vin",
        "vehicles.veh_stock",
        "vehicles.veh_listing_type",
        "veh_body_type.body_type",
        "veh_color.color as exterior_color",
        "vehicles.veh_miles",
        "veh_year.year",
        "veh_make.make",
        "veh_model.model",
        "veh_trim.trim",
      )
      .leftJoin("veh_make", "vehicles.veh_make_id", "veh_make.id")
      .leftJoin("veh_year", "vehicles.veh_year_id", "veh_year.id")
      .leftJoin(
        "veh_body_type",
        "vehicles.veh_body_type_id",
        "veh_body_type.id",
      )
      .leftJoin("veh_color", "vehicles.veh_ext_color_id", "veh_color.id")
      .leftJoin("veh_model", "vehicles.veh_model_id", "veh_model.id")
      .leftJoin("veh_trim", "vehicles.veh_trim_id", "veh_trim.id")
      .where("vehicles.veh_vin", veh_vin)
      .first();

    return this.executeQuery(vehicle);
  }

  async getVehicleFullDetails(veh_vin: string) {
    const db = await getMongoDb();

    const [vehicleData, vehicleDescription, vehicleOptions] = await Promise.all(
      [
        this.getVehicleInformation(veh_vin),
        db.collection("vehicle_descriptions").findOne({ veh_vin }),
        db.collection("vehicle_options").findOne({ veh_vin }),
      ],
    );

    return {
      vehicleData,
      vehicleDescription: vehicleDescription?.veh_description || "",
      vehicleOptions: vehicleOptions?.veh_options || [],
    };
  }

  async VehicleDetails(): Promise<RenderResult> {
    const params = requestStore.tryGet()?.query ?? {};
    const veh_vin = params.veh_vin as string;

    if (!veh_vin) throw new Error("VIN required");

    const { vehicleData, vehicleDescription, vehicleOptions } =
      await this.getVehicleFullDetails(veh_vin);
      
   const vehicleOptionsArray = Array.isArray(vehicleOptions)
    ? vehicleOptions.map((opt: string) => ({ option: opt }))
    : typeof vehicleOptions === "string"
      ? vehicleOptions.split(",").map((opt) => ({ option: opt.trim() }))
      : [];


    return this.BuildDetails({
      title: "Vehicle Details",
      data: {
        ...vehicleData,
        veh_description: vehicleDescription,
        options: vehicleOptionsArray,
      },
      fields: VEHICLE_FIELDS(),
      tables: VEHICLE_DETAILS_TABLES,
      tabs: VEHICLE_DETAILS_TABS,
    });
  }
}

import { FrameWorkAppService } from "~/server/frame-work/frame-work-app-service";
import {
  ROOFTOP_COLUMNS_CONFIG,
  ROOFTOP_FILEDS,
  ROOFTOP_TABLE_CONFIG,
  ROOFTOP_TABLE_ACTION_CONFIG,
  ROOFTOP_VEHICLE_DETAILS_TABLES,
} from "~/server/x1-apps/rooftops/rooftop-settings";
import { UIComponentType } from "~/shared/admin.enums";
import { requestStore } from "~/database/request-store";

import {
  CLARITY_DATA_TABLE_UNIQUE_IDS,
  TABLE_NAMES,
} from "~/shared/contstants";
import type {
  BuildFormResult,
  SaveFormResult,
} from "~/types/form-builder.types";
import type { RenderResult } from "~/types/listining-types";
import { VEHICLE_DETAILS_TABLES } from "../vehicles/vehicles-settings";

export class RoofTopAppService extends FrameWorkAppService {
  async RoofTopList() {
    const sqlQuery = this.query(TABLE_NAMES.ROOFTOP)
      .select(
        "rt_id",
        "rt_dealer_id",
        "rt_name",
        "rt_street",
        "rt_city",
        "rt_state",
        "rt_zip",
        "rt_ph",
      )
      .orderBy("rt_id", "desc");

    return this.BuildClarifyDataTable({
      sqlQuery,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.ROOFTOP,
      columns: ROOFTOP_COLUMNS_CONFIG,
      configOverrides: ROOFTOP_TABLE_CONFIG,
      component_type: UIComponentType.TABLE,
      table_header: ROOFTOP_TABLE_ACTION_CONFIG.heading,
      row_actions: ROOFTOP_TABLE_ACTION_CONFIG.rowActions,
    });
  }

  async AddRooftop(del: boolean = false): Promise<BuildFormResult> {
    const fields = ROOFTOP_FILEDS();
    const url_cols = {
      APP_TYPE: "ROOFTOPS",
      ID_COL: "rt_id",
      DISPLAY_COL: "Rooftop",
      ACTION: "SAVE_ROOFTOP",
      CANCEL_ACTION: "GET_ROOFTOPS",
      TABLE: "rooftop",
      HEADER: "Rooftop",
    };
    return this.BuildForm({
      fields,
      url_cols,
      del,
    });
  }

  async EditRooftop(): Promise<BuildFormResult> {
    return this.AddRooftop();
  }

  async RooftopSave(): Promise<SaveFormResult> {
    const fields = ROOFTOP_FILEDS();
    return this.SaveFormData("rooftop", fields, "rt_id");
  }

  async RooftopDelete(): Promise<BuildFormResult> {
    return this.AddRooftop(true);
  }

  async getRooftopDetails(rooftopId: string) {
    if (!rooftopId) return null;
    const sqlQuery = this.query(TABLE_NAMES.ROOFTOP)
      .select(
        "rt_id",
        "rt_dealer_id",
        "rt_name",
        "rt_street",
        "rt_city",
        "rt_state",
        "rt_ph",
        "rt_email",
        "rt_zip",
        "rt_site",
        "rt_inactive",
      )
      .where("rt_id", rooftopId)
      .first();

    return this.executeQuery(sqlQuery);
  }

  async getVehiclesByRooftop(rooftopId: string) {
    if (!rooftopId) return [];

    const sqlQuery = this.query("vehicles as v")
      .select(
        "v.veh_id",
        "v.veh_vin",
        "vy.year",
        "vmk.make as make",
        "vmo.model as model",
        "vt.trim as trim",
        "vb.body_type as body_type",
      )
      .leftJoin("veh_make as vmk", "v.veh_make_id", "vmk.id")
      .leftJoin("veh_model as vmo", "v.veh_model_id", "vmo.id")
      .leftJoin("veh_trim as vt", "v.veh_trim_id", "vt.id")
      .leftJoin("veh_year as vy", "v.veh_year_id", "vy.id")
      .leftJoin("veh_body_type as vb", "v.veh_body_type_id", "vb.id")
      .where("v.veh_rt_id", rooftopId)
      .orderBy("v.veh_id", "asc");

    return this.executeQuery(sqlQuery);
  }

  async RooftopDetails(): Promise<RenderResult> {
    const params = requestStore.tryGet()?.query ?? {};
    const rooftopId = params.rt_id;

    const rooftop = await this.getRooftopDetails(rooftopId);
    const vehicles = await this.getVehiclesByRooftop(rooftopId);

    return this.BuildDetails({
      title: "Rooftop Details",
      data: { ...rooftop, vehicles },
      fields: ROOFTOP_FILEDS(),
      tables: ROOFTOP_VEHICLE_DETAILS_TABLES,
    });
  }
}

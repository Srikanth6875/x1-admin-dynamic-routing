import { FrameWorkAppService } from "~/server/frame-work/frame-work-app-service";
import { CLARITY_DATA_TABLE_UNIQUE_IDS, TABLE_NAMES } from "~/shared/contstants";
import type {
  BuildFormResult,
  SaveFormResult,
} from "~/types/form-builder.types";
import { TRIM_COLUMNS_CONFIG, TRIM_FIELDS, TRIM_TABLE_CONFIG, TRIM_TABLE_ACTION_CONFIG } from "./vehicle-trim-settings";
import { UIComponentType } from "~/shared/admin.enums";

export class TrimAppService extends FrameWorkAppService {

  async TrimList() {
    const sqlQuery = this.query({ vt: TABLE_NAMES.VEHICLE_TRIM })
      .select(
        "vt.id",
        "mk.make as make",
        "vm.model as model",
        "vt.trim",
        "vt.trim_ctime",
        "vt.trim_mtime",
      )
      .leftJoin({ mk: TABLE_NAMES.VEHICLE_MAKE }, "mk.id", "vt.make_id")
      .leftJoin({ vm: TABLE_NAMES.VEHICLE_MODEL }, "vm.id", "vt.model_id")
      .orderBy("id", "desc");

    return await this.BuildClarifyDataTable({
      sqlQuery,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.VEHICLE_TRIMS,
      columns: TRIM_COLUMNS_CONFIG,
      configOverrides: TRIM_TABLE_CONFIG,
      component_type: UIComponentType.TABLE,
      table_header: TRIM_TABLE_ACTION_CONFIG.heading,
      row_actions: TRIM_TABLE_ACTION_CONFIG.rowActions,
    });
  }

  async AddTrim(del: boolean = false): Promise<BuildFormResult> {
    const fields = TRIM_FIELDS();
    const make_options = await this.query({ vm: TABLE_NAMES.VEHICLE_MAKE })
      .select("vm.id as value", "vm.make as label");

    const model_options = await this.query({ vm: TABLE_NAMES.VEHICLE_MODEL })
      .select("vm.id as value", "vm.model as label");

    fields.makeId.options = make_options;
    fields.modelId.options = model_options;

    const url_cols = {
      APP_TYPE: "TRIM",
      ID_COL: "id",
      ACTION: "SAVE_TRIM",
      CANCEL_ACTION: "GET_TRIMS",
      TABLE: "veh_trim",
      HEADER: "Trim",
    };

    return this.BuildForm({
      fields,
      url_cols,
      del,
    });
  }

  async EditTrim(): Promise<BuildFormResult> {
    return this.AddTrim();
  }

  async TrimSave(): Promise<SaveFormResult> {
    const fields = TRIM_FIELDS();
    return this.SaveFormData("veh_trim", fields, "id");
  }

  async TrimDelete(): Promise<BuildFormResult> {
    return this.AddTrim(true);
  }

}

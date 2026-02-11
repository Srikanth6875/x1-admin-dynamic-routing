import { FrameWorkAppService } from "~/server/frame-work/frame-work-app-service";
import type {
  BuildFormResult,
  SaveFormResult,
} from "~/types/form-builder.types";
import {
  MODEL_COLUMNS_CONFIG,
  MODEL_FIELDS,
  MODEL_TABLE_CONFIG,
  MODEL_TABLE_HEADING,
  MODEL_TABLE_ROW_ACTIONS,
} from "./Model";
import {
  CLARITY_DATA_TABLE_UNIQUE_IDS,
  TABLE_NAMES,
} from "~/shared/contstants";
import { UIComponentType } from "~/shared/admin.enums";

export class ModelAppService extends FrameWorkAppService {

  async ModelList() {
    const query = this.sql_query({ vm: TABLE_NAMES.VEHICLE_MODEL })
      .select(
        "vm.id",
        "mk.make as make",
        "vm.model",
        "vm.model_ctime",
        "vm.model_mtime",
      )
      .leftJoin({ mk: TABLE_NAMES.VEHICLE_MAKE }, "mk.id", "vm.make_id")
      .orderBy("id", "desc");

    return await this.BuildClarifyDataTable({
      query,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.VEHICLE_MODELS,
      columns: MODEL_COLUMNS_CONFIG,
      configOverrides: MODEL_TABLE_CONFIG,
      component_type: UIComponentType.TABLE,
      table_header: MODEL_TABLE_HEADING,
      row_actions: MODEL_TABLE_ROW_ACTIONS,
    });
  }

  async AddModel(del: boolean = false): Promise<BuildFormResult> {
    const fields = MODEL_FIELDS();
    const makes = await this.sql_query({ vm: TABLE_NAMES.VEHICLE_MAKE }).select(
      "vm.id as value",
      "vm.make as label",
    );

    fields.makeId.options = makes;

    const url_cols = {
      APP_TYPE: "MODEL",
      ID_COL: "id",
      ACTION: "SAVE_MODEL",
      CANCEL_ACTION: "GET_MODELS",
      TABLE: "veh_model",
      HEADER: "Model",
    };

    return this.BuildForm({
      fields,
      url_cols,
      del,
    });
  }

  async EditModel(): Promise<BuildFormResult> {
    return this.AddModel();
  }

  async ModelSave(): Promise<SaveFormResult> {
    const fields = MODEL_FIELDS();

    return this.SaveFormData("veh_model", fields, "id");
  }
  async ModelDelete(): Promise<BuildFormResult> {
    return this.AddModel(true);
  }
}

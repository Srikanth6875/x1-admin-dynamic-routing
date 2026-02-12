import { FrameWorkAppService } from "~/server/frame-work/frame-work-app-service";
import type {
  BuildFormResult,
  SaveFormResult,
} from "~/types/form-builder.types";
import { MAKE_FIELDS, MAKE_TABLE_ACTION_CONFIG, MAKES_COLUMNS_CONFIG, MAKES_TABLE_CONFIG } from "./vehicle-make-settings";
import { CLARITY_DATA_TABLE_UNIQUE_IDS, TABLE_NAMES } from "~/shared/contstants";
import { UIComponentType } from "~/shared/admin.enums";

export class MakeAppService extends FrameWorkAppService {

  async MakeList() {
    const sqlQuery = this.query(TABLE_NAMES.VEHICLE_MAKE)
      .select("id", "make", "make_ctime", "make_mtime",)
      .orderBy("id", "desc");

    return await this.BuildClarifyDataTable({
      sqlQuery,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.VEHICLE_MAKES,
      columns: MAKES_COLUMNS_CONFIG,
      configOverrides: MAKES_TABLE_CONFIG,
      component_type: UIComponentType.TABLE,
      table_header: MAKE_TABLE_ACTION_CONFIG.heading,
      row_actions: MAKE_TABLE_ACTION_CONFIG.rowActions,
    });

  }

  async MakeAdd(del: boolean = false): Promise<BuildFormResult> {

    const fields = MAKE_FIELDS();
    const url_cols = {
      APP_TYPE: "MAKE",
      ID_COL: "id",
      ACTION: "SAVE_MAKE",
      CANCEL_ACTION: "GET_MAKES",
      TABLE: "veh_make",
      HEADER: "Make",
    };

    return this.BuildForm({
      fields,
      url_cols,
      del,
    });
  }

  async MakeEdit(): Promise<BuildFormResult> {
    return this.MakeAdd();
  }

  async MakeSave(): Promise<SaveFormResult> {
    const fields = MAKE_FIELDS();
    return this.SaveFormData("veh_make", fields, "id");
  }

  async MakeDelete(): Promise<BuildFormResult> {
    return this.MakeAdd(true);
  }
}

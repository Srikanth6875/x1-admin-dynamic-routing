import { FrameWorkAppService } from "~/server/frame-work/frame-work-app-service";
import type {
  BuildFormResult,
  SaveFormResult,
} from "~/types/form-builder.types";
import {
  CLARITY_DATA_TABLE_UNIQUE_IDS,
  TABLE_NAMES,
} from "~/shared/contstants";
import { UIComponentType } from "~/shared/admin.enums";
import {
  MODULES_COLUMNS_CONFIG,
  MODULES_TABLE_CONFIG,
  MODULES_TABLE_ACTION_CONFIG,
  MODULES_FIELDS,
} from "./module.settings";
export class ModulesService extends FrameWorkAppService {

  async ModulesList() {
    const sqlQuery = this.query({ xm: TABLE_NAMES.X_APP_MODULES })
      .select(
        "xm_id",
        "xm_xa_id",
        "xm_name",
        "xm_label",
        "xm_class",
        "xm_status",
        "xm_default_runtype_id",
        "xm_created_time",
        "xm_last_updated",
      )
      .orderBy("xm_id", "desc");

    return await this.BuildClarityDataTable({
      sqlQuery,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.X_APP_MODULES,
      columns: MODULES_COLUMNS_CONFIG,
      configOverrides: MODULES_TABLE_CONFIG,
      component_type: UIComponentType.TABLE,
      table_header: MODULES_TABLE_ACTION_CONFIG.heading,
      row_actions: MODULES_TABLE_ACTION_CONFIG.rowActions,
    });
  }

  async AddModule(del: boolean = false): Promise<BuildFormResult> {
    const fields = MODULES_FIELDS();

    const url_cols = {
      APP_TYPE: "MODULES",
      ID_COL: "xm_id",
      ACTION: "SAVE_MODULE",
      CANCEL_ACTION: "GET_MODULES",
      TABLE: "x_app_modules",
      HEADER: "Module",
    };

    return this.BuildForm({
      fields,
      url_cols,
      del,
    });
  }

  async EditModule(): Promise<BuildFormResult> {
    return this.AddModule();
  }

  async SaveModule(): Promise<SaveFormResult> {
    const fields = MODULES_FIELDS();
    return this.SaveFormData("x_app_modules", fields, "xm_id");
  }

  async DeleteModule(): Promise<BuildFormResult> {
    return this.AddModule(true);
  }


}

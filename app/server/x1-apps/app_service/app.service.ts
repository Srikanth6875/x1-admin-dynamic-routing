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
  APPS_COLUMNS_CONFIG,
  APPS_FIELDS,
  APPS_TABLE_ACTION_CONFIG,
  APPS_TABLE_CONFIG,
} from "./app.settings";

export class AppsService extends FrameWorkAppService {
    
  async AppsList() {
    const sqlQuery = this.query({ xa: TABLE_NAMES.X_APPS })
      .select(
        "xa_id",
        "xa_name",
        "xa_label",
        "xa_base_class",
        "xa_status",
        "xa_created_time",
        "xa_last_updated",
      )
      .orderBy("xa_id", "desc");

    return await this.BuildClarityDataTable({
      sqlQuery,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.X_APPS,
      columns: APPS_COLUMNS_CONFIG,
      configOverrides: APPS_TABLE_CONFIG,
      component_type: UIComponentType.TABLE,
      table_header: APPS_TABLE_ACTION_CONFIG.heading,
      row_actions: APPS_TABLE_ACTION_CONFIG.rowActions,
    });
  }

  async AddApp(del: boolean = false): Promise<BuildFormResult> {
    const fields = APPS_FIELDS();

    const url_cols = {
      APP_TYPE: "APPS",
      ID_COL: "xa_id",
      ACTION: "SAVE_APP",
      CANCEL_ACTION: "GET_APPS",
      TABLE: "x_apps",
      HEADER: "Application",
    };

    return this.BuildForm({
      fields,
      url_cols,
      del,
    });
  }

  async AppEdit(): Promise<BuildFormResult> {
    return this.AddApp();
  }

  async AppSave(): Promise<SaveFormResult> {
    const fields = APPS_FIELDS();
    return this.SaveFormData("x_apps", fields, "xa_id");
  }

  async AppDelete(): Promise<BuildFormResult> {
    return this.AddApp(true);
  }
}

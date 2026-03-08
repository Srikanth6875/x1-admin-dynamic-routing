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
    const sqlQuery = this.query({
      xm: TABLE_NAMES.X_APP_MODULE,
    })
      .leftJoin({ xa: TABLE_NAMES.X_APPS }, "xm.xm_xa_id", "xa.xa_id")
      .select(
        "xm.xm_id",
        "xa.xa_name as app_name",
        "xm.xm_name",
        "xm.xm_shortcut",
        this.query.raw(`
        CASE 
          WHEN xm.xm_status = 1 THEN 'Active' 
          WHEN xm.xm_status = 0 THEN 'Inactive' 
          ELSE 'Unknown' 
        END as xm_status
      `),
        "xm.xm_created_time",
        "xm.xm_last_updated",
      )
      .orderBy("xm.xm_id", "desc");

    return await this.BuildClarityDataTable({
      sqlQuery,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.X_APP_MODULE,
      columns: MODULES_COLUMNS_CONFIG,
      configOverrides: MODULES_TABLE_CONFIG,
      component_type: UIComponentType.TABLE,
      table_header: MODULES_TABLE_ACTION_CONFIG.heading,
      row_actions: MODULES_TABLE_ACTION_CONFIG.rowActions,
    });
  }

  async AddModule(del: boolean = false): Promise<BuildFormResult> {
    const fields = MODULES_FIELDS();

    const apps = await this.query({ xa: TABLE_NAMES.X_APPS })
      .select("xa_id as value", "xa_name", "xa_shortcut")
      .where("xa_status", 1)
      .orderBy("xa_name", "asc");

    fields.xm_xa_id.options = apps.map((a) => ({
      value: a.value,
      label: `${a.xa_name} - ${a.xa_shortcut}`,
    }));

    const url_cols = {
      APP_TYPE: "MODULES",
      ID_COL: "xm_id",
      ACTION: "SAVE_MODULE",
      CANCEL_ACTION: "GET_MODULES",
      TABLE: TABLE_NAMES.X_APP_MODULE,
      HEADER: "Module",
    };

    return this.BuildForm({ fields, url_cols, del });
  }

  async EditModule(): Promise<BuildFormResult> {
    return this.AddModule();
  }

  async SaveModule(): Promise<SaveFormResult> {
    const fields = MODULES_FIELDS();

    return this.SaveFormData(TABLE_NAMES.X_APP_MODULE, fields, "xm_id");
  }

  async DeleteModule(): Promise<BuildFormResult> {
    return this.AddModule(true);
  }
}

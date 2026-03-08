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
import { RunTypeRepository } from "./runtype.repository";
import {
  RUNTYPES_COLUMNS_CONFIG,
  RUNTYPES_FIELDS,
  RUNTYPES_TABLE_ACTION_CONFIG,
  RUNTYPES_TABLE_CONFIG,
} from "./runtype.settings";

export class RunTypesService extends FrameWorkAppService {
  private readonly runtypeDb = new RunTypeRepository();

  async RunTypesList() {
    const sqlQuery = this.query({ xr: TABLE_NAMES.X_APP_RUNTYPE })
      .leftJoin({ xm: TABLE_NAMES.X_APP_MODULE }, "xr.xr_xm_id", "xm.xm_id")
      .leftJoin({ xa: TABLE_NAMES.X_APPS }, "xm.xm_xa_id", "xa.xa_id")
      .select(
        "xr.xr_id",
        "xa.xa_name as app_name",
        "xm.xm_name as module_name",
        "xr.xr_class",
        "xr.xr_method",
        "xr.xr_shortcut",
        this.query.raw(`
      CASE 
        WHEN xr.xr_status = 1 THEN 'Active' 
        WHEN xr.xr_status = 0 THEN 'Inactive' 
        ELSE 'Unknown' 
      END as xr_status
    `),
        "xr.xr_created_time",
        "xr.xr_last_updated",
      )
      .orderBy("xr.xr_id", "desc");

    return this.BuildClarityDataTable({
      sqlQuery,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.X_APP_RUNTYPE,
      columns: RUNTYPES_COLUMNS_CONFIG,
      configOverrides: RUNTYPES_TABLE_CONFIG,
      component_type: UIComponentType.TABLE,
      table_header: RUNTYPES_TABLE_ACTION_CONFIG.heading,
      row_actions: RUNTYPES_TABLE_ACTION_CONFIG.rowActions,
    });
  }
  
  async AddRunType(del = false): Promise<BuildFormResult> {
    const xrId = this.getQueryRecordId("xr_id");
    const params = this.getQueryParams();

    let runType: any = null;

    if (xrId) {
      runType = await this.runtypeDb.getRunTypeById(xrId);
    }

    const apps = await this.runtypeDb.getActiveApps();
    const appOptions = apps.map((a) => ({
      value: a.value,
      label: `${a.xa_name} (${a.xa_shortcut})`,
    }));

    const selectedAppId =
      Number(params?.app_selector ?? 0) ||
      (runType?.xr_xm_id
        ? (await this.runtypeDb.getAppIdByModuleId(runType.xr_xm_id))?.xm_xa_id
        : null);

    const moduleOptions = selectedAppId
      ? (await this.runtypeDb.getModulesByApp(selectedAppId)).map((m) => ({
          value: m.value,
          label: `${m.xm_name} (${m.xm_shortcut})`,
        }))
      : [];

    const selectedModuleId =
      Number(params?.xr_xm_id ?? 0) || runType?.xr_xm_id || null;

    const fields = RUNTYPES_FIELDS(
      appOptions,
      moduleOptions,
      selectedAppId,
      selectedModuleId,
    );

    return this.BuildForm({
      fields,

      initialValues: {
        xr_id: runType?.xr_id,
        app_selector: selectedAppId ?? "",
        xr_xm_id: selectedModuleId ?? "",
        xr_shortcut: runType?.xr_shortcut,
        xr_class: runType?.xr_class,
        xr_method: runType?.xr_method,
        xr_status: runType?.xr_status ?? 1,
      },

      url_cols: {
        APP_TYPE: "RUNTYPES",
        ID_COL: "xr_id",
        ACTION: "SAVE_RUNTYPE",
        CANCEL_ACTION: "GET_RUNTYPES",
        TABLE: TABLE_NAMES.X_APP_RUNTYPE,
        HEADER: "Run Type",
      },

      del,
    });
  }

  async EditRunType(): Promise<BuildFormResult> {
    return this.AddRunType();
  }

  async DeleteRunType(): Promise<BuildFormResult> {
    return this.AddRunType(true);
  }

  async SaveRunType(): Promise<SaveFormResult> {
    return this.SaveFormData(
      TABLE_NAMES.X_APP_RUNTYPE,
      RUNTYPES_FIELDS(),
      "xr_id",
    );
  }


}

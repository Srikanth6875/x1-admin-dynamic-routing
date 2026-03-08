import { FrameWorkAppService } from "~/server/frame-work/frame-work-app-service";
import type {
  BuildFormResult,
  SaveFormResult,
} from "~/types/form-builder.types";

import {
  BODY_TYPE_COLUMNS_CONFIG,
  BODY_TYPE_TABLE_CONFIG,
  BODY_TYPE_TABLE_ACTION_CONFIG,
  BODY_TYPE_FIELDS,
} from "./bodytype-app.settings";

import { CLARITY_DATA_TABLE_UNIQUE_IDS, TABLE_NAMES } from "~/shared/contstants";
import { UIComponentType } from "~/shared/admin.enums";

export class BodyTypeAppService extends FrameWorkAppService {

  async BodyTypeList() {
    const sqlQuery = this.query({ vm: TABLE_NAMES.VEHICLE_BODY_TYPE })
      .select("id", "body_type", "ctime", "mtime")
      .orderBy("id", "desc");

    return await this.BuildClarityDataTable({
      sqlQuery,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.VEHICLE_BODY_TYPE,
      columns: BODY_TYPE_COLUMNS_CONFIG,
      configOverrides: BODY_TYPE_TABLE_CONFIG,
      component_type: UIComponentType.TABLE,
      table_header: BODY_TYPE_TABLE_ACTION_CONFIG.heading,
      row_actions: BODY_TYPE_TABLE_ACTION_CONFIG.rowActions,
    });
  }

  async AddBodyType(del: boolean = false): Promise<BuildFormResult> {
    const fields = BODY_TYPE_FIELDS();

    const url_cols = {
      APP_TYPE: "BODY_TYPE",
      ID_COL: "id",
      ACTION: "SAVE_BODY_TYPE",
      CANCEL_ACTION: "GET_BODY_TYPES",
      TABLE: "veh_body_type",
      HEADER: "Body Type",
    };

    return this.BuildForm({
      fields,
      url_cols,
      del,
    });
  }

  async BodyTypeEdit(): Promise<BuildFormResult> {
    return this.AddBodyType();
  }

  async BodyTypeSave(): Promise<SaveFormResult> {
    const fields = BODY_TYPE_FIELDS();
    return this.SaveFormData("veh_body_type", fields, "id");
  }

  async BodyTypeDelete(): Promise<BuildFormResult> {
    return this.AddBodyType(true);
  }

}
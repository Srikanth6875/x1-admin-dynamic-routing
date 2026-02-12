import { FrameWorkAppService } from "~/server/frame-work/frame-work-app-service";
import type {
  BuildFormResult,
  SaveFormResult,
} from "~/types/form-builder.types";
import { COLORS_COLUMNS_CONFIG, COLORS_TABLE_CONFIG, COLOUR_TABLE_ACTION_CONFIG, COLOUR_FIELDS } from "./colors-settings";
import { CLARITY_DATA_TABLE_UNIQUE_IDS, TABLE_NAMES } from "~/shared/contstants";
import { UIComponentType } from "~/shared/admin.enums";

export class ColourAppService extends FrameWorkAppService {

  async ColourList() {
    const sqlQuery = this.query({ vm: TABLE_NAMES.VEHICLE_COLOR })
      .select("id", "color", "ctime", "mtime",)
      .orderBy("id", "desc");

    return await this.BuildClarifyDataTable({
      sqlQuery,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.VEHICLE_COLORS,
      columns: COLORS_COLUMNS_CONFIG,
      configOverrides: COLORS_TABLE_CONFIG,
      component_type: UIComponentType.TABLE,
      table_header: COLOUR_TABLE_ACTION_CONFIG.heading,
      row_actions: COLOUR_TABLE_ACTION_CONFIG.rowActions,
    });
  }

  async AddColour(del: boolean = false): Promise<BuildFormResult> {
    const fields = COLOUR_FIELDS();
    const url_cols = {
      APP_TYPE: "COLOUR",
      ID_COL: "id",
      ACTION: "SAVE_COLOUR",
      CANCEL_ACTION: "GET_COLOURS",
      TABLE: "veh_color",
      HEADER: "Colour",
    };
    return this.BuildForm({
      fields,
      url_cols,
      del,
    });
  }

  async ColourEdit(): Promise<BuildFormResult> {
    return this.AddColour();
  }

  async ColourSave(): Promise<SaveFormResult> {
    const fields = COLOUR_FIELDS();
    return this.SaveFormData("veh_color", fields, "id");
  }
  async ColourDelete(): Promise<BuildFormResult> {
    return this.AddColour(true);
  }
}


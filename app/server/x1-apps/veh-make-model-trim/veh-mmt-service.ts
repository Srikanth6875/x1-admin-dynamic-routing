import { FrameWorkAppService } from "~/server/frame-work/frame-work-app-service";
import { CLARITY_DATA_TABLE_UNIQUE_IDS, TABLE_NAMES } from "~/shared/contstants";
import { MAKE_TABLE_HEADING, MAKES_COLUMNS_CONFIG, MAKES_TABLE_CONFIG, MODEL_COLUMNS_CONFIG, MODEL_TABLE_CONFIG, MODEL_TABLE_HEADING, TRIM_COLUMNS_CONFIG, TRIM_TABLE_CONFIG, TRIM_TABLE_HEADING } from "./veh-mmt-settings";
import { UIComponentType } from "~/shared/admin.enums";
import type { ColumnMetadata } from "@codeJ09/design-system";


export class VehicleMakeModelTrimService extends FrameWorkAppService {
  async MakeList() {
    const sqlQuery = this.query(TABLE_NAMES.VEHICLE_MAKE).select("id", "make", "make_ctime", "make_mtime",);

    return await this.BuildClarifyDataTable({
      sqlQuery,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.VEHICLE_MAKES,
      columns: MAKES_COLUMNS_CONFIG,
      configOverrides: MAKES_TABLE_CONFIG,
      component_type: UIComponentType.TABLE,
      table_header: MAKE_TABLE_HEADING,
    });
  }

  async ModelList() {
    const sqlQuery = this.query({ vm: TABLE_NAMES.VEHICLE_MODEL })
      .select("vm.id", "mk.make as make", "vm.model", "vm.model_ctime", "vm.model_mtime")
      .leftJoin({ mk: TABLE_NAMES.VEHICLE_MAKE }, "mk.id", "vm.make_id");

    return await this.BuildClarifyDataTable({
      sqlQuery,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.VEHICLE_MODELS,
      columns: MODEL_COLUMNS_CONFIG,
      configOverrides: MODEL_TABLE_CONFIG,
      component_type: UIComponentType.TABLE,
      table_header: MODEL_TABLE_HEADING,
    });
  }

  // async VehicleTrimList() {
  //   const sqlQuery = this.query({ vt: TABLE_NAMES.VEHICLE_TRIM })
  //     .select(
  //       "vt.id",
  //       "mk.make as make",
  //       "vm.model as model",
  //       "vt.trim",
  //       "vt.trim_ctime",
  //       "vt.trim_mtime",
  //     )
  //     .leftJoin({ mk: TABLE_NAMES.VEHICLE_MAKE }, "mk.id", "vt.make_id")
  //     .leftJoin({ vm: TABLE_NAMES.VEHICLE_MODEL }, "vm.id", "vt.model_id");

  //   return await this.BuildClarifyDataTable({
  //     sqlQuery,
  //     table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.VEHICLE_TRIMS,
  //     columns: TRIM_COLUMNS_CONFIG,
  //     configOverrides: TRIM_TABLE_CONFIG,
  //     component_type: UIComponentType.TABLE,
  //     table_header: TRIM_TABLE_HEADING,
  //   });
  // }

  async VehicleTrimList() {
    const trimOptions = await this.getTrimOptions();

    const columns: ColumnMetadata[] = TRIM_COLUMNS_CONFIG.map(col => {
      if (col.key === "trim" && col.editor?.type === "select") {
        return {
          ...col,
          editor: {
            ...col.editor,
            options: trimOptions,
          },
        };
      }
      return col;
    });

    const sqlQuery = this.query({ vt: TABLE_NAMES.VEHICLE_TRIM })
      .select(
        "vt.id",
        "mk.make as make",
        "vm.model as model",
        "vt.trim",
        "vt.trim_ctime",
        "vt.trim_mtime"
      )
      .leftJoin({ mk: TABLE_NAMES.VEHICLE_MAKE }, "mk.id", "vt.make_id")
      .leftJoin({ vm: TABLE_NAMES.VEHICLE_MODEL }, "vm.id", "vt.model_id");

    return this.BuildClarifyDataTable({
      sqlQuery,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.VEHICLE_TRIMS,
      columns,
      configOverrides: TRIM_TABLE_CONFIG,
      component_type: UIComponentType.TABLE,
      table_header: TRIM_TABLE_HEADING,
    });
  }

  private async getTrimOptions() {
    const rows = await this.executeQuery<{ trim: string }>(
      this.query(TABLE_NAMES.VEHICLE_TRIM).distinct("trim")
    );
    return rows.map(r => ({
      label: r.trim,
      value: r.trim,
    }));
  }
}

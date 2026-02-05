import { ShellEngine } from "./shell-engine";
import { DEFAULT_TABLE_CONFIG } from "./default-table-config";
import type { RenderResult, TableHeaderAction } from "../frame-work-types";
import { UIComponentType } from "~/shared-constants/admin.enums";
import type { Knex } from "knex";
import { ColumnMetadata } from "@codeJ09/data-table";

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

type ClarifyDataTableParams = {
  query: Knex.QueryBuilder | Knex.Raw;
  component_type: UIComponentType;
  table_unique_id: string;
  columns: ColumnMetadata[];
  configOverrides?: DeepPartial<typeof DEFAULT_TABLE_CONFIG>;
  table_header?: string;
  header_actions?: TableHeaderAction[];
};
export abstract class FrameWorkAppService extends ShellEngine {

  protected async BuildClarifyDataTable(params: ClarifyDataTableParams): Promise<RenderResult> {

    const { query, component_type = UIComponentType.TABLE, table_unique_id, columns = [], configOverrides = {}, table_header = "", header_actions = [], } = params;
    const data = (await this.executeQuery(query)) ?? [];

    return {
      component_type,
      payload: {
        table_header,
        table_unique_id,
        data,
        columns,
        header_actions,
        config: this.mergeTableConfig(configOverrides),
      },
    };
  }

  private mergeTableConfig(overrides: DeepPartial<typeof DEFAULT_TABLE_CONFIG> = {}) {
    return {
      ...DEFAULT_TABLE_CONFIG,
      ...overrides,
      features: {
        ...DEFAULT_TABLE_CONFIG.features,
        ...overrides.features,
      },
      layout: {
        ...DEFAULT_TABLE_CONFIG.layout,
        ...overrides.layout,
      },
    };
  }
}

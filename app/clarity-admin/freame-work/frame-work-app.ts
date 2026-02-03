import { ShellEngine } from "./shell-engine";
import { DEFAULT_TABLE_CONFIG } from "./default-table-config";
import type { RenderResult, TableHeaderAction } from "../frame-work-types";
import { UIComponentType } from "~/shared-constants/admin.enums";

export abstract class FrameWorkAppService extends ShellEngine {

  protected async buildDataTable({
    query,
    type,
    table_unique_id,
    columns,
    configOverrides = {},
    table_header,
    header_actions = [],
  }: {
    query: any;
    type: UIComponentType;
    table_unique_id: string;
    columns: any[];
    configOverrides?: Record<string, any>;
    table_header?: string;
    header_actions?: TableHeaderAction[];
  }): Promise<RenderResult> {

    const data = await this.executeQuery(query);

    return {
      type,
      payload: {
        table_header,
        data,
        columns,
        table_unique_id,
        config: this.mergeTableConfig(configOverrides),
        header_actions,
      },
    };
  }

  private mergeTableConfig(overrides: Record<string, any>) {
    return {
      ...DEFAULT_TABLE_CONFIG,
      ...overrides,
      features: {
        ...DEFAULT_TABLE_CONFIG.features,
        ...overrides?.features,
      },
      layout: {
        ...DEFAULT_TABLE_CONFIG.layout,
        ...overrides?.layout,
      },
    };
  }
}

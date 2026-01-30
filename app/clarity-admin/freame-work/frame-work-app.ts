import { ShellEngine } from "./frame-work-engine";
import { DEFAULT_TABLE_CONFIG } from "./default-table-config";
import type { RenderResult } from "./types";
import { UIComponentType } from "~/shared-constants/admin.enums";

export abstract class FrameWorkAppService extends ShellEngine {
  protected async buildTable({
    query,
    columns,
    configOverrides = {},
    table_header,
  }: {
    query: any;
    columns: any[];
    configOverrides?: Record<string, any>;
    table_header?: string;
  }): Promise<RenderResult> {
    const data = await this.executeQuery(query);

    return {
      type: UIComponentType.TABLE,
      payload: {
        table_header,
        data,
        columns,
        config: this.mergeTableConfig(configOverrides),
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

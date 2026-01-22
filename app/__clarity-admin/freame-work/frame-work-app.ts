import { FrameWorkEngine } from "./frame-work-engine";
import { DEFAULT_TABLE_CONFIG } from "./default-table-config";
import type { RenderResult } from "./types";
import { UIComponentType } from "~/__shared-constants/ui.enums";

export abstract class FrameWorkAppService extends FrameWorkEngine {
  protected async buildTable({ query, columns, configOverrides = {},
  }: {
    query: any;
    columns: any[];
    configOverrides?: Record<string, any>;
  }): Promise<RenderResult> {
    const data = await this.executeQuery(query);

    return {
      type: UIComponentType.TABLE,
      payload: {
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


  //prepare html 
}

import { UIComponentType } from "~/shared/admin.enums";
import type { DeepPartial, RenderResult, } from "~/shared/listining-types";
import { ShellEngine } from "./shell-engine-service";
import { DEFAULT_TABLE_CONFIG, type ClarifyDataTableParams } from "./default-table-config";
import { ObjectdeepMerge } from "~/shared/util-helper";

export abstract class FrameWorkAppService extends ShellEngine {
    protected async BuildClarifyDataTable(params: ClarifyDataTableParams): Promise<RenderResult> {
        const { component_type, sqlQuery, table_unique_id, columns, configOverrides = {}, table_header, row_actions = [], } = params;

        const data = (await this.executeQuery(sqlQuery)) ?? [];
        return {
            component_type,
            payload: {
                table_unique_id,
                table_header,
                data,
                columns,
                row_actions,
                config: this.mergeTableConfig(configOverrides),
            },
        };
    }

    private mergeTableConfig(overrides: DeepPartial<typeof DEFAULT_TABLE_CONFIG> = {}): typeof DEFAULT_TABLE_CONFIG {
        return ObjectdeepMerge(DEFAULT_TABLE_CONFIG, overrides);
    }
}

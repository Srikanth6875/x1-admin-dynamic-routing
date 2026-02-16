import { ShellEngine } from "~/server/frame-work/shell-engine-service";
import { TABLE_UPDATE_MAP } from "~/global-actions/mapping-config.map";
import type { EditPayload } from "~/global-actions/inline-table-types";

class InlineEditService extends ShellEngine {
    constructor() {
        super();
    }
    async updateCell({ row, tableId, columnId, oldValue, newValue }: EditPayload) {
        if (oldValue === newValue) return;

        const tableConfig = TABLE_UPDATE_MAP[tableId];
        if (!tableConfig) throw new Error(`No config for table ${tableId}`);

        const columnConfig = tableConfig.editableColumns[columnId];
        if (!columnConfig) throw new Error(`Column ${columnId} not editable`);

        const { tableName, column, primaryKey } = columnConfig;
        const recordId = row.original[primaryKey];
        if (!recordId) throw new Error(`Missing PK ${primaryKey}`);

        await this.query(tableName).where(primaryKey, recordId).update({ [column]: newValue });
    }
}

export const inlineEditService = new InlineEditService();

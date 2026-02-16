type EditableColumnConfig = {
    tableName: string;
    column: string;
    primaryKey: string;
};

export type TableUpdateConfig = {
    editableColumns: Record<string, EditableColumnConfig>;
};

export type EditPayload = {
    row: { original: Record<string, any>; index: number };
    tableId: string;
    columnId: string;
    oldValue: unknown;
    newValue: unknown;
};
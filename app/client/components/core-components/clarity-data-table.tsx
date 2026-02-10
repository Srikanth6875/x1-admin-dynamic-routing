import type { JSX } from "react";
import { DataTable, type TableDataResponse } from "@codeJ09/design-system/data-table";
import { ClarityTableHeader } from "~/client/components/helper-components/ClarityTableHeader";
import { TableColumnActions } from "~/client/components/helper-components/ClarityTableColumnActions";
import type { ClarityDataTableProps } from "~/shared/listining-types";
import { editOnUpdateAdapter, handleCellUpdate } from "~/global-actions/Inline-table-actions";

export const ClarityDataTable = <TData extends Record<string, any>,>({ payload }: ClarityDataTableProps<TData>): JSX.Element => {
  const { data, table_unique_id, columns, config, row_actions, table_header } = payload;
  // const validations = columns?.map(col => col.editor?.validation)
  const tableData: TableDataResponse<any> = {
    data: data,
    columns: columns,
  };

  const resolvedEditing = resolveEditingConfig(config?.features?.editing);
  return (
    <section className="space-y-2">
      <ClarityTableHeader tableHeader={table_header} />

      <DataTable
        tableId={table_unique_id}
        data={tableData}
        config={{
          ...config,
          features: { ...config?.features, editing: resolvedEditing },
        }}
        customRenderers={
          row_actions?.length
            ? { Actions: (_value, row) => (<TableColumnActions actions={row_actions} row={row} />), }
            : undefined
        }
      />
    </section>
  );
};

const resolveEditingConfig = (isEditing: unknown) => {
  return typeof isEditing === "object" && isEditing !== null && (isEditing as any).enabled
    ? {
      ...(isEditing as any),
      onUpdate: editOnUpdateAdapter(handleCellUpdate),
      onError: (error: Error) => {
        console.error("Save failed:", error);
        alert(`Failed to save: ${error.message}`);
      },
      onCancel: (data: { row: unknown; columnId: string; value: unknown }) => {
        console.log("Edit cancelled:", data);
      },
    }
    : isEditing;
};

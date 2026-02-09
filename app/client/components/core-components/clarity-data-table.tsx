import type { JSX } from "react";
import { DataTable } from "@codeJ09/design-system/data-table";
import { ClarityTableHeader } from "~/client/components/helper-components/ClarityTableHeader";
import { TableColumnActions } from "~/client/components/helper-components/ClarityTableColumnActions";
import type { ClarityDataTableProps } from "~/shared/listining-types";
import { editOnUpdateAdapter, handleCellUpdate } from "~/global-actions/Inline-table-actions";

export const ClarityDataTable = <TData,>({ payload }: ClarityDataTableProps<TData>): JSX.Element => {
  const { data, table_unique_id, columns, config, row_actions, table_header } = payload;
  const isEditing = config?.features?.editing;

  const resolvedEditing =
    typeof isEditing === "object" && isEditing.enabled
      ? {
        ...isEditing,
        onUpdate: editOnUpdateAdapter(handleCellUpdate),
        onError: (error: Error) => {
          console.error('Save failed:', error);
          alert(`Failed to save: ${error.message}`);
        },
        onCancel: (data: { row: unknown; columnId: string; value: unknown }) => {
          console.log('Edit cancelled:', data);
        },
      }
      : isEditing;

  return (
    <section className="space-y-2">
      <ClarityTableHeader tableHeader={table_header} />

      <DataTable
        tableId={table_unique_id}
        data={{ data, columns }}
        config={{
          ...config,
          features: { ...config?.features, editing: resolvedEditing },
        }}
        customRenderers={
          row_actions?.length ? { Actions: () => (<TableColumnActions actions={row_actions} />) } : undefined
        }
      />
    </section>
  );
};

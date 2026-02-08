import type { JSX } from "react";
import { DataTable } from "@codeJ09/design-system/data-table";
import { ClarityTableHeader } from "~/client/components/helper-components/ClarityTableHeader";
import { TableColumnActions } from "~/client/components/helper-components/ClarityTableColumnActions";
import type { ClarityDataTableProps } from "~/shared/listining-types";

export const ClarityDataTable = <TData,>({ payload }: ClarityDataTableProps<TData>): JSX.Element => {
  const { data, table_unique_id, columns, config, row_actions, table_header } = payload;

  return (
    <section className="space-y-2">
      <ClarityTableHeader tableHeader={table_header} />

      <DataTable
        tableId={table_unique_id}
        data={{ data, columns }}
        config={{ ...config }}
        customRenderers={
          row_actions?.length ? { Actions: () => (<TableColumnActions actions={row_actions} />) } : undefined
        }
      />

    </section>
  );
};

import React from "react";
import { DataTable } from "@codeJ09/data-table";
import { UIComponentType } from "~/shared-constants/admin.enums";
import type { FrameWorkRendererProps, TablePayload } from "./freame-work/types";

// Map UI component types to React components
const UiComponentMap: Record<UIComponentType, React.FC<{ payload: TablePayload & { table_header?: string } }>> = {
  [UIComponentType.TABLE]: ({ payload }) => (
    <section className="space-y-2">
      {payload.table_header && (
        <div className="rounded-md bg-gray-50 border border-gray-200 px-2 py-1">
          <h1 className="text-lg font-semibold text-gray-900">
            {payload?.table_header}
          </h1>
        </div>
      )}

      <DataTable
        data={{
          data: payload.data,
          columns: payload.columns,
        }}
        config={payload.config}
      />
    </section>
  ),
};

export function FrameworkRenderer({ render }: FrameWorkRendererProps) {
  const Component = UiComponentMap[render.type];
  return Component ? <Component payload={render.payload} /> : null;
}

import React from "react";
import { DataTable } from "@codeJ09/data-table";
import { UIComponentType } from "~/__shared-constants/ui.enums";
import type { RenderResult, TablePayload } from "./freame-work/types";

type RendererProps = {
  render: RenderResult;
};

// Map UI component types to React components
const UiComponentMap: Record<UIComponentType, React.FC<{ payload: TablePayload }>> = {
  [UIComponentType.TABLE]: ({ payload }) => (
    <div className="dynamic-data-table">
      <DataTable
        data={{
          data: payload.data,
          columns: payload.columns,
        }}
        config={payload.config}
      />
    </div>
  ),
};

export function FrameworkRenderer({ render }: RendererProps) {
  const Component = UiComponentMap[render.type];
  return Component ? <Component payload={render.payload} /> : null;
}

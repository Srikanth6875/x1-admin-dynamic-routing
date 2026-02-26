import type {
  ColumnMetadata,
  DataTableConfig,
} from "@codeJ09/design-system/data-table";
import type { UIComponentType } from "~/shared/admin.enums";
import type {
  DeleteRenderDescriptor,
  FormRenderDescriptor,
} from "~/types/form-builder.types";
import type { DetailsRenderDescriptor } from "./admin-details.types";

export type DeepPartial<T> =
  T extends Array<infer U>
    ? Array<U>
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T;

/* ------------------------- Action Button -------------------------- */

export type TableActionBtn = {
  btn_label: string;
  btn_variant?: "primary" | "secondary" | "danger" | "view" | "outline";
  route_prefix?: string;
  appType: string;
  runType: string;
  params?: Record<string, string>;
};

/* -------------------------- Table Header -------------------------- */
export type TableHeader = {
  title: string;
  actions?: TableActionBtn[];
};
/* -------------------------- Table Payload ------------------------- */
export interface TablePayload<TData = unknown> {
  table_unique_id: string;
  data: TData[];
  columns: ColumnMetadata[];
  config?: DataTableConfig<TData>;
  row_actions?: TableActionBtn[];
  table_header?: TableHeader;
}
/* ---------------------- Render Descriptor ------------------------- */
export type TableRenderDescriptor<TData = unknown> = {
  component_type: UIComponentType.TABLE;
  payload: TablePayload<TData>;
};

export type ClarityDataTableProps<TData = unknown> = {
  payload: TablePayload<Record<string, any>>;
};

export type ClarityTableHeaderProps = {
  tableHeader?: {
    title: string;
    actions?: TableActionBtn[];
  };
};

/* ------------------------ Framework Types ------------------------- */

// export type RenderResult<TData = unknown> = TableRenderDescriptor<TData>;

// export type FrameworkRendererProps<TData extends Record<string, any> = Record<string, any>> = {
//   render: RenderResult<TData>;
// };

export type RenderResult =
  | TableRenderDescriptor
  | FormRenderDescriptor
  | DeleteRenderDescriptor
  | DetailsRenderDescriptor;

export type FrameworkRendererProps = {
  render: RenderResult;
};

/* ---------------------- Backend Execution ------------------------ */
export type ExecuteWithPermission = {
  userId: number;
  app_type: string;
  run_type?: string;
};

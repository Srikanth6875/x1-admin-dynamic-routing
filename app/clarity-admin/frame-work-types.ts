import { ColumnMetadata } from "@codeJ09/data-table";
import { UIComponentType } from "~/shared-constants/admin.enums";

export type TableHeaderAction = {
  btn_label: string;
  btn_variant?: "primary" | "secondary" | "danger";
  appType: string;
  runType: string;
  params?: Record<string, string>;
};

export interface TablePayload {
  data: unknown[];
  columns: ColumnMetadata[];
  config: Record<string, unknown>;
  table_unique_id: string;
  table_header?: string;
  header_actions?: TableHeaderAction[];
}

export type TableRender = {
  component_type: UIComponentType.TABLE;
  payload: TablePayload;
};
export type RenderResult = TableRender;

export type FrameWorkRendererProps = { render: RenderResult };




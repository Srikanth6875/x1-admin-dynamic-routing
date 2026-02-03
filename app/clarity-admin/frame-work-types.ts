import { UIComponentType } from "~/shared-constants/admin.enums";

export type TableHeaderAction = {
  btn_label: string;
  btn_variant?: "primary" | "secondary" | "danger";
  appType: string;
  runType: string;
  params?: Record<string, string>;
};

export interface TablePayload {
  data: any[];
  columns: any[];
  config: Record<string, any>;
  table_unique_id: string;
  table_header?: string;
  header_actions?: TableHeaderAction[];
}

export type TableRender = {
  type: UIComponentType.TABLE;
  payload: TablePayload;
};

export type RenderResult = TableRender;
export type FrameWorkRendererProps = { render: RenderResult };




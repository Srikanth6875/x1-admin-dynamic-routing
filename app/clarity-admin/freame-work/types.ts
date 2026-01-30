import { UIComponentType } from "~/shared-constants/admin.enums";
export interface TablePayload {
  data: any[];
  columns: any[];
  config: any;
  table_header?: string;
}

export type RenderResult = { type: UIComponentType.TABLE; payload: TablePayload };
export type FrameWorkRendererProps = { render: RenderResult };

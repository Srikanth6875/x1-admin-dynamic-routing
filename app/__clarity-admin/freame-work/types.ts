import { UIComponentType } from "~/__shared-constants/ui.enums";

export interface TablePayload {
  data: any[];
  columns: any[];
  config: any;
}

export type RenderResult =
  | {
      type: UIComponentType.TABLE;
      payload: TablePayload;
    };

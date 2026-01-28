import type { UIComponentType } from "./admin.enums";

export type PermissionExecuteArgs = {
  userId: number;
  app_type: string;
  run_type?: string;
  payload?: any[];
};

export type TableRenderDescriptor = {
  type: UIComponentType.TABLE;
  payload: {
    table_header?: string;
    data: any[];
    columns: any[];
    config: any;
  };
};

export type ListingLoaderData = {
  render_response: TableRenderDescriptor;
  appType: string;
  runType: string;
};

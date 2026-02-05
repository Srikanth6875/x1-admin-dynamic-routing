import type { UIComponentType } from "./admin.enums";

export type PermissionExecuteArgs = {
  userId: number;
  app_type: string;
  run_type?: string;
};

export type TableRenderDescriptor = {
  type: UIComponentType.TABLE;
  payload: {
    table_header?: string;
    table_unique_id: string;
    data: any[];
    columns: any[];
    config: any;
  };
};

export type ListingLoaderData = {
  render_response: TableRenderDescriptor;
};

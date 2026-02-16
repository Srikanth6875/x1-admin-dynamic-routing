import type { UIComponentType } from "~/shared/admin.enums";
import type { FormField } from "~/types/form.types";
import type { FormFields, FormValues } from "./form.types";
import type { ColumnMetadata, DataTableConfig } from "@codeJ09/design-system/data-table";

/* ------------------------- Table Types ------------------------- */
export type FormMode = "ADD" | "EDIT" | "DELETE";

export type TableActionBtn = {
  btn_label: string;
  btn_variant?: "primary" | "secondary" | "danger";
  route_prefix?: string;
  appType: string;
  runType: string;
  params?: Record<string, string>;
};

export type TableHeader = {
  title: string;
  actions?: TableActionBtn[];
};

export interface TablePayload<TData = unknown> {
  table_unique_id: string;
  data: TData[];
  columns: ColumnMetadata[];
  config?: DataTableConfig<TData>;
  row_actions?: TableActionBtn[];
  table_header?: TableHeader;
}

export type TableRenderDescriptor<TData = unknown> = {
  component_type: UIComponentType.TABLE;
  payload: TablePayload<TData>;
};

/* ------------------------- Form Types ------------------------- */

export interface FormPayload {
  title: string;
  fields: Record<string, FormField>;
  initialValues: Record<string, unknown>;
  mode: "ADD" | "EDIT" | "DELETE";
  onSubmit?: (values: FormValues) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  success?: boolean;
  errorMessage?: string;
  successKey?: number;
}
export interface UrlColumns {
  APP_TYPE: string;
  ID_COL: string;
  ACTION: string;
  CANCEL_ACTION: string;
  TABLE: string;
  HEADER: string;
}
export interface BuildFormInput {
  fields: FormFields;
  url_cols: UrlColumns;
  del?: boolean;
}
export interface DeletePayload {
  title: string;
  fields: Record<string, FormField>;
  values: Record<string, unknown>;
  onConfirm: () => void;
  onCancel: () => void;
  success: boolean;
  successKey?: number;
  errorMessage?: string;
}
export interface DeleteRenderDescriptor {
  component_type: UIComponentType.DELETE;
  payload: DeletePayload;
}


export interface SaveFormResult {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
}

export type RenderFormResult =
  FormRenderDescriptor
  | DeleteRenderDescriptor;


export type FormRendererProps = {
  render: RenderFormResult;
};

export interface ServerFormPayload {
  title: string;
  fields: Record<string, FormField>;
  initialValues: Record<string, unknown>;
  app_type: string;
  save_action: string;
  cancel_action: string;
  idColumn: string;
  mode: "ADD" | "EDIT" | "DELETE";
}

export interface BuildFormResult {
  component_type: UIComponentType.FORMS;
  payload: ServerFormPayload;
}
// Frontend renders this
export type FormRenderDescriptor = {
  component_type: UIComponentType.FORMS;
  payload: FormPayload;
};
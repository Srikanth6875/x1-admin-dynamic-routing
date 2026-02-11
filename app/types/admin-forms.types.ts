import type { FormMode, ServerFormPayload } from "./form-builder.types";
import type { FormField, FormFieldValue } from "./form.types";

export interface FormFields {
  [key: string]: FormFieldValue;
}

export interface DynamicFormConfig {
  title: string;
  fields: Record<string, FormField>;
  initialValues: FormFields;
  app_type: string;
  save_action: string;
  cancel_action: string;
  mode: FormMode;
}
 export interface ExecuteResponse {
  success: boolean;
  message?: string;
  [key: string]: unknown;
}

export interface LoaderData {
  form: ServerFormPayload;
  userId: string;
}

export interface ActionData {
  success: boolean;
  message?: string;
  timestamp?: number;
}
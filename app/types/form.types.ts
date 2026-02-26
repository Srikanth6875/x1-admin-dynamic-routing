import type { FormMode } from "./form-builder.types";

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "textarea"
  | "select"
  | "multiselect"
  | "checkbox"
  | "radio"
  | "date"
  | "time"
  | "file"
  | "switch"
  | "hidden"
  | "phone"
  | "url"
  | "guid"
  | "multiselectdropdown"
  | "picklist"
  | "groupedruntype";

export interface SelectOption {
  label: string;
  value: string | number;
}

export type FormFieldValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | File
  | FileList
  | (string | number | boolean | File)[];

export type Option = {
  label: string;
  value: string | number;
};
export interface FormField {
  db?: string;
  type: FieldType;
  label?: string;
  required?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  hidden?: boolean;
  min?: number;
  max?: number;
  maxLength?: number;
  minLength?: number;
  options?: SelectOption[];
  multiple?: boolean;
  default?: unknown;
  disabled?: boolean;
  allLabel?: string;
  selectedLabel?: string;
  reloadOnChange?: boolean;
  groupedBy?: string;
  appTypeOptions?: Option[];
}

export interface UIFormField extends FormField {
  name: string;
  label: string;
  allLabel?: string;
  selectedLabel?: string;
  appTypeOptions?: { label: string; value: string | number }[];
}

export type FormFields = Record<string, FormField>;

export interface FormValues {
  [key: string]: FormFieldValue;
}

export interface DynamicFormConfig {
  title: string;
  fields: Record<string, FormField>;
  initialValues: FormValues;
  app_type: string;
  save_action: string;
  cancel_action: string;
  mode: FormMode;
}

export interface LoaderData {
  form: DynamicFormConfig;
  userId: string;
}

export interface ActionData {
  success: boolean;
  message?: string;
  timestamp: number;
}

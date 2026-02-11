import { forwardRef } from "react";
import { TextInput } from "../form_fileds/TextInput";
import { TextArea } from "../form_fileds/TextArea";
import { Select } from "../form_fileds/Select";
import { MultiSelect } from "../form_fileds/MultiSelect";
import { Checkbox } from "../form_fileds/Checkbox";
import { RadioGroup } from "../form_fileds/RadioGroup";
import { DatePicker } from "../form_fileds/DatePicker";
import { TimePicker } from "../form_fileds/TimePicker";
import { FileUpload } from "../form_fileds/FileUpload";
import { Switch } from "../form_fileds/Switch";
import type {
  FieldType,
  FormFieldValue,
  UIFormField,
} from "~/types/form.types";

interface Props {
  field: UIFormField;
  value: FormFieldValue;
  onChange: (name: string, value: FormFieldValue) => void;
  onBlur: (name: string) => void;
  error?: string;
}

interface FieldOption {
  label: string;
  value: string | number;
}

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  options?: FieldOption[];
  multiple?: boolean;
  min?: number;
  max?: number;
  hidden?: boolean;
}

export const FieldFactory = forwardRef<HTMLElement, Props>(
  ({ field, value, onChange, onBlur, error }, ref) => {
    const commonProps = {
      name: field.name,
      label: field.label,
      required: field.required,
      placeholder: field.placeholder,
      readOnly: field.readOnly,
      error,
    };

    const handleChange = (e: any) => {
      if (field.type === "checkbox") {
        onChange(field.name, e.target.checked);
      } else if (field.type === "multiselect") {
        onChange(field.name, e);
      } else if (field.type === "file") {
        onChange(field.name, e.target.files);
      } else {
        onChange(field.name, e.target.value);
      }
    };

    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "phone":
      case "password":
      case "number":
      case "url":
        return (
          <TextInput
            {...commonProps}
            ref={ref as any}
            type={field.type}
            value={(value as string | number) ?? ""}
            onChange={handleChange}
            onBlur={() => onBlur(field.name)}
          />
        );

      case "textarea":
        return (
          <TextArea
            {...commonProps}
            ref={ref as any}
            value={(value as string) ?? ""}
            onChange={handleChange}
            onBlur={() => onBlur(field.name)}
          />
        );

      case "select":
        return (
          <Select
            {...commonProps}
            ref={ref as any}
            value={(value as string | number) ?? ""}
            onChange={handleChange}
            onBlur={() => onBlur(field.name)}
            options={field.options || []}
          />
        );

      case "multiselect":
        return (
          <MultiSelect
            {...commonProps}
            ref={ref as any}
            values={(value as (string | number)[]) ?? []}
            onChange={(vals) => onChange(field.name, vals)}
            onBlur={() => onBlur(field.name)}
            options={field.options || []}
          />
        );

      case "checkbox":
        return (
          <Checkbox
            {...commonProps}
            ref={ref as any}
            checked={!!value}
            onChange={handleChange}
            onBlur={() => onBlur(field.name)}
          />
        );

      case "radio":
        return (
          <RadioGroup
            {...commonProps}
            ref={ref as any}
            value={(value as string | number) ?? ""}
            onChange={handleChange}
            onBlur={() => onBlur(field.name)}
            options={field.options || []}
          />
        );

      case "date":
        return (
          <DatePicker
            {...commonProps}
            ref={ref as any}
            value={(value as string) ?? ""}
            onChange={handleChange}
            onBlur={() => onBlur(field.name)}
          />
        );

      case "time":
        return (
          <TimePicker
            {...commonProps}
            ref={ref as any}
            value={(value as string) ?? ""}
            onChange={handleChange}
            onBlur={() => onBlur(field.name)}
          />
        );

      case "file":
        return (
          <FileUpload
            {...commonProps}
            ref={ref as any}
            onChange={handleChange}
            onBlur={() => onBlur(field.name)}
            multiple={field.multiple}
          />
        );

      case "switch":
        return (
          <Switch
            {...commonProps}
            ref={ref as any}
            checked={!!value}
            onChange={(checked) => onChange(field.name, checked)}
            onBlur={() => onBlur(field.name)}
          />
        );

      default:
        return <div>Unsupported field type: {field.type}</div>;
    }
  },
);

FieldFactory.displayName = "FieldFactory";

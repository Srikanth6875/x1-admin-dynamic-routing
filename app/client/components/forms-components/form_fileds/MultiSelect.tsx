import React, { forwardRef } from "react";
import {
  CheckboxGroup,
  Checkbox,
  Label,
  FieldError,
} from "react-aria-components";

type Option = { label: string; value: string | number };

type MultiSelectProps = {
  name: string;
  label?: string;
  values: Array<string | number>;
  onChange: (selectedValues: Array<string | number>) => void;
  onBlur?: (name: string) => void;
  options: Option[];
  required?: boolean;
  error?: string;
  disabled?: boolean;
};

export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      name,
      label,
      values,
      onChange,
      onBlur,
      options,
      required = false,
      error,
      disabled = false,
    },
    ref,
  ) => {
    return (
      <CheckboxGroup
        ref={ref}
        value={values.map(String)}
        onChange={(vals) => onChange(vals)}
        onBlur={() => onBlur?.(name)}
        isRequired={required}
        isDisabled={disabled}
        isInvalid={!!error}
        className="mb-4 flex flex-col"
      >
        {label && (
          <Label className="mb-2 font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
        )}

        <div
          className={`flex flex-wrap gap-2 p-2 border rounded-md transition-colors
            ${
              error
                ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                : "border-gray-300"
            }`}
        >
          {options.map((opt) => (
            <Checkbox
              key={opt.value}
              value={String(opt.value)}
              className={({ isSelected }) =>
                `px-3 py-1 border rounded cursor-pointer select-none transition-colors
                ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white border-gray-300"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-blue-400"}`
              }
            >
              {opt.label}
            </Checkbox>
          ))}
        </div>

        {error && (
          <FieldError className="mt-1 text-sm text-red-600">{error}</FieldError>
        )}
      </CheckboxGroup>
    );
  },
);

MultiSelect.displayName = "MultiSelect";

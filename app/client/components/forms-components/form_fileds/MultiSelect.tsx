import React, { forwardRef } from "react";

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
    ref
  ) => {
    const toggleValue = (val: string | number) => {
      if (values.includes(val)) {
        onChange(values.filter((v) => v !== val));
      } else {
        onChange([...values, val]);
      }
    };

    return (
      <div className="mb-4" ref={ref}>
        <label className="block mb-1 font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        <div 
          className={`flex flex-wrap gap-2 p-2 border rounded-md transition-colors ${
            error ? "border-red-500 bg-red-50 ring-2 ring-red-200" : "border-gray-300"
          }`}
          onBlur={() => onBlur?.(name)}
        >
          {options.map((opt) => {
            const checked = values.includes(opt.value);
            return (
              <label
                key={opt.value}
                className={`inline-flex items-center px-3 py-1 border rounded cursor-pointer select-none transition-colors
                ${checked ? "bg-blue-600 text-white border-blue-600" : "bg-white border-gray-300"}
                ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-blue-400"}
              `}
              >
                <input
                  type="checkbox"
                  name={name}
                  value={opt.value}
                  checked={checked}
                  onChange={() => !disabled && toggleValue(opt.value)}
                  disabled={disabled}
                  className="hidden"
                />
                <span>{opt.label}</span>
              </label>
            );
          })}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

MultiSelect.displayName = "MultiSelect";
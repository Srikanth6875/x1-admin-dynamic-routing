import React, { forwardRef } from "react";

type Option = { label: string; value: string | number };

type SelectProps = {
  name: string;
  label?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (name: string) => void;
  options: Option[];
  required?: boolean;
  error?: string;
  disabled?: boolean;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      name,
      label,
      value,
      onChange,
      onBlur,
      options,
      required = false,
      error,
      disabled = false,
    },
    ref
  ) => {
    return (
      <div className="mb-1">
        <label htmlFor={name} className="block mb-1 font-small text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
          ref={ref}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={() => onBlur?.(name)}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          className={`w-64 px-1 py-1 border rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
          ${error ? "border-red-500 bg-red-50 ring-2 ring-red-200" : "border-gray-300"}
          ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
        >
          <option value="">Select an {label}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
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

Select.displayName = "Select";
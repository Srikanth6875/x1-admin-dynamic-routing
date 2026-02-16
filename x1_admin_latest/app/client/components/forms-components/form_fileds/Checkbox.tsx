import React, { forwardRef } from "react";
import type { ChangeEvent } from "react";

export type CheckboxProps = {
  name: string;
  label?: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (name: string) => void;
  required?: boolean;
  error?: string;
  disabled?: boolean;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      name,
      label,
      checked,
      onChange,
      onBlur,
      required = false,
      error,
      disabled = false,
    },
    ref
  ) => {
    return (
      <div className="mb-4">
        <label
          htmlFor={name}
          className={`inline-flex items-center select-none ${
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
        >
          <input
            ref={ref}
            id={name}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            onBlur={() => onBlur?.(name)}
            required={required}
            disabled={disabled}
            aria-invalid={!!error}
            className={`
            h-5 w-5 rounded-bl-lg border-2
            transition-colors duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400
            ${error ? "border-red-500 ring-2 ring-red-200" : ""}
            ${checked
                ? "bg-teal-600 border-teal-600 shadow-lg"
                : "bg-white border-gray-300 hover:border-teal-500"}
          `}
            style={{ boxShadow: checked ? "0 0 6px rgba(22, 163, 74, 0.6)" : undefined }}
          />
          <span className="ml-2 text-gray-900">
            {label} {required && <span className="text-red-500">*</span>}
          </span>
        </label>
        {error && (
          <p className="mt-1 text-sm text-red-600 ml-7 flex items-center gap-1">
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

Checkbox.displayName = "Checkbox";
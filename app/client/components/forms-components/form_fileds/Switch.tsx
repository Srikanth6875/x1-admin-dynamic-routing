import React, { forwardRef } from "react";

type SwitchProps = {
  name: string;
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  onBlur?: (name: string) => void;
  disabled?: boolean;
  error?: string;
};

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    { name, label, checked, onChange, onBlur, disabled = false, error },
    ref
  ) => {
    return (
      <div className="mb-4">
        <div className="flex items-center">
          <label htmlFor={name} className="mr-3 font-medium text-gray-700 cursor-pointer">
            {label}
          </label>
          <button
            ref={ref}
            type="button"
            role="switch"
            aria-checked={checked}
            aria-labelledby={name}
            onClick={() => !disabled && onChange(!checked)}
            onBlur={() => onBlur?.(name)}
            disabled={disabled}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            ${error ? "ring-2 ring-red-500" : ""}
            ${checked ? "bg-blue-600" : "bg-gray-300"}
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform
              ${checked ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
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

Switch.displayName = "Switch";
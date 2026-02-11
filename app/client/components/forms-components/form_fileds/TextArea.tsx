import React, { forwardRef } from "react";

type TextAreaProps = {
  name: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (name: string) => void;
  required?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  error?: string;
  rows?: number;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      name,
      label,
      value,
      onChange,
      onBlur,
      required = false,
      placeholder,
      readOnly = false,
      error,
      rows = 4,
    },
    ref
  ) => {
    return (
      <div className="mb-4">
        <label htmlFor={name} className="block mb-1 font-small text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea
          ref={ref}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={() => onBlur?.(name)}
          required={required}
          placeholder={placeholder}
          readOnly={readOnly}
          rows={rows}
          aria-invalid={!!error}
          className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
          ${error ? "border-red-500 bg-red-50 ring-2 ring-red-200" : "border-gray-300"}
          ${readOnly ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
        />
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

TextArea.displayName = "TextArea";
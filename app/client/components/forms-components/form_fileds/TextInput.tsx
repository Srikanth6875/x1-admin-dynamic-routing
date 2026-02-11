import React, { forwardRef } from "react";

type TextInputProps = {
  name: string;
  label?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (name: string) => void;
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "phone";
  required?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  error?: string;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      name,
      label,
      value,
      onChange,
      onBlur,
      type = "text",
      required = false,
      placeholder,
      readOnly = false,
      error,
    },
    ref,
  ) => {
    return (
      <div className="mb-1">
        <label htmlFor={name} className="block mb-1 font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          ref={ref}
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={() => onBlur?.(name)}
          required={required}
          placeholder={placeholder}
          readOnly={readOnly}
          aria-invalid={!!error}
          className={`w-64 px-1 py-1 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors
          ${error ? "border-red-500 bg-red-50 ring-2 ring-red-200" : "border-gray-400"}
          ${readOnly ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  },
);

TextInput.displayName = "TextInput";

import React, { forwardRef } from "react";

type Option = { label: string; value: string | number };

type RadioGroupProps = {
  name: string;
  label?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (name: string) => void;
  options: Option[];
  required?: boolean;
  error?: string;
};

export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
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
    },
    ref
  ) => {
    return (
      <fieldset className="mb-4" ref={ref}>
        <legend className="block mb-1 font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </legend>
        <div 
          className={`flex flex-col space-y-1 p-2 border rounded-md transition-colors ${
            error ? "border-red-500 bg-red-50 ring-2 ring-red-200" : "border-transparent"
          }`}
          onBlur={() => onBlur?.(name)}
        >
          {options.map((opt) => (
            <label key={opt.value} className="inline-flex items-center">
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={value === opt.value}
                onChange={onChange}
                required={required}
                className="form-radio text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-900">{opt.label}</span>
            </label>
          ))}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </fieldset>
    );
  }
);

RadioGroup.displayName = "RadioGroup";
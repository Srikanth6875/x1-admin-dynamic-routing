import React, { forwardRef } from "react";
import {
  Checkbox as AriaCheckbox,
  FieldError,
  Label,
} from "react-aria-components";

export type CheckboxProps = {
  name: string;
  label?: string;
  value: 1 | 0; // <-- store 1 or 0 directly
  onChange: (value: 1 | 0) => void;
  onBlur?: (name: string) => void;
  required?: boolean;
  error?: string;
  disabled?: boolean;
};

export const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(
  (
    {
      name,
      label,
      value,
      onChange,
      onBlur,
      required = false,
      error,
      disabled = false,
    },
    ref
  ) => {
    const isSelected = value === 1; // DB 1 → checked

    return (
      <AriaCheckbox
        ref={ref}
        name={name}
        isSelected={isSelected}
        onChange={(selected) => onChange(selected ? 1 : 0)} // convert here
        onBlur={() => onBlur?.(name)}
        isRequired={required}
        isDisabled={disabled}
        isInvalid={!!error}
        className="flex flex-col mb-4"
      >
        {({ isSelected, isDisabled }) => (
          <>
            <Label
              className={`inline-flex items-center gap-2 select-none ${
                isDisabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
            >
              <div
                className={`
                  h-5 w-5 border-2 rounded-md flex items-center justify-center
                  transition-all duration-200
                  ${
                    error
                      ? "border-red-500 ring-2 ring-red-200"
                      : isSelected
                      ? "bg-teal-600 border-teal-600"
                      : "bg-white border-gray-300"
                  }
                `}
              >
                {isSelected && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>

              <span className="text-gray-900">
                {label}
                {required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </span>
            </Label>

            {error && (
              <FieldError className="mt-1 text-sm text-red-600 ml-7">
                {error}
              </FieldError>
            )}
          </>
        )}
      </AriaCheckbox>
    );
  }
);

Checkbox.displayName = "Checkbox";

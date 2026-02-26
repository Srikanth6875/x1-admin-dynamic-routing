import React, { forwardRef, useState } from "react";
import { TextField, Label, Input, FieldError } from "react-aria-components";
import { Eye, EyeOff } from "lucide-react";

type TextInputProps = {
  name: string;
  label?: string;
  value?: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (name: string) => void;
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "phone";
  required?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  error?: string;
  autoComplete?: string;
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
      autoComplete,
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";

    const inputType = isPassword
      ? showPassword
        ? "text"
        : "password"
      : type === "phone"
        ? "tel"
        : type;

    const autoCompleteValue =
      autoComplete ??
      (type === "password"
        ? "new-password"
        : type === "email"
          ? "email"
          : type === "tel" || type === "phone"
            ? "tel"
            : "off");

    return (
      <TextField
        name={name}
        value={String(value ?? "")}
        onChange={(val) =>
          onChange({
            target: { name, value: val },
          } as React.ChangeEvent<HTMLInputElement>)
        }
        onBlur={() => onBlur?.(name)}
        isRequired={required}
        isReadOnly={readOnly}
        isInvalid={!!error}
        className="mb-4 flex flex-col"
      >
        {label && (
          <Label className="mb-1 font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
        )}

        <div className="relative w-64">
          <Input
            ref={ref}
            type={inputType}
            placeholder={placeholder}
            autoComplete={autoCompleteValue}
            className={`w-full px-3 py-2 pr-10 border rounded-md text-gray-900
              focus:outline-none focus:ring-2 focus:ring-blue-400 transition
              ${
                error
                  ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                  : "border-gray-300"
              }
              ${readOnly ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 -translate-y-1/2
                text-gray-500 hover:text-gray-700
                focus:outline-none
                focus-visible:outline focus-visible:outline-1 focus-visible:outline-blue-400
                transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {error && (
          <FieldError className="mt-1 text-sm text-red-600">{error}</FieldError>
        )}
      </TextField>
    );
  },
);

TextInput.displayName = "TextInput";

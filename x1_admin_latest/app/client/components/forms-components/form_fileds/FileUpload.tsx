import React, { forwardRef } from "react";

type FileUploadProps = {
  name: string;
  label?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (name: string) => void;
  required?: boolean;
  error?: string;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
};

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      name,
      label,
      onChange,
      onBlur,
      required = false,
      error,
      multiple = false,
      accept,
      disabled = false,
    },
    ref
  ) => {
    return (
      <div className="mb-4">
        <label htmlFor={name} className="block mb-1 font-small text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        <input
          ref={ref}
          id={name}
          name={name}
          type="file"
          onChange={onChange}
          onBlur={() => onBlur?.(name)}
          required={required}
          multiple={multiple}
          accept={accept}
          disabled={disabled}
          aria-invalid={!!error}
          className={`w-full text-sm text-gray-700
          file:mr-4
          file:py-2 file:px-4
          file:rounded-md
          file:border-0
          file:text-sm file:font-semibold
          file:bg-gray-100 file:text-gray-700
          hover:file:bg-gray-200
          transition-colors
          ${error ? "border border-red-500 bg-red-50 rounded-md p-2" : ""}
          ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
        `}
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

FileUpload.displayName = "FileUpload";
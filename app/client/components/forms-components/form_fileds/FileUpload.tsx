import React, { forwardRef, useState } from "react";
import {
  FileTrigger,
  Button,
  Label,
  FieldError,
} from "react-aria-components";

type FileUploadProps = {
  name: string;
  label?: string;
  onChange: (files: FileList | null) => void;
  onBlur?: (name: string) => void;
  required?: boolean;
  error?: string;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
};

export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
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
    const [fileNames, setFileNames] = useState<string>("No file selected");

    return (
      <div className="mb-4 flex flex-col" ref={ref}>
        {label && (
          <Label className="mb-1 font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
        )}

        <div
          className={`flex items-center gap-3 border rounded-md p-2
          ${error ? "border-red-500 bg-red-50" : "border-gray-300"}
          ${disabled ? "opacity-60" : ""}`}
        >
          <FileTrigger
            acceptedFileTypes={accept ? accept.split(",") : undefined}
            allowsMultiple={multiple}
            onSelect={(files) => {
              onChange(files);
              if (files && files.length > 0) {
                const names = Array.from(files)
                  .map((f) => f.name)
                  .join(", ");
                setFileNames(names);
              } else {
                setFileNames("No file selected");
              }
            }}
          >
            <Button
              type="button"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md
                hover:bg-gray-200 transition"
            >
              Choose File
            </Button>
          </FileTrigger>

          <span className="text-sm text-gray-600 truncate">
            {fileNames}
          </span>
        </div>

        {error && (
          <FieldError className="mt-1 text-sm text-red-600">
            {error}
          </FieldError>
        )}
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";
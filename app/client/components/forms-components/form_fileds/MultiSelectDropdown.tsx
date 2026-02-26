import React, { forwardRef, useState, useRef, useEffect } from "react";

type Option = {
  label: string;
  value: string | number;
};

type BaseProps = {
  label?: string;
  values: (string | number)[];
  options: Option[];
  required?: boolean;
  error?: string;
  onChange: (values: (string | number)[]) => void;
};


type FormLibraryProps = {
  name?: string;
  onBlur?: () => void;
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
 
};

type MultiSelectDropdownProps = BaseProps & FormLibraryProps;

export const MultiSelectDropdown = forwardRef<HTMLDivElement, MultiSelectDropdownProps>(
  (
    {
      label,
      values = [],
      options = [],
      required,
      error,
      onChange,
      name,          
      onBlur,        
      placeholder,
      readOnly,
      disabled,
      ...rest        
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false);
          if (onBlur && !open) onBlur();
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [onBlur, open]);

    const toggleValue = (val: string | number) => {
      if (readOnly || disabled) return;

      if (values.includes(val)) {
        onChange(values.filter((v) => v !== val));
      } else {
        onChange([...values, val]);
      }
    };

    const selectedOptions = options.filter((o) => values.includes(o.value));

    const displayPlaceholder = placeholder || `Select ${label?.toLowerCase() || "options"}...`;

    return (
      <div
        ref={containerRef}
        className="relative w-full"
        {...rest} 
      >
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Trigger / Selected values */}
        <div
          className={[
            "relative min-h-[42px] w-full flex flex-wrap items-center gap-1.5",
            "px-3 py-2 pr-10 rounded-lg border bg-white cursor-pointer",
            "transition-all duration-150 select-none",
            open
              ? "border-indigo-500 ring-2 ring-indigo-100"
              : "border-gray-300 hover:border-gray-400",
            error ? "border-red-400 ring-2 ring-red-100" : "",
            disabled && "opacity-60 cursor-not-allowed",
            readOnly && "bg-gray-50 cursor-default",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => {
            if (!readOnly && !disabled) setOpen((p) => !p);
          }}
        >
          {selectedOptions.length === 0 ? (
            <span className="text-gray-400 text-sm">{displayPlaceholder}</span>
          ) : (
            selectedOptions.map((opt) => (
              <span
                key={String(opt.value)}
                className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-md border border-indigo-200"
              >
                {opt.label}
                {!readOnly && !disabled && (
                  <button
                    type="button"
                    className="text-indigo-400 hover:text-indigo-700 transition-colors ml-0.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleValue(opt.value);
                    }}
                    tabIndex={-1}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                      <path d="M6.414 5l2.293-2.293a1 1 0 00-1.414-1.414L5 3.586 2.707 1.293A1 1 0 001.293 2.707L3.586 5 1.293 7.293a1 1 0 001.414 1.414L5 6.414l2.293 2.293a1 1 0 001.414-1.414L6.414 5z" />
                    </svg>
                  </button>
                )}
              </span>
            ))
          )}

          {/* Chevron */}
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-200 ${open ? "rotate-180 text-indigo-500" : ""}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>

        {/* Dropdown content */}
        {open && !readOnly && !disabled && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
            {values.length > 0 && (
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50">
                <span className="text-xs font-semibold text-indigo-600">
                  {values.length} selected
                </span>
                <button
                  type="button"
                  className="text-xs font-medium text-gray-500 hover:text-red-600 transition-colors"
                  onClick={() => onChange([])}
                >
                  Clear all
                </button>
              </div>
            )}

            <div className="max-h-60 overflow-y-auto py-1">
              {options.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">No options available</div>
              ) : (
                options.map((option) => {
                  const isSelected = values.includes(option.value);
                  return (
                    <div
                      key={String(option.value)}
                      className={[
                        "flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors",
                        isSelected ? "bg-indigo-50" : "hover:bg-gray-50",
                      ].join(" ")}
                      onClick={() => toggleValue(option.value)}
                    >
                      <div
                        className={[
                          "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all",
                          isSelected
                            ? "bg-indigo-600 border-indigo-600"
                            : "bg-white border-gray-300",
                        ].join(" ")}
                      >
                        {isSelected && (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <span
                        className={`text-sm ${
                          isSelected ? "text-indigo-800 font-medium" : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-.5 5a.5.5 0 011 0v6a.5.5 0 01-1 0V7zm.5 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

MultiSelectDropdown.displayName = "MultiSelectDropdown";
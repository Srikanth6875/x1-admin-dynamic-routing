import React, { forwardRef, useState, useCallback, useMemo } from "react";

type Option = { label: string; value: string | number; [key: string]: any };

type DualListTransferProps = {
  name: string;
  label?: string;
  allLabel?: string;
  selectedLabel?: string;
  options: Option[];
  values: (string | number)[];
  onChange: (vals: (string | number)[]) => void;
  onBlur?: (name: string) => void;
  required?: boolean;
  error?: string;
  readOnly?: boolean;
};

export const DualListTransfer = forwardRef<
  HTMLDivElement,
  DualListTransferProps
>(
  (
    {
      name,
      label,
      allLabel = "All Items",
      selectedLabel = "Selected Items",
      options,
      values = [],
      onChange,
      onBlur,
      required = false,
      error,
      readOnly = false,
    },
    ref,
  ) => {
    const [leftSearch, setLeftSearch] = useState("");
    const [rightSearch, setRightSearch] = useState("");

    const leftOptions = useMemo(
      () =>
        options
          .filter((o) => !values.includes(o.value))
          .filter((o) =>
            o.label.toLowerCase().includes(leftSearch.toLowerCase()),
          ),
      [options, values, leftSearch],
    );

    const rightOptions = useMemo(
      () =>
        options
          .filter((o) => values.includes(o.value))
          .filter((o) =>
            o.label.toLowerCase().includes(rightSearch.toLowerCase()),
          ),
      [options, values, rightSearch],
    );

    const moveToRight = useCallback(
      (optValue: string | number) => {
        if (readOnly) return;
        onChange([...values, optValue]);
      },
      [values, onChange, readOnly],
    );

    const moveToLeft = useCallback(
      (optValue: string | number) => {
        if (readOnly) return;
        onChange(values.filter((v) => v !== optValue));
      },
      [values, onChange, readOnly],
    );

    const moveAllToRight = useCallback(() => {
      if (readOnly) return;
      onChange(options.map((o) => o.value));
    }, [options, onChange, readOnly]);

    const moveAllToLeft = useCallback(() => {
      if (readOnly) return;
      onChange([]);
    }, [onChange, readOnly]);

    return (
      <div ref={ref} className="w-2xl" onBlur={() => onBlur?.(name)}>
        {/* ── Field Label Row ────────────────────────────────── */}
        {label && (
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-semibold text-gray-700">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full font-medium">
              {values.length} / {options.length} selected
            </span>
          </div>
        )}

        {/* ── Transfer Panels ────────────────────────────────── */}
        <div className="flex gap-0 items-stretch rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {/* LEFT PANEL */}
          <div className="flex-1 flex flex-col border-r border-gray-200 bg-white">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800">
              <span className="text-white text-xs font-bold uppercase tracking-widest">
                {allLabel}
              </span>
              <span className="text-slate-300 text-xs tabular-nums">
                {leftOptions.length} items
              </span>
            </div>

            {/* Search */}
            <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
              <div className="relative">
                <svg
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  value={leftSearch}
                  onChange={(e) => setLeftSearch(e.target.value)}
                  disabled={readOnly}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all"
                />
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto min-h-[150px] max-h-[150px]">
              {leftOptions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-300 gap-2">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-xs">
                    {leftSearch ? "No matches" : "All items selected"}
                  </span>
                </div>
              ) : (
                leftOptions.map((opt, idx) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => moveToRight(opt.value)}
                    disabled={readOnly}
                    className={`
                      w-full text-left flex items-center justify-between px-4 py-2.5 text-xs font-medium
                      transition-all duration-100 group border-b border-gray-50 last:border-0
                      ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                      ${
                        readOnly
                          ? "opacity-50 cursor-not-allowed text-gray-500"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
                      }
                    `}
                  >
                    <span className="truncate">{opt.label}</span>
                    <svg
                      className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-400 flex-shrink-0 ml-2 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* CENTER CONTROLS */}
          <div className="flex flex-col items-center justify-center gap-1.5 px-2 bg-gray-50 border-r border-gray-200 w-12 flex-shrink-0">
            <button
              type="button"
              title="Select all"
              onClick={moveAllToRight}
              disabled={readOnly || leftOptions.length === 0}
              className={`
                w-8 h-7 rounded flex items-center justify-center text-xs font-bold transition-all
                ${
                  readOnly || leftOptions.length === 0
                    ? "opacity-20 cursor-not-allowed bg-gray-100 text-gray-400"
                    : "bg-white border border-gray-300 text-gray-600 hover:bg-slate-700 hover:text-white hover:border-slate-700 cursor-pointer shadow-sm"
                }
              `}
            >
              »
            </button>
            <div className="w-px h-3 bg-gray-300" />
            <button
              type="button"
              title="Deselect all"
              onClick={moveAllToLeft}
              disabled={readOnly || values.length === 0}
              className={`
                w-8 h-7 rounded flex items-center justify-center text-xs font-bold transition-all
                ${
                  readOnly || values.length === 0
                    ? "opacity-20 cursor-not-allowed bg-gray-100 text-gray-400"
                    : "bg-white border border-gray-300 text-gray-600 hover:bg-red-500 hover:text-white hover:border-red-500 cursor-pointer shadow-sm"
                }
              `}
            >
              «
            </button>
          </div>

          {/* RIGHT PANEL */}
          <div className="flex-1 flex flex-col bg-white">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-blue-600">
              <span className="text-white text-xs font-bold uppercase tracking-widest">
                {selectedLabel}
              </span>
              <span className="text-blue-100 text-xs tabular-nums">
                {values.length} selected
              </span>
            </div>

            {/* Search */}
            <div className="px-3 py-2 border-b border-blue-50 bg-blue-50/30">
              <div className="relative">
                <svg
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-300 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search selected..."
                  value={rightSearch}
                  onChange={(e) => setRightSearch(e.target.value)}
                  disabled={readOnly}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto min-h-[200px] max-h-[260px]">
              {rightOptions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-300 gap-2">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="text-xs">
                    {rightSearch ? "No matches" : "Click items to select"}
                  </span>
                </div>
              ) : (
                rightOptions.map((opt, idx) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => moveToLeft(opt.value)}
                    disabled={readOnly}
                    className={`
                      w-full text-left flex items-center gap-2 px-4 py-2.5 text-xs font-medium
                      transition-all duration-100 group border-b border-blue-50/50 last:border-0
                      ${idx % 2 === 0 ? "bg-blue-50/30" : "bg-white"}
                      ${
                        readOnly
                          ? "opacity-50 cursor-not-allowed text-blue-400"
                          : "text-blue-700 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                      }
                    `}
                  >
                    {/* blue check that turns × on hover */}
                    <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                      <svg
                        className="w-3.5 h-3.5 text-blue-400 group-hover:hidden"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <svg
                        className="w-3.5 h-3.5 text-red-400 hidden group-hover:block"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </span>
                    <span className="truncate flex-1">{opt.label}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Hint / Error */}
        {error ? (
          <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5 flex-shrink-0"
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
        ) : (
          <p className="mt-1.5 text-xs text-gray-800">
            Click any item to move it · Use » / « to move all
          </p>
        )}
      </div>
    );
  },
);

DualListTransfer.displayName = "DualListTransfer";

import React, {
  forwardRef,
  useMemo,
  useState,
  useCallback,
} from "react";

type RunTypeOption = {
  label: string;
  value: string | number;
  app_type_id: string | number;
};

type AppTypeOption = {
  label: string;
  value: string | number;
};

type GroupedRunTypeSelectorProps = {
  name: string;
  label?: string;
  /** All available run type options (must include app_type_id) */
  options: RunTypeOption[];
  /** Currently selected app types — used to know which groups to show */
  appTypeOptions?: AppTypeOption[];
  /** Currently selected run type IDs */
  values: (string | number)[];
  onChange: (vals: (string | number)[]) => void;
  onBlur?: (name: string) => void;
  required?: boolean;
  error?: string;
  readOnly?: boolean;
};

export const GroupedRunTypeSelector = forwardRef<
  HTMLDivElement,
  GroupedRunTypeSelectorProps
>(
  (
    {
      name,
      label,
      options = [],
      appTypeOptions = [],
      values = [],
      onChange,
      onBlur,
      required = false,
      error,
      readOnly = false,
    },
    ref,
  ) => {
    // Which accordion groups are open — default all open
    const [openGroups, setOpenGroups] = useState<Set<string | number>>(
      () => new Set(options.map((o) => o.app_type_id)),
    );

    // Build groups: { appTypeId -> { label, runTypes[] } }
    const groups = useMemo(() => {
      const map = new Map<
        string | number,
        { label: string; runTypes: RunTypeOption[] }
      >();

      options.forEach((rt) => {
        if (!map.has(rt.app_type_id)) {
          const appType = appTypeOptions.find(
            (a) => String(a.value) === String(rt.app_type_id),
          );
          map.set(rt.app_type_id, {
            label: appType?.label ?? `App Type ${rt.app_type_id}`,
            runTypes: [],
          });
        }
        map.get(rt.app_type_id)!.runTypes.push(rt);
      });

      return Array.from(map.entries()).map(([appTypeId, data]) => ({
        appTypeId,
        label: data.label,
        runTypes: data.runTypes,
      }));
    }, [options, appTypeOptions]);

    const toggleGroup = useCallback((appTypeId: string | number) => {
      setOpenGroups((prev) => {
        const next = new Set(prev);
        next.has(appTypeId) ? next.delete(appTypeId) : next.add(appTypeId);
        return next;
      });
    }, []);

    const isSelected = (val: string | number) =>
      values.some((v) => String(v) === String(val));

    const toggleOne = useCallback(
      (val: string | number) => {
        if (readOnly) return;
        if (isSelected(val)) {
          onChange(values.filter((v) => String(v) !== String(val)));
        } else {
          onChange([...values, val]);
        }
      },
      [values, onChange, readOnly],
    );

    const toggleGroup_allItems = useCallback(
      (runTypes: RunTypeOption[], allSelected: boolean) => {
        if (readOnly) return;
        if (allSelected) {
          const ids = new Set(runTypes.map((r) => String(r.value)));
          onChange(values.filter((v) => !ids.has(String(v))));
        } else {
          const existing = new Set(values.map(String));
          const toAdd = runTypes
            .filter((r) => !existing.has(String(r.value)))
            .map((r) => r.value);
          onChange([...values, ...toAdd]);
        }
      },
      [values, onChange, readOnly],
    );

    const totalSelected = values.length;
    const totalAvailable = options.length;

    if (groups.length === 0) {
      return (
        <div ref={ref} className="w-full">
          {label && (
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center py-10 gap-2 text-gray-400">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z"
              />
            </svg>
            <p className="text-sm font-medium">No app types selected</p>
            <p className="text-xs">Select app types above to see run types</p>
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className="w-full" onBlur={() => onBlur?.(name)}>
        {/* Header row */}
        {label && (
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-700">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full font-medium tabular-nums">
                {totalSelected} / {totalAvailable} selected
              </span>
              {!readOnly && (
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => onChange(options.map((o) => o.value))}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800 px-2.5 py-1 rounded-md hover:bg-indigo-50 transition-colors"
                  >
                    Select all
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange([])}
                    className="text-xs font-medium text-gray-500 hover:text-red-600 px-2.5 py-1 rounded-md hover:bg-red-50 transition-colors"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Accordion groups */}
        <div className="space-y-2">
          {groups.map(({ appTypeId, label: groupLabel, runTypes }) => {
            const isOpen = openGroups.has(appTypeId);
            const selectedInGroup = runTypes.filter((r) =>
              isSelected(r.value),
            ).length;
            const allGroupSelected = selectedInGroup === runTypes.length;
            const someGroupSelected =
              selectedInGroup > 0 && !allGroupSelected;

            return (
              <div
                key={String(appTypeId)}
                className="border border-gray-200 rounded-xl overflow-hidden shadow-sm"
              >
                {/* Group header */}
                <div
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer select-none transition-colors ${
                    isOpen ? "bg-slate-800" : "bg-slate-700 hover:bg-slate-800"
                  }`}
                  onClick={() => toggleGroup(appTypeId)}
                >
                  <div className="flex items-center gap-3">
                    {/* Group checkbox */}
                    {!readOnly && (
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          allGroupSelected
                            ? "bg-indigo-400 border-indigo-400"
                            : someGroupSelected
                              ? "bg-indigo-200 border-indigo-400"
                              : "bg-slate-600 border-slate-400"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleGroup_allItems(runTypes, allGroupSelected);
                        }}
                      >
                        {allGroupSelected && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                        {someGroupSelected && !allGroupSelected && (
                          <div className="w-2 h-0.5 bg-indigo-700 rounded" />
                        )}
                      </div>
                    )}

                    <span className="text-white text-sm font-bold tracking-wide">
                      {groupLabel}
                    </span>

                    {/* Badge */}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium tabular-nums ${
                        selectedInGroup > 0
                          ? "bg-indigo-400 text-white"
                          : "bg-slate-600 text-slate-300"
                      }`}
                    >
                      {selectedInGroup}/{runTypes.length}
                    </span>
                  </div>

                  {/* Chevron */}
                  <svg
                    className={`w-4 h-4 text-slate-300 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {/* Run types grid */}
                {isOpen && (
                  <div className="bg-white p-3">
                    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                      {runTypes.map((rt) => {
                        const selected = isSelected(rt.value);
                        return (
                          <label
                            key={String(rt.value)}
                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-all select-none group ${
                              selected
                                ? "bg-indigo-50 border-indigo-300 shadow-sm"
                                : "bg-gray-50 border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/40"
                            } ${readOnly ? "cursor-default opacity-70" : "cursor-pointer"}`}
                          >
                            <div
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                selected
                                  ? "bg-indigo-600 border-indigo-600"
                                  : "bg-white border-gray-300 group-hover:border-indigo-400"
                              }`}
                            >
                              {selected && (
                                <svg
                                  className="w-2.5 h-2.5 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3.5}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                            <span
                              className={`text-xs font-medium leading-tight ${
                                selected ? "text-indigo-800" : "text-gray-700"
                              }`}
                            >
                              {rt.label}
                            </span>
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={selected}
                              readOnly={readOnly}
                              onChange={() => toggleOne(rt.value)}
                              disabled={readOnly}
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <p className="mt-2 text-xs text-red-600 flex items-center gap-1.5">
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
        )}
      </div>
    );
  },
);

GroupedRunTypeSelector.displayName = "GroupedRunTypeSelector";

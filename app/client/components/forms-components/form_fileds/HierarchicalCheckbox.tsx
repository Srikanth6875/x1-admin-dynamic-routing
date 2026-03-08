import React, { forwardRef, useState, useMemo, useCallback } from "react";

type TreeItem = {
  app_id: number;
  app_name: string;
  module_id: number;
  module_name: string;
  runtype_id: number;
  runtype_name: string;
};

type Props = {
  name?: string;
  label?: string;
  options: TreeItem[];
  values: (string | number)[];
  required?: boolean;
  error?: string;
  readOnly?: boolean;
  onChange: (vals: (string | number)[]) => void;
  onBlur?: () => void;
};

export const HierarchicalCheckbox = forwardRef<HTMLDivElement, Props>(
  (
    {
      label,
      options = [],
      values = [],
      required,
      error,
      readOnly,
      onChange,
      onBlur,
    },
    ref,
  ) => {
    const [expandedApps, setExpandedApps] = useState<number[]>([]);
    const [expandedModules, setExpandedModules] = useState<number[]>([]);

    // 🔹 Convert flat rows → structured tree
    const tree = useMemo(() => {
      const grouped: any = {};

      options.forEach((row) => {
        if (!grouped[row.app_id]) {
          grouped[row.app_id] = {
            app_id: row.app_id,
            app_name: row.app_name,
            modules: {},
          };
        }

        if (!grouped[row.app_id].modules[row.module_id]) {
          grouped[row.app_id].modules[row.module_id] = {
            module_id: row.module_id,
            module_name: row.module_name,
            runtypes: [],
          };
        }

        grouped[row.app_id].modules[row.module_id].runtypes.push({
          runtype_id: row.runtype_id,
          runtype_name: row.runtype_name,
        });
      });

      return Object.values(grouped);
    }, [options]);

    const toggleValue = useCallback(
      (id: number) => {
        if (readOnly) return;

        if (values.includes(id)) {
          onChange(values.filter((v) => Number(v) !== id));
        } else {
          onChange([...values, id]);
        }
      },
      [values, onChange, readOnly],
    );

    const toggleExpand = (id: number, type: "app" | "module") => {
      if (type === "app") {
        setExpandedApps((prev) =>
          prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
      } else {
        setExpandedModules((prev) =>
          prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
      }
    };

    return (
      <div ref={ref} className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="border rounded-lg p-4 bg-white max-h-[500px] overflow-y-auto space-y-3">
          {tree.map((app: any) => (
            <div key={app.app_id} className="border rounded-md">
              {/* APP HEADER */}
              <div
                className="px-3 py-2 bg-gray-100 font-semibold text-gray-800 cursor-pointer flex justify-between items-center"
                onClick={() => toggleExpand(app.app_id, "app")}
              >
                {app.app_name}
                <span>{expandedApps.includes(app.app_id) ? "−" : "+"}</span>
              </div>

              {/* MODULES */}
              {expandedApps.includes(app.app_id) &&
                Object.values(app.modules).map((module: any) => (
                  <div
                    key={module.module_id}
                    className="ml-4 border-l pl-4 mt-2"
                  >
                    <div
                      className="cursor-pointer font-medium text-gray-700 flex justify-between"
                      onClick={() => toggleExpand(module.module_id, "module")}
                    >
                      {module.module_name}
                      <span>
                        {expandedModules.includes(module.module_id) ? "−" : "+"}
                      </span>
                    </div>

                    {/* RUNTYPES */}
                    {expandedModules.includes(module.module_id) && (
                      <div className="ml-4 mt-2 space-y-2">
                        {module.runtypes.map((rt: any) => (
                          <label
                            key={rt.runtype_id}
                            className="flex items-center gap-2 text-sm cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={values.includes(rt.runtype_id)}
                              onChange={() => toggleValue(rt.runtype_id)}
                              disabled={readOnly}
                              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                            {rt.runtype_name}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ))}
        </div>

        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </div>
    );
  },
);

HierarchicalCheckbox.displayName = "HierarchicalCheckbox";

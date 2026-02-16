import React, { useMemo, useState } from "react";

type Option = {
  label: string;
  value: string | number;
};

type Props = {
  name: string;
  label?: string;
  options: Option[];
  values: (string | number)[];
  leftTitle?: string;
  rightTitle?: string;
  onChange: (values: (string | number)[]) => void;
  error?: string;
};

export function MultiSelectBox({
  label,
  options,
  values,
  leftTitle = "UnSelected Items",
  rightTitle = "Selected Items",
  onChange,
  error,
}: Props) {
  const [dragItem, setDragItem] = useState<string | number | null>(null);

  const leftItems = useMemo(
    () => options.filter((o) => !values.includes(o.value)),
    [options, values],
  );

  const rightItems = useMemo(
    () => options.filter((o) => values.includes(o.value)),
    [options, values],
  );

  const addItem = (val: string | number) => {
    if (!values.includes(val)) {
      onChange([...values, val]);
    }
  };

  const removeItem = (val: string | number) => {
    onChange(values.filter((v) => v !== val));
  };

  return (
    <div>
      {label && (
        <label className="block mb-2 font-medium text-gray-700">{label}</label>
      )}

      <div className="flex gap-4">
        {/* LEFT BOX */}
        <div
          className="w-1/2 border rounded p-2 min-h-[220px]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => dragItem && addItem(dragItem)}
        >
          <div className="font-semibold mb-2">{leftTitle}</div>

          {leftItems.map((item) => (
            <div
              key={item.value}
              draggable
              onDragStart={() => setDragItem(item.value)}
              onClick={() => addItem(item.value)}
              className="p-1 mb-1 border rounded cursor-pointer hover:bg-blue-100"
            >
              {item.label}
            </div>
          ))}
        </div>

        {/* RIGHT BOX */}
        <div
          className="w-1/2 border rounded p-2 min-h-[220px]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => dragItem && removeItem(dragItem)}
        >
          <div className="font-semibold mb-2">{rightTitle}</div>

          {rightItems.map((item) => (
            <div
              key={item.value}
              draggable
              onDragStart={() => setDragItem(item.value)}
              onClick={() => removeItem(item.value)}
              className="p-1 mb-1 border rounded cursor-pointer hover:bg-red-100"
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}

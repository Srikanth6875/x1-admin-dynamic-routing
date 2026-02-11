import { useState, useMemo, memo, useCallback, useRef, useEffect } from "react";
import { Button } from "../buttons/Button";
import type { FormField } from "~/types/form.types";
import { Message } from "../messages/Message";

export interface DeleteConfirmProps {
  title: string;
  fields: Record<string, FormField>;
  values: Record<string, unknown>;
  onConfirm: () => void;
  onCancel: () => void;
  success: boolean;
  errorMessage?: string;
}

const displayValue = (field: FormField, value: unknown): string => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    (typeof value === "string" &&
      (value.trim() === "" || value === "null" || value === "undefined")) ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0)
  ) {
    return "--";
  }

  if (
    field.options &&
    (typeof value === "string" || typeof value === "number")
  ) {
    const option = field.options.find((opt) => opt.value === value);
    if (option) return option.label;
  }

  if (field.options && Array.isArray(value)) {
    const labels = value
      .map((v) => {
        const opt = field.options!.find((o) => o.value === v);
        return opt ? opt.label : String(v);
      })
      .filter(Boolean);
    return labels.length > 0 ? labels.join(", ") : "--";
  }

  return String(value);
};

const FieldDisplay = memo(
  ({
    fieldKey,
    field,
    value,
  }: {
    fieldKey: string;
    field: FormField;
    value: unknown;
  }) => (
    <div>
      <div className="text-xs uppercase tracking-wide text-gray-500">
        {field.label ?? fieldKey}
      </div>
      <div className="mt-1 text-sm font-semibold text-gray-900">
        {displayValue(field, value)}
      </div>
    </div>
  ),
  (prevProps, nextProps) => {
    return (
      prevProps.value === nextProps.value && prevProps.field === nextProps.field
    );
  },
);

FieldDisplay.displayName = "FieldDisplay";

export const DeleteConfirm = memo(function DeleteConfirm({
  payload,
}: {
  payload: DeleteConfirmProps;
}) {
  const { title, fields, values, onConfirm, onCancel, success, errorMessage } =
    payload;

  const [isDeleting, setIsDeleting] = useState(false);
  const [frozenValues, setFrozenValues] = useState(() => values);

  const deleteIdentity = useMemo(() => {
    return `${title}-${values?.id ?? "new"}`;
  }, [title, values]);

  useEffect(() => {
    setFrozenValues(values || {});
    setIsDeleting(false);
  }, [deleteIdentity]);

  const visibleFields = useMemo(() => {
    return Object.entries(fields).filter(([_, field]) => !field.hidden);
  }, [fields]);

  const handleConfirm = useCallback(() => {
    setIsDeleting(true);
    onConfirm();
  }, [onConfirm]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  console.log("DELETE STATE:", { title, frozenValues });

  // return (
  //   <div className="flex justify-center bg-gray-100 p-6 min-h-screen relative">
  //     {/* SUCCESS OVERLAY */}
  //     {success && (
  //       <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center">
  //         <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
  //           <div className="flex items-center justify-center mb-4">
  //             <div className="rounded-full bg-red-100 p-3">
  //               <svg
  //                 className="w-12 h-12 text-red-600"
  //                 fill="none"
  //                 stroke="currentColor"
  //                 viewBox="0 0 24 24"
  //               >
  //                 <path
  //                   strokeLinecap="round"
  //                   strokeLinejoin="round"
  //                   strokeWidth={2}
  //                   d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
  //                 />
  //               </svg>
  //             </div>
  //           </div>
  //           <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">
  //             Deleted Successfully!
  //           </h3>
  //           <p className="text-center text-gray-600">Redirecting...</p>
  //           <div className="mt-4 flex justify-center">
  //             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
  //           </div>
  //         </div>
  //       </div>
  //     )}

  //     <div className="w-full max-w-5xl bg-white rounded-xl shadow-md p-8">
  //       {/* ERROR MESSAGE with animation */}
  //       {errorMessage && !success && (
  //         <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r animate-shake">
  //           <div className="flex items-center">
  //             <svg
  //               className="w-6 h-6 text-red-500 mr-3"
  //               fill="none"
  //               stroke="currentColor"
  //               viewBox="0 0 24 24"
  //             >
  //               <path
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //                 strokeWidth={2}
  //                 d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
  //               />
  //             </svg>
  //             <div>
  //               <h3 className="text-sm font-semibold text-red-800">Error</h3>
  //               <p className="text-sm text-red-700">{errorMessage}</p>
  //             </div>
  //           </div>
  //         </div>
  //       )}

  //       <h1 className="text-xl font-semibold text-red-600 mb-6">{title}</h1>

  //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  //         {visibleFields.map(([key, field]) => (
  //           <FieldDisplay
  //             key={key}
  //             fieldKey={key}
  //             field={field}
  //             value={frozenValues[key]}
  //           />
  //         ))}
  //       </div>

  //       <div className="flex justify-center gap-8 mt-10">
  //         <Button
  //           type="button"
  //           variant="delete"
  //           label="Yes, Delete"
  //           onClick={handleConfirm}
  //           loading={isDeleting}
  //           disabled={isDeleting}
  //         />
  //         <Button
  //           type="button"
  //           variant="cancel"
  //           label="Cancel"
  //           onClick={handleCancel}
  //           disabled={isDeleting}
  //         />
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="flex justify-center bg-gray-100 p-6 min-h-screen relative">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-md p-8 relative">
        {/* ERROR MESSAGE */}
        {errorMessage && !success && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r animate-shake">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-red-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-red-800">Error</h3>
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        <h1 className="text-xl font-semibold text-red-600 mb-6">{title}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleFields.map(([key, field]) => (
            <FieldDisplay
              key={key}
              fieldKey={key}
              field={field}
              value={frozenValues[key]}
            />
          ))}
        </div>

        <div className="flex justify-center gap-8 mt-10">
          <Button
            type="button"
            variant="delete"
            label="Yes, Delete"
            onClick={handleConfirm}
            loading={isDeleting}
            disabled={isDeleting}
          />
          <Button
            type="button"
            variant="cancel"
            label="Cancel"
            onClick={handleCancel}
            disabled={isDeleting}
          />
        </div>

        {/* ── SUCCESS OVERLAY  */}
        {success && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center z-10">
            <div className="text-center p-10 max-w-md">
              <div className="flex items-center justify-center mb-6">
                <div className="rounded-full bg-red-100 p-5">
                  <svg
                    className="w-15 h-15 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-600 mb-3">
                Deleted Successfully!
              </h3>
              <p className="text-xl text-gray-600 mb-8">{title}</p>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
              <p className="mt-6 text-sm text-gray-500">Redirecting to ...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

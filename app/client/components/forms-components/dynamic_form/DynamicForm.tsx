import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  memo,
  useRef,
} from "react";
import { FieldFactory } from "./FieldFactory";
import { Message } from "../messages/Message";
import { Button } from "../buttons/Button";
import type {
  FormFields,
  FormFieldValue,
  FormValues,
} from "~/types/form.types";
import { validateForm } from "~/Validation/ValidateForm";

type DynamicFormProps = {
  fields: FormFields;
  initialValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onCancel?: () => void;
  title: string;
  submitLabel?: string;
  cancelLabel?: string;
  success: boolean;
  errorMessage?: string;
  mode: "ADD" | "EDIT";
};

//use to prevents re-rendering unchnagedfileds when state chnages
const MemoizedField = memo(
  ({ name, field, value, error, onChange, onBlur, fieldRef }: any) => (
    <div className="w-full">
      <FieldFactory
        ref={(el) => fieldRef(name, el)}
        field={{ name, ...field }}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={error}
      />
    </div>
  ),
  (prevProps, nextProps) => {
    return (
      prevProps.value === nextProps.value &&
      prevProps.error === nextProps.error &&
      prevProps.field === nextProps.field
    );
  },
);

MemoizedField.displayName = "MemoizedField";

export const DynamicForm = memo(function DynamicForm({
  payload,
}: {
  payload: DynamicFormProps;
}) {
  const {
    fields,
    initialValues = {},
    onSubmit,
    onCancel,
    title = "Create Record",
    submitLabel = "Save",
    cancelLabel = "Cancel",
    success,
    errorMessage,
    mode,
  } = payload;

  const [values, setValues] = useState<FormValues>(() => initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTopError, setShowTopError] = useState(false);

  const fieldRefs = useRef<Record<string, HTMLElement | null>>({}); //for focusing fields on error
  const messageRef = useRef<HTMLDivElement>(null); //for scrolling to top error
  const showSuccessOverlay = success;

  const formIdentity = useMemo(() => {
    return `${title}-${initialValues?.id ?? "new"}`;
  }, [title, initialValues]);
  //Clears form when switching between Add/Edit different records
  // Prevents showing old data when navigating between records

  useEffect(() => {
    setValues(initialValues || {});
    setErrors({});
    setTouched({});
    setSubmitted(false);
    setIsSubmitting(false);
    setShowTopError(false);
  }, [formIdentity]);

  // Error handling top message and shake animation
  useEffect(() => {
    if (errorMessage && !success) {
      setIsSubmitting(false);
      setShowTopError(true);

      if (messageRef.current) {
        messageRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        messageRef.current.classList.remove("animate-shake"); // reset
        void messageRef.current.offsetWidth; // force reflow
        messageRef.current.classList.add("animate-shake");

        setTimeout(() => {
          messageRef.current?.classList.remove("animate-shake");
        }, 1000);
      }
    }
  }, [errorMessage, success, isSubmitting]);

  const uiFields = useMemo(() => {
    if (!fields) return [];
    return Object.entries(fields)
      .filter(([_, f]) => !f.hidden)
      .map(([name, f]) => ({
        name,
        label: f.label ?? name.replace(/_/g, " ").toUpperCase(),
        type: f.type,
        required: f.required ?? false,
        min: f.min,
        max: f.max,
        options: f.options ?? [],
      }));
  }, [fields]);

  const handleChange = useCallback(
    (name: string, value: FormFieldValue) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => {
        if (!prev[name]) return prev;
        const { [name]: _, ...rest } = prev;
        return rest;
      });
      if (showTopError) {
        setShowTopError(false);
      }
    },
    [showTopError],
  );

  const handleBlur = useCallback(
    (name: string) => {
      setTouched((prev) => ({ ...prev, [name]: true }));

      const field = fields[name];
      if (!field) return;

      const blurErrors = validateForm({ [name]: field }, values, "blur");

      setErrors((prev) => ({
        ...prev,
        [name]: blurErrors[name] || "",
      }));
    },
    [fields, values],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmitted(true);
      const submitErrors = validateForm(fields, values, "submit");

      setErrors(submitErrors);

      if (Object.keys(submitErrors).length === 0) {
        setIsSubmitting(true);
        onSubmit(values);
      }
    },
    [fields, values, onSubmit],
  );

  const setFieldRef = useCallback(
    (name: string, element: HTMLElement | null) => {
      fieldRefs.current[name] = element;
    },
    [],
  );

  return (
    <div className="flex justify-center bg-gray-100 p-4 min-h-screen relative">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-10"
      >
        <h1 className="text-xl font-bold mb-8 text-left text-black">{title}</h1>

        {showTopError && errorMessage && (
          <div ref={messageRef} className="mb-6">
            <Message success={false} title={errorMessage} />
          </div>
        )}

        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {uiFields.map(({ name, ...field }) => (
            <MemoizedField
              key={name}
              name={name}
              field={field}
              value={values[name]}
              error={errors[name]}
              onChange={handleChange}
              onBlur={handleBlur}
              fieldRef={setFieldRef}
            />
          ))}
        </div>

        <div className="flex justify-center gap-20 mt-8">
          <Button
            type="submit"
            variant="submit"
            loading={isSubmitting}
            label={submitLabel}
            disabled={isSubmitting}
          />
          {onCancel && (
            <Button
              type="button"
              variant="cancel"
              onClick={onCancel}
              label={cancelLabel}
              disabled={isSubmitting}
            />
          )}
        </div>

        {showSuccessOverlay && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-md rounded-lg flex items-center justify-center z-10">
            <div className="text-center p-8">
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-full bg-green-100 p-4">
                  <svg
                    className="w-16 h-16 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Success!</h3>
              <p className="text-lg text-gray-600 mb-6">{title}</p>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
              <p className="mt-4 text-sm text-gray-500">Redirecting to .....</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
});

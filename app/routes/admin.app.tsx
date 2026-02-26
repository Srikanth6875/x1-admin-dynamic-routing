import {
  redirect,
  useLoaderData,
  useActionData,
  useSubmit,
  useNavigate,
  useLocation,
} from "react-router";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { useEffect, useMemo, useCallback } from "react";
import { requestStore } from "~/database/request-store";
import { requireUserSession } from "~/auth-sessions/auth-session.service";
import { executeWithPermission } from "~/run-engine/reflection-executor.server";
import { UIComponentType } from "~/shared/admin.enums";
import { FrameworkRenderer } from "~/client/framework-renderer";
import type { RenderResult } from "~/types/listining-types";
import type { BuildFormResult } from "~/types/form-builder.types";
import type { ActionData, ExecuteResponse } from "~/types/admin-forms.types";

// ─── Types ────────────────────────────────────────────────────────────────────

type LoaderData =
  | { kind: "form";   form: BuildFormResult["payload"]; userId: string }
  | { kind: "render"; render: RenderResult;             userId: string };

// ─── Loader ───────────────────────────────────────────────────────────────────

export const loader = async ({
  request,
  params,
}: LoaderFunctionArgs): Promise<LoaderData> => {
  const urlParams = Object.fromEntries(
    new URL(request.url).searchParams.entries(),
  );

  return requestStore.run({ formData: {}, query: urlParams }, async () => {
    const { userId } = await requireUserSession(request).catch(() => {
      throw redirect("/login");
    });

    const appType = params["app-type"];
    const runType = params["run-type"];

    if (!appType || !runType) {
      throw new Response("Missing parameters", { status: 400 });
    }

    const result = await executeWithPermission({
      userId,
      app_type: appType,
      run_type: runType,
    });

    if (
      result &&
      typeof result === "object" &&
      "component_type" in result &&
      result.component_type === UIComponentType.FORMS
    ) {
      return { kind: "form", form: (result as BuildFormResult).payload, userId };
    }

    return { kind: "render", render: result as RenderResult, userId };
  });
};

// ─── Action ───────────────────────────────────────────────────────────────────

export async function action({ request }: ActionFunctionArgs): Promise<ActionData> {
  const formData = await request.formData();

  const formDataObj: Record<string, unknown> = {};
  const exclude = ["APP_TYPE", "RUN_TYPE"];

  for (const [key, value] of Array.from(formData.entries())) {
    if (exclude.includes(key)) continue;
    if (key in formDataObj) {
      formDataObj[key] = Array.isArray(formDataObj[key])
        ? [...(formDataObj[key] as unknown[]), value]
        : [formDataObj[key], value];
    } else {
      formDataObj[key] = value;
    }
  }

  return requestStore.run({ formData: formDataObj, query: {} }, async () => {
    const { userId } = await requireUserSession(request).catch(() => {
      throw redirect("/login");
    });

    const app_type = formData.get("APP_TYPE");
    const run_type = formData.get("RUN_TYPE");

    if (!app_type || typeof app_type !== "string") {
      return { success: false, message: "Missing APP_TYPE", timestamp: Date.now() };
    }

    try {
      const response = await executeWithPermission({
        userId,
        app_type,
        run_type: typeof run_type === "string" ? run_type : undefined,
      });
      const res = response as ExecuteResponse;
      return { success: res.success, message: res.message, timestamp: Date.now() };
    } catch (error: unknown) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Something went wrong",
        timestamp: Date.now(),
      };
    }
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminAppPage() {
  const loaderData   = useLoaderData<LoaderData>();
  const actionData   = useActionData() as ActionData | undefined;
  const submit       = useSubmit();
  const navigate     = useNavigate();
  const location     = useLocation();

  // ── All hooks must run unconditionally — no early returns before this line ──

  // Safe defaults when kind === "render" (form is undefined)
  const form = loaderData.kind === "form" ? loaderData.form : null;

  const listPath = useMemo(
    () => form ? `/app/${form.app_type}/${form.cancel_action}` : "/",
    [form],
  );

  useEffect(() => {
    if (form && actionData?.success) {
      navigate(listPath, {
        state: { successMessage: actionData.message, fromForm: true },
      });
    }
  }, [actionData?.success, navigate, listPath, actionData?.message, form]);

  const handleCancel = useCallback(
    () => navigate(listPath),
    [navigate, listPath],
  );

  const handleFormSubmit = useCallback(
    (values: Record<string, unknown>) => {
      if (!form) return;
      submit(
        { ...values, APP_TYPE: form.app_type, RUN_TYPE: form.save_action },
        { method: "post" },
      );
    },
    [submit, form],
  );

  const descriptor = useMemo((): RenderResult | null => {
    if (!form) return null;

    if (form.mode === "DELETE") {
      return {
        component_type: UIComponentType.DELETE,
        payload: {
          title:        form.title,
          fields:       form.fields,
          values:       form.initialValues,
          success:      actionData?.success ?? false,
          errorMessage: actionData && !actionData.success ? actionData.message : undefined,
          onConfirm: () =>
            submit(
              {
                ...form.initialValues,
                APP_TYPE: form.app_type,
                RUN_TYPE: form.save_action,
                del: true,
              },
              { method: "post" },
            ),
          onCancel: handleCancel,
        },
      };
    }

    return {
      component_type: UIComponentType.FORMS,
      payload: {
        title:         form.title,
        fields:        form.fields,
        initialValues: form.initialValues,
        mode:          form.mode as "ADD" | "EDIT",
        onSubmit:      handleFormSubmit,
        onCancel:      handleCancel,
        submitLabel:   "Save",
        cancelLabel:   "Cancel",
        success:       actionData?.success ?? false,
        errorMessage:  actionData && !actionData.success ? actionData.message : undefined,
      },
    };
  }, [form, actionData, handleFormSubmit, handleCancel, submit]);

  // ── Render ────────────────────────────────────────────────────────────────

  // kind: "render" → TABLE, DETAILS, etc. — straight through, no form wiring
  if (loaderData.kind === "render") {
    return <FrameworkRenderer render={loaderData.render} />;
  }

  // kind: "form" → ADD, EDIT, DELETE
  const recordId     = form!.initialValues?.[form!.idColumn] ?? "new";
  const componentKey = `${form!.app_type}-${form!.mode}-${recordId}-${location.pathname}`;

  return <FrameworkRenderer key={componentKey} render={descriptor!} />;
}

import {
  useActionData,
  useLoaderData,
  useSubmit,
  redirect,
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
import type { RenderResult } from "~/shared/listining-types";
import type {
  ActionData,
  ExecuteResponse,
  FormFields,
  LoaderData,
} from "~/types/admin-forms.types";
import type { BuildFormResult } from "~/types/form-builder.types";

export const loader = async ({
  request,
  params,
}: LoaderFunctionArgs): Promise<LoaderData> => {
  const urlParams = Object.fromEntries(
    new URL(request.url).searchParams.entries(),
  );

  return requestStore.run(
    {
      formData: {},
      query: urlParams,
    },
    async () => {
      const { userId } = await requireUserSession(request).catch(() => {
        throw redirect("/login");
      });

      const appType = params["app-type"];
      const runType = params["run-type"];

      if (!appType || !runType) {
        throw new Response("Missing parameters", { status: 400 });
      }

      const form = (await executeWithPermission({
        userId,
        app_type: appType,
        run_type: runType,
      })) as BuildFormResult;

      return { form: form.payload, userId };
    },
  );
};

const formDataToObject = (
  fd: FormData,
  exclude: string[] = ["APP_TYPE", "RUN_TYPE"],
): FormFields => {
  const obj: FormFields = {};
  const entries = Array.from(fd.entries());

  for (const [key, value] of entries) {
    if (exclude.includes(key)) continue;

    if (key in obj) {
      obj[key] = Array.isArray(obj[key])
        ? [...(obj[key] as any[]), value]
        : [obj[key], value];
    } else {
      obj[key] = value;
    }
  }

  return obj;
};

export async function action({
  request,
}: ActionFunctionArgs): Promise<ActionData> {
  const formData = await request.formData();
  const formDataObj = formDataToObject(formData);

  return requestStore.run(
    {
      formData: formDataObj,
      query: {},
    },
    async () => {
      const { userId } = await requireUserSession(request).catch(() => {
        throw redirect("/login");
      });

      const app_type = formData.get("APP_TYPE");
      const run_type = formData.get("RUN_TYPE");

      if (!app_type || typeof app_type !== "string") {
        return {
          success: false,
          message: "Missing APP_TYPE",
        };
      }

      try {
        const response = await executeWithPermission({
          userId,
          app_type,
          run_type: typeof run_type === "string" ? run_type : undefined,
        });

        const finalResponse = response as ExecuteResponse;
        return {
          success: finalResponse.success,
          message: finalResponse.message,
        };
      } catch (error: unknown) {
        return {
          success: false,
          message:
            error instanceof Error ? error.message : "Something went wrong",
        };
      }
    },
  );
}

export default function FormRenderingPage() {
  const { form } = useLoaderData<LoaderData>();
  const actionData = useActionData() as ActionData | undefined;
  const submit = useSubmit();
  const navigate = useNavigate();
  const location = useLocation();

  const listPath = useMemo(
    () => `/list/${form.app_type}/${form.cancel_action}`,
    [form.app_type, form.cancel_action],
  );

  useEffect(() => {
    if (actionData?.success) {
      navigate(listPath, {
        state: {
          successMessage: actionData.message,
          fromForm: true,
        },
      });
    }
  }, [actionData?.success, navigate, listPath, actionData?.message]);

  const handleSubmit = useCallback(
    (values: FormFields): void => {
      submit(
        {
          ...values,
          APP_TYPE: form.app_type,
          RUN_TYPE: form.save_action,
        },
        { method: "post" },
      );
    },
    [submit, form.app_type, form.save_action],
  );

  const handleCancel = useCallback((): void => {
    navigate(listPath);
  }, [navigate, listPath]);

const componentKey = `${form.app_type}-${form.mode}-${form.initialValues?.[form.idColumn] ?? "new"}`;

  const descriptor = useMemo((): RenderResult => {
    if (form.mode === "DELETE") {
      return {
        component_type: UIComponentType.DELETE,
        payload: {
          title: form.title,
          fields: form.fields,
          values: form.initialValues,
          success: actionData?.success ?? false,
          errorMessage:
            actionData && !actionData.success ? actionData.message : undefined,
          onConfirm: () => {
            submit(
              {
                ...form.initialValues,
                APP_TYPE: form.app_type,
                RUN_TYPE: form.save_action,
                del: true,
              },
              { method: "post" },
            );
          },
          onCancel: handleCancel,
        },
      };
    }

    return {
      component_type: UIComponentType.FORMS,
      payload: {
        title: form.title,
        fields: form.fields,
        initialValues: form.initialValues,
        mode: form.mode as "ADD" | "EDIT",
        onSubmit: handleSubmit,
        onCancel: handleCancel,
        submitLabel: "Save",
        cancelLabel: "Cancel",
        success: actionData?.success ?? false,
        errorMessage:
          actionData && !actionData.success ? actionData.message : undefined,
      },
    };
  }, [form, actionData, handleSubmit, handleCancel, submit]);

  return <FrameworkRenderer key={componentKey} render={descriptor} />;
}

import { useActionData, redirect } from "react-router";
import type { ActionFunction, LoaderFunction } from "react-router";
import { UserAuthService } from "~/auth-sessions/auth-app.service";
import { createUserSession, getSession } from "~/auth-sessions/auth-session.service";
import { LoginForm } from "~/client/components/helper-components/LoginCard";

/**
 * Loader checks if user is already logged in
 */
export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  if (session?.data?.userId) {
    // Access session.userId from Redis session
    return redirect("/list/ROOFTOPS/GET_ROOFTOPS");
  }
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = (form.get("email")?.toString() || "").trim();
  const password = (form.get("password")?.toString() || "").trim();
  const user = await UserAuthService.validateLogin(email, password);

  if (!user) {
    return { error: "Invalid email or password" };
  }

  return createUserSession(user.id, user.username, "/list/ROOFTOPS/GET_ROOFTOPS");
};

export default function LoginRoute() {
  const data = useActionData<{ error?: string }>();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 px-4">
      <LoginForm error={data?.error} />
    </div>
  );
}

import { useActionData, redirect } from "react-router";
import type { ActionFunction, LoaderFunction } from "react-router";
import { AuthService } from "~/__auth/auth-app.service";
import { createUserSession, getSession } from "~/__auth/auth-session.service";
import { LoginForm } from "~/__components/LoginCard";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  if (session?.get("userId")) {
    return redirect("/ROOFTOPS/GET_ROOFTOPS");
  }
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = (form.get("email")?.toString() || "").trim();
  const password = (form.get("password")?.toString() || "").trim();

  const auth = new AuthService();
  const user = await auth.validateLogin(email, password);

  if (!user) {
    return { error: "Invalid email or password" };
  }

  return createUserSession(user.id, "/ROOFTOPS/GET_ROOFTOPS");
};

export default function LoginRoute() {
  const data = useActionData<{ error?: string }>();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 px-4">
      <LoginForm error={data?.error} />
    </div>
  );
}

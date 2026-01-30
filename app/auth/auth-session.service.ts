import { createCookieSessionStorage, redirect } from "react-router";

/**
 * Session expires ONLY if user is idle for this duration
 * (30 minutes)
 */
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "user_session",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    secrets: [process.env.SESSION_SECRET || "DEV_SECRET_CHANGE_ME"],
  },
});

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  if (!cookie) return null;

  return sessionStorage.getSession(cookie);
}

/**
 * Create session after login
 */
export async function createUserSession(userId: number, redirectTo: string) {
  const session = await sessionStorage.getSession();

  session.set("userId", userId);
  session.set("lastActivity", Date.now());

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

/**
 * Require logged-in user
 * - Expires session ONLY if user is idle
 * - Refreshes session on every request
 */
export async function requireUserSession(request: Request) {
  const session = await getSession(request);

  // No session or user not logged in
  if (!session || !session.get("userId")) {
    throw redirect("/login");
  }

  const userId = session.get("userId") as number | undefined;
  const lastActivity = session.get("lastActivity") as number | undefined;
  const now = Date.now();

  // Invalid or missing session data → destroy cookie
  if (!userId || !lastActivity) {
    throw redirect("/login", {
      headers: {
        "Set-Cookie": await sessionStorage.destroySession(session),
      },
    });
  }

  // User logged in but idle too long → destroy session
  if (lastActivity && now - lastActivity > SESSION_TIMEOUT_MS) {
    throw redirect("/login", {
      headers: {
        "Set-Cookie": await sessionStorage.destroySession(session),
      },
    });
  }

  // User is active → refresh activity timestamp
  session.set("lastActivity", now);

  return {
    userId,
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  };
}

/**
 * Logout user and destroy session
 */
export async function logoutSession(request: Request) {
  const session = await getSession(request);

  return redirect("/login", {
    headers: {
      "Set-Cookie": session ? await sessionStorage.destroySession(session) : "",
    },
  });
}

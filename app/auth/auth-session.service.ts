import { redirect } from "react-router";
import { generateSessionUUID } from "~/utils/guid-helper";
import { setSessionDataInServer, getSessionDataInServer, deleteSessionInServer, getSessionIdFromRequest, commitSessionCookie, destroySessionCookie, SESSION_TIMEOUT_MS, } from "./user-session-server";

/** Get full session (id + data) */
export async function getSession(request: Request) {
  const sessionId = await getSessionIdFromRequest(request);
  if (!sessionId) return null;

  const data = await getSessionDataInServer(sessionId);
  if (!data) return null;

  return { sessionId, data };
}

/** Create session after login */
export async function createUserSession(userId: number, userName: string, redirectTo: string) {
  const sessionId = generateSessionUUID();
  const sessionData = {
    userId,
    userName,
    lastActivity: Date.now(),
  };
  await setSessionDataInServer(sessionId, sessionData);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSessionCookie(sessionId),
    },
  });
}

export async function requireUserSession(request: Request) {
  const session = await getSession(request);
  if (!session) throw redirect("/login");

  const { sessionId, data } = session;
  const { userId, userName, lastActivity } = data;
  const now = Date.now();

  // Expired
  if (!lastActivity || now - lastActivity > SESSION_TIMEOUT_MS) {
    await deleteSessionInServer(sessionId);

    throw redirect("/login", {
      headers: {
        "Set-Cookie": await destroySessionCookie(),
      },
    });
  }

  // Refresh TTL + last activity
  const updatedData = { userId, userName, lastActivity: now };
  await setSessionDataInServer(sessionId, updatedData);

  return {
    userId,
    userName,
    headers: {
      "Set-Cookie": await commitSessionCookie(sessionId),
    },
  };
}

/** Logout user */
export async function logoutSession(request: Request) {
  const sessionId = await getSessionIdFromRequest(request);
  if (sessionId) await deleteSessionInServer(sessionId);

  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySessionCookie(),
    },
  });
}

/*
export async function getSessionValue<T = unknown>(request: Request, key: string): Promise<T | null> {
  const session = await getSession(request);
  if (!session) return null;

  const value = session.data?.[key as keyof typeof session.data];
  return (value as T) ?? null;
}*/

import { createCookie } from "react-router";
import { redis } from "~/database/redis-server";
import { getTrimEnvKey } from "~/shared/util-helper";

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 min idle timeout
const SESSION_SECRET = getTrimEnvKey("SESSION_SECRET") || "DEV_SECRET";
const APP_SECURE = getTrimEnvKey("NODE_ENV") === "production";
const SESSION_PREFIX = "user_session:";

// Cookie stores ONLY the session ID
const sessionCookie = createCookie("auth_session", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: APP_SECURE,
    secrets: [SESSION_SECRET],
});

/** ---------------- REDIS HELPERS ---------------- */
export async function setSessionDataInRedis(sessionId: string, data: object) {
    await redis.set(
        `${SESSION_PREFIX}${sessionId}`,
        JSON.stringify(data),
        { PX: SESSION_TIMEOUT_MS }
    );
}

export async function getSessionDataInRedis(sessionId: string) {
    const raw = await redis.get(`${SESSION_PREFIX}${sessionId}`);
    return raw ? JSON.parse(raw) : null;
}

export async function deleteSessionInRedis(sessionId: string) {
    await redis.del(`${SESSION_PREFIX}${sessionId}`);
}

/** Parse session ID from request cookie */
export async function getSessionIdFromRequest(request: Request) {
    const cookieHeader = request.headers.get("Cookie");
    return sessionCookie.parse(cookieHeader);
}

/** Create Set-Cookie header */
export async function commitSessionCookie(sessionId: string) {
    return sessionCookie.serialize(sessionId);
}

export async function destroySessionCookie() {
    return sessionCookie.serialize("", { maxAge: 0 });
}

/**
 * Get session data directly from Redis by session ID
 */
export async function getSessionDataById(sessionId: string) {
    if (!sessionId) return null;

    const raw = await redis.get(`${SESSION_PREFIX}${sessionId}`);
    if (!raw) return null;

    try {
        const data = JSON.parse(raw);
        return data;
    } catch (err) {
        console.error("Failed to parse session data:", err);
        return null;
    }
}

export { SESSION_TIMEOUT_MS };

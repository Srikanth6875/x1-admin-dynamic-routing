import { createClient } from "redis";
import { getEnvKey } from "~/shared/util-helper";

export const redis = createClient({
  socket: {
    host: getEnvKey("REDIS_HOST"),
    port: Number(getEnvKey("REDIS_PORT", "6379")),
  },
  password: getEnvKey("REDIS_PASSWORD"),
});

redis.on("error", (err: any) => console.error("Redis connection error:", err));

if (!redis.isOpen) {
  try {
    await redis.connect();
  } catch (err) {
    console.error("Redis connected failed:", err);
  }
}

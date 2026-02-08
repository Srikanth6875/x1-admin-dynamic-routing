import { createClient } from "redis";
import { getTrimEnvKey } from "~/shared/util-helper";

export const redis = createClient({
  socket: {
    host: getTrimEnvKey("REDIS_HOST"),
    port: Number(getTrimEnvKey("REDIS_PORT", "6379")),
  },
  password: getTrimEnvKey("REDIS_PASSWORD"),
});

redis.on("error", (err: any) => console.error("Redis connection error:", err));

if (!redis.isOpen) {
  try {
    await redis.connect();
  } catch (err) {
    console.error("Redis connected failed:", err);
  }
}

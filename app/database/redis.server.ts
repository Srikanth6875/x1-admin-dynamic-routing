import { createClient } from "redis";
import { getTrimEnv } from "~/utils/get-env-helper";

export const redis = createClient({
  socket: {
    host: getTrimEnv("REDIS_HOST"),
    port: Number(getTrimEnv("REDIS_PORT", "6379")),
  },
  password: getTrimEnv("REDIS_PASSWORD"),
});

redis.on("error", (err) => console.error("Redis connection error:", err));
// redis.on("connect", () => console.log("Redis socket connected"));
// redis.on("ready", () => console.log("Redis connection established and ready"));

if (!redis.isOpen) {
  try {
    await redis.connect();
  } catch (err) {
    console.error("Redis connected failed:", err);
  }
}

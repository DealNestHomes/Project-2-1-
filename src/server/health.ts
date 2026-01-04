import { eventHandler } from "vinxi/http";

export default eventHandler(async (event) => {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    region: process.env.VERCEL_REGION || "unknown",
  };
});

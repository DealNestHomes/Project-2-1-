import { defineEventHandler, toWebRequest } from "@tanstack/react-start/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./root";

export default defineEventHandler(async (event) => {

  const request = toWebRequest(event);
  if (!request) {
    return new Response("No request", { status: 400 });
  }

  const url = new URL(request.url);
  console.log(`[tRPC Handler] Request: ${request.method} ${url.pathname}${url.search}`);
  console.log(`[tRPC Handler] Headers:`, Object.fromEntries(request.headers.entries()));

  try {
    // Check environment variables first
    const { validateEnv } = await import("~/server/env");
    validateEnv();

    return await fetchRequestHandler({
      endpoint: "/api/trpc",
      req: request,
      router: appRouter,
      createContext() {
        return {};
      },
      onError({ error, path }) {
        console.error(`[tRPC Error] Path: '${path}'`);
        console.error(`[tRPC Error] Message:`, error.message);
        console.error(`[tRPC Error] Stack:`, error.stack);
        if (error.cause) {
           console.error(`[tRPC Error] Cause:`, error.cause);
        }
      },
    });
  } catch (err: any) {
    console.error(`[tRPC Handler] CRITICAL HANDLER ERROR:`, err);
    console.error(`[tRPC Handler] Stack:`, err.stack);

    // TEMPORARY: Return error details to client for debugging
    return new Response(JSON.stringify({
      error: "Internal Server Error",
      message: err.message,
      stack: err.stack,
      details: String(err)
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});


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
    return await fetchRequestHandler({
      endpoint: "/api/trpc",
      req: request,
      router: appRouter,
      createContext() {
        return {};
      },
      onError({ error, path }) {
        console.error(`tRPC error on '${path}':`, error);
      },
    });
  } catch (err) {
    console.error(`[tRPC Handler] CRITICAL ERROR:`, err);
    return new Response(JSON.stringify({ error: "Internal Server Error", details: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});


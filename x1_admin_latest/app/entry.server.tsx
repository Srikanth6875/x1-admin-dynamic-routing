import { ServerRouter } from "react-router";
import { renderToPipeableStream } from "react-dom/server";
import { createReadableStreamFromReadable } from "@react-router/node";
import { PassThrough } from "node:stream";
import type { EntryContext } from "react-router";
import { isbot } from "isbot";
import { bootstrapReflectionRegistry } from "~/run-engine/reflection-registry.service";

// Server will NOT accept requests until registry is ready
await bootstrapReflectionRegistry();

const ABORT_DELAY = 5000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  const isBot = isbot(request.headers.get("user-agent") ?? "");

  return new Promise<Response>((resolve) => {
    let didError = false;

    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        /**
         * REAL USERS → fastest possible TTFB
         * Send shell immediately, stream Suspense later
         */

        
        onShellReady() {
          if (isBot) return;

          responseHeaders.set("Content-Type", "text/html; charset=utf-8");

          const body = new PassThrough({
            highWaterMark: 128 * 1024, // smoother streaming under load
          });

          const stream = createReadableStreamFromReadable(body);

          resolve(
            new Response(stream, {
              status: didError ? 500 : responseStatusCode,
              headers: responseHeaders,
            }),
          );

          pipe(body);
        },

        /**
         * BOTS → wait for full render (SEO correctness)
         */
        onAllReady() {
          if (!isBot) return;

          responseHeaders.set("Content-Type", "text/html; charset=utf-8");

          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          resolve(
            new Response(stream, {
              status: didError ? 500 : responseStatusCode,
              headers: responseHeaders,
            }),
          );

          pipe(body);
        },

        onShellError(err) {
          console.error(err);
          resolve(
            new Response("Internal Server Error", {
              status: 500,
              headers: responseHeaders,
            }),
          );
        },

        onError(err) {
          didError = true;
          console.error(err);
        },
      },
    );

    // Abort stalled renders (memory + CPU protection)
    setTimeout(abort, ABORT_DELAY);
  });
}

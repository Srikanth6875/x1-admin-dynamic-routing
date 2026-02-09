import { ServerRouter } from "react-router";
import { renderToPipeableStream } from "react-dom/server";
import { createReadableStreamFromReadable } from "@react-router/node";
import type { EntryContext } from "react-router";
import { PassThrough } from "node:stream";
import { isbot } from "isbot";
import "~/run-engine/reflection-registry.service";

const ABORT_DELAY = 10_000; // safer for cold starts / data loaders

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  const userAgent = request.headers.get("user-agent") ?? "";
  const isBotRequest = isbot(userAgent);

  return new Promise<Response>((resolve) => {
    let didError = false;
    let resolved = false;

    const safeResolve = (response: Response) => {
      if (resolved) return;
      resolved = true;
      resolve(response);
    };

    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        /**
         * REAL USERS
         * - Fast TTFB
         * - Streams Suspense boundaries progressively
         */
        onShellReady() {
          if (isBotRequest) return;

          responseHeaders.set("Content-Type", "text/html; charset=utf-8");

          const body = new PassThrough({
            highWaterMark: 64 * 1024, // smoother streaming
          });

          const stream = createReadableStreamFromReadable(body);

          safeResolve(
            new Response(stream, {
              status: didError ? 500 : responseStatusCode,
              headers: responseHeaders,
            }),
          );

          pipe(body);
        },

        /**
         * BOTS / SEO
         * - Wait for full HTML
         * - Ensures complete markup for crawlers
         */
        onAllReady() {
          if (!isBotRequest) return;

          responseHeaders.set("Content-Type", "text/html; charset=utf-8");

          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          safeResolve(
            new Response(stream, {
              status: didError ? 500 : responseStatusCode,
              headers: responseHeaders,
            }),
          );

          pipe(body);
        },

        /**
         * Shell failed — bail out hard
         */
        onShellError(err) {
          console.error("SSR shell error:", err);

          safeResolve(
            new Response("Internal Server Error", {
              status: 500,
              headers: new Headers({
                "Content-Type": "text/plain; charset=utf-8",
              }),
            }),
          );
        },

        /**
         * Rendering error after shell
         */
        onError(err) {
          didError = true;
          console.error("SSR render error:", err);
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

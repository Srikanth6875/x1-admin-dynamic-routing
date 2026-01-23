import { ServerRouter } from "react-router";
import { renderToPipeableStream } from "react-dom/server";
import { createReadableStreamFromReadable } from "@react-router/node";
import { PassThrough } from "node:stream";
import type { EntryContext } from "react-router";
import { isbot } from "isbot";
import "./__runner-engine/reflection-registry.service";

const ABORT_DELAY = 5000;

export default function handleRequest(request: Request, responseStatusCode: number, responseHeaders: Headers, routerContext: EntryContext) {
  const isBot = isbot(request.headers.get("user-agent") ?? "");
  return new Promise<Response>((resolve) => {
    let didError = false;

    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        /**
         * FAST PATH (real users)
         * Sends shell immediately, streams Suspense later
         */
        onShellReady() {
          if (isBot) return;
          responseHeaders.set("Content-Type", "text/html; charset=utf-8");

          const body = new PassThrough({
            highWaterMark: 64 * 1024, // reduce backpressure
          });
          const stream = createReadableStreamFromReadable(body);

          resolve(
            new Response(stream, {
              status: didError ? 500 : responseStatusCode,
              headers: responseHeaders,
            })
          );
          pipe(body);
        },

        /**
         * BOT PATH (SEO)
         * Waits for everything to be ready
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
            })
          );
          pipe(body);
        },

        onShellError(err) {
          console.error(err);
          resolve(
            new Response("Internal Server Error", {
              status: 500,
              headers: responseHeaders,
            })
          );
        },

        onError(err) {
          didError = true;
          console.error(err);
        },
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

import { ServerRouter } from "react-router";
import { renderToPipeableStream } from "react-dom/server";
import { createReadableStreamFromReadable } from "@react-router/node";
import { PassThrough } from "node:stream";
import type { EntryContext } from "react-router";
import "./__execute_engine/reflection-registry.service";

const ABORT_DELAY = 10000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext
) {

  return new Promise<Response>((resolve) => {
    let didError = false;

    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        onShellReady() {
          responseHeaders.set("Content-Type", "text/html");

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

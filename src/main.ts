import { BunRuntime } from "@effect/platform-bun";
import { Console, Effect } from "effect";
import { createHono } from "~/api";

const program = Effect.gen(function* () {
  yield* Console.log("Starting application.");

  const hono = yield* createHono;

  const server = Bun.serve({
    port: 8000,
    fetch: hono.fetch,
  });

  yield* Console.log(`Started HTTP server at ${server.url}`);
});

BunRuntime.runMain(program);

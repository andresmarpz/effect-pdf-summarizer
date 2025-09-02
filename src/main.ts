import { BunRuntime } from "@effect/platform-bun";
import { Console, Effect } from "effect";
import { createServer } from "~/api";

const program = Effect.gen(function* () {
  yield* Console.log("Starting application.");

  yield* createServer;
});

BunRuntime.runMain(program);

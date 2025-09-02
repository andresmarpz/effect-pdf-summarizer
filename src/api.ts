import { Console, Effect, Schedule } from "effect";

const logEffect = Effect.gen(function* () {
  yield* Console.log("Hello, from a Fiber!");
});

const eff = Effect.repeat(logEffect, {
  times: 10,
  schedule: Schedule.spaced(100),
});

const routeEffect = Effect.gen(function* () {
  const res = yield* eff.pipe(Effect.map((times) => String(times)));

  if (res !== "10") {
    return yield* Effect.fail(new Error("Effect an awkward amount of times!"));
  }

  return yield* Effect.succeed("Run 10 times!");
});

function createBunServer() {
  const bunServer = Bun.serve({
    port: 8000,
    routes: {
      "/health": () => new Response("OK"),
      "/log": async () => {
        try {
          const result = await Effect.runPromise(routeEffect);
          return new Response(result);
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error(err);
            return new Response(`Failed with: ${err.message}`);
          }

          return new Response("Unknown error.");
        }
      },
    },
  });
  console.log(`Server is running on ${bunServer.url}`);
  return bunServer;
}

export { createBunServer };

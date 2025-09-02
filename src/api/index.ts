import { Console, Effect, Schedule } from "effect";
import { Hono } from "hono";

const logFromEndpoint = Effect.gen(function* () {
  yield* Console.log("Logging from endpoint..");
});

const logEndpoint = Effect.gen(function* () {
  const times = yield* Effect.repeat(logFromEndpoint, {
    times: 3,
    schedule: Schedule.spaced(100),
  });

  return yield* Effect.succeed(times);
});

const healthEndpoint = Effect.gen(function* () {
  const cpuUsage = process.cpuUsage().system;
  const uptime = process.uptime();

  return yield* Effect.succeed({
    cpuUsage,
    uptime,
    status: "healthy",
  });
});

export const createHono = Effect.gen(function* () {
  const app = new Hono();

  app.get("/health", async (ctx) => {
    const result = await Effect.runPromise(healthEndpoint);
    return ctx.json(result);
  });

  app.get("/log", async (ctx) => {
    const result = await Effect.runPromise(logEndpoint);
    return ctx.json({ times: result });
  });

  return yield* Effect.succeed(app);
});

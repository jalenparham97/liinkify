import { createTRPCRouter, createCallerFactory } from "@/server/api/trpc";
import { userRouter } from "./routers/user.router";
import { storageRouter } from "./routers/storage.router";
import { paymentRouter } from "./routers/payment.router";
import { profilesRouter } from "./routers/profile.router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  storage: storageRouter,
  payment: paymentRouter,
  profiles: profilesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 */
export const createCaller = createCallerFactory(appRouter);

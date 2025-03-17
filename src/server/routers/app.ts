import { router } from '@/server/trpc';
import { filterEventsRouter } from '@/server/routers/filterEvents';
import { type inferRouterOutputs } from '@trpc/server';

export const appRouter = router({
  filterEvents: filterEventsRouter,
});

export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

import { router } from '@/server/trpc';
import { filterEventsRouter } from '@/server/routers/filterEvents';
import { type inferRouterOutputs } from '@trpc/server';
import { ticketsRouter } from '@/server/routers/tickets';

export const appRouter = router({
  filterEvents: filterEventsRouter,
  tickets: ticketsRouter,
});

export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

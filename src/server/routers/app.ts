import { router } from '@/server/trpc';
import { filterEventsRouter } from '@/server/routers/filterEvents';

export const appRouter = router({
  filterEvents: filterEventsRouter,
});

export type AppRouter = typeof appRouter;

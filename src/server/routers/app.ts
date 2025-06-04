import { router } from '@/server/trpc';
import { filterEventsRouter } from '@/server/routers/filterEvents';
import { type inferRouterOutputs } from '@trpc/server';
import { ticketsRouter } from '@/server/routers/tickets';
import { ticketGroupRouter } from '@/server/routers/ticket-group';
import { mercadopagoRouter } from '@/server/routers/mercadopago';
import { profileRouter } from '@/server/routers/profile';
export const appRouter = router({
  filterEvents: filterEventsRouter,
  tickets: ticketsRouter,
  ticketGroup: ticketGroupRouter,
  mercadopago: mercadopagoRouter,
  profile: profileRouter,
});

export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

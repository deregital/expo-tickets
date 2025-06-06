import { handleError, router, ticketsProcedure } from '@/server/trpc';
import { z } from 'zod';
import { createTicketSchema } from 'expo-backend-types';

export const ticketsRouter = router({
  createMany: ticketsProcedure
    .input(z.array(createTicketSchema))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.fetch.POST('/ticket/create-many', {
        body: {
          tickets: input.map((ticket) => ({
            ...ticket,
            ticketGroupId: ticket.ticketGroupId ?? null,
          })),
        },
      });
      if (error) {
        throw handleError(error);
      }
      return data;
    }),
});

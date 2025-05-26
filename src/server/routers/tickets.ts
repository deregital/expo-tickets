import { handleError, router, ticketsProcedure } from '@/server/trpc';
import { createManyTicketSchema } from 'expo-backend-types';

export const ticketsRouter = router({
  createMany: ticketsProcedure
    .input(createManyTicketSchema)
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.fetch.POST('/ticket/create-many', {
        body: {
          tickets: input.tickets.map((ticket) => ({
            ...ticket,
            ticketGroupId: ticket.ticketGroupId ?? null,
          })),
          referralCode: input.referralCode,
        },
      });
      if (error) {
        throw handleError(error);
      }
      return data;
    }),
});

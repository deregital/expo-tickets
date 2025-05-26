import { handleError, router, ticketsProcedure } from '@/server/trpc';
import { z } from 'zod';
import { createTicketSchema, profileSchema } from 'expo-backend-types';

export const ticketsRouter = router({
  createMany: ticketsProcedure
    .input(
      z.object({
        tickets: z.array(createTicketSchema),
        referralCode: profileSchema.shape.referralCode,
      }),
    )
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

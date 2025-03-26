import {
  createTicketGroupSchema,
  updateTicketGroupSchema,
} from 'expo-backend-types';
import { handleError, router, ticketsProcedure } from '../trpc';
import { z } from 'zod';

export const ticketGroupRouter = router({
  create: ticketsProcedure
    .input(createTicketGroupSchema)
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.fetch.POST('/ticket-group/create', {
        body: {
          ...input,
        },
      });
      if (error) {
        throw handleError(error);
      }
      return data;
    }),

  getTicketsByEvent: ticketsProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.fetch.GET(
        '/ticket-group/find-tickets-by-event/{id}',
        {
          params: {
            path: {
              id: input,
            },
          },
        },
      );
      if (error) {
        throw handleError(error);
      }
      return data;
    }),

  update: ticketsProcedure
    .input(updateTicketGroupSchema.merge(z.object({ id: z.string() })))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.fetch.PATCH(
        '/ticket-group/update/{id}',
        {
          params: {
            path: {
              id: input.id,
            },
          },
          body: {
            ...input,
          },
        },
      );
      if (error) {
        throw handleError(error);
      }
      return data;
    }),

  delete: ticketsProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.fetch.DELETE(
        '/ticket-group/delete/{id}',
        {
          params: {
            path: {
              id: input,
            },
          },
        },
      );
      if (error) {
        throw handleError(error);
      }
      return data;
    }),
});

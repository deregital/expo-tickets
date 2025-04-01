import { router, ticketsProcedure, handleError } from '@/server/trpc';
import { z } from 'zod';

export const filterEventsRouter = router({
  getCitiesByState: ticketsProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const { data, error } = await ctx.fetch.GET(
        '/location/find-cities-by-arg-state/{argState}',
        {
          params: {
            path: {
              argState: input,
            },
          },
        },
      );
      if (error) {
        throw handleError(error);
      }
      return data;
    }),
  getProvinces: ticketsProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.fetch.GET('/location/arg-states');
    if (error) {
      throw handleError(error);
    }
    return data;
  }),
  getEvents: ticketsProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.fetch.GET('/event/find-active');
    if (error) {
      throw handleError(error);
    }
    return data;
  }),
  getEventById: ticketsProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const { data, error } = await ctx.fetch.GET(`/event/{id}`, {
        params: {
          path: {
            id: input,
          },
        },
      });
      if (error) throw handleError(error);
      return data;
    }),
});

import { router, publicProcedure, handleError } from '@/server/trpc';
import { z } from 'zod';

export const filterEventsRouter = router({
  getCitiesByState: publicProcedure
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
          headers: {
            Authorization: `Bearer ${process.env.EXPO_BACKEND_TOKEN}`,
          },
        },
      );
      if (error) {
        console.log(error);
        throw handleError(error);
      }
      return data;
    }),
  getProvinces: publicProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.fetch.GET('/location/arg-states', {
      headers: {
        Authorization: `Bearer ${process.env.EXPO_BACKEND_TOKEN}`,
      },
    });
    if (error) {
      console.log(error);
      throw handleError(error);
    }
    return data;
  }),
  getEvents: publicProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.fetch.GET('/event/find-active', {
      headers: {
        Authorization: `Bearer ${process.env.EXPO_BACKEND_TOKEN}`,
      },
    });
    if (error) {
      console.log(error);
      throw handleError(error);
    }
    return data;
  }),
});

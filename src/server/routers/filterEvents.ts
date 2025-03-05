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
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5pY28iLCJpZCI6ImM4Mzk4NzVmLTUwYzUtNDU3My04MTM3LWU3NmI3MDY5MjBiZCIsInN1YiI6eyJ1c2Vybm5hbWUiOiJuaWNvIn0sImlhdCI6MTc0MTIxMzkzMywiZXhwIjoxNzQxMjE3NTMzfQ.sZTfbvjkNkKeQX-d-Dpk60ou5qH2OXfYlXIbWm1F-4I`,
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
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5pY28iLCJpZCI6ImM4Mzk4NzVmLTUwYzUtNDU3My04MTM3LWU3NmI3MDY5MjBiZCIsInN1YiI6eyJ1c2Vybm5hbWUiOiJuaWNvIn0sImlhdCI6MTc0MTIxMzkzMywiZXhwIjoxNzQxMjE3NTMzfQ.sZTfbvjkNkKeQX-d-Dpk60ou5qH2OXfYlXIbWm1F-4I`,
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
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5pY28iLCJpZCI6ImM4Mzk4NzVmLTUwYzUtNDU3My04MTM3LWU3NmI3MDY5MjBiZCIsInN1YiI6eyJ1c2Vybm5hbWUiOiJuaWNvIn0sImlhdCI6MTc0MTIxMzkzMywiZXhwIjoxNzQxMjE3NTMzfQ.sZTfbvjkNkKeQX-d-Dpk60ou5qH2OXfYlXIbWm1F-4I`,
      },
    });
    if (error) {
      console.log(error);
      throw handleError(error);
    }
    return data;
  }),
});

import { handleError, router, ticketsProcedure } from '@/server/trpc';
import { createPreferenceSchema } from 'expo-backend-types';

export const mercadopagoRouter = router({
  createPreference: ticketsProcedure
    .input(createPreferenceSchema)
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.fetch.POST(
        '/mercadopago/create-preference',
        {
          body: input,
        },
      );
      if (error) {
        throw handleError(error);
      }
      return data;
    }),
});

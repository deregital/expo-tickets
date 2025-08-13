import { handleError, publicProcedure, router } from '@/server/trpc';
import { loginProducerSchema } from 'expo-backend-types';

export const expoTicketsProducerLoginRouter = router({
  login: publicProcedure
    .input(loginProducerSchema)
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await ctx.fetch.POST(
        '/expo-tickets-producer-login/login',
        {
          body: input,
        },
      );

      if (error) {
        throw handleError(error);
      }

      return data;
    }),
  getEventTickets: publicProcedure
    .input(loginProducerSchema)
    .query(async ({ input, ctx }) => {
      const { data, error } = await ctx.fetch.POST(
        '/expo-tickets-producer-login/get-event-tickets',
        {
          body: {
            mail: input.mail,
            password: input.password,
          },
        },
      );

      if (error) {
        throw handleError(error);
      }

      return data;
    }),
});

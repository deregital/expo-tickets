import { handleError, router, ticketsProcedure } from '@/server/trpc';
import { profileSchema } from 'expo-backend-types';

export const profileRouter = router({
  referralCodeExists: ticketsProcedure
    .input(profileSchema.shape.referralCode)
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.fetch.GET(
        '/profile/referral-code-exists/{code}',
        {
          params: {
            path: {
              code: input,
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

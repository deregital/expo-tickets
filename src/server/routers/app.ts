import { publicProcedure, router } from '@/server/trpc';

export const appRouter = router({
  hello: publicProcedure.query(() => {
    return { greeting: 'Hello, World!' };
  }),
});

export type AppRouter = typeof appRouter;

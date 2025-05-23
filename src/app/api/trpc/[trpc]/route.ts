import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/routers/app';
import { createTRPCContext } from '@/server/trpc';

const handler = async (req: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ headers: req.headers }),
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC error on ${path ?? '<no-path>'}: ${error.message}`,
            );
          }
        : undefined,
  });
};

export { handler as GET, handler as POST };

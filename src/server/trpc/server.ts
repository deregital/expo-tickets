import 'server-only'; // <-- ensure this file cannot be imported from the client
import { createHydrationHelpers } from '@trpc/react-query/rsc';
import { cache } from 'react';
import { makeQueryClient } from '@/server/trpc/query-client';
import { appRouter } from '@/server/routers/app';
import { createCallerFactory, createTRPCContext } from '@/server/trpc';
import { headers } from 'next/headers';

export const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set('x-trpc-source', 'rsc');

  return createTRPCContext({
    headers: heads,
  });
});

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);
const callerFactory = createCallerFactory(appRouter);
const caller = callerFactory(createContext);
export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  getQueryClient,
);

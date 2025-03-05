import { fetchClient } from '@/server/fetchClient';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

export function handleError(error: {
  message: string[];
  statusCode: number;
  error: string;
}): TRPCError | undefined {
  const { message, statusCode, error: cause } = error;

  const messageString = message[0];
  const errorCode = statusCode as
    | 200
    | 400
    | 401
    | 403
    | 404
    | 408
    | 409
    | 412
    | 413
    | 405
    | 499
    | 500;

  if (errorCode === 200) {
    return;
  }

  const errorFromStatusCode = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    408: 'TIMEOUT',
    409: 'CONFLICT',
    412: 'PRECONDITION_FAILED',
    413: 'PAYLOAD_TOO_LARGE',
    405: 'METHOD_NOT_SUPPORTED',
    499: 'CLIENT_CLOSED_REQUEST',
    500: 'INTERNAL_SERVER_ERROR',
  } as const;

  const code =
    errorFromStatusCode[errorCode] || ('INTERNAL_SERVER_ERROR' as const);

  return new TRPCError({
    code,
    message: messageString,
    cause,
  });
}

export const createTRPCContext = async (opts: { headers: Headers }) => {
  // const session = await auth();

  return {
    // session,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
//   const session = ctx.session;

//   if (!session || !session.user) {
//     throw new TRPCError({ code: 'UNAUTHORIZED' });
//   }

//   return next({
//     ctx: {
//       session: { ...session, user: session.user },
//       fetch: fetchClient,
//     },
//   });
// });

export const router = t.router;
export const publicProcedure = t.procedure.use(({ ctx, next }) => {
  return next({
    ctx: {
      ...ctx,
      fetch: fetchClient,
    },
  });
});
export const createCallerFactory = t.createCallerFactory;

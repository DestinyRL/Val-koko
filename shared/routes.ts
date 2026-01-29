
import { z } from 'zod';
import { insertResponseSchema, responses } from './schema';

export const api = {
  response: {
    create: {
      method: 'POST' as const,
      path: '/api/response',
      input: insertResponseSchema,
      responses: {
        201: z.custom<typeof responses.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
  },
};

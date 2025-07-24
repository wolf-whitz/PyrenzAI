import type { SupabaseClient } from '@supabase/supabase-js';
import { select, rpc, insert, update, remove } from './SupabaseFunctions';
import { getCached, setCached, deleteCached } from './Cache/cacheWorkerManager';

const USER_TABLES = ['user', 'users', 'auth.users', 'user_data'];

export const withClient = (client: SupabaseClient) => {
  return {
    select: async <T>(req: Parameters<typeof select<T>>[1]) => {
      const tableNames = Array.isArray(req.tables) ? req.tables : [req.tables];
      const isUserQuery =
        tableNames.some((table) => USER_TABLES.includes(table.toLowerCase())) &&
        typeof req.match === 'object' &&
        req.match !== null &&
        ('id' in req.match || 'user_uuid' in req.match);

      const cacheKey = isUserQuery
        ? `user:${
            (req.match as Record<string, any>).id ??
            (req.match as Record<string, any>).user_uuid
          }`
        : null;

      if (cacheKey) {
        const cached = await getCached<{ data: T[]; count: number | null }>(
          cacheKey
        );
        if (cached) return cached;
      }

      const result = await select<T>(client, req);

      if (cacheKey) {
        await setCached(cacheKey, result);
      }

      return result;
    },

    insert: <T>(req: Parameters<typeof insert<T>>[1]) => insert<T>(client, req),

    update: async <T, M = Partial<T>>(
      req: Parameters<typeof update<T, M>>[1]
    ) => {
      const res = await update<T, M>(client, req);

      const tableNames = Array.isArray(req.tables) ? req.tables : [req.tables];
      const isUserUpdate =
        tableNames.some((table) => USER_TABLES.includes(table.toLowerCase())) &&
        typeof req.match === 'object' &&
        req.match !== null &&
        ('id' in req.match || 'user_uuid' in req.match);

      if (isUserUpdate) {
        const cacheKey = `user:${
          (req.match as Record<string, any>).id ??
          (req.match as Record<string, any>).user_uuid
        }`;
        await deleteCached(cacheKey);
      }

      return res;
    },

    remove: async <T extends Record<string, any>>(
      req: Parameters<typeof remove<T>>[1]
    ) => {
      const res = await remove<T>(client, req);

      const tableNames = Array.isArray(req.tables) ? req.tables : [req.tables];
      const isUserRemove =
        tableNames.some((table) => USER_TABLES.includes(table.toLowerCase())) &&
        typeof req.match === 'object' &&
        req.match !== null &&
        ('id' in req.match || 'user_uuid' in req.match);

      if (isUserRemove) {
        const cacheKey = `user:${
          (req.match as Record<string, any>).id ??
          (req.match as Record<string, any>).user_uuid
        }`;
        await deleteCached(cacheKey);
      }

      return res;
    },

    rpc: <T>(req: Parameters<typeof rpc<T>>[1]) => rpc<T>(client, req),

    client,
  };
};

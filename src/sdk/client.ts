import type { SupabaseClient } from '@supabase/supabase-js';
import { select, rpc, insert, update, remove } from './supabasefunc';
import { getCachedUser } from './caches';

export const withClient = (client: SupabaseClient) => {
  return {
    getUser: () => getCachedUser(client),

    select: async <T>(req: Parameters<typeof select<T>>[1]) => {
      const result = await select<T>(client, req);
      return result;
    },

    insert: <T>(req: Parameters<typeof insert<T>>[1]) => {
      return insert<T>(client, req);
    },

    update: async <T, M = Partial<T>>(
      req: Parameters<typeof update<T, M>>[1]
    ) => {
      const res = await update<T, M>(client, req);
      return res;
    },

    remove: async <T extends Record<string, any>>(
      req: Parameters<typeof remove<T>>[1]
    ) => {
      const res = await remove<T>(client, req);
      return res;
    },

    rpc: <T>(req: Parameters<typeof rpc<T>>[1]) => {
      return rpc<T>(client, req);
    },

    client,
  };
};
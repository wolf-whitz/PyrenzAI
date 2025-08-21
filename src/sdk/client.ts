import type { SupabaseClient } from '@supabase/supabase-js';
import { select, rpc, insert, update, remove } from './supabasefunc';
import { getCachedUser } from './caches';

export const withClient = (client: SupabaseClient) => {
  return {
    getUser: () => getCachedUser(client),

    select: async <T>(req: Parameters<typeof select<T>>[1]) => {
      return select<T>(client, req);
    },

    insert: <T>(req: Parameters<typeof insert>[1]) => {
      return insert<T>(client, req);
    },

    update: async <T>(
      req: Parameters<typeof update>[1]
    ) => {
      return update<T>(client, req);
    },

    remove: async <T extends Record<string, any>>(
      req: Parameters<typeof remove>[1]
    ) => {
      return remove<T>(client, req);
    },

    rpc: <T>(req: Parameters<typeof rpc>[1]) => {
      return rpc<T>(client, req);
    },

    upsertOrUpdate: async <T>(
      req: {
        tables: string;
        data: Partial<T>;
        match?: Partial<T>;
      }
    ) => {
      if (req.match && Object.keys(req.match).length > 0) {
        return update<T>(client, {
          tables: req.tables,
          values: req.data,
          match: req.match,
        });
      } else {
        return insert<T>(client, {
          tables: req.tables,
          data: req.data,
        });
      }
    },

    client,
  };
};

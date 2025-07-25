import type { SupabaseClient } from '@supabase/supabase-js';
import { getCached, setCached } from '../Cache/cacheWorkerManager';

const inflightRequests = new Map<string, Promise<any>>();

function makeCacheKey(req: any): string {
  return JSON.stringify(req);
}

export const rpc = async <T>(
  client: SupabaseClient,
  req: {
    func: string;
    params?: Record<string, any>;
  }
): Promise<T> => {
  const key = makeCacheKey(req);

  const cached = await getCached<T>(key);
  if (cached) return cached;

  if (inflightRequests.has(key)) {
    return inflightRequests.get(key) as Promise<T>;
  }

  const promise = (async () => {
    const { func, params = {} } = req;
    const { data, error } = await client.rpc(func, params);

    if (error) {
      inflightRequests.delete(key);
      throw error;
    }

    await setCached(key, data);
    inflightRequests.delete(key);
    return data as T;
  })();

  inflightRequests.set(key, promise);
  return promise;
};

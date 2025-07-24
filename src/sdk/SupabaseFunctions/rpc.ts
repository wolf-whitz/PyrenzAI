import type { SupabaseClient } from '@supabase/supabase-js';

export const rpc = async <T>(
  client: SupabaseClient,
  req: {
    func: string;
    params?: Record<string, any>;
  }
): Promise<T> => {
  const { func, params = {} } = req;
  const { data, error } = await client.rpc(func, params);
  if (error) throw error;
  return data as T;
};

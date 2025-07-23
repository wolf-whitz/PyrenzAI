import type { SupabaseClient } from '@supabase/supabase-js';

export const remove = async <T extends Record<string, any>>(
  client: SupabaseClient,
  table: string,
  match: { [K in keyof T]?: T[K] | T[K][] }
): Promise<T[]> => {
  let query = client.from(table).delete();
  Object.entries(match).forEach(([key, value]) => {
    query = Array.isArray(value) ? query.in(key, value) : query.eq(key, value);
  });
  const { data, error } = await query;
  if (error) throw error;
  return data as T[];
};

import type { SupabaseClient } from '@supabase/supabase-js';

export const update = async <T, M = Partial<T>>(
  client: SupabaseClient,
  table: string,
  values: Partial<T>,
  match: M
): Promise<T[]> => {
  const { data, error } = await client.from(table).update(values).match(match);
  if (error) throw error;
  return data as T[];
};

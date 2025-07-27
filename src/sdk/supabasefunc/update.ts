import type { SupabaseClient } from '@supabase/supabase-js';

export const update = async <T, M = Partial<T>>(
  client: SupabaseClient,
  req: {
    tables: string;
    values: Partial<T>;
    match: M;
  }
): Promise<T[]> => {
  const { tables, values, match } = req;
  const { data, error } = await client.from(tables).update(values).match(match);
  if (error) throw error;
  return data as T[];
};

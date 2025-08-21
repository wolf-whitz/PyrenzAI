import type { SupabaseClient } from '@supabase/supabase-js';

export const update = async <T = any>(
  client: SupabaseClient,
  req: {
    tables: string;
    values: Partial<T>;
    match: Partial<T>;
  }
): Promise<T[]> => {
  const { tables, values, match } = req;

  const { data, error } = await client
    .from(tables)
    .update(values)
    .match(match)
    .select(); // 👈 ensures data is returned just like insert

  if (error) throw error;
  return data as T[];
};

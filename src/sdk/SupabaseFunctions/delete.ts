import type { SupabaseClient } from '@supabase/supabase-js';

export const remove = async <T extends Record<string, any>>(
  client: SupabaseClient,
  req: {
    tables: string | string[];
    match: { [K in keyof T]?: T[K] | T[K][] };
  }
): Promise<T[]> => {
  const { tables, match } = req;
  const tabless = Array.isArray(tables) ? tables : [tables];
  let allDeleted: T[] = [];

  for (const tbl of tabless) {
    let query = client.from(tbl).delete();

    Object.entries(match).forEach(([key, value]) => {
      query = Array.isArray(value)
        ? query.in(key, value)
        : query.eq(key, value);
    });

    const { data, error } = await query;
    if (error) throw error;
    if (data) allDeleted = allDeleted.concat(data as T[]);
  }

  return allDeleted;
};

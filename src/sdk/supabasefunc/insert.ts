import type { SupabaseClient } from '@supabase/supabase-js';

export const insert = async <T = any>(
  client: SupabaseClient,
  req: {
    tables: string;
    data: Partial<T> | Partial<T>[]; 
    options?: { onConflict?: string[] };
  }
): Promise<T[]> => {
  const { tables, data, options } = req;

  const query = options?.onConflict
    ? client.from(tables).upsert(data, {
        onConflict: options.onConflict.join(', '),
      })
    : client.from(tables).insert(data);

  const { data: res, error } = await query.select();
  if (error) throw error;
  return res as T[];
};

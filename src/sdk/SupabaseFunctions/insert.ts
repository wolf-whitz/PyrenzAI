import type { SupabaseClient } from '@supabase/supabase-js'

export const insert = async <T>(
  client: SupabaseClient,
  table: string,
  data: T | T[],
  options?: { onConflict?: string[] }
): Promise<T[]> => {
  const query = options?.onConflict
    ? client.from(table).upsert(data, {
        onConflict: options.onConflict.join(', ')
      })
    : client.from(table).insert(data)

  const { data: res, error } = await query.select()
  if (error) throw error
  return res as T[]
}

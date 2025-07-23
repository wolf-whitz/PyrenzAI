import { SupabaseClient } from '@supabase/supabase-js';

export async function rpc<T>(
  client: SupabaseClient,
  func: string,
  params: Record<string, any> = {}
): Promise<T> {
  const { data, error } = await client.rpc(func, params);
  if (error) throw error;
  return data as T;
}

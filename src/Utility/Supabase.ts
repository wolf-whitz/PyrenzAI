import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '~/config';

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

class SupabaseUtil {
  public client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  insert = async <T>(table: string, data: T | T[]): Promise<T[]> => {
    const { data: result, error } = await this.client
      .from(table)
      .insert(data)
      .select();
    if (error) throw error;
    return result as T[];
  };

  update = async <T, M = Partial<T>>(
    table: string,
    values: Partial<T>,
    match: M
  ): Promise<T[]> => {
    const { data: result, error } = await this.client
      .from(table)
      .update(values)
      .match(match);
    if (error) throw error;
    return result as T[];
  };

  delete = async <T extends Record<string, any>>(
    table: string,
    match: { [K in keyof T]?: T[K] | T[K][] }
  ): Promise<T[]> => {
    let query = this.client.from(table).delete();

    (Object.entries(match) as [keyof T, T[keyof T] | T[keyof T][]][]).forEach(
      ([key, value]) => {
        if (Array.isArray(value)) {
          query = query.in(key as string, value);
        } else {
          query = query.eq(key as string, value);
        }
      }
    );

    const { data: result, error } = await query;
    if (error) throw error;
    return result as T[];
  };

  select = async <T>(
    table: string,
    columns: string = '*',
    countOption: 'exact' | 'planned' | 'estimated' | null = null,
    match: { [key: string]: any } = {},
    range?: { from: number; to: number },
    orderBy?: { column: string; ascending?: boolean }
  ): Promise<{ data: T[]; count: number | null }> => {
    let query = this.client.from(table).select(columns, {
      count: countOption ?? undefined,
      head: false,
    });

    Object.entries(match).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    if (orderBy?.column) {
      query = query.order(orderBy.column, {
        ascending: orderBy.ascending ?? true,
      });
    }

    if (range) {
      query = query.range(range.from, range.to);
    }

    const { data: result, error, count } = await query;

    if (error) throw error;
    return { data: result as T[], count };
  };

  rpc = async <T>(
    func: string,
    params: Record<string, any> = {}
  ): Promise<T> => {
    const { data: result, error } = await this.client
      .rpc(func, params)
      .single();
    if (error) throw error;
    return result as T;
  };

  selectFirstAvailable = async <T>(
    tables: string[],
    match: { [key: string]: any } = {},
    columns: string = '*',
    countOption: 'exact' | 'planned' | 'estimated' | null = null
  ): Promise<{ data: T | null; table: string | null }> => {
    const results = await Promise.allSettled(
      tables.map((table) =>
        this.select<T>(table, columns, countOption, match).then((res) => ({
          table,
          data: res.data,
        }))
      )
    );

    for (const result of results) {
      if (
        result.status === 'fulfilled' &&
        Array.isArray(result.value.data) &&
        result.value.data.length > 0
      ) {
        const cleaned = result.value.data.filter(
          (item) => item != null && item !== undefined
        );

        if (cleaned.length > 0) {
          return {
            data: cleaned[0],
            table: result.value.table,
          };
        }
      }
    }

    return { data: null, table: null };
  };
}

export const db = new SupabaseUtil(supabase);

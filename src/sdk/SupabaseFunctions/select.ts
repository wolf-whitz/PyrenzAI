import type { SupabaseClient } from '@supabase/supabase-js';
import type { ExtraFilter, Match, Range, OrderBy } from '@sdk/Types';

export async function select<T>(
  client: SupabaseClient,
  table: string,
  columns: string = '*',
  countOption: 'exact' | 'planned' | 'estimated' | null = null,
  match: Match = {},
  range?: Range,
  orderBy?: OrderBy,
  extraFilters?: ExtraFilter[],
  paging: boolean = false
): Promise<{ data: T[]; count: number | null; pages?: T[][] }> {
  let query = client.from(table).select(columns, {
    count: countOption ?? undefined,
  });

  for (const [key, value] of Object.entries(match)) {
    if (Array.isArray(value)) {
      query = query.in(key, value);
    } else if (typeof value === 'string' && value.includes('%')) {
      query = query.ilike(key, value);
    } else {
      query = query.eq(key, value);
    }
  }

  extraFilters?.forEach(({ column, operator, value }) => {
    const safeArray = Array.isArray(value) ? value : [value];

    if (operator === 'not_in' || operator === 'in' || operator === 'not_overlaps') {
      if (!safeArray.length) return;
    }

    switch (operator) {
      case 'in':
        query = query.in(column, safeArray);
        break;
      case 'not_in':
        query = query.not(column, 'in', `(${safeArray.join(',')})`);
        break;
      case 'not_overlaps':
        query = query.not(column, 'overlaps', safeArray);
        break;
      case 'eq':
        query = query.eq(column, value);
        break;
    }
  });

  if (orderBy?.column) {
    query = query.order(orderBy.column, {
      ascending: orderBy.ascending ?? true,
    });
  }

  if (range) {
    query = query.range(range.from, range.to);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  const finalData = (data ?? []) as T[];

  return {
    data: finalData,
    count: count ?? null,
    pages: paging
      ? Array.from({ length: Math.ceil(finalData.length / 10) }, (_, i) =>
          finalData.slice(i * 10, i * 10 + 10)
        )
      : undefined,
  };
}

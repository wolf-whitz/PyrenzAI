import type { SupabaseClient } from '@supabase/supabase-js';
import type { ExtraFilter, Match, Range, OrderBy } from '~/sdk/types';
import { getCached, setCached } from '~/sdk/cache';

const inflightSelects = new Map<string, Promise<any>>();

function makeCacheKey(req: any): string {
  return JSON.stringify(req);
}

export async function select<T>(
  client: SupabaseClient,
  req: {
    tables: string | string[];
    columns?: string;
    countOption?: 'exact' | 'planned' | 'estimated' | null;
    match?: Match;
    range?: Range;
    orderBy?: OrderBy;
    extraFilters?: ExtraFilter[];
    paging?: boolean;
    nocache?: boolean;
  }
): Promise<{ data: T[]; count: number | null; pages?: T[][] }> {
  const key = makeCacheKey(req);

  if (!req.nocache) {
    const cached = await getCached<{
      data: T[];
      count: number | null;
      pages?: T[][];
    }>(key);

    if (cached) return cached;
    if (inflightSelects.has(key)) return inflightSelects.get(key)!;
  }

  const promise = (async () => {
    const {
      tables,
      columns = '*',
      countOption = null,
      match = {},
      range,
      orderBy,
      extraFilters = [],
      paging = false,
    } = req;

    const tableList = Array.isArray(tables) ? tables : [tables];
    const allData: T[] = [];
    let totalCount: number | null = 0;

    const results = await Promise.all(
      tableList.map(async (table) => {
        let query = (client.from(table) as any).select(columns, {
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

        for (const { column, operator, value } of extraFilters) {
          const arrayValue = Array.isArray(value)
            ? value
            : typeof value === 'string'
              ? [value]
              : [];

          if (
            ['in', 'not_in', 'not_overlaps'].includes(operator) &&
            arrayValue.length === 0
          )
            continue;

          switch (operator) {
            case 'in':
              query = query.in(column, arrayValue);
              break;
            case 'not_in':
              query = query.not(column, 'in', arrayValue);
              break;
            case 'not_overlaps':
              query = query.not(column, 'overlaps', arrayValue);
              break;
            case 'eq':
              query = query.eq(column, Array.isArray(value) ? value[0] : value);
              break;
          }
        }

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
        return { data: data as T[] | null, count: count ?? 0 };
      })
    );

    for (const { data, count } of results) {
      if (data) allData.push(...data);
      totalCount = typeof totalCount === 'number' ? totalCount + count : count;
    }

    const pages = paging
      ? Array.from({ length: Math.ceil(allData.length / 10) }, (_, i) =>
          allData.slice(i * 10, i * 10 + 10)
        )
      : undefined;

    const response = {
      data: allData,
      count: totalCount,
      pages,
    };

    if (!req.nocache) {
      await setCached(key, response);
    }

    inflightSelects.delete(key);
    return response;
  })();

  inflightSelects.set(key, promise);
  return promise;
}

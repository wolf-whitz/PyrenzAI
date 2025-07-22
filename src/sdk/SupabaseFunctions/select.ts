import type { SupabaseClient } from '@supabase/supabase-js'
import type { ExtraFilter, Match, Range, OrderBy } from '@sdk/Types'

function parsePostgresArray(str: string): string[] {
  return str
    .slice(1, -1)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

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
  })

  for (const [key, value] of Object.entries(match)) {
    if (Array.isArray(value)) {
      query = query.in(key, value)
    } else if (typeof value === 'string' && value.includes('%')) {
      query = query.ilike(key, value)
    } else {
      query = query.eq(key, value)
    }
  }

  extraFilters?.forEach(({ column, operator, value }) => {
    let arrayValue: any[] = []

    if (Array.isArray(value)) {
      arrayValue = value
    } else if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
      arrayValue = parsePostgresArray(value)
    } else {
      arrayValue = [value]
    }

    if (['in', 'not_in', 'not_overlaps'].includes(operator) && arrayValue.length === 0) return

    switch (operator) {
      case 'in':
        query = query.in(column, arrayValue)
        break
      case 'not_in':
        query = query.not(column, 'in', arrayValue)
        break
      case 'not_overlaps':
        query = query.not(column, 'overlaps', arrayValue)
        break
      case 'eq':
        query = query.eq(column, Array.isArray(value) ? value[0] : value)
        break
    }
  })

  if (orderBy?.column) {
    query = query.order(orderBy.column, {
      ascending: orderBy.ascending ?? true,
    })
  }

  if (range) {
    query = query.range(range.from, range.to)
  }

  const { data, error, count } = await query

  if (error) throw error

  const finalData = (data ?? []) as T[]

  return {
    data: finalData,
    count: count ?? null,
    pages: paging
      ? Array.from({ length: Math.ceil(finalData.length / 10) }, (_, i) =>
          finalData.slice(i * 10, i * 10 + 10)
        )
      : undefined,
  }
}

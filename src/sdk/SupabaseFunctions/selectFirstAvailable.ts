import { SupabaseClient } from '@supabase/supabase-js'
import type { FilterOperator, ExtraFilter } from '@sdk/Types'
import { select } from './select'

export async function selectFirstAvailable<T>(
  client: SupabaseClient,
  tables: string[],
  match: Record<string, any> = {},
  columns = '*',
  countOption: 'exact' | 'planned' | 'estimated' | null = null,
  range?: { from: number; to: number },
  orderBy?: { column: string; ascending?: boolean },
  getExtraFilters?: (table: string) => ExtraFilter[]
): Promise<{ data: T | null; table: string | null }> {
  const results = await Promise.allSettled(
    tables.map(tbl =>
      select<T>(client, tbl, columns, countOption, match, range, orderBy, getExtraFilters?.(tbl)).then(res => ({
        table: tbl,
        data: res.data
      }))
    )
  )

  for (const res of results) {
    if (res.status === 'fulfilled' && res.value.data.length > 0) {
      const item = res.value.data.find(a => a != null)
      if (item) return { data: item, table: res.value.table }
    }
  }

  return { data: null, table: null }
}

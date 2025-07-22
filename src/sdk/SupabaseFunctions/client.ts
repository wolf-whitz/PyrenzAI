import type { SupabaseClient } from '@supabase/supabase-js'
import type { ExtraFilter, Match, OrderBy, Range } from '@sdk/Types'
import { select } from './select'
import { rpc } from './rpc'
import { insert } from './insert'
import { update } from './update'
import { remove } from './delete'

export const withClient = (client: SupabaseClient) => ({
  select: <T>(
    table: string,
    columns: string = '*',
    countOption: 'exact' | 'planned' | 'estimated' | null = null,
    match: Match = {},
    range?: Range,
    orderBy?: OrderBy,
    extraFilters?: ExtraFilter[],
    paging: boolean = false
  ) => select<T>(client, table, columns, countOption, match, range, orderBy, extraFilters, paging),

  insert: <T>(
    table: string,
    data: T | T[],
    options?: { onConflict?: string[] }
  ) => insert<T>(client, table, data, options),

  update: <T, M = Partial<T>>(
    table: string,
    values: Partial<T>,
    match: M
  ) => update<T, M>(client, table, values, match),

  delete: <T extends Record<string, any>>(
    table: string,
    match: Match<T>
  ) => remove<T>(client, table, match),

  rpc: <T>(
    func: string,
    params: Record<string, any> = {}
  ) => rpc<T>(client, func, params),
})

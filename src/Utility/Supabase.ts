import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '~/config'
import { SupabaseUtil } from '~/sdk/SupabaseUtils'

const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const db = new SupabaseUtil(client)

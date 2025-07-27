import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '~/config';
import { SupabaseUtil } from '@sdk/SupabaseUtils';

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!_client) {
    _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _client;
}

SupabaseUtil.init(getClient());

export const db = SupabaseUtil.instance.db;

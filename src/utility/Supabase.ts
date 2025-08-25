import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '~/config';
import { SupabaseUtil } from '~/sdk';

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  try {
    if (!_client) {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.error('Missing Supabase credentials:', {
          SUPABASE_URL,
          SUPABASE_ANON_KEY,
        });
      }

      _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log('Supabase client initialized');
    }
    return _client;
  } catch (err) {
    console.error('Error creating Supabase client:', err);
    throw err;
  }
}

try {
  SupabaseUtil.init(getClient());
  console.log('SupabaseUtil initialized successfully');
} catch (err) {
  console.error('Error initializing SupabaseUtil:', err);
}

export const db = SupabaseUtil.instance.db;

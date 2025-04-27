import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '~/config';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// export const getSupabaseClient = (request: Request, response: Response) =>
//   createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, { request, response });

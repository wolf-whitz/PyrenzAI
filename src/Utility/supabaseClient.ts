/**
 * Supabase client for interacting with the Supabase database.
 * This client is configured with the Supabase URL and anonymous key.
 * It is used to perform various database operations such as authentication, data retrieval, and data manipulation.
 * The client is created using the `createClient` function from the `@supabase/supabase-js` library.
 * @example
 * import { supabase } from '@utils';
 * supabase.from('table_name').select('*').then(({ data, error }) => {
 *   if (error) console.error('Error fetching data:', error);
 *  else console.log('Data:', data);
 * });
 */

import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '~/config';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

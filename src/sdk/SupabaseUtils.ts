/**
 * Property of the PyrenzAI project. Not recommended for use outside of the project.
 *
 * This file is still unstable and only built for pyrenzai system. Of course if you wish to use the client. or other functions this file provides.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { withClient } from './client';
import { checkCacheHealth } from './cache';
import { createFetcherClient } from './Fetcher'; 

let _instance: SupabaseUtil | null = null;

export class SupabaseUtil {
  public readonly db: ReturnType<typeof withClient>;
  public readonly fetcher = createFetcherClient();

  private constructor(client: SupabaseClient) {
    this.db = withClient(client);
    console.log('🧃 Supabase SDK: loaded v1');

    checkCacheHealth()
      .then((status) => {
        console.log(`🧠 Cache Loaded: ${status}`);
      })
      .catch(() => {
        console.warn('⚠️ Cache Worker failed health check.');
      });
  }

  static init(client: SupabaseClient): SupabaseUtil {
    if (_instance) {
      throw new Error(
        `❌ SupabaseUtil already initialized.\n` +
        `🛑 Only one instance allowed.\n` +
        `✅ Use 'SupabaseUtil.instance.db' or 'instance.fetcher' instead.\n`
      );
    }

    _instance = new SupabaseUtil(client);
    return _instance;
  }

  static get instance(): SupabaseUtil {
    if (!_instance) {
      throw new Error(
        `❌ SupabaseUtil not initialized.\n` +
        `⚠️ Call 'SupabaseUtil.init(client)' first.\n`
      );
    }

    return _instance;
  }
}

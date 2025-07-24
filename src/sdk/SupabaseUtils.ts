import type { SupabaseClient } from '@supabase/supabase-js';
import { withClient } from './client';

let _instance: SupabaseUtil | null = null;

export class SupabaseUtil {
  public readonly db: ReturnType<typeof withClient>;

  private constructor(client: SupabaseClient) {
    this.db = withClient(client);
    console.log('🧃 Supabase SDK: loaded v1');
  }

  static init(client: SupabaseClient): SupabaseUtil {
    if (_instance) {
      throw new Error(
        `❌ SupabaseUtil already initialized.\n` +
          `🛑 Only one instance allowed.\n` +
          `✅ Use 'SupabaseUtil.instance.db' instead.\n`
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

import type { SupabaseClient } from '@supabase/supabase-js';
import { withClient } from './client';
import {
  checkCacheHealth,
  getCached,
  setCached,
  deleteCached,
} from '~/sdk/caches';
import { createFetcherClient } from './Fetcher';
import { consolePanel } from './ConsolePanel';

let _instance: SupabaseUtil | null = null;
const QUEUE_KEY = '__offline_queue__';

type QueuedRequest = {
  id: string;
  url: string;
  method: string;
  payload?: any;
};

export class SupabaseUtil {
  public readonly db: ReturnType<typeof withClient>;
  public readonly fetcher = createFetcherClient();

  private constructor(client: SupabaseClient) {
    this.db = withClient(client);

    consolePanel.panel('🧃 Supabase SDK', ['SDK Loaded v1']);

    checkCacheHealth()
      .then((status) => {
        consolePanel.panel('🧠 Cache', [`Cache Loaded: ${status}`]);
      })
      .catch(() => {
        consolePanel.panel('⚠️ Cache', ['Cache Worker failed health check.']);
      });

    this.#initNetworkListener();
    this.#flushQueue();
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

  async queueOrFetch<T>(
    url: string,
    method: string,
    payload?: any
  ): Promise<T> {
    if (!navigator.onLine) {
      const queued: QueuedRequest[] = (await getCached(QUEUE_KEY)) || [];
      const id = crypto.randomUUID();
      const newEntry: QueuedRequest = { id, url, method, payload };
      await setCached(QUEUE_KEY, [...queued, newEntry]);
      consolePanel.panel('📴 Offline Mode', [`Queued request: ${url}`]);
      return Promise.resolve({} as T);
    }
    return this.fetcher[method](url, payload);
  }

  async #flushQueue() {
    const queued: QueuedRequest[] = (await getCached(QUEUE_KEY)) || [];
    if (!queued.length) return;

    const msgs: string[] = [];
    msgs.push(`Flushing ${queued.length} queued requests...`);

    const successful: string[] = [];
    for (const req of queued) {
      try {
        await this.fetcher[req.method](req.url, req.payload);
        successful.push(req.id);
        msgs.push(`✅ Replayed: ${req.url}`);
      } catch {
        msgs.push(`❌ Failed: ${req.url}`);
      }
    }

    const remaining = queued.filter((q) => !successful.includes(q.id));
    if (remaining.length) {
      await setCached(QUEUE_KEY, remaining);
      msgs.push(`⚠️ ${remaining.length} requests remain in queue`);
    } else {
      await deleteCached(QUEUE_KEY);
      msgs.push('🎉 Queue cleared');
    }

    consolePanel.panel('📡 Queue Flush', msgs);
  }

  #initNetworkListener() {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      consolePanel.panel('🔌 Network', [
        'Connection restored, flushing queue...',
      ]);
      this.#flushQueue();
    });

    window.addEventListener('offline', () => {
      consolePanel.panel('⚡️ Network', [
        'Connection lost, queueing mode active',
      ]);
    });
  }
}

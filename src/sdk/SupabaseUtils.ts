/**
 * Property of the PyrenzAI project. Not recommended for use outside of the project.
 *
 * This file is still unstable and only built for pyrenzai system. Of course if you wish to use the client. or other functions this file provides.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { withClient } from './client';
import { checkCacheHealth, getCached, setCached, deleteCached } from '~/sdk/caches';
import { createFetcherClient } from './Fetcher';

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
    console.log('🧃 Supabase SDK: loaded v1');

    checkCacheHealth()
      .then((status) => {
        console.log(`🧠 Cache Loaded: ${status}`);
      })
      .catch(() => {
        console.warn('⚠️ Cache Worker failed health check.');
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

  async queueOrFetch<T>(url: string, method: string, payload?: any): Promise<T> {
    if (!navigator.onLine) {
      const queued: QueuedRequest[] = (await getCached(QUEUE_KEY)) || [];
      const id = crypto.randomUUID();
      const newEntry: QueuedRequest = { id, url, method, payload };
      await setCached(QUEUE_KEY, [...queued, newEntry]);
      console.warn(`[📴 offline] Request queued: ${url}`);
      return Promise.resolve({} as T);  
    }

    return this.fetcher[method](url, payload);
  }

  async #flushQueue() {
    const queued: QueuedRequest[] = (await getCached(QUEUE_KEY)) || [];
    if (!queued.length) return;

    console.log(`[📡 online] Flushing ${queued.length} queued requests`);

    const successful: string[] = [];

    for (const req of queued) {
      try {
        await this.fetcher[req.method](req.url, req.payload);
        successful.push(req.id);
      } catch (err) {
        console.warn(`❌ Failed to replay request: ${req.url}`, err);
      }
    }

    const remaining = queued.filter((q) => !successful.includes(q.id));
    if (remaining.length) {
      await setCached(QUEUE_KEY, remaining);
    } else {
      await deleteCached(QUEUE_KEY);
    }
  }

  #initNetworkListener() {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      console.log('[🔌 online] Connection restored, flushing queue');
      this.#flushQueue();
    });

    window.addEventListener('offline', () => {
      console.log('[⚡️ offline] Connection lost, queueing mode active');
    });
  }
}

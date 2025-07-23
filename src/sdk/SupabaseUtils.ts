/**
 * A simple supabase sdk that provides a set of utility functions
 * for interacting with a Supabase client.
 *
 * @module SupabaseUtil
 *
 * This module exports the `SupabaseUtil` class, which wraps a Supabase client
 * and provides methods for common database operations such as select, insert,
 * update, delete, and remote procedure calls (RPCs). It also includes a method
 * to select the first available record from a table. and many more.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { withClient } from './SupabaseFunctions/client';

export class SupabaseUtil {
  client: SupabaseClient;

  select: ReturnType<typeof withClient>['select'];
  insert: ReturnType<typeof withClient>['insert'];
  update: ReturnType<typeof withClient>['update'];
  delete: ReturnType<typeof withClient>['delete'];
  rpc: ReturnType<typeof withClient>['rpc'];

  constructor(client: SupabaseClient) {
    this.client = client;
    const fns = withClient(client);

    this.select = fns.select;
    this.insert = fns.insert;
    this.update = fns.update;
    this.delete = fns.delete;
    this.rpc = fns.rpc;
  }
}

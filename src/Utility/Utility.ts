import { SupabaseUtil } from '~/sdk/SupabaseUtils';
import { db } from './Supabase';

const FetcherClient = SupabaseUtil.instance.fetcher;

export const Utils = {
  request: FetcherClient.request,
  useFetch: FetcherClient.useFetch,
  post: FetcherClient.post,
  patch: FetcherClient.patch,
  delete: FetcherClient.delete,
  db,
};

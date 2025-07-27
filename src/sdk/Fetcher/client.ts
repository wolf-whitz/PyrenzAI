import { request, SSEOptions } from './request';
import useSWR from 'swr';
import { useUserStore } from '~/store';
import { SERVER_API_URL_1, SERVER_API_URL_2 } from '~/config';

export function useFetch<T>(endpoint: string, params: Record<string, any> = {}) {
  const { userUUID, purchase_id } = useUserStore.getState();
  const BASE = purchase_id && userUUID ? SERVER_API_URL_1 : SERVER_API_URL_2;
  const url = new URL(`${BASE}${endpoint}`);
  if (Object.keys(params).length) {
    url.search = new URLSearchParams(params as any).toString();
  }
  const { data, error } = useSWR<T>(url.toString(), url =>
    fetch(url).then(res => res.json().then(j => j.data ?? j))
  );
  return { data, error };
}

export function createFetcherClient() {
  return {
    request,
    useFetch,
    post: <T>(endpoint: string, data: any = {}, params: any = {}, options?: SSEOptions) =>
      request<T>('POST', endpoint, data, params, false, options),
    patch: <T>(endpoint: string, data: any = {}, params: any = {}, options?: SSEOptions) =>
      request<T>('PATCH', endpoint, data, params, false, options),
    delete: <T>(endpoint: string, params: any = {}, options?: SSEOptions) =>
      request<T>('DELETE', endpoint, {}, params, false, options),
  };
}

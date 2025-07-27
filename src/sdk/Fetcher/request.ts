import { useUserStore } from '~/store';
import { SERVER_API_URL_1, SERVER_API_URL_2 } from '~/config';
import { handleSSE } from './handler';

type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export interface SSEOptions {
  isSSE?: boolean;
  onMessage?: (data: string) => void;
  onDone?: () => void;
  onError?: (err: any) => void;
}

export async function request<T>(
  method: RequestMethod,
  endpoint: string,
  data: Record<string, any> = {},
  params: Record<string, any> = {},
  isImage = false,
  options?: SSEOptions
): Promise<T> {
  const { userUUID, purchase_id } = useUserStore.getState();
  const BASE = purchase_id && userUUID ? SERVER_API_URL_1 : SERVER_API_URL_2;
  const url = new URL(`${BASE}${endpoint}`);

  if ((method === 'GET' || method === 'DELETE') && Object.keys(params).length) {
    url.search = new URLSearchParams(params as any).toString();
  }

  if (options?.isSSE) {
    const headers: HeadersInit = {};
    if (userUUID && purchase_id) {
      headers.user_uuid = userUUID;
      headers.purchase_id = purchase_id;
    }

    await handleSSE<T>(url.toString(), method, data, headers, options);
    return null as unknown as T;
  }

  const headers: HeadersInit = {
    Accept: isImage ? 'image/png' : 'application/json',
  };

  if (userUUID && purchase_id) {
    headers.user_uuid = userUUID;
    headers.purchase_id = purchase_id;
  }

  if (!(data instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url.toString(), {
    method,
    headers,
    body:
      method !== 'GET' && Object.keys(data).length
        ? data instanceof FormData
          ? data
          : JSON.stringify(data)
        : undefined,
  });

  const contentType = res.headers.get('Content-Type') ?? '';

  if (contentType.includes('application/json')) {
    const json = await res.json();
    const inner = json?.data;
    return (inner?.data ?? inner ?? json) as T;
  }

  if (contentType.includes('image/png')) {
    return (await res.blob()) as any;
  }

  return (await res.text()) as any;
}

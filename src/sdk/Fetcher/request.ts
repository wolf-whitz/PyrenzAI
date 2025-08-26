import { getCached, setCached } from '~/sdk/caches';
import { useUserStore } from '~/store';
import { SERVER_API_URL_1, SERVER_API_URL_2 } from '~/config';
import { handleSSE } from './handler';

type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export interface SSEOptions {
  isSSE?: boolean;
  onMessage?: (data: string) => void;
  onDone?: () => void;
  onError?: (err: any) => void;
  cache?: boolean;
}

const inFlightRequests = new Map<string, Promise<any>>();

function makeCacheKey(
  method: RequestMethod,
  url: URL,
  data: Record<string, any>
): string {
  const payloadKey =
    method === 'GET' || method === 'DELETE' ? '' : JSON.stringify(data);
  return `${method}:${url.toString()}:${payloadKey}`;
}

export async function request<T>(
  method: RequestMethod,
  endpoint: string,
  data: Record<string, any> = {},
  params: Record<string, any> = {},
  isImage = false,
  options: SSEOptions = {}
): Promise<T> {
  const { userUUID, purchase_id, token } = useUserStore.getState();
  const BASE = purchase_id && userUUID ? SERVER_API_URL_1 : SERVER_API_URL_2;
  const url = new URL(`${BASE}${endpoint}`);

  if ((method === 'GET' || method === 'DELETE') && Object.keys(params).length) {
    url.search = new URLSearchParams(params as any).toString();
  }

  const useCache = options?.cache === true;
  const cacheKey = makeCacheKey(method, url, data);

  if (useCache) {
    if (inFlightRequests.has(cacheKey)) {
      return inFlightRequests.get(cacheKey)!;
    }
    const cached = await getCached<T>(cacheKey);
    if (cached !== null && cached !== undefined) {
      return cached;
    }
  }

  const requestPromise = (async (): Promise<T> => {
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

    if (options?.isSSE) {
      const headers: HeadersInit = { ...authHeader };
      if (userUUID && purchase_id) {
        headers.user_uuid = userUUID;
        headers.purchase_id = purchase_id;
      }
      await handleSSE<T>(url.toString(), method, data, headers, options);
      return null as unknown as T;
    }

    const headers: HeadersInit = {
      Accept: isImage ? 'image/png' : 'application/json',
      ...authHeader,
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
    let result: T;

    if (contentType.includes('application/json')) {
      const json = await res.json();
      const inner = json?.data;
      result = (inner?.data ?? inner ?? json) as T;
    } else if (contentType.includes('image/png')) {
      result = (await res.blob()) as any;
    } else {
      result = (await res.text()) as any;
    }

    if (useCache) {
      setCached(cacheKey, result);
    }

    return result;
  })();

  if (useCache) {
    inFlightRequests.set(cacheKey, requestPromise);
    requestPromise.finally(() => inFlightRequests.delete(cacheKey));
  }

  return requestPromise;
}

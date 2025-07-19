import { db } from '~/Utility';
import useSWR from 'swr';
import { SERVER_API_URL_1, SERVER_API_URL_2 } from '~/config';
import { useUserStore } from '~/store';

type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';
export const AuthTokenName = 'sb-cqtbishpefnfvaxheyqu-auth-token';

const pendingRequests = new Map<string, Promise<any>>();

const fetcher = async (url: string) => {
  const userState = useUserStore.getState();
  const { userUUID, purchase_id } = userState;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (purchase_id && userUUID) {
    headers.user_uuid = userUUID;
    headers.purchase_id = purchase_id;
  }

  const response = await fetch(url, { headers });
  const contentType = response.headers.get('Content-Type') ?? '';
  let responseData: any = null;

  try {
    if (contentType.includes('application/json')) {
      const json = await response.json();
      responseData = json?.data ?? json;
    } else {
      responseData = await response.text();
    }
  } catch {
    responseData = null;
  }

  return responseData;
};

async function request<T>(
  method: RequestMethod,
  endpoint: string,
  data: Record<string, any> = {},
  params: Record<string, any> = {},
  isImageRequest = false
): Promise<T> {
  const rawPlan = useUserStore.getState().subscription_plan;
  const subscriptionPlan = Array.isArray(rawPlan) ? rawPlan[0] : rawPlan;
  const BASE_URL = ['Melon', 'Durian', 'Pineapple'].includes(subscriptionPlan)
    ? SERVER_API_URL_1
    : SERVER_API_URL_2;

  const url = new URL(`${BASE_URL}${endpoint}`);

  if ((method === 'GET' || method === 'DELETE') && Object.keys(params).length) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    url.search = searchParams.toString();
  }

  const cacheKey = url.toString();
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey) as Promise<T>;
  }

  const fetchPromise = (async (): Promise<T> => {
    const userState = useUserStore.getState();
    const { userUUID, purchase_id } = userState;

    const headers: HeadersInit = {
      Accept: isImageRequest ? 'image/png' : 'application/json',
    };

    if (purchase_id && userUUID) {
      headers.user_uuid = userUUID;
      headers.purchase_id = purchase_id;
    }

    if (!(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const options: RequestInit = {
      method,
      headers,
    };

    if (method !== 'GET' && Object.keys(data).length) {
      options.body = data instanceof FormData ? data : JSON.stringify(data);
    }

    const response = await fetch(url.toString(), options);
    const contentType = response.headers.get('Content-Type') ?? '';
    let responseData: any = null;

    try {
      if (contentType.includes('application/json')) {
        const json = await response.json();
        responseData = json?.data ?? json;
      } else if (contentType.includes('image/png')) {
        return (await response.blob()) as T;
      } else {
        responseData = await response.text();
      }
    } catch {
      responseData = null;
    }

    return responseData;
  })();

  pendingRequests.set(cacheKey, fetchPromise);

  try {
    return await fetchPromise;
  } finally {
    pendingRequests.delete(cacheKey);
  }
}

function useFetch<T>(endpoint: string, params: Record<string, any> = {}) {
  const rawPlan = useUserStore.getState().subscription_plan;
  const subscriptionPlan = Array.isArray(rawPlan) ? rawPlan[0] : rawPlan;
  const BASE_URL = ['Melon', 'Durian', 'Pineapple'].includes(subscriptionPlan)
    ? SERVER_API_URL_1
    : SERVER_API_URL_2;
  const url = new URL(`${BASE_URL}${endpoint}`);

  if (Object.keys(params).length) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    url.search = searchParams.toString();
  }

  const { data, error } = useSWR<T>(url.toString(), fetcher);
  return { data, error };
}

export const Utils = {
  request,
  useFetch,

  post: <T>(
    endpoint: string,
    data: Record<string, any> = {},
    params: Record<string, any> = {}
  ) => request<T>('POST', endpoint, data, params),

  patch: <T>(
    endpoint: string,
    data: Record<string, any> = {},
    params: Record<string, any> = {}
  ) => request<T>('PATCH', endpoint, data, params),

  delete: <T>(endpoint: string, params: Record<string, any> = {}) =>
    request<T>('DELETE', endpoint, {}, params),

  db,
};

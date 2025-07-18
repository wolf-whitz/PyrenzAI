import { supabase } from '~/Utility';
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
    'user_uuid': userUUID || '',
    'purchase_id': purchase_id || ''
  };

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error('An error occurred while fetching the data.');
  }
  return response.json();
};

interface UtilsType {
  request<T>(
    method: RequestMethod,
    endpoint: string,
    data?: Record<string, any> | FormData,
    params?: Record<string, any>,
    isImageRequest?: boolean
  ): Promise<T>;
  useFetch<T>(
    endpoint: string,
    params?: Record<string, any>
  ): { data: T | undefined; error: Error | undefined };
  post<T>(
    endpoint: string,
    data?: Record<string, any>,
    params?: Record<string, any>
  ): Promise<T>;
  patch<T>(
    endpoint: string,
    data?: Record<string, any>,
    params?: Record<string, any>
  ): Promise<T>;
  delete<T>(endpoint: string, params?: Record<string, any>): Promise<T>;
}

export const Utils: UtilsType = {
  async request<T>(
    method,
    endpoint,
    data = {},
    params = {},
    isImageRequest = false
  ): Promise<T> {
    const rawPlan = useUserStore.getState().subscription_plan;
    const subscriptionPlan = Array.isArray(rawPlan) ? rawPlan[0] : rawPlan;
    const BASE_URL = ['Melon', 'Durian', 'Pineapple'].includes(subscriptionPlan)
      ? SERVER_API_URL_1
      : SERVER_API_URL_2;
    const url = new URL(`${BASE_URL}${endpoint}`);

    if (
      (method === 'GET' || method === 'DELETE') &&
      Object.keys(params).length
    ) {
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
      let session = null;
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (!error) {
        session = sessionData.session;
      }

      const userState = useUserStore.getState();
      const { userUUID, purchase_id } = userState;

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        Accept: isImageRequest ? 'image/png' : 'application/json',
        'user_uuid': userUUID || '',
        'purchase_id': purchase_id || ''
      };

      if (session) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      const options: RequestInit = {
        method,
        headers,
      };

      if (method !== 'GET' && Object.keys(data).length) {
        options.body = data instanceof FormData ? data : JSON.stringify(data);
        if (data instanceof FormData) {
          delete headers['Content-Type'];
        }
      }

      const response = await fetch(url.toString(), options);
      const contentType = response.headers.get('Content-Type');
      let parsedResponse: any = null;

      if (contentType?.includes('application/json')) {
        parsedResponse = await response.json();
      } else if (contentType?.includes('text/plain')) {
        parsedResponse = await response.text();
      } else if (contentType?.includes('image/png')) {
        return (await response.blob()) as T;
      }

      return parsedResponse as T;
    })();

    pendingRequests.set(cacheKey, fetchPromise);

    try {
      return await fetchPromise;
    } finally {
      pendingRequests.delete(cacheKey);
    }
  },

  useFetch<T>(endpoint, params = {}) {
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
  },

  post<T>(endpoint, data = {}, params = {}) {
    return Utils.request<T>('POST', endpoint, data, params, false);
  },

  patch<T>(endpoint, data = {}, params = {}) {
    return Utils.request<T>('PATCH', endpoint, data, params, false);
  },

  delete<T>(endpoint, params = {}) {
    return Utils.request<T>('DELETE', endpoint, {}, params, false);
  },
};

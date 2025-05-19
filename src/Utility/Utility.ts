/**
 * Utility functions for making API requests and handling responses without the need of a dedicated fetch function.
 * This module provides a generic request function that can handle different HTTP methods and data formats.
 * It also includes a custom hook for data fetching using SWR (stale-while-revalidate) for caching and revalidation.
 * @example
 * import { Utils } from '~/Utility/Utility';
 * Utils.request('GET', '/api/endpoint', { param1: 'value1' })
 *   .then(response => console.log(response))
 *  .catch(error => console.error(error));
 */

/**
 * For ease in development future dev can use this utility to make API calls without the need of a dedicated fetch function and having to paste the same baseurl for every request.
 */

import { supabase } from '~/Utility/supabaseClient';
import useSWR from 'swr';
import { SERVER_API_URL as BASE_URL } from '~/config';

type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export const AuthTokenName = 'sb-cqtbishpefnfvaxheyqu-auth-token';

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
};

const pendingRequests = new Map<string, Promise<any>>();

const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.');
    throw error;
  }

  return response.json();
};

export const Utils = {
  async request<T>(
    method: RequestMethod,
    endpoint: string,
    data: Record<string, any> | FormData = {},
    params: Record<string, any> = {},
    isImageRequest: boolean = false
  ): Promise<T> {
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

      if (error) {
        console.warn('Error fetching Supabase session:', error);
      } else {
        session = sessionData.session;
      }

      const captchaCookie = getCookie('captcha-cookie');

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        Accept: isImageRequest ? 'image/png' : 'application/json',
      };

      if (session) headers.Authorization = `Bearer ${session.access_token}`;
      if (captchaCookie) headers['captcha_key'] = captchaCookie;

      const options: RequestInit = {
        method,
        headers,
      };

      if (method !== 'GET' && Object.keys(data).length) {
        options.body = data instanceof FormData ? data : JSON.stringify(data);
      }

      const response = await fetch(url.toString(), options);

      if (!response.ok) {
        let errorMessage = `${response.status} ${response.statusText}`;
        const contentType = response.headers.get('Content-Type');

        if (contentType?.includes('application/json')) {
          const errorData = await response.json();
          errorMessage += ` - ${errorData.message || JSON.stringify(errorData)}`;
        } else {
          const rawError = await response.text();
          if (rawError) errorMessage += ` - ${rawError}`;
        }

        throw new Error(errorMessage);
      }

      if (response.status === 204) return {} as T;

      const contentType = response.headers.get('Content-Type');
      if (contentType?.includes('image/png')) {
        return (await response.blob()) as T;
      }

      return await response.json();
    })();

    pendingRequests.set(cacheKey, fetchPromise);

    try {
      return await fetchPromise;
    } finally {
      pendingRequests.delete(cacheKey);
    }
  },

  useFetch<T>(
    endpoint: string,
    params: Record<string, any> = {}
  ): { data: T | undefined; error: Error | undefined } {
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

  post<T>(
    endpoint: string,
    data: Record<string, any> = {},
    params: Record<string, any> = {}
  ): Promise<T> {
    return this.request<T>('POST', endpoint, data, params, false);
  },

  patch<T>(
    endpoint: string,
    data: Record<string, any> = {},
    params: Record<string, any> = {}
  ): Promise<T> {
    return this.request<T>('PATCH', endpoint, data, params, false);
  },

  delete<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    return this.request<T>('DELETE', endpoint, {}, params, false);
  },
};

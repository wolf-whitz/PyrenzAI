const worker = new Worker('/worker/cacheWorker.js');

const listeners = new Map<string, (data: any) => void>();

worker.onmessage = (e: MessageEvent) => {
  const { type, key, data, status } = e.data || {};

  if (type === '__health_check__') {
    const listener = listeners.get('__health_check__');
    if (listener) {
      listener(status);
      listeners.delete('__health_check__');
    }
    return;
  }

  const listener = listeners.get(key);
  if (!listener) return;

  if (type === 'hit') {
    listener(data);
  } else if (type === 'miss') {
    listener(null);
  }

  listeners.delete(key);
};

export function getCached<T = any>(key: string): Promise<T | null> {
  return new Promise((resolve) => {
    listeners.set(key, resolve);
    worker.postMessage({ type: 'get', key });
  });
}

export function setCached<T = any>(key: string, value: T): void {
  worker.postMessage({ type: 'set', key, value });
}

export function deleteCached(key: string): void {
  worker.postMessage({ type: 'delete', key });
}

export function checkCacheHealth(): Promise<string> {
  return new Promise((resolve) => {
    listeners.set('__health_check__', resolve);
    worker.postMessage({ type: '__health_check__' });
  });
}

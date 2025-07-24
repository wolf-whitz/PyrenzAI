const worker = new Worker(new URL('./cacheWorker.ts', import.meta.url), {
  type: 'module',
});

const listeners = new Map<string, (data: any) => void>();

worker.onmessage = (e) => {
  const { type, key, data } = e.data;
  if (listeners.has(key)) {
    listeners.get(key)!(type === 'hit' ? data : null);
    listeners.delete(key);
  }
};

export function getCached<T>(key: string): Promise<T | null> {
  return new Promise((resolve) => {
    listeners.set(key, resolve);
    worker.postMessage({ type: 'get', key });
  });
}

export function setCached<T>(key: string, value: T) {
  worker.postMessage({ type: 'set', key, value });
}

export function deleteCached(key: string) {
  worker.postMessage({ type: 'delete', key });
}

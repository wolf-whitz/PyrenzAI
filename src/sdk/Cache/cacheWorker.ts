// cacheWorker.ts (Web Worker)

const CACHE_DB = 'SupabaseCacheDB';
const CACHE_STORE = 'cacheStore';
const TTL_MS = 3 * 60 * 1000; // 3 minutes

let db: IDBDatabase | null = null;
const memCache = new Map<string, { data: any; timestamp: number }>();

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);

    const request = indexedDB.open(CACHE_DB, 1);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      db.createObjectStore(CACHE_STORE);
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

function getFromDB(key: string): Promise<any> {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(CACHE_STORE, 'readonly');
      const store = tx.objectStore(CACHE_STORE);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => reject(req.error);
    });
  });
}

function setToDB(key: string, value: any) {
  return openDB().then((db) => {
    const tx = db.transaction(CACHE_STORE, 'readwrite');
    const store = tx.objectStore(CACHE_STORE);
    store.put(value, key);
  });
}

function removeFromDB(key: string) {
  return openDB().then((db) => {
    const tx = db.transaction(CACHE_STORE, 'readwrite');
    const store = tx.objectStore(CACHE_STORE);
    store.delete(key);
  });
}

self.onmessage = async (e) => {
  const { type, key, value } = e.data;

  switch (type) {
    case 'get':
      if (memCache.has(key)) {
        const entry = memCache.get(key)!;
        if (Date.now() - entry.timestamp < TTL_MS) {
          postMessage({ type: 'hit', key, data: entry.data });
          return;
        } else {
          memCache.delete(key);
        }
      }

      const dbResult = await getFromDB(key);
      if (dbResult && Date.now() - dbResult.timestamp < TTL_MS) {
        memCache.set(key, dbResult);
        postMessage({ type: 'hit', key, data: dbResult.data });
      } else {
        postMessage({ type: 'miss', key });
      }
      break;

    case 'set':
      const cacheEntry = { data: value, timestamp: Date.now() };
      memCache.set(key, cacheEntry);
      await setToDB(key, cacheEntry);
      break;

    case 'delete':
      memCache.delete(key);
      await removeFromDB(key);
      break;
  }
};

importScripts('https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js');

const TTL_MS = 3 * 60 * 1000;
const memCache = new Map();

localforage.config({
  name: 'SupabaseCache',
  storeName: 'cacheStore',
});

function isValid(timestamp) {
  return Date.now() - timestamp < TTL_MS;
}

async function getFromCache(key) {
  const mem = memCache.get(key);
  if (mem && isValid(mem.timestamp)) {
    return { hit: true, data: mem.data };
  }

  memCache.delete(key);

  try {
    const entry = await localforage.getItem(key);
    if (entry && isValid(entry.timestamp)) {
      memCache.set(key, entry);
      return { hit: true, data: entry.data };
    }
  } catch (err) {
    console.error('Cache read error:', err);
  }

  return { hit: false };
}

async function setToCache(key, value) {
  const entry = { data: value, timestamp: Date.now() };
  memCache.set(key, entry);
  try {
    await localforage.setItem(key, entry);
  } catch (err) {
    console.error('Cache write error:', err);
  }
}

async function removeFromCache(key) {
  memCache.delete(key);
  try {
    await localforage.removeItem(key);
  } catch (err) {
    console.error('Cache remove error:', err);
  }
}

self.onmessage = async function (e) {
  const { type, key, value } = e.data;

  switch (type) {
    case 'get': {
      const { hit, data } = await getFromCache(key);
      self.postMessage(hit ? { type: 'hit', key, data } : { type: 'miss', key });
      break;
    }
    case 'set': {
      await setToCache(key, value);
      break;
    }
    case 'delete': {
      await removeFromCache(key);
      break;
    }
    case '__health_check__': {
      self.postMessage({ type: '__health_check__', status: 'ok' });
      break;
    }
  }
};

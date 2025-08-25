const TTL_MS = 3 * 60 * 1000;
const memCache = new Map();

function isValid(timestamp) {
  return Date.now() - timestamp < TTL_MS;
}

function getFromCache(key) {
  const mem = memCache.get(key);
  if (mem && isValid(mem.timestamp)) {
    return { hit: true, data: mem.data };
  }
  memCache.delete(key);
  return { hit: false };
}

function setToCache(key, value) {
  const entry = { data: value, timestamp: Date.now() };
  memCache.set(key, entry);
}

function removeFromCache(key) {
  memCache.delete(key);
}

self.onmessage = async function (e) {
  const { type, key, value } = e.data;

  switch (type) {
    case 'get': {
      const { hit, data } = getFromCache(key);
      self.postMessage(hit ? { type: 'hit', key, data } : { type: 'miss', key });
      break;
    }
    case 'set': {
      setToCache(key, value);
      break;
    }
    case 'delete': {
      removeFromCache(key);
      break;
    }
    case '__health_check__': {
      self.postMessage({ type: '__health_check__', status: 'ok' });
      break;
    }
  }
};

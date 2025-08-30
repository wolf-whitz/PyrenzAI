const DB_NAME = 'pyrenzai-themes';
const DB_STORE = 'themes';
let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return dbPromise;
}

async function saveTheme(theme) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readwrite');
    const store = tx.objectStore(DB_STORE);
    const request = store.put(theme);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

async function getAllThemes() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readonly');
    const store = tx.objectStore(DB_STORE);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function checkTheme(folder, registration) {
  if (!folder) throw new Error('No folder provided to checkTheme');
  if (!registration) throw new Error('No registration.json provided');

  const { id, name, description, creator } = registration;
  if (!id || !name) throw new Error('Invalid theme: missing id or name');

  const themeData = {
    id,
    name,
    description: description || '',
    creator: creator || 'Unknown',
    folder,
    is_selected_theme: false,
  };
  await saveTheme(themeData);
  return { valid: true, registration: themeData };
}

self.addEventListener('message', async (event) => {
  const { type, folder, registration } = event.data;
  try {
    if (type === 'check-theme') {
      const result = await checkTheme(folder, registration);
      self.postMessage({ type: 'theme-checked', ...result });
    } else if (type === 'list-themes') {
      const allThemes = await getAllThemes();
      self.postMessage({ type: 'themes-list', allThemes });
    }
  } catch (err) {
    self.postMessage({ type: 'error', error: err.message });
  }
});

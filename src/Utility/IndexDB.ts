type DBOperation = 'readonly' | 'readwrite';

const DB_NAME = 'ImageDatabase';
const DB_VERSION = 1;

export const openDB = (version = DB_VERSION): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, version);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('images')) {
        db.createObjectStore('images');
      }
    };
  });
};

const performDBOperation = async <T>(
  storeName: string,
  mode: DBOperation,
  callback: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const request = callback(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveImageToDB = async (imageBlob: Blob): Promise<void> => {
  await performDBOperation('images', 'readwrite', (store) => {
    return store.put(imageBlob, 'bgImage');
  });
};

export const getImageFromDB = async (): Promise<Blob | null> => {
  return performDBOperation<Blob | undefined>('images', 'readonly', (store) => {
    return store.get('bgImage');
  })
    .then((result) => result ?? null)
    .catch(() => null);
};

export const insertData = async <T>(
  storeName: string,
  data: T,
  key: IDBValidKey
): Promise<void> => {
  await performDBOperation(storeName, 'readwrite', (store) => {
    return store.put(data, key);
  });
};

export const createTable = async (
  tableName: string,
  keyPath: string | string[] = 'id'
): Promise<void> => {
  const oldDB = await openDB();
  const newVersion = oldDB.version + 1;
  oldDB.close();

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, newVersion);

    request.onerror = () => reject(request.error);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(tableName)) {
        db.createObjectStore(tableName, { keyPath });
      }
    };
    request.onsuccess = () => resolve();
  });
};

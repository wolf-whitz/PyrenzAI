/** 
 * Type alias for allowed database transaction modes.
 * 'readonly' - for reading data.
 * 'readwrite' - for inserting/updating/deleting data.
 */
type DBOperation = 'readonly' | 'readwrite';

const DB_NAME = 'ImageDatabase';
const DB_VERSION = 1;

/**
 * Opens a connection to the IndexedDB database.
 * If the database does not exist or needs upgrading, `onupgradeneeded` is triggered.
 * @param version - Optional version override, default is DB_VERSION (1).
 * @returns Promise that resolves with the IDBDatabase instance.
 */

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

/**
 * Generic utility function to perform an operation on a given object store.
 * @param storeName - The name of the object store.
 * @param mode - 'readonly' or 'readwrite' mode.
 * @param callback - A function that receives the object store and returns an IDBRequest.
 * @returns Promise that resolves with the result of the operation.
 */
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

/**
 * Saves a Blob (typically an image) to the 'images' object store with the key 'bgImage'.
 * @param imageBlob - The image blob to store.
 */
export const saveImageToDB = async (imageBlob: Blob): Promise<void> => {
  await performDBOperation('images', 'readwrite', (store) => {
    return store.put(imageBlob, 'bgImage');
  });
};

/**
 * Retrieves the image Blob stored with the key 'bgImage' from the 'images' store.
 * @returns The stored Blob if found, or null.
 */
export const getImageFromDB = async (): Promise<Blob | null> => {
  return performDBOperation<Blob | undefined>('images', 'readonly', (store) => {
    return store.get('bgImage');
  })
    .then((result) => result ?? null)
    .catch(() => null);
};

/**
 * Inserts or updates a value in any object store by key.
 * @param storeName - The target object store name.
 * @param data - The data to insert.
 * @param key - The key to associate with the data.
 */
export const insertData = async <T>(
  storeName: string,
  data: T,
  key: IDBValidKey
): Promise<void> => {
  await performDBOperation(storeName, 'readwrite', (store) => {
    return store.put(data, key);
  });
};

/**
 * Creates a new object store (table) in the database with a specified keyPath.
 * This function increases the DB version, which triggers `onupgradeneeded`.
 * @param tableName - The name of the new object store.
 * @param keyPath - The primary key field(s) for the object store (defaults to 'id').
 */
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

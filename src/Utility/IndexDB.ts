export const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ImageDatabase', 1);
  
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
  
  export const saveImageToDB = async (imageBlob: Blob): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('images', 'readwrite');
      const store = transaction.objectStore('images');
      const request = store.put(imageBlob, 'bgImage');
  
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };
  
  export const getImageFromDB = async (): Promise<Blob | null> => {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction('images', 'readonly');
      const store = transaction.objectStore('images');
      const request = store.get('bgImage');
  
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  };
  
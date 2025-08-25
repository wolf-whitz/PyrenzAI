import localforage from 'localforage';

localforage.config({
  name: 'ImageDatabase',
  storeName: 'images',
});

export const saveImageToDB = async (imageBlob: Blob): Promise<void> => {
  await localforage.setItem('bgImage', imageBlob);
};

export const getImageFromDB = async (): Promise<Blob | null> => {
  try {
    const result = await localforage.getItem<Blob>('bgImage');
    return result ?? null;
  } catch {
    return null;
  }
};

export const insertData = async <T>(
  storeName: string,
  data: T,
  key: IDBValidKey
): Promise<void> => {
  const customStore = localforage.createInstance({
    name: 'ImageDatabase',
    storeName: storeName,
  });
  await customStore.setItem(String(key), data);
};

export const createTable = async (tableName: string): Promise<void> => {
  localforage.createInstance({
    name: 'ImageDatabase',
    storeName: tableName,
  });
};

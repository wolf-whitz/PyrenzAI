import localforage from 'localforage';

localforage.config({
  name: 'ImageDatabase',
  storeName: 'images',
});

export const saveImageToDB = async (imageBlob) => {
  await localforage.setItem('bgImage', imageBlob);
};

export const getImageFromDB = async () => {
  try {
    const result = await localforage.getItem('bgImage');
    return result ?? null;
  } catch {
    return null;
  }
};

export const insertData = async (storeName, data, key) => {
  const customStore = localforage.createInstance({
    name: 'ImageDatabase',
    storeName: storeName,
  });
  await customStore.setItem(String(key), data);
};

export const createTable = async (tableName) => {
  localforage.createInstance({
    name: 'ImageDatabase',
    storeName: tableName,
  });
};

export const createDatabase = async (dbName) => {
  localforage.createInstance({
    name: dbName,
  });
};


import { FileItem, FileType } from '../types';

const DB_NAME = 'FilesPixelProDB';
const STORE_NAME = 'files';

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2); // Version bump for blob storage
    request.onupgradeneeded = () => {
      const db = request.result;
      if (db.objectStoreNames.contains(STORE_NAME)) {
        db.deleteObjectStore(STORE_NAME);
      }
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveFile = async (file: File, category: string): Promise<FileItem> => {
  const db = await initDB();
  const id = crypto.randomUUID();
  
  let type: FileType = 'document';
  if (file.type.startsWith('image/')) type = 'image';
  else if (file.type.startsWith('video/')) type = 'video';
  else if (file.type.startsWith('audio/')) type = 'audio';
  else if (file.name.endsWith('.apk')) type = 'app';

  const fileItem = {
    id,
    name: file.name,
    type,
    size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
    modified: new Date().toLocaleDateString(),
    path: `/${category}/${file.name}`,
    blob: file // Stockage du fichier réel dans IndexedDB
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.add(fileItem);
    transaction.oncomplete = () => resolve(fileItem as unknown as FileItem);
    transaction.onerror = () => reject(transaction.error);
  });
};

export const getAllFiles = async (): Promise<FileItem[]> => {
  const db = await initDB();
  return new Promise((resolve) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
  });
};

export const deleteFile = async (id: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(id);
    transaction.oncomplete = () => resolve();
  });
};

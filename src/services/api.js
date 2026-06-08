import { openDB } from 'idb';

const DB_NAME = 'ShopManagementDB';
const DB_VERSION = 1;

const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('files')) {
        db.createObjectStore('files', { keyPath: 'fileNumber' });
      }
    },
  });
};

const api = {
  async saveItems(data) {
    const db = await initDB();
    const fileData = {
      ...data,
      fileName: `f${data.fileNumber}`,
      totalItems: data.items.length,
      totalValue: data.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0),
      createdDate: new Date().toISOString(),
    };
    await db.put('files', fileData);
    return { success: true, message: `File f${data.fileNumber} saved`, fileName: `f${data.fileNumber}.json` };
  },

  async loadFile(fileNumber) {
    const db = await initDB();
    const data = await db.get('files', parseInt(fileNumber));
    if (!data) throw new Error('File not found');
    return data;
  },

  async getFilesList() {
    const db = await initDB();
    const allFiles = await db.getAll('files');
    
    // Sort newest first
    return allFiles
      .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
      .map(file => ({
        fileName: file.fileName,
        fileNumber: file.fileNumber,
        totalItems: file.totalItems,
        totalValue: file.totalValue,
        createdDate: file.createdDate,
      }));
  },

  async exportBackup(data) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `backup_${timestamp}.json`;
    
    const backupData = {
      exportedAt: new Date().toISOString(),
      currentFileIndex: data.currentFileIndex,
      fileItemsCount: data.fileItemsCount,
      items: data.items,
    };

    // Create a blob and trigger download
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = backupFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return { success: true, fileName: backupFileName };
  },

  async importBackup(data) {
    if (!data || !Array.isArray(data.items)) {
      throw new Error('Invalid backup data');
    }

    const fileNumber = data.currentFileIndex || 1;
    const db = await initDB();
    
    const fileData = {
      fileNumber,
      fileName: `f${fileNumber}`,
      totalItems: data.items.length,
      totalValue: data.items.reduce((sum, i) => sum + (i.totalPrice || 0), 0),
      createdDate: new Date().toISOString(),
      items: data.items,
    };

    await db.put('files', fileData);

    return {
      success: true,
      message: 'Backup imported successfully',
      currentFileIndex: data.currentFileIndex,
      fileItemsCount: data.fileItemsCount,
      items: data.items,
    };
  },
};

export default api;
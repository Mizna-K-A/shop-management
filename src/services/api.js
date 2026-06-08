const API_BASE_URL = 'http://localhost:5000/api';

const api = {
  async saveItems(data) {
    const response = await fetch(`${API_BASE_URL}/save-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async loadFile(fileNumber) {
    const response = await fetch(`${API_BASE_URL}/load-file/${fileNumber}`);
    return response.json();
  },

  async getFilesList() {
    const response = await fetch(`${API_BASE_URL}/files-list`);
    return response.json();
  },

  async exportBackup(data) {
    const response = await fetch(`${API_BASE_URL}/export-backup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async importBackup(data) {
    const response = await fetch(`${API_BASE_URL}/import-backup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ backupData: data }),
    });
    return response.json();
  },
};

export default api;
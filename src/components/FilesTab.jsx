import React, { useState, useEffect } from 'react';
import api from '../services/api.js';

const FilesTab = ({ currentFileIndex, fileItemsCount, onManualSave, onReset, items }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [backupFile, setBackupFile] = useState(null);

  useEffect(() => {
    loadFilesList();
  }, []);

  const loadFilesList = async () => {
    setLoading(true);
    try {
      const filesList = await api.getFilesList();
      setFiles(filesList);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFile = async (fileNumber) => {
    setLoading(true);
    try {
      const data = await api.loadFile(fileNumber);
      setSelectedFile(data);
    } catch (error) {
      alert('Error loading file');
    } finally {
      setLoading(false);
    }
  };

  const handleExportBackup = async () => {
    try {
      const result = await api.exportBackup({
        items,
        currentFileIndex,
        fileItemsCount
      });
      alert(`Backup created: ${result.fileName}`);
    } catch (error) {
      alert('Error creating backup');
    }
  };

  const handleImportBackup = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const result = await api.importBackup(data);
        alert('Backup imported successfully');
        window.location.reload();
      } catch (error) {
        alert('Error importing backup');
      }
    };
    reader.readAsText(file);
  };

  const itemsRemaining = 100 - fileItemsCount;
  const progress = (fileItemsCount / 100) * 100;

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">File Management</h2>
        
        {/* Current File Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Current File Status</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-blue-600 mb-1">Current File</div>
              <div className="text-2xl font-bold text-blue-800">f{currentFileIndex}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-green-600 mb-1">Items in File</div>
              <div className="text-2xl font-bold text-green-800">{fileItemsCount}/100</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-sm text-orange-600 mb-1">Items Until Next File</div>
              <div className="text-2xl font-bold text-orange-800">{itemsRemaining}</div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-green-500 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onManualSave}
              disabled={items.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              💾 Save Current File
            </button>
            <button
              onClick={onReset}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              🗑️ Reset All Items
            </button>
          </div>
        </div>
        
        {/* Backup and Restore */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Backup & Restore</h3>
          <div className="flex gap-3">
            <button
              onClick={handleExportBackup}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              💾 Export Backup
            </button>
            <label className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer">
              📂 Import Backup
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>
        </div>
        
        {/* Saved Files */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Saved Files</h3>
          
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : files.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No saved files found</div>
          ) : (
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.fileName} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gray-800">{file.fileName}</div>
                      <div className="text-sm text-gray-500">
                        {file.totalItems} items • ₹{file.totalValue.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(file.createdDate).toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => loadFile(file.fileNumber)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* File Preview Modal */}
        {selectedFile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{selectedFile.fileName}</h3>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <div>Total Items: {selectedFile.totalItems}</div>
                <div>Total Value: ₹{selectedFile.totalValue.toFixed(2)}</div>
                <div>Created: {new Date(selectedFile.createdDate).toLocaleString()}</div>
              </div>
              
              <div className="space-y-2">
                {selectedFile.items.map((item, idx) => (
                  <div key={idx} className="border-b py-2">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-600">
                      {item.pieces} pcs × ₹{item.price.toFixed(2)} = ₹{item.totalPrice.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400">{item.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilesTab;
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
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-6 md:mb-8 tracking-tight">File Management</h2>
        
        {/* Current File Status */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 md:p-8 mb-8 border border-slate-100">
          <h3 className="text-xl font-extrabold text-slate-800 mb-6 tracking-tight">Current File Status</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
              <div className="text-xs font-bold text-indigo-600 mb-1 uppercase tracking-wider">Current File</div>
              <div className="text-3xl font-black text-indigo-900">f{currentFileIndex}</div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
              <div className="text-xs font-bold text-emerald-600 mb-1 uppercase tracking-wider">Items in File</div>
              <div className="text-3xl font-black text-emerald-900">{fileItemsCount}/100</div>
            </div>
            <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
              <div className="text-xs font-bold text-amber-600 mb-1 uppercase tracking-wider">Items Until Next File</div>
              <div className="text-3xl font-black text-amber-900">{itemsRemaining}</div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button
              onClick={onManualSave}
              disabled={items.length === 0}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              💾 Save Current File
            </button>
            <button
              onClick={onReset}
              className="w-full sm:w-auto px-6 py-3 bg-white border-2 border-rose-100 text-rose-600 rounded-xl hover:bg-rose-50 hover:border-rose-200 transition-all font-bold"
            >
              🗑️ Reset All Items
            </button>
          </div>
        </div>
        
        {/* Backup and Restore */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 md:p-8 mb-8 border border-slate-100">
          <h3 className="text-xl font-extrabold text-slate-800 mb-6 tracking-tight">Backup & Restore</h3>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button
              onClick={handleExportBackup}
              className="w-full sm:w-auto text-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-200 hover:-translate-y-0.5 transition-all duration-200 font-bold"
            >
              💾 Export Backup
            </button>
            <label className="w-full sm:w-auto text-center px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-bold cursor-pointer inline-block">
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
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 md:p-8 border border-slate-100">
          <h3 className="text-xl font-extrabold text-slate-800 mb-6 tracking-tight">Saved Files</h3>
          
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : files.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No saved files found</div>
          ) : (
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.fileName} className="border border-slate-100 rounded-xl p-5 hover:bg-indigo-50/30 hover:border-indigo-100 transition-all group">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{file.fileName}</div>
                      <div className="text-sm font-medium text-slate-500 mt-1">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs mr-2">{file.totalItems} items</span>
                        ₹{file.totalValue.toFixed(2)}
                      </div>
                      <div className="text-xs font-semibold text-slate-400 mt-2 uppercase tracking-wider">
                        {new Date(file.createdDate).toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => loadFile(file.fileNumber)}
                      className="w-full sm:w-auto px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-indigo-600 hover:text-white transition-colors"
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